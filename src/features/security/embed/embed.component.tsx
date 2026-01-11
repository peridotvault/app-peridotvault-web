"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import type { UrlObject } from "url";
import Navbar from "@/shared/components/layouts/Navbar";
import { useEmbedMode } from "./embed.hook";

type EmbedLayoutProps = {
  children: React.ReactNode;
};

export function EmbedLayout({ children }: EmbedLayoutProps) {
  const { isEmbed } = useEmbedMode();

  return (
    <>
      {!isEmbed && <Navbar />}
      {children}
    </>
  );
}

type EmbedLinkProps = LinkProps & {
  className?: string;
  children: React.ReactNode;
};

export function EmbedLink({ href, ...rest }: EmbedLinkProps) {
  const { isEmbed, withEmbed } = useEmbedMode();

  let nextHref: string | UrlObject = href;
  if (typeof href === "string") {
    nextHref = withEmbed(href);
  } else if (isEmbed) {
    const nextQuery = { ...(href.query ?? {}) };
    if (!("embed" in nextQuery)) {
      nextQuery.embed = "1";
    }
    nextHref = { ...href, query: nextQuery };
  }

  return <Link href={nextHref} {...rest} />;
}
