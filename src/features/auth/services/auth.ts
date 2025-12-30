import { http } from "@/shared/lib/http";
import type { AuthResponse, AuthCredentials } from "../interfaces";

/**
 * Verify wallet signature with backend
 * This will call the real API when ready
 */
export async function verifySignature(credentials: AuthCredentials): Promise<AuthResponse> {
  try {
    // TODO: Replace with actual API endpoint when ready
    // const response = await http.post<AuthResponse>("/auth/verify", {
    //   signature: credentials.signature,
    //   message: credentials.message,
    //   publicKey: credentials.wallet.publicKey,
    //   address: credentials.wallet.address,
    // });

    // For now, return mock success response
    return {
      success: true,
      message: "Authentication successful",
      data: {
        token: credentials.signature, // Use signature as token for now
        user: {
          address: credentials.wallet.address,
          publicKey: credentials.wallet.publicKey,
        },
      },
    };
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
 */
export async function getUserProfile(): Promise<AuthResponse> {
  try {
    // TODO: Replace with actual API endpoint when ready
    // const response = await http.get<AuthResponse>("/auth/profile");

    return {
      success: true,
      message: "Profile retrieved",
    };
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
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    // TODO: Replace with actual API endpoint when ready
    // await http.post("/auth/logout");

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Logout failed",
    };
  }
}
