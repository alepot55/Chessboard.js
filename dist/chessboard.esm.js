/**
 * @license
 * Copyright (c) 2025, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
const WHITE = 'w';
const BLACK = 'b';
const PAWN = 'p';
const KNIGHT = 'n';
const BISHOP = 'b';
const ROOK = 'r';
const QUEEN = 'q';
const KING = 'k';
const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
let Move$1 = class Move {
    color;
    from;
    to;
    piece;
    captured;
    promotion;
    /**
     * @deprecated This field is deprecated and will be removed in version 2.0.0.
     * Please use move descriptor functions instead: `isCapture`, `isPromotion`,
     * `isEnPassant`, `isKingsideCastle`, `isQueensideCastle`, `isCastle`, and
     * `isBigPawn`
     */
    flags;
    san;
    lan;
    before;
    after;
    constructor(chess, internal) {
        const { color, piece, from, to, flags, captured, promotion } = internal;
        const fromAlgebraic = algebraic(from);
        const toAlgebraic = algebraic(to);
        this.color = color;
        this.piece = piece;
        this.from = fromAlgebraic;
        this.to = toAlgebraic;
        /*
         * HACK: The chess['_method']() calls below invoke private methods in the
         * Chess class to generate SAN and FEN. It's a bit of a hack, but makes the
         * code cleaner elsewhere.
         */
        this.san = chess['_moveToSan'](internal, chess['_moves']({ legal: true }));
        this.lan = fromAlgebraic + toAlgebraic;
        this.before = chess.fen();
        // Generate the FEN for the 'after' key
        chess['_makeMove'](internal);
        this.after = chess.fen();
        chess['_undoMove']();
        // Build the text representation of the move flags
        this.flags = '';
        for (const flag in BITS) {
            if (BITS[flag] & flags) {
                this.flags += FLAGS[flag];
            }
        }
        if (captured) {
            this.captured = captured;
        }
        if (promotion) {
            this.promotion = promotion;
            this.lan += promotion;
        }
    }
    isCapture() {
        return this.flags.indexOf(FLAGS['CAPTURE']) > -1;
    }
    isPromotion() {
        return this.flags.indexOf(FLAGS['PROMOTION']) > -1;
    }
    isEnPassant() {
        return this.flags.indexOf(FLAGS['EP_CAPTURE']) > -1;
    }
    isKingsideCastle() {
        return this.flags.indexOf(FLAGS['KSIDE_CASTLE']) > -1;
    }
    isQueensideCastle() {
        return this.flags.indexOf(FLAGS['QSIDE_CASTLE']) > -1;
    }
    isBigPawn() {
        return this.flags.indexOf(FLAGS['BIG_PAWN']) > -1;
    }
};
const EMPTY = -1;
const FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q',
};
const BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64,
};
/*
 * NOTES ABOUT 0x88 MOVE GENERATION ALGORITHM
 * ----------------------------------------------------------------------------
 * From https://github.com/jhlywa/chess.js/issues/230
 *
 * A lot of people are confused when they first see the internal representation
 * of chess.js. It uses the 0x88 Move Generation Algorithm which internally
 * stores the board as an 8x16 array. This is purely for efficiency but has a
 * couple of interesting benefits:
 *
 * 1. 0x88 offers a very inexpensive "off the board" check. Bitwise AND (&) any
 *    square with 0x88, if the result is non-zero then the square is off the
 *    board. For example, assuming a knight square A8 (0 in 0x88 notation),
 *    there are 8 possible directions in which the knight can move. These
 *    directions are relative to the 8x16 board and are stored in the
 *    PIECE_OFFSETS map. One possible move is A8 - 18 (up one square, and two
 *    squares to the left - which is off the board). 0 - 18 = -18 & 0x88 = 0x88
 *    (because of two-complement representation of -18). The non-zero result
 *    means the square is off the board and the move is illegal. Take the
 *    opposite move (from A8 to C7), 0 + 18 = 18 & 0x88 = 0. A result of zero
 *    means the square is on the board.
 *
 * 2. The relative distance (or difference) between two squares on a 8x16 board
 *    is unique and can be used to inexpensively determine if a piece on a
 *    square can attack any other arbitrary square. For example, let's see if a
 *    pawn on E7 can attack E2. The difference between E7 (20) - E2 (100) is
 *    -80. We add 119 to make the ATTACKS array index non-negative (because the
 *    worst case difference is A8 - H1 = -119). The ATTACKS array contains a
 *    bitmask of pieces that can attack from that distance and direction.
 *    ATTACKS[-80 + 119=39] gives us 24 or 0b11000 in binary. Look at the
 *    PIECE_MASKS map to determine the mask for a given piece type. In our pawn
 *    example, we would check to see if 24 & 0x1 is non-zero, which it is
 *    not. So, naturally, a pawn on E7 can't attack a piece on E2. However, a
 *    rook can since 24 & 0x8 is non-zero. The only thing left to check is that
 *    there are no blocking pieces between E7 and E2. That's where the RAYS
 *    array comes in. It provides an offset (in this case 16) to add to E7 (20)
 *    to check for blocking pieces. E7 (20) + 16 = E6 (36) + 16 = E5 (52) etc.
 */
// prettier-ignore
// eslint-disable-next-line
const Ox88 = {
    a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
    a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
    a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
    a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
    a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
    a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
    a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};
const PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15],
};
const PIECE_OFFSETS = {
    n: [-18, -33, -31, -14, 18, 33, 31, 14],
    b: [-17, -15, 17, 15],
    r: [-16, 1, 16, -1],
    q: [-17, -16, -15, 1, 17, 16, 15, -1],
    k: [-17, -16, -15, 1, 17, 16, 15, -1],
};
// prettier-ignore
const ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0,
    0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
    0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
    0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
    0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0,
    0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
    0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
    0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
    0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20
];
// prettier-ignore
const RAYS = [
    17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0,
    0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0,
    0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0,
    0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0,
    0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0,
    0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0,
    0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0,
    0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0,
    0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0,
    -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17
];
const PIECE_MASKS = { p: 0x1, n: 0x2, b: 0x4, r: 0x8, q: 0x10, k: 0x20 };
const SYMBOLS = 'pnbrqkPNBRQK';
const PROMOTIONS = [KNIGHT, BISHOP, ROOK, QUEEN];
const RANK_1 = 7;
const RANK_2 = 6;
/*
 * const RANK_3 = 5
 * const RANK_4 = 4
 * const RANK_5 = 3
 * const RANK_6 = 2
 */
