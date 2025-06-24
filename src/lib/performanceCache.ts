
// src/lib/performanceCache.ts

interface CacheItem<T> {
  value: T;
  expiry: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  evictions: number;
  hitRate: string;
  size: number;
}

/**
 * High-performance in-memory cache with TTL and size limits
 * Designed to prevent memory leaks and improve page load times
 */
class PerformanceCache {
  private cache: Map<string, CacheItem<any>>;
  private timers: Map<string, NodeJS.Timeout>;
  private maxSize: number;
  private defaultTTL: number;
  private stats: Omit<CacheStats, 'hitRate' | 'size'>;

  constructor(maxSize: number = 50, defaultTTL: number = 300000) { // 5 minutes default TTL
    this.cache = new Map();
    this.timers = new Map();
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0
    };
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    if (!item) {
      this.stats.misses++;
      return null;
    }

    // Check if item has expired
    if (Date.now() > item.expiry) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.value;
  }

  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    // Evict oldest items if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.delete(firstKey);
        this.stats.evictions++;
      }
    }

    // Clear existing timer if updating existing key
    if (this.timers.has(key)) {
      const existingTimer = this.timers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
    }

    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });

    // Set cleanup timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);
    this.timers.set(key, timer);

    this.stats.sets++;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
    return deleted;
  }

  clear(): void {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getStats(): CacheStats {
    const hitRate = this.stats.hits + this.stats.misses > 0 
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
      : '0';
    
    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      size: this.cache.size
    };
  }

  // Cleanup expired entries manually
  cleanup(): number {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    this.cache.forEach((item, key) => {
      if (now > item.expiry) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => this.delete(key));
    return expiredKeys.length;
  }

  // Check if a key exists and is not expired
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  // Get all keys (excluding expired ones)
  keys(): string[] {
    const validKeys: string[] = [];
    const now = Date.now();
    
    this.cache.forEach((item, key) => {
      if (now <= item.expiry) {
        validKeys.push(key);
      }
    });
    
    return validKeys;
  }

  // Get cache usage as percentage
  getUsagePercentage(): number {
    return Math.round((this.cache.size / this.maxSize) * 100);
  }
}

// Create singleton instance
export const performanceCache = new PerformanceCache();

// Optional: Periodic cleanup (run every 5 minutes)
if (typeof window !== 'undefined') {
  setInterval(() => {
    const cleaned = performanceCache.cleanup();
    if (cleaned > 0) {
      console.log(`Performance cache cleaned up ${cleaned} expired entries`);
    }
  }, 300000); // 5 minutes
}

// Export for debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).performanceCache = performanceCache;
}

export default PerformanceCache;
