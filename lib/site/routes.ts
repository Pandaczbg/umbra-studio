export type Locale = "sr" | "en";
export type Section =
  | "home"
  | "projects"
  | "characters"
  | "latest"
  | "archive"
  | "search";

export const routes: Record<Locale, Record<Section, string>> = {
  sr: {
    home: "/",
    projects: "/serije",
    characters: "/likovi",
    latest: "/aktuelno",
    archive: "/arhiva",
    search: "/pretraga",
  },
  en: {
    home: "/en",
    projects: "/en/projects",
    characters: "/en/characters",
    latest: "/en/latest",
    archive: "/en/archive",
    search: "/en/search",
  },
};

export function localeFor(path: string): Locale {
  return path === "/en" || path.startsWith("/en/") ? "en" : "sr";
}

/** Map only the locale and section. Slugs, query values and fragment survive. */
export function localizedHref(href: string, target: Locale): string {
  const url = new URL(href, "https://umbra.invalid");
  const source = localeFor(url.pathname);
  const sections = Object.keys(routes[source]) as Section[];
  const section = sections
    .filter((key) => key !== "home")
    .find(
      (key) =>
        url.pathname === routes[source][key] ||
        url.pathname.startsWith(`${routes[source][key]}/`),
    );
  let path = routes[target].home;
  if (section)
    path =
      routes[target][section] +
      url.pathname.slice(routes[source][section].length);
  else if (url.pathname !== routes[source].home) {
    const suffix = source === "en" ? url.pathname.slice(3) : url.pathname;
    path = (target === "en" ? "/en" : "") + suffix;
  }
  return path + url.search + url.hash;
}
