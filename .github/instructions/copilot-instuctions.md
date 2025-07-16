---
applyTo: "**/Chessboardjs/**"
---

# 🏗️ Chessboard.js - Guida Completa per Ingegneri Esperti

## 📋 Panoramica del Progetto

**Chessboard.js** è un pacchetto NPM di livello enterprise per scacchiere interattive in JavaScript vanilla, progettato per massime performance, modularità e manutenibilità. Il progetto implementa pattern architetturali moderni e segue rigorosamente tutte le best practices dell'industria.

### 🎯 Principi Architetturali

- **Separation of Concerns**: Architettura modulare con responsabilità ben definite
- **SOLID Principles**: Applicazione rigorosa dei principi di design object-oriented
- **Clean Architecture**: Dipendenze invertite e layer ben separati
- **DDD Patterns**: Domain-driven design per la logica di business
- **Performance First**: Ottimizzazioni per rendering e interazioni in tempo reale

---

## 🏛️ Architettura del Sistema

### Core Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Components    │ │   Event System  │ │   UI Adapters   ││
│  │   - Square.js   │ │   - Observers   │ │   - Themes      ││
│  │   - Piece.js    │ │   - Handlers    │ │   - Animations  ││
│  │   - Move.js     │ │   - Dispatchers │ │   - Renderers   ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Use Cases     │ │   Controllers   │ │   Services      ││
│  │   - Move Logic  │ │   - Game Ctrl   │ │   - Asset Mgmt  ││
│  │   - Validation  │ │   - UI Ctrl     │ │   - Theme Svc   ││
│  │   - Animation   │ │   - Event Ctrl  │ │   - Config Svc  ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Domain Layer                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Entities      │ │   Value Objects │ │   Domain Svc    ││
│  │   - Chessboard  │ │   - Position    │ │   - Move Engine ││
│  │   - Game State  │ │   - Coordinates │ │   - Rules Eng   ││
│  │   - Config      │ │   - Square      │ │   - Validators  ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Utilities     │ │   External Deps │ │   Platform      ││
│  │   - DOM Utils   │ │   - Chess.js    │ │   - Browser API ││
│  │   - Math Utils  │ │   - Animations  │ │   - Web Workers ││
│  │   - Performance │ │   - Asset Load  │ │   - Storage     ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 📁 Struttura Directory Ottimizzata

