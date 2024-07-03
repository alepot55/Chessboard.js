
class FogboardConfig extends ChessboardConfig {
    constructor(settings) {
        super(settings);
        this.fog = settings.fog;
    }

    setFog(fog) {
        this.fog = fog;
        return this;
    }
}

class Fogboard extends Chessboard {

    constructor(config) {
        super(config);
    }

    updatePieces() {

        let partita = this.config.fog && !this.terminata ? this.gameVisualizzata : this.game;

        for (let square in this.celle) {

            let pieceNew = partita.get(square) ? partita.get(square)['type'] + partita.get(square)['color'] : null;
            let pieceOld = this.pezzi[square] ? this.pezzi[square]['piece'] : null;

            if (pieceNew !== null && pieceOld !== pieceNew) {

                for (let from in this.pezzi) {
                    let coming = this.pezzi[from] ? this.pezzi[from]['piece'] : null;
                    if (from !== square && coming === pieceNew && !this.isPiece(pieceNew, from)) {

                        // check for en passant
                        let lastMove = this.lastMove();
                        if (!pieceOld && lastMove && lastMove['captured'] === 'p') {
                            this.removePiece(square[0] + from[1]);
                        }

                        // check for castling
                        let recastling = false;
                        if (lastMove && (lastMove['san'] === 'O-O' || lastMove['san'] === 'O-O-O') && (pieceNew[0] === 'k' || pieceNew[0] === 'r')) {
                            recastling = true;
                        }

                        this.translatePiece(from, square, recastling);

                        return;
                    }
                }

                // check for promotion
                let lastMove = this.lastMove();
                if (lastMove && lastMove['promotion'] && lastMove['to'] === square) {
                    return this.translatePiece(lastMove['from'], square);
                }

                this.putPiece(square, pieceNew);
            }
        }
    }

    getLegalMoves(from = null, verb = true) {

        let partita = this.config.fog ? this.gameVisualizzata : this.game;

        if (from === null) return partita.moves({ verbose: verb });
        return partita.moves({ square: from, verbose: verb });

    }

    move(mossa) {

        if (this.rit) this.lastPosition();

        this.deselectAllSquares();

        // Esegue la mossa 
        let res = this.game.move({ from: mossa.slice(0, 2), to: mossa.slice(2, 4), promotion: mossa.length === 5 && "rbqn".includes(mossa[4]) ? mossa[4] : undefined });

        // Se la mossa non è stata eseguita in nebbia
        if (res == null && this.config.fog) {

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
        }

        // updatePosition la Chessboard
        this.updatePosition();

        // Se la partita non è terminata, evidenzia la mossa
        if (!this.config.fog || this.terminata) {
            this.movedSquare(mossa.slice(2, 4));
            this.movedSquare(mossa.slice(0, 2));
        }
    }

    statoPartita() { // Restituisce lo stato della partita

        // Se la modalità nebbia è attiva
        if (this.config.fog) {
            if (this.game.fen() === '') return null;

            // Se c'è solo un re, restituisci il vincitore
            let kb = false;
            let kw = false;
            for (let casella in this.celle) {
                if (this.game.get(casella) === null) continue;
                else if ('kb' === this.game.get(casella)['type'] + this.game.get(casella)['color']) kb = true;
                else if ('kw' === this.game.get(casella)['type'] + this.game.get(casella)['color']) kw = true;
            }
            if (!kb) return 'w';
            if (!kw) return 'b';
        } else if (this.game.game_over()) {

            // Se la partita è terminata, restituisci il vincitore
            if (this.game.in_checkmate()) return this.game.turn() === 'w' ? 'b' : 'w';
            return 'p';
        }
        return null;
    }

    updatePosition(change_color = false) {
        this.terminata = false;
        if (change_color) {
            this.removeSquares();
            this.buildSquares();
        }
        this.updatePieces();
        if (this.config.fog) this.fogHiddenSquares();
        if (this.statoPartita() !== null) this.termina();
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
                if (this.game.get(casella) === null) continue;
                else if ('k' === this.game.get(casella)['type']) k = k + 1;
            }
            if (k === 1) {
                this.termina();
                return;
            }
    
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
            let caselleAccessibili = this.mossePossibili().map(m => m['to']);
            let caselleOccupate = []
            for (let casella in this.celle) {
                if (!caselleAccessibili.includes(casella) && !this.playerPiece(casella) && this.game.get(casella) !== null) {
                    this.gameVisualizzata.remove(casella);
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
    

}