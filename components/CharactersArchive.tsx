"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useMemo,
  useState,
  type ChangeEvent,
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
  characters,
  type Character,
  type CharacterCategory,
  type CharacterGender,
} from "@/data/characters";

const GOLD = "#b99a61";
const GOLD_LIGHT = "#d6b776";

type Locale = "sr" | "en";
type ProjectFilter = "all" | string;
type CategoryFilter = "all" | CharacterCategory;
type GenderFilter = "all" | Exclude<CharacterGender, null>;

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
    eyebrow: "Arhiva likova",
    titleA: "Ljudi",
    titleB: "iza priča.",
    description:
      "Likovi koji nose svetove Umbra Studija. Istraži postavu, pronađi karakter ili otvori njegov dosije.",
    searchPlaceholder: "Pretraži likove...",
    allProjects: "Svi projekti",
    allRoles: "Sve uloge",
    allGenders: "Svi",
    all: "Svi",
    main: "Glavni",
    supporting: "Sporedni",
    male: "Muški",
    female: "Ženski",
    filters: "Filteri",
    reset: "Resetuj",
    archive: "Arhiva",
    registered: "registrovanih",
    currentSelection: "Trenutna selekcija",
    noResults: "Nijedan lik ne odgovara zadatom izboru.",
    clearSearch: "Obriši pretragu",
    project: "Projekat",
    role: "Uloga",
    gender: "Pol",
    system: "Narativna postava / vizuelni registar",
    archiveCode: "UMBRA / CAST / INDEX",
    searchCode: "SEARCH / FILTER / ACCESS",
    allCharacters: "Svi registrovani likovi",
    results: "Rezultati",
    emptyCode: "ARCHIVE / NO MATCH",
    clearFilters: "Očisti filtere",
    dossier: "Otvori dosije",
    characterIndex: "Indeks likova",
    backHome: "Nazad na početnu",
    opening: "Otvaranje dosijea",
  },

  en: {
    eyebrow: "Character archive",
    titleA: "People",
    titleB: "behind the stories.",
    description:
      "The characters carrying the worlds of Umbra Studio. Explore the cast, find a character or open a dossier.",
    searchPlaceholder: "Search characters...",
    allProjects: "All projects",
    allRoles: "All roles",
    allGenders: "All",
    all: "All",
    main: "Main",
    supporting: "Supporting",
    male: "Male",
    female: "Female",
    filters: "Filters",
    reset: "Reset",
    archive: "Archive",
    registered: "registered",
    currentSelection: "Current selection",
    noResults: "No character matches the current selection.",
    clearSearch: "Clear search",
    project: "Project",
    role: "Role",
    gender: "Gender",
    system: "Narrative cast / visual register",
    archiveCode: "UMBRA / CAST / INDEX",
    searchCode: "SEARCH / FILTER / ACCESS",
    allCharacters: "All registered characters",
    results: "Results",
    emptyCode: "ARCHIVE / NO MATCH",
    clearFilters: "Clear filters",
    dossier: "Open dossier",
    characterIndex: "Character index",
    backHome: "Back to home",
    opening: "Opening dossier",
  },
} as const;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clamp(value: number, min = -1, max = 1) {
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
      <circle cx="11" cy="11" r="6.5" />
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
      <circle cx="13" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function ArrowUpRightIcon({ size = 16 }: { size?: number }) {
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
      <circle cx="12" cy="12" r="6" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
    </svg>
  );
}