```
Chessboardjs/
├── 📁 src/                              # Codice sorgente principale
│   ├── 📁 core/                         # Layer del dominio
│   │   ├── 📄 Chessboard.js            # Entity principale
│   │   ├── 📄 ChessboardConfig.js      # Configuration management
│   │   ├── 📄 GameState.js             # State management
│   │   └── 📄 index.js                 # Core exports
│   ├── 📁 components/                   # UI Components (Presentation)
│   │   ├── 📄 Square.js                # Square component
│   │   ├── 📄 Piece.js                 # Piece component
│   │   ├── 📄 Move.js                  # Move component
│   │   ├── 📄 Board.js                 # Board container
│   │   └── 📄 index.js                 # Components barrel
│   ├── 📁 services/                     # Application Services
│   │   ├── 📄 AssetService.js          # Asset loading/caching
│   │   ├── 📄 ThemeService.js          # Theme management
│   │   ├── 📄 AnimationService.js      # Animation orchestration
│   │   ├── 📄 EventService.js          # Event management
│   │   └── 📄 ValidationService.js     # Input validation
│   ├── 📁 controllers/                  # Application Controllers
│   │   ├── 📄 GameController.js        # Game logic control
│   │   ├── 📄 UIController.js          # UI state control
│   │   └── 📄 EventController.js       # Event coordination
│   ├── 📁 domain/                       # Domain Logic
│   │   ├── 📄 MoveEngine.js            # Move calculation
│   │   ├── 📄 RulesEngine.js           # Chess rules
│   │   ├── 📄 PositionValidator.js     # Position validation
│   │   └── 📄 GameRules.js             # Game rule definitions
│   ├── 📁 value-objects/                # Value Objects
│   │   ├── 📄 Position.js              # Board position
│   │   ├── 📄 Coordinates.js           # Square coordinates
│   │   ├── 📄 Move.js                  # Move representation
│   │   └── 📄 Color.js                 # Color value object
│   ├── 📁 utils/                        # Infrastructure Utilities
│   │   ├── 📄 dom.js                   # DOM manipulation
│   │   ├── 📄 animations.js            # Animation helpers
│   │   ├── 📄 coordinates.js           # Coordinate calculations
│   │   ├── 📄 performance.js           # Performance monitoring
│   │   ├── 📄 validation.js            # Input validation
│   │   ├── 📄 debounce.js              # Debouncing utilities
│   │   └── 📄 logger.js                # Logging system
│   ├── 📁 styles/                       # CSS Modules
│   │   ├── 📄 index.css                # Main stylesheet
│   │   ├── 📄 board.css                # Board styling
│   │   ├── 📄 pieces.css               # Piece styling
│   │   ├── 📄 animations.css           # Animation definitions
│   │   ├── 📄 themes.css               # Theme variables
│   │   └── 📄 responsive.css           # Responsive design
│   ├── 📁 types/                        # Type definitions
│   │   ├── 📄 index.d.ts               # Main type exports
│   │   ├── 📄 chessboard.d.ts          # Chessboard types
│   │   ├── 📄 config.d.ts              # Configuration types
│   │   └── 📄 events.d.ts              # Event types
│   └── 📄 index.js                      # Main entry point
├── 📁 assets/                           # Static Assets
│   ├── 📁 themes/                       # Tema collections
│   │   ├── 📁 default/                  # Default theme
│   │   │   ├── 📄 theme.json           # Theme metadata
│   │   │   └── 📁 pieces/              # Piece assets
│   │   ├── 📁 alepot/                   # Custom theme
│   │   └── 📁 [theme-name]/            # Additional themes
│   ├── 📁 pieces/                       # Universal piece sets
│   │   ├── 📁 svg/                      # SVG pieces (preferred)
│   │   ├── 📁 png/                      # PNG fallbacks
│   │   └── 📁 webp/                     # WebP optimized
│   └── 📁 sounds/                       # Audio assets
├── 📁 dist/                             # Build Output
│   ├── 📄 chessboard.esm.js            # ES Modules
│   ├── 📄 chessboard.cjs.js            # CommonJS
│   ├── 📄 chessboard.umd.js            # UMD
│   ├── 📄 chessboard.iife.js           # IIFE (browsers)
│   ├── 📄 chessboard.min.js            # Minified version
│   ├── 📄 chessboard.css               # Compiled CSS
│   └── 📁 types/                        # TypeScript declarations
├── 📁 tests/                            # Test Suites
│   ├── 📁 unit/                         # Unit tests
│   │   ├── 📁 core/                     # Core logic tests
│   │   ├── 📁 components/               # Component tests
│   │   ├── 📁 services/                 # Service tests
│   │   └── 📁 utils/                    # Utility tests
│   ├── 📁 integration/                  # Integration tests
│   │   ├── 📄 game-flow.test.js        # Game flow tests
│   │   ├── 📄 ui-interaction.test.js   # UI interaction tests
│   │   └── 📄 api-integration.test.js  # API integration tests
│   ├── 📁 e2e/                          # End-to-end tests
│   │   ├── 📄 user-scenarios.test.js   # User journey tests
│   │   ├── 📄 performance.test.js      # Performance tests
│   │   └── 📄 accessibility.test.js    # A11y tests
│   ├── 📁 fixtures/                     # Test data
│   │   ├── 📄 positions.json           # Sample positions
│   │   ├── 📄 games.pgn                # Sample games
│   │   └── 📄 configs.json             # Test configurations
│   └── 📁 helpers/                      # Test utilities
├── 📁 docs/                             # Documentation
│   ├── 📄 README.md                     # Project overview
│   ├── 📄 API.md                        # Complete API reference
│   ├── 📄 ARCHITECTURE.md               # Architecture guide
│   ├── 📄 CONTRIBUTING.md               # Contribution guidelines
│   ├── 📄 PERFORMANCE.md                # Performance guide
│   ├── 📁 api/                          # Generated API docs
│   ├── 📁 examples/                     # Usage examples
│   │   ├── 📄 basic-usage.html         # Basic setup
│   │   ├── 📄 advanced-config.html     # Advanced configuration
│   │   ├── 📄 custom-themes.html       # Custom theming
│   │   ├── 📄 game-integration.html    # Chess.js integration
│   │   └── 📄 performance-demo.html    # Performance showcase
│   └── 📁 guides/                       # Development guides
│       ├── 📄 getting-started.md       # Quick start guide
│       ├── 📄 customization.md         # Customization guide
│       ├── 📄 theming.md               # Theming guide
│       ├── 📄 performance.md           # Performance optimization
│       └── 📄 troubleshooting.md       # Common issues
├── 📁 tools/                            # Development Tools
│   ├── 📄 build.js                     # Build orchestration
│   ├── 📄 dev-server.js                # Development server
│   ├── 📄 theme-validator.js           # Theme validation
│   ├── 📄 performance-monitor.js       # Performance monitoring
│   └── 📄 asset-optimizer.js           # Asset optimization
├── 📁 config/                           # Configuration Files
│   ├── 📄 rollup.config.js             # Rollup configuration
│   ├── 📄 jest.config.js               # Jest configuration
│   ├── 📄 eslint.config.js             # ESLint rules
│   ├── 📄 prettier.config.js           # Prettier formatting
│   ├── 📄 babel.config.js              # Babel configuration
│   └── 📄 typescript.config.json       # TypeScript configuration
├── 📁 benchmarks/                       # Performance Benchmarks
│   ├── 📄 rendering-bench.js           # Rendering performance
│   ├── 📄 animation-bench.js           # Animation performance
│   └── 📄 memory-bench.js              # Memory usage tests
└── 📁 scripts/                          # Automation Scripts
    ├── 📄 release.js                    # Release automation
    ├── 📄 version-bump.js               # Version management
    ├── 📄 changelog-gen.js              # Changelog generation
    └── 📄 deploy.js                     # Deployment automation
```

