const DEFAULT_POSITION_WHITE = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const DEFAULT_POSITION_BLACK = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1'
const ANIMATION = 300;
const SLOW_ANIMATION = 600;
const FAST_ANIMATION = 150;

class ChessboardConfig {

    constructor(settings) {
        this.id_div = settings.id_div;
        this.position = settings.position || DEFAULT_POSITION_WHITE;
        this.color = settings.color || 'w';
        this.hint = settings.hint;
        this.animation = settings.animation || ANIMATION;

        // mode: 'normal', 'creative'
        this.mode = settings.mode || 'normal';

        // deaggable: true, false
        this.draggable = settings.draggable;

        // dropOffBoard: 'snapback', 'trash'
        this.dropOffBoard = settings.dropOffBoard || 'snapback';

        // hints: true, false
        this.hints = settings.hints;

        // onlyLegalMoves: true, false
        this.onlyLegalMoves = settings.onlyLegalMoves;

        // clickable: true, false
        this.clickable = settings.clickable;

        // ---------------------- Move

        // movableColors: 'white', 'black', 'both', 'none'
        this.movableColors = settings.movableColors || 'both';

        // moveHighlight: true, false
        this.moveHighlight = settings.moveHighlight;

        // moveAnimation: 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'none'
        this.moveAnimation = settings.moveAnimation ? settings.moveAnimation : 'ease';

        // moveTime: integer, 'slow', 'fast'
        this.moveTime = settings.moveTime ? settings.moveTime : 'fast';

        // ---------------------- Snapback

        // snapbackTime: integer, 'slow', 'fast'
        this.snapbackTime = settings.snapbackTime ? settings.snapbackTime : 'fast';

        // snapbackAnimation: 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'none'
        this.snapbackAnimation = settings.snapbackAnimation ? settings.snapbackAnimation : 'ease';

        // ---------------------- Fade

        // fadeTime: integer, 'slow', 'fast'
        this.fadeTime = settings.fadeTime ? settings.fadeTime : 'fast';

        // fadeAnimation: 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'none'
        this.fadeAnimation = settings.fadeAnimation ? settings.fadeAnimation : 'ease';

        // ---------------------- Pieces

        // ratio: integer
        settings.ratio ? this.setCSSProperty('pieceRatio', settings.ratio) : null;

        // piecesPath: string
        this.piecesPath = settings.piecesPath ? settings.piecesPath : 'default_pieces';


        // ---------------------- Methods

        // onMove: function(move)
        this.onMove = settings.onMove ? settings.onMove : () => true;

        // onMoveEnd: function(move)
        this.onMoveEnd = settings.onMoveEnd ? settings.onMoveEnd : () => true;

        // onChange: function(fen)
        this.onChange = settings.onChange ? settings.onChange : () => true;

        // onDragStart: function(from, piece)
        this.onDragStart = settings.onDragStart ? settings.onDragStart : () => true;

        // onDragMove: function(from, to, piece)
        this.onDragMove = settings.onDragMove ? settings.onDragMove : () => true;

        // onDrop: function(from, to, piece)
        this.onDrop = settings.onDrop ? settings.onDrop : () => true;

        // onSnapbackEnd: function(from, piece)
        this.onSnapbackEnd = settings.onSnapbackEnd ? settings.onSnapbackEnd : () => true;

        // ---------------------- Colors

        // whiteSquare: string
        settings.whiteSquare ? this.setCSSProperty('whiteSquare', settings.whiteSquare) : null;

        // blackSquare: string
        settings.blackSquare ? this.setCSSProperty('blackSquare', settings.blackSquare) : null;

        // highlightSquare: string
        settings.highlightSquare ? this.setCSSProperty('highlightSquare', settings.highlightSquare) : null;

        // selectedSquareWhite: string
        settings.selectedSquareWhite ? this.setCSSProperty('selectedSquareWhite', settings.selectedSquareWhite) : null;

        // selectedSquareBlack: string
        settings.selectedSquareBlack ? this.setCSSProperty('selectedSquareBlack', settings.selectedSquareBlack) : null;

        // movedSquareWhite: string
        settings.movedSquareWhite ? this.setCSSProperty('movedSquareWhite', settings.movedSquareWhite) : null;

        // movedSquareBlack: string
        settings.movedSquareBlack ? this.setCSSProperty('movedSquareBlack', settings.movedSquareBlack) : null;

        // choiceSquare: string
        settings.choiceSquare ? this.setCSSProperty('choiceSquare', settings.choiceSquare) : null;

        // coverSquare: string
        settings.coverSquare ? this.setCSSProperty('coverSquare', settings.coverSquare) : null;

        // hintColor: string
        settings.hintColor ? this.setCSSProperty('hintColor', settings.hintColor) : null;

        // Configure modes

        if (this.mode === 'creative') {
            this.onlyLegalMoves = false;
            this.hints = false;
        } else if (this.mode === 'normal') {
            this.onlyLegalMoves = true;
        }

    }

