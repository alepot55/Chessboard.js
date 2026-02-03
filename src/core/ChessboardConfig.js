/**
 * Configuration management for Chessboard.js
 * @module core/ChessboardConfig
 * @since 2.0.0
 */

import { ValidationService } from '../services/ValidationService.js';
import { ConfigurationError } from '../errors/ChessboardError.js';

/**
 * Animation timing constants
 * @constant
 * @type {Object}
 */
const ANIMATION_TIMES = Object.freeze({
    fast: 200,
    slow: 600,
    normal: 400,
    verySlow: 1000,
    veryFast: 100
});

/**
 * Boolean value mappings
 * @constant
 * @type {Object}
 */
const BOOLEAN_VALUES = Object.freeze({
    true: true,
    false: false,
    none: false,
    1: true,
    0: false
});

/**
 * CSS transition functions
 * @constant
 * @type {Object}
 */
const TRANSITION_FUNCTIONS = Object.freeze({
    ease: 'ease',
    linear: 'linear',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    none: null
});

/**
 * Default configuration values
 * @constant
 * @type {Object}
 */
/**
 * Flip mode options
 * @constant
 * @type {Object}
 */
const FLIP_MODES = Object.freeze({
    visual: 'visual',      // CSS flexbox visual flip (instant, no piece animation)
    animate: 'animate',    // Animate pieces to mirrored positions (smooth animation)
    none: 'none'           // No visual change, only internal orientation
});

/**
 * Movement style options - how pieces travel from source to destination
 * @constant
 * @type {Object}
 */
const MOVE_STYLES = Object.freeze({
    slide: 'slide',        // Linear movement (default) - piece slides in straight line
    arc: 'arc',            // Arc trajectory - piece lifts up then comes down
    hop: 'hop',            // Parabolic jump - like a knight hopping
    teleport: 'teleport',  // Instant - no animation, piece appears at destination
    fade: 'fade'           // Crossfade - fades out at source, fades in at destination
});

/**
 * Capture animation options - what happens to captured pieces
 * @constant
 * @type {Object}
 */
const CAPTURE_STYLES = Object.freeze({
    fade: 'fade',          // Fade out (default)
    shrink: 'shrink',      // Shrink then fade
    instant: 'instant',    // Disappears immediately
    explode: 'explode'     // Scale up and fade (dramatic effect)
});

/**
 * Landing effect options - what happens when piece reaches destination
 * @constant
 * @type {Object}
 */
const LANDING_EFFECTS = Object.freeze({
    none: 'none',          // No effect (default)
    bounce: 'bounce',      // Slight bounce on landing
    pulse: 'pulse',        // Quick scale pulse
    settle: 'settle'       // Subtle settling animation
});

/**
 * Drag style options - how pieces behave during drag
 * @constant
 * @type {Object}
 */
const DRAG_STYLES = Object.freeze({
    smooth: 'smooth',      // Piece follows cursor smoothly (default)
    snap: 'snap',          // Piece snaps to cursor position
    elastic: 'elastic'     // Slight elastic lag behind cursor
});

