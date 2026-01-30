# CLAUDE.md - Chessboard.js AI Assistant Guide

This document provides comprehensive guidance for AI assistants working with the Chessboard.js codebase.

## Project Overview

**Chessboard.js** is a modern, high-performance interactive chessboard library for web applications. It provides a visual chess interface for game displays, chess lessons, analysis tools, and interactive chess experiences.

- **Package**: `@alepot55/chessboardjs` (NPM)
- **Version**: 3.0.0
- **License**: MIT
- **Module Type**: ES Modules (`"type": "module"`)
- **Runtime Dependency**: `chess.js` (^1.0.0) for move validation
- **Node Version**: >=18.0.0

## Technology Stack

### Build & Development
- **Vite 5** - Modern build tool for fast development and optimized production builds
- **TypeScript 5** - Type definitions and strict type checking
- **Vitest** - Modern testing framework with Jest-compatible API

### Code Quality
- **ESLint 9** - Flat config with TypeScript support
- **Prettier 3** - Code formatting
- **Husky 9** - Git hooks
- **lint-staged** - Pre-commit linting

### CI/CD
- **GitHub Actions** - Automated testing, building, and publishing
- **Changesets** - Version management and changelog generation
- **Codecov** - Coverage reporting

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
│   │   └── positions.js    # Chess constants
│   ├── styles/             # CSS styling
│   │   ├── board.css       # Board layout (CSS Grid 8x8)
│   │   ├── pieces.css      # Piece styling
│   │   └── animations.css  # Animation keyframes
│   ├── types/              # TypeScript type definitions
│   │   └── index.d.ts      # Comprehensive type definitions
│   └── index.js            # Main entry point
├── tests/                  # Test suites
│   ├── unit/               # Unit tests (Vitest)
│   └── setup.ts            # Test setup and utilities
├── assets/                 # Static assets
│   └── themes/             # Piece themes (SVG)
├── dist/                   # Build output (multiple formats)
├── .github/
│   └── workflows/
│       └── ci.yml          # CI/CD pipeline
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint flat config
├── .prettierrc             # Prettier configuration
├── .husky/                 # Git hooks
│   └── pre-commit          # Pre-commit hook
├── package.json            # NPM package config
└── README.md               # User documentation
```

## Development Commands

```bash
# Development
npm run dev              # Watch mode with Vite

# Building
npm run build            # Build all formats with Vite
npm run build:types      # Generate TypeScript declarations

# Testing
npm test                 # Run all tests with Vitest
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
npm run test:ui          # Visual test interface

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
npm run format:check     # Check formatting
npm run typecheck        # TypeScript type checking
npm run validate         # Run all checks (lint + typecheck + test)

# Utilities
npm run clean            # Remove build artifacts
npm run size             # Check bundle size
npm run prepare          # Set up Husky (runs automatically)
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
- **Types Layer**: TypeScript type definitions

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

- **Modern ES2022+** target
- **TypeScript support** with strict type checking
- **Import ordering** enforced with groups
- **No console.log** in production (use logger utility)
- **Prefer const/let** over var
- **Arrow functions** preferred for callbacks
- **Strict equality** (`===`) required

### TypeScript Types

The project includes comprehensive TypeScript definitions in `src/types/index.d.ts`:

```typescript
// Key types available
import type {
  PieceType,       // 'k' | 'q' | 'r' | 'b' | 'n' | 'p'
  PieceColor,      // 'w' | 'b'
  Square,          // 'a1' - 'h8'
  Move,            // { from, to, promotion?, ... }
  ChessboardConfig,
  ChessboardAPI,
} from '@alepot55/chessboardjs';
```

## Testing

### Test Framework: Vitest

- Fast, native ESM support
- Jest-compatible API
- Built-in coverage with v8
- Visual test UI available

### Test Structure

```typescript
// tests/unit/chessboard.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createBoardContainer, removeBoardContainer } from '../setup';

describe('Chessboard', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = createBoardContainer('test-board');
    });

    afterEach(() => {
        removeBoardContainer('test-board');
    });

    it('should initialize correctly', () => {
        // Test implementation
    });
});
```

### Custom Matchers

```typescript
expect('e4').toBeValidSquare();
expect(fen).toBeValidFen();
expect('wk').toBeValidPieceId();
```

### Test Utilities (from setup.ts)

```typescript
import {
    createBoardContainer,
    removeBoardContainer,
    waitForAnimationFrame,
    waitForTimeout,
    STARTING_FEN,
    TEST_POSITIONS,
} from '../setup';
```

## Build System

### Vite Configuration

