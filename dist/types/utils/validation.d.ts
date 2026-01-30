import { isValidSquare as validateSquare } from './coordinates.js';
/**
 * Validate piece notation with caching
 * @param {string} piece - Piece notation (e.g., 'wP', 'bK')
 * @returns {boolean} True if piece notation is valid
 */
export function isValidPiece(piece: string): boolean;
/**
 * Validate position object with comprehensive checks
 * @param {Object} position - Position object with square-piece mappings
 * @returns {boolean} True if position is valid
 */
export function isValidPosition(position: Object): boolean;
/**
 * Validate FEN string format with comprehensive checks
 * @param {string} fen - FEN string
 * @returns {Object} Validation result with success and error properties
 */
export function validateFenFormat(fen: string): Object;
/**
 * Validate move notation in various formats
 * @param {string} move - Move string (e.g., 'e2e4', 'Nf3', 'O-O')
 * @returns {Object} Validation result
 */
export function validateMove(move: string): Object;
/**
 * Validate configuration object with detailed error reporting
 * @param {Object} config - Configuration object
 * @returns {Object} Validation result with success and errors array
 */
export function validateConfig(config: Object): Object;
/**
 * Batch validates multiple items
 * @param {Array} items - Array of validation items
 * @returns {Array} Array of validation results
 */
export function batchValidate(items: any[]): any[];
/**
 * Clears validation cache
 */
export function clearValidationCache(): void;
/**
 * Gets validation cache statistics
 * @returns {Object} Cache statistics
 */
export function getValidationCacheStats(): Object;
export { validateSquare as isValidSquare };
//# sourceMappingURL=validation.d.ts.map