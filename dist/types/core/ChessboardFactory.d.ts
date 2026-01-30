import { Chessboard } from './Chessboard.js';
import { ValidationService } from '../services/ValidationService.js';
import { PerformanceMonitor } from '../utils/performance.js';
/**
 * Convenience method to create a chessboard instance
 * @param {string} containerId - Container element ID
 * @param {Object} [config={}] - Configuration options
 * @param {string} [template] - Template name to use
 * @returns {Chessboard} Chessboard instance
 */
export function createChessboard(containerId: string, config?: Object, template?: string): Chessboard;
/**
 * Convenience method to create a chessboard from template
 * @param {string} containerId - Container element ID
 * @param {string} templateName - Template name
 * @param {Object} [overrides={}] - Configuration overrides
 * @returns {Chessboard} Chessboard instance
 */
export function createChessboardFromTemplate(containerId: string, templateName: string, overrides?: Object): Chessboard;
/**
 * Factory class for creating and managing chessboard instances
 * Implements the Factory pattern with instance management
 * @class
 */
export class ChessboardFactory {
    instances: Map<any, any>;
    validationService: ValidationService;
    performanceMonitor: PerformanceMonitor;
    logger: import('../index.js').Logger;
    templates: Map<any, any>;
    /**
     * Initializes default configuration templates
     * @private
     */
    private _initializeDefaultTemplates;
    /**
     * Creates a new chessboard instance
     * @param {string} containerId - Container element ID
     * @param {Object} [config={}] - Configuration options
     * @param {string} [template] - Template name to use
     * @returns {Chessboard} Chessboard instance
     * @throws {ConfigurationError} If configuration is invalid
     */
    create(containerId: string, config?: Object, template?: string): Chessboard;
    /**
     * Creates a chessboard using a predefined template
     * @param {string} containerId - Container element ID
     * @param {string} templateName - Template name
     * @param {Object} [overrides={}] - Configuration overrides
     * @returns {Chessboard} Chessboard instance
     */
    createFromTemplate(containerId: string, templateName: string, overrides?: Object): Chessboard;
    /**
     * Gets an existing chessboard instance
     * @param {string} containerId - Container element ID
     * @returns {Chessboard|null} Chessboard instance or null if not found
     */
    getInstance(containerId: string): Chessboard | null;
    /**
     * Gets information about an instance
     * @param {string} containerId - Container element ID
     * @returns {Object|null} Instance information or null if not found
     */
    getInstanceInfo(containerId: string): Object | null;
    /**
     * Destroys a chessboard instance
     * @param {string} containerId - Container element ID
     * @returns {boolean} True if instance was destroyed, false if not found
     */
    destroy(containerId: string): boolean;
    /**
     * Destroys all chessboard instances
     */
    destroyAll(): void;
    /**
     * Lists all active chessboard instances
     * @returns {Array} Array of instance information
     */
    listInstances(): any[];
    /**
     * Registers a new configuration template
     * @param {string} name - Template name
     * @param {Object} config - Template configuration
     * @throws {ConfigurationError} If template name or config is invalid
     */
    registerTemplate(name: string, config: Object): void;
    /**
     * Removes a configuration template
     * @param {string} name - Template name
     * @returns {boolean} True if template was removed, false if not found
     */
    removeTemplate(name: string): boolean;
    /**
     * Gets a configuration template
     * @param {string} name - Template name
     * @returns {Object|null} Template configuration or null if not found
     */
    getTemplate(name: string): Object | null;
    /**
     * Lists all available templates
     * @returns {Array} Array of template names
     */
    listTemplates(): any[];
    /**
     * Creates multiple chessboard instances from a configuration array
     * @param {Array} configurations - Array of configuration objects
     * @returns {Array} Array of created chessboard instances
     */
    createMultiple(configurations: any[]): any[];
    /**
     * Gets factory statistics
     * @returns {Object} Factory statistics
     */
    getStats(): Object;
    /**
     * Cleans up factory resources
     */
    cleanup(): void;
}
/**
 * Default factory instance
 * @type {ChessboardFactory}
 */
export const chessboardFactory: ChessboardFactory;
//# sourceMappingURL=ChessboardFactory.d.ts.map