const DEFAULT_CONFIG = Object.freeze({
    id: 'board',
    position: 'start',
    orientation: 'w',
    mode: 'normal',
    flipMode: 'visual',    // 'visual', 'animate', or 'none'
    size: 'auto',
    draggable: true,
    hints: true,
    clickable: true,
    movableColors: 'both',
    moveHighlight: true,
    overHighlight: true,

    // Movement configuration
    moveStyle: 'slide',          // 'slide', 'arc', 'hop', 'teleport', 'fade'
    moveEasing: 'ease',          // CSS easing function
    moveTime: 'fast',            // Duration: 'instant', 'veryFast', 'fast', 'normal', 'slow', 'verySlow' or ms
    moveArcHeight: 0.3,          // Arc height as ratio of distance (for 'arc' and 'hop' styles)

    // Capture configuration
    captureStyle: 'fade',        // 'fade', 'shrink', 'instant', 'explode'
    captureTime: 'fast',         // Duration for capture animation

    // Landing effect configuration
    landingEffect: 'none',       // 'none', 'bounce', 'pulse', 'settle'
    landingDuration: 150,        // Duration for landing effect in ms

    // Drag configuration
    dragStyle: 'smooth',         // 'smooth', 'snap', 'elastic'
    dragScale: 1.05,             // Scale factor while dragging (1.0 = no scale)
    dragOpacity: 0.9,            // Opacity while dragging

    // Snapback configuration
    snapbackTime: 'fast',
    snapbackEasing: 'ease',

    // Other timing
    dropOffBoard: 'snapback',
    dropCenterTime: 'veryFast',
    dropCenterAnimation: 'ease',
    fadeTime: 'fast',
    fadeAnimation: 'ease',

    // Legacy compatibility
    moveAnimation: 'ease',
    snapbackAnimation: 'ease',

    ratio: 0.9,
    piecesPath: '../assets/themes/default',
    animationStyle: 'simultaneous',
    simultaneousAnimationDelay: 100,
    onMove: () => true,
    onMoveEnd: () => true,
    onChange: () => true,
    onDragStart: () => true,
    onDragMove: () => true,
    onDrop: () => true,
    onSnapbackEnd: () => true,
    whiteSquare: '#f0d9b5',
    blackSquare: '#b58863',
    highlight: 'yellow',
    selectedSquareWhite: '#ababaa',
    selectedSquareBlack: '#ababaa',
    movedSquareWhite: '#f1f1a0',
    movedSquareBlack: '#e9e981',
    choiceSquare: 'white',
    coverSquare: 'black',
    hintColor: '#ababaa'
});

/**
 * Configuration management class for Chessboard.js
 * Handles validation, normalization, and CSS property management
 * @class
 */
class ChessboardConfig {
    /**
     * Creates a new ChessboardConfig instance
     * @param {Object} settings - User-provided configuration
     * @throws {ConfigurationError} If configuration is invalid
     */
    constructor(settings = {}) {
        // Initialize validation service
        this._validationService = new ValidationService();

        // Validate input
        this._validateInput(settings);

        // Merge with defaults
        const config = this._mergeWithDefaults(settings);

        // Process and validate configuration
        this._processConfiguration(config);

        // Set CSS properties
        this._setCSSProperties(config);

        // Configure mode-specific settings
        this._configureModeSettings();
    }

    /**
     * Validates input configuration
     * @private
     * @param {Object} settings - Input settings
     * @throws {ConfigurationError} If input is invalid
     */
    _validateInput(settings) {
        if (settings !== null && typeof settings !== 'object') {
            throw new ConfigurationError('Settings must be an object', 'settings', settings);
        }

        // Validate using validation service
        try {
            this._validationService.validateConfig(settings);
        } catch (error) {
            throw new ConfigurationError(error.message, error.field, error.value);
        }
    }

    /**
     * Merges user settings with defaults
     * @private
     * @param {Object} settings - User settings
     * @returns {Object} Merged configuration
     */
    _mergeWithDefaults(settings) {
        return Object.assign({}, DEFAULT_CONFIG, settings);
    }

