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
                if (!piece.element) { if (callback) callback(); return; }
                piece.element.style.opacity = 0;
                // Remove element from DOM after fade completes
                if (piece.element.parentNode) {
                    piece.element.parentNode.removeChild(piece.element);
                }
                if (callback) callback();
            }
        }
        fade();
    }

    /**
     * Animate piece capture with configurable style
     * Uses fluid easing for smooth, connected animations
     * @param {string} style - Capture style: 'fade', 'shrink', 'instant', 'explode'
     * @param {number} duration - Animation duration in ms
     * @param {Function} callback - Callback when complete
     */
    captureAnimate(style, duration, callback) {
        if (!this.element) {
            if (callback) callback();
            return;
        }

        const element = this.element;
        const cleanup = () => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
            if (callback) callback();
        };

        // Fluid easing functions
        const smoothDecel = 'cubic-bezier(0.33, 1, 0.68, 1)';
        const smoothAccel = 'cubic-bezier(0.32, 0, 0.67, 0)';

        switch (style) {
            case 'instant':
                cleanup();
                break;

            case 'fade':
                if (element.animate) {
                    // Smooth fade with subtle scale down
                    const anim = element.animate([
                        { opacity: 1, transform: 'scale(1)' },
                        { opacity: 0, transform: 'scale(0.9)' }
                    ], { duration, easing: smoothDecel, fill: 'forwards' });
                    anim.onfinish = cleanup;
                } else {
                    element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
                    element.style.opacity = '0';
                    element.style.transform = 'scale(0.9)';
                    setTimeout(cleanup, duration);
                }
                break;

            case 'shrink':
                if (element.animate) {
                    // Smooth shrink with accelerating easing for "sucked in" feel
                    const anim = element.animate([
                        { transform: 'scale(1)', opacity: 1, offset: 0 },
                        { transform: 'scale(0.7)', opacity: 0.6, offset: 0.6 },
                        { transform: 'scale(0)', opacity: 0, offset: 1 }
                    ], { duration, easing: smoothAccel, fill: 'forwards' });
                    anim.onfinish = cleanup;
                } else {
                    element.style.transition = `transform ${duration}ms ease-in, opacity ${duration}ms ease-in`;
                    element.style.transform = 'scale(0)';
                    element.style.opacity = '0';
                    setTimeout(cleanup, duration);
                }
                break;

            case 'explode':
                if (element.animate) {
                    // Subtle expand with smooth deceleration - less dramatic
                    const anim = element.animate([
                        { transform: 'scale(1)', opacity: 1, offset: 0 },
                        { transform: 'scale(1.15)', opacity: 0.5, offset: 0.5 },
                        { transform: 'scale(1.25)', opacity: 0, offset: 1 }
                    ], { duration, easing: smoothDecel, fill: 'forwards' });
                    anim.onfinish = cleanup;
                } else {
                    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
                    element.style.transform = 'scale(1.25)';
                    element.style.opacity = '0';
                    setTimeout(cleanup, duration);
                }
                break;

            default:
                // Default to fade
                this.captureAnimate('fade', duration, callback);
                return;
        }
    }

    setDrag(f) {
        if (!this.element) { console.debug(`[Piece] setDrag: ${this.id} - element is null`); return; }
        
        // Remove any existing drag handlers first
        if (this._dragHandler) {
            this.element.removeEventListener('mousedown', this._dragHandler);
        }
        
        this.element.ondragstart = (e) => { e.preventDefault() };
        
        // Use the drag function directly without timeout
        this._dragHandler = f;
        this.element.addEventListener('mousedown', this._dragHandler);
        console.debug(`[Piece] setDrag: ${this.id}`);
    }

    destroy() {
        console.debug(`[Piece] Destroy: ${this.id}`);
        
        // Remove all event listeners
        if (this.element) {
            if (this._dragHandler) {
                this.element.removeEventListener('mousedown', this._dragHandler);
                this._dragHandler = null;
            }
            
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

    /**
     * Translate piece to target position with configurable movement style
     * Uses Chessground-style cubic easing for fluid, natural movement
     * @param {HTMLElement} to - Target element
     * @param {number} duration - Animation duration in ms
     * @param {Function} transition_f - Transition function (unused, for compatibility)
     * @param {number} speed - Speed factor (unused, for compatibility)
     * @param {Function} callback - Callback when complete
     * @param {Object} options - Movement options
     * @param {string} options.style - Movement style: 'slide', 'arc', 'hop', 'teleport', 'fade'
     * @param {string} options.easing - CSS easing function
     * @param {number} options.arcHeight - Arc height ratio (for arc/hop styles)
     * @param {string} options.landingEffect - Landing effect: 'none', 'bounce', 'pulse', 'settle'
     * @param {number} options.landingDuration - Landing effect duration in ms
     */
    translate(to, duration, transition_f, speed, callback = null, options = {}) {
        if (!this.element) {
            console.debug(`[Piece] translate: ${this.id} - element is null`);
            if (callback) callback();
            return;
        }

        const style = options.style || 'slide';
        const arcHeight = options.arcHeight || 0.3;
        const landingEffect = options.landingEffect || 'none';
        const landingDuration = options.landingDuration || 150;

        // Map easing names to Chessground-style fluid cubic-bezier curves
        // Default: smooth deceleration like Lichess/Chessground
        const easingMap = {
            'ease': 'cubic-bezier(0.33, 1, 0.68, 1)',           // Chessground default - smooth decel
            'linear': 'linear',
            'ease-in': 'cubic-bezier(0.32, 0, 0.67, 0)',       // Smooth acceleration
            'ease-out': 'cubic-bezier(0.33, 1, 0.68, 1)',      // Smooth deceleration (same as default)
            'ease-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)'    // Smooth both ways
        };
        const easing = easingMap[options.easing] || easingMap['ease'];

        // Handle teleport (instant)
        if (style === 'teleport' || duration === 0) {
            if (callback) callback();
            return;
        }

        // Handle fade style
        if (style === 'fade') {
            this._translateFade(to, duration, easing, landingEffect, landingDuration, callback);
            return;
        }

        // Calculate movement vectors
        const sourceRect = this.element.getBoundingClientRect();
        const targetRect = to.getBoundingClientRect();
        const dx = (targetRect.left + targetRect.width / 2) - (sourceRect.left + sourceRect.width / 2);
        const dy = (targetRect.top + targetRect.height / 2) - (sourceRect.top + sourceRect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Build keyframes based on style
        let keyframes;
        let animationEasing = easing;

        switch (style) {
            case 'arc':
                keyframes = this._buildArcKeyframes(dx, dy, distance, arcHeight);
                // Arc uses linear easing because the curve is in the keyframes
                animationEasing = 'linear';
                break;
            case 'hop':
                keyframes = this._buildHopKeyframes(dx, dy, distance, arcHeight);
                // Hop uses ease-out for natural landing feel
                animationEasing = 'cubic-bezier(0.33, 1, 0.68, 1)';
                break;
            case 'slide':
            default:
                keyframes = [
                    { transform: 'translate(0, 0)' },
                    { transform: `translate(${dx}px, ${dy}px)` }
                ];
        }

        // Animate
        if (this.element.animate) {
            const animation = this.element.animate(keyframes, {
                duration: duration,
                easing: animationEasing,
                fill: 'forwards'
            });

            animation.onfinish = () => {
                if (!this.element) {
                    if (callback) callback();
                    return;
                }

                // Cancel animation and move piece in DOM first
                animation.cancel();
                if (this.element) this.element.style = '';

                // Callback moves piece to new square in DOM
                if (callback) callback();

                // Apply landing effect AFTER piece is in new position
                if (landingEffect !== 'none') {
                    // Small delay to ensure DOM is updated
                    requestAnimationFrame(() => {
                        this._applyLandingEffect(landingEffect, landingDuration);
                    });
                }
            };
        } else {
            // Fallback for browsers without Web Animations API
            this.element.style.transition = `transform ${duration}ms ${animationEasing}`;
            this.element.style.transform = `translate(${dx}px, ${dy}px)`;
            setTimeout(() => {
                if (!this.element) {
                    if (callback) callback();
                    return;
                }
                if (this.element) this.element.style = '';
                if (callback) callback();

                // Apply landing effect after DOM update
                if (landingEffect !== 'none') {
                    requestAnimationFrame(() => {
                        this._applyLandingEffect(landingEffect, landingDuration);
                    });
                }
            }, duration);
        }
    }

    /**
     * Build arc-shaped keyframes (smooth parabolic curve)
     * Uses many keyframes for fluid motion without relying on easing
     * @private
     */
    _buildArcKeyframes(dx, dy, distance, arcHeight) {
        const lift = distance * arcHeight;
        const steps = 10;
        const keyframes = [];

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            // Smooth easing for horizontal movement (Chessground-style cubic)
            const easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            // Parabolic arc for vertical lift: peaks at t=0.5
            const arcT = 4 * t * (1 - t); // Parabola: 0 at t=0, 1 at t=0.5, 0 at t=1

            const x = dx * easedT;
            const y = dy * easedT - lift * arcT;

            keyframes.push({
                transform: `translate(${x}px, ${y}px)`,
                offset: t
            });
        }
        return keyframes;
    }

    /**
     * Build hop-shaped keyframes (knight-like jump with subtle scale)
     * More aggressive vertical movement, subtle scale for emphasis
     * @private
     */
    _buildHopKeyframes(dx, dy, distance, arcHeight) {
        const lift = distance * arcHeight * 1.2;
        const steps = 12;
        const keyframes = [];

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            // Chessground-style cubic easing for smooth acceleration/deceleration
            const easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            // Sharp parabolic hop - peaks earlier for snappier feel
            const hopT = Math.sin(t * Math.PI); // Sine for smooth hop curve
            // Subtle scale: peaks at 1.03 at the top of the hop
            const scale = 1 + 0.03 * hopT;

            const x = dx * easedT;
            const y = dy * easedT - lift * hopT;

            keyframes.push({
                transform: `translate(${x}px, ${y}px) scale(${scale})`,
                offset: t
            });
        }
        return keyframes;
    }

    /**
     * Translate using fade effect (smooth crossfade with scale)
     * @private
     */
    _translateFade(to, duration, easing, landingEffect, landingDuration, callback) {
        const halfDuration = duration / 2;
        // Use smooth deceleration for fade
        const fadeEasing = 'cubic-bezier(0.33, 1, 0.68, 1)';

        // Fade out with subtle scale down
        if (this.element.animate) {
            const fadeOut = this.element.animate([
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0.95)' }
            ], { duration: halfDuration, easing: fadeEasing, fill: 'forwards' });

            fadeOut.onfinish = () => {
                if (!this.element) {
                    if (callback) callback();
                    return;
                }
                // Move instantly (hidden)
                fadeOut.cancel();
                this.element.style.opacity = '0';
                this.element.style.transform = 'scale(0.95)';

                // Let parent move the piece in DOM, then fade in
                if (callback) callback();

                // Fade in at new position with subtle scale up
                requestAnimationFrame(() => {
                    if (!this.element) return;
                    const fadeIn = this.element.animate([
                        { opacity: 0, transform: 'scale(0.95)' },
                        { opacity: 1, transform: 'scale(1)' }
                    ], { duration: halfDuration, easing: fadeEasing, fill: 'forwards' });

                    fadeIn.onfinish = () => {
                        if (this.element) {
                            fadeIn.cancel();
                            this.element.style.opacity = '';
                            this.element.style.transform = '';
                            this._applyLandingEffect(landingEffect, landingDuration);
                        }
                    };
                });
            };
        } else {
            // Fallback
            this.element.style.transition = `opacity ${halfDuration}ms ease, transform ${halfDuration}ms ease`;
            this.element.style.opacity = '0';
            this.element.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (callback) callback();
                if (this.element) {
                    this.element.style.opacity = '1';
                    this.element.style.transform = 'scale(1)';
                    setTimeout(() => {
                        if (this.element) this.element.style = '';
                    }, halfDuration);
                }
            }, halfDuration);
        }
    }

    /**
     * Apply landing effect after movement completes
     * Uses spring-like overshoot easing for natural, connected feel
     * @private
     */
    _applyLandingEffect(effect, duration, callback) {
        if (!this.element || effect === 'none') {
            if (callback) callback();
            return;
        }

        let keyframes;
        // Overshoot easing for spring-like natural feel
        let effectEasing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

        switch (effect) {
            case 'bounce':
                // Subtle bounce using spring easing - single smooth bounce
                keyframes = [
                    { transform: 'translateY(0)', offset: 0 },
                    { transform: 'translateY(-5px)', offset: 0.4 },
                    { transform: 'translateY(0)', offset: 1 }
                ];
                // Use ease-out for natural deceleration
                effectEasing = 'cubic-bezier(0.33, 1, 0.68, 1)';
                break;
            case 'pulse':
                // Subtle scale pulse - less aggressive, more refined
                keyframes = [
                    { transform: 'scale(1)', offset: 0 },
                    { transform: 'scale(1.08)', offset: 0.5 },
                    { transform: 'scale(1)', offset: 1 }
                ];
                break;
            case 'settle':
                // Minimal settle - piece "clicks" into place
                keyframes = [
                    { transform: 'scale(1.02)', offset: 0 },
                    { transform: 'scale(1)', offset: 1 }
                ];
                effectEasing = 'cubic-bezier(0.33, 1, 0.68, 1)';
                break;
            default:
                if (callback) callback();
                return;
        }

        if (this.element.animate) {
            const animation = this.element.animate(keyframes, {
                duration: duration,
                easing: effectEasing,
                fill: 'forwards'
            });
            animation.onfinish = () => {
                if (this.element) animation.cancel();
                if (callback) callback();
            };
        } else {
            if (callback) callback();
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
