const animationTime = {
    'fast': 200,
    'slow': 600,
    'normal': 400,
    'verySlow': 1000,
    'veryFast': 100
};

const boolValues = {
    'true': true,
    'false': false,
    'none': false,
    1: true,
    0: false
};

const transitionFunctions = {
    'ease': 'ease',
    'linear': 'linear',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'none': null
};

class ChessboardConfig {
    constructor(settings) {
        const defaults = {
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
        };

        const config = Object.assign({}, defaults, settings);

        this.id_div = config.id;
        this.position = config.position;
        this.orientation = config.orientation;
        this.mode = config.mode;
        this.dropOffBoard = config.dropOffBoard;
        this.size = config.size;
        this.movableColors = config.movableColors;
        this.piecesPath = config.piecesPath;
        this.onMove = config.onMove;
        this.onMoveEnd = config.onMoveEnd;
        this.onChange = config.onChange;
        this.onDragStart = config.onDragStart;
        this.onDragMove = config.onDragMove;
        this.onDrop = config.onDrop;
        this.onSnapbackEnd = config.onSnapbackEnd;

        this.moveAnimation = this.setTransitionFunction(config.moveAnimation);
        this.snapbackAnimation = this.setTransitionFunction(config.snapbackAnimation);
        this.dropCenterAnimation = this.setTransitionFunction(config.dropCenterAnimation);
        this.fadeAnimation = this.setTransitionFunction(config.fadeAnimation);

        this.hints = this.setBoolean(config.hints);
        this.clickable = this.setBoolean(config.clickable);
        this.draggable = this.setBoolean(config.draggable);
        this.moveHighlight = this.setBoolean(config.moveHighlight);
        this.overHighlight = this.setBoolean(config.overHighlight);

        this.moveTime = this.setTime(config.moveTime);
        this.snapbackTime = this.setTime(config.snapbackTime);
        this.dropCenterTime = this.setTime(config.dropCenterTime);
        this.fadeTime = this.setTime(config.fadeTime);

        this.setCSSProperty('pieceRatio', config.ratio);
        this.setCSSProperty('whiteSquare', config.whiteSquare);
        this.setCSSProperty('blackSquare', config.blackSquare);
        this.setCSSProperty('highlightSquare', config.highlight);
        this.setCSSProperty('selectedSquareWhite', config.selectedSquareWhite);
        this.setCSSProperty('selectedSquareBlack', config.selectedSquareBlack);
        this.setCSSProperty('movedSquareWhite', config.movedSquareWhite);
        this.setCSSProperty('movedSquareBlack', config.movedSquareBlack);
        this.setCSSProperty('choiceSquare', config.choiceSquare);
        this.setCSSProperty('coverSquare', config.coverSquare);
        this.setCSSProperty('hintColor', config.hintColor);

        // Configure modes
        if (this.mode === 'creative') {
            this.onlyLegalMoves = false;
            this.hints = false;
        } else if (this.mode === 'normal') {
            this.onlyLegalMoves = true;
        }
    }

    setCSSProperty(property, value) {
        document.documentElement.style.setProperty(`--${property}`, value);
    }

    setOrientation(orientation) {
        this.orientation = orientation;
        return this;
    }

    setTime(value) {
        if (typeof value === 'number') return value;
        if (value in animationTime) return animationTime[value];
        throw new Error('Invalid time value');
    }

    setBoolean(value) {
        if (typeof value === 'boolean') return value;
        if (value in boolValues) return boolValues[value];
        throw new Error('Invalid boolean value');
    }

    setTransitionFunction(value) {
        // Handle boolean values - true means use default 'ease', false/null means no animation
        if (typeof value === 'boolean') {
            return value ? transitionFunctions['ease'] : null;
        }
        
        // Handle string values
        if (typeof value === 'string' && value in transitionFunctions) {
            return transitionFunctions[value];
        }
        
        // Handle null/undefined
        if (value === null || value === undefined) {
            return null;
        }
        
        throw new Error('Invalid transition function');
    }
}

class Piece {
    constructor(color, type, src, opacity = 1) {
        this.color = color;
        this.type = type;
        this.id = this.getId();
        this.src = src;
        this.element = this.createElement(src, opacity);

        this.check();
    }

    getId() { return this.type + this.color }

    createElement(src, opacity = 1) {
        let element = document.createElement("img");
        element.classList.add("piece");
        element.id = this.id;
        element.src = src || this.src;
        element.style.opacity = opacity;
        
        // Ensure the image loads properly
        element.onerror = () => {
            console.warn('Failed to load piece image:', element.src);
        };
        
        return element;
    }

    visible() { this.element.style.opacity = 1; }

    invisible() { this.element.style.opacity = 0; }

    /**
     * Updates the piece image source
     * @param {string} newSrc - New image source
     */
    updateSrc(newSrc) {
        this.src = newSrc;
        if (this.element) {
            this.element.src = newSrc;
        }
    }

    /**
     * Transforms the piece to a new type with smooth animation
     * @param {string} newType - New piece type
     * @param {string} newSrc - New image source
     * @param {number} [duration=200] - Animation duration in milliseconds
     * @param {Function} [callback] - Callback when transformation is complete
     */
    transformTo(newType, newSrc, duration = 200, callback = null) {
        if (!this.element) {
            if (callback) callback();
            return;
        }

        const element = this.element;
        element.src;
        
        // Add transformation class to disable all transitions temporarily
        element.classList.add('transforming');
        
        // Create a smooth scale animation for the transformation
        const scaleDown = [
            { transform: 'scale(1)', opacity: '1' },
            { transform: 'scale(0.8)', opacity: '0.7' }
        ];
        
        const scaleUp = [
            { transform: 'scale(0.8)', opacity: '0.7' },
            { transform: 'scale(1)', opacity: '1' }
        ];

        const halfDuration = duration / 2;

        // First animation: scale down
        if (element.animate) {
            const scaleDownAnimation = element.animate(scaleDown, {
                duration: halfDuration,
                easing: 'ease-in',
                fill: 'forwards'
            });

            scaleDownAnimation.onfinish = () => {
                // Change the piece type and source at the smallest scale
                this.type = newType;
                this.id = this.getId();
                this.src = newSrc;
                element.src = newSrc;
                element.id = this.id;
                
                // Second animation: scale back up
                const scaleUpAnimation = element.animate(scaleUp, {
                    duration: halfDuration,
                    easing: 'ease-out',
                    fill: 'forwards'
                });

                scaleUpAnimation.onfinish = () => {
                    // Reset transform and remove transformation class
                    element.style.transform = '';
                    element.style.opacity = '';
                    element.classList.remove('transforming');
                    
                    // Add a subtle bounce effect
                    element.classList.add('transform-complete');
                    
                    // Remove bounce class after animation
                    setTimeout(() => {
                        element.classList.remove('transform-complete');
                    }, 400);
                    
                    if (callback) callback();
                };
            };
        } else {
            // Fallback for browsers without Web Animations API
            element.style.transition = `transform ${halfDuration}ms ease-in, opacity ${halfDuration}ms ease-in`;
            element.style.transform = 'scale(0.8)';
            element.style.opacity = '0.7';
            
            setTimeout(() => {
                // Change the piece
                this.type = newType;
                this.id = this.getId();
                this.src = newSrc;
                element.src = newSrc;
                element.id = this.id;
                
                // Scale back up
                element.style.transition = `transform ${halfDuration}ms ease-out, opacity ${halfDuration}ms ease-out`;
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
                
                setTimeout(() => {
                    // Clean up
                    element.style.transition = '';
                    element.style.transform = '';
                    element.style.opacity = '';
                    element.classList.remove('transforming');
                    
                    // Add bounce effect
                    element.classList.add('transform-complete');
                    setTimeout(() => {
                        element.classList.remove('transform-complete');
                    }, 400);
                    
                    if (callback) callback();
                }, halfDuration);
            }, halfDuration);
        }
    }

    fadeIn(duration, speed, transition_f) {
        let start = performance.now();
        let opacity = 0;
        let piece = this;
        let fade = function () {
            let elapsed = performance.now() - start;
            opacity = transition_f(elapsed, duration, speed);
            piece.element.style.opacity = opacity;
            if (elapsed < duration) {
                requestAnimationFrame(fade);
            } else {
                piece.element.style.opacity = 1;
            }
        };
        fade();
    }

    fadeOut(duration, speed, transition_f) {
        let start = performance.now();
        let opacity = 1;
        let piece = this;
        let fade = function () {
            let elapsed = performance.now() - start;
            opacity = 1 - transition_f(elapsed, duration, speed);
            piece.element.style.opacity = opacity;
            if (elapsed < duration) {
                requestAnimationFrame(fade);
            } else {
                piece.element.style.opacity = 0;
            }
        };
        fade();
    }

    setDrag(f) {
        this.element.ondragstart = (e) => { e.preventDefault(); };
        this.element.onmousedown = f;
    }

    destroy() {
        // Remove all event listeners
        if (this.element) {
            this.element.onmousedown = null;
            this.element.ondragstart = null;
            
            // Remove from DOM
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            
            // Clear references
            this.element = null;
        }
    }

    translate(to, duration, transition_f, speed, callback = null) {

        let sourceRect = this.element.getBoundingClientRect();
        let targetRect = to.getBoundingClientRect();
        let x_start = sourceRect.left + sourceRect.width / 2;
        let y_start = sourceRect.top + sourceRect.height / 2;
        let x_end = targetRect.left + targetRect.width / 2;
        let y_end = targetRect.top + targetRect.height / 2;
        let dx = x_end - x_start;
        let dy = y_end - y_start;

        let keyframes = [
            { transform: 'translate(0, 0)' },
            { transform: `translate(${dx}px, ${dy}px)` }
        ];

        if (this.element.animate) {
            let animation = this.element.animate(keyframes, {
                duration: duration,
                easing: 'ease',
                fill: 'none'
            });

            animation.onfinish = () => {
                if (callback) callback();
                this.element.style = '';
            };
        } else {
            this.element.style.transition = `transform ${duration}ms ease`;
            this.element.style.transform = `translate(${dx}px, ${dy}px)`;
            if (callback) callback();
            this.element.style = '';
        }
    }

    check() {
        if (['p', 'r', 'n', 'b', 'q', 'k'].indexOf(this.type) === -1) {
            throw new Error("Invalid piece type");
        }

        if (['w', 'b'].indexOf(this.color) === -1) {
            throw new Error("Invalid piece color");
        }
    }
}

class Square {

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.id = this.getId();
        this.element = this.createElement();
        this.piece = null;
    }

    getPiece() {
        return this.piece;
    }

    opposite() {
        this.row = 9 - this.row;
        this.col = 9 - this.col;
        this.id = this.getId();
        this.element = this.resetElement();
    }

    isWhite() {
        return (this.row + this.col) % 2 === 0;
    }

    getId() {
        let letters = 'abcdefgh';
        let letter = letters[this.col - 1];
        return letter + this.row;
    }

    resetElement() {
        this.element.id = this.id;
        this.element.className = '';
        this.element.classList.add('square');
        this.element.classList.add(this.isWhite() ? 'whiteSquare' : 'blackSquare');
    }

    createElement() {
        let element = document.createElement('div');
        element.id = this.id;
        element.classList.add('square');
        element.classList.add(this.isWhite() ? 'whiteSquare' : 'blackSquare');
        return element;
    }

    getElement() {
        return this.element;
    }

    getBoundingClientRect() {
        return this.element.getBoundingClientRect();
    }

    removePiece() {
        if (!this.piece) {
            return null;
        }
        
        // Remove the piece element from DOM
        if (this.piece.element && this.piece.element.parentNode === this.element) {
            this.element.removeChild(this.piece.element);
        }
        
        const piece = this.piece;
        this.piece = null;
        return piece;
    }

    /**
     * Forcefully removes all pieces from this square
     */
    forceRemoveAllPieces() {
        // Remove all img elements with class 'piece'
        const pieceElements = this.element.querySelectorAll('img.piece');
        pieceElements.forEach(element => {
            if (element.parentNode === this.element) {
                this.element.removeChild(element);
            }
        });
        
        // Clear the piece reference
        this.piece = null;
    }

    /**
     * Replaces the current piece with a new one efficiently
     * @param {Piece} newPiece - The new piece to place
     */
    replacePiece(newPiece) {
        // If there's an existing piece, remove it first
        if (this.piece) {
            this.removePiece();
        }
        
        // Add the new piece
        this.putPiece(newPiece);
        
        // Ensure the piece is properly displayed
        newPiece.element.style.opacity = '1';
    }

    addEventListener(event, callback) {
        this.element.addEventListener(event, callback);
    }

    putPiece(piece) {
        // If there's already a piece, remove it first
        if (this.piece) {
            this.removePiece();
        }
        
        this.piece = piece;
        if (piece && piece.element) {
            this.element.appendChild(piece.element);
        }
    }

    putHint(catchable) {
        if (this.element.querySelector('.hint')) {
            return;
        }
        let hint = document.createElement("div");
        hint.classList.add('hint');
        this.element.appendChild(hint);
        if (catchable) {
            hint.classList.add('catchable');
        }
    }

    removeHint() {
        let hint = this.element.querySelector('.hint');
        if (hint) {
            this.element.removeChild(hint);
        }
    }

    select() {
        this.element.classList.add(this.isWhite() ? 'selectedSquareWhite' : 'selectedSquareBlack');
    }

    deselect() {
        this.element.classList.remove('selectedSquareWhite');
        this.element.classList.remove('selectedSquareBlack');
    }

    moved() {
        this.element.classList.add(this.isWhite() ? 'movedSquareWhite' : 'movedSquareBlack');
    }

    unmoved() {
        this.element.classList.remove('movedSquareWhite');
        this.element.classList.remove('movedSquareBlack');
    }

    highlight() {
        this.element.classList.add('highlighted');
    }

    dehighlight() {
        this.element.classList.remove('highlighted');
    }

    putCover(callback) {
        let cover = document.createElement("div");
        cover.classList.add('square');
        cover.classList.add('cover');
        this.element.appendChild(cover);
        cover.addEventListener('click', (e) => {
            e.stopPropagation();
            callback();
        });
    }

    removeCover() {
        let cover = this.element.querySelector('.cover');
        if (cover) {
            this.element.removeChild(cover);
        }
    }

    putPromotion(src, callback) {
        let choice = document.createElement("div");
        choice.classList.add('square');
        choice.classList.add('choice');
        this.element.appendChild(choice);
        let img = document.createElement("img");
        img.classList.add("piece");
        img.classList.add("choicable");
        img.src = src;
        choice.appendChild(img);
        choice.addEventListener('click', (e) => {
            e.stopPropagation();
            callback();
        });

    }

    hasPromotion() {
        return this.element.querySelector('.choice') !== null;
    }

    removePromotion() {
        let choice = this.element.querySelector('.choice');
        if (choice) {
            choice.removeChild(choice.firstChild);
            this.element.removeChild(choice);
        }
    }

    destroy() {
        this.element.remove();
    }

    hasPiece() {
        return this.piece !== null;
    }

    getColor() {
        return this.piece.getColor();
    }

    check() {
        if (this.row < 1 || this.row > 8) {
            throw new Error("Invalid square: row is out of bounds");
        }
        if (this.col < 1 || this.col > 8) {
            throw new Error("Invalid square: col is out of bounds");
        }
        
    }
}

let Move$1 = class Move {

    constructor(from, to, promotion = null, check = false) {
        this.piece = from ? from.getPiece() : null;
        this.from = from;
        this.to = to;
        this.promotion = promotion;

        if (check) this.check();
    }

    hasPromotion() {
        return this.promotion !== null;
    }

    setPromotion(promotion) {
        this.promotion = promotion;
    }

    check() {
        if (this.piece === null) return false;
        if (!(this.piece instanceof Piece)) return false;
        if (['q', 'r', 'b', 'n', null].indexOf(this.promotion) === -1) return false;
        if (!(this.from instanceof Square)) return false;
        if (!(this.to instanceof Square)) return false;
        if (!this.to) return false;
        if (!this.from) return false;
        if (this.from === this.to) return false;
        return true;
    }

    isLegal(game) {
        let destinations = game.moves({ square: this.from.id, verbose: true }).map(move => move.to);
        return destinations.indexOf(this.to.id) !== -1;
    }


};

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
const STANDARD_POSITIONS = {
    'start': 'start',
    'default': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    'empty': '8/8/8/8/8/8/8/8 w - - 0 1'
};

/**
 * Default starting position FEN string
 * @type {string}
 * @readonly
 */
const DEFAULT_STARTING_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * Valid promotion pieces
 * @type {string[]}
 * @readonly
 */
const PROMOTION_PIECES = ['q', 'r', 'b', 'n'];

/**
 * Board coordinates letters
 * @type {string}
 * @readonly
 */
const BOARD_LETTERS = 'abcdefgh';

/**
 * Board size constants
 * @type {Object}
 * @readonly
 */
const BOARD_SIZE = {
    ROWS: 8,
    COLS: 8};

/**
 * Error messages and error handling utilities
 * @module errors/messages
 * @since 2.0.0
 */

/**
 * Standardized error messages for the chessboard application
 * @type {Object.<string, string>}
 * @readonly
 */
const ERROR_MESSAGES = {
    // Position and FEN related
    'invalid_position': 'Invalid position - ',
    // DOM and UI related
    'invalid_id_div': 'Board id not found - ',
    'invalid_value': 'Invalid value - ',
    
    // Piece related
    'invalid_piece': 'Invalid piece - ',
    'invalid_square': 'Invalid square - ',
    'invalid_piecesPath': 'Invalid piecesPath - ',
    
    // Board configuration
    'invalid_orientation': 'Invalid orientation - ',
    'square_no_piece': 'Square has no piece to remove.',
    'invalid_move_format': 'Invalid move format'
};

/**
 * Error codes for categorizing different types of errors
 * @type {Object.<string, string>}
 * @readonly
 */
const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    MOVE_ERROR: 'MOVE_ERROR',
    DOM_ERROR: 'DOM_ERROR',
    PIECE_ERROR: 'PIECE_ERROR'
};

/**
 * Custom error classes for better error handling
 * @module errors/ChessboardError
 * @since 2.0.0
 */


/**
 * Base error class for all chessboard-related errors
 * @class
 * @extends Error
 */
class ChessboardError extends Error {
    /**
     * Creates a new ChessboardError instance
     * @param {string} message - Error message
     * @param {string} code - Error code from ERROR_CODES
     * @param {Object} [context={}] - Additional context information
     */
    constructor(message, code, context = {}) {
        super(message);
        this.name = 'ChessboardError';
        this.code = code;
        this.context = context;
        this.timestamp = new Date().toISOString();
        
        // Maintain stack trace for debugging
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ChessboardError);
        }
    }
}

/**
 * Error thrown when validation fails
 * @class
 * @extends ChessboardError
 */
class ValidationError extends ChessboardError {
    /**
     * Creates a new ValidationError instance
     * @param {string} message - Error message
     * @param {string} field - Field that failed validation
     * @param {*} value - Value that failed validation
     */
    constructor(message, field, value) {
        super(message, ERROR_CODES.VALIDATION_ERROR, { field, value });
        this.name = 'ValidationError';
        this.field = field;
        this.value = value;
    }
}

/**
 * Error thrown when a move is invalid or fails
 * @class
 * @extends ChessboardError
 */
class MoveError extends ChessboardError {
    /**
     * Creates a new MoveError instance
     * @param {string} message - Error message
     * @param {string} from - Source square
     * @param {string} to - Target square
     * @param {string} [piece] - Piece being moved
     */
    constructor(message, from, to, piece) {
        super(message, ERROR_CODES.MOVE_ERROR, { from, to, piece });
        this.name = 'MoveError';
        this.from = from;
        this.to = to;
        this.piece = piece;
    }
}

/**
 * Error thrown when DOM operations fail
 * @class
 * @extends ChessboardError
 */
