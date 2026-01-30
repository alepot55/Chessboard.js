/**
 * Service responsible for coordinate conversions and board orientation
 * @class
 */
export class CoordinateService {
    /**
     * Creates a new CoordinateService instance
     * @param {ChessboardConfig} config - Board configuration
     */
    constructor(config: ChessboardConfig);
    config: ChessboardConfig;
    /**
     * Converts logical coordinates to real coordinates based on board orientation
     * @param {number} row - Row index (0-7)
     * @param {number} col - Column index (0-7)
     * @returns {Array<number>} Real coordinates [row, col] (1-8)
     */
    realCoord(row: number, col: number): Array<number>;
    /**
     * Converts board coordinates to square ID
     * @param {number} row - Row index (0-7)
     * @param {number} col - Column index (0-7)
     * @returns {string} Square ID (e.g., 'e4')
     */
    getSquareID(row: number, col: number): string;
    /**
     * Converts square ID to board coordinates
     * @param {string} squareId - Square ID (e.g., 'e4')
     * @returns {Array<number>} Board coordinates [row, col] (0-7)
     */
    getCoordinatesFromSquareID(squareId: string): Array<number>;
    /**
     * Converts pixel coordinates to square ID
     * @param {number} x - X coordinate in pixels
     * @param {number} y - Y coordinate in pixels
     * @param {HTMLElement} boardElement - Board DOM element
     * @returns {string|null} Square ID or null if outside board
     */
    pixelToSquareID(x: number, y: number, boardElement: HTMLElement): string | null;
    /**
     * Converts square ID to pixel coordinates
     * @param {string} squareId - Square ID (e.g., 'e4')
     * @param {HTMLElement} boardElement - Board DOM element
     * @returns {Object|null} Pixel coordinates {x, y} or null if invalid
     */
    squareIDToPixel(squareId: string, boardElement: HTMLElement): Object | null;
    /**
     * Gets the center pixel coordinates of a square
     * @param {string} squareId - Square ID (e.g., 'e4')
     * @param {HTMLElement} boardElement - Board DOM element
     * @returns {Object|null} Center coordinates {x, y} or null if invalid
     */
    getSquareCenter(squareId: string, boardElement: HTMLElement): Object | null;
    /**
     * Calculates the distance between two squares
     * @param {string} fromSquare - Source square ID
     * @param {string} toSquare - Target square ID
     * @returns {number} Distance between squares
     */
    getSquareDistance(fromSquare: string, toSquare: string): number;
    /**
     * Checks if the board is oriented from white's perspective
     * @returns {boolean} True if white-oriented
     */
    isWhiteOriented(): boolean;
    /**
     * Checks if the board is oriented from black's perspective
     * @returns {boolean} True if black-oriented
     */
    isBlackOriented(): boolean;
    /**
     * Gets the current orientation
     * @returns {string} Current orientation ('w' or 'b')
     */
    getOrientation(): string;
    /**
     * Sets the orientation
     * @param {string} orientation - New orientation ('w', 'b', 'white', 'black')
     */
    setOrientation(orientation: string): void;
    /**
     * Flips the board orientation
     */
    flipOrientation(): void;
    /**
     * Gets all square IDs in order
     * @returns {Array<string>} Array of all square IDs
     */
    getAllSquareIDs(): Array<string>;
    /**
     * Gets squares in a specific rank (row)
     * @param {number} rank - Rank number (1-8)
     * @returns {Array<string>} Array of square IDs in the rank
     */
    getSquaresByRank(rank: number): Array<string>;
    /**
     * Gets squares in a specific file (column)
     * @param {string} file - File letter (a-h)
     * @returns {Array<string>} Array of square IDs in the file
     */
    getSquaresByFile(file: string): Array<string>;
}
//# sourceMappingURL=CoordinateService.d.ts.map