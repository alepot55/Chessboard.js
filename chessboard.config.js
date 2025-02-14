const DEFAULT_POSITION_WHITE = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const SLOW_ANIMATION = 600;
const FAST_ANIMATION = 150;

class ChessboardConfig {
    constructor(settings) {
        const defaults = {
            id_div: 'board',
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
            fadeTime: 'fast',
            fadeAnimation: 'ease',
            ratio: 0.9,
            piecesPath: 'https://cdn.jsdelivr.net/npm/@alepot55/chessboardjs/default_pieces',
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

        // Merge defaults with provided settings
        const config = Object.assign({}, defaults, settings);

        this.id_div = config.id_div;
        this.position = config.position;
        this.orientation = config.orientation;
        this.mode = config.mode;
        this.draggable = config.draggable;
        this.dropOffBoard = config.dropOffBoard;
        this.hints = config.hints;
        this.clickable = config.clickable;
        this.size = config.size;
        this.movableColors = config.movableColors;
        this.moveHighlight = config.moveHighlight;
        this.overHighlight = config.overHighlight;
        this.moveAnimation = config.moveAnimation;
        this.moveTime = config.moveTime;
        this.snapbackTime = config.snapbackTime;
        this.snapbackAnimation = config.snapbackAnimation;
        this.fadeTime = config.fadeTime;
        this.fadeAnimation = config.fadeAnimation;
        this.piecesPath = config.piecesPath;
        this.onMove = config.onMove;
        this.onMoveEnd = config.onMoveEnd;
        this.onChange = config.onChange;
        this.onDragStart = config.onDragStart;
        this.onDragMove = config.onDragMove;
        this.onDrop = config.onDrop;
        this.onSnapbackEnd = config.onSnapbackEnd;

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

        Object.freeze(this); // Make config immutable
    }

    setCSSProperty(property, value) {
        document.documentElement.style.setProperty(`--${property}`, value);
    }

    setOrientation(orientation) {
        this.orientation = orientation;
        return this;
    }
}

export { ChessboardConfig, DEFAULT_POSITION_WHITE, SLOW_ANIMATION, FAST_ANIMATION };