---

## 🔧 Configurazione Ambiente di Sviluppo

### Prerequisiti Tecnici

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead",
    "not ie 11"
  ]
}
```

### Dipendenze di Sviluppo Raccomandate

```json
{
  "devDependencies": {
    // Build & Bundling
    "rollup": "^4.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^25.0.0",
    "@rollup/plugin-terser": "^0.4.0",
    "@rollup/plugin-babel": "^6.0.0",
    "rollup-plugin-postcss": "^4.0.0",
    "rollup-plugin-analyzer": "^4.0.0",
    
    // TypeScript Support
    "typescript": "^5.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "tslib": "^2.5.0",
    
    // Testing Framework
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/dom": "^9.0.0",
    "jest-performance": "^1.0.0",
    
    // E2E Testing
    "playwright": "^1.40.0",
    "@playwright/test": "^1.40.0",
    
    // Code Quality
    "eslint": "^8.50.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-import": "^2.28.0",
    "eslint-plugin-jest": "^27.0.0",
    "prettier": "^3.0.0",
    
    // CSS Processing
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "cssnano": "^6.0.0",
    "postcss-custom-properties": "^13.0.0",
    
    // Documentation
    "jsdoc": "^4.0.0",
    "typedoc": "^0.25.0",
    "docsify-cli": "^4.4.0",
    
    // Performance & Monitoring
    "lighthouse": "^11.0.0",
    "bundlesize": "^0.18.0",
    "size-limit": "^9.0.0",
    
    // Automation
    "husky": "^8.0.0",
    "lint-staged": "^14.0.0",
    "commitizen": "^4.3.0",
    "semantic-release": "^21.0.0"
  }
}
```

### Script NPM Ottimizzati

```json
{
  "scripts": {
    // Development
    "dev": "rollup -c config/rollup.config.js --watch --environment NODE_ENV:development",
    "dev:debug": "rollup -c config/rollup.config.js --watch --environment NODE_ENV:development,DEBUG:true",
    "dev:server": "node tools/dev-server.js",
    
    // Building
    "build": "npm run clean && npm run build:lib && npm run build:types && npm run build:css",
    "build:lib": "rollup -c config/rollup.config.js --environment NODE_ENV:production",
    "build:types": "tsc --emitDeclarationOnly",
    "build:css": "postcss src/styles/index.css -o dist/chessboard.css",
    "build:analyze": "npm run build && rollup-plugin-analyzer",
    
    // Testing
    "test": "jest --config config/jest.config.js",
    "test:watch": "jest --config config/jest.config.js --watch",
    "test:coverage": "jest --config config/jest.config.js --coverage",
    "test:unit": "jest --config config/jest.config.js tests/unit",
    "test:integration": "jest --config config/jest.config.js tests/integration",
    "test:e2e": "playwright test",
    "test:performance": "node benchmarks/performance-suite.js",
    
    // Code Quality
    "lint": "eslint src/ tests/ --ext .js,.ts",
    "lint:fix": "eslint src/ tests/ --ext .js,.ts --fix",
    "format": "prettier --write \"src/**/*.{js,ts,css}\" \"tests/**/*.{js,ts}\"",
    "typecheck": "tsc --noEmit",
    
    // Documentation
    "docs:build": "jsdoc src/ -c config/jsdoc.config.json -d docs/api",
    "docs:serve": "docsify serve docs",
    "docs:types": "typedoc src/ --out docs/types",
    
    // Quality Assurance
    "validate": "npm run lint && npm run typecheck && npm run test",
    "validate:ci": "npm run validate && npm run build && npm run test:e2e",
    "size-check": "size-limit",
    "perf-audit": "lighthouse --config-path=config/lighthouse.config.js",
    
    // Maintenance
    "clean": "rimraf dist/ coverage/ .nyc_output/",
    "clean:all": "npm run clean && rimraf node_modules/ package-lock.json",
    "deps:check": "ncu --interactive --format group",
    "deps:update": "ncu -u && npm install",
    
    // Release
    "version:patch": "npm version patch",
    "version:minor": "npm version minor", 
    "version:major": "npm version major",
    "prepublishOnly": "npm run validate:ci",
    "release": "semantic-release",
    
    // Git Hooks
    "prepare": "husky install",
    "pre-commit": "lint-staged",
    "commit": "git-cz"
  }
}
```

---

## 🏗️ Patterns Architetturali Implementati

### 1. Observer Pattern per Eventi

```javascript
// src/services/EventService.js
export class EventService {
    constructor() {
        this.observers = new Map();
        this.eventQueue = [];
        this.isProcessing = false;
    }
    
    subscribe(eventType, callback, priority = 0) {
        if (!this.observers.has(eventType)) {
            this.observers.set(eventType, []);
        }
        
        const observer = { callback, priority, id: crypto.randomUUID() };
        this.observers.get(eventType).push(observer);
        
        // Sort by priority (higher first)
        this.observers.get(eventType).sort((a, b) => b.priority - a.priority);
        
        return observer.id;
    }
    
