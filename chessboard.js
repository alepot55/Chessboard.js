import { Chess, validateFen } from './chess.js';
import ChessboardConfig from './chessboard.config.js';
import Square from './chessboard.square.js';
import Piece from './chessboard.piece.js';
import Move from './chessboard.move.js';

class Chessboard {

    standard_positions = {
        'start': 'start',
        'default': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    }

    error_messages = {
        'invalid_position': 'Invalid position - ',
        'invalid_id_div': 'Board id not found - ',
        'invalid_value': 'Invalid value - ',
        'invalid_piece': 'Invalid piece - ',
        'invalid_square': 'Invalid square - ',
        'invalid_fen': 'Invalid fen - ',
        'invalid_orientation': 'Invalid orientation - ',
        'invalid_color': 'Invalid color - ',
        'invalid_mode': 'Invalid mode - ',
        'invalid_dropOffBoard': 'Invalid dropOffBoard - ',
        'invalid_snapbackTime': 'Invalid snapbackTime - ',
        'invalid_snapbackAnimation': 'Invalid snapbackAnimation - ',
        'invalid_fadeTime': 'Invalid fadeTime - ',
        'invalid_fadeAnimation': 'Invalid fadeAnimation - ',
        'invalid_ratio': 'Invalid ratio - ',
        'invalid_piecesPath': 'Invalid piecesPath - ',
        'invalid_onMove': 'Invalid onMove - ',
        'invalid_onMoveEnd': 'Invalid onMoveEnd - ',
        'invalid_onChange': 'Invalid onChange - ',
        'invalid_onDragStart': 'Invalid onDragStart - ',
        'invalid_onDragMove': 'Invalid onDragMove - ',
        'invalid_onDrop': 'Invalid onDrop - ',
        'invalid_onSnapbackEnd': 'Invalid onSnapbackEnd - ',
        'invalid_whiteSquare': 'Invalid whiteSquare - ',
        'invalid_blackSquare': 'Invalid blackSquare - ',
        'invalid_highlight': 'Invalid highlight - ',
        'invalid_selectedSquareWhite': 'Invalid selectedSquareWhite - ',
        'invalid_selectedSquareBlack': 'Invalid selectedSquareBlack - ',
        'invalid_movedSquareWhite': 'Invalid movedSquareWhite - ',
        'invalid_movedSquareBlack': 'Invalid movedSquareBlack - ',
        'invalid_choiceSquare': 'Invalid choiceSquare - ',
        'invalid_coverSquare': 'Invalid coverSquare - ',
        'invalid_hintColor': 'Invalid hintColor - ',
    }

    constructor(config) {
        this.config = new ChessboardConfig(config);
        this.init();
    }

    // Build

    init() {
        this.initParams();
        this.buildGame(this.config.position);
        this.buildBoard();
        this.buildSquares();
        this.addListeners();
        this.updateBoardPieces();
    }

    initParams() {
        this.board = null;
        this.squares = {};
        this.promoting = false;
        this.clicked = null;
        this.history = [];
        this.mosseIndietro = [];
        this.clicked = null;
    }

    buildGame(position) {
        if (typeof position === 'object') {
            this.game = new Chess('start');
            Object.entries(position).forEach(([square, [type, color]]) => {
                this.game.put({ type, color }, square);
            });
        } else if (Object.values(this.standard_positions).includes(position)) {
            if (position === 'start') this.game = new Chess();
            else this.game = new Chess(this.standard_positions[position]);
        } else if (validateFen(position)) {
            this.game = new Chess(position);
        } else {
            throw new Error(this.error_messages['invalid_position'] + position);
        }
    }

    buildBoard() {
        this.board = document.getElementById(this.config.id_div);
        if (!this.board) {
            throw new Error(this.error_messages['invalid_id_div'] + this.config.id_div);
        }
        this.resize(this.config.size);
        this.board.className = "board";
    }

    realCoord(row, col) {
        if (this.isWhiteOriented()) row = 7 - row;
        else col = 7 - col;
        return [row + 1, col + 1];
    }

