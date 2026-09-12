"use client";

import {
  useEffect,
  useRef,
} from "react";

/* ==========================================================================
   UMBRA SCENE DIRECTOR

   SINGLE SCENE AUTHORITY

   Source of scene truth:
   - elements carrying data-umbra-scene

   Source of motion truth:
   - "umbra:motion"

   Responsibilities:
   - discover and measure scenes
   - determine the active scene
   - determine scene visibility
   - determine scene progress
   - publish global CSS scene state
   - dispatch "umbra:scene-change"
   - dispatch "umbra:scene-enter"
   - dispatch "umbra:scene-leave"
   - dispatch "umbra:scene-progress"

   It intentionally does NOT install its own native scroll listener.
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
  previousId?: SceneId | null;
};

type SceneMetric = {
  id: SceneId;
  element: HTMLElement;
  index: number;
};

type SceneCandidate = {
  id: SceneId;
  element: HTMLElement;
  index: number;
  visibility: number;
  centerScore: number;
  score: number;
  progress: number;
};

const SCENE_ORDER: SceneId[] = [
  "hero",
  "project",
  "characters",
  "studio",
  "watch",
];

const VISIBILITY_WEIGHT =
  0.72;

const CENTER_WEIGHT =
  0.28;

/**
 * Prevents the active scene from flickering when two adjacent scenes
 * temporarily have nearly identical scores.
 */
const CHANGE_HYSTERESIS =
  0.045;

/**
 * A scene needs a meaningful presence in the viewport before it can
 * replace the current scene. This prevents tiny slivers at the edge
 * from becoming active.
 */
