// constructor(
//     id_div,
//     position = DEFAULT_POSITION_WHITE,
//     color = 'w',
//     onMossa = () => true,
//     hints = true,
//     fog = false,
//     path = 'default_pieces',
//     animation = 500,
//     free = true
// ) 

let fen = 'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1p3PPP/R5K1 b - - 0 19'

var config = new ChessboardConfig({
    id_div: 'board', 
    position: 'start', 
    color: 'w', 
    onMossa: onMossa, 
    hint: true, 
    free: false
});

var board = config.build()

function onMossa(mossa) {
    board.makeMove(mossa);
}

board.setPosition(DEFAULT_POSITION_WHITE, 'w');

