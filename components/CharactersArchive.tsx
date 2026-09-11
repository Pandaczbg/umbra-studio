"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
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

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const EASE = [0.22, 1, 0.36, 1] as const;

type Locale = "sr" | "en";

type ProjectFilter = "all" | string;
type CategoryFilter = "all" | CharacterCategory;
type GenderFilter = "all" | Exclude<CharacterGender, null>;
type ViewMode = "grid" | "list";

type CharactersArchiveProps = {
  locale: Locale;
};

type FilterOption = {
  value: string;
  label: string;
};

type ArchiveProject = {
  slug: string;
  title: string;
};

const copyByLocale = {
  sr: {
    eyebrow: "03 / ARHIVA LIKOVA",
    titleA: "Ljudi",
    titleB: "koji ostaju.",
    description:
      "Neki ljudi uđu u priču. Neki je promene zauvek. Ovde počinju njihovi dosijei.",
    searchPlaceholder: "Pretraži po imenu, projektu ili opisu...",
    allProjects: "Svi projekti",
    allRoles: "Sve uloge",
    allGenders: "Svi",
    main: "Glavni",
    supporting: "Sporedni",
    male: "Muški",
    female: "Ženski",
    filters: "Filteri",
    reset: "Resetuj",
    archive: "Arhiva",
    registered: "registrovanih likova",
    currentSelection: "Trenutna selekcija",
    noResults: "Nema lika koji odgovara ovoj selekciji.",
    clearSearch: "Obriši pretragu",
    project: "Projekat",
    role: "Uloga",
    gender: "Pol",
    system: "CAST / INDEX / DOSSIER",
    archiveCode: "UMBRA / CAST / INDEX",
    searchCode: "SEARCH / FILTER / ACCESS",
    allCharacters: "Svi registrovani likovi",
    results: "Rezultati",
    emptyCode: "ARCHIVE / NO MATCH",
    clearFilters: "Očisti filtere",
    dossier: "Otvori dosije",
    opening: "Otvaranje dosijea",
    characterIndex: "Indeks likova",
    backHome: "Nazad na početnu",
    activeFilters: "Aktivni filteri",
    grid: "Mreža",
    list: "Lista",
    view: "Prikaz",
    selected: "Izabrano",
    all: "Svi",
    projectCount: "projekat",
    projectsCount: "projekta",
    projectCountPlural: "projekata",
    roleMain: "Glavni lik",
    roleSupporting: "Sporedni lik",
    archiveNote:
      "Arhiva raste zajedno sa pričama. Svaki dosije otvara širi svet lika.",
    clearView: "Vrati mrežu",
    open: "Otvori",
  },

  en: {
    eyebrow: "03 / CHARACTER ARCHIVE",
    titleA: "People",
    titleB: "who remain.",
    description:
      "Some people enter a story. Some change it forever. Their dossiers begin here.",
    searchPlaceholder: "Search by name, project or description...",
    allProjects: "All projects",
    allRoles: "All roles",
    allGenders: "All",
    main: "Main",
    supporting: "Supporting",
    male: "Male",
    female: "Female",
    filters: "Filters",
    reset: "Reset",
    archive: "Archive",
    registered: "registered characters",
    currentSelection: "Current selection",
    noResults: "No character matches this selection.",
    clearSearch: "Clear search",
    project: "Project",
    role: "Role",
    gender: "Gender",
    system: "CAST / INDEX / DOSSIER",
    archiveCode: "UMBRA / CAST / INDEX",
    searchCode: "SEARCH / FILTER / ACCESS",
    allCharacters: "All registered characters",
    results: "Results",
    emptyCode: "ARCHIVE / NO MATCH",
    clearFilters: "Clear filters",
    dossier: "Open dossier",
    opening: "Opening dossier",
    characterIndex: "Character index",
    backHome: "Back to home",
    activeFilters: "Active filters",
    grid: "Grid",
    list: "List",
    view: "View",
    selected: "Selected",
    all: "All",
    projectCount: "project",
    projectsCount: "projects",
    projectCountPlural: "projects",
    roleMain: "Main character",
    roleSupporting: "Supporting character",
    archiveNote:
      "The archive grows with the stories. Every dossier opens a wider world around the character.",
    clearView: "Return to grid",
    open: "Open",
  },
} as const;

type ArchiveCopy = (typeof copyByLocale)[Locale];

function cx(
  ...classes: Array<string | false | null | undefined>
) {
  return classes.filter(Boolean).join(" ");
}

function clamp(
  value: number,
  min = -1,
  max = 1,
) {
  return Math.min(max, Math.max(min, value));
}

function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h7" />
      <path d="M15 6h5" />
      <path d="M4 12h3" />
      <path d="M11 12h9" />
      <path d="M4 18h9" />
      <path d="M17 18h3" />
      <circle
        cx="13"
        cy="6"
        r="1.5"
      />
      <circle
        cx="9"
        cy="12"
        r="1.5"
      />
      <circle
        cx="15"
        cy="18"
        r="1.5"
      />
    </svg>
  );
}

