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
const DEFAULT_CONFIG = Object.freeze({
    id: 'board',
    position: 'start',
    orientation: 'w',
    mode: 'normal',
    size: 'auto',
    draggable: true,
    hints: true,
    clickable: true,
    movableColors: 'both',
    moveHighlight: true,
    overHighlight: true,
    moveAnimation: 'ease',
    moveTime: 'fast',
    dropOffBoard: 'snapback',
    snapbackTime: 'fast',
    snapbackAnimation: 'ease',
    dropCenterTime: 'veryFast',
    dropCenterAnimation: 'ease',
    fadeTime: 'fast',
    fadeAnimation: 'ease',
    ratio: 0.9,
    piecesPath: '../assets/themes/default',
    animationStyle: 'simultaneous',
    simultaneousAnimationDelay: 0,
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

        // Animation properties
        this.moveAnimation = this._setTransitionFunction(config.moveAnimation);
        this.snapbackAnimation = this._setTransitionFunction(config.snapbackAnimation);
        this.dropCenterAnimation = this._setTransitionFunction(config.dropCenterAnimation);
        this.fadeAnimation = this._setTransitionFunction(config.fadeAnimation);

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
            size: this.size,
            draggable: this.draggable,
            hints: this.hints,
            clickable: this.clickable,
            movableColors: this.movableColors,
            moveHighlight: this.moveHighlight,
            overHighlight: this.overHighlight,
            moveAnimation: this.moveAnimation,
            moveTime: this.moveTime,
            dropOffBoard: this.dropOffBoard,
            snapbackTime: this.snapbackTime,
            snapbackAnimation: this.snapbackAnimation,
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

export default ChessboardConfig;