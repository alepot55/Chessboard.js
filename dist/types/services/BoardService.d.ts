import { default as Square } from '../components/Square.js';
/**
 * Service responsible for board DOM manipulation and setup
 * @class
 */
export class BoardService {
    /**
     * Creates a new BoardService instance
     * @param {ChessboardConfig} config - Board configuration
     */
    constructor(config: ChessboardConfig);
    config: ChessboardConfig;
    element: HTMLElement | null;
    squares: {};
    /**
     * Builds the board DOM element and attaches it to the configured container
     * @throws {DOMError} When the container element cannot be found
     */
    buildBoard(): void;
    /**
     * Creates all 64 squares and adds them to the board
     * @param {Function} coordConverter - Function to convert row/col to real coordinates
     */
    buildSquares(coordConverter: Function): void;
    /**
     * Removes all squares from the board and cleans up their resources
     * Best practice: always destroy JS objects and DOM nodes, and clear references.
     */
    removeSquares(): void;
    /**
     * Removes all content from the board element
     * Best practice: clear DOM and force element to be re-fetched on next build.
     */
    removeBoard(): void;
    /**
     * Resizes the board to the specified size
     * @param {number|string} value - Size in pixels or 'auto'
     * @throws {ValidationError} When size value is invalid
     */
    resize(value: number | string): void;
    /**
     * Calculates the optimal size when 'auto' is specified
     * @private
     * @returns {number} Calculated size in pixels
     */
    private _calculateAutoSize;
    /**
     * Gets a square by its ID
     * @param {string} squareId - Square identifier (e.g., 'e4')
     * @returns {Square|null} The square or null if not found
     */
    getSquare(squareId: string): Square | null;
    /**
     * Gets all squares
     * @returns {Object.<string, Square>} All squares indexed by ID
     */
    getAllSquares(): {
        [x: string]: Square;
    };
    /**
     * Applies a method to all squares
     * @param {string} methodName - Name of the method to call on each square
     * @param {...*} args - Arguments to pass to the method
     */
    applyToAllSquares(methodName: string, ...args: any[]): void;
    /**
     * Cleans up all resources
     */
    destroy(): void;
}
//# sourceMappingURL=BoardService.d.ts.map