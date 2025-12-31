/**
 * Authentication services
 *
 * This file contains all authentication-related API calls.
 * When the backend is ready, set USE_MOCK_API to false to use real endpoints.
 */

import { http } from "@/shared/lib/http";
import type { AuthResponse, AuthCredentials } from "../interfaces";

// Set this to false when backend API is ready
const USE_MOCK_API = false;

/**
 * Verify wallet signature with backend
 *
 * Calls POST /auth/verify to authenticate the user
 *
 * @param credentials - The signature and wallet information
 * @returns Promise with auth response including token
 */
export async function verifySignature(credentials: AuthCredentials): Promise<AuthResponse> {
  // Use mock API if backend is not ready
  if (USE_MOCK_API) {
    return mockVerifySignature(credentials);
  }

  try {
    const response = await http.post<AuthResponse>("/api/auth/verify", {
      signature: credentials.signature,
      message: credentials.message,
      publicKey: credentials.wallet.publicKey,
      address: credentials.wallet.address,
    });

    return response.data;
  } catch (error) {
    return {
      success: false,
      message: "Authentication failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get user profile from backend
 *
 * Calls GET /auth/profile to retrieve user information
 *
 * @returns Promise with user profile data
 */
export async function getUserProfile(): Promise<AuthResponse> {
  // Use mock API if backend is not ready
  if (USE_MOCK_API) {
    return mockGetUserProfile();
  }

  try {
    const response = await http.get<AuthResponse>("/api/auth/profile");
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to retrieve profile",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Logout user (invalidate session on backend)
 *
 * Calls POST /auth/logout to invalidate the current session
 *
 * @returns Promise with logout response
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  // Use mock API if backend is not ready
  if (USE_MOCK_API) {
    return mockLogout();
  }

  try {
    await http.post("/api/auth/logout");
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    // Logout should succeed even if API call fails
    console.error("Logout API call failed:", error);
    return {
      success: true,
      message: "Logged out (API call failed)",
    };
  }
}

// ============================================================================
// MOCK IMPLEMENTATIONS (Remove when USE_MOCK_API is set to false)
// ============================================================================

/**
 * Mock signature verification
 * Returns a mock JWT token
 */
function mockVerifySignature(credentials: AuthCredentials): AuthResponse {
  // Simulate API delay
  const delay = Math.random() * 500 + 200; // 200-700ms

  // Create a mock JWT token (not valid, just for testing)
  const mockToken = btoa(JSON.stringify({
    address: credentials.wallet.address,
    publicKey: credentials.wallet.publicKey,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
  }));

  // Calculate expiration time (24 hours from now)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return {
    success: true,
    message: "Authentication successful",
    data: {
      token: mockToken,
      expiresAt,
      user: {
        address: credentials.wallet.address,
        publicKey: credentials.wallet.publicKey,
        username: undefined,
        email: undefined,
      },
    },
  };
}

/**
 * Mock get user profile
 */
function mockGetUserProfile(): AuthResponse {
  return {
    success: true,
    message: "Profile retrieved successfully",
    data: {
      user: {
        address: "0x1234567890abcdef",
        publicKey: "0xabcdef",
        username: undefined,
        email: undefined,
      },
    },
  };
}

/**
 * Mock logout
 */
function mockLogout(): { success: boolean; message: string } {
  return {
    success: true,
    message: "Logged out successfully",
  };
}
