import { GameIdApi } from "./game.api.type";

export interface LibraryGameApi {
  id: number;
  gameId: GameIdApi;
  userId: number;
  purchasedAt: string;
  createdAt: string;
  updatedAt: string;
  game: LibraryGameDetailsApi;
}

export interface LibraryGameDetailsApi {
  id: number;
  gameId: GameIdApi;
  name: string;
  description: string;
  bannerImage: string | null;
  coverVerticalImage: string | null;
  coverHorizontalImage: string | null;
  coverImage: string | null;
  requiredAge: number;
  websiteUrl: string | null;
  price: string;
  isPublished: boolean;
  releaseDate: string | null;
  categories: string[];
  tags: string[];
  previews: Array<{
    kind: "image" | "video";
    src: string;
  }>;
  distributions: Array<
    | {
        web: {
          url: string;
          memory?: number;
          graphics?: string;
          storage?: number;
          processor?: string;
          additionalNotes?: string;
        };
      }
    | {
        native: {
          os: string;
          memory?: number;
          graphics?: string;
          storage?: number;
          processor?: string;
          additionalNotes?: string;
          manifests?: any[];
        };
      }
  >;
}

export interface GetLibraryQuery {
  q?: string;
  sort?:
    | "purchased_at_desc"
    | "purchased_at_asc"
    | "name_asc"
    | "name_desc";
  page?: number;
  limit?: number;
}

export interface PaginatedLibraryResponse {
  data: LibraryGameApi[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
