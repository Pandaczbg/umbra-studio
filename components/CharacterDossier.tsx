"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ScanLine,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import type {
  CharacterContent,
  LocalizedText,
  ProjectContent,
} from "@/lib/content/types";

const LAST_VISITED_KEY = "umbra-last-character";

const GOLD = "#c4a56b";
const GOLD_LIGHT = "#dfc88f";

const EASE = [0.22, 1, 0.36, 1] as const;

type Locale = "sr" | "en";

type DossierCopy = {
  back: string;
  dossier: string;
  category: string;
  gender: string;
  height: string;
  project: string;
  profile: string;
  profileIndex: string;
  archiveMemory: string;
  lastViewed: string;
  memoryDescription: string;
  connected: string;
  sameWorld: string;
  backLabel: string;
  dossierFooter: string;
  projectCta: string;
  heightUnknown: string;
  genderUnknown: string;
  portraitPending: string;
  navigation: string;
  previous: string;
  next: string;
  position: string;
  viewArchive: string;
  gallery: string;
  galleryDescription: string;
  galleryFrame: string;
  galleryComingSoon: string;
  galleryOpen: string;
  galleryClose: string;
  galleryViewer: string;
  galleryTitle: string;
  gallerySubject: string;
  galleryProject: string;
  galleryArchive: string;
};

const copyByLocale: Record<Locale, DossierCopy> = {
  sr: {
    back: "Arhiva",
    dossier: "Dosije lika",
    category: "Kategorija",
    gender: "Pol",
    height: "Visina",
    project: "Projekat",
    profile: "Profil",
    profileIndex: "01 / DOSIJE",
    archiveMemory: "ARHIVSKA MEMORIJA",
    lastViewed: "Poslednje pregledan lik:",
    memoryDescription:
      "Umbra arhiva pamti poslednju tačku istraživanja na ovom uređaju.",
    connected: "POVEZANO",
    sameWorld: "Isti svet",
    backLabel: "Nazad",
    dossierFooter: "UMBRA DOSSIER",
    projectCta: "Projekat",
    heightUnknown: "Nije definisana",
    genderUnknown: "Nije definisan",
    portraitPending: "PORTRET / U RAZVOJU",
    navigation: "NAVIGACIJA LIKOVA",
    previous: "Prethodni lik",
    next: "Sledeći lik",
    position: "Pozicija u postavu",
    viewArchive: "Prikaži celu postavu",
    gallery: "Galerija",
    galleryDescription:
      "Vizuelni zapisi lika, sveta i trenutaka koji pripadaju njegovoj priči.",
    galleryFrame: "KADAR",
    galleryComingSoon:
      "Kadar će biti dodat u sledećoj produkcionoj fazi.",
    galleryOpen: "OTVORI GALERIJU",
    galleryClose: "Zatvori galeriju",
    galleryViewer: "GALERIJA / PRIKAZ",
    galleryTitle: "Vizuelni trag",
    gallerySubject: "SUBJEKAT",
    galleryProject: "PROJEKAT",
    galleryArchive: "UMBRA / ARHIVA",
  },

  en: {
    back: "Character archive",
    dossier: "Character dossier",
    category: "Category",
    gender: "Gender",
    height: "Height",
    project: "Project",
    profile: "Profile",
    profileIndex: "01 / DOSSIER",
    archiveMemory: "ARCHIVE MEMORY",
    lastViewed: "Last viewed character:",
    memoryDescription:
      "The Umbra archive remembers the last point of your exploration on this device.",
    connected: "CONNECTED",
    sameWorld: "Same world",
    backLabel: "Back",
    dossierFooter: "UMBRA DOSSIER",
    projectCta: "Project",
    heightUnknown: "Not defined",
    genderUnknown: "Not defined",
    portraitPending: "PORTRAIT / IN DEVELOPMENT",
    navigation: "CHARACTER NAVIGATION",
    previous: "Previous character",
    next: "Next character",
    position: "Cast position",
    viewArchive: "View full cast",
    gallery: "Gallery",
    galleryDescription:
      "Visual records of the character, world and moments that belong to their story.",
    galleryFrame: "FRAME",
    galleryComingSoon:
      "Frame will be added in the next production phase.",
    galleryOpen: "OPEN GALLERY",
    galleryClose: "Close gallery",
    galleryViewer: "GALLERY / VIEWER",
    galleryTitle: "Visual trace",
    gallerySubject: "SUBJECT",
    galleryProject: "PROJECT",
    galleryArchive: "UMBRA / ARCHIVE",
  },
};

type CharacterDossierProps = {
  character: CharacterContent;
  relatedCharacters: readonly CharacterContent[];
  characters: readonly CharacterContent[];
  project: ProjectContent;
  characterImage: string | null;
  relatedCharacterImages: Record<string, string | null>;
};

type GalleryItem = {
  id: string;
  number: string;
  image: string | null;
  label: string;
  available: boolean;
};

