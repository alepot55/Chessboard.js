/**
 * Chessboard.js - A beautiful, customizable chessboard widget
 * Entry point for the core library
 */

import ChessboardClass from './Chessboard.js';
import ChessboardConfig from './ChessboardConfig.js';

// Factory function to maintain backward compatibility
function Chessboard(containerElm, config = {}) {
    // If first parameter is an object, treat it as config
    if (typeof containerElm === 'object' && containerElm !== null) {
        return new ChessboardClass(containerElm);
    }
    
    // Otherwise, treat first parameter as element ID
    const fullConfig = { ...config, id: containerElm };
    return new ChessboardClass(fullConfig);
}

// Wrapper class that handles both calling conventions
class ChessboardWrapper extends ChessboardClass {
    constructor(containerElm, config = {}) {
        // If first parameter is an object, treat it as config
        if (typeof containerElm === 'object' && containerElm !== null) {
            super(containerElm);
        } else {
            // Otherwise, treat first parameter as element ID
            const fullConfig = { ...config, id: containerElm };
            super(fullConfig);
        }
    }
}

// Attach the class to the factory function for direct access
Chessboard.Class = ChessboardWrapper;
Chessboard.Chessboard = ChessboardWrapper;

// Export the main classes
export { Chessboard, ChessboardConfig };

// Default export for convenience
export default Chessboard;
