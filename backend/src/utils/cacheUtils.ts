/**
 * Cache utility functions for flexible cache management
 */

/**
 * Check if cache is enabled from environment variable
 * @returns {boolean} True if cache is enabled, false otherwise
 */
export function isCacheEnabled(): boolean {
  return process.env.CACHE_ENABLED === "true";
}

/**
 * Execute function with cache if enabled, otherwise run directly
 * @param cachedFunction Function that uses cache
 * @param directFunction Function that runs direct query
 * @returns Result from cached or direct function
 */
export async function executeWithCacheControl<T>(
  cachedFunction: () => Promise<T>,
  directFunction: () => Promise<T>
): Promise<T> {
  if (isCacheEnabled()) {
    return await cachedFunction();
  } else {
    return await directFunction();
  }
}

/**
 * Log cache status for debugging
 */
export function logCacheStatus(): void {
  const enabled = isCacheEnabled();
  console.log(`🔧 Cache Status: ${enabled ? "✅ ENABLED" : "❌ DISABLED"}`);
}