const RANK_7 = 1;
const RANK_8 = 0;
const SIDES = {
    [KING]: BITS.KSIDE_CASTLE,
    [QUEEN]: BITS.QSIDE_CASTLE,
};
const ROOKS = {
    w: [
        { square: Ox88.a1, flag: BITS.QSIDE_CASTLE },
        { square: Ox88.h1, flag: BITS.KSIDE_CASTLE },
    ],
    b: [
        { square: Ox88.a8, flag: BITS.QSIDE_CASTLE },
        { square: Ox88.h8, flag: BITS.KSIDE_CASTLE },
    ],
};
const SECOND_RANK = { b: RANK_7, w: RANK_2 };
const TERMINATION_MARKERS = ['1-0', '0-1', '1/2-1/2', '*'];
// Extracts the zero-based rank of an 0x88 square.
function rank(square) {
    return square >> 4;
}
// Extracts the zero-based file of an 0x88 square.
function file(square) {
    return square & 0xf;
}
function isDigit(c) {
    return '0123456789'.indexOf(c) !== -1;
}
// Converts a 0x88 square to algebraic notation.
function algebraic(square) {
    const f = file(square);
    const r = rank(square);
    return ('abcdefgh'.substring(f, f + 1) +
        '87654321'.substring(r, r + 1));
}
function swapColor(color) {
    return color === WHITE ? BLACK : WHITE;
}
function validateFen(fen) {
    // 1st criterion: 6 space-seperated fields?
    const tokens = fen.split(/\s+/);
    if (tokens.length !== 6) {
        return {
            ok: false,
            error: 'Invalid FEN: must contain six space-delimited fields',
        };
    }
    // 2nd criterion: move number field is a integer value > 0?
    const moveNumber = parseInt(tokens[5], 10);
    if (isNaN(moveNumber) || moveNumber <= 0) {
        return {
            ok: false,
            error: 'Invalid FEN: move number must be a positive integer',
        };
    }
    // 3rd criterion: half move counter is an integer >= 0?
    const halfMoves = parseInt(tokens[4], 10);
    if (isNaN(halfMoves) || halfMoves < 0) {
        return {
            ok: false,
            error: 'Invalid FEN: half move counter number must be a non-negative integer',
        };
    }
    // 4th criterion: 4th field is a valid e.p.-string?
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
        return { ok: false, error: 'Invalid FEN: en-passant square is invalid' };
    }
    // 5th criterion: 3th field is a valid castle-string?
    if (/[^kKqQ-]/.test(tokens[2])) {
        return { ok: false, error: 'Invalid FEN: castling availability is invalid' };
    }
    // 6th criterion: 2nd field is "w" (white) or "b" (black)?
    if (!/^(w|b)$/.test(tokens[1])) {
        return { ok: false, error: 'Invalid FEN: side-to-move is invalid' };
    }
    // 7th criterion: 1st field contains 8 rows?
    const rows = tokens[0].split('/');
    if (rows.length !== 8) {
        return {
            ok: false,
            error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows",
        };
    }
    // 8th criterion: every row is valid?
    for (let i = 0; i < rows.length; i++) {
        // check for right sum of fields AND not two numbers in succession
        let sumFields = 0;
        let previousWasNumber = false;
        for (let k = 0; k < rows[i].length; k++) {
            if (isDigit(rows[i][k])) {
                if (previousWasNumber) {
                    return {
                        ok: false,
                        error: 'Invalid FEN: piece data is invalid (consecutive number)',
                    };
                }
                sumFields += parseInt(rows[i][k], 10);
                previousWasNumber = true;
            }
            else {
                if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
                    return {
                        ok: false,
                        error: 'Invalid FEN: piece data is invalid (invalid piece)',
                    };
                }
                sumFields += 1;
                previousWasNumber = false;
            }
        }
        if (sumFields !== 8) {
            return {
                ok: false,
                error: 'Invalid FEN: piece data is invalid (too many squares in rank)',
            };
        }
    }
    // 9th criterion: is en-passant square legal?
    if ((tokens[3][1] == '3' && tokens[1] == 'w') ||
        (tokens[3][1] == '6' && tokens[1] == 'b')) {
        return { ok: false, error: 'Invalid FEN: illegal en-passant square' };
    }
    // 10th criterion: does chess position contain exact two kings?
    const kings = [
        { color: 'white', regex: /K/g },
        { color: 'black', regex: /k/g },
    ];
    for (const { color, regex } of kings) {
        if (!regex.test(tokens[0])) {
            return { ok: false, error: `Invalid FEN: missing ${color} king` };
        }
        if ((tokens[0].match(regex) || []).length > 1) {
            return { ok: false, error: `Invalid FEN: too many ${color} kings` };
        }
    }
    // 11th criterion: are any pawns on the first or eighth rows?
    if (Array.from(rows[0] + rows[7]).some((char) => char.toUpperCase() === 'P')) {
        return {
            ok: false,
            error: 'Invalid FEN: some pawns are on the edge rows',
        };
    }
    return { ok: true };
}
// this function is used to uniquely identify ambiguous moves
function getDisambiguator(move, moves) {
    const from = move.from;
    const to = move.to;
    const piece = move.piece;
    let ambiguities = 0;
    let sameRank = 0;
    let sameFile = 0;
    for (let i = 0, len = moves.length; i < len; i++) {
        const ambigFrom = moves[i].from;
        const ambigTo = moves[i].to;
        const ambigPiece = moves[i].piece;
        /*
         * if a move of the same piece type ends on the same to square, we'll need
         * to add a disambiguator to the algebraic notation
         */
        if (piece === ambigPiece && from !== ambigFrom && to === ambigTo) {
            ambiguities++;
            if (rank(from) === rank(ambigFrom)) {
                sameRank++;
            }
            if (file(from) === file(ambigFrom)) {
                sameFile++;
            }
        }
    }
    if (ambiguities > 0) {
        if (sameRank > 0 && sameFile > 0) {
            /*
             * if there exists a similar moving piece on the same rank and file as
             * the move in question, use the square as the disambiguator
             */
            return algebraic(from);
        }
        else if (sameFile > 0) {
            /*
             * if the moving piece rests on the same file, use the rank symbol as the
             * disambiguator
             */
            return algebraic(from).charAt(1);
        }
        else {
            // else use the file symbol
            return algebraic(from).charAt(0);
        }
    }
    return '';
}
function addMove(moves, color, from, to, piece, captured = undefined, flags = BITS.NORMAL) {
    const r = rank(to);
    if (piece === PAWN && (r === RANK_1 || r === RANK_8)) {
        for (let i = 0; i < PROMOTIONS.length; i++) {
            const promotion = PROMOTIONS[i];
            moves.push({
                color,
                from,
                to,
                piece,
                captured,
                promotion,
                flags: flags | BITS.PROMOTION,
            });
        }
    }
    else {
        moves.push({
            color,
            from,
            to,
            piece,
            captured,
            flags,
        });
    }
}
function inferPieceType(san) {
    let pieceType = san.charAt(0);
    if (pieceType >= 'a' && pieceType <= 'h') {
        const matches = san.match(/[a-h]\d.*[a-h]\d/);
        if (matches) {
            return undefined;
        }
        return PAWN;
    }
    pieceType = pieceType.toLowerCase();
    if (pieceType === 'o') {
        return KING;
    }
    return pieceType;
}
// parses all of the decorators out of a SAN string
function strippedSan(move) {
    return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '');
}
function trimFen(fen) {
    /*
     * remove last two fields in FEN string as they're not needed when checking
     * for repetition
     */
    return fen.split(' ').slice(0, 4).join(' ');
}
class Chess {
    _board = new Array(128);
    _turn = WHITE;
    _header = {};
    _kings = { w: EMPTY, b: EMPTY };
    _epSquare = -1;
    _halfMoves = 0;
    _moveNumber = 0;
    _history = [];
    _comments = {};
    _castling = { w: 0, b: 0 };
    // tracks number of times a position has been seen for repetition checking
    _positionCount = {};
    constructor(fen = DEFAULT_POSITION) {
        this.load(fen);
    }
    clear({ preserveHeaders = false } = {}) {
        this._board = new Array(128);
        this._kings = { w: EMPTY, b: EMPTY };
        this._turn = WHITE;
        this._castling = { w: 0, b: 0 };
        this._epSquare = EMPTY;
        this._halfMoves = 0;
        this._moveNumber = 1;
        this._history = [];
        this._comments = {};
        this._header = preserveHeaders ? this._header : {};
        this._positionCount = {};
        /*
         * Delete the SetUp and FEN headers (if preserved), the board is empty and
         * these headers don't make sense in this state. They'll get added later
         * via .load() or .put()
         */
        delete this._header['SetUp'];
        delete this._header['FEN'];
    }
    load(fen, { skipValidation = false, preserveHeaders = false } = {}) {
        let tokens = fen.split(/\s+/);
        // append commonly omitted fen tokens
        if (tokens.length >= 2 && tokens.length < 6) {
            const adjustments = ['-', '-', '0', '1'];
            fen = tokens.concat(adjustments.slice(-(6 - tokens.length))).join(' ');
        }
        tokens = fen.split(/\s+/);
        if (!skipValidation) {
            const { ok, error } = validateFen(fen);
            if (!ok) {
                throw new Error(error);
            }
        }
        const position = tokens[0];
        let square = 0;
        this.clear({ preserveHeaders });
        for (let i = 0; i < position.length; i++) {
            const piece = position.charAt(i);
            if (piece === '/') {
                square += 8;
            }
            else if (isDigit(piece)) {
                square += parseInt(piece, 10);
            }
            else {
                const color = piece < 'a' ? WHITE : BLACK;
                this._put({ type: piece.toLowerCase(), color }, algebraic(square));
                square++;
            }
        }
        this._turn = tokens[1];
        if (tokens[2].indexOf('K') > -1) {
            this._castling.w |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf('Q') > -1) {
            this._castling.w |= BITS.QSIDE_CASTLE;
        }
        if (tokens[2].indexOf('k') > -1) {
            this._castling.b |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf('q') > -1) {
            this._castling.b |= BITS.QSIDE_CASTLE;
        }
        this._epSquare = tokens[3] === '-' ? EMPTY : Ox88[tokens[3]];
        this._halfMoves = parseInt(tokens[4], 10);
        this._moveNumber = parseInt(tokens[5], 10);
        this._updateSetup(fen);
        this._incPositionCount(fen);
    }
    fen() {
        let empty = 0;
        let fen = '';
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            if (this._board[i]) {
                if (empty > 0) {
                    fen += empty;
                    empty = 0;
                }
                const { color, type: piece } = this._board[i];
                fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
            }
            else {
                empty++;
            }
            if ((i + 1) & 0x88) {
                if (empty > 0) {
                    fen += empty;
                }
                if (i !== Ox88.h1) {
                    fen += '/';
                }
                empty = 0;
                i += 8;
            }
        }
        let castling = '';
        if (this._castling[WHITE] & BITS.KSIDE_CASTLE) {
            castling += 'K';
        }
        if (this._castling[WHITE] & BITS.QSIDE_CASTLE) {
            castling += 'Q';
        }
        if (this._castling[BLACK] & BITS.KSIDE_CASTLE) {
            castling += 'k';
        }
        if (this._castling[BLACK] & BITS.QSIDE_CASTLE) {
            castling += 'q';
        }
        // do we have an empty castling flag?
        castling = castling || '-';
        let epSquare = '-';
        /*
         * only print the ep square if en passant is a valid move (pawn is present
         * and ep capture is not pinned)
         */
        if (this._epSquare !== EMPTY) {
            const bigPawnSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
            const squares = [bigPawnSquare + 1, bigPawnSquare - 1];
            for (const square of squares) {
                // is the square off the board?
                if (square & 0x88) {
                    continue;
                }
                const color = this._turn;
                // is there a pawn that can capture the epSquare?
                if (this._board[square]?.color === color &&
                    this._board[square]?.type === PAWN) {
                    // if the pawn makes an ep capture, does it leave it's king in check?
                    this._makeMove({
                        color,
                        from: square,
                        to: this._epSquare,
                        piece: PAWN,
                        captured: PAWN,
                        flags: BITS.EP_CAPTURE,
                    });
                    const isLegal = !this._isKingAttacked(color);
                    this._undoMove();
                    // if ep is legal, break and set the ep square in the FEN output
                    if (isLegal) {
                        epSquare = algebraic(this._epSquare);
                        break;
                    }
                }
            }
        }
        return [
            fen,
            this._turn,
            castling,
            epSquare,
            this._halfMoves,
            this._moveNumber,
        ].join(' ');
    }
    /*
     * Called when the initial board setup is changed with put() or remove().
     * modifies the SetUp and FEN properties of the header object. If the FEN
     * is equal to the default position, the SetUp and FEN are deleted the setup
     * is only updated if history.length is zero, ie moves haven't been made.
     */
    _updateSetup(fen) {
        if (this._history.length > 0)
            return;
        if (fen !== DEFAULT_POSITION) {
            this._header['SetUp'] = '1';
            this._header['FEN'] = fen;
        }
        else {
            delete this._header['SetUp'];
            delete this._header['FEN'];
        }
    }
    reset() {
        this.load(DEFAULT_POSITION);
    }
    get(square) {
        return this._board[Ox88[square]];
    }
    put({ type, color }, square) {
        if (this._put({ type, color }, square)) {
            this._updateCastlingRights();
            this._updateEnPassantSquare();
            this._updateSetup(this.fen());
            return true;
        }
        return false;
    }
    _put({ type, color }, square) {
        // check for piece
        if (SYMBOLS.indexOf(type.toLowerCase()) === -1) {
            return false;
        }
        // check for valid square
        if (!(square in Ox88)) {
            return false;
        }
        const sq = Ox88[square];
        // don't let the user place more than one king
        if (type == KING &&
            !(this._kings[color] == EMPTY || this._kings[color] == sq)) {
            return false;
        }
        const currentPieceOnSquare = this._board[sq];
        // if one of the kings will be replaced by the piece from args, set the `_kings` respective entry to `EMPTY`
        if (currentPieceOnSquare && currentPieceOnSquare.type === KING) {
            this._kings[currentPieceOnSquare.color] = EMPTY;
        }
        this._board[sq] = { type: type, color: color };
        if (type === KING) {
            this._kings[color] = sq;
        }
        return true;
    }
    remove(square) {
        const piece = this.get(square);
        delete this._board[Ox88[square]];
        if (piece && piece.type === KING) {
            this._kings[piece.color] = EMPTY;
        }
        this._updateCastlingRights();
        this._updateEnPassantSquare();
        this._updateSetup(this.fen());
        return piece;
    }
    _updateCastlingRights() {
        const whiteKingInPlace = this._board[Ox88.e1]?.type === KING &&
            this._board[Ox88.e1]?.color === WHITE;
        const blackKingInPlace = this._board[Ox88.e8]?.type === KING &&
            this._board[Ox88.e8]?.color === BLACK;
        if (!whiteKingInPlace ||
            this._board[Ox88.a1]?.type !== ROOK ||
            this._board[Ox88.a1]?.color !== WHITE) {
            this._castling.w &= -65;
        }
        if (!whiteKingInPlace ||
            this._board[Ox88.h1]?.type !== ROOK ||
            this._board[Ox88.h1]?.color !== WHITE) {
            this._castling.w &= -33;
        }
        if (!blackKingInPlace ||
            this._board[Ox88.a8]?.type !== ROOK ||
            this._board[Ox88.a8]?.color !== BLACK) {
            this._castling.b &= -65;
        }
        if (!blackKingInPlace ||
            this._board[Ox88.h8]?.type !== ROOK ||
            this._board[Ox88.h8]?.color !== BLACK) {
            this._castling.b &= -33;
        }
    }
    _updateEnPassantSquare() {
        if (this._epSquare === EMPTY) {
            return;
        }
        const startSquare = this._epSquare + (this._turn === WHITE ? -16 : 16);
        const currentSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
        const attackers = [currentSquare + 1, currentSquare - 1];
        if (this._board[startSquare] !== null ||
            this._board[this._epSquare] !== null ||
            this._board[currentSquare]?.color !== swapColor(this._turn) ||
            this._board[currentSquare]?.type !== PAWN) {
            this._epSquare = EMPTY;
            return;
        }
        const canCapture = (square) => !(square & 0x88) &&
            this._board[square]?.color === this._turn &&
            this._board[square]?.type === PAWN;
        if (!attackers.some(canCapture)) {
            this._epSquare = EMPTY;
        }
    }
    _attacked(color, square, verbose) {
        const attackers = [];
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            // did we run off the end of the board
            if (i & 0x88) {
                i += 7;
                continue;
            }
            // if empty square or wrong color
            if (this._board[i] === undefined || this._board[i].color !== color) {
                continue;
            }
            const piece = this._board[i];
            const difference = i - square;
            // skip - to/from square are the same
            if (difference === 0) {
                continue;
            }
            const index = difference + 119;
            if (ATTACKS[index] & PIECE_MASKS[piece.type]) {
                if (piece.type === PAWN) {
                    if ((difference > 0 && piece.color === WHITE) ||
                        (difference <= 0 && piece.color === BLACK)) {
                        if (!verbose) {
                            return true;
                        }
                        else {
                            attackers.push(algebraic(i));
                        }
                    }
                    continue;
                }
                // if the piece is a knight or a king
                if (piece.type === 'n' || piece.type === 'k') {
                    if (!verbose) {
                        return true;
                    }
                    else {
                        attackers.push(algebraic(i));
                        continue;
                    }
                }
                const offset = RAYS[index];
                let j = i + offset;
                let blocked = false;
                while (j !== square) {
                    if (this._board[j] != null) {
                        blocked = true;
                        break;
                    }
                    j += offset;
                }
                if (!blocked) {
                    if (!verbose) {
                        return true;
                    }
                    else {
                        attackers.push(algebraic(i));
                        continue;
                    }
                }
            }
        }
        if (verbose) {
            return attackers;
        }
        else {
            return false;
        }
    }
    attackers(square, attackedBy) {
        if (!attackedBy) {
            return this._attacked(this._turn, Ox88[square], true);
        }
        else {
            return this._attacked(attackedBy, Ox88[square], true);
        }
    }
    _isKingAttacked(color) {
        const square = this._kings[color];
        return square === -1 ? false : this._attacked(swapColor(color), square);
    }
    isAttacked(square, attackedBy) {
        return this._attacked(attackedBy, Ox88[square]);
    }
    isCheck() {
        return this._isKingAttacked(this._turn);
    }
    inCheck() {
        return this.isCheck();
    }
    isCheckmate() {
        return this.isCheck() && this._moves().length === 0;
    }
    isStalemate() {
        return !this.isCheck() && this._moves().length === 0;
    }
    isInsufficientMaterial() {
        /*
         * k.b. vs k.b. (of opposite colors) with mate in 1:
         * 8/8/8/8/1b6/8/B1k5/K7 b - - 0 1
         *
         * k.b. vs k.n. with mate in 1:
         * 8/8/8/8/1n6/8/B7/K1k5 b - - 2 1
         */
        const pieces = {
            b: 0,
            n: 0,
            r: 0,
            q: 0,
            k: 0,
            p: 0,
        };
        const bishops = [];
        let numPieces = 0;
        let squareColor = 0;
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            squareColor = (squareColor + 1) % 2;
            if (i & 0x88) {
                i += 7;
                continue;
            }
            const piece = this._board[i];
            if (piece) {
                pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
                if (piece.type === BISHOP) {
                    bishops.push(squareColor);
                }
                numPieces++;
            }
        }
        // k vs. k
        if (numPieces === 2) {
            return true;
        }
        else if (
        // k vs. kn .... or .... k vs. kb
        numPieces === 3 &&
            (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)) {
            return true;
        }
        else if (numPieces === pieces[BISHOP] + 2) {
            // kb vs. kb where any number of bishops are all on the same color
            let sum = 0;
            const len = bishops.length;
            for (let i = 0; i < len; i++) {
                sum += bishops[i];
            }
            if (sum === 0 || sum === len) {
                return true;
            }
        }
        return false;
    }
    isThreefoldRepetition() {
        return this._getPositionCount(this.fen()) >= 3;
    }
    isDrawByFiftyMoves() {
        return this._halfMoves >= 100; // 50 moves per side = 100 half moves
    }
    isDraw() {
        return (this.isDrawByFiftyMoves() ||
            this.isStalemate() ||
            this.isInsufficientMaterial() ||
            this.isThreefoldRepetition());
    }
    isGameOver() {
        return this.isCheckmate() || this.isStalemate() || this.isDraw();
    }
    moves({ verbose = false, square = undefined, piece = undefined, } = {}) {
        const moves = this._moves({ square, piece });
        if (verbose) {
            return moves.map((move) => new Move$1(this, move));
        }
        else {
            return moves.map((move) => this._moveToSan(move, moves));
        }
    }
    _moves({ legal = true, piece = undefined, square = undefined, } = {}) {
        const forSquare = square ? square.toLowerCase() : undefined;
        const forPiece = piece?.toLowerCase();
        const moves = [];
        const us = this._turn;
        const them = swapColor(us);
        let firstSquare = Ox88.a8;
        let lastSquare = Ox88.h1;
        let singleSquare = false;
        // are we generating moves for a single square?
        if (forSquare) {
            // illegal square, return empty moves
            if (!(forSquare in Ox88)) {
                return [];
            }
            else {
                firstSquare = lastSquare = Ox88[forSquare];
                singleSquare = true;
            }
        }
        for (let from = firstSquare; from <= lastSquare; from++) {
            // did we run off the end of the board
            if (from & 0x88) {
                from += 7;
                continue;
            }
            // empty square or opponent, skip
            if (!this._board[from] || this._board[from].color === them) {
                continue;
            }
            const { type } = this._board[from];
            let to;
            if (type === PAWN) {
                if (forPiece && forPiece !== type)
                    continue;
                // single square, non-capturing
                to = from + PAWN_OFFSETS[us][0];
                if (!this._board[to]) {
                    addMove(moves, us, from, to, PAWN);
                    // double square
                    to = from + PAWN_OFFSETS[us][1];
                    if (SECOND_RANK[us] === rank(from) && !this._board[to]) {
                        addMove(moves, us, from, to, PAWN, undefined, BITS.BIG_PAWN);
                    }
                }
                // pawn captures
                for (let j = 2; j < 4; j++) {
                    to = from + PAWN_OFFSETS[us][j];
                    if (to & 0x88)
                        continue;
                    if (this._board[to]?.color === them) {
                        addMove(moves, us, from, to, PAWN, this._board[to].type, BITS.CAPTURE);
                    }
                    else if (to === this._epSquare) {
                        addMove(moves, us, from, to, PAWN, PAWN, BITS.EP_CAPTURE);
                    }
                }
            }
            else {
                if (forPiece && forPiece !== type)
                    continue;
                for (let j = 0, len = PIECE_OFFSETS[type].length; j < len; j++) {
                    const offset = PIECE_OFFSETS[type][j];
                    to = from;
                    while (true) {
                        to += offset;
                        if (to & 0x88)
                            break;
                        if (!this._board[to]) {
                            addMove(moves, us, from, to, type);
                        }
                        else {
                            // own color, stop loop
                            if (this._board[to].color === us)
                                break;
                            addMove(moves, us, from, to, type, this._board[to].type, BITS.CAPTURE);
                            break;
                        }
                        /* break, if knight or king */
                        if (type === KNIGHT || type === KING)
                            break;
                    }
                }
            }
        }
        /*
         * check for castling if we're:
         *   a) generating all moves, or
         *   b) doing single square move generation on the king's square
         */
        if (forPiece === undefined || forPiece === KING) {
            if (!singleSquare || lastSquare === this._kings[us]) {
                // king-side castling
                if (this._castling[us] & BITS.KSIDE_CASTLE) {
                    const castlingFrom = this._kings[us];
                    const castlingTo = castlingFrom + 2;
                    if (!this._board[castlingFrom + 1] &&
                        !this._board[castlingTo] &&
                        !this._attacked(them, this._kings[us]) &&
                        !this._attacked(them, castlingFrom + 1) &&
                        !this._attacked(them, castlingTo)) {
                        addMove(moves, us, this._kings[us], castlingTo, KING, undefined, BITS.KSIDE_CASTLE);
                    }
                }
                // queen-side castling
                if (this._castling[us] & BITS.QSIDE_CASTLE) {
                    const castlingFrom = this._kings[us];
                    const castlingTo = castlingFrom - 2;
                    if (!this._board[castlingFrom - 1] &&
                        !this._board[castlingFrom - 2] &&
                        !this._board[castlingFrom - 3] &&
                        !this._attacked(them, this._kings[us]) &&
                        !this._attacked(them, castlingFrom - 1) &&
                        !this._attacked(them, castlingTo)) {
                        addMove(moves, us, this._kings[us], castlingTo, KING, undefined, BITS.QSIDE_CASTLE);
                    }
                }
            }
        }
        /*
         * return all pseudo-legal moves (this includes moves that allow the king
         * to be captured)
         */
        if (!legal || this._kings[us] === -1) {
            return moves;
        }
        // filter out illegal moves
        const legalMoves = [];
        for (let i = 0, len = moves.length; i < len; i++) {
            this._makeMove(moves[i]);
            if (!this._isKingAttacked(us)) {
                legalMoves.push(moves[i]);
            }
            this._undoMove();
        }
        return legalMoves;
    }
    move(move, { strict = false } = {}) {
        /*
         * The move function can be called with in the following parameters:
         *
         * .move('Nxb7')       <- argument is a case-sensitive SAN string
         *
         * .move({ from: 'h7', <- argument is a move object
         *         to :'h8',
         *         promotion: 'q' })
         *
         *
         * An optional strict argument may be supplied to tell chess.js to
         * strictly follow the SAN specification.
         */
        let moveObj = null;
        if (typeof move === 'string') {
            moveObj = this._moveFromSan(move, strict);
        }
        else if (typeof move === 'object') {
            const moves = this._moves();
            // convert the pretty move object to an ugly move object
            for (let i = 0, len = moves.length; i < len; i++) {
                if (move.from === algebraic(moves[i].from) &&
                    move.to === algebraic(moves[i].to) &&
                    (!('promotion' in moves[i]) || move.promotion === moves[i].promotion)) {
                    moveObj = moves[i];
                    break;
                }
            }
        }
        // failed to find move
        if (!moveObj) {
            if (typeof move === 'string') {
                throw new Error(`Invalid move: ${move}`);
            }
            else {
                throw new Error(`Invalid move: ${JSON.stringify(move)}`);
            }
        }
        /*
         * need to make a copy of move because we can't generate SAN after the move
         * is made
         */
        const prettyMove = new Move$1(this, moveObj);
        this._makeMove(moveObj);
        this._incPositionCount(prettyMove.after);
        return prettyMove;
    }
    _push(move) {
        this._history.push({
            move,
            kings: { b: this._kings.b, w: this._kings.w },
            turn: this._turn,
            castling: { b: this._castling.b, w: this._castling.w },
            epSquare: this._epSquare,
            halfMoves: this._halfMoves,
            moveNumber: this._moveNumber,
        });
    }
    _makeMove(move) {
        const us = this._turn;
        const them = swapColor(us);
        this._push(move);
        this._board[move.to] = this._board[move.from];
        delete this._board[move.from];
        // if ep capture, remove the captured pawn
        if (move.flags & BITS.EP_CAPTURE) {
            if (this._turn === BLACK) {
                delete this._board[move.to - 16];
            }
            else {
                delete this._board[move.to + 16];
            }
        }
        // if pawn promotion, replace with new piece
        if (move.promotion) {
            this._board[move.to] = { type: move.promotion, color: us };
        }
        // if we moved the king
        if (this._board[move.to].type === KING) {
            this._kings[us] = move.to;
            // if we castled, move the rook next to the king
            if (move.flags & BITS.KSIDE_CASTLE) {
                const castlingTo = move.to - 1;
                const castlingFrom = move.to + 1;
                this._board[castlingTo] = this._board[castlingFrom];
                delete this._board[castlingFrom];
            }
            else if (move.flags & BITS.QSIDE_CASTLE) {
                const castlingTo = move.to + 1;
                const castlingFrom = move.to - 2;
                this._board[castlingTo] = this._board[castlingFrom];
                delete this._board[castlingFrom];
            }
            // turn off castling
            this._castling[us] = 0;
        }
        // turn off castling if we move a rook
        if (this._castling[us]) {
            for (let i = 0, len = ROOKS[us].length; i < len; i++) {
                if (move.from === ROOKS[us][i].square &&
                    this._castling[us] & ROOKS[us][i].flag) {
                    this._castling[us] ^= ROOKS[us][i].flag;
                    break;
                }
            }
        }
        // turn off castling if we capture a rook
        if (this._castling[them]) {
            for (let i = 0, len = ROOKS[them].length; i < len; i++) {
                if (move.to === ROOKS[them][i].square &&
                    this._castling[them] & ROOKS[them][i].flag) {
                    this._castling[them] ^= ROOKS[them][i].flag;
                    break;
                }
            }
        }
        // if big pawn move, update the en passant square
        if (move.flags & BITS.BIG_PAWN) {
            if (us === BLACK) {
                this._epSquare = move.to - 16;
            }
            else {
                this._epSquare = move.to + 16;
            }
        }
        else {
            this._epSquare = EMPTY;
        }
        // reset the 50 move counter if a pawn is moved or a piece is captured
        if (move.piece === PAWN) {
            this._halfMoves = 0;
        }
        else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
            this._halfMoves = 0;
        }
        else {
            this._halfMoves++;
        }
        if (us === BLACK) {
            this._moveNumber++;
        }
        this._turn = them;
    }
    undo() {
        const move = this._undoMove();
        if (move) {
            const prettyMove = new Move$1(this, move);
            this._decPositionCount(prettyMove.after);
            return prettyMove;
        }
        return null;
    }
    _undoMove() {
        const old = this._history.pop();
        if (old === undefined) {
            return null;
        }
        const move = old.move;
        this._kings = old.kings;
        this._turn = old.turn;
        this._castling = old.castling;
        this._epSquare = old.epSquare;
        this._halfMoves = old.halfMoves;
        this._moveNumber = old.moveNumber;
        const us = this._turn;
        const them = swapColor(us);
        this._board[move.from] = this._board[move.to];
        this._board[move.from].type = move.piece; // to undo any promotions
        delete this._board[move.to];
        if (move.captured) {
            if (move.flags & BITS.EP_CAPTURE) {
                // en passant capture
                let index;
                if (us === BLACK) {
                    index = move.to - 16;
                }
                else {
                    index = move.to + 16;
                }
                this._board[index] = { type: PAWN, color: them };
            }
            else {
                // regular capture
                this._board[move.to] = { type: move.captured, color: them };
            }
        }
        if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
            let castlingTo, castlingFrom;
            if (move.flags & BITS.KSIDE_CASTLE) {
                castlingTo = move.to + 1;
                castlingFrom = move.to - 1;
            }
            else {
                castlingTo = move.to - 2;
                castlingFrom = move.to + 1;
            }
            this._board[castlingTo] = this._board[castlingFrom];
            delete this._board[castlingFrom];
        }
        return move;
    }
    pgn({ newline = '\n', maxWidth = 0, } = {}) {
        /*
         * using the specification from http://www.chessclub.com/help/PGN-spec
         * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
         */
        const result = [];
        let headerExists = false;
        /* add the PGN header information */
        for (const i in this._header) {
            /*
             * TODO: order of enumerated properties in header object is not
             * guaranteed, see ECMA-262 spec (section 12.6.4)
             */
            result.push('[' + i + ' "' + this._header[i] + '"]' + newline);
            headerExists = true;
        }
        if (headerExists && this._history.length) {
            result.push(newline);
        }
        const appendComment = (moveString) => {
            const comment = this._comments[this.fen()];
            if (typeof comment !== 'undefined') {
                const delimiter = moveString.length > 0 ? ' ' : '';
                moveString = `${moveString}${delimiter}{${comment}}`;
            }
            return moveString;
        };
        // pop all of history onto reversed_history
        const reversedHistory = [];
        while (this._history.length > 0) {
            reversedHistory.push(this._undoMove());
        }
        const moves = [];
        let moveString = '';
        // special case of a commented starting position with no moves
        if (reversedHistory.length === 0) {
            moves.push(appendComment(''));
        }
        // build the list of moves.  a move_string looks like: "3. e3 e6"
        while (reversedHistory.length > 0) {
            moveString = appendComment(moveString);
            const move = reversedHistory.pop();
            // make TypeScript stop complaining about move being undefined
            if (!move) {
                break;
            }
            // if the position started with black to move, start PGN with #. ...
            if (!this._history.length && move.color === 'b') {
                const prefix = `${this._moveNumber}. ...`;
                // is there a comment preceding the first move?
                moveString = moveString ? `${moveString} ${prefix}` : prefix;
            }
            else if (move.color === 'w') {
                // store the previous generated move_string if we have one
                if (moveString.length) {
                    moves.push(moveString);
                }
                moveString = this._moveNumber + '.';
            }
            moveString =
                moveString + ' ' + this._moveToSan(move, this._moves({ legal: true }));
            this._makeMove(move);
        }
        // are there any other leftover moves?
        if (moveString.length) {
            moves.push(appendComment(moveString));
        }
        // is there a result?
        if (typeof this._header.Result !== 'undefined') {
            moves.push(this._header.Result);
        }
        /*
         * history should be back to what it was before we started generating PGN,
         * so join together moves
         */
        if (maxWidth === 0) {
            return result.join('') + moves.join(' ');
        }
        // TODO (jah): huh?
        const strip = function () {
            if (result.length > 0 && result[result.length - 1] === ' ') {
                result.pop();
                return true;
            }
            return false;
        };
        // NB: this does not preserve comment whitespace.
        const wrapComment = function (width, move) {
            for (const token of move.split(' ')) {
                if (!token) {
                    continue;
                }
                if (width + token.length > maxWidth) {
                    while (strip()) {
                        width--;
                    }
                    result.push(newline);
                    width = 0;
                }
                result.push(token);
                width += token.length;
                result.push(' ');
                width++;
            }
            if (strip()) {
                width--;
            }
            return width;
        };
        // wrap the PGN output at max_width
        let currentWidth = 0;
        for (let i = 0; i < moves.length; i++) {
            if (currentWidth + moves[i].length > maxWidth) {
                if (moves[i].includes('{')) {
                    currentWidth = wrapComment(currentWidth, moves[i]);
                    continue;
                }
            }
            // if the current move will push past max_width
            if (currentWidth + moves[i].length > maxWidth && i !== 0) {
                // don't end the line with whitespace
                if (result[result.length - 1] === ' ') {
                    result.pop();
                }
                result.push(newline);
                currentWidth = 0;
            }
            else if (i !== 0) {
                result.push(' ');
                currentWidth++;
            }
            result.push(moves[i]);
            currentWidth += moves[i].length;
        }
        return result.join('');
    }
    /*
     * @deprecated Use `setHeader` and `getHeaders` instead.
     */
    header(...args) {
        for (let i = 0; i < args.length; i += 2) {
            if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
                this._header[args[i]] = args[i + 1];
            }
        }
        return this._header;
    }
    setHeader(key, value) {
        this._header[key] = value;
        return this._header;
    }
    removeHeader(key) {
        if (key in this._header) {
            delete this._header[key];
            return true;
        }
        return false;
    }
    getHeaders() {
        return this._header;
    }
    loadPgn(pgn, { strict = false, newlineChar = '\r?\n', } = {}) {
        function mask(str) {
            return str.replace(/\\/g, '\\');
        }
        function parsePgnHeader(header) {
            const headerObj = {};
            const headers = header.split(new RegExp(mask(newlineChar)));
            let key = '';
            let value = '';
            for (let i = 0; i < headers.length; i++) {
                const regex = /^\s*\[\s*([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;
                key = headers[i].replace(regex, '$1');
                value = headers[i].replace(regex, '$2');
                if (key.trim().length > 0) {
                    headerObj[key] = value;
                }
            }
            return headerObj;
        }
        // strip whitespace from head/tail of PGN block
        pgn = pgn.trim();
        /*
         * RegExp to split header. Takes advantage of the fact that header and movetext
         * will always have a blank line between them (ie, two newline_char's). Handles
         * case where movetext is empty by matching newlineChar until end of string is
         * matched - effectively trimming from the end extra newlineChar.
         *
         * With default newline_char, will equal:
         * /^(\[((?:\r?\n)|.)*\])((?:\s*\r?\n){2}|(?:\s*\r?\n)*$)/
         */
        const headerRegex = new RegExp('^(\\[((?:' +
            mask(newlineChar) +
            ')|.)*\\])' +
            '((?:\\s*' +
            mask(newlineChar) +
            '){2}|(?:\\s*' +
            mask(newlineChar) +
            ')*$)');
        // If no header given, begin with moves.
        const headerRegexResults = headerRegex.exec(pgn);
        const headerString = headerRegexResults
            ? headerRegexResults.length >= 2
                ? headerRegexResults[1]
                : ''
            : '';
        // Put the board in the starting position
        this.reset();
        // parse PGN header
        const headers = parsePgnHeader(headerString);
        let fen = '';
        for (const key in headers) {
            // check to see user is including fen (possibly with wrong tag case)
            if (key.toLowerCase() === 'fen') {
                fen = headers[key];
            }
            this.header(key, headers[key]);
        }
        /*
         * the permissive parser should attempt to load a fen tag, even if it's the
         * wrong case and doesn't include a corresponding [SetUp "1"] tag
         */
        if (!strict) {
            if (fen) {
                this.load(fen, { preserveHeaders: true });
            }
        }
        else {
            /*
             * strict parser - load the starting position indicated by [Setup '1']
             * and [FEN position]
             */
            if (headers['SetUp'] === '1') {
                if (!('FEN' in headers)) {
                    throw new Error('Invalid PGN: FEN tag must be supplied with SetUp tag');
                }
                // don't clear the headers when loading
                this.load(headers['FEN'], { preserveHeaders: true });
            }
        }
        /*
         * NB: the regexes below that delete move numbers, recursive annotations,
         * and numeric annotation glyphs may also match text in comments. To
         * prevent this, we transform comments by hex-encoding them in place and
         * decoding them again after the other tokens have been deleted.
         *
         * While the spec states that PGN files should be ASCII encoded, we use
         * {en,de}codeURIComponent here to support arbitrary UTF8 as a convenience
         * for modern users
         */
        function toHex(s) {
            return Array.from(s)
                .map(function (c) {
                /*
                 * encodeURI doesn't transform most ASCII characters, so we handle
                 * these ourselves
                 */
                return c.charCodeAt(0) < 128
                    ? c.charCodeAt(0).toString(16)
                    : encodeURIComponent(c).replace(/%/g, '').toLowerCase();
            })
                .join('');
        }
        function fromHex(s) {
            return s.length == 0
                ? ''
                : decodeURIComponent('%' + (s.match(/.{1,2}/g) || []).join('%'));
        }
        const encodeComment = function (s) {
            s = s.replace(new RegExp(mask(newlineChar), 'g'), ' ');
            return `{${toHex(s.slice(1, s.length - 1))}}`;
        };
        const decodeComment = function (s) {
            if (s.startsWith('{') && s.endsWith('}')) {
                return fromHex(s.slice(1, s.length - 1));
            }
        };
        // delete header to get the moves
        let ms = pgn
            .replace(headerString, '')
            .replace(
        // encode comments so they don't get deleted below
        new RegExp(`({[^}]*})+?|;([^${mask(newlineChar)}]*)`, 'g'), function (_match, bracket, semicolon) {
            return bracket !== undefined
                ? encodeComment(bracket)
                : ' ' + encodeComment(`{${semicolon.slice(1)}}`);
        })
            .replace(new RegExp(mask(newlineChar), 'g'), ' ');
        // delete recursive annotation variations
        const ravRegex = /(\([^()]+\))+?/g;
        while (ravRegex.test(ms)) {
            ms = ms.replace(ravRegex, '');
        }
        // delete move numbers
        ms = ms.replace(/\d+\.(\.\.)?/g, '');
        // delete ... indicating black to move
        ms = ms.replace(/\.\.\./g, '');
        /* delete numeric annotation glyphs */
        ms = ms.replace(/\$\d+/g, '');
        // trim and get array of moves
        let moves = ms.trim().split(new RegExp(/\s+/));
        // delete empty entries
        moves = moves.filter((move) => move !== '');
        let result = '';
        for (let halfMove = 0; halfMove < moves.length; halfMove++) {
            const comment = decodeComment(moves[halfMove]);
            if (comment !== undefined) {
                this._comments[this.fen()] = comment;
                continue;
            }
            const move = this._moveFromSan(moves[halfMove], strict);
            // invalid move
            if (move == null) {
                // was the move an end of game marker
                if (TERMINATION_MARKERS.indexOf(moves[halfMove]) > -1) {
                    result = moves[halfMove];
                }
                else {
                    throw new Error(`Invalid move in PGN: ${moves[halfMove]}`);
                }
            }
            else {
                // reset the end of game marker if making a valid move
                result = '';
                this._makeMove(move);
                this._incPositionCount(this.fen());
            }
        }
        /*
         * Per section 8.2.6 of the PGN spec, the Result tag pair must match match
         * the termination marker. Only do this when headers are present, but the
         * result tag is missing
         */
        if (result && Object.keys(this._header).length && !this._header['Result']) {
            this.header('Result', result);
        }
    }
    /*
     * Convert a move from 0x88 coordinates to Standard Algebraic Notation
     * (SAN)
     *
     * @param {boolean} strict Use the strict SAN parser. It will throw errors
     * on overly disambiguated moves (see below):
     *
     * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
     * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
     * 4. ... Ne7 is technically the valid SAN
     */
    _moveToSan(move, moves) {
        let output = '';
        if (move.flags & BITS.KSIDE_CASTLE) {
            output = 'O-O';
        }
        else if (move.flags & BITS.QSIDE_CASTLE) {
            output = 'O-O-O';
        }
        else {
            if (move.piece !== PAWN) {
                const disambiguator = getDisambiguator(move, moves);
                output += move.piece.toUpperCase() + disambiguator;
            }
            if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
                if (move.piece === PAWN) {
                    output += algebraic(move.from)[0];
                }
                output += 'x';
            }
            output += algebraic(move.to);
            if (move.promotion) {
                output += '=' + move.promotion.toUpperCase();
            }
        }
        this._makeMove(move);
        if (this.isCheck()) {
            if (this.isCheckmate()) {
                output += '#';
            }
            else {
                output += '+';
            }
        }
        this._undoMove();
        return output;
    }
    // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
    _moveFromSan(move, strict = false) {
        // strip off any move decorations: e.g Nf3+?! becomes Nf3
        const cleanMove = strippedSan(move);
        let pieceType = inferPieceType(cleanMove);
        let moves = this._moves({ legal: true, piece: pieceType });
        // strict parser
        for (let i = 0, len = moves.length; i < len; i++) {
            if (cleanMove === strippedSan(this._moveToSan(moves[i], moves))) {
                return moves[i];
            }
        }
        // the strict parser failed
        if (strict) {
            return null;
        }
        let piece = undefined;
        let matches = undefined;
        let from = undefined;
        let to = undefined;
        let promotion = undefined;
        /*
         * The default permissive (non-strict) parser allows the user to parse
         * non-standard chess notations. This parser is only run after the strict
         * Standard Algebraic Notation (SAN) parser has failed.
         *
         * When running the permissive parser, we'll run a regex to grab the piece, the
         * to/from square, and an optional promotion piece. This regex will
         * parse common non-standard notation like: Pe2-e4, Rc1c4, Qf3xf7,
         * f7f8q, b1c3
         *
         * NOTE: Some positions and moves may be ambiguous when using the permissive
         * parser. For example, in this position: 6k1/8/8/B7/8/8/8/BN4K1 w - - 0 1,
         * the move b1c3 may be interpreted as Nc3 or B1c3 (a disambiguated bishop
         * move). In these cases, the permissive parser will default to the most
         * basic interpretation (which is b1c3 parsing to Nc3).
         */
        let overlyDisambiguated = false;
        matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);
        if (matches) {
            piece = matches[1];
            from = matches[2];
            to = matches[3];
            promotion = matches[4];
            if (from.length == 1) {
                overlyDisambiguated = true;
            }
        }
        else {
            /*
             * The [a-h]?[1-8]? portion of the regex below handles moves that may be
             * overly disambiguated (e.g. Nge7 is unnecessary and non-standard when
             * there is one legal knight move to e7). In this case, the value of
             * 'from' variable will be a rank or file, not a square.
             */
            matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/);
            if (matches) {
                piece = matches[1];
                from = matches[2];
                to = matches[3];
                promotion = matches[4];
                if (from.length == 1) {
                    overlyDisambiguated = true;
                }
            }
        }
        pieceType = inferPieceType(cleanMove);
        moves = this._moves({
            legal: true,
            piece: piece ? piece : pieceType,
        });
        if (!to) {
            return null;
        }
        for (let i = 0, len = moves.length; i < len; i++) {
            if (!from) {
                // if there is no from square, it could be just 'x' missing from a capture
                if (cleanMove ===
                    strippedSan(this._moveToSan(moves[i], moves)).replace('x', '')) {
                    return moves[i];
                }
                // hand-compare move properties with the results from our permissive regex
            }
            else if ((!piece || piece.toLowerCase() == moves[i].piece) &&
                Ox88[from] == moves[i].from &&
                Ox88[to] == moves[i].to &&
                (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
                return moves[i];
            }
            else if (overlyDisambiguated) {
                /*
                 * SPECIAL CASE: we parsed a move string that may have an unneeded
                 * rank/file disambiguator (e.g. Nge7).  The 'from' variable will
                 */
                const square = algebraic(moves[i].from);
                if ((!piece || piece.toLowerCase() == moves[i].piece) &&
                    Ox88[to] == moves[i].to &&
                    (from == square[0] || from == square[1]) &&
                    (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
                    return moves[i];
                }
            }
        }
        return null;
    }
    ascii() {
        let s = '   +------------------------+\n';
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            // display the rank
            if (file(i) === 0) {
                s += ' ' + '87654321'[rank(i)] + ' |';
            }
            if (this._board[i]) {
                const piece = this._board[i].type;
                const color = this._board[i].color;
                const symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
                s += ' ' + symbol + ' ';
            }
            else {
                s += ' . ';
            }
            if ((i + 1) & 0x88) {
                s += '|\n';
                i += 8;
            }
        }
        s += '   +------------------------+\n';
        s += '     a  b  c  d  e  f  g  h';
        return s;
    }
    perft(depth) {
        const moves = this._moves({ legal: false });
        let nodes = 0;
        const color = this._turn;
        for (let i = 0, len = moves.length; i < len; i++) {
            this._makeMove(moves[i]);
            if (!this._isKingAttacked(color)) {
                if (depth - 1 > 0) {
                    nodes += this.perft(depth - 1);
                }
                else {
                    nodes++;
                }
            }
            this._undoMove();
        }
        return nodes;
    }
    turn() {
        return this._turn;
    }
    board() {
        const output = [];
        let row = [];
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            if (this._board[i] == null) {
                row.push(null);
            }
            else {
                row.push({
                    square: algebraic(i),
                    type: this._board[i].type,
                    color: this._board[i].color,
                });
            }
            if ((i + 1) & 0x88) {
                output.push(row);
                row = [];
                i += 8;
            }
        }
        return output;
    }
    squareColor(square) {
        if (square in Ox88) {
            const sq = Ox88[square];
            return (rank(sq) + file(sq)) % 2 === 0 ? 'light' : 'dark';
        }
        return null;
    }
    history({ verbose = false } = {}) {
        const reversedHistory = [];
        const moveHistory = [];
        while (this._history.length > 0) {
            reversedHistory.push(this._undoMove());
        }
        while (true) {
            const move = reversedHistory.pop();
            if (!move) {
                break;
            }
            if (verbose) {
                moveHistory.push(new Move$1(this, move));
            }
            else {
                moveHistory.push(this._moveToSan(move, this._moves()));
            }
            this._makeMove(move);
        }
        return moveHistory;
    }
    /*
     * Keeps track of position occurrence counts for the purpose of repetition
     * checking. All three methods (`_inc`, `_dec`, and `_get`) trim the
     * irrelevent information from the fen, initialising new positions, and
     * removing old positions from the record if their counts are reduced to 0.
     */
    _getPositionCount(fen) {
        const trimmedFen = trimFen(fen);
        return this._positionCount[trimmedFen] || 0;
    }
    _incPositionCount(fen) {
        const trimmedFen = trimFen(fen);
        if (this._positionCount[trimmedFen] === undefined) {
            this._positionCount[trimmedFen] = 0;
        }
        this._positionCount[trimmedFen] += 1;
    }
    _decPositionCount(fen) {
        const trimmedFen = trimFen(fen);
        if (this._positionCount[trimmedFen] === 1) {
            delete this._positionCount[trimmedFen];
        }
        else {
            this._positionCount[trimmedFen] -= 1;
        }
    }
    _pruneComments() {
        const reversedHistory = [];
        const currentComments = {};
        const copyComment = (fen) => {
            if (fen in this._comments) {
                currentComments[fen] = this._comments[fen];
            }
        };
        while (this._history.length > 0) {
            reversedHistory.push(this._undoMove());
        }
        copyComment(this.fen());
        while (true) {
            const move = reversedHistory.pop();
            if (!move) {
                break;
            }
            this._makeMove(move);
            copyComment(this.fen());
        }
        this._comments = currentComments;
    }
    getComment() {
        return this._comments[this.fen()];
    }
    setComment(comment) {
        this._comments[this.fen()] = comment.replace('{', '[').replace('}', ']');
    }
    /**
     * @deprecated Renamed to `removeComment` for consistency
     */
    deleteComment() {
        return this.removeComment();
    }
    removeComment() {
        const comment = this._comments[this.fen()];
        delete this._comments[this.fen()];
        return comment;
    }
    getComments() {
        this._pruneComments();
        return Object.keys(this._comments).map((fen) => {
            return { fen: fen, comment: this._comments[fen] };
        });
    }
    /**
     * @deprecated Renamed to `removeComments` for consistency
     */
    deleteComments() {
        return this.removeComments();
    }
    removeComments() {
        this._pruneComments();
        return Object.keys(this._comments).map((fen) => {
            const comment = this._comments[fen];
            delete this._comments[fen];
            return { fen: fen, comment: comment };
        });
    }
    setCastlingRights(color, rights) {
        for (const side of [KING, QUEEN]) {
            if (rights[side] !== undefined) {
                if (rights[side]) {
                    this._castling[color] |= SIDES[side];
                }
                else {
                    this._castling[color] &= ~SIDES[side];
                }
            }
        }
        this._updateCastlingRights();
        const result = this.getCastlingRights(color);
        return ((rights[KING] === undefined || rights[KING] === result[KING]) &&
            (rights[QUEEN] === undefined || rights[QUEEN] === result[QUEEN]));
    }
    getCastlingRights(color) {
        return {
            [KING]: (this._castling[color] & SIDES[KING]) !== 0,
            [QUEEN]: (this._castling[color] & SIDES[QUEEN]) !== 0,
        };
    }
    moveNumber() {
        return this._moveNumber;
    }
}

