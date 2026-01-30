import { default as ChessboardConfig } from './ChessboardConfig.js';
import { ChessboardFactory, chessboardFactory, createChessboard, createChessboardFromTemplate } from './ChessboardFactory.js';
import { default as ChessboardClass } from './Chessboard.js';
/**
 * Refactored Chessboard API - see Chessboard.js for full method docs
 */
export type Chessboard = import('./Chessboard.js').Chessboard;
export default Chessboard;
/**
 * Main Chessboard factory function for backward compatibility
 * Supports both legacy and modern calling conventions
 * @param {string|Object} containerElm - Container element ID or configuration object
 * @param {Object} [config={}] - Configuration options (when first param is string)
 * @returns {ChessboardClass} Chessboard instance
 */
export function Chessboard(containerElm: string | Object, config?: Object): ChessboardClass;
export namespace Chessboard {
    export { createChessboard as create };
    export { createChessboardFromTemplate as fromTemplate };
    export { chessboardFactory as factory };
    export function getInstance(containerId: any): ChessboardClass | null;
    export function destroyInstance(containerId: any): boolean;
    export function destroyAll(): void;
    export function listInstances(): any[];
    export function registerTemplate(name: any, config: any): void;
    export function removeTemplate(name: any): boolean;
    export function getTemplate(name: any): Object | null;
    export function listTemplates(): any[];
    export function getStats(): Object;
    export { ChessboardWrapper as Class };
    export { ChessboardWrapper as Chessboard };
    export { ChessboardConfig as Config };
    export { ChessboardFactory as Factory };
}
/**
 * Wrapper class that handles both calling conventions
 * Provides enhanced error handling and logging
 * @class
 * @extends ChessboardClass
 */
declare class ChessboardWrapper extends ChessboardClass {
    /**
     * Creates a new ChessboardWrapper instance
     * @param {string|Object} containerElm - Container element ID or configuration object
     * @param {Object} [config={}] - Configuration options
     */
    constructor(containerElm: string | Object, config?: Object);
}
export { ChessboardConfig, ChessboardFactory, chessboardFactory, createChessboard, createChessboardFromTemplate };
//# sourceMappingURL=index.d.ts.map