    setCSSProperty(property, value) {
        document.documentElement.style.setProperty('--' + property, value);
    }

    setColor(color) {
        this.color = color;
        return this;
    }

    build() {
        return new Chessboard(this);
    }

}

class Chessboard {

    constructor(config) {
        this.config = config;
        this.pezzi = {};
        this.pieces = {};
        this.celle = {};
        this.squares = {};
        this.buildGame(config.position);
        this.initParams();
        this.buildBoard();
        this.updatePosition();
    }

    // Build

    buildGame(position) {
        if (typeof position === 'string') this.game = Chess(position);
        else {
            let game = new Chess('start');
            for (let square in position) {
                game.put({ type: position[square][0], color: position[square][1] }, square);
            }
            this.game = game;
        }
    }

    buildBoard() {
        this.board = document.getElementById(this.config.id_div);
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

    resizeBoard(value) {
        document.documentElement.style.setProperty('--dimBoard', value + 'px');
        this.updatePosition();
    }


    // Pieces

    getPiecePath(piece) {
        if (typeof this.config.piecesPath === 'string') return this.config.piecesPath + '/' + piece + '.svg';
        else return this.config.piecesPath(piece);
    }

    containsPiece(square) {
        let piece = this.game.get(square);
        return piece ? piece['type'] + piece['color'] : null;
    }

    colorPiece(square) {
        let piece = this.containsPiece(square);
        return piece ? piece[1] : null;
    }

    traslation(elem, from, to, duration) {

        let piece = elem.src.split('/').pop().split('.')[0];

        if (duration === 'none' || duration === 0) {
            this.removePiece(from, piece, false);
            this.putPiece(to, piece, false);
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
                if (to) board.putPiece(to, board.containsPiece(to), false);
            }
        }

        requestAnimationFrame(translate);
    }

    translatePiece(piece, from, to, removeTo, animate) {

        if (!animate) {
            this.removePiece(from, piece, false);
            this.putPiece(to, piece, false);
            return;
        };

        let elem = this.pieces[(piece, from)]['img'];

        if (removeTo) this.removePiece(to);

        return this.traslation(elem, from, to, this.config.moveTime);
    }

