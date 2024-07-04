const DEFAULT_POSITION_WHITE = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const DEFAULT_POSITION_BLACK = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1'
const ANIMATION = 200;

class ChessboardConfig {

    constructor(settings) {
        this.id_div = settings.id_div;
        this.position = settings.position || DEFAULT_POSITION_WHITE;
        this.color = settings.color || 'w';
        this.onMossa = settings.onMossa || (() => true);
        this.hint = settings.hint;
        this.path = settings.path || 'default_pieces';
        this.animation = settings.animation || ANIMATION;
        this.free = settings.free || true;
    }


    setIdDiv(id_div) {
        this.config.id_div = id_div;
        return this;
    }

    setPosition(position) {
        this.position = position;
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }

    setOnMossa(onMossa) {
        this.config.onMossa = onMossa;
        return this;
    }

    setHints(hints) {
        this.hints = hints;
        return this;
    }

    setPath(path) {
        this.config.path = path;
        return this;
    }

    setTheme(theme) {
        for (let key in theme) {
            this.theme[key] = theme[key];
        }
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
        this.game = Chess(config.position);

        this.initParams();
        this.buildBoard();
        this.updatePosition();
    }

    // Build

    buildBoard() {

        this.board = document.getElementById(this.config.id_div);
        this.board.className = "board";

        this.buildSquares();
    }

    buildSquares() {

        this.squares = {};
        this.casellaCliccata = null;
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
        this.casellaCliccata = null;
        this.history = [];
        this.mosseIndietro = [];
        this.casellaCliccata = null;
    }


    // Pieces

    containsPiece(square) {
        let piece = this.game.get(square);
        return piece ? piece['type'] + piece['color'] : null;
    }

    colorPiece(square) {
        let piece = this.game.get(square);
        return piece ? piece['color'] : null;
    }

    translatePiece(piece, from, to, removeTo, prom, animate, duration = this.config.animation) {

        if (!animate) duration = 0;

        let h = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dimensioneScacchieraAltezza'));
        let w = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dimensioneScacchieraLarghezza'));

        let squareWidth = w / 8;
        let squareHeigth = h / 8;

        let elem = this.pieces[(piece, from)]['img'];
        let [rowFrom, colFrom] = this.getSquareCoord(from);
        let [rowTo, colTo] = this.getSquareCoord(to);

        let x = squareWidth * (colTo - colFrom);
        let y = squareHeigth * (rowTo - rowFrom);

        let startTime;
        let board = this;

        if (removeTo && this.pezzi[to]) this.fadeOutPiece(to, this.pezzi[to]['img'], false);

        function translate(currentTime) {
            if (!startTime) {
                startTime = currentTime;
            }
            let timeElapsed = currentTime - startTime;
            let progress = Math.min(timeElapsed / duration, 1);

            elem.style.transform = 'translate(' + (x * progress) + 'px, ' + (y * progress) + 'px)';

            if (progress < 1) {
                requestAnimationFrame(translate);
            } else {
                if (prom) board.removePiece(from, 'p' + piece[1], false);
                else board.removePiece(from, piece, false);
                board.putPiece(to, piece, false);
            }
        }

        requestAnimationFrame(translate);
    }

    fadeInPiece(square, duration = this.config.animation) {

        let elem = this.pezzi[square]['img'];

        let startTime;

        function fadeIn(currentTime) {
            if (!startTime) {
                startTime = currentTime;
            }
            let timeElapsed = currentTime - startTime;
            let progress = Math.min(timeElapsed / duration, 1);

            elem.style.opacity = progress; // l'opacità aumenta con il progresso dell'animazione

            if (progress < 1) {
                requestAnimationFrame(fadeIn);
            }
        }

        requestAnimationFrame(fadeIn);
    }

