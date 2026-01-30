/**
 * Utility function to get error severity
 * @param {string} errorCode - Error code
 * @returns {string} Error severity level
 */
export function getErrorSeverity(errorCode: string): string;
/**
 * Utility function to format error message
 * @param {string} messageKey - Message key from ERROR_MESSAGES
 * @param {string} [details] - Additional details
 * @returns {string} Formatted error message
 */
export function formatErrorMessage(messageKey: string, details?: string): string;
/**
 * Utility function to create error context
 * @param {string} operation - Operation that failed
 * @param {Object} [data] - Additional context data
 * @returns {Object} Error context object
 */
export function createErrorContext(operation: string, data?: Object): Object;
/**
 * Error messages and error handling utilities
 * @module errors/messages
 * @since 2.0.0
 */
/**
 * Error codes for categorizing different types of errors
 * @type {Object.<string, string>}
 * @readonly
 */
export const ERROR_CODES: {
    [x: string]: string;
};
/**
 * Standardized error messages for the chessboard application
 * @type {Object.<string, string>}
 * @readonly
 */
export const ERROR_MESSAGES: {
    [x: string]: string;
};
/**
 * Error severity levels
 * @type {Object.<string, string>}
 * @readonly
 */
export const ERROR_SEVERITY: {
    [x: string]: string;
};
/**
 * Maps error codes to their severity levels
 * @type {Object.<string, string>}
 * @readonly
 */
export const ERROR_SEVERITY_MAP: {
    [x: string]: string;
};
//# sourceMappingURL=messages.d.ts.map