const animationTime = {
    'fast': 200,
    'slow': 600,
    'normal': 400,
    'verySlow': 1000,
    'veryFast': 100
};

const boolValues = {
    'true': true,
    'false': false,
    'none': false,
    1: true,
    0: false
};

const transitionFunctions = {
    'ease': 'ease',
    'linear': 'linear',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'none': null
};

class ChessboardConfig {
    constructor(settings) {
        const defaults = {
            id: 'board',
            position: 'start',
            orientation: 'w',
            mode: 'normal',
            size: 'auto',
            draggable: true,
            hints: true,
            clickable: true,
            movableColors: 'both',
            moveHighlight: true,
            overHighlight: true,
            moveAnimation: 'ease',
            moveTime: 'fast',
            dropOffBoard: 'snapback',
            snapbackTime: 'fast',
            snapbackAnimation: 'ease',
            fadeTime: 'fast',
            fadeAnimation: 'ease',
            ratio: 0.9,
            piecesPath: '../assets/themes/default',
            onMove: () => true,
            onMoveEnd: () => true,
            onChange: () => true,
            onDragStart: () => true,
            onDragMove: () => true,
            onDrop: () => true,
            onSnapbackEnd: () => true,
            whiteSquare: '#f0d9b5',
            blackSquare: '#b58863',
            highlight: 'yellow',
            selectedSquareWhite: '#ababaa',
            selectedSquareBlack: '#ababaa',
            movedSquareWhite: '#f1f1a0',
            movedSquareBlack: '#e9e981',
            choiceSquare: 'white',
            coverSquare: 'black',
            hintColor: '#ababaa'
        };

        const config = Object.assign({}, defaults, settings);

        this.id_div = config.id;
        this.position = config.position;
        this.orientation = config.orientation;
        this.mode = config.mode;
        this.dropOffBoard = config.dropOffBoard;
        this.size = config.size;
        this.movableColors = config.movableColors;
        this.piecesPath = config.piecesPath;
        this.onMove = config.onMove;
        this.onMoveEnd = config.onMoveEnd;
        this.onChange = config.onChange;
        this.onDragStart = config.onDragStart;
        this.onDragMove = config.onDragMove;
        this.onDrop = config.onDrop;
        this.onSnapbackEnd = config.onSnapbackEnd;

        this.moveAnimation = this.setTransitionFunction(config.moveAnimation);
        this.snapbackAnimation = this.setTransitionFunction(config.snapbackAnimation);
        this.fadeAnimation = this.setTransitionFunction(config.fadeAnimation);

        this.hints = this.setBoolean(config.hints);
        this.clickable = this.setBoolean(config.clickable);
        this.draggable = this.setBoolean(config.draggable);
        this.moveHighlight = this.setBoolean(config.moveHighlight);
        this.overHighlight = this.setBoolean(config.overHighlight);

        this.moveTime = this.setTime(config.moveTime);
        this.snapbackTime = this.setTime(config.snapbackTime);
        this.fadeTime = this.setTime(config.fadeTime);

        this.setCSSProperty('pieceRatio', config.ratio);
        this.setCSSProperty('whiteSquare', config.whiteSquare);
        this.setCSSProperty('blackSquare', config.blackSquare);
        this.setCSSProperty('highlightSquare', config.highlight);
        this.setCSSProperty('selectedSquareWhite', config.selectedSquareWhite);
        this.setCSSProperty('selectedSquareBlack', config.selectedSquareBlack);
        this.setCSSProperty('movedSquareWhite', config.movedSquareWhite);
        this.setCSSProperty('movedSquareBlack', config.movedSquareBlack);
        this.setCSSProperty('choiceSquare', config.choiceSquare);
        this.setCSSProperty('coverSquare', config.coverSquare);
        this.setCSSProperty('hintColor', config.hintColor);

        // Configure modes
        if (this.mode === 'creative') {
            this.onlyLegalMoves = false;
            this.hints = false;
        } else if (this.mode === 'normal') {
            this.onlyLegalMoves = true;
        }
    }