function getLocale(pathname: string | null): Locale {
  return pathname === "/en" ||
    pathname?.startsWith("/en/")
    ? "en"
    : "sr";
}

function getLocalizedText(
  text: LocalizedText | undefined,
  locale: Locale,
) {
  if (!text) {
    return "";
  }

  return text[locale] ?? text.sr;
}

function getGenderLabel(
  gender: CharacterContent["gender"],
  locale: Locale,
  copy: DossierCopy,
) {
  if (gender === "MALE") {
    return locale === "en" ? "Male" : "Muški";
  }

  if (gender === "FEMALE") {
    return locale === "en" ? "Female" : "Ženski";
  }

  return copy.genderUnknown;
}

function getCategoryLabel(
  category: CharacterContent["category"],
  locale: Locale,
) {
  if (category === "MAIN") {
    return locale === "en" ? "Main" : "Glavni";
  }

  return locale === "en" ? "Supporting" : "Sporedni";
}

function getProjectHref(slug: string, locale: Locale) {
  return locale === "en"
    ? `/en/projects/${slug}`
    : `/serije/${slug}`;
}

function getCharacterHref(
  character: CharacterContent,
  locale: Locale,
) {
  return locale === "en"
    ? `/en/characters/${character.slug}`
    : `/likovi/${character.slug}`;
}

function CharacterBackdrop({
  image,
  projectTitle,
}: {
  image: string | null;
  projectTitle: string;
}) {
  return (
    <>
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.46] grayscale-[0.12]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_36%,rgba(223,200,143,.07),transparent_30%),linear-gradient(135deg,#090908_0%,#050504_55%,#080706_100%)]"
        >
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:110px_110px]" />
          <div className="absolute left-[73%] top-[39%] h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />
          <div
            className="absolute left-[73%] top-[39%] h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{ borderColor: `${GOLD}10` }}
          />
        </div>
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(223,200,143,.06),transparent_31%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,2,.98)_0%,rgba(3,3,2,.86)_27%,rgba(3,3,2,.30)_62%,rgba(3,3,2,.68)_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,3,2,.99)_0%,rgba(3,3,2,.10)_46%,rgba(3,3,2,.56)_100%)]"
      />

      <div className="absolute bottom-7 right-7 hidden items-center gap-3 sm:flex">
        <span
          aria-hidden="true"
          className="h-px w-7"
          style={{
            background:
              `linear-gradient(90deg, transparent, ${GOLD}55)`,
          }}
        />
        <span className="umbra-code text-white/[0.14]">
          {projectTitle}
        </span>
      </div>
    </>
  );
}

function DossierField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="umbra-code text-white/[0.20]">
        {label}
      </p>
      <p className="mt-2 text-[12px] uppercase tracking-[0.05em] text-white/[0.62]">
        {value}
      </p>
    </div>
  );
}

function CharacterNavigationCard({
  href,
  label,
  name,
  direction,
}: {
  href: string | null;
  label: string;
  name: string | null;
  direction: "previous" | "next";
}) {
  const previous = direction === "previous";

  const content = (
    <div
      className={[
        "min-h-[126px] bg-[#070706] p-5 sm:min-h-[142px] sm:p-7",
        href
          ? "transition-colors duration-300 hover:bg-[#090908]"
          : "opacity-35",
        previous ? "" : "text-right",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center justify-between gap-4",
          previous ? "" : "flex-row-reverse",
        ].join(" ")}
      >
        <span className="umbra-code text-white/[0.20]">
          {label}
        </span>

        {previous ? (
          <ArrowLeft
            aria-hidden="true"
            size={14}
            strokeWidth={1.1}
            className={
              href
                ? "text-white/[0.24] transition-[color,transform] duration-300 group-hover:-translate-x-1 group-hover:text-[#dfc88f]"
                : "text-white/[0.12]"
            }
          />
        ) : (
          <ArrowUpRight
            aria-hidden="true"
            size={14}
            strokeWidth={1.1}
            className={
              href
                ? "text-white/[0.24] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#dfc88f]"
                : "text-white/[0.12]"
            }
          />
        )}
      </div>

      <div className="mt-6 text-[clamp(1.5rem,2.8vw,2.5rem)] font-[430] uppercase leading-[0.9] tracking-[-0.05em] text-white/[0.70] transition-colors duration-300 group-hover:text-white/[0.90]">
        {name ?? "—"}
      </div>
    </div>
  );

  if (!href) {
    return <div aria-disabled="true">{content}</div>;
  }

  return (
    <Link
      href={href}
      className="group block outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#dfc88f]/80"
    >
      {content}
    </Link>
  );
}

