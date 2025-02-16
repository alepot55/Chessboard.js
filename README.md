# Chessboard.js: Interactive and Customizable Chessboard Library

Chessboard.js is a lightweight and versatile NPM package that lets you easily integrate an interactive, customizable chessboard into your web applications. Use it for game displays, chess lessons, analysis tools, or any project that needs a visual chess interface.

## Overview
Chessboard.js is designed with simplicity and flexibility in mind. Configure board appearance, piece sets, orientation, highlighting, animations, and more through a rich API. The board updates dynamically with user interactions and programmatic moves.

## Installation
```bash
npm i @alepot55/chessboardjs
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

## Configuration

Configuration is done by passing an object to the constructor. Below is an example with the main attributes and a brief description:

```javascript
const config = {
  id: 'board',                   // ID of the HTML element where the chessboard is rendered
  piecesPath: 'path/to/pieces',   // Path (or function) to retrieve piece images
  position: 'start',              // Initial position ('start' for standard setup or a FEN string)
  size: 400,                     // Chessboard size (pixels number or 'auto')
  orientation: 'w',              // Board orientation: 'w' (white at the bottom) or 'b' (black at the bottom)
  draggable: true,               // Enable dragging of pieces
  clickable: true,               // Enable piece selection via click
  onlyLegalMoves: true,          // Allow only legal moves
  moveAnimation: 'ease',         // Transition function for move animations (e.g., 'ease', 'linear')
  moveTime: 'fast',              // Duration for move animation ('fast', 'normal', 'slow', etc.)
  snapbackAnimation: 'ease',     // Transition function for snapback animation (when an invalid move occurs)
  snapbackTime: 'fast',          // Duration for snapback animation
  fadeAnimation: 'ease',         // Transition function for fade animations
  fadeTime: 'fast',              // Duration for fade animation
  whiteSquare: '#f0d9b5',        // Color of white squares
  blackSquare: '#b58863',        // Color of black squares
  highlight: 'yellow',           // Color used to highlight moves
  selectedSquareWhite: '#ababaa',// Highlight color for selected white squares
  selectedSquareBlack: '#ababaa',// Highlight color for selected black squares
  movedSquareWhite: '#f1f1a0',   // Color to indicate moved white squares
  movedSquareBlack: '#e9e981',   // Color to indicate moved black squares
  choiceSquare: 'white',         // Color used to indicate square selection
  coverSquare: 'black',          // Color used to cover squares during certain interactions
  hintColor: '#ababaa',          // Color for move hints
  // Optional event callbacks:
  onMove: (move) => {            // Called when a move is attempted
      console.log('Move attempted:', move);
      return true;
  },
  onMoveEnd: (move) => {         // Called when a move is completed
      console.log('Move executed:', move);
  },
  // ...other callbacks and options...
};

// Usage:
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

# Chessboard.js – User API & Chess.js Integration

This document details the functions available to users for interacting with the Chessboard.js instance and the underlying Chess.js game. The functions are grouped by purpose and presented in a logical order.

---

## 1. Board Setup & Initialization

- **build()**  
  Initializes (or rebuilds) the board and its elements.  
  _Example:_  
  ```js
  board.build();
  ```

- **clear(options = {}, animation = true)**  
  Clears the board of all pieces and updates the display.  
  _Example:_  
  ```js
  board.clear();
  ```

- **reset(animation = true)**  
  Resets the game to the starting position.  
  _Example:_  
  ```js
  board.reset();
  ```

---

## 2. Orientation

- **getOrientation()**  
  Returns the current board orientation.  
  _Example:_  
  ```js
  console.log("Orientation:", board.getOrientation());
  ```

- **setOrientation(color, animation = true)**  
  Sets the board’s orientation. If an invalid color is passed, it flips the board.  
  _Example:_  
  ```js
  try {
    board.setOrientation('w');
  } catch (e) {
    console.error(e.message);
  }
  ```

- **flip(animation = true)**  
  Flips the board orientation (updates pieces and clears highlights).  
  _Example:_  
  ```js
  board.flip();
  ```

---

## 3. Game State & Display

- **ascii()**  
  Returns an ASCII diagram representing the current position.  
  _Example:_  
  ```js
  console.log(board.ascii());
  ```

- **board()**  
  Returns the current board as a 2D array.  
  _Example:_  
  ```js
  console.table(board.board());
  ```

