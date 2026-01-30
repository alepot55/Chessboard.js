/**
 * Cross-browser utilities for consistent drag & drop behavior
 */
/**
 * Detect browser type and version
 * @returns {Object} Browser information
 */
export function getBrowserInfo(): Object;
/**
 * Get accurate mouse coordinates accounting for browser differences
 * @param {MouseEvent} event - Mouse event
 * @returns {Object} Normalized coordinates
 */
export function getNormalizedCoordinates(event: MouseEvent): Object;
/**
 * Set element position using the most compatible method
 * @param {HTMLElement} element - Element to position
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
export function setElementPosition(element: HTMLElement, x: number, y: number): void;
/**
 * Calculate offset from center for drag positioning
 * @param {HTMLElement} element - Element being dragged
 * @param {number} mouseX - Mouse X coordinate
 * @param {number} mouseY - Mouse Y coordinate
 * @returns {Object} Position coordinates
 */
export function calculateDragPosition(element: HTMLElement, mouseX: number, mouseY: number): Object;
/**
 * Enhanced mouse coordinate tracking for cross-browser compatibility
 */
export class MouseTracker {
    lastKnownPosition: {
        x: number;
        y: number;
    };
    browserInfo: Object;
    /**
     * Update position from mouse event
     * @param {MouseEvent} event - Mouse event
     * @returns {Object} Normalized position
     */
    updatePosition(event: MouseEvent): Object;
    /**
     * Get element position for dragging
     * @param {HTMLElement} element - Element to position
     * @param {MouseEvent} event - Mouse event
     * @returns {Object} Position for the element
     */
    getDragPosition(element: HTMLElement, event: MouseEvent): Object;
}
export namespace DragOptimizations {
    /**
     * Apply browser-specific optimizations to an element
     * @param {HTMLElement} element - Element to optimize
     */
    function enableForDrag(element: HTMLElement): void;
    /**
     * Clean up optimizations after drag
     * @param {HTMLElement} element - Element to clean up
     */
    function cleanupAfterDrag(element: HTMLElement): void;
}
//# sourceMappingURL=cross-browser.d.ts.map