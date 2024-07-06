        // onMove: function(move)

        // onMoveEnd: function(move)

        // onChange: function(fen)

        // onDragStart: function(from, piece)

        // onDragMove: function(from, to, piece)

        // onDrop: function(from, to, piece)

        // onSnapbackEnd: function(from, piece)

let fen = 'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1p3PPP/R5K1 b - - 0 19'

var config = new ChessboardConfig({
    id_div: 'board', 
    position: 'start', 
    color: 'w', 
    hints: true, 
    movableColors: false,
    moveHighlight: true,
    draggable: true,
    movable: true,
    dropOffBoard: 'trash',
    onlyLegalMoves: false,
});

var board = config.build();


board.setPosition(fen, 'b');
