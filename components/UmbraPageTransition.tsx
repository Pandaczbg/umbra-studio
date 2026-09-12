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
   UMBRA PAGE TRANSITION — V5

   Route-level transition only.

   Layering:
   - Header: 500
   - Image transition: 190
   - Page transition: 180
   - Scrollbar: 110

   Design rule:
   A cinematic cut — fast, restrained and premium.
   It should never resemble a loading screen.
   ========================================================================== */

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

const TRANSITION_DURATION = 420;
const REDUCED_TRANSITION_DURATION = 60;

const PANEL_DURATION = 260;
const PANEL_DELAY = 24;

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

    const duration =
      reducedMotion
        ? REDUCED_TRANSITION_DURATION
        : TRANSITION_DURATION;

    timerRef.current =
      window.setTimeout(
        () => {
          setVisible(false);
          timerRef.current =
            null;
        },
        duration,
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
                : 0.16,
            ease: EASE,
          }}
        >
          <motion.div
            aria-hidden="true"
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
                  : PANEL_DURATION /
                    1000,
              ease: EASE,
            }}
          />

          <motion.div
            aria-hidden="true"
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
                  : PANEL_DURATION /
                    1000,
              delay:
                reducedMotion
                  ? 0
                  : PANEL_DELAY /
                    1000,
              ease: EASE,
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="font-mono text-[7px] uppercase tracking-[0.38em] text-[#ead39a]/30"
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
                    : 0.14,
                ease: EASE,
              }}
            >
              UMBRA
            </motion.span>

            <motion.span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-px w-[min(24vw,300px)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#c7a96b]/35 to-transparent"
              initial={{
                scaleX: 0.25,
                opacity: 0,
              }}
              animate={{
                scaleX: 1,
                opacity: 1,
              }}
              exit={{
                scaleX: 0.7,
                opacity: 0,
              }}
              transition={{
                duration:
                  reducedMotion
                    ? 0
                    : 0.18,
                delay:
                  reducedMotion
                    ? 0
                    : 0.03,
                ease: EASE,
              }}
            />

            {!reducedMotion && (
              <motion.span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-5 w-[min(30vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c7a96b]/[0.05] blur-md"
                initial={{
                  opacity: 0,
                  scaleX: 0.7,
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
                  duration: 0.22,
                  delay: 0.02,
                  ease: EASE,
                }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
