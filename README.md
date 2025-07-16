# Chessboard.js: Interactive and Customizable Chessboard Library

[Chessboard.js](https://sites.google.com/view/chessboard-js/home) is a lightweight and versatile NPM package that lets you easily integrate an interactive, customizable chessboard into your web applications. Use it for game displays, chess lessons, analysis tools, or any project that needs a visual chess interface.

## Overview

[Chessboard.js](https://sites.google.com/view/chessboard-js/home) is designed with simplicity and flexibility in mind. Configure board appearance, piece sets, orientation, highlighting, animations, and more through a rich API. The board updates dynamically with user interactions and programmatic moves.

## Installation

```bash
npm i @alepot55/chessboardjs
```

## Usage

Import and initialize the chessboard into your project:

```javascript
import Chessboard from "chessboardjs";

const config = {
  id: "board",
  piecesPath: "path/to/pieces",
  position: "start",
  size: 400,
  orientation: "w",
  draggable: true,
  clickable: true,
  onlyLegalMoves: true,
  onMove: (move) => {
    console.log("Move attempted:", move);
    return true;
  },
  onMoveEnd: (move) => {
    console.log("Move executed:", move);
  },
  // ...other configuration options...
};

const board = new Chessboard(config);
```

## API Quick Reference

| Category              | Method                          | Description                        |
| --------------------- | ------------------------------- | ---------------------------------- |
| **Position & State**  | `getPosition()`                 | Get FEN string of current position |
|                       | `setPosition(fen, opts)`        | Set board position (FEN/object)    |
|                       | `reset(opts)`                   | Reset to starting position         |
|                       | `clear(opts)`                   | Clear the board                    |
| **Move Management**   | `movePiece(move, opts)`         | Make a move (string/object)        |
|                       | `undoMove(opts)`                | Undo last move                     |
|                       | `redoMove(opts)`                | Redo last undone move              |
|                       | `getLegalMoves(square)`         | Get legal moves for a square       |
| **Piece Management**  | `getPiece(square)`              | Get piece at a square              |
|                       | `putPiece(piece, square, opts)` | Put a piece on a square            |
|                       | `removePiece(square, opts)`     | Remove a piece from a square       |
| **Board Control**     | `flipBoard(opts)`               | Flip the board orientation         |
|                       | `setOrientation(color, opts)`   | Set board orientation              |
|                       | `getOrientation()`              | Get current orientation            |
|                       | `resizeBoard(size)`             | Resize the board                   |
| **Highlighting & UI** | `highlight(square, opts)`       | Highlight a square                 |
|                       | `dehighlight(square, opts)`     | Remove highlight from a square     |
| **Game Info**         | `fen()`                         | Get FEN string                     |
|                       | `turn()`                        | Get current turn ('w' or 'b')      |
|                       | `isGameOver()`                  | Is the game over?                  |
|                       | `isCheckmate()`                 | Is it checkmate?                   |
|                       | `isDraw()`                      | Is it draw?                        |
|                       | `getHistory()`                  | Get move history                   |
| **Lifecycle**         | `destroy()`                     | Destroy the board and cleanup      |
|                       | `rebuild()`                     | Re-initialize the board            |
| **Configuration**     | `getConfig()`                   | Get current config                 |
|                       | `setConfig(newConfig)`          | Update config                      |

> **Note:** Legacy methods like `move`, `clear`, `start`, `insert`, `get`, `piece`, etc. are still available as aliases but are deprecated. Use the new API for all new code.

## API Documentation

### Position & State

```js
board.getPosition(); // Get FEN string
board.setPosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"); // Set position
board.reset(); // Reset to starting position
board.clear(); // Clear the board
```

### Move Management

```js
board.movePiece("e2e4"); // Make a move
board.undoMove(); // Undo last move
board.redoMove(); // Redo last undone move
board.getLegalMoves("e2"); // Get legal moves for a square
```

### Piece Management

```js
board.getPiece("e4"); // Get piece at e4
board.putPiece("qw", "d4"); // Put a queen on d4
board.removePiece("d4"); // Remove piece from d4
```

### Board Control

```js
board.flipBoard(); // Flip orientation
board.setOrientation("b"); // Set orientation to black
console.log(board.getOrientation()); // Get current orientation
board.resizeBoard(500); // Resize board
```

### Highlighting & UI

```js
board.highlight("e4"); // Highlight e4
board.dehighlight("e4"); // Remove highlight from e4
```

### Game Info

```js
console.log(board.fen()); // Get FEN
console.log(board.turn()); // Get turn
console.log(board.isGameOver()); // Is game over?
console.log(board.isCheckmate()); // Is checkmate?
console.log(board.isDraw()); // Is draw?
console.log(board.getHistory()); // Get move history
```

### Lifecycle

```js
board.destroy(); // Destroy the board
board.rebuild(); // Re-initialize the board
```

### Configuration

```js
console.log(board.getConfig()); // Get config
board.setConfig({ size: 600 }); // Update config
```

## Deprecated Aliases

- `move(move, animation)` → use `movePiece(move, { animate: animation })`
- `clear(animation)` → use `clear({ animate: animation })`
- `start(animation)` → use `reset({ animate: animation })`
- `insert(square, piece)` → use `putPiece(piece, square)`
- `get(square)`/`piece(square)` → use `getPiece(square)`

## Static/Factory Methods

```js
// Create a new board
const board = Chessboard.create("board", config);
// Create from template
const board2 = Chessboard.fromTemplate("board2", "default", config);
// List all instances
const allBoards = Chessboard.listInstances();
// Destroy all boards
Chessboard.destroyAll();
```

---

For further details, refer to the full API documentation at the project website or within the source code.
