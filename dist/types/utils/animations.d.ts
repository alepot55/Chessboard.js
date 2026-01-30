/**
 * Animation utilities for Chessboard.js
 */
/**
 * Get the CSS transition duration in milliseconds
 * @param {string|number} time - Time value ('fast', 'slow', or number in ms)
 * @returns {number} Duration in milliseconds
 */
export function parseTime(time: string | number): number;
/**
 * Get the CSS transition function
 * @param {string} animation - Animation type ('ease', 'linear', etc.)
 * @returns {string} CSS transition function
 */
export function parseAnimation(animation: string): string;
/**
 * Create a promise that resolves after animation completion
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise} Promise that resolves after the duration
 */
export function animationPromise(duration: number): Promise<any>;
//# sourceMappingURL=animations.d.ts.map