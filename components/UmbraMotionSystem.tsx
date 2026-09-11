"use client";

import {
  useEffect,
  useRef,
} from "react";

/* ==========================================================================
   UMBRA MOTION SYSTEM

   SINGLE GLOBAL SCROLL SOURCE

   Responsibilities:
   - read browser scroll position
   - calculate global scroll progress
   - calculate direction
   - calculate velocity
   - calculate normalized velocity
   - expose state through CSS custom properties
   - dispatch one global "umbra:motion" event

   Consumers:
   - Header
   - UmbraSceneDirector
   - UmbraScrollbar
   - UmbraAtmosphere
   - scene components through CSS variables

   IMPORTANT:
   No other component should create its own native scroll listener.
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

function readScrollState(
  previousY: number,
  previousVelocity: number,
  previousTime: number,
): {
  detail: MotionDetail;
  nextY: number;
  nextVelocity: number;
  nextTime: number;
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
    previousTime > 0
      ? Math.max(
          1,
          now -
            previousTime,
        )
      : 16.67;

  const deltaY =
    scrollY -
    previousY;

  const rawVelocity =
    previousTime > 0
      ? deltaY /
        deltaTime
      : 0;

  const velocity =
    Number.isFinite(
      rawVelocity,
    )
      ? rawVelocity
      : 0;

  const velocitySmoothed =
    previousTime > 0
      ? previousVelocity +
        (
          velocity -
          previousVelocity
        ) *
          VELOCITY_SMOOTHING
      : velocity;

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

  let direction: MotionDirection =
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
      velocity,
      velocitySmoothed,
      speed,
      velocityNormalized,
      direction,
      viewportHeight,
      documentHeight,
      maxScroll,
    },
    nextY: scrollY,
    nextVelocity:
      velocitySmoothed,
    nextTime: now,
  };
}

export default function UmbraMotionSystem() {
  const frameRef =
    useRef<number | null>(
      null,
    );

  const previousYRef =
    useRef(0);

  const previousVelocityRef =
    useRef(0);

  const previousTimeRef =
    useRef(0);

  const runningRef =
    useRef(true);

  useEffect(() => {
    const root =
      document.documentElement;

    const publish =
      () => {
        frameRef.current =
          null;

        if (
          !runningRef.current
        ) {
          return;
        }

        const {
          detail,
          nextY,
          nextVelocity,
          nextTime,
        } =
          readScrollState(
            previousYRef.current,
            previousVelocityRef.current,
            previousTimeRef.current,
          );

        previousYRef.current =
          nextY;

        previousVelocityRef.current =
          nextVelocity;

        previousTimeRef.current =
          nextTime;

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

    const requestPublish =
      () => {
        if (
          frameRef.current !==
          null
        ) {
          return;
        }

        frameRef.current =
          window.requestAnimationFrame(
            publish,
          );
      };

    const handleScroll =
      () => {
        requestPublish();
      };

    const handleResize =
      () => {
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

        previousTimeRef.current =
          0;

        requestPublish();
      };

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

    previousYRef.current =
      window.scrollY;

    requestPublish();

    return () => {
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