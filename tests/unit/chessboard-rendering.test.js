/**
 * Chessboard Rendering Tests
 * Tests that verify the board renders correctly in the DOM
 */
import { vi, beforeAll, afterAll } from 'vitest';
import Chessboard from '../../src/index.js';

describe('Chessboard Rendering', () => {
  let chessboard;
  const config = { id_div: 'board', size: 400, position: 'start', orientation: 'w' };

  beforeAll(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.clearAllTimers();
    document.body.innerHTML = '<div id="board"></div>';
    chessboard = new Chessboard(config);
  });

  afterEach(() => {
    vi.clearAllTimers();
    if (chessboard && typeof chessboard.destroy === 'function') {
      try {
        chessboard.destroy();
      } catch {
        // Ignore cleanup errors
      }
    }
    chessboard = null;
  });

  describe('DOM Structure', () => {
    test('board container should exist', () => {
      const container = document.getElementById('board');
      expect(container).not.toBeNull();
      expect(container.children.length).toBeGreaterThan(0);
    });

    test('should create 64 squares', () => {
      const squares = chessboard.boardService.getAllSquares();
      expect(Object.keys(squares).length).toBe(64);
    });

    test('each square should have a DOM element', () => {
      const squares = chessboard.boardService.getAllSquares();
      Object.values(squares).forEach((square) => {
        expect(square.element).toBeInstanceOf(HTMLElement);
      });
    });

    test('squares should have correct IDs', () => {
      const expectedSquares = [];
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
      files.forEach((file) => {
        ranks.forEach((rank) => {
          expectedSquares.push(file + rank);
        });
      });

      const squares = chessboard.boardService.getAllSquares();
      expectedSquares.forEach((id) => {
        expect(squares[id]).toBeDefined();
        expect(squares[id].id).toBe(id);
      });
    });
  });

  describe('Piece Rendering', () => {
    test('pieces should be placed on starting squares', () => {
      // Check white pieces
      expect(chessboard.getPiece('a1')).toBe('wr');
      expect(chessboard.getPiece('b1')).toBe('wn');
      expect(chessboard.getPiece('c1')).toBe('wb');
      expect(chessboard.getPiece('d1')).toBe('wq');
      expect(chessboard.getPiece('e1')).toBe('wk');
      expect(chessboard.getPiece('f1')).toBe('wb');
      expect(chessboard.getPiece('g1')).toBe('wn');
      expect(chessboard.getPiece('h1')).toBe('wr');

      // Check white pawns
      for (const file of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
        expect(chessboard.getPiece(`${file}2`)).toBe('wp');
      }

      // Check black pieces
      expect(chessboard.getPiece('a8')).toBe('br');
      expect(chessboard.getPiece('b8')).toBe('bn');
      expect(chessboard.getPiece('c8')).toBe('bb');
      expect(chessboard.getPiece('d8')).toBe('bq');
      expect(chessboard.getPiece('e8')).toBe('bk');
      expect(chessboard.getPiece('f8')).toBe('bb');
      expect(chessboard.getPiece('g8')).toBe('bn');
      expect(chessboard.getPiece('h8')).toBe('br');

      // Check black pawns
      for (const file of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
        expect(chessboard.getPiece(`${file}7`)).toBe('bp');
      }
    });

    test('empty squares should have no piece', () => {
      // Ranks 3-6 should be empty
      for (const rank of ['3', '4', '5', '6']) {
        for (const file of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
          expect(chessboard.getPiece(`${file}${rank}`)).toBeNull();
        }
      }
    });

    test('piece objects should have DOM elements', () => {
      const e2Square = chessboard.boardService.getSquare('e2');
      expect(e2Square.piece).not.toBeNull();
      expect(e2Square.piece.element).toBeInstanceOf(HTMLElement);
    });

    test('putPiece should add piece to DOM', () => {
      chessboard.putPiece('wq', 'e4');
      const e4Square = chessboard.boardService.getSquare('e4');
      expect(e4Square.piece).not.toBeNull();
      expect(e4Square.piece.element).toBeInstanceOf(HTMLElement);
    });

    test('removePiece should remove piece from DOM', () => {
      chessboard.removePiece('e2');
      const e2Square = chessboard.boardService.getSquare('e2');
      expect(e2Square.piece).toBeNull();
    });
  });

  describe('Board Orientation', () => {
    test('white orientation should have a1 square data correct', () => {
      expect(chessboard.getOrientation()).toBe('w');
      // Square row/col match the algebraic notation directly (a1 = row 1, col 1)
      const a1Square = chessboard.boardService.getSquare('a1');
      expect(a1Square.row).toBe(1);
      expect(a1Square.col).toBe(1);
      expect(a1Square.id).toBe('a1');
    });

    test('flipBoard should change orientation', () => {
      chessboard.flipBoard();
      expect(chessboard.getOrientation()).toBe('b');
    });

    test('setOrientation should update orientation', () => {
      chessboard.setOrientation('b');
      expect(chessboard.getOrientation()).toBe('b');
      chessboard.setOrientation('w');
      expect(chessboard.getOrientation()).toBe('w');
    });
  });

  describe('Move Rendering', () => {
    test('movePiece should update piece positions', () => {
      // Move e2 to e4
      chessboard.movePiece('e2e4');
      chessboard.forceSync();
      vi.advanceTimersByTime(100);

      expect(chessboard.getPiece('e2')).toBeNull();
      expect(chessboard.getPiece('e4')).toBe('wp');
    });

    test('capture should remove captured piece', () => {
      // Scholar's mate setup
      chessboard.movePiece('e2e4');
      chessboard.movePiece('e7e5');
      chessboard.movePiece('d1h5');
      chessboard.movePiece('b8c6');
      chessboard.movePiece('f1c4');
      chessboard.movePiece('g8f6');
      // Capture on f7
      chessboard.movePiece('h5f7');
      chessboard.forceSync();
      vi.advanceTimersByTime(100);

      // f7 should now have white queen
      expect(chessboard.getPiece('f7')).toBe('wq');
    });
  });

  describe('Board State', () => {
    test('clear should remove all pieces from DOM', () => {
      chessboard.clear({ animate: false });
      chessboard.forceSync();
      vi.advanceTimersByTime(100);

      // All squares should be empty
      const squares = chessboard.boardService.getAllSquares();
      Object.values(squares).forEach((square) => {
        expect(square.piece).toBeNull();
      });
    });

    test('reset should restore starting position after moves', () => {
      // Make some moves first
      chessboard.movePiece('e2e4');
      chessboard.movePiece('e7e5');
      chessboard.forceSync();
      vi.advanceTimersByTime(100);

      // Verify e2 is empty and e4 has pawn
      expect(chessboard.getPiece('e2')).toBeNull();
      expect(chessboard.getPiece('e4')).toBe('wp');

      // Reset to starting position
      chessboard.reset({ animate: false });
      chessboard.forceSync();
      vi.advanceTimersByTime(100);

      // Check that pieces are back in starting positions
      expect(chessboard.getPiece('e1')).toBe('wk');
      expect(chessboard.getPiece('e8')).toBe('bk');
      expect(chessboard.getPiece('e2')).toBe('wp');
      expect(chessboard.getPiece('e4')).toBeNull();
    });

    test('setPosition should update board correctly', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
      chessboard.setPosition(fen);
      chessboard.forceSync();
      vi.advanceTimersByTime(100);

      expect(chessboard.getPiece('e4')).toBe('wp');
      expect(chessboard.getPiece('e2')).toBeNull();
    });
  });

  describe('Board Resize', () => {
    test('resizeBoard should update CSS variable', () => {
      chessboard.resizeBoard(500);
      expect(document.documentElement.style.getPropertyValue('--dimBoard')).toBe('500px');
    });

    test('resizeBoard should reject invalid string values', () => {
      expect(() => chessboard.resizeBoard('600px')).toThrow();
    });

    test('resizeBoard should accept auto value', () => {
      expect(() => chessboard.resizeBoard('auto')).not.toThrow();
    });
  });

  describe('Highlight', () => {
    test('highlight should add class to square', () => {
      chessboard.highlight('e4');
      const e4Square = chessboard.boardService.getSquare('e4');
      // The class is 'highlighted' per Square.js
      expect(e4Square.element.classList.contains('highlighted')).toBe(true);
    });

    test('dehighlight should remove class from square', () => {
      chessboard.highlight('e4');
      chessboard.dehighlight('e4');
      const e4Square = chessboard.boardService.getSquare('e4');
      expect(e4Square.element.classList.contains('highlighted')).toBe(false);
    });
  });
});

