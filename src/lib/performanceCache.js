// src/lib/performanceCache.js

/**
 * High-performance in-memory cache with TTL and size limits
 * Designed to prevent memory leaks and improve page load times
 */
class PerformanceCache {
  constructor(maxSize = 50, defaultTTL = 300000) { // 5 minutes default TTL
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

  get(key) {
    const item = this.cache.get(key);
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

  set(key, value, ttl = this.defaultTTL) {
    // Evict oldest items if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      this.delete(firstKey);
      this.stats.evictions++;
    }

    // Clear existing timer if updating existing key
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
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

  delete(key) {
    const deleted = this.cache.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    return deleted;
  }

  clear() {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0 
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
      : 0;
    
    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      size: this.cache.size
    };
  }

  // Cleanup expired entries manually
  cleanup() {
    const now = Date.now();
    const expiredKeys = [];
    
    this.cache.forEach((item, key) => {
      if (now > item.expiry) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => this.delete(key));
    return expiredKeys.length;
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

// Export for debugging
if (typeof window !== 'undefined') {
  window.performanceCache = performanceCache;
}