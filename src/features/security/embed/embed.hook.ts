"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

function isTruthy(value: string | null) {
  if (!value) return false;
  const s = value.toLowerCase();
  return s === "1" || s === "true" || s === "yes" || s === "on";
}

function appendEmbedParam(href: string) {
  if (!href.startsWith("/")) return href;

  const [pathAndQuery, hash = ""] = href.split("#");
  const [pathname, queryString = ""] = pathAndQuery.split("?");
  const params = new URLSearchParams(queryString);

  if (!params.has("embed")) {
    params.set("embed", "1");
  }

  const nextQuery = params.toString();
  const nextHref = `${pathname}${nextQuery ? `?${nextQuery}` : ""}`;
  return hash ? `${nextHref}#${hash}` : nextHref;
}

export function useEmbedMode() {
  const searchParams = useSearchParams();
  const isEmbed = isTruthy(searchParams.get("embed"));

  const withEmbed = useMemo(() => {
    if (!isEmbed) return (href: string) => href;
    return (href: string) => appendEmbedParam(href);
  }, [isEmbed]);

  return { isEmbed, withEmbed };
}
