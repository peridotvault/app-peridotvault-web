"use client";

import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import clsx from "clsx";
import { useModal } from "./modal.store";
import { DURATION_ANIMATE_MS } from "@/shared/constants/duration";

interface Props {
  id: string;
  children: ReactNode;
  centered?: boolean;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  backdropClassName?: string;
  backdropStyle?: CSSProperties;
  panelClassName?: string;
  panelStyle?: CSSProperties;
  withBackdrop?: boolean;
  closeOnBackdrop?: boolean;
  onCloseStart?: () => void;
}

export default function ModalShell({
  id,
  children,
  centered = true,
  containerClassName,
  containerStyle,
  backdropClassName,
  backdropStyle,
  panelClassName,
  panelStyle,
  withBackdrop = true,
  closeOnBackdrop = true,
  onCloseStart,
}: Props) {
  const close = useModal((s) => s.close);
  const [closing, setClosing] = useState(false);

  const startClose = useCallback(() => {
    if (closing) return; // prevent double trigger
    setClosing(true);
    onCloseStart?.();

    window.setTimeout(() => {
      close(id);
    }, DURATION_ANIMATE_MS);
  }, [close, closing, id, onCloseStart]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") startClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [startClose]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50",
        centered && "flex items-center justify-center",
        containerClassName,
      )}
      style={containerStyle}
    >
      {withBackdrop ? (
        <div
          onClick={closeOnBackdrop ? startClose : undefined}
          className={clsx(
            "absolute inset-0 bg-black/50 backdrop-blur-xs",
            closing ? "animate-modal-fade-out" : "animate-modal-fade-in",
            backdropClassName,
            closeOnBackdrop ? "cursor-pointer" : "",
          )}
          style={backdropStyle}
        />
      ) : null}

      {/* Panel */}
      <div
        className={clsx(
          "relative z-10 border border-border rounded-2xl overflow-hidden bg-background",
          "will-change-[transform,opacity]",
          closing ? "animate-modal-out" : "animate-modal-in",
          panelClassName,
        )}
        style={panelStyle}
      >
        {children}
      </div>
    </div>
  );
}
