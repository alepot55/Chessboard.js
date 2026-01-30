import { ValidationService } from '../services/ValidationService.js';
export default ChessboardConfig;
/**
 * Configuration management class for Chessboard.js
 * Handles validation, normalization, and CSS property management
 * @class
 */
export class ChessboardConfig {
    /**
     * Creates a new ChessboardConfig instance
     * @param {Object} settings - User-provided configuration
     * @throws {ConfigurationError} If configuration is invalid
     */
    constructor(settings?: Object);
    _validationService: ValidationService;
    /**
     * Validates input configuration
     * @private
     * @param {Object} settings - Input settings
     * @throws {ConfigurationError} If input is invalid
     */
    private _validateInput;
    /**
     * Merges user settings with defaults
     * @private
     * @param {Object} settings - User settings
     * @returns {Object} Merged configuration
     */
    private _mergeWithDefaults;
    /**
     * Processes and validates configuration values
     * @private
     * @param {Object} config - Configuration object
     */
    private _processConfiguration;
    id_div: any;
    position: any;
    orientation: any;
    mode: any;
    dropOffBoard: any;
    size: any;
    movableColors: any;
    piecesPath: any;
    onMove: Function | undefined;
    onMoveEnd: Function | undefined;
    onChange: Function | undefined;
    onDragStart: Function | undefined;
    onDragMove: Function | undefined;
    onDrop: Function | undefined;
    onSnapbackEnd: Function | undefined;
    moveAnimation: string | null | undefined;
    snapbackAnimation: string | null | undefined;
    dropCenterAnimation: string | null | undefined;
    fadeAnimation: string | null | undefined;
    hints: boolean | undefined;
    clickable: boolean | undefined;
    draggable: boolean | undefined;
    moveHighlight: boolean | undefined;
    overHighlight: boolean | undefined;
    moveTime: number | undefined;
    snapbackTime: number | undefined;
    dropCenterTime: number | undefined;
    fadeTime: number | undefined;
    animationStyle: string | undefined;
    simultaneousAnimationDelay: number | undefined;
    /**
     * Sets CSS custom properties
     * @private
     * @param {Object} config - Configuration object
     */
    private _setCSSProperties;
    /**
     * Configures mode-specific settings
     * @private
     */
    private _configureModeSettings;
    onlyLegalMoves: boolean | undefined;
    /**
     * Validates a callback function
     * @private
     * @param {Function} callback - Callback to validate
     * @returns {Function} Validated callback
     * @throws {ConfigurationError} If callback is invalid
     */
    private _validateCallback;
    /**
     * Validates animation style
     * @private
     * @param {string} style - Animation style
     * @returns {string} Validated style
     * @throws {ConfigurationError} If style is invalid
     */
    private _validateAnimationStyle;
    /**
     * Validates animation delay
     * @private
     * @param {number} delay - Animation delay
     * @returns {number} Validated delay
     * @throws {ConfigurationError} If delay is invalid
     */
    private _validateDelay;
    /**
     * Sets a CSS custom property
     * @private
     * @param {string} property - Property name
     * @param {string} value - Property value
     */
    private _setCSSProperty;
    /**
     * Sets orientation with validation
     * @param {string} orientation - Orientation value
     * @returns {ChessboardConfig} This instance for chaining
     * @throws {ConfigurationError} If orientation is invalid
     */
    setOrientation(orientation: string): ChessboardConfig;
    /**
     * Validates and sets time value
     * @private
     * @param {string|number} value - Time value
     * @returns {number} Validated time value
     * @throws {ConfigurationError} If time value is invalid
     */
    private _setTime;
    /**
     * Validates and sets boolean value
     * @private
     * @param {*} value - Boolean value
     * @returns {boolean} Validated boolean value
     * @throws {ConfigurationError} If boolean value is invalid
     */
    private _setBoolean;
    /**
     * Validates and sets transition function
     * @private
     * @param {string|boolean|null} value - Transition function value
     * @returns {string|null} Validated transition function
     * @throws {ConfigurationError} If transition function is invalid
     */
    private _setTransitionFunction;
    /**
     * Gets the current configuration as a plain object
     * @returns {Object} Configuration object
     */
    toObject(): Object;
    /**
     * Updates configuration with new values
     * @param {Object} updates - Configuration updates
     * @returns {ChessboardConfig} This instance for chaining
     * @throws {ConfigurationError} If updates are invalid
     */
    update(updates: Object): ChessboardConfig;
    /**
     * Cleans up resources
     */
    destroy(): void;
}
//# sourceMappingURL=ChessboardConfig.d.ts.map