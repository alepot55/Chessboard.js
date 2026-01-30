import { default as Piece } from './Piece.js';
export default Square;
declare class Square {
    constructor(row: any, col: any);
    row: any;
    col: any;
    id: any;
    element: HTMLDivElement;
    piece: any;
    getPiece(): any;
    opposite(): void;
    isWhite(): boolean;
    getId(): any;
    resetElement(): void;
    createElement(): HTMLDivElement;
    getElement(): HTMLDivElement;
    getBoundingClientRect(): DOMRect;
    removePiece(preserve?: boolean): null;
    /**
     * Forcefully removes all pieces from this square
     */
    forceRemoveAllPieces(): void;
    /**
     * Replaces the current piece with a new one efficiently
     * @param {Piece} newPiece - The new piece to place
     */
    replacePiece(newPiece: Piece): void;
    addEventListener(event: any, callback: any): void;
    putPiece(piece: any): void;
    putHint(catchable: any): void;
    removeHint(): void;
    select(): void;
    deselect(): void;
    moved(): void;
    unmoved(): void;
    highlight(): void;
    dehighlight(): void;
    putCover(callback: any): void;
    removeCover(): void;
    putPromotion(src: any, callback: any): void;
    hasPromotion(): boolean;
    removePromotion(): void;
    destroy(): void;
    hasPiece(): boolean;
    getColor(): any;
    check(): void;
}
//# sourceMappingURL=Square.d.ts.map