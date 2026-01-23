import { ChessboardConfig } from '../../src/core/ChessboardConfig.js';

describe('ChessboardConfig Animation & Drag Properties', () => {
  const baseConfig = { id: 'test-board' };

  test('should handle boolean moveAnimation values', () => {
    expect(() => {
      new ChessboardConfig({ ...baseConfig, moveAnimation: true });
    }).not.toThrow();
    expect(() => {
      new ChessboardConfig({ ...baseConfig, moveAnimation: false });
    }).not.toThrow();
    // Check resulting property
    expect(new ChessboardConfig({ ...baseConfig, moveAnimation: true }).moveAnimation).toBe('ease');
    expect(new ChessboardConfig({ ...baseConfig, moveAnimation: false }).moveAnimation).toBe(null);
  });

  test('should handle boolean snapbackAnimation values', () => {
    expect(() => {
      new ChessboardConfig({ ...baseConfig, snapbackAnimation: true });
    }).not.toThrow();
    expect(() => {
      new ChessboardConfig({ ...baseConfig, snapbackAnimation: false });
    }).not.toThrow();
    expect(new ChessboardConfig({ ...baseConfig, snapbackAnimation: true }).snapbackAnimation).toBe('ease');
    expect(new ChessboardConfig({ ...baseConfig, snapbackAnimation: false }).snapbackAnimation).toBe(null);
  });

  test('should handle boolean fadeAnimation values', () => {
    expect(() => {
      new ChessboardConfig({ ...baseConfig, fadeAnimation: true });
    }).not.toThrow();
    expect(() => {
      new ChessboardConfig({ ...baseConfig, fadeAnimation: false });
    }).not.toThrow();
    expect(new ChessboardConfig({ ...baseConfig, fadeAnimation: true }).fadeAnimation).toBe('ease');
    expect(new ChessboardConfig({ ...baseConfig, fadeAnimation: false }).fadeAnimation).toBe(null);
  });

  test('should handle string animation values', () => {
    expect(() => {
      new ChessboardConfig({
        ...baseConfig,
        moveAnimation: 'ease-in-out',
        snapbackAnimation: 'linear',
        fadeAnimation: 'ease',
      });
    }).not.toThrow();
  });

  test('should handle none animation values', () => {
    expect(() => {
      new ChessboardConfig({
        ...baseConfig,
        moveAnimation: 'none',
        snapbackAnimation: 'none',
        fadeAnimation: 'none',
      });
    }).not.toThrow();
  });

  test('should throw error for invalid animation values', () => {
    expect(() => {
      new ChessboardConfig({ ...baseConfig, moveAnimation: 'invalid-animation' });
    }).toThrow('Invalid transition function');
  });

  // --- DRAGGABLE ---
  test('should handle draggable true/false', () => {
    expect(() => new ChessboardConfig({ ...baseConfig, draggable: true })).not.toThrow();
    expect(() => new ChessboardConfig({ ...baseConfig, draggable: false })).not.toThrow();
  });
  test('should default draggable to true', () => {
    const config = new ChessboardConfig(baseConfig);
    expect(config.draggable).toBe(true);
  });
  test('should throw error for invalid draggable value', () => {
    expect(() => new ChessboardConfig({ ...baseConfig, draggable: 'maybe' })).toThrow();
  });

  // --- DROP OFF BOARD ---
  test('should accept valid dropOffBoard values', () => {
    expect(() => new ChessboardConfig({ ...baseConfig, dropOffBoard: 'snapback' })).not.toThrow();
    expect(() => new ChessboardConfig({ ...baseConfig, dropOffBoard: 'trash' })).not.toThrow();
  });
  test('should throw error for invalid dropOffBoard value', () => {
    expect(() => new ChessboardConfig({ ...baseConfig, dropOffBoard: 'invalid' })).toThrow();
  });

  // --- ANIMATION STYLE ---
  test('should accept valid animationStyle values', () => {
    expect(() => new ChessboardConfig({ ...baseConfig, animationStyle: 'simultaneous' })).not.toThrow();
    expect(() => new ChessboardConfig({ ...baseConfig, animationStyle: 'sequential' })).not.toThrow();
  });
  test('should throw error for invalid animationStyle value', () => {
    expect(() => new ChessboardConfig({ ...baseConfig, animationStyle: 'crazy' })).toThrow();
  });

  // --- EDGE CASES ---
  test('should throw error if id/id_div is missing', () => {
    expect(() => new ChessboardConfig({})).toThrow();
  });
  test('should throw error for non-object config', () => {
    expect(() => new ChessboardConfig('not-an-object')).toThrow();
  });
});
