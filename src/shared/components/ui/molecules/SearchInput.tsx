"use client";

import { ChangeEvent } from "react";
import { STYLE_HOVER } from "@/shared/constants/style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({
  value,
  placeholder = "Search...",
  onChange,
  className,
}: SearchInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={`
        flex items-center gap-2
        rounded-xl border border-border
        px-3 py-2
        bg-transparent
        hover:cursor-text 
        ${STYLE_HOVER}
        ${className ?? ""}
      `}
    >
      {/* Search Icon */}
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="text-muted-foreground"
      />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-70 bg-transparent h-6
          outline-none
          placeholder:text-muted-foreground
        "
      />
    </div>
  );
}
