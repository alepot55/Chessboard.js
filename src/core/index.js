/**
 * Chessboard.js - A beautiful, customizable chessboard widget
 * Entry point for the core library
 * @module core
 * @since 2.0.0
 */

import ChessboardClass from './Chessboard.js';
import ChessboardConfig from './ChessboardConfig.js';
import {
  ChessboardFactory,
  chessboardFactory,
  createChessboard,
  createChessboardFromTemplate,
} from './ChessboardFactory.js';
import { logger } from '../utils/logger.js';

/**
 * Main Chessboard factory function for backward compatibility
 * Supports both legacy and modern calling conventions
 * @param {string|Object} containerElm - Container element ID or configuration object
 * @param {Object} [config={}] - Configuration options (when first param is string)
 * @returns {ChessboardClass} Chessboard instance
 */
function Chessboard(containerElm, config = {}) {
  const factoryLogger = logger.child('ChessboardFactory');

  try {
    // If first parameter is an object, treat it as config
    if (typeof containerElm === 'object' && containerElm !== null) {
      factoryLogger.debug('Creating chessboard with config object');
      return new ChessboardClass(containerElm);
    }

    // Otherwise, treat first parameter as element ID
    if (typeof containerElm === 'string') {
      factoryLogger.debug('Creating chessboard with element ID', { elementId: containerElm });
      const fullConfig = { ...config, id: containerElm };
      return new ChessboardClass(fullConfig);
    }

    throw new Error('Invalid parameters: first parameter must be string or object');
  } catch (error) {
    factoryLogger.error('Failed to create chessboard instance', { error });
    throw error;
  }
}

/**
 * Wrapper class that handles both calling conventions
 * Provides enhanced error handling and logging
 * @class
 * @extends ChessboardClass
 */
class ChessboardWrapper extends ChessboardClass {
  /**
     * Creates a new ChessboardWrapper instance
     * @param {string|Object} containerElm - Container element ID or configuration object
     * @param {Object} [config={}] - Configuration options
     */
  constructor(containerElm, config = {}) {
    const instanceLogger = logger.child('ChessboardWrapper');

    try {
      // If first parameter is an object, treat it as config
      if (typeof containerElm === 'object' && containerElm !== null) {
        instanceLogger.debug('Initializing with config object');
        super(containerElm);
      } else if (typeof containerElm === 'string') {
        // Otherwise, treat first parameter as element ID
        instanceLogger.debug('Initializing with element ID', { elementId: containerElm });
        const fullConfig = { ...config, id: containerElm };
        super(fullConfig);
      } else {
        throw new Error('Invalid constructor parameters');
      }
    } catch (error) {
      instanceLogger.error('Failed to initialize ChessboardWrapper', { error });
      throw error;
    }
  }
}

/**
 * Refactored Chessboard API - see Chessboard.js for full method docs
 * @typedef {import('./Chessboard.js').Chessboard} Chessboard
 */

// --- STATIC/FACTORY METHODS ---
/**
 * Create a new Chessboard instance
 * @param {string|Object} containerElm
 * @param {Object} [config]
 * @returns {Chessboard}
 */
Chessboard.create = createChessboard;
/**
 * Create a Chessboard from a template
 * @param {string|Object} containerElm
 * @param {string} templateName
 * @param {Object} [config]
 * @returns {Chessboard}
 */
Chessboard.fromTemplate = createChessboardFromTemplate;
Chessboard.factory = chessboardFactory;

// --- INSTANCE MANAGEMENT ---
Chessboard.getInstance = (containerId) => chessboardFactory.getInstance(containerId);
Chessboard.destroyInstance = (containerId) => chessboardFactory.destroy(containerId);
Chessboard.destroyAll = () => chessboardFactory.destroyAll();
Chessboard.listInstances = () => chessboardFactory.listInstances();

// --- TEMPLATE MANAGEMENT ---
Chessboard.registerTemplate = (name, config) => chessboardFactory.registerTemplate(name, config);
Chessboard.removeTemplate = (name) => chessboardFactory.removeTemplate(name);
Chessboard.getTemplate = (name) => chessboardFactory.getTemplate(name);
Chessboard.listTemplates = () => chessboardFactory.listTemplates();

// --- STATS & DEBUG ---
Chessboard.getStats = () => chessboardFactory.getStats();

// --- DEPRECATED/LEGACY ALIASES ---
/**
 * @deprecated Use Chessboard.create instead
 */
Chessboard.Class = ChessboardWrapper;
Chessboard.Chessboard = ChessboardWrapper;
Chessboard.Config = ChessboardConfig;
Chessboard.Factory = ChessboardFactory;

// --- EXPORTS ---
export {
  Chessboard,
  ChessboardConfig,
  ChessboardFactory,
  chessboardFactory,
  createChessboard,
  createChessboardFromTemplate,
};

export default Chessboard;
