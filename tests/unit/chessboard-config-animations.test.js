const ChessboardConfig = require('../src/core/ChessboardConfig.js');

describe('ChessboardConfig Animation Properties', () => {
    test('should handle boolean moveAnimation values', () => {
        expect(() => {
            new ChessboardConfig({ moveAnimation: true });
        }).not.toThrow();
        
        expect(() => {
            new ChessboardConfig({ moveAnimation: false });
        }).not.toThrow();
    });
    
    test('should handle boolean snapbackAnimation values', () => {
        expect(() => {
            new ChessboardConfig({ snapbackAnimation: true });
        }).not.toThrow();
        
        expect(() => {
            new ChessboardConfig({ snapbackAnimation: false });
        }).not.toThrow();
    });
    
    test('should handle boolean fadeAnimation values', () => {
        expect(() => {
            new ChessboardConfig({ fadeAnimation: true });
        }).not.toThrow();
        
        expect(() => {
            new ChessboardConfig({ fadeAnimation: false });
        }).not.toThrow();
    });
    
    test('should handle string animation values', () => {
        expect(() => {
            new ChessboardConfig({ 
                moveAnimation: 'ease-in-out',
                snapbackAnimation: 'linear',
                fadeAnimation: 'ease'
            });
        }).not.toThrow();
    });
    
    test('should handle none animation values', () => {
        expect(() => {
            new ChessboardConfig({ 
                moveAnimation: 'none',
                snapbackAnimation: 'none',
                fadeAnimation: 'none'
            });
        }).not.toThrow();
    });
    
    test('should throw error for invalid animation values', () => {
        expect(() => {
            new ChessboardConfig({ moveAnimation: 'invalid-animation' });
        }).toThrow('Invalid transition function');
    });
    
    test('setTransitionFunction should return correct values', () => {
        const config = new ChessboardConfig({});
        
        // Test boolean values
        expect(config.setTransitionFunction(true)).toBe('ease');
        expect(config.setTransitionFunction(false)).toBe(null);
        
        // Test string values
        expect(config.setTransitionFunction('ease')).toBe('ease');
        expect(config.setTransitionFunction('linear')).toBe('linear');
        expect(config.setTransitionFunction('none')).toBe(null);
        
        // Test null/undefined
        expect(config.setTransitionFunction(null)).toBe(null);
        expect(config.setTransitionFunction(undefined)).toBe(null);
    });
});
