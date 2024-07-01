const DEFAULT_POSITION_WHITE = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const DEFAULT_POSITION_BLACK = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1'

class ChessboardConfig {

    constructor(
        id_div,
        position = DEFAULT_POSITION_WHITE,
        color = 'w',
        onMossa = () => true,
        hints = true,
        fog = false,
        path = 'default_pieces'
    ) {
        this.id_div = id_div;
        this.position = position;
        this.color = color;
        this.onMossa = onMossa;
        this.hint = hints;
        this.fog = fog;
        this.path = path;
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

    setFog(fog) {
        this.fog = fog;
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

        // Inizializza la setPosition della Chessboard e l'orientamento
        let turno = config.position.split(' ')[1];
        this.config.color = config.color ? turno : turno === 'w' ? 'b' : 'w';
        this.partita = Chess(config.position);

        this.terminata = false;

        // Inizializza le variabili della Chessboard
        this.casellaCliccata = null;
        this.celle = {};
        this.pezzi = {};
        this.pieces = {};
        this.mosseIndietro = [];

        // Crea la tavola e la Chessboard
        this.buildBoard();
        this.updatePosition();
    }

    // Build

    buildBoard() {  // Crea la Chessboard con le caselle

        this.board = document.getElementById(this.config.id_div);
        this.board.className = "board";

        this.buildSquares();

        this.putPieces();
    }

    buildSquares() { // Crea una cella della Chessboard

        this.squares = {};

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

    // Pieces

    putPieces() {

        let partita = this.config.fog && !this.terminata ? this.partitaVisualizzata : this.partita;

        // Per ogni casella
        for (let square in this.celle) {

            let pieceNew = partita.get(square);

            let pieceOld = this.pezzi[square] ? this.pezzi[square]['piece'] : null;

            if (pieceNew === null && pieceOld === null) continue;

            else if (pieceNew === null && pieceOld !== null) {
                let possibleDest = this.getLegalMoves(square).map(m => m['to']);
                for (let dest in possibleDest) {
                    if (!this.playerPiece(dest) && partita.get(square) === pieceOld) {
                        this.translatePiece(pieceOld, square, dest);
                        break;
                    }
                }
            }

            else if (pieceNew !== null && pieceOld === null) {
                pieceNew = pieceNew['type'] + pieceNew['color'];
                let possibleSrc = this.getLegalMoves(square).map(m => m['from']);
                let cond = true;
                for (let src in possibleSrc) {
                    if (this.playerPiece(src) && partita.get(src) === null) {
                        cond = false;
                    }
                }
                if (cond) {
                    let img = document.createElement("img");
                    img.className = "piece";

                    let percorso = this.config.path + '/' + pieceNew + '.svg';
                    img.src = percorso;

                    if (pieceNew[1] === this.config.color) {
                        let board = this;
                        img.addEventListener('dragstart', () => {
                            board.onClick(square);
                        });
                    }

                    // Aggiungi il piece alla square
                    this.pezzi[square] = { 'img': img, 'piece': pieceNew };
                    this.pieces[(pieceNew, square)] = { 'img': img };
                    console.log(this.celle[square]);
                    this.celle[square].appendChild(img);
                    let row = this.getSquareCoord(square)[0];
                    let col = this.getSquareCoord(square)[1];
                    this.squares[row][col].appendChild(img);

                }
            }

            // else if (pieceNew !== null && pieceOld !== null) {
            //     if (pieceNew['type'] !== pieceOld['type'] || pieceNew['color'] !== pieceOld['color']) {
            //         this.celle[square].removeChild(this.pezzi[square]['img']);
            //         delete this.pezzi[square];
            //         delete this.pieces[(pieceOld, square)];
            //         this.pieces[(pieceNew, square)] = { 'img': this.pezzi[square]['img'] };
            //         this.pezzi[square] = { 'img': this.pezzi[square]['img'], 'piece': pieceNew }
            //         this.celle[square].appendChild(this.pezzi[square]['img']);
            //     }
            // }




            // if (piece !== null) {
            //     // Crea un nuovo elemento img per il piece
            //     piece = piece['type'] + piece['color'];

            //     // se la coppia pezzo casella non è in pieces
            //     // se 

            //     let img = document.createElement("img");
            //     img.className = "piece";

            //     let percorso = this.config.path + '/' + piece + '.svg';
            //     img.src = percorso;

            //     if (piece[1] === this.config.color) {
            //         let board = this;
            //         img.addEventListener('dragstart', () => {
            //             board.onClick(square);
            //         });
            //     }

            //     // Aggiungi il piece alla square
            //     this.pezzi[square] = { 'img': img, 'piece': piece };
            //     this.pieces[(piece, square)] = { 'img': img }
            //     this.celle[square].appendChild(img);
            // }
        }
    }

    removePieces() {
        for (let casella in this.celle) {
            let cella = this.celle[casella];
            while (cella.firstChild) {
                cella.removeChild(cella.firstChild);
            }
        }
        this.pezzi = {};
    }

    opponentPiece(square) {
        return this.partita.get(square) !== null && this.partita.get(square)['color'] !== this.config.color;
    }

    playerPiece(square) {
        return this.partita.get(square) !== null && this.partita.get(square)['color'] === this.config.color;
    }

    // Listeners

    addListeners() {
        if (this.mosseIndietro.length > 0) return;
        for (let casella in this.celle) {
            let cella = this.celle[casella];
            cella.addEventListener("mouseover", () => this.onOver(casella));
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

    onClick(casella) {

        if (!this.playerTurn() || this.terminata) return;

        if (this.casellaCliccata) this.deselectSquare(this.casellaCliccata);
        this.dehintMoves(this.casellaCliccata);

        // Se ci sono caselle selezionate e non possiedo la casella cliccata
        if (this.casellaCliccata !== null) {

            let mossa = this.casellaCliccata + casella;
            this.casellaCliccata = null;

            if (!this.legalMove(mossa)) return;
            if (this.promozione(mossa)) return;

            // Esegui la mossa se accettata dalla funzione onMossa
            if (this.config.onMossa(mossa)) this.move(mossa);

        } else if (this.playerPiece(casella)) {

            this.selectSquare(casella);
            this.casellaCliccata = casella;
            this.hintMoves(casella);

        } else {
            this.casellaCliccata = null;
        }
    }

    onOver(casella) {
        if (this.casellaCliccata !== null || !this.playerTurn()) return;
        this.dehintAllSquares();
        this.hintMoves(casella);
    }

    // Hint

    hintSquare(square) {

        // Se i suggerimenti sono attivi e la square è vuota
        if (this.config.hint) {

            // Crea un nuovo elemento div per il cerchio
            square = this.celle[square];
            let hint = document.createElement("div");

            // Imposta lo stile del hint
            hint.className = "hint";
            if (this.opponentPiece(square.id)) hint.className += " catchable";

            // Aggiunge il hint alla square
            square.appendChild(hint);
        }
    }

    hintMoves(square) {
        let mosse = this.partita.moves({ square: square, verbose: true });
        for (let mossa of mosse) {
            this.hintSquare(mossa['to']);
        }
    }

    dehintMoves(square) {
        let mosse = this.partita.moves({ square: square, verbose: true });
        for (let mossa of mosse) {
            this.dehintSquare(mossa['to']);
        }
    }

    dehintSquare(square) {
        if (this.config.hint) {
            let cella = this.celle[square];
            let figli = cella.childNodes;

            // Itera all'indietro attraverso la lista dei figli
            for (let i = figli.length - 1; i >= 0; i--) {
                // Se il figlio è un 'div', rimuovilo
                if (figli[i].nodeName === 'DIV') {
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

    // Fog

    fogSquare(square) {
        let elem = this.celle[square];
        if (this.isWhiteSquare(square)) elem.className += ' whiteSquareFog';
        else elem.className += ' blackSquareFog';
    }

    defogSquare(square) {
        let elem = this.celle[square];
        if (this.isWhiteSquare(square)) elem.className.replace(' whiteSquareFog', '');
        else elem.className = elem.className.replace(' blackSquareFog', '');
    }

    defogAllSquares() {
        for (let casella in this.celle) {
            this.defogSquare(casella);
        }
    }

    fogHiddenSquares() {

        // Se c'è solo un re, non annebbiare le caselle perché la partita è terminata
        let k = 0;
        for (let casella in this.celle) {
            if (this.partita.get(casella) === null) continue;
            else if ('k' === this.partita.get(casella)['type']) k = k + 1;
        }
        if (k === 1) {
            this.termina();
            return;
        }

        // Imposta la position della partita visualizzata
        let position = this.partita.fen();

        // Rimuove lo scacco
        position = position.replace('+', '');

        // Cambia il turno
        if (position.split(' ')[1] !== this.config.color) {
            let parti = position.split(' ');
            parti[1] = this.config.color;
            parti[3] = '-';
            position = parti.join(' ');
        }

        // Imposta la position della partita visualizzata
        this.partitaVisualizzata = Chess(position);

        // Rimuove i pezzi dalle caselle non accessibili e salva le caselle occupate
        let caselleAccessibili = this.mossePossibili().map(m => m['to']);
        let caselleOccupate = []
        for (let casella in this.celle) {
            if (!caselleAccessibili.includes(casella) && !this.playerPiece(casella) && this.partita.get(casella) !== null) {
                this.partitaVisualizzata.remove(casella);
                caselleOccupate.push(casella);
            }
        }

        // Colora le caselle accessibili e non accessibili e salva le caselle annebbiate
        caselleAccessibili = this.mossePossibili().map(m => m['to']);
        this.celleAnnebbiate = [];
        for (let casella in this.celle) {
            if ((!caselleAccessibili.includes(casella) && !this.playerPiece(casella)) || caselleOccupate.includes(casella)) {
                this.fogSquare(casella);
                this.celleAnnebbiate.push(casella);
            } else {
                this.defogSquare(casella);
            }
        }
    }

    // Select

    selectSquare(square) {
        let elem = this.celle[square];
        elem.className += ' selectedSquare';
    }

    deselectSquare(square) {
        let elem = this.celle[square];
        elem.className = elem.className.replace(' selectedSquare', '');
    }

    deselectAllSquares() {
        for (let casella in this.celle) {
            this.deselectSquare(casella);
        }
    }

    // Moves

    movedSquare(square) {
        let elem = this.celle[square];
        elem.className += ' movedSquare';
    }

    unmovedSquare(square) {
        let elem = this.celle[square];
        elem.className = elem.className.replace(' movedSquare', '');
    }

    legalMove(mossa) { // Restituisce true se la mossa è legale
        let partita = this.config.fog ? this.partitaVisualizzata : this.partita;
        let mosseLegali = partita.moves({ square: mossa.slice(0, 2), verbose: true }).map(m => m['from'] + m['to']);
        if (this.config.fog) return !this.celleAnnebbiate.includes(mossa.slice(2, 4)) && mosseLegali.includes(mossa);
        return mosseLegali.includes(mossa);
    }

    getLegalMoves(casella = null) { // Restituisce le mosse possibili

        // Se la modalità nebbia è attiva, restituisci le mosse possibili dalla partita visualizzata
        let partita = this.config.fog ? this.partitaVisualizzata : this.partita;

        // Restituisci le mosse possibili per la casella specificata o per la partita
        if (casella === null) {
            return partita.moves({ verbose: true });
        } else {
            return partita.moves({ square: casella, verbose: true });
        }
    }

    move(mossa) {

        if (this.rit) this.lastPosition();

        this.deselectAllSquares();

        // Esegue la mossa 
        let res = this.partita.move({ from: mossa.slice(0, 2), to: mossa.slice(2, 4), promotion: mossa.length === 5 && "rbqn".includes(mossa[4]) ? mossa[4] : undefined });

        // Se la mossa non è stata eseguita in nebbia
        if (res == null && this.config.fog) {

            // Rimuove i pezzi del giocatore avversario 
            let pezziRimossi = {};
            for (let casella in this.celle) {
                if (this.partita.get(casella) !== null && this.partita.get(casella)['color'] !== this.partita.turn() && this.partita.get(casella)['type'] !== 'k') {
                    pezziRimossi[casella] = this.partita.remove(casella);
                }
            }

            // Esegue la mossa nella partita visualizzata e nella partita
            this.partita.move({ from: mossa.slice(0, 2), to: mossa.slice(2, 4), promotion: mossa.length === 5 ? mossa[4] : undefined });
            this.partitaVisualizzata.move({ from: mossa.slice(0, 2), to: mossa.slice(2, 4), promotion: mossa.length === 5 ? mossa[4] : undefined });

            // Ripristina i pezzi rimossi
            for (let casella in pezziRimossi) {
                this.partita.put(pezziRimossi[casella], casella);
            }

            // updatePosition la position della partita
            let nuovaFen = this.partita.fen().split(' ')[0];
            nuovaFen = [nuovaFen].concat(this.partitaVisualizzata.fen().split(' ').slice(1));
            nuovaFen = nuovaFen.join(' ');
            this.partita = Chess(nuovaFen);
        }

        // updatePosition la Chessboard
        this.updatePosition();

        // Se la partita non è terminata, evidenzia la mossa
        if (!this.config.fog || this.terminata) {
            this.movedSquare(mossa.slice(2, 4));
            this.movedSquare(mossa.slice(0, 2));
        }
    }

    // State

    statoPartita() { // Restituisce lo stato della partita

        // Se la modalità nebbia è attiva
        if (this.config.fog) {
            if (this.partita.fen() === '') return null;

            // Se c'è solo un re, restituisci il vincitore
            let kb = false;
            let kw = false;
            for (let casella in this.celle) {
                if (this.partita.get(casella) === null) continue;
                else if ('kb' === this.partita.get(casella)['type'] + this.partita.get(casella)['color']) kb = true;
                else if ('kw' === this.partita.get(casella)['type'] + this.partita.get(casella)['color']) kw = true;
            }
            if (!kb) return 'w';
            if (!kw) return 'b';
        } else if (this.partita.game_over()) {

            // Se la partita è terminata, restituisci il vincitore
            if (this.partita.in_checkmate()) return this.partita.turn() === 'w' ? 'b' : 'w';
            return 'p';
        }
        return null;
    }

    termina() { // Termina la partita
        this.terminata = true;
    }

    // Position

    setPosition(position, color = null) {
        if (color === null) color = position.split(' ')[1];
        let change_color = this.config.color !== color;
        this.config.setColor(color);
        this.partita = Chess(position);
        this.updatePosition(change_color);
    }

    ribalta() { // Ribalta la Chessboard e cambia l'color
        this.config.setColor(this.config.color === 'w' ? 'b' : 'w');
        this.updatePosition(true);
    }

    playerTurn() { // Restituisce true se è il turno del giocatore
        return this.config.color === this.partita.turn();
    }

    isWhiteSquare(square) {
        let letters = 'abcdefgh';
        return (letters.indexOf(square[0]) + parseInt(square[1])) % 2 === 0;
    }

    isWhiteOriented() {
        return this.config.color === 'w';
    }

    updatePosition(change_color = false) { 
        this.terminata = false;
        if (change_color) {
            this.removeSquares();
            this.buildSquares();
        }
        if (this.config.fog) this.fogHiddenSquares();
        this.putPieces();
        if (this.statoPartita() !== null) this.termina();
    }


    // Game replay

    backward() {
        let mossa = this.partita.undo();
        if (mossa !== null) {
            this.mosseIndietro.push(mossa);
            this.updatePosition();
            if (this.partita.undo()) this.avanti();
        } else {
            this.updatePosition();
        }
    }

    forward() {
        if (this.mosseIndietro.length === 0) return;
        let mossa = this.mosseIndietro.pop();
        mossa = mossa['from'] + mossa['to'] + (mossa['promotion'] ? mossa['promotion'] : '');
        this.move(mossa, false);
    }

    lastPosition() {
        while (this.mosseIndietro.length > 0) {
            this.avanti();
        }
    }

    firstPosition() {
        let mossa = this.partita.undo();
        while (mossa !== null) {
            this.mosseIndietro.push(mossa);
            mossa = this.partita.undo();
        }
        this.updatePosition();
    }

    // Other

    getSquareCoord(coord, orientation = this.config.color) {
        // Returns the coordinates of the cell
        if (this.isWhiteOriented()) return [8 - parseInt(coord[1]), coord.charCodeAt(0) - 97];
        return [parseInt(coord[1]) - 1, 8 - (coord.charCodeAt(0) - 97)];
    }

    resetSquare(square) {
        let elem = this.celle[square];
        elem.className = 'square ' + (this.isWhiteSquare(square) ? 'whiteSquare' : 'blackSquare');
    }


    promozione(mossa) { // Restituisce true se la mossa è una promozione
        let aCasella = mossa.slice(2, 4);
        let daCasella = mossa.slice(0, 2);

        // Se la mossa è una promozione e il pezzo è un pedone e la casella di arrivo è l'ultima riga
        let pezzo = this.partita.get(daCasella);
        if (pezzo['type'] === 'p' && ((aCasella[1] === '1' || aCasella[1] === '8'))) {

            // Per ogni cella
            for (let casella in this.celle) {

                // Crea un nuovo elemento div per la copertura della cella
                let coperturaCella = document.createElement("div");
                coperturaCella.className = "coperturaCella";

                // Aggiungi la copertura della cella alla casella
                this.celle[casella].appendChild(coperturaCella);

                let righePromozione = this.config.color === 'w' ? ['8', '7', '6', '5'] : ['1', '2', '3', '4'];

                // Se la casella è nel riquadro della scelta del pezzo
                if (casella[0] === aCasella[0] && righePromozione.includes(casella[1])) {

                    // Imposta lo stile della copertura della cella e posizionala dava la casella
                    coperturaCella.style.backgroundColor = this.colori['selezione'][(this.getCellCoord(casella)[0] + this.getCellCoord(casella)[1]) % 2 === 1 ? 'scuro' : 'chiaro'];

                    // Crea un nuovo elemento img per il pezzo 
                    let temaPezzi = this.temaPezzi === 'dama' ? 'simple' : this.temaPezzi;
                    let img = document.createElement("img");
                    img.className = "pezzo";

                    // Imposta il tipo del pezzo e il percorso dell'immagine
                    let pezzi = ['q', 'r', 'b', 'n'];
                    let tipo = pezzi[righePromozione.indexOf(casella[1])];
                    let percorso = 'assets/pedine/' + temaPezzi + '/' + tipo + this.config.color + '.svg';

                    // Aggiungi l'immagine alla copertura della cella e aggiungi un listener per la promozione
                    img.src = percorso;
                    img.addEventListener("click", () => {
                        let mossa = daCasella + aCasella + tipo;
                        if (this.config.onMossa(mossa)) this.move(mossa);
                    });
                    coperturaCella.appendChild(img);
                } else {

                    // Imposta lo stile della copertura della cella per oscurare le caselle non selezionate
                    coperturaCella.style.backgroundColor = this.colori['nebbia'][(this.getCellCoord(casella)[0] + this.getCellCoord(casella)[1]) % 2 === 1 ? 'scuro' : 'chiaro'];
                }
            }
            return true;
        } else {
            return false;
        }
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

}