    /**
     * Processes and validates configuration values
     * @private
     * @param {Object} config - Configuration object
     */
    _processConfiguration(config) {
        // Basic properties
        this.id_div = config.id;
        this.position = config.position;
        this.orientation = config.orientation;
        this.mode = config.mode;
        this.flipMode = this._validateFlipMode(config.flipMode);
        this.dropOffBoard = config.dropOffBoard;
        this.size = config.size;
        this.movableColors = config.movableColors;
        this.piecesPath = config.piecesPath;

        // Event handlers
        this.onMove = this._validateCallback(config.onMove);
        this.onMoveEnd = this._validateCallback(config.onMoveEnd);
        this.onChange = this._validateCallback(config.onChange);
        this.onDragStart = this._validateCallback(config.onDragStart);
        this.onDragMove = this._validateCallback(config.onDragMove);
        this.onDrop = this._validateCallback(config.onDrop);
        this.onSnapbackEnd = this._validateCallback(config.onSnapbackEnd);

        // Animation properties (legacy)
        this.moveAnimation = this._setTransitionFunction(config.moveAnimation);
        this.snapbackAnimation = this._setTransitionFunction(config.snapbackAnimation);
        this.dropCenterAnimation = this._setTransitionFunction(config.dropCenterAnimation);
        this.fadeAnimation = this._setTransitionFunction(config.fadeAnimation);

        // Movement configuration (new system)
        this.moveStyle = this._validateMoveStyle(config.moveStyle);
        this.moveEasing = this._setTransitionFunction(config.moveEasing);
        this.moveArcHeight = this._validateNumber(config.moveArcHeight, 0, 1, 'moveArcHeight');
        this.captureStyle = this._validateCaptureStyle(config.captureStyle);
        this.captureTime = this._setTime(config.captureTime);
        this.landingEffect = this._validateLandingEffect(config.landingEffect);
        this.landingDuration = this._validateNumber(config.landingDuration, 0, 2000, 'landingDuration');
        this.dragStyle = this._validateDragStyle(config.dragStyle);
        this.dragScale = this._validateNumber(config.dragScale, 0.5, 2, 'dragScale');
        this.dragOpacity = this._validateNumber(config.dragOpacity, 0.1, 1, 'dragOpacity');
        this.snapbackEasing = this._setTransitionFunction(config.snapbackEasing);

        // Boolean properties
        this.hints = this._setBoolean(config.hints);
        this.clickable = this._setBoolean(config.clickable);
        this.draggable = this._setBoolean(config.draggable);
        this.moveHighlight = this._setBoolean(config.moveHighlight);
        this.overHighlight = this._setBoolean(config.overHighlight);

        // Timing properties
        this.moveTime = this._setTime(config.moveTime);
        this.snapbackTime = this._setTime(config.snapbackTime);
        this.dropCenterTime = this._setTime(config.dropCenterTime);
        this.fadeTime = this._setTime(config.fadeTime);

        // Animation style properties
        this.animationStyle = this._validateAnimationStyle(config.animationStyle);
        this.simultaneousAnimationDelay = this._validateDelay(config.simultaneousAnimationDelay);
    }

    /**
     * Sets CSS custom properties
     * @private
     * @param {Object} config - Configuration object
     */
    _setCSSProperties(config) {
        const cssProperties = {
            pieceRatio: config.ratio,
            whiteSquare: config.whiteSquare,
            blackSquare: config.blackSquare,
            highlightSquare: config.highlight,
            selectedSquareWhite: config.selectedSquareWhite,
            selectedSquareBlack: config.selectedSquareBlack,
            movedSquareWhite: config.movedSquareWhite,
            movedSquareBlack: config.movedSquareBlack,
            choiceSquare: config.choiceSquare,
            coverSquare: config.coverSquare,
            hintColor: config.hintColor
        };

        Object.entries(cssProperties).forEach(([property, value]) => {
            this._setCSSProperty(property, value);
        });
    }

    /**
     * Configures mode-specific settings
     * @private
     */
    _configureModeSettings() {
        switch (this.mode) {
            case 'creative':
                this.onlyLegalMoves = false;
                this.hints = false;
                break;
            case 'normal':
                this.onlyLegalMoves = true;
                break;
            default:
                this.onlyLegalMoves = true;
        }
    }

    /**
     * Validates a callback function
     * @private
     * @param {Function} callback - Callback to validate
     * @returns {Function} Validated callback
     * @throws {ConfigurationError} If callback is invalid
     */
    _validateCallback(callback) {
        if (!this._validationService.isValidCallback(callback)) {
            throw new ConfigurationError('Callback must be a function', 'callback', callback);
        }
        return callback;
    }

    /**
     * Validates animation style
     * @private
     * @param {string} style - Animation style
     * @returns {string} Validated style
     * @throws {ConfigurationError} If style is invalid
     */
    _validateAnimationStyle(style) {
        if (!this._validationService.isValidAnimationStyle(style)) {
            throw new ConfigurationError('Invalid animation style', 'animationStyle', style);
        }
        return style;
    }

