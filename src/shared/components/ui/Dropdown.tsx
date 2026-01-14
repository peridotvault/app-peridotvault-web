"use client";

import { useEffect, useRef, useState } from "react";
import { ChainComponent } from "../ChainComponent";
import { STYLE_HOVER } from "@/shared/constants/style";

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
  selectedClassName?: string; // ✅ NEW
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

  /* Close on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOption = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div ref={ref} className="relative w-full">
      {/* =====================
          TRIGGER
      ===================== */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`py-2 px-3 rounded-xl border border-border w-full flex items-center gap-2 hover:cursor-pointer ${
          isOpen ? "bg-white/10" : STYLE_HOVER
        }`}
      >
        {/* ===== Selected Slot (CUSTOM WIDTH) ===== */}
        <div>
          {selected ? (
            isComponentOption(selected) ? (
              <ChainComponent imgUrl={selected.imageUrl} />
            ) : (
              <span>{selected.label}</span>
            )
          ) : placeholderImage && !placeholder ? (
            <ChainComponent imgUrl={placeholderImage} />
          ) : (
            <span>{placeholder}</span>
          )}
        </div>

        {/* ===== Chevron ===== */}
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
      </button>

      {/* =====================
          MENU
      ===================== */}
      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 inline-block">
          <ul className="w-60 rounded-xl bg-card border border-border max-h-60 overflow-auto ">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => selectOption(option)}
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
      )}
    </div>
  );
}
