const DEFAULT_POSITION_WHITE = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const SLOW_ANIMATION = 600;
const FAST_ANIMATION = 150;

class ChessboardConfig {

    constructor(settings) {

        let defaults = {

            // ---------------------- General
            id_div: 'board',
            position: 'start',
            orientation: 'w',
            mode: 'normal',
            size: 'auto',

            // ---------------------- Moves
            draggable: true,
            hints: true,
            clickable: true,
            movableColors: 'both',
            moveHighlight: true,
            overHighlight: true,
            moveAnimation: 'ease',
            moveTime: 'fast',

            // ---------------------- Snapback
            dropOffBoard: 'snapback',
            snapbackTime: 'fast',
            snapbackAnimation: 'ease',

            // ---------------------- Fade
            fadeTime: 'fast',
            fadeAnimation: 'ease',

            // ---------------------- Pieces
            ratio: 0.9,
            piecesPath: 'https://cdn.jsdelivr.net/npm/@alepot55/chessboardjs/default_pieces',

            // ---------------------- Events
            onMove: () => true,
            onMoveEnd: () => true,
            onChange: () => true,
            onDragStart: () => true,
            onDragMove: () => true,
            onDrop: () => true,
            onSnapbackEnd: () => true,

            // ---------------------- Colors
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

        // ---------------------- General

        // id_div: string
        this.id_div = settings.id_div === undefined ? defaults.id_div : settings.id_div;

        // position: 'start', 'fen', {a1: 'wp', b2: 'bp', ...}, 'default'
        this.position = settings.position === undefined ? defaults.position : settings.position;

        // orientation: 'w', 'b'
        this.orientation = settings.orientation === undefined ? defaults.orientation : settings.orientation;

        // mode: 'normal', 'creative'
        this.mode = settings.mode === undefined ? defaults.mode : settings.mode;
        
        // deaggable: true, false
        this.draggable = settings.draggable === undefined ? defaults.draggable : settings.draggable;

        // dropOffBoard: 'snapback', 'trash'
        this.dropOffBoard = settings.dropOffBoard == undefined ? defaults.dropOffBoard : settings.dropOffBoard;

        // hints: true, false. se settings non contiene hints, allora hints = true
        this.hints = settings.hints === undefined ? defaults.hints : settings.hints;

        // clickable: true, false
        this.clickable = settings.clickable === undefined ? defaults.clickable : settings.clickable;

        // size: integer or 'auto'
        this.size = settings.size === undefined ? defaults.size : settings.size;

        // ---------------------- Moves

        // movableColors: 'white', 'black', 'both', 'none'
        this.movableColors = settings.movableColors === undefined ? defaults.movableColors : settings.movableColors;

        // moveHighlight: true, false
        this.moveHighlight = settings.moveHighlight === undefined ? defaults.moveHighlight : settings.moveHighlight;

        // overHighlight: true, false
        this.overHighlight = settings.overHighlight === undefined ? defaults.overHighlight : settings.overHighlight;

        // moveAnimation: 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'none'
        this.moveAnimation = settings.moveAnimation === undefined ? defaults.moveAnimation : settings.moveAnimation;

        // moveTime: integer, 'slow', 'fast'
        this.moveTime = settings.moveTime === undefined ? defaults.moveTime : settings.moveTime;

        // ---------------------- Snapback

        // snapbackTime: integer, 'slow', 'fast'f
        this.snapbackTime = settings.snapbackTime === undefined ? defaults.snapbackTime : settings.snapbackTime;

        // snapbackAnimation: 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'none'
        this.snapbackAnimation = settings.snapbackAnimation === undefined ? defaults.snapbackAnimation : settings.snapbackAnimation;

        // ---------------------- Fade

        // fadeTime: integer, 'slow', 'fast'
        this.fadeTime = settings.fadeTime === undefined ? defaults.fadeTime : settings.fadeTime;

        // fadeAnimation: 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'none'
        this.fadeAnimation = settings.fadeAnimation === undefined ? defaults.fadeAnimation : settings.fadeAnimation;

        // ---------------------- Pieces

        // ratio: integer
        settings.ratio === undefined ? this.setCSSProperty('pieceRatio', defaults.ratio) : this.setCSSProperty('pieceRatio', settings.ratio);

        // piecesPath: string
        this.piecesPath = settings.piecesPath === undefined ? defaults.piecesPath : settings.piecesPath;


        // ---------------------- Events

        // onMove: function(move)
        this.onMove = settings.onMove === undefined ? defaults.onMove : settings.onMove;

        // onMoveEnd: function(move)
        this.onMoveEnd = settings.onMoveEnd === undefined ? defaults.onMoveEnd : settings.onMoveEnd;

        // onChange: function(fen)
        this.onChange = settings.onChange === undefined ? defaults.onChange : settings.onChange;

        // onDragStart: function(from, piece)
        this.onDragStart = settings.onDragStart === undefined ? defaults.onDragStart : settings.onDragStart;

        // onDragMove: function(from, to, piece)
        this.onDragMove = settings.onDragMove === undefined ? defaults.onDragMove : settings.onDragMove;

        // onDrop: function(from, to, piece)
        this.onDrop = settings.onDrop === undefined ? defaults.onDrop : settings.onDrop;

        // onSnapbackEnd: function(from, piece)
        this.onSnapbackEnd = settings.onSnapbackEnd === undefined ? defaults.onSnapbackEnd : settings.onSnapbackEnd;

        // ---------------------- Colors

        // whiteSquare: string
        settings.whiteSquare === undefined ? this.setCSSProperty('whiteSquare', defaults.whiteSquare) : this.setCSSProperty('whiteSquare', settings.whiteSquare);

        // blackSquare: string
        settings.blackSquare === undefined ? this.setCSSProperty('blackSquare', defaults.blackSquare) : this.setCSSProperty('blackSquare', settings.blackSquare);

        // highlight: string
        settings.highlight === undefined ? this.setCSSProperty('highlightSquare', defaults.highlight) : this.setCSSProperty('highlightSquare', settings.highlight);

        // selectedSquareWhite: string
        settings.selectedSquareWhite === undefined ? this.setCSSProperty('selectedSquareWhite', defaults.selectedSquareWhite) : this.setCSSProperty('selectedSquareWhite', settings.selectedSquareWhite);

        // selectedSquareBlack: string
        settings.selectedSquareBlack === undefined ? this.setCSSProperty('selectedSquareBlack', defaults.selectedSquareBlack) : this.setCSSProperty('selectedSquareBlack', settings.selectedSquareBlack);

        // movedSquareWhite: string
        settings.movedSquareWhite === undefined ? this.setCSSProperty('movedSquareWhite', defaults.movedSquareWhite) : this.setCSSProperty('movedSquareWhite', settings.movedSquareWhite);

        // movedSquareBlack: string
        settings.movedSquareBlack === undefined ? this.setCSSProperty('movedSquareBlack', defaults.movedSquareBlack) : this.setCSSProperty('movedSquareBlack', settings.movedSquareBlack);

        // choiceSquare: string
        settings.choiceSquare === undefined ? this.setCSSProperty('choiceSquare', defaults.choiceSquare) : this.setCSSProperty('choiceSquare', settings.choiceSquare);

        // coverSquare: string
        settings.coverSquare === undefined ? this.setCSSProperty('coverSquare', defaults.coverSquare) : this.setCSSProperty('coverSquare', settings.coverSquare);

        // hintColor: string
        settings.hintColor === undefined ? this.setCSSProperty('hintColor', defaults.hintColor) : this.setCSSProperty('hintColor', settings.hintColor);

        // Configure modes

        if (this.mode === 'creative') {
            this.onlyLegalMoves = false;
            this.hints = false;
        } else if (this.mode === 'normal') {
            this.onlyLegalMoves = true;
        }

        return this;
    }

    setCSSProperty(property, value) {
        document.documentElement.style.setProperty('--' + property, value);
    }

    setOrientation(orientation) {
        this.orientation = orientation;
        return this;
    }
}

class Chessboard {

