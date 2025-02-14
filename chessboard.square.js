import Piece from "./chessboard.piece.js";

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
        this.element.removeChild(this.piece.getElement());
        this.piece = null;
    }

    addEventListener(event, callback) {
        this.element.addEventListener(event, callback);
    }

    putPiece(piece) {
        this.piece = piece;
        this.element.appendChild(piece.getElement());
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


}

export default Square;