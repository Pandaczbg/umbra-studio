"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

/* ==========================================================================
   UMBRA SCROLLBAR

   Visual client of UmbraMotionSystem.

   It does NOT listen to native "scroll".
   It consumes "umbra:motion" as the only scroll source.

   Owns:
   - geometry
   - visual interpolation
   - pointer drag
   - track click
   - keyboard navigation
   - hover / idle state
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

  const resizeObserverRef =
    useRef<ResizeObserver | null>(
      null,
    );

  const reducedMotionRef =
    useRef(false);

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
    }, []);

  const render =
    useCallback(() => {
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
        targetProgressRef.current;

      const current =
        renderedProgressRef.current;

      const targetEnergy =
        targetEnergyRef.current;

      const currentEnergy =
        renderedEnergyRef.current;

      const reduced =
        reducedMotionRef.current;

      const progress =
        reduced ||
        draggingRef.current
          ? target
          : current +
            (target -
              current) *
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
        progress *
        travel;

      const tiltBase =
        directionRef.current ===
        "down"
          ? 0.4
          : directionRef.current ===
              "up"
            ? -0.4
            : 0;

      const tilt =
        draggingRef.current
          ? 0
          : tiltBase *
            energy;

      thumb.style.transform =
        `translate3d(0, ${y}px, 0) rotateZ(${tilt}deg)`;

      const opacity =
        0.12 +
        energy *
          0.5;

      glow.style.opacity =
        String(opacity);

      core.style.transform =
        `scaleY(${0.6 + energy * 0.4})`;

      core.style.opacity =
        String(
          0.4 +
            energy *
              0.5,
        );

      const difference =
        Math.abs(
          target -
            progress,
        );

      if (
        difference > 0.001 &&
        !reduced
      ) {
        requestRender();
      }
    }, []);

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
          render,
        );
    }, [render]);

  const setProgress =
    useCallback(
      (
        progress: number,
        behavior:
          | "instant"
          | "smooth" =
          "smooth",
      ) => {
        targetProgressRef.current =
          clamp(progress);

        if (
          behavior ===
            "instant" ||
          reducedMotionRef.current
        ) {
          renderedProgressRef.current =
            targetProgressRef.current;
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
          thumbHeight,
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

        const target =
          clamp(
            progress,
          ) *
          maxScroll;

        window.scrollTo({
          top: target,
          behavior:
            reducedMotionRef.current
              ? "auto"
              : "auto",
        });

        setProgress(
          progress,
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
            ? clamp(detail.speed)
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
        updateGeometry();
        requestRender();
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

    if (railRef.current) {
      resizeObserverRef.current.observe(
        railRef.current,
      );
    }

    updateGeometry();

    const root =
      document.documentElement;

    const maxScroll =
      Math.max(
        0,
        root.scrollHeight -
          window.innerHeight,
      );

    const initial =
      maxScroll > 0
        ? clamp(
            window.scrollY /
              maxScroll,
          )
        : 0;

    targetProgressRef.current =
      initial;

    renderedProgressRef.current =
      initial;

    requestRender();

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

      if (
        rafRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          rafRef.current,
        );
      }
    };
  }, [
    requestRender,
    updateGeometry,
  ]);

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
          event.button !== 0
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
          event.button !== 0
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
              current + 0.04,
            );

            break;

          case "ArrowUp":
          case "ArrowLeft":
            event.preventDefault();

            scrollToProgress(
              current - 0.04,
            );

            break;

          case "PageDown":
            event.preventDefault();

            scrollToProgress(
              current + 0.18,
            );

            break;

          case "PageUp":
            event.preventDefault();

            scrollToProgress(
              current - 0.18,
            );

            break;

          case "Home":
            event.preventDefault();

            scrollToProgress(0);

            break;

          case "End":
            event.preventDefault();

            scrollToProgress(1);

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
      className="umbra-scrollbar pointer-events-none fixed right-1.5 top-[108px] z-[110] hidden h-[calc(100vh-136px)] w-7 lg:block"
      aria-hidden="false"
    >
      <div
        ref={trackRef}
        className="pointer-events-auto absolute inset-0 cursor-pointer"
        aria-hidden="true"
      >
        <span
          aria-hidden="true"
          className="absolute right-3 top-1 bottom-1 w-px"
          style={{
            background:
              `linear-gradient(
                180deg,
                transparent,
                rgba(255,255,255,.055) 18%,
                rgba(255,255,255,.08) 50%,
                rgba(255,255,255,.055) 82%,
                transparent
              )`,
          }}
        />

        <span
          aria-hidden="true"
          className="absolute right-[11px] top-1 bottom-1 w-px opacity-50"
          style={{
            background:
              `linear-gradient(
                180deg,
                transparent,
                ${GOLD}18 26%,
                ${GOLD_LIGHT}10 50%,
                ${GOLD}18 74%,
                transparent
              )`,
          }}
        />
      </div>

      <span
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-[6px] top-0 h-7 w-3 rounded-full"
        style={{
          opacity: 0.18,
          background:
            `radial-gradient(
              circle,
              ${GOLD_LIGHT}26,
              ${GOLD}10 44%,
              transparent 72%
            )`,
          filter:
            "blur(2px)",
        }}
      />

      <button
        ref={thumbRef}
        type="button"
        aria-label="Page scroll position"
        tabIndex={0}
        data-dragging="false"
        className="pointer-events-auto absolute right-[8px] top-0 w-[7px] cursor-grab appearance-none overflow-visible rounded-full border p-0 outline-none"
        style={{
          height: "46px",
          borderColor:
            `${GOLD_LIGHT}88`,
          background:
            "transparent",
          boxShadow:
            `0 0 0 1px ${GOLD}10, 0 0 8px ${GOLD}14`,
          transform:
            "translate3d(0,0,0)",
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              `linear-gradient(
                180deg,
                rgba(255,255,255,.16),
                transparent 34%,
                rgba(0,0,0,.1) 82%,
                rgba(255,255,255,.05)
              )`,
          }}
        />

        <span
          ref={coreRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-px -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: 0.4,
            transformOrigin:
              "center center",
            background:
              `linear-gradient(
                180deg,
                transparent,
                ${GOLD_LIGHT}95 30%,
                ${GOLD}65 50%,
                ${GOLD_LIGHT}7a 70%,
                transparent
              )`,
          }}
        />
      </button>
    </div>
  );
}