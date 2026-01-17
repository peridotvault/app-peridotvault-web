"use client";

import React, { useState } from "react";
import { ButtonWithSound } from "./ui/ButtonWithSound";

/* =========================
   TYPES
========================= */

interface CarouselWrapperProps<T> {
  items: T[];
  pageSize?: number;
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
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(items.length / pageSize);

  const start = page * pageSize;
  const sliced = items.slice(start, start + pageSize);

  // keep grid width stable
  const visibleItems: (T | null)[] = [
    ...sliced,
    ...Array(pageSize - sliced.length).fill(null),
  ];

  const handlePrev = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage((p) => p + 1);
  };

  return (
    <div
      className={`flex flex-col items-center max-w-338 gap-4 w-full ${className}`}
    >
      {/* MAIN ROW */}
      <div className="flex items-center gap-6 w-full">
        {/* PREV */}
        <ButtonWithSound
          onClick={handlePrev}
          disabled={page === 0}
          className="text-xl md:text-5xl disabled:opacity-30"
        >
          {"<"}
        </ButtonWithSound>

        {/* GRID */}
        <div
          className="grid gap-4 w-full "
          style={{ gridTemplateColumns: `repeat(${pageSize}, minmax(0, 1fr))` }}
        >
          {visibleItems.map((item, index) =>
            item ? (
              <React.Fragment key={index}>
                {renderItem(item, index)}
              </React.Fragment>
            ) : (
              <EmptySlot key={`empty-${index}`} />
            ),
          )}
        </div>

        {/* NEXT */}
        <ButtonWithSound
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          className="text-xl md:text-5xl disabled:opacity-30"
        >
          {">"}
        </ButtonWithSound>
      </div>

      {/* DOT PAGINATION */}
      {totalPages > 1 && (
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <ButtonWithSound
              key={i}
              onClick={() => setPage(i)}
              className={`w-3 h-3 rounded-full transition duration-300
                ${
                  i === page
                    ? "bg-foreground"
                    : "bg-foreground/30 hover:bg-foreground/60"
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================
   EMPTY SLOT
========================= */

const EmptySlot: React.FC = () => {
  return <div className="w-full h-full min-h-50 opacity-0" />;
};
