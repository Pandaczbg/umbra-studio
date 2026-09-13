"use client";

import {
  useEffect,
  useRef,
} from "react";

/* ==========================================================================
   UMBRA STUDIO
   MOTION SYSTEM
   V6 FINAL SYSTEM

   SINGLE GLOBAL SCROLL SOURCE

   Responsibilities
   --------------------------------------------------------------------------
   - read browser scroll position
   - calculate global scroll progress
   - calculate direction
   - calculate instantaneous velocity
   - calculate smoothed velocity
   - calculate normalized velocity
   - expose runtime state through CSS custom properties
   - dispatch one global "umbra:motion" event
   - react to document geometry changes without adding another scroll system

   Consumers
   --------------------------------------------------------------------------
   - Header
   - UmbraSceneDirector
   - UmbraScrollbar
   - UmbraAtmosphere
   - scene components through CSS variables

   Contract
   --------------------------------------------------------------------------
   This component is the single native scroll listener for the application.

   Other components may consume:
   - "umbra:motion"
   - CSS custom properties

   Other components must NOT create their own native scroll listener for
   global scroll state.

   Design rule
   --------------------------------------------------------------------------
   Measure once per animation frame. Publish once per animation frame.
   ========================================================================== */

type MotionDirection =
  | "up"
  | "down"
  | "idle";

type MotionDetail = {
  scrollY: number;
  progress: number;
  velocity: number;
  velocitySmoothed: number;
  speed: number;
  velocityNormalized: number;
  direction: MotionDirection;
  viewportHeight: number;
  documentHeight: number;
  maxScroll: number;
};

type MotionState = {
  scrollY: number;
  velocitySmoothed: number;
  timestamp: number;
};

const IDLE_THRESHOLD = 0.001;
const VELOCITY_SMOOTHING = 0.18;
const MAX_REFERENCE_VELOCITY = 48;

