# Panduan Implementasi PeridotVault Auth API di Next.js

## 📚 Daftar Isi

1. [Introduction](#introduction)
2. [Project Setup](#project-setup)
3. [Architecture & Folder Structure](#architecture--folder-structure)
4. [TypeScript Types](#typescript-types)
5. [Authentication Service Layer](#authentication-service-layer)
6. [API Client with Interceptors](#api-client-with-interceptors)
7. [Wallet Integration](#wallet-integration)
8. [React Hooks](#react-hooks)
9. [Context Provider](#context-provider)
10. [Next.js Middleware](#nextjs-middleware)
11. [Pages Implementation (App Router)](#pages-implementation-app-router)
12. [Pages Router Implementation]((#pages-router-implementation)
13. [Server-Side Rendering](#server-side-rendering)
14. [Complete Examples](#complete-examples)
15. [Best Practices](#best-practices)
16. [Testing](#testing)
17. [Troubleshooting](#troubleshooting)

---

## Introduction

### Overview

PeridotVault API menggunakan **wallet-based authentication** dengan signature verification. Panduan ini akan menunjukkan cara mengintegrasikan sistem auth ini ke aplikasi Next.js Anda.

### Why Next.js + PeridotVault?

✅ **Type-Safe** - Full TypeScript support
✅ **Server Components** - Optimal performance dengan React Server Components
✅ **Edge Runtime** - Fast middleware di edge locations
✅ **App Router** - Modern routing dengan built-in layouts
✅ **API Routes** - Bisa proxy requests untuk extra security

### Prerequisites

```bash
# Next.js 14+ dengan App Router
npx create-next-app@latest my-peridot-app --typescript --tailwind --app

# Dependencies yang dibutuhkan
npm install viem wagmi@2 @tanstack/react-query
npm install @wagmi/core @wagmi/connectors
npm install axios

# Development dependencies
npm install -D @types/node
```

---

## Project Setup

### 1. Environment Variables

Buat file `.env.local`:

```bash
# PeridotVault API
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# App configuration
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3001
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install \
  viem@2.x \
  wagmi@2.x \
  @tanstack/react-query@5.x \
  axios \
  zustand

# Wallet connectors
npm install \
  @wagmi/core \
  @wagmi/connectors

# TypeScript types
npm install -D \
  @types/node \
  @types/react \
  @types/react-dom
```

### 3. Folder Structure

```
your-nextjs-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (protected)/
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── auth/
│   │       ├── logout/
│   │       │   └── route.ts
│   │       └── refresh/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.types.ts
│   │   └── token.utils.ts
│   ├── wallet/
│   │   ├── wagmi.config.ts
│   │   ├── wallet.config.ts
│   │   └── wallet.hooks.ts
│   ├── api/
│   │   ├── client.ts
│   │   └── interceptors.ts
│   └── utils/
│       └── helpers.ts
├── components/
│   ├── auth/
│   │   ├── AuthProvider.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ConnectWalletButton.tsx
│   └── ui/
│       └── ...
├── hooks/
│   ├── useAuth.ts
│   ├── useWallet.ts
│   └── useAutoRefresh.ts
├── middleware.ts
├── .env.local
└── package.json
```

---

## Architecture & Folder Structure

### Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│                   UI Layer                          │
│  (Components, Pages, Hooks, Context Providers)      │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│               Service Layer                         │
│  (AuthService, WalletService, TokenManager)         │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                API Client Layer                     │
│  (Axios with interceptors, Auto-refresh, Error      │
│   handling)                                         │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              PeridotVault API                       │
│  (/api/auth/verify, /api/auth/profile, etc.)        │
└─────────────────────────────────────────────────────┘
```

---

## TypeScript Types

### Create `lib/auth/auth.types.ts`

```typescript
// lib/auth/auth.types.ts

/**
 * User profile from PeridotVault API
 */
export interface UserProfile {
  address: string;
  publicKey: string;
  username: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication response from /api/auth/verify
 */
export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: UserProfile;
}

/**
 * Token refresh response from /api/auth/refresh
 */
export interface RefreshTokenResponse {
  token: string;
  expiresAt: string;
}

/**
 * Request payload for wallet signature verification
 */
export interface VerifyWalletRequest {
  signature: string;
  message: string;
  publicKey: string;
  address: string;
}

/**
 * Stored auth tokens (localStorage/cookie)
 */
export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  walletAddress: string;
}

/**
 * Auth context state
 */
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Auth context actions
 */
export interface AuthActions {
  login: (signature: string, message: string, publicKey: string, address: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

/**
 * API response wrapper from PeridotVault
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}

/**
 * Error response from API
 */
export interface ApiError {
  success: false;
  message: string;
  error: string;
  data: null;
}

/**
 * Token payload decoded from JWT
 */
export interface JwtPayload {
  walletAddress: string;
  iat: number;
  exp: number;
}
```

---

## Authentication Service Layer

### Create `lib/auth/auth.service.ts`

```typescript
// lib/auth/auth.service.ts

import {
  AuthResponse,
  RefreshTokenResponse,
  StoredTokens,
  UserProfile,
  VerifyWalletRequest,
  ApiResponse,
} from './auth.types';
import { TokenManager } from './token.utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Authentication service for PeridotVault API
 * Handles all auth-related API calls
 */
export class AuthService {
  private tokenManager: TokenManager;

  constructor() {
    this.tokenManager = new TokenManager();
  }

  /**
   * Verify wallet signature and authenticate user
   * @param request - Signature verification request
   * @returns Auth response with tokens and user profile
   */
  async verifyWallet(request: VerifyWalletRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error: ApiResponse<null> = await response.json();
        throw new Error(error.message || 'Authentication failed');
      }

      const result: ApiResponse<AuthResponse> = await response.json();

      // Store tokens
      this.tokenManager.storeTokens({
        accessToken: result.data.token,
        refreshToken: result.data.refreshToken,
        expiresAt: result.data.expiresAt,
        walletAddress: result.data.user.address,
      });

      return result.data;
    } catch (error) {
      console.error('Auth verification failed:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns User profile
   */
  async getProfile(): Promise<UserProfile> {
    const token = this.tokenManager.getAccessToken();

    if (!token) {
      throw new Error('No access token available');
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Wallet-Address': this.tokenManager.getWalletAddress() || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const result: ApiResponse<UserProfile> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   * @returns New access token and expiration
   */
  async refreshAccessToken(): Promise<RefreshTokenResponse> {
    const refreshToken = this.tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const result: ApiResponse<RefreshTokenResponse> = await response.json();

      // Update access token
      this.tokenManager.updateAccessToken(result.data.token, result.data.expiresAt);

      return result.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.tokenManager.clearTokens();
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    const token = this.tokenManager.getAccessToken();

    try {
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Always clear tokens locally
      this.tokenManager.clearTokens();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.tokenManager.getAccessToken();
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.tokenManager.getAccessToken();
  }

  /**
   * Get wallet address
   */
  getWalletAddress(): string | null {
    return this.tokenManager.getWalletAddress();
  }
}
```

### Create `lib/auth/token.utils.ts`

```typescript
// lib/auth/token.utils.ts

import { StoredTokens } from './auth.types';

/**
 * Token management utility
 * Handles token storage, retrieval, and validation
 */
export class TokenManager {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly EXPIRES_AT_KEY = 'expires_at';
  private readonly WALLET_ADDRESS_KEY = 'wallet_address';

  /**
   * Store authentication tokens
   */
  storeTokens(tokens: StoredTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
      localStorage.setItem(this.EXPIRES_AT_KEY, tokens.expiresAt);
      localStorage.setItem(this.WALLET_ADDRESS_KEY, tokens.walletAddress);
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);

    if (!token || !expiresAt) {
      return null;
    }

    // Check if token is expired
    const expirationTime = new Date(expiresAt).getTime();
    const now = Date.now();

    if (now > expirationTime) {
      this.clearTokens();
      return null;
    }

    return token;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get wallet address
   */
  getWalletAddress(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.WALLET_ADDRESS_KEY);
  }

  /**
   * Update access token (after refresh)
   */
  updateAccessToken(token: string, expiresAt: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
      localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt);
    }
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.EXPIRES_AT_KEY);
      localStorage.removeItem(this.WALLET_ADDRESS_KEY);
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
    if (!expiresAt) return true;

    const expirationTime = new Date(expiresAt).getTime();
    return Date.now() > expirationTime;
  }

  /**
   * Get time until token expiration (in milliseconds)
   */
  getTimeUntilExpiration(): number {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
    if (!expiresAt) return 0;

    const expirationTime = new Date(expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, expirationTime - now);
  }
}
```

---

## API Client with Interceptors

### Create `lib/api/client.ts`

```typescript
// lib/api/client.ts

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenManager } from '../auth/token.utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * API client with automatic token refresh
 */
export class ApiClient {
  private client: AxiosInstance;
  private tokenManager: TokenManager;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.tokenManager = new TokenManager();
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - Add auth header
    this.client.interceptors.request.use(
      (config) => {
        const token = this.tokenManager.getAccessToken();
        const walletAddress = this.tokenManager.getWalletAddress();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (walletAddress) {
          config.headers['X-Wallet-Address'] = walletAddress;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Wait for token refresh to complete
            return new Promise((resolve) => {
              this.subscribeTokenRefresh((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            this.onTokenRefreshed(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed - clear tokens and redirect to login
            this.tokenManager.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Refresh access token
   */
  private async refreshToken(): Promise<string> {
    const refreshToken = this.tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_URL}/api/auth/refresh`, {
      refreshToken,
    });

    const { token, expiresAt } = response.data.data;
    this.tokenManager.updateAccessToken(token, expiresAt);

    return token;
  }

  /**
   * Subscribe to token refresh event
   */
  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Notify subscribers of token refresh
   */
  private onTokenRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
  }

  /**
   * Get axios instance
   */
  getInstance(): AxiosInstance {
    return this.client;
  }

  /**
   * Make GET request
   */
  async get<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Make POST request
   */
  async post<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make PUT request
   */
  async put<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make DELETE request
   */
  async delete<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Singleton instance
let apiClientInstance: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient();
  }
  return apiClientInstance;
}

export const apiClient = getApiClient();
```

---

## Wallet Integration

### Create `lib/wallet/wagmi.config.ts`

```typescript
// lib/wallet/wagmi.config.ts

import { createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Get WalletConnect Project ID from environment
const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, arbitrum, optimism],
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
      metadata: {
        name: 'PeridotVault App',
        description: 'Game distribution platform',
        url: 'https://peridotvault.com',
        icons: ['https://peridotvault.com/icon.png'],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
});
```

### Create `lib/wallet/wallet.hooks.ts`

```typescript
// lib/wallet/wallet.hooks.ts

'use client';

import { useSignMessage, useAccount, useDisconnect } from 'wagmi';

/**
 * Custom hook for wallet signature generation
 */
export function useWalletSignature() {
  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();

  /**
   * Sign a message with the connected wallet
   * @param message - Message to sign
   * @returns Signature, message, address, and public key
   */
  const signMessage = async (message?: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    const messageToSign = message || 'Sign this message to authenticate with PeridotVault Studio';

    try {
      const signature = await signMessageAsync({ message: messageToSign });

      // Get public key (if available from connector)
      // Note: MetaMask doesn't expose public key directly
      const provider = await connector?.getProvider();
      let publicKey = '';

      if (provider && 'request' in provider) {
        try {
          // Try to get public key (EIP-2844 or similar)
          publicKey = await (provider as any).request({
            method: 'eth_getEncryptionPublicKey',
            params: [address],
          });
        } catch (error) {
          // Public key not available, use address as fallback
          publicKey = address;
        }
      }

      return {
        signature,
        message: messageToSign,
        address,
        publicKey: publicKey || address,
      };
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  };

  return {
    signMessage,
    isSigning,
    address,
    disconnect,
    isConnected: !!address,
  };
}
```

---

## React Hooks

### Create `hooks/useAuth.ts`

```typescript
// hooks/useAuth.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/lib/auth/auth.service';
import { UserProfile } from '@/lib/auth/auth.types';

const authService = new AuthService();

export function useAuth() {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch user profile query
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authService.getProfile(),
    enabled: authService.isAuthenticated() && isInitialized,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Initialize auth state on mount
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (params: {
      signature: string;
      message: string;
      publicKey: string;
      address: string;
    }) => {
      const result = await authService.verifyWallet(params);
      return result;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'profile'], data.user);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      queryClient.clear();
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });

  // Refresh token mutation
  const refreshMutation = useMutation({
    mutationFn: async () => {
      return await authService.refreshAccessToken();
    },
    onSuccess: () => {
      // Refetch profile after refresh
      refetch();
    },
  });

  const login = useCallback(
    async (signature: string, message: string, publicKey: string, address: string) => {
      await loginMutation.mutateAsync({ signature, message, publicKey, address });
    },
    [loginMutation]
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const refreshToken = useCallback(async () => {
    await refreshMutation.mutateAsync();
  }, [refreshMutation]);

  return {
    user: user || null,
    isAuthenticated: authService.isAuthenticated(),
    isLoading: isLoading || !isInitialized,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRefreshing: refreshMutation.isPending,
    error: error as Error | null,
    login,
    logout,
    refreshToken,
    refetch,
  };
}
```

### Create `hooks/useAutoRefresh.ts`

```typescript
// hooks/useAutoRefresh.ts

'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { TokenManager } from '@/lib/auth/token.utils';

const tokenManager = new TokenManager();

/**
 * Hook to automatically refresh access token before expiration
 */
export function useAutoRefresh() {
  const { refreshToken, isAuthenticated } = useAuth();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timeout if not authenticated
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      return;
    }

    const scheduleRefresh = () => {
      const timeUntilExpiration = tokenManager.getTimeUntilExpiration();

      if (timeUntilExpiration <= 0) {
        // Token already expired, refresh immediately
        refreshToken();
        return;
      }

      // Refresh 5 minutes before expiration
      const refreshTime = Math.max(timeUntilExpiration - 5 * 60 * 1000, 0);

      refreshTimeoutRef.current = setTimeout(async () => {
        try {
          await refreshToken();
        } catch (error) {
          console.error('Auto-refresh failed:', error);
          // Redirect to login will be handled by the error
        }
      }, refreshTime);
    };

    scheduleRefresh();

    // Cleanup on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isAuthenticated, refreshToken]);
}
```

### Create `hooks/useProtectedRoute.ts`

```typescript
// hooks/useProtectedRoute.ts

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

/**
 * Hook to protect routes - redirect to login if not authenticated
 */
export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}
```

---

## Context Provider

### Create `components/auth/AuthProvider.tsx`

```typescript
// components/auth/AuthProvider.tsx

'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/lib/wallet/wagmi.config';
import { useAuth } from '@/hooks/useAuth';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider - Wraps app with auth context
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AuthProviderInner>{children}</AuthProviderInner>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function AuthProviderInner({ children }: { children: ReactNode }) {
  useAuth(); // Initialize auth state
  useAutoRefresh(); // Enable auto-refresh

  return <>{children}</>;
}
```

### Create `components/auth/ProtectedRoute.tsx`

```typescript
// components/auth/ProtectedRoute.tsx

'use client';

import { ReactNode } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to protect routes
 * Shows fallback or redirects to login if not authenticated
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useProtectedRoute();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
}
```

---

## Next.js Middleware

### Create `middleware.ts` (Root Level)

```typescript
// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for server-side auth check
 * Runs on Edge Runtime
 */
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('access_token');
  const path = request.nextUrl.pathname;

  // Public routes that don't require auth
  const publicRoutes = ['/login', '/api/auth/verify', '/api/auth/refresh'];
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // If accessing public route, allow
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If no token and accessing protected route, redirect to login
  if (!authToken && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check token expiration (basic check)
  if (authToken) {
    try {
      // Decode JWT (basic validation)
      const token = authToken.value;
      const payload = JSON.parse(atob(token.split('.')[1]));

      const now = Date.now() / 1000;
      if (payload.exp < now) {
        // Token expired, redirect to login
        const loginUrl = new URL('/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('access_token');
        return response;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## Pages Implementation (App Router)

### Create `app/login/page.tsx`

```typescript
// app/login/page.tsx

'use client';

import { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useAuth } from '@/hooks/useAuth';
import { useWalletSignature } from '@/lib/wallet/wallet.hooks';

export default function LoginPage() {
  const { isConnected, connect } = useAccount();
  const { connect: wagmiConnect } = useConnect();
  const { signMessage, isSigning } = useWalletSignature();
  const { login, isLoggingIn } = useAuth();
  const [error, setError] = useState<string>('');

  const handleConnectWallet = async () => {
    try {
      await wagmiConnect({ connector: injected() });
    } catch (error) {
      setError('Failed to connect wallet');
      console.error(error);
    }
  };

  const handleSignIn = async () => {
    setError('');

    try {
      // Sign message with wallet
      const { signature, message, address, publicKey } = await signMessage();

      // Authenticate with backend
      await login(signature, message, publicKey, address);

      // Redirect will be handled by AuthProvider
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in with Wallet
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect your wallet to access PeridotVault
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {!isConnected ? (
            <button
              onClick={handleConnectWallet}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={isSigning || isLoggingIn}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigning || isLoggingIn ? 'Signing in...' : 'Sign in with Wallet'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Create `app/(protected)/profile/page.tsx`

```typescript
// app/(protected)/profile/page.tsx

'use client';

import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Profile
            </h1>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Wallet Address
                </label>
                <p className="mt-1 text-sm text-gray-900 font-mono">
                  {user?.address}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Public Key
                </label>
                <p className="mt-1 text-sm text-gray-900 font-mono break-all">
                  {user?.publicKey}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.username || 'Not set'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.email || 'Not set'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Member Since
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

### Create `app/(protected)/layout.tsx`

```typescript
// app/(protected)/layout.tsx

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
```

### Update `app/layout.tsx`

```typescript
// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PeridotVault App',
  description: 'Game distribution platform',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

---

## Complete Examples

### Full Component Example - Dashboard

```typescript
// app/(protected)/dashboard/page.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWalletSignature } from '@/lib/wallet/wallet.hooks';
import { apiClient } from '@/lib/api/client';

interface GameStats {
  totalGames: number;
  publishedGames: number;
  draftGames: number;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<GameStats | null>(null);

  const fetchStats = async () => {
    try {
      const data = await apiClient.get<GameStats>('/api/games/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.address.slice(0, 6)}...{user?.address.slice(-4)}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Games</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {stats?.totalGames || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Published</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {stats?.publishedGames || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Drafts</h3>
            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {stats?.draftGames || 0}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

## Best Practices

### 1. Token Storage

**❌ DON'T:**
```typescript
// Storing tokens in plain cookies is insecure
document.cookie = `token=${token}`;
```

**✅ DO:**
```typescript
// Use httpOnly cookies via API route (more secure)
// OR use localStorage with awareness of XSS risks
localStorage.setItem('access_token', token);
```

**Best Approach for Production:**
Use httpOnly cookies via Next.js API routes:

```typescript
// app/api/auth/login/route.ts
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { token, refreshToken } = await verifyWallet(body);

  cookies().set('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
  });

  cookies().set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return Response.json({ success: true });
}
```

### 2. Error Handling

```typescript
// Always handle auth errors gracefully
try {
  await login(signature, message, publicKey, address);
} catch (error) {
  if (error.message.includes('INVALID_SIGNATURE')) {
    showToast('Signature verification failed. Please try again.');
  } else if (error.message.includes('RATE_LIMIT')) {
    showToast('Too many attempts. Please wait.');
  } else {
    showToast('Authentication failed. Please try again.');
  }
}
```

### 3. Loading States

```typescript
// Show loading states during auth operations
{isLoggingIn && <Spinner />}
{isLoading && <Skeleton />}
```

### 4. TypeScript Strict Mode

```typescript
// Always use strict types
interface User {
  address: `0x${string}`; // Use template literal types for addresses
  username: string | null; // Explicit nullability
}
```

---

## Troubleshooting

### Issue: "Signature verification failed"

**Cause:** Signature doesn't match message or address

**Solution:**
```typescript
// Ensure you're signing the EXACT message
const message = "Sign this message to authenticate with PeridotVault Studio";
// Don't add extra whitespace or characters
```

### Issue: "Token refresh failed"

**Cause:** Refresh token expired or invalid

**Solution:**
```typescript
// Implement automatic logout on refresh failure
try {
  await refreshToken();
} catch (error) {
  logout(); // Clear tokens and redirect to login
}
```

### Issue: Wallet connection problems

**Cause:** MetaMask or wallet not installed

**Solution:**
```typescript
// Check if wallet is available
if (typeof window.ethereum === 'undefined') {
  showToast('Please install MetaMask');
  return;
}
```

---

## Testing

### Unit Tests

```typescript
// __tests__/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

test('should login successfully', async () => {
  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.login(signature, message, publicKey, address);
  });

  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user).toBeDefined();
});
```

### E2E Tests with Playwright

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can login with wallet', async ({ page }) => {
  await page.goto('/login');
  await page.click('button:has-text("Connect Wallet")');
  await page.click('button:has-text("Sign in with Wallet")');

  // Should redirect to profile
  await expect(page).toHaveURL('/profile');
});
```

---

## Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **wagmi v2:** https://wagmi.sh/
- **viem:** https://viem.sh/
- **TanStack Query:** https://tanstack.com/query/latest

---

**Version:** 1.0
**Last Updated:** 2025-12-31
**Next.js Version:** 14+
