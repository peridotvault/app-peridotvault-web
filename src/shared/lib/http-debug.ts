/**
 * HTTP Client with Debug Logging
 *
 * This file logs all API requests for debugging purposes
 */

import axios from "axios";
import type { AxiosInstance } from "axios";

const STORAGE_KEY = "peridot_auth_credentials";

const PUBLIC_ENDPOINTS = [
  "/api/games",
  "/api/games/banners",
  "/api/games/top-games",
  "/api/games/banner",
  "/api/games/top",
  "/api/categories",
];

const API_BASE_URL = process.env.PUBLIC_API_BASE_URL ?? "https://api.peridotvault.com";

// Create axios instance
const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
});

// Log configuration
console.log("=".repeat(60));
console.log("🔗 HTTP CLIENT INITIALIZED");
console.log("=".repeat(60));
console.log("Base URL:", API_BASE_URL);
console.log("Environment:", process.env.NODE_ENV);
console.log("PUBLIC_API_BASE_URL:", process.env.PUBLIC_API_BASE_URL ?? "NOT SET");
console.log("Final Base URL:", http.defaults.baseURL);
console.log("=".repeat(60));

// Helper function
function isPublicEndpoint(url?: string): boolean {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((endpoint) => url.startsWith(endpoint));
}

// Request interceptor - Add auth headers & logging
http.interceptors.request.use(
  (config) => {
    // Log every request
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`📤 API Request:`, {
      method: config.method?.toUpperCase(),
      url: fullUrl,
      hasAuth: !!config.headers.Authorization,
    });

    // Add auth headers for non-public endpoints
    if (!isPublicEndpoint(config.url)) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const credentials = JSON.parse(stored);
          if (credentials?.signature) {
            config.headers.Authorization = `Bearer ${credentials.signature}`;
          }
          if (credentials?.wallet?.address) {
            config.headers["X-Wallet-Address"] = credentials.wallet.address;
          }
        } catch (err) {
          console.error("Failed to parse stored credentials:", err);
        }
      }
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors & logging
http.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response:`, {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  (error) => {
    console.error(`❌ API Error:`, {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
    });

    // Handle 401/403
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !isPublicEndpoint(error.config?.url)
    ) {
      localStorage.removeItem(STORAGE_KEY);
      if (typeof window !== "undefined") {
        if (!window.location.pathname.startsWith("/login") &&
          window.location.pathname !== "/") {
          window.location.href = "/?auth=required";
        }
      }
    }

    return Promise.reject(error);
  }
);

export { http };
