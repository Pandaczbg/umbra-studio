import { normalizeSearch } from "../search/normalize.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { localizedHref, routes, localeFor } from "../site/routes.ts";
import { selectLatest } from "../content/publication.ts";
import { projectArtwork } from "../media/presentation.ts";
import { validateUmbraContent } from "../content/validation.ts";
import { projects } from "../../data/projects.ts";
import { characters } from "../../data/characters.ts";
import { episodes } from "../../data/episodes.ts";
import {
  getProjectsHref,
  getCharactersHref,
  getEpisodeHref,
  getStoryHref,
} from "../navigation/index.ts";

test("all section routes have a reversible SR/EN mapping", () => {
  for (const section of Object.keys(routes.sr)) {
    assert.equal(localizedHref(routes.sr[section], "en"), routes.en[section]);
    assert.equal(localizedHref(routes.en[section], "sr"), routes.sr[section]);
  }
  assert.equal(localeFor("/english"), "sr");
  assert.equal(localeFor("/en/characters/ana"), "en");
});

test("language switch preserves slug, query, fragment and query encoding", () => {
  const href = "/pretraga?q=Gvozden&type=character#results";
  assert.equal(
    localizedHref(href, "en"),
    "/en/search?q=Gvozden&type=character#results",
  );
  assert.equal(
    localizedHref("/en/projects/mrzim-svog-brata?type=series#source", "sr"),
    "/serije/mrzim-svog-brata?type=series#source",
  );
  assert.equal(
    localizedHref("/likovi/ana?q=%C4%8D", "en"),
    "/en/characters/ana?q=%C4%8D",
  );
  assert.equal(localizedHref("/#o-studiju", "en"), "/en#o-studiju");
});

test("public helpers link to implemented section and episode anchors", () => {
  assert.equal(getProjectsHref("sr"), "/serije");
  assert.equal(getCharactersHref("sr"), "/likovi");
  assert.equal(
    getEpisodeHref("book", "episode-01", "en"),
    "/en/projects/book#episode-episode-01",
  );
  assert.equal(
    getStoryHref("book", "story-01", "sr"),
    "/serije/book#story-story-01",
  );
});

test("latest feed excludes undated, invalid, future, nonpublic and planned records", () => {
  const base = projects[0];
  const now = Date.parse("2026-09-14T12:00:00Z");
  const candidates = [
    { ...base, id: "undated" },
    { ...base, id: "invalid", publishedAt: "no-date" },
    { ...base, id: "future", publishedAt: "2030-01-01T00:00:00Z" },
    {
      ...base,
      id: "private",
      visibility: "private",
      publishedAt: "2026-09-12T00:00:00Z",
    },
    {
      ...episodes[0],
      id: "planned",
      status: "planned",
      publishedAt: "2026-09-12T00:00:00Z",
    },
    { ...base, id: "published", publishedAt: "2026-09-12T00:00:00Z" },
  ];
  assert.deepEqual(
    selectLatest(candidates, 12, now).map((x) => x.id),
    ["published"],
  );
});

test("latest sorting is chronological, deterministic and does not mutate its input", () => {
  const base = projects[0];
  const items = [
    { ...base, id: "older", publishedAt: "2020-01-01T00:00:00Z" },
    { ...base, id: "new-z", order: 2, publishedAt: "2021-01-01T00:00:00Z" },
    { ...base, id: "new-a", order: 1, publishedAt: "2021-01-01T00:00:00Z" },
  ];
  const before = structuredClone(items);
  assert.deepEqual(
    selectLatest(items, 2).map((x) => x.id),
    ["new-a", "new-z"],
  );
  assert.deepEqual(items, before);
  assert.equal(selectLatest(items, NaN).length, 2);
  assert.equal(selectLatest(items, 0).length, 1);
});

test("source content passes the existing complete graph validator", () => {
  assert.doesNotThrow(() =>
    validateUmbraContent({
      projects,
      characters,
      episodes,
      stories: [],
      media: [],
      relationships: [],
      timelines: [],
      archive: [],
    }),
  );
});

test("project artwork chooses explicit art before book covers; books retain identity", () => {
  assert.equal(
    projectArtwork({ ...projects[0], cover: "/approved-art.jpg" }, "en").src,
    "/approved-art.jpg",
  );
  assert.equal(
    projectArtwork(
      projects.find((x) => x.slug === "biblija"),
      "sr",
    ).src,
    "/images/biblija.webp",
  );
  assert.equal(projectArtwork(projects[0], "sr").isBook, true);
  assert.equal(projectArtwork(projects[0], "en").src, "/images/novel-en.webp");
});

test("all project artwork and supplied downloads resolve to real local files", () => {
  for (const project of projects) {
    const paths = [
      projectArtwork(project, "sr").src,
      projectArtwork(project, "en").src,
      project.source?.pdfSr,
      project.source?.pdfEn,
    ].filter(Boolean);
    for (const path of paths)
      assert.ok(
        existsSync(
          fileURLToPath(new URL(`../../public${path}`, import.meta.url)),
        ),
        path,
      );
  }
});

test("search treats Serbian diacritics and dj consistently", () => {
  assert.equal(normalizeSearch(" Đorđe Čović "), "djordje covic");
  assert.equal(normalizeSearch("ŠĆŽčć"), "sczcc");
});
