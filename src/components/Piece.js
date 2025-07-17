class Piece {
    constructor(color, type, src, opacity = 1) {
        this.color = color;
        this.type = type;
        this.id = this.getId();
        this.src = src;
        this.element = this.createElement(src, opacity);
        console.debug(`[Piece] Constructed: ${this.id}`);
        this.check();
    }

    getId() { return this.type + this.color }

    createElement(src, opacity = 1) {
        let element = document.createElement("img");
        element.classList.add("piece");
        element.id = this.id;
        element.src = src || this.src;
        element.style.opacity = opacity;

        // Ensure the image loads properly
        element.onerror = () => {
            console.warn('Failed to load piece image:', element.src);
        };

        return element;
    }

    visible() { if (this.element) { this.element.style.opacity = 1; console.debug(`[Piece] visible: ${this.id}`); } }

    invisible() { if (this.element) { this.element.style.opacity = 0; console.debug(`[Piece] invisible: ${this.id}`); } }

    /**
     * Updates the piece image source
     * @param {string} newSrc - New image source
     */
    updateSrc(newSrc) {
        this.src = newSrc;
        if (this.element) {
            this.element.src = newSrc;
        }
    }

    /**
     * Transforms the piece to a new type with smooth animation
     * @param {string} newType - New piece type
     * @param {string} newSrc - New image source
     * @param {number} [duration=200] - Animation duration in milliseconds
     * @param {Function} [callback] - Callback when transformation is complete
     */
    transformTo(newType, newSrc, duration = 200, callback = null) {
        if (!this.element) { console.debug(`[Piece] transformTo: ${this.id} - element is null`); if (callback) callback(); return; }
        const element = this.element;
        const oldSrc = element.src;

        // Add transformation class to disable all transitions temporarily
        element.classList.add('transforming');

        // Create a smooth scale animation for the transformation
        const scaleDown = [
            { transform: 'scale(1)', opacity: '1' },
            { transform: 'scale(0.8)', opacity: '0.7' }
        ];

        const scaleUp = [
            { transform: 'scale(0.8)', opacity: '0.7' },
            { transform: 'scale(1)', opacity: '1' }
        ];

        const halfDuration = duration / 2;

        // First animation: scale down
        if (element.animate) {
            const scaleDownAnimation = element.animate(scaleDown, {
                duration: halfDuration,
                easing: 'ease-in',
                fill: 'forwards'
            });

            scaleDownAnimation.onfinish = () => {
                if (!this.element) { console.debug(`[Piece] transformTo.scaleDown.onfinish: ${this.id} - element is null`); if (callback) callback(); return; }
                // Change the piece type and source at the smallest scale
                this.type = newType;
                this.id = this.getId();
                this.src = newSrc;
                element.src = newSrc;
                element.id = this.id;

                // Second animation: scale back up
                const scaleUpAnimation = element.animate(scaleUp, {
                    duration: halfDuration,
                    easing: 'ease-out',
                    fill: 'forwards'
                });

                scaleUpAnimation.onfinish = () => {
                    if (!this.element) { console.debug(`[Piece] transformTo.scaleUp.onfinish: ${this.id} - element is null`); if (callback) callback(); return; }
                    // Reset transform and remove transformation class
                    element.style.transform = '';
                    element.style.opacity = '';
                    element.classList.remove('transforming');

                    // Add a subtle bounce effect
                    element.classList.add('transform-complete');

                    // Remove bounce class after animation
                    setTimeout(() => {
                        if (!this.element) return;
                        element.classList.remove('transform-complete');
                    }, 400);

                    console.debug(`[Piece] transformTo complete: ${this.id}`);
                    if (callback) callback();
                };
            };
        } else {
            // Fallback for browsers without Web Animations API
            element.style.transition = `transform ${halfDuration}ms ease-in, opacity ${halfDuration}ms ease-in`;
            element.style.transform = 'scale(0.8)';
            element.style.opacity = '0.7';

            setTimeout(() => {
                if (!this.element) { console.debug(`[Piece] transformTo (fallback): ${this.id} - element is null`); if (callback) callback(); return; }
                // Change the piece
                this.type = newType;
                this.id = this.getId();
                this.src = newSrc;
                element.src = newSrc;
                element.id = this.id;

                // Scale back up
                element.style.transition = `transform ${halfDuration}ms ease-out, opacity ${halfDuration}ms ease-out`;
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';

                setTimeout(() => {
                    if (!this.element) { console.debug(`[Piece] transformTo (fallback, cleanup): ${this.id} - element is null`); if (callback) callback(); return; }
                    // Clean up
                    element.style.transition = '';
                    element.style.transform = '';
                    element.style.opacity = '';
                    element.classList.remove('transforming');

                    // Add bounce effect
                    element.classList.add('transform-complete');
                    setTimeout(() => {
                        if (!this.element) return;
                        element.classList.remove('transform-complete');
                    }, 400);

                    console.debug(`[Piece] transformTo complete (fallback): ${this.id}`);
                    if (callback) callback();
                }, halfDuration);
            }, halfDuration);
        }
    }

    fadeIn(duration, speed, transition_f, callback) {
        let start = performance.now();
        let opacity = 0;
        let piece = this;
        let fade = function () {
            if (!piece.element) { console.debug(`[Piece] fadeIn: ${piece.id} - element is null`); if (callback) callback(); return; }
            let elapsed = performance.now() - start;
            opacity = transition_f(elapsed, duration, speed);
            piece.element.style.opacity = opacity;
            if (elapsed < duration) {
                requestAnimationFrame(fade);
            } else {
                if (!piece.element) { console.debug(`[Piece] fadeIn: ${piece.id} - element is null (end)`); if (callback) callback(); return; }
                piece.element.style.opacity = 1;
                console.debug(`[Piece] fadeIn complete: ${piece.id}`);
                if (callback) callback();
            }
        }
        fade();
    }

    fadeOut(duration, speed, transition_f, callback) {
        let start = performance.now();
        let opacity = 1;
        let piece = this;
        let fade = function () {
            if (!piece.element) { console.debug(`[Piece] fadeOut: ${piece.id} - element is null`); if (callback) callback(); return; }
            let elapsed = performance.now() - start;
            opacity = 1 - transition_f(elapsed, duration, speed);
            piece.element.style.opacity = opacity;
            if (elapsed < duration) {
                requestAnimationFrame(fade);
            } else {
                if (!piece.element) { console.debug(`[Piece] fadeOut: ${piece.id} - element is null (end)`); if (callback) callback(); return; }
                piece.element.style.opacity = 0;
                console.debug(`[Piece] fadeOut complete: ${piece.id}`);
                if (callback) callback();
            }
        }
        fade();
    }

    setDrag(f) {
        if (!this.element) { console.debug(`[Piece] setDrag: ${this.id} - element is null`); return; }
        this.element.ondragstart = (e) => { e.preventDefault() };
        this.element.onmousedown = f;
        this.element.ontouchstart = f; // Drag touch
        console.debug(`[Piece] setDrag: ${this.id}`);
    }

    destroy() {
        console.debug(`[Piece] Destroy: ${this.id}`);
        // Remove all event listeners
        if (this.element) {
            this.element.onmousedown = null;
            this.element.ondragstart = null;

            // Remove from DOM
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }

            // Clear references
            this.element = null;
        }
    }

    translate(to, duration, transition_f, speed, callback = null) {
        if (!this.element) { console.debug(`[Piece] translate: ${this.id} - element is null`); if (callback) callback(); return; }
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
                if (!this.element) { console.debug(`[Piece] translate.onfinish: ${this.id} - element is null`); if (callback) callback(); return; }
                if (callback) callback();
                if (this.element) this.element.style = '';
                console.debug(`[Piece] translate complete: ${this.id}`);
            };
        } else {
            this.element.style.transition = `transform ${duration}ms ease`;
            this.element.style.transform = `translate(${dx}px, ${dy}px)`;
            if (callback) callback();
            if (this.element) this.element.style = '';
            console.debug(`[Piece] translate complete (no animate): ${this.id}`);
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
