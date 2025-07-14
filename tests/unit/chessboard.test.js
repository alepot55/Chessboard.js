import Chessboard from '../../src/index.js';

describe('Chessboard User Functions', () => {
    let chessboard;
    let config = { id_div: 'board', size: 400, position: 'start', orientation: 'w' };

    beforeEach(() => {
        document.body.innerHTML = '<div id="board"></div>';
        chessboard = new Chessboard(config);
    });

    test('turn() should return the current turn', () => {
        expect(chessboard.turn()).toBe('w');
    });

    test('getOrientation() should return the current orientation', () => {
        expect(chessboard.getOrientation()).toBe('w');
    });

    test('fen() should return the current FEN string', () => {
        expect(chessboard.fen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    });

    test('lastMove() should return the last move made', () => {
        chessboard.move('e2e4');
        expect(chessboard.lastMove().san).toBe('e4');
    });

    test('history() should return the history of moves', () => {
        chessboard.move('e2e4');
        chessboard.move('e7e5');
        expect(chessboard.history().length).toBe(2);
    });

    test('get() should return the piece on the given square', () => {
        expect(chessboard.get('e2')).toBe('pw');
    });

    test('position() should set the board to the given position', () => {
        chessboard.position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        expect(chessboard.fen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    });

    test('flip() should flip the board orientation', () => {
        chessboard.flip();
        expect(chessboard.getOrientation()).toBe('b');
    });

    test('build() should rebuild the board', () => {
        chessboard.build();
        expect(chessboard.fen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    });

    test('clear() should clear the board', () => {
        chessboard.clear();
        expect(chessboard.fen()).toBe('8/8/8/8/8/8/8/8 w - - 0 1');
    });

    test('insert() should insert a piece on the given square', () => {
        chessboard.insert('e4', 'qw');
        expect(chessboard.get('e4')).toBe('qw');
    });

    test('isGameOver() should return the game over status', () => {
        chessboard.position('default');
        chessboard.move('e2e4');
        chessboard.move('e7e5');
        chessboard.move('d1h5');
        chessboard.move('b8c6');
        chessboard.move('f1c4');
        chessboard.move('g8f6');
        chessboard.move('h5f7');
        expect(chessboard.isGameOver()).toBe('w');
    });

    test('orientation() should set the board orientation', () => {
        chessboard.orientation('b');
        expect(chessboard.getOrientation()).toBe('b');
    });

    test('resize() should resize the board', () => {
        chessboard.resize(500);
        expect(document.documentElement.style.getPropertyValue('--dimBoard')).toBe('500px');
    });

    test('destroy() should destroy the board', () => {
        chessboard.destroy();
        expect(chessboard.board).toBeNull();
    });

    test('remove() should remove a piece from the given square', () => {
        chessboard.remove('e2');
        expect(chessboard.get('e2')).toBeNull();
    });

    test('piece() should return the piece on the given square', () => {
        expect(chessboard.piece('e2')).toBe('pw');
    });

    test('highlight() should highlight the given square', () => {
        chessboard.highlight('e2');
        expect(chessboard.squares['e2'].element.classList.contains('highlighted')).toBe(true);
    });

    test('dehighlight() should dehighlight the given square', () => {
        chessboard.highlight('e2');
        chessboard.dehighlight('e2');
        expect(chessboard.squares['e2'].element.classList.contains('highlighted')).toBe(false);
    });

    test('playerTurn() should return true if it is the player turn', () => {
        expect(chessboard.playerTurn()).toBe(true);
    });

    test('isWhiteOriented() should return true if the board is oriented for white', () => {
        expect(chessboard.isWhiteOriented()).toBe(true);
    });

    test('getSquareID() should return the correct square ID', () => {
        expect(chessboard.getSquareID(0, 0)).toBe('a8');
        expect(chessboard.getSquareID(7, 7)).toBe('h1');
    });

    test('removeSquares() should remove all squares from the board', () => {
        chessboard.removeSquares();
        expect(Object.keys(chessboard.squares).length).toBe(0);
    });
});