function RelatedCard({
  character,
  image,
  locale,
}: {
  character: CharacterContent;
  image: string | null;
  locale: Locale;
}) {
  const title = getLocalizedText(
    character.title,
    locale,
  );

  return (
    <Link
      href={getCharacterHref(character, locale)}
      aria-label={
        locale === "en"
          ? `Open character ${title}`
          : `Otvori lik ${title}`
      }
      className="group relative block min-h-[320px] overflow-hidden border border-white/[0.065] bg-[#070706] outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#dfc88f]/80"
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale-[0.10] transition-[filter,transform] duration-700 group-hover:grayscale-0 group-hover:scale-[1.025]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(223,200,143,.055),transparent_30%),linear-gradient(135deg,#090908,#050504_58%,#080706)]"
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.78)_100%)]"
      />

      <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
        <div className="mb-3 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-px w-6"
            style={{ background: `${GOLD_LIGHT}70` }}
          />
          <span className="umbra-code">
            {getCategoryLabel(
              character.category,
              locale,
            )}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <h3 className="text-[clamp(1.55rem,3vw,2.65rem)] font-[430] uppercase leading-[0.88] tracking-[-0.05em] text-white/[0.88]">
            {title}
          </h3>

          <ArrowUpRight
            aria-hidden="true"
            size={16}
            strokeWidth={1.05}
            className="shrink-0 text-white/[0.28] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#dfc88f]"
          />
        </div>
      </div>
    </Link>
  );
}

