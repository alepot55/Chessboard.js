/**
 * Chessboard.js - A beautiful, customizable chessboard widget
 * Main entry point for the library
 * 
 * @version 2.2.1
 * @author alepot55
 * @license ISC
 */

// Core components
export { Chessboard, ChessboardConfig } from './core/index.js';

// Component exports
export { default as Square } from './components/Square.js';
export { default as Piece } from './components/Piece.js';
export { default as Move } from './components/Move.js';

// Service exports for advanced usage
export { 
    AnimationService,
    BoardService,
    CoordinateService,
    EventService,
    MoveService,
    PieceService,
    PositionService,
    ValidationService
} from './services/index.js';

// Constants exports
export * from './constants/index.js';

// Error handling exports
export { ChessboardError, ValidationError } from './errors/index.js';

// Utility exports
export { Chess, validateFen } from './utils/chess.js';
export * from './utils/performance.js';
export * from './utils/coordinates.js';
export * from './utils/validation.js';
export * from './utils/animations.js';

// Default export for IIFE compatibility
import { Chessboard as ChessboardClass } from './core/index.js';
export default ChessboardClass;
