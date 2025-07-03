'use client';

import React from 'react';

/**
 * Performance Monitoring and Optimization Utilities
 *
 * Provides comprehensive performance tracking, monitoring, and optimization
 * utilities for the Sacred Journey application.
 */

// Performance metric types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percent';
  timestamp: number;
  category: 'load' | 'render' | 'interaction' | 'navigation' | 'memory';
  details?: Record<string, any>;
}

export interface ComponentPerformance {
  componentName: string;
  renderTime: number;
  renderCount: number;
  lastRender: number;
  props?: Record<string, any>;
}

export interface PagePerformance {
  pathname: string;
  loadTime: number;
  interactiveTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

// Performance thresholds for alerting
const PERFORMANCE_THRESHOLDS = {
  SLOW_RENDER: 16.67, // 60fps = 16.67ms per frame
  SLOW_NAVIGATION: 1000, // 1 second
  MEMORY_WARNING: 50 * 1024 * 1024, // 50MB
  LCP_WARNING: 2500, // 2.5 seconds
  FID_WARNING: 100, // 100ms
  CLS_WARNING: 0.1, // 0.1 score
} as const;

/**
 * Performance Monitor Class
 * Singleton class for tracking and reporting performance metrics
 */
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private componentMetrics = new Map<string, ComponentPerformance>();
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Initialize performance observers for Web Vitals and other metrics
   */
  private initializeObservers(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    try {
      // Largest Contentful Paint (LCP)
      this.createObserver('largest-contentful-paint', (entries) => {
        const lastEntry = entries[entries.length - 1];
        this.recordMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          unit: 'ms',
          timestamp: Date.now(),
          category: 'load',
          details: { element: lastEntry.element?.tagName },
        });
      });

      // First Input Delay (FID)
      this.createObserver('first-input', (entries) => {
        const firstEntry = entries[0];
        this.recordMetric({
          name: 'FID',
          value: firstEntry.processingStart - firstEntry.startTime,
          unit: 'ms',
          timestamp: Date.now(),
          category: 'interaction',
          details: { eventType: firstEntry.name },
        });
      });

      // Cumulative Layout Shift (CLS)
      this.createObserver('layout-shift', (entries) => {
        let clsValue = 0;
        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        if (clsValue > 0) {
          this.recordMetric({
            name: 'CLS',
            value: clsValue,
            unit: 'count',
            timestamp: Date.now(),
            category: 'render',
            details: { affectedElements: entries.length },
          });
        }
      });

      // Long Tasks
      this.createObserver('longtask', (entries) => {
        entries.forEach((entry) => {
          this.recordMetric({
            name: 'Long Task',
            value: entry.duration,
            unit: 'ms',
            timestamp: Date.now(),
            category: 'render',
            details: {
              startTime: entry.startTime,
              name: entry.name,
            },
          });
        });
      });

