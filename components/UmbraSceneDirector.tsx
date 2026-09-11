"use client";

import {
  useEffect,
  useRef,
} from "react";

/* ==========================================================================
   UMBRA SCENE DIRECTOR

   SINGLE SCENE AUTHORITY

   Scene source:
   - elements carrying data-umbra-scene

   Motion source:
   - "umbra:motion"

   DOM observation:
   - MutationObserver ONLY for childList/subtree changes

   Responsibilities:
   - determine active scene
   - determine scene visibility
   - determine scene progress
   - expose scene state through CSS variables
   - dispatch "umbra:scene-change"
   - dispatch "umbra:scene-progress"

   It does not install a native scroll listener.
   ========================================================================== */

type SceneId =
  | "hero"
  | "project"
  | "characters"
  | "studio"
  | "watch";

type MotionDirection =
  | "up"
  | "down"
  | "idle";

type MotionDetail = {
  scrollY?: number;
  progress?: number;
  direction?: MotionDirection;
};

type SceneEventDetail = {
  id: SceneId;
  index: number;
  total: number;
  progress: number;
  visibility: number;
  direction: MotionDirection;
};

type SceneMetric = {
  id: SceneId;
  element: HTMLElement;
  index: number;
  top: number;
  height: number;
};

const SCENE_ORDER: SceneId[] = [
  "hero",
  "project",
  "characters",
  "studio",
  "watch",
];

const CHANGE_HYSTERESIS = 0.055;

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

function getSceneId(
  value: string | null,
): SceneId | null {
  if (
    !value
  ) {
    return null;
  }

  return SCENE_ORDER.includes(
    value as SceneId,
  )
    ? (value as SceneId)
    : null;
}

function calculateVisibility(
  top: number,
  height: number,
  viewportHeight: number,
) {
  const bottom =
    top + height;

  const visibleTop =
    Math.max(
      0,
      top,
    );

  const visibleBottom =
    Math.min(
      viewportHeight,
      bottom,
    );

  const visible =
    Math.max(
      0,
      visibleBottom -
        visibleTop,
    );

  return clamp(
    visible / Math.max(1, height),
  );
}

function calculateCenterScore(
  top: number,
  height: number,
  viewportHeight: number,
) {
  const center =
    top +
    height / 2;

  const viewportCenter =
    viewportHeight / 2;

  const distance =
    Math.abs(
      center -
        viewportCenter,
    );

  return clamp(
    1 -
      distance /
        Math.max(
          1,
          viewportHeight,
        ),
  );
}

function calculateSceneProgress(
  top: number,
  height: number,
  viewportHeight: number,
) {
  const travel =
    Math.max(
      1,
      height -
        viewportHeight,
    );

  return clamp(
    -top / travel,
  );
}

