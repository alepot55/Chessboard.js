import { Chess } from './chess.js';
import { ChessboardConfig, DEFAULT_POSITION_WHITE, SLOW_ANIMATION, FAST_ANIMATION } from './chessboard.config.js';
import Square from './chessboard.square.js';
import Piece from './chessboard.piece.js';
import Move from './chessboard.move.js';

export class Chessboard {

    constructor(config) {
        this.config = new ChessboardConfig(config);
        this.celle = {};
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

    realCoord(row, col) {
        if (this.isWhiteOriented()) {
            row = 7 - row;
        } else {
            col = 7 - col;
        }
        return [row + 1, col + 1];
    }

    buildSquares() {
        this.lastSquare = null;
        this.celle = {};
        this.mosseIndietro = [];


        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {

                let [square_row, square_col] = this.realCoord(row, col);
                let square = new Square(square_row, square_col);
                this.celle[square.getId()] = square;

                this.board.appendChild(square.getElement());
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

    getPiecePath(piece) {
        if (typeof this.config.piecesPath === 'string') return this.config.piecesPath + '/' + piece + '.svg';
        else return this.config.piecesPath(piece);
    }

    piece(square) {
        let piece = this.game.get(square);
        return piece ? piece['type'] + piece['color'] : null;
    }

    colorPiece(square) {
        let piece = this.piece(square);
        return piece ? piece[1] : null;
    }

    movePiece(piece, to, duration, callback) {

        if (duration === 'slow') duration = SLOW_ANIMATION;
        else if (duration === 'fast') duration = FAST_ANIMATION;
        piece.translate(to, duration, this.transitionTimingFunction, this.config.moveAnimation, callback);
    }

    translatePiece(move, removeTo, animate) {
        console.log('translatePiece');

        if (removeTo) this.removePiece(move.to.id);

        let change_square = () => {
            move.from.removePiece();
            move.to.putPiece(move.piece);
            move.piece.setDrag(this.dragFunction(move.to, move.piece));
        }

        let duration = animate ? this.config.moveTime : 0;

        this.movePiece(move.piece, move.to, duration, change_square);

    }

    snapbackPiece(square, animate) {
        let move = new Move(square, square);
        this.translatePiece(move, false, animate);
    }

    removePiece(square, p = null, fade = true) {

        square = this.celle[square];

        let piece = square.getPiece();

        if (fade) piece.fadeOut(
            this.config.fadeTime,
            this.config.fadeAnimation,
            this.transitionTimingFunction);

        square.removePiece();
    }

    dragFunction(square, piece) {

        return (event) => {

            if (!this.config.draggable || !piece) return;
            if (!this.config.onDragStart(square, piece)) return;

            let prec;
            let from = square;
            let to = square;
            let moved = false;

            const img = piece.getElement();

            if (!this.canMove(from.id)) return;
            if (!this.config.clickable) this.lastSquare = null;
            if (this.onClick(from.id)) return;

            img.style.position = 'absolute';
            img.style.zIndex = 100;

            const moveAt = (pageX, pageY) => {
                moved = true;
                const halfWidth = img.offsetWidth / 2;
                const halfHeight = img.offsetHeight / 2;
                img.style.left = `${pageX - halfWidth}px`;
                img.style.top = `${pageY - halfHeight}px`;
                return true;
            };

            const onMouseMove = (event) => {
                if (!moveAt(event.pageX, event.pageY)) return;

                const boardRect = this.board.getBoundingClientRect();
                const { offsetWidth: boardWidth, offsetHeight: boardHeight } = this.board;
                const x = event.clientX - boardRect.left;
                const y = event.clientY - boardRect.top;

                let newTo = null;
                if (x >= 0 && x <= boardWidth && y >= 0 && y <= boardHeight) {
                    const col = Math.floor(x / (boardWidth / 8));
                    const row = Math.floor(y / (boardHeight / 8));
                    newTo = this.celle[this.getSquareID(row, col)];
                }
                to = newTo;

                this.config.onDragMove(from, to, piece);

                if (to !== prec) {
                    this.highlight(to);
                    this.dehighlight(prec);
                    prec = to;
                }
            };

            const onMouseUp = () => {
                console.log('onMouseUp');
                this.dehighlight(prec);
                document.removeEventListener('mousemove', onMouseMove);
                img.onmouseup = null;
                img.style.zIndex = 20;

                const dropResult = this.config.onDrop(from, to, piece);
                const isTrashDrop = !to && (this.config.dropOffBoard === 'trash' || dropResult === 'trash');

                console.log(from, to); // zindex 99999 non so perchè

                if (isTrashDrop) {
                    this.unmoveAllSquares();
                    this.dehintAllSquares();
                    this.deselect(from);
                    this.remove(from);
                } else if (moved) {
                    if (!to || !this.onClick(to.id, true)) {
                        this.snapbackPiece(from, !this.promoting);
                        this.config.onSnapbackEnd(from, piece);
                    }
                }
            };

            document.addEventListener('mousemove', onMouseMove);
            img.addEventListener('mouseup', onMouseUp, { once: true });
        }
    }

    insert(square, pieceId, fade = this.config.fadeAnimation) {

        if (fade === 'none' || fade === 0) fade = false;

        if (this.celle[square].getPiece()) this.removePiece(square);

        square = this.celle[square];

        let piece = new Piece(pieceId[1], pieceId[0], this.getPiecePath(pieceId), 0);
        let img = piece.getElement();

        square.putPiece(piece);
        piece.setDrag(this.dragFunction(square, piece));

        if (fade) piece.fadeIn(
            this.config.fadeTime,
            this.config.fadeAnimation,
            this.transitionTimingFunction);

        piece.visible();
    }

    updatePieces(animation) {
        let { ok, escaping, canEscape, toTranslate } = this.preparePieceUpdateData();

        this.findTranslations(ok, escaping, canEscape, toTranslate);
        this.applyTranslations(toTranslate, escaping, animation);
        this.handleRemainingUpdates(ok, animation);

        this.config.onChange(this.game.fen());
    }

    preparePieceUpdateData() {
        let ok = {};
        let escaping = {};
        let canEscape = {};
        let toTranslate = [];

        for (let square in this.celle) {
            let piece = this.celle[square].getPiece();
            ok[square] = false;
            escaping[square] = false;
            canEscape[square] = piece && (this.piece(square) !== piece.getId());
        }

        return { ok, escaping, canEscape, toTranslate };
    }

    findTranslations(ok, escaping, canEscape, toTranslate) {
        for (let square in this.celle) {
            let pieceNew = this.piece(square);
            let pieceOld = this.celle[square].getPiece() ? this.celle[square].getPiece().getId() : null;

            if (pieceOld !== pieceNew && !ok[square]) {
                this.checkTranslations(square, pieceNew, pieceOld, ok, escaping, canEscape, toTranslate);
            }
        }
    }

    checkTranslations(square, pieceNew, pieceOld, ok, escaping, canEscape, toTranslate) {
        for (let from in this.celle) {
            let piece = this.celle[from].getPiece();
            let coming = piece ? piece.getId() : null;

            if (coming && canEscape[from] && !ok[square] && from !== square && coming === pieceNew && !this.isPiece(pieceNew, from)) {
                this.processTranslation(square, from, pieceOld, coming, ok, escaping, canEscape, toTranslate);
                break;
            }
        }
    }

    processTranslation(square, from, pieceOld, coming, ok, escaping, canEscape, toTranslate) {
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
    }

    applyTranslations(toTranslate, escaping, animation) {
        for (let [piece, from, to] of toTranslate) {
            let removeTo = !escaping[to] && this.celle[to].getPiece();
            let move = new Move(this.celle[from], this.celle[to]);
            this.translatePiece(move, removeTo, animation);
        }
    }

    handleRemainingUpdates(ok, animation) {
        for (let square in this.celle) {
            let pieceNew = this.piece(square);
            let pieceOld = this.celle[square].getPiece() ? this.celle[square].getPiece().getId() : null;

            if (pieceOld !== pieceNew && !ok[square]) {
                this.updatePiece(square, pieceNew, ok, animation);
            }
        }
    }

    updatePiece(square, pieceNew, ok, animation) {
        if (!ok[square]) {
            // check for promotion
            let last_move = this.lastMove();
            if (last_move?.promotion) {
                if (last_move.to.id === square) {
                    this.translatePiece(last_move, true, animation);
                    ok[last_move.from.id] = true;
                }
            } else {
                if (this.celle[square].hasPiece()) this.removePiece(square);
                if (pieceNew) this.insert(square, pieceNew);
            }
        }
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
        this.game.remove(square);
        this.removePiece(square, null, animation);
    }


    // Listeners

    addListeners() {
        if (this.mosseIndietro.length > 0) return;
        for (let square in this.celle) {
            let elem = this.celle[square].getElement();
            let piece = this.celle[square].getPiece();
            elem.addEventListener("mouseover", () => {
                if (!this.lastSquare) this.hintMoves(elem.id);
            });
            elem.addEventListener("mouseout", () => {
                if (!this.lastSquare) this.dehintMoves(elem.id);
            });
            elem.addEventListener("click", () => {
                if (this.config.clickable && (!piece || this.config.onlyLegalMoves)) this.onClick(elem.id)
            });
            elem.addEventListener("touch", () => {
                if (this.config.clickable) this.onClick(elem.id)
            });
        }
    }

    onClick(square, animation = this.config.moveAnimation) {

        console.log('onClick', square);

        if (!square || square === this.lastSquare) return;

        if (animation === 'none') {
            animation = false;
        }

        if (this.promoting) {
            this.depromoteAllSquares();
            this.removeAllCovers();
            this.promoting = false;
            if (square.length === 2) {
                this.lastSquare = null;
            }
        }

        let from = this.lastSquare;
        this.lastSquare = null;

        if (!from) {
            if (!this.canMove(square)) return;
            this.select(square);
            this.hintMoves(square);
            this.lastSquare = square;
            return;
        }


        this.deselect(this.celle[from]);
        this.dehintAllSquares();

        if (!this.canMove(from)) return;

        let move = new Move(this.celle[from], this.celle[square]);

        if (this.config.onlyLegalMoves && !this.legalMove(move)) return;

        if (!move.hasPromotion() && this.promote(move)) return;

        console.log('move', move);

        if (this.config.onMove(move)) {
            this.move(move, animation);
            return true;
        }
    }

    // Hint

    hint(square) {
        if (!this.config.hints || !this.celle[square]) return;
        this.celle[square].putHint(this.colorPiece(square) && this.colorPiece(square) !== this.turn());

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
            this.celle[square].removeHint();
        }
    }

    dehintAllSquares() {
        for (let casella in this.celle) {
            this.celle[casella].removeHint();
        }
    }

    // Select

    select(square) {
        if (!this.config.clickable) return;
        this.celle[square].select();
    }

    deselect(square) {
        square.deselect();
    }

    deselectAllSquares() {
        for (let casella in this.celle) {
            this.deselect(this.celle[casella]);
        }
    }

    // Moves

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

        let from = move.from
        let to = move.to

        if (!this.config.onlyLegalMoves) {
            let piece = this.piece(from.id);
            this.game.remove(from.id);
            this.game.remove(to.id);
            this.game.put({ type: move[4] ? move[4] : piece[0], color: piece[1] }, to.id);
            return this.updatePosition(false, false);
        }

        this.unmoveAllSquares();

        move = this.game.move({
            from: from.id,
            to: to.id,
            promotion: move.promotion
        });


        this.history.push(move);

        this.updatePosition(false, animation);

        from.moved();
        to.moved();

        this.dehintAllSquares();

        this.config.onMoveEnd(move);

        return true;
    }

    unmoveAllSquares() {
        for (let casella in this.celle) {
            this.celle[casella].unmoved();
        }
    }

    legalMove(move) {
        let legal_moves = this.legalMoves(move.from.id);

        for (let i in legal_moves) {
            if (legal_moves[i]['to'] === move.to.id &&
                move.promotion == legal_moves[i]['promotion'])
                return true;
        }

        return false;
    }

    legalMoves(from = null, verb = true) {
        if (from) return this.game.moves({ square: from, verbose: verb });
        return this.game.moves({ verbose: verb });
    }

    lastMove() {
        return this.history[this.history.length - 1];
    }

    history() {
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
        let new_pieces = {};
        for (let elem in this.celle) {
            let square = this.celle[elem]
            square.opposite();
            let piece = square.getPiece();
            let new_id = this.celle[elem].getId();
            new_pieces[piece.getId()][new_id] = piece;

        }
        this.p = new_pieces;
    }

    fen() {
        return this.game.fen();
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
        this.celle[square].resetElement();
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
            this.board.removeChild(this.celle[casella].getElement());
            this.celle[casella].remove();

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
        this.celle[square].highlight();
    }

    dehighlight(square) {
        if (!square || !this.celle[square] || !this.config.overHighlight) return;
        this.celle[square].dehighlight();
    }


    // Promotion

    coverSquare(square) {
        this.celle[square].putCover();
    }

    removeAllCovers() {
        for (let casella in this.celle) {
            this.celle[casella].removeCover();
        }
    }

    promoteSquare(square, piece) {
        this.celle[square].putPromotion();
        let choice = this.celle[square].getElement();

        let img = document.createElement("img");
        img.className = "piece choicable";
        img.src = this.getPiecePath(piece);
        choice.appendChild(img);

        return choice;
    }

    depromoteAllSquares() {
        for (let casella in this.celle) {
            this.celle[casella].removePromotion();
        }
    }

    promote(move) {

        if (!this.config.onlyLegalMoves) return false;

        let to = move.to.id;
        let from = move.from.id;
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

    transitionTimingFunction(elapsed, duration, type = 'ease') {
        let x = elapsed / duration;
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