    constructor(config) {

        this.config = new ChessboardConfig(config);

        this.pezzi = {};
        this.pieces = {};
        this.celle = {};
        this.squares = {};
        this.buildGame(this.config.position);
        this.initParams();
        this.buildBoard();
        this.updatePosition();
    }

    // Build

    buildGame(position) {
        if (position === 'start') {
            this.game = new Chess();
        } else if (position === 'default') {
            this.game = new Chess(DEFAULT_POSITION_WHITE);
        } else if (typeof position === 'string') {
            this.game = new Chess(position);
        } else if (typeof position === 'object') {
            let game = new Chess('start');
            for (let square in position) {
                game.put({ type: position[square][0], color: position[square][1] }, square);
            }
            this.game = game;
        } else {
            throw new Error('Invalid position - ' + position + ' - must be a fen string, "start", "default" or a dictionary of pieces, like {a1: "wK", b2: "bQ", ...}');
        }
    }

    buildBoard() {
        this.board = document.getElementById(this.config.id_div);
        if (!this.board) {
            throw new Error('Board id not found - ' + this.config.id_div + ' - must be a valid id of a div element');
        }
        this.resize(this.config.size);
        this.board.className = "board";
        this.buildSquares();
    }

    buildSquares() {
        this.squares = {};
        this.lastSquare = null;
        this.celle = {};
        this.pezzi = {};
        this.pieces = {};
        this.mosseIndietro = [];


        for (let row = 0; row < 8; row++) {

            this.squares[row] = {};

            for (let col = 0; col < 8; col++) {

                // Imposta l'id della cella e crea un nuovo elemento div
                let id = this.getSquareID(row, col)
                let square = document.createElement("div");

                this.celle[id] = square;
                this.squares[row][col] = square;
                square.id = id;
                this.resetSquare(id);

                this.board.appendChild(square);
            }
        }

        this.addListeners();
    }

