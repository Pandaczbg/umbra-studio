"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  characters,
  type Character,
  type CharacterCategory,
  type CharacterGender,
} from "@/data/characters";
import { projects } from "@/data/projects";
import { getCharacterHref } from "@/lib/characterNavigation";

type Locale = "sr" | "en";
type ProjectFilter = "all" | string;
type CategoryFilter = "all" | CharacterCategory;
type GenderFilter =
  | "all"
  | Exclude<CharacterGender, null>;
type ViewMode = "grid" | "list";

type CharactersArchiveProps = {
  locale: Locale;
};

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const EASE = [0.22, 1, 0.36, 1] as const;

const PROJECT_OPTIONS = projects.map((project) => ({
  slug: project.slug,
  title: project.title,
}));

const PROJECT_TITLE_BY_SLUG = new Map(
  PROJECT_OPTIONS.map((project) => [
    project.slug,
    project.title,
  ]),
);

const COPY = {
  sr: {
    eyebrow: "03 / ARHIVA LIKOVA",
    titleA: "Ljudi",
    titleB: "koji ostaju",
    description:
      "Neki ljudi uđu u priču. Neki je promene zauvek. Ovde počinju njihovi dosijei.",
    registered: "registrovanih likova",
    searchPlaceholder:
      "Pretraži po imenu, projektu ili opisu...",
    searchLabel: "Pretraga likova",
    filters: "Filteri",
    project: "Projekat",
    role: "Uloga",
    gender: "Pol",
    allProjects: "Svi projekti",
    allRoles: "Sve uloge",
    allGenders: "Svi",
    main: "Glavni",
    supporting: "Sporedni",
    male: "Muški",
    female: "Ženski",
    reset: "Resetuj",
    results: "Rezultati",
    allCharacters: "Svi registrovani likovi",
    grid: "Mreža",
    list: "Lista",
    noResults:
      "Nema likova koji odgovaraju ovoj selekciji.",
    clearFilters: "Očisti filtere",
    clearSearch: "Obriši pretragu",
    dossier: "Otvori dosije",
    previousWorld: "Nazad na početnu",
    archiveNote:
      "Arhiva raste zajedno sa pričama. Svaki dosije otvara širi svet lika.",
    openArchive: "Arhiva likova",
    closeFilters: "Zatvori filtere",
    activeFilters: "Aktivni filteri",
    viewMode: "Prikaz",
    count: "Prikazano",
  },

  en: {
    eyebrow: "03 / CHARACTER ARCHIVE",
    titleA: "People",
    titleB: "who remain",
    description:
      "Some people enter a story. Some change it forever. Their dossiers begin here.",
    registered: "registered characters",
    searchPlaceholder:
      "Search by name, project or description...",
    searchLabel: "Character search",
    filters: "Filters",
    project: "Project",
    role: "Role",
    gender: "Gender",
    allProjects: "All projects",
    allRoles: "All roles",
    allGenders: "All",
    main: "Main",
    supporting: "Supporting",
    male: "Male",
    female: "Female",
    reset: "Reset",
    results: "Results",
    allCharacters: "All registered characters",
    grid: "Grid",
    list: "List",
    noResults:
      "No characters match this selection.",
    clearFilters: "Clear filters",
    clearSearch: "Clear search",
    dossier: "Open dossier",
    previousWorld: "Back to home",
    archiveNote:
      "The archive grows with the stories. Every dossier opens a wider world around the character.",
    openArchive: "Character archive",
    closeFilters: "Close filters",
    activeFilters: "Active filters",
    viewMode: "View",
    count: "Showing",
  },
} as const;

type ArchiveCopy = (typeof COPY)[Locale];

function getRoleLabel(
  category: CharacterCategory,
  locale: Locale,
) {
  if (category === "MAIN") {
    return locale === "en" ? "Main" : "Glavni";
  }

  return locale === "en"
    ? "Supporting"
    : "Sporedni";
}