class DOMError extends ChessboardError {
    /**
     * Creates a new DOMError instance
     * @param {string} message - Error message
     * @param {string} elementId - Element ID that caused the error
     */
    constructor(message, elementId) {
        super(message, ERROR_CODES.DOM_ERROR, { elementId });
        this.name = 'DOMError';
        this.elementId = elementId;
    }
}

/**
 * Error thrown when piece operations fail
 * @class
 * @extends ChessboardError
 */
class PieceError extends ChessboardError {
    /**
     * Creates a new PieceError instance
     * @param {string} message - Error message
     * @param {string} pieceId - Piece ID that caused the error
     * @param {string} [square] - Square where the error occurred
     */
    constructor(message, pieceId, square) {
        super(message, ERROR_CODES.PIECE_ERROR, { pieceId, square });
        this.name = 'PieceError';
        this.pieceId = pieceId;
        this.square = square;
    }
}

/**
 * Service for managing board setup and DOM operations
 * @module services/BoardService
 * @since 2.0.0
 */


/**
 * Service responsible for board DOM manipulation and setup
 * @class
 */
class BoardService {
    /**
     * Creates a new BoardService instance
     * @param {ChessboardConfig} config - Board configuration
     */
    constructor(config) {
        this.config = config;
        this.element = null;
        this.squares = {};
    }

    /**
     * Builds the board DOM element and attaches it to the configured container
     * @throws {DOMError} When the container element cannot be found
     */
    buildBoard() {
        console.log('BoardService.buildBoard: Looking for element with ID:', this.config.id_div);
        
        this.element = document.getElementById(this.config.id_div);
        if (!this.element) {
            throw new DOMError(ERROR_MESSAGES.invalid_id_div + this.config.id_div, this.config.id_div);
        }
        
        this.resize(this.config.size);
        this.element.className = "board";
    }

    /**
     * Creates all 64 squares and adds them to the board
     * @param {Function} coordConverter - Function to convert row/col to real coordinates
     */
    buildSquares(coordConverter) {
        for (let row = 0; row < BOARD_SIZE.ROWS; row++) {
            for (let col = 0; col < BOARD_SIZE.COLS; col++) {
                const [squareRow, squareCol] = coordConverter(row, col);
                const square = new Square(squareRow, squareCol);
                
                this.squares[square.getId()] = square;
                this.element.appendChild(square.element);
            }
        }
    }

    /**
     * Removes all content from the board element
     */
    removeBoard() {
        if (this.element) {
            this.element.innerHTML = '';
        }
    }

    /**
     * Removes all squares from the board and cleans up their resources
     */
    removeSquares() {
        for (const square of Object.values(this.squares)) {
            if (this.element && square.element) {
                this.element.removeChild(square.element);
            }
            square.destroy();
        }
        this.squares = {};
    }

    /**
     * Resizes the board to the specified size
     * @param {number|string} value - Size in pixels or 'auto'
     * @throws {ValidationError} When size value is invalid
     */
    resize(value) {
        if (value === 'auto') {
            const size = this._calculateAutoSize();
            this.resize(size);
        } else if (typeof value !== 'number') {
            throw new ValidationError(ERROR_MESSAGES.invalid_value + value, 'size', value);
        } else {
            document.documentElement.style.setProperty('--dimBoard', value + 'px');
        }
    }

    /**
     * Calculates the optimal size when 'auto' is specified
     * @private
     * @returns {number} Calculated size in pixels
     */
    _calculateAutoSize() {
        if (!this.element) return 400; // Default fallback
        
        const { offsetWidth, offsetHeight } = this.element;
        
        if (offsetWidth === 0) {
            return offsetHeight || 400;
        } else if (offsetHeight === 0) {
            return offsetWidth;
        } else {
            return Math.min(offsetWidth, offsetHeight);
        }
    }

    /**
     * Gets a square by its ID
     * @param {string} squareId - Square identifier (e.g., 'e4')
     * @returns {Square|null} The square or null if not found
     */
    getSquare(squareId) {
        return this.squares[squareId] || null;
    }

    /**
     * Gets all squares
     * @returns {Object.<string, Square>} All squares indexed by ID
     */
    getAllSquares() {
        return { ...this.squares };
    }

    /**
     * Applies a method to all squares
     * @param {string} methodName - Name of the method to call on each square
     * @param {...*} args - Arguments to pass to the method
     */
    applyToAllSquares(methodName, ...args) {
        for (const square of Object.values(this.squares)) {
            if (typeof square[methodName] === 'function') {
                square[methodName](...args);
            }
        }
    }

    /**
     * Cleans up all resources
     */
    destroy() {
        this.removeSquares();
        this.removeBoard();
        this.element = null;
        this.squares = {};
    }
}

/**
 * Service for managing coordinate conversions and board orientation
 * @module services/CoordinateService
 * @since 2.0.0
 */


/**
 * Service responsible for coordinate conversions and board orientation
 * @class
 */
class CoordinateService {
    /**
     * Creates a new CoordinateService instance
     * @param {ChessboardConfig} config - Board configuration
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Converts logical coordinates to real coordinates based on board orientation
     * @param {number} row - Row index (0-7)
     * @param {number} col - Column index (0-7)
     * @returns {Array<number>} Real coordinates [row, col] (1-8)
     */
    realCoord(row, col) {
        let realRow = row;
        let realCol = col;
        
        if (this.isWhiteOriented()) {
            realRow = 7 - row;
        } else {
            realCol = 7 - col;
        }
        
        return [realRow + 1, realCol + 1];
    }

    /**
     * Converts board coordinates to square ID
     * @param {number} row - Row index (0-7)
     * @param {number} col - Column index (0-7)
     * @returns {string} Square ID (e.g., 'e4')
     */
    getSquareID(row, col) {
        row = parseInt(row);
        col = parseInt(col);
        
        if (this.isWhiteOriented()) {
            row = 8 - row;
            col = col + 1;
        } else {
            row = row + 1;
            col = 8 - col;
        }
        
        if (col < 1 || col > 8 || row < 1 || row > 8) {
            throw new ValidationError(
                `Invalid board coordinates: row=${row}, col=${col}`,
                'coordinates',
                { row, col }
            );
        }
        
        const letter = BOARD_LETTERS[col - 1];
        return letter + row;
    }

    /**
     * Converts square ID to board coordinates
     * @param {string} squareId - Square ID (e.g., 'e4')
     * @returns {Array<number>} Board coordinates [row, col] (0-7)
     */
    getCoordinatesFromSquareID(squareId) {
        if (typeof squareId !== 'string' || squareId.length !== 2) {
            throw new ValidationError(
                ERROR_MESSAGES.invalid_square + squareId,
                'squareId',
                squareId
            );
        }
        
        const letter = squareId[0];
        const number = parseInt(squareId[1]);
        
        const col = BOARD_LETTERS.indexOf(letter);
        if (col === -1) {
            throw new ValidationError(
                ERROR_MESSAGES.invalid_square + squareId,
                'squareId',
                squareId
            );
        }
        
        if (number < 1 || number > 8) {
            throw new ValidationError(
                ERROR_MESSAGES.invalid_square + squareId,
                'squareId',
                squareId
            );
        }
        
        let row, boardCol;
        
        if (this.isWhiteOriented()) {
            row = 8 - number;
            boardCol = col;
        } else {
            row = number - 1;
            boardCol = 7 - col;
        }
        
        return [row, boardCol];
    }

    /**
     * Converts pixel coordinates to square ID
     * @param {number} x - X coordinate in pixels
     * @param {number} y - Y coordinate in pixels
     * @param {HTMLElement} boardElement - Board DOM element
     * @returns {string|null} Square ID or null if outside board
     */
    pixelToSquareID(x, y, boardElement) {
        if (!boardElement) return null;
        
        const rect = boardElement.getBoundingClientRect();
        const { width, height } = rect;
        
        // Check if coordinates are within board bounds
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return null;
        }
        
        const squareWidth = width / 8;
        const squareHeight = height / 8;
        
        const col = Math.floor(x / squareWidth);
        const row = Math.floor(y / squareHeight);
        
        try {
            return this.getSquareID(row, col);
        } catch (error) {
            return null;
        }
    }

    /**
     * Converts square ID to pixel coordinates
     * @param {string} squareId - Square ID (e.g., 'e4')
     * @param {HTMLElement} boardElement - Board DOM element
     * @returns {Object|null} Pixel coordinates {x, y} or null if invalid
     */
    squareIDToPixel(squareId, boardElement) {
        if (!boardElement) return null;
        
        try {
            const [row, col] = this.getCoordinatesFromSquareID(squareId);
            const rect = boardElement.getBoundingClientRect();
            const { width, height } = rect;
            
            const squareWidth = width / 8;
            const squareHeight = height / 8;
            
            const x = col * squareWidth;
            const y = row * squareHeight;
            
            return { x, y };
        } catch (error) {
            return null;
        }
    }

    /**
     * Gets the center pixel coordinates of a square
     * @param {string} squareId - Square ID (e.g., 'e4')
     * @param {HTMLElement} boardElement - Board DOM element
     * @returns {Object|null} Center coordinates {x, y} or null if invalid
     */
    getSquareCenter(squareId, boardElement) {
        const coords = this.squareIDToPixel(squareId, boardElement);
        if (!coords) return null;
        
        const rect = boardElement.getBoundingClientRect();
        const squareWidth = rect.width / 8;
        const squareHeight = rect.height / 8;
        
        return {
            x: coords.x + squareWidth / 2,
            y: coords.y + squareHeight / 2
        };
    }

    /**
     * Calculates the distance between two squares
     * @param {string} fromSquare - Source square ID
     * @param {string} toSquare - Target square ID
     * @returns {number} Distance between squares
     */
    getSquareDistance(fromSquare, toSquare) {
        try {
            const [fromRow, fromCol] = this.getCoordinatesFromSquareID(fromSquare);
            const [toRow, toCol] = this.getCoordinatesFromSquareID(toSquare);
            
            const rowDiff = Math.abs(toRow - fromRow);
            const colDiff = Math.abs(toCol - fromCol);
            
            return Math.sqrt(rowDiff * rowDiff + colDiff * colDiff);
        } catch (error) {
            return 0;
        }
    }

    /**
     * Checks if the board is oriented from white's perspective
     * @returns {boolean} True if white-oriented
     */
    isWhiteOriented() {
        return this.config.orientation === 'w';
    }

    /**
     * Checks if the board is oriented from black's perspective
     * @returns {boolean} True if black-oriented
     */
    isBlackOriented() {
        return this.config.orientation === 'b';
    }

    /**
     * Flips the board orientation
     */
    flipOrientation() {
        this.config.orientation = this.isWhiteOriented() ? 'b' : 'w';
    }

    /**
     * Sets the board orientation
     * @param {string} orientation - 'w' for white, 'b' for black
     * @throws {ValidationError} When orientation is invalid
     */
    setOrientation(orientation) {
        if (orientation !== 'w' && orientation !== 'b') {
            throw new ValidationError(
                ERROR_MESSAGES.invalid_orientation + orientation,
                'orientation',
                orientation
            );
        }
        
        this.config.orientation = orientation;
    }

    /**
     * Gets all square IDs in order
     * @returns {Array<string>} Array of all square IDs
     */
    getAllSquareIDs() {
        const squares = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                squares.push(this.getSquareID(row, col));
            }
        }
        
        return squares;
    }

    /**
     * Gets squares in a specific rank (row)
     * @param {number} rank - Rank number (1-8)
     * @returns {Array<string>} Array of square IDs in the rank
     */
    getSquaresByRank(rank) {
        if (rank < 1 || rank > 8) {
            throw new ValidationError(
                `Invalid rank: ${rank}`,
                'rank',
                rank
            );
        }
        
        const squares = [];
        
        for (let col = 0; col < 8; col++) {
            const row = this.isWhiteOriented() ? 8 - rank : rank - 1;
            squares.push(this.getSquareID(row, col));
        }
        
        return squares;
    }

    /**
     * Gets squares in a specific file (column)
     * @param {string} file - File letter (a-h)
     * @returns {Array<string>} Array of square IDs in the file
     */
    getSquaresByFile(file) {
        const col = BOARD_LETTERS.indexOf(file);
        if (col === -1) {
            throw new ValidationError(
                `Invalid file: ${file}`,
                'file',
                file
            );
        }
        
        const squares = [];
        
        for (let row = 0; row < 8; row++) {
            squares.push(this.getSquareID(row, col));
        }
        
        return squares;
    }
}

/**
 * Performance utilities for smooth interactions
 */

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Request animation frame throttle for smooth animations
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF throttled function
 */
function rafThrottle(func) {
    let isThrottled = false;
    return function() {
        if (isThrottled) return;
        
        const args = arguments;
        const context = this;
        
        isThrottled = true;
        requestAnimationFrame(() => {
            func.apply(context, args);
            isThrottled = false;
        });
    };
}

/**
 * High performance transform utility
 * @param {HTMLElement} element - Element to transform
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} scale - Scale factor
 */
function setTransform(element, x, y, scale = 1) {
    // Use transform3d for hardware acceleration
    element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
}

/**
 * Reset element position efficiently
 * @param {HTMLElement} element - Element to reset
 */
function resetTransform(element) {
    element.style.transform = '';
    element.style.left = '';
    element.style.top = '';
}

/**
 * Cross-browser utilities for consistent drag & drop behavior
 */

/**
 * Detect browser type and version
 * @returns {Object} Browser information
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    const isChrome = ua.includes('Chrome') && !ua.includes('Edg');
    const isFirefox = ua.includes('Firefox');
    const isSafari = ua.includes('Safari') && !ua.includes('Chrome');
    const isEdge = ua.includes('Edg');
    
    return {
        isChrome,
        isFirefox,
        isSafari,
        isEdge,
        devicePixelRatio: window.devicePixelRatio || 1,
        userAgent: ua
    };
}

/**
 * Browser-specific drag optimizations
 */
const DragOptimizations = {
    /**
     * Apply browser-specific optimizations to an element
     * @param {HTMLElement} element - Element to optimize
     */
    enableForDrag(element) {
        const browserInfo = getBrowserInfo();
        
        // Base optimizations for all browsers
        element.style.willChange = 'left, top';
        element.style.pointerEvents = 'none'; // Prevent conflicts
        
        // Chrome-specific optimizations
        if (browserInfo.isChrome) {
            element.style.transform = 'translateZ(0)'; // Force hardware acceleration
        }
        
        // Firefox-specific optimizations
        if (browserInfo.isFirefox) {
            element.style.backfaceVisibility = 'hidden';
        }
    },
    
    /**
     * Clean up optimizations after drag
     * @param {HTMLElement} element - Element to clean up
     */
    cleanupAfterDrag(element) {
        element.style.willChange = 'auto';
        element.style.pointerEvents = '';
        element.style.transform = '';
        element.style.backfaceVisibility = '';
    }
};

/**
 * Service for managing events and user interactions
 * @module services/EventService
 * @since 2.0.0
 */


/**
 * Service responsible for event handling and user interactions
 * @class
 */
class EventService {
    /**
     * Creates a new EventService instance
     * @param {ChessboardConfig} config - Board configuration
     * @param {BoardService} boardService - Board service instance
     * @param {MoveService} moveService - Move service instance
     * @param {CoordinateService} coordinateService - Coordinate service instance
     * @param {Chessboard} chessboard - Chessboard instance
     */
    constructor(config, boardService, moveService, coordinateService, chessboard) {
        this.config = config;
        this.boardService = boardService;
        this.moveService = moveService;
        this.coordinateService = coordinateService;
        this.chessboard = chessboard;
        
        // State management
        this.clicked = null;
        this.promoting = false;
        this.isAnimating = false;
        
        // Event listeners storage for cleanup
        this.eventListeners = new Map();
    }

    /**
     * Adds event listeners to all squares
     * @param {Function} onSquareClick - Callback for square clicks
     * @param {Function} onPieceHover - Callback for piece hover
     * @param {Function} onPieceLeave - Callback for piece leave
     */
    addListeners(onSquareClick, onPieceHover, onPieceLeave) {
        // Remove existing listeners to avoid duplicates
        this.removeListeners();
        
        const squares = this.boardService.getAllSquares();
        
        Object.values(squares).forEach(square => {
            this._addSquareListeners(square, onSquareClick, onPieceHover, onPieceLeave);
        });
    }

    /**
     * Adds event listeners to a specific square
     * @private
     * @param {Square} square - Square to add listeners to
     * @param {Function} onSquareClick - Click callback
     * @param {Function} onPieceHover - Hover callback
     * @param {Function} onPieceLeave - Leave callback
     */
    _addSquareListeners(square, onSquareClick, onPieceHover, onPieceLeave) {
        const listeners = [];
        
        // Throttled hover handlers for performance
        const throttledHover = rafThrottle((e) => {
            if (!this.clicked && this.config.hints) {
                onPieceHover(square);
            }
        });
        
        const throttledLeave = rafThrottle((e) => {
            if (!this.clicked && this.config.hints) {
                onPieceLeave(square);
            }
        });
        
        // Click handler
        const handleClick = (e) => {
            e.stopPropagation();
            if (this.config.clickable && !this.isAnimating) {
                onSquareClick(square);
            }
        };
        
        // Add listeners
        square.element.addEventListener('mouseover', throttledHover);
        square.element.addEventListener('mouseout', throttledLeave);
        square.element.addEventListener('click', handleClick);
        square.element.addEventListener('touchstart', handleClick);
        
        // Store listeners for cleanup
        listeners.push(
            { element: square.element, type: 'mouseover', handler: throttledHover },
            { element: square.element, type: 'mouseout', handler: throttledLeave },
            { element: square.element, type: 'click', handler: handleClick },
            { element: square.element, type: 'touchstart', handler: handleClick }
        );
        
        this.eventListeners.set(square.id, listeners);
    }

