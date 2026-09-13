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
   UMBRA IMAGE TRANSITION — V6

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
        window.setTimeout(() => {
          timerRef.current =
            null;

          setImage(null);
        }, 0);

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
      window.setTimeout(() => {
        timerRef.current =
          null;

        setTransitionKey(
          (value) =>
            value + 1,
        );

        setImage(storedImage);
      }, 0);

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
      window.setTimeout(() => {
        setImage(null);
      }, displayDuration);

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
          className="pointer-events-none fixed inset-0 z-[190] overflow-hidden bg-[#030303]"
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
                `linear-gradient(
                  90deg,
                  rgba(2,2,2,.78),
                  rgba(2,2,2,.08) 50%,
                  rgba(2,2,2,.68)
                )`,
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                `radial-gradient(
                  circle at 50% 50%,
                  transparent 30%,
                  rgba(0,0,0,.50) 100%
                )`,
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-4 border border-white/[0.075] sm:inset-6"
            style={{
              boxShadow:
                `inset 0 0 0 1px ${GOLD}08`,
            }}
          >
            <span
              aria-hidden="true"
              className="absolute left-[-1px] top-[-1px] h-10 w-10 border-l border-t"
              style={{
                borderColor:
                  `${GOLD}38`,
              }}
            />

            <span
              aria-hidden="true"
              className="absolute bottom-[-1px] right-[-1px] h-10 w-10 border-b border-r"
              style={{
                borderColor:
                  `${GOLD_LIGHT}28`,
              }}
            />
          </div>

          {!reducedMotion && (
            <>
              <motion.span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-px w-[min(24vw,300px)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#c7a96b]/30 to-transparent"
                initial={{
                  scaleX: 0.3,
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
                className="absolute left-1/2 top-1/2 h-8 w-[min(30vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c7a96b]/[0.035] blur-lg"
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
                  scaleX: 0.85,
                }}
                transition={{
                  duration: 0.24,
                  delay: 0.01,
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
