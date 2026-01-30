# CLAUDE.md - Chessboard.js AI Assistant Guide

This document provides comprehensive guidance for AI assistants working with the Chessboard.js codebase.

## Project Overview

**Chessboard.js** is an interactive, customizable chessboard library for web applications. It provides a visual chess interface for game displays, chess lessons, analysis tools, and interactive chess experiences.

- **Package**: `@alepot55/chessboardjs` (NPM)
- **Version**: 2.2.1
- **License**: ISC
- **Module Type**: ES Modules (`"type": "module"`)
- **Runtime Dependency**: `chess.js` (^1.0.0) for move validation

## Repository Structure

```
Chessboard.js/
├── src/                    # Source code
│   ├── core/               # Main orchestration layer
│   │   ├── Chessboard.js   # Main facade class
│   │   ├── ChessboardConfig.js  # Configuration management
│   │   └── ChessboardFactory.js # Factory pattern for instances
│   ├── components/         # UI components
│   │   ├── Piece.js        # Chess piece representation
│   │   ├── Square.js       # Board square representation
│   │   └── Move.js         # Move representation with promotion
│   ├── services/           # Business logic services
│   │   ├── AnimationService.js   # Piece animations & easing
│   │   ├── BoardService.js       # DOM board construction
│   │   ├── CoordinateService.js  # Coordinate conversions
│   │   ├── EventService.js       # Drag/drop & user interactions
│   │   ├── MoveService.js        # Move validation & execution
│   │   ├── PieceService.js       # Piece operations & assets
│   │   ├── PositionService.js    # Board positions & FEN
│   │   └── ValidationService.js  # Input validation
│   ├── utils/              # Utility functions
│   │   ├── chess.js        # Chess.js integration wrapper
│   │   ├── logger.js       # Structured logging system
│   │   ├── performance.js  # Performance monitoring
│   │   ├── validation.js   # Validation utilities with caching
│   │   ├── coordinates.js  # Algebraic notation utilities
│   │   ├── animations.js   # Animation timing utilities
│   │   └── cross-browser.js # Cross-browser compatibility
│   ├── errors/             # Custom error handling
│   │   ├── ChessboardError.js # Error class hierarchy
│   │   └── messages.js     # Error messages & codes
│   ├── constants/          # Constants
│   │   └── positions.js    # Chess constants (pieces, colors, positions)
│   ├── styles/             # CSS styling
│   │   ├── board.css       # Board layout (CSS Grid 8x8)
│   │   ├── pieces.css      # Piece styling
│   │   └── animations.css  # Animation keyframes
│   └── index.js            # Main entry point
├── config/                 # Build configuration
│   ├── rollup.config.js    # Rollup bundler config
│   ├── jest.config.js      # Jest testing config
│   └── .babelrc            # Babel transpiler config
├── tests/                  # Test suites
│   └── unit/               # Unit tests (Jest)
├── assets/                 # Static assets
│   └── themes/             # Piece themes (SVG)
│       ├── default/        # Default theme
│       └── alepot/         # Alternative theme
├── dist/                   # Build output (multiple formats)
├── .eslintrc.json          # ESLint configuration
├── package.json            # NPM package config
└── README.md               # User documentation
```

## Development Commands

```bash
# Development
npm run dev              # Watch mode with Rollup

# Building
npm run build            # Build all formats
npm run build:esm        # ES Modules only
npm run build:cjs        # CommonJS only
npm run build:umd        # UMD only
npm run build:iife       # IIFE only

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report

# Pre-publish
npm run prepublishOnly   # Runs test && build
```

## Architecture Patterns

### Design Patterns Used

1. **Facade Pattern**: `Chessboard` class provides unified interface to all services
2. **Factory Pattern**: `ChessboardFactory` manages instance creation and templates
3. **Service Pattern**: 8 dedicated services handle specific concerns
4. **Strategy Pattern**: Different animation strategies (sequential/simultaneous)
5. **Observer Pattern**: Event system with listeners and callbacks
6. **Command Pattern**: Move operations with undo/redo support

### Layer Structure

