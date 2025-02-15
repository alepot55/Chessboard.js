# Chessboard.js: Interactive and Customizable Chessboard Library

Chessboard.js is a lightweight and versatile NPM package that lets you easily integrate an interactive, customizable chessboard into your web applications. Use it for game displays, chess lessons, analysis tools, or any project that needs a visual chess interface.

## Overview
Chessboard.js is designed with simplicity and flexibility in mind. Configure board appearance, piece sets, orientation, highlighting, animations, and more through a rich API. The board updates dynamically with user interactions and programmatic moves.

## Installation
```bash
npm install chessboardjs
```

## Usage
Import and initialize the chessboard into your project:
```javascript
import Chessboard from 'chessboardjs';

const config = {
    id: 'board',          // HTML element id for the board
    piecesPath: 'path/to/pieces', // Path or object/function returning piece image paths
    position: 'start',        // Valid FEN string or predefined position ('start' for initial setup)
    size: 400,                // Board size in pixels or 'auto'
    orientation: 'w',         // Board orientation: 'w' for white at bottom, 'b' for black at bottom
    draggable: true,          // Enable drag and drop for pieces
    clickable: true,          // Allow clickable moves and interactions
    onlyLegalMoves: true,     // Restrict piece moves to legal moves only
    onMove: (move) => {       // Callback when a move is attempted
        console.log('Move attempted:', move);
        return true;        // Accept the move
    },
    onMoveEnd: (move) => {
        console.log('Move executed:', move);
    },
    // ...other configuration options...
};

const board = new Chessboard(config);
```

## API Documentation

### Constructor
- **new Chessboard(config)**
  - Initializes a new chessboard using the provided configuration object.

### Public Functions for Users

- **move(move, animation)**
  - Moves a piece from one square to another.
  - Example:
    ```javascript
    board.move('e2e4', true);
    ```

- **clear(animation)**
  - Clears the board of all pieces.
  - Example:
    ```javascript
    board.clear();
    ```

- **insert(square, piece)**
  - Inserts a piece on a given square.
  - Example:
    ```javascript
    board.insert('d4', 'qw');
    ```

- **get(square)**
  - Returns the identifier of the piece at the given square.
  - Example:
    ```javascript
    const pieceId = board.get('e4');
    console.log('Piece at e4:', pieceId);
    ```

- **position(position, color)**
  - Updates the board position. Optionally, flips orientation if a color parameter is provided.
  - Example:
    ```javascript
    board.position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    ```

- **flip()**
  - Flips the board orientation between white and black.
  - Example:
    ```javascript
    board.flip();
    ```

- **build()**
  - Rebuilds or initializes the board and its elements.
  - Example:
    ```javascript
    board.build();
    ```

- **resize(value)**
  - Dynamically resizes the board. Accepts a number (pixels) or 'auto'.
  - Example:
    ```javascript
    board.resize(500);
    ```

- **destroy()**
  - Destroys the board, removes all event listeners, and cleans up the DOM.
  - Example:
    ```javascript
    board.destroy();
    ```

- **piece(square)**
  - Returns the piece identifier at the specified square.
  - Example:
    ```javascript
    const currentPiece = board.piece('f6');
    ```

- **highlight(square) and dehighlight(square)**
  - Highlights or removes highlight from a given square.
  - Example:
    ```javascript
    board.highlight('e4');
    board.dehighlight('e4');
    ```

- **turn() and fen()**
  - `turn()` returns the color whose turn it is ('w' or 'b').
  - `fen()` returns the current board state in FEN notation.
  - Example:
    ```javascript
    console.log('Current turn:', board.turn());
    console.log('FEN:', board.fen());
    ```

For further details, refer to the full API documentation at the project website or within the source code.