/**
 * Animation utilities for Chessboard.js
 */

/**
 * Get the CSS transition duration in milliseconds
 * @param {string|number} time - Time value ('fast', 'slow', or number in ms)
 * @returns {number} Duration in milliseconds
 */
export function parseTime(time) {
  if (typeof time === 'number') return time;

  switch (time) {
    case 'fast': return 150;
    case 'slow': return 500;
    default: return 200;
  }
}

/**
 * Get the CSS transition function
 * @param {string} animation - Animation type ('ease', 'linear', etc.)
 * @returns {string} CSS transition function
 */
export function parseAnimation(animation) {
  const validAnimations = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'];
  return validAnimations.includes(animation) ? animation : 'ease';
}

/**
 * Create a promise that resolves after animation completion
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise} Promise that resolves after the duration
 */
export function animationPromise(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
