"use client";

import { ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import { useModal } from "./modal.store";
import { DURATION_ANIMATE_MS } from "@/shared/constants/duration";

interface Props {
  id: string;
  children: ReactNode;
}

export default function ModalShell({ id, children }: Props) {
  const close = useModal((s) => s.close);
  const [closing, setClosing] = useState(false);

  const startClose = () => {
    if (closing) return; // prevent double trigger
    setClosing(true);

    window.setTimeout(() => {
      close(id);
    }, DURATION_ANIMATE_MS);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") startClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closing]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={startClose}
        className={clsx(
          "absolute inset-0 bg-black/50 backdrop-blur-xs",
          closing ? "animate-modal-fade-out" : "animate-modal-fade-in",
        )}
      />

      {/* Panel */}
      <div
        className={clsx(
          "relative z-10 border border-border rounded-2xl overflow-hidden bg-background",
          "will-change-[transform,opacity]",
          closing ? "animate-modal-out" : "animate-modal-in",
        )}
      >
        {children}
      </div>
    </div>
  );
}
