/**
 * Refresh token service
 *
 * Handles refreshing expired authentication tokens with rate limiting.
 */

import { http } from "@/shared/lib/http";
import type { RefreshTokenResponse } from "../interfaces";

const REFRESH_ENDPOINT = "/api/auth/refresh";
const REFRESH_WINDOW = 60 * 1000; // 1 minute
const MAX_REFRESH_ATTEMPTS = 3;

// Track refresh attempts for rate limiting
const refreshAttempts = new Map<string, number[]>();

/**
 * Refreshes the authentication token
 *
 * @param currentToken - The current (expired) token
 * @returns Promise with the new token and expiration
 */
export async function refreshToken(
  currentToken: string,
  walletAddress: string
): Promise<RefreshTokenResponse> {
  try {
    const response = await http.post<RefreshTokenResponse>(REFRESH_ENDPOINT, {
      token: currentToken,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to refresh token:", error);

    return {
      success: false,
      message: "Failed to refresh token",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Checks if a refresh attempt should be made based on rate limiting
 *
 * @param walletAddress - The wallet address to check
 * @returns true if refresh should proceed, false if rate limit exceeded
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
 *
 * @param walletAddress - The wallet address to clear history for
 */
export function clearRefreshHistory(walletAddress: string): void {
  refreshAttempts.delete(walletAddress);
}
