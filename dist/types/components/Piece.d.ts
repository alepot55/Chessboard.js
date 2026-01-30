export default Piece;
declare class Piece {
    constructor(color: any, type: any, src: any, opacity?: number);
    color: any;
    type: any;
    id: any;
    src: any;
    element: HTMLImageElement;
    getId(): any;
    createElement(src: any, opacity?: number): HTMLImageElement;
    visible(): void;
    invisible(): void;
    /**
     * Updates the piece image source
     * @param {string} newSrc - New image source
     */
    updateSrc(newSrc: string): void;
    /**
     * Transforms the piece to a new type with smooth animation
     * @param {string} newType - New piece type
     * @param {string} newSrc - New image source
     * @param {number} [duration=200] - Animation duration in milliseconds
     * @param {Function} [callback] - Callback when transformation is complete
     */
    transformTo(newType: string, newSrc: string, duration?: number, callback?: Function): void;
    fadeIn(duration: any, speed: any, transition_f: any, callback: any): void;
    fadeOut(duration: any, speed: any, transition_f: any, callback: any): void;
    setDrag(f: any): void;
    _dragHandler: any;
    destroy(): void;
    translate(to: any, duration: any, transition_f: any, speed: any, callback?: null): void;
    check(): void;
}
//# sourceMappingURL=Piece.d.ts.map