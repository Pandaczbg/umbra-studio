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
   ========================================================================== */

const STORAGE_KEY =
  "umbra-image-transition";

const DISPLAY_DURATION = 560;

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

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

    let storedImage:
      | string
      | null = null;

    try {
      storedImage =
        window.sessionStorage.getItem(
          STORAGE_KEY,
        );

      window.sessionStorage.removeItem(
        STORAGE_KEY,
      );
    } catch {
      storedImage = null;
    }

    if (
      !storedImage
    ) {
      return;
    }

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
          ? 60
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
                : 0.18,
            ease: EASE,
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
                  : 0.72,
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
              ease: EASE,
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
                  rgba(2,2,2,.82),
                  rgba(2,2,2,.14) 52%,
                  rgba(2,2,2,.72)
                )`,
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                `radial-gradient(
                  circle at 50% 50%,
                  transparent 30%,
                  rgba(0,0,0,.42) 100%
                )`,
            }}
          />

          <div className="absolute inset-x-6 top-6 bottom-6 border border-white/[0.07]">
            <span
              className="absolute left-[-1px] top-[-1px] h-9 w-9 border-l border-t"
              style={{
                borderColor:
                  `${GOLD}35`,
              }}
            />

            <span
              className="absolute right-[-1px] bottom-[-1px] h-9 w-9 border-b border-r"
              style={{
                borderColor:
                  `${GOLD_LIGHT}25`,
              }}
            />
          </div>

          <div className="absolute bottom-8 left-8">
            <span
              className="font-mono text-[6px] uppercase tracking-[0.32em]"
              style={{
                color:
                  `${GOLD_LIGHT}70`,
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