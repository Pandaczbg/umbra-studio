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

import type { Character } from "@/data/characters";
import {
  getCharacterBySlug,
  getCharacterHref,
  getCharacterNavigation,
} from "@/lib/characterNavigation";

const LAST_VISITED_KEY =
  "umbra-last-character";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

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
  archive: string;
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

const copyByLocale: Record<
  Locale,
  DossierCopy
> = {
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
    archive: "Arhiva likova",
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
    archive: "Character archive",
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
  character: Character;
  relatedCharacters: Character[];
};

type GalleryItem = {
  id: string;
  number: string;
  image: string | null;
  label: string;
  available: boolean;
};

function getLocale(
  pathname: string | null,
): Locale {
  return pathname === "/en" ||
    pathname?.startsWith("/en/")
    ? "en"
    : "sr";
}

function getGenderLabel(
  gender: Character["gender"],
  locale: Locale,
  copy: DossierCopy,
) {
  if (gender === "MALE") {
    return locale === "en"
      ? "Male"
      : "Muški";
  }

  if (gender === "FEMALE") {
    return locale === "en"
      ? "Female"
      : "Ženski";
  }

  return copy.genderUnknown;
}

function getCategoryLabel(
  category: Character["category"],
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

function getProjectHref(
  slug: string,
  locale: Locale,
) {
  return locale === "en"
    ? `/en/projects/${slug}`
    : `/serije/${slug}`;
}

function CharacterBackdrop({
  character,
}: {
  character: Character;
}) {
  return (
    <>
      {character.image ? (
        <Image
          src={character.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.54] grayscale-[0.14]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(234,211,154,0.08),transparent_34%),linear-gradient(135deg,#090909_0%,#040404_52%,#0a0908_100%)]"
        >
          <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:110px_110px]" />

          <div className="absolute left-[70%] top-[40%] h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.045]" />

          <div className="absolute left-[70%] top-[40%] h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.09]" />
        </div>
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(234,211,154,0.07),transparent_32%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,3,0.985)_0%,rgba(3,3,3,0.80)_28%,rgba(3,3,3,0.17)_66%,rgba(3,3,3,0.62)_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,3,3,0.99)_0%,rgba(3,3,3,0.05)_46%,rgba(3,3,3,0.66)_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.014] [background-image:linear-gradient(rgba(255,255,255,.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.075)_1px,transparent_1px)] [background-size:120px_120px] [mask-image:linear-gradient(180deg,black,transparent_80%)]"
      />
    </>
  );
}

