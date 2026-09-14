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

import type {
  CharacterCategory,
  CharacterContent,
  CharacterGender,
  ProjectContent,
} from "@/lib/content/types";

type Locale = "sr" | "en";
type ProjectFilter = "all" | string;

type CategoryFilter =
  | "all"
  | CharacterCategory;

type GenderFilter =
  | "all"
  | Exclude<CharacterGender, null>;

type ViewMode = "grid" | "list";

type CharacterImageMap = Record<string, string | null>;

type CharactersArchiveProps = {
  locale: Locale;
  characters: readonly CharacterContent[];
  projects: readonly ProjectContent[];
  characterImages: CharacterImageMap;
};

type ArchiveCharacter = CharacterContent & {
  project: ProjectContent | null;
  image: string | null;
};

type ArchiveCopy =
  (typeof COPY)[Locale];

const GOLD = "#c4a56b";
const GOLD_LIGHT = "#dfc88f";

const EASE = [0.22, 1, 0.36, 1] as const;

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

function getLocalizedTitle(
  character: CharacterContent,
  locale: Locale,
) {
  return locale === "en"
    ? character.title.en
    : character.title.sr;
}

function getLocalizedDescription(
  character: CharacterContent,
  locale: Locale,
) {
  const localized =
    locale === "en"
      ? character.shortDescription?.en ??
        character.description?.en
      : character.shortDescription?.sr ??
        character.description?.sr;

  return localized ?? "";
}

function getProjectTitle(
  project: ProjectContent,
  locale: Locale,
) {
  return locale === "en"
    ? project.title.en
    : project.title.sr;
}

function getCharacterHref(
  character: CharacterContent,
  locale: Locale,
) {
  return locale === "en"
    ? `/en/characters/${character.slug}`
    : `/likovi/${character.slug}`;
}

function getProjectFilter(
  searchParams: URLSearchParams,
  projects: readonly ProjectContent[],
): ProjectFilter {
  const project = searchParams.get("project") ?? "all";

  if (
    project === "all" ||
    projects.some((item) => item.slug === project)
  ) {
    return project;
  }

  return "all";
}

function getCategoryFilter(
  searchParams: URLSearchParams,
): CategoryFilter {
  const role = searchParams.get("role");

  return role === "MAIN" || role === "SUPPORTING"
    ? role
    : "all";
}

