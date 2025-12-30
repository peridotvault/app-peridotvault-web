"use client";

import React from "react";

interface WalletAvatarProps {
  address?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WalletAvatar({ address, size = "md", className = "" }: WalletAvatarProps) {
  // Get initials from address (first 2 chars after 0x)
  const getInitials = (addr?: string) => {
    if (!addr) return "?";
    // Remove 0x prefix and get first 2 characters
    const clean = addr.replace(/^0x/i, "");
    return clean.substring(0, 2).toUpperCase();
  };

  // Generate consistent color from address
  const getColorFromAddress = (addr?: string) => {
    if (!addr) return "#349b65"; // Default accent color

    // Simple hash function to generate a hue value
    let hash = 0;
    const clean = addr.replace(/^0x/i, "");
    for (let i = 0; i < clean.length; i++) {
      hash = clean.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use hash to generate a consistent hue (0-360)
    const hue = Math.abs(hash % 360);

    // Return HSL color with good saturation and lightness for better contrast
    return `hsl(${hue}, 65%, 40%)`;
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const backgroundColor = getColorFromAddress(address);

  return (
    <div
      className={[
        "flex items-center justify-center rounded-full font-semibold text-white shadow-sm",
        sizeClasses[size],
        className,
      ].join(" ")}
      style={{ backgroundColor }}
    >
      {getInitials(address)}
    </div>
  );
}