    buildSquares() {

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {

                let [square_row, square_col] = this.realCoord(row, col);
                let square = new Square(square_row, square_col);
                this.squares[square.getId()] = square;

                this.board.appendChild(square.element);
            }
        }
    }

    removeBoard() {

        this.board.innerHTML = '';
    }

    // Pieces

    getPiecePath(piece) {
        if (typeof this.config.piecesPath === 'string')
            return this.config.piecesPath + '/' + piece + '.svg';
        else if (typeof this.config.piecesPath === 'object')
            return this.config.piecesPath[piece];
        else if (typeof this.config.piecesPath === 'function')
            return this.config.piecesPath(piece);
        else
            throw new Error(this.error_messages['invalid_piecesPath']);
    }

    colorPiece(square) {
        let piece = this.piece(square);
        return piece ? piece[1] : null;
    }

    movePiece(piece, to, duration, callback) {
        piece.translate(to, duration, this.transitionTimingFunction, this.config.moveAnimation, callback);
    }

    translatePiece(move, removeTo, animate, callback = null) {

        if (removeTo) this.removePieceFromSquare(move.to, false);

        let change_square = () => {
            move.from.removePiece();
            move.to.putPiece(move.piece);
            move.piece.setDrag(this.dragFunction(move.to, move.piece));
            if (callback) callback();
        }

        let duration = animate ? this.config.moveTime : 0;

        this.movePiece(move.piece, move.to, duration, change_square);

    }

    snapbackPiece(square, animate) {
        let move = new Move(square, square);
        this.translatePiece(move, false, animate);
    }

    convertSquare(square) {
        if (square instanceof Square) return square;
        if (typeof square === 'string' && this.squares[square]) return this.squares[square];
        throw new Error('Invalid square value');
    }

    removePieceFromSquare(square, fade = true) {

        square = this.convertSquare(square);
        square.check();

        let piece = square.piece;

        if (!piece) throw Error('Square has no piece to remove.')

        if (fade) piece.fadeOut(
            this.config.fadeTime,
            this.config.fadeAnimation,
            this.transitionTimingFunction);

        square.removePiece();

        return piece;
    }

    dragFunction(square, piece) {

        return (event) => {

            event.preventDefault();

            if (!this.config.draggable || !piece) return;
            if (!this.config.onDragStart(square, piece)) return;

            let prec;
            let from = square;
            let to = square;

            const img = piece.element;

            if (!this.canMove(from)) return;
            if (!this.config.clickable) this.clicked = null;
            if (this.onClick(from)) return;

            img.style.position = 'absolute';
            img.style.zIndex = 100;

            const moveAt = (pageX, pageY) => {
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
                    newTo = this.squares[this.getSquareID(row, col)];
                }

                to = newTo;
                this.config.onDragMove(from, to, piece);

                if (to !== prec) {
                    to?.highlight();
                    prec?.dehighlight();
                    prec = to;
                }
            };

            const onMouseUp = () => {
                prec?.dehighlight();
                document.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                img.style.zIndex = 20;

                const dropResult = this.config.onDrop(from, to, piece);
                const isTrashDrop = !to && (this.config.dropOffBoard === 'trash' || dropResult === 'trash');

                if (isTrashDrop) {
                    this.allSquares("unmoved");
                    this.allSquares('removeHint');
                    from.deselect();
                    this.remove(from);
                } else if (!to || !this.onClick(to, true)) {
                    this.snapbackPiece(from, !this.promoting);
                    this.config.onSnapbackEnd(from, piece);
                }
            };

            window.addEventListener('mouseup', onMouseUp, { once: true });
            document.addEventListener('mousemove', onMouseMove);
            img.addEventListener('mouseup', onMouseUp, { once: true });
        }
    }

    convertPiece(piece) {
        if (piece instanceof Piece) return piece;
        if (typeof piece === 'string') {
            let [type, color] = piece.split('');
            return new Piece(color, type, this.getPiecePath(piece));
        }
        throw new Error(this.error_messages['invalid_piece'] + piece);
    }

    addPieceOnSquare(square, piece, fade = true) {

        square.putPiece(piece);
        piece.setDrag(this.dragFunction(square, piece));

        if (fade) piece.fadeIn(
            this.config.fadeTime,
            this.config.fadeAnimation,
            this.transitionTimingFunction
        );

        piece.visible();
    }

    updateBoardPieces(animation = false) {
        let { updatedFlags, escapeFlags, movableFlags, pendingTranslations } = this.prepareBoardUpdateData();

        this.identifyPieceTranslations(updatedFlags, escapeFlags, movableFlags, pendingTranslations);

        this.executePieceTranslations(pendingTranslations, escapeFlags, animation);

        this.processRemainingPieceUpdates(updatedFlags, animation);
    }

    prepareBoardUpdateData() {
        let updatedFlags = {};
        let escapeFlags = {};
        let movableFlags = {};
        let pendingTranslations = [];

        for (let squareId in this.squares) {
            let cellPiece = this.squares[squareId].piece;
            let cellPieceId = cellPiece ? cellPiece.getId() : null;
            updatedFlags[squareId] = this.piece(squareId) === cellPieceId;
            escapeFlags[squareId] = false;
            movableFlags[squareId] = cellPiece ? this.piece(squareId) !== cellPieceId : false;
        }

        return { updatedFlags, escapeFlags, movableFlags, pendingTranslations };
    }

    identifyPieceTranslations(updatedFlags, escapeFlags, movableFlags, pendingTranslations) {
        Object.values(this.squares).forEach(targetSquare => {
            const newPieceId = this.piece(targetSquare.id);
            const newPiece = newPieceId && this.convertPiece(newPieceId);
            const currentPiece = targetSquare.piece;
            const currentPieceId = currentPiece ? currentPiece.getId() : null;

            if (currentPieceId === newPieceId || updatedFlags[targetSquare.id]) return;

            this.evaluateTranslationCandidates(
                targetSquare,
                newPiece,
                currentPiece,
                updatedFlags,
                escapeFlags,
                movableFlags,
                pendingTranslations
            );
        });
    }

    evaluateTranslationCandidates(targetSquare, newPiece, oldPiece, updatedFlags, escapeFlags, movableFlags, pendingTranslations) {
        if (!newPiece) return;
        const newPieceId = newPiece.getId();

        for (const sourceSquare of Object.values(this.squares)) {
            if (sourceSquare.id === targetSquare.id || updatedFlags[targetSquare.id]) continue;

            const sourcePiece = sourceSquare.piece;
            if (!sourcePiece || !movableFlags[sourceSquare.id] || this.isPiece(newPieceId, sourceSquare.id)) continue;

            if (sourcePiece.id === newPieceId) {
                this.handleTranslationMovement(targetSquare, sourceSquare, oldPiece, sourcePiece, updatedFlags, escapeFlags, movableFlags, pendingTranslations);
                break;
            }
        }
    }

    handleTranslationMovement(targetSquare, sourceSquare, oldPiece, currentSource, updatedFlags, escapeFlags, movableFlags, pendingTranslations) {
        // Verifica il caso specifico "en passant"
        let lastMove = this.lastMove();
        if (!oldPiece && lastMove && lastMove['captured'] === 'p') {
            this.removePieceFromSquare(this.squares[targetSquare.id[0] + sourceSquare.id[1]]);
        }

        pendingTranslations.push([currentSource, sourceSquare, targetSquare]);

        if (!this.piece(sourceSquare.id)) updatedFlags[sourceSquare.id] = true;

        escapeFlags[sourceSquare.id] = true;
        movableFlags[sourceSquare.id] = false;
        updatedFlags[targetSquare.id] = true;
    }

    executePieceTranslations(pendingTranslations, escapeFlags, animation) {
        for (let [_, sourceSquare, targetSquare] of pendingTranslations) {
            let removeTarget = !escapeFlags[targetSquare.id] && targetSquare.piece;
            let moveObj = new Move(sourceSquare, targetSquare);
            this.translatePiece(moveObj, removeTarget, animation);
        }
    }

    // Gestisce gli aggiornamenti residui per ogni cella che non è ancora stata correttamente aggiornata
    processRemainingPieceUpdates(updatedFlags, animation) {
        for (const square of Object.values(this.squares)) {
            let newPieceId = this.piece(square.id);
            let newPiece = newPieceId ? this.convertPiece(newPieceId) : null;
            let currentPiece = square.piece;
            let currentPieceId = currentPiece ? currentPiece.getId() : null;

            if (currentPieceId !== newPieceId && !updatedFlags[square.id]) {
                this.updateSinglePiece(square, newPiece, updatedFlags, animation);
            }
        }
    }

    // Aggiorna il pezzo in una cella specifica. Gestisce anche il caso di promozione
    updateSinglePiece(square, newPiece, updatedFlags, animation) {
        if (!updatedFlags[square.id]) {
            let lastMove = this.lastMove();

            if (lastMove?.promotion) {
                if (lastMove['to'] === square.id) {

                    let move = new Move(this.squares[lastMove['from']], square);
                    this.translatePiece(move, true, animation
                        , () => {
                            move.to.removePiece();
                            this.addPieceOnSquare(square, newPiece);
                        });
                }
            } else {
                if (square.piece) this.removePieceFromSquare(square);
                if (newPiece) this.addPieceOnSquare(square, newPiece);
            }
        }
    }

    isPiece(piece, square) { return this.piece(square) === piece }

    // Listeners

    addListeners() {
        for (const square of Object.values(this.squares)) {

            let piece = square.piece;

            square.element.addEventListener("mouseover", (e) => {
                if (!this.clicked) this.hintMoves(square);
            });
            square.element.addEventListener("mouseout", (e) => {
                if (!this.clicked) this.dehintMoves(square);
            });

            const handleClick = (e) => {
                e.stopPropagation();
                if (this.config.clickable && (!piece || this.config.onlyLegalMoves)) this.onClick(square)
            }

            square.element.addEventListener("click", handleClick);
            square.element.addEventListener("touch", handleClick);
        }
    }

    onClick(square, animation = this.config.moveAnimation) {

        if (square.id === this.clicked?.id) return false;

        let from = this.clicked;
        this.clicked = null;

        let promotion = null

        if (this.promoting) {
            if (this.promoting === 'none') from = null
            else promotion = this.promoting;

            this.promoting = false;
            this.allSquares("removePromotion");
            this.allSquares("removeCover");
        }

        if (!from) {

            if (this.canMove(square)) {
                square.select();
                this.hintMoves(square);
                this.clicked = square;
            }

            return false;
        }

        if (!this.canMove(from)) return false;

        let move = new Move(from, square, promotion);

        move.from.deselect();
        this.allSquares("removeHint");

        if (this.config.onlyLegalMoves && !move.isLegal(this.game)) return false;

        if (!move.hasPromotion() && this.promote(move)) return false;

        if (this.config.onMove(move)) {
            this.move(move, animation);
            return true;
        }

        return false;
    }

    // Hint

    hint(square) {
        if (!this.config.hints || !this.squares[square]) return;
        this.squares[square].putHint(this.colorPiece(square) && this.colorPiece(square) !== this.turn());
    }

    hintMoves(square) {
        if (!this.canMove(square)) return;
        let mosse = this.game.moves({ square: square.id, verbose: true });
        for (let mossa of mosse) {
            if (mossa['to'].length === 2) this.hint(mossa['to']);
        }
    }

    dehintMoves(square) {
        let mosse = this.game.moves({ square: square.id, verbose: true });
        for (let mossa of mosse) {
            let to = this.squares[mossa['to']];
            to.removeHint();
        }
    }

    // Moves

    canMove(square) {
        if (!square.piece) return false;
        if (this.config.movableColors === 'none') return false;
        if (this.config.movableColors === 'w' && square.piece.color === 'b') return false;
        if (this.config.movableColors === 'b' && square.piece.color === 'w') return false;
        if (!this.config.onlyLegalMoves) return true;
        return square.piece.color == this.turn();
    }

    convertMove(move) {
        if (move instanceof Move) return move;
        if (typeof move == 'string') {
            let fromId = move.slice(0, 2);
            let toId = move.slice(2, 4);
            let promotion = move.slice(4, 5) ? move.slice(4, 5) : null;
            return new Move(this.squares[fromId], this.squares[toId], promotion);
        }
        throw new Error("Invalid move format");
    }

    allSquares(method) {
        for (const square of Object.values(this.squares)) {
            square[method]();
            this.squares[square.id] = square;
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

    isLegalMove(move) {
        return this.game.move(move) !== null;
    }

    // Position

    chageFenTurn(fen, color) {
        let parts = fen.split(' ');
        parts[1] = color;
        return parts.join(' ');
    }

    changeFenColor(fen) {
        let parts = fen.split(' ');
        parts[1] = parts[1] === 'w' ? 'b' : 'w';
        return parts.join(' ');
    }

    playerTurn() {
        return this.getOrientation() == this.game.turn()
    }

    isWhiteOriented() { return this.config.orientation === 'w' }

    // Squares

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

    removeSquares() {
        for (const square of Object.values(this.squares)) {
            this.board.removeChild(square.element);
            square.destroy();

        }
        this.squares = {};
    }

    promote(move) {

        if (!this.config.onlyLegalMoves) return false;

        let to = move.to;
        let from = move.from;
        let pezzo = this.game.get(from.id);
        let choichable = ['q', 'r', 'b', 'n']

        if (pezzo['type'] !== 'p' || !(to.row === 1 || to.row === 8)) return false;

        for (const square of Object.values(this.squares)) {
            let distance = Math.abs(to.row - square.row);

            if (to.col === square.col && distance <= 3) {

                let pieceId = choichable[distance] + pezzo['color'];

                square.putPromotion(
                    this.getPiecePath(pieceId),
                    () => {
                        this.promoting = pieceId[0]
                        this.clicked = from;
                        this.onClick(to);
                    }
                );
            } else
                square.putCover(
                    () => {
                        this.promoting = 'none';
                        this.onClick(square);
                    });
        }

        this.clicked = from.id;

        return true;
    }

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

    // user

    turn() {
        return this.game.turn();
    }

    getOrientation() {
        return this.config.orientation;
    }

    fen() {
        return this.game.fen();
    }

    lastMove() {
        return this.history[this.history.length - 1];
    }

    history() {
        return this.history;
    }

    get(square) {
        square = this.convertSquare(square);
        square.check();
        return this.squares[square.id].piece.id;
    }

    position(position, color = null) {
        this.allSquares('removeHint');
        this.allSquares("deselect");
        this.allSquares("unmoved");
        if (color && color !== this.config.orientation) {
            position = this.changeFenColor(position);
            this.config.orientation = color;
            this.destroy();
            this.init();
        } else {
            this.buildGame(this.config.position);
            this.updateBoardPieces();
        }
    }

    flip() {
        let position = this.game.fen();
        this.position(position, this.config.orientation === 'w' ? 'b' : 'w');
    }

    build() {
        this.destroy();
        this.init();
    }

    move(move, animation) {
        move = this.convertMove(move);
        move.check();

        let from = move.from;
        let to = move.to;

        if (!this.config.onlyLegalMoves) {
            let piece = this.piece(from.id);
            this.game.remove(from.id);
            this.game.remove(to.id);
            this.game.put({ type: move.hasPromotion() ? move.promotion : piece[0], color: piece[1] }, to.id);
            this.updateBoardPieces(animation);
        } else {
            this.allSquares("unmoved");

            move = this.game.move({
                from: from.id,
                to: to.id,
                promotion: move.hasPromotion() ? move.promotion : undefined
            });

            if (move === null) {
                throw new Error("Invalid move: move could not be executed");
            }

            this.history.push(move);

            this.updateBoardPieces(animation);

            from.moved();
            to.moved();
            this.allSquares("removeHint");

            this.config.onMoveEnd(move);
        }
    }

    clear(animation = true) {
        this.game.clear();
        this.updateBoardPieces(animation);
    }

    insert(square, piece) {
        square = this.convertSquare(square);
        piece = this.convertPiece(piece);
        square.check();
        piece.check();
        if (square.piece) this.remove(square);
        this.game.put({ type: piece.type, color: piece.color }, square.id);
        this.updateBoardPieces();
    }

    isGameOver() {
        if (this.game.game_over()) {
            if (this.game.in_checkmate()) return this.game.turn() === 'w' ? 'b' : 'w';
            return 'd';
        }
        return null;
    }

    orientation(color) {
        if ((color === 'w' || color === 'b') && color !== this.config.orientation) this.flip();
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
            throw new Error(this.error_messages['invalid_value'] + value);
        } else {
            document.documentElement.style.setProperty('--dimBoard', value + 'px');
            this.updateBoardPieces();
        }
    }

    destroy() {
        this.removeSquares();
        this.removeBoard();
        this.game = null;
        this.clicked = null;
        this.history = [];
        this.mosseIndietro = [];
        this.clicked = null;
        this.board = null;
    }

    remove(square, animation = true) {
        square = this.convertSquare(square);
        square.check();
        this.game.remove(square.id);
        let piece = square.piece;
        this.updateBoardPieces(animation);
        return piece;
    }

    piece(square) {
        let piece = this.game.get(square);
        return piece ? piece['type'] + piece['color'] : null;
    }

    highlight(square) {
        square = this.convertSquare(square);
        square.check();
        square.highlight();
    }

    dehighlight(square) {
        square = this.convertSquare(square);
        square.check();
        square.dehighlight();
    }

}

export default Chessboard;