    async emit(eventType, data) {
        const event = {
            type: eventType,
            data,
            timestamp: Date.now(),
            id: crypto.randomUUID()
        };
        
        this.eventQueue.push(event);
        
        if (!this.isProcessing) {
            await this.processQueue();
        }
    }
    
    async processQueue() {
        this.isProcessing = true;
        
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            await this.processEvent(event);
        }
        
        this.isProcessing = false;
    }
}
```

### 2. Strategy Pattern per Animazioni

```javascript
// src/services/AnimationService.js
export class AnimationService {
    constructor() {
        this.strategies = new Map();
        this.activeAnimations = new Map();
        this.setupDefaultStrategies();
    }
    
    setupDefaultStrategies() {
        this.registerStrategy('ease', new EaseAnimationStrategy());
        this.registerStrategy('linear', new LinearAnimationStrategy());
        this.registerStrategy('bounce', new BounceAnimationStrategy());
        this.registerStrategy('elastic', new ElasticAnimationStrategy());
    }
    
    registerStrategy(name, strategy) {
        this.strategies.set(name, strategy);
    }
    
    async animate(element, properties, options = {}) {
        const strategy = this.strategies.get(options.easing || 'ease');
        
        if (!strategy) {
            throw new Error(`Animation strategy '${options.easing}' not found`);
        }
        
        const animation = await strategy.animate(element, properties, options);
        this.activeAnimations.set(animation.id, animation);
        
        animation.finished.then(() => {
            this.activeAnimations.delete(animation.id);
        });
        
        return animation;
    }
}
```

### 3. Factory Pattern per Componenti

```javascript
// src/components/ComponentFactory.js
export class ComponentFactory {
    constructor(services) {
        this.services = services;
        this.componentRegistry = new Map();
        this.registerDefaults();
    }
    
    registerDefaults() {
        this.register('square', SquareComponent);
        this.register('piece', PieceComponent);
        this.register('move', MoveComponent);
        this.register('board', BoardComponent);
    }
    
    register(type, ComponentClass) {
        this.componentRegistry.set(type, ComponentClass);
    }
    
    create(type, config = {}) {
        const ComponentClass = this.componentRegistry.get(type);
        
        if (!ComponentClass) {
            throw new Error(`Component type '${type}' not registered`);
        }
        
        return new ComponentClass({
            ...config,
            services: this.services
        });
    }
    
    createBoard(config) {
        const board = this.create('board', config);
        
        // Create 64 squares
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const square = this.create('square', {
                    rank,
                    file,
                    color: (rank + file) % 2 === 0 ? 'light' : 'dark'
                });
                board.addSquare(square);
            }
        }
        
        return board;
    }
}
```

### 4. Command Pattern per Azioni

```javascript
// src/domain/commands/MoveCommand.js
export class MoveCommand {
    constructor(from, to, piece, capturedPiece = null) {
        this.from = from;
        this.to = to;
        this.piece = piece;
        this.capturedPiece = capturedPiece;
        this.timestamp = Date.now();
        this.id = crypto.randomUUID();
    }
    
    execute(board) {
        // Store previous state for undo
        this.previousState = board.getState();
        
        // Execute the move
        board.movePiece(this.from, this.to);
        
        if (this.capturedPiece) {
            board.removePiece(this.to);
        }
        
        // Emit move event
        board.emit('move', {
            command: this,
            from: this.from,
            to: this.to,
            piece: this.piece
        });
    }
    
    undo(board) {
        if (!this.previousState) {
            throw new Error('Cannot undo command that was never executed');
        }
        
        board.setState(this.previousState);
        
        board.emit('move-undone', {
            command: this,
            restoredState: this.previousState
        });
    }
    
    canExecute(board) {
        return board.isValidMove(this.from, this.to);
    }
}
```

---

## 🎯 Best Practices di Sviluppo

### Convenzioni di Codice

#### 1. Naming Conventions

```javascript
// Classes: PascalCase
class ChessboardController { }
class MoveValidationService { }

// Methods e Variables: camelCase
const currentPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
function validateMoveInput(from, to) { }

// Constants: UPPER_SNAKE_CASE
const DEFAULT_ANIMATION_DURATION = 200;
const PIECE_TYPES = ['p', 'r', 'n', 'b', 'q', 'k'];

// Private methods: underscore prefix
class Chessboard {
    _initializeBoard() { }
    _setupEventListeners() { }
}

// Files: PascalCase for classes, camelCase for utilities
// ChessboardController.js
// animationHelpers.js
```

#### 2. Struttura Metodi

```javascript
class ComponentBase {
    /**
     * Public method template
     */
    async publicMethod(param1, param2, options = {}) {
        // 1. Input validation
        this._validateInputs(param1, param2, options);
        
        // 2. Pre-processing
        const normalizedOptions = this._normalizeOptions(options);
        
        try {
            // 3. Core logic
            const result = await this._executeOperation(param1, param2, normalizedOptions);
            
            // 4. Post-processing
            return this._formatResult(result);
            
        } catch (error) {
            // 5. Error handling
            this._handleError(error, { param1, param2, options });
            throw error;
        }
    }
    