    fadeOutPiece(square, img, remove = true, duration = this.config.animation) {
        let elem = this.pieces[square]['img'];

        let startTime;

        function fadeOut(currentTime) {
            if (!startTime) {
                startTime = currentTime;
            }
            let timeElapsed = currentTime - startTime;
            let progress = Math.min(timeElapsed / duration, 1);

            elem.style.opacity = 1 - progress; // l'opacità diminuisce con il progresso dell'animazione

            if (progress < 1) {
                requestAnimationFrame(fadeOut);
            }
        }

        requestAnimationFrame(fadeOut);
        if (remove) this.celle[square].removeChild(img);
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
        if (this.containsPiece(square)) this.removePiece(square);

        let img = document.createElement("img");
        img.className = "piece";

        let percorso = this.config.path + '/' + piece + '.svg';
        img.src = percorso;
        img.style.opacity = fade ? 0 : 1;
        img.setAttribute('draggable', 'true');

        let board = this;

        img.onmousedown = function (event) {

            let recentHighlighted;
            let from = square;
            let to;

            // (1) prepare to moving: make absolute and on top by z-index
            img.style.position = 'absolute';
            img.style.zIndex = 1000;

            // centers the ball at (pageX, pageY) coordinates
            function moveAt(pageX, pageY) {
                img.style.left = pageX - img.offsetWidth / 2 + 'px';
                img.style.top = pageY - img.offsetHeight / 2 + 'px';
            }

            // move our absolutely positioned ball under the pointer
            moveAt(event.pageX, event.pageY);

            function onMouseMove(event) {

                moveAt(event.pageX, event.pageY);

                // find the current square
                let x = event.clientX - board.board.getBoundingClientRect().left;
                let y = event.clientY - board.board.getBoundingClientRect().top;
                let col = Math.floor(x / (board.board.offsetWidth / 8));
                let row = Math.floor(y / (board.board.offsetHeight / 8));
                let square = board.getSquareID(row, col);
                to = square;

                if (square !== recentHighlighted) {
                    board.highlightSquare(square);
                    board.dehighlightSquare(recentHighlighted);
                    recentHighlighted = square;
                }

                // if is the same square from, center in from square
            }

            // (2) move the ball on mousemove
            document.addEventListener('mousemove', onMouseMove);

            // (3) drop the ball, remove unneeded handlers
            img.onmouseup = function () {
                board.dehighlightSquare(recentHighlighted);
                document.removeEventListener('mousemove', onMouseMove);
                img.onmouseup = null;
                if (!board.onClick(to, false)) {
                    // ritorna alla posizione iniziale
                    img.style.position = 'relative';
                    img.style.zIndex = 0;
                    img.style.left = 0;
                    img.style.top = 0;


                }
            };

        };

        img.ondragstart = function () {
            board.onClick(square);
            return false;
        };


        // img.addEventListener('dragstart', function(e) {
        //     e.dataTransfer.setData('text/plain', this.id);
        //     if (board.colorPiece(square) === board.turn()) board.onClick(square);
        // });


        this.pezzi[square] = { 'img': img, 'piece': piece };
        this.pieces[(piece, square)] = { 'img': img };
        this.celle[square].appendChild(img);

        if (fade) this.fadeInPiece(square);
    }

