import { ApiResponse } from "@/shared/interfaces/api";

// Simulated delay untuk realistic API experience
export const mockDelay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate random ID
export const generateId = () => Math.random().toString(36).substring(2, 15);

// LocalStorage helpers
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },
};

// Mock API response helper
export const createMockResponse = <T>(
  data: T,
  message: string = "Success"
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  error: null,
});

// Mock API error response helper
export const createMockErrorResponse = (message: string = "An error occurred"): ApiResponse<never> => ({
  success: false,
  message,
  data: null as never,
  error: message,
});

// Mock file upload - returns fake URL
export const mockFileUpload = async (file: File): Promise<string> => {
  await mockDelay(1000);
  // Return fake URL that points to the uploaded file
  return URL.createObjectURL(file);
};
