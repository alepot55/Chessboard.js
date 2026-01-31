/**
 * Chessboard.js - A beautiful, customizable chessboard widget
 * Main entry point for the library
 *
 * @version 3.2.0
 * @author alepot55
 * @license ISC
 */

// Styles - bundled into chessboard.css
import './styles/index.css';

// Core components
export {
  Chessboard,
  ChessboardConfig,
  ChessboardFactory,
  chessboardFactory,
  createChessboard,
  createChessboardFromTemplate,
} from './core/index.js';

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
  ValidationService,
} from './services/index.js';

// Constants exports
export * from './constants/index.js';

// Error handling exports
export {
  ChessboardError,
  ValidationError,
  ConfigurationError,
  MoveError,
  DOMError,
  PieceError,
} from './errors/index.js';

// Utility exports
export { Chess, validateFen } from './utils/chess.js';
export {
  PerformanceMonitor,
  throttle,
  debounce,
  rafThrottle,
  setTransform,
  resetTransform,
  batchDOMOperations,
  isElementVisible,
  getMemoryUsage,
} from './utils/performance.js';
export * from './utils/coordinates.js';
export {
  isValidPiece,
  isValidPosition,
  validateFenFormat,
  validateMove,
  validateConfig,
  batchValidate,
  clearValidationCache,
  getValidationCacheStats,
} from './utils/validation.js';
export * from './utils/animations.js';

// Logging system exports
export { Logger, logger, createLogger, LOG_LEVELS } from './utils/logger.js';

// Game modes exports
export { BaseMode, ModeManager, CreativeMode, PvPMode, VsBotMode } from './modes/index.js';

// AI exports
export { ChessAI } from './ai/index.js';

// Engine integration exports
export {
  BaseEngine,
  StockfishEngine,
  UCIEngine,
  CloudEngine,
  EngineManager,
} from './engines/index.js';

// Default export for IIFE compatibility
import { Chessboard as ChessboardClass } from './core/index.js';
export default ChessboardClass;

// Version information
export const version = '3.2.0';
export const build = 'dev';
export const buildDate = new Date().toISOString();

// Library information
export const info = {
  name: 'Chessboard.js',
  version,
  build,
  buildDate,
  author: 'alepot55',
  license: 'ISC',
  repository: 'https://github.com/alepot55/Chessboardjs',
  homepage: 'https://chessboardjs.com',
};
