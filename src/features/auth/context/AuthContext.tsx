"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AuthContextValue, AuthCredentials, AuthError } from "../interfaces";
import { signMessage } from "@/shared/temp/peridotBridge";
import { isTokenExpired, getAccessToken } from "../utils/token";
import { createAuthError, AuthErrorType } from "../utils/authError";
import { verifySignature, logout } from "../services/auth";
import { refreshToken, shouldAttemptRefresh } from "../services/refreshToken";

// Extend Window interface for Peridot Wallet
declare global {
  interface Window {
    peridotwallet?: {
      master?: {
        isPeridotWallet?: boolean;
        signMessage?: (message: Uint8Array) => Promise<{
          signature?: string;
          signatureBase64?: string;
          signatureHex?: string;
          publicKey?: string;
          publicKeyBase64?: string;
          publicKeyBase58?: string;
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

  // Load credentials from localStorage on mount
  useEffect(() => {
    if (!mounted) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthCredentials;
        setCredentials(parsed);

        if (!isTokenExpired(parsed)) {
          setIsAuthenticated(true);
        } else {
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

    const interval = setInterval(async () => {
      if (isTokenExpired(credentials) && !isRefreshing) {
        console.log("Token is expiring soon, refreshing...");
        try {
          await performTokenRefresh();
        } catch (error) {
          console.error("Auto token refresh failed:", error);
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

  /**
   * Connect wallet and authenticate
   */
  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.peridotwallet || !window.peridotwallet.master) {
        throw createAuthError(
          "Peridot Wallet extension not found. Please install it first.",
          AuthErrorType.WALLET_NOT_FOUND
        );
      }

      const message = "Sign this message to authenticate with PeridotVault Studio";
      const response = await signMessage(message);

      if (!response || !response.signature || !response.publicKey) {
        throw createAuthError(
          "Failed to get signature from wallet",
          AuthErrorType.SIGNATURE_FAILED
        );
      }

      const address = response.publicKey as `0x${string}`;

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
              return errorMap[authResponse.error] || AuthErrorType.UNKNOWN_ERROR;
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

  /**
   * Disconnect wallet and clear credentials
   */
  const disconnect = useCallback(async () => {
    if (credentials?.token) {
      try {
        await logout();
      } catch (error) {
        console.error("Logout API call failed:", error);
      }
    }

    setCredentials(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, [credentials]);

  /**
   * Refresh authentication (token refresh or re-sign)
   */
  const refreshAuth = useCallback(async () => {
    if (!credentials) {
      throw createAuthError(
        "No credentials to refresh",
        AuthErrorType.UNKNOWN_ERROR
      );
    }

    if (credentials.token) {
      try {
        await performTokenRefresh();
        return;
      } catch (error) {
        console.warn("Token refresh failed, falling back to re-signing:", error);
      }
    }

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
      const errorMessage = authError.message || "Failed to refresh authentication";
      setError(errorMessage);
      await disconnect();
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [credentials, disconnect, performTokenRefresh]);

  const value: AuthContextValue = {
    isAuthenticated,
    isLoading,
    credentials,
    error,
    connect,
    disconnect,
    refreshAuth,
    getAccessToken: useCallback(() => getAccessToken(credentials), [credentials]),
    isTokenExpired: useCallback(() => isTokenExpired(credentials), [credentials]),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