function GalleryCard({
  item,
  onOpen,
  copy,
}: {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
  copy: DossierCopy;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`${copy.galleryOpen}: ${item.label}`}
      className="group block w-full text-left outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
    >
      <div className="relative overflow-hidden border border-white/[0.075] bg-[#060605] transition-[border-color,transform,box-shadow] duration-500 group-hover:-translate-y-0.5 group-hover:border-[#c4a56b]/30 group-hover:shadow-[0_24px_70px_rgba(0,0,0,.28)]">
        <div className="relative aspect-[16/10] overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.label}
              fill
              sizes="(min-width: 1280px) 65vw, 100vw"
              className="object-cover grayscale-[0.04] transition-transform duration-[1100ms] group-hover:scale-[1.018]"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_42%,rgba(223,200,143,.055),transparent_34%),linear-gradient(135deg,#090908,#050504)]" />
          )}

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.02),transparent_48%,rgba(0,0,0,.72))]"
          />

          <span
            aria-hidden="true"
            className="absolute left-5 top-5 h-7 w-7 border-l border-t sm:left-6 sm:top-6"
            style={{ borderColor: `${GOLD_LIGHT}32` }}
          />

          <span
            aria-hidden="true"
            className="absolute bottom-5 right-5 h-7 w-7 border-b border-r sm:bottom-6 sm:right-6"
            style={{ borderColor: `${GOLD}28` }}
          />

          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-5 sm:inset-x-6 sm:bottom-6">
            <div>
              <span
                className="block umbra-code"
                style={{ color: `${GOLD_LIGHT}70` }}
              >
                {item.number} / {item.number}
              </span>
              <span className="mt-2 block text-[10px] uppercase tracking-[0.18em] text-white/[0.68]">
                {item.label}
              </span>
            </div>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/[0.12] bg-black/20 text-white/[0.34] backdrop-blur-sm transition-[border-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-[#dfc88f]/40 group-hover:text-[#dfc88f]">
              <ArrowUpRight
                aria-hidden="true"
                size={13}
                strokeWidth={1.05}
              />
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.055] px-5 py-3 sm:px-6">
          <span className="umbra-code text-white/[0.14]">
            {copy.galleryViewer}
          </span>
          <span
            className="umbra-code"
            style={{ color: `${GOLD_LIGHT}45` }}
          >
            {copy.galleryOpen}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function CharacterDossier({
  character,
  relatedCharacters,
  characters,
  project,
  characterImage,
  relatedCharacterImages,
}: CharacterDossierProps) {
  const pathname = usePathname();
  const locale = getLocale(pathname);
  const copy = copyByLocale[locale];
  const reducedMotion = useReducedMotion() ?? false;

  const [lastViewedSlug, setLastViewedSlug] =
    useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] =
    useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] =
    useState<GalleryItem | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] =
    useState(0);

  const galleryCloseTimerRef =
    useRef<number | null>(null);

  const archiveHref =
    locale === "en"
      ? "/en/characters"
      : "/likovi";

  const projectHref = getProjectHref(
    project.slug,
    locale,
  );

  const characterName = getLocalizedText(
    character.title,
    locale,
  );

  const characterDescription =
    getLocalizedText(
      character.shortDescription ??
        character.description,
      locale,
    ) ||
    (locale === "en"
      ? "Character dossier"
      : "Dosije lika");

  const projectTitle = getLocalizedText(
    project.title,
    locale,
  );

  const navigationCharacters = useMemo(() => {
    const byId = new Map<string, CharacterContent>();

    for (const item of [
      ...relatedCharacters,
      character,
    ]) {
      byId.set(item.id, item);
    }

    return [...byId.values()].sort(
      (a, b) =>
        (a.order ?? Number.POSITIVE_INFINITY) -
        (b.order ?? Number.POSITIVE_INFINITY),
    );
  }, [character, relatedCharacters]);

  const navigationIndex =
    navigationCharacters.findIndex(
      (item) => item.id === character.id,
    );

  const navigation = {
    position:
      navigationIndex >= 0
        ? navigationIndex + 1
        : 1,
    total: navigationCharacters.length,
    previous:
      navigationIndex > 0
        ? navigationCharacters[
            navigationIndex - 1
          ]
        : null,
    next:
      navigationIndex >= 0 &&
      navigationIndex <
        navigationCharacters.length - 1
        ? navigationCharacters[
            navigationIndex + 1
          ]
        : null,
  };

  const relatedVisible = useMemo(
    () =>
      relatedCharacters.filter(
        (item) => item.id !== character.id,
      ),
    [character.id, relatedCharacters],
  );

  const galleryItems = useMemo<GalleryItem[]>(
    () =>
      characterImage
        ? [
            {
              id: `${character.id}-01`,
              number: "01",
              image: characterImage,
              label:
                locale === "en"
                  ? "Portrait"
                  : "Portret",
              available: true,
            },
          ]
        : [],
    [character.id, characterImage, locale],
  );

  const openGallery = useCallback(
    (item: GalleryItem) => {
      const itemIndex = galleryItems.findIndex(
        (galleryItem) =>
          galleryItem.id === item.id,
      );

      if (itemIndex < 0) {
        return;
      }

      setActiveGalleryIndex(itemIndex);
      setSelectedGalleryItem(item);
      setGalleryOpen(true);
    },
    [
      galleryItems,
      setActiveGalleryIndex,
      setGalleryOpen,
      setSelectedGalleryItem,
    ],
  );

  const closeGallery = useCallback(() => {
    setGalleryOpen(false);

    if (galleryCloseTimerRef.current !== null) {
      window.clearTimeout(
        galleryCloseTimerRef.current,
      );
    }

    galleryCloseTimerRef.current =
      window.setTimeout(
        () => {
          galleryCloseTimerRef.current = null;
          setSelectedGalleryItem(null);
        },
        reducedMotion ? 0 : 220,
      );
  }, [
    reducedMotion,
    setGalleryOpen,
    setSelectedGalleryItem,
  ]);

  const showGalleryItem = useCallback(
    (direction: number) => {
      if (galleryItems.length === 0) {
        return;
      }

      const nextIndex =
        (activeGalleryIndex +
          direction +
          galleryItems.length) %
        galleryItems.length;

      const nextItem = galleryItems[nextIndex];

      setActiveGalleryIndex(nextIndex);
      setSelectedGalleryItem(nextItem);
    },
    [
      activeGalleryIndex,
      galleryItems,
      setActiveGalleryIndex,
      setSelectedGalleryItem,
    ],
  );

  useEffect(() => {
    let timer: number | null = null;

    try {
      const previousSlug =
        window.localStorage.getItem(
          LAST_VISITED_KEY,
        );

      const nextLastViewedSlug =
        previousSlug &&
        previousSlug !== character.slug
          ? previousSlug
          : null;

      timer = window.setTimeout(() => {
        setLastViewedSlug(
          nextLastViewedSlug,
        );
      }, 0);

      window.localStorage.setItem(
        LAST_VISITED_KEY,
        character.slug,
      );
    } catch {
      timer = window.setTimeout(() => {
        setLastViewedSlug(null);
      }, 0);
    }

    return () => {
      if (timer !== null) {
        window.clearTimeout(timer);
      }
    };
  }, [character.slug]);

  useEffect(() => {
    if (!galleryOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        closeGallery();
        return;
      }

      if (event.key === "ArrowLeft") {
        showGalleryItem(-1);
        return;
      }

      if (event.key === "ArrowRight") {
        showGalleryItem(1);
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [closeGallery, galleryOpen, showGalleryItem]);

  useEffect(() => {
    return () => {
      if (galleryCloseTimerRef.current !== null) {
        window.clearTimeout(
          galleryCloseTimerRef.current,
        );
      }
    };
  }, []);

  const lastViewedCharacter =
    lastViewedSlug
      ? characters.find(
          (item) => item.slug === lastViewedSlug,
        ) ?? null
      : null;

  const reveal = {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.58,
        ease: EASE,
      },
    },
  };

  const navigationPosition = String(
    navigation.position,
  ).padStart(2, "0");

  const navigationTotal = String(
    navigation.total,
  ).padStart(2, "0");

  return (
    <>
      <main
        data-umbra-scene="character-dossier"
        className="min-h-screen overflow-hidden bg-[var(--umbra-bg)] text-[var(--umbra-ink)]"
      >
        <section
          aria-labelledby="character-title"
          className="relative overflow-hidden border-b border-white/[0.055]"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,#060605 0%,#050504 60%,#030302 100%)",
            }}
          />

          <div className="relative min-h-[92svh]">
            <motion.div
              initial={{
                opacity: 0,
                scale: reducedMotion ? 1 : 1.015,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.9,
                ease: EASE,
              }}
              className="absolute inset-0"
            >
              <CharacterBackdrop
                image={characterImage}
                projectTitle={projectTitle}
              />
            </motion.div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-5 border border-white/[0.045] sm:inset-7 lg:inset-10"
            />

            <div className="umbra-container relative flex min-h-[92svh] flex-col px-0 pb-8 pt-28 sm:pb-10 lg:pt-32">
              <div className="flex items-center justify-between gap-6">
                <Link
                  href={archiveHref}
                  className="group inline-flex min-h-9 items-center gap-3 umbra-code text-white/[0.30] outline-none transition-[color,transform] duration-300 hover:translate-x-0.5 hover:text-white/[0.74] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
                >
                  <ArrowLeft
                    aria-hidden="true"
                    size={13}
                    strokeWidth={1.05}
                    className="transition-transform duration-300 group-hover:-translate-x-1"
                  />
                  {copy.back}
                </Link>

                <span className="umbra-code text-white/[0.16]">
                  {copy.dossier}
                </span>
              </div>

              <div className="mt-auto grid gap-10 pt-28 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={reveal}
                >
                  <Link
                    href={projectHref}
                    aria-label={`${copy.project}: ${projectTitle}`}
                    className="group/project inline-flex min-h-9 items-center gap-3 umbra-code outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
                  >
                    <span
                      aria-hidden="true"
                      className="h-px w-7"
                      style={{
                        background: `${GOLD_LIGHT}80`,
                      }}
                    />
                    <span
                      className="transition-colors duration-300 group-hover/project:text-white"
                      style={{
                        color: `${GOLD_LIGHT}c2`,
                      }}
                    >
                      {projectTitle}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      size={12}
                      strokeWidth={1.05}
                      className="text-white/[0.34] transition-[color,transform] duration-300 group-hover/project:-translate-y-0.5 group-hover/project:translate-x-0.5 group-hover/project:text-[#dfc88f]"
                    />
                  </Link>

                  <h1
                    id="character-title"
                    className="mt-5 max-w-[940px] text-[clamp(3.4rem,8vw,7.8rem)] font-[430] uppercase leading-[0.82] tracking-[-0.075em] text-[var(--umbra-platinum)]"
                  >
                    {characterName}
                  </h1>

                  <p className="mt-7 max-w-[680px] text-[12px] leading-6 text-white/[0.40] sm:text-[14px] sm:leading-7">
                    {characterDescription}
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={reveal}
                  className="border-t border-white/[0.07] pt-5 lg:pb-1"
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-7">
                    <DossierField
                      label={copy.category}
                      value={getCategoryLabel(
                        character.category,
                        locale,
                      )}
                    />

                    <DossierField
                      label={copy.gender}
                      value={getGenderLabel(
                        character.gender,
                        locale,
                        copy,
                      )}
                    />

                    <DossierField
                      label={copy.height}
                      value={
                        character.heightCm !==
                        null
                          ? `${character.heightCm} cm`
                          : copy.heightUnknown
                      }
                    />

                    <div>
                      <p className="umbra-code text-white/[0.20]">
                        {copy.project}
                      </p>
                      <Link
                        href={projectHref}
                        className="group/project-link mt-2 inline-flex min-h-9 items-center gap-2 text-[12px] uppercase tracking-[0.05em] text-white/[0.62] outline-none transition-colors duration-300 hover:text-white focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
                      >
                        {projectTitle}
                        <ArrowUpRight
                          aria-hidden="true"
                          size={12}
                          strokeWidth={1.05}
                          className="text-[#dfc88f]/58 transition-[color,transform] duration-300 group-hover/project-link:-translate-y-0.5 group-hover/project-link:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/[0.045] pt-4">
                <span className="hidden umbra-code text-white/[0.12] sm:block">
                  CHARACTER / PROJECT / DOSSIER
                </span>
                <span className="ml-auto umbra-code text-white/[0.16]">
                  {navigationPosition} / {navigationTotal}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.055] bg-[var(--umbra-surface)]">
          <div className="umbra-container py-16 sm:py-20 lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={reveal}
              className="grid gap-12 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[210px_minmax(0,1fr)] xl:gap-20"
            >
              <div className="lg:border-r lg:border-white/[0.055] lg:pr-8">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.42em] h-px w-7"
                    style={{
                      background: `${GOLD_LIGHT}74`,
                    }}
                  />
                  <div>
                    <p className="umbra-code">
                      {copy.profile}
                    </p>
                    <p className="mt-2 umbra-code text-white/[0.12]">
                      {copy.profileIndex}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
                <div>
                  <p className="max-w-[820px] text-[clamp(1.35rem,2.25vw,2.15rem)] font-[400] leading-[1.34] tracking-[-0.035em] text-white/[0.76]">
                    {characterDescription}
                  </p>
                </div>

                <div className="border-t border-white/[0.055] pt-5">
                  <p
                    className="umbra-code"
                    style={{
                      color: `${GOLD_LIGHT}68`,
                    }}
                  >
                    {copy.archiveMemory}
                  </p>

                  <div className="mt-4 flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background: GOLD_LIGHT,
                      }}
                    />

                    <p className="text-[12px] leading-6 text-white/[0.40]">
                      {copy.lastViewed}{" "}
                      {lastViewedCharacter ? (
                        <Link
                          href={getCharacterHref(
                            lastViewedCharacter,
                            locale,
                          )}
                          className="text-white/[0.70] underline decoration-white/10 underline-offset-4 transition-colors hover:text-[#dfc88f] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
                        >
                          {getLocalizedText(
                            lastViewedCharacter.title,
                            locale,
                          )}
                        </Link>
                      ) : (
                        <span className="text-white/[0.25]">
                          —
                        </span>
                      )}
                    </p>
                  </div>

                  <p className="mt-4 text-[10px] leading-5 text-white/[0.24]">
                    {lastViewedCharacter
                      ? copy.memoryDescription
                      : locale === "en"
                        ? "Your previous archive point will appear here after you visit another character."
                        : "Prethodna tačka u arhivi pojaviće se ovde nakon što posetiš drugog lika."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          id="galerija"
          className="scroll-mt-24 border-b border-white/[0.055]"
        >
          <div className="umbra-container py-16 sm:py-20 lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={reveal}
            >
              <div className="flex items-end justify-between gap-6 border-b border-white/[0.055] pb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-px w-8"
                      style={{
                        background: `${GOLD_LIGHT}82`,
                      }}
                    />
                    <span
                      className="umbra-code"
                      style={{
                        color: `${GOLD_LIGHT}8c`,
                      }}
                    >
                      {copy.gallery}
                    </span>
                  </div>
                  <h2 className="mt-4 max-w-[600px] text-[clamp(2rem,4vw,4.2rem)] font-[430] uppercase leading-[0.88] tracking-[-0.055em] text-white/[0.86]">
                    {copy.galleryTitle}
                  </h2>
                </div>

                <span className="hidden umbra-code text-white/[0.13] sm:block">
                  {String(
                    galleryItems.length,
                  ).padStart(2, "0")}{" "}
                  /{" "}
                  {String(
                    galleryItems.length,
                  ).padStart(2, "0")}
                </span>
              </div>

              <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(250px,.55fr)] lg:items-end lg:gap-14">
                {galleryItems.length > 0 ? (
                  <GalleryCard
                    item={galleryItems[0]}
                    onOpen={openGallery}
                    copy={copy}
                  />
                ) : (
                  <div className="flex min-h-[260px] items-center border border-white/[0.065] bg-[var(--umbra-surface)] px-6 sm:px-8">
                    <div>
                      <p
                        className="umbra-code"
                        style={{
                          color: `${GOLD_LIGHT}68`,
                        }}
                      >
                        UMBRA / VISUAL ARCHIVE
                      </p>
                      <p className="mt-4 max-w-[430px] text-[11px] leading-6 text-white/[0.26]">
                        {copy.galleryComingSoon}
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t border-white/[0.055] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                  <p className="umbra-code">
                    {copy.galleryDescription}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-6 border-t border-white/[0.055] pt-5">
                    <DossierField
                      label={copy.gallerySubject}
                      value={characterName}
                    />
                    <DossierField
                      label={copy.galleryProject}
                      value={projectTitle}
                    />
                  </div>

                  {galleryItems.length > 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        openGallery(galleryItems[0])
                      }
                      className="mt-7 inline-flex min-h-10 items-center gap-4 border border-white/[0.10] px-4 py-3 umbra-code text-white/[0.40] outline-none transition-[border-color,color,transform] duration-300 hover:-translate-y-px hover:border-[#dfc88f]/45 hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
                    >
                      {copy.galleryOpen}
                      <span
                        aria-hidden="true"
                        className="h-px w-7"
                        style={{
                          background: `${GOLD_LIGHT}60`,
                        }}
                      />
                      <ArrowUpRight
                        aria-hidden="true"
                        size={12}
                        strokeWidth={1.05}
                      />
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-white/[0.055] bg-[var(--umbra-surface)]">
          <div className="umbra-container py-16 sm:py-20 lg:py-24">
            <div className="flex flex-col gap-7 border-b border-white/[0.055] pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p
                  className="umbra-code"
                  style={{
                    color: `${GOLD_LIGHT}70`,
                  }}
                >
                  {copy.navigation}
                </p>

                <div className="mt-4 flex flex-wrap items-end gap-4">
                  <Link
                    href={projectHref}
                    aria-label={`${copy.project}: ${projectTitle}`}
                    className="group/project-title outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
                  >
                    <h2 className="text-[clamp(2rem,4vw,4.1rem)] font-[430] leading-[0.9] tracking-[-0.06em] text-white/[0.82] transition-colors duration-300 group-hover/project-title:text-white">
                      {projectTitle}
                    </h2>
                  </Link>

                  <span className="pb-1 umbra-code text-white/[0.18]">
                    {copy.position} {navigationPosition} /{" "}
                    {navigationTotal}
                  </span>
                </div>
              </div>

              <Link
                href={archiveHref}
                className="inline-flex min-h-10 items-center gap-3 border border-white/[0.08] px-4 py-3 umbra-code text-white/[0.34] outline-none transition-[border-color,color,transform] duration-300 hover:-translate-y-px hover:border-[#dfc88f]/36 hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
              >
                {copy.viewArchive}
                <ArrowUpRight
                  aria-hidden="true"
                  size={12}
                  strokeWidth={1.05}
                />
              </Link>
            </div>

            <div className="mt-6 grid gap-px border border-white/[0.065] bg-white/[0.065] md:grid-cols-3">
              <CharacterNavigationCard
                href={
                  navigation.previous
                    ? getCharacterHref(
                        navigation.previous,
                        locale,
                      )
                    : null
                }
                label={copy.previous}
                name={
                  navigation.previous
                    ? getLocalizedText(
                        navigation.previous.title,
                        locale,
                      )
                    : null
                }
                direction="previous"
              />

              <div className="flex min-h-[126px] items-end justify-between bg-[#0a0a09] p-5 sm:min-h-[142px] sm:p-7">
                <div>
                  <span
                    className="umbra-code"
                    style={{
                      color: `${GOLD_LIGHT}62`,
                    }}
                  >
                    {copy.dossier}
                  </span>
                  <p className="mt-3 text-[20px] font-[430] uppercase leading-none tracking-[-0.04em] text-white/[0.78]">
                    {characterName}
                  </p>
                </div>
                <span className="umbra-code text-white/[0.16]">
                  {navigationPosition} /{" "}
                  {navigationTotal}
                </span>
              </div>

              <CharacterNavigationCard
                href={
                  navigation.next
                    ? getCharacterHref(
                        navigation.next,
                        locale,
                      )
                    : null
                }
                label={copy.next}
                name={
                  navigation.next
                    ? getLocalizedText(
                        navigation.next.title,
                        locale,
                      )
                    : null
                }
                direction="next"
              />
            </div>
          </div>
        </section>

        {relatedVisible.length > 0 ? (
          <section className="border-b border-white/[0.055]">
            <div className="umbra-container py-16 sm:py-20 lg:py-24">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
                variants={reveal}
              >
                <p
                  className="umbra-code"
                  style={{
                    color: `${GOLD_LIGHT}70`,
                  }}
                >
                  {copy.connected}
                </p>

                <h2 className="mt-4 text-[clamp(2rem,4vw,4rem)] font-[430] leading-[0.88] tracking-[-0.055em] text-white/[0.84]">
                  {copy.sameWorld}
                </h2>

                <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedVisible
                    .slice(0, 3)
                    .map((related) => (
                      <RelatedCard
                        key={related.id}
                        character={related}
                        image={
                          relatedCharacterImages[
                            related.id
                          ] ?? null
                        }
                        locale={locale}
                      />
                    ))}
                </div>
              </motion.div>
            </div>
          </section>
        ) : null}

        <footer className="bg-[var(--umbra-bg)]">
          <div className="umbra-container flex flex-col gap-4 border-t border-white/[0.055] py-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={archiveHref}
              className="inline-flex min-h-9 items-center gap-2 umbra-code text-white/[0.24] outline-none transition-colors hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
            >
              <ArrowLeft
                aria-hidden="true"
                size={12}
                strokeWidth={1.05}
              />
              {copy.backLabel}
            </Link>

            <div className="flex items-center gap-3">
              <ScanLine
                aria-hidden="true"
                size={13}
                strokeWidth={1.05}
                className="text-[#dfc88f]/34"
              />
              <span className="umbra-code text-white/[0.14]">
                {copy.dossierFooter}
              </span>
            </div>

            <Link
              href={projectHref}
              className="inline-flex min-h-9 items-center gap-2 umbra-code text-white/[0.24] outline-none transition-colors hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
            >
              {copy.projectCta}
              <ArrowUpRight
                aria-hidden="true"
                size={12}
                strokeWidth={1.05}
              />
            </Link>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {galleryOpen &&
        selectedGalleryItem ? (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.22,
              ease: EASE,
            }}
            className="fixed inset-0 z-[260] bg-[#020202]/[0.98]"
            role="dialog"
            aria-modal="true"
            aria-label={`${copy.galleryViewer}: ${characterName}`}
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeGallery();
              }
            }}
          >
            <div className="flex h-full flex-col">
              <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-8">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="h-[4px] w-[4px] rounded-full"
                    style={{
                      background: GOLD,
                      boxShadow: `0 0 8px ${GOLD}24`,
                    }}
                  />

                  <span
                    className="umbra-code"
                    style={{
                      color: `${GOLD_LIGHT}76`,
                    }}
                  >
                    {copy.galleryViewer}
                  </span>

                  <span className="hidden h-px w-7 bg-white/[0.08] sm:block" />

                  <span className="hidden umbra-code text-white/[0.18] sm:block">
                    {characterName}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={closeGallery}
                  aria-label={copy.galleryClose}
                  className="flex h-10 w-10 items-center justify-center border border-white/[0.10] text-white/[0.34] outline-none transition-[border-color,color,transform] duration-300 hover:-translate-y-px hover:border-[#dfc88f]/45 hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
                >
                  <X
                    aria-hidden="true"
                    size={13}
                    strokeWidth={1.05}
                  />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-auto">
                <div className="umbra-container flex min-h-full items-center py-7 sm:py-9">
                  <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: reducedMotion
                          ? 1
                          : 0.99,
                        y: reducedMotion
                          ? 0
                          : 6,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: reducedMotion
                          ? 0
                          : 0.35,
                        ease: EASE,
                      }}
                      className="relative flex min-h-[52vh] items-center justify-center overflow-hidden border border-white/[0.08] bg-[#060605] p-4 sm:p-7"
                    >
                      {selectedGalleryItem.image ? (
                        <Image
                          src={
                            selectedGalleryItem.image
                          }
                          alt={
                            selectedGalleryItem.label
                          }
                          width={1800}
                          height={1200}
                          sizes="(min-width: 1024px) 76vw, 100vw"
                          className="max-h-[74vh] w-full object-contain"
                        />
                      ) : null}

                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t sm:left-7 sm:top-7"
                        style={{
                          borderColor: `${GOLD_LIGHT}38`,
                        }}
                      />

                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r sm:bottom-7 sm:right-7"
                        style={{
                          borderColor: `${GOLD}28`,
                        }}
                      />

                      {galleryItems.length > 1 ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              showGalleryItem(-1)
                            }
                            aria-label={copy.previous}
                            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/[0.10] bg-black/[0.24] text-white/[0.40] backdrop-blur-sm outline-none transition-[border-color,color,transform] duration-300 hover:-translate-x-0.5 hover:border-[#dfc88f]/45 hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
                          >
                            <ChevronLeft
                              aria-hidden="true"
                              size={15}
                              strokeWidth={1.05}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              showGalleryItem(1)
                            }
                            aria-label={copy.next}
                            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/[0.10] bg-black/[0.24] text-white/[0.40] backdrop-blur-sm outline-none transition-[border-color,color,transform] duration-300 hover:translate-x-0.5 hover:border-[#dfc88f]/45 hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
                          >
                            <ChevronRight
                              aria-hidden="true"
                              size={15}
                              strokeWidth={1.05}
                            />
                          </button>
                        </>
                      ) : null}
                    </motion.div>

                    <aside className="flex flex-col justify-between border-t border-white/[0.07] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                      <div>
                        <p
                          className="umbra-code"
                          style={{
                            color: `${GOLD_LIGHT}70`,
                          }}
                        >
                          {selectedGalleryItem.number} /{" "}
                          {String(
                            galleryItems.length,
                          ).padStart(2, "0")}
                        </p>

                        <h2 className="mt-4 text-[clamp(1.8rem,3vw,3rem)] font-[430] uppercase leading-[0.9] tracking-[-0.05em] text-white/[0.84]">
                          {selectedGalleryItem.label}
                        </h2>

                        <p className="mt-5 text-[11px] leading-6 text-white/[0.28]">
                          {characterName}
                        </p>

                        <div
                          aria-hidden="true"
                          className="mt-6 h-px w-8"
                          style={{
                            background: `${GOLD}42`,
                          }}
                        />

                        <p className="mt-6 umbra-code text-white/[0.15]">
                          {projectTitle}
                        </p>
                      </div>

                      <div className="mt-10 space-y-3">
                        <div className="flex items-center justify-between umbra-code text-white/[0.15]">
                          <span>
                            {copy.galleryArchive}
                          </span>
                          <span>
                            {navigationPosition} /{" "}
                            {navigationTotal}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={closeGallery}
                          className="inline-flex min-h-10 w-full items-center justify-between border border-white/[0.08] px-4 umbra-code text-white/[0.32] outline-none transition-[border-color,color] duration-300 hover:border-[#dfc88f]/35 hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
                        >
                          <span>
                            {copy.galleryClose}
                          </span>
                          <X
                            aria-hidden="true"
                            size={11}
                            strokeWidth={1}
                          />
                        </button>
                      </div>
                    </aside>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
