/**
 * Chess Engine Integration Module
 * @module engines
 * @since 3.1.0
 *
 * Provides unified interface to connect to various chess engines:
 * - Stockfish.js (browser-based WebAssembly)
 * - UCI Protocol (external engines via WebSocket/HTTP)
 * - Cloud APIs (Lichess, Chess.com analysis)
 *
 * @example
 * import { EngineManager, StockfishEngine } from '@alepot55/chessboardjs';
 *
 * // Use EngineManager for easy setup
 * const manager = new EngineManager(chessboard);
 * await manager.loadEngine('stockfish');
 * const bestMove = await manager.getBestMove();
 *
 * // Or use engines directly
 * const stockfish = new StockfishEngine({ depth: 20 });
 * await stockfish.init();
 * const analysis = await stockfish.analyze(fen);
 */

// Base class
import { BaseEngine } from './BaseEngine.js';

// Engine implementations
import { StockfishEngine } from './StockfishEngine.js';
import { UCIEngine } from './UCIEngine.js';
import { CloudEngine } from './CloudEngine.js';

// Engine manager
import { EngineManager } from './EngineManager.js';

// Named exports
export { BaseEngine, StockfishEngine, UCIEngine, CloudEngine, EngineManager };

// Default export for convenience
export default {
  BaseEngine,
  StockfishEngine,
  UCIEngine,
  CloudEngine,
  EngineManager,
};
