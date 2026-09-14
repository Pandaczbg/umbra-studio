"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

/* ==========================================================================
   UMBRA SCROLLBAR — V6 LUXURY SYSTEM

   Visual client of UmbraMotionSystem.

   It does not own page scrolling.
   It consumes "umbra:motion" as the primary motion source.

   Owns:
   - geometry
   - visual interpolation
   - pointer drag
   - track click
   - keyboard navigation
   - hover / idle state

   V6 visual direction
   --------------------------------------------------------------------------
   - dark architectural rail
   - restrained champagne-metal thumb
   - controlled glass material
   - minimal active glow
   - same visual language as the Header
   - visible enough to feel intentional, quiet enough to remain secondary
   ========================================================================== */

type MotionDirection =
  | "up"
  | "down"
  | "idle";

type MotionDetail = {
  scrollY?: number;
  progress?: number;
  speed?: number;
  direction?: MotionDirection;
  viewportHeight?: number;
  documentHeight?: number;
};

type Geometry = {
  trackHeight: number;
  thumbHeight: number;
  travel: number;
};

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";

const SCROLL_REGION_ID =
  "umbra-document-scroll";

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

export default function UmbraScrollbar() {
  const railRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const trackRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const thumbRef =
    useRef<HTMLButtonElement | null>(
      null,
    );

  const glowRef =
    useRef<HTMLSpanElement | null>(
      null,
    );

  const coreRef =
    useRef<HTMLSpanElement | null>(
      null,
    );

  const geometryRef =
    useRef<Geometry>({
      trackHeight: 0,
      thumbHeight: 0,
      travel: 0,
    });

  const targetProgressRef =
    useRef(0);

  const renderedProgressRef =
    useRef(0);

  const targetEnergyRef =
    useRef(0);

  const renderedEnergyRef =
    useRef(0);

  const directionRef =
    useRef<MotionDirection>(
      "idle",
    );

  const draggingRef =
    useRef(false);

  const pointerOffsetRef =
    useRef(0);

  const rafRef =
    useRef<number | null>(
      null,
    );

  const geometryRafRef =
    useRef<number | null>(
      null,
    );

  const resizeObserverRef =
    useRef<ResizeObserver | null>(
      null,
    );

  const mutationObserverRef =
    useRef<MutationObserver | null>(
      null,
    );

  const reducedMotionRef =
    useRef(false);

  const requestRenderRef =
    useRef<() => void>(
      () => {},
    );

  const updateGeometry =
    useCallback(() => {
      const track =
        trackRef.current;

      const thumb =
        thumbRef.current;

      if (
        !track ||
        !thumb
      ) {
        return;
      }

      const trackRect =
        track.getBoundingClientRect();

      const viewportHeight =
        Math.max(
          1,
          window.innerHeight,
        );

      const root =
        document.documentElement;

      const documentHeight =
        Math.max(
          viewportHeight,
          root.scrollHeight,
        );

      const ratio =
        clamp(
          viewportHeight /
            documentHeight,
        );

      const trackHeight =
        Math.max(
          80,
          trackRect.height,
        );

      const thumbHeight =
        Math.min(
          trackHeight,
          Math.max(
            46,
            trackHeight *
              ratio,
          ),
        );

      const travel =
        Math.max(
          0,
          trackHeight -
            thumbHeight,
        );

      geometryRef.current =
        {
          trackHeight,
          thumbHeight,
          travel,
        };

      thumb.style.height =
        `${thumbHeight}px`;

      if (
        draggingRef.current
      ) {
        return;
      }

      const currentProgress =
        clamp(
          targetProgressRef.current,
        );

      const currentY =
        currentProgress *
        travel;

      thumb.style.transform =
        `translate3d(0, ${currentY}px, 0)`;
    }, []);

  const scheduleGeometry =
    useCallback(() => {
      if (
        geometryRafRef.current !==
        null
      ) {
        return;
      }

      geometryRafRef.current =
        window.requestAnimationFrame(
          () => {
            geometryRafRef.current =
              null;

            updateGeometry();
          },
        );
    }, [updateGeometry]);

  const requestRender =
    useCallback(() => {
      if (
        rafRef.current !==
        null
      ) {
        return;
      }

      rafRef.current =
        window.requestAnimationFrame(
          () => {
            rafRef.current =
              null;

            const thumb =
              thumbRef.current;

            const glow =
              glowRef.current;

            const core =
              coreRef.current;

            if (
              !thumb ||
              !glow ||
              !core
            ) {
              return;
            }

            const target =
              clamp(
                targetProgressRef.current,
              );

            const current =
              renderedProgressRef.current;

            const targetEnergy =
              clamp(
                targetEnergyRef.current,
              );

            const currentEnergy =
              renderedEnergyRef.current;

            const reduced =
              reducedMotionRef.current;

            const progress =
              reduced ||
              draggingRef.current
                ? target
                : current +
                  (
                    target -
                    current
                  ) *
                    0.22;

            const energy =
              reduced
                ? targetEnergy
                : currentEnergy +
                  (
                    targetEnergy -
                    currentEnergy
                  ) *
                    0.18;

            renderedProgressRef.current =
              progress;

            renderedEnergyRef.current =
              energy;

            const {
              travel,
            } =
              geometryRef.current;

            const y =
              clamp(progress) *
              Math.max(
                0,
                travel,
              );

            const tiltBase =
              directionRef.current ===
              "down"
                ? 0.35
                : directionRef.current ===
                    "up"
                  ? -0.35
                  : 0;

            const tilt =
              draggingRef.current
                ? 0
                : tiltBase *
                  energy;

            thumb.style.transform =
              `translate3d(0, ${y}px, 0) rotateZ(${tilt}deg)`;

            const glowOpacity =
              0.10 +
              energy *
                0.34;

            glow.style.opacity =
              String(
                glowOpacity,
              );

            core.style.transform =
              `translateY(-50%) scaleY(${0.70 + energy * 0.30})`;

            core.style.opacity =
              String(
                0.46 +
                  energy *
                    0.38,
              );

            const progressDifference =
              Math.abs(
                target -
                  progress,
              );

            const energyDifference =
              Math.abs(
                targetEnergy -
                  energy,
              );

            if (
              !reduced &&
              (
                progressDifference >
                  0.001 ||
                energyDifference >
                  0.001
              )
            ) {
              requestRenderRef.current();
            }
          },
        );
    }, []);

  useEffect(() => {
    requestRenderRef.current =
      requestRender;

    return () => {
      requestRenderRef.current =
        () => {};
    };
  }, [requestRender]);

  const setProgress =
    useCallback(
      (
        progress: number,
        behavior:
          | "instant"
          | "smooth" =
          "smooth",
      ) => {
        const next =
          clamp(progress);

        targetProgressRef.current =
          next;

        if (
          behavior ===
            "instant" ||
          reducedMotionRef.current
        ) {
          renderedProgressRef.current =
            next;
        }

        requestRender();
      },
      [requestRender],
    );

  const progressFromClientY =
    useCallback(
      (
        clientY: number,
      ) => {
        const track =
          trackRef.current;

        if (!track) {
          return 0;
        }

        const rect =
          track.getBoundingClientRect();

        const {
          travel,
        } =
          geometryRef.current;

        const usableTravel =
          Math.max(
            1,
            travel,
          );

        const localY =
          clientY -
          rect.top -
          pointerOffsetRef.current;

        return clamp(
          localY /
            usableTravel,
        );
      },
      [],
    );

  const scrollToProgress =
    useCallback(
      (
        progress: number,
      ) => {
        const root =
          document.documentElement;

        const maxScroll =
          Math.max(
            0,
            root.scrollHeight -
              window.innerHeight,
          );

        const next =
          clamp(progress);

        const target =
          next *
          maxScroll;

        window.scrollTo({
          top:
            target,
          behavior:
            "auto",
        });

        setProgress(
          next,
          "instant",
        );
      },
      [setProgress],
    );

  useEffect(() => {
    const media =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    const updateReduced =
      () => {
        reducedMotionRef.current =
          media.matches;

        if (
          media.matches
        ) {
          renderedProgressRef.current =
            targetProgressRef.current;

          renderedEnergyRef.current =
            targetEnergyRef.current;
        }

        requestRender();
      };

    updateReduced();

    media.addEventListener(
      "change",
      updateReduced,
    );

    const handleMotion =
      (event: Event) => {
        const detail =
          (
            event as CustomEvent<MotionDetail>
          ).detail;

        const nextProgress =
          typeof detail?.progress ===
          "number"
            ? clamp(
                detail.progress,
              )
            : targetProgressRef.current;

        const nextEnergy =
          typeof detail?.speed ===
          "number"
            ? clamp(
                detail.speed,
            )
            : 0;

        targetProgressRef.current =
          nextProgress;

        targetEnergyRef.current =
          nextEnergy;

        directionRef.current =
          detail?.direction ??
          "idle";

        requestRender();
      };

    const handleResize =
      () => {
        scheduleGeometry();
      };

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

    resizeObserverRef.current =
      new ResizeObserver(
        handleResize,
      );

    if (
      railRef.current
    ) {
      resizeObserverRef.current.observe(
        railRef.current,
      );
    }

    if (
      document.documentElement
    ) {
      resizeObserverRef.current.observe(
        document.documentElement,
      );
    }

    if (
      document.body
    ) {
      resizeObserverRef.current.observe(
        document.body,
      );
    }

    mutationObserverRef.current =
      new MutationObserver(
        () => {
          scheduleGeometry();
        },
      );

    if (
      document.body
    ) {
      mutationObserverRef.current.observe(
        document.body,
        {
          childList:
            true,
          subtree:
            true,
        },
      );
    }

    updateGeometry();
    requestRender();

    const firstFrame =
      window.requestAnimationFrame(
        () => {
          updateGeometry();
          requestRender();
        },
      );

    const secondFrame =
      window.requestAnimationFrame(
        () => {
          updateGeometry();
          requestRender();
        },
      );

    return () => {
      window.removeEventListener(
        "umbra:motion",
        handleMotion,
      );

      window.removeEventListener(
        "resize",
        handleResize,
      );

      media.removeEventListener(
        "change",
        updateReduced,
      );

      resizeObserverRef.current?.disconnect();

      mutationObserverRef.current?.disconnect();

      window.cancelAnimationFrame(
        firstFrame,
      );

      window.cancelAnimationFrame(
        secondFrame,
      );

      if (
        rafRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          rafRef.current,
        );

        rafRef.current =
          null;
      }

      if (
        geometryRafRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          geometryRafRef.current,
        );

        geometryRafRef.current =
          null;
      }
    };
  }, [
    requestRender,
    scheduleGeometry,
    updateGeometry,
  ]);

  useEffect(() => {
    const body =
      document.body;

    const previousId =
      body.id;

    body.id =
      SCROLL_REGION_ID;

    return () => {
      if (
        body.id ===
        SCROLL_REGION_ID
      ) {
        body.id =
          previousId;
      }
    };
  }, []);

  useEffect(() => {
    const thumb =
      thumbRef.current;

    const track =
      trackRef.current;

    if (
      !thumb ||
      !track
    ) {
      return;
    }

    const handlePointerMove =
      (
        event: PointerEvent,
      ) => {
        if (
          !draggingRef.current
        ) {
          return;
        }

        event.preventDefault();

        const next =
          progressFromClientY(
            event.clientY,
          );

        targetProgressRef.current =
          next;

        renderedProgressRef.current =
          next;

        scrollToProgress(
          next,
        );
      };

    const stopDragging =
      () => {
        draggingRef.current =
          false;

        thumb.dataset.dragging =
          "false";

        pointerOffsetRef.current =
          0;

        document.body.style.removeProperty(
          "user-select",
        );

        requestRender();
      };

    const handlePointerUp =
      () => {
        stopDragging();
      };

    const handlePointerCancel =
      () => {
        stopDragging();
      };

    const handleTrackPointerDown =
      (
        event: PointerEvent,
      ) => {
        if (
          event.button !==
          0
        ) {
          return;
        }

        if (
          event.target ===
            thumb ||
          thumb.contains(
            event.target as Node,
          )
        ) {
          return;
        }

        const next =
          progressFromClientY(
            event.clientY,
          );

        scrollToProgress(
          next,
        );
      };

    const handleThumbPointerDown =
      (
        event: PointerEvent,
      ) => {
        if (
          event.button !==
          0
        ) {
          return;
        }

        const rect =
          thumb.getBoundingClientRect();

        draggingRef.current =
          true;

        pointerOffsetRef.current =
          event.clientY -
          rect.top;

        thumb.dataset.dragging =
          "true";

        document.body.style.userSelect =
          "none";

        thumb.setPointerCapture?.(
          event.pointerId,
        );

        event.preventDefault();
      };

    const handleKeyDown =
      (
        event: KeyboardEvent,
      ) => {
        const current =
          targetProgressRef.current;

        switch (
          event.key
        ) {
          case "ArrowDown":
          case "ArrowRight":
            event.preventDefault();

            scrollToProgress(
              current +
                0.04,
            );

            break;

          case "ArrowUp":
          case "ArrowLeft":
            event.preventDefault();

            scrollToProgress(
              current -
                0.04,
            );

            break;

          case "PageDown":
            event.preventDefault();

            scrollToProgress(
              current +
                0.18,
            );

            break;

          case "PageUp":
            event.preventDefault();

            scrollToProgress(
              current -
                0.18,
            );

            break;

          case "Home":
            event.preventDefault();

            scrollToProgress(
              0,
            );

            break;

          case "End":
            event.preventDefault();

            scrollToProgress(
              1,
            );

            break;

          default:
            break;
        }
      };

    thumb.addEventListener(
      "pointerdown",
      handleThumbPointerDown,
    );

    track.addEventListener(
      "pointerdown",
      handleTrackPointerDown,
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: false,
      },
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp,
    );

    window.addEventListener(
      "pointercancel",
      handlePointerCancel,
    );

    thumb.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      thumb.removeEventListener(
        "pointerdown",
        handleThumbPointerDown,
      );

      track.removeEventListener(
        "pointerdown",
        handleTrackPointerDown,
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp,
      );

      window.removeEventListener(
        "pointercancel",
        handlePointerCancel,
      );

      thumb.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    progressFromClientY,
    scrollToProgress,
    requestRender,
  ]);

  return (
    <div
      ref={railRef}
      className="umbra-scrollbar pointer-events-none fixed right-1 top-[108px] z-[110] hidden h-[calc(100vh-136px)] w-8 lg:block"
      aria-hidden="false"
    >
      <div
        ref={trackRef}
        className="pointer-events-auto absolute inset-0 cursor-pointer"
        aria-hidden="true"
      >
        <span
          aria-hidden="true"
          className="absolute right-[13px] top-1 bottom-1 w-px"
          style={{
            background:
              `linear-gradient(
                180deg,
                transparent,
                rgba(255,255,255,.075) 14%,
                rgba(255,255,255,.12) 50%,
                rgba(255,255,255,.075) 86%,
                transparent
              )`,
            boxShadow:
              "0 0 5px rgba(255,255,255,.025)",
          }}
        />

        <span
          aria-hidden="true"
          className="absolute right-[12px] top-2 bottom-2 w-[2px] rounded-full"
          style={{
            background:
              `linear-gradient(
                180deg,
                transparent,
                rgba(199,169,107,.18) 18%,
                rgba(216,192,138,.28) 50%,
                rgba(199,169,107,.18) 82%,
                transparent
              )`,
            opacity:
              0.70,
            boxShadow:
              "0 0 5px rgba(199,169,107,.06)",
          }}
        />
      </div>

      <span
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-[2px] top-0 h-9 w-[19px] rounded-full"
        style={{
          opacity:
            0.10,
          background:
            `radial-gradient(
              circle,
              ${GOLD_LIGHT}2c,
              ${GOLD}10 40%,
              transparent 74%
            )`,
          filter:
            "blur(3px)",
        }}
      />

      <button
        ref={thumbRef}
        type="button"
        aria-label="Page scroll position"
        tabIndex={0}
        data-dragging="false"
        className="pointer-events-auto absolute right-[7px] top-0 w-[10px] cursor-grab appearance-none overflow-visible rounded-full border p-0 outline-none transition-[background,border-color,box-shadow,width] duration-250 hover:cursor-grab active:cursor-grabbing focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
        style={{
          height:
            "46px",
          borderColor:
            "rgba(234,211,154,.62)",
          background:
            `linear-gradient(
              180deg,
              rgba(234,211,154,.20),
              rgba(216,192,138,.12) 42%,
              rgba(7,7,7,.66) 100%
            )`,
          boxShadow:
            `0 0 0 1px rgba(199,169,107,.08),
             0 6px 18px rgba(0,0,0,.34),
             inset 0 1px 0 rgba(255,255,255,.12),
             inset 0 -1px 0 rgba(0,0,0,.32)`,
          transform:
            "translate3d(0,0,0)",
          backdropFilter:
            "blur(5px)",
          WebkitBackdropFilter:
            "blur(5px)",
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[1px] rounded-full"
          style={{
            background:
              `linear-gradient(
                180deg,
                rgba(255,255,255,.22),
                rgba(255,255,255,.045) 28%,
                rgba(0,0,0,.18) 76%,
                rgba(255,255,255,.07)
              )`,
          }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[2px] top-[2px] h-[20%] rounded-full"
          style={{
            background:
              `linear-gradient(
                180deg,
                rgba(255,255,255,.18),
                transparent
              )`,
          }}
        />

        <span
          ref={coreRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[58%] w-px -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            opacity:
              0.46,
            transformOrigin:
              "center center",
            background:
              `linear-gradient(
                180deg,
                transparent,
                ${GOLD_LIGHT}c4 28%,
                ${GOLD_LIGHT}e0 50%,
                ${GOLD_LIGHT}b0 72%,
                transparent
              )`,
            boxShadow:
              "0 0 4px rgba(234,211,154,.24)",
          }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 bottom-[3px] h-px w-[4px] -translate-x-1/2 rounded-full opacity-35"
          style={{
            background:
              GOLD_LIGHT,
          }}
        />
      </button>
    </div>
  );
}