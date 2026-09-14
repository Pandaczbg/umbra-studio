import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { projects } from "../../data/projects.ts";
import { characters } from "../../data/characters.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
const port = Number(process.env.V8_TEST_PORT ?? 3218);
const origin = `http://127.0.0.1:${port}`;
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
);
let serverLog = "";
child.stdout.on("data", (data) => {
  serverLog += data;
});
child.stderr.on("data", (data) => {
  serverLog += data;
});
const report = {
  node: process.version,
  checks: [],
  issues: [],
  browser:
    "This HTTP script does not execute JavaScript or measure layout. See the V9 release PROVERA.txt for separate browser QA results.",
};
const pages = new Map();
function assert(condition, message) {
  if (!condition) report.issues.push(message);
}
function visible(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

try {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch(origin);
      if (response.ok) break;
    } catch {}
    if (attempt === 49) throw new Error("Server failed to start");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const paths = [
    "/",
    "/en",
    "/serije",
    "/en/projects",
    "/likovi",
    "/en/characters",
    "/aktuelno",
    "/en/latest",
    "/arhiva",
    "/en/archive",
    "/pretraga",
    "/en/search",
    ...projects
      .filter((p) => p.visibility === "public")
      .flatMap((p) => [`/serije/${p.slug}`, `/en/projects/${p.slug}`]),
    ...characters
      .filter((c) => c.visibility === "public" && c.profileAvailable)
      .flatMap((c) => [`/likovi/${c.slug}`, `/en/characters/${c.slug}`]),
  ];
  for (const path of paths) {
    const response = await fetch(origin + path);
    const html = await response.text();
    const dom = visible(html);
    pages.set(path, dom);
    const locale = path === "/en" || path.startsWith("/en/") ? "en" : "sr";
    assert(response.status === 200, `${path}: status ${response.status}`);
    assert(
      new RegExp(`<html[^>]*lang="${locale}"`).test(dom),
      `${path}: wrong server HTML language`,
    );
    assert(
      (dom.match(/<h1\b/g) ?? []).length === 1,
      `${path}: expected one H1`,
    );
    assert(
      (dom.match(/<main\b/g) ?? []).length === 1,
      `${path}: expected one main landmark`,
    );
    assert(dom.includes('id="main-content"'), `${path}: missing skip target`);
    assert(
      (dom.match(/rel="canonical"/g) ?? []).length === 1,
      `${path}: expected one canonical`,
    );
    assert(
      dom.includes('hrefLang="sr"') && dom.includes('hrefLang="en"'),
      `${path}: missing reciprocal language alternates`,
    );
    assert(
      response.headers.get("x-content-type-options") === "nosniff",
      `${path}: missing MIME protection`,
    );
    const imageTags = dom.match(/<img\b[^>]*>/g) ?? [];
    assert(
      imageTags.every((tag) => /\balt=/.test(tag)),
      `${path}: image without alt`,
    );
    report.checks.push({
      path,
      status: response.status,
      language: locale,
      htmlBytes: Buffer.byteLength(html),
    });
  }
  // Real server result URLs must all resolve, including episode fragments.
  for (const path of [
    "/pretraga?q=Gvozden",
    "/en/search?q=Gvozden",
    "/pretraga?q=epizoda",
    "/en/search?q=episode",
    "/likovi?project=project-02",
    "/en/characters?role=SUPPORTING",
    "/serije?type=adaptation",
    "/en/projects?type=original",
    "/pretraga?q=zzzz-no-match",
    "/en/search?q=zzzz-no-match",
  ]) {
    const response = await fetch(origin + path);
    const html = visible(await response.text());
    assert(response.status === 200, `${path}: response ${response.status}`);
    const expected = path.includes("zzzz")
      ? path.startsWith("/en/")
        ? "No results"
        : "Nema rezultata"
      : path.includes("Gvozden")
        ? "Gvozden"
        : path.includes("project-02")
          ? "Josif"
          : null;
    if (expected)
      assert(html.includes(expected), `${path}: expected result text`);
    pages.set(path, html);
    report.checks.push({ path, status: response.status });
  }
  for (const path of [
    "/nepostoji-v8",
    "/en/not-a-page-v8",
    "/likovi/nepostoji-v8",
    "/en/projects/not-a-project-v8",
    "/arhiva/nepostoji-v8",
  ]) {
    const response = await fetch(origin + path);
    const html = visible(await response.text());
    assert(
      response.status === 404 ||
        (response.status === 200 && html.includes("noindex")),
      `${path}: invalid missing-page response`,
    );
    assert(html.includes("noindex"), `${path}: missing noindex`);
    report.checks.push({
      path,
      status: response.status,
      noindex: html.includes("noindex"),
    });
  }
  const references = new Set();
  for (const [path, html] of pages) {
    for (const match of html.matchAll(
      /<(?:a|img|script|link)\b[^>]*(?:href|src)="([^"]+)"[^>]*>/g,
    )) {
      const target = match[1].replaceAll("&amp;", "&");
      if (!target.startsWith("/") && !target.startsWith("#")) continue;
      const url = new URL(target, origin + path);
      references.add(url.pathname + url.search + url.hash);
    }
  }
  for (const reference of references) {
    const url = new URL(reference, origin);
    const path = url.pathname + url.search;
    let dom = pages.get(path);
    if (!dom) {
      const response = await fetch(origin + path);
      assert(
        response.status === 200,
        `Broken local asset/link: ${reference} (${response.status})`,
      );
      if ((response.headers.get("content-type") ?? "").includes("text/html"))
        dom = visible(await response.text());
      else await response.arrayBuffer();
    }
    if (url.hash && dom)
      assert(
        dom.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `Missing anchor: ${reference}`,
      );
  }
  for (const file of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest"]) {
    const response = await fetch(origin + file);
    const text = await response.text();
    assert(response.ok, `${file}: ${response.status}`);
    if (file === "/sitemap.xml") {
      assert(!text.includes("localhost"), "Sitemap points to localhost");
      assert(
        !text.includes("/pretraga") && !text.includes("/en/search"),
        "Search indexed in sitemap",
      );
    }
    report.checks.push({ path: file, status: response.status });
  }
  const spoof = await fetch(origin + "/en", {
    headers: { "x-umbra-locale": "sr" },
  });
  assert(
    (await spoof.text()).includes('lang="en"'),
    "Incoming locale header overrides URL",
  );
  report.internalReferences = references.size;
  report.sourcePackage = JSON.parse(
    await readFile(new URL("../../package.json", import.meta.url), "utf8"),
  ).version;
} catch (error) {
  report.issues.push(String(error));
} finally {
  child.kill("SIGTERM");
  await mkdir(new URL("./results/", import.meta.url), { recursive: true });
  await writeFile(
    new URL("./results/http-report.json", import.meta.url),
    JSON.stringify(report, null, 2) + "\n",
  );
  await writeFile(
    new URL("./results/server.log", import.meta.url),
    serverLog,
  );
  console.log(
    JSON.stringify(
      {
        checks: report.checks.length,
        internalReferences: report.internalReferences,
        issues: report.issues,
      },
      null,
      2,
    ),
  );
  process.exitCode = report.issues.length ? 1 : 0;
}
