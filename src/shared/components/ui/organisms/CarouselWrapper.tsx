"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { STYLE_ROUNDED_CARD } from "@/shared/constants/style";
import { useBreakpoint } from "@/shared/hooks/useBreakpoint";
import { ButtonWithSound } from "../atoms/ButtonWithSound";

/* =========================
   TYPES
========================= */

interface CarouselWrapperProps<T> {
  items: T[];
  pageSize?: number; // desktop base
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

/* =========================
   COMPONENT
========================= */

export function CarouselWrapper<T>({
  items,
  pageSize = 4,
  renderItem,
  className = "",
}: CarouselWrapperProps<T>) {
  const bp = useBreakpoint(); // "mobile" | "tablet" | "desktop"
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";

  const [page, setPage] = React.useState(0);

  // desktop = pageSize, tablet = pageSize - 1
  const effectivePageSize = React.useMemo(() => {
    if (isTablet) return Math.max(1, pageSize - 1);
    return pageSize;
  }, [isTablet, pageSize]);

  const totalPages = Math.ceil(items.length / effectivePageSize);

  // clamp page if breakpoint changes (e.g., rotate iPad)
  React.useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  /* =========================
     MOBILE: SLIDER
  ========================= */

  if (isMobile) {
    return (
      <div className={`w-full overflow-hidden ${className}`}>
        <div
          className="
            flex gap-4
            overflow-x-auto overflow-y-hidden
            scroll-smooth
            snap-x snap-mandatory
            cursor-grab active:cursor-grabbing
          "
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={`shrink-0 snap-start w-[60%] overflow-hidden ${STYLE_ROUNDED_CARD}`}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================
     TABLET + DESKTOP: PAGE CAROUSEL
  ========================= */

  const start = page * effectivePageSize;
  const sliced = items.slice(start, start + effectivePageSize);

  const visibleItems: (T | null)[] = [
    ...sliced,
    ...Array(effectivePageSize - sliced.length).fill(null),
  ];

  const handlePrev = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage((p) => p + 1);
  };

  return (
    <div
      className={`flex flex-col items-center max-w-353 gap-4 w-full ${className}`}
    >
      <div className="flex items-center gap-6 w-full">
        <ButtonWithSound
          onClick={handlePrev}
          disabled={page === 0}
          className="bg-button w-12 aspect-square rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-accent duration-300"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </ButtonWithSound>

        <div
          key={`${page}-${effectivePageSize}`}
          className="grid gap-4 w-full animate-fade-in"
          style={{
            gridTemplateColumns: `repeat(${effectivePageSize}, minmax(0, 1fr))`,
          }}
        >
          {visibleItems.map((item, index) => {
            if (!item) return <EmptySlot key={`empty-${index}`} />;

            const globalIndex = page * effectivePageSize + index;
            return (
              <React.Fragment key={globalIndex}>
                {renderItem(item, globalIndex)}
              </React.Fragment>
            );
          })}
        </div>

        <ButtonWithSound
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          className="bg-button w-12 aspect-square rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-accent duration-300"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </ButtonWithSound>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <ButtonWithSound
              key={i}
              onClick={() => setPage(i)}
              className={`h-2 rounded-full transition duration-300
                ${
                  i === page
                    ? "w-10 bg-highlight"
                    : "w-3 hover:w-6 bg-foreground/30 hover:bg-foreground/60"
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const EmptySlot: React.FC = () => {
  return <div className="w-full h-full min-h-50 opacity-0" />;
};