describe('Chessboard Game State', () => {
  let chessboard;
  const config = { id_div: 'board', size: 400, position: 'start', orientation: 'w' };

  beforeAll(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.clearAllTimers();
    document.body.innerHTML = '<div id="board"></div>';
    chessboard = new Chessboard(config);
  });

  afterEach(() => {
    vi.clearAllTimers();
    if (chessboard && typeof chessboard.destroy === 'function') {
      try {
        chessboard.destroy();
      } catch {
        // Ignore cleanup errors
      }
    }
    chessboard = null;
  });

  describe('FEN', () => {
    test('fen() should return valid FEN string', () => {
      const fen = chessboard.fen();
      expect(fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    });

    test('fen() should update after moves', () => {
      chessboard.movePiece('e2e4');
      chessboard.forceSync();
      vi.advanceTimersByTime(50);

      const fen = chessboard.fen();
      expect(fen).toContain('4P3'); // e4 pawn
      expect(fen).toContain('b'); // black's turn
    });
  });

  describe('Turn', () => {
    test('turn() should return current player', () => {
      expect(chessboard.turn()).toBe('w');
    });

    test('turn() should alternate after moves', () => {
      chessboard.movePiece('e2e4');
      chessboard.forceSync();
      vi.advanceTimersByTime(50);
      expect(chessboard.turn()).toBe('b');

      chessboard.movePiece('e7e5');
      chessboard.forceSync();
      vi.advanceTimersByTime(50);
      expect(chessboard.turn()).toBe('w');
    });
  });

  describe('Game Over Detection', () => {
    test('isGameOver() should detect checkmate', () => {
      // Fool's mate
      chessboard.movePiece('f2f3');
      chessboard.movePiece('e7e5');
      chessboard.movePiece('g2g4');
      chessboard.movePiece('d8h4');
      chessboard.forceSync();
      vi.advanceTimersByTime(100);

      expect(chessboard.isGameOver()).toBe(true);
      expect(chessboard.isCheckmate()).toBe(true);
    });

    test('isGameOver() should detect stalemate', () => {
      chessboard.setPosition('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
      chessboard.forceSync();
      vi.advanceTimersByTime(50);

      expect(chessboard.isGameOver()).toBe(true);
      expect(chessboard.isStalemate()).toBe(true);
    });
  });

  describe('History', () => {
    test('getHistory() should track moves', () => {
      chessboard.movePiece('e2e4');
      chessboard.movePiece('e7e5');
      chessboard.movePiece('g1f3');
      chessboard.forceSync();
      vi.advanceTimersByTime(100);

      const history = chessboard.getHistory();
      expect(history.length).toBe(3);
    });
  });
});
