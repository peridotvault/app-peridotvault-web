/**
 * Refresh token service
 *
 * This service handles refreshing expired authentication tokens.
 * It calls the backend's refresh endpoint to get a new token.
 */

import { http } from "@/shared/lib/http";
import type { RefreshTokenResponse } from "../interfaces";

const REFRESH_ENDPOINT = "/api/auth/refresh";

/**
 * Refreshes the authentication token
 *
 * @param currentToken - The current (expired) token
 * @param walletAddress - The wallet address for verification
 * @returns Promise with the new token and expiration
 *
 * @example
 * ```ts
 * try {
 *   const response = await refreshToken(currentToken, walletAddress);
 *   if (response.success && response.data) {
 *     const { token, expiresAt } = response.data;
 *     // Store new token
 *   }
 * } catch (error) {
 *   console.error("Token refresh failed:", error);
 * }
 * ```
 */
export async function refreshToken(
  currentToken: string,
  walletAddress: string
): Promise<RefreshTokenResponse> {
  try {
    // Call the refresh endpoint
    const response = await http.post<RefreshTokenResponse>(REFRESH_ENDPOINT, {
      // Some APIs require the expired token in the body
      token: currentToken,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to refresh token:", error);

    // Return error response
    return {
      success: false,
      message: "Failed to refresh token",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Checks if a refresh attempt should be made
 * based on the last refresh time
 */
const refreshAttempts = new Map<string, number[]>();
const REFRESH_WINDOW = 60 * 1000; // 1 minute
const MAX_REFRESH_ATTEMPTS = 3;

/**
 * Records a refresh attempt and returns if we should proceed
 */
export function shouldAttemptRefresh(walletAddress: string): boolean {
  const now = Date.now();
  const attempts = refreshAttempts.get(walletAddress) || [];

  // Remove attempts outside the refresh window
  const recentAttempts = attempts.filter(
    (time) => now - time < REFRESH_WINDOW
  );

  // Check if we've exceeded max attempts
  if (recentAttempts.length >= MAX_REFRESH_ATTEMPTS) {
    console.warn("Max refresh attempts exceeded for wallet:", walletAddress);
    return false;
  }

  // Record this attempt
  recentAttempts.push(now);
  refreshAttempts.set(walletAddress, recentAttempts);

  return true;
}

/**
 * Clears refresh attempt history for a wallet
 */
export function clearRefreshHistory(walletAddress: string): void {
  refreshAttempts.delete(walletAddress);
}
