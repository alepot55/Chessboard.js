/**
 * Chessboard factory for creating and managing chessboard instances
 * @module core/ChessboardFactory
 * @since 2.0.0
 */

import { Chessboard } from './Chessboard.js';
import { ChessboardConfig } from './ChessboardConfig.js';
import { ValidationService } from '../services/ValidationService.js';
import { ConfigurationError } from '../errors/ChessboardError.js';
import { logger } from '../utils/logger.js';
import { PerformanceMonitor } from '../utils/performance.js';

/**
 * Factory class for creating and managing chessboard instances
 * Implements the Factory pattern with instance management
 * @class
 */
export class ChessboardFactory {
  /**
     * Creates a new ChessboardFactory instance
     */
  constructor() {
    this.instances = new Map();
    this.validationService = new ValidationService();
    this.performanceMonitor = new PerformanceMonitor();
    this.logger = logger.child('ChessboardFactory');

    // Default configuration templates
    this.templates = new Map();
    this._initializeDefaultTemplates();
  }

  /**
     * Initializes default configuration templates
     * @private
     */
  _initializeDefaultTemplates() {
    // Basic template
    this.templates.set('basic', {
      size: 400,
      draggable: true,
      hints: true,
      clickable: true,
      moveHighlight: true,
      animationStyle: 'simultaneous',
    });

    // Tournament template
    this.templates.set('tournament', {
      size: 500,
      draggable: false,
      hints: false,
      clickable: true,
      moveHighlight: true,
      onlyLegalMoves: true,
      animationStyle: 'sequential',
    });

    // Analysis template
    this.templates.set('analysis', {
      size: 600,
      draggable: true,
      hints: true,
      clickable: true,
      moveHighlight: true,
      mode: 'analysis',
      animationStyle: 'simultaneous',
    });

    // Puzzle template
    this.templates.set('puzzle', {
      size: 450,
      draggable: true,
      hints: true,
      clickable: true,
      moveHighlight: true,
      onlyLegalMoves: true,
      animationStyle: 'sequential',
    });

    // Demo template
    this.templates.set('demo', {
      size: 'auto',
      draggable: false,
      hints: false,
      clickable: false,
      moveHighlight: true,
      animationStyle: 'simultaneous',
    });
  }

  /**
     * Creates a new chessboard instance
     * @param {string} containerId - Container element ID
     * @param {Object} [config={}] - Configuration options
     * @param {string} [template] - Template name to use
     * @returns {Chessboard} Chessboard instance
     * @throws {ConfigurationError} If configuration is invalid
     */
  create(containerId, config = {}, template = null) {
    this.performanceMonitor.startMeasure('chessboard-creation');

    try {
      // Validate container ID
      if (!containerId || typeof containerId !== 'string') {
        throw new ConfigurationError('Container ID must be a non-empty string', 'containerId', containerId);
      }

      // Check if container exists
      const container = document.getElementById(containerId);
      if (!container) {
        throw new ConfigurationError(`Container element not found: ${containerId}`, 'containerId', containerId);
      }

      // Merge configuration with template if specified
      let finalConfig = { ...config };
      if (template) {
        const templateConfig = this.templates.get(template);
        if (!templateConfig) {
          this.logger.warn(`Template "${template}" not found, using default configuration`);
        } else {
          finalConfig = { ...templateConfig, ...config };
          this.logger.info(`Using template "${template}" for chessboard creation`);
        }
      }

      // Set container ID
      finalConfig.id = containerId;

      // Validate configuration
      this.validationService.validateConfig(finalConfig);

      // Create chessboard instance
      const chessboard = new Chessboard(finalConfig);

      // Store instance for management
      this.instances.set(containerId, {
        instance: chessboard,
        config: finalConfig,
        template,
        createdAt: new Date(),
        container,
      });

      this.performanceMonitor.endMeasure('chessboard-creation');
      this.logger.info(`Created chessboard instance for container: ${containerId}`, {
        template,
        configKeys: Object.keys(finalConfig),
      });

      return chessboard;
    } catch (error) {
      this.performanceMonitor.endMeasure('chessboard-creation');
      this.logger.error('Failed to create chessboard instance', { containerId, error });
      throw error;
    }
  }

  /**
     * Creates a chessboard using a predefined template
     * @param {string} containerId - Container element ID
     * @param {string} templateName - Template name
     * @param {Object} [overrides={}] - Configuration overrides
     * @returns {Chessboard} Chessboard instance
     */
  createFromTemplate(containerId, templateName, overrides = {}) {
    return this.create(containerId, overrides, templateName);
  }

  /**
     * Gets an existing chessboard instance
     * @param {string} containerId - Container element ID
     * @returns {Chessboard|null} Chessboard instance or null if not found
     */
  getInstance(containerId) {
    const instance = this.instances.get(containerId);
    return instance ? instance.instance : null;
  }