    setCSSProperty(property, value) {
        document.documentElement.style.setProperty(`--${property}`, value);
    }

    setOrientation(orientation) {
        this.orientation = orientation;
        return this;
    }

    setTime(value) {
        if (typeof value === 'number') return value;
        if (value in animationTime) return animationTime[value];
        throw new Error('Invalid time value');
    }

    setBoolean(value) {
        if (typeof value === 'boolean') return value;
        if (value in boolValues) return boolValues[value];
        throw new Error('Invalid boolean value');
    }

    setTransitionFunction(value) {
        // Handle boolean values - true means use default 'ease', false/null means no animation
        if (typeof value === 'boolean') {
            return value ? transitionFunctions['ease'] : null;
        }
        
        // Handle string values
        if (typeof value === 'string' && value in transitionFunctions) {
            return transitionFunctions[value];
        }
        
        // Handle null/undefined
        if (value === null || value === undefined) {
            return null;
        }
        
        throw new Error('Invalid transition function');
    }
}

class Piece {
    constructor(color, type, src, opacity = 1) {
        this.color = color;
        this.type = type;
        this.id = this.getId();
        this.src = src;
        this.element = this.createElement(src, opacity);

        this.check();
    }

    getId() { return this.type + this.color }

    createElement(opacity) {
        let element = document.createElement("img");
        element.classList.add("piece");
        element.id = this.id;
        element.src = this.src;
        element.style.opacity = opacity;
        return element;
    }