- **Core Layer**: `Chessboard`, `ChessboardConfig`, `ChessboardFactory` - orchestration
- **Components Layer**: `Square`, `Piece`, `Move` - UI representations
- **Services Layer**: Business logic services - domain operations
- **Utils Layer**: Pure utility functions - cross-cutting concerns
- **Errors Layer**: Custom error types with context information

## Code Conventions

### Naming Conventions

```javascript
// Classes: PascalCase
class ChessboardController { }
class MoveValidationService { }

// Methods & Variables: camelCase
const currentPosition = 'start';
function validateMoveInput(from, to) { }

// Constants: UPPER_SNAKE_CASE
const DEFAULT_ANIMATION_DURATION = 200;
const PIECE_TYPES = ['p', 'r', 'n', 'b', 'q', 'k'];

// Private methods: underscore prefix
class Chessboard {
    _initializeBoard() { }
    _setupEventListeners() { }
}
```

### ESLint Rules (Key Points)

- **Indentation**: 4 spaces
- **Max line length**: 120 characters
- **Semicolons**: Required
- **Quotes**: Single quotes preferred
- **No console.log**: Use `console.warn`, `console.error`, or `console.info`
- **No var**: Use `const` or `let`
- **Prefer const**: Immutable when possible
- **Arrow functions**: Preferred for callbacks
- **Strict equality**: `===` required (except null checks)

### Error Handling

The codebase uses a custom error hierarchy:

```javascript
// Base error
ChessboardError(message, code, context)

// Specific errors
ValidationError   // Invalid inputs
ConfigurationError // Bad configuration
MoveError         // Invalid moves
DOMError          // DOM-related issues
PieceError        // Piece operation failures
```

Always provide context in errors for debugging.

## Key APIs

### Main Chessboard Class

```javascript
// Initialization
const board = new Chessboard({
    id: 'board',              // Container element ID
    position: 'start',        // FEN string or 'start'/'empty'
    orientation: 'w',         // 'w' or 'b'
    size: 400,                // Pixels
    draggable: true,          // Enable drag & drop
    clickable: true,          // Enable click-to-move
    onlyLegalMoves: true,     // Validate against chess rules
    onMove: (move) => true,   // Move callback
    onMoveEnd: (move) => {}   // Post-move callback
});

// Position methods
board.getPosition()           // Get FEN string
board.setPosition(fen)        // Set position
board.reset()                 // Reset to starting position
board.clear()                 // Clear the board

// Move methods
board.movePiece('e2e4')       // Make a move
board.undoMove()              // Undo last move
board.redoMove()              // Redo undone move
board.getLegalMoves('e2')     // Get legal moves for square

// Piece methods
board.getPiece('e4')          // Get piece at square
board.putPiece('qw', 'd4')    // Place piece on square
board.removePiece('d4')       // Remove piece from square

// Board control
board.flipBoard()             // Flip orientation
board.setOrientation('b')     // Set orientation
board.getOrientation()        // Get orientation
board.resizeBoard(500)        // Resize board

// Game state
board.fen()                   // Get FEN
board.turn()                  // Get turn ('w' or 'b')
board.isGameOver()            // Check game over
board.isCheckmate()           // Check checkmate
board.isDraw()                // Check draw
board.getHistory()            // Get move history

// Lifecycle
board.destroy()               // Cleanup and remove
board.rebuild()               // Re-initialize
```

### Static/Factory Methods

```javascript
Chessboard.create('board', config)           // Create instance
Chessboard.fromTemplate('board', 'default')  // Create from template
Chessboard.listInstances()                   // Get all instances
Chessboard.destroyAll()                      // Destroy all instances
```

## Testing

### Test Framework

- **Jest** with `jest-environment-jsdom`
- Tests in `/tests/unit/`
- Babel transformation for ES6+

### Test File Structure

```javascript
// tests/unit/chessboard.test.js
describe('Chessboard', () => {
    let board;
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'test-board';
        document.body.appendChild(container);
        board = new Chessboard({ id: 'test-board' });
    });

    afterEach(() => {
        board?.destroy();
        document.body.removeChild(container);
    });

    it('should create board with valid config', () => {
        expect(board).toBeDefined();
    });
});
```

