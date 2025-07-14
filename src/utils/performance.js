/**
 * Performance utilities for smooth interactions
 */

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Request animation frame throttle for smooth animations
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF throttled function
 */
export function rafThrottle(func) {
    let isThrottled = false;
    return function() {
        if (isThrottled) return;
        
        const args = arguments;
        const context = this;
        
        isThrottled = true;
        requestAnimationFrame(() => {
            func.apply(context, args);
            isThrottled = false;
        });
    };
}

/**
 * High performance transform utility
 * @param {HTMLElement} element - Element to transform
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} scale - Scale factor
 */
export function setTransform(element, x, y, scale = 1) {
    // Use transform3d for hardware acceleration
    element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
}

/**
 * Reset element position efficiently
 * @param {HTMLElement} element - Element to reset
 */
export function resetTransform(element) {
    element.style.transform = '';
    element.style.left = '';
    element.style.top = '';
}
