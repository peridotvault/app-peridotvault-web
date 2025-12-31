export interface WalletInfo {
  address: string;
  publicKey: string;
}

export interface AuthCredentials {
  signature: string;
  message: string;
  wallet: WalletInfo;
  token?: string;
  expiresAt?: string; // ISO 8601 datetime string
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  credentials: AuthCredentials | null;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshAuth: () => Promise<void>;
  getAccessToken: () => string | null;
  isTokenExpired: () => boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    expiresAt?: string;
    user?: {
      address: string;
      publicKey: string;
      username?: string;
      email?: string;
    };
  };
  error?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    expiresAt: string;
  };
  error?: string;
}

// Error types for better error handling
export enum AuthErrorType {
  WALLET_NOT_FOUND = "WALLET_NOT_FOUND",
  SIGNATURE_FAILED = "SIGNATURE_FAILED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  REFRESH_FAILED = "REFRESH_FAILED",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface AuthError extends Error {
  type: AuthErrorType;
}
