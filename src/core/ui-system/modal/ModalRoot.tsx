"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useModal } from "./modal.store";
import useModalScrollLock from "./useModalScrollLock";

export default function ModalRoot() {
  const stack = useModal((s) => s.stack);
  useModalScrollLock();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <>
      {stack.map((m) => (
        <div key={m.id}>{m.render(m.id)}</div>
      ))}
    </>,
    document.body,
  );
}