    /**
     * Creates a drag function for a piece
     * @param {Square} square - Square containing the piece
     * @param {Piece} piece - Piece to create drag function for
     * @param {Function} onDragStart - Drag start callback
     * @param {Function} onDragMove - Drag move callback
     * @param {Function} onDrop - Drop callback
     * @param {Function} onSnapback - Snapback callback
     * @param {Function} onMove - Move execution callback
     * @param {Function} onRemove - Remove piece callback
     * @returns {Function} Drag event handler
     */
    createDragFunction(square, piece, onDragStart, onDragMove, onDrop, onSnapback, onMove, onRemove) {
        return (event) => {
            event.preventDefault();
            
            if (!this.config.draggable || !piece || this.isAnimating) {
                return;
            }
            
            const originalFrom = square;
            let isDragging = false;
            let from = originalFrom;
            let to = square;
            let previousHighlight = null;
            
            const img = piece.element;
            
            if (!this.moveService.canMove(from)) {
                return;
            }
            
            // Track initial position for drag threshold
            const startX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
            const startY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;
            
            const moveAt = (event) => {
                const boardElement = this.boardService.element;
                const squareSize = boardElement.offsetWidth / 8;
                
                // Get mouse coordinates
                let clientX, clientY;
                if (event.touches && event.touches[0]) {
                    clientX = event.touches[0].clientX;
                    clientY = event.touches[0].clientY;
                } else {
                    clientX = event.clientX;
                    clientY = event.clientY;
                }
                
                // Calculate position relative to board
                const boardRect = boardElement.getBoundingClientRect();
                const x = clientX - boardRect.left - (squareSize / 2);
                const y = clientY - boardRect.top - (squareSize / 2);
                
                img.style.left = x + 'px';
                img.style.top = y + 'px';
                
                return true;
            };
            
            const onMouseMove = (event) => {
                const currentX = event.clientX || 0;
                const currentY = event.clientY || 0;
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);
                
                // Start dragging if mouse moved enough
                if (!isDragging && (deltaX > 3 || deltaY > 3)) {
                    isDragging = true;
                    
                    // Set up drag state
                    if (!this.config.clickable) {
                        this.clicked = null;
                        this.clicked = from;
                    } else if (!this.clicked) {
                        this.clicked = from;
                    }
                    
                    // Visual feedback
                    if (this.config.clickable) {
                        from.select();
                        // Show hints would be handled by the main class
                    }
                    
                    // Prepare piece for dragging
                    img.style.position = 'absolute';
                    img.style.zIndex = '100';
                    img.classList.add('dragging');
                    
                    DragOptimizations.enableForDrag(img);
                    
                    // Call drag start callback
                    if (!onDragStart(square, piece)) {
                        return;
                    }
                }
                
                if (!isDragging) return;
                
                if (!moveAt(event)) ;
                
                // Update target square
                const boardElement = this.boardService.element;
                const boardRect = boardElement.getBoundingClientRect();
                const x = event.clientX - boardRect.left;
                const y = event.clientY - boardRect.top;
                
                let newTo = null;
                if (x >= 0 && x <= boardRect.width && y >= 0 && y <= boardRect.height) {
                    const squareId = this.coordinateService.pixelToSquareID(x, y, boardElement);
                    newTo = squareId ? this.boardService.getSquare(squareId) : null;
                }
                
                to = newTo;
                onDragMove(from, to, piece);
                
                // Update visual feedback
                if (to !== previousHighlight) {
                    to?.highlight();
                    previousHighlight?.dehighlight();
                    previousHighlight = to;
                }
            };
            
            const onMouseUp = () => {
                // Clean up visual feedback
                previousHighlight?.dehighlight();
                document.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                
                // If this was just a click, don't interfere
                if (!isDragging) {
                    return;
                }
                
                // Clean up drag state
                img.style.zIndex = '20';
                img.classList.remove('dragging');
                img.style.willChange = 'auto';
                
                // Handle drop
                const dropResult = onDrop(originalFrom, to, piece);
                const isTrashDrop = !to && (this.config.dropOffBoard === 'trash' || dropResult === 'trash');
                
                if (isTrashDrop) {
                    this._handleTrashDrop(originalFrom, onRemove);
                } else if (!to) {
                    // Reset piece position instantly for snapback
                    img.style.position = '';
                    img.style.left = '';
                    img.style.top = '';
                    img.style.transform = '';
                    
                    this._handleSnapback(originalFrom, piece, onSnapback);
                } else {
                    // Handle drop like a click - simple and reliable
                    this._handleDrop(originalFrom, to, piece, onMove, onSnapback);
                }
            };
            
            // Attach event listeners
            window.addEventListener('mouseup', onMouseUp, { once: true });
            document.addEventListener('mousemove', onMouseMove);
            img.addEventListener('mouseup', onMouseUp, { once: true });
        };
    }

    /**
     * Handles trash drop (piece removal)
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Function} onRemove - Callback to remove piece
     */
    _handleTrashDrop(fromSquare, onRemove) {
        this.boardService.applyToAllSquares('unmoved');
        this.boardService.applyToAllSquares('removeHint');
        fromSquare.deselect();
        
        if (onRemove) {
            onRemove(fromSquare.getId());
        }
    }

    /**
     * Handles snapback animation
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Piece} piece - Piece to snapback
     * @param {Function} onSnapback - Snapback callback
     */
    _handleSnapback(fromSquare, piece, onSnapback) {
        if (fromSquare && fromSquare.piece) {
            if (onSnapback) {
                onSnapback(fromSquare, piece);
            }
        }
    }

    /**
     * Handles successful drop
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Square} toSquare - Target square
     * @param {Piece} piece - Piece being dropped
     * @param {Function} onMove - Move callback
     * @param {Function} onSnapback - Snapback callback
     */
    _handleDrop(fromSquare, toSquare, piece, onMove, onSnapback) {
        this.clicked = fromSquare;
        
        // Check if move requires promotion
        if (this.moveService.requiresPromotion(new Move$1(fromSquare, toSquare))) {
            console.log('Drag move requires promotion:', fromSquare.id, '->', toSquare.id);
            
            // Set up promotion UI - use the same logic as click
            this.moveService.setupPromotion(
                new Move$1(fromSquare, toSquare),
                this.boardService.squares,
                (selectedPromotion) => {
                    console.log('Drag promotion selected:', selectedPromotion);
                    
                    // Clear promotion UI first
                    this.boardService.applyToAllSquares('removePromotion');
                    this.boardService.applyToAllSquares('removeCover');
                    
                    // Execute the move with promotion
                    const moveResult = onMove(fromSquare, toSquare, selectedPromotion, true);
                    
                    if (moveResult) {
                        // After a successful promotion move, we need to replace the piece
                        // after the drop animation completes
                        this._schedulePromotionPieceReplacement(toSquare, selectedPromotion);
                        
                        this.clicked = null;
                    } else {
                        // Move failed - snapback
                        this._handleSnapback(fromSquare, piece, onSnapback);
                    }
                },
                () => {
                    console.log('Drag promotion cancelled');
                    
                    // Clear promotion UI on cancel
                    this.boardService.applyToAllSquares('removePromotion');
                    this.boardService.applyToAllSquares('removeCover');
                    
                    // Snapback the piece
                    this._handleSnapback(fromSquare, piece, onSnapback);
                }
            );
        } else {
            // Regular move - no promotion needed
            const moveSuccess = onMove(fromSquare, toSquare, null, true);
            
            if (moveSuccess) {
                // Move successful - reset clicked state
                this.clicked = null;
            } else {
                // Move failed - snapback
                this._handleSnapback(fromSquare, piece, onSnapback);
            }
        }
    }

    /**
     * Animates piece to center of target square (visual only)
     * @private
     * @param {Piece} piece - Piece to animate
     * @param {Square} targetSquare - Target square
     * @param {Function} callback - Callback when animation completes
     */
    _animatePieceToCenter(piece, targetSquare, callback = null) {
        if (!piece || !targetSquare) {
            if (callback) callback();
            return;
        }
        
        const duration = this.config.dropCenterTime;
        
        // Get current position of piece element
        const sourceRect = piece.element.getBoundingClientRect();
        const targetRect = targetSquare.element.getBoundingClientRect();
        
        const x_start = sourceRect.left + sourceRect.width / 2;
        const y_start = sourceRect.top + sourceRect.height / 2;
        const x_end = targetRect.left + targetRect.width / 2;
        const y_end = targetRect.top + targetRect.height / 2;
        const dx = x_end - x_start;
        const dy = y_end - y_start;
        
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
            // Already centered, just reset styles
            piece.element.style.position = '';
            piece.element.style.left = '';
            piece.element.style.top = '';
            piece.element.style.transform = '';
            piece.element.style.zIndex = '';
            if (callback) callback();
            return;
        }
        
        const keyframes = [
            { transform: 'translate(0, 0)' },
            { transform: `translate(${dx}px, ${dy}px)` }
        ];
        
        if (piece.element.animate) {
            const animation = piece.element.animate(keyframes, {
                duration: duration,
                easing: 'ease',
                fill: 'none'  // Don't keep the final position
            });
            
            animation.onfinish = () => {
                // Reset all drag-related styles to let default CSS handle positioning
                piece.element.style.position = '';
                piece.element.style.left = '';
                piece.element.style.top = '';
                piece.element.style.transform = '';
                piece.element.style.zIndex = '';
                piece.element.style.transition = '';
                
                if (callback) callback();
            };
        } else {
            // Fallback for browsers without Web Animations API
            piece.element.style.transition = `transform ${duration}ms ease`;
            piece.element.style.transform = `translate(${dx}px, ${dy}px)`;
            
            setTimeout(() => {
                // After animation, reset ALL positioning styles and let CSS handle centering
                piece.element.style.position = 'relative';
                piece.element.style.left = '0';
                piece.element.style.top = '0';
                piece.element.style.transform = 'translate(-50%, -50%)';
                piece.element.style.zIndex = '20';
                piece.element.style.transition = 'none';
                
                if (callback) callback();
            }, duration);
        }
    }

    /**
     * Handles square click events
     * @param {Square} square - Clicked square
     * @param {Function} onMove - Move callback
     * @param {Function} onSelect - Select callback
     * @param {Function} onDeselect - Deselect callback
     * @param {boolean} [animate=true] - Whether to animate the move
     * @param {boolean} [dragged=false] - Whether this was triggered by drag
     * @returns {boolean} True if move was successful
     */
    onClick(square, onMove, onSelect, onDeselect, animate = true, dragged = false) {
        console.log('EventService.onClick: square =', square.id, 'clicked =', this.clicked?.id || 'none');
        
        let from = this.clicked;
        let promotion = null;
        
        // Handle promotion state
        if (this.promoting) {
            if (this.promoting === 'none') {
                from = null;
            } else {
                promotion = this.promoting;
            }
            
            this.promoting = false;
            this.boardService.applyToAllSquares('removePromotion');
            this.boardService.applyToAllSquares('removeCover');
        }
        
        // No source square selected
        if (!from) {
            if (this.moveService.canMove(square)) {
                if (this.config.clickable) {
                    onSelect(square);
                }
                this.clicked = square;
                return false;
            } else {
                return false;
            }
        }
        
        // Clicking same square - deselect
        if (this.clicked === square) {
            onDeselect(square);
            this.clicked = null;
            return false;
        }
        
        // Check if move requires promotion
        if (!promotion && this.moveService.requiresPromotion(new Move$1(from, square))) {
            console.log('Move requires promotion:', from.id, '->', square.id);
            
            // Set up promotion UI
            this.moveService.setupPromotion(
                new Move$1(from, square),
                this.boardService.squares,
                (selectedPromotion) => {
                    console.log('Promotion selected:', selectedPromotion);
                    
                    // Clear promotion UI first
                    this.boardService.applyToAllSquares('removePromotion');
                    this.boardService.applyToAllSquares('removeCover');
                    
                    // Execute the move with promotion
                    const moveResult = onMove(from, square, selectedPromotion, animate);
                    
                    if (moveResult) {
                        // After a successful promotion move, we need to replace the piece
                        // after the drop animation completes
                        this._schedulePromotionPieceReplacement(square, selectedPromotion);
                        
                        onDeselect(from);
                        this.clicked = null;
                    }
                },
                () => {
                    console.log('Promotion cancelled');
                    
                    // Clear promotion UI on cancel
                    this.boardService.applyToAllSquares('removePromotion');
                    this.boardService.applyToAllSquares('removeCover');
                    
                    onDeselect(from);
                    this.clicked = null;
                }
            );
            return false;
        }
        
        // Attempt to make move
        const moveResult = onMove(from, square, promotion, animate);
        
        if (moveResult) {
            // Move successful
            onDeselect(from);
            this.clicked = null;
            return true;
        } else {
            // Move failed - check if clicked square has a piece we can move
            if (this.moveService.canMove(square)) {
                // Deselect the previous piece
                onDeselect(from);
                
                // Select the new piece if clicking is enabled
                if (this.config.clickable) {
                    onSelect(square);
                }
                
                // Set the new piece as clicked
                this.clicked = square;
                return false;
            } else {
                // Move failed and no valid piece to select
                onDeselect(from);
                this.clicked = null;
                return false;
            }
        }
    }

    /**
     * Schedules piece replacement after promotion animation
     * @private
     * @param {Square} square - Target square
     * @param {string} promotionPiece - Piece to promote to
     */
    _schedulePromotionPieceReplacement(square, promotionPiece) {
        // Mark that we're doing a promotion to prevent interference
        this.chessboard._isPromoting = true;
        
        // Use a more robust approach: poll for the piece to be present
        this._waitForPieceAndReplace(square, promotionPiece, 0);
    }

    /**
     * Waits for piece to be present and then replaces it
     * @private
     * @param {Square} square - Target square
     * @param {string} promotionPiece - Piece to promote to
     * @param {number} attempt - Current attempt number
     */
    _waitForPieceAndReplace(square, promotionPiece, attempt) {
        const maxAttempts = 20; // Maximum 1 second of waiting (20 * 50ms)
        const targetSquare = this.boardService.getSquare(square.id);
        
        if (!targetSquare) {
            console.warn('Target square not found:', square.id);
            this.chessboard._isPromoting = false;
            return;
        }

        // Check if piece is present and ready
        if (targetSquare.piece && targetSquare.piece.element) {
            console.log('Piece found on', square.id, 'after', attempt, 'attempts');
            this._replacePromotionPiece(square, promotionPiece);
            
            // Allow normal updates again after transformation
            setTimeout(() => {
                this.chessboard._isPromoting = false;
                console.log('Promotion protection ended');
                // Force a board update to ensure everything is correctly synchronized
                this.chessboard._updateBoardPieces(false);
            }, 400); // Wait for transformation animation to complete
            
            return;
        }

        // If piece not found and we haven't exceeded max attempts, try again
        if (attempt < maxAttempts) {
            setTimeout(() => {
                this._waitForPieceAndReplace(square, promotionPiece, attempt + 1);
            }, 50);
        } else {
            console.warn('Failed to find piece for promotion after', maxAttempts, 'attempts');
            this.chessboard._isPromoting = false;
            
            // Force a board update to recover from the failed promotion
            this.chessboard._updateBoardPieces(false);
        }
    }
    
    /**
     * Replaces the piece on the square with the promotion piece
     * @private
     * @param {Square} square - Target square
     * @param {string} promotionPiece - Piece to promote to
     */
    _replacePromotionPiece(square, promotionPiece) {
        console.log('Replacing piece on', square.id, 'with', promotionPiece);
        
        // Get the target square from the board service
        const targetSquare = this.boardService.getSquare(square.id);
        if (!targetSquare) {
            console.log('Target square not found:', square.id);
            return;
        }
        
        // Get the game state to determine the correct piece color
        const gameState = this.chessboard.positionService.getGame();
        const gamePiece = gameState.get(targetSquare.id);
        
        if (!gamePiece) {
            console.log('No piece found in game state for', targetSquare.id);
            return;
        }

        // Get the current piece on the square
        const currentPiece = targetSquare.piece;
        
        if (!currentPiece) {
            console.warn('No piece found on target square for promotion');
            
            // Try to recover by creating a new piece
            const pieceId = promotionPiece + gamePiece.color;
            const piecePath = this.chessboard.pieceService.getPiecePath(pieceId);
            
            const newPiece = new Piece(
                gamePiece.color,
                promotionPiece,
                piecePath
            );
            
            // Place the new piece on the square
            targetSquare.putPiece(newPiece);
            
            // Set up drag functionality
            const dragFunction = this.chessboard._createDragFunction.bind(this.chessboard);
            newPiece.setDrag(dragFunction(targetSquare, newPiece));
            
            console.log('Created new promotion piece:', pieceId, 'on', targetSquare.id);
            return;
        }

        // Create the piece ID and get the path
        const pieceId = promotionPiece + gamePiece.color;
        const piecePath = this.chessboard.pieceService.getPiecePath(pieceId);
        
        console.log('Transforming piece to:', pieceId, 'with path:', piecePath);

        // Use the new smooth transformation animation
        currentPiece.transformTo(
            promotionPiece,
            piecePath,
            300, // Duration of the transformation animation
            () => {
                // After transformation, set up drag functionality
                const dragFunction = this.chessboard._createDragFunction.bind(this.chessboard);
                currentPiece.setDrag(dragFunction(targetSquare, currentPiece));
                
                // Ensure hints are properly updated after promotion
                if (this.config.hints && this.chessboard.moveService) {
                    setTimeout(() => {
                        this.chessboard.moveService.clearCache();
                    }, 100);
                }
                
                console.log('Successfully transformed piece on', targetSquare.id, 'to', pieceId);
            }
        );
    }

    /**
     * Sets the clicked square
     * @param {Square|null} square - Square to set as clicked
     */
    setClicked(square) {
        this.clicked = square;
    }

    /**
     * Gets the currently clicked square
     * @returns {Square|null} Currently clicked square
     */
    getClicked() {
        return this.clicked;
    }

    /**
     * Sets the promotion state
     * @param {string|boolean} promotion - Promotion piece type or false
     */
    setPromoting(promotion) {
        this.promoting = promotion;
    }

    /**
     * Gets the promotion state
     * @returns {string|boolean} Current promotion state
     */
    getPromoting() {
        return this.promoting;
    }

    /**
     * Sets the animation state
     * @param {boolean} isAnimating - Whether animations are in progress
     */
    setAnimating(isAnimating) {
        this.isAnimating = isAnimating;
    }

    /**
     * Gets the animation state
     * @returns {boolean} Whether animations are in progress
     */
    getAnimating() {
        return this.isAnimating;
    }

    /**
     * Removes all existing event listeners
     */
    removeListeners() {
        this.eventListeners.forEach((listeners, squareId) => {
            listeners.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
        });
        
        this.eventListeners.clear();
    }

    /**
     * Removes all event listeners
     */
    removeAllListeners() {
        this.eventListeners.forEach((listeners, squareId) => {
            listeners.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
        });
        
        this.eventListeners.clear();
    }

    /**
     * Cleans up resources
     */
    destroy() {
        this.removeAllListeners();
        this.clicked = null;
        this.promoting = false;
        this.isAnimating = false;
    }
}

/**
 * Service for managing chess moves and move validation
 * @module services/MoveService
 * @since 2.0.0
 */


/**
 * Service responsible for move management and validation
 * @class
 */
class MoveService {
    /**
     * Creates a new MoveService instance
     * @param {ChessboardConfig} config - Board configuration
     * @param {PositionService} positionService - Position service instance
     */
    constructor(config, positionService) {
        this.config = config;
        this.positionService = positionService;
        this._movesCache = new Map();
        this._cacheTimeout = null;
    }

    /**
     * Checks if a piece on a square can move
     * @param {Square} square - Square to check
     * @returns {boolean} True if piece can move
     */
    canMove(square) {
        if (!square.piece) return false;
        
        const { movableColors, onlyLegalMoves } = this.config;
        
        if (movableColors === 'none') return false;
        if (movableColors === 'w' && square.piece.color === 'b') return false;
        if (movableColors === 'b' && square.piece.color === 'w') return false;
        
        if (!onlyLegalMoves) return true;
        
        const game = this.positionService.getGame();
        return square.piece.color === game.turn();
    }

    /**
     * Converts various move formats to a Move instance
     * @param {string|Move} move - Move in various formats
     * @param {Object} squares - All board squares
     * @returns {Move} Move instance
     * @throws {MoveError} When move format is invalid
     */
    convertMove(move, squares) {
        if (move instanceof Move$1) {
            return move;
        }
        
        if (typeof move === 'string' && move.length >= 4) {
            const fromId = move.slice(0, 2);
            const toId = move.slice(2, 4);
            const promotion = move.slice(4, 5) || null;
            
            if (!squares[fromId] || !squares[toId]) {
                throw new MoveError(ERROR_MESSAGES.invalid_move_format, fromId, toId);
            }
            
            return new Move$1(squares[fromId], squares[toId], promotion);
        }
        
        throw new MoveError(ERROR_MESSAGES.invalid_move_format, 'unknown', 'unknown');
    }

    /**
     * Checks if a move is legal
     * @param {Move} move - Move to check
     * @returns {boolean} True if move is legal
     */
    isLegalMove(move) {
        const legalMoves = this.getLegalMoves(move.from.id);
        
        return legalMoves.some(legalMove => 
            legalMove.to === move.to.id && 
            move.promotion === legalMove.promotion
        );
    }

    /**
     * Gets all legal moves for a square or the entire position
     * @param {string} [from] - Square to get moves from (optional)
     * @param {boolean} [verbose=true] - Whether to return verbose move objects
     * @returns {Array} Array of legal moves
     */
    getLegalMoves(from = null, verbose = true) {
        const game = this.positionService.getGame();
        
        if (!game) return [];
        
        const options = { verbose };
        if (from) {
            options.square = from;
        }
        
        return game.moves(options);
    }

    /**
     * Gets legal moves with caching for performance
     * @param {Square} square - Square to get moves from
     * @returns {Array} Array of legal moves
     */
    getCachedLegalMoves(square) {
        const game = this.positionService.getGame();
        if (!game) return [];
        
        const cacheKey = `${square.id}-${game.fen()}`;
        let moves = this._movesCache.get(cacheKey);
        
        if (!moves) {
            moves = game.moves({ square: square.id, verbose: true });
            this._movesCache.set(cacheKey, moves);
            
            // Clear cache after a short delay to prevent memory buildup
            if (this._cacheTimeout) {
                clearTimeout(this._cacheTimeout);
            }
            
            this._cacheTimeout = setTimeout(() => {
                this._movesCache.clear();
            }, 1000);
        }
        
        return moves;
    }