    visible() { this.element.style.opacity = 1; }

    invisible() { this.element.style.opacity = 0; }

    fadeIn(duration, speed, transition_f) {
        let start = performance.now();
        let opacity = 0;
        let piece = this;
        let fade = function () {
            let elapsed = performance.now() - start;
            opacity = transition_f(elapsed, duration, speed);
            piece.element.style.opacity = opacity;
            if (elapsed < duration) {
                requestAnimationFrame(fade);
            } else {
                piece.element.style.opacity = 1;
            }
        };
        fade();
    }

    fadeOut(duration, speed, transition_f) {
        let start = performance.now();
        let opacity = 1;
        let piece = this;
        let fade = function () {
            let elapsed = performance.now() - start;
            opacity = 1 - transition_f(elapsed, duration, speed);
            piece.element.style.opacity = opacity;
            if (elapsed < duration) {
                requestAnimationFrame(fade);
            } else {
                piece.element.style.opacity = 0;
            }
        };
        fade();
    }

    setDrag(f) {
        this.element.ondragstart = (e) => { e.preventDefault(); };
        this.element.onmousedown = f;
    }

    destroy() {
        this.element.remove();
    }

    translate(to, duration, transition_f, speed, callback = null) {

        let sourceRect = this.element.getBoundingClientRect();
        let targetRect = to.getBoundingClientRect();
        let x_start = sourceRect.left + sourceRect.width / 2;
        let y_start = sourceRect.top + sourceRect.height / 2;
        let x_end = targetRect.left + targetRect.width / 2;
        let y_end = targetRect.top + targetRect.height / 2;
        let dx = x_end - x_start;
        let dy = y_end - y_start;

        let keyframes = [
            { transform: 'translate(0, 0)' },
            { transform: `translate(${dx}px, ${dy}px)` }
        ];

        if (this.element.animate) {
            let animation = this.element.animate(keyframes, {
                duration: duration,
                easing: 'ease',
                fill: 'none'
            });

            animation.onfinish = () => {
                if (callback) callback();
                this.element.style = '';
            };
        } else {
            this.element.style.transition = `transform ${duration}ms ease`;
            this.element.style.transform = `translate(${dx}px, ${dy}px)`;
            if (callback) callback();
            this.element.style = '';
        }
    }

    check() {
        if (['p', 'r', 'n', 'b', 'q', 'k'].indexOf(this.type) === -1) {
            throw new Error("Invalid piece type");
        }

        if (['w', 'b'].indexOf(this.color) === -1) {
            throw new Error("Invalid piece color");
        }
    }
}

class Square {

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.id = this.getId();
        this.element = this.createElement();
        this.piece = null;
    }

    getPiece() {
        return this.piece;
    }

    opposite() {
        this.row = 9 - this.row;
        this.col = 9 - this.col;
        this.id = this.getId();
        this.element = this.resetElement();
    }

    isWhite() {
        return (this.row + this.col) % 2 === 0;
    }

    getId() {
        let letters = 'abcdefgh';
        let letter = letters[this.col - 1];
        return letter + this.row;
    }

    resetElement() {
        this.element.id = this.id;
        this.element.className = '';
        this.element.classList.add('square');
        this.element.classList.add(this.isWhite() ? 'whiteSquare' : 'blackSquare');
    }

    createElement() {
        let element = document.createElement('div');
        element.id = this.id;
        element.classList.add('square');
        element.classList.add(this.isWhite() ? 'whiteSquare' : 'blackSquare');
        return element;
    }

    getElement() {
        return this.element;
    }

    getBoundingClientRect() {
        return this.element.getBoundingClientRect();
    }

    removePiece() {
        if (!this.piece) {
            return null;
        }
        this.element.removeChild(this.piece.element);
        const piece = this.piece;
        this.piece = null;
        return piece;
    }

    addEventListener(event, callback) {
        this.element.addEventListener(event, callback);
    }

    putPiece(piece) {
        this.piece = piece;
        this.element.appendChild(piece.element);
    }

    putHint(catchable) {
        if (this.element.querySelector('.hint')) {
            return;
        }
        let hint = document.createElement("div");
        hint.classList.add('hint');
        this.element.appendChild(hint);
        if (catchable) {
            hint.classList.add('catchable');
        }
    }

    removeHint() {
        let hint = this.element.querySelector('.hint');
        if (hint) {
            this.element.removeChild(hint);
        }
    }

    select() {
        this.element.classList.add(this.isWhite() ? 'selectedSquareWhite' : 'selectedSquareBlack');
    }

    deselect() {
        this.element.classList.remove('selectedSquareWhite');
        this.element.classList.remove('selectedSquareBlack');
    }

    moved() {
        this.element.classList.add(this.isWhite() ? 'movedSquareWhite' : 'movedSquareBlack');
    }

    unmoved() {
        this.element.classList.remove('movedSquareWhite');
        this.element.classList.remove('movedSquareBlack');
    }

    highlight() {
        this.element.classList.add('highlighted');
    }

    dehighlight() {
        this.element.classList.remove('highlighted');
    }

    putCover(callback) {
        let cover = document.createElement("div");
        cover.classList.add('square');
        cover.classList.add('cover');
        this.element.appendChild(cover);
        cover.addEventListener('click', (e) => {
            e.stopPropagation();
            callback();
        });
    }

    removeCover() {
        let cover = this.element.querySelector('.cover');
        if (cover) {
            this.element.removeChild(cover);
        }
    }

    putPromotion(src, callback) {
        let choice = document.createElement("div");
        choice.classList.add('square');
        choice.classList.add('choice');
        this.element.appendChild(choice);
        let img = document.createElement("img");
        img.classList.add("piece");
        img.classList.add("choicable");
        img.src = src;
        choice.appendChild(img);
        choice.addEventListener('click', (e) => {
            e.stopPropagation();
            callback();
        });

    }

    removePromotion() {
        let choice = this.element.querySelector('.choice');
        if (choice) {
            choice.removeChild(choice.firstChild);
            this.element.removeChild(choice);
        }
    }

    destroy() {
        this.element.remove();
    }

    hasPiece() {
        return this.piece !== null;
    }

    getColor() {
        return this.piece.getColor();
    }

    check() {
        if (this.row < 1 || this.row > 8) {
            throw new Error("Invalid square: row is out of bounds");
        }
        if (this.col < 1 || this.col > 8) {
            throw new Error("Invalid square: col is out of bounds");
        }
        
    }
}

class Move {

    constructor(from, to, promotion = null, check = false) {
        this.piece = from ? from.getPiece() : null;
        this.from = from;
        this.to = to;
        this.promotion = promotion;

        if (check) this.check();
    }

    hasPromotion() {
        return this.promotion !== null;
    }

    setPromotion(promotion) {
        this.promotion = promotion;
    }

