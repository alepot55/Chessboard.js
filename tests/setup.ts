/**
 * Vitest Test Setup
 * This file runs before all tests
 */

import { afterEach, beforeAll, vi } from 'vitest';

// Mock requestAnimationFrame and cancelAnimationFrame
beforeAll(() => {
  // RequestAnimationFrame mock
  let rafId = 0;
  const rafCallbacks = new Map<number, FrameRequestCallback>();

  global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback): number => {
    rafId++;
    rafCallbacks.set(rafId, callback);
    setTimeout(() => {
      const cb = rafCallbacks.get(rafId);
      if (cb) {
        cb(performance.now());
        rafCallbacks.delete(rafId);
      }
    }, 16);
    return rafId;
  });

  global.cancelAnimationFrame = vi.fn((id: number): void => {
    rafCallbacks.delete(id);
  });

  // Performance mock (if not available in jsdom)
  if (!global.performance) {
    global.performance = {
      now: vi.fn(() => Date.now()),
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByName: vi.fn(() => []),
      getEntriesByType: vi.fn(() => []),
      clearMarks: vi.fn(),
      clearMeasures: vi.fn(),
    } as unknown as Performance;
  }

  // Crypto mock for UUID generation
  if (!global.crypto) {
    global.crypto = {
      randomUUID: vi.fn(() => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`),
      getRandomValues: vi.fn(<T extends ArrayBufferView | null>(array: T): T => {
        if (array) {
          const view = new Uint8Array(array.buffer);
          for (let i = 0; i < view.length; i++) {
            view[i] = Math.floor(Math.random() * 256);
          }
        }
        return array;
      }),
    } as unknown as Crypto;
  }

  // ResizeObserver mock
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // IntersectionObserver mock
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }));

  // MutationObserver mock (usually available in jsdom, but just in case)
  if (!global.MutationObserver) {
    global.MutationObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      takeRecords: vi.fn(() => []),
    }));
  }

  // PointerEvent mock (for drag/drop testing)
  if (!global.PointerEvent) {
    global.PointerEvent = class PointerEvent extends MouseEvent {
      pointerId: number;
      width: number;
      height: number;
      pressure: number;
      tiltX: number;
      tiltY: number;
      pointerType: string;
      isPrimary: boolean;

      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params);
        this.pointerId = params.pointerId ?? 0;
        this.width = params.width ?? 1;
        this.height = params.height ?? 1;
        this.pressure = params.pressure ?? 0;
        this.tiltX = params.tiltX ?? 0;
        this.tiltY = params.tiltY ?? 0;
        this.pointerType = params.pointerType ?? 'mouse';
        this.isPrimary = params.isPrimary ?? true;
      }
    } as unknown as typeof PointerEvent;
  }
});

// Clean up after each test
afterEach(() => {
  // Clear all mocks
  vi.clearAllMocks();

  // Clean up DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';

  // Clear any pending timers
  vi.clearAllTimers();
});

// Custom matchers
expect.extend({
  toBeValidSquare(received: string) {
    const validSquares = /^[a-h][1-8]$/;
    const pass = validSquares.test(received);
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be a valid chess square`
          : `Expected ${received} to be a valid chess square (a1-h8)`,
    };
  },

  toBeValidFen(received: string) {
    // Basic FEN validation
    const fenParts = received.split(' ');
    const pass = fenParts.length >= 1 && /^[rnbqkpRNBQKP1-8/]+$/.test(fenParts[0]);
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be a valid FEN string`
          : `Expected ${received} to be a valid FEN string`,
    };
  },

  toBeValidPieceId(received: string) {
    const validPieces = /^[wb][kqrbnp]$/i;
    const pass = validPieces.test(received);
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be a valid piece ID`
          : `Expected ${received} to be a valid piece ID (e.g., wk, bp)`,
    };
  },
});

// TypeScript declaration for custom matchers
declare module 'vitest' {
  interface Assertion<T = unknown> {
    toBeValidSquare(): T;
    toBeValidFen(): T;
    toBeValidPieceId(): T;
  }
  interface AsymmetricMatchersContaining {
    toBeValidSquare(): unknown;
    toBeValidFen(): unknown;
    toBeValidPieceId(): unknown;
  }
}

// Helper utilities for tests
export const createBoardContainer = (id = 'test-board'): HTMLDivElement => {
  const container = document.createElement('div');
  container.id = id;
  container.style.width = '400px';
  container.style.height = '400px';
  document.body.appendChild(container);
  return container;
};

export const removeBoardContainer = (id = 'test-board'): void => {
  const container = document.getElementById(id);
  if (container) {
    container.remove();
  }
};

export const waitForAnimationFrame = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });

export const waitForTimeout = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// Standard starting position FEN
export const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Empty board FEN
export const EMPTY_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';

// Common test positions
export const TEST_POSITIONS = {
  starting: STARTING_FEN,
  empty: EMPTY_FEN,
  afterE4: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
  scholarsMate:
    'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4',
  castlingAvailable: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1',
  enPassantAvailable: 'rnbqkbnr/pppp1ppp/8/4pP2/8/8/PPPPP1PP/RNBQKBNR w KQkq e6 0 3',
  promotionReady: '8/P7/8/8/8/8/8/4K2k w - - 0 1',
};