    updatePieces(animation) {
        console.log('updatePieces', animation);

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
            this.translatePiece(piece, from, to, !escaping[to], false, animation);
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
                            this.translatePiece(piece, lastMove['from'], square, true, true, animation);
                            ok[lastMove['from']] = true;
                        }
                    } else {
                        this.removePiece(square);
                        if (pieceNew) this.putPiece(square, pieceNew);
                    }
                }
            }
        }
    }

    removePieces() {
        for (let casella in this.celle) {
            this.removePiece(casella);
        }
    }

    opponentPiece(square) {
        return this.game.get(square) !== null && this.game.get(square)['color'] !== this.config.color;
    }

    playerPiece(square) {
        return this.game.get(square) !== null && this.game.get(square)['color'] === this.config.color;
    }

    isPiece(piece, square) {
        return this.game.get(square) !== null && this.game.get(square)['color'] === piece[1] && this.game.get(square)['type'] === piece[0];
    }

    // Listeners

    addListeners() {
        if (this.mosseIndietro.length > 0) return;
        for (let casella in this.celle) {
            let cella = this.celle[casella];
            cella.addEventListener("mouseover", () => this.hintMoves(casella));
            cella.addEventListener("mouseout", () => this.dehintMoves(casella));
            cella.addEventListener("click", () => this.onClick(casella));
            cella.addEventListener('dragover', function (event) {
                event.preventDefault(); // Permette il drop
            });

            let board = this;
            cella.addEventListener('drop', function (event) {
                event.preventDefault(); // Previene l'apertura del link
                board.onClick(casella);
            });
        }
    }

    onClick(casella, animation = true) {

        console.log('onClick', casella, animation);
        let from = this.casellaCliccata;
        this.casellaCliccata = null;

        if (this.promoting) {
            this.depromoteAllSquares();
            this.removeAllCovers();
            this.promoting = false;
        }

        if (from) {
            this.deselectSquare(from);
            this.dehintMoves(from);
        }

        // Se ci sono caselle selezionate e non possiedo la casella cliccata
        if (from !== null && this.colorPiece(casella) !== this.colorPiece(from)) {

            let mossa = from + casella;

            if (!this.legalMove(mossa)) return;
            if (mossa.length == 4 && this.promozione(mossa)) return;

            // Esegui la mossa se accettata dalla funzione onMossa

            // non passa animation
            this.animate = animation;
            if (this.config.onMossa(mossa)) this.makeMove(mossa, animation);
            return true;

        } else if (this.colorPiece(casella) === this.turn()) {

            this.selectSquare(casella);
            this.hintMoves(casella);
            this.casellaCliccata = casella;

        }
        return false;
    }

    // Hint

    hintSquare(square) {

        if (!this.config.free && this.opponentPiece(square)) return;

        if (this.config.hint && this.casellaCliccata === null) {

            let hint = document.createElement("div");
            hint.className = "hint";

            if (this.colorPiece(square) && this.colorPiece(square) !== this.turn()) hint.className += " catchable";

            this.celle[square].appendChild(hint);
        }
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
        if (this.config.hint && this.casellaCliccata === null) {
            let cella = this.celle[square];
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

    makeMove(mossa, animation) {

        // non passa animation
        animation = this.animate;

        console.log('move', mossa, animation);

        this.unmoveAllSquares();

        let move = this.game.move({
            from: mossa.slice(0, 2),
            to: mossa.slice(2, 4),
            promotion: mossa.length === 5 ? mossa[4] : null
        });

        this.history.push(move);

        this.updatePosition(false, animation);

        this.movedSquare(mossa.slice(2, 4));
        this.movedSquare(mossa.slice(0, 2));
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

    highlightSquare(square) {
        if (!square || !this.celle[square]) return;
        let elem = this.celle[square];
        elem.className += ' highlighted';
    }

    dehighlightSquare(square) {
        if (!square || !this.celle[square]) return;
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
        img.className = "piece";
        img.src = this.config.path + '/' + piece + '.svg';
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

    promozione(mossa) {
        let to = mossa.slice(2, 4);
        let from = mossa.slice(0, 2);
        let pezzo = this.game.get(from);
        let [row, col] = this.getSquareCoord(to);
        let choices = ['q', 'r', 'b', 'n']

        if (pezzo['type'] !== 'p' || !(row === 0 || row === 7)) return false;

        for (let casella in this.celle) {
            let [rowCurr, colCurr] = this.getSquareCoord(casella);

            if (col === colCurr && Math.abs(row - rowCurr) <= 3) {

                let choice = this.promoteSquare(casella, choices[Math.abs(row - rowCurr)] + this.config.color);
                choice.addEventListener('click', () => {
                    this.onClick(to + choices[Math.abs(row - rowCurr)]);
                });

            } else {
                this.coverSquare(casella);
            }
        }

        this.casellaCliccata = from;
        this.promoting = true;

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

}