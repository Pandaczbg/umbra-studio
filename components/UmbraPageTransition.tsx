"use client";

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
   UMBRA PAGE TRANSITION

   Route-level transition only.

   Layering:
   - Header: 500
   - Scrollbar: 110
   - Page transition: 180
   - Image transition: 190

   Header therefore remains the permanent interface layer.

   Design rule:
   The transition should feel like a cinematic cut, not a loading screen.
   ========================================================================== */

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

const TRANSITION_MS =
  420;

const REDUCED_TRANSITION_MS =
  60;

export default function UmbraPageTransition() {
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

  const [visible, setVisible] =
    useState(false);

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

    setVisible(true);

    timerRef.current =
      window.setTimeout(
        () => {
          setVisible(false);

          timerRef.current =
            null;
        },
        reducedMotion
          ? REDUCED_TRANSITION_MS
          : TRANSITION_MS,
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
    return () => {
      if (
        timerRef.current !==
        null
      ) {
        window.clearTimeout(
          timerRef.current,
        );
      }
    };
  }, []);

  return (
    <AnimatePresence
      initial={false}
      mode="sync"
    >
      {visible && (
        <motion.div
          key={pathname}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[180] overflow-hidden bg-[#030303]"
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
                : 0.24,
            ease: EASE,
          }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 origin-top bg-[#050505]"
            initial={{
              scaleY: 0,
            }}
            animate={{
              scaleY: 1,
            }}
            exit={{
              scaleY: 0,
            }}
            transition={{
              duration:
                reducedMotion
                  ? 0.01
                  : 0.26,
              ease: EASE,
            }}
          />

          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom bg-[#050505]"
            initial={{
              scaleY: 0,
            }}
            animate={{
              scaleY: 1,
            }}
            exit={{
              scaleY: 0,
            }}
            transition={{
              duration:
                reducedMotion
                  ? 0.01
                  : 0.30,
              delay:
                reducedMotion
                  ? 0
                  : 0.04,
              ease: EASE,
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="font-mono text-[7px] uppercase tracking-[0.36em] text-white/[0.20]"
              initial={{
                opacity: 0,
                y: 4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -2,
              }}
              transition={{
                duration:
                  reducedMotion
                    ? 0
                    : 0.18,
                ease: EASE,
              }}
            >
              UMBRA
            </motion.span>
          </div>

          {!reducedMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-px w-[min(22vw,280px)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#c7a96b]/18 to-transparent"
              initial={{
                scaleX: 0.4,
                opacity: 0,
              }}
              animate={{
                scaleX: 1,
                opacity: 1,
              }}
              exit={{
                scaleX: 0.6,
                opacity: 0,
              }}
              transition={{
                duration: 0.24,
                delay: 0.04,
                ease: EASE,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
