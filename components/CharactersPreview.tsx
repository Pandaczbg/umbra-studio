"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Database,
  Orbit,
  ScanLine,
} from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import type {
  CharacterCategory,
  CharacterContent,
  CharacterGender,
  ProjectContent,
} from "@/lib/content/types";

type ProjectFilter = "ALL" | string;
type GenderFilter =
  | "ALL"
  | Exclude<CharacterGender, null>;
type CategoryFilter =
  | "ALL"
  | CharacterCategory;
type Locale = "sr" | "en";

type CharacterImageMap =
  Record<string, string | null>;

type CharactersPreviewProps = {
  characters: readonly CharacterContent[];
  projects: readonly ProjectContent[];
  characterImages: CharacterImageMap;
};

type PreviewCharacter =
  CharacterContent & {
    project: ProjectContent | null;
    image: string | null;
  };

const LAST_VISITED_KEY =
  "umbra-last-character";

const LAST_VISITED_EVENT =
  "umbra:last-character";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

const COPY = {
  sr: {
    archive: "ARHIVA LIKOVA",
    title: "Ljudi iza priča",
    index: "INDEKS",
    memory: "MEMORIJA",
    allProjects: "SVI PROJEKTI",
    genderFilters: "FILTER POLA",
    categoryFilters: "FILTER ULOGE",
    all: "SVI",
    male: "MUŠKI",
    female: "ŽENSKI",
    main: "GLAVNI",
    supporting: "SPOREDNI",
    livingArchive: "ŽIVI ARHIV",
    selectCharacter: "Izaberi lik",
    castIndex: "INDEKS GLUMAČKE POSTAVE",
    navigate: "NAVIGACIJA",
    orbit: "ORBITA",
    openDossier: "OTVORI DOSIJE",
    dossierPreparing: "DOSIJE U PRIPREMI",
    fullArchive: "CELA ARHIVA",
    previous: "Prethodni lik",
    next: "Sledeći lik",
    noMatch:
      "Nema likova koji odgovaraju filteru.",
    spatialIndex: "LIK / PROSTORNI INDEKS",
    archiveSignal:
      "UMBRA STUDIO / ŽIVI ARHIV LIKOVA",
    explore: "Istraži",
    portraitPending: "PORTRET / U RAZVOJU",
  },

  en: {
    archive: "CHARACTER ARCHIVE",
    title: "People behind the stories",
    index: "INDEX",
    memory: "MEMORY",
    allProjects: "ALL PROJECTS",
    genderFilters: "GENDER FILTER",
    categoryFilters: "ROLE FILTER",
    all: "ALL",
    male: "MALE",
    female: "FEMALE",
    main: "MAIN",
    supporting: "SUPPORTING",
    livingArchive: "LIVING ARCHIVE",
    selectCharacter: "Select character",
    castIndex: "CAST INDEX",
    navigate: "NAVIGATE",
    orbit: "ORBIT",
    openDossier: "OPEN DOSSIER",
    dossierPreparing: "DOSSIER IN PREPARATION",
    fullArchive: "FULL ARCHIVE",
    previous: "Previous character",
    next: "Next character",
    noMatch:
      "No characters match this filter.",
    spatialIndex:
      "CHARACTER / SPATIAL INDEX",
    archiveSignal:
      "UMBRA STUDIO / LIVING CHARACTER ARCHIVE",
    explore: "Explore",
    portraitPending:
      "PORTRAIT / IN DEVELOPMENT",
  },
} as const;

function getRoleLabel(
  category: CharacterCategory,
  locale: Locale,
) {
  return category === "MAIN"
    ? locale === "en"
      ? "Main"
      : "Glavni"
    : locale === "en"
      ? "Supporting"
      : "Sporedni";
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
  return locale === "en"
    ? character.shortDescription?.en ??
        character.description?.en ??
        ""
    : character.shortDescription?.sr ??
        character.description?.sr ??
        "";
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

function getProjectHref(
  projectSlug: string,
  locale: Locale,
) {
  return locale === "en"
    ? `/en/projects/${projectSlug}`
    : `/serije/${projectSlug}`;
}

function getStoredLastVisited() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(
      LAST_VISITED_KEY,
    );
  } catch {
    return null;
  }
}

