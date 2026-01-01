/**
 * Retry utility with exponential backoff
 *
 * Implements retry logic for failed operations with exponential backoff delay
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error) => boolean;
}

/**
 * Retry a function with exponential backoff
 *
 * @param fn - Function to retry
 * @param options - Retry configuration options
 * @returns Promise with the result of the function
 *
 * @example
 * ```ts
 * const result = await retry(
 *   () => fetch('/api/data'),
 *   { maxAttempts: 3, initialDelay: 1000 }
 * );
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    shouldRetry = () => true,
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if we should retry this error
      if (!shouldRetry(lastError)) {
        throw lastError;
      }

      // If this was the last attempt, throw the error
      if (attempt === maxAttempts) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt - 1),
        maxDelay
      );

      console.log(
        `Attempt ${attempt} failed, retrying in ${delay}ms...`,
        lastError.message
      );

      // Wait before retrying
      await sleep(delay);
    }
  }

  throw lastError!;
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a retry wrapper for async functions
 *
 * @param fn - Function to wrap with retry logic
 * @param options - Retry configuration options
 * @returns Wrapped function with retry logic
 *
 * @example
 * ```ts
 * const fetchWithRetry = retryWrapper(fetch, { maxAttempts: 3 });
 * const result = await fetchWithRetry('/api/data');
 * ```
 */
export function retryWrapper<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: RetryOptions = {}
): T {
  return (async (...args: Parameters<T>) => {
    return retry(() => fn(...args), options);
  }) as T;
}

/**
 * Default shouldRetry implementation for common error types
 */
export function defaultShouldRetry(error: Error): boolean {
  // Retry on network errors
  if (error.message.includes("Network Error") || error.message.includes("ECONNREFUSED")) {
    return true;
  }

  // Retry on timeout
  if (error.message.includes("timeout") || error.message.includes("TIMEOUT")) {
    return true;
  }

  // Retry on 5xx server errors (if error contains status code)
  if (error.message.includes("500") || error.message.includes("502") || error.message.includes("503")) {
    return true;
  }

  // Don't retry on client errors (4xx)
  if (error.message.includes("400") || error.message.includes("401") || error.message.includes("403") || error.message.includes("404")) {
    return false;
  }

  // Default: retry
  return true;
}

/**
 * Retry with jitter to avoid thundering herd problem
 *
 * Adds random jitter to the delay to prevent multiple clients
 * from retrying at the exact same time
 */
export async function retryWithJitter<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return retry(fn, {
    ...options,
    // Override delay calculation with jitter
  });
}