    /**
     * Private validation method
     */
    _validateInputs(param1, param2, options) {
        if (!param1) {
            throw new ValidationError('param1 is required');
        }
        
        if (typeof param2 !== 'string') {
            throw new ValidationError('param2 must be a string');
        }
    }
}
```

#### 3. Error Handling Strategy

```javascript
// src/utils/errors.js
export class ChessboardError extends Error {
    constructor(message, code, context = {}) {
        super(message);
        this.name = 'ChessboardError';
        this.code = code;
        this.context = context;
        this.timestamp = new Date().toISOString();
    }
}

export class ValidationError extends ChessboardError {
    constructor(message, field, value) {
        super(message, 'VALIDATION_ERROR', { field, value });
        this.name = 'ValidationError';
    }
}

export class ConfigurationError extends ChessboardError {
    constructor(message, configKey, configValue) {
        super(message, 'CONFIG_ERROR', { configKey, configValue });
        this.name = 'ConfigurationError';
    }
}

// Usage in components
class ChessboardConfig {
    validate() {
        if (!this.id) {
            throw new ValidationError(
                'Chessboard ID is required',
                'id',
                this.id
            );
        }
        
        if (!['w', 'b'].includes(this.orientation)) {
            throw new ConfigurationError(
                'Invalid orientation value',
                'orientation',
                this.orientation
            );
        }
    }
}
```

### Performance Optimization

#### 1. Lazy Loading e Code Splitting

```javascript
// src/services/AssetService.js
export class AssetService {
    constructor() {
        this.cache = new Map();
        this.loadingPromises = new Map();
        this.preloadQueue = [];
    }
    
    async loadTheme(themeName) {
        if (this.cache.has(themeName)) {
            return this.cache.get(themeName);
        }
        
        if (this.loadingPromises.has(themeName)) {
            return this.loadingPromises.get(themeName);
        }
        
        const promise = this._loadThemeData(themeName);
        this.loadingPromises.set(themeName, promise);
        
        try {
            const theme = await promise;
            this.cache.set(themeName, theme);
            return theme;
        } finally {
            this.loadingPromises.delete(themeName);
        }
    }
    
    async _loadThemeData(themeName) {
        // Dynamic import for code splitting
        const { default: themeModule } = await import(`../assets/themes/${themeName}/theme.js`);
        
        // Parallel loading of assets
        const [pieces, metadata] = await Promise.all([
            this._loadPieces(themeName),
            this._loadThemeMetadata(themeName)
        ]);
        
        return {
            ...themeModule,
            pieces,
            metadata
        };
    }
}
```

#### 2. Memory Management

```javascript
// src/core/Chessboard.js
export class Chessboard {
    constructor(config) {
        this.eventListeners = new Set();
        this.animationFrames = new Set();
        this.timers = new Set();
        this.observers = new Set();
        
        // WeakMap for DOM associations
        this.elementData = new WeakMap();
    }
    
    destroy() {
        // Clean up event listeners
        this.eventListeners.forEach(listener => {
            listener.element.removeEventListener(listener.event, listener.handler);
        });
        this.eventListeners.clear();
        
        // Cancel animations
        this.animationFrames.forEach(frameId => {
            cancelAnimationFrame(frameId);
        });
        this.animationFrames.clear();
        
        // Clear timers
        this.timers.forEach(timerId => {
            clearTimeout(timerId);
        });
        this.timers.clear();
        
        // Disconnect observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        // Clear DOM references
        this.element = null;
        this.squares = null;
        this.pieces = null;
    }
}
```

#### 3. Rendering Optimization

```javascript
// src/utils/rendering.js
export class RenderOptimizer {
    constructor() {
        this.pendingUpdates = new Map();
        this.updateScheduled = false;
    }
    
    scheduleUpdate(element, updateFn) {
        this.pendingUpdates.set(element, updateFn);
        
        if (!this.updateScheduled) {
            this.updateScheduled = true;
            requestAnimationFrame(() => this.flushUpdates());
        }
    }
    
    flushUpdates() {
        // Batch DOM reads first
        const measurements = new Map();
        for (const [element] of this.pendingUpdates) {
            measurements.set(element, {
                rect: element.getBoundingClientRect(),
                computedStyle: getComputedStyle(element)
            });
        }
        
        // Then batch DOM writes
        for (const [element, updateFn] of this.pendingUpdates) {
            const measurement = measurements.get(element);
            updateFn(element, measurement);
        }
        
        this.pendingUpdates.clear();
        this.updateScheduled = false;
    }
}
```

---

## 🧪 Testing Strategy Completa

### 1. Unit Testing (Jest)

```javascript
// tests/unit/core/Chessboard.test.js
import { Chessboard } from '../../../src/core/Chessboard.js';
import { ValidationError } from '../../../src/utils/errors.js';

