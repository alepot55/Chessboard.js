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
        this.fadeAnimation = this.setTransitionFunction(config.fadeAnimation);

        this.hints = this.setBoolean(config.hints);
        this.clickable = this.setBoolean(config.clickable);
        this.draggable = this.setBoolean(config.draggable);
        this.moveHighlight = this.setBoolean(config.moveHighlight);
        this.overHighlight = this.setBoolean(config.overHighlight);

        this.moveTime = this.setTime(config.moveTime)
        this.snapbackTime = this.setTime(config.snapbackTime);
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
        throw new Error('Invalid boolean value');
    }

    setTransitionFunction(value) {
        if (Object.keys(transitionFunctions).indexOf(value) !== -1) return transitionFunctions[value];
        throw new Error('Invalid transition function');
    }
}

export default ChessboardConfig;