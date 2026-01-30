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
    constructor(config: ChessboardConfig);
    config: ChessboardConfig;
    activeAnimations: Map<any, any>;
    animationId: number;
    /**
     * Creates a timing function for animations
     * @param {string} [type='ease'] - Animation type
     * @returns {Function} Timing function
     */
    createTimingFunction(type?: string): Function;
    /**
     * Animates an element with given properties
     * @param {HTMLElement} element - Element to animate
     * @param {Object} properties - Properties to animate
     * @param {number} duration - Animation duration in milliseconds
     * @param {string} [easing='ease'] - Easing function
     * @param {Function} [callback] - Callback when animation completes
     * @returns {number} Animation ID
     */
    animate(element: HTMLElement, properties: Object, duration: number, easing?: string, callback?: Function): number;
    /**
     * Cancels an animation
     * @param {number} animationId - Animation ID to cancel
     */
    cancel(animationId: number): void;
    /**
     * Cancels all animations
     */
    cancelAll(): void;
    /**
     * Gets initial value for a property
     * @private
     * @param {HTMLElement} element - Element
     * @param {string} property - Property name
     * @returns {number} Initial value
     */
    private _getInitialValue;
    /**
     * Interpolates between two values
     * @private
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} progress - Progress (0-1)
     * @returns {number} Interpolated value
     */
    private _interpolateValue;
    /**
     * Applies animated value to element
     * @private
     * @param {HTMLElement} element - Element
     * @param {string} property - Property name
     * @param {number} value - Value to apply
     */
    private _applyValue;
    /**
     * Cleans up resources
     */
    destroy(): void;
}
//# sourceMappingURL=AnimationService.d.ts.map