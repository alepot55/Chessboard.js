import { Chess, validateFen } from '../utils/chess.js';
import ChessboardConfig from './ChessboardConfig.js';
import Square from '../components/Square.js';
import Piece from '../components/Piece.js';
import Move from '../components/Move.js';
import { rafThrottle, setTransform, resetTransform } from '../utils/performance.js';
import { MouseTracker, DragOptimizations } from '../utils/cross-browser.js';

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

    // -------------------
    // Initialization
    // -------------------
    constructor(config) {
        // Debug: log the config to see what we're receiving
        console.log('Chessboard constructor received config:', config);
        this.config = new ChessboardConfig(config);
        console.log('Processed config.id_div:', this.config.id_div);
        this.init();
    }

    init() {
        this.initParams();
        this.setGame(this.config.position);
        this.buildBoard();
        this.buildSquares();
        this.addListeners();
        this.updateBoardPieces();
    }

    initParams() {
        this.element = null;
        this.squares = {};
        this.promoting = false;
        this.clicked = null;
        this.mosseIndietro = [];
        this.clicked = null;
        this._updateTimeout = null; // For debouncing board updates
        this._movesCache = new Map(); // Cache per le mosse per migliorare le prestazioni
        this._cacheTimeout = null; // Timeout per pulire la cache
        this._isAnimating = false; // Flag to track if animations are in progress
    }

    // -------------------
    // Board Setup
    // -------------------
    buildBoard() {
        console.log('buildBoard: Looking for element with ID:', this.config.id_div, 'Type:', typeof this.config.id_div);
        this.element = document.getElementById(this.config.id_div);
        if (!this.element) {
            throw new Error(this.error_messages['invalid_id_div'] + this.config.id_div);
        }
        this.resize(this.config.size);
        this.element.className = "board";
    }

    buildSquares() {

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {

                let [square_row, square_col] = this.realCoord(row, col);
                let square = new Square(square_row, square_col);
                this.squares[square.getId()] = square;

                this.element.appendChild(square.element);
            }
        }
    }

    removeBoard() {

        this.element.innerHTML = '';
    }

    removeSquares() {
        for (const square of Object.values(this.squares)) {
            this.element.removeChild(square.element);
            square.destroy();

        }
        this.squares = {};
    }

    resize(value) {
        if (value === 'auto') {
            let size;
            if (this.element.offsetWidth === 0) {
                size = this.element.offsetHeight;
            } else if (this.element.offsetHeight === 0) {
                size = this.element.offsetWidth;
            } else {
                size = Math.min(this.element.offsetWidth, this.element.offsetHeight);
            }
            this.resize(size);
        } else if (typeof value !== 'number') {
            throw new Error(this.error_messages['invalid_value'] + value);
        } else {
            document.documentElement.style.setProperty('--dimBoard', value + 'px');
            this.updateBoardPieces();
        }
    }

    // -------------------
    // Game/Position Functions
    // -------------------
    convertFen(position) {
        if (typeof position === 'string') {
            if (position == 'start') return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            if (this.validateFen(position)) return position;
            else if (this.standard_positions[position]) return this.standard_positions[position];
            else throw new Error('Invalid position -' + position);
        } else if (typeof position === 'object') {
            let parts = [];
            for (let row = 0; row < 8; row++) {
                let rowParts = [];
                let empty = 0;
                for (let col = 0; col < 8; col++) {
                    let square = this.getSquareID(row, col);
                    let piece = position[square];
                    if (piece) {
                        if (empty > 0) {
                            rowParts.push(empty);
                            empty = 0;
                        }
                        // Convert piece notation: white pieces become uppercase, black remain lowercase.
                        let fenPiece = piece[1] === 'w' ? piece[0].toUpperCase() : piece[0].toLowerCase();
                        rowParts.push(fenPiece);
                    } else {
                        empty++;
                    }
                }
                if (empty > 0) rowParts.push(empty);
                parts.push(rowParts.join(''));
            }
            return parts.join('/') + ' w KQkq - 0 1';;
        } else {
            throw new Error('Invalid position -' + position);
        }
    }

    setGame(position, options = undefined) {
        const fen = this.convertFen(position);
        if (this.game) this.game.load(fen, options);
        else this.game = new Chess(fen);
    }

    // -------------------
    // Piece Functions
    // -------------------
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

    movePiece(piece, to, duration, callback) {
        if (!piece) {
            console.warn('movePiece: piece is null, skipping animation');
            if (callback) callback();
            return;
        }
        
        piece.translate(to, duration, this.transitionTimingFunction, this.config.moveAnimation, callback);
    }

    translatePiece(move, removeTo, animate, callback = null) {
        if (!move.piece) {
            console.warn('translatePiece: move.piece is null, skipping translation');
            if (callback) callback();
            return;
        }

        if (removeTo) {
            // Deselect the captured piece before removing it
            move.to.deselect();
            this.removePieceFromSquare(move.to, false);
        }

        let change_square = () => {
            // Check if piece still exists and is on the source square
            if (move.from.piece === move.piece) {
                move.from.removePiece();
            }
            // Only put piece if destination square doesn't already have it
            if (move.to.piece !== move.piece) {
                move.to.putPiece(move.piece);
                move.piece.setDrag(this.dragFunction(move.to, move.piece));
            }
            if (callback) callback();
        }

        let duration = animate ? this.config.moveTime : 0;

        this.movePiece(move.piece, move.to, duration, change_square);

    }

    snapbackPiece(square, animate = this.config.snapbackAnimation) {
        if (!square || !square.piece) {
            return;
        }
        
        const piece = square.piece;
        
        // Use the piece's translate method to properly animate back to the square
        const duration = animate ? this.config.snapbackTime : 0;
        
        // The translate method will calculate the proper distance from current visual position 
        // back to the square's position
        piece.translate(square, duration, this.transitionTimingFunction, animate);
    }

    // -------------------
    // Board Update Functions
    // -------------------
    updateBoardPieces(animation = false) {
        // Clear any pending update to avoid duplicate calls
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
            this._updateTimeout = null;
        }

        // Pulisce la cache delle mosse quando la posizione cambia
        this._movesCache.clear();
        if (this._cacheTimeout) {
            clearTimeout(this._cacheTimeout);
            this._cacheTimeout = null;
        }

        // For click-to-move, add a small delay to avoid lag
        if (animation && this.clicked === null) {
            this._updateTimeout = setTimeout(() => {
                this._doUpdateBoardPieces(animation);
                this._updateTimeout = null;
            }, 10);
        } else {
            this._doUpdateBoardPieces(animation);
        }
    }

    _doUpdateBoardPieces(animation = false) {
        let { updatedFlags, escapeFlags, movableFlags, pendingTranslations } = this.prepareBoardUpdateData();

        let change = Object.values(updatedFlags).some(flag => !flag);

        this.identifyPieceTranslations(updatedFlags, escapeFlags, movableFlags, pendingTranslations);

        this.executePieceTranslations(pendingTranslations, escapeFlags, animation);

        this.processRemainingPieceUpdates(updatedFlags, animation);

        if (change) this.config.onChange(this.fen());
    }

    prepareBoardUpdateData() {
        let updatedFlags = {};
        let escapeFlags = {};
        let movableFlags = {};
        let pendingTranslations = [];

        for (let squareId in this.squares) {
            let cellPiece = this.squares[squareId].piece;
            let cellPieceId = cellPiece ? cellPiece.getId() : null;
            updatedFlags[squareId] = this.getGamePieceId(squareId) === cellPieceId;
            escapeFlags[squareId] = false;
            movableFlags[squareId] = cellPiece ? this.getGamePieceId(squareId) !== cellPieceId : false;
        }

        return { updatedFlags, escapeFlags, movableFlags, pendingTranslations };
    }

    identifyPieceTranslations(updatedFlags, escapeFlags, movableFlags, pendingTranslations) {
        Object.values(this.squares).forEach(targetSquare => {
            const newPieceId = this.getGamePieceId(targetSquare.id);
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

        if (!this.getGamePieceId(sourceSquare.id)) updatedFlags[sourceSquare.id] = true;

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
            let newPieceId = this.getGamePieceId(square.id);
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

    // -------------------
    // Event Handlers and Drag
    // -------------------
    dragFunction(square, piece) {

        return (event) => {

            event.preventDefault();

            if (!this.config.draggable || !piece) return;

            // Store the original from square for the entire drag operation
            const originalFrom = square;
            let prec, moved;
            let from = originalFrom;
            let to = square;

            const img = piece.element;

            if (!this.canMove(from)) return;
            
            // Track if this is actually a drag operation or just a click
            let isDragging = false;
            let startX = event.clientX || (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
            let startY = event.clientY || (event.touches && event.touches[0] ? event.touches[0].clientY : 0);
            
            // Don't interfere with click system immediately
            console.log('dragFunction: mousedown detected, waiting to see if it becomes drag');

            const moveAt = (event) => {
                const squareSize = this.element.offsetWidth / 8;
                
                // Get mouse coordinates - use clientX/Y for better Chrome compatibility
                let clientX, clientY;
                if (event.touches && event.touches[0]) {
                    clientX = event.touches[0].clientX;
                    clientY = event.touches[0].clientY;
                } else {
                    clientX = event.clientX;
                    clientY = event.clientY;
                }
                
                // Get board position using getBoundingClientRect for accuracy
                const boardRect = this.element.getBoundingClientRect();
                
                // Calculate position relative to board with piece centered on cursor
                // Add window scroll offset for correct positioning
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                const x = clientX - boardRect.left - (squareSize / 2);
                const y = clientY - boardRect.top - (squareSize / 2);
                
                img.style.left = x + 'px';
                img.style.top = y + 'px';
                return true;
            };

            const onMouseMove = (event) => {
                // Check if mouse has moved enough to be considered a drag
                let currentX = event.clientX;
                let currentY = event.clientY;
                let deltaX = Math.abs(currentX - startX);
                let deltaY = Math.abs(currentY - startY);
                
                // Only start dragging if mouse moved more than 3 pixels
                if (!isDragging && (deltaX > 3 || deltaY > 3)) {
                    console.log('dragFunction: starting actual drag operation');
                    isDragging = true;
                    
                    // Now set up drag state
                    if (!this.config.clickable) {
                        this.clicked = null;
                        this.clicked = from;
                    } else if (!this.clicked) {
                        this.clicked = from;
                    }
                    console.log('dragFunction: clicked state after drag activation =', this.clicked ? this.clicked.id : 'none');
                    
                    // Highlight the source square and show hints
                    if (this.config.clickable) {
                        from.select();
                        this.hintMoves(from);
                    }

                    img.style.position = 'absolute';
                    img.style.zIndex = 100;
                    img.classList.add('dragging');
                    
                    DragOptimizations.enableForDrag(img);
                }
                
                if (!isDragging) return;
                
                if (!this.config.onDragStart(square, piece)) return;
                if (!moveAt(event)) return;

                const boardRect = this.element.getBoundingClientRect();
                const { offsetWidth: boardWidth, offsetHeight: boardHeight } = this.element;
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
                
                // If this was just a click (not a drag), don't interfere
                if (!isDragging) {
                    console.log('dragFunction: was just a click, not interfering');
                    return;
                }
                
                console.log('dragFunction: ending drag operation');
                img.style.zIndex = 20;
                img.classList.remove('dragging');
                img.style.willChange = 'auto';

                const dropResult = this.config.onDrop(originalFrom, to, piece);
                const isTrashDrop = !to && (this.config.dropOffBoard === 'trash' || dropResult === 'trash');

                if (isTrashDrop) {
                    this.allSquares("unmoved");
                    this.allSquares('removeHint');
                    originalFrom.deselect();
                    this.remove(originalFrom);
                } else if (!to) {
                    // No target square - snapback
                    if (originalFrom && originalFrom.piece) {
                        this.snapbackPiece(originalFrom);
                        if (to !== originalFrom) this.config.onSnapbackEnd(originalFrom, piece);
                    }
                } else {
                    // Set clicked to originalFrom before attempting move
                    this.clicked = originalFrom;
                    // Try to make the move
                    const onClickResult = this.onClick(to, true, true);
                    if (!onClickResult) {
                        // Move failed - snapback
                        if (originalFrom && originalFrom.piece) {
                            this.snapbackPiece(originalFrom);
                            if (to !== originalFrom) this.config.onSnapbackEnd(originalFrom, piece);
                        }
                    }
                }
            };

            window.addEventListener('mouseup', onMouseUp, { once: true });
            document.addEventListener('mousemove', onMouseMove);
            img.addEventListener('mouseup', onMouseUp, { once: true });
        }
    }

    addListeners() {
        for (const square of Object.values(this.squares)) {

            let piece = square.piece;

            // Applica throttling ai listener di mouseover e mouseout per migliori prestazioni
            const throttledHintMoves = rafThrottle((e) => {
                if (!this.clicked && this.config.hints) this.hintMoves(square);
            });

            const throttledDehintMoves = rafThrottle((e) => {
                if (!this.clicked && this.config.hints) this.dehintMoves(square);
            });

            square.element.addEventListener("mouseover", throttledHintMoves);
            square.element.addEventListener("mouseout", throttledDehintMoves);

            const handleClick = (e) => {
                e.stopPropagation();
                if (this.config.clickable) {
                    this.onClick(square);
                }
            }

            square.element.addEventListener("click", handleClick);
            square.element.addEventListener("touch", handleClick);
        }
    }

    onClick(square, animation = this.config.moveAnimation, dragged = false) {
        
        console.log('onClick START: square =', square.id, 'clicked =', this.clicked ? this.clicked.id : 'none');
        
        let from = this.clicked;
        
        let promotion = null

        if (this.promoting) {
            if (this.promoting === 'none') from = null
            else promotion = this.promoting;

            this.promoting = false;
            this.allSquares("removePromotion");
            this.allSquares("removeCover");
        }

        console.log('onClick: from =', from ? from.id : 'none');

        if (!from) {
            console.log('onClick: no from, trying to select piece');
            if (this.canMove(square)) {
                console.log('onClick: canMove = true, selecting');
                if (this.config.clickable) {
                    square.select();
                    this.hintMoves(square);
                }
                this.clicked = square;
                console.log('onClick: *** CLICKED SET TO ***', square.id);
                console.log('onClick: set clicked to', square.id);
            } else {
                console.log('onClick: canMove = false');
            }
            return false;
        }

        // If clicking on the same square that's already selected, deselect it
        if (this.clicked === square) {
            console.log('onClick: deselecting same square');
            square.deselect();
            this.allSquares("removeHint");
            this.clicked = null;
            console.log('onClick: *** CLICKED RESET TO NULL (deselect) ***');
            return false;
        }

        console.log('onClick: attempting move from', from.id, 'to', square.id);
        let move = new Move(from, square, promotion);

        if (!move.check()) {
            console.log('onClick: move check FAILED');
            from.deselect();
            this.allSquares("removeHint");
            this.clicked = null;
            return false;
        }

        if (this.config.onlyLegalMoves && !move.isLegal(this.game)) {
            console.log('onClick: move is NOT LEGAL');
            from.deselect();
            this.allSquares("removeHint");
            this.clicked = null;
            return false;
        }

        if (!move.hasPromotion() && this.promote(move)) {
            console.log('onClick: promotion required');
            return false;
        }

        console.log('onClick: calling onMove');
        if (this.config.onMove(move)) {
            console.log('onClick: SUCCESS - move executed');
            // Clean up UI state
            from.deselect();
            this.allSquares("removeHint");
            this.clicked = null;
            console.log('onClick: *** CLICKED RESET TO NULL (success) ***');
            this.move(move, animation);
            return true;
        }

        console.log('onClick: onMove returned FALSE');
        from.deselect();
        this.allSquares("removeHint");
        this.clicked = null;
        return false;
    }

    // -------------------
    // Move Functions
    // -------------------
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

    move(move, animation = true) {
        move = this.convertMove(move);
        move.check();

        let from = move.from;
        let to = move.to;

        // Store the current state to avoid unnecessary recalculations
        const gameStateBefore = this.game.fen();

        if (!this.config.onlyLegalMoves) {
            let piece = this.getGamePieceId(from.id);
            this.game.remove(from.id);
            this.game.remove(to.id);
            this.game.put({ type: move.hasPromotion() ? move.promotion : piece[0], color: piece[1] }, to.id);
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

            from.moved();
            to.moved();
            this.allSquares("removeHint");
        }

        // Only update the board if the game state actually changed
        const gameStateAfter = this.game.fen();
        if (gameStateBefore !== gameStateAfter) {
            this.updateBoardPieces(animation);
        }

        if (this.config.onlyLegalMoves) {
            this.config.onMoveEnd(move);
        }
    }

    // -------------------
    // Miscellaneous Functions
    // -------------------
    hint(squareId) {
        let square = this.squares[squareId];
        if (!this.config.hints || !square) return;
        square.putHint(square.piece && square.piece.color !== this.turn());
    }

    hintMoves(square) {
        if (!this.canMove(square)) return;
        
        // Usa la cache per evitare calcoli ripetuti delle mosse
        const cacheKey = `${square.id}-${this.game.fen()}`;
        let mosse = this._movesCache.get(cacheKey);
        
        if (!mosse) {
            mosse = this.game.moves({ square: square.id, verbose: true });
            this._movesCache.set(cacheKey, mosse);
            
            // Pulisci la cache dopo un breve ritardo per evitare accumulo di memoria
            if (this._cacheTimeout) clearTimeout(this._cacheTimeout);
            this._cacheTimeout = setTimeout(() => {
                this._movesCache.clear();
            }, 1000);
        }
        
        for (let mossa of mosse) {
            if (mossa['to'].length === 2) this.hint(mossa['to']);
        }
    }

    dehintMoves(square) {
        // Usa la cache anche per dehint per coerenza
        const cacheKey = `${square.id}-${this.game.fen()}`;
        let mosse = this._movesCache.get(cacheKey);
        
        if (!mosse) {
            mosse = this.game.moves({ square: square.id, verbose: true });
            this._movesCache.set(cacheKey, mosse);
        }
        
        for (let mossa of mosse) {
            let to = this.squares[mossa['to']];
            to.removeHint();
        }
    }

    allSquares(method) {
        for (const square of Object.values(this.squares)) {
            square[method]();
            this.squares[square.id] = square;
        }
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

    clearSquares() {
        this.allSquares('removeHint');
        this.allSquares("deselect");
        this.allSquares("unmoved");
    }

    getGamePieceId(squareId) {
        let piece = this.game.get(squareId);
        return piece ? piece['type'] + piece['color'] : null;
    }

    isPiece(piece, square) { return this.getGamePieceId(square) === piece }

    realCoord(row, col) {
        if (this.isWhiteOriented()) row = 7 - row;
        else col = 7 - col;
        return [row + 1, col + 1];
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

    convertSquare(square) {
        if (square instanceof Square) return square;
        if (typeof square === 'string' && this.squares[square]) return this.squares[square];
        throw new Error(this.error_messages['invalid_square'] + square);
    }

    // -------------------
    // User API and Chess.js Integration
    // -------------------
    getOrientation() {
        return this.config.orientation;
    }

    setOrientation(color, animation = true) {
        if (['w', 'b'].includes(color)) {
            if (color !== this.config.orientation) {
                this.flip(animation);
            }
        } else {
            throw new Error(this.error_messages['invalid_orientation'] + color);
        }
    }

    highlight(squareId) {
        let square = this.convertSquare(squareId);
        square.check();
        square.highlight();
    }

    dehighlight(squareId) {
        let square = this.convertSquare(squareId);
        square.check();
        square.dehighlight();
    }

    lastMove() {
        const moves = this.history({ verbose: true });
        return moves[moves.length - 1];
    }

    flip() {
        this.config.orientation = this.config.orientation === 'w' ? 'b' : 'w';
        this.destroy();
        this.initParams();
        this.build();
    }

    build() {
        if (this.element) this.destroy();
        this.init();
    }

    destroy() {
        this.removeSquares();
        this.removeBoard();
    }

    ascii() {
        return this.game.ascii();
    }

    board() {
        let dict = {};
        for (let squareId in this.squares) {
            let piece = this.getGamePieceId(squareId);
            if (piece) dict[squareId] = piece;
        }
        return dict;
    }

    clear(options = {}, animation = true) {
        this.game.clear(options);
        this.updateBoardPieces(animation);
    }

    fen() {
        return this.game.fen();
    }

    get(squareId) {
        const square = this.convertSquare(squareId);
        square.check();
        return square.piece;
    }

    getCastlingRights(color) {
        return this.game.getCastlingRights(color);
    }

    getComment() {
        return this.game.getComment();
    }

    getComments() {
        return this.game.getComments();
    }

    history(options = {}) {
        return this.game.history(options);
    }

    isCheckmate() {
        return this.game.isCheckmate();
    }

    isDraw() {
        return this.game.isDraw();
    }

    isDrawByFiftyMoves() {
        return this.game.isDrawByFiftyMoves();
    }

    isInsufficientMaterial() {
        return this.game.isInsufficientMaterial();
    }

    isGameOver() {
        return this.game.isGameOver();
    }

    isStalemate() {
        return this.game.isStalemate();
    }

    isThreefoldRepetition() {
        return this.game.isThreefoldRepetition();
    }

    load(position, options = {}, animation = true) {
        this.clearSquares();
        this.setGame(position, options);
        this.updateBoardPieces(animation);
    }

    loadPgn(pgn, options = {}, animation = true) {
        this.clearSquares();
        this.game.loadPgn(pgn, options);
        this.updateBoardPieces();
    }

    moveNumber() {
        return this.game.moveNumber();
    }

    moves(options = {}) {
        return this.game.moves(options);
    }

    pgn(options = {}) {
        return this.game.pgn(options);
    }

    put(pieceId, squareId, animation = true) {
        const [type, color] = pieceId.split('');
        const success = this.game.put({ type: type, color: color }, squareId);
        if (success) this.updateBoardPieces(animation);
        return success;
    }

    remove(squareId, animation = true) {
        const removedPiece = this.game.remove(squareId);
        this.updateBoardPieces(animation);
        return removedPiece;
    }

    removeComment() {
        return this.game.removeComment();
    }

    removeComments() {
        return this.game.removeComments();
    }

    removeHeader(field) {
        return this.game.removeHeader(field);
    }

    reset(animation = true) {
        this.game.reset();
        this.updateBoardPieces(animation);
    }

    setCastlingRights(color, rights) {
        return this.game.setCastlingRights(color, rights);
    }

    setComment(comment) {
        this.game.setComment(comment);
    }

    setHeader(key, value) {
        return this.game.setHeader(key, value);
    }

    squareColor(squareId) {
        return this.game.squareColor(squareId);
    }

    turn() {
        return this.game.turn();
    }

    undo() {
        const move = this.game.undo();
        if (move) this.updateBoardPieces();
        return move;
    }

    validateFen(fen) {
        return validateFen(fen);
    }

    // -------------------
    // Other Utility Functions
    // -------------------
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

    isWhiteOriented() { return this.config.orientation === 'w' }

}

export default Chessboard;