function ArrowUpRightIcon({
  size = 16,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function ArrowRightIcon({
  size = 15,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function CrosshairIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="6"
      />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
      />
      <rect
        x="14"
        y="4"
        width="6"
        height="6"
      />
      <rect
        x="4"
        y="14"
        width="6"
        height="6"
      />
      <rect
        x="14"
        y="14"
        width="6"
        height="6"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 7h14" />
      <path d="M6 12h14" />
      <path d="M6 17h14" />
      <circle
        cx="3.5"
        cy="7"
        r="0.8"
      />
      <circle
        cx="3.5"
        cy="12"
        r="0.8"
      />
      <circle
        cx="3.5"
        cy="17"
        r="0.8"
      />
    </svg>
  );
}

function getRoleLabel(
  category: CharacterCategory,
  locale: Locale,
) {
  if (category === "MAIN") {
    return locale === "en"
      ? "Main"
      : "Glavni";
  }

  return locale === "en"
    ? "Supporting"
    : "Sporedni";
}

export default function CharactersArchive({
  locale,
}: CharactersArchiveProps) {
  const reducedMotion =
    useReducedMotion() ?? false;

  const copy = copyByLocale[locale];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialView =
    searchParams.get("view") === "list"
      ? "list"
      : "grid";

  const [query, setQuery] = useState(
    searchParams.get("q") ?? "",
  );

  const [projectFilter, setProjectFilter] =
    useState<ProjectFilter>(
      searchParams.get("project") ?? "all",
    );

  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>(
      (searchParams.get("role") as CategoryFilter) ??
        "all",
    );

  const [genderFilter, setGenderFilter] =
    useState<GenderFilter>(
      (searchParams.get("gender") as GenderFilter) ??
        "all",
    );

  const [viewMode, setViewMode] =
    useState<ViewMode>(initialView);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [activeCharacterId, setActiveCharacterId] =
    useState<string | null>(null);

  const searchUpdateTimer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, {
    stiffness: 50,
    damping: 25,
    mass: 0.7,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 50,
    damping: 25,
    mass: 0.7,
  });

  const atmosphereX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion ? [0, 0] : [-10, 10],
  );

  const atmosphereY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion ? [0, 0] : [-7, 7],
  );

  const headingX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion ? [0, 0] : [-2.5, 2.5],
  );

  const headingY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion ? [0, 0] : [-1.5, 1.5],
  );

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    if (
      reducedMotion ||
      event.pointerType === "touch"
    ) {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    if (
      rect.width <= 0 ||
      rect.height <= 0
    ) {
      return;
    }

    pointerX.set(
      clamp(
        ((event.clientX - rect.left) /
          rect.width) *
          2 -
          1,
      ),
    );

    pointerY.set(
      clamp(
        ((event.clientY - rect.top) /
          rect.height) *
          2 -
          1,
      ),
    );
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const updateUrl = (
    nextValues: {
      query?: string;
      project?: string;
      role?: string;
      gender?: string;
      view?: ViewMode;
    },
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    const entries = [
      ["q", nextValues.query],
      ["project", nextValues.project],
      ["role", nextValues.role],
      ["gender", nextValues.gender],
      ["view", nextValues.view],
    ] as const;

    entries.forEach(([key, value]) => {
      if (
        value &&
        value !== "all" &&
        value !== "grid"
      ) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const queryString =
      params.toString();

    router.replace(
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
      {
        scroll: false,
      },
    );
  };

  const archiveProjects =
    useMemo<ArchiveProject[]>(() => {
      const map =
        new Map<string, string>();

      characters.forEach(
        (character) => {
          const slug =
            character.projectSlug;

          const title =
            character.projectTitle;

          if (
            typeof slug !== "string" ||
            slug.length === 0 ||
            typeof title !== "string" ||
            title.length === 0
          ) {
            return;
          }

          if (!map.has(slug)) {
            map.set(slug, title);
          }
        },
      );

      return Array.from(
        map.entries(),
      ).map(([slug, title]) => ({
        slug,
        title,
      }));
    }, []);

  const normalizedQuery =
    query
      .trim()
      .toLocaleLowerCase();

  const filteredCharacters =
    useMemo(
      () =>
        characters.filter(
          (character) => {
            const searchable = [
              character.name,
              character.projectTitle ??
                "",
              character.shortDescription ??
                "",
            ]
              .join(" ")
              .toLocaleLowerCase();

            const matchesQuery =
              !normalizedQuery ||
              searchable.includes(
                normalizedQuery,
              );

            const matchesProject =
              projectFilter === "all" ||
              character.projectSlug ===
                projectFilter;

            const matchesCategory =
              categoryFilter === "all" ||
              character.category ===
                categoryFilter;

            const matchesGender =
              genderFilter === "all" ||
              character.gender ===
                genderFilter;

            return (
              matchesQuery &&
              matchesProject &&
              matchesCategory &&
              matchesGender
            );
          },
        ),
      [
        categoryFilter,
        genderFilter,
        normalizedQuery,
        projectFilter,
      ],
    );

  const activeFilterCount = [
    query.trim(),
    projectFilter !== "all"
      ? projectFilter
      : "",
    categoryFilter !== "all"
      ? categoryFilter
      : "",
    genderFilter !== "all"
      ? genderFilter
      : "",
  ].filter(Boolean).length;

  const hasFilters =
    activeFilterCount > 0;

  const activeCharacter =
    activeCharacterId
      ? characters.find(
          (character) =>
            character.id ===
            activeCharacterId,
        ) ?? null
      : null;

  const clearQuery = () => {
    setQuery("");
    updateUrl({
      query: "",
      project: projectFilter,
      role: categoryFilter,
      gender: genderFilter,
      view: viewMode,
    });
  };

  const resetFilters = () => {
    setQuery("");
    setProjectFilter("all");
    setCategoryFilter("all");
    setGenderFilter("all");

    updateUrl({
      query: "",
      project: "all",
      role: "all",
      gender: "all",
      view: viewMode,
    });
  };

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value =
      event.target.value;

    setQuery(value);

    if (searchUpdateTimer.current) {
      clearTimeout(
        searchUpdateTimer.current,
      );
    }

    searchUpdateTimer.current =
      setTimeout(() => {
        updateUrl({
          query: value,
          project: projectFilter,
          role: categoryFilter,
          gender: genderFilter,
          view: viewMode,
        });
      }, 280);
  };

  useEffect(() => {
    return () => {
      if (searchUpdateTimer.current) {
        clearTimeout(
          searchUpdateTimer.current,
        );
      }
    };
  }, []);

  const setProject = (
    value: string,
  ) => {
    setProjectFilter(value);

    updateUrl({
      query,
      project: value,
      role: categoryFilter,
      gender: genderFilter,
      view: viewMode,
    });
  };

  const setCategory = (
    value: string,
  ) => {
    const nextValue =
      value as CategoryFilter;

    setCategoryFilter(nextValue);

    updateUrl({
      query,
      project: projectFilter,
      role: nextValue,
      gender: genderFilter,
      view: viewMode,
    });
  };

  const setGender = (
    value: string,
  ) => {
    const nextValue =
      value as GenderFilter;

    setGenderFilter(nextValue);

    updateUrl({
      query,
      project: projectFilter,
      role: categoryFilter,
      gender: nextValue,
      view: viewMode,
    });
  };

  const setView = (
    mode: ViewMode,
  ) => {
    setViewMode(mode);

    updateUrl({
      query,
      project: projectFilter,
      role: categoryFilter,
      gender: genderFilter,
      view: mode,
    });
  };

  const removeProjectFilter = () => {
    setProject("all");
  };

  const removeCategoryFilter = () => {
    setCategory("all");
  };

  const removeGenderFilter = () => {
    setGender("all");
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
      onPointerMove={
        handlePointerMove
      }
      onPointerLeave={resetPointer}
    >
      {/* ================================================================
          ATMOSPHERE
          ================================================================ */}

      <motion.div
        aria-hidden="true"
        style={{
          x: atmosphereX,
          y: atmosphereY,
        }}
        className="pointer-events-none fixed inset-[-10%] z-0"
      >
        <div className="absolute left-[3%] top-[9%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(199,169,107,.04),transparent_68%)] blur-3xl" />

        <div className="absolute right-[-6%] top-[35%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.016),transparent_70%)] blur-3xl" />

        <div className="absolute left-[33%] top-[72%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(199,169,107,.016),transparent_70%)] blur-3xl" />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,#050505_0%,#060606_48%,#050505_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.13]"
      >
        <div className="absolute left-[5%] top-0 h-full w-px bg-white/[0.018]" />

        <div className="absolute right-[5%] top-0 h-full w-px bg-white/[0.018]" />

        <div className="absolute left-1/2 top-0 h-full w-px bg-white/[0.01]" />
      </div>

      {/* ================================================================
          PAGE
          ================================================================ */}

      <div className="relative z-10 mx-auto max-w-[1480px] px-5 pb-28 pt-32 sm:px-8 sm:pb-36 lg:px-12 lg:pt-40 xl:px-16">
        {/* ==============================================================
            HERO
            ============================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.72,
            ease: EASE,
          }}
        >
          <motion.div
            style={{
              x: headingX,
              y: headingY,
            }}
            className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end"
          >
            <div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-10"
                  style={{
                    background:
                      `linear-gradient(90deg, transparent, ${GOLD})`,
                  }}
                />

                <span
                  className="text-[8px] font-semibold uppercase tracking-[0.45em]"
                  style={{
                    color:
                      GOLD_LIGHT,
                  }}
                >
                  {copy.eyebrow}
                </span>
              </div>

              <h1 className="mt-7 max-w-[1060px] text-[clamp(4rem,8.7vw,9.2rem)] font-[440] uppercase leading-[0.79] tracking-[-0.078em]">
                <span className="block">
                  {copy.titleA}
                </span>

                <span className="block font-serif font-normal italic text-white/[0.72]">
                  {copy.titleB}
                </span>
              </h1>

              <div className="mt-10 flex items-center gap-4">
                <div
                  className="h-px max-w-[600px] flex-1"
                  style={{
                    background:
                      `linear-gradient(90deg, ${GOLD}68, rgba(255,255,255,.07), transparent)`,
                  }}
                />

                <span className="hidden font-mono text-[6px] tracking-[0.28em] text-white/[0.12] sm:inline">
                  {copy.archiveCode}
                </span>
              </div>

              <p className="mt-7 max-w-[640px] text-[13px] leading-7 text-white/[0.4] sm:text-[15px] sm:leading-8">
                {copy.description}
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="relative border-l border-white/[0.07] pl-6">
                <span
                  aria-hidden="true"
                  className="absolute left-[-1px] top-0 h-12 w-px"
                  style={{
                    background:
                      `linear-gradient(180deg, ${GOLD_LIGHT}70, transparent)`,
                  }}
                />

                <div className="flex items-center justify-between">
                  <span className="text-[7px] uppercase tracking-[0.3em] text-white/[0.2]">
                    {copy.archive}
                  </span>

                  <span className="font-mono text-[6px] tracking-[0.18em] text-white/[0.12]">
                    CAST
                  </span>
                </div>

                <div className="mt-4 flex items-end gap-3">
                  <span
                    className="font-mono text-[46px] leading-none tracking-[-0.05em]"
                    style={{
                      color:
                        `${GOLD_LIGHT}76`,
                    }}
                  >
                    {String(
                      characters.length,
                    ).padStart(2, "0")}
                  </span>

                  <span className="pb-1 text-[7px] uppercase tracking-[0.24em] text-white/[0.2]">
                    {copy.registered}
                  </span>
                </div>

                <div className="mt-5 h-px bg-white/[0.05]" />

                <div className="mt-3 font-mono text-[6px] uppercase tracking-[0.23em] text-white/[0.13]">
                  {copy.system}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ==============================================================
            SEARCH
            ============================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: reducedMotion ? 0 : 0.1,
            duration: reducedMotion ? 0 : 0.6,
            ease: EASE,
          }}
          className="mt-16"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CrosshairIcon />

              <span className="text-[7px] uppercase tracking-[0.3em] text-white/[0.18]">
                {copy.searchCode}
              </span>
            </div>

            <span className="font-mono text-[7px] tracking-[0.18em] text-white/[0.13]">
              {String(
                filteredCharacters.length,
              ).padStart(2, "0")}{" "}
              /{" "}
              {String(
                characters.length,
              ).padStart(2, "0")}
            </span>
          </div>

          <form
            onSubmit={(event) =>
              event.preventDefault()
            }
            className="relative"
          >
            <div className="relative flex min-h-[66px] items-center overflow-hidden border border-white/[0.09] bg-white/[0.018] transition-colors duration-500 focus-within:border-[#c7a96b]/35">
              <span className="ml-5 text-white/[0.25]">
                <SearchIcon />
              </span>

              <input
                type="search"
                value={query}
                onChange={
                  handleSearchChange
                }
                placeholder={
                  copy.searchPlaceholder
                }
                aria-label={
                  copy.searchPlaceholder
                }
                className="min-w-0 flex-1 bg-transparent px-4 py-5 text-sm text-white outline-none placeholder:text-white/[0.2]"
              />

              {query && (
                <button
                  type="button"
                  onClick={clearQuery}
                  aria-label={
                    copy.clearSearch
                  }
                  className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center border border-white/[0.08] text-white/30 transition-all duration-300 hover:border-[#c7a96b]/30 hover:text-[#ead39a]"
                >
                  <XIcon />
                </button>
              )}

              <div className="mr-5 hidden items-center gap-2 sm:flex">
                <span className="h-px w-6 bg-white/[0.07]" />

                <span className="font-mono text-[7px] tracking-[0.18em] text-white/[0.14]">
                  SEARCH
                </span>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[#c7a96b] via-[#ead39a]/60 to-transparent transition-transform duration-500 focus-within:scale-x-100"
              />
            </div>
          </form>
        </motion.section>

        {/* ==============================================================
            FILTERS
            ============================================================== */}

        <section className="mt-4">
          <div className="hidden border-y border-white/[0.055] lg:block">
            <div className="grid min-h-[98px] grid-cols-[minmax(0,1fr)_auto_auto_auto]">
              <FilterGroup
                label={copy.project}
                value={
                  projectFilter
                }
                options={[
                  {
                    value: "all",
                    label:
                      copy.allProjects,
                  },
                  ...archiveProjects.map(
                    (project) => ({
                      value:
                        project.slug,
                      label:
                        project.title,
                    }),
                  ),
                ]}
                onChange={
                  setProject
                }
              />

              <FilterGroup
                label={copy.role}
                value={
                  categoryFilter
                }
                options={[
                  {
                    value: "all",
                    label:
                      copy.allRoles,
                  },
                  {
                    value: "MAIN",
                    label: copy.main,
                  },
                  {
                    value: "SUPPORTING",
                    label:
                      copy.supporting,
                  },
                ]}
                onChange={
                  setCategory
                }
              />

              <FilterGroup
                label={copy.gender}
                value={
                  genderFilter
                }
                options={[
                  {
                    value: "all",
                    label:
                      copy.allGenders,
                  },
                  {
                    value: "MALE",
                    label: copy.male,
                  },
                  {
                    value: "FEMALE",
                    label:
                      copy.female,
                  },
                ]}
                onChange={
                  setGender
                }
              />

              <button
                type="button"
                onClick={
                  resetFilters
                }
                disabled={
                  !hasFilters
                }
                className={cx(
                  "flex min-w-[118px] items-center justify-center gap-2 border-l border-white/[0.055] text-[7px] uppercase tracking-[0.25em] transition-all duration-300",
                  hasFilters
                    ? "text-white/38 hover:bg-white/[0.02] hover:text-white"
                    : "cursor-default text-white/[0.1]",
                )}
              >
                {copy.reset}

                {hasFilters && (
                  <span
                    className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[6px]"
                    style={{
                      background:
                        `${GOLD}18`,
                      color:
                        GOLD_LIGHT,
                    }}
                  >
                    {
                      activeFilterCount
                    }
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(
                  (value) =>
                    !value,
                )
              }
              aria-expanded={
                mobileFiltersOpen
              }
              className="flex min-h-[54px] w-full items-center justify-between border border-white/[0.08] bg-white/[0.018] px-4 text-[8px] uppercase tracking-[0.25em] text-white/48 transition-colors duration-300 hover:border-[#c7a96b]/20"
            >
              <span className="flex items-center gap-3">
                <SlidersIcon />

                {copy.filters}

                {activeFilterCount >
                  0 && (
                  <span
                    className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[7px]"
                    style={{
                      background:
                        `${GOLD}20`,
                      color:
                        GOLD_LIGHT,
                    }}
                  >
                    {
                      activeFilterCount
                    }
                  </span>
                )}
              </span>

              <span className="font-mono text-[9px] text-white/24">
                {mobileFiltersOpen
                  ? "—"
                  : "+"}
              </span>
            </button>

            {mobileFiltersOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                transition={{
                  duration:
                    reducedMotion
                      ? 0
                      : 0.32,
                  ease: EASE,
                }}
                className="overflow-hidden border-x border-b border-white/[0.07] bg-white/[0.012]"
              >
                <div className="space-y-5 p-5">
                  <MobileFilter
                    label={
                      copy.project
                    }
                    value={
                      projectFilter
                    }
                    options={[
                      {
                        value: "all",
                        label:
                          copy.allProjects,
                      },
                      ...archiveProjects.map(
                        (
                          project,
                        ) => ({
                          value:
                            project.slug,
                          label:
                            project.title,
                        }),
                      ),
                    ]}
                    onChange={
                      setProject
                    }
                  />

                  <MobileFilter
                    label={
                      copy.role
                    }
                    value={
                      categoryFilter
                    }
                    options={[
                      {
                        value: "all",
                        label:
                          copy.allRoles,
                      },
                      {
                        value: "MAIN",
                        label:
                          copy.main,
                      },
                      {
                        value:
                          "SUPPORTING",
                        label:
                          copy.supporting,
                      },
                    ]}
                    onChange={
                      setCategory
                    }
                  />

                  <MobileFilter
                    label={
                      copy.gender
                    }
                    value={
                      genderFilter
                    }
                    options={[
                      {
                        value: "all",
                        label:
                          copy.allGenders,
                      },
                      {
                        value: "MALE",
                        label:
                          copy.male,
                      },
                      {
                        value:
                          "FEMALE",
                        label:
                          copy.female,
                      },
                    ]}
                    onChange={
                      setGender
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMobileFiltersOpen(
                        false,
                      )
                    }
                    className="flex min-h-[45px] w-full items-center justify-center border border-white/[0.08] text-[8px] uppercase tracking-[0.24em] text-white/38 transition-all duration-300 hover:border-[#c7a96b]/30 hover:text-white"
                  >
                    {copy.all}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ==============================================================
            ACTIVE FILTER RAIL
            ============================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            height: 0,
          }}
          animate={{
            opacity: hasFilters
              ? 1
              : 0,
            height: hasFilters
              ? "auto"
              : 0,
          }}
          transition={{
            duration:
              reducedMotion ? 0 : 0.26,
            ease: EASE,
          }}
          className="overflow-hidden"
          aria-hidden={!hasFilters}
        >
          <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.055] py-4">
            <span className="mr-1 text-[6px] uppercase tracking-[0.3em] text-white/[0.16]">
              {copy.activeFilters}
            </span>

            {query.trim() && (
              <ActiveFilterChip
                label={`“${query.trim()}”`}
                onRemove={
                  clearQuery
                }
              />
            )}

            {projectFilter !==
              "all" && (
              <ActiveFilterChip
                label={
                  archiveProjects.find(
                    (project) =>
                      project.slug ===
                      projectFilter,
                  )?.title ??
                  projectFilter
                }
                onRemove={
                  removeProjectFilter
                }
              />
            )}

            {categoryFilter !==
              "all" && (
              <ActiveFilterChip
                label={
                  categoryFilter ===
                  "MAIN"
                    ? copy.main
                    : copy.supporting
                }
                onRemove={
                  removeCategoryFilter
                }
              />
            )}

            {genderFilter !==
              "all" && (
              <ActiveFilterChip
                label={
                  genderFilter ===
                  "MALE"
                    ? copy.male
                    : copy.female
                }
                onRemove={
                  removeGenderFilter
                }
              />
            )}

            <button
              type="button"
              onClick={
                resetFilters
              }
              className="ml-auto text-[6px] uppercase tracking-[0.25em] text-white/[0.19] transition-colors duration-300 hover:text-white/50"
            >
              {copy.clearFilters}
            </button>
          </div>
        </motion.section>

        {/* ==============================================================
            RESULT META
            ============================================================== */}

        <motion.section
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay:
              reducedMotion
                ? 0
                : 0.16,
            duration:
              reducedMotion
                ? 0
                : 0.48,
          }}
          className="mt-8 flex flex-col gap-5 border-b border-white/[0.055] pb-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="h-[4px] w-[4px] shrink-0 rounded-full"
              style={{
                background: GOLD,
                boxShadow:
                  `0 0 8px ${GOLD}30`,
              }}
            />

            <span className="text-[7px] uppercase tracking-[0.28em] text-white/[0.21]">
              {activeCharacter
                ? copy.selected
                : copy.results}
            </span>

            <span className="hidden h-px w-6 bg-white/[0.07] sm:block" />

            <span className="hidden truncate text-[7px] uppercase tracking-[0.25em] text-white/[0.14] sm:block">
              {activeCharacter
                ? activeCharacter.name
                : copy.allCharacters}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[10px] tracking-[0.15em]"
                style={{
                  color:
                    `${GOLD_LIGHT}68`,
                }}
              >
                {String(
                  filteredCharacters.length,
                ).padStart(2, "0")}
              </span>

              <span className="font-mono text-[7px] tracking-[0.15em] text-white/[0.15]">
                /
                {String(
                  characters.length,
                ).padStart(2, "0")}
              </span>
            </div>

            <div className="hidden h-5 w-px bg-white/[0.07] sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-[6px] uppercase tracking-[0.25em] text-white/[0.12]">
                {copy.view}
              </span>

              <ViewToggle
                mode={viewMode}
                onChange={setView}
                gridLabel={copy.grid}
                listLabel={copy.list}
              />
            </div>
          </div>
        </motion.section>

        {/* ==============================================================
            DOSSIER SIGNAL
            ============================================================== */}

        <motion.section
          initial={false}
          animate={{
            opacity:
              activeCharacter ? 1 : 0,
            y:
              activeCharacter
                ? 0
                : 6,
            height:
              activeCharacter
                ? "auto"
                : 0,
          }}
          transition={{
            duration:
              reducedMotion ? 0 : 0.28,
            ease: EASE,
          }}
          className="overflow-hidden"
          aria-hidden={
            !activeCharacter
          }
        >
          {activeCharacter && (
            <div className="flex flex-col gap-4 border-b border-white/[0.055] py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-[6px] uppercase tracking-[0.28em]"
                    style={{
                      color:
                        `${GOLD_LIGHT}62`,
                    }}
                  >
                    {copy.currentSelection}
                  </span>

                  <span className="h-px w-6 bg-white/[0.08]" />

                  <span className="font-mono text-[6px] tracking-[0.2em] text-white/[0.12]">
                    {activeCharacter.id}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-4">
                  <h2 className="truncate text-[clamp(1.45rem,2.4vw,2.2rem)] font-[440] uppercase leading-none tracking-[-0.045em] text-white">
                    {
                      activeCharacter.name
                    }
                  </h2>

                  <span
                    className="hidden text-[6px] uppercase tracking-[0.26em] sm:inline"
                    style={{
                      color:
                        `${GOLD_LIGHT}58`,
                    }}
                  >
                    {getRoleLabel(
                      activeCharacter.category,
                      locale,
                    )}
                  </span>
                </div>
              </div>

              <Link
                href={
                  locale ===
                  "en"
                    ? `/en/characters/${activeCharacter.slug}`
                    : `/likovi/${activeCharacter.slug}`
                }
                className="group/dossier inline-flex shrink-0 items-center gap-3 self-start border border-white/[0.09] px-4 py-3 transition-all duration-300 hover:border-[#c7a96b]/35 hover:bg-white/[0.018] sm:self-auto"
              >
                <span
                  className="text-[7px] uppercase tracking-[0.26em]"
                  style={{
                    color:
                      `${GOLD_LIGHT}72`,
                  }}
                >
                  {copy.dossier}
                </span>

                <ArrowUpRightIcon
                  size={13}
                />
              </Link>
            </div>
          )}
        </motion.section>

        {/* ==============================================================
            ARCHIVE
            ============================================================== */}

        {filteredCharacters.length ===
        0 ? (
          <EmptyState
            copy={copy}
            onReset={
              resetFilters
            }
            reducedMotion={
              reducedMotion
            }
          />
        ) : viewMode ===
          "grid" ? (
          <motion.section
            layout
            className="mt-5 grid grid-cols-1 gap-px bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3"
            aria-label={
              copy.characterIndex
            }
          >
            {filteredCharacters.map(
              (
                character,
                index,
              ) => (
                <ArchiveCard
                  key={
                    character.id
                  }
                  character={
                    character
                  }
                  index={index}
                  total={
                    filteredCharacters.length
                  }
                  locale={locale}
                  active={
                    activeCharacterId ===
                    character.id
                  }
                  reducedMotion={
                    reducedMotion
                  }
                  onEnter={() =>
                    setActiveCharacterId(
                      character.id,
                    )
                  }
                  onLeave={() =>
                    setActiveCharacterId(
                      null,
                    )
                  }
                  actionLabel={
                    copy.dossier
                  }
                  openingLabel={
                    copy.opening
                  }
                />
              ),
            )}
          </motion.section>
        ) : (
          <motion.section
            layout
            className="mt-5 border-y border-white/[0.055]"
            aria-label={
              copy.characterIndex
            }
          >
            {filteredCharacters.map(
              (
                character,
                index,
              ) => (
                <ArchiveListRow
                  key={
                    character.id
                  }
                  character={
                    character
                  }
                  index={index}
                  total={
                    filteredCharacters.length
                  }
                  locale={locale}
                  active={
                    activeCharacterId ===
                    character.id
                  }
                  reducedMotion={
                    reducedMotion
                  }
                  onEnter={() =>
                    setActiveCharacterId(
                      character.id,
                    )
                  }
                  onLeave={() =>
                    setActiveCharacterId(
                      null,
                    )
                  }
                  openLabel={
                    copy.open
                  }
                />
              ),
            )}
          </motion.section>
        )}

        {/* ==============================================================
            FOOTER
            ============================================================== */}

        <section className="mt-14 border-t border-white/[0.055] pt-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-[5px] h-px w-8"
                style={{
                  background:
                    `${GOLD}48`,
                }}
              />

              <div>
                <div className="font-mono text-[7px] uppercase tracking-[0.3em] text-white/[0.15]">
                  UMBRA / CHARACTER ARCHIVE
                </div>

                <div className="mt-2 max-w-[520px] text-[8px] leading-5 text-white/[0.16]">
                  {copy.archiveNote}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-[7px] tracking-[0.18em] text-white/[0.13]">
                {copy.characterIndex}
              </span>

              <span className="h-px w-7 bg-white/[0.07]" />

              <Link
                href={
                  locale ===
                  "en"
                    ? "/en"
                    : "/"
                }
                className="text-[7px] uppercase tracking-[0.22em] text-white/25 transition-colors duration-300 hover:text-[#ead39a]"
              >
                {copy.backHome}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ==========================================================================
   FILTER GROUP
   ========================================================================== */

function FilterGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 items-center border-r border-white/[0.055] px-5">
      <div className="min-w-0">
        <div className="mb-2 text-[7px] uppercase tracking-[0.27em] text-white/[0.17]">
          {label}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {options.map(
            (option) => {
              const active =
                value ===
                option.value;

              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    onChange(
                      option.value,
                    )
                  }
                  className={cx(
                    "rounded-full border px-3 py-1.5 text-[7px] uppercase tracking-[0.17em] transition-all duration-300",
                    active
                      ? "border-[#c7a96b]/45 bg-[#c7a96b]/[0.065] text-[#ead39a]"
                      : "border-white/[0.055] text-white/24 hover:border-white/[0.14] hover:bg-white/[0.02] hover:text-white/55",
                  )}
                >
                  {
                    option.label
                  }
                </button>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MOBILE FILTER
   ========================================================================== */

function MobileFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-[7px] uppercase tracking-[0.26em] text-white/[0.2]">
        {label}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {options.map(
          (option) => {
            const active =
              value ===
              option.value;

            return (
              <button
                key={
                  option.value
                }
                type="button"
                onClick={() =>
                  onChange(
                    option.value,
                  )
                }
                className={cx(
                  "rounded-full border px-3 py-2 text-[7px] uppercase tracking-[0.18em] transition-all duration-300",
                  active
                    ? "border-[#c7a96b]/45 bg-[#c7a96b]/[0.07] text-[#ead39a]"
                    : "border-white/[0.07] text-white/28 hover:border-white/[0.14] hover:bg-white/[0.02] hover:text-white/55",
                )}
              >
                {
                  option.label
                }
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   ACTIVE FILTER CHIP
   ========================================================================== */

function ActiveFilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onRemove
      }
      className="group/chip inline-flex items-center gap-2 border border-[#c7a96b]/20 bg-[#c7a96b]/[0.035] px-3 py-2 text-[6px] uppercase tracking-[0.2em] text-[#ead39a]/75 transition-all duration-300 hover:border-[#c7a96b]/40 hover:bg-[#c7a96b]/[0.06]"
    >
      <span>
        {label}
      </span>

      <span className="text-white/[0.2] transition-colors duration-300 group-hover/chip:text-[#ead39a]/70">
        ×
      </span>
    </button>
  );
}

/* ==========================================================================
   VIEW TOGGLE
   ========================================================================== */

function ViewToggle({
  mode,
  onChange,
  gridLabel,
  listLabel,
}: {
  mode: ViewMode;
  onChange: (
    mode: ViewMode,
  ) => void;
  gridLabel: string;
  listLabel: string;
}) {
  return (
    <div className="flex items-center border border-white/[0.07]">
      <button
        type="button"
        onClick={() =>
          onChange("grid")
        }
        aria-label={gridLabel}
        aria-pressed={
          mode === "grid"
        }
        className={cx(
          "flex h-8 w-9 items-center justify-center transition-all duration-300",
          mode === "grid"
            ? "bg-[#c7a96b]/[0.07] text-[#ead39a]"
            : "text-white/[0.24] hover:text-white/50",
        )}
      >
        <GridIcon />
      </button>

      <button
        type="button"
        onClick={() =>
          onChange("list")
        }
        aria-label={listLabel}
        aria-pressed={
          mode === "list"
        }
        className={cx(
          "flex h-8 w-9 items-center justify-center border-l border-white/[0.07] transition-all duration-300",
          mode === "list"
            ? "bg-[#c7a96b]/[0.07] text-[#ead39a]"
            : "text-white/[0.24] hover:text-white/50",
        )}
      >
        <ListIcon />
      </button>
    </div>
  );
}

/* ==========================================================================
   EMPTY STATE
   ========================================================================== */

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
      className="relative mt-5 flex min-h-[440px] items-center justify-center overflow-hidden border-y border-white/[0.055]"
    >
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.045]" />

      <div className="absolute left-1/2 top-1/2 h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.07]" />

      <div className="relative z-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.1] text-white/25">
          <CrosshairIcon />
        </div>

        <div
          className="mt-5 font-mono text-[7px] uppercase tracking-[0.28em]"
          style={{
            color:
              `${GOLD_LIGHT}65`,
          }}
        >
          {copy.emptyCode}
        </div>

        <h2 className="mt-4 max-w-[500px] text-xl font-[430] uppercase tracking-[-0.02em] text-white/[0.84]">
          {copy.noResults}
        </h2>

        <button
          type="button"
          onClick={
            onReset
          }
          className="mt-7 border border-white/[0.09] px-5 py-3 text-[8px] uppercase tracking-[0.25em] text-white/[0.38] transition-all duration-300 hover:border-[#c7a96b]/40 hover:text-white"
        >
          {copy.clearFilters}
        </button>
      </div>
    </motion.section>
  );
}