function clamp(
  value: number,
  min = 0,
  max = 1,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

function round(
  value: number,
  decimals = 4,
) {
  const factor =
    10 ** decimals;

  return (
    Math.round(
      value * factor,
    ) / factor
  );
}

function createMotionDetail(
  previous: MotionState,
): {
  detail: MotionDetail;
  nextState: MotionState;
} {
  const root =
    document.documentElement;

  const viewportHeight =
    Math.max(
      1,
      window.innerHeight,
    );

  const documentHeight =
    Math.max(
      viewportHeight,
      root.scrollHeight,
    );

  const maxScroll =
    Math.max(
      0,
      documentHeight -
        viewportHeight,
    );

  const scrollY =
    Math.min(
      maxScroll,
      Math.max(
        0,
        window.scrollY,
      ),
    );

  const now =
    performance.now();

  const deltaTime =
    previous.timestamp > 0
      ? Math.max(
          1,
          now -
            previous.timestamp,
        )
      : 16.67;

  const deltaY =
    scrollY -
    previous.scrollY;

  const velocity =
    previous.timestamp > 0
      ? deltaY /
        deltaTime
      : 0;

  const safeVelocity =
    Number.isFinite(
      velocity,
    )
      ? velocity
      : 0;

  const velocitySmoothed =
    previous.timestamp > 0
      ? previous.velocitySmoothed +
        (
          safeVelocity -
          previous.velocitySmoothed
        ) *
          VELOCITY_SMOOTHING
      : 0;

  const speed =
    clamp(
      Math.abs(
        velocitySmoothed,
      ) /
        MAX_REFERENCE_VELOCITY,
    );

  const velocityNormalized =
    clamp(
      velocitySmoothed /
        MAX_REFERENCE_VELOCITY,
      -1,
      1,
    );

  const progress =
    maxScroll > 0
      ? clamp(
          scrollY /
            maxScroll,
        )
      : 0;

  let direction:
    MotionDirection =
      "idle";

  if (
    Math.abs(
      velocitySmoothed,
    ) >
    IDLE_THRESHOLD
  ) {
    direction =
      velocitySmoothed > 0
        ? "down"
        : "up";
  }

  return {
    detail: {
      scrollY,
      progress,
      velocity: safeVelocity,
      velocitySmoothed,
      speed,
      velocityNormalized,
      direction,
      viewportHeight,
      documentHeight,
      maxScroll,
    },

    nextState: {
      scrollY,
      velocitySmoothed,
      timestamp: now,
    },
  };
}

export default function UmbraMotionSystem() {
  const frameRef =
    useRef<number | null>(
      null,
    );

  const stateRef =
    useRef<MotionState>({
      scrollY: 0,
      velocitySmoothed: 0,
      timestamp: 0,
    });

  const runningRef =
    useRef(true);

  useEffect(() => {
    const root =
      document.documentElement;

    let destroyed = false;

    const publish = () => {
      frameRef.current =
        null;

      if (
        destroyed ||
        !runningRef.current
      ) {
        return;
      }

      const {
        detail,
        nextState,
      } =
        createMotionDetail(
          stateRef.current,
        );

      stateRef.current =
        nextState;

      root.style.setProperty(
        "--umbra-scroll-y",
        `${detail.scrollY}px`,
      );

      root.style.setProperty(
        "--umbra-scroll-progress",
        detail.progress.toFixed(5),
      );

      root.style.setProperty(
        "--umbra-scroll-velocity",
        detail.velocity.toFixed(5),
      );

      root.style.setProperty(
        "--umbra-scroll-velocity-smoothed",
        detail.velocitySmoothed.toFixed(5),
      );

      root.style.setProperty(
        "--umbra-scroll-speed",
        detail.speed.toFixed(5),
      );

      root.style.setProperty(
        "--umbra-scroll-velocity-normalized",
        detail.velocityNormalized.toFixed(5),
      );

      root.style.setProperty(
        "--umbra-scroll-energy",
        detail.speed.toFixed(5),
      );

      root.style.setProperty(
        "--umbra-viewport-height",
        `${detail.viewportHeight}px`,
      );

      root.style.setProperty(
        "--umbra-document-height",
        `${detail.documentHeight}px`,
      );

      root.dataset.umbraScrollDirection =
        detail.direction;

      window.dispatchEvent(
        new CustomEvent<MotionDetail>(
          "umbra:motion",
          {
            detail: {
              scrollY:
                round(
                  detail.scrollY,
                  2,
                ),
              progress:
                round(
                  detail.progress,
                  5,
                ),
              velocity:
                round(
                  detail.velocity,
                  4,
                ),
              velocitySmoothed:
                round(
                  detail.velocitySmoothed,
                  4,
                ),
              speed:
                round(
                  detail.speed,
                  4,
                ),
              velocityNormalized:
                round(
                  detail.velocityNormalized,
                  4,
                ),
              direction:
                detail.direction,
              viewportHeight:
                detail.viewportHeight,
              documentHeight:
                detail.documentHeight,
              maxScroll:
                detail.maxScroll,
            },
          },
        ),
      );
    };

    const requestPublish = () => {
      if (
        destroyed ||
        !runningRef.current ||
        frameRef.current !== null
      ) {
        return;
      }

      frameRef.current =
        window.requestAnimationFrame(
          publish,
        );
    };

    const resetBaseline = () => {
      stateRef.current = {
        scrollY: Math.max(
          0,
          window.scrollY,
        ),
        velocitySmoothed: 0,
        timestamp: 0,
      };
    };

    const handleScroll = () => {
      requestPublish();
    };

    const handleResize = () => {
      resetBaseline();
      requestPublish();
    };

    const handleVisibility =
      () => {
        if (
          document.visibilityState ===
          "hidden"
        ) {
          runningRef.current =
            false;

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

          return;
        }

        runningRef.current =
          true;

        resetBaseline();
        requestPublish();
      };

    const rootResizeObserver =
      typeof ResizeObserver !==
      "undefined"
        ? new ResizeObserver(() => {
            requestPublish();
          })
        : null;

    rootResizeObserver?.observe(
      root,
    );

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      handleResize,
      {
        passive: true,
      },
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibility,
    );

    resetBaseline();
    requestPublish();

    return () => {
      destroyed = true;
      runningRef.current =
        false;

      rootResizeObserver?.disconnect();

      window.removeEventListener(
        "scroll",
        handleScroll,
      );

      window.removeEventListener(
        "resize",
        handleResize,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility,
      );

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

      root.style.removeProperty(
        "--umbra-scroll-y",
      );

      root.style.removeProperty(
        "--umbra-scroll-progress",
      );

      root.style.removeProperty(
        "--umbra-scroll-velocity",
      );

      root.style.removeProperty(
        "--umbra-scroll-velocity-smoothed",
      );

      root.style.removeProperty(
        "--umbra-scroll-speed",
      );

      root.style.removeProperty(
        "--umbra-scroll-velocity-normalized",
      );

      root.style.removeProperty(
        "--umbra-scroll-energy",
      );

      root.style.removeProperty(
        "--umbra-viewport-height",
      );

      root.style.removeProperty(
        "--umbra-document-height",
      );

      delete root.dataset
        .umbraScrollDirection;
    };
  }, []);

  return null;
}