- **fen()**  
  Retrieves the FEN string for the current board state.  
  _Example:_  
  ```js
  console.log("FEN:", board.fen());
  ```

---

## 4. Accessors & History

- **get(squareId)**  
  Returns the piece on the specified square.  
  _Example:_  
  ```js
  const piece = board.get('e4');
  console.log("Piece at e4:", piece);
  ```

- **getCastlingRights(color)**  
  Returns the castling rights for the given color.  
  _Example:_  
  ```js
  console.log("Castling rights for white:", board.getCastlingRights('w'));
  ```

- **getComment()** and **getComments()**  
  Retrieves a single comment or all comments attached to positions.  
  _Example:_  
  ```js
  console.log("Comment:", board.getComment());
  ```

- **history(options = {})**  
  Returns the moves history, optionally verbose.  
  _Example:_  
  ```js
  console.log("History:", board.history({ verbose: true }));
  ```

- **lastMove()**  
  Returns the last move made.  
  _Example:_  
  ```js
  console.log("Last move:", board.lastMove());
  ```

- **moveNumber()**  
  Returns the current move number.  
  _Example:_  
  ```js
  console.log("Move number:", board.moveNumber());
  ```

- **moves(options = {})**  
  Provides a list of legal moves.  
  _Example:_  
  ```js
  console.log("Legal moves:", board.moves());
  ```

- **pgn(options = {})**  
  Returns the game in PGN format.  
  _Example:_  
  ```js
  console.log("PGN:", board.pgn());
  ```

- **squareColor(squareId)**  
  Returns the color (light or dark) of the specified square.  
  _Example:_  
  ```js
  console.log("Square e4 is:", board.squareColor('e4'));
  ```

- **turn()**  
  Indicates which side's turn it is ('w' or 'b').  
  _Example:_  
  ```js
  console.log("Turn:", board.turn());
  ```

---

## 5. Game State Checks

- **isCheckmate()**  
  Checks if the current position is checkmate.  
  _Example:_  
  ```js
  if (board.isCheckmate()) console.log("Checkmate!");
  ```

- **isDraw()**  
  Checks if the game is drawn.  
- **isDrawByFiftyMoves()**  
- **isInsufficientMaterial()**  
- **isGameOver()**  
- **isStalemate()**  
- **isThreefoldRepetition()**  
  Each returns a Boolean indicating the respective state.  
  _Example:_  
  ```js
  if (board.isGameOver()) console.log("Game over!");
  ```

---

## 6. Game Modification

- **load(fen, options = {}, animation = true)**  
  Loads a new position from a FEN string.  
  _Example:_  
  ```js
  board.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  ```

- **loadPgn(pgn, options = {}, animation = true)**  
  Loads a game using a PGN string.  
  _Example:_  
  ```js
  board.loadPgn(pgnData);
  ```

- **put(pieceId, squareId, animation = true)**  
  Places a piece on the board.  
  _Example:_  
  ```js
  board.put({ type: 'p', color: 'w' }, 'd4');
  ```

- **remove(squareId, animation = true)**  
  Removes the piece from the given square.  
  _Example:_  
  ```js
  const removed = board.remove('d4');
  console.log("Removed:", removed);
  ```

- **removeComment()**, **removeComments()**, **removeHeader(field)**  
  Remove comments or PGN headers from the game.  
  _Example:_  
  ```js
  board.removeComment();
  ```

- **setCastlingRights(color, rights)**  
  Sets castling rights for a specified color.  
  _Example:_  
  ```js
  board.setCastlingRights('w', { k: false, q: true });
  ```

- **setComment(comment)** and **setHeader(key, value)**  
  Attach a comment to the current position or set a PGN header.  
  _Example:_  
  ```js
  board.setComment("King's pawn opening");
  board.setHeader('White', 'PlayerOne');
  ```

---

## 7. Move Reversal

- **undo()**  
  Reverts the last move played.  
  _Example:_  
  ```js
  const undone = board.undo();
  if (undone) console.log("Move undone:", undone);
  ```

---

## 8. Utility

- **validateFen(fen)**  
  Validates a given FEN string.  
  _Example:_  
  ```js
  const result = board.validateFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  console.log("FEN valid?", result.ok);
  ```
  
---

This documentation groups the API functions by their purpose. Developers can mix these methods to query the game state, update the board, load new positions, and more.