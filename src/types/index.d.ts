/**
 * Chessboard.js Type Definitions
 * @packageDocumentation
 */

// ============================================================================
// Basic Types
// ============================================================================

/** Chess piece types */
export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';

/** Chess piece colors */
export type PieceColor = 'w' | 'b';

/** Square notation (e.g., 'e4', 'a1') */
export type Square = `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'}${'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'}`;

/** Board orientation */
export type Orientation = 'w' | 'b' | 'white' | 'black';

/** Piece identifier (color + type, e.g., 'wk', 'bp') */
export type PieceId = `${PieceColor}${PieceType}`;

/** Animation easing functions */
export type EasingFunction = 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/** Animation speed presets */
export type AnimationSpeed = 'fast' | 'normal' | 'slow' | 'instant';

/** Animation style */
export type AnimationStyle = 'sequential' | 'simultaneous';

/** Drop off board behavior */
export type DropOffBoardBehavior = 'snapback' | 'trash';

// ============================================================================
// Piece Interface
// ============================================================================

/** Chess piece representation */
export interface Piece {
  /** Piece type (k, q, r, b, n, p) */
  type: PieceType;
  /** Piece color (w, b) */
  color: PieceColor;
  /** Unique piece identifier */
  id?: string;
  /** Image source URL */
  src?: string;
  /** DOM element reference */
  element?: HTMLImageElement | null;
}

// ============================================================================
// Square Interface
// ============================================================================

/** Board square representation */
export interface SquareData {
  /** Square algebraic notation (e.g., 'e4') */
  id: Square;
  /** Row index (0-7) */
  row: number;
  /** Column index (0-7) */
  col: number;
  /** Piece on this square (if any) */
  piece: Piece | null;
  /** DOM element reference */
  element?: HTMLElement | null;
  /** Whether the square is a light square */
  isLight: boolean;
}

// ============================================================================
// Move Interface
// ============================================================================

/** Chess move representation */
export interface Move {
  /** Source square */
  from: Square;
  /** Target square */
  to: Square;
  /** Piece being moved */
  piece?: PieceType;
  /** Captured piece (if any) */
  captured?: PieceType;
  /** Promotion piece (for pawn promotion) */
  promotion?: 'q' | 'r' | 'b' | 'n';
  /** Move flags (e.g., 'c' for capture, 'e' for en passant) */
  flags?: string;
  /** Standard Algebraic Notation */
  san?: string;
  /** Long Algebraic Notation */
  lan?: string;
  /** Color of the piece moved */
  color?: PieceColor;
}

/** Move options for movePiece method */
export interface MoveOptions {
  /** Whether to animate the move */
  animate?: boolean;
  /** Animation duration in ms (overrides config) */
  duration?: number;
  /** Callback after move completes */
  onComplete?: () => void;
}

// ============================================================================
// Position Interface
// ============================================================================

/** Board position as object mapping squares to pieces */
export type PositionObject = Partial<Record<Square, PieceId>>;

/** Position representation (FEN string, object, or preset) */
export type Position = string | PositionObject | 'start' | 'empty';

// ============================================================================
// Event Handlers
// ============================================================================

/** Move event handler - return false to cancel the move */
export type OnMoveHandler = (move: Move) => boolean | Promise<boolean>;

/** Move end event handler - called after move animation completes */
export type OnMoveEndHandler = (move: Move) => void;

/** Position change handler - called when position changes */
export type OnChangeHandler = (fen: string) => void;

/** Drag start handler */
export type OnDragStartHandler = (
  source: Square,
  piece: PieceId,
  position: PositionObject,
  orientation: Orientation
) => boolean | void;

/** Drag move handler */
export type OnDragMoveHandler = (
  newLocation: Square | 'offboard',
  oldLocation: Square,
  source: Square,
  piece: PieceId,
  position: PositionObject,
  orientation: Orientation
) => void;

/** Drop handler */
export type OnDropHandler = (
  source: Square,
  target: Square | 'offboard',
  piece: PieceId,
  newPosition: PositionObject,
  oldPosition: PositionObject,
  orientation: Orientation
) => 'snapback' | 'trash' | void;

/** Snapback end handler */
export type OnSnapbackEndHandler = (
  square: SquareData,
  piece: Piece
) => void;

/** Square click handler */
export type OnSquareClickHandler = (square: Square) => void;

/** Square hover handlers */
export type OnSquareOverHandler = (square: Square) => void;
export type OnSquareOutHandler = (square: Square) => void;

// ============================================================================
// Configuration Interface
// ============================================================================

/** Animation configuration */
export interface AnimationConfig {
  /** Whether animations are enabled */
  enabled: boolean;
  /** Animation duration in milliseconds */
  duration: number;
  /** Easing function */
  easing: EasingFunction;
  /** Animation style (sequential or simultaneous) */
  style: AnimationStyle;
  /** Delay between simultaneous animations */
  simultaneousDelay: number;
}

/** Piece theme configuration */
export interface PieceThemeConfig {
  /** Base path for piece images */
  path: string;
  /** File extension (default: 'svg') */
  extension?: 'svg' | 'png' | 'webp';
  /** Custom naming function */
  nameFunction?: (piece: PieceId) => string;
}

