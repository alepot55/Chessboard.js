/**
 * Chess piece component
 * @module components/Piece
 */

class Piece {
  constructor(color, type, src, opacity = 1) {
    this.color = color;
    this.type = type;
    this.id = this.getId();
    this.src = src;
    this.element = this.createElement(src, opacity);
    this._currentAnimation = null;
    this.check();
  }

  getId() {
    return this.type + this.color;
  }

  createElement(src, opacity = 1) {
    const element = document.createElement('img');
    element.classList.add('piece');
    element.id = this.id;
    element.src = src || this.src;
    element.style.opacity = opacity;
    element.draggable = false;

    element.onerror = () => {
      console.warn('Failed to load piece image:', element.src);
    };

    return element;
  }

  visible() {
    if (this.element) {
      this.element.style.opacity = 1;
    }
  }

  invisible() {
    if (this.element) {
      this.element.style.opacity = 0;
    }
  }

  updateSrc(newSrc) {
    this.src = newSrc;
    if (this.element) {
      this.element.src = newSrc;
    }
  }

  /**
   * Transforms the piece to a new type with smooth animation
   */
  transformTo(newType, newSrc, duration = 200, callback = null) {
    if (!this.element) {
      if (callback) callback();
      return;
    }

    const element = this.element;
    element.classList.add('transforming');

    const halfDuration = duration / 2;

    // Scale down animation
    const scaleDownAnim = element.animate(
      [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0.7)', opacity: 0.5 },
      ],
      { duration: halfDuration, easing: 'ease-in', fill: 'forwards' }
    );

    scaleDownAnim.onfinish = () => {
      if (!this.element) {
        if (callback) callback();
        return;
      }

      // Update piece data
      this.type = newType;
      this.id = this.getId();
      this.src = newSrc;
      element.src = newSrc;
      element.id = this.id;

      // Scale up animation
      const scaleUpAnim = element.animate(
        [
          { transform: 'scale(0.7)', opacity: 0.5 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        { duration: halfDuration, easing: 'ease-out', fill: 'forwards' }
      );

      scaleUpAnim.onfinish = () => {
        if (!this.element) {
          if (callback) callback();
          return;
        }

        // Clean up
        scaleDownAnim.cancel();
        scaleUpAnim.cancel();
        element.style.transform = '';
        element.style.opacity = '';
        element.classList.remove('transforming');

        if (callback) callback();
      };
    };
  }

  fadeIn(duration, speed, transition_f, callback) {
    if (!this.element) {
      if (callback) callback();
      return;
    }

    const start = performance.now();

    const fade = () => {
      if (!this.element) {
        if (callback) callback();
        return;
      }

      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      this.element.style.opacity = progress;

      if (progress < 1) {
        requestAnimationFrame(fade);
      } else {
        this.element.style.opacity = 1;
        if (callback) callback();
      }
    };

    fade();
  }

  fadeOut(duration, speed, transition_f, callback) {
    if (!this.element) {
      if (callback) callback();
      return;
    }

    const start = performance.now();

    const fade = () => {
      if (!this.element) {
        if (callback) callback();
        return;
      }

      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      this.element.style.opacity = 1 - progress;

      if (progress < 1) {
        requestAnimationFrame(fade);
      } else {
        this.element.style.opacity = 0;
        if (callback) callback();
      }
    };

    fade();
  }

  setDrag(f) {
    if (!this.element) return;

    // Remove existing handler
    if (this._dragHandler) {
      this.element.removeEventListener('mousedown', this._dragHandler);
      this.element.removeEventListener('touchstart', this._dragHandler);
    }

    this.element.ondragstart = (e) => e.preventDefault();

    this._dragHandler = f;
    this.element.addEventListener('mousedown', this._dragHandler);
    this.element.addEventListener('touchstart', this._dragHandler, { passive: false });
  }

  destroy() {
    // Cancel any running animation
    if (this._currentAnimation) {
      this._currentAnimation.cancel();
      this._currentAnimation = null;
    }

    if (this.element) {
      if (this._dragHandler) {
        this.element.removeEventListener('mousedown', this._dragHandler);
        this.element.removeEventListener('touchstart', this._dragHandler);
        this._dragHandler = null;
      }

      this.element.onmousedown = null;
      this.element.ondragstart = null;

      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }

      this.element = null;
    }
  }

  /**
   * Animate piece translation to target square
   * Uses Web Animations API for smooth, precise animations
   */
  translate(targetSquare, duration, transition_f, speed, callback = null) {
    if (!this.element || !targetSquare) {
      if (callback) callback();
      return;
    }

    // Cancel any existing animation
    if (this._currentAnimation) {
      this._currentAnimation.cancel();
      this._currentAnimation = null;
    }

    // If duration is 0, skip animation
    if (duration <= 0) {
      if (callback) callback();
      return;
    }

    // Calculate translation distance
    const sourceRect = this.element.getBoundingClientRect();
    const targetRect = targetSquare.element
      ? targetSquare.element.getBoundingClientRect()
      : targetSquare.getBoundingClientRect();

    const dx = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
    const dy = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

    // Skip animation if already at target (within 1px tolerance)
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
      if (callback) callback();
      return;
    }

    // Create animation with fill:forwards to maintain position until DOM update
    const animation = this.element.animate(
      [{ transform: 'translate(0, 0)' }, { transform: `translate(${dx}px, ${dy}px)` }],
      {
        duration,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth easing
        fill: 'forwards', // Keep final position until we clean up
      }
    );

    this._currentAnimation = animation;

    animation.onfinish = () => {
      if (!this.element) {
        if (callback) callback();
        return;
      }

      // First: call the callback which moves the piece in the DOM
      // At this point, the animation is keeping the piece visually in place
      if (callback) callback();

      // Then: cancel the animation and reset transform
      // The piece is now in the correct DOM position, so this won't cause a jump
      requestAnimationFrame(() => {
        if (this._currentAnimation === animation) {
          animation.cancel();
          this._currentAnimation = null;
        }
        if (this.element) {
          this.element.style.transform = '';
        }
      });
    };

    animation.oncancel = () => {
      if (this._currentAnimation === animation) {
        this._currentAnimation = null;
      }
    };
  }

  check() {
    if (!['p', 'r', 'n', 'b', 'q', 'k'].includes(this.type)) {
      throw new Error('Invalid piece type: ' + this.type);
    }
    if (!['w', 'b'].includes(this.color)) {
      throw new Error('Invalid piece color: ' + this.color);
    }
  }
}

export default Piece;