    /**
     * Executes a move on the game
     * @param {Move} move - Move to execute
     * @returns {Object|null} Move result from chess.js or null if invalid
     */
    executeMove(move) {
        const game = this.positionService.getGame();
        if (!game) return null;
        
        const moveOptions = {
            from: move.from.id,
            to: move.to.id
        };
        
        console.log('executeMove - move.promotion:', move.promotion);
        console.log('executeMove - move.hasPromotion():', move.hasPromotion());
        
        if (move.hasPromotion()) {
            moveOptions.promotion = move.promotion;
        }
        
        console.log('executeMove - moveOptions:', moveOptions);
        
        const result = game.move(moveOptions);
        console.log('executeMove - result:', result);
        
        // Check what's actually on the board after the move
        if (result) {
            const pieceOnDestination = game.get(move.to.id);
            console.log('executeMove - piece on destination after move:', pieceOnDestination);
        }
        
        return result;
    }

    /**
     * Checks if a move requires promotion
     * @param {Move} move - Move to check
     * @returns {boolean} True if promotion is required
     */
    requiresPromotion(move) {
        console.log('Checking if move requires promotion:', move.from.id, '->', move.to.id);
        
        if (!this.config.onlyLegalMoves) {
            console.log('Not in legal moves mode, no promotion required');
            return false;
        }
        
        const game = this.positionService.getGame();
        if (!game) {
            console.log('No game instance available');
            return false;
        }
        
        const piece = game.get(move.from.id);
        if (!piece || piece.type !== 'p') {
            console.log('Not a pawn move, no promotion required');
            return false;
        }
        
        const targetRank = move.to.row;
        if (targetRank !== 1 && targetRank !== 8) {
            console.log('Not reaching promotion rank, no promotion required');
            return false;
        }
        
        console.log('Pawn reaching promotion rank, validating move...');
        
        // Additional validation: check if the pawn can actually reach this square
        if (!this._isPawnMoveValid(move.from, move.to, piece.color)) {
            console.log('Pawn move not valid, no promotion required');
            return false;
        }
        
        // First check if the move is legal without promotion
        const simpleMoveObj = {
            from: move.from.id,
            to: move.to.id
        };
        
        try {
            console.log('Testing move without promotion:', simpleMoveObj);
            // Test if the move is legal without promotion first
            const testMove = game.move(simpleMoveObj);
            if (testMove) {
                // Move was successful, but check if it was a promotion
                const wasPromotion = testMove.promotion;
                
                // Undo the test move
                game.undo();
                
                console.log('Move successful without promotion, was promotion:', wasPromotion !== undefined);
                
                // If it was a promotion, return true
                return wasPromotion !== undefined;
            }
        } catch (error) {
            console.log('Move failed without promotion, trying with promotion:', error.message);
            
            // If simple move fails, try with promotion
            const promotionMoveObj = {
                from: move.from.id,
                to: move.to.id,
                promotion: 'q' // test with queen
            };
            
            try {
                console.log('Testing move with promotion:', promotionMoveObj);
                const testMove = game.move(promotionMoveObj);
                if (testMove) {
                    // Undo the test move
                    game.undo();
                    console.log('Move successful with promotion, promotion required');
                    return true;
                }
            } catch (promotionError) {
                console.log('Move failed even with promotion:', promotionError.message);
                // Move is not legal even with promotion
                return false;
            }
        }
        
        console.log('Move validation complete, no promotion required');
        return false;
    }

    /**
     * Validates if a pawn move is theoretically possible
     * @private
     * @param {Square} from - Source square
     * @param {Square} to - Target square
     * @param {string} color - Pawn color ('w' or 'b')
     * @returns {boolean} True if the move is valid for a pawn
     */
    _isPawnMoveValid(from, to, color) {
        const fromRank = from.row;
        const toRank = to.row;
        const fromFile = from.col;
        const toFile = to.col;
        
        console.log(`Validating pawn move: ${from.id} -> ${to.id} (${color})`);
        console.log(`Ranks: ${fromRank} -> ${toRank}, Files: ${fromFile} -> ${toFile}`);
        
        // Direction of pawn movement
        const direction = color === 'w' ? 1 : -1;
        const rankDiff = toRank - fromRank;
        const fileDiff = Math.abs(toFile - fromFile);
        
        // Pawn can only move forward
        if (rankDiff * direction <= 0) {
            console.log('Invalid: Pawn cannot move backward or stay in place');
            return false;
        }
        
        // Pawn can only move 1 rank at a time (except for double move from starting position)
        if (Math.abs(rankDiff) > 2) {
            console.log('Invalid: Pawn cannot move more than 2 ranks');
            return false;
        }
        
        // If moving 2 ranks, must be from starting position
        if (Math.abs(rankDiff) === 2) {
            const startingRank = color === 'w' ? 2 : 7;
            if (fromRank !== startingRank) {
                console.log(`Invalid: Pawn cannot move 2 ranks from rank ${fromRank}`);
                return false;
            }
        }
        
        // Pawn can only move to adjacent files (diagonal capture) or same file (forward move)
        if (fileDiff > 1) {
            console.log('Invalid: Pawn cannot move more than 1 file');
            return false;
        }
        
        console.log('Pawn move validation passed');
        return true;
    }

    /**
     * Handles promotion UI setup
     * @param {Move} move - Move requiring promotion
     * @param {Object} squares - All board squares
     * @param {Function} onPromotionSelect - Callback when promotion piece is selected
     * @param {Function} onPromotionCancel - Callback when promotion is cancelled
     * @returns {boolean} True if promotion UI was set up
     */
    setupPromotion(move, squares, onPromotionSelect, onPromotionCancel) {
        if (!this.requiresPromotion(move)) return false;
        
        const game = this.positionService.getGame();
        const piece = game.get(move.from.id);
        const targetSquare = move.to;
        
        // Clear any existing promotion UI
        Object.values(squares).forEach(square => {
            square.removePromotion();
            square.removeCover();
        });
        
        // Always show promotion choices in a column
        this._showPromotionInColumn(targetSquare, piece, squares, onPromotionSelect, onPromotionCancel);
        
        return true;
    }
    
    /**
     * Shows promotion choices in a column
     * @private
     */
    _showPromotionInColumn(targetSquare, piece, squares, onPromotionSelect, onPromotionCancel) {
        console.log('Setting up promotion for', targetSquare.id, 'piece color:', piece.color);
        
        // Set up promotion choices starting from border row
        PROMOTION_PIECES.forEach((pieceType, index) => {
            const choiceSquare = this._findPromotionSquare(targetSquare, index, squares);
            
            if (choiceSquare) {
                const pieceId = pieceType + piece.color;
                const piecePath = this._getPiecePathForPromotion(pieceId);
                
                console.log('Setting up promotion choice:', pieceType, 'on square:', choiceSquare.id);
                
                choiceSquare.putPromotion(piecePath, () => {
                    console.log('Promotion choice selected:', pieceType);
                    onPromotionSelect(pieceType);
                });
            } else {
                console.log('Could not find square for promotion choice:', pieceType, 'index:', index);
            }
        });
        
        // Set up cover squares (for cancellation)
        Object.values(squares).forEach(square => {
            if (!square.hasPromotion()) {
                square.putCover(() => {
                    onPromotionCancel();
                });
            }
        });
        
        return true;
    }

    /**
     * Finds the appropriate square for a promotion piece
     * @private
     * @param {Square} targetSquare - Target square of the promotion move
     * @param {number} distance - Distance from target square
     * @param {Object} squares - All board squares
     * @returns {Square|null} Square for promotion piece or null
     */
    _findPromotionSquare(targetSquare, index, squares) {
        const col = targetSquare.col;
        const baseRow = targetSquare.row;
        
        console.log('Looking for promotion square - target:', targetSquare.id, 'index:', index, 'col:', col, 'baseRow:', baseRow);
        
        // Calculate row based on index and promotion direction
        // Start from the border row (1 or 8) and go inward
        let row;
        if (baseRow === 8) {
            // White promotion: start from row 8 and go down
            row = 8 - index;
        } else if (baseRow === 1) {
            // Black promotion: start from row 1 and go up
            row = 1 + index;
        } else {
            console.log('Invalid promotion row:', baseRow);
            return null;
        }
        
        console.log('Calculated row:', row);
        
        // Ensure row is within bounds
        if (row < 1 || row > 8) {
            console.log('Row out of bounds:', row);
            return null;
        }
        
        // Find square by row/col
        for (const square of Object.values(squares)) {
            if (square.col === col && square.row === row) {
                console.log('Found promotion square:', square.id);
                return square;
            }
        }
        
        console.log('No square found for col:', col, 'row:', row);
        return null;
    }

    /**
     * Gets piece path for promotion UI
     * @private
     * @param {string} pieceId - Piece identifier
     * @returns {string} Path to piece asset
     */
    _getPiecePathForPromotion(pieceId) {
        // This would typically use the PieceService
        // For now, we'll use a simple implementation
        const { piecesPath } = this.config;
        
        if (typeof piecesPath === 'string') {
            return `${piecesPath}/${pieceId}.svg`;
        }
        
        // Fallback for other path types
        return `assets/pieces/${pieceId}.svg`;
    }

    /**
     * Clears the moves cache
     */
    clearCache() {
        this._movesCache.clear();
        if (this._cacheTimeout) {
            clearTimeout(this._cacheTimeout);
            this._cacheTimeout = null;
        }
    }

    /**
     * Cleans up resources
     */
    destroy() {
        this.clearCache();
        this.positionService = null;
    }
}

/**
 * Service for managing chess pieces and their operations
 * @module services/PieceService
 * @since 2.0.0
 */


/**
 * Service responsible for piece management and operations
 * @class
 */
class PieceService {
    /**
     * Creates a new PieceService instance
     * @param {ChessboardConfig} config - Board configuration
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Gets the path to a piece asset
     * @param {string} piece - Piece identifier (e.g., 'wK', 'bP')
     * @returns {string} Path to piece asset
     * @throws {ValidationError} When piecesPath configuration is invalid
     */
    getPiecePath(piece) {
        const { piecesPath } = this.config;
        
        if (typeof piecesPath === 'string') {
            return `${piecesPath}/${piece}.svg`;
        } else if (typeof piecesPath === 'object' && piecesPath !== null) {
            return piecesPath[piece];
        } else if (typeof piecesPath === 'function') {
            return piecesPath(piece);
        } else {
            throw new ValidationError(ERROR_MESSAGES.invalid_piecesPath, 'piecesPath', piecesPath);
        }
    }

    /**
     * Converts various piece formats to a Piece instance
     * @param {string|Piece} piece - Piece in various formats
     * @returns {Piece} Piece instance
     * @throws {PieceError} When piece format is invalid
     */
    convertPiece(piece) {
        if (piece instanceof Piece) {
            return piece;
        }
        
        if (typeof piece === 'string' && piece.length === 2) {
            const [type, color] = piece.split('');
            const piecePath = this.getPiecePath(piece);
            return new Piece(color, type, piecePath);
        }
        
        throw new PieceError(ERROR_MESSAGES.invalid_piece + piece, piece);
    }

    /**
     * Adds a piece to a square with optional fade-in animation
     * @param {Square} square - Target square
     * @param {Piece} piece - Piece to add
     * @param {boolean} [fade=true] - Whether to fade in the piece
     * @param {Function} dragFunction - Function to handle drag events
     */
    addPieceOnSquare(square, piece, fade = true, dragFunction) {
        square.putPiece(piece);
        
        if (dragFunction) {
            piece.setDrag(dragFunction(square, piece));
        }

        if (fade) {
            piece.fadeIn(
                this.config.fadeTime,
                this.config.fadeAnimation,
                this._getTransitionTimingFunction()
            );
        }

        piece.visible();
    }

    /**
     * Removes a piece from a square with optional fade-out animation
     * @param {Square} square - Source square
     * @param {boolean} [fade=true] - Whether to fade out the piece
     * @returns {Piece} The removed piece
     * @throws {PieceError} When square has no piece to remove
     */
    removePieceFromSquare(square, fade = true) {
        square.check();
        
        const piece = square.piece;
        if (!piece) {
            throw new PieceError(ERROR_MESSAGES.square_no_piece, null, square.getId());
        }

        if (fade) {
            piece.fadeOut(
                this.config.fadeTime,
                this.config.fadeAnimation,
                this._getTransitionTimingFunction()
            );
        }

        square.removePiece();
        return piece;
    }

    /**
     * Moves a piece to a new position with animation
     * @param {Piece} piece - Piece to move
     * @param {Square} targetSquare - Target square
     * @param {number} duration - Animation duration
     * @param {Function} [callback] - Callback function when animation completes
     */
    movePiece(piece, targetSquare, duration, callback) {
        if (!piece) {
            console.warn('PieceService.movePiece: piece is null, skipping animation');
            if (callback) callback();
            return;
        }
        
        piece.translate(
            targetSquare, 
            duration, 
            this._getTransitionTimingFunction(), 
            this.config.moveAnimation, 
            callback
        );
    }

    /**
     * Handles piece translation with optional capture
     * @param {Move} move - Move object containing from/to squares and piece
     * @param {boolean} removeTarget - Whether to remove piece from target square
     * @param {boolean} animate - Whether to animate the move
     * @param {Function} [dragFunction] - Function to create drag handlers
     * @param {Function} [callback] - Callback function when complete
     */
    translatePiece(move, removeTarget, animate, dragFunction = null, callback = null) {
        if (!move.piece) {
            console.warn('PieceService.translatePiece: move.piece is null, skipping translation');
            if (callback) callback();
            return;
        }

        if (removeTarget) {
            // Deselect the captured piece before removing it
            move.to.deselect();
            this.removePieceFromSquare(move.to, false);
        }

        const changeSquareCallback = () => {
            // Check if piece still exists and is on the source square
            if (move.from.piece === move.piece) {
                move.from.removePiece();
            }
            
            // Only put piece if destination square doesn't already have it
            if (move.to.piece !== move.piece) {
                move.to.putPiece(move.piece);
                
                // Re-attach drag handler if provided
                if (dragFunction && this.config.draggable) {
                    move.piece.setDrag(dragFunction(move.to, move.piece));
                }
            }
            
            if (callback) callback();
        };

        // Check if piece is currently being dragged
        const isDragging = move.piece.element.classList.contains('dragging');
        
        if (isDragging) {
            // If piece is being dragged, don't animate - just move it immediately
            // The piece is already visually in the correct position from the drag
            changeSquareCallback();
        } else {
            // Normal animation
            const duration = animate ? this.config.moveTime : 0;
            this.movePiece(move.piece, move.to, duration, changeSquareCallback);
        }
    }

    /**
     * Snaps a piece back to its original position
     * @param {Square} square - Square containing the piece
     * @param {boolean} [animate=true] - Whether to animate the snapback
     */
    snapbackPiece(square, animate = true) {
        if (!square || !square.piece) {
            return;
        }
        
        const piece = square.piece;
        const duration = animate ? this.config.snapbackTime : 0;
        
        piece.translate(
            square, 
            duration, 
            this._getTransitionTimingFunction(), 
            this.config.snapbackAnimation
        );
    }

    /**
     * Centers a piece in its square with animation (after successful drop)
     * @param {Square} square - Square containing the piece to center
     * @param {boolean} animate - Whether to animate the centering
     */
    centerPiece(square, animate = true) {
        if (!square || !square.piece) {
            return;
        }
        
        const piece = square.piece;
        const duration = animate ? this.config.dropCenterTime : 0;
        
        piece.translate(
            square, 
            duration, 
            this._getTransitionTimingFunction(), 
            this.config.dropCenterAnimation,
            () => {
                // After animation, reset all drag-related styles
                piece.element.style.position = '';
                piece.element.style.left = '';
                piece.element.style.top = '';
                piece.element.style.transform = '';
                piece.element.style.zIndex = '';
            }
        );
    }

    /**
     * Gets the transition timing function for animations
     * @private
     * @returns {Function} Timing function
     */
    _getTransitionTimingFunction() {
        return (elapsed, duration, type = 'ease') => {
            const x = elapsed / duration;
            
            switch (type) {
                case 'linear':
                    return x;
                case 'ease':
                    return (x ** 2) * (3 - 2 * x);
                case 'ease-in':
                    return x ** 2;
                case 'ease-out':
                    return -1 * (x - 1) ** 2 + 1;
                case 'ease-in-out':
                    return (x < 0.5) ? 2 * x ** 2 : 4 * x - 2 * x ** 2 - 1;
                default:
                    return x;
            }
        };
    }

    /**
     * Cleans up resources
     */
    destroy() {
        // Cleanup any cached pieces or references
    }
}

/**
 * @license
 * Copyright (c) 2025, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
const WHITE = 'w';
const BLACK = 'b';
const PAWN = 'p';
const KNIGHT = 'n';
const BISHOP = 'b';
const ROOK = 'r';
const QUEEN = 'q';
const KING = 'k';
const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
class Move {
    color;
    from;
    to;
    piece;
    captured;
    promotion;
    /**
     * @deprecated This field is deprecated and will be removed in version 2.0.0.
     * Please use move descriptor functions instead: `isCapture`, `isPromotion`,
     * `isEnPassant`, `isKingsideCastle`, `isQueensideCastle`, `isCastle`, and
     * `isBigPawn`
     */
    flags;
    san;
    lan;
    before;
    after;
    constructor(chess, internal) {
        const { color, piece, from, to, flags, captured, promotion } = internal;
        const fromAlgebraic = algebraic(from);
        const toAlgebraic = algebraic(to);
        this.color = color;
        this.piece = piece;
        this.from = fromAlgebraic;
        this.to = toAlgebraic;
        /*
         * HACK: The chess['_method']() calls below invoke private methods in the
         * Chess class to generate SAN and FEN. It's a bit of a hack, but makes the
         * code cleaner elsewhere.
         */
        this.san = chess['_moveToSan'](internal, chess['_moves']({ legal: true }));
        this.lan = fromAlgebraic + toAlgebraic;
        this.before = chess.fen();
        // Generate the FEN for the 'after' key
        chess['_makeMove'](internal);
        this.after = chess.fen();
        chess['_undoMove']();
        // Build the text representation of the move flags
        this.flags = '';
        for (const flag in BITS) {
            if (BITS[flag] & flags) {
                this.flags += FLAGS[flag];
            }
        }
        if (captured) {
            this.captured = captured;
        }
        if (promotion) {
            this.promotion = promotion;
            this.lan += promotion;
        }
    }
    isCapture() {
        return this.flags.indexOf(FLAGS['CAPTURE']) > -1;
    }
    isPromotion() {
        return this.flags.indexOf(FLAGS['PROMOTION']) > -1;
    }
    isEnPassant() {
        return this.flags.indexOf(FLAGS['EP_CAPTURE']) > -1;
    }
    isKingsideCastle() {
        return this.flags.indexOf(FLAGS['KSIDE_CASTLE']) > -1;
    }
    isQueensideCastle() {
        return this.flags.indexOf(FLAGS['QSIDE_CASTLE']) > -1;
    }
    isBigPawn() {
        return this.flags.indexOf(FLAGS['BIG_PAWN']) > -1;
    }
}
const EMPTY = -1;
const FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q',
};
const BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64,
};
/*
 * NOTES ABOUT 0x88 MOVE GENERATION ALGORITHM
 * ----------------------------------------------------------------------------
 * From https://github.com/jhlywa/chess.js/issues/230
 *
 * A lot of people are confused when they first see the internal representation
 * of chess.js. It uses the 0x88 Move Generation Algorithm which internally
 * stores the board as an 8x16 array. This is purely for efficiency but has a
 * couple of interesting benefits:
 *
 * 1. 0x88 offers a very inexpensive "off the board" check. Bitwise AND (&) any
 *    square with 0x88, if the result is non-zero then the square is off the
 *    board. For example, assuming a knight square A8 (0 in 0x88 notation),
 *    there are 8 possible directions in which the knight can move. These
 *    directions are relative to the 8x16 board and are stored in the
 *    PIECE_OFFSETS map. One possible move is A8 - 18 (up one square, and two
 *    squares to the left - which is off the board). 0 - 18 = -18 & 0x88 = 0x88
 *    (because of two-complement representation of -18). The non-zero result
 *    means the square is off the board and the move is illegal. Take the
 *    opposite move (from A8 to C7), 0 + 18 = 18 & 0x88 = 0. A result of zero
 *    means the square is on the board.
 *
 * 2. The relative distance (or difference) between two squares on a 8x16 board
 *    is unique and can be used to inexpensively determine if a piece on a
 *    square can attack any other arbitrary square. For example, let's see if a
 *    pawn on E7 can attack E2. The difference between E7 (20) - E2 (100) is
 *    -80. We add 119 to make the ATTACKS array index non-negative (because the
 *    worst case difference is A8 - H1 = -119). The ATTACKS array contains a
 *    bitmask of pieces that can attack from that distance and direction.
 *    ATTACKS[-80 + 119=39] gives us 24 or 0b11000 in binary. Look at the
 *    PIECE_MASKS map to determine the mask for a given piece type. In our pawn
 *    example, we would check to see if 24 & 0x1 is non-zero, which it is
 *    not. So, naturally, a pawn on E7 can't attack a piece on E2. However, a
 *    rook can since 24 & 0x8 is non-zero. The only thing left to check is that
 *    there are no blocking pieces between E7 and E2. That's where the RAYS
 *    array comes in. It provides an offset (in this case 16) to add to E7 (20)
 *    to check for blocking pieces. E7 (20) + 16 = E6 (36) + 16 = E5 (52) etc.
 */
