/**
 * Standard chess positions and FEN constants
 * @module constants/positions
 * @since 2.0.0
 */

/**
 * Standard chess positions used throughout the application
 * @type {Object.<string, string>}
 * @readonly
 */
export const STANDARD_POSITIONS = {
  start: 'start',
  default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  empty: '8/8/8/8/8/8/8/8 w - - 0 1',
};

/**
 * Default starting position FEN string
 * @type {string}
 * @readonly
 */
export const DEFAULT_STARTING_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * Chess piece types
 * @type {string[]}
 * @readonly
 */
export const PIECE_TYPES = ['p', 'r', 'n', 'b', 'q', 'k'];

/**
 * Chess piece colors
 * @type {string[]}
 * @readonly
 */
export const PIECE_COLORS = ['w', 'b'];

/**
 * Valid promotion pieces
 * @type {string[]}
 * @readonly
 */
export const PROMOTION_PIECES = ['q', 'r', 'b', 'n'];

/**
 * Board coordinates letters
 * @type {string}
 * @readonly
 */
export const BOARD_LETTERS = 'abcdefgh';

/**
 * Board size constants
 * @type {Object}
 * @readonly
 */
export const BOARD_SIZE = {
  ROWS: 8,
  COLS: 8,
  TOTAL_SQUARES: 64,
};
