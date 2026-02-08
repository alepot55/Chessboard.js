/**
 * Comprehensive tests for position changes, verifying both game state
 * and DOM/square state remain consistent after setPosition, clear, reset,
 * and rapid successive changes.
 */
import Chessboard from '../../src/index.js';

// All 64 squares
const ALL_SQUARES = [];
for (const file of 'abcdefgh') {
    for (let rank = 1; rank <= 8; rank++) {
        ALL_SQUARES.push(file + rank);
    }
}

const POSITIONS = {
    start: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    italian: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    sicilian: 'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',
    endgameKR: '8/8/8/4k3/8/8/8/4K2R w - - 0 1',
    endgameKQ: '8/8/8/4k3/8/8/8/3QK3 w - - 0 1',
    endgamePawns: '8/pp3k2/8/2P5/1P6/8/5K2/8 w - - 0 1',
    empty: '8/8/8/8/8/8/8/8 w - - 0 1',
    midgame: 'r1b2rk1/ppppqppp/2n2n2/2b1p1B1/2B1P3/2NP1N2/PPP2PPP/R2QK2R w KQ - 6 7',
};

// Expected piece map from a FEN string (square → 'wp', 'bk', etc. or null)
function expectedPiecesFromFen(fen) {
    const pieceFenMap = {
        'P': 'wp', 'N': 'wn', 'B': 'wb', 'R': 'wr', 'Q': 'wq', 'K': 'wk',
        'p': 'bp', 'n': 'bn', 'b': 'bb', 'r': 'br', 'q': 'bq', 'k': 'bk',
    };
    const result = {};
    ALL_SQUARES.forEach(sq => result[sq] = null);

    const rows = fen.split(' ')[0].split('/');
    for (let r = 0; r < 8; r++) {
        let col = 0;
        for (const ch of rows[r]) {
            if (ch >= '1' && ch <= '8') {
                col += parseInt(ch);
            } else {
                const file = 'abcdefgh'[col];
                const rank = 8 - r;
                result[file + rank] = pieceFenMap[ch] || null;
                col++;
            }
        }
    }
    return result;
}

// Verify full board consistency: game state vs squares
function verifyBoardState(board, expectedFen, label) {
    const expected = expectedPiecesFromFen(expectedFen);
    const squares = board.boardService.getAllSquares();

    const errors = [];

    ALL_SQUARES.forEach(sqId => {
        // Check game state (chess.js)
        const gamePiece = board.getPiece(sqId);
        const expectedPiece = expected[sqId];

        if (gamePiece !== expectedPiece) {
            errors.push(`[${label}] Game state mismatch on ${sqId}: expected=${expectedPiece}, got=${gamePiece}`);
        }

        // Check square.piece consistency with game state
        const square = squares[sqId];
        if (!square) return;

        const squarePieceId = square.piece
            ? (square.piece.color + square.piece.type).toLowerCase()
            : null;

        if (squarePieceId !== expectedPiece) {
            errors.push(`[${label}] Square.piece mismatch on ${sqId}: expected=${expectedPiece}, squarePiece=${squarePieceId}`);
        }

        // Check DOM: count <img class="piece"> elements in this square
        const imgCount = square.element.querySelectorAll('img.piece').length;
        const expectedImgCount = expectedPiece ? 1 : 0;

        if (imgCount !== expectedImgCount) {
            errors.push(`[${label}] DOM mismatch on ${sqId}: expected ${expectedImgCount} img(s), found ${imgCount}`);
        }

        // Check DOM element matches square.piece.element
        if (square.piece && square.piece.element) {
            const isAttached = square.element.contains(square.piece.element);
            if (!isAttached) {
                errors.push(`[${label}] DOM orphan on ${sqId}: piece element not attached to square`);
            }
        }
    });

    return errors;
}

