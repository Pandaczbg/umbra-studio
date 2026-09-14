"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";

/* ==========================================================================
   UMBRA IMAGE TRANSITION — V6 LUXURY SYSTEM

   Optional image carried across navigation.

   Producer:
   - any future project/card component may place an image URL into
     sessionStorage under STORAGE_KEY before navigation.

   Consumer:
   - reads the image once after pathname changes
   - immediately removes the consumed value
   - renders a short cinematic reveal

   It never listens to scroll.

   Design rule:
   The image is the transition itself.
   UI remains secondary.

   Material language:
   - cinematic dark glass
   - restrained champagne framing
   - controlled edge vignette
   - minimal central signal
   ========================================================================== */

const STORAGE_KEY =
  "umbra-image-transition";

const DISPLAY_DURATION =
  520;

const REDUCED_DISPLAY_DURATION =
  60;

const GOLD =
  "#c7a96b";

const GOLD_LIGHT =
  "#ead39a";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

function readStoredImage():
  string | null {
  try {
    const stored =
      window.sessionStorage.getItem(
        STORAGE_KEY,
      );

    window.sessionStorage.removeItem(
      STORAGE_KEY,
    );

    return stored;
  } catch {
    return null;
  }
}

export default function UmbraImageTransition() {
  const pathname =
    usePathname();

  const reducedMotion =
    useReducedMotion() ?? false;

  const previousPathRef =
    useRef(pathname);

  const timerRef =
    useRef<number | null>(
      null,
    );

  const [
    image,
    setImage,
  ] =
    useState<string | null>(
      null,
    );

  const [
    transitionKey,
    setTransitionKey,
  ] = useState(0);

  useEffect(() => {
    if (
      previousPathRef.current ===
      pathname
    ) {
      return;
    }

    previousPathRef.current =
      pathname;

    if (
      timerRef.current !==
      null
    ) {
      window.clearTimeout(
        timerRef.current,
      );

      timerRef.current =
        null;
    }

    const storedImage =
      readStoredImage();

    if (!storedImage) {
      timerRef.current =
        window.setTimeout(
          () => {
            timerRef.current =
              null;

            setImage(null);
          },
          0,
        );

      return () => {
        if (
          timerRef.current !==
          null
        ) {
          window.clearTimeout(
            timerRef.current,
          );

          timerRef.current =
            null;
        }
      };
    }

    timerRef.current =
      window.setTimeout(
        () => {
          timerRef.current =
            null;

          setTransitionKey(
            (value) =>
              value + 1,
          );

          setImage(storedImage);
        },
        0,
      );

    return () => {
      if (
        timerRef.current !==
        null
      ) {
        window.clearTimeout(
          timerRef.current,
        );

        timerRef.current =
          null;
      }
    };
  }, [
    pathname,
    reducedMotion,
  ]);

  useEffect(() => {
    if (!image) {
      return;
    }

    const displayDuration =
      reducedMotion
        ? REDUCED_DISPLAY_DURATION
        : DISPLAY_DURATION;

    const hideTimer =
      window.setTimeout(
        () => {
          setImage(null);
        },
        displayDuration,
      );

    return () => {
      window.clearTimeout(
        hideTimer,
      );
    };
  }, [
    image,
    reducedMotion,
  ]);

  useEffect(() => {
    return () => {
      if (
        timerRef.current !==
        null
      ) {
        window.clearTimeout(
          timerRef.current,
        );

        timerRef.current =
          null;
      }
    };
  }, []);

  return (
    <AnimatePresence
      initial={false}
      mode="wait"
    >
      {image && (
        <motion.div
          key={transitionKey}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[190] overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(2,2,2,.985), rgba(6,6,6,.985))",
          }}
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0.01
                : 0.16,
            ease: EASE,
          }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{
              scale:
                reducedMotion
                  ? 1
                  : 1.035,
              opacity:
                reducedMotion
                  ? 1
                  : 0.78,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale:
                reducedMotion
                  ? 1
                  : 1.008,
              opacity: 0,
            }}
            transition={{
              duration:
                reducedMotion
                  ? 0.01
                  : 0.44,
              ease: EASE,
            }}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
          </motion.div>

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(2,2,2,.72), rgba(2,2,2,.08) 46%, rgba(2,2,2,.62))",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,.34), transparent 24%, transparent 74%, rgba(0,0,0,.52))",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 27%, rgba(0,0,0,.54) 100%)",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-4 border border-white/[0.065] sm:inset-6"
            style={{
              boxShadow:
                `inset 0 0 0 1px rgba(199,169,107,.045),
                 0 0 0 1px rgba(0,0,0,.30)`,
            }}
          >
            <span
              aria-hidden="true"
              className="absolute left-[-1px] top-[-1px] h-11 w-11 border-l border-t"
              style={{
                borderColor:
                  `${GOLD}42`,
                boxShadow:
                  "0 0 8px rgba(199,169,107,.035)",
              }}
            />

            <span
              aria-hidden="true"
              className="absolute right-[-1px] top-[-1px] h-5 w-5 border-r border-t"
              style={{
                borderColor:
                  `${GOLD}18`,
              }}
            />

            <span
              aria-hidden="true"
              className="absolute bottom-[-1px] left-[-1px] h-5 w-5 border-b border-l"
              style={{
                borderColor:
                  `${GOLD_LIGHT}16`,
              }}
            />

            <span
              aria-hidden="true"
              className="absolute bottom-[-1px] right-[-1px] h-11 w-11 border-b border-r"
              style={{
                borderColor:
                  `${GOLD_LIGHT}30`,
                boxShadow:
                  "0 0 8px rgba(234,211,154,.025)",
              }}
            />
          </div>

          {!reducedMotion && (
            <>
              <motion.span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-px w-[min(24vw,300px)] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(234,211,154,.36), rgba(234,211,154,.48), rgba(234,211,154,.36), transparent)",
                  boxShadow:
                    "0 0 10px rgba(199,169,107,.07)",
                }}
                initial={{
                  scaleX: 0.30,
                  opacity: 0,
                }}
                animate={{
                  scaleX: 1,
                  opacity: 1,
                }}
                exit={{
                  scaleX: 0.72,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.20,
                  delay: 0.03,
                  ease: EASE,
                }}
              />

              <motion.span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-7 w-[min(30vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(199,169,107,.045), rgba(199,169,107,.014) 40%, transparent 72%)",
                  filter:
                    "blur(7px)",
                }}
                initial={{
                  opacity: 0,
                  scaleX: 0.72,
                }}
                animate={{
                  opacity: 1,
                  scaleX: 1,
                }}
                exit={{
                  opacity: 0,
                  scaleX: 0.84,
                }}
                transition={{
                  duration: 0.24,
                  delay: 0.01,
                  ease: EASE,
                }}
              />

              <motion.span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    GOLD_LIGHT,
                  boxShadow:
                    "0 0 8px rgba(234,211,154,.28)",
                }}
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 0.68,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.7,
                }}
                transition={{
                  duration: 0.16,
                  delay: 0.04,
                  ease: EASE,
                }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}