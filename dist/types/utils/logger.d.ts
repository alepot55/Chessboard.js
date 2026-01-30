/**
 * Creates a logger with specific configuration
 * @param {Object} config - Logger configuration
 * @param {string} name - Logger name
 * @returns {Logger} Logger instance
 */
export function createLogger(config: Object, name: string): Logger;
/**
 * Structured logger class with configurable output and filtering
 * @class
 */
export class Logger {
    /**
     * Creates a new Logger instance
     * @param {Object} [config] - Logger configuration
     * @param {string} [name] - Logger name/namespace
     */
    constructor(config?: Object, name?: string);
    config: {
        constructor: Function;
        toString(): string;
        toLocaleString(): string;
        valueOf(): Object;
        hasOwnProperty(v: PropertyKey): boolean;
        isPrototypeOf(v: Object): boolean;
        propertyIsEnumerable(v: PropertyKey): boolean;
    };
    name: string;
    logs: any[];
    startTime: number;
    debug: Function;
    info: Function;
    warn: Function;
    error: Function;
    performances: Map<any, any>;
    /**
     * Creates a log method for a specific level
     * @private
     * @param {string} level - Log level
     * @returns {Function} Log method
     */
    private _createLogMethod;
    /**
     * Core logging method
     * @private
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} data - Additional data
     * @param {Error} error - Error object
     */
    private _log;
    /**
     * Creates a structured log entry
     * @private
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} data - Additional data
     * @param {Error} error - Error object
     * @returns {Object} Log entry
     */
    private _createLogEntry;
    /**
     * Stores log entry in memory
     * @private
     * @param {Object} entry - Log entry
     */
    private _storeLogEntry;
    /**
     * Outputs log entry to console
     * @private
     * @param {Object} entry - Log entry
     */
    private _outputToConsole;
    /**
     * Gets appropriate console method for log level
     * @private
     * @param {string} level - Log level
     * @returns {Function} Console method
     */
    private _getConsoleMethod;
    /**
     * Initializes localStorage for log storage
     * @private
     */
    private _initStorage;
    /**
     * Stores log entry in localStorage
     * @private
     * @param {Object} entry - Log entry
     */
    private _storeInStorage;
    /**
     * Starts performance measurement
     * @param {string} name - Performance measurement name
     */
    startPerformance(name: string): void;
    /**
     * Ends performance measurement
     * @param {string} name - Performance measurement name
     * @returns {number} Duration in milliseconds
     */
    endPerformance(name: string): number;
    /**
     * Gets performance statistics
     * @param {string} name - Performance measurement name
     * @returns {Object} Performance statistics
     */
    getPerformanceStats(name: string): Object;
    /**
     * Creates a child logger with a specific namespace
     * @param {string} namespace - Child logger namespace
     * @returns {Logger} Child logger instance
     */
    child(namespace: string): Logger;
    /**
     * Sets log level
     * @param {string} level - Log level
     */
    setLevel(level: string): void;
    /**
     * Gets current log level
     * @returns {string} Current log level
     */
    getLevel(): string;
    /**
     * Gets all stored logs
     * @returns {Array} Array of log entries
     */
    getLogs(): any[];
    /**
     * Clears all stored logs
     */
    clearLogs(): void;
    /**
     * Exports logs as JSON
     * @returns {string} JSON string of logs
     */
    exportLogs(): string;
    /**
     * Cleans up resources
     */
    destroy(): void;
}
/**
 * Default logger instance
 * @type {Logger}
 */
export const logger: Logger;
/**
 * Structured logging system for Chessboard.js
 * @module utils/logger
 * @since 2.0.0
 */
/**
 * Log levels in order of severity
 * @constant
 * @type {Object}
 */
export const LOG_LEVELS: Object;
//# sourceMappingURL=logger.d.ts.map