    snapbackPiece(square, piece, animate = true) {

        if (!animate) {
            this.removePiece(square, piece, false);
            this.putPiece(square, piece, false);
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

    putPiece(square, piece, fade = true) {

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
            board.onClick(square)

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
                    board.highlightSquare(to);
                    board.dehighlightSquare(recent);
                    recent = to;
                }
            }
            document.addEventListener('mousemove', onMouseMove);

            // Drop the piece and remove the event listener
            img.onmouseup = function () {
                board.dehighlightSquare(recent);
                document.removeEventListener('mousemove', onMouseMove);
                img.onmouseup = null;
                let drop = board.config.onDrop(from, to, piece);
                if ((board.config.dropOffBoard === 'trash' || drop === 'trash') && !to) {
                    board.unmoveAllSquares();
                    board.dehintAllSquares();
                    board.deselectSquare(from);
                    board.eliminatePiece(from);
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
            canEscape[square] = this.pezzi[square] && this.containsPiece(square) !== this.pezzi[square]['piece'];
        }


        for (let square in this.celle) {

            let pieceNew = this.containsPiece(square);
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

                        if (!this.containsPiece(from)) ok[from] = true;
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

            let pieceNew = this.containsPiece(square);
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
                        if (pieceNew) this.putPiece(square, pieceNew);
                    }
                }
            }
        }

        this.config.onChange(this.game.fen());
    }

    removePieces() {
        for (let casella in this.celle) {
            this.removePiece(casella);
        }
    }

    opponentPiece(square) {
        let piece = this.containsPiece(square);
        return piece && piece[1] !== this.config.color;
    }

    playerPiece(square) {
        let piece = this.containsPiece(square);
        return piece && piece[1] === this.config.color;
    }

    isPiece(piece, square) {
        return this.containsPiece(square) === piece;
    }

    eliminatePiece(square) {
        this.game.remove(square);
        this.removePiece(square, null, true);
    }


    // Listeners

    addListeners() {
        if (this.mosseIndietro.length > 0) return;
        for (let square in this.celle) {
            let elem = this.celle[square];
            elem.addEventListener("mouseover", () => {
                if (!this.lastSquare) this.hintMoves(square);
            });
            elem.addEventListener("mouseout", () => {
                if (!this.lastSquare) this.dehintMoves(square);
            });
            elem.addEventListener("click", () => {
                if (this.config.clickable) this.onClick(square)
            });
            elem.addEventListener("touch", () => {
                if (this.config.clickable) this.onClick(square)
            });
        }
    }

    onClick(square, animation = true) {

        if (!square || square === this.lastSquare) return;

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
            this.deselectSquare(from);
            this.dehintAllSquares();
        } else if (!this.canMove(square)) return;

        if (from && this.canMove(from)) {

            if (this.config.onlyLegalMoves && !this.legalMove(move)) return;
            if (move.length == 4 && this.promote(move)) return;

            if (this.config.onMove(move)) this.makeMove(move, animation);
            else return;

            return true;

        } else if (this.canMove(square)) {
            this.selectSquare(square);
            this.hintMoves(square);
            this.lastSquare = square;
        }
    }

    // Hint

    hintSquare(square) {
        if (!this.config.hints || !this.celle[square]) return;

        let hint = document.createElement("div");
        hint.className = "hint";

        if (this.colorPiece(square) && this.colorPiece(square) !== this.turn()) hint.className += " catchable";

        this.celle[square].appendChild(hint);

    }

    hintMoves(square) {
        let mosse = this.game.moves({ square: square, verbose: true });
        for (let mossa of mosse) {
            this.hintSquare(mossa['to']);
        }
    }

    dehintMoves(square) {
        let mosse = this.game.moves({ square: square, verbose: true });
        for (let mossa of mosse) {
            this.dehintSquare(mossa['to']);
        }
    }

    dehintSquare(square) {
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
            this.dehintSquare(casella);
        }
    }

    // Select

    selectSquare(square) {
        if (!this.config.clickable) return;
        let elem = this.celle[square];
        if (this.isWhiteSquare(square)) elem.className += ' selectedSquareWhite';
        else elem.className += ' selectedSquareBlack';
    }

    deselectSquare(square) {
        let elem = this.celle[square];
        if (this.isWhiteSquare(square)) elem.className = elem.className.replace(' selectedSquareWhite', '');
        else elem.className = elem.className.replace(' selectedSquareBlack', '');
    }

    deselectAllSquares() {
        for (let casella in this.celle) {
            this.deselectSquare(casella);
        }
    }

    // Moves

    canMove(square) {
        if (!this.containsPiece(square)) return false;
        if (this.config.movableColors === 'none') return false;
        if (this.config.movableColors === 'white' && this.colorPiece(square) === 'b') return false;
        if (this.config.movableColors === 'black' && this.colorPiece(square) === 'w') return false;
        if (!this.config.onlyLegalMoves) return true;
        if (this.colorPiece(square) !== this.turn()) return false;
        return true;
    }

    makeMove(move, animation) {

        if (!this.config.onlyLegalMoves) {
            let piece = this.containsPiece(move.slice(0, 2));
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

        this.movedSquare(move['to']);
        this.movedSquare(move['from']);

        this.dehintAllSquares();

        this.config.onMoveEnd(move);

        return true;


    }

    makeRandomMove() {
        if (this.isGameOver()) return;
        let legalMoves = this.getLegalMoves();
        let randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        let mossa = randomMove['from'] + randomMove['to'] + (randomMove['promotion'] ? randomMove['promotion'] : '');
        this.makeMove(mossa);
    }

    movedSquare(square) {
        let elem = this.celle[square];
        if (this.isWhiteSquare(square)) elem.className += ' movedSquareWhite';
        else elem.className += ' movedSquareBlack';
    }

    unmovedSquare(square) {
        let elem = this.celle[square];
        if (this.isWhiteSquare(square)) elem.className = elem.className.replace(' movedSquareWhite', '');
        else elem.className = elem.className.replace(' movedSquareBlack', '');
    }

    unmoveAllSquares() {
        for (let casella in this.celle) {
            this.unmovedSquare(casella);
        }
        return;
    }

    legalMove(mossa) {
        let legalMoves = this.getLegalMoves(mossa.slice(0, 2));
        for (let i in legalMoves) {
            if (legalMoves[i]['to'] === mossa.slice(2, 4) && (mossa.length === 4 || mossa[4] === legalMoves[i]['promotion'])) return true;
        }

        return false;
    }

    getLegalMoves(from = null, verb = true) {
        if (from === null) return this.game.moves({ verbose: verb });
        return this.game.moves({ square: from, verbose: verb });
    }

    lastMove() {
        return this.history[this.history.length - 1];
    }

    // State

    isGameOver() {
        if (this.game.game_over()) {
            if (this.game.in_checkmate()) return this.game.turn() === 'w' ? 'b' : 'w';
            return 'p';
        }
        return null;
    }

    turn() {
        return this.game.turn();
    }

    // Position

    chageFenTurn(fen, color) {
        let parts = fen.split(' ');
        parts[1] = color;
        return parts.join(' ');
    }

    setPosition(position, color = null) {
        this.initParams();
        this.dehintAllSquares();
        this.deselectAllSquares();
        this.unmoveAllSquares();
        if (!color) color = position.split(' ')[1];
        let change_color = this.config.color !== color;
        this.config.setColor(color);
        this.game = new Chess(position);
        this.updatePosition(change_color);
    }

    changeColor() {
        let position = this.game.fen();
        this.setPosition(position, this.config.color === 'w' ? 'b' : 'w');
    }

    playerTurn() { // Restituisce true se è il turno del giocatore
        return this.config.color === this.game.turn();
    }

    isWhiteSquare(square) {
        let letters = 'abcdefgh';
        return (letters.indexOf(square[0]) + parseInt(square[1])) % 2 === 0;
    }

    isWhiteOriented() {
        return this.config.color === 'w';
    }

    updatePosition(change_color = false, animation = true) {
        if (change_color) {
            this.removeSquares();
            this.buildSquares();
        }
        this.updatePieces(animation);
    }

    // Squares

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

    // Highlight

    highlightSquare(square) {
        if (!square || !this.celle[square] || !this.config.moveHighlight) return;
        let elem = this.celle[square];
        elem.className += ' highlighted';
    }

    dehighlightSquare(square) {
        if (!square || !this.celle[square] || !this.config.moveHighlight) return;
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

    // Game replay

    backward() {
        let mossa = this.game.undo();
        if (mossa !== null) {
            this.mosseIndietro.push(mossa);
            this.updatePosition();
            if (this.game.undo()) this.avanti();
        } else {
            this.updatePosition();
        }
        return mossa;
    }

    forward() {
        if (this.mosseIndietro.length === 0) return;
        let mossa = this.mosseIndietro.pop();
        mossa = mossa['from'] + mossa['to'] + (mossa['promotion'] ? mossa['promotion'] : '');
        this.makeMove(mossa, false);
    }

    lastPosition() {
        while (this.mosseIndietro.length > 0) {
            this.avanti();
        }
    }

    firstPosition() {
        let mossa = this.game.undo();
        while (mossa !== null) {
            this.mosseIndietro.push(mossa);
            mossa = this.game.undo();
        }
        this.updatePosition();
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