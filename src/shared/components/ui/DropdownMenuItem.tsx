"use client";

import React from "react";

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
  className?: string;
}

export function DropdownMenuItem({
  children,
  onClick,
  icon,
  variant = "default",
  className = "",
}: DropdownMenuItemProps) {
  const baseClasses = [
    "flex items-center gap-3 w-full px-4 py-3 text-sm",
    "transition-colors duration-200",
    "first:rounded-t-xl",
    "last:rounded-b-xl",
    "hover:bg-white/5",
    "cursor-pointer",
  ];

  const variantClasses = {
    default: "text-foreground",
    danger: "text-red-400 hover:text-red-300",
  };

  const combinedClasses = [...baseClasses, variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="menuitem"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      tabIndex={0}
      className={combinedClasses}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

interface DropdownMenuHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownMenuHeader({
  children,
  className = "",
}: DropdownMenuHeaderProps) {
  return (
    <div
      role="presentation"
      className={`px-4 py-3 border-b border-white/10 mb-1 ${className}`}
    >
      {children}
    </div>
  );
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

export function DropdownMenuSeparator({ className = "" }: DropdownMenuSeparatorProps) {
  return <div role="presentation" className={`my-1 border-t border-white/10 ${className}`} />;
}
