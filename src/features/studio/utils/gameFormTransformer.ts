import { GameFormData } from "../interfaces/gameForm";
import type { PlatformId } from "../constants/builds";

interface FormValues {
  gameId: string;
  name: string;
  shortDescription: string;
  description: string;
  websiteUrl?: string | null | undefined;
  categories: string[];
  tags: string[];
  requiredAge: number;
  price: number;
  releaseDate: Date | null;
}

interface MediaState {
  coverVerticalImage: File | null;
  coverHorizontalImage: File | null;
  bannerImage: File | null;
  previews: Array<{ id: string; file: File; preview: string; type: "image" | "video" }>;
}

interface BuildState {
  builds: Array<{
    id: string;
    platform: string;
    file?: File | null;
    version: string;
    architecture?: string;
    minRequirements?: string;
    recommendedRequirements?: string;
  }>;
}

export function transformToGameFormData(
  formValues: FormValues,
  mediaState: MediaState,
  buildState: BuildState,
  publish: boolean
): GameFormData {
  return {
    gameId: formValues.gameId,
    name: formValues.name,
    shortDescription: formValues.shortDescription,
    description: formValues.description,
    websiteUrl: formValues.websiteUrl ?? null,
    categories: formValues.categories,
    tags: formValues.tags,
    requiredAge: formValues.requiredAge,
    price: formValues.price,
    releaseDate: formValues.releaseDate,
    coverVerticalImage: mediaState.coverVerticalImage,
    coverHorizontalImage: mediaState.coverHorizontalImage,
    bannerImage: mediaState.bannerImage,
    previews: mediaState.previews.map((preview) => ({
      id: preview.id,
      kind: preview.type,
      src: preview.file,
      order: 0,
    })),
    distributions: [],
    builds: buildState.builds.map((build) => ({
      id: build.id,
      platform: build.platform as PlatformId,
      file: build.file || undefined,
      version: build.version,
      architecture: build.architecture,
      minRequirements: build.minRequirements,
      recommendedRequirements: build.recommendedRequirements,
    })),
    status: publish ? "published" : "draft",
    tokenSymbol: "ICP",
  };
}
