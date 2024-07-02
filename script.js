// Chessboard(id_div, posizione, orientamento, temaPezzi = 'simple', colore = 220, onMossa, suggerimenti = true, annebbia = false)

// class ChessboardConfig {

//     constructor() {
//         this.id_div = 'chessboard';
//         this.position = DEFAULT_POSITION_WHITE;
//         this.color = true;
//         this.config.onMossa = () => true;
//         this.hints = true;
//         this.fog = false;
//         this.path = 'default_pieces';
//     }

let fen='r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1p3PPP/R5K1 b - - 0 19'

var config = new ChessboardConfig('board', 'start', 'w', onMossa, true, false)

var board = config.build()

function onMossa(mossa) {
    console.log(mossa);
    board.move(mossa);
    board.ribalta();
}

board.setPosition(fen, 'b');

