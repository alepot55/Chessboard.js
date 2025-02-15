# Chessboardjs Documentation

## Overview
Chessboardjs is a JavaScript library for rendering and interacting with a chessboard. It provides functionalities to:
- Render a chessboard and pieces.
- Handle moves, animations, and piece interactions.
- Configure board behavior and appearance via the ChessboardConfig.

## File Descriptions
- **package.json & package-lock.json**: Node project configuration and dependency lock files.
- **index.html**: The main HTML file that initializes and loads the chessboard.
- **chessboard.square.js**: Contains the logic for individual board squares.
- **chessboard.piece.js**: Defines the chess piece class and methods such as piece creation, visibility control, and unique id generation.
- **chessboard.move.js**: Manages move validation, piece movement, promotions, and legality checks.
- **chessboard.css**: Provides the styles for the board layout, squares, pieces, and animations.
- **chessboard.config.js**: Handles configuration parameters like board size, animations, colors, and move options.
- **chessboard.js**: The main class integrating game logic, board building, event listeners, move execution, and state updates.
- **.gitignore**: Specifies files and directories to be ignored by the version control system.

## Usage
1. Include the `index.html` file in your project.
2. Initialize a Chessboard instance by passing a configuration object:
   - Example configuration options include `id_div`, `position`, `orientation`, `draggable`, etc.
3. Interact with the board using provided methods:
   - Execute moves.
   - Flip the board.
   - Update the game state.

## Development
- **Styling**: Modify `chessboard.css` for visual customization.
- **Functionality**: Extend or adjust functionalities in individual JavaScript files.
- **Configuration**: Update settings in `chessboard.config.js` for desired board behaviors and animations.
- Consult inline documentation within each source file for detailed method and class descriptions.

## Contributing
- Follow project conventions for code formatting and comments.
- Test changes by verifying the board renders correctly and that move logic functions as expected.

## License
Specify your chosen license here.
