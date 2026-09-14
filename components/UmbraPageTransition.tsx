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
   UMBRA PAGE TRANSITION — V6 LUXURY SYSTEM

   Route-level transition only.

   Layering:
   - Header: 500
   - Image transition: 190
   - Page transition: 180
   - Scrollbar: 110

   Design rule:
   A cinematic cut — fast, restrained and premium.
   It should never resemble a loading screen.

   Material language:
   - architectural dark glass
   - restrained champagne signal
   - soft internal reflection
   - minimal center mark
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
          className="pointer-events-none fixed inset-0 z-[180] overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(3,3,3,.985), rgba(7,7,7,.985))",
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
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(199,169,107,.035), transparent 34%)",
            }}
          />

          <span
            aria-hidden="true"
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,.018) 50%, transparent 100%)",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1/2 origin-top"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,6,6,.99), rgba(8,8,8,.985))",
              boxShadow:
                "inset 0 -1px 0 rgba(255,255,255,.028), inset 0 1px 0 rgba(255,255,255,.018)",
            }}
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
            className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,8,8,.985), rgba(5,5,5,.99))",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,.025), inset 0 -1px 0 rgba(0,0,0,.45)",
            }}
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
              className="absolute left-1/2 top-1/2 h-px w-[min(24vw,300px)] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(234,211,154,.34), rgba(234,211,154,.46), rgba(234,211,154,.34), transparent)",
                boxShadow:
                  "0 0 10px rgba(199,169,107,.06)",
              }}
              initial={{
                scaleX: 0.25,
                opacity: 0,
              }}
              animate={{
                scaleX: 1,
                opacity: 1,
              }}
              exit={{
                scaleX: 0.70,
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

            <motion.span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-px w-[min(14vw,170px)] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent)",
              }}
              initial={{
                scaleX: 0,
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
                    : 0.14,
                delay:
                  reducedMotion
                    ? 0
                    : 0.05,
                ease: EASE,
              }}
            />

            {!reducedMotion && (
              <>
                <motion.span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-7 w-[min(34vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background:
                      "radial-gradient(ellipse, rgba(199,169,107,.055), rgba(199,169,107,.018) 38%, transparent 72%)",
                    filter:
                      "blur(7px)",
                  }}
                  initial={{
                    opacity: 0,
                    scaleX: 0.65,
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
                    duration:
                      0.22,
                    delay:
                      0.02,
                    ease: EASE,
                  }}
                />

                <motion.span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background:
                      "#ead39a",
                    boxShadow:
                      "0 0 8px rgba(234,211,154,.28)",
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0.4,
                  }}
                  animate={{
                    opacity: 0.72,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  transition={{
                    duration:
                      0.16,
                    delay:
                      0.04,
                    ease: EASE,
                  }}
                />
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}