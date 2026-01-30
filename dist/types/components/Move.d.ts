export default Move;
declare class Move {
    constructor(from: any, to: any, promotion?: null, check?: boolean);
    piece: any;
    from: any;
    to: any;
    promotion: any;
    hasPromotion(): boolean;
    setPromotion(promotion: any): void;
    check(): boolean;
    isLegal(game: any): boolean;
}
//# sourceMappingURL=Move.d.ts.map