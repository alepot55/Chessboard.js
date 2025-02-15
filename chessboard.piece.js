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

    visible() { this.element.style.opacity = 1 }

    invisible() { this.element.style.opacity = 0 }

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
        }
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
        }
    }

    setDrag(f) {
        this.element.ondragstart = () => false;
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
            // Fallback using CSS transition if animate is not supported
            this.element.style.transition = `transform ${duration}ms ease`;
            this.element.style.transform = `translate(${dx}px, ${dy}px)`;
            setTimeout(() => {
                if (callback) callback();
                this.element.style = '';
            }, duration);
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

export default Piece;