function CharacterPlaceholder({
  copy,
}: {
  copy: DossierCopy;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-8 right-8 hidden items-center gap-3 sm:flex"
    >
      <span
        className="h-px w-8"
        style={{
          background: `${GOLD}35`,
        }}
      />

      <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-white/[0.18]">
        {copy.portraitPending}
      </span>
    </div>
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
      className="group block w-full text-left outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
      aria-label={`${copy.galleryOpen}: ${item.label}`}
    >
      <div className="relative overflow-hidden bg-[#050505] shadow-[0_30px_100px_rgba(0,0,0,.34)] transition-transform duration-700 group-hover:-translate-y-1">
        <div className="absolute inset-0 border border-white/[0.09]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_52%_44%,rgba(234,211,154,.07),transparent_36%)]"
        />

        <div className="relative aspect-[16/10] overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.label}
              fill
              sizes="(min-width: 1280px) 940px, (min-width: 1024px) 62vw, 100vw"
              className="object-cover object-center grayscale-[0.04] transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.018]"
            />
          ) : null}

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.02)_0%,transparent_48%,rgba(0,0,0,.74)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 border-[14px] border-black/[0.08]"
          />

          <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-7 sm:top-7">
            <span
              aria-hidden="true"
              className="h-px w-8"
              style={{ background: `${GOLD_LIGHT}86` }}
            />
            <span
              className="font-mono text-[7px] uppercase tracking-[0.28em]"
              style={{ color: `${GOLD_LIGHT}aa` }}
            >
              UMBRA / VISUAL ARCHIVE
            </span>
          </div>

          <div className="absolute left-5 top-1/2 hidden -translate-y-1/2 sm:block">
            <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/[0.30] [writing-mode:vertical-rl]">
              {item.number} / {item.number}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-5 h-8 w-8 border-r border-t sm:right-7 sm:top-7"
            style={{ borderColor: `${GOLD_LIGHT}38` }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-5 left-5 h-8 w-8 border-b border-l sm:bottom-7 sm:left-7"
            style={{ borderColor: `${GOLD_DARK}42` }}
          />

          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-6 sm:inset-x-7 sm:bottom-7">
            <div>
              <p
                className="font-mono text-[7px] uppercase tracking-[0.25em]"
                style={{ color: `${GOLD_LIGHT}85` }}
              >
                {item.number} / {item.number}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.19em] text-white/[0.70]">
                {item.label}
              </p>
            </div>

            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-white/[0.16] bg-black/[0.28] text-white/[0.58] backdrop-blur-[2px] transition-[border-color,color,transform,background] duration-300 group-hover:-translate-y-0.5 group-hover:border-[#ead39a]/50 group-hover:bg-black/[0.42] group-hover:text-[#ead39a]">
              <ArrowUpRight size={13} strokeWidth={1.05} />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3">
        <span className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.18]">
          {copy.galleryViewer}
        </span>
        <span
          className="font-mono text-[6px] uppercase tracking-[0.22em] transition-colors duration-300 group-hover:text-[#ead39a]/80"
          style={{ color: `${GOLD_LIGHT}3f` }}
        >
          {copy.galleryOpen}
        </span>
      </div>
    </button>
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
      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.22]">
        {label}
      </p>

      <p className="mt-3 text-sm text-white/[0.76]">
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
  const isPrevious =
    direction === "previous";

  const content = (
    <div
      className={[
        "min-h-[150px] bg-[#070707] p-6 sm:p-8",
        href
          ? "transition-colors duration-300 hover:bg-[#0a0a0a]"
          : "opacity-35",
        isPrevious
          ? ""
          : "text-right",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center justify-between gap-4",
          isPrevious
            ? ""
            : "flex-row-reverse",
        ].join(" ")}
      >
        <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-white/[0.22]">
          {label}
        </span>

        {isPrevious ? (
          <ArrowLeft
            aria-hidden="true"
            size={14}
            strokeWidth={1.2}
            className={
              href
                ? "text-white/[0.25] transition-[color,transform] duration-300 group-hover:-translate-x-1 group-hover:text-[#ead39a]"
                : "text-white/[0.15]"
            }
          />
        ) : (
          <ArrowUpRight
            aria-hidden="true"
            size={14}
            strokeWidth={1.2}
            className={
              href
                ? "text-white/[0.25] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ead39a]"
                : "text-white/[0.15]"
            }
          />
        )}
      </div>

      <div className="mt-7 text-[clamp(1.7rem,3vw,2.8rem)] font-[430] uppercase leading-[0.9] tracking-[-0.05em] text-white/[0.75] transition-colors duration-300 group-hover:text-white">
        {name ?? "—"}
      </div>
    </div>
  );

  if (!href) {
    return (
      <div aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group block outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/55"
    >
      {content}
    </Link>
  );
}

