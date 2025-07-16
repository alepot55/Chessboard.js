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
const LOG_LEVELS = Object.freeze({
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
});

/**
 * Default logger configuration
 * @constant
 * @type {Object}
 */
const DEFAULT_CONFIG = Object.freeze({
    level: LOG_LEVELS.INFO,
    enableColors: true,
    enableTimestamp: true,
    enableStackTrace: true,
    maxLogSize: 1000,
    enableConsole: true,
    enableStorage: false,
    storageKey: 'chessboard-logs'
});

/**
 * ANSI color codes for console output
 * @constant
 * @type {Object}
 */
const COLORS = Object.freeze({
    DEBUG: '\x1b[36m',    // Cyan
    INFO: '\x1b[32m',     // Green
    WARN: '\x1b[33m',     // Yellow
    ERROR: '\x1b[31m',    // Red
    RESET: '\x1b[0m'      // Reset
});

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
    constructor(config = {}, name = 'Chessboard') {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.name = name;
        this.logs = [];
        this.startTime = Date.now();
        
        // Create bound methods for better performance
        this.debug = this._createLogMethod('DEBUG');
        this.info = this._createLogMethod('INFO');
        this.warn = this._createLogMethod('WARN');
        this.error = this._createLogMethod('ERROR');
        
        // Performance tracking
        this.performances = new Map();
        
        // Initialize storage if enabled
        if (this.config.enableStorage) {
            this._initStorage();
        }
    }

    /**
     * Creates a log method for a specific level
     * @private
     * @param {string} level - Log level
     * @returns {Function} Log method
     */
    _createLogMethod(level) {
        return (message, data = {}, error = null) => {
            this._log(level, message, data, error);
        };
    }

    /**
     * Core logging method
     * @private
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} data - Additional data
     * @param {Error} error - Error object
     */
    _log(level, message, data, error) {
        const levelNumber = LOG_LEVELS[level];
        
        // Filter by level
        if (levelNumber < this.config.level) {
            return;
        }
        
        // Create log entry
        const entry = this._createLogEntry(level, message, data, error);
        
        // Store log entry
        this._storeLogEntry(entry);
        
        // Output to console
        if (this.config.enableConsole) {
            this._outputToConsole(entry);
        }
        
        // Store in localStorage if enabled
        if (this.config.enableStorage) {
            this._storeInStorage(entry);
        }
    }

    /**
     * Creates a structured log entry
     * @private
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} data - Additional data
     * @param {Error} error - Error object
     * @returns {Object} Log entry
     */
    _createLogEntry(level, message, data, error) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            logger: this.name,
            message,
            data: { ...data },
            runtime: Date.now() - this.startTime
        };
        
        // Add error details if provided
        if (error) {
            entry.error = {
                name: error.name,
                message: error.message,
                stack: this.config.enableStackTrace ? error.stack : null
            };
        }
        
        // Add performance context if available
        if (typeof performance !== 'undefined' && performance.memory) {
            entry.memory = {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
            };
        }
        
        return entry;
    }

    /**
     * Stores log entry in memory
     * @private
     * @param {Object} entry - Log entry
     */
    _storeLogEntry(entry) {
        this.logs.push(entry);
        
        // Limit log size
        if (this.logs.length > this.config.maxLogSize) {
            this.logs.shift();
        }
    }

    /**
     * Outputs log entry to console
     * @private
     * @param {Object} entry - Log entry
     */
    _outputToConsole(entry) {
        const color = this.config.enableColors ? COLORS[entry.level] : '';
        const reset = this.config.enableColors ? COLORS.RESET : '';
        const timestamp = this.config.enableTimestamp ? 
            `[${new Date(entry.timestamp).toLocaleTimeString()}] ` : '';
        
        const prefix = `${color}${timestamp}[${entry.logger}:${entry.level}]${reset}`;
        const message = `${prefix} ${entry.message}`;
        
        // Choose console method based on level
        const consoleMethod = this._getConsoleMethod(entry.level);
        
        if (Object.keys(entry.data).length > 0 || entry.error) {
            consoleMethod(message, {
                data: entry.data,
                error: entry.error,
                runtime: `${entry.runtime}ms`
            });
        } else {
            consoleMethod(message);
        }
    }

    /**
     * Gets appropriate console method for log level
     * @private
     * @param {string} level - Log level
     * @returns {Function} Console method
     */
    _getConsoleMethod(level) {
        switch (level) {
            case 'DEBUG':
                return console.debug || console.log;
            case 'INFO':
                return console.info || console.log;
            case 'WARN':
                return console.warn || console.log;
            case 'ERROR':
                return console.error || console.log;
            default:
                return console.log;
        }
    }

    /**
     * Initializes localStorage for log storage
     * @private
     */
    _initStorage() {
        if (typeof localStorage === 'undefined') {
            this.config.enableStorage = false;
            return;
        }
        
        try {
            // Test localStorage availability
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (error) {
            this.config.enableStorage = false;
            console.warn('localStorage not available, disabling log storage');
        }
    }

    /**
     * Stores log entry in localStorage
     * @private
     * @param {Object} entry - Log entry
     */
    _storeInStorage(entry) {
        if (!this.config.enableStorage) {
            return;
        }
        
        try {
            const stored = JSON.parse(localStorage.getItem(this.config.storageKey) || '[]');
            stored.push(entry);
            
            // Limit stored logs
            if (stored.length > this.config.maxLogSize) {
                stored.shift();
            }
            
            localStorage.setItem(this.config.storageKey, JSON.stringify(stored));
        } catch (error) {
            console.warn('Failed to store log entry:', error);
        }
    }

    /**
     * Starts performance measurement
     * @param {string} name - Performance measurement name
     */
    startPerformance(name) {
        this.performances.set(name, {
            start: performance.now(),
            measurements: []
        });
        
        this.debug(`Started performance measurement: ${name}`);
    }

    /**
     * Ends performance measurement
     * @param {string} name - Performance measurement name
     * @returns {number} Duration in milliseconds
     */
    endPerformance(name) {
        const perf = this.performances.get(name);
        if (!perf) {
            this.warn(`Performance measurement not found: ${name}`);
            return 0;
        }
        
        const duration = performance.now() - perf.start;
        perf.measurements.push(duration);
        
        this.debug(`Performance measurement completed: ${name}`, {
            duration: `${duration.toFixed(2)}ms`,
            measurements: perf.measurements.length
        });
        
        return duration;
    }

    /**
     * Gets performance statistics
     * @param {string} name - Performance measurement name
     * @returns {Object} Performance statistics
     */
    getPerformanceStats(name) {
        const perf = this.performances.get(name);
        if (!perf || perf.measurements.length === 0) {
            return null;
        }
        
        const measurements = perf.measurements;
        const total = measurements.reduce((sum, m) => sum + m, 0);
        const avg = total / measurements.length;
        const min = Math.min(...measurements);
        const max = Math.max(...measurements);
        
        return {
            name,
            count: measurements.length,
            total: total.toFixed(2),
            average: avg.toFixed(2),
            min: min.toFixed(2),
            max: max.toFixed(2)
        };
    }

    /**
     * Creates a child logger with a specific namespace
     * @param {string} namespace - Child logger namespace
     * @returns {Logger} Child logger instance
     */
    child(namespace) {
        return new Logger(this.config, `${this.name}:${namespace}`);
    }

    /**
     * Sets log level
     * @param {string} level - Log level
     */
    setLevel(level) {
        if (LOG_LEVELS[level] !== undefined) {
            this.config.level = LOG_LEVELS[level];
        }
    }

    /**
     * Gets current log level
     * @returns {string} Current log level
     */
    getLevel() {
        return Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === this.config.level);
    }

    /**
     * Gets all stored logs
     * @returns {Array} Array of log entries
     */
    getLogs() {
        return [...this.logs];
    }

    /**
     * Clears all stored logs
     */
    clearLogs() {
        this.logs = [];
        
        if (this.config.enableStorage) {
            try {
                localStorage.removeItem(this.config.storageKey);
            } catch (error) {
                console.warn('Failed to clear stored logs:', error);
            }
        }
    }

    /**
     * Exports logs as JSON
     * @returns {string} JSON string of logs
     */
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }

    /**
     * Cleans up resources
     */
    destroy() {
        this.clearLogs();
        this.performances.clear();
    }
}

/**
 * Default logger instance
 * @type {Logger}
 */
export const logger = new Logger();

/**
 * Creates a logger with specific configuration
 * @param {Object} config - Logger configuration
 * @param {string} name - Logger name
 * @returns {Logger} Logger instance
 */
export function createLogger(config, name) {
    return new Logger(config, name);
}

/**
 * Log levels enumeration
 * @type {Object}
 */
export { LOG_LEVELS };