export default function UmbraSceneDirector() {
  const activeSceneRef =
    useRef<SceneId>("hero");

  const metricsRef =
    useRef<SceneMetric[]>([]);

  const frameRef =
    useRef<number | null>(
      null,
    );

  const lastProgressRef =
    useRef(-1);

  const lastVisibilityRef =
    useRef(-1);

  const lastDirectionRef =
    useRef<MotionDirection>(
      "idle",
    );

  const rebuildMetrics =
    () => {
      const elements =
        Array.from(
          document.querySelectorAll<HTMLElement>(
            "[data-umbra-scene]",
          ),
        );

      const metrics: SceneMetric[] =
        [];

      for (
        const element of elements
      ) {
        const id =
          getSceneId(
            element.dataset
              .umbraScene ?? null,
          );

        if (!id) {
          continue;
        }

        metrics.push({
          id,
          element,
          index:
            SCENE_ORDER.indexOf(
              id,
            ) + 1,
          top: 0,
          height: Math.max(
            1,
            element.offsetHeight,
          ),
        });
      }

      metrics.sort(
        (a, b) =>
          a.index -
          b.index,
      );

      metricsRef.current =
        metrics;
    };

  useEffect(() => {
    const root =
      document.documentElement;

    const publishScene =
      (
        candidate: SceneId,
        visibility: number,
        sceneProgress: number,
        direction: MotionDirection,
      ) => {
        const metrics =
          metricsRef.current;

        const metric =
          metrics.find(
            (item) =>
              item.id ===
              candidate,
          );

        const index =
          metric?.index ??
          SCENE_ORDER.indexOf(
            candidate,
          ) + 1;

        const current =
          activeSceneRef.current;

        if (
          candidate !== current
        ) {
          activeSceneRef.current =
            candidate;

          root.dataset.umbraScene =
            candidate;

          root.style.setProperty(
            "--umbra-scene-index",
            String(index),
          );

          root.style.setProperty(
            "--umbra-scene-total",
            String(
              SCENE_ORDER.length,
            ),
          );

          const detail: SceneEventDetail =
            {
              id: candidate,
              index,
              total:
                SCENE_ORDER.length,
              progress:
                sceneProgress,
              visibility,
              direction,
            };

          window.dispatchEvent(
            new CustomEvent<SceneEventDetail>(
              "umbra:scene-change",
              {
                detail,
              },
            ),
          );
        }

        root.style.setProperty(
          "--umbra-scene-progress",
          sceneProgress.toFixed(5),
        );

        root.style.setProperty(
          "--umbra-scene-visibility",
          visibility.toFixed(5),
        );

        const progressChanged =
          Math.abs(
            sceneProgress -
              lastProgressRef.current,
          ) >= 0.002;

        const visibilityChanged =
          Math.abs(
            visibility -
              lastVisibilityRef.current,
          ) >= 0.01;

        const directionChanged =
          direction !==
          lastDirectionRef.current;

        if (
          progressChanged ||
          visibilityChanged ||
          directionChanged
        ) {
          lastProgressRef.current =
            sceneProgress;

          lastVisibilityRef.current =
            visibility;

          lastDirectionRef.current =
            direction;

          window.dispatchEvent(
            new CustomEvent<SceneEventDetail>(
              "umbra:scene-progress",
              {
                detail: {
                  id: candidate,
                  index,
                  total:
                    SCENE_ORDER.length,
                  progress:
                    sceneProgress,
                  visibility,
                  direction,
                },
              },
            ),
          );
        }
      };

    const evaluate =
      (
        detail?: MotionDetail,
      ) => {
        frameRef.current =
          null;

        rebuildMetrics();

        const viewportHeight =
          Math.max(
            1,
            window.innerHeight,
          );

        const scrollY =
          typeof detail?.scrollY ===
          "number"
            ? detail.scrollY
            : window.scrollY;

        const direction =
          detail?.direction ??
          "idle";

        const metrics =
          metricsRef.current;

        if (
          metrics.length === 0
        ) {
          return;
        }

        let best:
          | {
              id: SceneId;
              score: number;
              visibility: number;
              progress: number;
            }
          | null = null;

        for (
          const metric of metrics
        ) {
          const rect =
            metric.element.getBoundingClientRect();

          const visibility =
            calculateVisibility(
              rect.top,
              rect.height,
              viewportHeight,
            );

          const centerScore =
            calculateCenterScore(
              rect.top,
              rect.height,
              viewportHeight,
            );

          const score =
            visibility * 0.68 +
            centerScore * 0.32;

          const progress =
            calculateSceneProgress(
              rect.top,
              rect.height,
              viewportHeight,
            );

          if (
            !best ||
            score >
              best.score
          ) {
            best = {
              id: metric.id,
              score,
              visibility,
              progress,
            };
          }
        }

        if (!best) {
          return;
        }

        const current =
          metrics.find(
            (item) =>
              item.id ===
              activeSceneRef.current,
          );

        if (current) {
          const currentRect =
            current.element.getBoundingClientRect();

          const currentVisibility =
            calculateVisibility(
              currentRect.top,
              currentRect.height,
              viewportHeight,
            );

          const currentCenter =
            calculateCenterScore(
              currentRect.top,
              currentRect.height,
              viewportHeight,
            );

          const currentScore =
            currentVisibility *
              0.68 +
            currentCenter *
              0.32;

          if (
            best.id !==
              current.id &&
            best.score <
              currentScore +
                CHANGE_HYSTERESIS
          ) {
            best = {
              id: current.id,
              score: currentScore,
              visibility:
                currentVisibility,
              progress:
                calculateSceneProgress(
                  currentRect.top,
                  currentRect.height,
                  viewportHeight,
                ),
            };
          }
        }

        if (
          detail?.progress !==
          undefined
        ) {
          root.style.setProperty(
            "--umbra-scroll-progress",
            clamp(
              detail.progress,
            ).toFixed(5),
          );
        }

        root.style.setProperty(
          "--umbra-scroll-y",
          `${scrollY}px`,
        );

        publishScene(
          best.id,
          best.visibility,
          best.progress,
          direction,
        );
      };

    const handleMotion =
      (event: Event) => {
        const detail =
          (
            event as CustomEvent<MotionDetail>
          ).detail;

        if (
          frameRef.current !==
          null
        ) {
          return;
        }

        frameRef.current =
          window.requestAnimationFrame(
            () =>
              evaluate(detail),
          );
      };

    const handleResize =
      () => {
        if (
          frameRef.current !==
          null
        ) {
          return;
        }

        frameRef.current =
          window.requestAnimationFrame(
            () =>
              evaluate(),
          );
      };

    const observer =
      new MutationObserver(
        () => {
          rebuildMetrics();
          handleResize();
        },
      );

    rebuildMetrics();

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true,
      },
    );

    window.addEventListener(
      "umbra:motion",
      handleMotion,
    );

    window.addEventListener(
      "resize",
      handleResize,
      {
        passive: true,
      },
    );

    root.dataset.umbraScene =
      "hero";

    root.style.setProperty(
      "--umbra-scene-index",
      "1",
    );

    root.style.setProperty(
      "--umbra-scene-total",
      String(
        SCENE_ORDER.length,
      ),
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "umbra:motion",
        handleMotion,
      );

      window.removeEventListener(
        "resize",
        handleResize,
      );

      if (
        frameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          frameRef.current,
        );
      }

      delete root.dataset
        .umbraScene;

      root.style.removeProperty(
        "--umbra-scene-progress",
      );

      root.style.removeProperty(
        "--umbra-scene-visibility",
      );

      root.style.removeProperty(
        "--umbra-scene-index",
      );

      root.style.removeProperty(
        "--umbra-scene-total",
      );
    };
  }, []);

  return null;
}