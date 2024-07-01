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

var config = new ChessboardConfig('board', 'start', 'w', onMossa, true, false)

var board = config.build()

function onMossa(mossa) {
    console.log(mossa);
    board.move(mossa);
    board.ribalta();
}

board.setPosition(DEFAULT_POSITION_WHITE, 'w')

