/**
 * Cross-browser utilities for consistent drag & drop behavior
 */

/**
 * Detect browser type and version
 * @returns {Object} Browser information
 */
export function getBrowserInfo() {
    const ua = navigator.userAgent;
    const isChrome = ua.includes('Chrome') && !ua.includes('Edg');
    const isFirefox = ua.includes('Firefox');
    const isSafari = ua.includes('Safari') && !ua.includes('Chrome');
    const isEdge = ua.includes('Edg');
    
    return {
        isChrome,
        isFirefox,
        isSafari,
        isEdge,
        devicePixelRatio: window.devicePixelRatio || 1,
        userAgent: ua
    };
}

/**
 * Get accurate mouse coordinates accounting for browser differences
 * @param {MouseEvent} event - Mouse event
 * @returns {Object} Normalized coordinates
 */
export function getNormalizedCoordinates(event) {
    const browserInfo = getBrowserInfo();
    
    // Base coordinates
    let x = event.clientX;
    let y = event.clientY;
    
    // Add scroll offset for absolute positioning
    x += window.scrollX || window.pageXOffset || 0;
    y += window.scrollY || window.pageYOffset || 0;
    
    // Chrome-specific adjustments if needed
    if (browserInfo.isChrome) {
        // Chrome sometimes has sub-pixel rendering differences
        x = Math.round(x);
        y = Math.round(y);
    }
    
    return { x, y };
}

/**
 * Set element position using the most compatible method
 * @param {HTMLElement} element - Element to position
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
export function setElementPosition(element, x, y) {
    // Ensure pixel-perfect positioning
    element.style.left = `${Math.round(x)}px`;
    element.style.top = `${Math.round(y)}px`;
}

/**
 * Calculate offset from center for drag positioning
 * @param {HTMLElement} element - Element being dragged
 * @param {number} mouseX - Mouse X coordinate
 * @param {number} mouseY - Mouse Y coordinate
 * @returns {Object} Position coordinates
 */
export function calculateDragPosition(element, mouseX, mouseY) {
    const rect = element.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;
    
    return {
        x: mouseX - halfWidth,
        y: mouseY - halfHeight
    };
}

/**
 * Enhanced mouse coordinate tracking for cross-browser compatibility
 */
export class MouseTracker {
    constructor() {
        this.lastKnownPosition = { x: 0, y: 0 };
        this.browserInfo = getBrowserInfo();
    }
    
    /**
     * Update position from mouse event
     * @param {MouseEvent} event - Mouse event
     * @returns {Object} Normalized position
     */
    updatePosition(event) {
        const coords = getNormalizedCoordinates(event);
        this.lastKnownPosition = coords;
        return coords;
    }
    
    /**
     * Get element position for dragging
     * @param {HTMLElement} element - Element to position
     * @param {MouseEvent} event - Mouse event
     * @returns {Object} Position for the element
     */
    getDragPosition(element, event) {
        const mousePos = this.updatePosition(event);
        return calculateDragPosition(element, mousePos.x, mousePos.y);
    }
}

/**
 * Browser-specific drag optimizations
 */
export const DragOptimizations = {
    /**
     * Apply browser-specific optimizations to an element
     * @param {HTMLElement} element - Element to optimize
     */
    enableForDrag(element) {
        const browserInfo = getBrowserInfo();
        
        // Base optimizations for all browsers
        element.style.willChange = 'left, top';
        element.style.pointerEvents = 'none'; // Prevent conflicts
        
        // Chrome-specific optimizations
        if (browserInfo.isChrome) {
            element.style.transform = 'translateZ(0)'; // Force hardware acceleration
        }
        
        // Firefox-specific optimizations
        if (browserInfo.isFirefox) {
            element.style.backfaceVisibility = 'hidden';
        }
    },
    
    /**
     * Clean up optimizations after drag
     * @param {HTMLElement} element - Element to clean up
     */
    cleanupAfterDrag(element) {
        element.style.willChange = 'auto';
        element.style.pointerEvents = '';
        element.style.transform = '';
        element.style.backfaceVisibility = '';
    }
};
