import Piece from "./Piece.js";
import Square from "./Square.js";

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

export default Move;