function subscribeToLastVisited(
  callback: () => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (
    event: StorageEvent,
  ) => {
    if (
      event.key === LAST_VISITED_KEY
    ) {
      callback();
    }
  };

  const handleCustomEvent = () => {
    callback();
  };

  window.addEventListener(
    "storage",
    handleStorage,
  );

  window.addEventListener(
    LAST_VISITED_EVENT,
    handleCustomEvent,
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleStorage,
    );

    window.removeEventListener(
      LAST_VISITED_EVENT,
      handleCustomEvent,
    );
  };
}

function useLastVisited() {
  return useSyncExternalStore(
    subscribeToLastVisited,
    getStoredLastVisited,
    () => null,
  );
}

export default function CharactersPreview({
  characters,
  projects,
  characterImages,
}: CharactersPreviewProps) {
  const pathname = usePathname();

  const locale: Locale =
    pathname === "/en" ||
    pathname?.startsWith("/en/")
      ? "en"
      : "sr";

  const copy = COPY[locale];

  const reducedMotion =
    useReducedMotion() ?? false;

  const [
    projectFilter,
    setProjectFilter,
  ] = useState<ProjectFilter>("ALL");

  const [
    genderFilter,
    setGenderFilter,
  ] = useState<GenderFilter>("ALL");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState<CategoryFilter>("ALL");

  const [
    activeCharacterId,
    setActiveCharacterId,
  ] = useState<string | null>(
    characters[0]?.id ?? null,
  );

  const lastVisited =
    useLastVisited();

  const sectionRef =
    useRef<HTMLElement | null>(null);

  const inView = useInView(
    sectionRef,
    {
      once: true,
      amount: 0.14,
    },
  );

  const pointerX =
    useMotionValue(0);

  const pointerY =
    useMotionValue(0);

  const smoothX = useSpring(
    pointerX,
    {
      stiffness: 42,
      damping: 24,
      mass: 0.8,
    },
  );

  const smoothY = useSpring(
    pointerY,
    {
      stiffness: 42,
      damping: 24,
      mass: 0.8,
    },
  );

  const portraitX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion
      ? [0, 0]
      : [-10, 10],
  );

  const portraitY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion
      ? [0, 0]
      : [-8, 8],
  );

  const orbitX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion
      ? [0, 0]
      : [-17, 17],
  );

  const orbitY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion
      ? [0, 0]
      : [-12, 12],
  );

  const projectById =
    useMemo(
      () =>
        new Map(
          projects.map(
            (project) => [
              project.id,
              project,
            ],
          ),
        ),
      [projects],
    );

  const previewCharacters =
    useMemo<PreviewCharacter[]>(
      () =>
        characters.map(
          (character) => ({
            ...character,
            project:
              projectById.get(
                character.projectId,
              ) ?? null,
            image:
              characterImages[
                character.id
              ] ?? null,
          }),
        ),
      [
        characters,
        characterImages,
        projectById,
      ],
    );

  const charactersByProject =
    useMemo(
      () =>
        Array.from(
          new Map(
            previewCharacters
              .filter(
                (character) =>
                  character.project,
              )
              .map(
                (character) => [
                  character.project!.slug,
                  getProjectTitle(
                    character.project!,
                    locale,
                  ),
                ],
              ),
          ),
        ),
      [
        locale,
        previewCharacters,
      ],
    );

  const filteredCharacters =
    useMemo(
      () =>
        previewCharacters.filter(
          (character) => {
            const matchesProject =
              projectFilter ===
                "ALL" ||
              character.project?.slug ===
                projectFilter;

            const matchesGender =
              genderFilter === "ALL" ||
              character.gender ===
                genderFilter;

            const matchesCategory =
              categoryFilter ===
                "ALL" ||
              character.category ===
                categoryFilter;

            return (
              matchesProject &&
              matchesGender &&
              matchesCategory
            );
          },
        ),
      [
        categoryFilter,
        genderFilter,
        previewCharacters,
        projectFilter,
      ],
    );

  const activeCharacter =
    useMemo(() => {
      if (
        filteredCharacters.length ===
        0
      ) {
        return null;
      }

      return (
        filteredCharacters.find(
          (character) =>
            character.id ===
            activeCharacterId,
        ) ??
        filteredCharacters[0]
      );
    }, [
      activeCharacterId,
      filteredCharacters,
    ]);

  const activeIndex =
    activeCharacter
      ? filteredCharacters.findIndex(
          (character) =>
            character.id ===
            activeCharacter.id,
        )
      : -1;

  const relatedCharacters =
    useMemo(() => {
      if (!activeCharacter) {
        return [];
      }

      return filteredCharacters
        .filter(
          (character) =>
            character.projectId ===
              activeCharacter.projectId &&
            character.id !==
              activeCharacter.id,
        )
        .slice(0, 3);
    }, [
      activeCharacter,
      filteredCharacters,
    ]);

  const rememberCharacter = (
    character: CharacterContent,
  ) => {
    try {
      window.localStorage.setItem(
        LAST_VISITED_KEY,
        character.slug,
      );

      window.dispatchEvent(
        new Event(
          LAST_VISITED_EVENT,
        ),
      );
    } catch {
      // Storage may be unavailable.
    }
  };

  const selectCharacter = (
    character: CharacterContent,
  ) => {
    const exists =
      filteredCharacters.some(
        (item) =>
          item.id === character.id,
      );

    if (!exists) {
      return;
    }

    setActiveCharacterId(
      character.id,
    );

    rememberCharacter(character);
  };

  const nextCharacter = () => {
    if (
      filteredCharacters.length <=
      1
    ) {
      return;
    }

    const currentIndex =
      activeIndex >= 0
        ? activeIndex
        : 0;

    const nextIndex =
      currentIndex ===
      filteredCharacters.length - 1
        ? 0
        : currentIndex + 1;

    const next =
      filteredCharacters[
        nextIndex
      ];

    if (!next) {
      return;
    }

    setActiveCharacterId(next.id);
    rememberCharacter(next);
  };

  const previousCharacter = () => {
    if (
      filteredCharacters.length <=
      1
    ) {
      return;
    }

    const currentIndex =
      activeIndex >= 0
        ? activeIndex
        : 0;

    const previousIndex =
      currentIndex === 0
        ? filteredCharacters.length - 1
        : currentIndex - 1;

    const previous =
      filteredCharacters[
        previousIndex
      ];

    if (!previous) {
      return;
    }

    setActiveCharacterId(
      previous.id,
    );

    rememberCharacter(previous);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
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
      ((event.clientX - rect.left) /
        rect.width) *
        2 -
        1,
    );

    pointerY.set(
      ((event.clientY - rect.top) /
        rect.height) *
        2 -
        1,
    );
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const lastVisitedCharacter =
    lastVisited
      ? previewCharacters.find(
          (character) =>
            character.slug ===
            lastVisited,
        )
      : null;

  const filterButtons = [
    {
      key: "ALL",
      label: copy.all,
      active:
        projectFilter === "ALL",
      onClick: () =>
        setProjectFilter("ALL"),
    },
    ...charactersByProject.map(
      ([slug, title]) => ({
        key: slug,
        label: title,
        active:
          projectFilter === slug,
        onClick: () =>
          setProjectFilter(slug),
      }),
    ),
  ];

  return (
    <section
      id="likovi-preview"
      ref={sectionRef}
      aria-labelledby="characters-preview-title"
      className="relative overflow-hidden border-b border-white/[0.065] bg-[#030303] py-28 sm:py-36 lg:py-44"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[18%] top-[30%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(199,169,107,0.035),transparent_70%)] blur-3xl" />

        <div className="absolute right-[8%] top-[15%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.018),transparent_72%)] blur-3xl" />

        <div className="absolute inset-0 opacity-[0.022] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:110px_110px]" />

        <div className="absolute inset-0 opacity-[0.012] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.16)_0px,rgba(255,255,255,.16)_1px,transparent_1px,transparent_5px)]" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD}24, transparent)`,
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion
              ? 0
              : 20,
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : undefined
          }
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.8,
            ease: EASE,
          }}
          className="mb-12 flex flex-col gap-8 border-b border-white/[0.07] pb-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="mb-5 flex select-none items-center gap-4">
              <span
                className="font-mono text-[8px] font-medium uppercase tracking-[0.42em]"
                style={{
                  color: `${GOLD_LIGHT}cc`,
                }}
              >
                {copy.archive}
              </span>

              <span
                aria-hidden="true"
                className="h-px w-10"
                style={{
                  background: `${GOLD}45`,
                }}
              />
            </div>

            <h2
              id="characters-preview-title"
              className="select-none max-w-4xl text-[clamp(3rem,6vw,6.5rem)] font-[430] leading-[0.84] tracking-[-0.067em] text-[#f4f0e8]"
            >
              {copy.title}
            </h2>
          </div>

          <div className="flex items-end justify-between gap-8 lg:min-w-[330px]">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.26em] text-white/[0.22]">
                {copy.index}
              </p>

              <p
                className="mt-3 font-mono text-[10px] tracking-[0.16em]"
                style={{
                  color: `${GOLD_LIGHT}74`,
                }}
              >
                {String(
                  filteredCharacters.length,
                ).padStart(2, "0")}{" "}
                /{" "}
                {String(
                  previewCharacters.length,
                ).padStart(2, "0")}
              </p>
            </div>

            {lastVisitedCharacter ? (
              <Link
                href={getCharacterHref(
                  lastVisitedCharacter,
                  locale,
                )}
                className="group text-right outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
              >
                <p
                  className="font-mono text-[7px] uppercase tracking-[0.25em]"
                  style={{
                    color: `${GOLD_LIGHT}70`,
                  }}
                >
                  {copy.memory}
                </p>

                <p className="mt-2 max-w-[140px] truncate text-[10px] uppercase tracking-[0.04em] text-white/34 transition-colors duration-300 group-hover:text-white/68">
                  {
                    getLocalizedTitle(
                      lastVisitedCharacter,
                      locale,
                    )
                  }
                </p>
              </Link>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                }
              : undefined
          }
          transition={{
            delay:
              reducedMotion
                ? 0
                : 0.12,
            duration:
              reducedMotion
                ? 0
                : 0.7,
          }}
          className="mb-8 flex flex-col gap-5 border-b border-white/[0.055] pb-6 xl:flex-row xl:items-center xl:justify-between"
        >
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={
              copy.allProjects
            }
          >
            {filterButtons.map(
              (filter) => (
                <FilterButton
                  key={
                    filter.key
                  }
                  active={
                    filter.active
                  }
                  onClick={
                    filter.onClick
                  }
                >
                  {
                    filter.label
                  }
                </FilterButton>
              ),
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <div
              role="group"
              aria-label={
                copy.genderFilters
              }
              className="flex flex-wrap gap-2"
            >
              {(
                [
                  "ALL",
                  "MALE",
                  "FEMALE",
                ] as const
              ).map((value) => (
                <FilterButton
                  key={value}
                  active={
                    genderFilter ===
                    value
                  }
                  onClick={() =>
                    setGenderFilter(
                      value,
                    )
                  }
                >
                  {value === "ALL"
                    ? copy.all
                    : value ===
                        "MALE"
                      ? copy.male
                      : copy.female}
                </FilterButton>
              ))}
            </div>

            <div
              role="group"
              aria-label={
                copy.categoryFilters
              }
              className="flex flex-wrap gap-2"
            >
              {(
                [
                  "ALL",
                  "MAIN",
                  "SUPPORTING",
                ] as const
              ).map((value) => (
                <FilterButton
                  key={value}
                  active={
                    categoryFilter ===
                    value
                  }
                  onClick={() =>
                    setCategoryFilter(
                      value,
                    )
                  }
                >
                  {value === "ALL"
                    ? copy.all
                    : value ===
                        "MAIN"
                      ? copy.main
                      : copy.supporting}
                </FilterButton>
              ))}
            </div>
          </div>
        </motion.div>

        {activeCharacter ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <motion.div
              initial={{
                opacity: 0,
                y: reducedMotion
                  ? 0
                  : 30,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : undefined
              }
              transition={{
                delay:
                  reducedMotion
                    ? 0
                    : 0.15,
                duration:
                  reducedMotion
                    ? 0
                    : 0.95,
                ease: EASE,
              }}
              className="relative min-h-[670px] overflow-hidden border border-white/[0.08] bg-[#060606]"
            >
              <div
                onPointerMove={
                  handlePointerMove
                }
                onPointerLeave={
                  resetPointer
                }
                className="absolute inset-0"
              >
                <Link
                  href={getCharacterHref(
                    activeCharacter,
                    locale,
                  )}
                  aria-label={`${copy.openDossier}: ${getLocalizedTitle(
                    activeCharacter,
                    locale,
                  )}`}
                  className="group/portrait absolute inset-0 z-[5] block outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/65"
                >
                  <motion.div
                    style={{
                      x: portraitX,
                      y: portraitY,
                      scale:
                        reducedMotion
                          ? 1
                          : 1.025,
                    }}
                    className="absolute inset-[-28px]"
                  >
                    {activeCharacter.image ? (
                      <motion.div
                        key={
                          activeCharacter.id
                        }
                        initial={{
                          opacity: 0,
                          scale: 1.035,
                        }}
                        animate={{
                          opacity: 0.76,
                          scale: 1,
                        }}
                        transition={{
                          duration:
                            reducedMotion
                              ? 0
                              : 0.8,
                          ease: EASE,
                        }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={
                            activeCharacter.image
                          }
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 65vw, 100vw"
                          className="object-cover object-center grayscale-[0.12]"
                        />
                      </motion.div>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(circle_at_68%_42%,rgba(234,211,154,.085),transparent_30%),linear-gradient(135deg,#090909_0%,#040404_52%,#0b0b0a_100%)]"
                      >
                        <div className="absolute inset-0 opacity-[0.24] [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:120px_120px]" />

                        <div className="absolute left-1/2 top-[42%] h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.055]" />

                        <div className="absolute left-1/2 top-[42%] h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.10]" />
                      </div>
                    )}
                  </motion.div>

                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.87)_0%,rgba(0,0,0,0.25)_52%,rgba(0,0,0,0.48)_100%)]" />

                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.02)_38%,rgba(0,0,0,0.88)_100%)]" />

                  <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.82)]" />

                  <motion.div
                    aria-hidden="true"
                    style={{
                      x: orbitX,
                      y: orbitY,
                    }}
                    className="pointer-events-none absolute inset-0"
                  >
                    <div className="absolute left-[52%] top-[46%] h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06] lg:h-[510px] lg:w-[510px]" />

                    <div className="absolute left-[52%] top-[46%] h-[320px] w-[510px] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[50%] border border-[#c7a96b]/[0.10]" />

                    <div className="absolute left-[52%] top-[46%] h-px w-[520px] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

                    <div className="absolute left-[52%] top-[46%] h-[510px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/[0.055] to-transparent" />
                  </motion.div>

                  <div className="pointer-events-none absolute inset-5 border border-white/[0.055] sm:inset-7">
                    <span
                      className="absolute left-[-1px] top-[-1px] h-10 w-10 border-l border-t"
                      style={{
                        borderColor: `${GOLD}55`,
                      }}
                    />

                    <span className="absolute right-[-1px] top-[-1px] h-10 w-10 border-r border-t border-white/[0.07]" />

                    <span className="absolute bottom-[-1px] left-[-1px] h-10 w-10 border-b border-l border-white/[0.055]" />

                    <span
                      className="absolute bottom-[-1px] right-[-1px] h-10 w-10 border-b border-r"
                      style={{
                        borderColor: `${GOLD}28`,
                      }}
                    />
                  </div>

                  <div className="absolute inset-x-7 top-7 flex items-center justify-between sm:inset-x-10 sm:top-10">
                    <div className="flex select-none items-center gap-3">
                      <Orbit
                        aria-hidden="true"
                        size={14}
                        strokeWidth={1.2}
                        style={{
                          color: GOLD,
                        }}
                      />

                      <span
                        className="font-mono text-[8px] uppercase tracking-[0.3em]"
                        style={{
                          color: `${GOLD_LIGHT}cc`,
                        }}
                      >
                        {
                          copy.livingArchive
                        }
                      </span>
                    </div>

                    <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-white/22">
                      {String(
                        Math.max(
                          activeIndex,
                          0,
                        ) + 1,
                      ).padStart(
                        2,
                        "0",
                      )}{" "}
                      /{" "}
                      {String(
                        filteredCharacters.length,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>
                  </div>

                  {!activeCharacter.image ? (
                    <span
                      className="pointer-events-none absolute bottom-[8.7rem] right-7 z-10 font-mono text-[6px] uppercase tracking-[0.28em]"
                      style={{
                        color: `${GOLD_LIGHT}46`,
                      }}
                    >
                      {
                        copy.portraitPending
                      }
                    </span>
                  ) : null}

                  <div className="absolute inset-x-7 bottom-4 sm:inset-x-10">
                    <div
                      className="h-px w-full"
                      style={{
                        background:
                          `linear-gradient(90deg, ${GOLD}28, rgba(255,255,255,.07), transparent)`,
                      }}
                    />

                    <div className="mt-3 flex select-none items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ScanLine
                          aria-hidden="true"
                          size={13}
                          strokeWidth={1.2}
                          style={{
                            color: `${GOLD}72`,
                          }}
                        />

                        <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/18">
                          {
                            copy.spatialIndex
                          }
                        </span>
                      </div>

                      <span
                        className="font-mono text-[7px] tracking-[0.2em]"
                        style={{
                          color: `${GOLD_LIGHT}40`,
                        }}
                      >
                        UMBRA
                      </span>
                    </div>
                  </div>
                </Link>

                <motion.div
                  key={activeCharacter.id}
                  initial={{
                    opacity: 0,
                    y: reducedMotion
                      ? 0
                      : 24,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration:
                      reducedMotion
                        ? 0
                        : 0.64,
                    ease: EASE,
                  }}
                  className="pointer-events-none absolute inset-x-7 bottom-10 z-10 sm:inset-x-10 sm:bottom-10"
                >
                  <div className="mb-5 flex select-none items-center gap-4">
                    {activeCharacter.project ? (
                      <Link
                        href={getProjectHref(
                          activeCharacter
                            .project
                            .slug,
                          locale,
                        )}
                        className="pointer-events-auto font-mono text-[7px] uppercase tracking-[0.3em] outline-none transition-colors duration-300 hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                        style={{
                          color: `${GOLD_LIGHT}c4`,
                        }}
                      >
                        {
                          getProjectTitle(
                            activeCharacter
                              .project,
                            locale,
                          )
                        }
                      </Link>
                    ) : null}

                    <span
                      aria-hidden="true"
                      className="h-px w-7 bg-white/15"
                    />

                    <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-white/30">
                      {getRoleLabel(
                        activeCharacter.category,
                        locale,
                      )}
                    </span>
                  </div>

                  <Link
                    href={getCharacterHref(
                      activeCharacter,
                      locale,
                    )}
                    aria-label={`${copy.openDossier}: ${getLocalizedTitle(
                      activeCharacter,
                      locale,
                    )}`}
                    className="pointer-events-auto group/name block w-fit max-w-4xl outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                  >
                    <h3 className="select-none text-[clamp(3.8rem,7.6vw,8rem)] font-[430] leading-[0.79] tracking-[-0.075em] text-white transition-transform duration-500 group-hover/portrait:-translate-y-1 group-hover/name:text-white/92">
                      {
                        getLocalizedTitle(
                          activeCharacter,
                          locale,
                        )
                      }
                    </h3>
                  </Link>

                  <div className="mt-7 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                    <p className="max-w-xl text-[13px] leading-7 text-white/44 sm:text-[14px]">
                      {
                        getLocalizedDescription(
                          activeCharacter,
                          locale,
                        )
                      }
                    </p>

                    <Link
                      href={getCharacterHref(
                        activeCharacter,
                        locale,
                      )}
                      className="pointer-events-auto group/cta inline-flex h-11 shrink-0 items-center gap-3 border px-5 text-[8px] font-semibold uppercase tracking-[0.26em] outline-none transition-colors duration-300 hover:bg-white/[0.025] focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                      style={{
                        borderColor: `${GOLD}58`,
                        color: GOLD_LIGHT,
                      }}
                    >
                      {activeCharacter.profileAvailable
                        ? copy.openDossier
                        : copy.dossierPreparing}

                      <ArrowUpRight
                        aria-hidden="true"
                        size={14}
                        strokeWidth={1.2}
                        className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </motion.div>

                {relatedCharacters.length >
                0 ? (
                  <div className="pointer-events-none absolute inset-0 hidden lg:block">
                    {relatedCharacters.map(
                      (
                        related,
                        index,
                      ) => {
                        const positions = [
                          "right-[9%] top-[30%]",
                          "right-[17%] top-[54%]",
                          "left-[46%] top-[17%]",
                        ];

                        return (
                          <motion.div
                            key={
                              related.id
                            }
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
                                  : 0.2 +
                                    index *
                                      0.08,
                              duration:
                                reducedMotion
                                  ? 0
                                  : 0.5,
                            }}
                            className={`pointer-events-auto absolute ${positions[index]}`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                selectCharacter(
                                  related,
                                )
                              }
                              aria-label={`${copy.selectCharacter}: ${getLocalizedTitle(
                                related,
                                locale,
                              )}`}
                              className="group flex items-center gap-3 outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                            >
                              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                                <span
                                  aria-hidden="true"
                                  className="absolute h-4 w-4 rounded-full border"
                                  style={{
                                    borderColor: `${GOLD}40`,
                                  }}
                                />

                                <span
                                  aria-hidden="true"
                                  className="h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                                  style={{
                                    background: `${GOLD}b0`,
                                  }}
                                />
                              </span>

                              <span className="whitespace-nowrap border-b border-white/[0.08] pb-1 text-[8px] uppercase tracking-[0.2em] text-white/30 transition-colors duration-300 group-hover:text-white/72">
                                {
                                  getLocalizedTitle(
                                    related,
                                    locale,
                                  )
                                }
                              </span>
                            </button>
                          </motion.div>
                        );
                      },
                    )}
                  </div>
                ) : null}
              </div>
            </motion.div>

            <motion.aside
              initial={{
                opacity: 0,
                x: reducedMotion
                  ? 0
                  : 20,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      x: 0,
                    }
                  : undefined
              }
              transition={{
                delay:
                  reducedMotion
                    ? 0
                    : 0.24,
                duration:
                  reducedMotion
                    ? 0
                    : 0.82,
                ease: EASE,
              }}
              className="flex flex-col border border-white/[0.07] bg-black/20 p-5 backdrop-blur-xl"
              aria-label={
                copy.castIndex
              }
            >
              <div className="mb-7 flex select-none items-center justify-between">
                <div>
                  <div
                    className="font-mono text-[7px] uppercase tracking-[0.34em]"
                    style={{
                      color: `${GOLD_LIGHT}c4`,
                    }}
                  >
                    {copy.castIndex}
                  </div>

                  <div className="mt-2 text-[9px] uppercase tracking-[0.18em] text-white/20">
                    {
                      copy.selectCharacter
                    }
                  </div>
                </div>

                <Database
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.2}
                  className="text-white/16"
                />
              </div>

              <div className="space-y-1.5">
                {filteredCharacters.map(
                  (
                    character,
                    index,
                  ) => {
                    const active =
                      character.id ===
                      activeCharacter.id;

                    return (
                      <button
                        key={
                          character.id
                        }
                        type="button"
                        onClick={() =>
                          selectCharacter(
                            character,
                          )
                        }
                        aria-pressed={
                          active
                        }
                        className={[
                          "group relative w-full overflow-hidden border px-4 py-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55",
                          active
                            ? "border-[#c7a96b]/30 bg-[#c7a96b]/[0.055]"
                            : "border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.018]",
                        ].join(" ")}
                      >
                        <div className="flex select-none items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span
                              className={[
                                "font-mono text-[7px]",
                                active
                                  ? "text-[#ead39a]"
                                  : "text-white/15",
                              ].join(" ")}
                            >
                              {String(
                                index + 1,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </span>

                            <span
                              className={[
                                "text-[11px] font-medium uppercase tracking-[-0.01em] transition-colors duration-300",
                                active
                                  ? "text-white"
                                  : "text-white/42 group-hover:text-white/72",
                              ].join(" ")}
                            >
                              {
                                getLocalizedTitle(
                                  character,
                                  locale,
                                )
                              }
                            </span>
                          </div>

                          <ArrowRight
                            aria-hidden="true"
                            size={14}
                            strokeWidth={1.2}
                            className={[
                              "transition-all duration-300",
                              active
                                ? "text-[#ead39a]"
                                : "text-white/10 group-hover:translate-x-0.5 group-hover:text-white/32",
                            ].join(" ")}
                          />
                        </div>

                        <div className="mt-2 pl-7 text-[6px] uppercase tracking-[0.27em] text-white/16">
                          {character.project
                            ? getProjectTitle(
                                character.project,
                                locale,
                              )
                            : "—"}
                        </div>

                        <span
                          aria-hidden="true"
                          className={[
                            "absolute bottom-0 left-0 h-px transition-all duration-500",
                            active
                              ? "w-full opacity-70"
                              : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50",
                          ].join(" ")}
                          style={{
                            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, transparent)`,
                          }}
                        />
                      </button>
                    );
                  },
                )}
              </div>

              <div className="mt-auto pt-8">
                <div className="mb-4 flex select-none items-center justify-between">
                  <span className="font-mono text-[7px] uppercase tracking-[0.27em] text-white/18">
                    {copy.navigate}
                  </span>

                  <span
                    className="font-mono text-[7px] uppercase tracking-[0.2em]"
                    style={{
                      color: `${GOLD_LIGHT}42`,
                    }}
                  >
                    {copy.orbit}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={
                      previousCharacter
                    }
                    aria-label={
                      copy.previous
                    }
                    className="group flex h-10 flex-1 items-center justify-center border border-white/[0.07] text-white/26 transition-all duration-300 hover:border-[#c7a96b]/30 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                  >
                    <ArrowLeft
                      aria-hidden="true"
                      size={15}
                      strokeWidth={1.2}
                      className="transition-transform duration-300 group-hover:-translate-x-0.5"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={
                      nextCharacter
                    }
                    aria-label={
                      copy.next
                    }
                    className="group flex h-10 flex-1 items-center justify-center border border-white/[0.07] text-white/26 transition-all duration-300 hover:border-[#c7a96b]/30 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                  >
                    <ArrowRight
                      aria-hidden="true"
                      size={15}
                      strokeWidth={1.2}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </button>
                </div>

                <Link
                  href={
                    locale ===
                    "en"
                      ? "/en/characters"
                      : "/likovi"
                  }
                  className="group mt-3 flex h-11 items-center justify-between border border-white/[0.07] px-4 text-[7px] font-semibold uppercase tracking-[0.27em] text-white/28 transition-all duration-300 hover:border-white/[0.15] hover:text-white/68 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                >
                  <span>
                    {
                      copy.fullArchive
                    }
                  </span>

                  <ArrowUpRight
                    aria-hidden="true"
                    size={15}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ead39a]"
                  />
                </Link>
              </div>
            </motion.aside>
          </div>
        ) : (
          <div className="border border-white/[0.07] px-6 py-20 text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
              {copy.noMatch}
            </p>
          </div>
        )}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                }
              : undefined
          }
          transition={{
            delay:
              reducedMotion
                ? 0
                : 0.55,
            duration:
              reducedMotion
                ? 0
                : 0.75,
          }}
          className="mt-14 flex select-none items-center justify-between border-t border-white/[0.055] pt-5"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.15]">
              {copy.archiveSignal}
            </span>
          </div>

          <Link
            href={
              locale ===
              "en"
                ? "/en/characters"
                : "/likovi"
            }
            className="group hidden items-center gap-3 font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.14] transition-colors duration-300 hover:text-white/55 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55 sm:flex"
          >
            <span>
              {copy.explore}
            </span>

            <span
              aria-hidden="true"
              className="h-px w-8 transition-[width] duration-300 group-hover:w-12"
              style={{
                background: `${GOLD}32`,
              }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "min-h-9 border px-3 py-2 font-mono text-[7px] uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55",
        active
          ? "border-[#c7a96b]/40 bg-[#c7a96b]/[0.07] text-[#ead39a]"
          : "border-white/[0.06] text-white/25 hover:border-white/[0.13] hover:bg-white/[0.015] hover:text-white/55",
      ].join(" ")}
    >
      {children}
    </button>
  );
}