/** Board colors configuration */
export interface BoardColorsConfig {
  /** Light square color */
  lightSquare: string;
  /** Dark square color */
  darkSquare: string;
  /** Highlight color */
  highlight: string;
  /** Selection color */
  selection: string;
  /** Hint color (legal moves) */
  hint: string;
  /** Last move highlight color */
  lastMove: string;
}

/** Main chessboard configuration */
export interface ChessboardConfig {
  // Required
  /** Container element ID */
  id: string;

  // Position & Orientation
  /** Initial position (FEN, object, 'start', or 'empty') */
  position?: Position;
  /** Board orientation */
  orientation?: Orientation;

  // Size
  /** Board size in pixels or 'auto' */
  size?: number | 'auto';

  // Interaction
  /** Enable piece dragging */
  draggable?: boolean;
  /** Enable click-to-move */
  clickable?: boolean;
  /** Show legal move hints on hover */
  hints?: boolean;
  /** Only allow legal moves */
  onlyLegalMoves?: boolean;
  /** Colors that can move pieces */
  movableColors?: PieceColor | 'both' | 'none';

  // Animation
  /** Animation settings */
  animation?: Partial<AnimationConfig>;
  /** Move animation duration (legacy, use animation.duration) */
  moveTime?: number;
  /** Animation style (legacy, use animation.style) */
  animationStyle?: AnimationStyle;
  /** Simultaneous animation delay */
  simultaneousAnimationDelay?: number;
  /** Snapback animation enabled */
  snapbackAnimation?: boolean;

  // Visual
  /** Piece theme configuration */
  pieceTheme?: string | PieceThemeConfig;
  /** Path to piece images (legacy, use pieceTheme) */
  piecesPath?: string;
  /** Board colors */
  colors?: Partial<BoardColorsConfig>;
  /** Show board coordinates */
  showCoordinates?: boolean;
  /** Highlight last move */
  highlightLastMove?: boolean;

  // Drop off board
  /** Behavior when piece is dropped off board */
  dropOffBoard?: DropOffBoardBehavior;

  // Event Handlers
  /** Called before a move is made */
  onMove?: OnMoveHandler;
  /** Called after a move animation completes */
  onMoveEnd?: OnMoveEndHandler;
  /** Called when the position changes */
  onChange?: OnChangeHandler;
  /** Called when a drag starts */
  onDragStart?: OnDragStartHandler;
  /** Called during a drag */
  onDragMove?: OnDragMoveHandler;
  /** Called when a piece is dropped */
  onDrop?: OnDropHandler;
  /** Called after snapback animation */
  onSnapbackEnd?: OnSnapbackEndHandler;
  /** Called when a square is clicked */
  onSquareClick?: OnSquareClickHandler;
  /** Called when hovering over a square */
  onSquareOver?: OnSquareOverHandler;
  /** Called when leaving a square */
  onSquareOut?: OnSquareOutHandler;
}

// ============================================================================
// Chessboard API Interface
// ============================================================================

/** Legal move information */
export interface LegalMove {
  to: Square;
  from: Square;
  promotion?: 'q' | 'r' | 'b' | 'n';
  flags: string;
  piece: PieceType;
  san: string;
}

/** Game state information */
export interface GameState {
  fen: string;
  turn: PieceColor;
  moveNumber: number;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
}

/** FEN validation result */
export interface FenValidation {
  ok: boolean;
  error?: string;
}

/** Main Chessboard API */
export interface ChessboardAPI {
  // Position & State
  getPosition(): string;
  setPosition(position: Position, options?: MoveOptions): boolean;
  reset(options?: MoveOptions): boolean;
  clear(options?: MoveOptions): boolean;

  // Move Management
  movePiece(move: string | Move, options?: MoveOptions): boolean;
  undoMove(options?: MoveOptions): Move | null;
  redoMove(options?: MoveOptions): Move | null;
  getLegalMoves(square: Square): LegalMove[];

  // Piece Management
  getPiece(square: Square): PieceId | null;
  putPiece(piece: PieceId | Piece, square: Square, options?: MoveOptions): boolean;
  removePiece(square: Square, options?: MoveOptions): boolean;

  // Board Control
  flipBoard(options?: MoveOptions): void;
  setOrientation(orientation: Orientation, options?: MoveOptions): Orientation;
  getOrientation(): Orientation;
  resizeBoard(size: number | 'auto'): boolean;

  // Highlighting & UI
  highlight(square: Square, options?: { color?: string }): void;
  dehighlight(square: Square): void;

  // Game Info
  fen(): string;
  turn(): PieceColor;
  isGameOver(): boolean;
  isCheckmate(): boolean;
  isDraw(): boolean;
  isStalemate(): boolean;
  inCheck(): boolean;
  getHistory(): Move[];

  // Lifecycle
  destroy(): void;
  rebuild(): void;

  // Configuration
  getConfig(): ChessboardConfig;
  updateConfig(config: Partial<ChessboardConfig>): void;

