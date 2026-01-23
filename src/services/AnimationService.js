/**
 * Service for managing animations and transitions
 * @module services/AnimationService
 * @since 2.0.0
 */

/**
 * Service responsible for coordinating animations and transitions
 * @class
 */
export class AnimationService {
  /**
     * Creates a new AnimationService instance
     * @param {ChessboardConfig} config - Board configuration
     */
  constructor(config) {
    this.config = config;
    this.activeAnimations = new Map();
    this.animationId = 0;
  }

  /**
     * Creates a timing function for animations
     * @param {string} [type='ease'] - Animation type
     * @returns {Function} Timing function
     */
  createTimingFunction(type = 'ease') {
    return (elapsed, duration) => {
      const x = elapsed / duration;

      switch (type) {
        case 'linear':
          return x;
        case 'ease':
          return (x ** 2) * (3 - 2 * x);
        case 'ease-in':
          return x ** 2;
        case 'ease-out':
          return -1 * (x - 1) ** 2 + 1;
        case 'ease-in-out':
          return (x < 0.5) ? 2 * x ** 2 : 4 * x - 2 * x ** 2 - 1;
        default:
          return x;
      }
    };
  }

  /**
     * Animates an element with given properties
     * @param {HTMLElement} element - Element to animate
     * @param {Object} properties - Properties to animate
     * @param {number} duration - Animation duration in milliseconds
     * @param {string} [easing='ease'] - Easing function
     * @param {Function} [callback] - Callback when animation completes
     * @returns {number} Animation ID
     */
  animate(element, properties, duration, easing = 'ease', callback) {
    const animationId = ++this.animationId;
    const timingFunction = this.createTimingFunction(easing);
    const startTime = performance.now();
    const startValues = {};

    // Store initial values
    Object.keys(properties).forEach((prop) => {
      startValues[prop] = this._getInitialValue(element, prop);
    });

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = timingFunction(elapsed, duration);

      // Apply animated values
      Object.keys(properties).forEach((prop) => {
        const startValue = startValues[prop];
        const endValue = properties[prop];
        const currentValue = this._interpolateValue(startValue, endValue, easedProgress);
        this._applyValue(element, prop, currentValue);
      });

      if (progress < 1 && this.activeAnimations.has(animationId)) {
        requestAnimationFrame(animate);
      } else {
        this.activeAnimations.delete(animationId);
        if (callback) callback();
      }
    };

    this.activeAnimations.set(animationId, { element, animate, callback });
    requestAnimationFrame(animate);

    return animationId;
  }

  /**
     * Cancels an animation
     * @param {number} animationId - Animation ID to cancel
     */
  cancel(animationId) {
    if (this.activeAnimations.has(animationId)) {
      this.activeAnimations.delete(animationId);
    }
  }

  /**
     * Cancels all animations
     */
  cancelAll() {
    this.activeAnimations.clear();
  }

  /**
     * Gets initial value for a property
     * @private
     * @param {HTMLElement} element - Element
     * @param {string} property - Property name
     * @returns {number} Initial value
     */
  _getInitialValue(element, property) {
    if (!element || !element.style) return 0;
    switch (property) {
      case 'opacity':
        return parseFloat(getComputedStyle(element).opacity) || 1;
      case 'left':
        return parseFloat(element.style.left) || 0;
      case 'top':
        return parseFloat(element.style.top) || 0;
      case 'scale':
        return 1;
      default:
        return 0;
    }
  }

  /**
     * Interpolates between two values
     * @private
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} progress - Progress (0-1)
     * @returns {number} Interpolated value
     */
  _interpolateValue(start, end, progress) {
    return start + (end - start) * progress;
  }

  /**
     * Applies animated value to element
     * @private
     * @param {HTMLElement} element - Element
     * @param {string} property - Property name
     * @param {number} value - Value to apply
     */
  _applyValue(element, property, value) {
    if (!element || !element.style) return;
    switch (property) {
      case 'opacity':
        element.style.opacity = value;
        break;
      case 'left':
        element.style.left = `${value}px`;
        break;
      case 'top':
        element.style.top = `${value}px`;
        break;
      case 'scale':
        element.style.transform = `scale(${value})`;
        break;
      default:
        element.style[property] = value;
    }
  }

  /**
     * Cleans up resources
     */
  destroy() {
    this.cancelAll();
  }
}
