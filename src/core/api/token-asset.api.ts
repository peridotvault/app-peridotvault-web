import { http } from "@/shared/lib/http";
import { ApiResponse } from "./types/response.type";

export interface TokenAssetDep {
  id: number;
  name: string;
  symbol: string;
  icon_url: string | null;
  decimals: number;
  is_native: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface TokenAssetDeployment {
  id: number;
  token_asset_id: number;
  caip_2_id: string;
  address: string;
  is_active: boolean;
  token_asset: {
    id: number;
    name: string;
    symbol: string;
    icon_url: string | null;
    decimals: number;
    is_native: boolean;
  };
}

export interface TokenDeploymentDetail {
  id: number;
  token_asset_id: number;
  caip_2_id: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  token_asset: TokenAssetDep;
}

export interface GamePaymentOption {
  id: number;
  game_id: string;
  game_status: string;
  token_deployment_id: number;
  created_at: string;
  updated_at: string | null;
  token_deployment: TokenDeploymentDetail;
}

interface TokenDeploymentsResponse {
  success: boolean;
  message: string;
  data: TokenAssetDeployment[];
  error: string | null;
}

let cachedDeployments: TokenAssetDeployment[] | null = null;
let cachePromise: Promise<TokenAssetDeployment[]> | null = null;

export async function getTokenAssetDeployments(): Promise<TokenAssetDeployment[]> {
  if (cachedDeployments) return cachedDeployments;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    try {
      const res = await http.get<TokenDeploymentsResponse>(
        "/api/v1/token-assets/deployments",
        { params: { limit: 500 } }
      );
      cachedDeployments = res.data?.data ?? [];
      console.log("[TokenAssets] Loaded", cachedDeployments.length, "token deployments");
      return cachedDeployments;
    } catch (e) {
      console.error("[TokenAssets] Failed to load token deployments:", e);
      cachedDeployments = [];
      return cachedDeployments;
    } finally {
      cachePromise = null;
    }
  })();

  return cachePromise;
}

export function clearTokenDeploymentsCache() {
  cachedDeployments = null;
}

let cachedPaymentOptions = new Map<string, GamePaymentOption[]>();
const pendingPaymentOptions = new Map<string, Promise<GamePaymentOption[]>>();

export async function getGamePaymentOptionsApi(
  gameId: string,
  gameStatus?: string,
): Promise<GamePaymentOption[]> {
  const cacheKey = `${gameId}:${gameStatus ?? ""}`;
  const cached = cachedPaymentOptions.get(cacheKey);
  if (cached) return cached;

  const pending = pendingPaymentOptions.get(cacheKey);
  if (pending) return pending;

  const promise = (async () => {
    try {
      const res = await http.get<ApiResponse<GamePaymentOption[]>>(
        `/api/v1/token-assets/game-payment-options/games/${encodeURIComponent(gameId)}`,
        { params: gameStatus ? { game_status: gameStatus } : undefined },
      );
      const data = res.data?.data ?? [];
      cachedPaymentOptions.set(cacheKey, data);
      return data;
    } catch (e) {
      console.error("[TokenAssets] Failed to load game payment options:", e);
      return [] as GamePaymentOption[];
    } finally {
      pendingPaymentOptions.delete(cacheKey);
    }
  })();

  pendingPaymentOptions.set(cacheKey, promise);
  return promise;
}

export function clearGamePaymentOptionsCache(gameId?: string) {
  if (gameId) {
    for (const key of cachedPaymentOptions.keys()) {
      if (key.startsWith(gameId)) cachedPaymentOptions.delete(key);
    }
  } else {
    cachedPaymentOptions = new Map();
  }
}
