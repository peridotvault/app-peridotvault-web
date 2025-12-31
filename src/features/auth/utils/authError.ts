/**
 * Authentication error utilities
 */

import { AuthErrorType, type AuthError } from "../interfaces";

// Re-export AuthErrorType for convenience
export { AuthErrorType };

/**
 * Creates an authentication error with proper type
 */
export function createAuthError(message: string, type: AuthErrorType = AuthErrorType.UNKNOWN_ERROR): AuthError {
  const error = new Error(message) as AuthError;
  error.type = type;
  return error;
}

/**
 * Determines if an error is recoverable (should retry)
 */
export function isRecoverableAuthError(error: AuthError): boolean {
  return (
    error.type === AuthErrorType.TOKEN_EXPIRED ||
    error.type === AuthErrorType.NETWORK_ERROR
  );
}

/**
 * Maps error codes from API to AuthErrorType
 */
export function mapApiErrorToAuthError(apiError: string): AuthErrorType {
  const errorMap: Record<string, AuthErrorType> = {
    INVALID_SIGNATURE: AuthErrorType.SIGNATURE_FAILED,
    INVALID_TOKEN: AuthErrorType.TOKEN_EXPIRED,
    TOKEN_EXPIRED: AuthErrorType.TOKEN_EXPIRED,
    REFRESH_FAILED: AuthErrorType.REFRESH_FAILED,
    RATE_LIMIT_EXCEEDED: AuthErrorType.NETWORK_ERROR,
  };

  return errorMap[apiError] || AuthErrorType.UNKNOWN_ERROR;
}

/**
 * Gets a user-friendly error message based on error type
 */
export function getAuthErrorMessage(error: AuthError): string {
  const messageMap: Record<AuthErrorType, string> = {
    [AuthErrorType.WALLET_NOT_FOUND]:
      "Peridot Wallet extension not found. Please install it first.",
    [AuthErrorType.SIGNATURE_FAILED]:
      "Failed to sign the authentication message. Please try again.",
    [AuthErrorType.TOKEN_EXPIRED]:
      "Your session has expired. Please reconnect your wallet.",
    [AuthErrorType.REFRESH_FAILED]:
      "Failed to refresh your session. Please reconnect your wallet.",
    [AuthErrorType.NETWORK_ERROR]:
      "Network error. Please check your connection and try again.",
    [AuthErrorType.UNKNOWN_ERROR]:
      "An unexpected error occurred. Please try again.",
  };

  return messageMap[error.type] || error.message;
}