    /**
     * Validates animation delay
     * @private
     * @param {number} delay - Animation delay
     * @returns {number} Validated delay
     * @throws {ConfigurationError} If delay is invalid
     */
    _validateDelay(delay) {
        if (typeof delay !== 'number' || delay < 0 || delay > 5000) {
            throw new ConfigurationError('Invalid animation delay', 'simultaneousAnimationDelay', delay);
        }
        return delay;
    }

    /**
     * Validates flip mode
     * @private
     * @param {string} mode - Flip mode
     * @returns {string} Validated mode
     * @throws {ConfigurationError} If mode is invalid
     */
    _validateFlipMode(mode) {
        if (!mode || !FLIP_MODES[mode]) {
            throw new ConfigurationError(
                `Invalid flip mode: ${mode}. Valid options: ${Object.keys(FLIP_MODES).join(', ')}`,
                'flipMode',
                mode
            );
        }
        return mode;
    }

    /**
     * Validates move style
     * @private
     * @param {string} style - Move style
     * @returns {string} Validated style
     */
    _validateMoveStyle(style) {
        if (!style || !MOVE_STYLES[style]) {
            console.warn(`Invalid move style: ${style}. Using 'slide'. Valid: ${Object.keys(MOVE_STYLES).join(', ')}`);
            return 'slide';
        }
        return style;
    }

    /**
     * Validates capture style
     * @private
     * @param {string} style - Capture style
     * @returns {string} Validated style
     */
    _validateCaptureStyle(style) {
        if (!style || !CAPTURE_STYLES[style]) {
            console.warn(`Invalid capture style: ${style}. Using 'fade'. Valid: ${Object.keys(CAPTURE_STYLES).join(', ')}`);
            return 'fade';
        }
        return style;
    }

    /**
     * Validates landing effect
     * @private
     * @param {string} effect - Landing effect
     * @returns {string} Validated effect
     */
    _validateLandingEffect(effect) {
        if (!effect || !LANDING_EFFECTS[effect]) {
            console.warn(`Invalid landing effect: ${effect}. Using 'none'. Valid: ${Object.keys(LANDING_EFFECTS).join(', ')}`);
            return 'none';
        }
        return effect;
    }

    /**
     * Validates drag style
     * @private
     * @param {string} style - Drag style
     * @returns {string} Validated style
     */
    _validateDragStyle(style) {
        if (!style || !DRAG_STYLES[style]) {
            console.warn(`Invalid drag style: ${style}. Using 'smooth'. Valid: ${Object.keys(DRAG_STYLES).join(', ')}`);
            return 'smooth';
        }
        return style;
    }

    /**
     * Validates a number within a range
     * @private
     * @param {number} value - Value to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {string} name - Property name for error message
     * @returns {number} Validated value
     */
    _validateNumber(value, min, max, name) {
        if (typeof value !== 'number' || value < min || value > max) {
            console.warn(`Invalid ${name}: ${value}. Must be between ${min} and ${max}.`);
            return (min + max) / 2; // Return middle value as default
        }
        return value;
    }

    /**
     * Sets a CSS custom property
     * @private
     * @param {string} property - Property name
     * @param {string} value - Property value
     */
    _setCSSProperty(property, value) {
        try {
            if (typeof document !== 'undefined' && document.documentElement) {
                document.documentElement.style.setProperty(`--${property}`, value);
            }
        } catch (error) {
            console.warn(`Failed to set CSS property ${property}:`, error.message);
        }
    }

    /**
     * Sets orientation with validation
     * @param {string} orientation - Orientation value
     * @returns {ChessboardConfig} This instance for chaining
     * @throws {ConfigurationError} If orientation is invalid
     */
    setOrientation(orientation) {
        const validatedOrientation = this._validationService.validateOrientation(orientation);
        this.orientation = validatedOrientation;
        return this;
    }

    /**
     * Validates and sets time value
     * @private
     * @param {string|number} value - Time value
     * @returns {number} Validated time value
     * @throws {ConfigurationError} If time value is invalid
     */
    _setTime(value) {
        if (typeof value === 'number') {
            if (!this._validationService.isValidTime(value)) {
                throw new ConfigurationError('Invalid time value', 'time', value);
            }
            return value;
        }

        if (typeof value === 'string' && value in ANIMATION_TIMES) {
            return ANIMATION_TIMES[value];
        }

        throw new ConfigurationError('Invalid time value', 'time', value);
    }

