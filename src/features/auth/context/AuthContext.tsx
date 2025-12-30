"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AuthContextValue, AuthCredentials, WalletInfo } from "../interfaces";
import { signMessage } from "@/shared/temp/peridotBridge";

// Extend Window interface for peridotwallet
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<AuthCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load credentials from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthCredentials;
        setCredentials(parsed);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to parse stored credentials:", err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if wallet is available
      if (!window.peridotwallet || !window.peridotwallet.master) {
        throw new Error("Peridot Wallet extension not found. Please install it first.");
      }

      // Sign message to authenticate
      const message = "Sign this message to authenticate with PeridotVault Studio";
      const response = await signMessage(message);

      if (!response || !response.signature || !response.publicKey) {
        throw new Error("Failed to get signature from wallet");
      }

      // Extract address from public key (simplified - adjust based on actual wallet implementation)
      const address = response.publicKey; // You might need to transform this

      const newCredentials: AuthCredentials = {
        signature: response.signature,
        message,
        wallet: {
          address,
          publicKey: response.publicKey,
        },
      };

      // Store credentials
      setCredentials(newCredentials);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCredentials));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(errorMessage);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setCredentials(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const refreshAuth = useCallback(async () => {
    if (!credentials) {
      throw new Error("No credentials to refresh");
    }

    setIsLoading(true);
    setError(null);

    try {
      // Re-sign with the stored message
      const response = await signMessage(credentials.message);

      if (!response || !response.signature || !response.publicKey) {
        throw new Error("Failed to refresh signature");
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
      const errorMessage = err instanceof Error ? err.message : "Failed to refresh authentication";
      setError(errorMessage);
      // If refresh fails, disconnect the user
      disconnect();
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [credentials, disconnect]);

  const value: AuthContextValue = {
    isAuthenticated,
    isLoading,
    credentials,
    error,
    connect,
    disconnect,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