describe('Chessboard Core', () => {
    let chessboard;
    let mockContainer;
    
    beforeEach(() => {
        mockContainer = document.createElement('div');
        mockContainer.id = 'test-board';
        document.body.appendChild(mockContainer);
        
        chessboard = new Chessboard({
            id: 'test-board',
            position: 'start'
        });
    });
    
    afterEach(() => {
        chessboard?.destroy();
        document.body.removeChild(mockContainer);
    });
    
    describe('Initialization', () => {
        it('should create chessboard with valid config', () => {
            expect(chessboard).toBeInstanceOf(Chessboard);
            expect(chessboard.element).toBe(mockContainer);
        });
        
        it('should throw ValidationError for invalid config', () => {
            expect(() => {
                new Chessboard({ id: null });
            }).toThrow(ValidationError);
        });
    });
    
    describe('Move Handling', () => {
        it('should execute valid move', async () => {
            const moveResult = await chessboard.move('e2', 'e4');
            
            expect(moveResult.success).toBe(true);
            expect(chessboard.get('e4')).toBe('pw');
            expect(chessboard.get('e2')).toBe(null);
        });
        
        it('should reject invalid move', async () => {
            const moveResult = await chessboard.move('e2', 'e5');
            
            expect(moveResult.success).toBe(false);
            expect(moveResult.error).toBeDefined();
        });
    });
});
```

### 2. Integration Testing

```javascript
// tests/integration/game-flow.test.js
import { Chessboard } from '../../src/core/Chessboard.js';
import { Chess } from 'chess.js';

describe('Game Flow Integration', () => {
    let board;
    let chess;
    
    beforeEach(() => {
        const container = document.createElement('div');
        container.id = 'integration-test';
        document.body.appendChild(container);
        
        chess = new Chess();
        board = new Chessboard({
            id: 'integration-test',
            position: chess.fen(),
            onMove: (move) => {
                const result = chess.move(move);
                if (result) {
                    board.position(chess.fen());
                    return true;
                }
                return false;
            }
        });
    });
    
    it('should play complete game with chess.js integration', async () => {
        const moves = [
            ['e2', 'e4'], ['e7', 'e5'],
            ['g1', 'f3'], ['b8', 'c6'],
            ['f1', 'c4'], ['f8', 'c5']
        ];
        
        for (const [from, to] of moves) {
            const result = await board.move(from, to);
            expect(result.success).toBe(true);
        }
        
        expect(chess.history().length).toBe(6);
        expect(board.fen()).toBe(chess.fen());
    });
});
```

### 3. E2E Testing (Playwright)

```javascript
// tests/e2e/user-interaction.spec.js
import { test, expect } from '@playwright/test';

test.describe('Chessboard User Interactions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/examples/basic-usage.html');
        await page.waitForSelector('#chessboard');
    });
    
    test('should allow drag and drop moves', async ({ page }) => {
        const board = page.locator('#chessboard');
        
        // Drag white pawn from e2 to e4
        await page.dragAndDrop(
            '[data-square="e2"] .piece',
            '[data-square="e4"]'
        );
        
        // Verify move was executed
        await expect(page.locator('[data-square="e4"] .piece')).toBeVisible();
        await expect(page.locator('[data-square="e2"] .piece')).not.toBeVisible();
    });
    
    test('should show legal move hints', async ({ page }) => {
        // Click on knight
        await page.click('[data-square="g1"] .piece');
        
        // Check that legal move squares are highlighted
        await expect(page.locator('[data-square="f3"].hint')).toBeVisible();
        await expect(page.locator('[data-square="h3"].hint')).toBeVisible();
    });
    
    test('should handle invalid moves gracefully', async ({ page }) => {
        // Try to move pawn backwards
        await page.dragAndDrop(
            '[data-square="e2"] .piece',
            '[data-square="e1"]'
        );
        
        // Piece should return to original position
        await expect(page.locator('[data-square="e2"] .piece')).toBeVisible();
        await expect(page.locator('[data-square="e1"] .piece')).not.toBeVisible();
    });
});
```

### 4. Performance Testing

```javascript
// benchmarks/rendering-performance.js
import { performance } from 'perf_hooks';
import { Chessboard } from '../src/core/Chessboard.js';

class PerformanceBenchmark {
    async runRenderingBenchmark() {
        const iterations = 1000;
        const times = [];
        
        for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            
            const board = new Chessboard({
                id: 'benchmark-board',
                position: 'start',
                size: 400
            });
            
            await board.build();
            
            const end = performance.now();
            times.push(end - start);
            
            board.destroy();
        }
        
        return {
            mean: times.reduce((a, b) => a + b) / times.length,
            min: Math.min(...times),
            max: Math.max(...times),
            p95: this.percentile(times, 95),
            p99: this.percentile(times, 99)
        };
    }
    
    percentile(arr, p) {
        const sorted = arr.sort((a, b) => a - b);
        const index = (p / 100) * (sorted.length - 1);
        return sorted[Math.round(index)];
    }
}
```

---

## 📚 Sistema di Documentazione

### 1. JSDoc Standards

```javascript
/**
 * Represents a chess piece on the board
 * @class
 * @memberof Components
 * @since 2.0.0
 * 
 * @example
 * const piece = new Piece({
 *   type: 'pawn',
 *   color: 'white',
 *   square: 'e2'
 * });
 */
