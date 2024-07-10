// let defaults = {

//     // ---------------------- General
//     id_div: 'board',
//     position: 'start',
//     orientation: 'w',
//     mode: 'normal',
//     size: 600,

//     // ---------------------- Moves
//     draggable: true,
//     hints: true,
//     clickable: true,
//     movableColors: 'both',
//     moveHighlight: true,
//     overHighlight: true,
//     moveAnimation: 'ease',
//     moveTime: 'fast',

//     // ---------------------- Snapback
//     dropOffBoard: 'snapback',
//     snapbackTime: 'fast',
//     snapbackAnimation: 'ease',

//     // ---------------------- Fade
//     fadeTime: 'fast',
//     fadeAnimation: 'ease',

//     // ---------------------- Pieces
//     ratio: 0.9,
//     piecesPath: 'default_pieces',

//     // ---------------------- Events
//     onMove: () => true,
//     onMoveEnd: () => true,
//     onChange: () => true,
//     onDragStart: () => true,
//     onDragMove: () => true,
//     onDrop: () => true,
//     onSnapbackEnd: () => true,

//     // ---------------------- Colors
//     whiteSquare: '#f0d9b5',
//     blackSquare: '#b58863',
//     highlight: 'yellow',
//     selectedSquareWhite: '#ababaa',
//     selectedSquareBlack: '#ababaa',
//     movedSquareWhite: '#f1f1a0',
//     movedSquareBlack: '#e9e981',
//     choiceSquare: 'white',
//     coverSquare: 'black',
//     hintColor: '#ababaa'
// };



// var board = new Chessboard({
//     id_div: 'board', 
//     piecesPath: 'alepot_theme/',
//     whiteSquare: '#e7edf9',
//     blackSquare: '#b6c1d8',
//     ratio: 0.75,
//     hintColor: '#a192ed',
//     selectedSquareWhite: '#b5a6fc',
//     selectedSquareBlack: '#a192ed',
//     highlight: '#a192ed',
//     moveHighlight: false,
// });
var board = new Chessboard({
    id_div: 'board',
    piecesPath: 'https://cdn.jsdelivr.net/npm/@alepot55/chessboardjs/alepot_theme',
    ratio: 0.75,
    hintColor: '#a192ed',
    whiteSquare: '#e7edf9', blackSquare: '#b6c1d8',
    selectedSquareWhite: '#b5a6fc', selectedSquareBlack: '#a192ed',
});
