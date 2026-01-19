/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { getAssetUrl } from "@/shared/utils/helper.url";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GamePreview } from "../types/game.type";

export interface GameDetailPreviewProps {
  items: GamePreview[];
  initialIndex?: number;
  autoPlay?: boolean;
  showThumbnails?: boolean;
  className?: string;
  htmlElement?: ReactNode;
  onIndexChange?: (i: number) => void;
}

const Chevron = ({ dir = "left" }: { dir?: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    {dir === "left" ? (
      <path
        fill="currentColor"
        d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
      />
    ) : (
      <path
        fill="currentColor"
        d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L12.17 12z"
      />
    )}
  </svg>
);

// Trim semua src dan buang yang kosong
function sanitize(items: GamePreview[]): GamePreview[] {
  const normalized: GamePreview[] = [];
  for (const it of items ?? []) {
    const src = (it.src ?? "").trim();
    if (!src) continue;
    if (it.kind === "image") {
      normalized.push({ kind: "image", src });
    } else {
      normalized.push({ kind: "video", src });
    }
  }
  return normalized;
}

export default function GameDetailPreview({
  items,
  initialIndex = 0,
  autoPlay = true,
  showThumbnails = true,
  className,
  htmlElement,
  onIndexChange,
}: GameDetailPreviewProps) {
  const normalized = useMemo(() => sanitize(items), [items]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const wrap = useRef<HTMLDivElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const dragStart = useRef<{ x: number; at: number } | null>(null);
  const dragDX = useRef(0);

  const canNavigate = normalized.length > 1;

  // Clamp index + initialIndex
  useEffect(() => {
    const clamped = Math.min(
      Math.max(0, initialIndex),
      Math.max(0, normalized.length - 1),
    );
    setIndex((prev) => Math.min(prev, clamped));
  }, [normalized.length, initialIndex]);

  // Inform parent
  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  // Pause autoplay saat tab hidden
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setIsPlaying(false);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Kontrol play/pause video aktif
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === index && isPlaying) {
        v.play().catch(() => {
          /* autoplay might be blocked; ignore */
        });
      } else {
        v.pause();
        try {
          v.currentTime = 0;
        } catch {}
      }
    });
  }, [index, isPlaying, normalized.length]);

  const goTo = useCallback(
    (i: number) => {
      const n = normalized.length;
      if (!n) return;
      const next = ((i % n) + n) % n;
      setIndex(next);
    },
    [normalized.length],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  // Keyboard
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!canNavigate) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.code === "Space") {
      e.preventDefault();
      setIsPlaying((s) => !s);
    }
  };

  // Drag / swipe
  const onPointerDown = (e: React.PointerEvent) => {
    if (!wrap.current) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragStart.current = { x: e.clientX, at: Date.now() };
    dragDX.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current || !track.current || !wrap.current) return;
    const dx = e.clientX - dragStart.current.x;
    dragDX.current = dx;
    const width = wrap.current.clientWidth || 1;
    const pct = (dx / width) * 100;
    track.current.style.transform = `translateX(calc(${
      -index * 100
    }% + ${pct}%))`;
  };
  const onPointerUp = () => {
    if (!wrap.current || !track.current) return;
    const dx = dragDX.current;
    dragStart.current = null;
    dragDX.current = 0;
    track.current.style.transform = `translateX(${-index * 100}%)`;

    const width = wrap.current.clientWidth || 1;
    const threshold = Math.min(0.25 * width, 160);
    if (dx > threshold) goPrev();
    else if (dx < -threshold) goNext();
  };

  // Render slides
  const renderedSlides = useMemo(
    () =>
      normalized.map((it, i) => (
        <div
          key={`${it.kind}-${i}-${it.src}`}
          className="relative shrink-0 grow-0 basis-full h-full select-none"
          aria-hidden={i !== index}
        >
          {it.kind === "image" ? (
            <img
              src={getAssetUrl(it.src)}
              alt="Game screenshot"
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload={i === index ? "auto" : "metadata"}
              loop
              controls={i === index}
            >
              <source src={getAssetUrl(it.src)} type="video/mp4" />
            </video>
          )}
        </div>
      )),
    [normalized, index],
  );

  // Kalau tidak ada media sama sekali
  if (!normalized.length) {
    return (
      <div className={["relative w-full", className ?? ""].join(" ")}>
        <div className="relative aspect-video overflow-hidden rounded-2xl shadow-arise-sm flex items-center justify-center text-sm text-foreground/60">
          No media
        </div>
        {(showThumbnails || htmlElement) && (
          <div className="flex gap-4 overflow-x-auto py-6">
            {htmlElement && htmlElement}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={["relative w-full", className ?? ""].join(" ")}>
      {/* Viewport */}
      <div
        ref={wrap}
        className="relative aspect-video overflow-hidden rounded-2xl shadow-arise-sm"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        role="region"
        aria-label="Game media carousel"
      >
        <div
          ref={track}
          className="flex h-full w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${-index * 100}%)` }}
        >
          {renderedSlides}
        </div>

        {/* Counter */}
        <div className="pointer-events-none absolute left-3 top-3 z-5 rounded-md px-2 py-1 text-xs text-foreground shadow-flat-sm bg-background">
          {`${index + 1} / ${normalized.length}`}
        </div>

        {/* Play/Pause autoplay */}
        <button
          type="button"
          onClick={() => setIsPlaying((s) => !s)}
          aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
          className="absolute right-3 top-3 z-5 rounded-md px-2 py-1 text-xs text-foreground hover:bg-black/70"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        {/* Prev/Next */}
        {canNavigate && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous"
              className="group absolute left-2 top-1/2 z-5 -translate-y-1/2 rounded-full bg-black/50 p-2 text-foreground hover:bg-black/70"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next"
              className="group absolute right-2 top-1/2 z-5 -translate-y-1/2 rounded-full bg-black/50 p-2 text-foreground hover:bg-black/70"
            >
              <Chevron dir="right" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails & extra element */}
      {(showThumbnails || htmlElement) && (
        <div className="flex gap-4 overflow-x-auto py-6">
          {htmlElement && htmlElement}
          {normalized.map((it, i) => (
            <button
              key={`thumb-${i}-${it.src}`}
              type="button"
              onClick={() => goTo(i)}
              className={[
                "relative h-20 aspect-video shrink-0 overflow-hidden rounded-md duration-300",
                i === index ? "border" : "opacity-60",
              ].join(" ")}
              aria-label={`Go to media ${i + 1}`}
            >
              {it.kind === "image" ? (
                <img
                  src={getAssetUrl(it.src)}
                  alt={`Media ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <video
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  >
                    <source src={getAssetUrl(it.src)} type="video/mp4" />
                  </video>
                  <span className="pointer-events-none absolute inset-0 grid place-items-center text-foreground/90">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 drop-shadow">
                      <path fill="currentColor" d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