### Running Tests

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Generate coverage
```

## Build System

### Rollup Configuration

Builds to multiple formats:
- `dist/chessboard.esm.js` - ES Modules
- `dist/chessboard.cjs.js` - CommonJS
- `dist/chessboard.umd.js` - UMD (browser global: `Chessboard`)
- `dist/chessboard.iife.js` - IIFE (browser global: `ChessboardLib`)
- `dist/chessboard.css` - Combined CSS

### Plugins Used

- `@rollup/plugin-node-resolve` - Resolves node modules
- `@rollup/plugin-replace` - Environment variable replacement

## Performance Considerations

### Optimizations Already In Place

- **Validation caching**: LRU cache (max 1000 entries) for validation results
- **RAF throttling**: RequestAnimationFrame for animations
- **Debouncing/throttling**: For frequent operations
- **Hardware acceleration CSS**: `transform: translateZ(0)`, `will-change`
- **Batch DOM operations**: Minimizes reflows

### When Adding Features

- Use `PerformanceMonitor` class for timing metrics
- Leverage existing caching utilities in `utils/validation.js`
- Prefer CSS transforms over layout-triggering properties
- Batch DOM reads before writes

## Common Tasks

### Adding a New Service

1. Create file in `src/services/`
2. Follow existing service pattern (class with constructor accepting dependencies)
3. Export from `src/services/index.js`
4. Inject into `Chessboard` class via constructor
5. Add unit tests in `tests/unit/`

### Adding a New Component

1. Create file in `src/components/`
2. Follow `Piece.js` or `Square.js` pattern
3. Export from `src/components/index.js`
4. Add unit tests

### Modifying Configuration Options

1. Update defaults in `src/core/ChessboardConfig.js`
2. Add validation in `ValidationService.js`
3. Update type definitions if present
4. Document in README.md

### Adding CSS Styles

1. Add to appropriate file in `src/styles/`
   - `board.css` - Board layout
   - `pieces.css` - Piece styling
   - `animations.css` - Animation keyframes
2. Use CSS custom properties for theming
3. Prefer CSS Grid for layout

## Important Files to Know

| File | Purpose |
|------|---------|
| `src/core/Chessboard.js` | Main facade - all public API |
| `src/core/ChessboardConfig.js` | Configuration validation & defaults |
| `src/services/MoveService.js` | Move validation logic |
| `src/services/EventService.js` | Drag/drop handling |
| `src/utils/chess.js` | Chess.js integration wrapper |
| `src/errors/ChessboardError.js` | Error class hierarchy |
| `config/rollup.config.js` | Build configuration |
| `config/jest.config.js` | Test configuration |

## Deprecated APIs

These legacy methods are still available but deprecated:

- `move(move, animation)` → use `movePiece(move, { animate: animation })`
- `clear(animation)` → use `clear({ animate: animation })`
- `start(animation)` → use `reset({ animate: animation })`
- `insert(square, piece)` → use `putPiece(piece, square)`
- `get(square)` / `piece(square)` → use `getPiece(square)`

## External Dependencies

### Runtime

- **chess.js** (^1.0.0): Chess move validation, FEN parsing, game state

### Development

- **Rollup** (^4.34.7): Module bundler
- **Jest** (^29.7.0): Testing framework
- **Babel** (^7.26.8): ES6+ transpilation
- **jest-environment-jsdom** (^29.7.0): Browser DOM simulation

## Git Workflow

- Commit messages should be descriptive
- Run tests before committing: `npm test`
- Build before publishing: `npm run build`
- Pre-publish hook runs: `npm run prepublishOnly`

## Troubleshooting

### Common Issues

1. **Board not rendering**: Check container element exists with correct ID
2. **Moves not working**: Verify `onlyLegalMoves` setting and `onMove` callback return value
3. **Animation issues**: Check `AnimationService` configuration
4. **Build failures**: Clear `dist/` and rebuild

### Debug Mode

Use the logger utility for debugging:

```javascript
import { Logger } from './utils/logger.js';
const logger = new Logger('ComponentName');
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

## Additional Resources

- [README.md](./README.md) - User-facing documentation
- [GitHub Repository](https://github.com/alepot55/ChessBoard)
- [NPM Package](https://www.npmjs.com/package/@alepot55/chessboardjs)