/* ==========================================================================
   ARCHIVE CARD
   ========================================================================== */

function ArchiveCard({
  character,
  index,
  total,
  locale,
  active,
  reducedMotion,
  onEnter,
  onLeave,
  actionLabel,
  openingLabel,
}: {
  character: Character;
  index: number;
  total: number;
  locale: Locale;
  active: boolean;
  reducedMotion: boolean;
  onEnter: () => void;
  onLeave: () => void;
  actionLabel: string;
  openingLabel: string;
}) {
  const category =
    character.category ===
    "MAIN"
      ? locale === "en"
        ? "Main"
        : "Glavni"
      : locale === "en"
        ? "Supporting"
        : "Sporedni";

  const href =
    locale === "en"
      ? `/en/characters/${character.slug}`
      : `/likovi/${character.slug}`;

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration:
          reducedMotion
            ? 0
            : 0.55,
        delay:
          reducedMotion
            ? 0
            : Math.min(
                index * 0.035,
                0.2,
              ),
        ease: EASE,
      }}
      onMouseEnter={
        onEnter
      }
      onMouseLeave={
        onLeave
      }
      className="group relative min-h-[470px] overflow-hidden bg-[#070707] sm:min-h-[510px]"
    >
      <motion.div
        animate={{
          scale:
            active &&
            !reducedMotion
              ? 1.045
              : 1,
        }}
        transition={{
          duration:
            reducedMotion
              ? 0
              : 1,
          ease: EASE,
        }}
        className="pointer-events-none absolute inset-[-22px]"
      >
        <Image
          src={
            character.image ??
            "/umbra-avatar.png"
          }
          alt={
            character.name
          }
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center opacity-[0.58] grayscale transition-all duration-700 group-hover:opacity-[0.92] group-hover:grayscale-0"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.14)_0%,rgba(0,0,0,.05)_34%,rgba(0,0,0,.3)_58%,rgba(0,0,0,.96)_100%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.22),transparent_38%,transparent_72%,rgba(0,0,0,.18))]" />

      <motion.div
        aria-hidden="true"
        animate={{
          opacity: active
            ? 1
            : 0,
        }}
        transition={{
          duration:
            reducedMotion
              ? 0
              : 0.35,
        }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_24%,rgba(199,169,107,.12),transparent_38%)]"
      />

      <div
        className={cx(
          "pointer-events-none absolute border transition-all duration-500",
          active
            ? "inset-4 border-white/[0.13]"
            : "inset-5 border-white/[0.05]",
        )}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-5 h-9 w-9 border-l border-t transition-colors duration-500"
        style={{
          borderColor:
            active
              ? `${GOLD}68`
              : "rgba(255,255,255,.07)",
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 right-5 h-9 w-9 border-b border-r transition-colors duration-500"
        style={{
          borderColor:
            active
              ? `${GOLD}55`
              : "rgba(255,255,255,.055)",
        }}
      />

      <div className="pointer-events-none absolute left-7 right-7 top-7 z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[7px] tracking-[0.22em] text-white/28">
            {String(
              index + 1,
            ).padStart(
              2,
              "0",
            )}
          </span>

          <span className="h-px w-6 bg-white/[0.09]" />

          <span
            className="font-mono text-[6px] uppercase tracking-[0.22em]"
            style={{
              color:
                `${GOLD_LIGHT}58`,
            }}
          >
            UMBRA
          </span>
        </div>

        <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-white/[0.17]">
          {String(
            index + 1,
          ).padStart(
            2,
            "0",
          )}{" "}
          /{" "}
          {String(total).padStart(
            2,
            "0",
          )}
        </span>
      </div>

      <motion.div
        initial={false}
        animate={{
          opacity:
            active
              ? 1
              : 0,
          scale:
            active
              ? 1
              : 0.72,
        }}
        transition={{
          duration:
            reducedMotion
              ? 0
              : 0.3,
        }}
        className="pointer-events-none absolute left-1/2 top-[42%] z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.16] bg-black/15 backdrop-blur-md"
      >
        <div className="absolute inset-[7px] rounded-full border border-[#c7a96b]/25" />

        <CrosshairIcon />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-7 bottom-7 z-20">
        <div className="mb-3 flex items-center gap-3">
          <span
            className="text-[7px] uppercase tracking-[0.3em]"
            style={{
              color:
                `${GOLD_LIGHT}82`,
            }}
          >
            {category}
          </span>

          <span className="h-px w-5 bg-white/[0.1]" />

          <span className="truncate text-[7px] uppercase tracking-[0.24em] text-white/25">
            {
              character.projectTitle ??
              ""
            }
          </span>
        </div>

        <div className="flex items-end justify-between gap-5">
          <div className="min-w-0">
            <h2 className="text-[clamp(2rem,3.5vw,3.45rem)] font-[430] uppercase leading-[0.9] tracking-[-0.06em] text-white transition-transform duration-500 group-hover:-translate-y-1">
              {character.name}
            </h2>

            <p className="mt-3 max-h-0 max-w-[340px] overflow-hidden text-[10px] leading-5 text-white/0 transition-all duration-500 group-hover:max-h-20 group-hover:text-white/40">
              {
                character.shortDescription ??
                ""
              }
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.1] text-white/32 transition-all duration-500 group-hover:border-[#c7a96b]/45 group-hover:bg-[#c7a96b]/[0.06] group-hover:text-[#ead39a]">
            <ArrowUpRightIcon />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="text-[7px] uppercase tracking-[0.24em] text-white/30">
            {active
              ? openingLabel
              : actionLabel}
          </span>

          <span className="h-px flex-1 bg-white/[0.08]" />
        </div>
      </div>

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-30 h-px w-full origin-left"
        animate={{
          scaleX:
            active
              ? 1
              : 0.05,
        }}
        transition={{
          duration:
            reducedMotion
              ? 0
              : 0.55,
          ease: EASE,
        }}
        style={{
          background:
            `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}45, transparent)`,
        }}
      />

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-30 w-px origin-bottom"
        animate={{
          scaleY:
            active
              ? 1
              : 0,
        }}
        transition={{
          duration:
            reducedMotion
              ? 0
              : 0.45,
          ease: EASE,
        }}
        style={{
          background:
            `linear-gradient(180deg, ${GOLD}, transparent 78%)`,
        }}
      />

      <Link
        href={href}
        aria-label={
          locale === "en"
            ? `Open character ${character.name}`
            : `Otvori lik ${character.name}`
        }
        className="absolute inset-0 z-40"
        onFocus={
          onEnter
        }
        onBlur={
          onLeave
        }
      />
    </motion.article>
  );
}

