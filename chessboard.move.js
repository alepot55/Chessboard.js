import Piece from "./chessboard.piece.js";
import Square from "./chessboard.square.js";

class Move {

    constructor(from, to, promotion = null, check = false) {
        this.piece = from.getPiece();
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
        if (this.piece === null) {
            throw new Error("Invalid move: piece is null");
        }
        if (!(this.piece instanceof Piece)) {
            throw new Error("Invalid move: piece is not an instance of Piece");
        }
        if (['q', 'r', 'b', 'n', null].indexOf(this.promotion) === -1) {
            throw new Error("Invalid move: promotion is not valid");
        }
        if (!(this.from instanceof Square)) {
            throw new Error("Invalid move: from is not an instance of Square");
        }
        if (!(this.to instanceof Square)) {
            throw new Error("Invalid move: to is not an instance of Square");
        }
        if (!this.to) {
            throw new Error("Invalid move: to is null or undefined");
        }
        if (!this.from) {
            throw new Error("Invalid move: from is null or undefined");
        }
    }

    isLegal(game) {
        let destinations = game.moves({ square: this.from.id, verbose: true }).map(move => move.to);
        return destinations.indexOf(this.to.id) !== -1;
    }


}

export default Move;