export default function CharactersArchive({
  locale,
}: CharactersArchiveProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const copy = copyByLocale[locale];

  const [query, setQuery] = useState("");
  const [projectFilter, setProjectFilter] =
    useState<ProjectFilter>("all");
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("all");
  const [genderFilter, setGenderFilter] =
    useState<GenderFilter>("all");
  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);
  const [activeCharacterId, setActiveCharacterId] =
    useState<string | null>(null);

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
    reducedMotion ? [0, 0] : [-12, 12],
  );

  const atmosphereY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion ? [0, 0] : [-8, 8],
  );

  const headingX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion ? [0, 0] : [-3, 3],
  );

  const headingY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion ? [0, 0] : [-2, 2],
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

    const rect = event.currentTarget.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    pointerX.set(
      clamp(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
      ),
    );

    pointerY.set(
      clamp(
        ((event.clientY - rect.top) / rect.height) * 2 - 1,
      ),
    );
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const archiveProjects = useMemo<ArchiveProject[]>(() => {
    const map = new Map<string, string>();

    characters.forEach((character) => {
      const slug = character.projectSlug;
      const title = character.projectTitle;

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
    });

    return Array.from(map.entries()).map(([slug, title]) => ({
      slug,
      title,
    }));
  }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase();

  const filteredCharacters = useMemo(
    () =>
      characters.filter((character) => {
        const searchable = [
          character.name,
          character.projectTitle ?? "",
          character.shortDescription ?? "",
        ]
          .join(" ")
          .toLocaleLowerCase();

        const matchesQuery =
          !normalizedQuery ||
          searchable.includes(normalizedQuery);

        const matchesProject =
          projectFilter === "all" ||
          character.projectSlug === projectFilter;

        const matchesCategory =
          categoryFilter === "all" ||
          character.category === categoryFilter;

        const matchesGender =
          genderFilter === "all" ||
          character.gender === genderFilter;

        return (
          matchesQuery &&
          matchesProject &&
          matchesCategory &&
          matchesGender
        );
      }),
    [
      categoryFilter,
      genderFilter,
      normalizedQuery,
      projectFilter,
    ],
  );

  const activeFilterCount = [
    query.trim(),
    projectFilter !== "all" ? projectFilter : "",
    categoryFilter !== "all" ? categoryFilter : "",
    genderFilter !== "all" ? genderFilter : "",
  ].filter(Boolean).length;

  const hasFilters = activeFilterCount > 0;

  const activeCharacter = characters.find(
    (character) => character.id === activeCharacterId,
  );

  const resetFilters = () => {
    setQuery("");
    setProjectFilter("all");
    setCategoryFilter("all");
    setGenderFilter("all");
  };

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      {/* ATMOSPHERE */}
      <motion.div
        aria-hidden="true"
        style={{
          x: atmosphereX,
          y: atmosphereY,
        }}
        className="pointer-events-none fixed inset-[-10%] z-0"
      >
        <div className="absolute left-[3%] top-[10%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(185,154,97,.042),transparent_68%)] blur-3xl" />
        <div className="absolute right-[-5%] top-[36%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.018),transparent_70%)] blur-3xl" />
        <div className="absolute left-[35%] top-[74%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(185,154,97,.018),transparent_70%)] blur-3xl" />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,#050505_0%,#060606_45%,#050505_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.15]"
      >
        <div className="absolute left-[5%] top-0 h-full w-px bg-white/[0.018]" />
        <div className="absolute right-[5%] top-0 h-full w-px bg-white/[0.018]" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/[0.012]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-28 pt-36 sm:px-8 sm:pb-36 lg:px-12 lg:pt-44">
        {/* HERO */}
        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.72,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            style={{
              x: headingX,
              y: headingY,
            }}
            className="grid gap-14 lg:grid-cols-[1fr_300px] lg:items-end"
          >
            <div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-10"
                  style={{
                    background: `${GOLD}82`,
                  }}
                />
                <span
                  className="text-[8px] font-semibold uppercase tracking-[0.45em]"
                  style={{
                    color: GOLD_LIGHT,
                  }}
                >
                  {copy.eyebrow}
                </span>
              </div>

              <h1 className="mt-7 max-w-[1050px] text-[clamp(4rem,8.6vw,9rem)] font-[440] uppercase leading-[0.8] tracking-[-0.075em]">
                {copy.titleA}
                <br />
                <span className="font-serif font-normal italic text-white/74">
                  {copy.titleB}
                </span>
              </h1>

              <div className="mt-10 flex items-center gap-4">
                <div
                  className="h-px max-w-[560px] flex-1"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}70, rgba(255,255,255,.08), transparent)`,
                  }}
                />

                <span className="hidden font-mono text-[6px] tracking-[0.28em] text-white/[0.12] sm:inline">
                  {copy.archiveCode}
                </span>
              </div>

              <p className="mt-7 max-w-[630px] text-sm leading-7 text-white/38 sm:text-[15px] sm:leading-8">
                {copy.description}
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="relative border-l border-white/[0.07] pl-6">
                <span
                  aria-hidden="true"
                  className="absolute left-[-1px] top-0 h-11 w-px"
                  style={{
                    background: `linear-gradient(180deg, ${GOLD}70, transparent)`,
                  }}
                />

                <div className="flex items-center justify-between">
                  <span className="text-[7px] uppercase tracking-[0.3em] text-white/20">
                    {copy.archive}
                  </span>

                  <span className="font-mono text-[6px] tracking-[0.18em] text-white/[0.12]">
                    001
                  </span>
                </div>

                <div className="mt-4 flex items-end gap-3">
                  <span
                    className="font-mono text-[42px] leading-none"
                    style={{
                      color: `${GOLD_LIGHT}76`,
                    }}
                  >
                    {String(characters.length).padStart(2, "0")}
                  </span>

                  <span className="pb-1 text-[7px] uppercase tracking-[0.24em] text-white/20">
                    {copy.registered}
                  </span>
                </div>

                <div className="mt-4 h-px bg-white/[0.05]" />

                <div className="mt-3 font-mono text-[6px] uppercase tracking-[0.23em] text-white/[0.13]">
                  {copy.system}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* SEARCH */}
        <motion.section
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: reducedMotion ? 0 : 0.12,
            duration: reducedMotion ? 0 : 0.6,
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
              {String(filteredCharacters.length).padStart(2, "0")} /{" "}
              {String(characters.length).padStart(2, "0")}
            </span>
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="relative"
          >
            <div className="relative flex min-h-[66px] items-center overflow-hidden border border-white/[0.09] bg-white/[0.02] transition-colors duration-500 focus-within:border-[#b99a61]/35">
              <span className="ml-5 text-white/25">
                <SearchIcon />
              </span>

              <input
                type="search"
                value={query}
                onChange={handleSearchChange}
                placeholder={copy.searchPlaceholder}
                aria-label={copy.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent px-4 py-5 text-sm text-white outline-none placeholder:text-white/[0.2]"
              />

              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label={copy.clearSearch}
                  data-cursor-interactive
                  className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center border border-white/[0.08] text-white/30 transition-all duration-300 hover:border-[#b99a61]/30 hover:text-[#d6b776]"
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

              <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[#b99a61] via-[#d6b776]/60 to-transparent transition-transform duration-500 focus-within:scale-x-100" />
            </div>
          </form>
        </motion.section>

        {/* DESKTOP FILTERS */}
        <section className="mt-4 hidden border-y border-white/[0.055] lg:block">
          <div className="grid min-h-[96px] grid-cols-[1fr_auto_auto_auto]">
            <FilterGroup
              label={copy.project}
              value={projectFilter}
              options={[
                {
                  value: "all",
                  label: copy.allProjects,
                },
                ...archiveProjects.map((project) => ({
                  value: project.slug,
                  label: project.title,
                })),
              ]}
              onChange={setProjectFilter}
            />

            <FilterGroup
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
                setCategoryFilter(value as CategoryFilter)
              }
            />

            <FilterGroup
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
                setGenderFilter(value as GenderFilter)
              }
            />

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilters}
              data-cursor-interactive
              className={cx(
                "flex min-w-[112px] items-center justify-center gap-2 border-l border-white/[0.055] text-[7px] uppercase tracking-[0.25em] transition-all duration-300",
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
                    background: `${GOLD}18`,
                    color: GOLD_LIGHT,
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* MOBILE FILTERS */}
        <section className="mt-4 lg:hidden">
          <button
            type="button"
            onClick={() =>
              setMobileFiltersOpen((value) => !value)
            }
            data-cursor-interactive
            className="flex min-h-[54px] w-full items-center justify-between border border-white/[0.08] bg-white/[0.02] px-4 text-[8px] uppercase tracking-[0.25em] text-white/48 transition-colors duration-300 hover:border-[#b99a61]/20"
          >
            <span className="flex items-center gap-3">
              <SlidersIcon />
              {copy.filters}

              {activeFilterCount > 0 && (
                <span
                  className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[7px]"
                  style={{
                    background: `${GOLD}20`,
                    color: GOLD_LIGHT,
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </span>

            <span className="font-mono text-[9px] text-white/24">
              {mobileFiltersOpen ? "—" : "+"}
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
                duration: reducedMotion ? 0 : 0.35,
              }}
              className="overflow-hidden border-x border-b border-white/[0.07] bg-white/[0.015]"
            >
              <div className="space-y-5 p-5">
                <MobileFilter
                  label={copy.project}
                  value={projectFilter}
                  options={[
                    {
                      value: "all",
                      label: copy.allProjects,
                    },
                    ...archiveProjects.map((project) => ({
                      value: project.slug,
                      label: project.title,
                    })),
                  ]}
                  onChange={setProjectFilter}
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
                    setCategoryFilter(value as CategoryFilter)
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
                    setGenderFilter(value as GenderFilter)
                  }
                />

                <button
                  type="button"
                  onClick={() => {
                    resetFilters();
                    setMobileFiltersOpen(false);
                  }}
                  data-cursor-interactive
                  className="flex min-h-[45px] w-full items-center justify-center border border-white/[0.08] text-[8px] uppercase tracking-[0.24em] text-white/38 transition-all duration-300 hover:border-[#b99a61]/30 hover:text-white"
                >
                  {copy.reset}
                </button>
              </div>
            </motion.div>
          )}
        </section>

        {/* RESULT HEADER */}
        <motion.section
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: reducedMotion ? 0 : 0.18,
            duration: reducedMotion ? 0 : 0.5,
          }}
          className="mt-10 flex min-h-[44px] items-center justify-between border-b border-white/[0.055] pb-4"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="h-[3px] w-[3px] shrink-0 rounded-full"
              style={{
                background: GOLD,
              }}
            />

            <span className="text-[7px] uppercase tracking-[0.28em] text-white/[0.2]">
              {activeCharacter
                ? copy.currentSelection
                : copy.results}
            </span>

            <span className="hidden h-px w-6 bg-white/[0.07] sm:block" />

            <span className="hidden truncate text-[7px] uppercase tracking-[0.25em] text-white/[0.14] sm:block">
              {activeCharacter
                ? activeCharacter.name
                : copy.allCharacters}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[10px] tracking-[0.15em]"
              style={{
                color: `${GOLD_LIGHT}68`,
              }}
            >
              {String(filteredCharacters.length).padStart(2, "0")}
            </span>

            <span className="font-mono text-[7px] tracking-[0.15em] text-white/[0.15]">
              /{String(characters.length).padStart(2, "0")}
            </span>
          </div>
        </motion.section>

        {/* ARCHIVE */}
        {filteredCharacters.length === 0 ? (
          <motion.section
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="relative flex min-h-[440px] items-center justify-center overflow-hidden border-b border-white/[0.055]"
          >
            <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b99a61]/[0.06]" />
            <div className="absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b99a61]/[0.08]" />

            <div className="relative z-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.1] text-white/25">
                <CrosshairIcon />
              </div>

              <div
                className="mt-5 font-mono text-[7px] uppercase tracking-[0.28em]"
                style={{
                  color: `${GOLD_LIGHT}65`,
                }}
              >
                {copy.emptyCode}
              </div>

              <h2 className="mt-4 max-w-[500px] text-xl font-medium text-white/85">
                {copy.noResults}
              </h2>

              <button
                type="button"
                onClick={resetFilters}
                data-cursor-interactive
                className="mt-6 border border-white/[0.09] px-5 py-3 text-[8px] uppercase tracking-[0.25em] text-white/38 transition-all duration-300 hover:border-[#b99a61]/40 hover:text-white"
              >
                {copy.clearFilters}
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.section
            layout
            className="mt-5 grid grid-cols-1 gap-px bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredCharacters.map((character, index) => (
              <ArchiveCard
                key={character.id}
                character={character}
                index={index}
                locale={locale}
                active={activeCharacterId === character.id}
                reducedMotion={reducedMotion}
                onEnter={() =>
                  setActiveCharacterId(character.id)
                }
                onLeave={() =>
                  setActiveCharacterId(null)
                }
                actionLabel={copy.dossier}
                openingLabel={copy.opening}
              />
            ))}
          </motion.section>
        )}

        {/* FOOT */}
        <section className="mt-14 border-t border-white/[0.055] pt-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                className="h-px w-8"
                style={{
                  background: `${GOLD}48`,
                }}
              />

              <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-white/[0.15]">
                UMBRA / CHARACTER ARCHIVE
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-[7px] tracking-[0.18em] text-white/[0.13]">
                {copy.characterIndex}
              </span>

              <span className="h-px w-7 bg-white/[0.07]" />

              <Link
                href={locale === "en" ? "/en" : "/"}
                data-cursor-interactive
                className="text-[7px] uppercase tracking-[0.22em] text-white/25 transition-colors duration-300 hover:text-[#d6b776]"
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
          {options.map((option) => {
            const active = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                data-cursor-interactive
                className={cx(
                  "rounded-full border px-3 py-1.5 text-[7px] uppercase tracking-[0.17em] transition-all duration-300",
                  active
                    ? "border-[#b99a61]/45 bg-[#b99a61]/[0.065] text-[#d6b776]"
                    : "border-white/[0.055] text-white/24 hover:border-white/[0.14] hover:bg-white/[0.02] hover:text-white/55",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
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
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-[7px] uppercase tracking-[0.26em] text-white/20">
        {label}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              data-cursor-interactive
              className={cx(
                "rounded-full border px-3 py-2 text-[7px] uppercase tracking-[0.18em] transition-all duration-300",
                active
                  ? "border-[#b99a61]/45 bg-[#b99a61]/[0.07] text-[#d6b776]"
                  : "border-white/[0.07] text-white/28 hover:border-white/[0.14] hover:bg-white/[0.02] hover:text-white/55",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ArchiveCard({
  character,
  index,
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
  locale: Locale;
  active: boolean;
  reducedMotion: boolean;
  onEnter: () => void;
  onLeave: () => void;
  actionLabel: string;
  openingLabel: string;
}) {
  const category =
    character.category === "MAIN"
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
        y: 20,
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
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative min-h-[470px] overflow-hidden bg-[#070707] sm:min-h-[500px]"
    >
      {/* IMAGE */}
      <motion.div
        animate={{
          scale: active && !reducedMotion ? 1.045 : 1,
        }}
        transition={{
          duration: reducedMotion ? 0 : 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-none absolute inset-[-22px]"
      >
        <Image
          src={character.image ?? "/umbra-avatar.png"}
          alt={character.name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center opacity-[0.58] grayscale transition-all duration-700 group-hover:opacity-[0.9] group-hover:grayscale-0"
        />
      </motion.div>

      {/* GRADE */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.14)_0%,rgba(0,0,0,.06)_34%,rgba(0,0,0,.28)_56%,rgba(0,0,0,.96)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.2),transparent_38%,transparent_72%,rgba(0,0,0,.18))]" />

      <motion.div
        aria-hidden="true"
        animate={{
          opacity: active ? 1 : 0,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.35,
        }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_24%,rgba(185,154,97,.12),transparent_38%)]"
      />

      {/* FRAME */}
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
          borderColor: active
            ? `${GOLD}68`
            : "rgba(255,255,255,.07)",
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 right-5 h-9 w-9 border-b border-r transition-colors duration-500"
        style={{
          borderColor: active
            ? `${GOLD}55`
            : "rgba(255,255,255,.055)",
        }}
      />

      {/* TOP DATA */}
      <div className="pointer-events-none absolute left-7 right-7 top-7 z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[7px] tracking-[0.22em] text-white/28">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="h-px w-6 bg-white/[0.09]" />

          <span
            className="font-mono text-[6px] uppercase tracking-[0.22em]"
            style={{
              color: `${GOLD_LIGHT}58`,
            }}
          >
            UMBRA
          </span>
        </div>

        <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-white/[0.18]">
          CAST / {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* CENTER OPTICAL MARK */}
      <motion.div
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
          scale: active ? 1 : 0.72,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.3,
        }}
        className="pointer-events-none absolute left-1/2 top-[42%] z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.16] bg-black/15 backdrop-blur-md"
      >
        <div className="absolute inset-[7px] rounded-full border border-[#b99a61]/25" />
        <CrosshairIcon />
      </motion.div>

      {/* CONTENT */}
      <div className="pointer-events-none absolute inset-x-7 bottom-7 z-20">
        <div className="mb-3 flex items-center gap-3">
          <span
            className="text-[7px] uppercase tracking-[0.3em]"
            style={{
              color: `${GOLD_LIGHT}82`,
            }}
          >
            {category}
          </span>

          <span className="h-px w-5 bg-white/[0.1]" />

          <span className="truncate text-[7px] uppercase tracking-[0.24em] text-white/25">
            {character.projectTitle ?? ""}
          </span>
        </div>

        <div className="flex items-end justify-between gap-5">
          <div className="min-w-0">
            <h2 className="text-[clamp(2rem,3.5vw,3.45rem)] font-[430] uppercase leading-[0.9] tracking-[-0.06em] text-white transition-transform duration-500 group-hover:-translate-y-1">
              {character.name}
            </h2>

            <p className="mt-3 max-h-0 max-w-[340px] overflow-hidden text-[10px] leading-5 text-white/0 transition-all duration-500 group-hover:max-h-20 group-hover:text-white/40">
              {character.shortDescription ?? ""}
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.1] text-white/32 transition-all duration-500 group-hover:border-[#b99a61]/45 group-hover:bg-[#b99a61]/[0.06] group-hover:text-[#d6b776]">
            <ArrowUpRightIcon />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="text-[7px] uppercase tracking-[0.24em] text-white/30">
            {active ? openingLabel : actionLabel}
          </span>

          <span className="h-px flex-1 bg-white/[0.08]" />
        </div>
      </div>

      {/* GOLD EDGE */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-30 h-px w-full origin-left"
        animate={{
          scaleX: active ? 1 : 0.05,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.55,
        }}
        style={{
          background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}45, transparent)`,
        }}
      />

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-30 w-px origin-bottom"
        animate={{
          scaleY: active ? 1 : 0,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.45,
        }}
        style={{
          background: `linear-gradient(180deg, ${GOLD}, transparent 78%)`,
        }}
      />

      <Link
        href={href}
        aria-label={
          locale === "en"
            ? `Open character ${character.name}`
            : `Otvori lik ${character.name}`
        }
        data-cursor-interactive
        className="absolute inset-0 z-40"
      />
    </motion.article>
  );
}