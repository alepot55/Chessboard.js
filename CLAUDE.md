# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chessboard.js is an interactive JavaScript chessboard library (v2.2.1) published as `@alepot55/chessboardjs`. It uses chess.js for move validation and rules enforcement.

## Commands

```bash
# Development
npm run dev              # Watch mode with rollup
npm run build            # Build all formats (ESM, CJS, UMD, IIFE)

# Testing
npm test                 # Run Jest tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

## Architecture

The codebase follows a service-oriented facade pattern with four layers:

### Layer Structure
- **Presentation**: Components (`Square.js`, `Piece.js`, `Move.js`), EventService, UI adapters
- **Application**: Controllers, 8 core services, use cases
- **Domain**: Entities (Chessboard, GameState), value objects, domain services
- **Infrastructure**: Utilities (DOM, math, performance), chess.js integration

### Core Services (`src/services/`)
| Service | Purpose |
|---------|---------|
| `AnimationService` | Piece movement animations |
| `BoardService` | Board state and square management |
| `CoordinateService` | Board orientation and coordinate transformation |
| `EventService` | Drag/drop, clicks, event coordination (most complex, ~36KB) |
| `MoveService` | Move validation, calculation, special moves |
| `PieceService` | Piece creation, manipulation, animations |
| `PositionService` | Position loading, FEN management |
| `ValidationService` | Input validation (FEN, squares, pieces) |

### Main Entry Points
- `src/index.js` - Main exports
- `src/core/Chessboard.js` - Main orchestrator class (~1940 lines), initializes all services and provides public API

### Design Patterns
- **Facade**: `Chessboard` class orchestrates all services
- **Observer**: `EventService` for event management
- **Factory**: `ChessboardFactory` for instance creation
- **Strategy**: Animation strategies (sequential/simultaneous)

## Key Conventions

- **Private methods**: Underscore prefix (`_initializeBoard()`)
- **Classes**: PascalCase (`ChessboardController`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_ANIMATION_DURATION`)
- **Files**: PascalCase for classes, camelCase for utilities

## Build Output

Rollup generates four formats in `dist/`:
- `chessboard.esm.js` - ES Modules
- `chessboard.cjs.js` - CommonJS
- `chessboard.umd.js` - UMD
- `chessboard.iife.js` - IIFE (browsers)

## Public API Categories

- **Position/State**: `getPosition()`, `setPosition()`, `reset()`, `clear()`
- **Moves**: `movePiece()`, `undoMove()`, `redoMove()`, `getLegalMoves()`
- **Pieces**: `getPiece()`, `putPiece()`, `removePiece()`
- **Board**: `flipBoard()`, `setOrientation()`, `resizeBoard()`
- **Game Info**: `fen()`, `turn()`, `isGameOver()`, `isCheckmate()`, `isDraw()`
- **Lifecycle**: `destroy()`, `rebuild()`
