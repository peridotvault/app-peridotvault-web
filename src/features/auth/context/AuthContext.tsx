"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  AuthContextValue,
  AuthCredentials,
  AuthError,
} from "../interfaces";
import { signMessage } from "@/shared/temp/peridotBridge";
import { isTokenExpired, getAccessToken } from "../utils/token";
import { createAuthError, AuthErrorType } from "../utils/authError";
import { verifySignature, logout } from "../services/auth";
import { refreshToken, shouldAttemptRefresh } from "../services/refreshToken";
import { Challange } from "@/shared/interfaces/challenge";

// Extend Window interface for peridotwallet
declare global {
  interface Window {
    peridotwallet?: {
      master?: {
        isPeridotWallet?: boolean;
        signMessage?: (
          message: Uint8Array,
          challange: Challange
        ) => Promise<{
          signature?: string;
          publicKey?: string;
          signedMessage?: string;
        }>;
      };
    };
  }
}

const STORAGE_KEY = "peridot_auth_credentials";
const TOKEN_REFRESH_CHECK_INTERVAL = 60 * 1000; // Check every minute

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<AuthCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mark when component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load credentials from localStorage on mount (client-side only)
  useEffect(() => {
    if (!mounted) return; // Wait until client-side mounting is complete

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthCredentials;
        setCredentials(parsed);

        // Check if token is expired
        if (!isTokenExpired(parsed)) {
          setIsAuthenticated(true);
        } else {
          // Token is expired, clear it
          console.log("Stored token is expired, clearing...");
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (err) {
        console.error("Failed to parse stored credentials:", err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, [mounted]);

  // Auto-refresh token periodically
  useEffect(() => {
    if (!credentials || !isAuthenticated) {
      return;
    }

    // Check token expiration periodically
    const interval = setInterval(async () => {
      if (isTokenExpired(credentials) && !isRefreshing) {
        console.log("Token is expiring soon, refreshing...");
        try {
          await performTokenRefresh();
        } catch (error) {
          console.error("Auto token refresh failed:", error);
          // If auto-refresh fails, user will need to re-authenticate on next request
        }
      }
    }, TOKEN_REFRESH_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [credentials, isAuthenticated, isRefreshing]);

  /**
   * Performs token refresh by calling the backend API
   */
  const performTokenRefresh = useCallback(async () => {
    if (!credentials?.token || isRefreshing) {
      return;
    }

    // Check if we should attempt refresh (rate limiting)
    if (!shouldAttemptRefresh(credentials.wallet.address)) {
      throw createAuthError(
        "Too many refresh attempts. Please reconnect your wallet.",
        AuthErrorType.REFRESH_FAILED
      );
    }

    setIsRefreshing(true);
    setError(null);

    try {
      const response = await refreshToken(
        credentials.token,
        credentials.wallet.address
      );

      if (!response.success || !response.data) {
        throw createAuthError(
          response.error || "Token refresh failed",
          AuthErrorType.REFRESH_FAILED
        );
      }

      // Update credentials with new token
      const updatedCredentials: AuthCredentials = {
        ...credentials,
        token: response.data.token,
        expiresAt: response.data.expiresAt,
      };

      setCredentials(updatedCredentials);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCredentials));

      console.log("Token refreshed successfully");
    } finally {
      setIsRefreshing(false);
    }
  }, [credentials, isRefreshing]);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if wallet is available
      if (!window.peridotwallet || !window.peridotwallet.master) {
        throw createAuthError(
          "Peridot Wallet extension not found. Please install it first.",
          AuthErrorType.WALLET_NOT_FOUND
        );
      }

      // Sign message to authenticate
      const message =
        "Sign this message to authenticate with PeridotVault Studio";

      const response = await signMessage(message);

      if (!response || !response.signature || !response.publicKey) {
        throw createAuthError(
          "Failed to get signature from wallet",
          AuthErrorType.SIGNATURE_FAILED
        );
      }

      // Extract address from public key (simplified - adjust based on actual wallet implementation)
      const address = response.publicKey as `0x${string}`;

      // Call backend API to verify signature and get token
      const authResponse = await verifySignature({
        signature: response.signature,
        message,
        wallet: {
          address,
          publicKey: response.publicKey,
        },
      });

      if (!authResponse.success || !authResponse.data) {
        const errorType = authResponse.error
          ? (() => {
              const errorMap: Record<string, AuthErrorType> = {
                INVALID_SIGNATURE: AuthErrorType.SIGNATURE_FAILED,
                RATE_LIMIT_EXCEEDED: AuthErrorType.NETWORK_ERROR,
              };
              return (
                errorMap[authResponse.error] || AuthErrorType.UNKNOWN_ERROR
              );
            })()
          : AuthErrorType.UNKNOWN_ERROR;

        throw createAuthError(
          authResponse.error || "Authentication failed",
          errorType
        );
      }

      const newCredentials: AuthCredentials = {
        signature: response.signature,
        message,
        wallet: {
          address,
          publicKey: response.publicKey,
        },
        token: authResponse.data.token,
        expiresAt: authResponse.data.expiresAt,
      };

      // Store credentials
      setCredentials(newCredentials);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCredentials));

      console.log("Authentication successful");
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = authError.message || "Failed to connect wallet";
      setError(errorMessage);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    // Call logout API if we have credentials
    if (credentials?.token) {
      try {
        await logout();
      } catch (error) {
        console.error("Logout API call failed:", error);
        // Continue with local logout even if API call fails
      }
    }

    setCredentials(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, [credentials]);

  const refreshAuth = useCallback(async () => {
    if (!credentials) {
      throw createAuthError(
        "No credentials to refresh",
        AuthErrorType.UNKNOWN_ERROR
      );
    }

    // If we have a token, try to refresh it
    if (credentials.token) {
      try {
        await performTokenRefresh();
        return;
      } catch (error) {
        console.warn(
          "Token refresh failed, falling back to re-signing:",
          error
        );
        // Fall through to re-sign method
      }
    }

    // Fallback: Re-sign with the stored message
    setIsLoading(true);
    setError(null);

    try {
      const response = await signMessage(credentials.message);

      if (!response || !response.signature || !response.publicKey) {
        throw createAuthError(
          "Failed to refresh signature",
          AuthErrorType.SIGNATURE_FAILED
        );
      }

      const updatedCredentials: AuthCredentials = {
        ...credentials,
        signature: response.signature,
        wallet: {
          ...credentials.wallet,
          publicKey: response.publicKey,
        },
      };

      setCredentials(updatedCredentials);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCredentials));
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage =
        authError.message || "Failed to refresh authentication";
      setError(errorMessage);
      // If refresh fails, disconnect the user
      await disconnect();
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [credentials, disconnect, performTokenRefresh]);

  /**
   * Gets the current access token
   */
  const getAccessTokenCallback = useCallback(() => {
    return getAccessToken(credentials);
  }, [credentials]);

  /**
   * Checks if the current token is expired
   */
  const isTokenExpiredCallback = useCallback(() => {
    return isTokenExpired(credentials);
  }, [credentials]);

  const value: AuthContextValue = {
    isAuthenticated,
    isLoading,
    credentials,
    error,
    connect,
    disconnect,
    refreshAuth,
    getAccessToken: getAccessTokenCallback,
    isTokenExpired: isTokenExpiredCallback,
  };

  // During SSR, render with current state to avoid hydration mismatch
  // Client will hydrate with same state, then update after localStorage is read
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    // Should not happen if used within AuthProvider
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
