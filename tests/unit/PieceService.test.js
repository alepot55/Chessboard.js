import { PieceService } from '../../src/services/PieceService.js';
import Piece from '../../src/components/Piece.js';

// Mock config
const mockConfig = {
  piecesPath: 'assets/pieces',
  fadeTime: 0,
  fadeAnimation: 'linear',
  moveTime: 0,
  moveAnimation: 'linear',
  draggable: true
};

describe('PieceService', () => {
  let pieceService;

  beforeEach(() => {
    pieceService = new PieceService(mockConfig);
  });

  describe('convertPiece', () => {
    test('should convert valid string piece (type+color)', () => {
      const piece = pieceService.convertPiece('pw');
      expect(piece).toBeInstanceOf(Piece);
      expect(piece.type).toBe('p');
      expect(piece.color).toBe('w');
    });

    test('should convert valid string piece (color+type)', () => {
      const piece = pieceService.convertPiece('wp');
      expect(piece).toBeInstanceOf(Piece);
      expect(piece.type).toBe('p');
      expect(piece.color).toBe('w');
    });

    test('should handle Piece object', () => {
      const p = new Piece('w', 'p', 'path');
      expect(pieceService.convertPiece(p)).toBe(p);
    });

    test('should throw on invalid piece', () => {
      expect(() => pieceService.convertPiece('xx')).toThrow();
    });
  });

  describe('getPiecePath', () => {
    test('should return correct path string', () => {
      expect(pieceService.getPiecePath('wp')).toBe('assets/pieces/wp.svg');
    });

    test('should handle object configuration', () => {
      const customService = new PieceService({
        piecesPath: { wp: 'custom/wp.png' }
      });
      expect(customService.getPiecePath('wp')).toBe('custom/wp.png');
    });

    test('should handle function configuration', () => {
      const customService = new PieceService({
        piecesPath: (p) => `dynamic/${p}.webp`
      });
      expect(customService.getPiecePath('bk')).toBe('dynamic/bk.webp');
    });
  });
});