Builds to multiple formats:
- `dist/chessboard.esm.js` - ES Modules
- `dist/chessboard.cjs.js` - CommonJS
- `dist/chessboard.umd.js` - UMD (browser global: `Chessboard`)
- `dist/chessboard.iife.js` - IIFE
- `dist/chessboard.css` - Combined CSS
- `dist/types/` - TypeScript declarations

### Bundle Size Limits

- ESM bundle: < 50KB
- CSS: < 10KB

## CI/CD Pipeline

### GitHub Actions Workflow

1. **Lint & Format** - Code quality checks
2. **Test** - Run tests on Node 18, 20, 22
3. **Build** - Build library and check size
4. **Security** - NPM audit
5. **Publish** - Publish to NPM on release tags

### Branch Strategy

- `main` - Production releases
- `develop` - Release candidates (published as `@next`)
- Feature branches for development

## Key APIs

### Main Chessboard Class

```javascript
const board = new Chessboard({
    id: 'board',
    position: 'start',
    orientation: 'w',
    draggable: true,
    onMove: (move) => true,
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
board.putPiece('wq', 'd4')    // Place piece on square
board.removePiece('d4')       // Remove piece from square

// Board control
board.flipBoard()             // Flip orientation
board.setOrientation('b')     // Set orientation
board.resizeBoard(500)        // Resize board

// Game state
board.fen()                   // Get FEN
board.turn()                  // Get turn ('w' or 'b')
board.isGameOver()            // Check game over
board.isCheckmate()           // Check checkmate

// Lifecycle
board.destroy()               // Cleanup and remove
board.rebuild()               // Re-initialize
```

## Logging

Use the structured logger instead of console.log:

```javascript
import { Logger, createLogger } from './utils/logger.js';

const logger = createLogger({}, 'ComponentName');
logger.debug('Debug message', { data });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', {}, error);
```

## Error Handling

Use the custom error hierarchy:

```javascript
import {
    ChessboardError,
    ValidationError,
    ConfigurationError
} from './errors/ChessboardError.js';

throw new ValidationError('Invalid square', 'square', value);
throw new ConfigurationError('Missing id', 'id', config.id);
```

## Git Workflow

### Pre-commit Hooks

Husky runs lint-staged before each commit:
- ESLint with auto-fix
- Prettier formatting

### Commit Messages

Follow conventional commits:
```
feat: add new animation style
fix: correct piece positioning on resize
docs: update API documentation
refactor: optimize position comparison
test: add tests for undo/redo
chore: update dependencies
```

## Performance Considerations

### Optimizations In Place

- **Validation caching**: LRU cache for validation results
- **RAF throttling**: RequestAnimationFrame for animations
- **Batch DOM operations**: Minimizes reflows
- **Lazy evaluation**: Legal moves calculated on demand
- **Production builds**: Console logs removed, code minified

### When Adding Features

- Profile with the PerformanceMonitor class
- Avoid creating functions in loops
- Prefer CSS transforms over layout properties
- Use the existing debounce/throttle utilities

## Common Tasks

### Adding a New Service

1. Create file in `src/services/`
2. Follow existing service pattern
3. Export from `src/services/index.js`
4. Inject into `Chessboard` class
5. Add unit tests in `tests/unit/`

### Adding TypeScript Types

1. Add interfaces/types to `src/types/index.d.ts`
2. Use proper JSDoc comments in source files
3. Run `npm run typecheck` to verify

### Running the Full Validation Pipeline

```bash
npm run validate  # lint + typecheck + test
```

## Important Files

| File | Purpose |
|------|---------|
| `src/core/Chessboard.js` | Main facade - all public API |
| `src/core/ChessboardConfig.js` | Configuration validation & defaults |
| `src/services/MoveService.js` | Move validation logic |
| `src/services/EventService.js` | Drag/drop handling |
| `src/types/index.d.ts` | TypeScript type definitions |
| `vite.config.ts` | Build configuration |
| `eslint.config.js` | Linting rules |

## Troubleshooting

### Common Issues

1. **Build failures**: Run `npm run clean && npm install && npm run build`
2. **Test failures**: Ensure DOM container is created in beforeEach
3. **Type errors**: Run `npm run typecheck` for detailed output
4. **Lint errors**: Run `npm run lint:fix` to auto-fix

### Debug Mode

Set log level in development:
```javascript
import { logger } from './utils/logger.js';
logger.setLevel('DEBUG');
```

## Additional Resources

- [README.md](./README.md) - User-facing documentation
- [GitHub Repository](https://github.com/alepot55/ChessBoard)
- [NPM Package](https://www.npmjs.com/package/@alepot55/chessboardjs)
