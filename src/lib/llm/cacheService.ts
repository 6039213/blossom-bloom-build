
import { CACHE_DURATION } from '../constants';

interface CacheEntry {
  response: string;
  timestamp: number;
  tokens: number;
}

// In-memory cache for responses
const responseCache = new Map<string, CacheEntry>();

// Generate a cache key from a prompt
const getCacheKey = (prompt: string): string => {
  // Simple hashing for now, could be improved
  return prompt.trim().toLowerCase().replace(/\s+/g, ' ');
};

// Check if a cached response exists and is valid
export const getCachedResponse = (prompt: string): string | null => {
  const key = getCacheKey(prompt);
  const cached = responseCache.get(key);
  
  if (!cached) {
    return null;
  }
  
  // Check if cache is expired
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    responseCache.delete(key);
    return null;
  }
  
  return cached.response;
};

// Save a response to the cache
export const cacheResponse = (prompt: string, response: string, tokens: number = 0): void => {
  const key = getCacheKey(prompt);
  responseCache.set(key, {
    response,
    timestamp: Date.now(),
    tokens
  });
};

// Get token count for a cached response
export const getCachedTokenCount = (prompt: string): number => {
  const key = getCacheKey(prompt);
  const cached = responseCache.get(key);
  
  if (!cached) {
    return 0;
  }
  
  return cached.tokens;
};

// Clear expired cache entries
export const cleanCache = (): void => {
  const now = Date.now();
  
  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      responseCache.delete(key);
    }
  }
};

// Run cache cleanup periodically
setInterval(cleanCache, 15 * 60 * 1000); // Clean every 15 minutes
