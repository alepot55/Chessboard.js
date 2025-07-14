/**
 * Animation service for handling piece animations and transitions
 * @module AnimationService
 */

import { Z_INDEX } from '../core/constants.js';

/**
 * Service for managing animations and transitions
 * @class AnimationService
 */
export class AnimationService {
    /**
     * Creates a new AnimationService
     * @param {object} config - Configuration object
     */
    constructor(config) {
        this.config = config;
        this.activeAnimations = new Set();
    }

    /**
     * Animates a piece movement
     * @param {object} piece - The piece to animate
     * @param {object} targetSquare - Target square
     * @param {number} duration - Animation duration
     * @param {Function} callback - Callback function
     * @param {Function} timingFunction - Timing function
     * @returns {Promise<void>}
     */
    async animatePieceMovement(piece, targetSquare, duration, callback, timingFunction) {
        if (!piece) {
            console.warn('AnimationService: piece is null, skipping animation');
            if (callback) callback();
            return;
        }

        const animationId = this._generateAnimationId();
        this.activeAnimations.add(animationId);

        try {
            await piece.translate(
                targetSquare,
                duration,
                timingFunction,
                this.config.moveAnimation,
                () => {
                    this.activeAnimations.delete(animationId);
                    if (callback) callback();
                }
            );
        } catch (error) {
            console.error('Animation error:', error);
            this.activeAnimations.delete(animationId);
            if (callback) callback();
        }
    }

    /**
     * Animates piece fade in
     * @param {object} piece - The piece to fade in
     * @param {Function} timingFunction - Timing function
     * @returns {Promise<void>}
     */
    async animateFadeIn(piece, timingFunction) {
        if (!piece) return;

        return piece.fadeIn(
            this.config.fadeTime,
            this.config.fadeAnimation,
            timingFunction
        );
    }

    /**
     * Animates piece fade out
     * @param {object} piece - The piece to fade out
     * @param {Function} timingFunction - Timing function
     * @returns {Promise<void>}
     */
    async animateFadeOut(piece, timingFunction) {
        if (!piece) return;

        return piece.fadeOut(
            this.config.fadeTime,
            this.config.fadeAnimation,
            timingFunction
        );
    }

    /**
     * Animates piece snapback
     * @param {object} piece - The piece to snapback
     * @param {object} square - Original square
     * @param {Function} timingFunction - Timing function
     * @param {boolean} animate - Whether to animate
     * @returns {Promise<void>}
     */
    async animateSnapback(piece, square, timingFunction, animate = true) {
        if (!square || !square.piece) {
            return;
        }

        const duration = animate ? this.config.snapbackTime : 0;
        
        return piece.translate(
            square,
            duration,
            timingFunction,
            animate
        );
    }

    /**
     * Sets up drag visual effects
     * @param {HTMLElement} element - Element to set up
     */
    setupDragVisuals(element) {
        element.style.position = 'absolute';
        element.style.zIndex = Z_INDEX.DRAGGING;
        element.classList.add('dragging');
    }

    /**
     * Resets drag visual effects
     * @param {HTMLElement} element - Element to reset
     */
    resetDragVisuals(element) {
        element.style.position = '';
        element.style.left = '';
        element.style.top = '';
        element.style.zIndex = Z_INDEX.PIECE;
        element.style.pointerEvents = '';
        element.classList.remove('dragging');
        element.style.willChange = 'auto';
    }

    /**
     * Gets transition timing function
     * @param {number} elapsed - Elapsed time
     * @param {number} duration - Total duration
     * @param {string} type - Timing function type
     * @returns {number} Calculated value
     */
    getTimingFunction(elapsed, duration, type = 'ease') {
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
    }

    /**
     * Checks if animations are currently running
     * @returns {boolean} True if animations are active
     */
    hasActiveAnimations() {
        return this.activeAnimations.size > 0;
    }

    /**
     * Cancels all active animations
     */
    cancelAllAnimations() {
        this.activeAnimations.clear();
    }

    /**
     * Generates a unique animation ID
     * @private
     * @returns {string} Unique ID
     */
    _generateAnimationId() {
        return `anim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