    check() {
        if (this.piece === null) return false;
        if (!(this.piece instanceof Piece)) return false;
        if (['q', 'r', 'b', 'n', null].indexOf(this.promotion) === -1) return false;
        if (!(this.from instanceof Square)) return false;
        if (!(this.to instanceof Square)) return false;
        if (!this.to) return false;
        if (!this.from) return false;
        if (this.from === this.to) return false;
        return true;
    }

    isLegal(game) {
        let destinations = game.moves({ square: this.from.id, verbose: true }).map(move => move.to);
        return destinations.indexOf(this.to.id) !== -1;
    }


}

/**
 * Performance utilities for smooth interactions
 */

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Request animation frame throttle for smooth animations
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF throttled function
 */
function rafThrottle(func) {
    let isThrottled = false;
    return function() {
        if (isThrottled) return;
        
        const args = arguments;
        const context = this;
        
        isThrottled = true;
        requestAnimationFrame(() => {
            func.apply(context, args);
            isThrottled = false;
        });
    };
}

/**
 * High performance transform utility
 * @param {HTMLElement} element - Element to transform
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} scale - Scale factor
 */
function setTransform(element, x, y, scale = 1) {
    // Use transform3d for hardware acceleration
    element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
}

/**
 * Reset element position efficiently
 * @param {HTMLElement} element - Element to reset
 */
function resetTransform(element) {
    element.style.transform = '';
    element.style.left = '';
    element.style.top = '';
}

/**
 * Cross-browser utilities for consistent drag & drop behavior
 */

/**
 * Detect browser type and version
 * @returns {Object} Browser information
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    const isChrome = ua.includes('Chrome') && !ua.includes('Edg');
    const isFirefox = ua.includes('Firefox');
    const isSafari = ua.includes('Safari') && !ua.includes('Chrome');
    const isEdge = ua.includes('Edg');
    
    return {
        isChrome,
        isFirefox,
        isSafari,
        isEdge,
        devicePixelRatio: window.devicePixelRatio || 1,
        userAgent: ua
    };
}

/**
 * Browser-specific drag optimizations
 */
const DragOptimizations = {
    /**
     * Apply browser-specific optimizations to an element
     * @param {HTMLElement} element - Element to optimize
     */
    enableForDrag(element) {
        const browserInfo = getBrowserInfo();
        
        // Base optimizations for all browsers
        element.style.willChange = 'left, top';
        element.style.pointerEvents = 'none'; // Prevent conflicts
        
        // Chrome-specific optimizations
        if (browserInfo.isChrome) {
            element.style.transform = 'translateZ(0)'; // Force hardware acceleration
        }
        
        // Firefox-specific optimizations
        if (browserInfo.isFirefox) {
            element.style.backfaceVisibility = 'hidden';
        }
    },
    
    /**
     * Clean up optimizations after drag
     * @param {HTMLElement} element - Element to clean up
     */
    cleanupAfterDrag(element) {
        element.style.willChange = 'auto';
        element.style.pointerEvents = '';
        element.style.transform = '';
        element.style.backfaceVisibility = '';
    }
};

