/**
 * Performance utilities for smooth interactions and monitoring
 * @module utils/performance
 * @since 2.0.0
 */

/**
 * Performance monitoring class for measuring and tracking performance metrics
 * @class
 */
export class PerformanceMonitor {
  /**
     * Creates a new PerformanceMonitor instance
     */
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = typeof performance !== 'undefined' && performance.mark;

    if (this.isEnabled) {
      this._setupObservers();
    }
  }

  /**
     * Sets up performance observers for automatic metrics collection
     * @private
     */
  _setupObservers() {
    try {
      // Performance Observer for paint metrics
      if (typeof PerformanceObserver !== 'undefined') {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric(entry.name, entry.startTime);
          }
        });

        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.set('paint', paintObserver);
      }
    } catch (error) {
      console.warn('Performance observers not available:', error.message);
    }
  }

  /**
     * Starts measuring performance for a given operation
     * @param {string} name - Name of the operation
     */
  startMeasure(name) {
    if (!this.isEnabled) return;

    try {
      performance.mark(`${name}-start`);
    } catch (error) {
      console.warn(`Failed to start performance measure for ${name}:`, error.message);
    }
  }

  /**
     * Ends measuring performance for a given operation
     * @param {string} name - Name of the operation
     * @returns {number} Duration in milliseconds
     */
  endMeasure(name) {
    if (!this.isEnabled) return 0;

    try {
      performance.mark(`${name}-end`);
      const measure = performance.measure(name, `${name}-start`, `${name}-end`);

      this.recordMetric(name, measure.duration);

      // Clean up marks
      performance.clearMarks(`${name}-start`);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);

      return measure.duration;
    } catch (error) {
      console.warn(`Failed to end performance measure for ${name}:`, error.message);
      return 0;
    }
  }

  /**
     * Records a metric value
     * @param {string} name - Metric name
     * @param {number} value - Metric value
     */
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, {
        count: 0,
        total: 0,
        min: Infinity,
        max: -Infinity,
        values: [],
      });
    }

    const metric = this.metrics.get(name);
    metric.count++;
    metric.total += value;
    metric.min = Math.min(metric.min, value);
    metric.max = Math.max(metric.max, value);
    metric.values.push(value);

    // Keep only last 100 values to prevent memory leaks
    if (metric.values.length > 100) {
      metric.values.shift();
    }
  }

  /**
     * Gets metrics summary
     * @returns {Object} Metrics summary
     */
  getMetrics() {
    const summary = {};

    for (const [name, metric] of this.metrics) {
      summary[name] = {
        count: metric.count,
        average: metric.total / metric.count,
        min: metric.min,
        max: metric.max,
        total: metric.total,
        p95: this._calculatePercentile(metric.values, 95),
        p99: this._calculatePercentile(metric.values, 99),
      };
    }

    return summary;
  }

  /**
     * Calculates percentile for a set of values
     * @private
     * @param {Array<number>} values - Array of values
     * @param {number} percentile - Percentile to calculate (0-100)
     * @returns {number} Percentile value
     */
  _calculatePercentile(values, percentile) {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
     * Clears all metrics
     */
  clearMetrics() {
    this.metrics.clear();
  }

  /**
     * Destroys the performance monitor and cleans up resources
     */
  destroy() {
    // Disconnect observers
    for (const observer of this.observers.values()) {
      if (observer && typeof observer.disconnect === 'function') {
        observer.disconnect();
      }
    }

    this.observers.clear();
    this.metrics.clear();
  }
}

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Debounce function to delay function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
}

/**
 * Request animation frame throttle for smooth animations
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF throttled function
 */
export function rafThrottle(func) {
  let isThrottled = false;
  return function (...args) {
    if (isThrottled) return;

    const context = this;

    isThrottled = true;
    requestAnimationFrame(() => {
      func.apply(context, args);
      isThrottled = false;
    });
  };
}

/**
 * High performance transform utility with hardware acceleration
 * @param {HTMLElement} element - Element to transform
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} [scale=1] - Scale factor
 */
export function setTransform(element, x, y, scale = 1) {
  if (!element || !element.style) return;

  // Use transform3d for hardware acceleration
  element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

  // Promote to composite layer for better performance
  element.style.willChange = 'transform';
}

/**
 * Reset element position efficiently
 * @param {HTMLElement} element - Element to reset
 */
export function resetTransform(element) {
  if (!element || !element.style) return;

  element.style.transform = '';
  element.style.left = '';
  element.style.top = '';
  element.style.willChange = '';
}

/**
 * Memory-efficient batch DOM operations
 * @param {Function} callback - Callback containing DOM operations
 * @returns {*} Result of the callback
 */
export function batchDOMOperations(callback) {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const result = callback();
      resolve(result);
    });
  });
}

/**
 * Optimized element visibility check
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is visible
 */
export function isElementVisible(element) {
  if (!element || !element.getBoundingClientRect) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.width > 0
        && rect.height > 0
        && rect.bottom > 0
        && rect.right > 0
        && rect.top < (window.innerHeight || document.documentElement.clientHeight)
        && rect.left < (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Memory usage tracking utility
 * @returns {Object} Memory usage information
 */
export function getMemoryUsage() {
  if (typeof performance !== 'undefined' && performance.memory) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
    };
  }

  return {
    used: 0,
    total: 0,
    limit: 0,
    supported: false,
  };
}
