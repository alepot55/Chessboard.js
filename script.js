import { Chessboard } from './chessboard.js';

let fen = 'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1p3PPP/R5K1 b - - 0 19'

var board = new Chessboard({
    mode: 'normal',
    id_div: 'board', 
    position: 'start', 
    color: 'w', 
});


board.position(fen, 'b');