  /**
     * Gets information about an instance
     * @param {string} containerId - Container element ID
     * @returns {Object|null} Instance information or null if not found
     */
  getInstanceInfo(containerId) {
    const instance = this.instances.get(containerId);
    if (!instance) {
      return null;
    }

    return {
      containerId,
      template: instance.template,
      createdAt: instance.createdAt,
      config: { ...instance.config },
    };
  }

  /**
     * Destroys a chessboard instance
     * @param {string} containerId - Container element ID
     * @returns {boolean} True if instance was destroyed, false if not found
     */
  destroy(containerId) {
    const instance = this.instances.get(containerId);
    if (!instance) {
      this.logger.warn(`Instance not found for destruction: ${containerId}`);
      return false;
    }

    try {
      // Destroy the chessboard instance
      instance.instance.destroy();

      // Remove from instances map
      this.instances.delete(containerId);

      this.logger.info(`Destroyed chessboard instance: ${containerId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to destroy chessboard instance: ${containerId}`, { error });
      return false;
    }
  }

  /**
     * Destroys all chessboard instances
     */
  destroyAll() {
    const containerIds = Array.from(this.instances.keys());
    let destroyed = 0;

    for (const containerId of containerIds) {
      if (this.destroy(containerId)) {
        destroyed++;
      }
    }

    this.logger.info(`Destroyed ${destroyed} chessboard instances`);
  }

  /**
     * Lists all active chessboard instances
     * @returns {Array} Array of instance information
     */
  listInstances() {
    return Array.from(this.instances.keys()).map((containerId) => this.getInstanceInfo(containerId));
  }

  /**
     * Registers a new configuration template
     * @param {string} name - Template name
     * @param {Object} config - Template configuration
     * @throws {ConfigurationError} If template name or config is invalid
     */
  registerTemplate(name, config) {
    if (!name || typeof name !== 'string') {
      throw new ConfigurationError('Template name must be a non-empty string', 'name', name);
    }

    if (!config || typeof config !== 'object') {
      throw new ConfigurationError('Template configuration must be an object', 'config', config);
    }

    // Validate template configuration
    this.validationService.validateConfig(config);

    this.templates.set(name, { ...config });
    this.logger.info(`Registered template: ${name}`, { configKeys: Object.keys(config) });
  }

  /**
     * Removes a configuration template
     * @param {string} name - Template name
     * @returns {boolean} True if template was removed, false if not found
     */
  removeTemplate(name) {
    const removed = this.templates.delete(name);
    if (removed) {
      this.logger.info(`Removed template: ${name}`);
    }
    return removed;
  }

  /**
     * Gets a configuration template
     * @param {string} name - Template name
     * @returns {Object|null} Template configuration or null if not found
     */
  getTemplate(name) {
    const template = this.templates.get(name);
    return template ? { ...template } : null;
  }

  /**
     * Lists all available templates
     * @returns {Array} Array of template names
     */
  listTemplates() {
    return Array.from(this.templates.keys());
  }

  /**
     * Creates multiple chessboard instances from a configuration array
     * @param {Array} configurations - Array of configuration objects
     * @returns {Array} Array of created chessboard instances
     */
  createMultiple(configurations) {
    const instances = [];
    const errors = [];

    for (const config of configurations) {
      try {
        const { containerId, template, ...options } = config;
        const instance = this.create(containerId, options, template);
        instances.push({ containerId, instance, success: true });
      } catch (error) {
        errors.push({ containerId: config.containerId, error, success: false });
        this.logger.error(`Failed to create instance for ${config.containerId}`, { error });
      }
    }

    if (errors.length > 0) {
      this.logger.warn(`Failed to create ${errors.length} out of ${configurations.length} instances`);
    }

    return { instances, errors };
  }

  /**
     * Gets factory statistics
     * @returns {Object} Factory statistics
     */
  getStats() {
    const stats = {
      activeInstances: this.instances.size,
      availableTemplates: this.templates.size,
      performance: this.performanceMonitor.getMetrics(),
      validation: this.validationService.getCacheStats(),
    };

    return stats;
  }

  /**
     * Cleans up factory resources
     */
  destroy() {
    this.destroyAll();
    this.validationService.destroy();
    this.performanceMonitor.destroy();
    this.templates.clear();
  }
}

/**
 * Default factory instance
 * @type {ChessboardFactory}
 */
export const chessboardFactory = new ChessboardFactory();

/**
 * Convenience method to create a chessboard instance
 * @param {string} containerId - Container element ID
 * @param {Object} [config={}] - Configuration options
 * @param {string} [template] - Template name to use
 * @returns {Chessboard} Chessboard instance
 */
export function createChessboard(containerId, config = {}, template = null) {
  return chessboardFactory.create(containerId, config, template);
}

/**
 * Convenience method to create a chessboard from template
 * @param {string} containerId - Container element ID
 * @param {string} templateName - Template name
 * @param {Object} [overrides={}] - Configuration overrides
 * @returns {Chessboard} Chessboard instance
 */
export function createChessboardFromTemplate(containerId, templateName, overrides = {}) {
  return chessboardFactory.createFromTemplate(containerId, templateName, overrides);
}