export class Piece {
    /**
     * Creates a new chess piece
     * @param {Object} config - Piece configuration
     * @param {string} config.type - Piece type (pawn, rook, knight, bishop, queen, king)
     * @param {string} config.color - Piece color (white, black)
     * @param {string} config.square - Current square position
     * @param {Object} [config.element] - DOM element for the piece
     * @throws {ValidationError} When configuration is invalid
     * 
     * @example
     * const piece = new Piece({
     *   type: 'queen',
     *   color: 'black',
     *   square: 'd8'
     * });
     */
    constructor(config) {
        this._validateConfig(config);
        
        /**
         * Piece type
         * @type {string}
         * @readonly
         */
        this.type = config.type;
        
        /**
         * Piece color
         * @type {string}
         * @readonly
         */
        this.color = config.color;
        
        /**
         * Current square position
         * @type {string}
         * @private
         */
        this._square = config.square;
    }
    
    /**
     * Moves the piece to a new square
     * @param {string} targetSquare - Target square notation (e.g., 'e4')
     * @param {Object} [options={}] - Move options
     * @param {boolean} [options.animate=true] - Whether to animate the move
     * @param {number} [options.duration=200] - Animation duration in milliseconds
     * @returns {Promise<boolean>} True if move was successful
     * 
     * @example
     * await piece.moveTo('e4', { animate: true, duration: 300 });
     */
    async moveTo(targetSquare, options = {}) {
        // Implementation...
    }
}
```

### 2. TypeScript Definitions

```typescript
// src/types/chessboard.d.ts
export interface ChessboardConfig {
    /** HTML element ID where the board will be rendered */
    id: string;
    
    /** Board position as FEN string or predefined position */
    position?: string | 'start' | 'empty';
    
    /** Board orientation */
    orientation?: 'white' | 'black' | 'w' | 'b';
    
    /** Board size in pixels or 'auto' */
    size?: number | 'auto';
    
    /** Enable drag and drop */
    draggable?: boolean;
    
    /** Show legal move hints */
    hints?: boolean;
    
    /** Enable click-to-move */
    clickable?: boolean;
    
    /** Colors allowed to move */
    movableColors?: 'white' | 'black' | 'both' | 'none';
    
    /** Highlight last move */
    moveHighlight?: boolean;
    
    /** Animation easing function */
    moveAnimation?: AnimationEasing;
    
    /** Animation duration */
    moveTime?: AnimationDuration | number;
    
    /** What happens when piece is dropped off board */
    dropOffBoard?: 'snapback' | 'trash';
    
    /** Only allow legal moves */
    onlyLegalMoves?: boolean;
    
    /** Piece theme configuration */
    pieceTheme?: string | PieceThemeFunction;
    
    /** Board color scheme */
    whiteSquare?: string;
    blackSquare?: string;
    
    // Event handlers
    onMove?: MoveHandler;
    onMoveEnd?: MoveEndHandler;
    onChange?: ChangeHandler;
    onDragStart?: DragStartHandler;
    onDragMove?: DragMoveHandler;
    onDrop?: DropHandler;
    onSnapbackEnd?: SnapbackEndHandler;
    onSquareClick?: SquareClickHandler;
    onSquareOver?: SquareOverHandler;
    onSquareOut?: SquareOutHandler;
}

export type AnimationEasing = 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

export type AnimationDuration = 'fast' | 'normal' | 'slow';

export interface MoveEvent {
    from: string;
    to: string;
    piece: string;
    captured?: string;
    promotion?: string;
}

export type MoveHandler = (move: MoveEvent) => boolean | Promise<boolean>;

export type MoveEndHandler = (move: MoveEvent) => void;

export interface ChessboardAPI {
    // Position methods
    position(): string;
    position(fen: string, animate?: boolean): void;
    
    // Piece methods
    get(square: string): string | null;
    put(piece: string, square: string, animate?: boolean): void;
    remove(square: string, animate?: boolean): string | null;
    
    // Board control
    clear(animate?: boolean): void;
    reset(animate?: boolean): void;
    flip(animate?: boolean): void;
    
    // Moves
    move(from: string, to: string, animate?: boolean): Promise<MoveResult>;
    
    // Utilities
    resize(size: number | 'auto'): void;
    destroy(): void;
    
    // Chess.js integration
    fen(): string;
    turn(): 'w' | 'b';
    moves(options?: MovesOptions): string[];
    history(options?: HistoryOptions): string[] | MoveEvent[];
    isGameOver(): boolean;
    isCheckmate(): boolean;
    isDraw(): boolean;
}
```

---

## 🚀 Build e Deployment

### 1. Configurazione Rollup Avanzata

```javascript
// config/rollup.config.js
import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import { visualizer } from 'rollup-plugin-visualizer';
import filesize from 'rollup-plugin-filesize';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

