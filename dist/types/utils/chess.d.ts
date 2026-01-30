export function validateFen(fen: any): {
    ok: boolean;
    error: string;
} | {
    ok: boolean;
    error?: never;
};
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
export const WHITE: "w";
export const BLACK: "b";
export const PAWN: "p";
export const KNIGHT: "n";
export const BISHOP: "b";
export const ROOK: "r";
export const QUEEN: "q";
export const KING: "k";
export const DEFAULT_POSITION: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
export class Move {
    constructor(chess: any, internal: any);
    color: any;
    from: string;
    to: string;
    piece: any;
    captured: any;
    promotion: any;
    /**
     * @deprecated This field is deprecated and will be removed in version 2.0.0.
     * Please use move descriptor functions instead: `isCapture`, `isPromotion`,
     * `isEnPassant`, `isKingsideCastle`, `isQueensideCastle`, `isCastle`, and
     * `isBigPawn`
     */
    flags: string;
    san: any;
    lan: string;
    before: any;
    after: any;
    isCapture(): boolean;
    isPromotion(): boolean;
    isEnPassant(): boolean;
    isKingsideCastle(): boolean;
    isQueensideCastle(): boolean;
    isBigPawn(): boolean;
}
export const SQUARES: string[];
export class Chess {
    constructor(fen?: string);
    _board: any[];
    _turn: string;
    _header: {};
    _kings: {
        w: number;
        b: number;
    };
    _epSquare: number;
    _halfMoves: number;
    _moveNumber: number;
    _history: any[];
    _comments: {};
    _castling: {
        w: number;
        b: number;
    };
    _positionCount: {};
    clear({ preserveHeaders }?: {
        preserveHeaders?: boolean | undefined;
    }): void;
    load(fen: any, { skipValidation, preserveHeaders }?: {
        skipValidation?: boolean | undefined;
        preserveHeaders?: boolean | undefined;
    }): void;
    fen(): string;
    _updateSetup(fen: any): void;
    reset(): void;
    get(square: any): any;
    put({ type, color }: {
        type: any;
        color: any;
    }, square: any): boolean;
    _put({ type, color }: {
        type: any;
        color: any;
    }, square: any): boolean;
    remove(square: any): any;
    _updateCastlingRights(): void;
    _updateEnPassantSquare(): void;
    _attacked(color: any, square: any, verbose: any): boolean | string[];
    attackers(square: any, attackedBy: any): boolean | string[];
    _isKingAttacked(color: any): boolean | string[];
    isAttacked(square: any, attackedBy: any): boolean | string[];
    isCheck(): boolean | string[];
    inCheck(): boolean | string[];
    isCheckmate(): boolean;
    isStalemate(): boolean;
    isInsufficientMaterial(): boolean;
    isThreefoldRepetition(): boolean;
    isDrawByFiftyMoves(): boolean;
    isDraw(): boolean;
    isGameOver(): boolean;
    moves({ verbose, square, piece }?: {
        verbose?: boolean | undefined;
        square?: undefined;
        piece?: undefined;
    }): string[] | Move[];
    _moves({ legal, piece, square }?: {
        legal?: boolean | undefined;
        piece?: undefined;
        square?: undefined;
    }): any[];
    move(move: any, { strict }?: {
        strict?: boolean | undefined;
    }): Move;
    _push(move: any): void;
    _makeMove(move: any): void;
    undo(): Move | null;
    _undoMove(): any;
    pgn({ newline, maxWidth }?: {
        newline?: string | undefined;
        maxWidth?: number | undefined;
    }): string;
    header(...args: any[]): {};
    setHeader(key: any, value: any): {};
    removeHeader(key: any): boolean;
    getHeaders(): {};
    loadPgn(pgn: any, { strict, newlineChar }?: {
        strict?: boolean | undefined;
        newlineChar?: string | undefined;
    }): void;
    _moveToSan(move: any, moves: any): string;
    _moveFromSan(move: any, strict?: boolean): any;
    ascii(): string;
    perft(depth: any): number;
    turn(): string;
    board(): ({
        square: string;
        type: any;
        color: any;
    } | null)[][];
    squareColor(square: any): "light" | "dark" | null;
    history({ verbose }?: {
        verbose?: boolean | undefined;
    }): (string | Move)[];
    _getPositionCount(fen: any): any;
    _incPositionCount(fen: any): void;
    _decPositionCount(fen: any): void;
    _pruneComments(): void;
    getComment(): any;
    setComment(comment: any): void;
    /**
     * @deprecated Renamed to `removeComment` for consistency
     */
    deleteComment(): any;
    removeComment(): any;
    getComments(): {
        fen: string;
        comment: any;
    }[];
    /**
     * @deprecated Renamed to `removeComments` for consistency
     */
    deleteComments(): {
        fen: string;
        comment: any;
    }[];
    removeComments(): {
        fen: string;
        comment: any;
    }[];
    setCastlingRights(color: any, rights: any): boolean;
    getCastlingRights(color: any): {
        k: boolean;
        q: boolean;
    };
    moveNumber(): number;
}
//# sourceMappingURL=chess.d.ts.map