    initParams() {
        this.promoting = false;
        this.lastSquare = null;
        this.history = [];
        this.mosseIndietro = [];
        this.lastSquare = null;
    }

    resize(value) {
        if (value === 'auto') {
            let size;
            if (this.board.offsetWidth === 0) {
                size = this.board.offsetHeight;
            } else if (this.board.offsetHeight === 0) {
                size = this.board.offsetWidth;
            } else {
                size = Math.min(this.board.offsetWidth, this.board.offsetHeight);
            }
            this.resize(size);
        } else if (typeof value !== 'number') {
            throw new Error('Invalid value - ' + value + ' - must be a number or "auto"');
        } else {
            document.documentElement.style.setProperty('--dimBoard', value + 'px');
            this.updatePosition();
        }
    }

    destroy() {
        if (!this.board) throw new Error('Board not found');
        this.board.innerHTML = '';
        this.board.className = '';
    }


    // Pieces

    checkPiece(piece) {
        if (['p', 'r', 'n', 'b', 'q', 'k'].indexOf(piece[0]) === -1 || ['w', 'b'].indexOf(piece[1]) === -1) throw new Error('Invalid piece - ' + piece + ' - must be a valid piece like "pw" or "kb"');
    }

    getPiecePath(piece) {
        if (typeof this.config.piecesPath === 'string') return this.config.piecesPath + '/' + piece + '.svg';
        else return this.config.piecesPath(piece);
    }

    piece(square) {
        this.checkSquare(square);
        let piece = this.game.get(square);
        return piece ? piece['type'] + piece['color'] : null;
    }

    colorPiece(square) {
        let piece = this.piece(square);
        return piece ? piece[1] : null;
    }

    traslation(elem, from, to, duration) {

        let piece = elem.src.split('/').pop().split('.')[0];

        if (duration === 'none' || duration === 0) {
            this.removePiece(from, piece, false);
            this.insert(to, piece, false);
            return;
        }
        else if (duration === 'slow') duration = SLOW_ANIMATION;
        else if (duration === 'fast') duration = FAST_ANIMATION;

        let startX, startY, endX, endY;

        if (from) {
            startX = this.celle[from].getBoundingClientRect().left;
            startY = this.celle[from].getBoundingClientRect().top;
        } else {
            startX = elem.getBoundingClientRect().left - 4;
            startY = elem.getBoundingClientRect().top - 4;
        }

        endX = this.celle[to].getBoundingClientRect().left;
        endY = this.celle[to].getBoundingClientRect().top;


        let x = endX - startX;
        let y = endY - startY;
        let startTime;
        let board = this;

        function translate(currentTime) {
            if (!startTime) {
                startTime = currentTime;
            }

            let timeElapsed = currentTime - startTime;
            let t = timeElapsed / duration;
            let progress = board.transitionTimingFunction(t, board.config.moveAnimation);
            elem.style.transform = 'translate(' + (x * progress) + 'px, ' + (y * progress) + 'px)';

            if (t < 1) {
                requestAnimationFrame(translate);
            } else {
                if (from) board.removePiece(from, piece, false);
                if (to) board.insert(to, board.piece(to), false);
            }
        }

        requestAnimationFrame(translate);
    }