/* ==========================================================================
   ARCHIVE LIST ROW
   ========================================================================== */

function ArchiveListRow({
  character,
  index,
  total,
  locale,
  active,
  reducedMotion,
  onEnter,
  onLeave,
  openLabel,
}: {
  character: Character;
  index: number;
  total: number;
  locale: Locale;
  active: boolean;
  reducedMotion: boolean;
  onEnter: () => void;
  onLeave: () => void;
  openLabel: string;
}) {
  const href =
    locale === "en"
      ? `/en/characters/${character.slug}`
      : `/likovi/${character.slug}`;

  const category =
    getRoleLabel(
      character.category,
      locale,
    );

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
        duration:
          reducedMotion ? 0 : 0.38,
        delay:
          reducedMotion
            ? 0
            : Math.min(
                index * 0.018,
                0.12,
              ),
        ease: EASE,
      }}
      onMouseEnter={
        onEnter
      }
      onMouseLeave={
        onLeave
      }
      className={cx(
        "group relative overflow-hidden border-b border-white/[0.05] bg-[#050505] transition-colors duration-300",
        active &&
          "bg-white/[0.018]",
      )}
    >
      <Link
        href={href}
        className="relative flex min-h-[84px] items-center gap-4 px-3 py-5 outline-none sm:px-5 lg:px-6"
        onFocus={
          onEnter
        }
        onBlur={
          onLeave
        }
      >
        <span className="w-[34px] shrink-0 font-mono text-[7px] tracking-[0.22em] text-white/[0.14] sm:w-[54px]">
          {String(
            index + 1,
          ).padStart(
            2,
            "0",
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="truncate text-[19px] font-[440] uppercase leading-none tracking-[-0.025em] text-white/[0.86] transition-colors duration-300 group-hover:text-white sm:text-[22px]">
              {character.name}
            </h2>

            <span
              className="text-[6px] uppercase tracking-[0.28em]"
              style={{
                color:
                  `${GOLD_LIGHT}6c`,
              }}
            >
              {category}
            </span>
          </div>

          <div className="mt-2 flex min-w-0 items-center gap-3">
            <span className="truncate text-[7px] uppercase tracking-[0.22em] text-white/[0.18]">
              {
                character.projectTitle ??
                ""
              }
            </span>

            
          </div>
        </div>

        <span className="hidden w-[80px] shrink-0 text-right font-mono text-[6px] tracking-[0.18em] text-white/[0.12] sm:block">
          {String(
            index + 1,
          ).padStart(
            2,
            "0",
          )}{" "}
          /{" "}
          {String(total).padStart(
            2,
            "0",
          )}
        </span>

        <span
          className={cx(
            "flex h-9 w-9 shrink-0 items-center justify-center border transition-all duration-300",
            active
              ? "border-[#c7a96b]/35 bg-[#c7a96b]/[0.04] text-[#ead39a]"
              : "border-white/[0.07] text-white/[0.22] group-hover:border-white/[0.15] group-hover:text-white/[0.5]",
          )}
        >
          <ArrowRightIcon />
        </span>

        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-full origin-left"
          animate={{
            scaleX:
              active ? 1 : 0.02,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.48,
            ease: EASE,
          }}
          style={{
            background:
              `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 72%)`,
          }}
        />

        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-px origin-bottom"
          animate={{
            scaleY:
              active ? 1 : 0,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.42,
            ease: EASE,
          }}
          style={{
            background:
              `linear-gradient(180deg, ${GOLD_LIGHT}, transparent 76%)`,
          }}
        />
      </Link>
    </motion.article>
  );
}