// prettier-ignore
// eslint-disable-next-line
const Ox88 = {
    a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
    a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
    a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
    a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
    a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
    a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
    a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};
const PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15],
};
const PIECE_OFFSETS = {
    n: [-18, -33, -31, -14, 18, 33, 31, 14],
    b: [-17, -15, 17, 15],
    r: [-16, 1, 16, -1],
    q: [-17, -16, -15, 1, 17, 16, 15, -1],
    k: [-17, -16, -15, 1, 17, 16, 15, -1],
};
// prettier-ignore
const ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0,
    0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
    0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
    0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
    0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0,
    0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
    0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
    0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
    0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20
];
// prettier-ignore
const RAYS = [
    17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0,
    0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0,
    0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0,
    0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0,
    0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0,
    0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0,
    0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0,
    0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0,
    0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0,
    -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17
];
const PIECE_MASKS = { p: 0x1, n: 0x2, b: 0x4, r: 0x8, q: 0x10, k: 0x20 };
const SYMBOLS = 'pnbrqkPNBRQK';
const PROMOTIONS = [KNIGHT, BISHOP, ROOK, QUEEN];
const RANK_1 = 7;
const RANK_2 = 6;
/*
 * const RANK_3 = 5
 * const RANK_4 = 4
 * const RANK_5 = 3
 * const RANK_6 = 2
 */