    translatePiece(piece, from, to, removeTo, animate) {

        if (!animate) {
            this.removePiece(from, piece, false);
            this.insert(to, piece, false);
            return;
        };

        let elem = this.pieces[(piece, from)]['img'];

        if (removeTo) this.removePiece(to);

        return this.traslation(elem, from, to, this.config.moveTime);
    }

    snapbackPiece(square, piece, animate) {

        if (!animate || this.config.snapbackAnimation === 'none' || this.config.snapbackTime === 0) {
            this.removePiece(square, piece, false);
            this.insert(square, piece, false);
            return;
        }

        let elem = this.pieces[(piece, square)]['img'];
        this.traslation(elem, null, square, this.config.snapbackTime);
    }

    fadeInPiece(square) {

        let duration = this.config.fadeTime;
        if (duration === 'slow') duration = SLOW_ANIMATION;
        else if (duration === 'fast') duration = FAST_ANIMATION;

        let elem = this.pezzi[square]['img'];

        let startTime;
        let board = this;

        function fadeIn(currentTime) {
            if (!startTime) {
                startTime = currentTime;
            }
            let timeElapsed = currentTime - startTime;
            let t = timeElapsed / duration;
            let progress = board.transitionTimingFunction(t, board.config.fadeAnimation);
            elem.style.opacity = progress;

            if (t < 1) {
                requestAnimationFrame(fadeIn);
            }
        }

        requestAnimationFrame(fadeIn);
    }

    fadeOutPiece(square, img, remove, animate) {

        let duration = this.config.fadeTime;
        if (duration === 'slow') duration = SLOW_ANIMATION;
        else if (duration === 'fast') duration = FAST_ANIMATION;

        if (!animate) {
            if (remove) this.celle[square].removeChild(img);
            else img.style.opacity = 0;
            return;
        }

        let startTime;
        let board = this;

        function fadeOut(currentTime) {
            if (!startTime) {
                startTime = currentTime;
            }
            let timeElapsed = currentTime - startTime;
            let t = timeElapsed / duration;
            let progress = board.transitionTimingFunction(t, board.config.fadeAnimation);
            img.style.opacity = 1 - progress;

            if (t < 1) {
                requestAnimationFrame(fadeOut);
            } else {
                if (remove) board.celle[square].removeChild(img);
            }
        }

        requestAnimationFrame(fadeOut);
    }

    removePiece(square, piece, fade = true) {

        if (!this.pezzi[square]) return null;
        piece = piece ? piece : this.pezzi[square]['piece'];
        if (this.pezzi[square]['piece'] !== piece) return null;

        if (fade) this.fadeOutPiece(square, this.pezzi[square]['img']);
        else this.celle[square].removeChild(this.pezzi[square]['img']);

        this.pezzi[square] = null;
        this.pieces[(piece, square)] = null;

        return piece;
    }

    insert(square, piece, fade = this.config.fadeAnimation) {

        if (fade === 'none' || fade === 0) fade = false;

        this.checkPiece(piece);
        this.checkSquare(square);

        if (!piece) return;
        this.removePiece(square, null, false);

        let img = document.createElement("img");
        img.className = "piece";
        img.src = this.getPiecePath(piece);
        img.style.opacity = fade ? 0 : 1;

        let board = this;
        img.onmousedown = function (event) {

            if (!board.config.draggable) return;

            let recent;
            let from = square;
            let to = square;
            let moved = false;

            if (!board.canMove(from)) return;

            if (!board.config.clickable) board.lastSquare = null;
            if (board.onClick(square)) return;

            img.style.position = 'absolute';
            img.style.zIndex = 15;

            // Function to move the piece with the mouse pointer
            function moveAt(pageX, pageY) {
                if (!moved && !board.config.onDragStart(from, piece)) return;
                moved = true;
                img.style.left = pageX - img.offsetWidth / 2 + 'px';
                img.style.top = pageY - img.offsetHeight / 2 + 'px';
                return true;
            }

            function onMouseMove(event) {

                // Bug fix for spamming the mousemove event
                if (!piece) return;

                if (!moveAt(event.pageX, event.pageY)) return;

                // Find the square where the mouse is
                let x = event.clientX - board.board.getBoundingClientRect().left;
                let y = event.clientY - board.board.getBoundingClientRect().top;

                let col = Math.floor(x / (board.board.offsetWidth / 8));
                let row = Math.floor(y / (board.board.offsetHeight / 8));
                if (x < 0 || x > board.board.offsetWidth || y < 0 || y > board.board.offsetHeight) to = null;
                else to = board.getSquareID(row, col);
                board.config.onDragMove(from, to, piece);

                if (to !== recent) {
                    board.highlight(to);
                    board.dehighlight(recent);
                    recent = to;
                }
            }
            document.addEventListener('mousemove', onMouseMove);

            // Drop the piece and remove the event listener
            img.onmouseup = function () {
                board.dehighlight(recent);
                document.removeEventListener('mousemove', onMouseMove);
                img.onmouseup = null;
                let drop = board.config.onDrop(from, to, piece);

                if ((board.config.dropOffBoard === 'trash' || drop === 'trash') && !to) {
                    board.unmoveAllSquares();
                    board.dehintAllSquares();
                    board.deselect(from);
                    board.remove(from);
                } else if (moved && (!board.onClick(to, false) || drop === 'snapback')) {
                    board.snapbackPiece(from, piece, !board.promoting);
                    board.config.onSnapbackEnd(from, piece);
                }
            };

        };

        // Prevent the image from being dragged
        img.ondragstart = function () {
            return false;
        };

        this.pezzi[square] = { 'img': img, 'piece': piece };
        this.pieces[(piece, square)] = { 'img': img };
        this.celle[square].appendChild(img);

        if (fade) this.fadeInPiece(square);
        else img.style.opacity = 1;
        return img;
    }

