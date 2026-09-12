"use client";

import {
  useEffect,
  useRef,
} from "react";

/* ==========================================================================
   UMBRA STUDIO
   SCENE DIRECTOR
   V5 FINAL SYSTEM — TYPECHECK / METRIC FIX

   SINGLE SCENE AUTHORITY

   Source of scene truth
   --------------------------------------------------------------------------
   Elements carrying [data-umbra-scene]

   Source of motion truth
   --------------------------------------------------------------------------
   "umbra:motion"

   Responsibilities
   --------------------------------------------------------------------------
   - discover scene elements
   - measure scene geometry
   - determine active scene
   - determine visibility
   - determine scene progress
   - publish global CSS scene state
   - dispatch scene lifecycle events
   - support homepage scenes and deep-route scenes
   - recover cleanly from dynamic DOM changes

   Important V5 correction
   --------------------------------------------------------------------------
   Scene index / total are based on the scenes currently present in the DOM.

   This means:
   - homepage => 1 / 5 ... 5 / 5
   - archive/detail route with one scene => 1 / 1

   The component never reports a deep-route scene as 7 / 9 merely because
   that scene exists later in the global SceneId union.

   Architecture rule
   --------------------------------------------------------------------------
   This component owns scene state only.

   It does NOT:
   - install its own native scroll listener
   - own page navigation
   - own visual animation
   - own pointer tracking
   ========================================================================== */

type SceneId =
  | "hero"
  | "project"
  | "characters"
  | "studio"
  | "watch"
  | "projects-archive"
  | "project-detail"
  | "characters-archive"
  | "character-dossier";

type MotionDirection =
  | "up"
  | "down"
  | "idle";

type MotionDetail = {
  scrollY?: number;
  progress?: number;
  speed?: number;
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
  "projects-archive",
  "project-detail",
  "characters-archive",
  "character-dossier",
];

const VISIBILITY_WEIGHT = 0.72;
const CENTER_WEIGHT = 0.28;

const CHANGE_HYSTERESIS = 0.045;
const MIN_ACTIVE_VISIBILITY = 0.12;
const PROGRESS_THRESHOLD = 0.0015;
const VISIBILITY_THRESHOLD = 0.005;

function clamp(
  value: number,
  min = 0,
  max = 1,
) {
  return Math.min(
    max,
    Math.max(
      min,
      value,
    ),
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
    top + safeHeight;

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
    top + height / 2;

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
    (viewportHeight -
      top) /
      totalTravel,
  );
}

export default function UmbraSceneDirector() {
  const activeSceneRef =
    useRef<SceneId | null>(
      null,
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

    let destroyed = false;

    let evaluateScene:
      | ((
          motion?: MotionDetail,
        ) => void)
      | null = null;

    const scheduleEvaluate = (
      motion?: MotionDetail,
    ) => {
      if (destroyed) {
        return;
      }

      if (motion) {
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
          () => {
            frameRef.current =
              null;

            if (destroyed) {
              return;
            }

            evaluateScene?.();
          },
        );
    };

    const rebuildMetrics = () => {
      if (destroyed) {
        return;
      }

      const elements =
        Array.from(
          document.querySelectorAll<HTMLElement>(
            "[data-umbra-scene]",
          ),
        );

      const metrics: SceneMetric[] =
        [];

      for (
        const element of
          elements
      ) {
        const id =
          getSceneId(
            element.dataset
              .umbraScene ??
              null,
          );

        if (!id) {
          continue;
        }

        metrics.push({
          id,
          element,
          index: 0,
        });
      }

      metrics.sort(
        (a, b) => {
          const aTop =
            a.element
              .getBoundingClientRect()
              .top;

          const bTop =
            b.element
              .getBoundingClientRect()
              .top;

          if (
            Math.abs(
              aTop -
                bTop,
            ) > 0.5
          ) {
            return (
              aTop -
              bTop
            );
          }

          return (
            SCENE_ORDER.indexOf(
              a.id,
            ) -
            SCENE_ORDER.indexOf(
              b.id,
            )
          );
        },
      );

      metrics.forEach(
        (
          metric,
          index,
        ) => {
          metric.index =
            index + 1;
        },
      );

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

      if (
        !activeSceneRef.current &&
        metrics[0]
      ) {
        activeSceneRef.current =
          metrics[0].id;
      }
    };

    const publishScene = (
      candidate: SceneCandidate,
      direction: MotionDirection,
    ) => {
      const previousId =
        activeSceneRef.current;

      const changed =
        candidate.id !==
        previousId;

      if (changed) {
        activeSceneRef.current =
          candidate.id;
      }

      const total =
        Math.max(
          1,
          metricsRef.current.length,
        );

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
        String(total),
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
        id: candidate.id,
        index:
          candidate.index,
        total,
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

      if (changed) {
        if (previousId) {
          const previousMetric =
            metricsRef.current.find(
              (
                metric,
              ) =>
                metric.id ===
                previousId,
            );

          window.dispatchEvent(
            new CustomEvent<SceneEventDetail>(
              "umbra:scene-leave",
              {
                detail: {
                  ...detail,
                  id: previousId,
                  index:
                    previousMetric
                      ?.index ??
                    detail.index,
                  previousId:
                    previousId,
                },
              },
            ),
          );
        }

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
        PROGRESS_THRESHOLD;

      const visibilityChanged =
        Math.abs(
          candidate.visibility -
            lastVisibilityRef.current,
        ) >=
        VISIBILITY_THRESHOLD;

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

    const chooseActiveScene = (
      viewportHeight: number,
    ): SceneCandidate | null => {
      const metrics =
        metricsRef.current;

      if (
        metrics.length === 0
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
                id: metric.id,
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

    evaluateScene = (
      motion?: MotionDetail,
    ) => {
      if (destroyed) {
        return;
      }

      rebuildMetrics();

      if (
        metricsRef.current
          .length === 0
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
        resolvedMotion?.direction ??
        "idle";

      const best =
        chooseActiveScene(
          viewportHeight,
        );

      if (!best) {
        return;
      }

      publishScene(
        best,
        direction,
      );
    };

    const handleMotion = (
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

    const mutationObserver =
      new MutationObserver(
        (mutations) => {
          let relevant =
            false;

          for (
            const mutation of
              mutations
          ) {
            if (
              mutation.type ===
              "childList"
            ) {
              relevant =
                true;
              break;
            }

            if (
              mutation.type ===
                "attributes" &&
              mutation.attributeName ===
                "data-umbra-scene"
            ) {
              relevant =
                true;
              break;
            }
          }

          if (!relevant) {
            return;
          }

          rebuildMetrics();
          scheduleEvaluate();
        },
      );

    observerRef.current =
      mutationObserver;

    mutationObserver.observe(
      document.body,
      {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          "data-umbra-scene",
        ],
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

    rebuildMetrics();

    if (
      metricsRef.current[0]
    ) {
      root.dataset
        .umbraScene =
        metricsRef.current[0]
          .id;

      root.dataset
        .umbraSceneDirection =
        "idle";
    }

    const initialFrame =
      window.requestAnimationFrame(
        () => {
          window.requestAnimationFrame(
            () => {
              if (destroyed) {
                return;
              }

              latestMotionRef.current =
                {
                  scrollY:
                    window.scrollY,
                  direction:
                    "idle",
                };

              evaluateScene?.();
            },
          );
        },
      );

    return () => {
      destroyed = true;

      mutationObserver.disconnect();

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

      evaluateScene =
        null;

      latestMotionRef.current =
        null;

      metricsRef.current = [];

      activeSceneRef.current =
        null;

      activeSnapshotRef.current =
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
