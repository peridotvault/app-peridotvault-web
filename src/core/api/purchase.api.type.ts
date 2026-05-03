import { GameIdApi } from "./game.api.type";

export type PurchaseStatus = "pending" | "completed" | "failed" | "refunded";

export type CreatePurchaseRequest = {
  gameId: string;
  purchasePrice: string;
  paymentToken: string;
  paymentTokenId?: number;
  transactionHash?: string;
};

export type CompletePurchaseRequest = {
  gameId: string;
  transactionHash: string;
};

export type Purchase = {
  id: number;
  gameId: GameIdApi;
  userId: number;
  purchasePrice: string;
  paymentToken: string;
  paymentTokenId: number;
  transactionHash: string;
  status: PurchaseStatus;
  purchasedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PurchaseStats = {
  gameId: string;
  totalPurchases: number;
  totalRevenue: string;
  completedPurchases: number;
  pendingPurchases: number;
};

export type GetPurchasesQuery = {
  q?: string;
  status?: PurchaseStatus;
  sort?:
    | "purchased_at_desc"
    | "purchased_at_asc"
    | "price_desc"
    | "price_asc";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

export type PaginatedPurchasesResponse = {
  data: Purchase[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