const RANK_7 = 1;
const RANK_8 = 0;
const SIDES = {
    [KING]: BITS.KSIDE_CASTLE,
    [QUEEN]: BITS.QSIDE_CASTLE,
};
const ROOKS = {
    w: [
        { square: Ox88.a1, flag: BITS.QSIDE_CASTLE },
        { square: Ox88.h1, flag: BITS.KSIDE_CASTLE },
    ],
    b: [
        { square: Ox88.a8, flag: BITS.QSIDE_CASTLE },
        { square: Ox88.h8, flag: BITS.KSIDE_CASTLE },
    ],
};
const SECOND_RANK = { b: RANK_7, w: RANK_2 };
const TERMINATION_MARKERS = ['1-0', '0-1', '1/2-1/2', '*'];
// Extracts the zero-based rank of an 0x88 square.
function rank(square) {
    return square >> 4;
}
// Extracts the zero-based file of an 0x88 square.
function file(square) {
    return square & 0xf;
}
function isDigit(c) {
    return '0123456789'.indexOf(c) !== -1;
}
// Converts a 0x88 square to algebraic notation.
function algebraic(square) {
    const f = file(square);
    const r = rank(square);
    return ('abcdefgh'.substring(f, f + 1) +
        '87654321'.substring(r, r + 1));
}
function swapColor(color) {
    return color === WHITE ? BLACK : WHITE;
}
function validateFen(fen) {
    // 1st criterion: 6 space-seperated fields?
    const tokens = fen.split(/\s+/);
    if (tokens.length !== 6) {
        return {
            ok: false,
            error: 'Invalid FEN: must contain six space-delimited fields',
        };
    }
    // 2nd criterion: move number field is a integer value > 0?
    const moveNumber = parseInt(tokens[5], 10);
    if (isNaN(moveNumber) || moveNumber <= 0) {
        return {
            ok: false,
            error: 'Invalid FEN: move number must be a positive integer',
        };
    }
    // 3rd criterion: half move counter is an integer >= 0?
    const halfMoves = parseInt(tokens[4], 10);
    if (isNaN(halfMoves) || halfMoves < 0) {
        return {
            ok: false,
            error: 'Invalid FEN: half move counter number must be a non-negative integer',
        };
    }
    // 4th criterion: 4th field is a valid e.p.-string?
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
        return { ok: false, error: 'Invalid FEN: en-passant square is invalid' };
    }
    // 5th criterion: 3th field is a valid castle-string?
    if (/[^kKqQ-]/.test(tokens[2])) {
        return { ok: false, error: 'Invalid FEN: castling availability is invalid' };
    }
    // 6th criterion: 2nd field is "w" (white) or "b" (black)?
    if (!/^(w|b)$/.test(tokens[1])) {
        return { ok: false, error: 'Invalid FEN: side-to-move is invalid' };
    }
    // 7th criterion: 1st field contains 8 rows?
    const rows = tokens[0].split('/');
    if (rows.length !== 8) {
        return {
            ok: false,
            error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows",
        };
    }
    // 8th criterion: every row is valid?
    for (let i = 0; i < rows.length; i++) {
        // check for right sum of fields AND not two numbers in succession
        let sumFields = 0;
        let previousWasNumber = false;
        for (let k = 0; k < rows[i].length; k++) {
            if (isDigit(rows[i][k])) {
                if (previousWasNumber) {
                    return {
                        ok: false,
                        error: 'Invalid FEN: piece data is invalid (consecutive number)',
                    };
                }
                sumFields += parseInt(rows[i][k], 10);
                previousWasNumber = true;
            }
            else {
                if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
                    return {
                        ok: false,
                        error: 'Invalid FEN: piece data is invalid (invalid piece)',
                    };
                }
                sumFields += 1;
                previousWasNumber = false;
            }
        }
        if (sumFields !== 8) {
            return {
                ok: false,
                error: 'Invalid FEN: piece data is invalid (too many squares in rank)',
            };
        }
    }
    // 9th criterion: is en-passant square legal?
    if ((tokens[3][1] == '3' && tokens[1] == 'w') ||
        (tokens[3][1] == '6' && tokens[1] == 'b')) {
        return { ok: false, error: 'Invalid FEN: illegal en-passant square' };
    }
    // 10th criterion: does chess position contain exact two kings?
    const kings = [
        { color: 'white', regex: /K/g },
        { color: 'black', regex: /k/g },
    ];
    for (const { color, regex } of kings) {
        if (!regex.test(tokens[0])) {
            return { ok: false, error: `Invalid FEN: missing ${color} king` };
        }
        if ((tokens[0].match(regex) || []).length > 1) {
            return { ok: false, error: `Invalid FEN: too many ${color} kings` };
        }
    }
    // 11th criterion: are any pawns on the first or eighth rows?
    if (Array.from(rows[0] + rows[7]).some((char) => char.toUpperCase() === 'P')) {
        return {
            ok: false,
            error: 'Invalid FEN: some pawns are on the edge rows',
        };
    }
    return { ok: true };
}
// this function is used to uniquely identify ambiguous moves
function getDisambiguator(move, moves) {
    const from = move.from;
    const to = move.to;
    const piece = move.piece;
    let ambiguities = 0;
    let sameRank = 0;
    let sameFile = 0;
    for (let i = 0, len = moves.length; i < len; i++) {
        const ambigFrom = moves[i].from;
        const ambigTo = moves[i].to;
        const ambigPiece = moves[i].piece;
        /*
         * if a move of the same piece type ends on the same to square, we'll need
         * to add a disambiguator to the algebraic notation
         */
        if (piece === ambigPiece && from !== ambigFrom && to === ambigTo) {
            ambiguities++;
            if (rank(from) === rank(ambigFrom)) {
                sameRank++;
            }
            if (file(from) === file(ambigFrom)) {
                sameFile++;
            }
        }
    }
    if (ambiguities > 0) {
        if (sameRank > 0 && sameFile > 0) {
            /*
             * if there exists a similar moving piece on the same rank and file as
             * the move in question, use the square as the disambiguator
             */
            return algebraic(from);
        }
        else if (sameFile > 0) {
            /*
             * if the moving piece rests on the same file, use the rank symbol as the
             * disambiguator
             */
            return algebraic(from).charAt(1);
        }
        else {
            // else use the file symbol
            return algebraic(from).charAt(0);
        }
    }
    return '';
}
function addMove(moves, color, from, to, piece, captured = undefined, flags = BITS.NORMAL) {
    const r = rank(to);
    if (piece === PAWN && (r === RANK_1 || r === RANK_8)) {
        for (let i = 0; i < PROMOTIONS.length; i++) {
            const promotion = PROMOTIONS[i];
            moves.push({
                color,
                from,
                to,
                piece,
                captured,
                promotion,
                flags: flags | BITS.PROMOTION,
            });
        }
    }
    else {
        moves.push({
            color,
            from,
            to,
            piece,
            captured,
            flags,
        });
    }
}
function inferPieceType(san) {
    let pieceType = san.charAt(0);
    if (pieceType >= 'a' && pieceType <= 'h') {
        const matches = san.match(/[a-h]\d.*[a-h]\d/);
        if (matches) {
            return undefined;
        }
        return PAWN;
    }
    pieceType = pieceType.toLowerCase();
    if (pieceType === 'o') {
        return KING;
    }
    return pieceType;
}
// parses all of the decorators out of a SAN string
function strippedSan(move) {
    return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '');
}
function trimFen(fen) {
    /*
     * remove last two fields in FEN string as they're not needed when checking
     * for repetition
     */
    return fen.split(' ').slice(0, 4).join(' ');
}
class Chess {
    _board = new Array(128);
    _turn = WHITE;
    _header = {};
    _kings = { w: EMPTY, b: EMPTY };
    _epSquare = -1;
    _halfMoves = 0;
    _moveNumber = 0;
    _history = [];
    _comments = {};
    _castling = { w: 0, b: 0 };
    // tracks number of times a position has been seen for repetition checking
    _positionCount = {};
    constructor(fen = DEFAULT_POSITION) {
        this.load(fen);
    }
    clear({ preserveHeaders = false } = {}) {
        this._board = new Array(128);
        this._kings = { w: EMPTY, b: EMPTY };
        this._turn = WHITE;
        this._castling = { w: 0, b: 0 };
        this._epSquare = EMPTY;
        this._halfMoves = 0;
        this._moveNumber = 1;
        this._history = [];
        this._comments = {};
        this._header = preserveHeaders ? this._header : {};
        this._positionCount = {};
        /*
         * Delete the SetUp and FEN headers (if preserved), the board is empty and
         * these headers don't make sense in this state. They'll get added later
         * via .load() or .put()
         */
        delete this._header['SetUp'];
        delete this._header['FEN'];
    }
    load(fen, { skipValidation = false, preserveHeaders = false } = {}) {
        let tokens = fen.split(/\s+/);
        // append commonly omitted fen tokens
        if (tokens.length >= 2 && tokens.length < 6) {
            const adjustments = ['-', '-', '0', '1'];
            fen = tokens.concat(adjustments.slice(-(6 - tokens.length))).join(' ');
        }
        tokens = fen.split(/\s+/);
        if (!skipValidation) {
            const { ok, error } = validateFen(fen);
            if (!ok) {
                throw new Error(error);
            }
        }
        const position = tokens[0];
        let square = 0;
        this.clear({ preserveHeaders });
        for (let i = 0; i < position.length; i++) {
            const piece = position.charAt(i);
            if (piece === '/') {
                square += 8;
            }
            else if (isDigit(piece)) {
                square += parseInt(piece, 10);
            }
            else {
                const color = piece < 'a' ? WHITE : BLACK;
                this._put({ type: piece.toLowerCase(), color }, algebraic(square));
                square++;
            }
        }
        this._turn = tokens[1];
        if (tokens[2].indexOf('K') > -1) {
            this._castling.w |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf('Q') > -1) {
            this._castling.w |= BITS.QSIDE_CASTLE;
        }
        if (tokens[2].indexOf('k') > -1) {
            this._castling.b |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf('q') > -1) {
            this._castling.b |= BITS.QSIDE_CASTLE;
        }
        this._epSquare = tokens[3] === '-' ? EMPTY : Ox88[tokens[3]];
        this._halfMoves = parseInt(tokens[4], 10);
        this._moveNumber = parseInt(tokens[5], 10);
        this._updateSetup(fen);
        this._incPositionCount(fen);
    }
    fen() {
        let empty = 0;
        let fen = '';
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            if (this._board[i]) {
                if (empty > 0) {
                    fen += empty;
                    empty = 0;
                }
                const { color, type: piece } = this._board[i];
                fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
            }
            else {
                empty++;
            }
            if ((i + 1) & 0x88) {
                if (empty > 0) {
                    fen += empty;
                }
                if (i !== Ox88.h1) {
                    fen += '/';
                }
                empty = 0;
                i += 8;
            }
        }
        let castling = '';
        if (this._castling[WHITE] & BITS.KSIDE_CASTLE) {
            castling += 'K';
        }
        if (this._castling[WHITE] & BITS.QSIDE_CASTLE) {
            castling += 'Q';
        }
        if (this._castling[BLACK] & BITS.KSIDE_CASTLE) {
            castling += 'k';
        }
        if (this._castling[BLACK] & BITS.QSIDE_CASTLE) {
            castling += 'q';
        }
        // do we have an empty castling flag?
        castling = castling || '-';
        let epSquare = '-';
        /*
         * only print the ep square if en passant is a valid move (pawn is present
         * and ep capture is not pinned)
         */
        if (this._epSquare !== EMPTY) {
            const bigPawnSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
            const squares = [bigPawnSquare + 1, bigPawnSquare - 1];
            for (const square of squares) {
                // is the square off the board?
                if (square & 0x88) {
                    continue;
                }
                const color = this._turn;
                // is there a pawn that can capture the epSquare?
                if (this._board[square]?.color === color &&
                    this._board[square]?.type === PAWN) {
                    // if the pawn makes an ep capture, does it leave it's king in check?
                    this._makeMove({
                        color,
                        from: square,
                        to: this._epSquare,
                        piece: PAWN,
                        captured: PAWN,
                        flags: BITS.EP_CAPTURE,
                    });
                    const isLegal = !this._isKingAttacked(color);
                    this._undoMove();
                    // if ep is legal, break and set the ep square in the FEN output
                    if (isLegal) {
                        epSquare = algebraic(this._epSquare);
                        break;
                    }
                }
            }
        }
        return [
            fen,
            this._turn,
            castling,
            epSquare,
            this._halfMoves,
            this._moveNumber,
        ].join(' ');
    }
    /*
     * Called when the initial board setup is changed with put() or remove().
     * modifies the SetUp and FEN properties of the header object. If the FEN
     * is equal to the default position, the SetUp and FEN are deleted the setup
     * is only updated if history.length is zero, ie moves haven't been made.
     */
    _updateSetup(fen) {
        if (this._history.length > 0)
            return;
        if (fen !== DEFAULT_POSITION) {
            this._header['SetUp'] = '1';
            this._header['FEN'] = fen;
        }
        else {
            delete this._header['SetUp'];
            delete this._header['FEN'];
        }
    }
    reset() {
        this.load(DEFAULT_POSITION);
    }
    get(square) {
        return this._board[Ox88[square]];
    }
    put({ type, color }, square) {
        if (this._put({ type, color }, square)) {
            this._updateCastlingRights();
            this._updateEnPassantSquare();
            this._updateSetup(this.fen());
            return true;
        }
        return false;
    }
    _put({ type, color }, square) {
        // check for piece
        if (SYMBOLS.indexOf(type.toLowerCase()) === -1) {
            return false;
        }
        // check for valid square
        if (!(square in Ox88)) {
            return false;
        }
        const sq = Ox88[square];
        // don't let the user place more than one king
        if (type == KING &&
            !(this._kings[color] == EMPTY || this._kings[color] == sq)) {
            return false;
        }
        const currentPieceOnSquare = this._board[sq];
        // if one of the kings will be replaced by the piece from args, set the `_kings` respective entry to `EMPTY`
        if (currentPieceOnSquare && currentPieceOnSquare.type === KING) {
            this._kings[currentPieceOnSquare.color] = EMPTY;
        }
        this._board[sq] = { type: type, color: color };
        if (type === KING) {
            this._kings[color] = sq;
        }
        return true;
    }
    remove(square) {
        const piece = this.get(square);
        delete this._board[Ox88[square]];
        if (piece && piece.type === KING) {
            this._kings[piece.color] = EMPTY;
        }
        this._updateCastlingRights();
        this._updateEnPassantSquare();
        this._updateSetup(this.fen());
        return piece;
    }
    _updateCastlingRights() {
        const whiteKingInPlace = this._board[Ox88.e1]?.type === KING &&
            this._board[Ox88.e1]?.color === WHITE;
        const blackKingInPlace = this._board[Ox88.e8]?.type === KING &&
            this._board[Ox88.e8]?.color === BLACK;
        if (!whiteKingInPlace ||
            this._board[Ox88.a1]?.type !== ROOK ||
            this._board[Ox88.a1]?.color !== WHITE) {
            this._castling.w &= -65;
        }
        if (!whiteKingInPlace ||
            this._board[Ox88.h1]?.type !== ROOK ||
            this._board[Ox88.h1]?.color !== WHITE) {
            this._castling.w &= -33;
        }
        if (!blackKingInPlace ||
            this._board[Ox88.a8]?.type !== ROOK ||
            this._board[Ox88.a8]?.color !== BLACK) {
            this._castling.b &= -65;
        }
        if (!blackKingInPlace ||
            this._board[Ox88.h8]?.type !== ROOK ||
            this._board[Ox88.h8]?.color !== BLACK) {
            this._castling.b &= -33;
        }
    }
    _updateEnPassantSquare() {
        if (this._epSquare === EMPTY) {
            return;
        }
        const startSquare = this._epSquare + (this._turn === WHITE ? -16 : 16);
        const currentSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
        const attackers = [currentSquare + 1, currentSquare - 1];
        if (this._board[startSquare] !== null ||
            this._board[this._epSquare] !== null ||
            this._board[currentSquare]?.color !== swapColor(this._turn) ||
            this._board[currentSquare]?.type !== PAWN) {
            this._epSquare = EMPTY;
            return;
        }
        const canCapture = (square) => !(square & 0x88) &&
            this._board[square]?.color === this._turn &&
            this._board[square]?.type === PAWN;
        if (!attackers.some(canCapture)) {
            this._epSquare = EMPTY;
        }
    }
    _attacked(color, square, verbose) {
        const attackers = [];
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            // did we run off the end of the board
            if (i & 0x88) {
                i += 7;
                continue;
            }
            // if empty square or wrong color
            if (this._board[i] === undefined || this._board[i].color !== color) {
                continue;
            }
            const piece = this._board[i];
            const difference = i - square;
            // skip - to/from square are the same
            if (difference === 0) {
                continue;
            }
            const index = difference + 119;
            if (ATTACKS[index] & PIECE_MASKS[piece.type]) {
                if (piece.type === PAWN) {
                    if ((difference > 0 && piece.color === WHITE) ||
                        (difference <= 0 && piece.color === BLACK)) {
                        if (!verbose) {
                            return true;
                        }
                        else {
                            attackers.push(algebraic(i));
                        }
                    }
                    continue;
                }
                // if the piece is a knight or a king
                if (piece.type === 'n' || piece.type === 'k') {
                    if (!verbose) {
                        return true;
                    }
                    else {
                        attackers.push(algebraic(i));
                        continue;
                    }
                }
                const offset = RAYS[index];
                let j = i + offset;
                let blocked = false;
                while (j !== square) {
                    if (this._board[j] != null) {
                        blocked = true;
                        break;
                    }
                    j += offset;
                }
                if (!blocked) {
                    if (!verbose) {
                        return true;
                    }
                    else {
                        attackers.push(algebraic(i));
                        continue;
                    }
                }
            }
        }
        if (verbose) {
            return attackers;
        }
        else {
            return false;
        }
    }
    attackers(square, attackedBy) {
        if (!attackedBy) {
            return this._attacked(this._turn, Ox88[square], true);
        }
        else {
            return this._attacked(attackedBy, Ox88[square], true);
        }
    }
    _isKingAttacked(color) {
        const square = this._kings[color];
        return square === -1 ? false : this._attacked(swapColor(color), square);
    }
    isAttacked(square, attackedBy) {
        return this._attacked(attackedBy, Ox88[square]);
    }
    isCheck() {
        return this._isKingAttacked(this._turn);
    }
    inCheck() {
        return this.isCheck();
    }
    isCheckmate() {
        return this.isCheck() && this._moves().length === 0;
    }
    isStalemate() {
        return !this.isCheck() && this._moves().length === 0;
    }
    isInsufficientMaterial() {
        /*
         * k.b. vs k.b. (of opposite colors) with mate in 1:
         * 8/8/8/8/1b6/8/B1k5/K7 b - - 0 1
         *
         * k.b. vs k.n. with mate in 1:
         * 8/8/8/8/1n6/8/B7/K1k5 b - - 2 1
         */
        const pieces = {
            b: 0,
            n: 0,
            r: 0,
            q: 0,
            k: 0,
            p: 0,
        };
        const bishops = [];
        let numPieces = 0;
        let squareColor = 0;
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            squareColor = (squareColor + 1) % 2;
            if (i & 0x88) {
                i += 7;
                continue;
            }
            const piece = this._board[i];
            if (piece) {
                pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
                if (piece.type === BISHOP) {
                    bishops.push(squareColor);
                }
                numPieces++;
            }
        }
        // k vs. k
        if (numPieces === 2) {
            return true;
        }
        else if (
        // k vs. kn .... or .... k vs. kb
        numPieces === 3 &&
            (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)) {
            return true;
        }
        else if (numPieces === pieces[BISHOP] + 2) {
            // kb vs. kb where any number of bishops are all on the same color
            let sum = 0;
            const len = bishops.length;
            for (let i = 0; i < len; i++) {
                sum += bishops[i];
            }
            if (sum === 0 || sum === len) {
                return true;
            }
        }
        return false;
    }
    isThreefoldRepetition() {
        return this._getPositionCount(this.fen()) >= 3;
    }
    isDrawByFiftyMoves() {
        return this._halfMoves >= 100; // 50 moves per side = 100 half moves
    }
    isDraw() {
        return (this.isDrawByFiftyMoves() ||
            this.isStalemate() ||
            this.isInsufficientMaterial() ||
            this.isThreefoldRepetition());
    }
    isGameOver() {
        return this.isCheckmate() || this.isStalemate() || this.isDraw();
    }
    moves({ verbose = false, square = undefined, piece = undefined, } = {}) {
        const moves = this._moves({ square, piece });
        if (verbose) {
            return moves.map((move) => new Move(this, move));
        }
        else {
            return moves.map((move) => this._moveToSan(move, moves));
        }
    }
    _moves({ legal = true, piece = undefined, square = undefined, } = {}) {
        const forSquare = square ? square.toLowerCase() : undefined;
        const forPiece = piece?.toLowerCase();
        const moves = [];
        const us = this._turn;
        const them = swapColor(us);
        let firstSquare = Ox88.a8;
        let lastSquare = Ox88.h1;
        let singleSquare = false;
        // are we generating moves for a single square?
        if (forSquare) {
            // illegal square, return empty moves
            if (!(forSquare in Ox88)) {
                return [];
            }
            else {
                firstSquare = lastSquare = Ox88[forSquare];
                singleSquare = true;
            }
        }
        for (let from = firstSquare; from <= lastSquare; from++) {
            // did we run off the end of the board
            if (from & 0x88) {
                from += 7;
                continue;
            }
            // empty square or opponent, skip
            if (!this._board[from] || this._board[from].color === them) {
                continue;
            }
            const { type } = this._board[from];
            let to;
            if (type === PAWN) {
                if (forPiece && forPiece !== type)
                    continue;
                // single square, non-capturing
                to = from + PAWN_OFFSETS[us][0];
                if (!this._board[to]) {
                    addMove(moves, us, from, to, PAWN);
                    // double square
                    to = from + PAWN_OFFSETS[us][1];
                    if (SECOND_RANK[us] === rank(from) && !this._board[to]) {
                        addMove(moves, us, from, to, PAWN, undefined, BITS.BIG_PAWN);
                    }
                }
                // pawn captures
                for (let j = 2; j < 4; j++) {
                    to = from + PAWN_OFFSETS[us][j];
                    if (to & 0x88)
                        continue;
                    if (this._board[to]?.color === them) {
                        addMove(moves, us, from, to, PAWN, this._board[to].type, BITS.CAPTURE);
                    }
                    else if (to === this._epSquare) {
                        addMove(moves, us, from, to, PAWN, PAWN, BITS.EP_CAPTURE);
                    }
                }
            }
            else {
                if (forPiece && forPiece !== type)
                    continue;
                for (let j = 0, len = PIECE_OFFSETS[type].length; j < len; j++) {
                    const offset = PIECE_OFFSETS[type][j];
                    to = from;
                    while (true) {
                        to += offset;
                        if (to & 0x88)
                            break;
                        if (!this._board[to]) {
                            addMove(moves, us, from, to, type);
                        }
                        else {
                            // own color, stop loop
                            if (this._board[to].color === us)
                                break;
                            addMove(moves, us, from, to, type, this._board[to].type, BITS.CAPTURE);
                            break;
                        }
                        /* break, if knight or king */
                        if (type === KNIGHT || type === KING)
                            break;
                    }
                }
            }
        }
        /*
         * check for castling if we're:
         *   a) generating all moves, or
         *   b) doing single square move generation on the king's square
         */
        if (forPiece === undefined || forPiece === KING) {
            if (!singleSquare || lastSquare === this._kings[us]) {
                // king-side castling
                if (this._castling[us] & BITS.KSIDE_CASTLE) {
                    const castlingFrom = this._kings[us];
                    const castlingTo = castlingFrom + 2;
                    if (!this._board[castlingFrom + 1] &&
                        !this._board[castlingTo] &&
                        !this._attacked(them, this._kings[us]) &&
                        !this._attacked(them, castlingFrom + 1) &&
                        !this._attacked(them, castlingTo)) {
                        addMove(moves, us, this._kings[us], castlingTo, KING, undefined, BITS.KSIDE_CASTLE);
                    }
                }
                // queen-side castling
                if (this._castling[us] & BITS.QSIDE_CASTLE) {
                    const castlingFrom = this._kings[us];
                    const castlingTo = castlingFrom - 2;
                    if (!this._board[castlingFrom - 1] &&
                        !this._board[castlingFrom - 2] &&
                        !this._board[castlingFrom - 3] &&
                        !this._attacked(them, this._kings[us]) &&
                        !this._attacked(them, castlingFrom - 1) &&
                        !this._attacked(them, castlingTo)) {
                        addMove(moves, us, this._kings[us], castlingTo, KING, undefined, BITS.QSIDE_CASTLE);
                    }
                }
            }
        }
        /*
         * return all pseudo-legal moves (this includes moves that allow the king
         * to be captured)
         */
        if (!legal || this._kings[us] === -1) {
            return moves;
        }
        // filter out illegal moves
        const legalMoves = [];
        for (let i = 0, len = moves.length; i < len; i++) {
            this._makeMove(moves[i]);
            if (!this._isKingAttacked(us)) {
                legalMoves.push(moves[i]);
            }
            this._undoMove();
        }
        return legalMoves;
    }
    move(move, { strict = false } = {}) {
        /*
         * The move function can be called with in the following parameters:
         *
         * .move('Nxb7')       <- argument is a case-sensitive SAN string
         *
         * .move({ from: 'h7', <- argument is a move object
         *         to :'h8',
         *         promotion: 'q' })
         *
         *
         * An optional strict argument may be supplied to tell chess.js to
         * strictly follow the SAN specification.
         */
        let moveObj = null;
        if (typeof move === 'string') {
            moveObj = this._moveFromSan(move, strict);
        }
        else if (typeof move === 'object') {
            const moves = this._moves();
            // convert the pretty move object to an ugly move object
            for (let i = 0, len = moves.length; i < len; i++) {
                if (move.from === algebraic(moves[i].from) &&
                    move.to === algebraic(moves[i].to) &&
                    (!('promotion' in moves[i]) || move.promotion === moves[i].promotion)) {
                    moveObj = moves[i];
                    break;
                }
            }
        }
        // failed to find move
        if (!moveObj) {
            if (typeof move === 'string') {
                throw new Error(`Invalid move: ${move}`);
            }
            else {
                throw new Error(`Invalid move: ${JSON.stringify(move)}`);
            }
        }
        /*
         * need to make a copy of move because we can't generate SAN after the move
         * is made
         */
        const prettyMove = new Move(this, moveObj);
        this._makeMove(moveObj);
        this._incPositionCount(prettyMove.after);
        return prettyMove;
    }
    _push(move) {
        this._history.push({
            move,
            kings: { b: this._kings.b, w: this._kings.w },
            turn: this._turn,
            castling: { b: this._castling.b, w: this._castling.w },
            epSquare: this._epSquare,
            halfMoves: this._halfMoves,
            moveNumber: this._moveNumber,
        });
    }
    _makeMove(move) {
        const us = this._turn;
        const them = swapColor(us);
        this._push(move);
        this._board[move.to] = this._board[move.from];
        delete this._board[move.from];
        // if ep capture, remove the captured pawn
        if (move.flags & BITS.EP_CAPTURE) {
            if (this._turn === BLACK) {
                delete this._board[move.to - 16];
            }
            else {
                delete this._board[move.to + 16];
            }
        }
        // if pawn promotion, replace with new piece
        if (move.promotion) {
            this._board[move.to] = { type: move.promotion, color: us };
        }
        // if we moved the king
        if (this._board[move.to].type === KING) {
            this._kings[us] = move.to;
            // if we castled, move the rook next to the king
            if (move.flags & BITS.KSIDE_CASTLE) {
                const castlingTo = move.to - 1;
                const castlingFrom = move.to + 1;
                this._board[castlingTo] = this._board[castlingFrom];
                delete this._board[castlingFrom];
            }
            else if (move.flags & BITS.QSIDE_CASTLE) {
                const castlingTo = move.to + 1;
                const castlingFrom = move.to - 2;
                this._board[castlingTo] = this._board[castlingFrom];
                delete this._board[castlingFrom];
            }
            // turn off castling
            this._castling[us] = 0;
        }
        // turn off castling if we move a rook
        if (this._castling[us]) {
            for (let i = 0, len = ROOKS[us].length; i < len; i++) {
                if (move.from === ROOKS[us][i].square &&
                    this._castling[us] & ROOKS[us][i].flag) {
                    this._castling[us] ^= ROOKS[us][i].flag;
                    break;
                }
            }
        }
        // turn off castling if we capture a rook
        if (this._castling[them]) {
            for (let i = 0, len = ROOKS[them].length; i < len; i++) {
                if (move.to === ROOKS[them][i].square &&
                    this._castling[them] & ROOKS[them][i].flag) {
                    this._castling[them] ^= ROOKS[them][i].flag;
                    break;
                }
            }
        }
        // if big pawn move, update the en passant square
        if (move.flags & BITS.BIG_PAWN) {
            if (us === BLACK) {
                this._epSquare = move.to - 16;
            }
            else {
                this._epSquare = move.to + 16;
            }
        }
        else {
            this._epSquare = EMPTY;
        }
        // reset the 50 move counter if a pawn is moved or a piece is captured
        if (move.piece === PAWN) {
            this._halfMoves = 0;
        }
        else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
            this._halfMoves = 0;
        }
        else {
            this._halfMoves++;
        }
        if (us === BLACK) {
            this._moveNumber++;
        }
        this._turn = them;
    }
    undo() {
        const move = this._undoMove();
        if (move) {
            const prettyMove = new Move(this, move);
            this._decPositionCount(prettyMove.after);
            return prettyMove;
        }
        return null;
    }
    _undoMove() {
        const old = this._history.pop();
        if (old === undefined) {
            return null;
        }
        const move = old.move;
        this._kings = old.kings;
        this._turn = old.turn;
        this._castling = old.castling;
        this._epSquare = old.epSquare;
        this._halfMoves = old.halfMoves;
        this._moveNumber = old.moveNumber;
        const us = this._turn;
        const them = swapColor(us);
        this._board[move.from] = this._board[move.to];
        this._board[move.from].type = move.piece; // to undo any promotions
        delete this._board[move.to];
        if (move.captured) {
            if (move.flags & BITS.EP_CAPTURE) {
                // en passant capture
                let index;
                if (us === BLACK) {
                    index = move.to - 16;
                }
                else {
                    index = move.to + 16;
                }
                this._board[index] = { type: PAWN, color: them };
            }
            else {
                // regular capture
                this._board[move.to] = { type: move.captured, color: them };
            }
        }
        if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
            let castlingTo, castlingFrom;
            if (move.flags & BITS.KSIDE_CASTLE) {
                castlingTo = move.to + 1;
                castlingFrom = move.to - 1;
            }
            else {
                castlingTo = move.to - 2;
                castlingFrom = move.to + 1;
            }
            this._board[castlingTo] = this._board[castlingFrom];
            delete this._board[castlingFrom];
        }
        return move;
    }
    pgn({ newline = '\n', maxWidth = 0, } = {}) {
        /*
         * using the specification from http://www.chessclub.com/help/PGN-spec
         * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
         */
        const result = [];
        let headerExists = false;
        /* add the PGN header information */
        for (const i in this._header) {
            /*
             * TODO: order of enumerated properties in header object is not
             * guaranteed, see ECMA-262 spec (section 12.6.4)
             */
            result.push('[' + i + ' "' + this._header[i] + '"]' + newline);
            headerExists = true;
        }
        if (headerExists && this._history.length) {
            result.push(newline);
        }
        const appendComment = (moveString) => {
            const comment = this._comments[this.fen()];
            if (typeof comment !== 'undefined') {
                const delimiter = moveString.length > 0 ? ' ' : '';
                moveString = `${moveString}${delimiter}{${comment}}`;
            }
            return moveString;
        };
        // pop all of history onto reversed_history
        const reversedHistory = [];
        while (this._history.length > 0) {
            reversedHistory.push(this._undoMove());
        }
        const moves = [];
        let moveString = '';
        // special case of a commented starting position with no moves
        if (reversedHistory.length === 0) {
            moves.push(appendComment(''));
        }
        // build the list of moves.  a move_string looks like: "3. e3 e6"
        while (reversedHistory.length > 0) {
            moveString = appendComment(moveString);
            const move = reversedHistory.pop();
            // make TypeScript stop complaining about move being undefined
            if (!move) {
                break;
            }
            // if the position started with black to move, start PGN with #. ...
            if (!this._history.length && move.color === 'b') {
                const prefix = `${this._moveNumber}. ...`;
                // is there a comment preceding the first move?
                moveString = moveString ? `${moveString} ${prefix}` : prefix;
            }
            else if (move.color === 'w') {
                // store the previous generated move_string if we have one
                if (moveString.length) {
                    moves.push(moveString);
                }
                moveString = this._moveNumber + '.';
            }
            moveString =
                moveString + ' ' + this._moveToSan(move, this._moves({ legal: true }));
            this._makeMove(move);
        }
        // are there any other leftover moves?
        if (moveString.length) {
            moves.push(appendComment(moveString));
        }
        // is there a result?
        if (typeof this._header.Result !== 'undefined') {
            moves.push(this._header.Result);
        }
        /*
         * history should be back to what it was before we started generating PGN,
         * so join together moves
         */
        if (maxWidth === 0) {
            return result.join('') + moves.join(' ');
        }
        // TODO (jah): huh?
        const strip = function () {
            if (result.length > 0 && result[result.length - 1] === ' ') {
                result.pop();
                return true;
            }
            return false;
        };
        // NB: this does not preserve comment whitespace.
        const wrapComment = function (width, move) {
            for (const token of move.split(' ')) {
                if (!token) {
                    continue;
                }
                if (width + token.length > maxWidth) {
                    while (strip()) {
                        width--;
                    }
                    result.push(newline);
                    width = 0;
                }
                result.push(token);
                width += token.length;
                result.push(' ');
                width++;
            }
            if (strip()) {
                width--;
            }
            return width;
        };
        // wrap the PGN output at max_width
        let currentWidth = 0;
        for (let i = 0; i < moves.length; i++) {
            if (currentWidth + moves[i].length > maxWidth) {
                if (moves[i].includes('{')) {
                    currentWidth = wrapComment(currentWidth, moves[i]);
                    continue;
                }
            }
            // if the current move will push past max_width
            if (currentWidth + moves[i].length > maxWidth && i !== 0) {
                // don't end the line with whitespace
                if (result[result.length - 1] === ' ') {
                    result.pop();
                }
                result.push(newline);
                currentWidth = 0;
            }
            else if (i !== 0) {
                result.push(' ');
                currentWidth++;
            }
            result.push(moves[i]);
            currentWidth += moves[i].length;
        }
        return result.join('');
    }
    /*
     * @deprecated Use `setHeader` and `getHeaders` instead.
     */
    header(...args) {
        for (let i = 0; i < args.length; i += 2) {
            if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
                this._header[args[i]] = args[i + 1];
            }
        }
        return this._header;
    }
    setHeader(key, value) {
        this._header[key] = value;
        return this._header;
    }
    removeHeader(key) {
        if (key in this._header) {
            delete this._header[key];
            return true;
        }
        return false;
    }
    getHeaders() {
        return this._header;
    }
    loadPgn(pgn, { strict = false, newlineChar = '\r?\n', } = {}) {
        function mask(str) {
            return str.replace(/\\/g, '\\');
        }
        function parsePgnHeader(header) {
            const headerObj = {};
            const headers = header.split(new RegExp(mask(newlineChar)));
            let key = '';
            let value = '';
            for (let i = 0; i < headers.length; i++) {
                const regex = /^\s*\[\s*([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;
                key = headers[i].replace(regex, '$1');
                value = headers[i].replace(regex, '$2');
                if (key.trim().length > 0) {
                    headerObj[key] = value;
                }
            }
            return headerObj;
        }
        // strip whitespace from head/tail of PGN block
        pgn = pgn.trim();
        /*
         * RegExp to split header. Takes advantage of the fact that header and movetext
         * will always have a blank line between them (ie, two newline_char's). Handles
         * case where movetext is empty by matching newlineChar until end of string is
         * matched - effectively trimming from the end extra newlineChar.
         *
         * With default newline_char, will equal:
         * /^(\[((?:\r?\n)|.)*\])((?:\s*\r?\n){2}|(?:\s*\r?\n)*$)/
         */
        const headerRegex = new RegExp('^(\\[((?:' +
            mask(newlineChar) +
            ')|.)*\\])' +
            '((?:\\s*' +
            mask(newlineChar) +
            '){2}|(?:\\s*' +
            mask(newlineChar) +
            ')*$)');
        // If no header given, begin with moves.
        const headerRegexResults = headerRegex.exec(pgn);
        const headerString = headerRegexResults
            ? headerRegexResults.length >= 2
                ? headerRegexResults[1]
                : ''
            : '';
        // Put the board in the starting position
        this.reset();
        // parse PGN header
        const headers = parsePgnHeader(headerString);
        let fen = '';
        for (const key in headers) {
            // check to see user is including fen (possibly with wrong tag case)
            if (key.toLowerCase() === 'fen') {
                fen = headers[key];
            }
            this.header(key, headers[key]);
        }
        /*
         * the permissive parser should attempt to load a fen tag, even if it's the
         * wrong case and doesn't include a corresponding [SetUp "1"] tag
         */
        if (!strict) {
            if (fen) {
                this.load(fen, { preserveHeaders: true });
            }
        }
        else {
            /*
             * strict parser - load the starting position indicated by [Setup '1']
             * and [FEN position]
             */
            if (headers['SetUp'] === '1') {
                if (!('FEN' in headers)) {
                    throw new Error('Invalid PGN: FEN tag must be supplied with SetUp tag');
                }
                // don't clear the headers when loading
                this.load(headers['FEN'], { preserveHeaders: true });
            }
        }
        /*
         * NB: the regexes below that delete move numbers, recursive annotations,
         * and numeric annotation glyphs may also match text in comments. To
         * prevent this, we transform comments by hex-encoding them in place and
         * decoding them again after the other tokens have been deleted.
         *
         * While the spec states that PGN files should be ASCII encoded, we use
         * {en,de}codeURIComponent here to support arbitrary UTF8 as a convenience
         * for modern users
         */
        function toHex(s) {
            return Array.from(s)
                .map(function (c) {
                /*
                 * encodeURI doesn't transform most ASCII characters, so we handle
                 * these ourselves
                 */
                return c.charCodeAt(0) < 128
                    ? c.charCodeAt(0).toString(16)
                    : encodeURIComponent(c).replace(/%/g, '').toLowerCase();
            })
                .join('');
        }
        function fromHex(s) {
            return s.length == 0
                ? ''
                : decodeURIComponent('%' + (s.match(/.{1,2}/g) || []).join('%'));
        }
        const encodeComment = function (s) {
            s = s.replace(new RegExp(mask(newlineChar), 'g'), ' ');
            return `{${toHex(s.slice(1, s.length - 1))}}`;
        };
        const decodeComment = function (s) {
            if (s.startsWith('{') && s.endsWith('}')) {
                return fromHex(s.slice(1, s.length - 1));
            }
        };
        // delete header to get the moves
        let ms = pgn
            .replace(headerString, '')
            .replace(
        // encode comments so they don't get deleted below
        new RegExp(`({[^}]*})+?|;([^${mask(newlineChar)}]*)`, 'g'), function (_match, bracket, semicolon) {
            return bracket !== undefined
                ? encodeComment(bracket)
                : ' ' + encodeComment(`{${semicolon.slice(1)}}`);
        })
            .replace(new RegExp(mask(newlineChar), 'g'), ' ');
        // delete recursive annotation variations
        const ravRegex = /(\([^()]+\))+?/g;
        while (ravRegex.test(ms)) {
            ms = ms.replace(ravRegex, '');
        }
        // delete move numbers
        ms = ms.replace(/\d+\.(\.\.)?/g, '');
        // delete ... indicating black to move
        ms = ms.replace(/\.\.\./g, '');
        /* delete numeric annotation glyphs */
        ms = ms.replace(/\$\d+/g, '');
        // trim and get array of moves
        let moves = ms.trim().split(new RegExp(/\s+/));
        // delete empty entries
        moves = moves.filter((move) => move !== '');
        let result = '';
        for (let halfMove = 0; halfMove < moves.length; halfMove++) {
            const comment = decodeComment(moves[halfMove]);
            if (comment !== undefined) {
                this._comments[this.fen()] = comment;
                continue;
            }
            const move = this._moveFromSan(moves[halfMove], strict);
            // invalid move
            if (move == null) {
                // was the move an end of game marker
                if (TERMINATION_MARKERS.indexOf(moves[halfMove]) > -1) {
                    result = moves[halfMove];
                }
                else {
                    throw new Error(`Invalid move in PGN: ${moves[halfMove]}`);
                }
            }
            else {
                // reset the end of game marker if making a valid move
                result = '';
                this._makeMove(move);
                this._incPositionCount(this.fen());
            }
        }
        /*
         * Per section 8.2.6 of the PGN spec, the Result tag pair must match match
         * the termination marker. Only do this when headers are present, but the
         * result tag is missing
         */
        if (result && Object.keys(this._header).length && !this._header['Result']) {
            this.header('Result', result);
        }
    }
    /*
     * Convert a move from 0x88 coordinates to Standard Algebraic Notation
     * (SAN)
     *
     * @param {boolean} strict Use the strict SAN parser. It will throw errors
     * on overly disambiguated moves (see below):
     *
     * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
     * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
     * 4. ... Ne7 is technically the valid SAN
     */
    _moveToSan(move, moves) {
        let output = '';
        if (move.flags & BITS.KSIDE_CASTLE) {
            output = 'O-O';
        }
        else if (move.flags & BITS.QSIDE_CASTLE) {
            output = 'O-O-O';
        }
        else {
            if (move.piece !== PAWN) {
                const disambiguator = getDisambiguator(move, moves);
                output += move.piece.toUpperCase() + disambiguator;
            }
            if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
                if (move.piece === PAWN) {
                    output += algebraic(move.from)[0];
                }
                output += 'x';
            }
            output += algebraic(move.to);
            if (move.promotion) {
                output += '=' + move.promotion.toUpperCase();
            }
        }
        this._makeMove(move);
        if (this.isCheck()) {
            if (this.isCheckmate()) {
                output += '#';
            }
            else {
                output += '+';
            }
        }
        this._undoMove();
        return output;
    }
    // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
    _moveFromSan(move, strict = false) {
        // strip off any move decorations: e.g Nf3+?! becomes Nf3
        const cleanMove = strippedSan(move);
        let pieceType = inferPieceType(cleanMove);
        let moves = this._moves({ legal: true, piece: pieceType });
        // strict parser
        for (let i = 0, len = moves.length; i < len; i++) {
            if (cleanMove === strippedSan(this._moveToSan(moves[i], moves))) {
                return moves[i];
            }
        }
        // the strict parser failed
        if (strict) {
            return null;
        }
        let piece = undefined;
        let matches = undefined;
        let from = undefined;
        let to = undefined;
        let promotion = undefined;
        /*
         * The default permissive (non-strict) parser allows the user to parse
         * non-standard chess notations. This parser is only run after the strict
         * Standard Algebraic Notation (SAN) parser has failed.
         *
         * When running the permissive parser, we'll run a regex to grab the piece, the
         * to/from square, and an optional promotion piece. This regex will
         * parse common non-standard notation like: Pe2-e4, Rc1c4, Qf3xf7,
         * f7f8q, b1c3
         *
         * NOTE: Some positions and moves may be ambiguous when using the permissive
         * parser. For example, in this position: 6k1/8/8/B7/8/8/8/BN4K1 w - - 0 1,
         * the move b1c3 may be interpreted as Nc3 or B1c3 (a disambiguated bishop
         * move). In these cases, the permissive parser will default to the most
         * basic interpretation (which is b1c3 parsing to Nc3).
         */
        let overlyDisambiguated = false;
        matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);
        if (matches) {
            piece = matches[1];
            from = matches[2];
            to = matches[3];
            promotion = matches[4];
            if (from.length == 1) {
                overlyDisambiguated = true;
            }
        }
        else {
            /*
             * The [a-h]?[1-8]? portion of the regex below handles moves that may be
             * overly disambiguated (e.g. Nge7 is unnecessary and non-standard when
             * there is one legal knight move to e7). In this case, the value of
             * 'from' variable will be a rank or file, not a square.
             */
            matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/);
            if (matches) {
                piece = matches[1];
                from = matches[2];
                to = matches[3];
                promotion = matches[4];
                if (from.length == 1) {
                    overlyDisambiguated = true;
                }
            }
        }
        pieceType = inferPieceType(cleanMove);
        moves = this._moves({
            legal: true,
            piece: piece ? piece : pieceType,
        });
        if (!to) {
            return null;
        }
        for (let i = 0, len = moves.length; i < len; i++) {
            if (!from) {
                // if there is no from square, it could be just 'x' missing from a capture
                if (cleanMove ===
                    strippedSan(this._moveToSan(moves[i], moves)).replace('x', '')) {
                    return moves[i];
                }
                // hand-compare move properties with the results from our permissive regex
            }
            else if ((!piece || piece.toLowerCase() == moves[i].piece) &&
                Ox88[from] == moves[i].from &&
                Ox88[to] == moves[i].to &&
                (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
                return moves[i];
            }
            else if (overlyDisambiguated) {
                /*
                 * SPECIAL CASE: we parsed a move string that may have an unneeded
                 * rank/file disambiguator (e.g. Nge7).  The 'from' variable will
                 */
                const square = algebraic(moves[i].from);
                if ((!piece || piece.toLowerCase() == moves[i].piece) &&
                    Ox88[to] == moves[i].to &&
                    (from == square[0] || from == square[1]) &&
                    (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
                    return moves[i];
                }
            }
        }
        return null;
    }
    ascii() {
        let s = '   +------------------------+\n';
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            // display the rank
            if (file(i) === 0) {
                s += ' ' + '87654321'[rank(i)] + ' |';
            }
            if (this._board[i]) {
                const piece = this._board[i].type;
                const color = this._board[i].color;
                const symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
                s += ' ' + symbol + ' ';
            }
            else {
                s += ' . ';
            }
            if ((i + 1) & 0x88) {
                s += '|\n';
                i += 8;
            }
        }
        s += '   +------------------------+\n';
        s += '     a  b  c  d  e  f  g  h';
        return s;
    }
    perft(depth) {
        const moves = this._moves({ legal: false });
        let nodes = 0;
        const color = this._turn;
        for (let i = 0, len = moves.length; i < len; i++) {
            this._makeMove(moves[i]);
            if (!this._isKingAttacked(color)) {
                if (depth - 1 > 0) {
                    nodes += this.perft(depth - 1);
                }
                else {
                    nodes++;
                }
            }
            this._undoMove();
        }
        return nodes;
    }
    turn() {
        return this._turn;
    }
    board() {
        const output = [];
        let row = [];
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            if (this._board[i] == null) {
                row.push(null);
            }
            else {
                row.push({
                    square: algebraic(i),
                    type: this._board[i].type,
                    color: this._board[i].color,
                });
            }
            if ((i + 1) & 0x88) {
                output.push(row);
                row = [];
                i += 8;
            }
        }
        return output;
    }
    squareColor(square) {
        if (square in Ox88) {
            const sq = Ox88[square];
            return (rank(sq) + file(sq)) % 2 === 0 ? 'light' : 'dark';
        }
        return null;
    }
    history({ verbose = false } = {}) {
        const reversedHistory = [];
        const moveHistory = [];
        while (this._history.length > 0) {
            reversedHistory.push(this._undoMove());
        }
        while (true) {
            const move = reversedHistory.pop();
            if (!move) {
                break;
            }
            if (verbose) {
                moveHistory.push(new Move(this, move));
            }
            else {
                moveHistory.push(this._moveToSan(move, this._moves()));
            }
            this._makeMove(move);
        }
        return moveHistory;
    }
    /*
     * Keeps track of position occurrence counts for the purpose of repetition
     * checking. All three methods (`_inc`, `_dec`, and `_get`) trim the
     * irrelevent information from the fen, initialising new positions, and
     * removing old positions from the record if their counts are reduced to 0.
     */
    _getPositionCount(fen) {
        const trimmedFen = trimFen(fen);
        return this._positionCount[trimmedFen] || 0;
    }
    _incPositionCount(fen) {
        const trimmedFen = trimFen(fen);
        if (this._positionCount[trimmedFen] === undefined) {
            this._positionCount[trimmedFen] = 0;
        }
        this._positionCount[trimmedFen] += 1;
    }
    _decPositionCount(fen) {
        const trimmedFen = trimFen(fen);
        if (this._positionCount[trimmedFen] === 1) {
            delete this._positionCount[trimmedFen];
        }
        else {
            this._positionCount[trimmedFen] -= 1;
        }
    }
    _pruneComments() {
        const reversedHistory = [];
        const currentComments = {};
        const copyComment = (fen) => {
            if (fen in this._comments) {
                currentComments[fen] = this._comments[fen];
            }
        };
        while (this._history.length > 0) {
            reversedHistory.push(this._undoMove());
        }
        copyComment(this.fen());
        while (true) {
            const move = reversedHistory.pop();
            if (!move) {
                break;
            }
            this._makeMove(move);
            copyComment(this.fen());
        }
        this._comments = currentComments;
    }
    getComment() {
        return this._comments[this.fen()];
    }
    setComment(comment) {
        this._comments[this.fen()] = comment.replace('{', '[').replace('}', ']');
    }
    /**
     * @deprecated Renamed to `removeComment` for consistency
     */
    deleteComment() {
        return this.removeComment();
    }
    removeComment() {
        const comment = this._comments[this.fen()];
        delete this._comments[this.fen()];
        return comment;
    }
    getComments() {
        this._pruneComments();
        return Object.keys(this._comments).map((fen) => {
            return { fen: fen, comment: this._comments[fen] };
        });
    }
    /**
     * @deprecated Renamed to `removeComments` for consistency
     */
    deleteComments() {
        return this.removeComments();
    }
    removeComments() {
        this._pruneComments();
        return Object.keys(this._comments).map((fen) => {
            const comment = this._comments[fen];
            delete this._comments[fen];
            return { fen: fen, comment: comment };
        });
    }
    setCastlingRights(color, rights) {
        for (const side of [KING, QUEEN]) {
            if (rights[side] !== undefined) {
                if (rights[side]) {
                    this._castling[color] |= SIDES[side];
                }
                else {
                    this._castling[color] &= ~SIDES[side];
                }
            }
        }
        this._updateCastlingRights();
        const result = this.getCastlingRights(color);
        return ((rights[KING] === undefined || rights[KING] === result[KING]) &&
            (rights[QUEEN] === undefined || rights[QUEEN] === result[QUEEN]));
    }
    getCastlingRights(color) {
        return {
            [KING]: (this._castling[color] & SIDES[KING]) !== 0,
            [QUEEN]: (this._castling[color] & SIDES[QUEEN]) !== 0,
        };
    }
    moveNumber() {
        return this._moveNumber;
    }
}

