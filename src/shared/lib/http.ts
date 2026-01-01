import axios from "axios";

const STORAGE_KEY = "peridot_auth_credentials";

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  "/api/games",
  "/api/games/banners",
  "/api/games/top-games",
  "/api/games/banner",
  "/api/games/top",
  "/api/categories",
];

export const http = axios.create({
  baseURL: process.env.PUBLIC_API_BASE_URL ?? "https://api.peridotvault.com",
  timeout: 15_000,
});

// Helper function to check if an endpoint is public
function isPublicEndpoint(url?: string): boolean {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some(endpoint => url.startsWith(endpoint));
}

// Request interceptor to inject auth headers
http.interceptors.request.use(
  (config) => {
    // Skip authentication for public endpoints
    if (isPublicEndpoint(config.url)) {
      return config;
    }

    // Get credentials from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const credentials = JSON.parse(stored);
        // Inject signature as bearer token
        if (credentials?.signature) {
          config.headers.Authorization = `Bearer ${credentials.signature}`;
        }
        // Inject wallet address for identification
        if (credentials?.wallet?.address) {
          config.headers["X-Wallet-Address"] = credentials.wallet.address;
        }
      } catch (err) {
        console.error("Failed to parse stored credentials:", err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401/403 errors - clear credentials and redirect to login
    // Only redirect if it's NOT a public endpoint (to avoid redirect loops on public API failures)
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !isPublicEndpoint(error.config?.url)
    ) {
      localStorage.removeItem(STORAGE_KEY);
      // Only redirect if we're in the browser
      if (typeof window !== "undefined") {
        // Don't redirect if already on login/home page
        if (!window.location.pathname.startsWith("/login") &&
          window.location.pathname !== "/") {
          window.location.href = "/?auth=required";
        }
      }
    }
    return Promise.reject(error);
  }
);