    updatePieces(animation) {

        let ok = {};
        let escaping = {};
        let canEscape = {};
        let toTranslate = [];

        for (let square in this.celle) {
            ok[square] = false;
            escaping[square] = false;
            canEscape[square] = this.pezzi[square] && this.piece(square) !== this.pezzi[square]['piece'];
        }


        for (let square in this.celle) {

            let pieceNew = this.piece(square);
            let pieceOld = this.pezzi[square] ? this.pezzi[square]['piece'] : null;

            if (pieceOld !== pieceNew && !ok[square]) {


                for (let from in this.pezzi) {

                    let coming = this.pezzi[from] ? this.pezzi[from]['piece'] : null;

                    if (coming && canEscape[from] && !ok[square] && from !== square && coming === pieceNew && !this.isPiece(pieceNew, from)) {

                        // check for en passant
                        let lastMove = this.lastMove();
                        if (!pieceOld && lastMove && lastMove['captured'] === 'p') {
                            let captured = 'p' + (lastMove['color'] === 'w' ? 'b' : 'w');
                            this.removePiece(square[0] + from[1], captured);
                        }

                        toTranslate.push([coming, from, square]);

                        if (!this.piece(from)) ok[from] = true;
                        escaping[from] = true;
                        canEscape[from] = false;

                        ok[square] = true;

                        break;
                    }
                }
            }
        }

        for (let [piece, from, to] of toTranslate) {
            this.translatePiece(piece, from, to, !escaping[to], animation);
        }

        for (let square in this.celle) {

            let pieceNew = this.piece(square);
            let pieceOld = this.pezzi[square] ? this.pezzi[square]['piece'] : null;

            if (pieceOld !== pieceNew && !ok[square]) {

                if (!ok[square]) {
                    // check for promotion
                    let lastMove = this.lastMove();
                    if (lastMove && lastMove['promotion']) {
                        if (lastMove['to'] === square) {
                            let piece = lastMove['promotion'] + lastMove['color'];
                            this.translatePiece(piece, lastMove['from'], square, true, animation);
                            ok[lastMove['from']] = true;
                        }
                    } else {
                        this.removePiece(square);
                        if (pieceNew) this.insert(square, pieceNew);
                    }
                }
            }
        }

        this.config.onChange(this.game.fen());
    }

    opponentPiece(square) {
        let piece = this.piece(square);
        return piece && piece[1] !== this.config.orientation;
    }

    playerPiece(square) {
        let piece = this.piece(square);
        return piece && piece[1] === this.config.orientation;
    }

    isPiece(piece, square) {
        return this.piece(square) === piece;
    }

    remove(square, animation = true) {
        this.checkSquare(square);
        this.game.remove(square);
        this.removePiece(square, null, animation);
    }


    // Listeners

