/**
 * Token management utilities
 *
 * This module provides utilities for managing JWT tokens,
 * checking expiration, and formatting token-related data.
 *
 * @module features/auth/utils/token
 */

import type { AuthCredentials } from "../interfaces";

/**
 * Checks if a token is expired or will expire soon
 *
 * A token is considered "expiring soon" if it will expire within 5 minutes.
 * This allows for proactive token refresh before the token actually expires.
 *
 * @param credentials - The credentials containing the token and expiration
 * @returns `true` if the token is expired or will expire within 5 minutes, `false` otherwise
 *
 * @example
 * ```ts
 * if (isTokenExpired(credentials)) {
 *   await refreshAuthToken();
 * }
 * ```
 */
export function isTokenExpired(credentials: AuthCredentials | null): boolean {
  if (!credentials?.token || !credentials?.expiresAt) {
    // If there's no token or expiration, consider it expired
    return true;
  }

  try {
    const expiresAt = new Date(credentials.expiresAt).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    // Consider token expired if it's within 5 minutes of expiration
    return now >= (expiresAt - fiveMinutes);
  } catch (error) {
    console.error("Failed to parse token expiration:", error);
    return true;
  }
}

/**
 * Gets the access token from credentials
 *
 * @param credentials - The credentials containing the token
 * @returns The access token string or `null` if not authenticated
 *
 * @example
 * ```ts
 * const token = getAccessToken(credentials);
 * if (token) {
 *   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
 * }
 * ```
 */
export function getAccessToken(credentials: AuthCredentials | null): string | null {
  return credentials?.token ?? null;
}

/**
 * Parses JWT token (without verification - for client-side use only)
 * Returns the payload or null if invalid
 */
export function parseJwtToken(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to parse JWT token:", error);
    return null;
  }
}

/**
 * Extracts wallet address from JWT token
 */
export function getWalletAddressFromToken(token: string): string | null {
  try {
    const payload = parseJwtToken(token);
    return payload?.address ?? payload?.sub ?? null;
  } catch (error) {
    console.error("Failed to extract wallet address from token:", error);
    return null;
  }
}

/**
 * Calculates time until token expiration in milliseconds
 * Returns 0 if already expired
 */
export function getTimeUntilExpiration(credentials: AuthCredentials | null): number {
  if (!credentials?.expiresAt) {
    return 0;
  }

  try {
    const expiresAt = new Date(credentials.expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, expiresAt - now);
  } catch (error) {
    console.error("Failed to calculate time until expiration:", error);
    return 0;
  }
}

/**
 * Formats expiration time for display
 */
export function formatExpirationTime(credentials: AuthCredentials | null): string {
  if (!credentials?.expiresAt) {
    return "Unknown";
  }

  try {
    const expiresAt = new Date(credentials.expiresAt);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) {
      return "Less than a minute";
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours} hour${hours > 1 ? "s" : ""}${mins > 0 ? ` ${mins} min${mins > 1 ? "s" : ""}` : ""}`;
    }
  } catch (error) {
    console.error("Failed to format expiration time:", error);
    return "Unknown";
  }
}
