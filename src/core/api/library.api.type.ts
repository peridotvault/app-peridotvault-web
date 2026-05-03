import { GameIdApi } from "./game.api.type";

export type PurchaseStatusApi = "pending" | "completed" | "failed" | "refunded";

export interface LibraryGameApi {
  gameId: GameIdApi;
  gameName: string;
  gameCover: string | null;
  purchaseStatus: PurchaseStatusApi;
  purchasePrice: string;
  paymentToken: string;
  transactionHash: string | null;
  purchasedAt: string;
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