    addListeners() {
        if (this.mosseIndietro.length > 0) return;
        for (let square in this.celle) {
            let elem = this.celle[square];
            elem.addEventListener("mouseover", () => {
                if (!this.lastSquare) this.hintMoves(elem.id);
            });
            elem.addEventListener("mouseout", () => {
                if (!this.lastSquare) this.dehintMoves(elem.id);
            });
            elem.addEventListener("click", () => {
                if (this.config.clickable && (!this.pezzi[elem.id] || this.config.onlyLegalMoves)) this.onClick(elem.id)
            });
            elem.addEventListener("touch", () => {
                if (this.config.clickable) this.onClick(elem.id)
            });
        }
    }

    onClick(square, animation = this.config.moveAnimation) {

        if (!square || square === this.lastSquare) return;

        if (animation === 'none') animation = false;

        if (this.promoting) {
            this.depromoteAllSquares();
            this.removeAllCovers();
            this.promoting = false;
            if (square.length === 2) this.lastSquare = null;
        }

        let from = this.lastSquare;
        this.lastSquare = null;
        let move = from + square;

        if (from) {
            this.deselect(from);
            this.dehintAllSquares();
        } else if (!this.canMove(square)) return;


        if (from && this.canMove(from) && (!this.canMove(square) || !this.config.onlyLegalMoves)) {

            if (this.config.onlyLegalMoves && !this.legalMove(move)) return;
            if (move.length == 4 && this.promote(move)) return;

            if (this.config.onMove(move)) this.move(move, animation);
            else return;

            return true;

        } else if (this.canMove(square)) {

            this.select(square);
            this.hintMoves(square);
            this.lastSquare = square;
        }
    }

    // Hint

    hint(square) {
        this.checkSquare(square);
        if (!this.config.hints || !this.celle[square]) return;

        let hint = document.createElement("div");
        hint.className = "hint";

        if (this.colorPiece(square) && this.colorPiece(square) !== this.turn()) hint.className += " catchable";

        this.celle[square].appendChild(hint);

    }

    hintMoves(square) {
        if (!this.canMove(square)) return;
        let mosse = this.game.moves({ square: square, verbose: true });
        for (let mossa of mosse) {
            if (mossa['to'].length === 2) this.hint(mossa['to']);
        }
    }

    dehintMoves(square) {
        let mosse = this.game.moves({ square: square, verbose: true });
        for (let mossa of mosse) {
            if (mossa['to'].length === 2) this.dehint(mossa['to']);
        }
    }

    dehint(square) {
        if (square.length !== 2) return;
        if (this.config.hints) {
            let cella = this.celle[square];
            if (!cella) return;
            let figli = cella.childNodes;

            for (let i = figli.length - 1; i >= 0; i--) {
                if (figli[i].className.includes('hint')) {
                    cella.removeChild(figli[i]);
                }
            }
        }
    }

    dehintAllSquares() {
        for (let casella in this.celle) {
            this.dehint(casella);
        }
    }

    // Select

    select(square) {
        this.checkSquare(square);
        if (!this.config.clickable) return;
        let elem = this.celle[square];
        if (elem.className.includes('selectedSquareWhite') || elem.className.includes('selectedSquareBlack')) return;
        if (this.isWhiteSquare(square)) elem.className += ' selectedSquareWhite';
        else elem.className += ' selectedSquareBlack';
    }

    deselect(square) {
        this.checkSquare(square);
        let elem = this.celle[square];
        if (this.isWhiteSquare(square)) elem.className = elem.className.replace(' selectedSquareWhite', '');
        else elem.className = elem.className.replace(' selectedSquareBlack', '');
    }

    deselectAllSquares() {
        for (let casella in this.celle) {
            this.deselect(casella);
        }
    }

    // Moves

    checkMove(move) {
        if (move.length < 4 || move.length > 5) throw new Error('Invalid move - ' + move + ' - must be a valid move like "e2e4" or "e7e8q"');
        let from = move.slice(0, 2);
        let to = move.slice(2, 4);
        let prom = move.length === 5 ? move[4] : null;
        this.checkSquare(from);
        this.checkSquare(to);
        if (prom && ['q', 'r', 'n', 'b'].indexOf(prom) === -1) throw new Error('Invalid promotion - ' + prom + ' - must be a valid piece like "q", "r", "n" or "b"');
    }

    canMove(square) {
        if (!this.piece(square)) return false;
        if (this.config.movableColors === 'none') return false;
        if (this.config.movableColors === 'w' && this.colorPiece(square) === 'b') return false;
        if (this.config.movableColors === 'b' && this.colorPiece(square) === 'w') return false;
        if (!this.config.onlyLegalMoves) return true;
        if (this.colorPiece(square) !== this.turn()) return false;
        return true;
    }

