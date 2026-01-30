/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func: Function, limit: number): Function;
/**
 * Debounce function to delay function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func: Function, delay: number): Function;
/**
 * Request animation frame throttle for smooth animations
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF throttled function
 */
export function rafThrottle(func: Function): Function;
/**
 * High performance transform utility with hardware acceleration
 * @param {HTMLElement} element - Element to transform
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} [scale=1] - Scale factor
 */
export function setTransform(element: HTMLElement, x: number, y: number, scale?: number): void;
/**
 * Reset element position efficiently
 * @param {HTMLElement} element - Element to reset
 */
export function resetTransform(element: HTMLElement): void;
/**
 * Memory-efficient batch DOM operations
 * @param {Function} callback - Callback containing DOM operations
 * @returns {*} Result of the callback
 */
export function batchDOMOperations(callback: Function): any;
/**
 * Optimized element visibility check
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is visible
 */
export function isElementVisible(element: HTMLElement): boolean;
/**
 * Memory usage tracking utility
 * @returns {Object} Memory usage information
 */
export function getMemoryUsage(): Object;
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
    metrics: Map<any, any>;
    observers: Map<any, any>;
    isEnabled: false | ((markName: string, markOptions?: PerformanceMarkOptions) => PerformanceMark);
    /**
     * Sets up performance observers for automatic metrics collection
     * @private
     */
    private _setupObservers;
    /**
     * Starts measuring performance for a given operation
     * @param {string} name - Name of the operation
     */
    startMeasure(name: string): void;
    /**
     * Ends measuring performance for a given operation
     * @param {string} name - Name of the operation
     * @returns {number} Duration in milliseconds
     */
    endMeasure(name: string): number;
    /**
     * Records a metric value
     * @param {string} name - Metric name
     * @param {number} value - Metric value
     */
    recordMetric(name: string, value: number): void;
    /**
     * Gets metrics summary
     * @returns {Object} Metrics summary
     */
    getMetrics(): Object;
    /**
     * Calculates percentile for a set of values
     * @private
     * @param {Array<number>} values - Array of values
     * @param {number} percentile - Percentile to calculate (0-100)
     * @returns {number} Percentile value
     */
    private _calculatePercentile;
    /**
     * Clears all metrics
     */
    clearMetrics(): void;
    /**
     * Destroys the performance monitor and cleans up resources
     */
    destroy(): void;
}
//# sourceMappingURL=performance.d.ts.map