function getGenderFilter(
  searchParams: URLSearchParams,
): GenderFilter {
  const gender = searchParams.get("gender");

  return gender === "MALE" || gender === "FEMALE"
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
  characters,
  projects,
  characterImages,
}: CharactersArchiveProps) {
  const copy = COPY[locale];
  const reducedMotion =
    useReducedMotion() ?? false;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const projectBySlug = useMemo(
    () =>
      new Map(
        projects.map((project) => [
          project.slug,
          project,
        ]),
      ),
    [projects],
  );

  const projectById = useMemo(
    () =>
      new Map(
        projects.map((project) => [
          project.id,
          project,
        ]),
      ),
    [projects],
  );

  const archiveCharacters =
    useMemo<ArchiveCharacter[]>(
      () =>
        characters.map((character) => ({
          ...character,
          project:
            projectById.get(character.projectId) ??
            null,
          image:
            characterImages[character.id] ?? null,
        })),
      [characters, characterImages, projectById],
    );

  const projectOptions = useMemo(
    () =>
      projects.map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
      })),
    [projects],
  );

  const query = searchParams.get("q") ?? "";
  const projectFilter = getProjectFilter(
    searchParams,
    projects,
  );
  const categoryFilter = getCategoryFilter(
    searchParams,
  );
  const genderFilter = getGenderFilter(
    searchParams,
  );
  const viewMode = getViewMode(searchParams);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

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
    const normalizedQuery = normalizeSearch(query);

    return archiveCharacters.filter((character) => {
      if (
        projectFilter !== "all" &&
        character.projectId !==
          projectBySlug.get(projectFilter)?.id
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
        const projectTitle = character.project
          ? getProjectTitle(
              character.project,
              locale,
            )
          : "";

        const currentTitle =
          getLocalizedTitle(
            character,
            locale,
          );

        const alternateTitle =
          getLocalizedTitle(
            character,
            locale === "en"
              ? "sr"
              : "en",
          );

        const currentDescription =
          getLocalizedDescription(
            character,
            locale,
          );

        const alternateDescription =
          getLocalizedDescription(
            character,
            locale === "en"
              ? "sr"
              : "en",
          );

        const haystack = normalizeSearch(
          [
            currentTitle,
            alternateTitle,
            projectTitle,
            currentDescription,
            alternateDescription,
          ]
            .filter(Boolean)
            .join(" "),
        );

        if (!haystack.includes(normalizedQuery)) {
          return false;
        }
      }

      return true;
    });
  }, [
    archiveCharacters,
    categoryFilter,
    genderFilter,
    locale,
    projectBySlug,
    projectFilter,
    query,
  ]);

  const activeFilterCount =
    Number(Boolean(query.trim())) +
    Number(projectFilter !== "all") +
    Number(categoryFilter !== "all") +
    Number(genderFilter !== "all");

  const hasFilters = activeFilterCount > 0;

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

  const setGender = (value: GenderFilter) => {
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
      className="min-h-screen overflow-x-clip bg-[var(--umbra-bg)] text-[var(--umbra-ink)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px]"
        style={{
          background:
            "radial-gradient(circle at 78% 8%, rgba(196,165,107,.035), transparent 26%), linear-gradient(180deg,#060605 0%,transparent 72%)",
        }}
      />

      <div className="umbra-container relative py-28 sm:py-32 lg:py-36">
        <motion.header
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.6,
            ease: EASE,
          }}
          className="border-b border-white/[0.055] pb-10 sm:pb-12"
        >
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8"
                style={{
                  background:
                    `linear-gradient(90deg, transparent, ${GOLD_LIGHT}78)`,
                }}
              />
              <span
                className="umbra-code"
                style={{
                  color: `${GOLD_LIGHT}78`,
                }}
              >
                {copy.eyebrow}
              </span>
            </div>

            <span className="hidden umbra-code sm:block">
              UMBRA / DOSSIERS
            </span>
          </div>

          <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-20">
            <div>
              <h1 className="max-w-[900px] text-[clamp(3rem,7.2vw,7rem)] font-[430] uppercase leading-[0.84] tracking-[-0.07em] text-[var(--umbra-platinum)]">
                <span className="block">
                  {copy.titleA}
                </span>
                <span className="block font-serif normal-case italic text-white/[0.54]">
                  {copy.titleB}
                </span>
              </h1>

              <p className="mt-6 max-w-[660px] text-[12px] leading-6 text-[var(--umbra-ink-muted)] sm:text-[14px] sm:leading-7">
                {copy.description}
              </p>
            </div>

            <div className="border-l border-white/[0.055] pl-5 sm:pl-6">
              <span className="umbra-code">
                {copy.openArchive}
              </span>

              <div className="mt-3 flex items-end gap-4">
                <span
                  className="font-mono text-[56px] leading-none tracking-[-0.07em]"
                  style={{
                    color: `${GOLD_LIGHT}72`,
                  }}
                >
                  {String(
                    archiveCharacters.length,
                  ).padStart(2, "0")}
                </span>

                <span className="pb-1 text-[7px] uppercase leading-4 tracking-[0.22em] text-white/[0.20]">
                  {copy.registered}
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        <section
          aria-labelledby="character-search-heading"
          className="mt-8 sm:mt-10"
        >
          <h2
            id="character-search-heading"
            className="sr-only"
          >
            {copy.searchLabel}
          </h2>

          <label
            htmlFor="character-archive-search"
            className="sr-only"
          >
            {copy.searchLabel}
          </label>

          <div className="flex min-h-14 items-center border-y border-white/[0.055] sm:min-h-16">
            <Search
              aria-hidden="true"
              size={17}
              strokeWidth={1.05}
              className="ml-1 shrink-0 text-white/[0.22] sm:ml-2"
            />

            <input
              id="character-archive-search"
              type="search"
              value={query}
              onChange={handleSearchChange}
              placeholder={copy.searchPlaceholder}
              inputMode="search"
              enterKeyHint="search"
              className="min-w-0 flex-1 bg-transparent px-4 py-4 text-[12px] text-white outline-none placeholder:text-white/[0.18] sm:px-5 sm:text-[14px]"
            />

            {query ? (
              <button
                type="button"
                onClick={clearSearch}
                aria-label={copy.clearSearch}
                className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center border border-white/[0.08] text-white/[0.3] outline-none transition-colors hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75"
              >
                <X
                  aria-hidden="true"
                  size={14}
                  strokeWidth={1.15}
                />
              </button>
            ) : null}
          </div>
        </section>

        <section
          aria-label={copy.filters}
          className="mt-4"
        >
          <div className="hidden border-y border-white/[0.055] lg:block">
            <div className="grid lg:grid-cols-[1fr_1fr_1fr_auto]">
              <DesktopFilter
                label={copy.project}
                value={projectFilter}
                options={[
                  {
                    value: "all",
                    label: copy.allProjects,
                  },
                  ...projectOptions.map(
                    (project) => ({
                      value: project.slug,
                      label:
                        locale === "en"
                          ? project.title.en
                          : project.title.sr,
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
                className="flex min-h-[74px] items-center gap-3 border-l border-white/[0.055] px-5 text-[7px] uppercase tracking-[0.22em] text-white/[0.26] outline-none transition-colors hover:text-white disabled:cursor-default disabled:text-white/[0.1] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#dfc88f]/75"
              >
                <SlidersHorizontal
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.1}
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
              className="flex min-h-12 w-full items-center justify-between border-y border-white/[0.055] px-1 text-[7px] uppercase tracking-[0.23em] text-white/[0.38] outline-none transition-colors hover:text-white/[0.6] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75"
            >
              <span className="flex items-center gap-3">
                <SlidersHorizontal
                  aria-hidden="true"
                  size={14}
                  strokeWidth={1.1}
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
                strokeWidth={1.1}
                className={
                  mobileFiltersOpen
                    ? "rotate-180 transition-transform duration-300"
                    : "transition-transform duration-300"
                }
              />
            </button>

            {mobileFiltersOpen ? (
              <div
                id="character-mobile-filters"
                className="border-b border-white/[0.055] py-6"
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
                      ...projectOptions.map(
                        (project) => ({
                          value: project.slug,
                          label:
                            locale === "en"
                              ? project.title.en
                              : project.title.sr,
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

                  <div className="flex items-center justify-between gap-4 border-t border-white/[0.055] pt-5">
                    <button
                      type="button"
                      disabled={!hasFilters}
                      onClick={clearAll}
                      className="min-h-10 border border-white/[0.08] px-4 text-[7px] uppercase tracking-[0.2em] text-white/[0.3] outline-none transition-colors hover:text-white disabled:text-white/[0.12] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75"
                    >
                      {copy.reset}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setMobileFiltersOpen(false)
                      }
                      className="min-h-10 px-4 text-[7px] uppercase tracking-[0.2em] text-white/[0.23] outline-none transition-colors hover:text-white/[0.58] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75"
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
              <span className="mr-1 umbra-code text-white/[0.15]">
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
                    projectBySlug.get(
                      projectFilter,
                    )
                      ? getProjectTitle(
                          projectBySlug.get(
                            projectFilter,
                          )!,
                          locale,
                        )
                      : projectFilter
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
                className="ml-auto px-1 umbra-code text-white/[0.20] outline-none transition-colors hover:text-white/60 focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75"
              >
                {copy.clearFilters}
              </button>
            </div>
          </section>
        ) : null}

        <section className="mt-8 flex flex-col gap-4 border-b border-white/[0.055] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div
            aria-live="polite"
            aria-atomic="true"
            className="flex items-end gap-4"
          >
            <div>
              <p className="umbra-code text-white/[0.17]">
                {copy.results}
              </p>
              <p
                className="mt-2 font-mono text-[19px] tracking-[-0.03em]"
                style={{ color: `${GOLD_LIGHT}78` }}
              >
                {String(
                  filteredCharacters.length,
                ).padStart(2, "0")}
              </p>
            </div>

            <span className="mb-1 h-px w-7 bg-white/[0.07]" />

            <p className="mb-1 text-[7px] uppercase tracking-[0.22em] text-white/[0.16]">
              {filteredCharacters.length ===
              archiveCharacters.length
                ? copy.allCharacters
                : `${copy.count} ${filteredCharacters.length}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="umbra-code text-white/[0.14]">
              {copy.viewMode}
            </span>

            <div className="flex overflow-hidden border border-white/[0.07]">
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
                  strokeWidth={1.05}
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
                  strokeWidth={1.05}
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
            className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-label={copy.openArchive}
          >
            {filteredCharacters.map(
              (character, index) => (
                <ArchiveCard
                  key={character.id}
                  character={character}
                  index={index}
                  total={
                    filteredCharacters.length
                  }
                  locale={locale}
                  reducedMotion={reducedMotion}
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
                  total={
                    filteredCharacters.length
                  }
                  locale={locale}
                  reducedMotion={reducedMotion}
                />
              ),
            )}
          </motion.section>
        )}

        <footer className="mt-14 border-t border-white/[0.055] pt-6 sm:mt-16">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[620px]">
              <p className="umbra-code text-white/[0.15]">
                UMBRA / CHARACTER ARCHIVE
              </p>
              <p className="mt-3 text-[9px] leading-5 text-white/[0.20]">
                {copy.archiveNote}
              </p>
            </div>

            <Link
              href={
                locale === "en"
                  ? "/en"
                  : "/"
              }
              className="group inline-flex min-h-9 items-center gap-3 umbra-code text-white/[0.22] outline-none transition-colors hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75"
            >
              {copy.previousWorld}
              <ArrowUpRight
                aria-hidden="true"
                size={13}
                strokeWidth={1.05}
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
    <div className="border-r border-white/[0.055] px-5 py-5 xl:px-6">
      <p className="mb-2 umbra-code text-white/[0.15]">
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
                "min-h-9 border px-3 py-1.5 text-[7px] uppercase tracking-[0.17em] outline-none transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-px focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75",
                active
                  ? "border-[#c4a56b]/40 bg-[#c4a56b]/[0.05] text-[#dfc88f]"
                  : "border-white/[0.06] bg-white/[0.005] text-white/[0.24] hover:border-white/[0.13] hover:bg-white/[0.015] hover:text-white/[0.58]",
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
      <p className="mb-2 umbra-code text-white/[0.20]">
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
                "min-h-9 border px-3 py-2 text-[7px] uppercase tracking-[0.17em] outline-none transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-px focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75",
                active
                  ? "border-[#c4a56b]/40 bg-[#c4a56b]/[0.055] text-[#dfc88f]"
                  : "border-white/[0.07] bg-white/[0.008] text-white/[0.28] hover:border-white/[0.14] hover:bg-white/[0.018] hover:text-white/[0.6]",
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
      className="inline-flex min-h-9 items-center gap-2 border border-[#c4a56b]/20 bg-[#c4a56b]/[0.025] px-3 py-1.5 text-[6px] uppercase tracking-[0.18em] text-[#dfc88f]/75 outline-none transition-colors hover:border-[#c4a56b]/40 hover:bg-[#c4a56b]/[0.045] hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75"
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
        "flex h-9 w-10 items-center justify-center outline-none transition-[background-color,color] duration-300 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#dfc88f]/75",
        active
          ? "bg-[#c4a56b]/[0.07] text-[#dfc88f]"
          : "text-white/[0.22] hover:bg-white/[0.018] hover:text-white/[0.58]",
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
        y: reducedMotion ? 0 : 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="relative mt-5 flex min-h-[340px] items-center justify-center overflow-hidden border-y border-white/[0.055] text-center"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(196,165,107,.032), transparent 31%)",
        }}
      />

      <div className="relative max-w-[520px] px-6">
        <div
          aria-hidden="true"
          className="mx-auto h-px w-12"
          style={{
            background:
              `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }}
        />

        <p
          className="mt-6 umbra-code"
          style={{
            color: `${GOLD_LIGHT}70`,
          }}
        >
          UMBRA / NO MATCH
        </p>

        <h2 className="mt-4 text-[22px] font-[430] uppercase leading-[0.95] tracking-[-0.04em] text-white/[0.84]">
          {copy.noResults}
        </h2>

        <button
          type="button"
          onClick={onReset}
          className="mt-7 min-h-10 border border-white/[0.09] px-5 text-[8px] uppercase tracking-[0.22em] text-white/[0.35] outline-none transition-[border-color,color,transform] duration-300 hover:-translate-y-px hover:border-[#c4a56b]/40 hover:text-white focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75"
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
  character: ArchiveCharacter;
  index: number;
  total: number;
  locale: Locale;
  reducedMotion: boolean;
}) {
  const category = getRoleLabel(
    character.category,
    locale,
  );

  const projectTitle = character.project
    ? getProjectTitle(
        character.project,
        locale,
      )
    : "—";

  const characterTitle =
    getLocalizedTitle(character, locale);

  const characterDescription =
    getLocalizedDescription(
      character,
      locale,
    );

  const href = getCharacterHref(
    character,
    locale,
  );

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.42,
        delay: reducedMotion
          ? 0
          : Math.min(index * 0.025, 0.14),
        ease: EASE,
      }}
      className="group relative overflow-hidden border border-white/[0.065] bg-[var(--umbra-surface)]"
    >
      <Link
        href={href}
        aria-label={
          locale === "en"
            ? `Open character ${characterTitle}`
            : `Otvori lik ${characterTitle}`
        }
        className="block outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#dfc88f]/80"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#070706]">
          {character.image ? (
            <motion.div
              initial={{
                scale: reducedMotion ? 1 : 1.01,
              }}
              animate={{ scale: 1 }}
              whileHover={{
                scale: reducedMotion ? 1 : 1.025,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.9,
                ease: EASE,
              }}
              className="absolute inset-[-10px]"
            >
              <Image
                src={character.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-center grayscale-[0.12] opacity-[0.74] transition-[filter,opacity] duration-700 group-hover:grayscale-0 group-hover:opacity-[0.88]"
              />
            </motion.div>
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 70% 28%, rgba(223,200,143,.055), transparent 30%), linear-gradient(135deg,#090908 0%,#050504 60%,#080706 100%)",
              }}
            >
              <div className="absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:90px_90px]" />
              <div className="absolute left-1/2 top-[34%] h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />
              <div
                className="absolute left-1/2 top-[34%] h-[126px] w-[126px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{
                  borderColor: `${GOLD}12`,
                }}
              />
            </div>
          )}

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.04)_35%,rgba(0,0,0,.84)_100%)]"
          />

          <div
            aria-hidden="true"
            className="absolute inset-4 border border-white/[0.045] sm:inset-5"
          />

          <span
            aria-hidden="true"
            className="absolute left-4 top-4 h-8 w-8 border-l border-t sm:left-5 sm:top-5 sm:h-9 sm:w-9"
            style={{
              borderColor: `${GOLD_LIGHT}38`,
            }}
          />

          <span
            aria-hidden="true"
            className="absolute bottom-4 right-4 h-8 w-8 border-b border-r sm:bottom-5 sm:right-5"
            style={{
              borderColor: `${GOLD}26`,
            }}
          />

          <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-4 sm:inset-x-6 sm:top-6">
            <span
              className="umbra-code"
              style={{ color: `${GOLD_LIGHT}70` }}
            >
              {String(index + 1).padStart(
                2,
                "0",
              )}
            </span>

            <span className="umbra-code text-white/[0.22]">
              {String(index + 1).padStart(
                2,
                "0",
              )}{" "}
              /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </div>

          <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
            <div className="mb-3 flex items-center gap-3">
              <span
                className="umbra-code"
                style={{
                  color: `${GOLD_LIGHT}82`,
                }}
              >
                {category}
              </span>

              <span
                aria-hidden="true"
                className="h-px w-5 bg-white/[0.11]"
              />

              <span className="truncate umbra-code text-white/[0.27]">
                {projectTitle}
              </span>
            </div>

            <h2 className="max-w-[520px] text-[clamp(1.9rem,3.5vw,3.4rem)] font-[430] uppercase leading-[0.86] tracking-[-0.055em] text-white transition-transform duration-500 group-hover:-translate-y-0.5">
              {characterTitle}
            </h2>

            {characterDescription ? (
              <p className="mt-3 max-w-[390px] text-[10px] leading-5 text-white/[0.30] transition-colors duration-500 group-hover:text-white/[0.44]">
                {characterDescription}
              </p>
            ) : null}

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.055] pt-4">
              <span className="umbra-code text-white/[0.16]">
                {COPY[locale].dossier}
              </span>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/[0.10] bg-black/20 text-white/[0.34] backdrop-blur-md transition-[border-color,color,transform] duration-300 group-hover:-translate-y-px group-hover:border-[#dfc88f]/40 group-hover:text-[#dfc88f]">
                <ArrowUpRight
                  aria-hidden="true"
                  size={14}
                  strokeWidth={1.05}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </div>

          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-px w-0 transition-[width] duration-600 group-hover:w-28"
            style={{
              background:
                `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, transparent)`,
            }}
          />
        </div>
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
  character: ArchiveCharacter;
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

  const characterTitle =
    getLocalizedTitle(character, locale);

  const characterDescription =
    getLocalizedDescription(
      character,
      locale,
    );

  const projectTitle = character.project
    ? getProjectTitle(
        character.project,
        locale,
      )
    : "—";

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 7,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.30,
        delay: reducedMotion
          ? 0
          : Math.min(index * 0.014, 0.10),
        ease: EASE,
      }}
      className="group border-b border-white/[0.05] last:border-b-0"
    >
      <Link
        href={href}
        aria-label={
          locale === "en"
            ? `Open character ${characterTitle}`
            : `Otvori lik ${characterTitle}`
        }
        className="relative flex min-h-[88px] items-center gap-4 overflow-hidden px-1 py-5 outline-none transition-colors duration-300 hover:bg-white/[0.012] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#dfc88f]/75] sm:min-h-[94px] sm:px-2 lg:px-4"
      >
        <span
          className="w-7 shrink-0 umbra-code"
          style={{ color: `${GOLD_LIGHT}40` }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="truncate text-[18px] font-[430] uppercase leading-none tracking-[-0.03em] text-white/[0.78] transition-colors duration-300 group-hover:text-white sm:text-[22px]">
              {characterTitle}
            </h2>

            <span
              className="umbra-code"
              style={{ color: `${GOLD_LIGHT}60` }}
            >
              {category}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <span className="max-w-[180px] truncate umbra-code text-white/[0.17] sm:max-w-[250px]">
              {projectTitle}
            </span>

            <span className="hidden h-px w-5 bg-white/[0.08] sm:block" />

            <span className="hidden max-w-[480px] truncate text-[8px] leading-5 text-white/[0.17] md:block">
              {characterDescription}
            </span>
          </div>
        </div>

        <span className="hidden w-16 shrink-0 text-right umbra-code text-white/[0.12] sm:block">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/[0.08] text-white/[0.23] transition-[border-color,color,transform] duration-300 group-hover:-translate-y-px group-hover:border-[#dfc88f]/38 group-hover:text-[#dfc88f] sm:h-10 sm:w-10">
          <ArrowUpRight
            aria-hidden="true"
            size={14}
            strokeWidth={1.05}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>

        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-0 transition-[width] duration-600 group-hover:w-24"
          style={{
            background:
              `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, transparent)`,
          }}
        />
      </Link>
    </motion.article>
  );
}
