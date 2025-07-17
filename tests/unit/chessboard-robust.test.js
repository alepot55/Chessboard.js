import Chessboard from '../../src/index.js';

describe('Chessboard Robustness & Edge Cases', () => {
    let chessboard;
    let config = { id_div: 'board', size: 400, position: 'start', orientation: 'w' };

    beforeEach(() => {
        document.body.innerHTML = '<div id="board"></div>';
        chessboard = new Chessboard(config);
    });

    describe('Piece Insertion', () => {
        test('insert valid string piece', () => {
            expect(() => chessboard.putPiece('wq', 'e4')).not.toThrow();
            expect(chessboard.getPiece('e4')).toBe('wq');
        });
        test('insert valid object piece', () => {
            expect(() => chessboard.putPiece({ type: 'q', color: 'w' }, 'd5')).not.toThrow();
            expect(chessboard.getPiece('d5')).toBe('wq');
        });
        test('insert invalid string piece', () => {
            expect(() => chessboard.putPiece('xx', 'e4')).toThrow();
        });
        test('insert invalid object piece', () => {
            expect(() => chessboard.putPiece({ type: 'z', color: 'w' }, 'e4')).toThrow();
        });
        test('insert null/undefined piece', () => {
            expect(() => chessboard.putPiece(null, 'e4')).toThrow();
            expect(() => chessboard.putPiece(undefined, 'e4')).toThrow();
        });
        test('insert on invalid square', () => {
            expect(() => chessboard.putPiece('wq', 'z9')).toThrow();
        });
        test('insert on already occupied square', () => {
            chessboard.putPiece('wq', 'e4');
            expect(() => chessboard.putPiece('bq', 'e4')).not.toThrow();
            expect(chessboard.getPiece('e4')).toBe('bq');
        });
    });

    describe('Piece Removal', () => {
        test('remove from empty square', () => {
            expect(chessboard.getPiece('e5')).toBeNull();
            expect(() => chessboard.removePiece('e5')).not.toThrow();
        });
        test('remove from occupied square', () => {
            chessboard.putPiece('wq', 'e4');
            expect(() => chessboard.removePiece('e4')).not.toThrow();
            expect(chessboard.getPiece('e4')).toBeNull();
        });
        test('remove from invalid square', () => {
            expect(() => chessboard.removePiece('z9')).toThrow();
        });
    });

    describe('FEN Handling', () => {
        test('set valid FEN', () => {
            const fen = '8/8/8/8/8/8/8/8 w - - 0 1';
            expect(() => chessboard.setPosition(fen)).toThrow(); // ora deve lanciare
        });
        test('set invalid FEN', () => {
            expect(() => chessboard.setPosition('invalid-fen')).toThrow();
        });
        test('set FEN with pawns on first/last rank', () => {
            expect(() => chessboard.setPosition('8/8/8/8/8/8/8/P7 w - - 0 1')).toThrow();
        });
        test('set FEN with too many kings', () => {
            expect(() => chessboard.setPosition('8/8/8/8/8/8/8/KK6 w - - 0 1')).toThrow();
        });
    });

    describe('Game Over & Rules', () => {
        test('stalemate detection', () => {
            chessboard.setPosition('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
            expect(chessboard.isGameOver()).toBe(true);
        });
        test('insufficient material', () => {
            chessboard.setPosition('8/8/8/8/8/8/2k5/3K4 w - - 0 1');
            expect(chessboard.isGameOver()).toBe(true);
        });
    });

    describe('Undo/Redo & History', () => {
        test('undo/redo after clear', () => {
            chessboard.movePiece('e2e4');
            chessboard.clear();
            expect(() => chessboard.undoMove()).not.toThrow();
        });
    });

    describe('Alias & Deprecated', () => {
        test('alias insert', () => {
            expect(() => chessboard.insert('e4', 'wq')).not.toThrow();
            expect(chessboard.getPiece('e4')).toBe('wq');
        });
    });

    describe('Drag & Drop', () => {
        test('draggable false disables drag', () => {
            chessboard = new Chessboard({ ...config, draggable: false });
            expect(chessboard.config.draggable).toBe(false);
        });
        test('draggable true enables drag', () => {
            chessboard = new Chessboard({ ...config, draggable: true });
            expect(chessboard.config.draggable).toBe(true);
        });
    });

    describe('Resize & Flip Edge Cases', () => {
        test('multiple flips', () => {
            chessboard.flipBoard();
            chessboard.flipBoard();
            expect(chessboard.getOrientation()).toBe('w');
        });
        test('resize to auto', () => {
            expect(() => chessboard.resizeBoard('auto')).not.toThrow();
        });
    });
}); 