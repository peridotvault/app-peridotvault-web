import { GameIdApi } from "./game.api.type";

export type PurchaseStatus = "pending" | "completed" | "failed" | "refunded";

export type CreatePurchaseRequest = {
  gameId: string;
  purchasePrice: string;
  paymentToken: string;
  paymentTokenId: number;
  transactionHash: string;
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
  uniqueBuyers: number;
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

// Legacy types - kept for backwards compatibility
/** @deprecated Use CreatePurchaseRequest instead */
export type BuyGameParams = {
  gameId: GameIdApi;
  purchasePrice: number;
  paymentToken: string;
  transactionHash: string;
};
