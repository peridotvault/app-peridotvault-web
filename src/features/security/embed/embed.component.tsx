"use client";

import React, { useEffect } from "react";
import Link, { LinkProps } from "next/link";
import type { ParsedUrlQueryInput } from "node:querystring";
import type { UrlObject } from "url";
import Navbar from "@/shared/components/ui/organisms/Navbar";
import { useEmbedMode } from "./embed.hook";
import { injectPeridotWallet } from "@/core/blockchain/svm/web3/peridot.provider";

type EmbedLayoutProps = {
  children: React.ReactNode;
};

export function EmbedLayout({ children }: EmbedLayoutProps) {
  const { isEmbed } = useEmbedMode();

  useEffect(() => {
    if (isEmbed) {
      injectPeridotWallet();
    }
  }, [isEmbed]);

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
    const originalQuery =
      href.query && typeof href.query === "object"
        ? (href.query as ParsedUrlQueryInput)
        : {};
    const nextQuery: ParsedUrlQueryInput = { ...originalQuery };

    if (!("embed" in nextQuery)) {
      nextQuery.embed = "1";
    }

    nextHref = { ...href, query: nextQuery };
  }

  return <Link href={nextHref} {...rest} />;
}