let Chessboard$1 = class Chessboard {

    standard_positions = {
        'start': 'start',
        'default': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    }

    error_messages = {
        'invalid_position': 'Invalid position - ',
        'invalid_id_div': 'Board id not found - ',
        'invalid_value': 'Invalid value - ',
        'invalid_piece': 'Invalid piece - ',
        'invalid_square': 'Invalid square - ',
        'invalid_fen': 'Invalid fen - ',
        'invalid_orientation': 'Invalid orientation - ',
        'invalid_color': 'Invalid color - ',
        'invalid_mode': 'Invalid mode - ',
        'invalid_dropOffBoard': 'Invalid dropOffBoard - ',
        'invalid_snapbackTime': 'Invalid snapbackTime - ',
        'invalid_snapbackAnimation': 'Invalid snapbackAnimation - ',
        'invalid_fadeTime': 'Invalid fadeTime - ',
        'invalid_fadeAnimation': 'Invalid fadeAnimation - ',
        'invalid_ratio': 'Invalid ratio - ',
        'invalid_piecesPath': 'Invalid piecesPath - ',
        'invalid_onMove': 'Invalid onMove - ',
        'invalid_onMoveEnd': 'Invalid onMoveEnd - ',
        'invalid_onChange': 'Invalid onChange - ',
        'invalid_onDragStart': 'Invalid onDragStart - ',
        'invalid_onDragMove': 'Invalid onDragMove - ',
        'invalid_onDrop': 'Invalid onDrop - ',
        'invalid_onSnapbackEnd': 'Invalid onSnapbackEnd - ',
        'invalid_whiteSquare': 'Invalid whiteSquare - ',
        'invalid_blackSquare': 'Invalid blackSquare - ',
        'invalid_highlight': 'Invalid highlight - ',
        'invalid_selectedSquareWhite': 'Invalid selectedSquareWhite - ',
        'invalid_selectedSquareBlack': 'Invalid selectedSquareBlack - ',
        'invalid_movedSquareWhite': 'Invalid movedSquareWhite - ',
        'invalid_movedSquareBlack': 'Invalid movedSquareBlack - ',
        'invalid_choiceSquare': 'Invalid choiceSquare - ',
        'invalid_coverSquare': 'Invalid coverSquare - ',
        'invalid_hintColor': 'Invalid hintColor - ',
    }

    // -------------------
    // Initialization
    // -------------------
    constructor(config) {
        // Debug: log the config to see what we're receiving
        console.log('Chessboard constructor received config:', config);
        this.config = new ChessboardConfig(config);
        console.log('Processed config.id_div:', this.config.id_div);
        this.init();
    }

    init() {
        this.initParams();
        this.setGame(this.config.position);
        this.buildBoard();
        this.buildSquares();
        this.addListeners();
        this.updateBoardPieces();
    }

    initParams() {
        this.element = null;
        this.squares = {};
        this.promoting = false;
        this.clicked = null;
        this.mosseIndietro = [];
        this.clicked = null;
        this._updateTimeout = null; // For debouncing board updates
        this._movesCache = new Map(); // Cache per le mosse per migliorare le prestazioni
        this._cacheTimeout = null; // Timeout per pulire la cache
        this._isAnimating = false; // Flag to track if animations are in progress
    }

    // -------------------
    // Board Setup
    // -------------------
    buildBoard() {
        console.log('buildBoard: Looking for element with ID:', this.config.id_div, 'Type:', typeof this.config.id_div);
        this.element = document.getElementById(this.config.id_div);
        if (!this.element) {
            throw new Error(this.error_messages['invalid_id_div'] + this.config.id_div);
        }
        this.resize(this.config.size);
        this.element.className = "board";
    }

    buildSquares() {

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {

                let [square_row, square_col] = this.realCoord(row, col);
                let square = new Square(square_row, square_col);
                this.squares[square.getId()] = square;

                this.element.appendChild(square.element);
            }
        }
    }

    removeBoard() {

        this.element.innerHTML = '';
    }

    removeSquares() {
        for (const square of Object.values(this.squares)) {
            this.element.removeChild(square.element);
            square.destroy();

        }
        this.squares = {};
    }

    resize(value) {
        if (value === 'auto') {
            let size;
            if (this.element.offsetWidth === 0) {
                size = this.element.offsetHeight;
            } else if (this.element.offsetHeight === 0) {
                size = this.element.offsetWidth;
            } else {
                size = Math.min(this.element.offsetWidth, this.element.offsetHeight);
            }
            this.resize(size);
        } else if (typeof value !== 'number') {
            throw new Error(this.error_messages['invalid_value'] + value);
        } else {
            document.documentElement.style.setProperty('--dimBoard', value + 'px');
            this.updateBoardPieces();
        }
    }

    // -------------------
    // Game/Position Functions
    // -------------------
    convertFen(position) {
        if (typeof position === 'string') {
            if (position == 'start') return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            if (this.validateFen(position)) return position;
            else if (this.standard_positions[position]) return this.standard_positions[position];
            else throw new Error('Invalid position -' + position);
        } else if (typeof position === 'object') {
            let parts = [];
            for (let row = 0; row < 8; row++) {
                let rowParts = [];
                let empty = 0;
                for (let col = 0; col < 8; col++) {
                    let square = this.getSquareID(row, col);
                    let piece = position[square];
                    if (piece) {
                        if (empty > 0) {
                            rowParts.push(empty);
                            empty = 0;
                        }
                        // Convert piece notation: white pieces become uppercase, black remain lowercase.
                        let fenPiece = piece[1] === 'w' ? piece[0].toUpperCase() : piece[0].toLowerCase();
                        rowParts.push(fenPiece);
                    } else {
                        empty++;
                    }
                }
                if (empty > 0) rowParts.push(empty);
                parts.push(rowParts.join(''));
            }
            return parts.join('/') + ' w KQkq - 0 1';        } else {
            throw new Error('Invalid position -' + position);
        }
    }

    setGame(position, options = undefined) {
        const fen = this.convertFen(position);
        if (this.game) this.game.load(fen, options);
        else this.game = new Chess(fen);
    }

    // -------------------
    // Piece Functions
    // -------------------
    getPiecePath(piece) {
        if (typeof this.config.piecesPath === 'string')
            return this.config.piecesPath + '/' + piece + '.svg';
        else if (typeof this.config.piecesPath === 'object')
            return this.config.piecesPath[piece];
        else if (typeof this.config.piecesPath === 'function')
            return this.config.piecesPath(piece);
        else
            throw new Error(this.error_messages['invalid_piecesPath']);
    }

    convertPiece(piece) {
        if (piece instanceof Piece) return piece;
        if (typeof piece === 'string') {
            let [type, color] = piece.split('');
            return new Piece(color, type, this.getPiecePath(piece));
        }
        throw new Error(this.error_messages['invalid_piece'] + piece);
    }

    addPieceOnSquare(square, piece, fade = true) {

        square.putPiece(piece);
        piece.setDrag(this.dragFunction(square, piece));

        if (fade) piece.fadeIn(
            this.config.fadeTime,
            this.config.fadeAnimation,
            this.transitionTimingFunction
        );

        piece.visible();
    }

    removePieceFromSquare(square, fade = true) {

        square = this.convertSquare(square);
        square.check();

        let piece = square.piece;

        if (!piece) throw Error('Square has no piece to remove.')

        if (fade) piece.fadeOut(
            this.config.fadeTime,
            this.config.fadeAnimation,
            this.transitionTimingFunction);

        square.removePiece();

        return piece;
    }

    movePiece(piece, to, duration, callback) {
        if (!piece) {
            console.warn('movePiece: piece is null, skipping animation');
            if (callback) callback();
            return;
        }
        
        piece.translate(to, duration, this.transitionTimingFunction, this.config.moveAnimation, callback);
    }

    translatePiece(move, removeTo, animate, callback = null) {
        if (!move.piece) {
            console.warn('translatePiece: move.piece is null, skipping translation');
            if (callback) callback();
            return;
        }

        if (removeTo) this.removePieceFromSquare(move.to, false);

        let change_square = () => {
            // Check if piece still exists and is on the source square
            if (move.from.piece === move.piece) {
                move.from.removePiece();
            }
            // Only put piece if destination square doesn't already have it
            if (move.to.piece !== move.piece) {
                move.to.putPiece(move.piece);
                move.piece.setDrag(this.dragFunction(move.to, move.piece));
            }
            if (callback) callback();
        };

        let duration = animate ? this.config.moveTime : 0;

        this.movePiece(move.piece, move.to, duration, change_square);

    }

    snapbackPiece(square, animate = this.config.snapbackAnimation) {
        if (!square || !square.piece) {
            console.warn('snapbackPiece: square or piece is null', square);
            return;
        }
        
        let piece = square.piece;
        
        if (!animate) {
            // No animation, just reset the piece position immediately
            piece.element.style.transform = '';
            piece.element.style.transition = '';
            return;
        }
        
        // For snapback animation, we need to smoothly return the piece to its square
        // First, get the current visual position and target position
        let currentRect = piece.element.getBoundingClientRect();
        let targetRect = square.element.getBoundingClientRect();
        
        let dx = targetRect.left - currentRect.left + (targetRect.width - currentRect.width) / 2;
        let dy = targetRect.top - currentRect.top + (targetRect.height - currentRect.height) / 2;
        
        // Only animate if there's actually a visual displacement
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            let duration = this.config.moveTime;
            
            if (piece.element.animate) {
                let animation = piece.element.animate([
                    { transform: piece.element.style.transform || 'translate(0, 0)' },
                    { transform: 'translate(0, 0)' }
                ], {
                    duration: duration,
                    easing: 'ease-out',
                    fill: 'forwards'
                });
                
                animation.onfinish = () => {
                    piece.element.style.transform = '';
                    piece.element.style.transition = '';
                };
            } else {
                piece.element.style.transition = `transform ${duration}ms ease-out`;
                piece.element.style.transform = 'translate(0, 0)';
                
                setTimeout(() => {
                    piece.element.style.transform = '';
                    piece.element.style.transition = '';
                }, duration);
            }
        } else {
            // No visual displacement, just reset immediately
            piece.element.style.transform = '';
            piece.element.style.transition = '';
        }
    }

    // -------------------
    // Board Update Functions
    // -------------------
    updateBoardPieces(animation = false) {
        // Clear any pending update to avoid duplicate calls
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
            this._updateTimeout = null;
        }

        // Pulisce la cache delle mosse quando la posizione cambia
        this._movesCache.clear();
        if (this._cacheTimeout) {
            clearTimeout(this._cacheTimeout);
            this._cacheTimeout = null;
        }

        // For click-to-move, add a small delay to avoid lag
        if (animation && this.clicked === null) {
            this._updateTimeout = setTimeout(() => {
                this._doUpdateBoardPieces(animation);
                this._updateTimeout = null;
            }, 10);
        } else {
            this._doUpdateBoardPieces(animation);
        }
    }

    _doUpdateBoardPieces(animation = false) {
        let { updatedFlags, escapeFlags, movableFlags, pendingTranslations } = this.prepareBoardUpdateData();

        let change = Object.values(updatedFlags).some(flag => !flag);

        this.identifyPieceTranslations(updatedFlags, escapeFlags, movableFlags, pendingTranslations);

        this.executePieceTranslations(pendingTranslations, escapeFlags, animation);

        this.processRemainingPieceUpdates(updatedFlags, animation);

        if (change) this.config.onChange(this.fen());
    }

    prepareBoardUpdateData() {
        let updatedFlags = {};
        let escapeFlags = {};
        let movableFlags = {};
        let pendingTranslations = [];

        for (let squareId in this.squares) {
            let cellPiece = this.squares[squareId].piece;
            let cellPieceId = cellPiece ? cellPiece.getId() : null;
            updatedFlags[squareId] = this.getGamePieceId(squareId) === cellPieceId;
            escapeFlags[squareId] = false;
            movableFlags[squareId] = cellPiece ? this.getGamePieceId(squareId) !== cellPieceId : false;
        }

        return { updatedFlags, escapeFlags, movableFlags, pendingTranslations };
    }

    identifyPieceTranslations(updatedFlags, escapeFlags, movableFlags, pendingTranslations) {
        Object.values(this.squares).forEach(targetSquare => {
            const newPieceId = this.getGamePieceId(targetSquare.id);
            const newPiece = newPieceId && this.convertPiece(newPieceId);
            const currentPiece = targetSquare.piece;
            const currentPieceId = currentPiece ? currentPiece.getId() : null;

            if (currentPieceId === newPieceId || updatedFlags[targetSquare.id]) return;

            this.evaluateTranslationCandidates(
                targetSquare,
                newPiece,
                currentPiece,
                updatedFlags,
                escapeFlags,
                movableFlags,
                pendingTranslations
            );
        });
    }

    evaluateTranslationCandidates(targetSquare, newPiece, oldPiece, updatedFlags, escapeFlags, movableFlags, pendingTranslations) {
        if (!newPiece) return;
        const newPieceId = newPiece.getId();

        for (const sourceSquare of Object.values(this.squares)) {
            if (sourceSquare.id === targetSquare.id || updatedFlags[targetSquare.id]) continue;

            const sourcePiece = sourceSquare.piece;
            if (!sourcePiece || !movableFlags[sourceSquare.id] || this.isPiece(newPieceId, sourceSquare.id)) continue;

            if (sourcePiece.id === newPieceId) {
                this.handleTranslationMovement(targetSquare, sourceSquare, oldPiece, sourcePiece, updatedFlags, escapeFlags, movableFlags, pendingTranslations);
                break;
            }
        }
    }

    handleTranslationMovement(targetSquare, sourceSquare, oldPiece, currentSource, updatedFlags, escapeFlags, movableFlags, pendingTranslations) {
        // Verifica il caso specifico "en passant"
        let lastMove = this.lastMove();
        if (!oldPiece && lastMove && lastMove['captured'] === 'p') {
            this.removePieceFromSquare(this.squares[targetSquare.id[0] + sourceSquare.id[1]]);
        }

        pendingTranslations.push([currentSource, sourceSquare, targetSquare]);

        if (!this.getGamePieceId(sourceSquare.id)) updatedFlags[sourceSquare.id] = true;

        escapeFlags[sourceSquare.id] = true;
        movableFlags[sourceSquare.id] = false;
        updatedFlags[targetSquare.id] = true;
    }

    executePieceTranslations(pendingTranslations, escapeFlags, animation) {
        for (let [_, sourceSquare, targetSquare] of pendingTranslations) {
            let removeTarget = !escapeFlags[targetSquare.id] && targetSquare.piece;
            let moveObj = new Move(sourceSquare, targetSquare);
            this.translatePiece(moveObj, removeTarget, animation);
        }
    }

    // Gestisce gli aggiornamenti residui per ogni cella che non è ancora stata correttamente aggiornata
    processRemainingPieceUpdates(updatedFlags, animation) {
        for (const square of Object.values(this.squares)) {
            let newPieceId = this.getGamePieceId(square.id);
            let newPiece = newPieceId ? this.convertPiece(newPieceId) : null;
            let currentPiece = square.piece;
            let currentPieceId = currentPiece ? currentPiece.getId() : null;

            if (currentPieceId !== newPieceId && !updatedFlags[square.id]) {
                this.updateSinglePiece(square, newPiece, updatedFlags, animation);
            }
        }
    }

    // Aggiorna il pezzo in una cella specifica. Gestisce anche il caso di promozione
    updateSinglePiece(square, newPiece, updatedFlags, animation) {
        if (!updatedFlags[square.id]) {
            let lastMove = this.lastMove();

            if (lastMove?.promotion) {
                if (lastMove['to'] === square.id) {

                    let move = new Move(this.squares[lastMove['from']], square);
                    this.translatePiece(move, true, animation
                        , () => {
                            move.to.removePiece();
                            this.addPieceOnSquare(square, newPiece);
                        });
                }
            } else {
                if (square.piece) this.removePieceFromSquare(square);
                if (newPiece) this.addPieceOnSquare(square, newPiece);
            }
        }
    }

    // -------------------
    // Event Handlers and Drag
    // -------------------
    dragFunction(square, piece) {

        return (event) => {

            event.preventDefault();

            if (!this.config.draggable || !piece) return;

            let prec;
            let from = square;
            let to = square;

            const img = piece.element;

            if (!this.canMove(from)) return;
            if (!this.config.clickable) this.clicked = null;
            
            // For drag operations, select the source square first
            console.log('Drag started from:', from.id, 'piece:', piece.getId());
            const clickResult = this.onClick(from, true, true);
            console.log('onClick result for drag start:', clickResult);
            
            // If onClick returns true, it means the move was completed, so don't continue drag
            if (clickResult) return;

            img.style.position = 'absolute';
            img.style.zIndex = 100;
            img.classList.add('dragging'); // Add dragging class for CSS optimization
            
            DragOptimizations.enableForDrag(img);

            const moveAt = (event) => {
                const squareSize = this.element.offsetWidth / 8;
                
                // Get mouse coordinates - use clientX/Y for better Chrome compatibility
                let clientX, clientY;
                if (event.touches && event.touches[0]) {
                    clientX = event.touches[0].clientX;
                    clientY = event.touches[0].clientY;
                } else {
                    clientX = event.clientX;
                    clientY = event.clientY;
                }
                
                // Get board position using getBoundingClientRect for accuracy
                const boardRect = this.element.getBoundingClientRect();
                
                // Calculate position relative to board with piece centered on cursor
                // Add window scroll offset for correct positioning
                window.pageXOffset || document.documentElement.scrollLeft;
                window.pageYOffset || document.documentElement.scrollTop;
                
                const x = clientX - boardRect.left - (squareSize / 2);
                const y = clientY - boardRect.top - (squareSize / 2);
                
                img.style.left = x + 'px';
                img.style.top = y + 'px';
                return true;
            };

            const onMouseMove = (event) => {
                if (!this.config.onDragStart(square, piece)) return;
                if (!moveAt(event)) ;

                const boardRect = this.element.getBoundingClientRect();
                const { offsetWidth: boardWidth, offsetHeight: boardHeight } = this.element;
                const x = event.clientX - boardRect.left;
                const y = event.clientY - boardRect.top;

                let newTo = null;
                if (x >= 0 && x <= boardWidth && y >= 0 && y <= boardHeight) {
                    const col = Math.floor(x / (boardWidth / 8));
                    const row = Math.floor(y / (boardHeight / 8));
                    newTo = this.squares[this.getSquareID(row, col)];
                }

                to = newTo;
                this.config.onDragMove(from, to, piece);

                if (to !== prec) {
                    to?.highlight();
                    prec?.dehighlight();
                    prec = to;
                }
            };

            const onMouseUp = () => {
                prec?.dehighlight();
                document.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                img.style.zIndex = 20;
                img.classList.remove('dragging'); // Remove dragging class
                img.style.willChange = 'auto'; // Reset will-change hint

                const dropResult = this.config.onDrop(from, to, piece);
                const isTrashDrop = !to && (this.config.dropOffBoard === 'trash' || dropResult === 'trash');

                if (isTrashDrop) {
                    this.allSquares("unmoved");
                    this.allSquares('removeHint');
                    from.deselect();
                    this.remove(from);
                } else if (!to) {
                    console.log('Snapback triggered - no target square');
                    // Only perform snapback if the piece still exists on the from square
                    if (from && from.piece) {
                        this.snapbackPiece(from);
                        if (to !== from) this.config.onSnapbackEnd(from, piece);
                    }
                } else {
                    const onClickResult = this.onClick(to, true, true);
                    console.log('onClick result:', onClickResult, 'for target:', to.id);
                    if (!onClickResult) {
                        console.log('Snapback triggered - onClick failed');
                        // Only perform snapback if the piece still exists on the from square
                        if (from && from.piece) {
                            this.snapbackPiece(from);
                            if (to !== from) this.config.onSnapbackEnd(from, piece);
                        }
                    }
                }
            };

            window.addEventListener('mouseup', onMouseUp, { once: true });
            document.addEventListener('mousemove', onMouseMove);
            img.addEventListener('mouseup', onMouseUp, { once: true });
        }
    }

    addListeners() {
        for (const square of Object.values(this.squares)) {

            let piece = square.piece;

            // Applica throttling ai listener di mouseover e mouseout per migliori prestazioni
            const throttledHintMoves = rafThrottle((e) => {
                if (!this.clicked && this.config.hints) this.hintMoves(square);
            });

            const throttledDehintMoves = rafThrottle((e) => {
                if (!this.clicked && this.config.hints) this.dehintMoves(square);
            });

            square.element.addEventListener("mouseover", throttledHintMoves);
            square.element.addEventListener("mouseout", throttledDehintMoves);

            const handleClick = (e) => {
                e.stopPropagation();
                if (this.config.clickable && (!piece || this.config.onlyLegalMoves)) this.onClick(square);
            };

            square.element.addEventListener("mousedown", handleClick);
            square.element.addEventListener("touch", handleClick);
        }
    }

    onClick(square, animation = this.config.moveAnimation, dragged = false) {
        console.log('onClick called:', {
            square: square?.id,
            clicked: this.clicked?.id,
            dragged: dragged,
            squarePiece: square?.piece?.getId()
        });
        
        if (this.clicked === square) return false;

        let from = this.clicked;
        this.clicked = null;

        let promotion = null;

        if (this.promoting) {
            if (this.promoting === 'none') from = null;
            else promotion = this.promoting;

            this.promoting = false;
            this.allSquares("removePromotion");
            this.allSquares("removeCover");
        }

        if (!from) {
            console.log('onClick: No from square');
            if (this.canMove(square)) {
                if (this.config.clickable) {
                    square.select();
                    this.hintMoves(square);
                }
                this.clicked = square;
            }

            return false;
        }

        let move = new Move(from, square, promotion);
        console.log('onClick: Created move from', from.id, 'to', square.id, 'piece:', move.piece?.getId());

        move.from.deselect();

        if (!move.check()) {
            console.log('onClick: Move check failed');
            return false;
        }

        this.allSquares("removeHint");

        if (this.config.onlyLegalMoves && !move.isLegal(this.game)) {
            console.log('onClick: Move is not legal');
            return false;
        }

        if (!move.hasPromotion() && this.promote(move)) {
            console.log('onClick: Promotion required');
            return false;
        }

        if (this.config.onMove(move)) {
            console.log('onClick: onMove callback approved, executing move');
            this.move(move, animation);
            return true;
        }

        console.log('onClick: onMove callback rejected move');
        return false;
    }

    // -------------------
    // Move Functions
    // -------------------
    canMove(square) {
        if (!square.piece) return false;
        if (this.config.movableColors === 'none') return false;
        if (this.config.movableColors === 'w' && square.piece.color === 'b') return false;
        if (this.config.movableColors === 'b' && square.piece.color === 'w') return false;
        if (!this.config.onlyLegalMoves) return true;
        return square.piece.color == this.turn();
    }

    convertMove(move) {
        if (move instanceof Move) return move;
        if (typeof move == 'string') {
            let fromId = move.slice(0, 2);
            let toId = move.slice(2, 4);
            let promotion = move.slice(4, 5) ? move.slice(4, 5) : null;
            return new Move(this.squares[fromId], this.squares[toId], promotion);
        }
        throw new Error("Invalid move format");
    }

    legalMove(move) {
        let legal_moves = this.legalMoves(move.from.id);

        for (let i in legal_moves) {
            if (legal_moves[i]['to'] === move.to.id &&
                move.promotion == legal_moves[i]['promotion'])
                return true;
        }

        return false;
    }

    legalMoves(from = null, verb = true) {
        if (from) return this.game.moves({ square: from, verbose: verb });
        return this.game.moves({ verbose: verb });
    }

    move(move, animation = true) {
        move = this.convertMove(move);
        move.check();

        let from = move.from;
        let to = move.to;

        // Store the current state to avoid unnecessary recalculations
        const gameStateBefore = this.game.fen();

        if (!this.config.onlyLegalMoves) {
            let piece = this.getGamePieceId(from.id);
            this.game.remove(from.id);
            this.game.remove(to.id);
            this.game.put({ type: move.hasPromotion() ? move.promotion : piece[0], color: piece[1] }, to.id);
        } else {
            this.allSquares("unmoved");

            move = this.game.move({
                from: from.id,
                to: to.id,
                promotion: move.hasPromotion() ? move.promotion : undefined
            });

            if (move === null) {
                throw new Error("Invalid move: move could not be executed");
            }

            from.moved();
            to.moved();
            this.allSquares("removeHint");
        }

        // Only update the board if the game state actually changed
        const gameStateAfter = this.game.fen();
        if (gameStateBefore !== gameStateAfter) {
            this.updateBoardPieces(animation);
        }

        if (this.config.onlyLegalMoves) {
            this.config.onMoveEnd(move);
        }
    }

    // -------------------
    // Miscellaneous Functions
    // -------------------
    hint(squareId) {
        let square = this.squares[squareId];
        if (!this.config.hints || !square) return;
        square.putHint(square.piece && square.piece.color !== this.turn());
    }

    hintMoves(square) {
        if (!this.canMove(square)) return;
        
        // Usa la cache per evitare calcoli ripetuti delle mosse
        const cacheKey = `${square.id}-${this.game.fen()}`;
        let mosse = this._movesCache.get(cacheKey);
        
        if (!mosse) {
            mosse = this.game.moves({ square: square.id, verbose: true });
            this._movesCache.set(cacheKey, mosse);
            
            // Pulisci la cache dopo un breve ritardo per evitare accumulo di memoria
            if (this._cacheTimeout) clearTimeout(this._cacheTimeout);
            this._cacheTimeout = setTimeout(() => {
                this._movesCache.clear();
            }, 1000);
        }
        
        for (let mossa of mosse) {
            if (mossa['to'].length === 2) this.hint(mossa['to']);
        }
    }

    dehintMoves(square) {
        // Usa la cache anche per dehint per coerenza
        const cacheKey = `${square.id}-${this.game.fen()}`;
        let mosse = this._movesCache.get(cacheKey);
        
        if (!mosse) {
            mosse = this.game.moves({ square: square.id, verbose: true });
            this._movesCache.set(cacheKey, mosse);
        }
        
        for (let mossa of mosse) {
            let to = this.squares[mossa['to']];
            to.removeHint();
        }
    }

    allSquares(method) {
        for (const square of Object.values(this.squares)) {
            square[method]();
            this.squares[square.id] = square;
        }
    }

    promote(move) {

        if (!this.config.onlyLegalMoves) return false;

        let to = move.to;
        let from = move.from;
        let pezzo = this.game.get(from.id);
        let choichable = ['q', 'r', 'b', 'n'];

        if (pezzo['type'] !== 'p' || !(to.row === 1 || to.row === 8)) return false;

        for (const square of Object.values(this.squares)) {
            let distance = Math.abs(to.row - square.row);

            if (to.col === square.col && distance <= 3) {

                let pieceId = choichable[distance] + pezzo['color'];

                square.putPromotion(
                    this.getPiecePath(pieceId),
                    () => {
                        this.promoting = pieceId[0];
                        this.clicked = from;
                        this.onClick(to);
                    }
                );
            } else
                square.putCover(
                    () => {
                        this.promoting = 'none';
                        this.onClick(square);
                    });
        }

        this.clicked = from.id;

        return true;
    }

    transitionTimingFunction(elapsed, duration, type = 'ease') {
        let x = elapsed / duration;
        switch (type) {
            case 'linear':
                return x;
            case 'ease':
                return (x ** 2) * (3 - 2 * x);
            case 'ease-in':
                return x ** 2;
            case 'ease-out':
                return -1 * (x - 1) ** 2 + 1;
            case 'ease-in-out':
                return (x < 0.5) ? 2 * x ** 2 : 4 * x - 2 * x ** 2 - 1;
        }
    }

    clearSquares() {
        this.allSquares('removeHint');
        this.allSquares("deselect");
        this.allSquares("unmoved");
    }

    getGamePieceId(squareId) {
        let piece = this.game.get(squareId);
        return piece ? piece['type'] + piece['color'] : null;
    }

    isPiece(piece, square) { return this.getGamePieceId(square) === piece }

    realCoord(row, col) {
        if (this.isWhiteOriented()) row = 7 - row;
        else col = 7 - col;
        return [row + 1, col + 1];
    }

    getSquareID(row, col) {
        row = parseInt(row);
        col = parseInt(col);
        if (this.isWhiteOriented()) {
            row = 8 - row;
            col = col + 1;
        } else {
            row = row + 1;
            col = 8 - col;
        }
        let letters = 'abcdefgh';
        let letter = letters[col - 1];
        return letter + row;
    }

    convertSquare(square) {
        if (square instanceof Square) return square;
        if (typeof square === 'string' && this.squares[square]) return this.squares[square];
        throw new Error(this.error_messages['invalid_square'] + square);
    }

    // -------------------
    // User API and Chess.js Integration
    // -------------------
    getOrientation() {
        return this.config.orientation;
    }

    setOrientation(color, animation = true) {
        if (['w', 'b'].includes(color)) {
            if (color !== this.config.orientation) {
                this.flip(animation);
            }
        } else {
            throw new Error(this.error_messages['invalid_orientation'] + color);
        }
    }

    highlight(squareId) {
        let square = this.convertSquare(squareId);
        square.check();
        square.highlight();
    }

    dehighlight(squareId) {
        let square = this.convertSquare(squareId);
        square.check();
        square.dehighlight();
    }

    lastMove() {
        const moves = this.history({ verbose: true });
        return moves[moves.length - 1];
    }

    flip() {
        this.config.orientation = this.config.orientation === 'w' ? 'b' : 'w';
        this.destroy();
        this.initParams();
        this.build();
    }

    build() {
        if (this.element) this.destroy();
        this.init();
    }

    destroy() {
        this.removeSquares();
        this.removeBoard();
    }

    ascii() {
        return this.game.ascii();
    }

    board() {
        let dict = {};
        for (let squareId in this.squares) {
            let piece = this.getGamePieceId(squareId);
            if (piece) dict[squareId] = piece;
        }
        return dict;
    }

    clear(options = {}, animation = true) {
        this.game.clear(options);
        this.updateBoardPieces(animation);
    }

    fen() {
        return this.game.fen();
    }

    get(squareId) {
        const square = this.convertSquare(squareId);
        square.check();
        return square.piece;
    }

    getCastlingRights(color) {
        return this.game.getCastlingRights(color);
    }

    getComment() {
        return this.game.getComment();
    }

    getComments() {
        return this.game.getComments();
    }

    history(options = {}) {
        return this.game.history(options);
    }

    isCheckmate() {
        return this.game.isCheckmate();
    }

    isDraw() {
        return this.game.isDraw();
    }

    isDrawByFiftyMoves() {
        return this.game.isDrawByFiftyMoves();
    }

    isInsufficientMaterial() {
        return this.game.isInsufficientMaterial();
    }

    isGameOver() {
        return this.game.isGameOver();
    }

    isStalemate() {
        return this.game.isStalemate();
    }

    isThreefoldRepetition() {
        return this.game.isThreefoldRepetition();
    }

    load(position, options = {}, animation = true) {
        this.clearSquares();
        this.setGame(position, options);
        this.updateBoardPieces(animation);
    }

    loadPgn(pgn, options = {}, animation = true) {
        this.clearSquares();
        this.game.loadPgn(pgn, options);
        this.updateBoardPieces();
    }

    moveNumber() {
        return this.game.moveNumber();
    }

    moves(options = {}) {
        return this.game.moves(options);
    }

    pgn(options = {}) {
        return this.game.pgn(options);
    }

    put(pieceId, squareId, animation = true) {
        const [type, color] = pieceId.split('');
        const success = this.game.put({ type: type, color: color }, squareId);
        if (success) this.updateBoardPieces(animation);
        return success;
    }

    remove(squareId, animation = true) {
        const removedPiece = this.game.remove(squareId);
        this.updateBoardPieces(animation);
        return removedPiece;
    }

    removeComment() {
        return this.game.removeComment();
    }

    removeComments() {
        return this.game.removeComments();
    }

    removeHeader(field) {
        return this.game.removeHeader(field);
    }

    reset(animation = true) {
        this.game.reset();
        this.updateBoardPieces(animation);
    }

    setCastlingRights(color, rights) {
        return this.game.setCastlingRights(color, rights);
    }

    setComment(comment) {
        this.game.setComment(comment);
    }

    setHeader(key, value) {
        return this.game.setHeader(key, value);
    }

    squareColor(squareId) {
        return this.game.squareColor(squareId);
    }

    turn() {
        return this.game.turn();
    }

    undo() {
        const move = this.game.undo();
        if (move) this.updateBoardPieces();
        return move;
    }

    validateFen(fen) {
        return validateFen(fen);
    }

    // -------------------
    // Other Utility Functions
    // -------------------
    chageFenTurn(fen, color) {
        let parts = fen.split(' ');
        parts[1] = color;
        return parts.join(' ');
    }

    changeFenColor(fen) {
        let parts = fen.split(' ');
        parts[1] = parts[1] === 'w' ? 'b' : 'w';
        return parts.join(' ');
    }

    isWhiteOriented() { return this.config.orientation === 'w' }

};