const MIN_ACTIVE_VISIBILITY =
  0.12;

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
  if (!value) {
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
  const safeHeight =
    Math.max(
      1,
      height,
    );

  const bottom =
    top +
    safeHeight;

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

  const visibleHeight =
    Math.max(
      0,
      visibleBottom -
        visibleTop,
    );

  return clamp(
    visibleHeight /
      safeHeight,
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

/**
 * Progress across the complete scene travel:
 *
 * 0 = scene is entering from the bottom
 * 0.5 = scene is centered through the viewport
 * 1 = scene is leaving through the top
 *
 * This remains stable for scenes both shorter and taller than the viewport.
 */
function calculateSceneProgress(
  top: number,
  height: number,
  viewportHeight: number,
) {
  const totalTravel =
    Math.max(
      1,
      viewportHeight +
        Math.max(
          1,
          height,
        ),
    );

  return clamp(
    (
      viewportHeight -
      top
    ) /
      totalTravel,
  );
}

function sameMetricSet(
  previous: SceneMetric[],
  next: SceneMetric[],
) {
  if (
    previous.length !==
    next.length
  ) {
    return false;
  }

  return previous.every(
    (
      metric,
      index,
    ) => {
      const candidate =
        next[index];

      return (
        candidate?.id ===
          metric.id &&
        candidate?.element ===
          metric.element &&
        candidate?.index ===
          metric.index
      );
    },
  );
}

export default function UmbraSceneDirector() {
  const activeSceneRef =
    useRef<SceneId>(
      "hero",
    );

  const activeSnapshotRef =
    useRef<SceneEventDetail | null>(
      null,
    );

  const latestMotionRef =
    useRef<MotionDetail | null>(
      null,
    );

  const metricsRef =
    useRef<SceneMetric[]>([]);

  const frameRef =
    useRef<number | null>(
      null,
    );

  const observerRef =
    useRef<MutationObserver | null>(
      null,
    );

  const resizeObserverRef =
    useRef<ResizeObserver | null>(
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

  useEffect(() => {
    const root =
      document.documentElement;

    let destroyed =
      false;

    const rebuildMetrics =
      () => {
        if (
          destroyed
        ) {
          return;
        }

        const elements =
          Array.from(
            document.querySelectorAll<HTMLElement>(
              "[data-umbra-scene]",
            ),
          );

        const metrics:
          SceneMetric[] = [];

        for (
          const element of
            elements
        ) {
          const id =
            getSceneId(
              element
                .dataset
                .umbraScene ??
                null,
            );

          if (
            !id
          ) {
            continue;
          }

          metrics.push({
            id,
            element,
            index:
              SCENE_ORDER.indexOf(
                id,
              ) + 1,
          });
        }

        metrics.sort(
          (
            a,
            b,
          ) =>
            a.index -
            b.index,
        );

        if (
          sameMetricSet(
            metricsRef.current,
            metrics,
          )
        ) {
          return;
        }

        metricsRef.current =
          metrics;

        resizeObserverRef.current?.disconnect();

        if (
          typeof ResizeObserver !==
          "undefined"
        ) {
          const resizeObserver =
            new ResizeObserver(
              () =>
                scheduleEvaluate(),
            );

          metrics.forEach(
            (
              metric,
            ) =>
              resizeObserver.observe(
                metric.element,
              ),
          );

          resizeObserverRef.current =
            resizeObserver;
        }
      };

    const publishScene =
      (
        candidate: SceneCandidate,
        direction: MotionDirection,
      ) => {
        const previousId =
          activeSceneRef.current;

        const changed =
          candidate.id !==
          previousId;

        if (
          changed
        ) {
          activeSceneRef.current =
            candidate.id;
        }

        root.dataset
          .umbraScene =
          candidate.id;

        root.dataset
          .umbraSceneDirection =
          direction;

        root.style.setProperty(
          "--umbra-scene-index",
          String(
            candidate.index,
          ),
        );

        root.style.setProperty(
          "--umbra-scene-total",
          String(
            SCENE_ORDER.length,
          ),
        );

        root.style.setProperty(
          "--umbra-scene-progress",
          candidate.progress.toFixed(
            5,
          ),
        );

        root.style.setProperty(
          "--umbra-scene-visibility",
          candidate.visibility.toFixed(
            5,
          ),
        );

        const detail:
          SceneEventDetail = {
          id:
            candidate.id,
          index:
            candidate.index,
          total:
            SCENE_ORDER.length,
          progress:
            candidate.progress,
          visibility:
            candidate.visibility,
          direction,
          previousId:
            changed
              ? previousId
              : activeSnapshotRef
                  .current
                  ?.previousId ??
                null,
        };

        activeSnapshotRef.current =
          detail;

        if (
          changed
        ) {
          window.dispatchEvent(
            new CustomEvent<SceneEventDetail>(
              "umbra:scene-leave",
              {
                detail: {
                  ...detail,
                  id:
                    previousId,
                  index:
                    SCENE_ORDER.indexOf(
                      previousId,
                    ) + 1,
                  previousId:
                    previousId,
                },
              },
            ),
          );

          window.dispatchEvent(
            new CustomEvent<SceneEventDetail>(
              "umbra:scene-change",
              {
                detail,
              },
            ),
          );

          window.dispatchEvent(
            new CustomEvent<SceneEventDetail>(
              "umbra:scene-enter",
              {
                detail,
              },
            ),
          );
        }

        const progressChanged =
          Math.abs(
            candidate.progress -
              lastProgressRef.current,
          ) >=
          0.0015;

        const visibilityChanged =
          Math.abs(
            candidate.visibility -
              lastVisibilityRef.current,
          ) >=
          0.005;

        const directionChanged =
          direction !==
          lastDirectionRef.current;

        if (
          changed ||
          progressChanged ||
          visibilityChanged ||
          directionChanged
        ) {
          lastProgressRef.current =
            candidate.progress;

          lastVisibilityRef.current =
            candidate.visibility;

          lastDirectionRef.current =
            direction;

          window.dispatchEvent(
            new CustomEvent<SceneEventDetail>(
              "umbra:scene-progress",
              {
                detail,
              },
            ),
          );
        }
      };

    const chooseActiveScene =
      (
        viewportHeight: number,
      ): SceneCandidate | null => {
        const metrics =
          metricsRef.current;

        if (
          metrics.length ===
          0
        ) {
          return null;
        }

        const candidates =
          metrics
            .map(
              (
                metric,
              ) => {
                const rect =
                  metric.element.getBoundingClientRect();

                const height =
                  Math.max(
                    1,
                    rect.height,
                  );

                const visibility =
                  calculateVisibility(
                    rect.top,
                    height,
                    viewportHeight,
                  );

                const centerScore =
                  calculateCenterScore(
                    rect.top,
                    height,
                    viewportHeight,
                  );

                const score =
                  visibility *
                    VISIBILITY_WEIGHT +
                  centerScore *
                    CENTER_WEIGHT;

                const progress =
                  calculateSceneProgress(
                    rect.top,
                    height,
                    viewportHeight,
                  );

                return {
                  id:
                    metric.id,
                  element:
                    metric.element,
                  index:
                    metric.index,
                  visibility,
                  centerScore,
                  score,
                  progress,
                };
              },
            )
            .filter(
              (
                candidate,
              ) =>
                candidate.visibility >=
                MIN_ACTIVE_VISIBILITY,
            );

        if (
          candidates.length ===
          0
        ) {
          return null;
        }

        candidates.sort(
          (
            a,
            b,
          ) =>
            b.score -
            a.score,
        );

        let best =
          candidates[0];

        const current =
          candidates.find(
            (
              candidate,
            ) =>
              candidate.id ===
              activeSceneRef.current,
          );

        if (
          current &&
          best.id !==
            current.id &&
          best.score <
            current.score +
              CHANGE_HYSTERESIS
        ) {
          best =
            current;
        }

        return best;
      };

    const evaluate =
      (
        motion?: MotionDetail,
      ) => {
        frameRef.current =
          null;

        rebuildMetrics();

        if (
          destroyed
        ) {
          return;
        }

        const viewportHeight =
          Math.max(
            1,
            window.innerHeight,
          );

        const resolvedMotion =
          motion ??
          latestMotionRef.current;

        const direction =
          resolvedMotion
            ?.direction ??
          "idle";

        const best =
          chooseActiveScene(
            viewportHeight,
          );

        if (
          !best
        ) {
          return;
        }

        publishScene(
          best,
          direction,
        );
      };

    function scheduleEvaluate(
      motion?: MotionDetail,
    ) {
      if (
        destroyed
      ) {
        return;
      }

      if (
        motion
      ) {
        latestMotionRef.current =
          motion;
      }

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
    }

    const handleMotion =
      (
        event: Event,
      ) => {
        const detail =
          (
            event as CustomEvent<MotionDetail>
          ).detail;

        scheduleEvaluate(
          detail,
        );
      };

    const handleResize =
      () => {
        scheduleEvaluate();
      };

    const observer =
      new MutationObserver(
        () => {
          rebuildMetrics();
          scheduleEvaluate();
        },
      );

    observerRef.current =
      observer;

    observer.observe(
      document.body,
      {
        childList:
          true,
        subtree:
          true,
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
        passive:
          true,
      },
    );

    rebuildMetrics();

    root.dataset
      .umbraScene =
      "hero";

    root.dataset
      .umbraSceneDirection =
      "idle";

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

    const initialFrame =
      window.requestAnimationFrame(
        () => {
          window.requestAnimationFrame(
            () => {
              if (
                destroyed
              ) {
                return;
              }

              latestMotionRef.current = {
                scrollY:
                  window.scrollY,
                direction:
                  "idle",
              };

              evaluate();
            },
          );
        },
      );

    return () => {
      destroyed =
        true;

      observer.disconnect();

      observerRef.current =
        null;

      resizeObserverRef.current?.disconnect();

      resizeObserverRef.current =
        null;

      window.removeEventListener(
        "umbra:motion",
        handleMotion,
      );

      window.removeEventListener(
        "resize",
        handleResize,
      );

      window.cancelAnimationFrame(
        initialFrame,
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

      latestMotionRef.current =
        null;

      delete root.dataset
        .umbraScene;

      delete root.dataset
        .umbraSceneDirection;

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