const baseConfig = {
    input: 'src/index.js',
    external: ['chess.js'],
    plugins: [
        resolve({
            browser: true,
            preferBuiltins: false
        }),
        commonjs(),
        typescript({
            tsconfig: './config/tsconfig.json',
            declaration: true,
            declarationDir: './dist/types'
        }),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
            configFile: './config/babel.config.js'
        }),
        postcss({
            extract: true,
            minimize: isProduction,
            sourceMap: !isProduction
        }),
        ...(isProduction ? [
            terser({
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.debug']
                },
                format: {
                    comments: false
                }
            }),
            visualizer({
                filename: 'dist/bundle-analysis.html',
                open: false,
                gzipSize: true
            }),
            filesize()
        ] : [])
    ]
};

export default defineConfig([
    // ES Modules
    {
        ...baseConfig,
        output: {
            file: 'dist/chessboard.esm.js',
            format: 'esm',
            sourcemap: !isProduction
        }
    },
    
    // CommonJS
    {
        ...baseConfig,
        output: {
            file: 'dist/chessboard.cjs.js',
            format: 'cjs',
            exports: 'auto',
            sourcemap: !isProduction
        }
    },
    
    // UMD
    {
        ...baseConfig,
        output: {
            file: 'dist/chessboard.umd.js',
            format: 'umd',
            name: 'Chessboard',
            globals: {
                'chess.js': 'Chess'
            },
            sourcemap: !isProduction
        }
    },
    
    // IIFE (Browser)
    {
        ...baseConfig,
        output: {
            file: 'dist/chessboard.iife.js',
            format: 'iife',
            name: 'Chessboard',
            globals: {
                'chess.js': 'Chess'
            },
            sourcemap: !isProduction
        }
    },
    
    // Minified versions for production
    ...(isProduction ? [
        {
            ...baseConfig,
            output: {
                file: 'dist/chessboard.min.js',
                format: 'iife',
                name: 'Chessboard',
                globals: {
                    'chess.js': 'Chess'
                }
            }
        }
    ] : [])
]);
```

### 2. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  lint:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: ESLint
        run: npm run lint
      
      - name: Prettier
        run: npm run format:check
      
      - name: TypeScript Check
        run: npm run typecheck

  test:
    name: Test Suite
    runs-on: ubuntu-latest
    strategy:
      matrix:
        test-type: [unit, integration, e2e]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright (E2E only)
        if: matrix.test-type == 'e2e'
        run: npx playwright install
      
      - name: Run tests
        run: npm run test:${{ matrix.test-type }}
      
      - name: Upload coverage
        if: matrix.test-type == 'unit'
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Size Check
        run: npm run size-check
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  performance:
    name: Performance Audit
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Performance benchmarks
        run: npm run test:performance
      
      - name: Lighthouse audit
        run: npm run perf-audit

  release:
    name: Release
    runs-on: ubuntu-latest
    needs: [build, performance]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Semantic Release
        run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 🔍 Monitoring e Analytics

### 1. Performance Monitoring

```javascript
// src/utils/performance.js
export class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.setupObservers();
    }
    
    setupObservers() {
        // Performance Observer for paint metrics
        if ('PerformanceObserver' in window) {
            const paintObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    this.recordMetric(`paint.${entry.name}`, entry.startTime);
                });
            });
            paintObserver.observe({ entryTypes: ['paint'] });
            this.observers.set('paint', paintObserver);
            
            // Long task observer
            const longTaskObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    this.recordMetric('long-task', entry.duration);
                });
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
            this.observers.set('longtask', longTaskObserver);
        }
    }
    
    startMeasure(name) {
        performance.mark(`${name}-start`);
    }
    
    endMeasure(name) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measure = performance.getEntriesByName(name, 'measure')[0];
        this.recordMetric(name, measure.duration);
        
        return measure.duration;
    }
    
    recordMetric(name, value) {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        
        this.metrics.get(name).push({
            value,
            timestamp: Date.now(),
            url: window.location.href
        });
    }
    
    getMetrics() {
        const summary = {};
        
        for (const [name, values] of this.metrics) {
            const numbers = values.map(v => v.value);
            summary[name] = {
                count: numbers.length,
                mean: numbers.reduce((a, b) => a + b, 0) / numbers.length,
                min: Math.min(...numbers),
                max: Math.max(...numbers),
                p95: this.percentile(numbers, 95)
            };
        }
        
        return summary;
    }
}
```

### 2. Error Tracking

```javascript
// src/utils/errorTracking.js
export class ErrorTracker {
    constructor(config = {}) {
        this.config = {
            reportToConsole: true,
            reportToServer: false,
            serverEndpoint: null,
            ...config
        };
        
        this.setupErrorHandlers();
    }
    
    setupErrorHandlers() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.reportError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });
        
        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (event) => {
            this.reportError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled promise rejection',
                stack: event.reason?.stack
            });
        });
    }
    
    reportError(error) {
        const errorReport = {
            ...error,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            component: 'chessboard.js'
        };
        
        if (this.config.reportToConsole) {
            console.error('Chessboard.js Error:', errorReport);
        }
        
        if (this.config.reportToServer && this.config.serverEndpoint) {
            this.sendToServer(errorReport);
        }
    }
    
    async sendToServer(errorReport) {
        try {
            await fetch(this.config.serverEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(errorReport)
            });
        } catch (e) {
            console.warn('Failed to send error report to server:', e);
        }
    }
}
```