      // Navigation timing
      this.createObserver('navigation', (entries) => {
        const nav = entries[0] as PerformanceNavigationTiming;
        this.recordMetric({
          name: 'Page Load',
          value: nav.loadEventEnd - nav.fetchStart,
          unit: 'ms',
          timestamp: Date.now(),
          category: 'navigation',
          details: {
            domContentLoaded: nav.domContentLoadedEventEnd - nav.fetchStart,
            interactive: nav.domInteractive - nav.fetchStart,
            type: nav.type,
          },
        });
      });
    } catch (error) {
      console.warn('Failed to initialize performance observers:', error);
    }
  }

  /**
   * Create a performance observer for specific entry types
   */
  private createObserver(entryType: string, callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes: [entryType] });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to create observer for ${entryType}:`, error);
    }
  }

  /**
   * Start monitoring performance
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    // Monitor memory usage periodically
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordMetric({
          name: 'Memory Usage',
          value: memory.usedJSHeapSize,
          unit: 'bytes',
          timestamp: Date.now(),
          category: 'memory',
          details: {
            totalHeapSize: memory.totalJSHeapSize,
            heapLimit: memory.jsHeapSizeLimit,
          },
        });
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Stop monitoring performance
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Check for performance issues
    this.checkThresholds(metric);

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
    }
  }

  /**
   * Check if metric exceeds performance thresholds
   */
  private checkThresholds(metric: PerformanceMetric): void {
    let threshold: number | undefined;
    let warningMessage = '';

    switch (metric.name) {
      case 'LCP':
        threshold = PERFORMANCE_THRESHOLDS.LCP_WARNING;
        warningMessage = 'Largest Contentful Paint is slow';
        break;
      case 'FID':
        threshold = PERFORMANCE_THRESHOLDS.FID_WARNING;
        warningMessage = 'First Input Delay is high';
        break;
      case 'CLS':
        threshold = PERFORMANCE_THRESHOLDS.CLS_WARNING;
        warningMessage = 'Cumulative Layout Shift is high';
        break;
      case 'Long Task':
        threshold = PERFORMANCE_THRESHOLDS.SLOW_RENDER;
        warningMessage = 'Long task detected - may cause jank';
        break;
      case 'Memory Usage':
        threshold = PERFORMANCE_THRESHOLDS.MEMORY_WARNING;
        warningMessage = 'High memory usage detected';
        break;
    }

    if (threshold && metric.value > threshold) {
      console.warn(`⚠️ Performance Warning: ${warningMessage}`, {
        metric: metric.name,
        value: `${metric.value}${metric.unit}`,
        threshold: `${threshold}${metric.unit}`,
        details: metric.details,
      });

      // Report to analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'performance_warning', {
          metric_name: metric.name,
          metric_value: metric.value,
          threshold: threshold,
        });
      }
    }
  }

  /**
   * Record component render performance
   */
  recordComponentRender(
    componentName: string,
    renderTime: number,
    props?: Record<string, any>
  ): void {
    const existing = this.componentMetrics.get(componentName);

    if (existing) {
      existing.renderTime = renderTime;
      existing.renderCount++;
      existing.lastRender = Date.now();
      existing.props = props;
    } else {
      this.componentMetrics.set(componentName, {
        componentName,
        renderTime,
        renderCount: 1,
        lastRender: Date.now(),
        props,
      });
    }

    // Record as general metric
    this.recordMetric({
      name: 'Component Render',
      value: renderTime,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'render',
      details: { componentName, props },
    });
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    metrics: PerformanceMetric[];
    components: ComponentPerformance[];
    warnings: PerformanceMetric[];
  } {
    const warnings = this.metrics.filter((metric) => {
      switch (metric.name) {
        case 'LCP':
          return metric.value > PERFORMANCE_THRESHOLDS.LCP_WARNING;
        case 'FID':
          return metric.value > PERFORMANCE_THRESHOLDS.FID_WARNING;
        case 'CLS':
          return metric.value > PERFORMANCE_THRESHOLDS.CLS_WARNING;
        case 'Long Task':
          return metric.value > PERFORMANCE_THRESHOLDS.SLOW_RENDER;
        case 'Memory Usage':
          return metric.value > PERFORMANCE_THRESHOLDS.MEMORY_WARNING;
        default:
          return false;
      }
    });

    return {
      metrics: this.metrics.slice(-100), // Last 100 metrics
      components: Array.from(this.componentMetrics.values()),
      warnings,
    };
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.componentMetrics.clear();
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): string {
    return JSON.stringify(
      {
        metrics: this.metrics,
        components: Array.from(this.componentMetrics.entries()),
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
      null,
      2
    );
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

/**
 * React Hook for component performance monitoring
 */
export function usePerformanceMonitor(componentName: string) {
  const renderStart = React.useRef<number>(0);

  React.useLayoutEffect(() => {
    renderStart.current = performance.now();
  });

  React.useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    performanceMonitor.recordComponentRender(componentName, renderTime);
  });

  return {
    startTiming: () => {
      renderStart.current = performance.now();
    },
    endTiming: () => {
      const renderTime = performance.now() - renderStart.current;
      performanceMonitor.recordComponentRender(componentName, renderTime);
      return renderTime;
    },
    recordMetric: (name: string, value: number, unit: PerformanceMetric['unit'] = 'ms') => {
      performanceMonitor.recordMetric({
        name: `${componentName}: ${name}`,
        value,
        unit,
        timestamp: Date.now(),
        category: 'render',
      });
    },
  };
}

/**
 * Higher-order component for automatic performance monitoring
 */
export function withPerformanceMonitoring<P extends object>(Component: React.ComponentType<P>) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const componentName = Component.displayName || Component.name || 'Unknown';
    usePerformanceMonitor(componentName);

    return <Component {...props} ref={ref} />;
  });

  WrappedComponent.displayName = `withPerformanceMonitoring(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Utility functions for manual performance measurement
 */
export const performanceUtils = {
  /**
   * Measure function execution time
   */
  measureFunction: <T extends (...args: any[]) => any>(fn: T, name?: string): T => {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = fn(...args);
      const duration = performance.now() - start;

      performanceMonitor.recordMetric({
        name: name || fn.name || 'Function Execution',
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'render',
      });

      return result;
    }) as T;
  },

  /**
   * Measure async function execution time
   */
  measureAsyncFunction: <T extends (...args: any[]) => Promise<any>>(fn: T, name?: string): T => {
    return (async (...args: Parameters<T>) => {
      const start = performance.now();
      const result = await fn(...args);
      const duration = performance.now() - start;

      performanceMonitor.recordMetric({
        name: name || fn.name || 'Async Function Execution',
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'render',
      });

      return result;
    }) as T;
  },

  /**
   * Create a performance mark
   */
  mark: (name: string): void => {
    if ('mark' in performance) {
      performance.mark(name);
    }
  },

  /**
   * Measure between two marks
   */
  measure: (name: string, startMark: string, endMark?: string): number | null => {
    try {
      if ('measure' in performance) {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name, 'measure');
        const lastEntry = entries[entries.length - 1];

        performanceMonitor.recordMetric({
          name,
          value: lastEntry.duration,
          unit: 'ms',
          timestamp: Date.now(),
          category: 'render',
        });

        return lastEntry.duration;
      }
    } catch (error) {
      console.warn('Failed to measure performance:', error);
    }
    return null;
  },
};

/**
 * Initialize performance monitoring on app start
 */
export function initializePerformanceMonitoring(): void {
  if (typeof window !== 'undefined') {
    performanceMonitor.startMonitoring();

    // Auto-stop on page unload
    window.addEventListener('beforeunload', () => {
      performanceMonitor.stopMonitoring();
    });
  }
}

// Export additional types
export type {
  PerformanceMetric as PerfMetric,
  ComponentPerformance as CompPerformance,
  PagePerformance as PagePerf,
};