/**
 * Chessboard.js - A beautiful, customizable chessboard widget
 * Entry point for the core library
 */


// Factory function to maintain backward compatibility
function Chessboard(containerElm, config = {}) {
    // If first parameter is an object, treat it as config
    if (typeof containerElm === 'object' && containerElm !== null) {
        return new Chessboard$1(containerElm);
    }
    
    // Otherwise, treat first parameter as element ID
    const fullConfig = { ...config, id: containerElm };
    return new Chessboard$1(fullConfig);
}

// Wrapper class that handles both calling conventions
class ChessboardWrapper extends Chessboard$1 {
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

/**
 * Coordinate utilities for Chessboard.js
 */

/**
 * Convert algebraic notation to array coordinates
 * @param {string} square - Square in algebraic notation (e.g., 'a1', 'h8')
 * @returns {Object} Object with row and col properties
 */
function algebraicToCoords(square) {
  const file = square.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
  const rank = parseInt(square[1]) - 1;    // '1' = 0, '2' = 1, etc.
  
  return { row: 7 - rank, col: file };
}

/**
 * Convert array coordinates to algebraic notation
 * @param {number} row - Row index (0-7)
 * @param {number} col - Column index (0-7)
 * @returns {string} Square in algebraic notation
 */
function coordsToAlgebraic(row, col) {
  const file = String.fromCharCode(97 + col); // 0 = 'a', 1 = 'b', etc.
  const rank = (8 - row).toString();          // 0 = '8', 1 = '7', etc.
  
  return file + rank;
}

/**
 * Get the color of a square
 * @param {string} square - Square in algebraic notation
 * @returns {string} 'light' or 'dark'
 */
function getSquareColor(square) {
  const { row, col } = algebraicToCoords(square);
  return (row + col) % 2 === 0 ? 'dark' : 'light';
}

/**
 * Check if coordinates are valid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {boolean} True if coordinates are valid
 */
function isValidCoords(row, col) {
  return row >= 0 && row <= 7 && col >= 0 && col <= 7;
}

/**
 * Check if algebraic notation is valid
 * @param {string} square - Square in algebraic notation
 * @returns {boolean} True if square notation is valid
 */
function isValidSquare$1(square) {
  if (typeof square !== 'string' || square.length !== 2) return false;
  
  const file = square[0];
  const rank = square[1];
  
  return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
}

/**
 * Validation utilities for Chessboard.js
 */

/**
 * Validate piece notation
 * @param {string} piece - Piece notation (e.g., 'wP', 'bK')
 * @returns {boolean} True if piece notation is valid
 */
function isValidPiece(piece) {
  if (typeof piece !== 'string' || piece.length !== 2) return false;
  
  const color = piece[0];
  const type = piece[1];
  
  return ['w', 'b'].includes(color) && ['P', 'R', 'N', 'B', 'Q', 'K'].includes(type);
}

/**
 * Validate position object
 * @param {Object} position - Position object with square-piece mappings
 * @returns {boolean} True if position is valid
 */
function isValidPosition(position) {
  if (typeof position !== 'object' || position === null) return false;
  
  for (const [square, piece] of Object.entries(position)) {
    if (!isValidSquare(square) || !isValidPiece(piece)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Validate FEN string format
 * @param {string} fen - FEN string
 * @returns {Object} Validation result with success and error properties
 */
function validateFenFormat(fen) {
  if (typeof fen !== 'string') {
    return { success: false, error: 'FEN must be a string' };
  }
  
  const parts = fen.split(' ');
  if (parts.length !== 6) {
    return { success: false, error: 'FEN must have 6 parts separated by spaces' };
  }
  
  // Validate piece placement
  const ranks = parts[0].split('/');
  if (ranks.length !== 8) {
    return { success: false, error: 'Piece placement must have 8 ranks' };
  }
  
  return { success: true };
}

/**
 * Validate configuration object
 * @param {Object} config - Configuration object
 * @returns {Object} Validation result with success and errors array
 */
function validateConfig(config) {
  const errors = [];
  
  if (config.orientation && !['white', 'black', 'w', 'b'].includes(config.orientation)) {
    errors.push('Invalid orientation. Must be "white", "black", "w", or "b"');
  }
  
  if (config.position && config.position !== 'start' && typeof config.position !== 'object') {
    errors.push('Invalid position. Must be "start" or a position object');
  }
  
  if (config.size && typeof config.size !== 'string' && typeof config.size !== 'number') {
    errors.push('Invalid size. Must be a string or number');
  }
  
  return {
    success: errors.length === 0,
    errors
  };
}

/**
 * Animation utilities for Chessboard.js
 */

/**
 * Get the CSS transition duration in milliseconds
 * @param {string|number} time - Time value ('fast', 'slow', or number in ms)
 * @returns {number} Duration in milliseconds
 */
function parseTime(time) {
  if (typeof time === 'number') return time;
  
  switch (time) {
    case 'fast': return 150;
    case 'slow': return 500;
    default: return 200;
  }
}

/**
 * Get the CSS transition function
 * @param {string} animation - Animation type ('ease', 'linear', etc.)
 * @returns {string} CSS transition function
 */
function parseAnimation(animation) {
  const validAnimations = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'];
  return validAnimations.includes(animation) ? animation : 'ease';
}

/**
 * Create a promise that resolves after animation completion
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise} Promise that resolves after the duration
 */
function animationPromise(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Chessboard.js - A beautiful, customizable chessboard widget
 * Main entry point for the library
 * 
 * @version 2.2.1
 * @author alepot55
 * @license ISC
 */

export { Chess, Chessboard, ChessboardConfig, Move, Piece, Square, algebraicToCoords, animationPromise, coordsToAlgebraic, Chessboard as default, getSquareColor, isValidCoords, isValidPiece, isValidPosition, isValidSquare$1 as isValidSquare, parseAnimation, parseTime, rafThrottle, resetTransform, setTransform, throttle, validateConfig, validateFen, validateFenFormat };