export default function CharacterDossier({
  character,
  relatedCharacters,
}: CharacterDossierProps) {
  const pathname = usePathname();
  const locale = getLocale(pathname);
  const copy = copyByLocale[locale];
  const reducedMotion =
    useReducedMotion() ?? false;

  const [
    lastViewedSlug,
    setLastViewedSlug,
  ] = useState<string | null>(null);

  const [
    galleryOpen,
    setGalleryOpen,
  ] = useState(false);

  const [
    selectedGalleryItem,
    setSelectedGalleryItem,
  ] = useState<GalleryItem | null>(
    null,
  );

  const archiveHref =
    locale === "en"
      ? "/en/characters"
      : "/likovi";

  const projectHref = getProjectHref(
    character.projectSlug,
    locale,
  );

  const navigation =
    getCharacterNavigation(character);

  const galleryItems = useMemo<GalleryItem[]>(
    () =>
      character.image
        ? [
            {
              id: `${character.id}-01`,
              number: "01",
              image: character.image,
              label:
                locale === "en"
                  ? "Portrait"
                  : "Portret",
              available: true,
            },
          ]
        : [],
    [character.id, character.image, locale],
  );

  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const galleryCloseTimerRef = useRef<number | null>(null);

  const openGallery = useCallback(
    (item: GalleryItem) => {
      const itemIndex = galleryItems.findIndex(
        (galleryItem) => galleryItem.id === item.id,
      );

      if (itemIndex < 0) {
        return;
      }

      if (galleryCloseTimerRef.current !== null) {
        window.clearTimeout(galleryCloseTimerRef.current);
        galleryCloseTimerRef.current = null;
      }

      setActiveGalleryIndex(itemIndex);
      setSelectedGalleryItem(item);
      setGalleryOpen(true);
    },
    [
      galleryItems,
      setActiveGalleryIndex,
      setSelectedGalleryItem,
      setGalleryOpen,
    ],
  );

  const closeGallery = useCallback(() => {
    setGalleryOpen(false);

    if (galleryCloseTimerRef.current !== null) {
      window.clearTimeout(galleryCloseTimerRef.current);
    }

    galleryCloseTimerRef.current = window.setTimeout(() => {
      galleryCloseTimerRef.current = null;
      setSelectedGalleryItem(null);
    }, reducedMotion ? 0 : 240);
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
        (activeGalleryIndex + direction + galleryItems.length) %
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
      }
    };

    document.body.style.overflow =
      "hidden";

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
  }, [galleryOpen, closeGallery]);

  useEffect(() => {
    return () => {
      if (galleryCloseTimerRef.current !== null) {
        window.clearTimeout(galleryCloseTimerRef.current);
      }
    };
  }, []);

  const lastViewedCharacter =
    lastViewedSlug
      ? getCharacterBySlug(
          lastViewedSlug,
        )
      : null;

  const reveal = {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion
          ? 0
          : 0.68,
        ease: EASE,
      },
    },
  };

  const navigationPosition =
    String(
      navigation.position,
    ).padStart(2, "0");

  const navigationTotal =
    String(
      navigation.total,
    ).padStart(2, "0");

  return (
    <>
      <main
        data-umbra-scene="character-dossier"
        className="min-h-screen overflow-hidden bg-[#030303] text-[#f4f0e8]"
      >
        {/* HERO */}
        <section className="relative min-h-[100svh] overflow-hidden border-b border-white/[0.07]">
          <motion.div
            initial={{
              opacity: 0,
              scale: reducedMotion
                ? 1
                : 1.02,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: reducedMotion
                ? 0
                : 1.05,
              ease: EASE,
            }}
            className="absolute inset-0"
          >
            <CharacterBackdrop
              character={character}
            />
          </motion.div>

          {!character.image ? (
            <CharacterPlaceholder
              copy={copy}
            />
          ) : null}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 bottom-6 border border-white/[0.05] sm:inset-x-10 lg:inset-x-16"
          />

          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col px-6 pb-10 pt-7 sm:px-10 lg:px-16">
            <div className="flex items-center justify-between gap-6">
              <Link
                href={archiveHref}
                className="group inline-flex min-h-8 items-center gap-3 rounded-sm py-1 font-mono text-[8px] uppercase tracking-[0.22em] text-white/[0.42] transition-[color,transform] duration-300 hover:translate-x-0.5 hover:text-white/[0.82] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
              >
                <ArrowLeft
                  aria-hidden="true"
                  size={14}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />

                {copy.back}
              </Link>

              <span className="select-none font-mono text-[8px] uppercase tracking-[0.26em] text-white/[0.20]">
                {copy.dossier}
              </span>
            </div>

            <div className="mt-auto grid items-end gap-14 pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.4fr)]">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={reveal}
              >
                <Link
                  href={projectHref}
                  className="group/project inline-flex items-center gap-4 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                  aria-label={`${copy.project}: ${character.projectTitle}`}
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-8"
                    style={{
                      background:
                        GOLD_LIGHT,
                    }}
                  />

                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.25em] transition-colors duration-300 group-hover/project:text-white"
                    style={{
                      color: `${GOLD_LIGHT}cc`,
                    }}
                  >
                    {character.projectTitle}
                  </span>

                  <ArrowUpRight
                    aria-hidden="true"
                    size={12}
                    strokeWidth={1.1}
                    className="opacity-50 transition-[opacity,transform] duration-300 group-hover/project:translate-x-0.5 group-hover/project:-translate-y-0.5 group-hover/project:opacity-100"
                  />
                </Link>

                <h1 className="mt-7 max-w-5xl text-[clamp(4rem,10vw,10rem)] font-[430] leading-[0.78] tracking-[-0.08em]">
                  {character.name}
                </h1>

                <p className="mt-9 max-w-2xl text-base leading-8 text-white/50 sm:text-lg">
                  {character.shortDescription}
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={reveal}
                className="border-t border-white/[0.1] pt-6"
              >
                <div className="grid grid-cols-2 gap-x-8 gap-y-8">
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
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.22]">
                      {copy.project}
                    </p>

                    <Link
                      href={projectHref}
                      className="group mt-3 inline-flex items-center gap-2 rounded-sm text-sm text-white/[0.76] transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                    >
                      {character.projectTitle}

                      <ArrowUpRight
                        aria-hidden="true"
                        size={13}
                        strokeWidth={1.2}
                        className="text-[#ead39a]/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PROFILE */}
        <section className="border-b border-white/[0.07] bg-[#050505] px-6 py-24 sm:px-10 lg:px-16 lg:py-30">
          <div className="mx-auto max-w-[1500px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.22,
              }}
              variants={reveal}
              className="grid gap-12 lg:grid-cols-[0.30fr_1fr] lg:gap-20"
            >
              <div>
                <div className="flex select-none items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-[0.18em] h-px w-8"
                    style={{
                      background:
                        GOLD_LIGHT,
                    }}
                  />

                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/[0.32]">
                      {copy.profile}
                    </p>

                    <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.16]">
                      {copy.profileIndex}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
                <div>
                  <p className="max-w-3xl text-[clamp(1.35rem,2.25vw,2.15rem)] font-light leading-[1.38] tracking-[-0.035em] text-white/[0.78]">
                    {character.shortDescription}
                  </p>
                </div>

                <div className="border-t border-white/[0.08] pt-6">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/[0.24]">
                    {copy.archiveMemory}
                  </p>

                  <div className="mt-5 flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background:
                          GOLD_LIGHT,
                        boxShadow: `0 0 8px ${GOLD_LIGHT}45`,
                      }}
                    />

                    <span className="text-sm leading-6 text-white/[0.50]">
                      {copy.lastViewed}{" "}
                      {lastViewedCharacter ? (
                        <Link
                          href={getCharacterHref(
                            lastViewedCharacter,
                            locale,
                          )}
                          className="text-white/[0.76] underline decoration-white/10 underline-offset-4 transition-colors duration-300 hover:text-[#ead39a] hover:decoration-[#ead39a]/45 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                        >
                          {lastViewedCharacter.name}
                        </Link>
                      ) : (
                        <span className="text-white/[0.35]">
                          —
                        </span>
                      )}
                    </span>
                  </div>

                  <p className="mt-4 text-[11px] leading-6 text-white/[0.30]">
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

        {/* GALLERY */}
        <section
          id="galerija"
          className="scroll-mt-24 border-b border-white/[0.07] bg-[#040404] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28"
        >
          <div className="mx-auto max-w-[1500px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={reveal}
            >
              <div className="flex items-end justify-between gap-8 border-b border-white/[0.08] pb-5">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-px w-10"
                    style={{ background: GOLD_LIGHT }}
                  />
                  <span
                    className="font-mono text-[8px] uppercase tracking-[0.30em]"
                    style={{ color: `${GOLD_LIGHT}92` }}
                  >
                    {copy.gallery}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.15] sm:inline">
                    VISUAL ARCHIVE
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-6 w-px"
                    style={{ background: `${GOLD}35` }}
                  />
                  <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-white/[0.32]">
                    {String(galleryItems.length).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="relative mt-8 lg:mt-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 text-[clamp(8rem,18vw,15rem)] font-[300] leading-none tracking-[-0.09em] text-white/[0.018] lg:block"
                >
                  01
                </div>

                {galleryItems.length > 0 ? (
                  <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.28fr)_minmax(240px,.42fr)] lg:gap-14 xl:grid-cols-[minmax(0,1.34fr)_minmax(250px,.40fr)] xl:gap-16">
                    <div>
                      <GalleryCard
                        item={galleryItems[0]}
                        onOpen={openGallery}
                        copy={copy}
                      />
                    </div>

                    <div className="relative border-t border-white/[0.08] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                      <div className="flex items-center justify-between">
                        <span
                          className="font-mono text-[7px] uppercase tracking-[0.27em]"
                          style={{ color: `${GOLD_LIGHT}72` }}
                        >
                          {galleryItems[0].label}
                        </span>

                        <span className="font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.17]">
                          FRAME 01
                        </span>
                      </div>

                      <h2 className="mt-6 text-[clamp(2.1rem,4.1vw,4.4rem)] font-[430] leading-[0.88] tracking-[-0.065em] text-white/[0.90]">
                        {copy.galleryTitle}
                      </h2>

                      <p className="mt-5 max-w-[340px] text-[11px] leading-6 text-white/[0.34] sm:text-[12px] sm:leading-7">
                        {copy.galleryDescription}
                      </p>

                      <div className="mt-8 border-t border-white/[0.07] pt-5">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="font-mono text-[6px] uppercase tracking-[0.23em] text-white/[0.16]">
                              {copy.gallerySubject}
                            </p>
                            <p className="mt-2 text-[11px] uppercase tracking-[0.11em] text-white/[0.62]">
                              {character.name}
                            </p>
                          </div>

                          <div>
                            <p className="font-mono text-[6px] uppercase tracking-[0.23em] text-white/[0.16]">
                              {copy.galleryProject}
                            </p>
                            <p className="mt-2 text-[11px] uppercase tracking-[0.11em] text-white/[0.62]">
                              {character.projectTitle}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openGallery(galleryItems[0])}
                          className="group/open mt-8 inline-flex min-h-11 items-center gap-4 border border-white/[0.10] px-4 py-3 font-mono text-[7px] uppercase tracking-[0.24em] text-white/[0.42] outline-none transition-[border-color,color,transform,background] duration-300 hover:-translate-y-0.5 hover:border-[#ead39a]/45 hover:bg-[#0b0a08] hover:text-[#ead39a] focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                        >
                          <span>{copy.galleryOpen}</span>
                          <span
                            aria-hidden="true"
                            className="h-px w-7 transition-[width] duration-300 group-hover/open:w-10"
                            style={{ background: `${GOLD_LIGHT}65` }}
                          />
                          <ArrowUpRight size={12} strokeWidth={1.1} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-white/[0.08] bg-[#060606] p-7 sm:p-9">
                    <p className="font-mono text-[7px] uppercase tracking-[0.25em] text-white/[0.16]">
                      UMBRA / VISUAL ARCHIVE
                    </p>
                    <p className="mt-4 max-w-sm text-[11px] leading-6 text-white/[0.28]">
                      {copy.galleryComingSoon}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-7 flex flex-col gap-3 border-t border-white/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.12]">
                  UMBRA / VISUAL ARCHIVE
                </span>
                <span className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.11]">
                  {galleryItems.length > 0 ? `01 ${copy.galleryFrame}` : `00 ${copy.galleryFrame}`}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CHARACTER NAVIGATION */}
        <section className="border-b border-white/[0.07] bg-[#050505] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p
                  className="font-mono text-[9px] uppercase tracking-[0.28em]"
                  style={{
                    color: `${GOLD_LIGHT}b8`,
                  }}
                >
                  {copy.navigation}
                </p>

                <div className="mt-4 flex items-end gap-4">
                  <Link
                    href={projectHref}
                    className="group/project-title inline-flex rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                    aria-label={`${copy.project}: ${character.projectTitle}`}
                  >
                    <h2 className="text-[clamp(2.2rem,4vw,4.4rem)] font-[430] leading-[0.9] tracking-[-0.06em] transition-colors duration-300 group-hover/project-title:text-white/[0.80]">
                      {character.projectTitle}
                    </h2>
                  </Link>

                  <span className="pb-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.22]">
                    {copy.position}{" "}
                    {navigationPosition}{" "}
                    / {navigationTotal}
                  </span>
                </div>
              </div>

              <Link
                href={archiveHref}
                className="inline-flex min-h-11 items-center gap-3 self-start border border-white/[0.09] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.40] transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#c7a96b]/35 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55 lg:self-auto"
              >
                {copy.viewArchive}

                <ArrowUpRight
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.2}
                />
              </Link>
            </div>

            <div className="mt-10 grid gap-px border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">
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
                  navigation.previous?.name ??
                  null
                }
                direction="previous"
              />

              <div className="flex min-h-[150px] items-end justify-between bg-[#0a0a0a] p-6 sm:p-8">
                <div>
                  <div
                    className="font-mono text-[7px] uppercase tracking-[0.24em]"
                    style={{
                      color:
                        `${GOLD_LIGHT}65`,
                    }}
                  >
                    {copy.dossier}
                  </div>

                  <div className="mt-4 text-2xl font-[430] uppercase leading-none tracking-[-0.04em] text-white">
                    {character.name}
                  </div>
                </div>

                <div className="font-mono text-[10px] tracking-[0.16em] text-white/[0.18]">
                  {navigationPosition}{" "}
                  /{" "}
                  {navigationTotal}
                </div>
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
                  navigation.next?.name ??
                  null
                }
                direction="next"
              />
            </div>
          </div>
        </section>

        {/* RELATED */}
        {relatedCharacters.length > 0 ? (
          <section className="border-b border-white/[0.07] bg-[#030303] px-6 py-24 sm:px-10 lg:px-16 lg:py-30">
            <div className="mx-auto max-w-[1500px]">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.12,
                }}
                variants={reveal}
                className="mb-10"
              >
                <p
                  className="font-mono text-[9px] uppercase tracking-[0.28em]"
                  style={{
                    color:
                      `${GOLD_LIGHT}b8`,
                  }}
                >
                  {copy.connected}
                </p>

                <h2 className="mt-5 max-w-4xl text-[clamp(2.4rem,4.6vw,4.8rem)] font-[430] leading-[0.88] tracking-[-0.06em]">
                  {copy.sameWorld}
                </h2>
              </motion.div>

              <div className="grid gap-px border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
                {relatedCharacters
                  .slice(0, 3)
                  .map((related) => {
                    const relatedHref =
                      getCharacterHref(
                        related,
                        locale,
                      );

                    return (
                      <Link
                        key={related.id}
                        href={
                          relatedHref
                        }
                        aria-label={
                          locale ===
                          "en"
                            ? `Open character ${related.name}`
                            : `Otvori lik ${related.name}`
                        }
                        className="group relative min-h-[360px] overflow-hidden bg-[#070707] outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/55"
                      >
                        {related.image ? (
                          <Image
                            src={
                              related.image
                            }
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover grayscale-[0.18] transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                          />
                        ) : (
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-[radial-gradient(circle_at_70%_38%,rgba(234,211,154,0.07),transparent_34%),linear-gradient(135deg,#090909_0%,#050505_55%,#0b0a08_100%)]"
                          >
                            <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:82px_82px]" />

                            <div className="absolute left-[68%] top-[38%] h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />

                            <div className="absolute left-[68%] top-[38%] h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.08]" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.78))]" />

                        <div className="absolute inset-x-7 bottom-7">
                          <div className="mb-4 flex items-center gap-3">
                            <span
                              aria-hidden="true"
                              className="h-px w-6"
                              style={{
                                background:
                                  GOLD_LIGHT,
                              }}
                            />

                            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.38]">
                              {getCategoryLabel(
                                related.category,
                                locale,
                              )}
                            </span>
                          </div>

                          <div className="flex items-end justify-between gap-4">
                            <h3 className="text-[clamp(1.8rem,3vw,2.8rem)] font-[430] uppercase tracking-[-0.045em]">
                              {related.name}
                            </h3>

                            <ArrowUpRight
                              aria-hidden="true"
                              size={17}
                              strokeWidth={1.2}
                              className="shrink-0 text-white/[0.30] transition-[color,transform] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#ead39a]"
                            />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </section>
        ) : null}

        <footer className="bg-[#030303] px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 border-t border-white/[0.07] pt-7">
            <Link
              href={archiveHref}
              className="inline-flex min-h-8 items-center gap-2 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.26] transition-colors duration-300 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
            >
              <ArrowLeft
                aria-hidden="true"
                size={13}
                strokeWidth={1.2}
              />

              {copy.backLabel}
            </Link>

            <div className="flex items-center gap-3">
              <ScanLine
                aria-hidden="true"
                size={13}
                strokeWidth={1.2}
                className="text-[#ead39a]/38"
              />

              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.16]">
                {copy.dossierFooter}
              </span>
            </div>

            <Link
              href={projectHref}
              className="inline-flex min-h-8 items-center gap-2 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.26] transition-colors duration-300 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
            >
              {copy.projectCta}

              <ArrowUpRight
                aria-hidden="true"
                size={12}
                strokeWidth={1.15}
              />
            </Link>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {galleryOpen && selectedGalleryItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.24,
              ease: EASE,
            }}
            className="fixed inset-0 z-[260] bg-[#020202]/[0.98]"
            role="dialog"
            aria-modal="true"
            aria-label={`${copy.galleryViewer}: ${character.name}`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
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
                      boxShadow: `0 0 8px ${GOLD}32`,
                    }}
                  />
                  <span
                    className="font-mono text-[6px] uppercase tracking-[0.28em]"
                    style={{ color: `${GOLD_LIGHT}76` }}
                  >
                    {copy.galleryViewer}
                  </span>
                  <span className="hidden h-px w-8 bg-white/[0.09] sm:block" />
                  <span className="hidden font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.18] sm:block">
                    {character.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={closeGallery}
                  aria-label={copy.galleryClose}
                  className="group flex h-9 w-9 items-center justify-center border border-white/[0.10] text-white/[0.34] outline-none transition-[border-color,color,transform] duration-300 hover:-translate-y-px hover:border-[#ead39a]/45 hover:text-[#ead39a] focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                >
                  <X
                    size={13}
                    strokeWidth={1.05}
                    className="transition-transform duration-300 group-hover:rotate-90"
                  />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-auto">
                <div className="mx-auto flex min-h-full w-full max-w-[1480px] items-center px-5 py-7 sm:px-8 lg:px-12">
                  <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_230px] lg:gap-12">
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: reducedMotion ? 1 : 0.985,
                        y: reducedMotion ? 0 : 8,
                      }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        scale: reducedMotion ? 1 : 0.99,
                        y: reducedMotion ? 0 : -4,
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.38,
                        ease: EASE,
                      }}
                      className="relative flex min-h-[58svh] items-center justify-center overflow-hidden border border-white/[0.09] bg-[#050505] shadow-[0_40px_130px_rgba(0,0,0,.48)]"
                    >
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(199,169,107,.06),transparent_44%)]"
                      />

                      <div className="relative h-[60svh] min-h-[400px] max-h-[800px] w-full">
                        <Image
                          src={selectedGalleryItem.image ?? character.image ?? ""}
                          alt={`${character.name} — ${selectedGalleryItem.label}`}
                          fill
                          sizes="(min-width: 1280px) 980px, (min-width: 1024px) 70vw, 92vw"
                          className="object-contain"
                          priority
                        />
                      </div>

                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-5 top-5 h-10 w-10 border-l border-t sm:left-7 sm:top-7"
                        style={{ borderColor: `${GOLD_LIGHT}35` }}
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-5 right-5 h-10 w-10 border-b border-r sm:bottom-7 sm:right-7"
                        style={{ borderColor: `${GOLD_DARK}42` }}
                      />

                      {galleryItems.length > 1 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => showGalleryItem(-1)}
                            aria-label={copy.previous}
                            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/[0.10] bg-black/[0.24] text-white/[0.40] backdrop-blur-sm transition-[border-color,color,transform] duration-300 hover:-translate-x-0.5 hover:border-[#ead39a]/45 hover:text-[#ead39a] focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                          >
                            <ChevronLeft size={15} strokeWidth={1.1} />
                          </button>
                          <button
                            type="button"
                            onClick={() => showGalleryItem(1)}
                            aria-label={copy.next}
                            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/[0.10] bg-black/[0.24] text-white/[0.40] backdrop-blur-sm transition-[border-color,color,transform] duration-300 hover:translate-x-0.5 hover:border-[#ead39a]/45 hover:text-[#ead39a] focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                          >
                            <ChevronRight size={15} strokeWidth={1.1} />
                          </button>
                        </>
                      ) : null}
                    </motion.div>

                    <aside className="flex flex-col justify-between border-t border-white/[0.08] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                      <div>
                        <p
                          className="font-mono text-[6px] uppercase tracking-[0.28em]"
                          style={{ color: `${GOLD_LIGHT}70` }}
                        >
                          {selectedGalleryItem.number} /{" "}
                          {String(galleryItems.length).padStart(2, "0")}
                        </p>

                        <h3 className="mt-4 text-[clamp(1.8rem,3vw,3rem)] font-[430] uppercase leading-[0.9] tracking-[-0.05em] text-white/[0.84]">
                          {selectedGalleryItem.label}
                        </h3>

                        <p className="mt-5 text-[11px] leading-6 text-white/[0.28]">
                          {character.name}
                        </p>

                        <div className="mt-6 h-px w-8 bg-[#c7a96b]/35" />

                        <p className="mt-6 font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.15]">
                          {character.projectTitle}
                        </p>
                      </div>

                      <div className="mt-10 space-y-3">
                        <div className="flex items-center justify-between font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.16]">
                          <span>{copy.galleryArchive}</span>
                          <span>{navigationPosition} / {navigationTotal}</span>
                        </div>

                        <button
                          type="button"
                          onClick={closeGallery}
                          className="inline-flex min-h-10 w-full items-center justify-between border border-white/[0.08] px-4 font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.34] outline-none transition-[border-color,color] duration-300 hover:border-[#ead39a]/35 hover:text-[#ead39a] focus-visible:ring-1 focus-visible:ring-[#ead39a]/60"
                        >
                          <span>{copy.galleryClose}</span>
                          <X size={11} strokeWidth={1} />
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
