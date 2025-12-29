import { Category } from "@/shared/interfaces/category";
import { GamePriview } from "@/features/game/interfaces/media";
import { GameDistribution } from "@/features/game/interfaces/distribution";

// Game form interfaces for Studio
export interface GameFormData {
  // Basic Info
  name: string;
  shortDescription: string;
  description: string;
  categories: string[];
  tags: string[];
  requiredAge: number;

  // Media
  coverVerticalImage: File | string | null;
  coverHorizontalImage: File | string | null;
  bannerImage: File | string | null;
  previews: GamePreviewInput[];

  // Distribution
  distributions: GameDistributionInput[];

  // Builds
  builds: GameBuildInput[];

  // Pricing
  price: number;
  tokenSymbol: string;
  releaseDate: Date | null;

  // Status
  status: "draft" | "published";
}

export interface GamePreviewInput {
  id: string;
  kind: "image" | "video";
  src: string | File;
  order: number;
}

export interface GameDistributionInput {
  web?: {
    url: string;
    processor: string;
    graphics: string;
    memory: number;
    storage: number;
    additionalNotes?: string;
  };
  native?: Record<string, any>;
}

export interface GameBuildInput {
  id: string;
  platform: "windows" | "mac" | "linux" | "android" | "web";
  file?: File;
  fileUrl?: string;
  version: string;
  architecture?: string;
  minRequirements?: string;
  recommendedRequirements?: string;
}

export interface GameDraft extends GameFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioGame extends GameFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views: number;
  purchases: number;
}

// Validation errors interface
export interface FormErrors {
  [key: string]: string | undefined;
}
