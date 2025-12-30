"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end" | "center";
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function DropdownMenu({
  trigger,
  children,
  align = "end",
  side = "bottom",
  className = "",
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        triggerRef.current &&
        menuRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, close]);

  // Handle escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, close]);

  // Get alignment classes
  const getAlignmentClasses = () => {
    switch (align) {
      case "start":
        return "left-0";
      case "center":
        return "left-1/2 -translate-x-1/2";
      case "end":
      default:
        return "right-0";
    }
  };

  // Get side/position classes
  const getSideClasses = () => {
    switch (side) {
      case "top":
        return "bottom-full mb-2";
      case "bottom":
        return "top-full mt-2";
      case "left":
        return "right-full mr-2 top-0";
      case "right":
        return "left-full ml-2 bottom-full";
      default:
        return "top-full mt-2";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={triggerRef}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        tabIndex={0}
        role="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          className={`absolute ${getSideClasses()} z-50 min-w-[200px] rounded-xl border border-white/10 bg-card shadow-arise-sm ${getAlignmentClasses()}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