// Wait for all pending timeouts/animations to settle
function settle(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Position Changes - Board State Consistency', () => {
    let board;
    const config = {
        id: 'board',
        position: 'start',
        draggable: false,
        hints: false,
        clickable: false,
        // Use fast animation times for tests (jsdom uses setTimeout fallback)
        fadeTime: 20,
        captureTime: 20,
        moveTime: 20,
        simultaneousAnimationDelay: 0,
    };

    beforeEach(() => {
        document.body.innerHTML = '<div id="board"></div>';
        board = new Chessboard(config);
    });

    afterEach(() => {
        if (board && board.destroy) board.destroy();
    });

    test('initial position matches start FEN', async () => {
        await settle(100);
        const errors = verifyBoardState(board, POSITIONS.start, 'initial');
        expect(errors).toEqual([]);
    });

    test('setPosition to Italian Game', async () => {
        board.setPosition(POSITIONS.italian, { animate: false });
        await settle(100);
        const errors = verifyBoardState(board, POSITIONS.italian, 'italian');
        expect(errors).toEqual([]);
    });

    test('setPosition to each position sequentially (no animation)', async () => {
        for (const [name, fen] of Object.entries(POSITIONS)) {
            if (name === 'empty') {
                board.clear({ animate: false });
            } else {
                board.setPosition(fen, { animate: false });
            }
            await settle(50);
            const errors = verifyBoardState(board, fen, name);
            expect(errors).toEqual([]);
        }
    });

    test('setPosition to each position sequentially (with animation)', async () => {
        for (const [name, fen] of Object.entries(POSITIONS)) {
            if (name === 'empty') {
                board.clear({ animate: true });
            } else {
                board.setPosition(fen, { animate: true });
            }
            await settle(200);
            const errors = verifyBoardState(board, fen, name);
            expect(errors).toEqual([]);
        }
    });

    test('clear then reset (no animation)', async () => {
        board.clear({ animate: false });
        await settle(50);
        let errors = verifyBoardState(board, POSITIONS.empty, 'after clear');
        expect(errors).toEqual([]);

        board.reset({ animate: false });
        await settle(50);
        errors = verifyBoardState(board, POSITIONS.start, 'after reset');
        expect(errors).toEqual([]);
    });

    test('clear then reset (with animation)', async () => {
        board.clear({ animate: true });
        await settle(200);
        let errors = verifyBoardState(board, POSITIONS.empty, 'after clear');
        expect(errors).toEqual([]);

        board.reset({ animate: true });
        await settle(200);
        errors = verifyBoardState(board, POSITIONS.start, 'after reset');
        expect(errors).toEqual([]);
    });

    test('clear then immediate reset (animation race)', async () => {
        board.clear({ animate: true });
        // Don't wait - immediately reset
        board.reset({ animate: true });
        await settle(200);
        const errors = verifyBoardState(board, POSITIONS.start, 'clear+reset race');
        expect(errors).toEqual([]);
    });

    test('rapid position changes (stress test)', async () => {
        const sequence = ['italian', 'sicilian', 'start', 'endgameKR', 'midgame', 'start'];

        for (const name of sequence) {
            board.setPosition(POSITIONS[name], { animate: true });
            // Only wait 10ms between changes (much less than animation duration)
            await settle(10);
        }

        // Wait for everything to settle
        await settle(500);
        const lastFen = POSITIONS[sequence[sequence.length - 1]];
        const errors = verifyBoardState(board, lastFen, 'rapid changes');
        expect(errors).toEqual([]);
    });

    test('rapid clear/reset cycles', async () => {
        for (let i = 0; i < 5; i++) {
            board.clear({ animate: true });
            await settle(10);
            board.reset({ animate: true });
            await settle(10);
        }

        await settle(500);
        const errors = verifyBoardState(board, POSITIONS.start, 'rapid clear/reset');
        expect(errors).toEqual([]);
    });

    test('position → empty → different position', async () => {
        board.setPosition(POSITIONS.italian, { animate: true });
        await settle(200);
        let errors = verifyBoardState(board, POSITIONS.italian, 'italian');
        expect(errors).toEqual([]);

        board.clear({ animate: true });
        await settle(200);
        errors = verifyBoardState(board, POSITIONS.empty, 'empty');
        expect(errors).toEqual([]);

        board.setPosition(POSITIONS.endgameKR, { animate: true });
        await settle(200);
        errors = verifyBoardState(board, POSITIONS.endgameKR, 'endgameKR');
        expect(errors).toEqual([]);
    });

    test('endgame to start (many pieces added)', async () => {
        board.setPosition(POSITIONS.endgameKR, { animate: false });
        await settle(100);
        let errors = verifyBoardState(board, POSITIONS.endgameKR, 'endgameKR');
        expect(errors).toEqual([]);

        board.setPosition(POSITIONS.start, { animate: true });
        await settle(200);
        errors = verifyBoardState(board, POSITIONS.start, 'back to start');
        expect(errors).toEqual([]);
    });

    test('start to endgame (many pieces removed)', async () => {
        board.setPosition(POSITIONS.endgameKR, { animate: true });
        await settle(200);
        const errors = verifyBoardState(board, POSITIONS.endgameKR, 'endgameKR');
        expect(errors).toEqual([]);
    });

    test('same position set twice should not corrupt state', async () => {
        board.setPosition(POSITIONS.italian, { animate: true });
        await settle(200);
        board.setPosition(POSITIONS.italian, { animate: true });
        await settle(200);
        const errors = verifyBoardState(board, POSITIONS.italian, 'italian twice');
        expect(errors).toEqual([]);
    });

    test('no orphaned DOM elements after many changes', async () => {
        const positions = Object.values(POSITIONS).filter(f => f !== POSITIONS.empty);

        for (let i = 0; i < 3; i++) {
            for (const fen of positions) {
                board.setPosition(fen, { animate: false });
                await settle(20);
            }
        }

        await settle(200);
        const lastFen = positions[positions.length - 1];
        const errors = verifyBoardState(board, lastFen, 'no orphans');
        expect(errors).toEqual([]);
    });

    test('all positions round-trip', async () => {
        // Go through all positions and back to start
        for (const [name, fen] of Object.entries(POSITIONS)) {
            if (name === 'empty') continue;
            board.setPosition(fen, { animate: false });
            await settle(50);
            const errors = verifyBoardState(board, fen, `round-trip ${name}`);
            expect(errors).toEqual([]);
        }

        board.reset({ animate: false });
        await settle(50);
        const errors = verifyBoardState(board, POSITIONS.start, 'round-trip reset');
        expect(errors).toEqual([]);
    });
});