    move(move, animation) {
        console.log(move);

        if (!this.canMove(move.slice(0, 2))) return false;

        this.checkMove(move);

        if (!this.config.onlyLegalMoves) {
            let piece = this.piece(move.slice(0, 2));
            this.game.remove(move.slice(0, 2));
            this.game.remove(move.slice(2, 4));
            this.game.put({ type: move[4] ? move[4] : piece[0], color: piece[1] }, move.slice(2, 4));
            return this.updatePosition(false, false);
        }

        this.unmoveAllSquares();

        move = this.game.move({
            from: move.slice(0, 2),
            to: move.slice(2, 4),
            promotion: move.length === 5 ? move[4] : null
        });


        this.history.push(move);

        this.updatePosition(false, animation);

        this.moved(move['to']);
        this.moved(move['from']);

        this.dehintAllSquares();

        this.config.onMoveEnd(move['from'] + move['to'] + (move['promotion'] ? move['promotion'] : ''));

        return true;


    }

    moved(square) {
        this.checkSquare(square);
        if (!this.config.moveHighlight) return;
        let elem = this.celle[square];
        if (elem.className.includes(' movedSquareWhite') || elem.className.includes(' movedSquareBlack')) return;
        if (this.isWhiteSquare(square)) elem.className += ' movedSquareWhite';
        else elem.className += ' movedSquareBlack';
    }

    unmoved(square) {
        this.checkSquare(square);
        if (!this.config.moveHighlight) return;
        let elem = this.celle[square];
        if (this.isWhiteSquare(square)) elem.className = elem.className.replace(' movedSquareWhite', '');
        else elem.className = elem.className.replace(' movedSquareBlack', '');
    }

    unmoveAllSquares() {
        for (let casella in this.celle) {
            this.unmoved(casella);
        }
        return;
    }

    legalMove(mossa) {
        let legalMoves = this.legalMoves(mossa.slice(0, 2));
        for (let i in legalMoves) {
            if (legalMoves[i]['to'] === mossa.slice(2, 4) && (mossa.length === 4 || mossa[4] === legalMoves[i]['promotion'])) return true;
        }

        return false;
    }

    legalMoves(from = null, verb = true) {
        if (from) this.checkSquare(from);
        else return this.game.moves({ verbose: verb });
        return this.game.moves({ square: from, verbose: verb });
    }

    lastMove() {
        return this.history[this.history.length - 1];
    }

    getHistory() {
        return this.history;
    }

    // State

    isGameOver() {
        if (this.game.game_over()) {
            if (this.game.in_checkmate()) return this.game.turn() === 'w' ? 'b' : 'w';
            return 'd';
        }
        return null;
    }

    turn() {
        return this.game.turn();
    }

    getOrientation() {
        return this.config.orientation;
    }

    orientation(color) {
        if ((color === 'w' || color === 'b') && color !== this.config.orientation) this.flip();
    }

    // Position

    chageFenTurn(fen, color) {
        let parts = fen.split(' ');
        parts[1] = color;
        return parts.join(' ');
    }

    position(position, color = null) {
        this.initParams();
        this.dehintAllSquares();
        this.deselectAllSquares();
        this.unmoveAllSquares();
        if (!color) color = position.split(' ')[1];
        let change_color = this.config.orientation !== color;
        this.config.setOrientation(color);
        this.game = new Chess(position);
        this.updatePosition(change_color);
    }

    flip() {
        let position = this.game.fen();
        this.position(position, this.config.orientation === 'w' ? 'b' : 'w');
    }

    playerTurn() { // Restituisce true se è il turno del giocatore
        return this.config.orientation === this.game.turn();
    }

    isWhiteSquare(square) {
        this.checkSquare(square);
        let letters = 'abcdefgh';
        return (letters.indexOf(square[0]) + parseInt(square[1])) % 2 === 0;
    }

    isWhiteOriented() {
        return this.config.orientation === 'w';
    }

    updatePosition(change_color = false, animation = this.config.moveAnimation) {
        if (change_color) {
            this.renameSquares();
        }
        this.updatePieces(animation);
    }

