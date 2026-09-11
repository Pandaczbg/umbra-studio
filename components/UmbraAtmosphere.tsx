"use client";

import {
  useEffect,
  useRef,
} from "react";

/* ==========================================================================
   UMBRA ATMOSPHERE

   Global, lightweight visual atmosphere.

   Source:
   - pointer position
   - --umbra-scroll-progress

   It does not use Framer Motion.
   It does not listen to scroll.
   It does not capture pointer interaction.
   ========================================================================== */

export default function UmbraAtmosphere() {
  const frameRef =
    useRef<number | null>(
      null,
    );

  const targetXRef =
    useRef(68);

  const targetYRef =
    useRef(28);

  const currentXRef =
    useRef(68);

  const currentYRef =
    useRef(28);

  const reducedMotionRef =
    useRef(false);

  const coarseRef =
    useRef(false);

  useEffect(() => {
    const root =
      document.documentElement;

    const reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    const coarseQuery =
      window.matchMedia(
        "(pointer: coarse)",
      );

    const syncMedia =
      () => {
        reducedMotionRef.current =
          reducedMotionQuery.matches;

        coarseRef.current =
          coarseQuery.matches;
      };

    syncMedia();

    const handlePointerMove =
      (event: PointerEvent) => {
        if (
          reducedMotionRef.current ||
          coarseRef.current
        ) {
          return;
        }

        if (
          event.pointerType ===
          "touch"
        ) {
          return;
        }

        targetXRef.current =
          (
            event.clientX /
              Math.max(
                1,
                window.innerWidth,
              )
          ) *
          100;

        targetYRef.current =
          (
            event.clientY /
              Math.max(
                1,
                window.innerHeight,
              )
          ) *
          100;

        if (
          frameRef.current ===
          null
        ) {
          frameRef.current =
            window.requestAnimationFrame(
              render,
            );
        }
      };

    const render =
      () => {
        frameRef.current =
          null;

        if (
          reducedMotionRef.current ||
          coarseRef.current
        ) {
          return;
        }

        const ease =
          0.075;

        currentXRef.current +=
          (
            targetXRef.current -
            currentXRef.current
          ) *
          ease;

        currentYRef.current +=
          (
            targetYRef.current -
            currentYRef.current
          ) *
          ease;

        root.style.setProperty(
          "--umbra-pointer-x",
          `${currentXRef.current.toFixed(2)}%`,
        );

        root.style.setProperty(
          "--umbra-pointer-y",
          `${currentYRef.current.toFixed(2)}%`,
        );

        if (
          Math.abs(
            targetXRef.current -
              currentXRef.current,
          ) >
            0.02 ||
          Math.abs(
            targetYRef.current -
              currentYRef.current,
          ) >
            0.02
        ) {
          frameRef.current =
            window.requestAnimationFrame(
              render,
            );
        }
      };

    const handleReducedMotion =
      () => {
        syncMedia();

        if (
          reducedMotionRef.current
        ) {
          currentXRef.current =
            68;

          currentYRef.current =
            28;

          root.style.setProperty(
            "--umbra-pointer-x",
            "68%",
          );

          root.style.setProperty(
            "--umbra-pointer-y",
            "28%",
          );
        }
      };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: true,
      },
    );

    reducedMotionQuery.addEventListener(
      "change",
      handleReducedMotion,
    );

    coarseQuery.addEventListener(
      "change",
      handleReducedMotion,
    );

    root.style.setProperty(
      "--umbra-pointer-x",
      "68%",
    );

    root.style.setProperty(
      "--umbra-pointer-y",
      "28%",
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotion,
      );

      coarseQuery.removeEventListener(
        "change",
        handleReducedMotion,
      );

      if (
        frameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          frameRef.current,
        );
      }
    };
  }, []);

  return (
    <div
      className="umbra-atmosphere"
      aria-hidden="true"
    >
      <div className="umbra-atmosphere__aurora" />
      <div className="umbra-atmosphere__beam" />
      <div className="umbra-atmosphere__grid" />
    </div>
  );
}