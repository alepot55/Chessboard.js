
class FogboardConfig extends ChessboardConfig {
    constructor(settings) {
        super(settings);
        this.fog = settings.fog;
    }

    setFog(fog) {
        this.fog = fog;
        return this;
    }

    build() {
        return new Fogboard(this);
    }
}

class Fogboard extends Chessboard {

    constructor(config) {
        super(config);
    }

    getVisualizedGame() {

        // Get legal moves
        let moves = this.getLegalMoves(null, false);

        // Get to squares
        let tos = moves.map(m => m['to']);

        // Get suqare with player pieces
        let playerSquares = [];
        for (let square in this.celle) {
            if (this.playerPiece(square)) playerSquares.push(square);
        }

        // Initialize visualized game
        this.FogGame = Chess(this.game.fen());

        // Remove unseen pieces
        for (let square in this.celle) {
            if (!tos.includes(square) && !playerSquares.includes(square)) {
                this.FogGame.remove(square);
            }
        }

        return this.FogGame;
    }

    updatePieces() {

        super.updatePieces();

        this.getVisualizedGame();

        this.fogHiddenSquares();
    }

    getLegalMoves(from = null, verb = true) {
        console.log(Object.keys(this.pezzi).length);
        console.log(this.game.ascii());

        if (Object.keys(this.pezzi).length === 0) return [];

        if (from === null) return this.FogGame.moves({ verbose: verb });
        return this.FogGame.moves({ square: from, verbose: verb });

    }

    move(mossa) {

        if (!mossa) return false;

        // If the move is not legal in the normal game
        if (!super.makeMove(mossa)) {

            // Rimuove i pezzi del giocatore avversario 
            let pezziRimossi = {};
            for (let casella in this.celle) {
                if (this.game.get(casella) !== null && this.game.get(casella)['color'] !== this.game.turn() && this.game.get(casella)['type'] !== 'k') {
                    pezziRimossi[casella] = this.game.remove(casella);
                }
            }

            // Esegue la mossa nella partita visualizzata e nella partita
            this.game.move({ from: mossa.slice(0, 2), to: mossa.slice(2, 4), promotion: mossa.length === 5 ? mossa[4] : undefined });
            this.gameVisualizzata.move({ from: mossa.slice(0, 2), to: mossa.slice(2, 4), promotion: mossa.length === 5 ? mossa[4] : undefined });

            // Ripristina i pezzi rimossi
            for (let casella in pezziRimossi) {
                this.game.put(pezziRimossi[casella], casella);
            }

            // updatePosition la position della partita
            let nuovaFen = this.game.fen().split(' ')[0];
            nuovaFen = [nuovaFen].concat(this.gameVisualizzata.fen().split(' ').slice(1));
            nuovaFen = nuovaFen.join(' ');
            this.game = Chess(nuovaFen);


            this.history.push(move);

            this.updatePosition(false, animation);

            this.movedSquare(mossa.slice(2, 4));
            this.movedSquare(mossa.slice(0, 2));
        }

        return true;
    }

    gameOver() { // Restituisce lo stato della partita

        if (this.game.fen() === '') return null;

        // Se c'è solo un re, restituisci il vincitore
        let kb = false;
        let kw = false;
        for (let casella in this.celle) {
            if (this.isPiece(casella, 'kb')) kb = true;
            if (this.isPiece(casella, 'kw')) kw = true;
        }
        if (!kb) return 'w';
        if (!kw) return 'b';

        if (thid.getLegalMoves().length === 0) 


        return null;
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
        console.log(this.game.fen());

        if (this.gameOver()) return;

        // Imposta la position della partita visualizzata
        let position = this.game.fen();

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
        this.gameVisualizzata = Chess(position);

        // Rimuove i pezzi dalle caselle non accessibili e salva le caselle occupate
        let caselleAccessibili = this.getLegalMoves().map(m => m['to']);
        console.log(this.getLegalMoves());
        console.log('accessibili', caselleAccessibili);
        let caselleOccupate = []
        for (let casella in this.celle) {
            if (!caselleAccessibili.includes(casella) && !this.playerPiece(casella) && this.game.get(casella) !== null) {
                this.gameVisualizzata.remove(casella);
                caselleOccupate.push(casella);
            }
        }

        // Colora le caselle accessibili e non accessibili e salva le caselle annebbiate
        caselleAccessibili = this.getLegalMoves().map(m => m['to']);
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


}