"use client";

import Image, { ImageProps } from "next/image";
import { getAssetUrl } from "@/shared/utils/helper.url";
import { IMAGE_LOADING } from "@/shared/constants/image";

type OptimizedImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
};

export function OptimizedImage({ src, alt, ...rest }: OptimizedImageProps) {
  const resolved = resolveImageSrc(src);
  return <Image src={resolved} alt={alt} {...rest} />;
}

function resolveImageSrc(src: string | null | undefined): string {
  if (!src) return IMAGE_LOADING;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return getAssetUrl(src);
  }
  if (src.startsWith("/")) return src;
  return getAssetUrl(src);
}
