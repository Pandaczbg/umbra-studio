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
   UMBRA IMAGE TRANSITION

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
   The image is the transition itself. UI remains secondary.
   ========================================================================== */

const STORAGE_KEY =
  "umbra-image-transition";

const DISPLAY_DURATION =
  560;

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

function readStoredImage() {
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

  const [image, setImage] =
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

    if (
      !storedImage
    ) {
      setImage(null);
      return;
    }

    setTransitionKey(
      (value) =>
        value + 1,
    );

    setImage(
      storedImage,
    );

    timerRef.current =
      window.setTimeout(
        () => {
          timerRef.current =
            null;

          setImage(null);
        },
        reducedMotion
          ? REDUCED_DISPLAY_DURATION
          : DISPLAY_DURATION,
      );
  }, [
    pathname,
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
      mode="sync"
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
                : 0.20,
            ease:
              EASE,
          }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{
              scale:
                reducedMotion
                  ? 1
                  : 1.045,
              opacity:
                reducedMotion
                  ? 1
                  : 0.76,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 1.01,
              opacity: 0,
            }}
            transition={{
              duration:
                reducedMotion
                  ? 0.01
                  : 0.48,
              ease:
                EASE,
            }}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover object-center"
            />
          </motion.div>

          <div
            className="absolute inset-0"
            style={{
              background:
                `linear-gradient(
                  90deg,
                  rgba(2,2,2,.84),
                  rgba(2,2,2,.12) 52%,
                  rgba(2,2,2,.74)
                )`,
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                `radial-gradient(
                  circle at 50% 50%,
                  transparent 28%,
                  rgba(0,0,0,.44) 100%
                )`,
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-5 border border-white/[0.065] sm:inset-6"
          >
            <span
              className="absolute left-[-1px] top-[-1px] h-9 w-9 border-l border-t"
              style={{
                borderColor:
                  `${GOLD}32`,
              }}
            />

            <span
              className="absolute bottom-[-1px] right-[-1px] h-9 w-9 border-b border-r"
              style={{
                borderColor:
                  `${GOLD_LIGHT}22`,
              }}
            />
          </div>

          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-px w-[min(22vw,280px)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#c7a96b]/20 to-transparent"
            initial={{
              scaleX: 0.35,
              opacity: 0,
            }}
            animate={{
              scaleX: 1,
              opacity: 1,
            }}
            exit={{
              scaleX: 0.65,
              opacity: 0,
            }}
            transition={{
              duration:
                reducedMotion
                  ? 0
                  : 0.22,
              delay:
                reducedMotion
                  ? 0
                  : 0.03,
              ease:
                EASE,
            }}
          />

          <div className="absolute bottom-7 left-7 sm:bottom-8 sm:left-8">
            <span
              className="font-mono text-[6px] uppercase tracking-[0.32em]"
              style={{
                color:
                  `${GOLD_LIGHT}66`,
              }}
            >
              UMBRA / IMAGE TRANSITION
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