    renameSquares() {
        let new_celle = {};
        let new_pezzi = {};
        let new_pieces = {};
        for (let elem in this.celle) {
            let square = this.celle[elem];
            let id = square.id;
            let [row, col] = this.getSquareCoord(id);
            let new_row = 7 - row;
            let new_col = 7 - col;
            square.id = this.getSquareID(new_row, new_col);
            new_celle[square.id] = square;
            if (this.pezzi[id]) {
                new_pezzi[square.id] = this.pezzi[id];
                new_pieces[(this.pezzi[id]['piece'], square.id)] = this.pieces[(this.pezzi[id]['piece'], id)];
            }

        }
        this.celle = new_celle;
        this.pezzi = new_pezzi;
        this.pieces = new_pieces;
    }

    fen() {
        return this.game.fen();
    }

    // Squares

    checkSquare(square) {
        if (!square) return;
        if (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(square[0]) === -1 || ['1', '2', '3', '4', '5', '6', '7', '8'].indexOf(square[1]) === -1) throw new Error('Invalid square - ' + square + ' - must be a valid square like "a1" or "h8"');
    }

    getSquareCoord(coord) {
        let letters = 'abcdefgh';
        if (this.isWhiteOriented()) {
            return [8 - parseInt(coord[1]), letters.indexOf(coord[0])];
        }
        return [parseInt(coord[1]) - 1, 7 - letters.indexOf(coord[0])];
    }

    resetSquare(square) {
        let elem = this.celle[square];
        elem.className = 'square ' + (this.isWhiteSquare(square) ? 'whiteSquare' : 'blackSquare');
    }

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
        let letters = 'abcdefgh';
        let letter = letters[col - 1];
        return letter + row;
    }

    removeSquares() { // Rimuove le caselle dalla Chessboard
        for (let casella in this.celle) {
            this.board.removeChild(this.celle[casella]);
        }
        this.celle = {};
    }

    clear(animation = true) {
        this.game.clear();
        this.updatePosition(null, animation);
    }

    // Highlight

    highlight(square) {
        if (!square || !this.celle[square] || !this.config.overHighlight) return;
        let elem = this.celle[square];
        if (elem.className.includes('highlighted')) return;
        elem.className += ' highlighted';
    }

    dehighlight(square) {
        if (!square || !this.celle[square] || !this.config.overHighlight) return;
        this.checkSquare(square);
        let elem = this.celle[square];
        elem.className = elem.className.replace(' highlighted', '');
    }


    // Promotion

    coverSquare(square) {
        let cover = document.createElement("div");
        cover.className = "square cover";
        this.celle[square].appendChild(cover);
    }

    removeCover(square) {
        let elem = this.celle[square];
        let figli = elem.childNodes;

        for (let i = figli.length - 1; i >= 0; i--) {
            if (figli[i].className.includes('cover')) {
                elem.removeChild(figli[i]);
            }
        }
    }

    removeAllCovers() {
        for (let casella in this.celle) {
            this.removeCover(casella);
        }
    }

    promoteSquare(square, piece) {
        let choice = document.createElement("div");
        choice.className = "square choice";

        let img = document.createElement("img");
        img.className = "piece choicable";
        img.src = this.getPiecePath(piece);
        choice.appendChild(img);

        this.celle[square].appendChild(choice);

        return choice;
    }

    depromoteSquare(square) {
        let elem = this.celle[square];
        let figli = elem.childNodes;

        for (let i = figli.length - 1; i >= 0; i--) {
            if (figli[i].className.includes('choice')) {
                elem.removeChild(figli[i]);
            }
        }
    }

    depromoteAllSquares() {
        for (let casella in this.celle) {
            this.depromoteSquare(casella);
        }
    }

    promote(mossa) {

        if (!this.config.onlyLegalMoves) return false;

        let to = mossa.slice(2, 4);
        let from = mossa.slice(0, 2);
        let pezzo = this.game.get(from);
        let [row, col] = this.getSquareCoord(to);
        let choices = ['q', 'r', 'b', 'n']

        if (pezzo['type'] !== 'p' || !(row === 0 || row === 7)) return false;

        this.promoting = true;

        for (let casella in this.celle) {
            let [rowCurr, colCurr] = this.getSquareCoord(casella);

            if (col === colCurr && Math.abs(row - rowCurr) <= 3) {

                let choice = this.promoteSquare(casella, choices[Math.abs(row - rowCurr)] + pezzo['color']);
                choice.addEventListener('click', () => {
                    this.onClick(to + choices[Math.abs(row - rowCurr)]);
                });

            } else {
                this.coverSquare(casella);
            }
        }

        this.lastSquare = from;

        return true;
    }

    // Other

    transitionTimingFunction(x, type = 'ease') {
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
        }
    }
}