function normalizeSearch(value: string) {
  return value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function getCanonicalProjectTitle(
  character: Character,
) {
  return (
    PROJECT_TITLE_BY_SLUG.get(
      character.projectSlug,
    ) ?? character.projectTitle
  );
}

function getProjectFilter(
  searchParams: URLSearchParams,
): ProjectFilter {
  const project =
    searchParams.get("project") ?? "all";

  if (
    project === "all" ||
    PROJECT_OPTIONS.some(
      (item) => item.slug === project,
    )
  ) {
    return project;
  }

  return "all";
}

function getCategoryFilter(
  searchParams: URLSearchParams,
): CategoryFilter {
  const role = searchParams.get("role");

  return role === "MAIN" ||
    role === "SUPPORTING"
    ? role
    : "all";
}

function getGenderFilter(
  searchParams: URLSearchParams,
): GenderFilter {
  const gender = searchParams.get("gender");

  return gender === "MALE" ||
    gender === "FEMALE"
    ? gender
    : "all";
}

function getViewMode(
  searchParams: URLSearchParams,
): ViewMode {
  return searchParams.get("view") === "list"
    ? "list"
    : "grid";
}

export default function CharactersArchive({
  locale,
}: CharactersArchiveProps) {
  const copy = COPY[locale];
  const reducedMotion =
    useReducedMotion() ?? false;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query =
    searchParams.get("q") ?? "";

  const projectFilter =
    getProjectFilter(searchParams);

  const categoryFilter =
    getCategoryFilter(searchParams);

  const genderFilter =
    getGenderFilter(searchParams);

  const viewMode =
    getViewMode(searchParams);

  const [
    mobileFiltersOpen,
    setMobileFiltersOpen,
  ] = useState(false);

  const updateUrl = ({
    q = query,
    project = projectFilter,
    role = categoryFilter,
    gender = genderFilter,
    view = viewMode,
  }: {
    q?: string;
    project?: string;
    role?: string;
    gender?: string;
    view?: ViewMode;
  }) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.delete("q");
    params.delete("project");
    params.delete("role");
    params.delete("gender");
    params.delete("view");

    if (q.trim()) {
      params.set("q", q.trim());
    }

    if (project !== "all") {
      params.set("project", project);
    }

    if (role !== "all") {
      params.set("role", role);
    }

    if (gender !== "all") {
      params.set("gender", gender);
    }

    if (view !== "grid") {
      params.set("view", view);
    }

    const queryString = params.toString();

    const safePathname =
      pathname ??
      (locale === "en"
        ? "/en/characters"
        : "/likovi");

    router.replace(
      queryString
        ? `${safePathname}?${queryString}`
        : safePathname,
      { scroll: false },
    );
  };

  const filteredCharacters = useMemo(() => {
    const normalizedQuery =
      normalizeSearch(query);

    return characters.filter((character) => {
      if (
        projectFilter !== "all" &&
        character.projectSlug !== projectFilter
      ) {
        return false;
      }

      if (
        categoryFilter !== "all" &&
        character.category !== categoryFilter
      ) {
        return false;
      }

      if (
        genderFilter !== "all" &&
        character.gender !== genderFilter
      ) {
        return false;
      }

      if (normalizedQuery) {
        const haystack = normalizeSearch(
          [
            character.name,
            getCanonicalProjectTitle(
              character,
            ),
            character.shortDescription,
          ]
            .filter(Boolean)
            .join(" "),
        );

        if (
          !haystack.includes(
            normalizedQuery,
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    categoryFilter,
    genderFilter,
    projectFilter,
    query,
  ]);

  const activeFilterCount =
    Number(Boolean(query.trim())) +
    Number(projectFilter !== "all") +
    Number(categoryFilter !== "all") +
    Number(genderFilter !== "all");

  const hasFilters =
    activeFilterCount > 0;

  const clearAll = () => {
    updateUrl({
      q: "",
      project: "all",
      role: "all",
      gender: "all",
      view: viewMode,
    });
  };

  const clearSearch = () => {
    updateUrl({
      q: "",
      project: projectFilter,
      role: categoryFilter,
      gender: genderFilter,
      view: viewMode,
    });
  };

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    updateUrl({
      q: event.target.value,
      project: projectFilter,
      role: categoryFilter,
      gender: genderFilter,
      view: viewMode,
    });
  };

  const setProject = (value: string) => {
    updateUrl({
      project: value,
      role: categoryFilter,
      gender: genderFilter,
      view: viewMode,
    });
  };

  const setCategory = (
    value: CategoryFilter,
  ) => {
    updateUrl({
      project: projectFilter,
      role: value,
      gender: genderFilter,
      view: viewMode,
    });
  };

  const setGender = (
    value: GenderFilter,
  ) => {
    updateUrl({
      project: projectFilter,
      role: categoryFilter,
      gender: value,
      view: viewMode,
    });
  };

  const setView = (mode: ViewMode) => {
    updateUrl({
      project: projectFilter,
      role: categoryFilter,
      gender: genderFilter,
      view: mode,
    });
  };

  return (
    <main
      data-umbra-scene="characters-archive"
      className="min-h-screen overflow-hidden bg-[#030303] text-[#f4f0e8]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_10%,rgba(199,169,107,.055),transparent_32%),linear-gradient(180deg,#030303_0%,#050505_54%,#030303_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.014] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:150px_150px]"
      />

      <div className="relative z-10 mx-auto max-w-[1540px] px-6 pb-24 pt-28 sm:px-10 sm:pb-32 lg:px-16 lg:pt-36">
        <motion.header
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 22,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.7,
            ease: EASE,
          }}
          className="relative overflow-hidden border-b border-white/[0.07] pb-14 lg:pb-18"
        >
          <div
            aria-hidden="true"
            className="absolute -right-20 top-0 hidden h-[420px] w-[420px] rounded-full border border-white/[0.025] xl:block"
          />

          <div
            aria-hidden="true"
            className="absolute -right-8 top-12 hidden h-[300px] w-[300px] rounded-full border border-[#c7a96b]/[0.055] xl:block"
          />

          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end lg:gap-20">
            <div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-12"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${GOLD})`,
                  }}
                />

                <span
                  className="font-mono text-[8px] uppercase tracking-[0.38em]"
                  style={{
                    color: `${GOLD_LIGHT}b8`,
                  }}
                >
                  {copy.eyebrow}
                </span>
              </div>

              <h1 className="mt-7 max-w-[1100px] text-[clamp(4rem,9vw,9.5rem)] font-[430] uppercase leading-[0.78] tracking-[-0.082em]">
                <span className="block">
                  {copy.titleA}
                </span>

                <span className="block font-serif font-normal italic text-white/[0.56]">
                  {copy.titleB}
                </span>
              </h1>

              <p className="mt-9 max-w-[680px] text-[14px] leading-7 text-white/[0.42] sm:text-[15px] sm:leading-8">
                {copy.description}
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between border-b border-white/[0.065] pb-3">
                <span className="font-mono text-[7px] uppercase tracking-[0.28em] text-white/[0.25]">
                  {copy.openArchive}
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-8"
                  style={{
                    background: `${GOLD}35`,
                  }}
                />
              </div>

              <div className="mt-6 flex items-end gap-4">
                <span
                  className="font-mono text-[64px] leading-none tracking-[-0.07em]"
                  style={{
                    color: `${GOLD_LIGHT}76`,
                  }}
                >
                  {String(
                    characters.length,
                  ).padStart(2, "0")}
                </span>

                <span className="max-w-[170px] pb-1 text-[7px] uppercase leading-4 tracking-[0.24em] text-white/[0.2]">
                  {copy.registered}
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        <section
          aria-labelledby="character-search-heading"
          className="mt-12"
        >
          <h2
            id="character-search-heading"
            className="sr-only"
          >
            {copy.searchLabel}
          </h2>

          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
            className="relative"
          >
            <label
              htmlFor="character-archive-search"
              className="sr-only"
            >
              {copy.searchLabel}
            </label>

            <div className="group flex min-h-[68px] items-center border-y border-white/[0.075] bg-white/[0.012] transition-colors duration-300 focus-within:border-[#c7a96b]/35">
              <Search
                aria-hidden="true"
                size={18}
                strokeWidth={1.05}
                className="ml-1 text-white/[0.25] sm:ml-2"
              />

              <input
                id="character-archive-search"
                type="search"
                value={query}
                onChange={handleSearchChange}
                placeholder={copy.searchPlaceholder}
                inputMode="search"
                enterKeyHint="search"
                className="min-w-0 flex-1 bg-transparent px-4 py-5 text-sm text-white outline-none placeholder:text-white/[0.19] sm:text-[15px]"
              />

              {query ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label={copy.clearSearch}
                  className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center border border-white/[0.08] text-white/[0.28] transition-colors duration-300 hover:border-[#c7a96b]/35 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                >
                  <X
                    aria-hidden="true"
                    size={14}
                    strokeWidth={1.15}
                  />
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section
          aria-label={copy.filters}
          className="mt-4"
        >
          <div className="hidden border-y border-white/[0.055] lg:block">
            <div className="flex flex-wrap items-center">
              <DesktopFilter
                label={copy.project}
                value={projectFilter}
                options={[
                  {
                    value: "all",
                    label: copy.allProjects,
                  },
                  ...PROJECT_OPTIONS.map(
                    (project) => ({
                      value: project.slug,
                      label: project.title,
                    }),
                  ),
                ]}
                onChange={setProject}
              />

              <DesktopFilter
                label={copy.role}
                value={categoryFilter}
                options={[
                  {
                    value: "all",
                    label: copy.allRoles,
                  },
                  {
                    value: "MAIN",
                    label: copy.main,
                  },
                  {
                    value: "SUPPORTING",
                    label: copy.supporting,
                  },
                ]}
                onChange={(value) =>
                  setCategory(
                    value as CategoryFilter,
                  )
                }
              />

              <DesktopFilter
                label={copy.gender}
                value={genderFilter}
                options={[
                  {
                    value: "all",
                    label: copy.allGenders,
                  },
                  {
                    value: "MALE",
                    label: copy.male,
                  },
                  {
                    value: "FEMALE",
                    label: copy.female,
                  },
                ]}
                onChange={(value) =>
                  setGender(
                    value as GenderFilter,
                  )
                }
              />

              <button
                type="button"
                disabled={!hasFilters}
                onClick={clearAll}
                className="ml-auto flex min-h-[76px] items-center gap-3 border-l border-white/[0.055] px-6 font-mono text-[7px] uppercase tracking-[0.22em] text-white/[0.28] transition-colors duration-300 hover:text-white disabled:cursor-default disabled:text-white/[0.1] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
              >
                <SlidersHorizontal
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.15}
                />

                {copy.reset}

                {hasFilters ? (
                  <span
                    className="flex h-5 min-w-5 items-center justify-center rounded-full px-1"
                    style={{
                      background: `${GOLD}18`,
                      color: GOLD_LIGHT,
                    }}
                  >
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              type="button"
              aria-expanded={mobileFiltersOpen}
              aria-controls="character-mobile-filters"
              onClick={() =>
                setMobileFiltersOpen(
                  (value) => !value,
                )
              }
              className="flex min-h-[56px] w-full items-center justify-between border-y border-white/[0.075] px-1 text-[8px] uppercase tracking-[0.24em] text-white/[0.36] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
            >
              <span className="flex items-center gap-3">
                <SlidersHorizontal
                  aria-hidden="true"
                  size={14}
                  strokeWidth={1.15}
                />

                {copy.filters}

                {hasFilters ? (
                  <span
                    className="flex h-5 min-w-5 items-center justify-center rounded-full px-1"
                    style={{
                      background: `${GOLD}18`,
                      color: GOLD_LIGHT,
                    }}
                  >
                    {activeFilterCount}
                  </span>
                ) : null}
              </span>

              <ChevronDown
                aria-hidden="true"
                size={15}
                strokeWidth={1.15}
                className={[
                  "transition-transform duration-300",
                  mobileFiltersOpen
                    ? "rotate-180"
                    : "",
                ].join(" ")}
              />
            </button>

            {mobileFiltersOpen ? (
              <div
                id="character-mobile-filters"
                className="border-b border-white/[0.075] py-6"
              >
                <div className="grid gap-6">
                  <MobileFilter
                    label={copy.project}
                    value={projectFilter}
                    options={[
                      {
                        value: "all",
                        label: copy.allProjects,
                      },
                      ...PROJECT_OPTIONS.map(
                        (project) => ({
                          value: project.slug,
                          label: project.title,
                        }),
                      ),
                    ]}
                    onChange={setProject}
                  />

                  <MobileFilter
                    label={copy.role}
                    value={categoryFilter}
                    options={[
                      {
                        value: "all",
                        label: copy.allRoles,
                      },
                      {
                        value: "MAIN",
                        label: copy.main,
                      },
                      {
                        value: "SUPPORTING",
                        label: copy.supporting,
                      },
                    ]}
                    onChange={(value) =>
                      setCategory(
                        value as CategoryFilter,
                      )
                    }
                  />

                  <MobileFilter
                    label={copy.gender}
                    value={genderFilter}
                    options={[
                      {
                        value: "all",
                        label: copy.allGenders,
                      },
                      {
                        value: "MALE",
                        label: copy.male,
                      },
                      {
                        value: "FEMALE",
                        label: copy.female,
                      },
                    ]}
                    onChange={(value) =>
                      setGender(
                        value as GenderFilter,
                      )
                    }
                  />

                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      disabled={!hasFilters}
                      onClick={clearAll}
                      className="min-h-10 border border-white/[0.08] px-4 font-mono text-[7px] uppercase tracking-[0.2em] text-white/[0.3] disabled:cursor-default disabled:text-white/[0.12] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                    >
                      {copy.reset}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setMobileFiltersOpen(
                          false,
                        )
                      }
                      className="min-h-10 px-4 font-mono text-[7px] uppercase tracking-[0.2em] text-white/[0.22] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                    >
                      {copy.closeFilters}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {hasFilters ? (
          <section
            aria-label={copy.activeFilters}
            className="border-b border-white/[0.055] py-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.15]">
                {copy.activeFilters}
              </span>

              {query.trim() ? (
                <FilterChip
                  label={`“${query.trim()}”`}
                  onRemove={clearSearch}
                />
              ) : null}

              {projectFilter !== "all" ? (
                <FilterChip
                  label={
                    PROJECT_TITLE_BY_SLUG.get(
                      projectFilter,
                    ) ?? projectFilter
                  }
                  onRemove={() =>
                    setProject("all")
                  }
                />
              ) : null}

              {categoryFilter !== "all" ? (
                <FilterChip
                  label={
                    categoryFilter === "MAIN"
                      ? copy.main
                      : copy.supporting
                  }
                  onRemove={() =>
                    setCategory("all")
                  }
                />
              ) : null}

              {genderFilter !== "all" ? (
                <FilterChip
                  label={
                    genderFilter === "MALE"
                      ? copy.male
                      : copy.female
                  }
                  onRemove={() =>
                    setGender("all")
                  }
                />
              ) : null}

              <button
                type="button"
                onClick={clearAll}
                className="ml-auto font-mono text-[6px] uppercase tracking-[0.2em] text-white/[0.2] transition-colors hover:text-white/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
              >
                {copy.clearFilters}
              </button>
            </div>
          </section>
        ) : null}

        <section className="mt-10 flex flex-col gap-4 border-b border-white/[0.055] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div
            aria-live="polite"
            aria-atomic="true"
            className="flex items-end gap-4"
          >
            <div>
              <p className="font-mono text-[7px] uppercase tracking-[0.26em] text-white/[0.18]">
                {copy.results}
              </p>

              <p
                className="mt-2 font-mono text-[18px] tracking-[-0.03em]"
                style={{
                  color: `${GOLD_LIGHT}76`,
                }}
              >
                {String(
                  filteredCharacters.length,
                ).padStart(2, "0")}
              </p>
            </div>

            <span className="mb-1 h-px w-8 bg-white/[0.07]" />

            <p className="mb-1 text-[7px] uppercase tracking-[0.22em] text-white/[0.16]">
              {filteredCharacters.length ===
              characters.length
                ? copy.allCharacters
                : `${copy.count} ${filteredCharacters.length}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.15]">
              {copy.viewMode}
            </span>

            <div className="flex border border-white/[0.07]">
              <ViewButton
                active={viewMode === "grid"}
                label={copy.grid}
                onClick={() =>
                  setView("grid")
                }
              >
                <Grid2X2
                  aria-hidden="true"
                  size={14}
                  strokeWidth={1.1}
                />
              </ViewButton>

              <ViewButton
                active={viewMode === "list"}
                label={copy.list}
                onClick={() =>
                  setView("list")
                }
              >
                <List
                  aria-hidden="true"
                  size={14}
                  strokeWidth={1.1}
                />
              </ViewButton>
            </div>
          </div>
        </section>

        {filteredCharacters.length === 0 ? (
          <EmptyState
            copy={copy}
            onReset={clearAll}
            reducedMotion={reducedMotion}
          />
        ) : viewMode === "grid" ? (
          <motion.section
            layout
            className="mt-5 grid gap-px bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3"
            aria-label={copy.openArchive}
          >
            {filteredCharacters.map(
              (character, index) => (
                <ArchiveCard
                  key={character.id}
                  character={character}
                  index={index}
                  total={filteredCharacters.length}
                  locale={locale}
                  reducedMotion={
                    reducedMotion
                  }
                />
              ),
            )}
          </motion.section>
        ) : (
          <motion.section
            layout
            className="mt-5 border-y border-white/[0.055]"
            aria-label={copy.openArchive}
          >
            {filteredCharacters.map(
              (character, index) => (
                <ArchiveListRow
                  key={character.id}
                  character={character}
                  index={index}
                  total={filteredCharacters.length}
                  locale={locale}
                  reducedMotion={
                    reducedMotion
                  }
                />
              ),
            )}
          </motion.section>
        )}

        <footer className="mt-16 border-t border-white/[0.055] pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[620px]">
              <p className="font-mono text-[7px] uppercase tracking-[0.28em] text-white/[0.15]">
                UMBRA / CHARACTER ARCHIVE
              </p>

              <p className="mt-3 text-[9px] leading-5 text-white/[0.2]">
                {copy.archiveNote}
              </p>
            </div>

            <Link
              href={
                locale === "en"
                  ? "/en"
                  : "/"
              }
              className="group inline-flex items-center gap-3 font-mono text-[7px] uppercase tracking-[0.22em] text-white/[0.22] transition-colors duration-300 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
            >
              {copy.previousWorld}

              <ArrowUpRight
                aria-hidden="true"
                size={13}
                strokeWidth={1.15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

function DesktopFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="border-r border-white/[0.055] px-5 py-5 first:pl-0 xl:px-7">
      <p className="mb-2 font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.15]">
        {label}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active =
            value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() =>
                onChange(option.value)
              }
              className={[
                "min-h-9 border px-3 py-1.5 text-[7px] uppercase tracking-[0.17em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55",
                active
                  ? "border-[#c7a96b]/40 bg-[#c7a96b]/[0.06] text-[#ead39a]"
                  : "border-white/[0.06] text-white/[0.24] hover:border-white/[0.13] hover:text-white/[0.58]",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MobileFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[7px] uppercase tracking-[0.25em] text-white/[0.2]">
        {label}
      </p>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active =
            value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() =>
                onChange(option.value)
              }
              className={[
                "min-h-9 border px-3 py-2 text-[7px] uppercase tracking-[0.17em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55",
                active
                  ? "border-[#c7a96b]/40 bg-[#c7a96b]/[0.06] text-[#ead39a]"
                  : "border-white/[0.07] text-white/[0.28] hover:border-white/[0.14] hover:text-white/[0.6]",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex min-h-9 items-center gap-2 border border-[#c7a96b]/20 bg-[#c7a96b]/[0.03] px-3 py-1.5 text-[6px] uppercase tracking-[0.18em] text-[#ead39a]/75 transition-colors duration-300 hover:border-[#c7a96b]/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
    >
      <span>{label}</span>

      <X
        aria-hidden="true"
        size={11}
        strokeWidth={1.2}
      />
    </button>
  );
}

function ViewButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={[
        "flex h-9 w-10 items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/55",
        active
          ? "bg-[#c7a96b]/[0.07] text-[#ead39a]"
          : "text-white/[0.22] transition-colors duration-300 hover:text-white/[0.58]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function EmptyState({
  copy,
  onReset,
  reducedMotion,
}: {
  copy: ArchiveCopy;
  onReset: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="mt-5 flex min-h-[380px] items-center justify-center border-y border-white/[0.055] text-center"
    >
      <div className="max-w-[520px] px-6">
        <div
          aria-hidden="true"
          className="mx-auto h-px w-14"
          style={{
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }}
        />

        <p
          className="mt-7 font-mono text-[7px] uppercase tracking-[0.28em]"
          style={{
            color: `${GOLD_LIGHT}72`,
          }}
        >
          UMBRA / NO MATCH
        </p>

        <h2 className="mt-4 text-2xl font-[430] uppercase leading-[0.95] tracking-[-0.04em] text-white/[0.85]">
          {copy.noResults}
        </h2>

        <button
          type="button"
          onClick={onReset}
          className="mt-7 min-h-10 border border-white/[0.09] px-5 text-[8px] uppercase tracking-[0.22em] text-white/[0.35] transition-colors duration-300 hover:border-[#c7a96b]/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
        >
          {copy.clearFilters}
        </button>
      </div>
    </motion.section>
  );
}

function ArchiveCard({
  character,
  index,
  total,
  locale,
  reducedMotion,
}: {
  character: Character;
  index: number;
  total: number;
  locale: Locale;
  reducedMotion: boolean;
}) {
  const category = getRoleLabel(
    character.category,
    locale,
  );

  const projectTitle =
    getCanonicalProjectTitle(character);

  const href = getCharacterHref(
    character,
    locale,
  );

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        delay: reducedMotion
          ? 0
          : Math.min(index * 0.035, 0.2),
        ease: EASE,
      }}
      className="group relative min-h-[500px] overflow-hidden bg-[#070707]"
    >
      <Link
        href={href}
        aria-label={
          locale === "en"
            ? `Open character ${character.name}`
            : `Otvori lik ${character.name}`
        }
        className="absolute inset-0 z-20 block outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/70"
      >
        {character.image ? (
          <motion.div
            animate={{
              scale: reducedMotion
                ? 1
                : 1.015,
            }}
            whileHover={{
              scale: reducedMotion
                ? 1
                : 1.04,
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.8,
              ease: EASE,
            }}
            className="absolute inset-[-18px]"
          >
            <Image
              src={character.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-center grayscale-[0.18] opacity-[0.7] transition-[filter,opacity] duration-700 group-hover:grayscale-0 group-hover:opacity-[0.92]"
            />
          </motion.div>
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_68%_32%,rgba(234,211,154,.08),transparent_34%),linear-gradient(135deg,#090909_0%,#050505_55%,#0b0a08_100%)]"
          >
            <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:96px_96px]" />

            <div className="absolute left-[68%] top-[38%] h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />

            <div className="absolute left-[68%] top-[38%] h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.1]" />
          </div>
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.18)_0%,rgba(0,0,0,.08)_36%,rgba(0,0,0,.78)_100%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.25),transparent_48%,rgba(0,0,0,.16))]" />

        <div className="absolute left-6 right-6 top-6 flex items-start justify-between sm:left-8 sm:right-8 sm:top-8">
          <span
            className="font-mono text-[8px] tracking-[0.22em]"
            style={{
              color: `${GOLD_LIGHT}72`,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="font-mono text-[7px] tracking-[0.2em] text-white/[0.22]">
            {String(index + 1).padStart(
              2,
              "0",
            )}{" "}
            /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <div className="absolute inset-6 border border-white/[0.06] sm:inset-8" />

        <div className="absolute bottom-7 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8">
          <div className="mb-4 flex items-center gap-3">
            <span
              className="font-mono text-[7px] uppercase tracking-[0.25em]"
              style={{
                color: `${GOLD_LIGHT}86`,
              }}
            >
              {category}
            </span>

            <span className="h-px w-5 bg-white/[0.11]" />

            <span className="max-w-[190px] truncate text-[7px] uppercase tracking-[0.22em] text-white/[0.28]">
              {projectTitle}
            </span>
          </div>

          <div className="flex items-end justify-between gap-5">
            <div className="min-w-0">
              <h2 className="text-[clamp(2.2rem,4vw,4rem)] font-[430] uppercase leading-[0.86] tracking-[-0.06em] text-white transition-transform duration-500 group-hover:-translate-y-1">
                {character.name}
              </h2>

              <p className="mt-4 max-w-[360px] text-[10px] leading-5 text-white/[0.34] transition-colors duration-500 group-hover:text-white/[0.52]">
                {character.shortDescription}
              </p>
            </div>

            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/[0.12] text-white/[0.34] transition-all duration-300 group-hover:border-[#c7a96b]/45 group-hover:bg-[#c7a96b]/[0.06] group-hover:text-[#ead39a]">
              <ArrowUpRight
                aria-hidden="true"
                size={16}
                strokeWidth={1.15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#c7a96b]/35 transition-[width] duration-500 group-hover:w-14" />

            <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-white/[0.2] transition-colors duration-300 group-hover:text-white/[0.4]">
              {locale === "en"
                ? "Open dossier"
                : "Otvori dosije"}
            </span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-[#c7a96b] via-[#ead39a] to-transparent transition-[width] duration-700 group-hover:w-full"
        />
      </Link>
    </motion.article>
  );
}

function ArchiveListRow({
  character,
  index,
  total,
  locale,
  reducedMotion,
}: {
  character: Character;
  index: number;
  total: number;
  locale: Locale;
  reducedMotion: boolean;
}) {
  const href = getCharacterHref(
    character,
    locale,
  );

  const category = getRoleLabel(
    character.category,
    locale,
  );

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.35,
        delay: reducedMotion
          ? 0
          : Math.min(index * 0.018, 0.12),
        ease: EASE,
      }}
      className="group border-b border-white/[0.05] last:border-b-0"
    >
      <Link
        href={href}
        aria-label={
          locale === "en"
            ? `Open character ${character.name}`
            : `Otvori lik ${character.name}`
        }
        className="flex min-h-[94px] items-center gap-4 px-1 py-5 outline-none transition-colors duration-300 hover:bg-white/[0.015] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/55 sm:px-2 lg:px-4"
      >
        <span
          className="w-8 shrink-0 font-mono text-[7px] tracking-[0.2em]"
          style={{
            color: `${GOLD_LIGHT}42`,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="truncate text-[20px] font-[430] uppercase leading-none tracking-[-0.035em] text-white/[0.82] transition-colors duration-300 group-hover:text-white sm:text-[24px]">
              {character.name}
            </h2>

            <span
              className="font-mono text-[6px] uppercase tracking-[0.22em]"
              style={{
                color: `${GOLD_LIGHT}6d`,
              }}
            >
              {category}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <span className="truncate text-[7px] uppercase tracking-[0.2em] text-white/[0.18]">
              {getCanonicalProjectTitle(
                character,
              )}
            </span>

            <span className="hidden h-px w-5 bg-white/[0.08] sm:block" />

            <span className="hidden max-w-[460px] truncate text-[8px] leading-5 text-white/[0.18] md:block">
              {character.shortDescription}
            </span>
          </div>
        </div>

        <span className="hidden w-[68px] shrink-0 text-right font-mono text-[7px] tracking-[0.16em] text-white/[0.14] sm:block">
          {String(index + 1).padStart(
            2,
            "0",
          )}{" "}
          /{" "}
          {String(total).padStart(2, "0")}
        </span>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/[0.08] text-white/[0.24] transition-all duration-300 group-hover:border-[#c7a96b]/40 group-hover:text-[#ead39a]">
          <ArrowUpRight
            aria-hidden="true"
            size={15}
            strokeWidth={1.15}
          />
        </span>
      </Link>

      <div
        aria-hidden="true"
        className="h-px w-0 bg-gradient-to-r from-[#c7a96b] via-[#ead39a] to-transparent transition-[width] duration-700 group-hover:w-full"
      />
    </motion.article>
  );
}
