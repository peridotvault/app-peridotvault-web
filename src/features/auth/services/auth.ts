/**
 * Authentication services
 *
 * Handles all authentication-related API calls for wallet-based authentication.
 */

import { http } from "@/shared/lib/http";
import type { AuthResponse, AuthCredentials } from "../interfaces";

/**
 * Verify wallet signature with backend
 *
 * @param credentials - The signature and wallet information
 * @returns Promise with auth response including token
 */
export async function verifySignature(credentials: AuthCredentials): Promise<AuthResponse> {
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
 * @returns Promise with user profile data
 */
export async function getUserProfile(): Promise<AuthResponse> {
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
 * @returns Promise with logout response
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
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