    /**
     * Validates and sets boolean value
     * @private
     * @param {*} value - Boolean value
     * @returns {boolean} Validated boolean value
     * @throws {ConfigurationError} If boolean value is invalid
     */
    _setBoolean(value) {
        if (typeof value === 'boolean') {
            return value;
        }

        if (value in BOOLEAN_VALUES) {
            return BOOLEAN_VALUES[value];
        }

        throw new ConfigurationError('Invalid boolean value', 'boolean', value);
    }

    /**
     * Validates and sets transition function
     * @private
     * @param {string|boolean|null} value - Transition function value
     * @returns {string|null} Validated transition function
     * @throws {ConfigurationError} If transition function is invalid
     */
    _setTransitionFunction(value) {
        // Handle boolean values - true means use default 'ease', false/null means no animation
        if (typeof value === 'boolean') {
            return value ? TRANSITION_FUNCTIONS.ease : null;
        }

        // Handle string values
        if (typeof value === 'string' && value in TRANSITION_FUNCTIONS) {
            return TRANSITION_FUNCTIONS[value];
        }

        // Handle null/undefined
        if (value === null || value === undefined) {
            return null;
        }

        throw new ConfigurationError('Invalid transition function', 'transitionFunction', value);
    }

    /**
     * Gets the current configuration as a plain object
     * @returns {Object} Configuration object
     */
    toObject() {
        return {
            id_div: this.id_div,
            position: this.position,
            orientation: this.orientation,
            mode: this.mode,
            flipMode: this.flipMode,
            size: this.size,
            draggable: this.draggable,
            hints: this.hints,
            clickable: this.clickable,
            movableColors: this.movableColors,
            moveHighlight: this.moveHighlight,
            overHighlight: this.overHighlight,
            // Movement configuration
            moveStyle: this.moveStyle,
            moveEasing: this.moveEasing,
            moveTime: this.moveTime,
            moveArcHeight: this.moveArcHeight,
            captureStyle: this.captureStyle,
            captureTime: this.captureTime,
            landingEffect: this.landingEffect,
            landingDuration: this.landingDuration,
            dragStyle: this.dragStyle,
            dragScale: this.dragScale,
            dragOpacity: this.dragOpacity,
            snapbackTime: this.snapbackTime,
            snapbackEasing: this.snapbackEasing,
            // Legacy
            moveAnimation: this.moveAnimation,
            snapbackAnimation: this.snapbackAnimation,
            dropOffBoard: this.dropOffBoard,
            dropCenterTime: this.dropCenterTime,
            dropCenterAnimation: this.dropCenterAnimation,
            fadeTime: this.fadeTime,
            fadeAnimation: this.fadeAnimation,
            piecesPath: this.piecesPath,
            animationStyle: this.animationStyle,
            simultaneousAnimationDelay: this.simultaneousAnimationDelay,
            onlyLegalMoves: this.onlyLegalMoves
        };
    }

    /**
     * Updates configuration with new values
     * @param {Object} updates - Configuration updates
     * @returns {ChessboardConfig} This instance for chaining
     * @throws {ConfigurationError} If updates are invalid
     */
    update(updates) {
        if (!updates || typeof updates !== 'object') {
            throw new ConfigurationError('Updates must be an object', 'updates', updates);
        }

        // Validate updates
        this._validationService.validateConfig(updates);

        // Apply updates
        const newConfig = Object.assign({}, this.toObject(), updates);

        // Re-process configuration
        this._processConfiguration(newConfig);
        this._setCSSProperties(newConfig);
        this._configureModeSettings();

        return this;
    }

    /**
     * Cleans up resources
     */
    destroy() {
        if (this._validationService) {
            this._validationService.destroy();
            this._validationService = null;
        }
    }
}

export {
    ChessboardConfig,
    FLIP_MODES,
    MOVE_STYLES,
    CAPTURE_STYLES,
    LANDING_EFFECTS,
    DRAG_STYLES,
    ANIMATION_TIMES
};
export default ChessboardConfig;