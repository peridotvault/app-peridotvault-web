import { GameIdApi } from "./game.api.type";

export type PurchaseStatus = "pending" | "completed" | "failed" | "refunded";

export type CreatePurchaseRequest = {
  gameId: string;
  purchasePrice: string;
  paymentToken: string;
  paymentTokenId?: number;
  transactionHash?: string;
  /**
   * Web2 mode fields (spec ANT-511 §5). Optional until the API ships them.
   * `payment_mode: 'fiat'` rows use `payment_ref` (Peridot ID intent /
   * providerRef) instead of an onchain `transactionHash`.
   */
  payment_mode?: "onchain" | "fiat";
  payment_ref?: string;
};

export type CompletePurchaseRequest = {
  gameId: string;
  transactionHash: string;
  pendingTransactionHash: string;
  payment_mode?: "onchain" | "fiat";
  payment_ref?: string;
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
  /**
   * Web2 mode fields (spec ANT-511 §5). Optional until the API ships them;
   * absent => onchain row (`paymentToken`/`transactionHash` remain the anchor).
   */
  payment_mode?: "onchain" | "fiat";
  payment_ref?: string | null;
  fiat_status?: string | null;
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
