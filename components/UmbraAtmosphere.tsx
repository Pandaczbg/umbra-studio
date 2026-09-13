"use client";

import {
  useEffect,
  useRef,
} from "react";

/* ==========================================================================
   UMBRA STUDIO
   ATMOSPHERE
   V6 FINAL SYSTEM

   Global, lightweight visual atmosphere.

   Sources
   --------------------------------------------------------------------------
   - pointer position
   - --umbra-scroll-progress through CSS

   Contract
   --------------------------------------------------------------------------
   - no Framer Motion
   - no native scroll listener
   - no global wheel / touch listener
   - no competing motion system
   - pointer tracking only on fine pointers
   - reduced-motion aware
   - runtime state is published through CSS custom properties

   Design rule
   --------------------------------------------------------------------------
   The atmosphere should be felt before it is noticed.

   It adds depth, not decoration.
   ========================================================================== */

const DEFAULT_POINTER_X = 68;
const DEFAULT_POINTER_Y = 28;

const POINTER_EASE = 0.075;
const SETTLE_THRESHOLD = 0.02;

export default function UmbraAtmosphere() {
  const frameRef =
    useRef<number | null>(null);

  const targetXRef =
    useRef(DEFAULT_POINTER_X);

  const targetYRef =
    useRef(DEFAULT_POINTER_Y);

  const currentXRef =
    useRef(DEFAULT_POINTER_X);

  const currentYRef =
    useRef(DEFAULT_POINTER_Y);

  const reducedMotionRef =
    useRef(false);

  const coarsePointerRef =
    useRef(false);

  useEffect(() => {
    const root =
      document.documentElement;

    const reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    const coarsePointerQuery =
      window.matchMedia(
        "(pointer: coarse)",
      );

    let destroyed = false;

    const cancelFrame = () => {
      if (
        frameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          frameRef.current,
        );

        frameRef.current =
          null;
      }
    };

    const writePointer = (
      x: number,
      y: number,
    ) => {
      if (destroyed) {
        return;
      }

      root.style.setProperty(
        "--umbra-pointer-x",
        `${x.toFixed(2)}%`,
      );

      root.style.setProperty(
        "--umbra-pointer-y",
        `${y.toFixed(2)}%`,
      );
    };

    const resetPointer = () => {
      currentXRef.current =
        DEFAULT_POINTER_X;

      currentYRef.current =
        DEFAULT_POINTER_Y;

      targetXRef.current =
        DEFAULT_POINTER_X;

      targetYRef.current =
        DEFAULT_POINTER_Y;

      writePointer(
        DEFAULT_POINTER_X,
        DEFAULT_POINTER_Y,
      );
    };

    const syncMedia = () => {
      reducedMotionRef.current =
        reducedMotionQuery.matches;

      coarsePointerRef.current =
        coarsePointerQuery.matches;
    };

    const render = () => {
      frameRef.current =
        null;

      if (
        destroyed ||
        reducedMotionRef.current ||
        coarsePointerRef.current
      ) {
        return;
      }

      currentXRef.current +=
        (
          targetXRef.current -
          currentXRef.current
        ) *
        POINTER_EASE;

      currentYRef.current +=
        (
          targetYRef.current -
          currentYRef.current
        ) *
        POINTER_EASE;

      writePointer(
        currentXRef.current,
        currentYRef.current,
      );

      const settled =
        Math.abs(
          targetXRef.current -
            currentXRef.current,
        ) <=
          SETTLE_THRESHOLD &&
        Math.abs(
          targetYRef.current -
            currentYRef.current,
        ) <=
          SETTLE_THRESHOLD;

      if (!settled) {
        frameRef.current =
          window.requestAnimationFrame(
            render,
          );
      }
    };

    const requestRender = () => {
      if (
        destroyed ||
        frameRef.current !==
          null
      ) {
        return;
      }

      frameRef.current =
        window.requestAnimationFrame(
          render,
        );
    };

    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      if (
        reducedMotionRef.current ||
        coarsePointerRef.current
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
        clampPointer(
          (
            event.clientX /
            Math.max(
              1,
              window.innerWidth,
            )
          ) *
            100,
        );

      targetYRef.current =
        clampPointer(
          (
            event.clientY /
            Math.max(
              1,
              window.innerHeight,
            )
          ) *
            100,
        );

      requestRender();
    };

    const handleMediaChange = () => {
      syncMedia();

      if (
        reducedMotionRef.current ||
        coarsePointerRef.current
      ) {
        cancelFrame();
        resetPointer();
        return;
      }

      requestRender();
    };

    syncMedia();
    resetPointer();

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: true,
      },
    );

    reducedMotionQuery.addEventListener(
      "change",
      handleMediaChange,
    );

    coarsePointerQuery.addEventListener(
      "change",
      handleMediaChange,
    );

    return () => {
      destroyed = true;

      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      reducedMotionQuery.removeEventListener(
        "change",
        handleMediaChange,
      );

      coarsePointerQuery.removeEventListener(
        "change",
        handleMediaChange,
      );

      cancelFrame();

      root.style.removeProperty(
        "--umbra-pointer-x",
      );

      root.style.removeProperty(
        "--umbra-pointer-y",
      );
    };
  }, []);

  return (
    <div
      className="umbra-atmosphere"
      aria-hidden="true"
    >
      <div
        className="umbra-atmosphere__aurora"
      />

      <div
        className="umbra-atmosphere__beam"
      />

      <div
        className="umbra-atmosphere__grid"
      />
    </div>
  );
}

function clampPointer(
  value: number,
) {
  return Math.min(
    100,
    Math.max(0, value),
  );
}