/**
 * Service for managing chess positions and FEN conversion
 * @module services/PositionService
 * @since 2.0.0
 */


/**
 * Service responsible for position management and FEN operations
 * @class
 */
class PositionService {
    /**
     * Creates a new PositionService instance
     * @param {ChessboardConfig} config - Board configuration
     */
    constructor(config) {
        this.config = config;
        this.game = null;
    }

    /**
     * Converts various position formats to FEN string
     * @param {string|Object} position - Position in various formats
     * @returns {string} FEN string representation
     * @throws {ValidationError} When position format is invalid
     */
    convertFen(position) {
        if (typeof position === 'string') {
            return this._convertStringPosition(position);
        } else if (typeof position === 'object' && position !== null) {
            return this._convertObjectPosition(position);
        } else {
            throw new ValidationError(ERROR_MESSAGES.invalid_position + position, 'position', position);
        }
    }

    /**
     * Converts string position to FEN
     * @private
     * @param {string} position - String position
     * @returns {string} FEN string
     */
    _convertStringPosition(position) {
        if (position === 'start') {
            return DEFAULT_STARTING_POSITION;
        }
        
        if (this.validateFen(position)) {
            return position;
        }
        
        if (STANDARD_POSITIONS[position]) {
            return STANDARD_POSITIONS[position];
        }
        
        throw new ValidationError(ERROR_MESSAGES.invalid_position + position, 'position', position);
    }

    /**
     * Converts object position to FEN
     * @private
     * @param {Object} position - Object with square->piece mapping
     * @returns {string} FEN string
     */
    _convertObjectPosition(position) {
        const parts = [];
        
        for (let row = 0; row < 8; row++) {
            const rowParts = [];
            let empty = 0;
            
            for (let col = 0; col < 8; col++) {
                const square = this._getSquareID(row, col);
                const piece = position[square];
                
                if (piece) {
                    if (empty > 0) {
                        rowParts.push(empty);
                        empty = 0;
                    }
                    // Convert piece notation: white pieces become uppercase, black remain lowercase
                    const fenPiece = piece[1] === 'w' ? piece[0].toUpperCase() : piece[0].toLowerCase();
                    rowParts.push(fenPiece);
                } else {
                    empty++;
                }
            }
            
            if (empty > 0) {
                rowParts.push(empty);
            }
            
            parts.push(rowParts.join(''));
        }
        
        return parts.join('/') + ' w KQkq - 0 1';
    }

    /**
     * Sets up the game with the given position
     * @param {string|Object} position - Position to set
     * @param {Object} [options] - Additional options for game setup
     */
    setGame(position, options = {}) {
        const fen = this.convertFen(position);
        
        if (this.game) {
            this.game.load(fen, options);
        } else {
            this.game = new Chess(fen);
        }
    }

    /**
     * Gets the current game instance
     * @returns {Chess} Current chess.js game instance
     */
    getGame() {
        return this.game;
    }

    /**
     * Validates a FEN string
     * @param {string} fen - FEN string to validate
     * @returns {boolean} True if valid, false otherwise
     */
    validateFen(fen) {
        return validateFen(fen);
    }

    /**
     * Gets piece information for a specific square
     * @param {string} squareId - Square identifier
     * @returns {string|null} Piece ID or null if no piece
     */
    getGamePieceId(squareId) {
        if (!this.game) return null;
        
        const piece = this.game.get(squareId);
        return piece ? piece.type + piece.color : null;
    }

    /**
     * Checks if a specific piece is on a specific square
     * @param {string} piece - Piece ID to check
     * @param {string} square - Square to check
     * @returns {boolean} True if piece is on square
     */
    isPiece(piece, square) {
        return this.getGamePieceId(square) === piece;
    }

    /**
     * Converts board coordinates to square ID
     * @private
     * @param {number} row - Row index (0-7)
     * @param {number} col - Column index (0-7)
     * @returns {string} Square ID (e.g., 'e4')
     */
    _getSquareID(row, col) {
        row = parseInt(row);
        col = parseInt(col);
        
        if (this.config.orientation === 'w') {
            row = 8 - row;
            col = col + 1;
        } else {
            row = row + 1;
            col = 8 - col;
        }
        
        const letter = BOARD_LETTERS[col - 1];
        return letter + row;
    }

    /**
     * Changes the turn in a FEN string
     * @param {string} fen - Original FEN string
     * @param {string} color - New turn color ('w' or 'b')
     * @returns {string} Modified FEN string
     */
    changeFenTurn(fen, color) {
        const parts = fen.split(' ');
        parts[1] = color;
        return parts.join(' ');
    }

    /**
     * Toggles the turn in a FEN string
     * @param {string} fen - Original FEN string
     * @returns {string} Modified FEN string
     */
    changeFenColor(fen) {
        const parts = fen.split(' ');
        parts[1] = parts[1] === 'w' ? 'b' : 'w';
        return parts.join(' ');
    }

    /**
     * Cleans up resources
     */
    destroy() {
        this.game = null;
    }
}

/**
 * Main Chessboard class - Orchestrates all services and components
 * @module core/Chessboard
 * @since 2.0.0
 */


/**
 * Main Chessboard class responsible for coordinating all services
 * @class
 */
