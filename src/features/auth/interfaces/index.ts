export interface WalletInfo {
  address: string;
  publicKey: string;
}

export interface AuthCredentials {
  signature: string;
  message: string;
  wallet: WalletInfo;
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
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user?: {
      address: string;
      publicKey: string;
    };
  };
  error?: string;
}
