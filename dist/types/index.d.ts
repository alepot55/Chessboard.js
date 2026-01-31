import { Chessboard as ChessboardClass } from './core/index.js';
export { default as Square } from './components/Square.js';
export { default as Piece } from './components/Piece.js';
export { default as Move } from './components/Move.js';
export * from './constants/index.js';
export * from './utils/coordinates.js';
export * from './utils/animations.js';
export { ChessAI } from './ai/index.js';
export default ChessboardClass;
export const version: "3.2.0";
export const build: "dev";
export const buildDate: string;
export namespace info {
    export let name: string;
    export { version };
    export { build };
    export { buildDate };
    export let author: string;
    export let license: string;
    export let repository: string;
    export let homepage: string;
}
export { Chessboard, ChessboardConfig, ChessboardFactory, chessboardFactory, createChessboard, createChessboardFromTemplate } from './core/index.js';
export { AnimationService, BoardService, CoordinateService, EventService, MoveService, PieceService, PositionService, ValidationService } from './services/index.js';
export { ChessboardError, ValidationError, ConfigurationError, MoveError, DOMError, PieceError } from './errors/index.js';
export { Chess, validateFen } from './utils/chess.js';
export { PerformanceMonitor, throttle, debounce, rafThrottle, setTransform, resetTransform, batchDOMOperations, isElementVisible, getMemoryUsage } from './utils/performance.js';
export { isValidPiece, isValidPosition, validateFenFormat, validateMove, validateConfig, batchValidate, clearValidationCache, getValidationCacheStats } from './utils/validation.js';
export { Logger, logger, createLogger, LOG_LEVELS } from './utils/logger.js';
export { BaseMode, ModeManager, CreativeMode, PvPMode, VsBotMode } from './modes/index.js';
export { BaseEngine, StockfishEngine, UCIEngine, CloudEngine, EngineManager } from './engines/index.js';
//# sourceMappingURL=index.d.ts.map