let Chessboard$1 = class Chessboard {
    /**
     * Creates a new Chessboard instance
     * @param {Object} config - Configuration object
     */
    constructor(config) {
        console.log('Chessboard constructor received config:', config);
        
        // Initialize configuration
        this.config = new ChessboardConfig(config);
        console.log('Processed config.id_div:', this.config.id_div);
        
        // Initialize services
        this._initializeServices();
        
        // Initialize the board
        this._initialize();
    }

    /**
     * Initializes all services
     * @private
     */
    _initializeServices() {
        // Core services
        this.coordinateService = new CoordinateService(this.config);
        this.positionService = new PositionService(this.config);
        this.boardService = new BoardService(this.config);
        this.pieceService = new PieceService(this.config);
        this.moveService = new MoveService(this.config, this.positionService);
        this.eventService = new EventService(
            this.config,
            this.boardService,
            this.moveService,
            this.coordinateService,
            this
        );
        
        // State management
        this._updateTimeout = null;
        this._isAnimating = false;
        
        // Bind methods to preserve context
        this._boundUpdateBoardPieces = this._updateBoardPieces.bind(this);
        this._boundOnSquareClick = this._onSquareClick.bind(this);
        this._boundOnPieceHover = this._onPieceHover.bind(this);
        this._boundOnPieceLeave = this._onPieceLeave.bind(this);
    }

    /**
     * Initializes the board
     * @private
     */
    _initialize() {
        this._initParams();
        this._setGame(this.config.position);
        this._buildBoard();
        this._buildSquares();
        this._addListeners();
        this._updateBoardPieces();
    }

    /**
     * Initializes parameters and state
     * @private
     */
    _initParams() {
        // Reset state
        this.eventService.setClicked(null);
        this.eventService.setPromoting(false);
        this.eventService.setAnimating(false);
    }

    /**
     * Sets up the game with initial position
     * @private
     * @param {string|Object} position - Initial position
     */
    _setGame(position) {
        this.positionService.setGame(position);
    }

    /**
     * Builds the board DOM structure
     * @private
     */
    _buildBoard() {
        this.boardService.buildBoard();
    }

    /**
     * Builds all squares on the board
     * @private
     */
    _buildSquares() {
        this.boardService.buildSquares((row, col) => {
            return this.coordinateService.realCoord(row, col);
        });
    }

    /**
     * Adds event listeners to squares
     * @private
     */
    _addListeners() {
        this.eventService.addListeners(
            this._boundOnSquareClick,
            this._boundOnPieceHover,
            this._boundOnPieceLeave
        );
    }

    /**
     * Handles square click events
     * @private
     * @param {Square} square - Clicked square
     * @param {boolean} [animate=true] - Whether to animate
     * @param {boolean} [dragged=false] - Whether triggered by drag
     * @returns {boolean} True if successful
     */
    _onSquareClick(square, animate = true, dragged = false) {
        return this.eventService.onClick(
            square,
            this._onMove.bind(this),
            this._onSelect.bind(this),
            this._onDeselect.bind(this),
            animate,
            dragged
        );
    }

    /**
     * Handles piece hover events
     * @private
     * @param {Square} square - Hovered square
     */
    _onPieceHover(square) {
        if (this.config.hints && !this.eventService.getClicked()) {
            // Only show hints if no square is selected
            this._hintMoves(square);
        }
    }

    /**
     * Handles piece leave events
     * @private
     * @param {Square} square - Left square
     */
    _onPieceLeave(square) {
        if (this.config.hints && !this.eventService.getClicked()) {
            // Only remove hints if no square is selected
            this._dehintMoves(square);
        }
    }

    /**
     * Handles move execution
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Square} toSquare - Target square
     * @param {string} [promotion] - Promotion piece
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if move was successful
     */
    _onMove(fromSquare, toSquare, promotion = null, animate = true) {
        const move = new Move$1(fromSquare, toSquare, promotion);
        
        if (!move.check()) {
            // Clear state on failed move
            this._clearVisualState();
            return false;
        }
        
        if (this.config.onlyLegalMoves && !move.isLegal(this.positionService.getGame())) {
            // Clear state on illegal move
            this._clearVisualState();
            return false;
        }
        
        if (!move.hasPromotion() && this._requiresPromotion(move)) {
            // Don't clear state for promotion - it's handled elsewhere
            return false;
        }
        
        if (this.config.onMove(move)) {
            // Clear state before executing move
            this._clearVisualState();
            this._executeMove(move, animate);
            return true;
        }
        
        // Clear state on rejected move
        this._clearVisualState();
        return false;
    }

    /**
     * Handles square selection
     * @private
     * @param {Square} square - Selected square
     */
    _onSelect(square) {
        if (this.config.clickable) {
            square.select();
            this._hintMoves(square);
        }
    }

    /**
     * Handles square deselection
     * @private
     * @param {Square} square - Deselected square
     */
    _onDeselect(square) {
        this._clearVisualState();
    }

    /**
     * Shows legal move hints for a square
     * @private
     * @param {Square} square - Square to show hints for
     */
    _hintMoves(square) {
        if (!this.moveService.canMove(square)) return;
        
        // Clear existing hints first
        this.boardService.applyToAllSquares('removeHint');
        
        const moves = this.moveService.getCachedLegalMoves(square);
        
        for (const move of moves) {
            if (move.to && move.to.length === 2) {
                const targetSquare = this.boardService.getSquare(move.to);
                if (targetSquare) {
                    const hasEnemyPiece = targetSquare.piece && 
                                         targetSquare.piece.color !== this.positionService.getGame().turn();
                    targetSquare.putHint(hasEnemyPiece);
                }
            }
        }
    }

    /**
     * Removes legal move hints for a square
     * @private
     * @param {Square} square - Square to remove hints for
     */
    _dehintMoves(square) {
        const moves = this.moveService.getCachedLegalMoves(square);
        
        for (const move of moves) {
            if (move.to && move.to.length === 2) {
                const targetSquare = this.boardService.getSquare(move.to);
                if (targetSquare) {
                    targetSquare.removeHint();
                }
            }
        }
    }

    /**
     * Checks if a move requires promotion
     * @private
     * @param {Move} move - Move to check
     * @returns {boolean} True if promotion is required
     */
    _requiresPromotion(move) {
        return this.moveService.requiresPromotion(move);
    }

    /**
     * Executes a move
     * @private
     * @param {Move} move - Move to execute
     * @param {boolean} [animate=true] - Whether to animate
     */
    _executeMove(move, animate = true) {
        this.positionService.getGame().fen();
        
        if (this.config.onlyLegalMoves) {
            this.boardService.applyToAllSquares('unmoved');
            
            const gameMove = this.moveService.executeMove(move);
            if (!gameMove) {
                throw new Error('Move execution failed');
            }
            
            move.from.moved();
            move.to.moved();
            
            // Animate the move if requested
            if (animate && move.from.piece) {
                const capturedPiece = move.to.piece;
                this.pieceService.translatePiece(
                    move, 
                    !!capturedPiece, 
                    animate, 
                    this._createDragFunction.bind(this),
                    () => {
                        // After animation, trigger change event
                        this.config.onMoveEnd(gameMove);
                    }
                );
            } else {
                // For non-animated moves, update immediately 
                this._updateBoardPieces(false);
                this.config.onMoveEnd(gameMove);
            }
        } else {
            // Handle non-legal mode
            const piece = this.positionService.getGamePieceId(move.from.id);
            const game = this.positionService.getGame();
            
            game.remove(move.from.id);
            game.remove(move.to.id);
            game.put({ 
                type: move.hasPromotion() ? move.promotion : piece[0], 
                color: piece[1] 
            }, move.to.id);
            
            // Update board for non-legal mode
            this._updateBoardPieces(animate);
        }
    }

    /**
     * Updates board pieces to match game state
     * @private
     * @param {boolean} [animation=false] - Whether to animate
     */
    _updateBoardPieces(animation = false) {
        // Clear any pending update
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
            this._updateTimeout = null;
        }
        
        // Clear moves cache
        this.moveService.clearCache();
        
        // Add small delay for click-to-move to avoid lag
        if (animation && !this.eventService.getClicked()) {
            this._updateTimeout = setTimeout(() => {
                this._doUpdateBoardPieces(animation);
                this._updateTimeout = null;
                
                // Ensure hints are available for the next turn
                this._ensureHintsAvailable();
            }, 10);
        } else {
            this._doUpdateBoardPieces(animation);
            
            // Ensure hints are available for the next turn
            this._ensureHintsAvailable();
        }
    }
    
    /**
     * Ensures hints are available for the current turn
     * @private
     */
    _ensureHintsAvailable() {
        if (!this.config.hints) return;
        
        // Small delay to ensure the board state is fully updated
        setTimeout(() => {
            // Clear any existing hints
            this.boardService.applyToAllSquares('removeHint');
            
            // The hints will be shown when the user hovers over pieces
            // This just ensures the cache is ready
            this.moveService.clearCache();
        }, 50);
    }

    /**
     * Updates board pieces after a delayed move
     * @private
     */
    _updateBoardPiecesDelayed() {
        this._updateBoardPieces(false);
    }

    /**
     * Performs the actual board update
     * @private
     * @param {boolean} [animation=false] - Whether to animate
     */
    _doUpdateBoardPieces(animation = false) {
        // Skip update if we're in the middle of a promotion
        if (this._isPromoting) {
            console.log('Skipping board update during promotion');
            return;
        }
        
        const squares = this.boardService.getAllSquares();
        const gameStateBefore = this.positionService.getGame().fen();
        
        console.log('_doUpdateBoardPieces - current FEN:', gameStateBefore);
        
        // Update each square
        Object.values(squares).forEach(square => {
            const expectedPieceId = this.positionService.getGamePieceId(square.id);
            const currentPiece = square.piece;
            const currentPieceId = currentPiece ? currentPiece.getId() : null;
            
            // Log only for squares that are changing
            if (currentPieceId !== expectedPieceId) {
                console.log(`_doUpdateBoardPieces - ${square.id}: ${currentPieceId} -> ${expectedPieceId}`);
                
                // Check if we already have the correct piece (from promotion)
                if (currentPiece && currentPiece.getId() === expectedPieceId) {
                    console.log(`Piece ${expectedPieceId} already correctly placed on ${square.id}`);
                } else {
                    // Remove current piece if exists
                    if (currentPiece) {
                        this.pieceService.removePieceFromSquare(square, animation);
                    }
                    
                    // Add new piece if needed
                    if (expectedPieceId) {
                        const newPiece = this.pieceService.convertPiece(expectedPieceId);
                        this.pieceService.addPieceOnSquare(
                            square, 
                            newPiece, 
                            animation,
                            this._createDragFunction.bind(this)
                        );
                    }
                }
            }
        });
        
        // Re-add listeners after updating pieces to ensure hover events work correctly
        this._addListeners();
        
        // Trigger change event if position changed
        const gameStateAfter = this.positionService.getGame().fen();
        if (gameStateBefore !== gameStateAfter) {
            this.config.onChange(gameStateAfter);
        }
    }

    /**
     * Creates a drag function for a piece
     * @private
     * @param {Square} square - Square containing the piece
     * @param {Piece} piece - Piece to create drag function for
     * @returns {Function} Drag function
     */
    _createDragFunction(square, piece) {
        return this.eventService.createDragFunction(
            square,
            piece,
            this.config.onDragStart,
            this.config.onDragMove,
            this.config.onDrop,
            this._onSnapback.bind(this),
            this._onMove.bind(this),
            this._onRemove.bind(this)
        );
    }

    /**
     * Handles snapback animation
     * @private
     * @param {Square} square - Square containing the piece
     * @param {Piece} piece - Piece to snapback
     */
    _onSnapback(square, piece) {
        this.pieceService.snapbackPiece(square, this.config.snapbackAnimation);
        this.config.onSnapbackEnd(square, piece);
    }

    /**
     * Handles piece removal
     * @private
     * @param {Square} square - Square containing the piece to remove
     */
    _onRemove(square) {
        this.pieceService.removePieceFromSquare(square, true);
        this.positionService.getGame().remove(square.id);
        this._updateBoardPieces(true);
    }

    /**
     * Clears all visual state (selections, hints, highlights)
     * @private
     */
    _clearVisualState() {
        this.boardService.applyToAllSquares('deselect');
        this.boardService.applyToAllSquares('removeHint');
        this.boardService.applyToAllSquares('dehighlight');
        this.eventService.setClicked(null);
    }

    // -------------------
    // Public API Methods
    // -------------------

    /**
     * Gets the current position as FEN
     * @returns {string} FEN string
     */
    fen() {
        return this.positionService.getGame().fen();
    }

    /**
     * Gets current turn
     * @returns {string} 'w' or 'b'
     */
    turn() {
        return this.positionService.getGame().turn();
    }

    /**
     * Loads a new position
     * @param {string|Object} position - Position to load
     * @param {Object} [options={}] - Loading options
     * @param {boolean} [animation=true] - Whether to animate
     */
    load(position, options = {}, animation = true) {
        this.boardService.applyToAllSquares('removeHint');
        this.boardService.applyToAllSquares('deselect');
        this.boardService.applyToAllSquares('unmoved');
        
        this.positionService.setGame(position, options);
        this._updateBoardPieces(animation);
    }

    /**
     * Destroys the board and cleans up resources
     */
    destroy() {
        this.eventService.destroy();
        this.boardService.destroy();
        this.positionService.destroy();
        this.pieceService.destroy();
        this.moveService.destroy();
        
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
            this._updateTimeout = null;
        }
    }

    /**
     * Resizes the board
     * @param {number|string} size - New size
     */
    resize(size) {
        this.boardService.resize(size);
        this._updateBoardPieces();
    }

    /**
     * Flips the board orientation
     */
    flip() {
        this.coordinateService.flipOrientation();
        this.destroy();
        this._initParams();
        this._buildBoard();
        this._buildSquares();
        this._addListeners();
        this._updateBoardPieces();
    }

    // Additional API methods would be added here following the same pattern
    // This is a good starting point for the refactored architecture
};

/**
 * Chessboard.js - A beautiful, customizable chessboard widget
 * Entry point for the core library
 */


// Factory function to maintain backward compatibility
function Chessboard(containerElm, config = {}) {
    // If first parameter is an object, treat it as config
    if (typeof containerElm === 'object' && containerElm !== null) {
        return new Chessboard$1(containerElm);
    }
    
    // Otherwise, treat first parameter as element ID
    const fullConfig = { ...config, id: containerElm };
    return new Chessboard$1(fullConfig);
}

// Wrapper class that handles both calling conventions
class ChessboardWrapper extends Chessboard$1 {
    constructor(containerElm, config = {}) {
        // If first parameter is an object, treat it as config
        if (typeof containerElm === 'object' && containerElm !== null) {
            super(containerElm);
        } else {
            // Otherwise, treat first parameter as element ID
            const fullConfig = { ...config, id: containerElm };
            super(fullConfig);
        }
    }
}

// Attach the class to the factory function for direct access
Chessboard.Class = ChessboardWrapper;
Chessboard.Chessboard = ChessboardWrapper;

/**
 * Coordinate utilities for Chessboard.js
 */

/**
 * Convert algebraic notation to array coordinates
 * @param {string} square - Square in algebraic notation (e.g., 'a1', 'h8')
 * @returns {Object} Object with row and col properties
 */
function algebraicToCoords(square) {
  const file = square.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
  const rank = parseInt(square[1]) - 1;    // '1' = 0, '2' = 1, etc.
  
  return { row: 7 - rank, col: file };
}

/**
 * Convert array coordinates to algebraic notation
 * @param {number} row - Row index (0-7)
 * @param {number} col - Column index (0-7)
 * @returns {string} Square in algebraic notation
 */
function coordsToAlgebraic(row, col) {
  const file = String.fromCharCode(97 + col); // 0 = 'a', 1 = 'b', etc.
  const rank = (8 - row).toString();          // 0 = '8', 1 = '7', etc.
  
  return file + rank;
}

/**
 * Get the color of a square
 * @param {string} square - Square in algebraic notation
 * @returns {string} 'light' or 'dark'
 */
function getSquareColor(square) {
  const { row, col } = algebraicToCoords(square);
  return (row + col) % 2 === 0 ? 'dark' : 'light';
}

/**
 * Check if coordinates are valid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {boolean} True if coordinates are valid
 */
function isValidCoords(row, col) {
  return row >= 0 && row <= 7 && col >= 0 && col <= 7;
}

/**
 * Check if algebraic notation is valid
 * @param {string} square - Square in algebraic notation
 * @returns {boolean} True if square notation is valid
 */
function isValidSquare$1(square) {
  if (typeof square !== 'string' || square.length !== 2) return false;
  
  const file = square[0];
  const rank = square[1];
  
  return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
}

/**
 * Validation utilities for Chessboard.js
 */

/**
 * Validate piece notation
 * @param {string} piece - Piece notation (e.g., 'wP', 'bK')
 * @returns {boolean} True if piece notation is valid
 */
function isValidPiece(piece) {
  if (typeof piece !== 'string' || piece.length !== 2) return false;
  
  const color = piece[0];
  const type = piece[1];
  
  return ['w', 'b'].includes(color) && ['P', 'R', 'N', 'B', 'Q', 'K'].includes(type);
}

/**
 * Validate position object
 * @param {Object} position - Position object with square-piece mappings
 * @returns {boolean} True if position is valid
 */
function isValidPosition(position) {
  if (typeof position !== 'object' || position === null) return false;
  
  for (const [square, piece] of Object.entries(position)) {
    if (!isValidSquare(square) || !isValidPiece(piece)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Validate FEN string format
 * @param {string} fen - FEN string
 * @returns {Object} Validation result with success and error properties
 */
function validateFenFormat(fen) {
  if (typeof fen !== 'string') {
    return { success: false, error: 'FEN must be a string' };
  }
  
  const parts = fen.split(' ');
  if (parts.length !== 6) {
    return { success: false, error: 'FEN must have 6 parts separated by spaces' };
  }
  
  // Validate piece placement
  const ranks = parts[0].split('/');
  if (ranks.length !== 8) {
    return { success: false, error: 'Piece placement must have 8 ranks' };
  }
  
  return { success: true };
}

/**
 * Validate configuration object
 * @param {Object} config - Configuration object
 * @returns {Object} Validation result with success and errors array
 */
function validateConfig(config) {
  const errors = [];
  
  if (config.orientation && !['white', 'black', 'w', 'b'].includes(config.orientation)) {
    errors.push('Invalid orientation. Must be "white", "black", "w", or "b"');
  }
  
  if (config.position && config.position !== 'start' && typeof config.position !== 'object') {
    errors.push('Invalid position. Must be "start" or a position object');
  }
  
  if (config.size && typeof config.size !== 'string' && typeof config.size !== 'number') {
    errors.push('Invalid size. Must be a string or number');
  }
  
  return {
    success: errors.length === 0,
    errors
  };
}

/**
 * Animation utilities for Chessboard.js
 */

/**
 * Get the CSS transition duration in milliseconds
 * @param {string|number} time - Time value ('fast', 'slow', or number in ms)
 * @returns {number} Duration in milliseconds
 */
function parseTime(time) {
  if (typeof time === 'number') return time;
  
  switch (time) {
    case 'fast': return 150;
    case 'slow': return 500;
    default: return 200;
  }
}

/**
 * Get the CSS transition function
 * @param {string} animation - Animation type ('ease', 'linear', etc.)
 * @returns {string} CSS transition function
 */
function parseAnimation(animation) {
  const validAnimations = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'];
  return validAnimations.includes(animation) ? animation : 'ease';
}

/**
 * Create a promise that resolves after animation completion
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise} Promise that resolves after the duration
 */
function animationPromise(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Chessboard.js - A beautiful, customizable chessboard widget
 * Main entry point for the library
 * 
 * @version 2.2.1
 * @author alepot55
 * @license ISC
 */

export { Chess, Chessboard, ChessboardConfig, Move$1 as Move, Piece, Square, algebraicToCoords, animationPromise, coordsToAlgebraic, Chessboard as default, getSquareColor, isValidCoords, isValidPiece, isValidPosition, isValidSquare$1 as isValidSquare, parseAnimation, parseTime, rafThrottle, resetTransform, setTransform, throttle, validateConfig, validateFen, validateFenFormat };