  // PGN Support
  pgn(): string;
  loadPgn(pgn: string, options?: MoveOptions): boolean;

  // Validation
  validateFen(fen: string): FenValidation;
  isLegal(move: string | Move): boolean;
}

// ============================================================================
// Service Interfaces
// ============================================================================

/** Validation service interface */
export interface IValidationService {
  isValidSquare(square: string): boolean;
  isValidPiece(piece: string): boolean;
  isValidFen(fen: string): boolean;
  isValidOrientation(orientation: string): boolean;
  isValidSize(size: number | string): boolean;
  isValidAnimationStyle(style: string): boolean;
  validateConfig(config: unknown): config is ChessboardConfig;
}

/** Animation service interface */
export interface IAnimationService {
  animate(
    element: HTMLElement,
    from: { x: number; y: number },
    to: { x: number; y: number },
    options?: {
      duration?: number;
      easing?: EasingFunction;
      onComplete?: () => void;
    }
  ): void;
  fadeIn(element: HTMLElement, duration?: number): Promise<void>;
  fadeOut(element: HTMLElement, duration?: number): Promise<void>;
}

/** Board service interface */
export interface IBoardService {
  buildBoard(): void;
  buildSquares(coordinateFn: (row: number, col: number) => { row: number; col: number }): void;
  getSquare(squareId: Square): SquareData | null;
  getAllSquares(): Record<Square, SquareData>;
  applyToAllSquares(method: string): void;
  highlightSquare(square: Square, options?: { color?: string }): void;
  dehighlightSquare(square: Square): void;
}

/** Position service interface */
export interface IPositionService {
  getGame(): ChessGame;
  setGame(position: Position): void;
  getPosition(): PositionObject;
  getGamePieceId(square: Square): PieceId | null;
}

/** Move service interface */
export interface IMoveService {
  executeMove(move: Move): Move | null;
  getCachedLegalMoves(square: SquareData): LegalMove[];
  canMove(square: SquareData): boolean;
  requiresPromotion(move: Move): boolean;
  isCastle(move: Move): boolean;
  isEnPassant(move: Move): boolean;
  getCastleRookMove(move: Move): { from: Square; to: Square } | null;
  getEnPassantCapturedSquare(move: Move): Square | null;
  clearCache(): void;
}

// ============================================================================
// Chess.js Integration Types
// ============================================================================

/** Chess.js game instance (simplified interface) */
export interface ChessGame {
  fen(): string;
  turn(): PieceColor;
  move(move: string | { from: string; to: string; promotion?: string }): Move | null;
  undo(): Move | null;
  moves(options?: { square?: string; verbose?: boolean }): string[] | LegalMove[];
  history(options?: { verbose?: boolean }): string[] | Move[];
  get(square: string): Piece | null;
  put(piece: Piece, square: string): boolean;
  remove(square: string): Piece | null;
  clear(): void;
  reset(): void;
  load(fen: string): boolean;
  loadPgn(pgn: string): boolean;
  pgn(): string;
  ascii(): string;
  board(): (Piece | null)[][];
  isGameOver(): boolean;
  isCheckmate(): boolean;
  isDraw(): boolean;
  isStalemate(): boolean;
  isThreefoldRepetition(): boolean;
  isInsufficientMaterial(): boolean;
  inCheck(): boolean;
  validateFen(fen: string): FenValidation;
  getCastlingRights(color: PieceColor): { k: boolean; q: boolean };
  moveNumber(): number;
}

// ============================================================================
// Logger Types
// ============================================================================

/** Log levels */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

/** Logger interface */
export interface ILogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  setLevel(level: LogLevel): void;
}

// ============================================================================
// Performance Monitor Types
// ============================================================================

/** Performance metrics */
export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

/** Performance monitor interface */
export interface IPerformanceMonitor {
  startMeasure(name: string): void;
  endMeasure(name: string): number;
  getMetrics(): PerformanceMetrics[];
  clearMetrics(): void;
}

// ============================================================================
// Factory Types
// ============================================================================

/** Board template */
export interface BoardTemplate {
  name: string;
  config: Partial<ChessboardConfig>;
}

/** Chessboard factory interface */
export interface IChessboardFactory {
  create(id: string, config?: Partial<ChessboardConfig>): ChessboardAPI;
  fromTemplate(id: string, templateName: string, overrides?: Partial<ChessboardConfig>): ChessboardAPI;
  getInstance(id: string): ChessboardAPI | null;
  listInstances(): string[];
  destroyAll(): void;
  registerTemplate(name: string, template: BoardTemplate): void;
}

// ============================================================================
// Export Main Class Type
// ============================================================================

/** Chessboard class constructor */
export interface ChessboardConstructor {
  new (config: ChessboardConfig): ChessboardAPI;
  create(id: string, config?: Partial<ChessboardConfig>): ChessboardAPI;
  fromTemplate(id: string, templateName: string, overrides?: Partial<ChessboardConfig>): ChessboardAPI;
  listInstances(): string[];
  destroyAll(): void;
  getInstance(id: string): ChessboardAPI | null;
}

/** Default export */
declare const Chessboard: ChessboardConstructor;
export default Chessboard;
