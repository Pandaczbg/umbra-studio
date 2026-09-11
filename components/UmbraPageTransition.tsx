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
   ========================================================================== */

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

export default function UmbraPageTransition() {
  const pathname =
    usePathname();

  const reducedMotion =
    useReducedMotion() ?? false;

  const previousPathRef =
    useRef(pathname);

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

    setVisible(true);

    const timer =
      window.setTimeout(
        () => {
          setVisible(false);
        },
        reducedMotion
          ? 60
          : 420,
      );

    return () =>
      window.clearTimeout(
        timer,
      );
  }, [
    pathname,
    reducedMotion,
  ]);

  return (
    <AnimatePresence>
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
                  : 0.3,
              delay:
                reducedMotion
                  ? 0
                  : 0.04,
              ease: EASE,
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="font-mono text-[7px] uppercase tracking-[0.36em] text-white/[0.18]"
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
                duration:
                  reducedMotion
                    ? 0
                    : 0.18,
              }}
            >
              UMBRA
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}