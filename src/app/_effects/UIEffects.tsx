"use client";

import { useUIStore } from "@/shared/infra/modal/ui";
import { useEffect } from "react";

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

export function UIEffects() {
  const hasOpenModal = useUIStore((s) => s.modalStack.length > 0);

  useEffect(() => {
    const body = document.body;

    if (!hasOpenModal) return;

    // simpan style awal agar restore 100%
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    const scrollbarWidth = getScrollbarWidth();

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [hasOpenModal]);

  return null;
}
