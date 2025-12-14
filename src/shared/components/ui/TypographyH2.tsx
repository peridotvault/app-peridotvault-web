import React from "react";

export function TypographyH2({ text }: { text: string }) {
  return (
    <h2 className="leading-relaxed whitespace-pre-line text-3xl font-bold">
      {text}
    </h2>
  );
}
