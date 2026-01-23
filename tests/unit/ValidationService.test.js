import { ValidationService } from '../../src/services/ValidationService.js';

describe('ValidationService', () => {
  let validationService;

  beforeEach(() => {
    validationService = new ValidationService();
  });

  describe('isValidSquare', () => {
    test('should validate correct squares', () => {
      expect(validationService.isValidSquare('a1')).toBe(true);
      expect(validationService.isValidSquare('h8')).toBe(true);
      expect(validationService.isValidSquare('e4')).toBe(true);
    });

    test('should invalidate incorrect squares', () => {
      expect(validationService.isValidSquare('i1')).toBe(false); // Invalid file
      expect(validationService.isValidSquare('a9')).toBe(false); // Invalid rank
      expect(validationService.isValidSquare('a0')).toBe(false); // Invalid rank
      expect(validationService.isValidSquare('aa')).toBe(false);
      expect(validationService.isValidSquare('')).toBe(false);
      expect(validationService.isValidSquare(null)).toBe(false);
    });
  });

  describe('isValidPiece', () => {
    test('should validate correct pieces (color+type or type+color)', () => {
      // The validation service usually checks for strict format used internally or by API
      // Let's check what it supports. Assuming type+color or color+type based on context
      // isValidPiece in ValidationService.js:
      // const color = piece[0]; const type = piece[1];
      // isValid = ['w', 'b'].includes(color) && ['P', 'R', 'N', 'B', 'Q', 'K'].includes(type);

      // So it expects Color then Type (e.g. wP). Note types are Uppercase in logic?
      // Let's check logic in src/utils/validation.js:
      // const color = piece[0]; const type = piece[1];
      // isValid = ['w', 'b'].includes(color) && ['P', 'R', 'N', 'B', 'Q', 'K'].includes(type);

      // So 'wP' is valid. 'pw' is INVALID.
      // Wait, but PieceService handles 'pw' by converting.
      // ValidationService seems strict.

      expect(validationService.isValidPiece('wP')).toBe(true);
      expect(validationService.isValidPiece('bK')).toBe(true);
    });

    test('should invalidate incorrect pieces', () => {
      expect(validationService.isValidPiece('ww')).toBe(false);
      expect(validationService.isValidPiece('PP')).toBe(false);
      expect(validationService.isValidPiece('xP')).toBe(false);
      expect(validationService.isValidPiece('wX')).toBe(false);
    });
  });

  describe('validateConfig', () => {
    test('should validate correct config', () => {
      const config = { id_div: 'board', position: 'start' };
      const result = validationService.validateConfig(config);
      expect(result.success).toBe(true);
    });

    test('should require id or id_div', () => {
      const config = { position: 'start' };
      const result = validationService.validateConfig(config);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Configuration must include "id" or "id_div"');
    });

    test('should validate orientation', () => {
      expect(validationService.validateConfig({ id: 'b', orientation: 'w' }).success).toBe(true);
      expect(validationService.validateConfig({ id: 'b', orientation: 'white' }).success).toBe(true);
      expect(validationService.validateConfig({ id: 'b', orientation: 'x' }).success).toBe(false);
    });
  });
});
