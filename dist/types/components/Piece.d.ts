export default Piece;
/**
 * Chess piece component
 * @module components/Piece
 */
declare class Piece {
    constructor(color: any, type: any, src: any, opacity?: number);
    color: any;
    type: any;
    id: any;
    src: any;
    element: HTMLImageElement;
    _currentAnimation: Animation | null;
    getId(): any;
    createElement(src: any, opacity?: number): HTMLImageElement;
    visible(): void;
    invisible(): void;
    updateSrc(newSrc: any): void;
    /**
     * Transforms the piece to a new type with smooth animation
     */
    transformTo(newType: any, newSrc: any, duration?: number, callback?: null): void;
    fadeIn(duration: any, speed: any, transition_f: any, callback: any): void;
    fadeOut(duration: any, speed: any, transition_f: any, callback: any): void;
    setDrag(f: any): void;
    _dragHandler: any;
    destroy(): void;
    /**
     * Animate piece translation to target square
     * Uses Web Animations API for smooth, precise animations
     */
    translate(targetSquare: any, duration: any, transition_f: any, speed: any, callback?: null): void;
    check(): void;
}
//# sourceMappingURL=Piece.d.ts.map