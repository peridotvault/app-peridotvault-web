"use client";

import { useEffect, useRef, useState } from "react";
import { ChainComponent } from "../molecules/ChainComponent";
import { STYLE_HOVER } from "@/shared/constants/style";
import { ButtonWithSound } from "./ButtonWithSound";
import { useModal } from "@/core/ui-system/modal/modal.store";
import ModalShell from "@/core/ui-system/modal/ModalShell";
import { useClickSound } from "@/shared/hooks/useClickSound";

/* =========================
   TYPES
========================= */

export type OptionText = {
  value: string;
  label: string;
};

export type OptionComponent = OptionText & {
  imageUrl: string;
  component?: React.ReactNode;
};

type Option = OptionText | OptionComponent;

interface DropdownProps {
  options: Option[];
  placeholder?: string;
  placeholderImage?: string;
  selectedClassName?: string;
  onChange?: (value: Option) => void;
}

/* =========================
   TYPE GUARD
========================= */

const isComponentOption = (o: Option): o is OptionComponent => "imageUrl" in o;

/* =========================
   COMPONENT
========================= */

export function Dropdown({
  options,
  placeholder,
  placeholderImage,
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const modalIdRef = useRef<string | null>(null);
  const playClick = useClickSound("/sounds/click.mp3", 0.6);

  useEffect(() => {
    return () => {
      if (modalIdRef.current) {
        useModal.getState().close(modalIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const isInsideTrigger = !!ref.current?.contains(target as Node);
      const isInsideMenu = modalIdRef.current
        ? !!target?.closest(`[data-dropdown-modal-panel="${modalIdRef.current}"]`)
        : false;

      if (isInsideTrigger || isInsideMenu) return;

      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (modalIdRef.current) {
        useModal.getState().close(modalIdRef.current);
        modalIdRef.current = null;
      }
      return;
    }

    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const menuWidth = Math.max(rect.width, 240);
    const menuLeft = Math.max(12, rect.right - menuWidth);
    const render = (id: string) => (
      <ModalShell
        id={id}
        centered={false}
        withBackdrop={true}
        containerClassName="fixed inset-0 z-50 pointer-events-none"
        backdropClassName="pointer-events-auto bg-black/20"
        backdropStyle={{ top: rect.bottom + 8 }}
        panelClassName="pointer-events-auto absolute overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/20"
        panelStyle={{
          top: rect.bottom + 8,
          left: menuLeft,
          width: menuWidth,
        }}
        onCloseStart={() => {
          if (modalIdRef.current === id) {
            modalIdRef.current = null;
            setIsOpen(false);
          }
        }}
      >
        <div data-dropdown-modal-panel={id}>
          <ul className="max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  playClick();
                  setSelected(option);
                  setIsOpen(false);
                  onChange?.(option);
                }}
                className="cursor-pointer px-2 py-3 font-medium hover:bg-foreground/10 whitespace-nowrap"
              >
                {isComponentOption(option) ? (
                  <ChainComponent
                    imgUrl={option.imageUrl}
                    label={option.label}
                  />
                ) : (
                  <span>{option.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </ModalShell>
    );

    if (!modalIdRef.current) {
      modalIdRef.current = useModal.getState().open(render, {
        lockScroll: false,
      });
      return;
    }

    useModal.getState().update(modalIdRef.current, render, {
      lockScroll: false,
    });
  }, [isOpen, onChange, options, playClick]);

  useEffect(() => {
    if (!isOpen || !modalIdRef.current) return;

    const syncPosition = () => {
      const rect = ref.current?.getBoundingClientRect();
      const modalId = modalIdRef.current;
      if (!rect || !modalId) return;

      const menuWidth = Math.max(rect.width, 240);
      const menuLeft = Math.max(12, rect.right - menuWidth);

      useModal.getState().update(
        modalId,
        (id) => (
          <ModalShell
            id={id}
            centered={false}
            withBackdrop={true}
            containerClassName="fixed inset-0 z-50 pointer-events-none"
            backdropClassName="pointer-events-auto bg-black/20"
            backdropStyle={{ top: rect.bottom + 8 }}
            panelClassName="pointer-events-auto absolute overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/20"
            panelStyle={{
              top: rect.bottom + 8,
              left: menuLeft,
              width: menuWidth,
            }}
            onCloseStart={() => {
              if (modalIdRef.current === id) {
                modalIdRef.current = null;
                setIsOpen(false);
              }
            }}
          >
            <div data-dropdown-modal-panel={id}>
              <ul className="max-h-60 overflow-auto">
                {options.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => {
                      playClick();
                      setSelected(option);
                      setIsOpen(false);
                      onChange?.(option);
                    }}
                    className="cursor-pointer px-2 py-3 font-medium hover:bg-foreground/10 whitespace-nowrap"
                  >
                    {isComponentOption(option) ? (
                      <ChainComponent
                        imgUrl={option.imageUrl}
                        label={option.label}
                      />
                    ) : (
                      <span>{option.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </ModalShell>
        ),
        { lockScroll: false },
      );
    };

    window.addEventListener("resize", syncPosition);
    window.addEventListener("scroll", syncPosition, true);
    return () => {
      window.removeEventListener("resize", syncPosition);
      window.removeEventListener("scroll", syncPosition, true);
    };
  }, [isOpen, onChange, options, playClick]);

  return (
    <div ref={ref} className="relative w-full">
      <ButtonWithSound
        onClick={() => setIsOpen((v) => !v)}
        className={`py-2 px-3 rounded-xl border border-border w-full flex items-center gap-2 hover:cursor-pointer ${
          isOpen ? "bg-white/10" : STYLE_HOVER
        }`}
      >
        <div>
          {selected ? (
            isComponentOption(selected) ? (
              <ChainComponent imgUrl={selected.imageUrl} />
            ) : (
              <span>{selected.label}</span>
            )
          ) : placeholderImage ? (
            <ChainComponent imgUrl={placeholderImage} />
          ) : (
            <span>{placeholder}</span>
          )}
        </div>

        <svg
          className={`ml-auto h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </ButtonWithSound>
    </div>
  );
}
