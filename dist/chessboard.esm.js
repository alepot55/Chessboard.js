var Je = Object.defineProperty;
var Xe = (a, e, t) => e in a ? Je(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var E = (a, e, t) => Xe(a, typeof e != "symbol" ? e + "" : e, t);
const Ae = {
  start: "start",
  default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  empty: "8/8/8/8/8/8/8/8 w - - 0 1"
}, Ze = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", fe = ["p", "r", "n", "b", "q", "k"], me = ["w", "b"], et = ["q", "r", "b", "n"], he = "abcdefgh", Me = {
  ROWS: 8,
  COLS: 8,
  TOTAL_SQUARES: 64
}, M = Object.freeze({
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONFIG_ERROR: "CONFIG_ERROR",
  MOVE_ERROR: "MOVE_ERROR",
  DOM_ERROR: "DOM_ERROR",
  ANIMATION_ERROR: "ANIMATION_ERROR",
  PIECE_ERROR: "PIECE_ERROR",
  INITIALIZATION_ERROR: "INITIALIZATION_ERROR",
  POSITION_ERROR: "POSITION_ERROR",
  FEN_ERROR: "FEN_ERROR",
  SQUARE_ERROR: "SQUARE_ERROR",
  THEME_ERROR: "THEME_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR"
}), C = Object.freeze({
  // Position and FEN related
  invalid_position: "Invalid position: ",
  invalid_fen: "Invalid FEN string: ",
  position_load_failed: "Failed to load position: ",
  // DOM and UI related
  invalid_id_div: "Board container not found: ",
  invalid_value: "Invalid value: ",
  dom_operation_failed: "DOM operation failed: ",
  element_not_found: "Element not found: ",
  // Piece related
  invalid_piece: "Invalid piece notation: ",
  invalid_square: "Invalid square notation: ",
  invalid_piecesPath: "Invalid pieces path: ",
  piece_operation_failed: "Piece operation failed: ",
  // Board configuration
  invalid_orientation: "Invalid orientation: ",
  invalid_color: "Invalid color: ",
  invalid_mode: "Invalid mode: ",
  invalid_dropOffBoard: "Invalid dropOffBoard setting: ",
  invalid_size: "Invalid size: ",
  invalid_movableColors: "Invalid movableColors setting: ",
  // Animation related
  invalid_snapbackTime: "Invalid snapbackTime: ",
  invalid_snapbackAnimation: "Invalid snapbackAnimation: ",
  invalid_fadeTime: "Invalid fadeTime: ",
  invalid_fadeAnimation: "Invalid fadeAnimation: ",
  invalid_ratio: "Invalid ratio: ",
  invalid_animationStyle: "Invalid animationStyle: ",
  animation_failed: "Animation failed: ",
  // Event handlers
  invalid_onMove: "Invalid onMove callback: ",
  invalid_onMoveEnd: "Invalid onMoveEnd callback: ",
  invalid_onChange: "Invalid onChange callback: ",
  invalid_onDragStart: "Invalid onDragStart callback: ",
  invalid_onDragMove: "Invalid onDragMove callback: ",
  invalid_onDrop: "Invalid onDrop callback: ",
  invalid_onSnapbackEnd: "Invalid onSnapbackEnd callback: ",
  callback_execution_failed: "Callback execution failed: ",
  // Visual styling
  invalid_whiteSquare: "Invalid whiteSquare color: ",
  invalid_blackSquare: "Invalid blackSquare color: ",
  invalid_highlight: "Invalid highlight color: ",
  invalid_selectedSquareWhite: "Invalid selectedSquareWhite color: ",
  invalid_selectedSquareBlack: "Invalid selectedSquareBlack color: ",
  invalid_movedSquareWhite: "Invalid movedSquareWhite color: ",
  invalid_movedSquareBlack: "Invalid movedSquareBlack color: ",
  invalid_choiceSquare: "Invalid choiceSquare color: ",
  invalid_coverSquare: "Invalid coverSquare color: ",
  invalid_hintColor: "Invalid hintColor: ",
  // Move related
  invalid_move: "Invalid move: ",
  invalid_move_format: "Invalid move format: ",
  move_execution_failed: "Move execution failed: ",
  illegal_move: "Illegal move: ",
  square_no_piece: "No piece found on square: ",
  move_validation_failed: "Move validation failed: ",
  // Game state
  game_over: "Game is over",
  invalid_turn: "Invalid turn: ",
  position_validation_failed: "Position validation failed: ",
  // Theme and assets
  theme_load_failed: "Theme loading failed: ",
  asset_load_failed: "Asset loading failed: ",
  invalid_theme: "Invalid theme: ",
  // Network and resources
  network_error: "Network error: ",
  resource_not_found: "Resource not found: ",
  timeout_error: "Operation timed out: ",
  // General errors
  initialization_failed: "Initialization failed: ",
  operation_failed: "Operation failed: ",
  invalid_state: "Invalid state: ",
  memory_limit_exceeded: "Memory limit exceeded",
  performance_degraded: "Performance degraded: "
}), N = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
});
Object.freeze({
  [M.VALIDATION_ERROR]: N.MEDIUM,
  [M.CONFIG_ERROR]: N.HIGH,
  [M.MOVE_ERROR]: N.LOW,
  [M.DOM_ERROR]: N.HIGH,
  [M.ANIMATION_ERROR]: N.LOW,
  [M.PIECE_ERROR]: N.MEDIUM,
  [M.INITIALIZATION_ERROR]: N.CRITICAL,
  [M.POSITION_ERROR]: N.MEDIUM,
  [M.FEN_ERROR]: N.MEDIUM,
  [M.SQUARE_ERROR]: N.MEDIUM,
  [M.THEME_ERROR]: N.LOW,
  [M.NETWORK_ERROR]: N.MEDIUM
});
class z extends Error {
  /**
   * Creates a new ChessboardError instance
   * @param {string} message - Error message
   * @param {string} code - Error code from ERROR_CODES
   * @param {Object} [context={}] - Additional context information
   */
  constructor(e, t, i = {}) {
    super(e), this.name = "ChessboardError", this.code = t, this.context = i, this.timestamp = (/* @__PURE__ */ new Date()).toISOString(), Error.captureStackTrace && Error.captureStackTrace(this, z);
  }
}
class k extends z {
  /**
   * Creates a new ValidationError instance
   * @param {string} message - Error message
   * @param {string} field - Field that failed validation
   * @param {*} value - Value that failed validation
   */
  constructor(e, t, i) {
    super(e, M.VALIDATION_ERROR, { field: t, value: i }), this.name = "ValidationError", this.field = t, this.value = i;
  }
}
class L extends z {
  /**
   * Creates a new ConfigurationError instance
   * @param {string} message - Error message
   * @param {string} configKey - Configuration key that is invalid
   * @param {*} configValue - Configuration value that is invalid
   */
  constructor(e, t, i) {
    super(e, M.CONFIG_ERROR, { configKey: t, configValue: i }), this.name = "ConfigurationError", this.configKey = t, this.configValue = i;
  }
}
class Oe extends z {
  /**
   * Creates a new MoveError instance
   * @param {string} message - Error message
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {string} [piece] - Piece being moved
   */
  constructor(e, t, i, s) {
    super(e, M.MOVE_ERROR, { from: t, to: i, piece: s }), this.name = "MoveError", this.from = t, this.to = i, this.piece = s;
  }
}
class tt extends z {
  /**
   * Creates a new DOMError instance
   * @param {string} message - Error message
   * @param {string} elementId - Element ID that caused the error
   */
  constructor(e, t) {
    super(e, M.DOM_ERROR, { elementId: t }), this.name = "DOMError", this.elementId = t;
  }
}
class Se extends z {
  /**
   * Creates a new PieceError instance
   * @param {string} message - Error message
   * @param {string} pieceId - Piece ID that caused the error
   * @param {string} [square] - Square where the error occurred
   */
  constructor(e, t, i) {
    super(e, M.PIECE_ERROR, { pieceId: t, square: i }), this.name = "PieceError", this.pieceId = t, this.square = i;
  }
}
const it = Object.freeze({
  square: /^[a-h][1-8]$/,
  piece: /^[prnbqkPRNBQK][wb]$/,
  fen: /^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+\s[wb]\s[KQkq-]+\s[a-h1-8-]+\s\d+\s\d+$/,
  move: /^[a-h][1-8][a-h][1-8][qrnb]?$/,
  color: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
}), st = Object.freeze({
  orientations: ["w", "b", "white", "black"],
  colors: ["w", "b", "white", "black"],
  movableColors: ["w", "b", "white", "black", "both", "none"],
  dropOffBoard: ["snapback", "trash"],
  easingTypes: ["linear", "ease", "ease-in", "ease-out", "ease-in-out"],
  animationStyles: ["sequential", "simultaneous"],
  modes: ["normal", "creative", "analysis"],
  promotionPieces: ["q", "r", "b", "n", "Q", "R", "B", "N"]
}), nt = Object.freeze({
  min: 50,
  max: 2e3,
  maxTime: 1e4,
  maxDelay: 5e3
});
class Ie {
  /**
   * Creates a new ValidationService instance
   */
  constructor() {
    this._validationCache = /* @__PURE__ */ new Map(), this._cacheMaxSize = 1e3, this._patterns = it, this._validValues = st, this._constraints = nt;
  }
  /**
   * Validates a square identifier with caching
   * @param {string} square - Square to validate (e.g., 'e4')
   * @returns {boolean} True if valid
   */
  isValidSquare(e) {
    const t = `square:${e}`;
    if (this._validationCache.has(t))
      return this._validationCache.get(t);
    const i = typeof e == "string" && e.length === 2 && this._patterns.square.test(e);
    return this._cacheValidationResult(t, i), i;
  }
  /**
   * Validates a piece identifier with enhanced format support
   * @param {string} piece - Piece to validate (e.g., 'wK', 'bp')
   * @returns {boolean} True if valid
   */
  isValidPiece(e) {
    if (typeof e != "string" || e.length !== 2)
      return !1;
    const t = `piece:${e}`;
    if (this._validationCache.has(t))
      return this._validationCache.get(t);
    const [i, s] = e.split(""), n = fe.includes(i.toLowerCase()) && me.includes(s), o = me.includes(i) && fe.includes(s.toLowerCase()), r = n || o;
    return this._cacheValidationResult(t, r), r;
  }
  /**
   * Validates a FEN string with comprehensive checks
   * @param {string} fen - FEN string to validate
   * @returns {boolean} True if valid
   */
  isValidFen(e) {
    if (typeof e != "string")
      return !1;
    const t = `fen:${e}`;
    if (this._validationCache.has(t))
      return this._validationCache.get(t);
    if (!this._patterns.fen.test(e))
      return this._cacheValidationResult(t, !1), !1;
    const i = this._validateFenStructure(e);
    return this._cacheValidationResult(t, i), i;
  }
  /**
   * Validates FEN structure in detail
   * @private
   * @param {string} fen - FEN string to validate
   * @returns {boolean} True if valid
   */
  _validateFenStructure(e) {
    const t = e.split(" ");
    if (t.length !== 6)
      return !1;
    const i = t[0].split("/");
    if (i.length !== 8)
      return !1;
    for (const o of i)
      if (!this._validateRank(o))
        return !1;
    if (!["w", "b"].includes(t[1]) || !/^[KQkq-]*$/.test(t[2]) || t[3] !== "-" && !this.isValidSquare(t[3]))
      return !1;
    const s = parseInt(t[4], 10), n = parseInt(t[5], 10);
    return !isNaN(s) && !isNaN(n) && s >= 0 && n >= 1;
  }
  /**
   * Validates a single rank in FEN notation
   * @private
   * @param {string} rank - Rank to validate
   * @returns {boolean} True if valid
   */
  _validateRank(e) {
    let t = 0;
    for (let i = 0; i < e.length; i++) {
      const s = e[i];
      if (/[1-8]/.test(s))
        t += parseInt(s, 10);
      else if (/[prnbqkPRNBQK]/.test(s))
        t += 1;
      else
        return !1;
    }
    return t === 8;
  }
  /**
   * Validates a move string with comprehensive format support
   * @param {string} move - Move string to validate (e.g., 'e2e4', 'e7e8q')
   * @returns {boolean} True if valid
   */
  isValidMove(e) {
    if (typeof e != "string")
      return !1;
    const t = `move:${e}`;
    if (this._validationCache.has(t))
      return this._validationCache.get(t);
    const i = this._validateMoveFormat(e);
    return this._cacheValidationResult(t, i), i;
  }
  /**
   * Validates move format in detail
   * @private
   * @param {string} move - Move string to validate
   * @returns {boolean} True if valid
   */
  _validateMoveFormat(e) {
    if (e.length < 4 || e.length > 5)
      return !1;
    const t = e.slice(0, 2), i = e.slice(2, 4), s = e.slice(4, 5);
    return !this.isValidSquare(t) || !this.isValidSquare(i) || s && !this._validValues.promotionPieces.includes(s) ? !1 : t !== i;
  }
  /**
   * Validates board orientation
   * @param {string} orientation - Orientation to validate
   * @returns {boolean} True if valid
   */
  isValidOrientation(e) {
    return this._validValues.orientations.includes(e);
  }
  /**
   * Validates a color value
   * @param {string} color - Color to validate
   * @returns {boolean} True if valid
   */
  isValidColor(e) {
    return this._validValues.colors.includes(e);
  }
  /**
   * Validates a size value with constraints
   * @param {number|string} size - Size to validate
   * @returns {boolean} True if valid
   */
  isValidSize(e) {
    return e === "auto" ? !0 : typeof e == "number" ? e >= this._constraints.min && e <= this._constraints.max : !1;
  }
  /**
   * Validates a time value with constraints
   * @param {number} time - Time value to validate
   * @returns {boolean} True if valid
   */
  isValidTime(e) {
    return typeof e == "number" && e >= 0 && e <= this._constraints.maxTime;
  }
  /**
   * Validates a callback function
   * @param {Function} callback - Callback to validate
   * @returns {boolean} True if valid
   */
  isValidCallback(e) {
    return typeof e == "function";
  }
  /**
   * Validates a DOM element ID
   * @param {string} id - Element ID to validate
   * @returns {boolean} True if valid
   */
  isValidElementId(e) {
    return typeof e == "string" && e.length > 0 && e.length <= 100 && // Reasonable length limit
    /^[a-zA-Z][\w:-]*$/.test(e);
  }
  /**
   * Validates movable colors configuration
   * @param {string} colors - Colors value to validate
   * @returns {boolean} True if valid
   */
  isValidMovableColors(e) {
    return this._validValues.movableColors.includes(e);
  }
  /**
   * Validates drop off board configuration
   * @param {string} dropOff - Drop off board value to validate
   * @returns {boolean} True if valid
   */
  isValidDropOffBoard(e) {
    return this._validValues.dropOffBoard.includes(e);
  }
  /**
   * Validates animation easing type
   * @param {string} easing - Easing type to validate
   * @returns {boolean} True if valid
   */
  isValidEasing(e) {
    return this._validValues.easingTypes.includes(e);
  }
  /**
   * Validates animation style
   * @param {string} style - Animation style to validate
   * @returns {boolean} True if valid
   */
  isValidAnimationStyle(e) {
    return this._validValues.animationStyles.includes(e);
  }
  /**
   * Validates CSS color format
   * @param {string} color - Color string to validate
   * @returns {boolean} True if valid
   */
  isValidCSSColor(e) {
    return typeof e != "string" ? !1 : !!(this._patterns.color.test(e) || ["white", "black", "red", "green", "blue", "yellow", "cyan", "magenta"].includes(e.toLowerCase()) || /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(e) || /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-1](\.\d+)?\s*\)$/.test(e));
  }
  /**
   * Validates and sanitizes a square identifier
   * @param {string} square - Square to validate
   * @returns {string} Sanitized square
   * @throws {ValidationError} If square is invalid
   */
  validateSquare(e) {
    if (!this.isValidSquare(e))
      throw new k(
        C.invalid_square + e,
        "square",
        e
      );
    return e.toLowerCase();
  }
  /**
   * Validates and sanitizes a piece identifier
   * @param {string} piece - Piece to validate
   * @returns {string} Sanitized piece
   * @throws {ValidationError} If piece is invalid
   */
  validatePiece(e) {
    if (!this.isValidPiece(e))
      throw new k(
        C.invalid_piece + e,
        "piece",
        e
      );
    return e.toLowerCase();
  }
  /**
   * Validates and sanitizes a FEN string
   * @param {string} fen - FEN to validate
   * @returns {string} Sanitized FEN
   * @throws {ValidationError} If FEN is invalid
   */
  validateFen(e) {
    if (!this.isValidFen(e))
      throw new k(
        C.invalid_fen + e,
        "fen",
        e
      );
    return e.trim();
  }
  /**
   * Validates and sanitizes a move string
   * @param {string} move - Move to validate
   * @returns {string} Sanitized move
   * @throws {ValidationError} If move is invalid
   */
  validateMove(e) {
    if (!this.isValidMove(e))
      throw new k(
        C.invalid_move + e,
        "move",
        e
      );
    return e.toLowerCase();
  }
  /**
   * Validates and sanitizes orientation
   * @param {string} orientation - Orientation to validate
   * @returns {string} Sanitized orientation ('w' or 'b')
   * @throws {ValidationError} If orientation is invalid
   */
  validateOrientation(e) {
    if (!this.isValidOrientation(e))
      throw new k(
        C.invalid_orientation + e,
        "orientation",
        e
      );
    return e === "white" ? "w" : e === "black" ? "b" : e;
  }
  /**
   * Validates and sanitizes color
   * @param {string} color - Color to validate
   * @returns {string} Sanitized color ('w' or 'b')
   * @throws {ValidationError} If color is invalid
   */
  validateColor(e) {
    if (!this.isValidColor(e))
      throw new k(
        C.invalid_color + e,
        "color",
        e
      );
    return e === "white" ? "w" : e === "black" ? "b" : e;
  }
  /**
   * Validates and sanitizes size
   * @param {number|string} size - Size to validate
   * @returns {number|string} Sanitized size
   * @throws {ValidationError} If size is invalid
   */
  validateSize(e) {
    if (!this.isValidSize(e))
      throw new k(
        C.invalid_size + e,
        "size",
        e
      );
    return e;
  }
  /**
   * Validates configuration object with comprehensive checks
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validated configuration
   * @throws {ValidationError} If configuration is invalid
   */
  validateConfig(e) {
    if (!e || typeof e != "object")
      throw new k(
        "Configuration must be an object",
        "config",
        e
      );
    const t = [];
    !e.id && !e.id_div && t.push("Configuration must include id or id_div"), e.orientation && !this.isValidOrientation(e.orientation) && t.push(C.invalid_orientation + e.orientation), e.size && !this.isValidSize(e.size) && t.push(C.invalid_size + e.size), e.movableColors && !this.isValidMovableColors(e.movableColors) && t.push(C.invalid_color + e.movableColors), e.dropOffBoard && !this.isValidDropOffBoard(e.dropOffBoard) && t.push(C.invalid_dropOffBoard + e.dropOffBoard), e.animationStyle && !this.isValidAnimationStyle(e.animationStyle) && t.push(C.invalid_animationStyle + e.animationStyle);
    const i = ["onMove", "onMoveEnd", "onChange", "onDragStart", "onDragMove", "onDrop", "onSnapbackEnd"];
    for (const n of i)
      e[n] && !this.isValidCallback(e[n]) && t.push(`Invalid ${n} callback`);
    const s = ["whiteSquare", "blackSquare", "highlight", "hintColor"];
    for (const n of s)
      e[n] && !this.isValidCSSColor(e[n]) && t.push(`Invalid ${n} color: ${e[n]}`);
    if (t.length > 0)
      throw new k(
        `Configuration validation failed: ${t.join(", ")}`,
        "config",
        e
      );
    return e;
  }
  /**
   * Caches validation result for performance
   * @private
   * @param {string} key - Cache key
   * @param {boolean} result - Validation result
   */
  _cacheValidationResult(e, t) {
    if (this._validationCache.size >= this._cacheMaxSize) {
      const i = this._validationCache.keys().next().value;
      this._validationCache.delete(i);
    }
    this._validationCache.set(e, t);
  }
  /**
   * Clears the validation cache
   */
  clearCache() {
    this._validationCache.clear();
  }
  /**
   * Gets validation cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      size: this._validationCache.size,
      maxSize: this._cacheMaxSize,
      hitRate: this._cacheHits / (this._cacheHits + this._cacheMisses) || 0
    };
  }
  /**
   * Batch validates multiple values
   * @param {Array} validations - Array of validation objects
   * @returns {Array} Array of validation results
   */
  batchValidate(e) {
    return e.map((t) => {
      try {
        const { type: i, value: s } = t;
        switch (i) {
          case "square":
            return { valid: this.isValidSquare(s), value: s };
          case "piece":
            return { valid: this.isValidPiece(s), value: s };
          case "fen":
            return { valid: this.isValidFen(s), value: s };
          case "move":
            return { valid: this.isValidMove(s), value: s };
          default:
            return { valid: !1, value: s, error: "Unknown validation type" };
        }
      } catch (i) {
        return { valid: !1, value: t.value, error: i.message };
      }
    });
  }
  /**
   * Cleans up resources
   */
  destroy() {
    this.clearCache(), this._validationCache = null, this._patterns = null, this._validValues = null, this._constraints = null;
  }
}
const qe = Object.freeze({
  fast: 200,
  slow: 600,
  normal: 400,
  verySlow: 1e3,
  veryFast: 100
}), Le = Object.freeze({
  true: !0,
  false: !1,
  none: !1,
  1: !0,
  0: !1
}), be = Object.freeze({
  ease: "ease",
  linear: "linear",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  none: null
}), ot = Object.freeze({
  id: "board",
  position: "start",
  orientation: "w",
  mode: "normal",
  size: "auto",
  draggable: !0,
  hints: !0,
  clickable: !0,
  movableColors: "both",
  moveHighlight: !0,
  overHighlight: !0,
  moveAnimation: "ease",
  moveTime: "fast",
  dropOffBoard: "snapback",
  snapbackTime: "fast",
  snapbackAnimation: "ease",
  dropCenterTime: "veryFast",
  dropCenterAnimation: "ease",
  fadeTime: "fast",
  fadeAnimation: "ease",
  ratio: 0.9,
  piecesPath: "../assets/themes/default",
  animationStyle: "simultaneous",
  simultaneousAnimationDelay: 100,
  onMove: () => !0,
  onMoveEnd: () => !0,
  onChange: () => !0,
  onDragStart: () => !0,
  onDragMove: () => !0,
  onDrop: () => !0,
  onSnapbackEnd: () => !0,
  whiteSquare: "#f0d9b5",
  blackSquare: "#b58863",
  highlight: "yellow",
  selectedSquareWhite: "#ababaa",
  selectedSquareBlack: "#ababaa",
  movedSquareWhite: "#f1f1a0",
  movedSquareBlack: "#e9e981",
  choiceSquare: "white",
  coverSquare: "black",
  hintColor: "#ababaa"
});
class Be {
  /**
   * Creates a new ChessboardConfig instance
   * @param {Object} settings - User-provided configuration
   * @throws {ConfigurationError} If configuration is invalid
   */
  constructor(e = {}) {
    this._validationService = new Ie(), this._validateInput(e);
    const t = this._mergeWithDefaults(e);
    this._processConfiguration(t), this._setCSSProperties(t), this._configureModeSettings();
  }
  /**
   * Validates input configuration
   * @private
   * @param {Object} settings - Input settings
   * @throws {ConfigurationError} If input is invalid
   */
  _validateInput(e) {
    if (e !== null && typeof e != "object")
      throw new L("Settings must be an object", "settings", e);
    try {
      this._validationService.validateConfig(e);
    } catch (t) {
      throw new L(t.message, t.field, t.value);
    }
  }
  /**
   * Merges user settings with defaults
   * @private
   * @param {Object} settings - User settings
   * @returns {Object} Merged configuration
   */
  _mergeWithDefaults(e) {
    return Object.assign({}, ot, e);
  }
  /**
   * Processes and validates configuration values
   * @private
   * @param {Object} config - Configuration object
   */
  _processConfiguration(e) {
    this.id_div = e.id, this.position = e.position, this.orientation = e.orientation, this.mode = e.mode, this.dropOffBoard = e.dropOffBoard, this.size = e.size, this.movableColors = e.movableColors, this.piecesPath = e.piecesPath, this.onMove = this._validateCallback(e.onMove), this.onMoveEnd = this._validateCallback(e.onMoveEnd), this.onChange = this._validateCallback(e.onChange), this.onDragStart = this._validateCallback(e.onDragStart), this.onDragMove = this._validateCallback(e.onDragMove), this.onDrop = this._validateCallback(e.onDrop), this.onSnapbackEnd = this._validateCallback(e.onSnapbackEnd), this.moveAnimation = this._setTransitionFunction(e.moveAnimation), this.snapbackAnimation = this._setTransitionFunction(e.snapbackAnimation), this.dropCenterAnimation = this._setTransitionFunction(e.dropCenterAnimation), this.fadeAnimation = this._setTransitionFunction(e.fadeAnimation), this.hints = this._setBoolean(e.hints), this.clickable = this._setBoolean(e.clickable), this.draggable = this._setBoolean(e.draggable), this.moveHighlight = this._setBoolean(e.moveHighlight), this.overHighlight = this._setBoolean(e.overHighlight), this.moveTime = this._setTime(e.moveTime), this.snapbackTime = this._setTime(e.snapbackTime), this.dropCenterTime = this._setTime(e.dropCenterTime), this.fadeTime = this._setTime(e.fadeTime), this.animationStyle = this._validateAnimationStyle(e.animationStyle), this.simultaneousAnimationDelay = this._validateDelay(e.simultaneousAnimationDelay);
  }
  /**
   * Sets CSS custom properties
   * @private
   * @param {Object} config - Configuration object
   */
  _setCSSProperties(e) {
    const t = {
      pieceRatio: e.ratio,
      whiteSquare: e.whiteSquare,
      blackSquare: e.blackSquare,
      highlightSquare: e.highlight,
      selectedSquareWhite: e.selectedSquareWhite,
      selectedSquareBlack: e.selectedSquareBlack,
      movedSquareWhite: e.movedSquareWhite,
      movedSquareBlack: e.movedSquareBlack,
      choiceSquare: e.choiceSquare,
      coverSquare: e.coverSquare,
      hintColor: e.hintColor
    };
    Object.entries(t).forEach(([i, s]) => {
      this._setCSSProperty(i, s);
    });
  }
  /**
   * Configures mode-specific settings
   * @private
   */
  _configureModeSettings() {
    switch (this.mode) {
      case "creative":
        this.onlyLegalMoves = !1, this.hints = !1;
        break;
      case "normal":
        this.onlyLegalMoves = !0;
        break;
      default:
        this.onlyLegalMoves = !0;
    }
  }
  /**
   * Validates a callback function
   * @private
   * @param {Function} callback - Callback to validate
   * @returns {Function} Validated callback
   * @throws {ConfigurationError} If callback is invalid
   */
  _validateCallback(e) {
    if (!this._validationService.isValidCallback(e))
      throw new L("Callback must be a function", "callback", e);
    return e;
  }
  /**
   * Validates animation style
   * @private
   * @param {string} style - Animation style
   * @returns {string} Validated style
   * @throws {ConfigurationError} If style is invalid
   */
  _validateAnimationStyle(e) {
    if (!this._validationService.isValidAnimationStyle(e))
      throw new L("Invalid animation style", "animationStyle", e);
    return e;
  }
  /**
   * Validates animation delay
   * @private
   * @param {number} delay - Animation delay
   * @returns {number} Validated delay
   * @throws {ConfigurationError} If delay is invalid
   */
  _validateDelay(e) {
    if (typeof e != "number" || e < 0 || e > 5e3)
      throw new L("Invalid animation delay", "simultaneousAnimationDelay", e);
    return e;
  }
  /**
   * Sets a CSS custom property
   * @private
   * @param {string} property - Property name
   * @param {string} value - Property value
   */
  _setCSSProperty(e, t) {
    try {
      typeof document < "u" && document.documentElement && document.documentElement.style.setProperty(`--${e}`, t);
    } catch (i) {
      console.warn(`Failed to set CSS property ${e}:`, i.message);
    }
  }
  /**
   * Sets orientation with validation
   * @param {string} orientation - Orientation value
   * @returns {ChessboardConfig} This instance for chaining
   * @throws {ConfigurationError} If orientation is invalid
   */
  setOrientation(e) {
    const t = this._validationService.validateOrientation(e);
    return this.orientation = t, this;
  }
  /**
   * Validates and sets time value
   * @private
   * @param {string|number} value - Time value
   * @returns {number} Validated time value
   * @throws {ConfigurationError} If time value is invalid
   */
  _setTime(e) {
    if (typeof e == "number") {
      if (!this._validationService.isValidTime(e))
        throw new L("Invalid time value", "time", e);
      return e;
    }
    if (typeof e == "string" && e in qe)
      return qe[e];
    throw new L("Invalid time value", "time", e);
  }
  /**
   * Validates and sets boolean value
   * @private
   * @param {*} value - Boolean value
   * @returns {boolean} Validated boolean value
   * @throws {ConfigurationError} If boolean value is invalid
   */
  _setBoolean(e) {
    if (typeof e == "boolean")
      return e;
    if (e in Le)
      return Le[e];
    throw new L("Invalid boolean value", "boolean", e);
  }
  /**
   * Validates and sets transition function
   * @private
   * @param {string|boolean|null} value - Transition function value
   * @returns {string|null} Validated transition function
   * @throws {ConfigurationError} If transition function is invalid
   */
  _setTransitionFunction(e) {
    if (typeof e == "boolean")
      return e ? be.ease : null;
    if (typeof e == "string" && e in be)
      return be[e];
    if (e == null)
      return null;
    throw new L("Invalid transition function", "transitionFunction", e);
  }
  /**
   * Gets the current configuration as a plain object
   * @returns {Object} Configuration object
   */
  toObject() {
    return {
      id_div: this.id_div,
      position: this.position,
      orientation: this.orientation,
      mode: this.mode,
      size: this.size,
      draggable: this.draggable,
      hints: this.hints,
      clickable: this.clickable,
      movableColors: this.movableColors,
      moveHighlight: this.moveHighlight,
      overHighlight: this.overHighlight,
      moveAnimation: this.moveAnimation,
      moveTime: this.moveTime,
      dropOffBoard: this.dropOffBoard,
      snapbackTime: this.snapbackTime,
      snapbackAnimation: this.snapbackAnimation,
      dropCenterTime: this.dropCenterTime,
      dropCenterAnimation: this.dropCenterAnimation,
      fadeTime: this.fadeTime,
      fadeAnimation: this.fadeAnimation,
      piecesPath: this.piecesPath,
      animationStyle: this.animationStyle,
      simultaneousAnimationDelay: this.simultaneousAnimationDelay,
      onlyLegalMoves: this.onlyLegalMoves
    };
  }
  /**
   * Updates configuration with new values
   * @param {Object} updates - Configuration updates
   * @returns {ChessboardConfig} This instance for chaining
   * @throws {ConfigurationError} If updates are invalid
   */
  update(e) {
    if (!e || typeof e != "object")
      throw new L("Updates must be an object", "updates", e);
    this._validationService.validateConfig(e);
    const t = Object.assign({}, this.toObject(), e);
    return this._processConfiguration(t), this._setCSSProperties(t), this._configureModeSettings(), this;
  }
  /**
   * Cleans up resources
   */
  destroy() {
    this._validationService && (this._validationService.destroy(), this._validationService = null);
  }
}
class ge {
  constructor(e, t, i, s = 1) {
    this.color = e, this.type = t, this.id = this.getId(), this.src = i, this.element = this.createElement(i, s), console.debug(`[Piece] Constructed: ${this.id}`), this.check();
  }
  getId() {
    return this.type + this.color;
  }
  createElement(e, t = 1) {
    const i = document.createElement("img");
    return i.classList.add("piece"), i.id = this.id, i.src = e || this.src, i.style.opacity = t, i.onerror = () => {
      console.warn("Failed to load piece image:", i.src);
    }, i;
  }
  visible() {
    this.element && (this.element.style.opacity = 1, console.debug(`[Piece] visible: ${this.id}`));
  }
  invisible() {
    this.element && (this.element.style.opacity = 0, console.debug(`[Piece] invisible: ${this.id}`));
  }
  /**
   * Updates the piece image source
   * @param {string} newSrc - New image source
   */
  updateSrc(e) {
    this.src = e, this.element && (this.element.src = e);
  }
  /**
   * Transforms the piece to a new type with smooth animation
   * @param {string} newType - New piece type
   * @param {string} newSrc - New image source
   * @param {number} [duration=200] - Animation duration in milliseconds
   * @param {Function} [callback] - Callback when transformation is complete
   */
  transformTo(e, t, i = 200, s = null) {
    if (!this.element) {
      console.debug(`[Piece] transformTo: ${this.id} - element is null`), s && s();
      return;
    }
    const n = this.element;
    n.classList.add("transforming");
    const o = [
      { transform: "scale(1)", opacity: "1" },
      { transform: "scale(0.8)", opacity: "0.7" }
    ], r = [
      { transform: "scale(0.8)", opacity: "0.7" },
      { transform: "scale(1)", opacity: "1" }
    ], l = i / 2;
    if (n.animate) {
      const c = n.animate(o, {
        duration: l,
        easing: "ease-in",
        fill: "forwards"
      });
      c.onfinish = () => {
        if (!this.element) {
          console.debug(`[Piece] transformTo.scaleDown.onfinish: ${this.id} - element is null`), s && s();
          return;
        }
        this.type = e, this.id = this.getId(), this.src = t, n.src = t, n.id = this.id;
        const u = n.animate(r, {
          duration: l,
          easing: "ease-out",
          fill: "forwards"
        });
        u.onfinish = () => {
          if (!this.element) {
            console.debug(`[Piece] transformTo.scaleUp.onfinish: ${this.id} - element is null`), s && s();
            return;
          }
          n.style.transform = "", n.style.opacity = "", n.classList.remove("transforming"), n.classList.add("transform-complete"), setTimeout(() => {
            this.element && n.classList.remove("transform-complete");
          }, 400), console.debug(`[Piece] transformTo complete: ${this.id}`), s && s();
        };
      };
    } else
      n.style.transition = `transform ${l}ms ease-in, opacity ${l}ms ease-in`, n.style.transform = "scale(0.8)", n.style.opacity = "0.7", setTimeout(() => {
        if (!this.element) {
          console.debug(`[Piece] transformTo (fallback): ${this.id} - element is null`), s && s();
          return;
        }
        this.type = e, this.id = this.getId(), this.src = t, n.src = t, n.id = this.id, n.style.transition = `transform ${l}ms ease-out, opacity ${l}ms ease-out`, n.style.transform = "scale(1)", n.style.opacity = "1", setTimeout(() => {
          if (!this.element) {
            console.debug(`[Piece] transformTo (fallback, cleanup): ${this.id} - element is null`), s && s();
            return;
          }
          n.style.transition = "", n.style.transform = "", n.style.opacity = "", n.classList.remove("transforming"), n.classList.add("transform-complete"), setTimeout(() => {
            this.element && n.classList.remove("transform-complete");
          }, 400), console.debug(`[Piece] transformTo complete (fallback): ${this.id}`), s && s();
        }, l);
      }, l);
  }
  fadeIn(e, t, i, s) {
    const n = performance.now();
    let o = 0;
    const r = () => {
      if (!this.element) {
        console.debug(`[Piece] fadeIn: ${this.id} - element is null`), s && s();
        return;
      }
      const l = performance.now() - n;
      if (o = i(l, e, t), this.element.style.opacity = o, l < e)
        requestAnimationFrame(r);
      else {
        if (!this.element) {
          console.debug(`[Piece] fadeIn: ${this.id} - element is null (end)`), s && s();
          return;
        }
        this.element.style.opacity = 1, console.debug(`[Piece] fadeIn complete: ${this.id}`), s && s();
      }
    };
    r();
  }
  fadeOut(e, t, i, s) {
    const n = performance.now();
    let o = 1;
    const r = () => {
      if (!this.element) {
        console.debug(`[Piece] fadeOut: ${this.id} - element is null`), s && s();
        return;
      }
      const l = performance.now() - n;
      if (o = 1 - i(l, e, t), this.element.style.opacity = o, l < e)
        requestAnimationFrame(r);
      else {
        if (!this.element) {
          console.debug(`[Piece] fadeOut: ${this.id} - element is null (end)`), s && s();
          return;
        }
        this.element.style.opacity = 0, console.debug(`[Piece] fadeOut complete: ${this.id}`), s && s();
      }
    };
    r();
  }
  setDrag(e) {
    if (!this.element) {
      console.debug(`[Piece] setDrag: ${this.id} - element is null`);
      return;
    }
    this._dragHandler && this.element.removeEventListener("mousedown", this._dragHandler), this.element.ondragstart = (t) => {
      t.preventDefault();
    }, this._dragHandler = e, this.element.addEventListener("mousedown", this._dragHandler), console.debug(`[Piece] setDrag: ${this.id}`);
  }
  destroy() {
    console.debug(`[Piece] Destroy: ${this.id}`), this.element && (this._dragHandler && (this.element.removeEventListener("mousedown", this._dragHandler), this._dragHandler = null), this.element.onmousedown = null, this.element.ondragstart = null, this.element.parentNode && this.element.parentNode.removeChild(this.element), this.element = null);
  }
  translate(e, t, i, s, n = null) {
    if (!this.element) {
      console.debug(`[Piece] translate: ${this.id} - element is null`), n && n();
      return;
    }
    const o = this.element.getBoundingClientRect(), r = e.getBoundingClientRect(), l = o.left + o.width / 2, c = o.top + o.height / 2, u = r.left + r.width / 2, d = r.top + r.height / 2, h = u - l, m = d - c, f = [
      { transform: "translate(0, 0)" },
      { transform: `translate(${h}px, ${m}px)` }
    ];
    if (this.element.animate) {
      const g = this.element.animate(f, {
        duration: t,
        easing: "ease",
        fill: "none"
      });
      g.onfinish = () => {
        if (!this.element) {
          console.debug(`[Piece] translate.onfinish: ${this.id} - element is null`), n && n();
          return;
        }
        n && n(), this.element && (this.element.style = ""), console.debug(`[Piece] translate complete: ${this.id}`);
      };
    } else
      this.element.style.transition = `transform ${t}ms ease`, this.element.style.transform = `translate(${h}px, ${m}px)`, n && n(), this.element && (this.element.style = ""), console.debug(`[Piece] translate complete (no animate): ${this.id}`);
  }
  check() {
    if (["p", "r", "n", "b", "q", "k"].indexOf(this.type) === -1)
      throw new Error("Invalid piece type");
    if (["w", "b"].indexOf(this.color) === -1)
      throw new Error("Invalid piece color");
  }
}
class Ee {
  constructor(e, t) {
    this.row = e, this.col = t, this.id = this.getId(), this.element = this.createElement(), this.piece = null;
  }
  getPiece() {
    return this.piece;
  }
  opposite() {
    this.row = 9 - this.row, this.col = 9 - this.col, this.id = this.getId(), this.element = this.resetElement();
  }
  isWhite() {
    return (this.row + this.col) % 2 === 0;
  }
  getId() {
    return "abcdefgh"[this.col - 1] + this.row;
  }
  resetElement() {
    this.element.id = this.id, this.element.className = "", this.element.classList.add("square"), this.element.classList.add(this.isWhite() ? "whiteSquare" : "blackSquare");
  }
  createElement() {
    const e = document.createElement("div");
    return e.id = this.id, e.classList.add("square"), e.classList.add(this.isWhite() ? "whiteSquare" : "blackSquare"), e;
  }
  getElement() {
    return this.element;
  }
  getBoundingClientRect() {
    return this.element.getBoundingClientRect();
  }
  removePiece(e = !1) {
    return this.piece && (!e && typeof this.piece.destroy == "function" && this.piece.destroy(), this.piece = null), null;
  }
  /**
   * Forcefully removes all pieces from this square
   */
  forceRemoveAllPieces() {
    this.piece && typeof this.piece.destroy == "function" && (this.piece.destroy(), this.piece = null), this.element.querySelectorAll("img.piece").forEach((t) => {
      t.parentNode === this.element && this.element.removeChild(t);
    });
  }
  /**
   * Replaces the current piece with a new one efficiently
   * @param {Piece} newPiece - The new piece to place
   */
  replacePiece(e) {
    this.piece && this.removePiece(), this.putPiece(e), e.element.style.opacity = "1";
  }
  addEventListener(e, t) {
    this.element.addEventListener(e, t);
  }
  putPiece(e) {
    this.piece && this.removePiece(!0), this.piece = e, e && e.element && this.element.appendChild(e.element);
  }
  putHint(e) {
    if (this.element.querySelector(".hint"))
      return;
    const t = document.createElement("div");
    t.classList.add("hint"), this.element.appendChild(t), e && t.classList.add("catchable");
  }
  removeHint() {
    const e = this.element.querySelector(".hint");
    e && this.element.removeChild(e);
  }
  select() {
    this.element.classList.add(this.isWhite() ? "selectedSquareWhite" : "selectedSquareBlack");
  }
  deselect() {
    this.element.classList.remove("selectedSquareWhite"), this.element.classList.remove("selectedSquareBlack");
  }
  moved() {
    this.element.classList.add(this.isWhite() ? "movedSquareWhite" : "movedSquareBlack");
  }
  unmoved() {
    this.element.classList.remove("movedSquareWhite"), this.element.classList.remove("movedSquareBlack");
  }
  highlight() {
    this.element.classList.add("highlighted");
  }
  dehighlight() {
    this.element.classList.remove("highlighted");
  }
  putCover(e) {
    const t = document.createElement("div");
    t.classList.add("square"), t.classList.add("cover"), this.element.appendChild(t), t.addEventListener("click", (i) => {
      i.stopPropagation(), e();
    });
  }
  removeCover() {
    const e = this.element.querySelector(".cover");
    e && this.element.removeChild(e);
  }
  putPromotion(e, t) {
    const i = document.createElement("div");
    i.classList.add("square"), i.classList.add("choice"), this.element.appendChild(i);
    const s = document.createElement("img");
    s.classList.add("piece"), s.classList.add("choicable"), s.src = e, i.appendChild(s), i.addEventListener("click", (n) => {
      n.stopPropagation(), t();
    });
  }
  hasPromotion() {
    return this.element.querySelector(".choice") !== null;
  }
  removePromotion() {
    const e = this.element.querySelector(".choice");
    e && (e.removeChild(e.firstChild), this.element.removeChild(e));
  }
  destroy() {
    this.forceRemoveAllPieces(), this.element.remove(), this.piece = null;
  }
  hasPiece() {
    return this.piece !== null;
  }
  getColor() {
    return this.piece.getColor();
  }
  check() {
    if (this.row < 1 || this.row > 8)
      throw new Error("Invalid square: row is out of bounds");
    if (this.col < 1 || this.col > 8)
      throw new Error("Invalid square: col is out of bounds");
  }
}
let W = class {
  constructor(e, t, i = null, s = !1) {
    this.piece = e ? e.getPiece() : null, this.from = e, this.to = t, this.promotion = i, s && this.check();
  }
  hasPromotion() {
    return this.promotion !== null;
  }
  setPromotion(e) {
    this.promotion = e;
  }
  check() {
    return !(this.piece === null || !(this.piece instanceof ge) || ["q", "r", "b", "n", null].indexOf(this.promotion) === -1 || !(this.from instanceof Ee) || !(this.to instanceof Ee) || !this.to || !this.from || this.from === this.to);
  }
  isLegal(e) {
    return e.moves({ square: this.from.id, verbose: !0 }).map((i) => i.to).indexOf(this.to.id) !== -1;
  }
};
class rt {
  /**
   * Creates a new AnimationService instance
   * @param {ChessboardConfig} config - Board configuration
   */
  constructor(e) {
    this.config = e, this.activeAnimations = /* @__PURE__ */ new Map(), this.animationId = 0;
  }
  /**
   * Creates a timing function for animations
   * @param {string} [type='ease'] - Animation type
   * @returns {Function} Timing function
   */
  createTimingFunction(e = "ease") {
    return (t, i) => {
      const s = t / i;
      switch (e) {
        case "linear":
          return s;
        case "ease":
          return s ** 2 * (3 - 2 * s);
        case "ease-in":
          return s ** 2;
        case "ease-out":
          return -1 * (s - 1) ** 2 + 1;
        case "ease-in-out":
          return s < 0.5 ? 2 * s ** 2 : 4 * s - 2 * s ** 2 - 1;
        default:
          return s;
      }
    };
  }
  /**
   * Animates an element with given properties
   * @param {HTMLElement} element - Element to animate
   * @param {Object} properties - Properties to animate
   * @param {number} duration - Animation duration in milliseconds
   * @param {string} [easing='ease'] - Easing function
   * @param {Function} [callback] - Callback when animation completes
   * @returns {number} Animation ID
   */
  animate(e, t, i, s = "ease", n) {
    const o = ++this.animationId, r = this.createTimingFunction(s), l = performance.now(), c = {};
    Object.keys(t).forEach((d) => {
      c[d] = this._getInitialValue(e, d);
    });
    const u = (d) => {
      const h = d - l, m = Math.min(h / i, 1), f = r(h, i);
      Object.keys(t).forEach((g) => {
        const b = c[g], w = t[g], y = this._interpolateValue(b, w, f);
        this._applyValue(e, g, y);
      }), m < 1 && this.activeAnimations.has(o) ? requestAnimationFrame(u) : (this.activeAnimations.delete(o), n && n());
    };
    return this.activeAnimations.set(o, { element: e, animate: u, callback: n }), requestAnimationFrame(u), o;
  }
  /**
   * Cancels an animation
   * @param {number} animationId - Animation ID to cancel
   */
  cancel(e) {
    this.activeAnimations.has(e) && this.activeAnimations.delete(e);
  }
  /**
   * Cancels all animations
   */
  cancelAll() {
    this.activeAnimations.clear();
  }
  /**
   * Gets initial value for a property
   * @private
   * @param {HTMLElement} element - Element
   * @param {string} property - Property name
   * @returns {number} Initial value
   */
  _getInitialValue(e, t) {
    if (!e || !e.style) return 0;
    switch (t) {
      case "opacity":
        return parseFloat(getComputedStyle(e).opacity) || 1;
      case "left":
        return parseFloat(e.style.left) || 0;
      case "top":
        return parseFloat(e.style.top) || 0;
      case "scale":
        return 1;
      default:
        return 0;
    }
  }
  /**
   * Interpolates between two values
   * @private
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} progress - Progress (0-1)
   * @returns {number} Interpolated value
   */
  _interpolateValue(e, t, i) {
    return e + (t - e) * i;
  }
  /**
   * Applies animated value to element
   * @private
   * @param {HTMLElement} element - Element
   * @param {string} property - Property name
   * @param {number} value - Value to apply
   */
  _applyValue(e, t, i) {
    if (!(!e || !e.style))
      switch (t) {
        case "opacity":
          e.style.opacity = i;
          break;
        case "left":
          e.style.left = `${i}px`;
          break;
        case "top":
          e.style.top = `${i}px`;
          break;
        case "scale":
          e.style.transform = `scale(${i})`;
          break;
        default:
          e.style[t] = i;
      }
  }
  /**
   * Cleans up resources
   */
  destroy() {
    this.cancelAll();
  }
}
class at {
  /**
   * Creates a new BoardService instance
   * @param {ChessboardConfig} config - Board configuration
   */
  constructor(e) {
    this.config = e, this.element = null, this.squares = {};
  }
  /**
   * Builds the board DOM element and attaches it to the configured container
   * @throws {DOMError} When the container element cannot be found
   */
  buildBoard() {
    if (console.log("BoardService.buildBoard: Looking for element with ID:", this.config.id_div), this.element = document.getElementById(this.config.id_div), !this.element)
      throw new tt(C.invalid_id_div + this.config.id_div, this.config.id_div);
    this.resize(this.config.size), this.element.className = "board";
  }
  /**
   * Creates all 64 squares and adds them to the board
   * @param {Function} coordConverter - Function to convert row/col to real coordinates
   */
  buildSquares(e) {
    for (let t = 0; t < Me.ROWS; t++)
      for (let i = 0; i < Me.COLS; i++) {
        const [s, n] = e(t, i), o = new Ee(s, n);
        this.squares[o.getId()] = o, this.element.appendChild(o.element);
      }
  }
  /**
   * Removes all squares from the board and cleans up their resources
   * Best practice: always destroy JS objects and DOM nodes, and clear references.
   */
  removeSquares() {
    for (const e of Object.values(this.squares))
      e.destroy();
    this.squares = {};
  }
  /**
   * Removes all content from the board element
   * Best practice: clear DOM and force element to be re-fetched on next build.
   */
  removeBoard() {
    this.element && (this.element.innerHTML = "", this.element = null);
  }
  /**
   * Resizes the board to the specified size
   * @param {number|string} value - Size in pixels or 'auto'
   * @throws {ValidationError} When size value is invalid
   */
  resize(e) {
    if (e === "auto") {
      const t = this._calculateAutoSize();
      this.resize(t);
    } else {
      if (typeof e != "number")
        throw new k(C.invalid_value + e, "size", e);
      document.documentElement.style.setProperty("--dimBoard", `${e}px`);
    }
  }
  /**
   * Calculates the optimal size when 'auto' is specified
   * @private
   * @returns {number} Calculated size in pixels
   */
  _calculateAutoSize() {
    if (!this.element) return 400;
    const { offsetWidth: e, offsetHeight: t } = this.element;
    return e === 0 ? t || 400 : t === 0 ? e : Math.min(e, t);
  }
  /**
   * Gets a square by its ID
   * @param {string} squareId - Square identifier (e.g., 'e4')
   * @returns {Square|null} The square or null if not found
   */
  getSquare(e) {
    return this.squares[e] || null;
  }
  /**
   * Gets all squares
   * @returns {Object.<string, Square>} All squares indexed by ID
   */
  getAllSquares() {
    return { ...this.squares };
  }
  /**
   * Applies a method to all squares
   * @param {string} methodName - Name of the method to call on each square
   * @param {...*} args - Arguments to pass to the method
   */
  applyToAllSquares(e, ...t) {
    for (const i of Object.values(this.squares))
      typeof i[e] == "function" && i[e](...t);
  }
  /**
   * Cleans up all resources
   */
  destroy() {
    this.removeSquares(), this.removeBoard(), this.element = null, this.squares = {};
  }
}
class lt {
  /**
   * Creates a new CoordinateService instance
   * @param {ChessboardConfig} config - Board configuration
   */
  constructor(e) {
    this.config = e;
  }
  /**
   * Converts logical coordinates to real coordinates based on board orientation
   * @param {number} row - Row index (0-7)
   * @param {number} col - Column index (0-7)
   * @returns {Array<number>} Real coordinates [row, col] (1-8)
   */
  realCoord(e, t) {
    let i = e, s = t;
    return this.isWhiteOriented() ? i = 7 - e : s = 7 - t, [i + 1, s + 1];
  }
  /**
   * Converts board coordinates to square ID
   * @param {number} row - Row index (0-7)
   * @param {number} col - Column index (0-7)
   * @returns {string} Square ID (e.g., 'e4')
   */
  getSquareID(e, t) {
    if (e = parseInt(e), t = parseInt(t), this.isWhiteOriented() ? (e = 8 - e, t = t + 1) : (e = e + 1, t = 8 - t), t < 1 || t > 8 || e < 1 || e > 8)
      throw new k(
        `Invalid board coordinates: row=${e}, col=${t}`,
        "coordinates",
        { row: e, col: t }
      );
    return he[t - 1] + e;
  }
  /**
   * Converts square ID to board coordinates
   * @param {string} squareId - Square ID (e.g., 'e4')
   * @returns {Array<number>} Board coordinates [row, col] (0-7)
   */
  getCoordinatesFromSquareID(e) {
    if (typeof e != "string" || e.length !== 2)
      throw new k(C.invalid_square + e, "squareId", e);
    const t = e[0], i = parseInt(e[1]), s = he.indexOf(t);
    if (s === -1)
      throw new k(C.invalid_square + e, "squareId", e);
    if (i < 1 || i > 8)
      throw new k(C.invalid_square + e, "squareId", e);
    let n, o;
    return this.isWhiteOriented() ? (n = 8 - i, o = s) : (n = i - 1, o = 7 - s), [n, o];
  }
  /**
   * Converts pixel coordinates to square ID
   * @param {number} x - X coordinate in pixels
   * @param {number} y - Y coordinate in pixels
   * @param {HTMLElement} boardElement - Board DOM element
   * @returns {string|null} Square ID or null if outside board
   */
  pixelToSquareID(e, t, i) {
    if (!i) return null;
    const s = i.getBoundingClientRect(), { width: n, height: o } = s;
    if (e < 0 || e >= n || t < 0 || t >= o)
      return null;
    const r = n / 8, l = o / 8, c = Math.floor(e / r), u = Math.floor(t / l);
    try {
      return this.getSquareID(u, c);
    } catch {
      return null;
    }
  }
  /**
   * Converts square ID to pixel coordinates
   * @param {string} squareId - Square ID (e.g., 'e4')
   * @param {HTMLElement} boardElement - Board DOM element
   * @returns {Object|null} Pixel coordinates {x, y} or null if invalid
   */
  squareIDToPixel(e, t) {
    if (!t) return null;
    try {
      const [i, s] = this.getCoordinatesFromSquareID(e), n = t.getBoundingClientRect(), { width: o, height: r } = n, l = o / 8, c = r / 8, u = s * l, d = i * c;
      return { x: u, y: d };
    } catch {
      return null;
    }
  }
  /**
   * Gets the center pixel coordinates of a square
   * @param {string} squareId - Square ID (e.g., 'e4')
   * @param {HTMLElement} boardElement - Board DOM element
   * @returns {Object|null} Center coordinates {x, y} or null if invalid
   */
  getSquareCenter(e, t) {
    const i = this.squareIDToPixel(e, t);
    if (!i) return null;
    const s = t.getBoundingClientRect(), n = s.width / 8, o = s.height / 8;
    return {
      x: i.x + n / 2,
      y: i.y + o / 2
    };
  }
  /**
   * Calculates the distance between two squares
   * @param {string} fromSquare - Source square ID
   * @param {string} toSquare - Target square ID
   * @returns {number} Distance between squares
   */
  getSquareDistance(e, t) {
    try {
      const [i, s] = this.getCoordinatesFromSquareID(e), [n, o] = this.getCoordinatesFromSquareID(t), r = Math.abs(n - i), l = Math.abs(o - s);
      return Math.sqrt(r * r + l * l);
    } catch {
      return 0;
    }
  }
  /**
   * Checks if the board is oriented from white's perspective
   * @returns {boolean} True if white-oriented
   */
  isWhiteOriented() {
    return this.config.orientation === "w";
  }
  /**
   * Checks if the board is oriented from black's perspective
   * @returns {boolean} True if black-oriented
   */
  isBlackOriented() {
    return this.config.orientation === "b";
  }
  /**
   * Gets the current orientation
   * @returns {string} Current orientation ('w' or 'b')
   */
  getOrientation() {
    return this.config.orientation;
  }
  /**
   * Sets the orientation
   * @param {string} orientation - New orientation ('w', 'b', 'white', 'black')
   */
  setOrientation(e) {
    const t = e === "white" ? "w" : e === "black" ? "b" : e;
    if (t !== "w" && t !== "b")
      throw new k(
        `${C.invalid_orientation}${e}`,
        "orientation",
        e
      );
    this.config.orientation = t;
  }
  /**
   * Flips the board orientation
   */
  flipOrientation() {
    this.config.orientation = this.isWhiteOriented() ? "b" : "w";
  }
  /**
   * Gets all square IDs in order
   * @returns {Array<string>} Array of all square IDs
   */
  getAllSquareIDs() {
    const e = [];
    for (let t = 0; t < 8; t++)
      for (let i = 0; i < 8; i++)
        e.push(this.getSquareID(t, i));
    return e;
  }
  /**
   * Gets squares in a specific rank (row)
   * @param {number} rank - Rank number (1-8)
   * @returns {Array<string>} Array of square IDs in the rank
   */
  getSquaresByRank(e) {
    if (e < 1 || e > 8)
      throw new k(`Invalid rank: ${e}`, "rank", e);
    const t = [];
    for (let i = 0; i < 8; i++) {
      const s = this.isWhiteOriented() ? 8 - e : e - 1;
      t.push(this.getSquareID(s, i));
    }
    return t;
  }
  /**
   * Gets squares in a specific file (column)
   * @param {string} file - File letter (a-h)
   * @returns {Array<string>} Array of square IDs in the file
   */
  getSquaresByFile(e) {
    const t = he.indexOf(e);
    if (t === -1)
      throw new k(`Invalid file: ${e}`, "file", e);
    const i = [];
    for (let s = 0; s < 8; s++)
      i.push(this.getSquareID(s, t));
    return i;
  }
}
class Ve {
  /**
   * Creates a new PerformanceMonitor instance
   */
  constructor() {
    this.metrics = /* @__PURE__ */ new Map(), this.observers = /* @__PURE__ */ new Map(), this.isEnabled = typeof performance < "u" && performance.mark, this.isEnabled && this._setupObservers();
  }
  /**
   * Sets up performance observers for automatic metrics collection
   * @private
   */
  _setupObservers() {
    try {
      if (typeof PerformanceObserver < "u") {
        const e = new PerformanceObserver((t) => {
          for (const i of t.getEntries())
            this.recordMetric(i.name, i.startTime);
        });
        e.observe({ entryTypes: ["paint"] }), this.observers.set("paint", e);
      }
    } catch (e) {
      console.warn("Performance observers not available:", e.message);
    }
  }
  /**
   * Starts measuring performance for a given operation
   * @param {string} name - Name of the operation
   */
  startMeasure(e) {
    if (this.isEnabled)
      try {
        performance.mark(`${e}-start`);
      } catch (t) {
        console.warn(`Failed to start performance measure for ${e}:`, t.message);
      }
  }
  /**
   * Ends measuring performance for a given operation
   * @param {string} name - Name of the operation
   * @returns {number} Duration in milliseconds
   */
  endMeasure(e) {
    if (!this.isEnabled) return 0;
    try {
      performance.mark(`${e}-end`);
      const t = performance.measure(e, `${e}-start`, `${e}-end`);
      return this.recordMetric(e, t.duration), performance.clearMarks(`${e}-start`), performance.clearMarks(`${e}-end`), performance.clearMeasures(e), t.duration;
    } catch (t) {
      return console.warn(`Failed to end performance measure for ${e}:`, t.message), 0;
    }
  }
  /**
   * Records a metric value
   * @param {string} name - Metric name
   * @param {number} value - Metric value
   */
  recordMetric(e, t) {
    this.metrics.has(e) || this.metrics.set(e, {
      count: 0,
      total: 0,
      min: 1 / 0,
      max: -1 / 0,
      values: []
    });
    const i = this.metrics.get(e);
    i.count++, i.total += t, i.min = Math.min(i.min, t), i.max = Math.max(i.max, t), i.values.push(t), i.values.length > 100 && i.values.shift();
  }
  /**
   * Gets metrics summary
   * @returns {Object} Metrics summary
   */
  getMetrics() {
    const e = {};
    for (const [t, i] of this.metrics)
      e[t] = {
        count: i.count,
        average: i.total / i.count,
        min: i.min,
        max: i.max,
        total: i.total,
        p95: this._calculatePercentile(i.values, 95),
        p99: this._calculatePercentile(i.values, 99)
      };
    return e;
  }
  /**
   * Calculates percentile for a set of values
   * @private
   * @param {Array<number>} values - Array of values
   * @param {number} percentile - Percentile to calculate (0-100)
   * @returns {number} Percentile value
   */
  _calculatePercentile(e, t) {
    if (e.length === 0) return 0;
    const i = [...e].sort((n, o) => n - o), s = Math.ceil(t / 100 * i.length) - 1;
    return i[Math.max(0, s)];
  }
  /**
   * Clears all metrics
   */
  clearMetrics() {
    this.metrics.clear();
  }
  /**
   * Destroys the performance monitor and cleans up resources
   */
  destroy() {
    for (const e of this.observers.values())
      e && typeof e.disconnect == "function" && e.disconnect();
    this.observers.clear(), this.metrics.clear();
  }
}
function zt(a, e) {
  let t;
  return function(...i) {
    t || (a.apply(this, i), t = !0, setTimeout(() => {
      t = !1;
    }, e));
  };
}
function Ht(a, e) {
  let t;
  const i = function(...s) {
    clearTimeout(t), t = setTimeout(() => a.apply(i.context, s), e);
  };
  return function(...s) {
    return i.context = this, i(...s);
  };
}
function De(a) {
  let e = !1;
  const t = function(...i) {
    e || (e = !0, requestAnimationFrame(() => {
      a.apply(t.context, i), e = !1;
    }));
  };
  return function(...i) {
    return t.context = this, t(...i);
  };
}
function Kt(a, e, t, i = 1) {
  !a || !a.style || (a.style.transform = `translate3d(${e}px, ${t}px, 0) scale(${i})`, a.style.willChange = "transform");
}
function Ut(a) {
  !a || !a.style || (a.style.transform = "", a.style.left = "", a.style.top = "", a.style.willChange = "");
}
function Wt(a) {
  return new Promise((e) => {
    requestAnimationFrame(() => {
      const t = a();
      e(t);
    });
  });
}
function Qt(a) {
  if (!a || !a.getBoundingClientRect) return !1;
  const e = a.getBoundingClientRect();
  return e.width > 0 && e.height > 0 && e.bottom > 0 && e.right > 0 && e.top < (window.innerHeight || document.documentElement.clientHeight) && e.left < (window.innerWidth || document.documentElement.clientWidth);
}
function Yt() {
  return typeof performance < "u" && performance.memory ? {
    used: performance.memory.usedJSHeapSize,
    total: performance.memory.totalJSHeapSize,
    limit: performance.memory.jsHeapSizeLimit
  } : {
    used: 0,
    total: 0,
    limit: 0,
    supported: !1
  };
}
function ct() {
  const a = navigator.userAgent, e = a.includes("Chrome") && !a.includes("Edg"), t = a.includes("Firefox"), i = a.includes("Safari") && !a.includes("Chrome"), s = a.includes("Edg");
  return {
    isChrome: e,
    isFirefox: t,
    isSafari: i,
    isEdge: s,
    devicePixelRatio: window.devicePixelRatio || 1,
    userAgent: a
  };
}
const ue = {
  /**
   * Apply browser-specific optimizations to an element
   * @param {HTMLElement} element - Element to optimize
   */
  enableForDrag(a) {
    const e = ct();
    a.style.willChange = "left, top", a.style.pointerEvents = "none", e.isChrome && (a.style.transform = "translateZ(0)"), e.isFirefox && (a.style.backfaceVisibility = "hidden");
  },
  /**
   * Clean up optimizations after drag
   * @param {HTMLElement} element - Element to clean up
   */
  cleanupAfterDrag(a) {
    a.style.willChange = "auto", a.style.pointerEvents = "", a.style.transform = "", a.style.backfaceVisibility = "";
  }
}, Z = Object.freeze({
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
}), ht = Object.freeze({
  level: Z.INFO,
  enableColors: !0,
  enableTimestamp: !0,
  enableStackTrace: !0,
  maxLogSize: 1e3,
  enableConsole: !0,
  enableStorage: !1,
  storageKey: "chessboard-logs"
}), $e = Object.freeze({
  DEBUG: "\x1B[36m",
  // Cyan
  INFO: "\x1B[32m",
  // Green
  WARN: "\x1B[33m",
  // Yellow
  ERROR: "\x1B[31m",
  // Red
  RESET: "\x1B[0m"
  // Reset
});
class ve {
  /**
   * Creates a new Logger instance
   * @param {Object} [config] - Logger configuration
   * @param {string} [name] - Logger name/namespace
   */
  constructor(e = {}, t = "Chessboard") {
    this.config = { ...ht, ...e }, this.name = t, this.logs = [], this.startTime = Date.now(), this.debug = this._createLogMethod("DEBUG"), this.info = this._createLogMethod("INFO"), this.warn = this._createLogMethod("WARN"), this.error = this._createLogMethod("ERROR"), this.performances = /* @__PURE__ */ new Map(), this.config.enableStorage && this._initStorage();
  }
  /**
   * Creates a log method for a specific level
   * @private
   * @param {string} level - Log level
   * @returns {Function} Log method
   */
  _createLogMethod(e) {
    return (t, i = {}, s = null) => {
      this._log(e, t, i, s);
    };
  }
  /**
   * Core logging method
   * @private
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   * @param {Error} error - Error object
   */
  _log(e, t, i, s) {
    if (Z[e] < this.config.level)
      return;
    const o = this._createLogEntry(e, t, i, s);
    this._storeLogEntry(o), this.config.enableConsole && this._outputToConsole(o), this.config.enableStorage && this._storeInStorage(o);
  }
  /**
   * Creates a structured log entry
   * @private
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   * @param {Error} error - Error object
   * @returns {Object} Log entry
   */
  _createLogEntry(e, t, i, s) {
    const n = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      level: e,
      logger: this.name,
      message: t,
      data: { ...i },
      runtime: Date.now() - this.startTime
    };
    return s && (n.error = {
      name: s.name,
      message: s.message,
      stack: this.config.enableStackTrace ? s.stack : null
    }), typeof performance < "u" && performance.memory && (n.memory = {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
    }), n;
  }
  /**
   * Stores log entry in memory
   * @private
   * @param {Object} entry - Log entry
   */
  _storeLogEntry(e) {
    this.logs.push(e), this.logs.length > this.config.maxLogSize && this.logs.shift();
  }
  /**
   * Outputs log entry to console
   * @private
   * @param {Object} entry - Log entry
   */
  _outputToConsole(e) {
    const t = this.config.enableColors ? $e[e.level] : "", i = this.config.enableColors ? $e.RESET : "", s = this.config.enableTimestamp ? `[${new Date(e.timestamp).toLocaleTimeString()}] ` : "", o = `${`${t}${s}[${e.logger}:${e.level}]${i}`} ${e.message}`, r = this._getConsoleMethod(e.level);
    Object.keys(e.data).length > 0 || e.error ? r(o, {
      data: e.data,
      error: e.error,
      runtime: `${e.runtime}ms`
    }) : r(o);
  }
  /**
   * Gets appropriate console method for log level
   * @private
   * @param {string} level - Log level
   * @returns {Function} Console method
   */
  _getConsoleMethod(e) {
    switch (e) {
      case "DEBUG":
        return console.debug || console.log;
      case "INFO":
        return console.info || console.log;
      case "WARN":
        return console.warn || console.log;
      case "ERROR":
        return console.error || console.log;
      default:
        return console.log;
    }
  }
  /**
   * Initializes localStorage for log storage
   * @private
   */
  _initStorage() {
    if (typeof localStorage > "u") {
      this.config.enableStorage = !1;
      return;
    }
    try {
      localStorage.setItem("test", "test"), localStorage.removeItem("test");
    } catch {
      this.config.enableStorage = !1, console.warn("localStorage not available, disabling log storage");
    }
  }
  /**
   * Stores log entry in localStorage
   * @private
   * @param {Object} entry - Log entry
   */
  _storeInStorage(e) {
    if (this.config.enableStorage)
      try {
        const t = JSON.parse(localStorage.getItem(this.config.storageKey) || "[]");
        t.push(e), t.length > this.config.maxLogSize && t.shift(), localStorage.setItem(this.config.storageKey, JSON.stringify(t));
      } catch (t) {
        console.warn("Failed to store log entry:", t);
      }
  }
  /**
   * Starts performance measurement
   * @param {string} name - Performance measurement name
   */
  startPerformance(e) {
    this.performances.set(e, {
      start: performance.now(),
      measurements: []
    }), this.debug(`Started performance measurement: ${e}`);
  }
  /**
   * Ends performance measurement
   * @param {string} name - Performance measurement name
   * @returns {number} Duration in milliseconds
   */
  endPerformance(e) {
    const t = this.performances.get(e);
    if (!t)
      return this.warn(`Performance measurement not found: ${e}`), 0;
    const i = performance.now() - t.start;
    return t.measurements.push(i), this.debug(`Performance measurement completed: ${e}`, {
      duration: `${i.toFixed(2)}ms`,
      measurements: t.measurements.length
    }), i;
  }
  /**
   * Gets performance statistics
   * @param {string} name - Performance measurement name
   * @returns {Object} Performance statistics
   */
  getPerformanceStats(e) {
    const t = this.performances.get(e);
    if (!t || t.measurements.length === 0)
      return null;
    const i = t.measurements, s = i.reduce((l, c) => l + c, 0), n = s / i.length, o = Math.min(...i), r = Math.max(...i);
    return {
      name: e,
      count: i.length,
      total: s.toFixed(2),
      average: n.toFixed(2),
      min: o.toFixed(2),
      max: r.toFixed(2)
    };
  }
  /**
   * Creates a child logger with a specific namespace
   * @param {string} namespace - Child logger namespace
   * @returns {Logger} Child logger instance
   */
  child(e) {
    return new ve(this.config, `${this.name}:${e}`);
  }
  /**
   * Sets log level
   * @param {string} level - Log level
   */
  setLevel(e) {
    Z[e] !== void 0 && (this.config.level = Z[e]);
  }
  /**
   * Gets current log level
   * @returns {string} Current log level
   */
  getLevel() {
    return Object.keys(Z).find((e) => Z[e] === this.config.level);
  }
  /**
   * Gets all stored logs
   * @returns {Array} Array of log entries
   */
  getLogs() {
    return [...this.logs];
  }
  /**
   * Clears all stored logs
   */
  clearLogs() {
    if (this.logs = [], this.config.enableStorage)
      try {
        localStorage.removeItem(this.config.storageKey);
      } catch (e) {
        console.warn("Failed to clear stored logs:", e);
      }
  }
  /**
   * Exports logs as JSON
   * @returns {string} JSON string of logs
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
  /**
   * Cleans up resources
   */
  destroy() {
    this.clearLogs(), this.performances.clear();
  }
}
const v = new ve();
function Jt(a, e) {
  return new ve(a, e);
}
class ut {
  /**
   * Creates a new EventService instance
   * @param {ChessboardConfig} config - Board configuration
   * @param {BoardService} boardService - Board service instance
   * @param {MoveService} moveService - Move service instance
   * @param {CoordinateService} coordinateService - Coordinate service instance
   * @param {Chessboard} chessboard - Chessboard instance
   */
  constructor(e, t, i, s, n) {
    this.config = e, this.boardService = t, this.moveService = i, this.coordinateService = s, this.chessboard = n, this.clicked = null, this.isDragging = !1, this.isAnimating = !1, this.promoting = !1, this._isProcessingDrop = !1, this.eventListeners = /* @__PURE__ */ new Map();
  }
  /**
   * Adds event listeners to all squares
   * @param {Function} onSquareClick - Callback for square clicks
   * @param {Function} onPieceHover - Callback for piece hover
   * @param {Function} onPieceLeave - Callback for piece leave
   */
  addListeners(e, t, i) {
    this.removeListeners();
    const s = this.boardService.getAllSquares();
    Object.values(s).forEach((n) => {
      this._addSquareListeners(n, e, t, i);
    });
  }
  /**
   * Adds event listeners to a specific square
   * @private
   * @param {Square} square - Square to add listeners to
   * @param {Function} onSquareClick - Click callback
   * @param {Function} onPieceHover - Hover callback
   * @param {Function} onPieceLeave - Leave callback
   */
  _addSquareListeners(e, t, i, s) {
    const n = [], o = De(() => {
      !this.clicked && this.config.hints && i(e);
    }), r = De(() => {
      !this.clicked && this.config.hints && s(e);
    }), l = (c) => {
      c.stopPropagation(), this.config.clickable && !this.isAnimating && (e.piece && e.piece._dragTimeout && (clearTimeout(e.piece._dragTimeout), e.piece._dragTimeout = null), t(e));
    };
    e.element.addEventListener("mouseover", o), e.element.addEventListener("mouseout", r), e.element.addEventListener("click", l), e.element.addEventListener("touchstart", l), n.push(
      { element: e.element, type: "mouseover", handler: o },
      { element: e.element, type: "mouseout", handler: r },
      { element: e.element, type: "click", handler: l },
      { element: e.element, type: "touchstart", handler: l }
    ), this.eventListeners.set(e.id, n);
  }
  /**
   * Creates a drag function for a piece
   * @param {Square} square - Square containing the piece
   * @param {Piece} piece - Piece to create drag function for
   * @param {Function} onDragStart - Drag start callback
   * @param {Function} onDragMove - Drag move callback
   * @param {Function} onDrop - Drop callback
   * @param {Function} onSnapback - Snapback callback
   * @param {Function} onMove - Move execution callback
   * @param {Function} onRemove - Remove piece callback
   * @returns {Function} Drag event handler
   */
  createDragFunction(e, t, i, s, n, o, r, l) {
    return console.log(
      "Creating drag function for:",
      e.id,
      t ? `${t.color}${t.type}` : "null"
    ), (c) => {
      var T, F;
      if (c.preventDefault(), !this.config.draggable || !t || this.isAnimating || this.isDragging)
        return;
      this.isDragging = !0;
      const u = e;
      let d = !1;
      const h = u;
      let m = e, f = null;
      const g = t.element;
      if (!this.moveService.canMove(h))
        return;
      const b = c.clientX || c.touches && ((T = c.touches[0]) == null ? void 0 : T.clientX) || 0, w = c.clientY || c.touches && ((F = c.touches[0]) == null ? void 0 : F.clientY) || 0, y = (A) => {
        const V = this.boardService.element, Q = V.offsetWidth / 8;
        let ee, te;
        A.touches && A.touches[0] ? (ee = A.touches[0].clientX, te = A.touches[0].clientY) : (ee = A.clientX, te = A.clientY);
        const ie = V.getBoundingClientRect(), X = ee - ie.left - Q / 2, se = te - ie.top - Q / 2;
        return g.style.left = `${X}px`, g.style.top = `${se}px`, !0;
      }, p = (A) => {
        const V = A.clientX || 0, Q = A.clientY || 0, ee = Math.abs(V - b), te = Math.abs(Q - w);
        if (!d && (ee > 3 || te > 3)) {
          d = !0, this.config.clickable && h.select();
          const ne = window.getComputedStyle(g), Qe = ne.width, Ye = ne.height;
          if (g.style.position = "absolute", g.style.zIndex = "100", g.classList.add("dragging"), g.style.width = Qe, g.style.height = Ye, ue.enableForDrag(g), !i(e, t))
            return;
        }
        if (!d) return;
        y(A);
        const ie = this.boardService.element, X = ie.getBoundingClientRect(), se = A.clientX - X.left, _e = A.clientY - X.top;
        let Re = null;
        if (se >= 0 && se <= X.width && _e >= 0 && _e <= X.height) {
          const ne = this.coordinateService.pixelToSquareID(se, _e, ie);
          Re = ne ? this.boardService.getSquare(ne) : null;
        }
        m = Re, s(h, m, t), m !== f && (m == null || m.highlight(), f == null || f.dehighlight(), f = m);
      }, P = () => {
        if (f == null || f.dehighlight(), document.removeEventListener("mousemove", p), window.removeEventListener("mouseup", P), g.removeEventListener("mouseup", P), !d)
          return;
        console.log("onMouseUp: Handling drag completion for piece at", u.id), g.style.zIndex = "20", g.classList.remove("dragging"), g.style.willChange = "auto", ue.cleanupAfterDrag(g), this.isDragging = !1, this.clicked = null;
        const A = n(u, m, t);
        !m && (this.config.dropOffBoard === "trash" || A === "trash") ? this._handleTrashDrop(u, l) : m ? this._handleDrop(u, m, t, r, o) : (g.style.position = "", g.style.left = "", g.style.top = "", g.style.transform = "", g.style.width = "", g.style.height = "", ue.cleanupAfterDrag(g), this._handleSnapback(u, t, o), this._cleanupAfterFailedMove(u));
      };
      window.addEventListener("mouseup", P, { once: !0 }), document.addEventListener("mousemove", p), g.addEventListener("mouseup", P, { once: !0 });
    };
  }
  /**
   * Handles trash drop (piece removal)
   * @private
   * @param {Square} fromSquare - Source square
   * @param {Function} onRemove - Callback to remove piece
   */
  _handleTrashDrop(e, t) {
    this.boardService.applyToAllSquares("unmoved"), this.boardService.applyToAllSquares("removeHint"), e.deselect(), this.clicked = null, t && t(e.getId()), v.debug("EventService: Trash drop executed, state cleaned up");
  }
  /**
   * Handles snapback animation
   * @private
   * @param {Square} fromSquare - Source square
   * @param {Piece} piece - Piece to snapback
   * @param {Function} onSnapback - Snapback callback
   */
  _handleSnapback(e, t, i) {
    e && e.piece && i && i(e, t), v.debug("EventService: Snapback executed, cleaning up state");
  }
  /**
   * Handles successful drop
   * @private
   * @param {Square} fromSquare - Source square
   * @param {Square} toSquare - Target square
   * @param {Piece} piece - Piece being dropped
   * @param {Function} onMove - Move callback
   * @param {Function} onSnapback - Snapback callback
   */
  _handleDrop(e, t, i, s, n) {
    if (console.log("=== _handleDrop CALLED ==="), console.log("From:", e.id, "To:", t.id), console.log("Piece:", i ? `${i.color}${i.type}` : "null"), console.log("Stack trace:", new Error().stack.split(`
`)[1]), console.log("Caller:", new Error().stack.split(`
`)[2]), this.isAnimating || this._isProcessingDrop) {
      console.log("Drop ignored - already processing or animating");
      return;
    }
    this._isProcessingDrop = !0;
    const o = () => {
      this._isProcessingDrop = !1;
    };
    try {
      this.moveService.requiresPromotion(new W(e, t)) ? (v.debug("Drag move requires promotion:", e.id, "->", t.id), this.moveService.setupPromotion(
        new W(e, t),
        this.boardService.squares,
        (r) => {
          v.debug("Drag promotion selected:", r), this.boardService.applyToAllSquares("removePromotion"), this.boardService.applyToAllSquares("removeCover"), s(e, t, r, !0) ? (this._schedulePromotionPieceReplacement(t, r), this._cleanupAfterSuccessfulMove(e)) : (this._handleSnapback(e, i, n), this._cleanupAfterFailedMove(e)), o();
        },
        () => {
          v.debug("Drag promotion cancelled"), this.boardService.applyToAllSquares("removePromotion"), this.boardService.applyToAllSquares("removeCover"), this._handleSnapback(e, i, n), this._cleanupAfterFailedMove(e), o();
        }
      )) : (s(e, t, null, !0) ? this._cleanupAfterSuccessfulMove(e) : (this._handleSnapback(e, i, n), this._cleanupAfterFailedMove(e)), o());
    } catch (r) {
      console.error("Error in _handleDrop:", r), o();
    }
  }
  /**
   * Cleans up visual state after a SUCCESSFUL move
   * @private
   * @param {Square} fromSquare - Source square
   */
  _cleanupAfterSuccessfulMove(e) {
    this.clicked = null, this.isDragging = !1, e && e.deselect(), this.boardService.applyToAllSquares("removeHint"), this.boardService.applyToAllSquares("dehighlight"), this.boardService.applyToAllSquares("removePromotion"), this.boardService.applyToAllSquares("removeCover"), v.debug("EventService: All visual state cleaned up after SUCCESSFUL move");
  }
  /**
   * Cleans up visual state after a FAILED move (snapback, invalid move)
   * @private
   * @param {Square} fromSquare - Source square
   */
  _cleanupAfterFailedMove(e) {
    this.clicked = null, this.isDragging = !1, this.boardService.applyToAllSquares("removePromotion"), this.boardService.applyToAllSquares("removeCover"), this.boardService.applyToAllSquares("removeHint"), e && e.deselect(), v.debug("EventService: Conservative cleanup after FAILED move");
  }
  /**
   * Animates piece to center of target square (visual only)
   * @private
   * @param {Piece} piece - Piece to animate
   * @param {Square} targetSquare - Target square
   * @param {Function} callback - Callback when animation completes
   */
  _animatePieceToCenter(e, t, i = null) {
    if (!e || !t) {
      i && i();
      return;
    }
    const s = this.config.dropCenterTime, n = e.element.getBoundingClientRect(), o = t.element.getBoundingClientRect(), r = n.left + n.width / 2, l = n.top + n.height / 2, c = o.left + o.width / 2, u = o.top + o.height / 2, d = c - r, h = u - l;
    if (Math.abs(d) < 1 && Math.abs(h) < 1) {
      e.element.style.position = "", e.element.style.left = "", e.element.style.top = "", e.element.style.transform = "", e.element.style.zIndex = "", i && i();
      return;
    }
    const m = [
      { transform: "translate(0, 0)" },
      { transform: `translate(${d}px, ${h}px)` }
    ];
    if (e.element.animate) {
      const f = e.element.animate(m, {
        duration: s,
        easing: "ease",
        fill: "none"
        // Don't keep the final position
      });
      f.onfinish = () => {
        if (!e.element) {
          i && i();
          return;
        }
        e.element.style.position = "", e.element.style.left = "", e.element.style.top = "", e.element.style.transform = "", e.element.style.zIndex = "", e.element.style.transition = "", i && i();
      };
    } else
      e.element.style.transition = `transform ${s}ms ease`, e.element.style.transform = `translate(${d}px, ${h}px)`, setTimeout(() => {
        if (!e.element) {
          i && i();
          return;
        }
        e.element.style.position = "relative", e.element.style.left = "0", e.element.style.top = "0", e.element.style.transform = "translate(-50%, -50%)", e.element.style.zIndex = "20", e.element.style.transition = "none", i && i();
      }, s);
  }
  /**
   * Handles square click events
   * @param {Square} square - Clicked square
   * @param {Function} onMove - Move callback
   * @param {Function} onSelect - Select callback
   * @param {Function} onDeselect - Deselect callback
   * @param {boolean} [animate=true] - Whether to animate the move
   * @returns {boolean} True if move was successful
   */
  onClick(e, t, i, s, n = !0) {
    var c, u, d;
    if (this.isDragging = !1, this.isAnimating)
      return v.debug("EventService.onClick: Ignoring click during animation"), !1;
    v.debug("=== EventService.onClick START ==="), v.debug(
      "EventService.onClick: square =",
      e.id,
      "clicked =",
      ((c = this.clicked) == null ? void 0 : c.id) || "none",
      "isAnimating =",
      this.isAnimating
    ), v.debug(
      "EventService.onClick: Square piece =",
      e.piece ? `${e.piece.color}${e.piece.type}` : "empty"
    ), v.debug(
      "EventService.onClick: Clicked square piece =",
      (u = this.clicked) != null && u.piece ? `${this.clicked.piece.color}${this.clicked.piece.type}` : this.clicked ? "empty" : "none"
    );
    let o = this.clicked, r = null;
    return this.promoting && (this.promoting === "none" ? o = null : r = this.promoting, this.promoting = !1, this.boardService.applyToAllSquares("removePromotion"), this.boardService.applyToAllSquares("removeCover")), o ? (v.debug("EventService.onClick: We have a source square:", o.id, "target:", e.id), this.clicked === e ? (s(e), this.clicked = null, !1) : !r && this.moveService.requiresPromotion(new W(o, e)) ? (v.debug("Move requires promotion:", o.id, "->", e.id), this.moveService.setupPromotion(
      new W(o, e),
      this.boardService.squares,
      (h) => {
        v.debug("Promotion selected:", h), this.boardService.applyToAllSquares("removePromotion"), this.boardService.applyToAllSquares("removeCover"), t(o, e, h, n) && (this._schedulePromotionPieceReplacement(e, h), s(o), this.clicked = null);
      },
      () => {
        v.debug("Promotion cancelled"), this.boardService.applyToAllSquares("removePromotion"), this.boardService.applyToAllSquares("removeCover"), s(o), this.clicked = null;
      }
    ), !1) : (v.debug("EventService.onClick: Attempting move from", o.id, "to", e.id), v.debug("EventService.onClick: Current game state before move attempt"), t(o, e, r, n) ? (v.debug("EventService.onClick: Move successful"), s(o), this.clicked = null, v.debug("=== EventService.onClick END (move successful) ==="), !0) : (v.debug(
      "EventService.onClick: Move failed from",
      o.id,
      "to",
      e.id,
      "- resetting state"
    ), s(o), this.clicked = null, this.isDragging = !1, this.boardService.applyToAllSquares("removeHint"), this.moveService.canMove(e) ? (v.debug("EventService.onClick: Can select new piece at", e.id), this.clicked = e, this.config.clickable && (i(e), v.debug("EventService.onClick: New piece selected visually:", e.id)), v.debug("EventService.onClick: New piece selected at", e.id)) : v.debug(
      "EventService.onClick: Cannot select piece at",
      e.id,
      "- staying deselected"
    ), v.debug("=== EventService.onClick END (move failed) ==="), !1))) : (v.debug("EventService.onClick: No source square, checking if can move:", e.id), this.moveService.canMove(e) ? (v.debug("EventService.onClick: Can move! Setting clicked to:", e.id), this.clicked = e, this.config.clickable && (i(e), v.debug("EventService.onClick: Square selected visually:", e.id)), v.debug("EventService.onClick: After setting, clicked =", ((d = this.clicked) == null ? void 0 : d.id) || "none"), !1) : (v.debug("EventService.onClick: Cannot move square:", e.id), !1));
  }
  /**
   * Schedules piece replacement after promotion animation
   * @private
   * @param {Square} square - Target square
   * @param {string} promotionPiece - Piece to promote to
   */
  _schedulePromotionPieceReplacement(e, t) {
    this.chessboard._isPromoting = !0, this._waitForPieceAndReplace(e, t, 0);
  }
  /**
   * Waits for piece to be present and then replaces it
   * @private
   * @param {Square} square - Target square
   * @param {string} promotionPiece - Piece to promote to
   * @param {number} attempt - Current attempt number
   */
  _waitForPieceAndReplace(e, t, i) {
    const n = this.boardService.getSquare(e.id);
    if (!n) {
      v.warn("Target square not found:", e.id), this.chessboard._isPromoting = !1;
      return;
    }
    if (n.piece && n.piece.element) {
      v.debug("Piece found on", e.id, "after", i, "attempts"), this._replacePromotionPiece(e, t), setTimeout(() => {
        this.chessboard._isPromoting = !1, v.debug("Promotion protection ended"), this.chessboard._updateBoardPieces(!1);
      }, 400);
      return;
    }
    i < 20 ? setTimeout(() => {
      this._waitForPieceAndReplace(e, t, i + 1);
    }, 50) : (v.warn("Failed to find piece for promotion after", 20, "attempts"), this.chessboard._isPromoting = !1, this.chessboard._updateBoardPieces(!1));
  }
  /**
   * Replaces the piece on the square with the promotion piece
   * @private
   * @param {Square} square - Target square
   * @param {string} promotionPiece - Piece to promote to
   */
  _replacePromotionPiece(e, t) {
    v.debug("Replacing piece on", e.id, "with", t);
    const i = this.boardService.getSquare(e.id);
    if (!i) {
      v.debug("Target square not found:", e.id);
      return;
    }
    const n = this.chessboard.positionService.getGame().get(i.id);
    if (!n) {
      v.debug("No piece found in game state for", i.id);
      return;
    }
    const o = i.piece;
    if (!o) {
      v.warn("No piece found on target square for promotion");
      const c = t + n.color, u = this.chessboard.pieceService.getPiecePath(c), d = new ge(n.color, t, u);
      i.putPiece(d);
      const h = this.chessboard._createDragFunction.bind(this.chessboard);
      d.setDrag(h(i, d)), v.debug("Created new promotion piece:", c, "on", i.id);
      return;
    }
    const r = t + n.color, l = this.chessboard.pieceService.getPiecePath(r);
    v.debug("Transforming piece to:", r, "with path:", l), o.transformTo(
      t,
      l,
      300,
      // Duration of the transformation animation
      () => {
        const c = this.chessboard._createDragFunction.bind(this.chessboard);
        o.setDrag(c(i, o)), this.config.hints && this.chessboard.moveService && setTimeout(() => {
          this.chessboard.moveService.clearCache();
        }, 100), v.debug("Successfully transformed piece on", i.id, "to", r);
      }
    );
  }
  /**
   * Sets the clicked square
   * @param {Square|null} square - Square to set as clicked
   */
  setClicked(e) {
    this.clicked = e;
  }
  /**
   * Gets the currently clicked square
   * @returns {Square|null} Currently clicked square
   */
  getClicked() {
    return this.clicked;
  }
  /**
   * Sets the promotion state
   * @param {string|boolean} promotion - Promotion piece type or false
   */
  setPromoting(e) {
    this.promoting = e;
  }
  /**
   * Gets the promotion state
   * @returns {string|boolean} Current promotion state
   */
  getPromoting() {
    return this.promoting;
  }
  /**
   * Sets the animation state
   * @param {boolean} isAnimating - Whether animations are in progress
   */
  setAnimating(e) {
    this.isAnimating = e;
  }
  /**
   * Gets the animation state
   * @returns {boolean} Whether animations are in progress
   */
  getAnimating() {
    return this.isAnimating;
  }
  /**
   * Removes all existing event listeners
   */
  removeListeners() {
    this.eventListeners.forEach((e) => {
      e.forEach(({ element: t, type: i, handler: s }) => {
        t.removeEventListener(i, s);
      });
    }), this.eventListeners.clear();
  }
  /**
   * Removes all event listeners
   */
  removeAllListeners() {
    this.eventListeners.forEach((e) => {
      e.forEach(({ element: t, type: i, handler: s }) => {
        t.removeEventListener(i, s);
      });
    }), this.eventListeners.clear();
  }
  /**
   * Cleans up resources
   */
  destroy() {
    this.removeAllListeners(), this.clicked = null, this.promoting = !1, this.isAnimating = !1, this.isDragging = !1;
  }
}
class dt {
  /**
   * Creates a new MoveService instance
   * @param {ChessboardConfig} config - Board configuration
   * @param {PositionService} positionService - Position service instance
   */
  constructor(e, t) {
    this.config = e, this.positionService = t, this._movesCache = /* @__PURE__ */ new Map(), this._cacheTimeout = null, this._lastPromotionCheck = null, this._lastPromotionResult = null, this._promotionCheckTimeout = null, this._recentMoves = /* @__PURE__ */ new Set(), this._recentMovesTimeout = null;
  }
  /**
   * Checks if a piece on a square can move
   * @param {Square} square - Square to check
   * @returns {boolean} True if piece can move
   */
  canMove(e) {
    if (!e.piece) return !1;
    const { movableColors: t, onlyLegalMoves: i } = this.config;
    if (t === "none" || t === "w" && e.piece.color === "b" || t === "b" && e.piece.color === "w") return !1;
    if (!i) return !0;
    if (!this.positionService || !this.positionService.getGame())
      return !1;
    const s = this.positionService.getGame();
    return e.piece.color === s.turn();
  }
  /**
   * Converts various move formats to a Move instance
   * @param {string|Move} move - Move in various formats
   * @param {Object} squares - All board squares
   * @returns {Move} Move instance
   * @throws {MoveError} When move format is invalid
   */
  convertMove(e, t) {
    if (e instanceof W)
      return e;
    if (typeof e == "string" && e.length >= 4) {
      const i = e.slice(0, 2), s = e.slice(2, 4), n = e.slice(4, 5) || null;
      if (!t[i] || !t[s])
        throw new Oe(C.invalid_move_format, i, s);
      return new W(t[i], t[s], n);
    }
    throw new Oe(C.invalid_move_format, "unknown", "unknown");
  }
  /**
   * Checks if a move is legal
   * @param {Move} move - Move to check
   * @returns {boolean} True if move is legal
   */
  isLegalMove(e) {
    return this.getLegalMoves(e.from.id).some(
      (i) => i.to === e.to.id && e.promotion === i.promotion
    );
  }
  /**
   * Gets all legal moves for a square or the entire position
   * @param {string} [from] - Square to get moves from (optional)
   * @param {boolean} [verbose=true] - Whether to return verbose move objects
   * @returns {Array} Array of legal moves
   */
  getLegalMoves(e = null, t = !0) {
    if (!this.positionService || !this.positionService.getGame())
      return [];
    const i = this.positionService.getGame();
    if (!i) return [];
    const s = { verbose: t };
    return e && (s.square = e), i.moves(s);
  }
  /**
   * Gets legal moves with caching for performance
   * @param {Square} square - Square to get moves from
   * @returns {Array} Array of legal moves
   */
  getCachedLegalMoves(e) {
    if (!this.positionService || !this.positionService.getGame())
      return [];
    const t = this.positionService.getGame();
    if (!t) return [];
    const i = `${e.id}-${t.fen()}`;
    let s = this._movesCache.get(i);
    return s || (s = t.moves({ square: e.id, verbose: !0 }), this._movesCache.set(i, s), this._cacheTimeout && clearTimeout(this._cacheTimeout), this._cacheTimeout = setTimeout(() => {
      this._movesCache.clear();
    }, 1e3)), s;
  }
  /**
   * Executes a move on the game
   * @param {Move} move - Move to execute
   * @returns {Object|null} Move result from chess.js or null if invalid
   */
  executeMove(e) {
    if (!this.positionService || !this.positionService.getGame())
      return null;
    const t = this.positionService.getGame();
    if (!t) return null;
    const i = {
      from: e.from.id,
      to: e.to.id
    };
    console.log("executeMove - move.promotion:", e.promotion), console.log("executeMove - move.hasPromotion():", e.hasPromotion()), e.hasPromotion() && (i.promotion = e.promotion), console.log("executeMove - moveOptions:", i);
    const s = t.move(i);
    if (console.log("executeMove - result:", s), s) {
      const n = t.get(e.to.id);
      console.log("executeMove - piece on destination after move:", n);
    }
    return s;
  }
  /**
   * Checks if a move requires promotion
   * @param {Move} move - Move to check
   * @returns {boolean} True if promotion is required
   */
  requiresPromotion(e) {
    const t = `${e.from.id}->${e.to.id}`;
    console.log("Checking if move requires promotion:", t);
    const i = new Error().stack.split(`
`);
    console.log("Call stack:", i[1]), console.log("Caller:", i[2]), console.log("Caller 2:", i[3]), console.log("Caller 3:", i[4]);
    const s = Date.now();
    if (this._recentMoves.has(t))
      return console.log("Move recently processed, skipping duplicate check"), !1;
    if (this._lastPromotionCheck === t && this._lastPromotionResult !== null && s - this._lastPromotionTime < 100)
      return console.log("Using cached promotion result:", this._lastPromotionResult), this._lastPromotionResult;
    this._recentMoves.add(t);
    const n = this._doRequiresPromotion(e);
    return this._lastPromotionCheck = t, this._lastPromotionResult = n, this._lastPromotionTime = s, this._promotionCheckTimeout && clearTimeout(this._promotionCheckTimeout), this._promotionCheckTimeout = setTimeout(() => {
      this._lastPromotionCheck = null, this._lastPromotionResult = null;
    }, 500), this._recentMovesTimeout && clearTimeout(this._recentMovesTimeout), this._recentMovesTimeout = setTimeout(() => {
      this._recentMoves.clear();
    }, 1e3), n;
  }
  /**
   * Internal promotion check logic
   * @private
   * @param {Move} move - Move to check
   * @returns {boolean} True if promotion is required
   */
  _doRequiresPromotion(e) {
    if (!this.config.onlyLegalMoves)
      return console.log("Not in legal moves mode, no promotion required"), !1;
    const t = this.positionService.getGame();
    if (!t)
      return console.log("No game instance available"), !1;
    const i = t.get(e.from.id);
    if (!i || i.type !== "p")
      return console.log("Not a pawn move, no promotion required"), !1;
    const s = e.to.row;
    if (s !== 1 && s !== 8)
      return console.log("Not reaching promotion rank, no promotion required"), !1;
    if (console.log("Pawn reaching promotion rank - promotion required"), !this._isPawnMoveValid(e.from, e.to, i.color))
      return console.log("Pawn move not valid, no promotion required"), !1;
    const o = t.moves({ square: e.from.id, verbose: !0 }).find((l) => l.to === e.to.id);
    if (!o)
      return console.log("Move not in legal moves list, no promotion required"), !1;
    const r = o.flags.includes("p") || i.color === "w" && s === 8 || i.color === "b" && s === 1;
    return console.log("Promotion required:", r), r;
  }
  /**
   * Validates if a pawn move is theoretically possible
   * @private
   * @param {Square} from - Source square
   * @param {Square} to - Target square
   * @param {string} color - Pawn color ('w' or 'b')
   * @returns {boolean} True if the move is valid for a pawn
   */
  _isPawnMoveValid(e, t, i) {
    const s = e.row, n = t.row, o = e.col, r = t.col;
    console.log(`Validating pawn move: ${e.id} -> ${t.id} (${i})`), console.log(`Ranks: ${s} -> ${n}, Files: ${o} -> ${r}`);
    const l = i === "w" ? 1 : -1, c = n - s, u = Math.abs(r - o);
    return c * l <= 0 ? (console.log("Invalid: Pawn cannot move backward or stay in place"), !1) : Math.abs(c) > 2 ? (console.log("Invalid: Pawn cannot move more than 2 ranks"), !1) : Math.abs(c) === 2 && s !== (i === "w" ? 2 : 7) ? (console.log(`Invalid: Pawn cannot move 2 ranks from rank ${s}`), !1) : u > 1 ? (console.log("Invalid: Pawn cannot move more than 1 file"), !1) : (console.log("Pawn move validation passed"), !0);
  }
  /**
   * Handles promotion UI setup
   * @param {Move} move - Move requiring promotion
   * @param {Object} squares - All board squares
   * @param {Function} onPromotionSelect - Callback when promotion piece is selected
   * @param {Function} onPromotionCancel - Callback when promotion is cancelled
   * @returns {boolean} True if promotion UI was set up
   */
  setupPromotion(e, t, i, s) {
    if (!this.requiresPromotion(e) || !this.positionService || !this.positionService.getGame())
      return !1;
    const o = this.positionService.getGame().get(e.from.id), r = e.to;
    return Object.values(t).forEach((l) => {
      l.removePromotion(), l.removeCover();
    }), this._showPromotionInColumn(r, o, t, i, s), !0;
  }
  /**
   * Shows promotion choices in a column
   * @private
   */
  _showPromotionInColumn(e, t, i, s, n) {
    return console.log("Setting up promotion for", e.id, "piece color:", t.color), et.forEach((o, r) => {
      const l = this._findPromotionSquare(e, r, i);
      if (l) {
        const c = o + t.color, u = this._getPiecePathForPromotion(c);
        console.log("Setting up promotion choice:", o, "on square:", l.id), l.putPromotion(u, () => {
          console.log("Promotion choice selected:", o), s(o);
        });
      } else
        console.log("Could not find square for promotion choice:", o, "index:", r);
    }), Object.values(i).forEach((o) => {
      o.hasPromotion() || o.putCover(() => {
        n();
      });
    }), !0;
  }
  /**
   * Finds the appropriate square for a promotion piece
   * @private
   * @param {Square} targetSquare - Target square of the promotion move
   * @param {number} distance - Distance from target square
   * @param {Object} squares - All board squares
   * @returns {Square|null} Square for promotion piece or null
   */
  _findPromotionSquare(e, t, i) {
    const s = e.col, n = e.row;
    console.log(
      "Looking for promotion square - target:",
      e.id,
      "index:",
      t,
      "col:",
      s,
      "baseRow:",
      n
    );
    let o;
    if (n === 8)
      o = 8 - t;
    else if (n === 1)
      o = 1 + t;
    else
      return console.log("Invalid promotion row:", n), null;
    if (console.log("Calculated row:", o), o < 1 || o > 8)
      return console.log("Row out of bounds:", o), null;
    for (const r of Object.values(i))
      if (r.col === s && r.row === o)
        return console.log("Found promotion square:", r.id), r;
    return console.log("No square found for col:", s, "row:", o), null;
  }
  /**
   * Gets piece path for promotion UI
   * @private
   * @param {string} pieceId - Piece identifier
   * @returns {string} Path to piece asset
   */
  _getPiecePathForPromotion(e) {
    const { piecesPath: t } = this.config;
    return typeof t == "string" ? `${t}/${e}.svg` : `assets/pieces/${e}.svg`;
  }
  /**
   * Parses a move string into a move object
   * @param {string} moveString - Move string (e.g., 'e2e4', 'e7e8q')
   * @returns {Object|null} Move object or null if invalid
   */
  parseMove(e) {
    if (typeof e != "string" || e.length < 4 || e.length > 5)
      return null;
    const t = e.slice(0, 2), i = e.slice(2, 4), s = e.slice(4, 5);
    return !/^[a-h][1-8]$/.test(t) || !/^[a-h][1-8]$/.test(i) || s && !["q", "r", "b", "n"].includes(s.toLowerCase()) ? null : {
      from: t,
      to: i,
      promotion: s || null
    };
  }
  /**
   * Checks if a move is a castle move
   * @param {Object} gameMove - Game move object from chess.js
   * @returns {boolean} True if move is castle
   */
  isCastle(e) {
    return e && (e.isKingsideCastle() || e.isQueensideCastle());
  }
  /**
   * Gets the rook move for a castle move
   * @param {Object} gameMove - Game move object from chess.js
   * @returns {Object|null} Rook move object or null if not castle
   */
  getCastleRookMove(e) {
    if (!this.isCastle(e))
      return null;
    const t = e.isKingsideCastle(), i = e.color === "w";
    return t ? i ? { from: "h1", to: "f1" } : { from: "h8", to: "f8" } : i ? { from: "a1", to: "d1" } : { from: "a8", to: "d8" };
  }
  /**
   * Checks if a move is en passant
   * @param {Object} gameMove - Game move object from chess.js
   * @returns {boolean} True if move is en passant
   */
  isEnPassant(e) {
    return e && e.isEnPassant();
  }
  /**
   * Gets the captured pawn square for en passant
   * @param {Object} gameMove - Game move object from chess.js
   * @returns {string|null} Square of captured pawn or null if not en passant
   */
  getEnPassantCapturedSquare(e) {
    if (!this.isEnPassant(e))
      return null;
    const t = e.to, i = parseInt(t[1]), s = t[0];
    return e.color === "w" ? s + (i - 1) : s + (i + 1);
  }
  /**
   * Clears the moves cache
   */
  clearCache() {
    this._movesCache.clear(), this._cacheTimeout && (clearTimeout(this._cacheTimeout), this._cacheTimeout = null);
  }
  /**
   * Cleans up resources
   */
  destroy() {
    this.clearCache(), this.positionService = null;
  }
}
class ft {
  /**
   * Creates a new PieceService instance
   * @param {ChessboardConfig} config - Board configuration
   */
  constructor(e) {
    this.config = e;
  }
  /**
   * Gets the path to a piece asset
   * @param {string} piece - Piece identifier (e.g., 'wK', 'bP')
   * @returns {string} Path to piece asset
   * @throws {ValidationError} When piecesPath configuration is invalid
   */
  getPiecePath(e) {
    const { piecesPath: t } = this.config;
    if (typeof t == "string")
      return `${t}/${e}.svg`;
    if (typeof t == "object" && t !== null)
      return t[e];
    if (typeof t == "function")
      return t(e);
    throw new k(C.invalid_piecesPath, "piecesPath", t);
  }
  /**
   * Converts various piece formats to a Piece instance
   * @param {string|Piece} piece - Piece in various formats
   * @returns {Piece} Piece instance
   * @throws {PieceError} When piece format is invalid
   */
  convertPiece(e) {
    if (e instanceof ge)
      return e;
    if (typeof e == "string" && e.length === 2) {
      const [t, i] = e.split("");
      let s, n;
      if (fe.includes(t.toLowerCase()) && me.includes(i))
        s = t.toLowerCase(), n = i;
      else if (me.includes(t) && fe.includes(i.toLowerCase()))
        n = t, s = i.toLowerCase();
      else
        throw new Se(C.invalid_piece + e, e);
      const o = this.getPiecePath(s + n);
      return new ge(n, s, o);
    }
    throw new Se(C.invalid_piece + e, e);
  }
  /**
   * Adds a piece to a square with optional fade-in animation
   * @param {Square} square - Target square
   * @param {Piece} piece - Piece to add
   * @param {boolean} [fade=true] - Whether to fade in the piece
   * @param {Function} dragFunction - Function to handle drag events
   * @param {Function} [callback] - Callback when animation completes
   */
  addPieceOnSquare(e, t, i = !0, s, n) {
    console.debug(`[PieceService] addPieceOnSquare: ${t.id} to ${e.id}`), e.putPiece(t), s && t.setDrag(s(e, t)), i && this.config.fadeTime > 0 ? t.fadeIn(
      this.config.fadeTime,
      this.config.fadeAnimation,
      this._getTransitionTimingFunction(),
      n
    ) : n && n(), t.visible();
  }
  /**
   * Removes a piece from a square with optional fade-out animation
   * @param {Square} square - Source square
   * @param {boolean} [fade=true] - Whether to fade out the piece
   * @param {Function} [callback] - Callback when animation completes
   * @returns {Piece} The removed piece
   * @throws {PieceError} When square has no piece to remove
   */
  removePieceFromSquare(e, t = !0, i) {
    console.debug(`[PieceService] removePieceFromSquare: ${e.id}`), e.check();
    const s = e.piece;
    if (!s)
      throw i && i(), new Se(C.square_no_piece, null, e.getId());
    return t && this.config.fadeTime > 0 ? s.fadeOut(
      this.config.fadeTime,
      this.config.fadeAnimation,
      this._getTransitionTimingFunction(),
      i
    ) : i && i(), e.removePiece(), s;
  }
  /**
   * Moves a piece to a new position with animation
   * @param {Piece} piece - Piece to move
   * @param {Square} targetSquare - Target square
   * @param {number} duration - Animation duration
   * @param {Function} [callback] - Callback function when animation completes
   */
  movePiece(e, t, i, s) {
    if (console.debug(`[PieceService] movePiece: ${e.id} to ${t.id}`), !e) {
      console.warn("PieceService.movePiece: piece is null, skipping animation"), s && s();
      return;
    }
    e.translate(
      t,
      i,
      this._getTransitionTimingFunction(),
      this.config.moveAnimation,
      s
    );
  }
  /**
   * Handles piece translation with optional capture
   * @param {Move} move - Move object containing from/to squares and piece
   * @param {boolean} removeTarget - Whether to remove piece from target square
   * @param {boolean} animate - Whether to animate the move
   * @param {Function} [dragFunction] - Function to create drag handlers
   * @param {Function} [callback] - Callback function when complete
   */
  translatePiece(e, t, i, s = null, n = null) {
    if (console.debug(
      `[PieceService] translatePiece: ${e.piece.id} from ${e.from.id} to ${e.to.id}`
    ), !e.piece) {
      console.warn("PieceService.translatePiece: move.piece is null, skipping translation"), n && n();
      return;
    }
    t && (e.to.deselect(), this.removePieceFromSquare(e.to, !1));
    const o = () => {
      e.from.piece === e.piece && e.from.removePiece(!0), e.to.piece !== e.piece && (e.to.putPiece(e.piece), s && this.config.draggable && e.piece.element && e.piece.setDrag(s(e.to, e.piece))), n && n();
    };
    if (e.piece.element.classList.contains("dragging"))
      o();
    else {
      const l = i ? this.config.moveTime : 0;
      this.movePiece(e.piece, e.to, l, o);
    }
  }
  /**
   * Snaps a piece back to its original position
   * @param {Square} square - Square containing the piece
   * @param {boolean} [animate=true] - Whether to animate the snapback
   */
  snapbackPiece(e, t = !0) {
    if (!e || !e.piece)
      return;
    const i = e.piece, s = t ? this.config.snapbackTime : 0;
    console.debug(`[PieceService] snapbackPiece: ${i.id} on ${e.id}`), i.translate(
      e,
      s,
      this._getTransitionTimingFunction(),
      this.config.snapbackAnimation
    );
  }
  /**
   * Centers a piece in its square with animation (after successful drop)
   * @param {Square} square - Square containing the piece to center
   * @param {boolean} animate - Whether to animate the centering
   */
  centerPiece(e, t = !0) {
    if (!e || !e.piece)
      return;
    const i = e.piece, s = t ? this.config.dropCenterTime : 0;
    console.debug(`[PieceService] centerPiece: ${i.id} on ${e.id}`), i.translate(
      e,
      s,
      this._getTransitionTimingFunction(),
      this.config.dropCenterAnimation,
      () => {
        i.element && (i.element.style.position = "", i.element.style.left = "", i.element.style.top = "", i.element.style.transform = "", i.element.style.zIndex = "", i.element.style.width = "", i.element.style.height = "", i.element.classList.remove("dragging"), ue.cleanupAfterDrag(i.element));
      }
    );
  }
  /**
   * Gets the transition timing function for animations
   * @private
   * @returns {Function} Timing function
   */
  _getTransitionTimingFunction() {
    return (e, t, i = "ease") => {
      const s = e / t;
      switch (i) {
        case "linear":
          return s;
        case "ease":
          return s ** 2 * (3 - 2 * s);
        case "ease-in":
          return s ** 2;
        case "ease-out":
          return -1 * (s - 1) ** 2 + 1;
        case "ease-in-out":
          return s < 0.5 ? 2 * s ** 2 : 4 * s - 2 * s ** 2 - 1;
        default:
          return s;
      }
    };
  }
  /**
   * Cleans up resources
   */
  destroy() {
  }
}
/**
 * @license
 * Copyright (c) 2025, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
const O = "w", x = "b", R = "p", ke = "n", de = "b", re = "r", U = "q", I = "k", ye = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
class le {
  constructor(e, t) {
    E(this, "color");
    E(this, "from");
    E(this, "to");
    E(this, "piece");
    E(this, "captured");
    E(this, "promotion");
    /**
     * @deprecated This field is deprecated and will be removed in version 2.0.0.
     * Please use move descriptor functions instead: `isCapture`, `isPromotion`,
     * `isEnPassant`, `isKingsideCastle`, `isQueensideCastle`, `isCastle`, and
     * `isBigPawn`
     */
    E(this, "flags");
    E(this, "san");
    E(this, "lan");
    E(this, "before");
    E(this, "after");
    const { color: i, piece: s, from: n, to: o, flags: r, captured: l, promotion: c } = t, u = q(n), d = q(o);
    this.color = i, this.piece = s, this.from = u, this.to = d, this.san = e._moveToSan(t, e._moves({ legal: !0 })), this.lan = u + d, this.before = e.fen(), e._makeMove(t), this.after = e.fen(), e._undoMove(), this.flags = "";
    for (const h in S)
      S[h] & r && (this.flags += Y[h]);
    l && (this.captured = l), c && (this.promotion = c, this.lan += c);
  }
  isCapture() {
    return this.flags.indexOf(Y.CAPTURE) > -1;
  }
  isPromotion() {
    return this.flags.indexOf(Y.PROMOTION) > -1;
  }
  isEnPassant() {
    return this.flags.indexOf(Y.EP_CAPTURE) > -1;
  }
  isKingsideCastle() {
    return this.flags.indexOf(Y.KSIDE_CASTLE) > -1;
  }
  isQueensideCastle() {
    return this.flags.indexOf(Y.QSIDE_CASTLE) > -1;
  }
  isBigPawn() {
    return this.flags.indexOf(Y.BIG_PAWN) > -1;
  }
}
const $ = -1, Y = {
  NORMAL: "n",
  CAPTURE: "c",
  BIG_PAWN: "b",
  EP_CAPTURE: "e",
  PROMOTION: "p",
  KSIDE_CASTLE: "k",
  QSIDE_CASTLE: "q"
}, S = {
  NORMAL: 1,
  CAPTURE: 2,
  BIG_PAWN: 4,
  EP_CAPTURE: 8,
  PROMOTION: 16,
  KSIDE_CASTLE: 32,
  QSIDE_CASTLE: 64
}, _ = {
  a8: 0,
  b8: 1,
  c8: 2,
  d8: 3,
  e8: 4,
  f8: 5,
  g8: 6,
  h8: 7,
  a7: 16,
  b7: 17,
  c7: 18,
  d7: 19,
  e7: 20,
  f7: 21,
  g7: 22,
  h7: 23,
  a6: 32,
  b6: 33,
  c6: 34,
  d6: 35,
  e6: 36,
  f6: 37,
  g6: 38,
  h6: 39,
  a5: 48,
  b5: 49,
  c5: 50,
  d5: 51,
  e5: 52,
  f5: 53,
  g5: 54,
  h5: 55,
  a4: 64,
  b4: 65,
  c4: 66,
  d4: 67,
  e4: 68,
  f4: 69,
  g4: 70,
  h4: 71,
  a3: 80,
  b3: 81,
  c3: 82,
  d3: 83,
  e3: 84,
  f3: 85,
  g3: 86,
  h3: 87,
  a2: 96,
  b2: 97,
  c2: 98,
  d2: 99,
  e2: 100,
  f2: 101,
  g2: 102,
  h2: 103,
  a1: 112,
  b1: 113,
  c1: 114,
  d1: 115,
  e1: 116,
  f1: 117,
  g1: 118,
  h1: 119
}, Ce = {
  b: [16, 32, 17, 15],
  w: [-16, -32, -17, -15]
}, Fe = {
  n: [-18, -33, -31, -14, 18, 33, 31, 14],
  b: [-17, -15, 17, 15],
  r: [-16, 1, 16, -1],
  q: [-17, -16, -15, 1, 17, 16, 15, -1],
  k: [-17, -16, -15, 1, 17, 16, 15, -1]
}, mt = [
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  24,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  2,
  24,
  2,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  53,
  56,
  53,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  24,
  24,
  24,
  24,
  24,
  56,
  0,
  56,
  24,
  24,
  24,
  24,
  24,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  53,
  56,
  53,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  2,
  24,
  2,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  24,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  20
], gt = [
  17,
  0,
  0,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  17,
  0,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  17,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  0,
  0,
  16,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  0,
  16,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  16,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  -16,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  -16,
  0,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  -16,
  0,
  0,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  0,
  -17,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  0,
  0,
  -17,
  0,
  0,
  -15,
  0,
  0,
  0,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  0,
  0,
  0,
  -17
], pt = { p: 1, n: 2, b: 4, r: 8, q: 16, k: 32 }, vt = "pnbrqkPNBRQK", Ne = [ke, de, re, U], _t = 7, St = 6, bt = 1, yt = 0, ce = {
  [I]: S.KSIDE_CASTLE,
  [U]: S.QSIDE_CASTLE
}, H = {
  w: [
    { square: _.a1, flag: S.QSIDE_CASTLE },
    { square: _.h1, flag: S.KSIDE_CASTLE }
  ],
  b: [
    { square: _.a8, flag: S.QSIDE_CASTLE },
    { square: _.h8, flag: S.KSIDE_CASTLE }
  ]
}, Ct = { b: bt, w: St }, Pt = ["1-0", "0-1", "1/2-1/2", "*"];
function J(a) {
  return a >> 4;
}
function ae(a) {
  return a & 15;
}
function Ge(a) {
  return "0123456789".indexOf(a) !== -1;
}
function q(a) {
  const e = ae(a), t = J(a);
  return "abcdefgh".substring(e, e + 1) + "87654321".substring(t, t + 1);
}
function oe(a) {
  return a === O ? x : O;
}
function je(a) {
  const e = a.split(/\s+/);
  if (e.length !== 6)
    return {
      ok: !1,
      error: "Invalid FEN: must contain six space-delimited fields"
    };
  const t = parseInt(e[5], 10);
  if (isNaN(t) || t <= 0)
    return {
      ok: !1,
      error: "Invalid FEN: move number must be a positive integer"
    };
  const i = parseInt(e[4], 10);
  if (isNaN(i) || i < 0)
    return {
      ok: !1,
      error: "Invalid FEN: half move counter number must be a non-negative integer"
    };
  if (!/^(-|[abcdefgh][36])$/.test(e[3]))
    return { ok: !1, error: "Invalid FEN: en-passant square is invalid" };
  if (/[^kKqQ-]/.test(e[2]))
    return { ok: !1, error: "Invalid FEN: castling availability is invalid" };
  if (!/^(w|b)$/.test(e[1]))
    return { ok: !1, error: "Invalid FEN: side-to-move is invalid" };
  const s = e[0].split("/");
  if (s.length !== 8)
    return {
      ok: !1,
      error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows"
    };
  for (let o = 0; o < s.length; o++) {
    let r = 0, l = !1;
    for (let c = 0; c < s[o].length; c++)
      if (Ge(s[o][c])) {
        if (l)
          return {
            ok: !1,
            error: "Invalid FEN: piece data is invalid (consecutive number)"
          };
        r += parseInt(s[o][c], 10), l = !0;
      } else {
        if (!/^[prnbqkPRNBQK]$/.test(s[o][c]))
          return {
            ok: !1,
            error: "Invalid FEN: piece data is invalid (invalid piece)"
          };
        r += 1, l = !1;
      }
    if (r !== 8)
      return {
        ok: !1,
        error: "Invalid FEN: piece data is invalid (too many squares in rank)"
      };
  }
  if (e[3][1] === "3" && e[1] === "w" || e[3][1] === "6" && e[1] === "b")
    return { ok: !1, error: "Invalid FEN: illegal en-passant square" };
  const n = [
    { color: "white", regex: /K/g },
    { color: "black", regex: /k/g }
  ];
  for (const { color: o, regex: r } of n) {
    if (!r.test(e[0]))
      return { ok: !1, error: `Invalid FEN: missing ${o} king` };
    if ((e[0].match(r) || []).length > 1)
      return { ok: !1, error: `Invalid FEN: too many ${o} kings` };
  }
  return Array.from(s[0] + s[7]).some((o) => o.toUpperCase() === "P") ? {
    ok: !1,
    error: "Invalid FEN: some pawns are on the edge rows"
  } : { ok: !0 };
}
function wt(a, e) {
  const t = a.from, i = a.to, s = a.piece;
  let n = 0, o = 0, r = 0;
  for (let l = 0, c = e.length; l < c; l++) {
    const u = e[l].from, d = e[l].to, h = e[l].piece;
    s === h && t !== u && i === d && (n++, J(t) === J(u) && o++, ae(t) === ae(u) && r++);
  }
  return n > 0 ? o > 0 && r > 0 ? q(t) : r > 0 ? q(t).charAt(1) : q(t).charAt(0) : "";
}
function K(a, e, t, i, s, n = void 0, o = S.NORMAL) {
  const r = J(i);
  if (s === R && (r === _t || r === yt))
    for (let l = 0; l < Ne.length; l++) {
      const c = Ne[l];
      a.push({
        color: e,
        from: t,
        to: i,
        piece: s,
        captured: n,
        promotion: c,
        flags: o | S.PROMOTION
      });
    }
  else
    a.push({
      color: e,
      from: t,
      to: i,
      piece: s,
      captured: n,
      flags: o
    });
}
function xe(a) {
  let e = a.charAt(0);
  return e >= "a" && e <= "h" ? a.match(/[a-h]\d.*[a-h]\d/) ? void 0 : R : (e = e.toLowerCase(), e === "o" ? I : e);
}
function Pe(a) {
  return a.replace(/=/, "").replace(/[+#]?[?!]*$/, "");
}
function we(a) {
  return a.split(" ").slice(0, 4).join(" ");
}
class Et {
  constructor(e = ye) {
    E(this, "_board", new Array(128));
    E(this, "_turn", O);
    E(this, "_header", {});
    E(this, "_kings", { w: $, b: $ });
    E(this, "_epSquare", -1);
    E(this, "_halfMoves", 0);
    E(this, "_moveNumber", 0);
    E(this, "_history", []);
    E(this, "_comments", {});
    E(this, "_castling", { w: 0, b: 0 });
    // tracks number of times a position has been seen for repetition checking
    E(this, "_positionCount", {});
    this.load(e);
  }
  clear({ preserveHeaders: e = !1 } = {}) {
    this._board = new Array(128), this._kings = { w: $, b: $ }, this._turn = O, this._castling = { w: 0, b: 0 }, this._epSquare = $, this._halfMoves = 0, this._moveNumber = 1, this._history = [], this._comments = {}, this._header = e ? this._header : {}, this._positionCount = {}, delete this._header.SetUp, delete this._header.FEN;
  }
  load(e, { skipValidation: t = !1, preserveHeaders: i = !1 } = {}) {
    let s = e.split(/\s+/);
    if (s.length >= 2 && s.length < 6) {
      const r = ["-", "-", "0", "1"];
      e = s.concat(r.slice(-(6 - s.length))).join(" ");
    }
    if (s = e.split(/\s+/), !t) {
      const { ok: r, error: l } = je(e);
      if (!r)
        throw new Error(l);
    }
    const n = s[0];
    let o = 0;
    this.clear({ preserveHeaders: i });
    for (let r = 0; r < n.length; r++) {
      const l = n.charAt(r);
      if (l === "/")
        o += 8;
      else if (Ge(l))
        o += parseInt(l, 10);
      else {
        const c = l < "a" ? O : x;
        this._put({ type: l.toLowerCase(), color: c }, q(o)), o++;
      }
    }
    this._turn = s[1], s[2].indexOf("K") > -1 && (this._castling.w |= S.KSIDE_CASTLE), s[2].indexOf("Q") > -1 && (this._castling.w |= S.QSIDE_CASTLE), s[2].indexOf("k") > -1 && (this._castling.b |= S.KSIDE_CASTLE), s[2].indexOf("q") > -1 && (this._castling.b |= S.QSIDE_CASTLE), this._epSquare = s[3] === "-" ? $ : _[s[3]], this._halfMoves = parseInt(s[4], 10), this._moveNumber = parseInt(s[5], 10), this._updateSetup(e), this._incPositionCount(e);
  }
  fen() {
    var n, o;
    let e = 0, t = "";
    for (let r = _.a8; r <= _.h1; r++) {
      if (this._board[r]) {
        e > 0 && (t += e, e = 0);
        const { color: l, type: c } = this._board[r];
        t += l === O ? c.toUpperCase() : c.toLowerCase();
      } else
        e++;
      r + 1 & 136 && (e > 0 && (t += e), r !== _.h1 && (t += "/"), e = 0, r += 8);
    }
    let i = "";
    this._castling[O] & S.KSIDE_CASTLE && (i += "K"), this._castling[O] & S.QSIDE_CASTLE && (i += "Q"), this._castling[x] & S.KSIDE_CASTLE && (i += "k"), this._castling[x] & S.QSIDE_CASTLE && (i += "q"), i = i || "-";
    let s = "-";
    if (this._epSquare !== $) {
      const r = this._epSquare + (this._turn === O ? 16 : -16), l = [r + 1, r - 1];
      for (const c of l) {
        if (c & 136)
          continue;
        const u = this._turn;
        if (((n = this._board[c]) == null ? void 0 : n.color) === u && ((o = this._board[c]) == null ? void 0 : o.type) === R) {
          this._makeMove({
            color: u,
            from: c,
            to: this._epSquare,
            piece: R,
            captured: R,
            flags: S.EP_CAPTURE
          });
          const d = !this._isKingAttacked(u);
          if (this._undoMove(), d) {
            s = q(this._epSquare);
            break;
          }
        }
      }
    }
    return [t, this._turn, i, s, this._halfMoves, this._moveNumber].join(" ");
  }
  /*
   * Called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object. If the FEN
   * is equal to the default position, the SetUp and FEN are deleted the setup
   * is only updated if history.length is zero, ie moves haven't been made.
   */
  _updateSetup(e) {
    this._history.length > 0 || (e !== ye ? (this._header.SetUp = "1", this._header.FEN = e) : (delete this._header.SetUp, delete this._header.FEN));
  }
  reset() {
    this.load(ye);
  }
  get(e) {
    return this._board[_[e]];
  }
  put({ type: e, color: t }, i) {
    return this._put({ type: e, color: t }, i) ? (this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), !0) : !1;
  }
  _put({ type: e, color: t }, i) {
    if (vt.indexOf(e.toLowerCase()) === -1 || !(i in _))
      return !1;
    const s = _[i];
    if (e === I && !(this._kings[t] === $ || this._kings[t] === s))
      return !1;
    const n = this._board[s];
    return n && n.type === I && (this._kings[n.color] = $), this._board[s] = { type: e, color: t }, e === I && (this._kings[t] = s), !0;
  }
  remove(e) {
    const t = this.get(e);
    return delete this._board[_[e]], t && t.type === I && (this._kings[t.color] = $), this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), t;
  }
  _updateCastlingRights() {
    var i, s, n, o, r, l, c, u, d, h, m, f;
    const e = ((i = this._board[_.e1]) == null ? void 0 : i.type) === I && ((s = this._board[_.e1]) == null ? void 0 : s.color) === O, t = ((n = this._board[_.e8]) == null ? void 0 : n.type) === I && ((o = this._board[_.e8]) == null ? void 0 : o.color) === x;
    (!e || ((r = this._board[_.a1]) == null ? void 0 : r.type) !== re || ((l = this._board[_.a1]) == null ? void 0 : l.color) !== O) && (this._castling.w &= -65), (!e || ((c = this._board[_.h1]) == null ? void 0 : c.type) !== re || ((u = this._board[_.h1]) == null ? void 0 : u.color) !== O) && (this._castling.w &= -33), (!t || ((d = this._board[_.a8]) == null ? void 0 : d.type) !== re || ((h = this._board[_.a8]) == null ? void 0 : h.color) !== x) && (this._castling.b &= -65), (!t || ((m = this._board[_.h8]) == null ? void 0 : m.type) !== re || ((f = this._board[_.h8]) == null ? void 0 : f.color) !== x) && (this._castling.b &= -33);
  }
  _updateEnPassantSquare() {
    var n, o;
    if (this._epSquare === $)
      return;
    const e = this._epSquare + (this._turn === O ? -16 : 16), t = this._epSquare + (this._turn === O ? 16 : -16), i = [t + 1, t - 1];
    if (this._board[e] !== null || this._board[this._epSquare] !== null || ((n = this._board[t]) == null ? void 0 : n.color) !== oe(this._turn) || ((o = this._board[t]) == null ? void 0 : o.type) !== R) {
      this._epSquare = $;
      return;
    }
    const s = (r) => {
      var l, c;
      return !(r & 136) && ((l = this._board[r]) == null ? void 0 : l.color) === this._turn && ((c = this._board[r]) == null ? void 0 : c.type) === R;
    };
    i.some(s) || (this._epSquare = $);
  }
  _attacked(e, t, i) {
    const s = [];
    for (let n = _.a8; n <= _.h1; n++) {
      if (n & 136) {
        n += 7;
        continue;
      }
      if (this._board[n] === void 0 || this._board[n].color !== e)
        continue;
      const o = this._board[n], r = n - t;
      if (r === 0)
        continue;
      const l = r + 119;
      if (mt[l] & pt[o.type]) {
        if (o.type === R) {
          if (r > 0 && o.color === O || r <= 0 && o.color === x) {
            if (!i)
              return !0;
            s.push(q(n));
          }
          continue;
        }
        if (o.type === "n" || o.type === "k") {
          if (!i)
            return !0;
          s.push(q(n));
          continue;
        }
        const c = gt[l];
        let u = n + c, d = !1;
        for (; u !== t; ) {
          if (this._board[u] != null) {
            d = !0;
            break;
          }
          u += c;
        }
        if (!d) {
          if (!i)
            return !0;
          s.push(q(n));
          continue;
        }
      }
    }
    return i ? s : !1;
  }
  attackers(e, t) {
    return t ? this._attacked(t, _[e], !0) : this._attacked(this._turn, _[e], !0);
  }
  _isKingAttacked(e) {
    const t = this._kings[e];
    return t === -1 ? !1 : this._attacked(oe(e), t);
  }
  isAttacked(e, t) {
    return this._attacked(t, _[e]);
  }
  isCheck() {
    return this._isKingAttacked(this._turn);
  }
  inCheck() {
    return this.isCheck();
  }
  isCheckmate() {
    return this.isCheck() && this._moves().length === 0;
  }
  isStalemate() {
    return !this.isCheck() && this._moves().length === 0;
  }
  isInsufficientMaterial() {
    const e = {
      b: 0,
      n: 0,
      r: 0,
      q: 0,
      k: 0,
      p: 0
    }, t = [];
    let i = 0, s = 0;
    for (let n = _.a8; n <= _.h1; n++) {
      if (s = (s + 1) % 2, n & 136) {
        n += 7;
        continue;
      }
      const o = this._board[n];
      o && (e[o.type] = o.type in e ? e[o.type] + 1 : 1, o.type === de && t.push(s), i++);
    }
    if (i === 2)
      return !0;
    if (
      // k vs. kn .... or .... k vs. kb
      i === 3 && (e[de] === 1 || e[ke] === 1)
    )
      return !0;
    if (i === e[de] + 2) {
      let n = 0;
      const o = t.length;
      for (let r = 0; r < o; r++)
        n += t[r];
      if (n === 0 || n === o)
        return !0;
    }
    return !1;
  }
  isThreefoldRepetition() {
    return this._getPositionCount(this.fen()) >= 3;
  }
  isDrawByFiftyMoves() {
    return this._halfMoves >= 100;
  }
  isDraw() {
    return this.isDrawByFiftyMoves() || this.isStalemate() || this.isInsufficientMaterial() || this.isThreefoldRepetition();
  }
  isGameOver() {
    return this.isCheckmate() || this.isStalemate() || this.isDraw();
  }
  moves({ verbose: e = !1, square: t = void 0, piece: i = void 0 } = {}) {
    const s = this._moves({ square: t, piece: i });
    return e ? s.map((n) => new le(this, n)) : s.map((n) => this._moveToSan(n, s));
  }
  _moves({ legal: e = !0, piece: t = void 0, square: i = void 0 } = {}) {
    var m;
    const s = i ? i.toLowerCase() : void 0, n = t == null ? void 0 : t.toLowerCase(), o = [], r = this._turn, l = oe(r);
    let c = _.a8, u = _.h1, d = !1;
    if (s) {
      if (!(s in _))
        return [];
      c = u = _[s], d = !0;
    }
    for (let f = c; f <= u; f++) {
      if (f & 136) {
        f += 7;
        continue;
      }
      if (!this._board[f] || this._board[f].color === l)
        continue;
      const { type: g } = this._board[f];
      let b;
      if (g === R) {
        if (n && n !== g) continue;
        b = f + Ce[r][0], this._board[b] || (K(o, r, f, b, R), b = f + Ce[r][1], Ct[r] === J(f) && !this._board[b] && K(o, r, f, b, R, void 0, S.BIG_PAWN));
        for (let w = 2; w < 4; w++)
          b = f + Ce[r][w], !(b & 136) && (((m = this._board[b]) == null ? void 0 : m.color) === l ? K(o, r, f, b, R, this._board[b].type, S.CAPTURE) : b === this._epSquare && K(o, r, f, b, R, R, S.EP_CAPTURE));
      } else {
        if (n && n !== g) continue;
        for (let w = 0, y = Fe[g].length; w < y; w++) {
          const p = Fe[g][w];
          for (b = f; b += p, !(b & 136); ) {
            if (!this._board[b])
              K(o, r, f, b, g);
            else {
              if (this._board[b].color === r) break;
              K(o, r, f, b, g, this._board[b].type, S.CAPTURE);
              break;
            }
            if (g === ke || g === I) break;
          }
        }
      }
    }
    if ((n === void 0 || n === I) && (!d || u === this._kings[r])) {
      if (this._castling[r] & S.KSIDE_CASTLE) {
        const f = this._kings[r], g = f + 2;
        !this._board[f + 1] && !this._board[g] && !this._attacked(l, this._kings[r]) && !this._attacked(l, f + 1) && !this._attacked(l, g) && K(o, r, this._kings[r], g, I, void 0, S.KSIDE_CASTLE);
      }
      if (this._castling[r] & S.QSIDE_CASTLE) {
        const f = this._kings[r], g = f - 2;
        !this._board[f - 1] && !this._board[f - 2] && !this._board[f - 3] && !this._attacked(l, this._kings[r]) && !this._attacked(l, f - 1) && !this._attacked(l, g) && K(o, r, this._kings[r], g, I, void 0, S.QSIDE_CASTLE);
      }
    }
    if (!e || this._kings[r] === -1)
      return o;
    const h = [];
    for (let f = 0, g = o.length; f < g; f++)
      this._makeMove(o[f]), this._isKingAttacked(r) || h.push(o[f]), this._undoMove();
    return h;
  }
  move(e, { strict: t = !1 } = {}) {
    let i = null;
    if (typeof e == "string")
      i = this._moveFromSan(e, t);
    else if (typeof e == "object") {
      const n = this._moves();
      for (let o = 0, r = n.length; o < r; o++)
        if (e.from === q(n[o].from) && e.to === q(n[o].to) && (!("promotion" in n[o]) || e.promotion === n[o].promotion)) {
          i = n[o];
          break;
        }
    }
    if (!i)
      throw typeof e == "string" ? new Error(`Invalid move: ${e}`) : new Error(`Invalid move: ${JSON.stringify(e)}`);
    const s = new le(this, i);
    return this._makeMove(i), this._incPositionCount(s.after), s;
  }
  _push(e) {
    this._history.push({
      move: e,
      kings: { b: this._kings.b, w: this._kings.w },
      turn: this._turn,
      castling: { b: this._castling.b, w: this._castling.w },
      epSquare: this._epSquare,
      halfMoves: this._halfMoves,
      moveNumber: this._moveNumber
    });
  }
  _makeMove(e) {
    const t = this._turn, i = oe(t);
    if (this._push(e), this._board[e.to] = this._board[e.from], delete this._board[e.from], e.flags & S.EP_CAPTURE && (this._turn === x ? delete this._board[e.to - 16] : delete this._board[e.to + 16]), e.promotion && (this._board[e.to] = { type: e.promotion, color: t }), this._board[e.to].type === I) {
      if (this._kings[t] = e.to, e.flags & S.KSIDE_CASTLE) {
        const s = e.to - 1, n = e.to + 1;
        this._board[s] = this._board[n], delete this._board[n];
      } else if (e.flags & S.QSIDE_CASTLE) {
        const s = e.to + 1, n = e.to - 2;
        this._board[s] = this._board[n], delete this._board[n];
      }
      this._castling[t] = 0;
    }
    if (this._castling[t]) {
      for (let s = 0, n = H[t].length; s < n; s++)
        if (e.from === H[t][s].square && this._castling[t] & H[t][s].flag) {
          this._castling[t] ^= H[t][s].flag;
          break;
        }
    }
    if (this._castling[i]) {
      for (let s = 0, n = H[i].length; s < n; s++)
        if (e.to === H[i][s].square && this._castling[i] & H[i][s].flag) {
          this._castling[i] ^= H[i][s].flag;
          break;
        }
    }
    e.flags & S.BIG_PAWN ? t === x ? this._epSquare = e.to - 16 : this._epSquare = e.to + 16 : this._epSquare = $, e.piece === R ? this._halfMoves = 0 : e.flags & (S.CAPTURE | S.EP_CAPTURE) ? this._halfMoves = 0 : this._halfMoves++, t === x && this._moveNumber++, this._turn = i;
  }
  undo() {
    const e = this._undoMove();
    if (e) {
      const t = new le(this, e);
      return this._decPositionCount(t.after), t;
    }
    return null;
  }
  _undoMove() {
    const e = this._history.pop();
    if (e === void 0)
      return null;
    const t = e.move;
    this._kings = e.kings, this._turn = e.turn, this._castling = e.castling, this._epSquare = e.epSquare, this._halfMoves = e.halfMoves, this._moveNumber = e.moveNumber;
    const i = this._turn, s = oe(i);
    if (this._board[t.from] = this._board[t.to], this._board[t.from].type = t.piece, delete this._board[t.to], t.captured)
      if (t.flags & S.EP_CAPTURE) {
        let n;
        i === x ? n = t.to - 16 : n = t.to + 16, this._board[n] = { type: R, color: s };
      } else
        this._board[t.to] = { type: t.captured, color: s };
    if (t.flags & (S.KSIDE_CASTLE | S.QSIDE_CASTLE)) {
      let n, o;
      t.flags & S.KSIDE_CASTLE ? (n = t.to + 1, o = t.to - 1) : (n = t.to - 2, o = t.to + 1), this._board[n] = this._board[o], delete this._board[o];
    }
    return t;
  }
  pgn({ newline: e = `
`, maxWidth: t = 0 } = {}) {
    const i = [];
    let s = !1;
    for (const h in this._header)
      i.push(`[${h} "${this._header[h]}"]${e}`), s = !0;
    s && this._history.length && i.push(e);
    const n = (h) => {
      const m = this._comments[this.fen()];
      if (typeof m < "u") {
        const f = h.length > 0 ? " " : "";
        h = `${h}${f}{${m}}`;
      }
      return h;
    }, o = [];
    for (; this._history.length > 0; )
      o.push(this._undoMove());
    const r = [];
    let l = "";
    for (o.length === 0 && r.push(n("")); o.length > 0; ) {
      l = n(l);
      const h = o.pop();
      if (!h)
        break;
      if (!this._history.length && h.color === "b") {
        const m = `${this._moveNumber}. ...`;
        l = l ? `${l} ${m}` : m;
      } else h.color === "w" && (l.length && r.push(l), l = `${this._moveNumber}.`);
      l = `${l} ${this._moveToSan(h, this._moves({ legal: !0 }))}`, this._makeMove(h);
    }
    if (l.length && r.push(n(l)), typeof this._header.Result < "u" && r.push(this._header.Result), t === 0)
      return i.join("") + r.join(" ");
    const c = function() {
      return i.length > 0 && i[i.length - 1] === " " ? (i.pop(), !0) : !1;
    }, u = function(h, m) {
      for (const f of m.split(" "))
        if (f) {
          if (h + f.length > t) {
            for (; c(); )
              h--;
            i.push(e), h = 0;
          }
          i.push(f), h += f.length, i.push(" "), h++;
        }
      return c() && h--, h;
    };
    let d = 0;
    for (let h = 0; h < r.length; h++) {
      if (d + r[h].length > t && r[h].includes("{")) {
        d = u(d, r[h]);
        continue;
      }
      d + r[h].length > t && h !== 0 ? (i[i.length - 1] === " " && i.pop(), i.push(e), d = 0) : h !== 0 && (i.push(" "), d++), i.push(r[h]), d += r[h].length;
    }
    return i.join("");
  }
  /*
   * @deprecated Use `setHeader` and `getHeaders` instead.
   */
  header(...e) {
    for (let t = 0; t < e.length; t += 2)
      typeof e[t] == "string" && typeof e[t + 1] == "string" && (this._header[e[t]] = e[t + 1]);
    return this._header;
  }
  setHeader(e, t) {
    return this._header[e] = t, this._header;
  }
  removeHeader(e) {
    return e in this._header ? (delete this._header[e], !0) : !1;
  }
  getHeaders() {
    return this._header;
  }
  loadPgn(e, { strict: t = !1, newlineChar: i = `\r?
` } = {}) {
    function s(p) {
      return p.replace(/\\/g, "\\");
    }
    function n(p) {
      const P = {}, T = p.split(new RegExp(s(i)));
      let F = "", A = "";
      for (let V = 0; V < T.length; V++) {
        const Q = /^\s*\[\s*([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;
        F = T[V].replace(Q, "$1"), A = T[V].replace(Q, "$2"), F.trim().length > 0 && (P[F] = A);
      }
      return P;
    }
    e = e.trim();
    const r = new RegExp(
      `^(\\[((?:${s(i)})|.)*\\])((?:\\s*${s(i)}){2}|(?:\\s*${s(i)})*$)`
    ).exec(e), l = r && r.length >= 2 ? r[1] : "";
    this.reset();
    const c = n(l);
    let u = "";
    for (const p in c)
      p.toLowerCase() === "fen" && (u = c[p]), this.header(p, c[p]);
    if (!t)
      u && this.load(u, { preserveHeaders: !0 });
    else if (c.SetUp === "1") {
      if (!("FEN" in c))
        throw new Error("Invalid PGN: FEN tag must be supplied with SetUp tag");
      this.load(c.FEN, { preserveHeaders: !0 });
    }
    function d(p) {
      return Array.from(p).map((P) => P.charCodeAt(0) < 128 ? P.charCodeAt(0).toString(16) : encodeURIComponent(P).replace(/%/g, "").toLowerCase()).join("");
    }
    function h(p) {
      return p.length === 0 ? "" : decodeURIComponent(`%${(p.match(/.{1,2}/g) || []).join("%")}`);
    }
    const m = function(p) {
      return p = p.replace(new RegExp(s(i), "g"), " "), `{${d(p.slice(1, p.length - 1))}}`;
    }, f = function(p) {
      if (p.startsWith("{") && p.endsWith("}"))
        return h(p.slice(1, p.length - 1));
    };
    let g = e.replace(l, "").replace(
      // encode comments so they don't get deleted below
      new RegExp(`({[^}]*})+?|;([^${s(i)}]*)`, "g"),
      (p, P, T) => P !== void 0 ? m(P) : ` ${m(`{${T.slice(1)}}`)}`
    ).replace(new RegExp(s(i), "g"), " ");
    const b = /(\([^()]+\))+?/g;
    for (; b.test(g); )
      g = g.replace(b, "");
    g = g.replace(/\d+\.(\.\.)?/g, ""), g = g.replace(/\.\.\./g, ""), g = g.replace(/\$\d+/g, "");
    let w = g.trim().split(new RegExp(/\s+/));
    w = w.filter((p) => p !== "");
    let y = "";
    for (let p = 0; p < w.length; p++) {
      const P = f(w[p]);
      if (P !== void 0) {
        this._comments[this.fen()] = P;
        continue;
      }
      const T = this._moveFromSan(w[p], t);
      if (T == null)
        if (Pt.indexOf(w[p]) > -1)
          y = w[p];
        else
          throw new Error(`Invalid move in PGN: ${w[p]}`);
      else
        y = "", this._makeMove(T), this._incPositionCount(this.fen());
    }
    y && Object.keys(this._header).length && !this._header.Result && this.header("Result", y);
  }
  /*
   * Convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   *
   * @param {boolean} strict Use the strict SAN parser. It will throw errors
   * on overly disambiguated moves (see below):
   *
   * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
   * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
   * 4. ... Ne7 is technically the valid SAN
   */
  _moveToSan(e, t) {
    let i = "";
    if (e.flags & S.KSIDE_CASTLE)
      i = "O-O";
    else if (e.flags & S.QSIDE_CASTLE)
      i = "O-O-O";
    else {
      if (e.piece !== R) {
        const s = wt(e, t);
        i += e.piece.toUpperCase() + s;
      }
      e.flags & (S.CAPTURE | S.EP_CAPTURE) && (e.piece === R && (i += q(e.from)[0]), i += "x"), i += q(e.to), e.promotion && (i += `=${e.promotion.toUpperCase()}`);
    }
    return this._makeMove(e), this.isCheck() && (this.isCheckmate() ? i += "#" : i += "+"), this._undoMove(), i;
  }
  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  _moveFromSan(e, t = !1) {
    const i = Pe(e);
    let s = xe(i), n = this._moves({ legal: !0, piece: s });
    for (let h = 0, m = n.length; h < m; h++)
      if (i === Pe(this._moveToSan(n[h], n)))
        return n[h];
    if (t)
      return null;
    let o, r, l, c, u, d = !1;
    if (r = i.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/), r ? (o = r[1], l = r[2], c = r[3], u = r[4], l.length === 1 && (d = !0)) : (r = i.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/), r && (o = r[1], l = r[2], c = r[3], u = r[4], l.length === 1 && (d = !0))), s = xe(i), n = this._moves({
      legal: !0,
      piece: o || s
    }), !c)
      return null;
    for (let h = 0, m = n.length; h < m; h++)
      if (l) {
        if ((!o || o.toLowerCase() === n[h].piece) && _[l] === n[h].from && _[c] === n[h].to && (!u || u.toLowerCase() === n[h].promotion))
          return n[h];
        if (d) {
          const f = q(n[h].from);
          if ((!o || o.toLowerCase() === n[h].piece) && _[c] === n[h].to && (l === f[0] || l === f[1]) && (!u || u.toLowerCase() === n[h].promotion))
            return n[h];
        }
      } else if (i === Pe(this._moveToSan(n[h], n)).replace("x", ""))
        return n[h];
    return null;
  }
  ascii() {
    let e = `   +------------------------+
`;
    for (let t = _.a8; t <= _.h1; t++) {
      if (ae(t) === 0 && (e += ` ${"87654321"[J(t)]} |`), this._board[t]) {
        const i = this._board[t].type, n = this._board[t].color === O ? i.toUpperCase() : i.toLowerCase();
        e += ` ${n} `;
      } else
        e += " . ";
      t + 1 & 136 && (e += `|
`, t += 8);
    }
    return e += `   +------------------------+
`, e += "     a  b  c  d  e  f  g  h", e;
  }
  perft(e) {
    const t = this._moves({ legal: !1 });
    let i = 0;
    const s = this._turn;
    for (let n = 0, o = t.length; n < o; n++)
      this._makeMove(t[n]), this._isKingAttacked(s) || (e - 1 > 0 ? i += this.perft(e - 1) : i++), this._undoMove();
    return i;
  }
  turn() {
    return this._turn;
  }
  board() {
    const e = [];
    let t = [];
    for (let i = _.a8; i <= _.h1; i++)
      this._board[i] == null ? t.push(null) : t.push({
        square: q(i),
        type: this._board[i].type,
        color: this._board[i].color
      }), i + 1 & 136 && (e.push(t), t = [], i += 8);
    return e;
  }
  squareColor(e) {
    if (e in _) {
      const t = _[e];
      return (J(t) + ae(t)) % 2 === 0 ? "light" : "dark";
    }
    return null;
  }
  history({ verbose: e = !1 } = {}) {
    const t = [], i = [];
    for (; this._history.length > 0; )
      t.push(this._undoMove());
    for (; ; ) {
      const s = t.pop();
      if (!s)
        break;
      e ? i.push(new le(this, s)) : i.push(this._moveToSan(s, this._moves())), this._makeMove(s);
    }
    return i;
  }
  /*
   * Keeps track of position occurrence counts for the purpose of repetition
   * checking. All three methods (`_inc`, `_dec`, and `_get`) trim the
   * irrelevent information from the fen, initialising new positions, and
   * removing old positions from the record if their counts are reduced to 0.
   */
  _getPositionCount(e) {
    const t = we(e);
    return this._positionCount[t] || 0;
  }
  _incPositionCount(e) {
    const t = we(e);
    this._positionCount[t] === void 0 && (this._positionCount[t] = 0), this._positionCount[t] += 1;
  }
  _decPositionCount(e) {
    const t = we(e);
    this._positionCount[t] === 1 ? delete this._positionCount[t] : this._positionCount[t] -= 1;
  }
  _pruneComments() {
    const e = [], t = {}, i = (s) => {
      s in this._comments && (t[s] = this._comments[s]);
    };
    for (; this._history.length > 0; )
      e.push(this._undoMove());
    for (i(this.fen()); ; ) {
      const s = e.pop();
      if (!s)
        break;
      this._makeMove(s), i(this.fen());
    }
    this._comments = t;
  }
  getComment() {
    return this._comments[this.fen()];
  }
  setComment(e) {
    this._comments[this.fen()] = e.replace("{", "[").replace("}", "]");
  }
  /**
   * @deprecated Renamed to `removeComment` for consistency
   */
  deleteComment() {
    return this.removeComment();
  }
  removeComment() {
    const e = this._comments[this.fen()];
    return delete this._comments[this.fen()], e;
  }
  getComments() {
    return this._pruneComments(), Object.keys(this._comments).map((e) => ({ fen: e, comment: this._comments[e] }));
  }
  /**
   * @deprecated Renamed to `removeComments` for consistency
   */
  deleteComments() {
    return this.removeComments();
  }
  removeComments() {
    return this._pruneComments(), Object.keys(this._comments).map((e) => {
      const t = this._comments[e];
      return delete this._comments[e], { fen: e, comment: t };
    });
  }
  setCastlingRights(e, t) {
    for (const s of [I, U])
      t[s] !== void 0 && (t[s] ? this._castling[e] |= ce[s] : this._castling[e] &= ~ce[s]);
    this._updateCastlingRights();
    const i = this.getCastlingRights(e);
    return (t[I] === void 0 || t[I] === i[I]) && (t[U] === void 0 || t[U] === i[U]);
  }
  getCastlingRights(e) {
    return {
      [I]: (this._castling[e] & ce[I]) !== 0,
      [U]: (this._castling[e] & ce[U]) !== 0
    };
  }
  moveNumber() {
    return this._moveNumber;
  }
}
class kt {
  /**
   * Creates a new PositionService instance
   * @param {ChessboardConfig} config - Board configuration
   */
  constructor(e) {
    this.config = e, this.game = null;
  }
  /**
   * Converts various position formats to FEN string
   * @param {string|Object} position - Position in various formats
   * @returns {string} FEN string representation
   * @throws {ValidationError} When position format is invalid
   */
  convertFen(e) {
    if (typeof e == "string")
      return this._convertStringPosition(e);
    if (typeof e == "object" && e !== null)
      return this._convertObjectPosition(e);
    throw new k(C.invalid_position + e, "position", e);
  }
  /**
   * Converts string position to FEN
   * @private
   * @param {string} position - String position
   * @returns {string} FEN string
   */
  _convertStringPosition(e) {
    if (e === "start")
      return Ze;
    if (this.validateFen(e))
      return e;
    if (Ae[e])
      return Ae[e];
    throw new k(C.invalid_position + e, "position", e);
  }
  /**
   * Converts object position to FEN
   * @private
   * @param {Object} position - Object with square->piece mapping
   * @returns {string} FEN string
   */
  _convertObjectPosition(e) {
    const t = [];
    for (let i = 0; i < 8; i++) {
      const s = [];
      let n = 0;
      for (let o = 0; o < 8; o++) {
        const r = this._getSquareID(i, o), l = e[r];
        if (l) {
          n > 0 && (s.push(n), n = 0);
          const c = l[1] === "w" ? l[0].toUpperCase() : l[0].toLowerCase();
          s.push(c);
        } else
          n++;
      }
      n > 0 && s.push(n), t.push(s.join(""));
    }
    return `${t.join("/")} w KQkq - 0 1`;
  }
  /**
   * Sets up the game with the given position
   * @param {string|Object} position - Position to set
   * @param {Object} [options] - Additional options for game setup
   */
  setGame(e, t = {}) {
    const i = this.convertFen(e);
    this.game ? this.game.load(i, t) : this.game = new Et(i);
  }
  /**
   * Gets the current game instance
   * @returns {Chess} Current chess.js game instance
   */
  getGame() {
    return this.game;
  }
  /**
   * Validates a FEN string
   * @param {string} fen - FEN string to validate
   * @returns {boolean} True if valid, false otherwise
   */
  validateFen(e) {
    return je(e);
  }
  /**
   * Gets piece information for a specific square
   * @param {string} squareId - Square identifier
   * @returns {string|null} Piece ID or null if no piece
   */
  getGamePieceId(e) {
    if (!this.game) return null;
    const t = this.game.get(e);
    return t ? t.color + t.type : null;
  }
  /**
   * Checks if a specific piece is on a specific square
   * @param {string} piece - Piece ID to check
   * @param {string} square - Square to check
   * @returns {boolean} True if piece is on square
   */
  isPiece(e, t) {
    return this.getGamePieceId(t) === e;
  }
  /**
   * Converts board coordinates to square ID
   * @private
   * @param {number} row - Row index (0-7)
   * @param {number} col - Column index (0-7)
   * @returns {string} Square ID (e.g., 'e4')
   */
  _getSquareID(e, t) {
    return e = parseInt(e), t = parseInt(t), this.config.orientation === "w" ? (e = 8 - e, t = t + 1) : (e = e + 1, t = 8 - t), he[t - 1] + e;
  }
  /**
   * Changes the turn in a FEN string
   * @param {string} fen - Original FEN string
   * @param {string} color - New turn color ('w' or 'b')
   * @returns {string} Modified FEN string
   */
  changeFenTurn(e, t) {
    const i = e.split(" ");
    return i[1] = t, i.join(" ");
  }
  /**
   * Gets the current position as an object
   * @returns {Object} Position object with piece placements
   */
  getPosition() {
    const e = {}, t = this.getGame(), i = [
      "a1",
      "b1",
      "c1",
      "d1",
      "e1",
      "f1",
      "g1",
      "h1",
      "a2",
      "b2",
      "c2",
      "d2",
      "e2",
      "f2",
      "g2",
      "h2",
      "a3",
      "b3",
      "c3",
      "d3",
      "e3",
      "f3",
      "g3",
      "h3",
      "a4",
      "b4",
      "c4",
      "d4",
      "e4",
      "f4",
      "g4",
      "h4",
      "a5",
      "b5",
      "c5",
      "d5",
      "e5",
      "f5",
      "g5",
      "h5",
      "a6",
      "b6",
      "c6",
      "d6",
      "e6",
      "f6",
      "g6",
      "h6",
      "a7",
      "b7",
      "c7",
      "d7",
      "e7",
      "f7",
      "g7",
      "h7",
      "a8",
      "b8",
      "c8",
      "d8",
      "e8",
      "f8",
      "g8",
      "h8"
    ];
    for (const s of i) {
      const n = t.get(s);
      n && (e[s] = n.type + n.color);
    }
    return e;
  }
  /**
   * Toggles the turn in a FEN string
   * @param {string} fen - Original FEN string
   * @returns {string} Modified FEN string
   */
  changeFenColor(e) {
    const t = e.split(" ");
    return t[1] = t[1] === "w" ? "b" : "w", t.join(" ");
  }
  /**
   * Cleans up resources
   */
  destroy() {
    this.game = null;
  }
}
let pe = class {
  /**
   * Creates a new Chessboard instance
   * @param {Object} config - Configuration object
   * @throws {ConfigurationError} If configuration is invalid
   */
  constructor(e) {
    try {
      this._performanceMonitor = new Ve(), this._performanceMonitor.startMeasure("chessboard-initialization"), this._validateAndInitializeConfig(e), this._initializeServices(), this._initialize(), this._performanceMonitor.endMeasure("chessboard-initialization");
    } catch (t) {
      this._handleConstructorError(t);
    }
    this._undoneMoves = [], this._updateBoardPieces(!0, !0);
  }
  /**
   * Validates and initializes configuration
   * @private
   * @param {Object} config - Raw configuration object
   * @throws {ConfigurationError} If configuration is invalid
   */
  _validateAndInitializeConfig(e) {
    if (!e || typeof e != "object")
      throw new L("Configuration must be an object", "config", e);
    if (this.config = new Be(e), !this.config.id_div)
      throw new L(
        "Configuration must include id_div",
        "id_div",
        this.config.id_div
      );
  }
  /**
   * Handles constructor errors gracefully
   * @private
   * @param {Error} error - Error that occurred during construction
   */
  _handleConstructorError(e) {
    throw console.error("Chessboard initialization failed:", e), this._cleanup(), e instanceof z ? e : new z("Failed to initialize chessboard", "INITIALIZATION_ERROR", {
      originalError: e.message,
      stack: e.stack
    });
  }
  /**
   * Cleans up any partially initialized resources (safe to call multiple times)
   * @private
   */
  _cleanup() {
    this.eventService && typeof this.eventService.removeListeners == "function" && this.eventService.removeListeners(), this._updateTimeout && (clearTimeout(this._updateTimeout), this._updateTimeout = null), this.validationService = null, this.coordinateService = null, this.positionService = null, this.boardService = null, this.pieceService = null, this.animationService = null, this.moveService = null, this.eventService = null;
  }
  /**
   * Initializes all services
   * @private
   */
  _initializeServices() {
    this.validationService = new Ie(), this.coordinateService = new lt(this.config), this.positionService = new kt(this.config), this.boardService = new at(this.config), this.pieceService = new ft(this.config), this.animationService = new rt(this.config), this.moveService = new dt(this.config, this.positionService), this.eventService = new ut(
      this.config,
      this.boardService,
      this.moveService,
      this.coordinateService,
      this
    ), this._updateTimeout = null, this._isAnimating = !1, this._boundUpdateBoardPieces = this._updateBoardPieces.bind(this), this._boundOnSquareClick = this._onSquareClick.bind(this), this._boundOnPieceHover = this._onPieceHover.bind(this), this._boundOnPieceLeave = this._onPieceLeave.bind(this);
  }
  /**
   * Initializes the board
   * @private
   */
  _initialize() {
    this._initParams(), this._setGame(this.config.position), this._buildBoard(), this._buildSquares(), this._addListeners(), this._updateBoardPieces(!0, !0);
  }
  /**
   * Initializes parameters and state
   * @private
   */
  _initParams() {
    this.eventService.setClicked(null), this.eventService.setPromoting(!1), this.eventService.setAnimating(!1);
  }
  /**
   * Sets up the game with initial position
   * @private
   * @param {string|Object} position - Initial position
   */
  _setGame(e) {
    this.positionService.setGame(e);
  }
  /**
   * Builds the board DOM structure
   * @private
   * Best practice: always remove squares (destroy JS/DOM) before clearing the board container.
   */
  _buildBoard() {
    if (this._isUndoRedo)
      return;
    const e = document.getElementById(this.config.id_div);
    e && (e.innerHTML = ""), this.boardService && this.boardService.squares && Object.values(this.boardService.squares).forEach(
      (t) => t && t.forceRemoveAllPieces && t.forceRemoveAllPieces()
    ), this.boardService && this.boardService.removeSquares && this.boardService.removeSquares(), this.boardService && this.boardService.removeBoard && this.boardService.removeBoard(), this.boardService.buildBoard();
  }
  /**
   * Builds all squares on the board
   * @private
   */
  _buildSquares() {
    this._isUndoRedo || (this.boardService && this.boardService.removeSquares && this.boardService.removeSquares(), this.boardService.buildSquares((e, t) => this.coordinateService.realCoord(e, t)));
  }
  /**
   * Adds event listeners to squares
   * @private
   */
  _addListeners() {
    this.eventService.addListeners(
      this._boundOnSquareClick,
      this._boundOnPieceHover,
      this._boundOnPieceLeave
    );
  }
  /**
   * Handles square click events
   * @private
   * @param {Square} square - Clicked square
   * @param {boolean} [animate=true] - Whether to animate
   * @param {boolean} [dragged=false] - Whether triggered by drag
   * @returns {boolean} True if successful
   */
  _onSquareClick(e, t = !0, i = !1) {
    return this.eventService.onClick(
      e,
      this._onMove.bind(this),
      this._onSelect.bind(this),
      this._onDeselect.bind(this),
      t,
      i
    );
  }
  /**
   * Handles piece hover events
   * @private
   * @param {Square} square - Hovered square
   */
  _onPieceHover(e) {
    this.config.hints && !this.eventService.getClicked() && this._hintMoves(e);
  }
  /**
   * Handles piece leave events
   * @private
   * @param {Square} square - Left square
   */
  _onPieceLeave(e) {
    this.config.hints && !this.eventService.getClicked() && this._dehintMoves(e);
  }
  /**
   * Handles move execution
   * @private
   * @param {Square} fromSquare - Source square
   * @param {Square} toSquare - Target square
   * @param {string} [promotion] - Promotion piece
   * @param {boolean} [animate=true] - Whether to animate
   * @returns {boolean} True if move was successful
   */
  _onMove(e, t, i = null, s = !0) {
    const n = new W(e, t, i);
    return !n.check() || this.config.onlyLegalMoves && !n.isLegal(this.positionService.getGame()) ? (this._clearVisualState(), !1) : !n.hasPromotion() && this._requiresPromotion(n) ? !1 : this.config.onMove(n) ? (this._executeMove(n, s), !0) : (this._clearVisualState(), !1);
  }
  /**
   * Handles square selection
   * @private
   * @param {Square} square - Selected square
   */
  _onSelect(e) {
    this.config.clickable && (e.select(), this._hintMoves(e));
  }
  /**
   * Handles square deselection
   * @private
   */
  _onDeselect() {
    this._clearVisualState();
  }
  /**
   * Shows legal move hints for a square
   * @private
   * @param {Square} square - Square to show hints for
   */
  _hintMoves(e) {
    if (!this.moveService.canMove(e)) return;
    this.boardService.applyToAllSquares("removeHint");
    const t = this.moveService.getCachedLegalMoves(e);
    for (const i of t)
      if (i.to && i.to.length === 2) {
        const s = this.boardService.getSquare(i.to);
        if (s) {
          const n = s.piece && s.piece.color !== this.positionService.getGame().turn();
          s.putHint(n);
        }
      }
  }
  /**
   * Removes legal move hints for a square
   * @private
   * @param {Square} square - Square to remove hints for
   */
  _dehintMoves(e) {
    const t = this.moveService.getCachedLegalMoves(e);
    for (const i of t)
      if (i.to && i.to.length === 2) {
        const s = this.boardService.getSquare(i.to);
        s && s.removeHint();
      }
  }
  /**
   * Checks if a move requires promotion
   * @private
   * @param {Move} move - Move to check
   * @returns {boolean} True if promotion is required
   */
  _requiresPromotion(e) {
    return this.moveService.requiresPromotion(e);
  }
  /**
   * Executes a move
   * @private
   * @param {Move} move - Move to execute
   * @param {boolean} [animate=true] - Whether to animate
   */
  _executeMove(e, t = !0) {
    if (this._clearVisualState(), !this.positionService.getGame())
      throw new z("Game not initialized", "GAME_ERROR");
    const s = this.moveService.executeMove(e);
    if (!s) {
      console.error("Move execution failed unexpectedly for move:", e), this._updateBoardPieces(!1);
      return;
    }
    this.boardService.applyToAllSquares("unmoved"), e.from.moved(), e.to.moved();
    const n = this.moveService.isCastle(s), o = this.moveService.isEnPassant(s);
    t && e.from.piece ? (this.pieceService.translatePiece(
      e,
      !!e.to.piece,
      // was there a capture?
      t,
      this._createDragFunction.bind(this),
      () => {
        n ? this._handleSpecialMoveAnimation(s) : o && this._handleSpecialMoveAnimation(s), this.config.onMoveEnd(s), this._updateBoardPieces(!1);
      }
    ), n && this.config.animationStyle === "simultaneous" && setTimeout(() => {
      this._handleCastleMove(s, !0);
    }, this.config.simultaneousAnimationDelay)) : (n ? this._handleSpecialMove(s) : o && this._handleSpecialMove(s), this._updateBoardPieces(!1), this.config.onMoveEnd(s));
  }
  /**
   * Handles special moves (castle, en passant) without animation
   * @private
   * @param {Object} gameMove - Game move object
   */
  _handleSpecialMove(e) {
    this.moveService.isCastle(e) ? this._handleCastleMove(e, !1) : this.moveService.isEnPassant(e) && this._handleEnPassantMove(e, !1);
  }
  /**
   * Handles special moves (castle, en passant) with animation
   * @private
   * @param {Object} gameMove - Game move object
   */
  _handleSpecialMoveAnimation(e) {
    this.moveService.isCastle(e) ? this._handleCastleMove(e, !0) : this.moveService.isEnPassant(e) && this._handleEnPassantMove(e, !0);
  }
  /**
   * Handles castle move by moving the rook
   * @private
   * @param {Object} gameMove - Game move object
   * @param {boolean} animate - Whether to animate
   */
  _handleCastleMove(e, t) {
    const i = this.moveService.getCastleRookMove(e);
    if (!i) return;
    const s = this.boardService.getSquare(i.from), n = this.boardService.getSquare(i.to);
    if (!s || !n || !s.piece) {
      console.warn("Castle rook move failed - squares or piece not found");
      return;
    }
    if (t) {
      const o = s.piece;
      this.pieceService.translatePiece(
        { from: s, to: n, piece: o },
        !1,
        // No capture for rook in castle
        t,
        this._createDragFunction.bind(this),
        () => {
          this._updateBoardPieces(!1);
        }
      );
    } else
      this._updateBoardPieces(!1);
  }
  /**
   * Handles en passant move by removing the captured pawn
   * @private
   * @param {Object} gameMove - Game move object
   * @param {boolean} animate - Whether to animate
   */
  _handleEnPassantMove(e, t) {
    const i = this.moveService.getEnPassantCapturedSquare(e);
    if (!i) return;
    const s = this.boardService.getSquare(i);
    if (!s || !s.piece) {
      console.warn("En passant captured square not found or empty");
      return;
    }
    t ? (this.pieceService.removePieceFromSquare(s, !0), setTimeout(() => {
      this._updateBoardPieces(!1);
    }, this.config.moveTime)) : this._updateBoardPieces(!1);
  }
  /**
   * Updates board pieces to match game state
   * @private
   * @param {boolean} [animation=false] - Whether to animate
   * @param {boolean} [isPositionLoad=false] - Whether this is a position load
   */
  _updateBoardPieces(e = !1, t = !1) {
    !this.positionService || !this.moveService || !this.eventService || (this._updateTimeout && (clearTimeout(this._updateTimeout), this._updateTimeout = null), this.moveService.clearCache(), e && !this.eventService.getClicked() ? this._updateTimeout = setTimeout(() => {
      this._doUpdateBoardPieces(e, t), this._updateTimeout = null, this._ensureHintsAvailable();
    }, 10) : (this._doUpdateBoardPieces(e, t), this._ensureHintsAvailable()));
  }
  /**
   * Ensures hints are available for the current turn
   * @private
   */
  _ensureHintsAvailable() {
    this.config.hints && setTimeout(() => {
      this.boardService.applyToAllSquares("removeHint"), this.moveService.clearCache();
    }, 50);
  }
  /**
   * Updates board pieces after a delayed move
   * @private
   */
  _updateBoardPiecesDelayed() {
    this._updateBoardPieces(!1);
  }
  /**
   * Performs the actual board update
   * @private
   * @param {boolean} [animation=false] - Whether to animate
   * @param {boolean} [isPositionLoad=false] - Whether this is a position load (affects delay)
   */
  _doUpdateBoardPieces(e = !1, t = !1) {
    if (this._isPromoting || !this.positionService || !this.positionService.getGame())
      return;
    const i = this.boardService.getAllSquares(), s = this.positionService.getGame().fen();
    this.config.animationStyle === "simultaneous" ? this._doSimultaneousUpdate(i, s, t) : this._doSequentialUpdate(i, s, e);
  }
  /**
   * Performs sequential piece updates (original behavior)
   * @private
   * @param {Object} squares - All squares
   * @param {string} gameStateBefore - Game state before update
   * @param {boolean} animation - Whether to animate
   */
  _doSequentialUpdate(e, t, i) {
    const s = {};
    Object.values(e).forEach((o) => {
      s[o.id] = this.positionService.getGamePieceId(o.id);
    }), Object.values(e).forEach((o) => {
      const r = s[o.id], l = o.piece, c = l ? l.getId() : null;
      if (c !== r && (l && c !== r && this.pieceService.removePieceFromSquare(o, i), r && c !== r)) {
        const u = this.pieceService.convertPiece(r);
        this.pieceService.addPieceOnSquare(
          o,
          u,
          i,
          this._createDragFunction.bind(this)
        );
      }
    }), this._addListeners();
    const n = this.positionService.getGame().fen();
    t !== n && this.config.onChange(n);
  }
  /**
   * Performs simultaneous piece updates
   * @private
   * @param {Object} squares - All squares
   * @param {string} gameStateBefore - Game state before update
   * @param {boolean} [isPositionLoad=false] - Whether this is a position load
   */
  _doSimultaneousUpdate(e, t, i = !1) {
    const s = {}, n = {};
    Object.values(e).forEach((d) => {
      const h = d.piece, m = this.positionService.getGamePieceId(d.id);
      if (h) {
        const f = (h.color + h.type).toLowerCase();
        s[f] || (s[f] = []), s[f].push({ square: d, id: d.id });
      }
      if (m) {
        const f = m.toLowerCase();
        n[f] || (n[f] = []), n[f].push({ square: d, id: d.id });
      }
    });
    let o = 0, r = 0;
    const l = i ? 0 : this.config.simultaneousAnimationDelay;
    let c = 0;
    if (Object.keys(n).forEach((d) => {
      r += Math.max((s[d] || []).length, n[d].length);
    }), r === 0) {
      this._addListeners();
      const d = this.positionService.getGame().fen();
      t !== d && this.config.onChange(d);
      return;
    }
    const u = () => {
      if (o++, o === r) {
        this._addListeners();
        const d = this.positionService.getGame().fen();
        t !== d && this.config.onChange(d);
      }
    };
    Object.keys(n).forEach((d) => {
      const h = (s[d] || []).slice(), m = n[d].slice(), f = [];
      for (let y = 0; y < h.length; y++) {
        f[y] = [];
        for (let p = 0; p < m.length; p++)
          f[y][p] = Math.abs(h[y].square.row - m[p].square.row) + Math.abs(h[y].square.col - m[p].square.col);
      }
      const g = new Array(h.length).fill(!1), b = new Array(m.length).fill(!1), w = [];
      for (; ; ) {
        let y = 1 / 0, p = -1, P = -1;
        for (let T = 0; T < h.length; T++)
          if (!g[T])
            for (let F = 0; F < m.length; F++)
              b[F] || f[T][F] < y && (y = f[T][F], p = T, P = F);
        if (p === -1 || P === -1) break;
        if (h[p].square === m[P].square) {
          g[p] = !0, b[P] = !0;
          continue;
        }
        w.push({
          from: h[p].square,
          to: m[P].square,
          piece: h[p].square.piece
        }), g[p] = !0, b[P] = !0;
      }
      for (let y = 0; y < h.length; y++)
        g[y] || (setTimeout(() => {
          this.pieceService.removePieceFromSquare(h[y].square, !0, u);
        }, c * l), c++);
      for (let y = 0; y < m.length; y++)
        b[y] || (setTimeout(() => {
          const p = this.pieceService.convertPiece(d);
          this.pieceService.addPieceOnSquare(
            m[y].square,
            p,
            !0,
            this._createDragFunction.bind(this),
            u
          );
        }, c * l), c++);
      w.forEach((y) => {
        setTimeout(() => {
          this.pieceService.translatePiece(
            y,
            !1,
            !0,
            this._createDragFunction.bind(this),
            u
          );
        }, c * l), c++;
      });
    });
  }
  /**
   * Analyzes position changes to determine optimal animation strategy
   * @private
   * @param {Object} squares - All squares
   * @returns {Object} Analysis of changes
   */
  _analyzePositionChanges(e) {
    const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
    Object.values(e).forEach((c) => {
      const u = c.piece, d = this.positionService.getGamePieceId(c.id);
      u && t.set(c.id, u.getId()), d && i.set(c.id, d);
    });
    const s = [], n = [], o = [], r = [], l = /* @__PURE__ */ new Set();
    return t.forEach((c, u) => {
      const d = i.get(u);
      c === d && (r.push({
        piece: c,
        square: u
      }), l.add(u));
    }), t.forEach((c, u) => {
      if (l.has(u))
        return;
      const d = Array.from(i.entries()).find(
        ([h, m]) => m === c && !l.has(h)
      );
      if (d) {
        const [h] = d;
        s.push({
          piece: c,
          from: u,
          to: h,
          fromSquare: e[u],
          toSquare: e[h]
        }), l.add(h);
      } else
        n.push({
          piece: c,
          square: u,
          squareObj: e[u]
        });
    }), i.forEach((c, u) => {
      l.has(u) || o.push({
        piece: c,
        square: u,
        squareObj: e[u]
      });
    }), {
      moves: s,
      removes: n,
      adds: o,
      unchanged: r,
      totalChanges: s.length + n.length + o.length
    };
  }
  /**
   * Executes simultaneous changes based on analysis
   * @private
   * @param {Object} changeAnalysis - Analysis of changes
   * @param {string} gameStateBefore - Game state before update
   * @param {boolean} [isPositionLoad=false] - Whether this is a position load
   */
  _executeSimultaneousChanges(e, t, i = !1) {
    const { moves: s, removes: n, adds: o } = e;
    let r = 0;
    const l = s.length + n.length + o.length;
    if (l === 0) {
      this._addListeners();
      const h = this.positionService.getGame().fen();
      t !== h && this.config.onChange(h);
      return;
    }
    const c = () => {
      if (r++, r === l) {
        this._addListeners();
        const h = this.positionService.getGame().fen();
        t !== h && this.config.onChange(h);
      }
    }, u = i ? 0 : this.config.simultaneousAnimationDelay;
    let d = 0;
    s.forEach((h) => {
      const m = d * u;
      setTimeout(() => {
        this._animatePieceMove(h, c);
      }, m), d++;
    }), n.forEach((h) => {
      const m = d * u;
      setTimeout(() => {
        this._animatePieceRemoval(h, c);
      }, m), d++;
    }), o.forEach((h) => {
      const m = d * u;
      setTimeout(() => {
        this._animatePieceAddition(h, c);
      }, m), d++;
    });
  }
  /**
   * Animates a piece moving from one square to another
   * @private
   * @param {Object} move - Move information
   * @param {Function} onComplete - Callback when animation completes
   */
  _animatePieceMove(e, t) {
    const { fromSquare: i, toSquare: s } = e, n = i.piece;
    if (!n) {
      console.warn(`No piece found on ${e.from} for move animation`), t();
      return;
    }
    this.pieceService.translatePiece(
      { from: i, to: s, piece: n },
      !1,
      // Assume no capture for now
      !0,
      // Always animate
      this._createDragFunction.bind(this),
      t
    );
  }
  /**
   * Animates a piece being removed
   * @private
   * @param {Object} remove - Remove information
   * @param {Function} onComplete - Callback when animation completes
   */
  _animatePieceRemoval(e, t) {
    this.pieceService.removePieceFromSquare(e.squareObj, !0, t);
  }
  /**
   * Animates a piece being added
   * @private
   * @param {Object} add - Add information
   * @param {Function} onComplete - Callback when animation completes
   */
  _animatePieceAddition(e, t) {
    const i = this.pieceService.convertPiece(e.piece);
    this.pieceService.addPieceOnSquare(
      e.squareObj,
      i,
      !0,
      this._createDragFunction.bind(this),
      t
    );
  }
  /**
   * Creates a drag function for a piece
   * @private
   * @param {Square} square - Square containing the piece
   * @param {Piece} piece - Piece to create drag function for
   * @returns {Function} Drag function
   */
  _createDragFunction(e, t) {
    return this.eventService.createDragFunction(
      e,
      t,
      this.config.onDragStart,
      this.config.onDragMove,
      this.config.onDrop,
      this._onSnapback.bind(this),
      this._onMove.bind(this),
      this._onRemove.bind(this)
    );
  }
  /**
   * Handles snapback animation
   * @private
   * @param {Square} square - Square containing the piece
   * @param {Piece} piece - Piece to snapback
   */
  _onSnapback(e, t) {
    this.pieceService.snapbackPiece(e, this.config.snapbackAnimation), this.config.onSnapbackEnd(e, t);
  }
  /**
   * Handles piece removal
   * @private
   * @param {Square} square - Square containing the piece to remove
   */
  _onRemove(e) {
    this.pieceService.removePieceFromSquare(e, !0), this.positionService.getGame().remove(e.id), this._updateBoardPieces(!0);
  }
  /**
   * Clears all visual state (selections, hints, highlights)
   * @private
   */
  _clearVisualState() {
    this.boardService.applyToAllSquares("deselect"), this.boardService.applyToAllSquares("removeHint"), this.boardService.applyToAllSquares("dehighlight"), this.eventService.setClicked(null);
  }
  // -------------------
  // Public API Methods (Refactored)
  // -------------------
  // --- POSITION & STATE ---
  /**
   * Get the current position as FEN
   * @returns {string}
   */
  getPosition() {
    return this.fen();
  }
  /**
   * Set the board position (FEN or object)
   * @param {string|Object} position
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {boolean}
   */
  setPosition(e, t = {}) {
    const i = t.animate !== void 0 ? t.animate : !0;
    return this.boardService && this.boardService.applyToAllSquares && (this.boardService.applyToAllSquares("removeHint"), this.boardService.applyToAllSquares("deselect"), this.boardService.applyToAllSquares("unmoved")), this.positionService && this.positionService.setGame && this.positionService.setGame(e), this._updateBoardPieces && this._updateBoardPieces(i, !0), !0;
  }
  /**
   * Reset the board to the starting position
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {boolean}
   */
  reset(e = {}) {
    const t = e.animate !== void 0 ? e.animate : !0, i = this.config && this.config.position ? this.config.position : "start";
    return this._updateBoardPieces(t), this.setPosition(i, { animate: t });
  }
  /**
   * Clear the board
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {boolean}
   */
  clear(e = {}) {
    const t = e.animate !== void 0 ? e.animate : !0;
    return !this.positionService || !this.positionService.getGame() ? !1 : (this._clearVisualState && this._clearVisualState(), this.positionService.getGame().clear(), this._updateBoardPieces && this._updateBoardPieces(t, !0), !0);
  }
  // --- MOVE MANAGEMENT ---
  /**
   * Undo last move
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {boolean}
   */
  undoMove(e = {}) {
    const t = this.positionService.getGame().undo();
    return t ? (this._undoneMoves.push(t), this._updateBoardPieces(e.animate !== !1), t) : null;
  }
  /**
   * Redo last undone move
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {boolean}
   */
  redoMove(e = {}) {
    if (this._undoneMoves && this._undoneMoves.length > 0) {
      const t = this._undoneMoves.pop(), i = { from: t.from, to: t.to };
      t.promotion && (i.promotion = t.promotion);
      const s = this.positionService.getGame().move(i);
      return this._updateBoardPieces(e.animate !== !1), s;
    }
    return !1;
  }
  /**
   * Get legal moves for a square
   * @param {string} square
   * @returns {Array}
   */
  getLegalMoves(e) {
    return this.legalMoves(e);
  }
  // --- PIECE MANAGEMENT ---
  /**
   * Get the piece at a square
   * @param {string} square
   * @returns {string|null}
   */
  getPiece(e) {
    const t = this.boardService.getSquare(e);
    if (!t) return null;
    const i = t.piece;
    return i ? (i.color + i.type).toLowerCase() : null;
  }
  /**
   * Put a piece on a square
   * @param {string} piece
   * @param {string} square
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {boolean}
   */
  putPiece(e, t, i = {}) {
    const s = i.animate !== void 0 ? i.animate : !0;
    let n = e;
    if (typeof e == "object" && e.type && e.color)
      n = (e.color + e.type).toLowerCase();
    else if (typeof e == "string" && e.length === 2) {
      const m = e[0].toLowerCase(), f = e[1].toLowerCase(), g = "kqrbnp", b = "wb";
      if (g.includes(m) && b.includes(f))
        n = f + m;
      else if (b.includes(m) && g.includes(f))
        n = m + f;
      else
        throw new Error(`[putPiece] Invalid piece: ${e}`);
    }
    const o = this.validationService.isValidSquare(t), r = this.validationService.isValidPiece(n);
    if (!o) throw new Error(`[putPiece] Invalid square: ${t}`);
    if (!r) throw new Error(`[putPiece] Invalid piece: ${n}`);
    if (!this.positionService || !this.positionService.getGame())
      throw new Error("[putPiece] No positionService or game");
    const l = this.pieceService.convertPiece(n), c = this.boardService.getSquare(t);
    if (!c) throw new Error(`[putPiece] Square not found: ${t}`);
    c.piece = l;
    const u = { type: l.type, color: l.color };
    if (!this.positionService.getGame().put(u, t)) throw new Error(`[putPiece] Game.put failed for ${n} on ${t}`);
    return this._updateBoardPieces(s), !0;
  }
  /**
   * Remove a piece from a square
   * @param {string} square
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {string|null}
   */
  removePiece(e, t = {}) {
    const i = t.animate !== void 0 ? t.animate : !0;
    if (!this.validationService.isValidSquare(e))
      throw new Error(`[removePiece] Invalid square: ${e}`);
    const s = this.boardService.getSquare(e);
    return !s || !s.piece || (s.piece = null, this.positionService.getGame().remove(e), this._updateBoardPieces(i)), !0;
  }
  // --- BOARD CONTROL ---
  /**
   * Flip the board orientation
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   */
  flipBoard(e = {}) {
    this.coordinateService && this.coordinateService.flipOrientation && this.coordinateService.flipOrientation(), this._buildBoard && this._buildBoard(), this._buildSquares && this._buildSquares(), this._addListeners && this._addListeners(), this._updateBoardPieces && this._updateBoardPieces(e.animate !== !1);
  }
  /**
   * Set the board orientation
   * @param {'w'|'b'} color
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   */
  setOrientation(e, t = {}) {
    return this.validationService.isValidOrientation(e) && (this.coordinateService.setOrientation(e), this._buildBoard && this._buildBoard(), this._buildSquares && this._buildSquares(), this._addListeners && this._addListeners(), this._updateBoardPieces && this._updateBoardPieces(t.animate !== !1)), this.coordinateService.getOrientation();
  }
  /**
   * Get the current orientation
   * @returns {'w'|'b'}
   */
  getOrientation() {
    return this.orientation();
  }
  /**
   * Resize the board
   * @param {number|string} size
   */
  resizeBoard(e) {
    if (e === "auto")
      return this.config.size = "auto", document.documentElement.style.setProperty("--dimBoard", "auto"), this._updateBoardPieces(!1), !0;
    if (typeof e != "number" || e < 50 || e > 3e3)
      throw new Error(`[resizeBoard] Invalid size: ${e}`);
    return this.config.size = e, document.documentElement.style.setProperty("--dimBoard", `${e}px`), this._updateBoardPieces(!1), !0;
  }
  // --- HIGHLIGHTING & UI ---
  /**
   * Highlight a square
   * @param {string} square
   * @param {Object} [opts]
   */
  highlight(e, t = {}) {
    this.validationService.isValidSquare(e) && (this.boardService && this.boardService.highlightSquare ? this.boardService.highlightSquare(e, t) : this.eventService && this.eventService.highlightSquare && this.eventService.highlightSquare(e, t));
  }
  /**
   * Remove highlight from a square
   * @param {string} square
   * @param {Object} [opts]
   */
  dehighlight(e, t = {}) {
    this.validationService.isValidSquare(e) && (this.boardService && this.boardService.dehighlightSquare ? this.boardService.dehighlightSquare(e, t) : this.eventService && this.eventService.dehighlightSquare && this.eventService.dehighlightSquare(e, t));
  }
  // --- GAME INFO ---
  /**
   * Get FEN string
   * @returns {string}
   */
  fen() {
    const e = this.positionService.getGame();
    return !e || typeof e.fen != "function" ? "" : e.fen();
  }
  /**
   * Get current turn
   * @returns {'w'|'b'}
   */
  turn() {
    return this.positionService.getGame().turn();
  }
  /**
   * Is the game over?
   * @returns {boolean}
   */
  isGameOver() {
    const e = this.positionService.getGame();
    return e ? e.isGameOver ? e.isGameOver() : !!(e.isCheckmate && e.isCheckmate() || e.isDraw && e.isDraw()) : !1;
  }
  /**
   * Is it checkmate?
   * @returns {boolean}
   */
  isCheckmate() {
    const e = this.positionService.getGame();
    return e && e.isCheckmate ? e.isCheckmate() : !1;
  }
  /**
   * Is it draw?
   * @returns {boolean}
   */
  isDraw() {
    const e = this.positionService.getGame();
    return e && e.isDraw ? e.isDraw() : !1;
  }
  /**
   * Get move history
   * @returns {Array}
   */
  getHistory() {
    const e = this.positionService.getGame();
    return e ? e.history ? e.history() : [] : [];
  }
  // --- LIFECYCLE ---
  /**
   * Destroy the board and cleanup all resources
   */
  destroyBoard() {
    this.eventService && typeof this.eventService.removeListeners == "function" && this.eventService.removeListeners(), this._updateTimeout && (clearTimeout(this._updateTimeout), this._updateTimeout = null);
    const e = document.getElementById(this.config.id_div);
    e && (e.innerHTML = ""), this.boardService && this.boardService.squares && Object.values(this.boardService.squares).forEach((t) => {
      t && t.forceRemoveAllPieces && t.forceRemoveAllPieces();
    }), this.boardService && (this.boardService.removeSquares && this.boardService.removeSquares(), this.boardService.removeBoard && this.boardService.removeBoard()), this.validationService = null, this.coordinateService = null, this.positionService = null, this.boardService = null, this.pieceService = null, this.animationService = null, this.moveService = null, this.eventService = null, this._performanceMonitor = null, this._undoneMoves = null, this._boundUpdateBoardPieces = null, this._boundOnSquareClick = null, this._boundOnPieceHover = null, this._boundOnPieceLeave = null;
  }
  /**
   * Rebuild the board
   */
  rebuild() {
    this._initialize();
  }
  // --- CONFIGURATION ---
  /**
   * Get current config
   * @returns {Object}
   */
  getConfig() {
    return this.config;
  }
  /**
   * Set new config
   * @param {Object} newConfig
   */
  updateConfig(e) {
    this.config && typeof this.config.update == "function" && this.config.update(e), e.size !== void 0 && this.resizeBoard(e.size), e.orientation !== void 0 && this.setOrientation(e.orientation);
  }
  // --- ALIASES/DEPRECATED ---
  /**
   * Alias for move (deprecated)
   */
  move(e, t = !0) {
    return this._undoneMoves = [], this.movePiece(e, { animate: t });
  }
  /**
   * Alias for clear (deprecated)
   */
  clearBoard(e = !0) {
    return this._updateBoardPieces(e), this.clear({ animate: e });
  }
  /**
   * Alias for reset (deprecated)
   */
  start(e = !0) {
    return this._updateBoardPieces(e), this.reset({ animate: e });
  }
  /**
   * Alias for flipBoard (for backward compatibility)
   */
  flip(e = {}) {
    return this._updateBoardPieces(e.animate !== !1), this.flipBoard(e);
  }
  /**
   * Gets or sets the current position
   * @param {string|Object} [newPosition] - New position (optional)
   * @param {boolean} [animate=true] - Whether to animate
   * @returns {Object|void} Position object if getter, void if setter
   */
  getOrSetPosition(e, t = !0) {
    if (e === void 0)
      return this.positionService.getPosition();
    this.load(e, {}, t);
  }
  /**
   * Undoes the last move
   * @param {boolean} [animate=true] - Whether to animate
   * @returns {boolean} True if undo was successful
   */
  undo(e = !0) {
    const t = this.positionService.getGame().undo();
    return t ? (this._undoneMoves.push(t), this._updateBoardPieces(e), t) : null;
  }
  /**
   * Redoes the last undone move
   * @param {boolean} [animate=true] - Whether to animate
   * @returns {boolean} True if redo was successful
   */
  redo(e = !0) {
    if (this._undoneMoves && this._undoneMoves.length > 0) {
      const t = this._undoneMoves.pop(), i = { from: t.from, to: t.to };
      t.promotion && (i.promotion = t.promotion);
      const s = this.positionService.getGame().move(i);
      return this._updateBoardPieces(e), s;
    }
    return !1;
  }
  /**
   * Gets the game history
   * @returns {Array} Array of moves
   */
  history() {
    return this.positionService.getGame().history();
  }
  /**
   * Gets the current game state
   * @returns {Object} Game state object
   */
  game() {
    return this.positionService.getGame();
  }
  /**
   * Gets or sets the orientation
   * @param {string} [orientation] - New orientation
   * @returns {string} Current orientation
   */
  orientation(e) {
    return e === void 0 ? this.coordinateService.getOrientation() : (this.validationService.isValidOrientation(e) && (this.coordinateService.setOrientation(e), this.flip()), this.coordinateService.getOrientation());
  }
  /**
   * Gets or sets the size
   * @param {number|string} [size] - New size
   * @returns {number|string} Current size
   */
  size(e) {
    return e === void 0 ? this.config.size : (this.validationService.isValidSize(e) && (this.config.size = e, this.resize(e)), this.config.size);
  }
  /**
   * Gets legal moves for a square
   * @param {string} square - Square to get moves for
   * @returns {Array} Array of legal moves
   */
  legalMoves(e) {
    const t = this.boardService.getSquare(e);
    return t ? this.moveService.getCachedLegalMoves(t) : [];
  }
  /**
   * Checks if a move is legal
   * @param {string|Object} move - Move to check
   * @returns {boolean} True if move is legal
   */
  isLegal(e) {
    const t = typeof e == "string" ? this.moveService.parseMove(e) : e;
    if (!t) return !1;
    const i = this.boardService.getSquare(t.from), s = this.boardService.getSquare(t.to);
    return !i || !s ? !1 : new W(i, s, t.promotion).isLegal(this.positionService.getGame());
  }
  /**
   * Checks if the current player is in check
   * @returns {boolean} True if in check
   */
  inCheck() {
    return this.positionService.getGame().inCheck();
  }
  /**
   * Checks if the current player is in checkmate
   * @returns {boolean} True if in checkmate
   */
  inCheckmate() {
    return this.positionService.getGame().isCheckmate();
  }
  /**
   * Checks if the game is in stalemate
   * @returns {boolean} True if in stalemate
   */
  inStalemate() {
    return this.positionService.getGame().isStalemate();
  }
  /**
   * Checks if the game is drawn
   * @returns {boolean} True if drawn
   */
  inDraw() {
    return this.positionService.getGame().isDraw();
  }
  /**
   * Checks if position is threefold repetition
   * @returns {boolean} True if threefold repetition
   */
  inThreefoldRepetition() {
    return this.positionService.getGame().isThreefoldRepetition();
  }
  /**
   * Gets the PGN representation of the game
   * @returns {string} PGN string
   */
  pgn() {
    return this.positionService.getGame().pgn();
  }
  /**
   * Loads a PGN string
   * @param {string} pgn - PGN string to load
   * @param {boolean} [animate=true] - Whether to animate
   * @returns {boolean} True if loaded successfully
   */
  loadPgn(e, t = !0) {
    try {
      const i = this.positionService.getGame().loadPgn(e);
      return i && this._updateBoardPieces(t, !0), i;
    } catch (i) {
      return console.error("Error loading PGN:", i), !1;
    }
  }
  /**
   * Gets configuration options (alias for getConfig)
   * @returns {Object} Configuration object
   */
  getConfigOptions() {
    return this.config && typeof this.config.getConfig == "function" ? this.config.getConfig() : this.config;
  }
  /**
   * Updates configuration options (alias for updateConfig)
   * @param {Object} newConfig - New configuration options
   */
  setConfigOptions(e) {
    this.updateConfig(e);
  }
  /**
   * Gets or sets the animation style
   * @param {string} [style] - New animation style ('sequential' or 'simultaneous')
   * @returns {string} Current animation style
   */
  animationStyle(e) {
    return e === void 0 ? this.config.animationStyle : (this.validationService.isValidAnimationStyle(e) && (this.config.animationStyle = e), this.config.animationStyle);
  }
  /**
   * Gets or sets the simultaneous animation delay
   * @param {number} [delay] - New delay in milliseconds
   * @returns {number} Current delay
   */
  simultaneousAnimationDelay(e) {
    return e === void 0 ? this.config.simultaneousAnimationDelay : (typeof e == "number" && e >= 0 && (this.config.simultaneousAnimationDelay = e), this.config.simultaneousAnimationDelay);
  }
  // Additional API methods would be added here following the same pattern
  // This is a good starting point for the refactored architecture
  // Ensure all public API methods from README are present and routed
  insert(e, t) {
    return this.putPiece(t, e);
  }
  get(e) {
    return this.getPiece(e);
  }
  /**
   * Legacy position method - use getPosition/setPosition instead
   * @deprecated
   */
  position(e, t) {
    return e === void 0 ? this.positionService.getPosition() : (typeof t == "string" && (t === "w" || t === "b") && this.setOrientation(t), this.setPosition(e, { animate: t !== !1 }));
  }
  // Legacy aliases (using arrow functions to avoid duplicate method names)
  destroy() {
    return this.destroyBoard();
  }
  build() {
    return this._initialize();
  }
  resize(e) {
    return this.resizeBoard(e);
  }
  piece(e) {
    return this.getPiece(e);
  }
  ascii() {
    return this.positionService.getGame().ascii();
  }
  board() {
    return this.positionService.getGame().board();
  }
  getCastlingRights(e) {
    return this.positionService.getGame().getCastlingRights(e);
  }
  getComment() {
    return this.positionService.getGame().getComment();
  }
  getComments() {
    return this.positionService.getGame().getComments();
  }
  lastMove() {
    return this.positionService.getGame().lastMove();
  }
  moveNumber() {
    return this.positionService.getGame().moveNumber();
  }
  moves(e = {}) {
    return this.positionService.getGame().moves(e);
  }
  squareColor(e) {
    return this.boardService.getSquare(e).isWhite() ? "light" : "dark";
  }
  isDrawByFiftyMoves() {
    return this.positionService.getGame().isDrawByFiftyMoves();
  }
  isInsufficientMaterial() {
    return this.positionService.getGame().isInsufficientMaterial();
  }
  isStalemate() {
    return this.positionService.getGame().isStalemate();
  }
  isThreefoldRepetition() {
    return this.positionService.getGame().isThreefoldRepetition();
  }
  load(e, t = {}, i = !0) {
    return this.setPosition(e, { ...t, animate: i });
  }
  put(e, t, i = !0) {
    console.debug("[put] called with:", { pieceId: e, squareId: t, animation: i });
    let s = null;
    function n(r) {
      if (typeof r != "string" || r.length !== 2) return null;
      const l = r[0].toLowerCase(), c = r[1].toLowerCase(), u = "kqrbnp", d = "wb";
      return u.includes(l) && d.includes(c) ? { type: l, color: c } : d.includes(l) && u.includes(c) ? { type: c, color: l } : null;
    }
    if (typeof e == "string") {
      if (s = n(e), console.debug("[put] parsed piece string:", s), !s)
        return console.error(`[put] Invalid piece string: '${e}'. Use e.g. 'wQ', 'Qw', 'bK', 'kb'`), !1;
    } else if (typeof e == "object" && e.type && e.color) {
      const r = String(e.type).toLowerCase(), l = String(e.color).toLowerCase();
      if ("kqrbnp".includes(r) && "wb".includes(l))
        s = { type: r, color: l }, console.debug("[put] normalized piece object:", s);
      else
        return console.error(
          `[put] Invalid piece object: {type: '${e.type}', color: '${e.color}'}`
        ), !1;
    } else
      return console.error("[put] Invalid pieceId:", e), !1;
    if (typeof t != "string" || t.length !== 2)
      return console.error("[put] Invalid squareId:", t), !1;
    const o = this.putPiece(s, t, { animate: i });
    return console.debug("[put] putPiece result:", o), o;
  }
  remove(e, t = !0) {
    return this.removePiece(e, { animate: t });
  }
  removeComment() {
    return this.positionService.getGame().removeComment();
  }
  removeComments() {
    return this.positionService.getGame().removeComments();
  }
  removeHeader(e) {
    return this.positionService.getGame().removeHeader(e);
  }
  setCastlingRights(e, t) {
    return this.positionService.getGame().setCastlingRights(e, t);
  }
  setComment(e) {
    return this.positionService.getGame().setComment(e);
  }
  setHeader(e, t) {
    return this.positionService.getGame().setHeader(e, t);
  }
  validateFen(e) {
    return this.positionService.getGame().validateFen(e);
  }
  // Implementazioni reali per highlight/dehighlight
  highlightSquare(e) {
    return this.boardService.highlight(e);
  }
  dehighlightSquare(e) {
    return this.boardService.dehighlight(e);
  }
  forceSync() {
    this._updateBoardPieces(!0, !0);
  }
};
class ze {
  /**
   * Creates a new ChessboardFactory instance
   */
  constructor() {
    this.instances = /* @__PURE__ */ new Map(), this.validationService = new Ie(), this.performanceMonitor = new Ve(), this.logger = v.child("ChessboardFactory"), this.templates = /* @__PURE__ */ new Map(), this._initializeDefaultTemplates();
  }
  /**
   * Initializes default configuration templates
   * @private
   */
  _initializeDefaultTemplates() {
    this.templates.set("basic", {
      size: 400,
      draggable: !0,
      hints: !0,
      clickable: !0,
      moveHighlight: !0,
      animationStyle: "simultaneous"
    }), this.templates.set("tournament", {
      size: 500,
      draggable: !1,
      hints: !1,
      clickable: !0,
      moveHighlight: !0,
      onlyLegalMoves: !0,
      animationStyle: "sequential"
    }), this.templates.set("analysis", {
      size: 600,
      draggable: !0,
      hints: !0,
      clickable: !0,
      moveHighlight: !0,
      mode: "analysis",
      animationStyle: "simultaneous"
    }), this.templates.set("puzzle", {
      size: 450,
      draggable: !0,
      hints: !0,
      clickable: !0,
      moveHighlight: !0,
      onlyLegalMoves: !0,
      animationStyle: "sequential"
    }), this.templates.set("demo", {
      size: "auto",
      draggable: !1,
      hints: !1,
      clickable: !1,
      moveHighlight: !0,
      animationStyle: "simultaneous"
    });
  }
  /**
   * Creates a new chessboard instance
   * @param {string} containerId - Container element ID
   * @param {Object} [config={}] - Configuration options
   * @param {string} [template] - Template name to use
   * @returns {Chessboard} Chessboard instance
   * @throws {ConfigurationError} If configuration is invalid
   */
  create(e, t = {}, i = null) {
    this.performanceMonitor.startMeasure("chessboard-creation");
    try {
      if (!e || typeof e != "string")
        throw new L(
          "Container ID must be a non-empty string",
          "containerId",
          e
        );
      const s = document.getElementById(e);
      if (!s)
        throw new L(
          `Container element not found: ${e}`,
          "containerId",
          e
        );
      let n = { ...t };
      if (i) {
        const r = this.templates.get(i);
        r ? (n = { ...r, ...t }, this.logger.info(`Using template "${i}" for chessboard creation`)) : this.logger.warn(`Template "${i}" not found, using default configuration`);
      }
      n.id = e, this.validationService.validateConfig(n);
      const o = new pe(n);
      return this.instances.set(e, {
        instance: o,
        config: n,
        template: i,
        createdAt: /* @__PURE__ */ new Date(),
        container: s
      }), this.performanceMonitor.endMeasure("chessboard-creation"), this.logger.info(`Created chessboard instance for container: ${e}`, {
        template: i,
        configKeys: Object.keys(n)
      }), o;
    } catch (s) {
      throw this.performanceMonitor.endMeasure("chessboard-creation"), this.logger.error("Failed to create chessboard instance", { containerId: e, error: s }), s;
    }
  }
  /**
   * Creates a chessboard using a predefined template
   * @param {string} containerId - Container element ID
   * @param {string} templateName - Template name
   * @param {Object} [overrides={}] - Configuration overrides
   * @returns {Chessboard} Chessboard instance
   */
  createFromTemplate(e, t, i = {}) {
    return this.create(e, i, t);
  }
  /**
   * Gets an existing chessboard instance
   * @param {string} containerId - Container element ID
   * @returns {Chessboard|null} Chessboard instance or null if not found
   */
  getInstance(e) {
    const t = this.instances.get(e);
    return t ? t.instance : null;
  }
  /**
   * Gets information about an instance
   * @param {string} containerId - Container element ID
   * @returns {Object|null} Instance information or null if not found
   */
  getInstanceInfo(e) {
    const t = this.instances.get(e);
    return t ? {
      containerId: e,
      template: t.template,
      createdAt: t.createdAt,
      config: { ...t.config }
    } : null;
  }
  /**
   * Destroys a chessboard instance
   * @param {string} containerId - Container element ID
   * @returns {boolean} True if instance was destroyed, false if not found
   */
  destroy(e) {
    const t = this.instances.get(e);
    if (!t)
      return this.logger.warn(`Instance not found for destruction: ${e}`), !1;
    try {
      return t.instance.destroy(), this.instances.delete(e), this.logger.info(`Destroyed chessboard instance: ${e}`), !0;
    } catch (i) {
      return this.logger.error(`Failed to destroy chessboard instance: ${e}`, { error: i }), !1;
    }
  }
  /**
   * Destroys all chessboard instances
   */
  destroyAll() {
    const e = Array.from(this.instances.keys());
    let t = 0;
    for (const i of e)
      this.destroy(i) && t++;
    this.logger.info(`Destroyed ${t} chessboard instances`);
  }
  /**
   * Lists all active chessboard instances
   * @returns {Array} Array of instance information
   */
  listInstances() {
    return Array.from(this.instances.keys()).map(
      (e) => this.getInstanceInfo(e)
    );
  }
  /**
   * Registers a new configuration template
   * @param {string} name - Template name
   * @param {Object} config - Template configuration
   * @throws {ConfigurationError} If template name or config is invalid
   */
  registerTemplate(e, t) {
    if (!e || typeof e != "string")
      throw new L("Template name must be a non-empty string", "name", e);
    if (!t || typeof t != "object")
      throw new L("Template configuration must be an object", "config", t);
    this.validationService.validateConfig(t), this.templates.set(e, { ...t }), this.logger.info(`Registered template: ${e}`, { configKeys: Object.keys(t) });
  }
  /**
   * Removes a configuration template
   * @param {string} name - Template name
   * @returns {boolean} True if template was removed, false if not found
   */
  removeTemplate(e) {
    const t = this.templates.delete(e);
    return t && this.logger.info(`Removed template: ${e}`), t;
  }
  /**
   * Gets a configuration template
   * @param {string} name - Template name
   * @returns {Object|null} Template configuration or null if not found
   */
  getTemplate(e) {
    const t = this.templates.get(e);
    return t ? { ...t } : null;
  }
  /**
   * Lists all available templates
   * @returns {Array} Array of template names
   */
  listTemplates() {
    return Array.from(this.templates.keys());
  }
  /**
   * Creates multiple chessboard instances from a configuration array
   * @param {Array} configurations - Array of configuration objects
   * @returns {Array} Array of created chessboard instances
   */
  createMultiple(e) {
    const t = [], i = [];
    for (const s of e)
      try {
        const { containerId: n, template: o, ...r } = s, l = this.create(n, r, o);
        t.push({ containerId: n, instance: l, success: !0 });
      } catch (n) {
        i.push({ containerId: s.containerId, error: n, success: !1 }), this.logger.error(`Failed to create instance for ${s.containerId}`, { error: n });
      }
    return i.length > 0 && this.logger.warn(
      `Failed to create ${i.length} out of ${e.length} instances`
    ), { instances: t, errors: i };
  }
  /**
   * Gets factory statistics
   * @returns {Object} Factory statistics
   */
  getStats() {
    return {
      activeInstances: this.instances.size,
      availableTemplates: this.templates.size,
      performance: this.performanceMonitor.getMetrics(),
      validation: this.validationService.getCacheStats()
    };
  }
  /**
   * Cleans up factory resources
   */
  cleanup() {
    this.destroyAll(), this.validationService.destroy(), this.performanceMonitor.destroy(), this.templates.clear();
  }
}
const B = new ze();
function It(a, e = {}, t = null) {
  return B.create(a, e, t);
}
function Tt(a, e, t = {}) {
  return B.createFromTemplate(a, e, t);
}
function D(a, e = {}) {
  const t = v.child("ChessboardFactory");
  try {
    if (typeof a == "object" && a !== null)
      return t.debug("Creating chessboard with config object"), new pe(a);
    if (typeof a == "string") {
      t.debug("Creating chessboard with element ID", { elementId: a });
      const i = { ...e, id: a };
      return new pe(i);
    }
    throw new Error("Invalid parameters: first parameter must be string or object");
  } catch (i) {
    throw t.error("Failed to create chessboard instance", { error: i }), i;
  }
}
class He extends pe {
  /**
   * Creates a new ChessboardWrapper instance
   * @param {string|Object} containerElm - Container element ID or configuration object
   * @param {Object} [config={}] - Configuration options
   */
  constructor(e, t = {}) {
    const i = v.child("ChessboardWrapper");
    try {
      if (typeof e == "object" && e !== null)
        i.debug("Initializing with config object"), super(e);
      else if (typeof e == "string") {
        i.debug("Initializing with element ID", { elementId: e });
        const s = { ...t, id: e };
        super(s);
      } else
        throw new Error("Invalid constructor parameters");
    } catch (s) {
      throw i.error("Failed to initialize ChessboardWrapper", { error: s }), s;
    }
  }
}
D.create = It;
D.fromTemplate = Tt;
D.factory = B;
D.getInstance = (a) => B.getInstance(a);
D.destroyInstance = (a) => B.destroy(a);
D.destroyAll = () => B.destroyAll();
D.listInstances = () => B.listInstances();
D.registerTemplate = (a, e) => B.registerTemplate(a, e);
D.removeTemplate = (a) => B.removeTemplate(a);
D.getTemplate = (a) => B.getTemplate(a);
D.listTemplates = () => B.listTemplates();
D.getStats = () => B.getStats();
D.Class = He;
D.Chessboard = He;
D.Config = Be;
D.Factory = ze;
function Rt(a) {
  const e = a.charCodeAt(0) - 97;
  return { row: 7 - (parseInt(a[1]) - 1), col: e };
}
function Zt(a, e) {
  const t = String.fromCharCode(97 + e), i = (8 - a).toString();
  return t + i;
}
function ei(a) {
  const { row: e, col: t } = Rt(a);
  return (e + t) % 2 === 0 ? "dark" : "light";
}
function ti(a, e) {
  return a >= 0 && a <= 7 && e >= 0 && e <= 7;
}
function At(a) {
  if (typeof a != "string" || a.length !== 2) return !1;
  const e = a[0], t = a[1];
  return e >= "a" && e <= "h" && t >= "1" && t <= "8";
}
const Te = At, j = /* @__PURE__ */ new Map(), Ke = 1e3;
function G(a, e) {
  if (j.size >= Ke) {
    const t = j.keys().next().value;
    j.delete(t);
  }
  j.set(a, e);
}
function Ue(a) {
  if (typeof a != "string" || a.length !== 2)
    return !1;
  const e = `piece:${a}`;
  if (j.has(e))
    return j.get(e);
  const t = a[0], i = a[1], s = ["w", "b"].includes(t) && ["P", "R", "N", "B", "Q", "K"].includes(i);
  return G(e, s), s;
}
function We(a) {
  if (typeof a != "object" || a === null)
    return !1;
  try {
    JSON.stringify(a);
  } catch {
    return !1;
  }
  for (const [e, t] of Object.entries(a))
    if (!Te(e) || !Ue(t))
      return !1;
  return Mt(a);
}
function Mt(a) {
  const e = Object.values(a), t = e.filter((o) => o === "wK").length, i = e.filter((o) => o === "bK").length;
  if (t !== 1 || i !== 1)
    return !1;
  const s = e.filter((o) => o === "wP").length, n = e.filter((o) => o === "bP").length;
  if (s > 8 || n > 8)
    return !1;
  for (const [o, r] of Object.entries(a))
    if (r === "wP" || r === "bP") {
      const l = o[1];
      if (l === "1" || l === "8")
        return !1;
    }
  return !0;
}
function Ot(a) {
  if (typeof a != "string")
    return { success: !1, error: "FEN must be a string" };
  const e = `fen:${a}`;
  if (j.has(e))
    return j.get(e);
  const t = a.trim().split(" ");
  if (t.length !== 6) {
    const r = { success: !1, error: "FEN must have 6 parts separated by spaces" };
    return G(e, r), r;
  }
  const i = t[0].split("/");
  if (i.length !== 8) {
    const r = { success: !1, error: "Piece placement must have 8 ranks" };
    return G(e, r), r;
  }
  for (let r = 0; r < i.length; r++) {
    const l = qt(i[r]);
    if (!l.success) {
      const c = { success: !1, error: `Invalid rank ${r + 1}: ${l.error}` };
      return G(e, c), c;
    }
  }
  if (!["w", "b"].includes(t[1])) {
    const r = { success: !1, error: 'Active color must be "w" or "b"' };
    return G(e, r), r;
  }
  if (!/^[KQkq-]*$/.test(t[2])) {
    const r = { success: !1, error: "Invalid castling availability" };
    return G(e, r), r;
  }
  if (t[3] !== "-" && !Te(t[3])) {
    const r = { success: !1, error: "Invalid en passant target square" };
    return G(e, r), r;
  }
  const s = parseInt(t[4], 10);
  if (isNaN(s) || s < 0) {
    const r = { success: !1, error: "Invalid halfmove clock" };
    return G(e, r), r;
  }
  const n = parseInt(t[5], 10);
  if (isNaN(n) || n < 1) {
    const r = { success: !1, error: "Invalid fullmove number" };
    return G(e, r), r;
  }
  const o = { success: !0 };
  return G(e, o), o;
}
function qt(a) {
  if (typeof a != "string")
    return { success: !1, error: "Rank must be a string" };
  let e = 0;
  for (let t = 0; t < a.length; t++) {
    const i = a[t];
    if (/[1-8]/.test(i))
      e += parseInt(i, 10);
    else if (/[prnbqkPRNBQK]/.test(i))
      e += 1;
    else
      return { success: !1, error: `Invalid character "${i}" in rank` };
  }
  return e !== 8 ? { success: !1, error: `Rank must represent exactly 8 squares, got ${e}` } : { success: !0 };
}
function Lt(a) {
  if (typeof a != "string")
    return { success: !1, error: "Move must be a string" };
  const e = a.trim();
  return e.length === 0 ? { success: !1, error: "Move cannot be empty" } : e === "O-O" || e === "O-O-O" ? { success: !0, type: "castling" } : /^[a-h][1-8][a-h][1-8][qrnbQRNB]?$/.test(e) ? { success: !0, type: "coordinate" } : /^[PRNBQK]?[a-h]?[1-8]?x?[a-h][1-8](\+|#)?$/.test(e) ? { success: !0, type: "algebraic" } : { success: !1, error: "Invalid move format" };
}
function Dt(a) {
  const e = [];
  if (!a || typeof a != "object")
    return { success: !1, errors: ["Configuration must be an object"] };
  !a.id && !a.id_div && e.push('Configuration must include "id" or "id_div"'), a.orientation && !["white", "black", "w", "b"].includes(a.orientation) && e.push('Invalid orientation. Must be "white", "black", "w", or "b"'), a.position && a.position !== "start" && typeof a.position != "object" && e.push('Invalid position. Must be "start" or a position object'), a.position && typeof a.position == "object" && !We(a.position) && e.push("Invalid position object format"), a.size && !$t(a.size) && e.push('Invalid size. Must be "auto", a positive number, or a valid CSS size'), a.movableColors && !["white", "black", "w", "b", "both", "none"].includes(a.movableColors) && e.push('Invalid movableColors. Must be "white", "black", "w", "b", "both", or "none"'), a.dropOffBoard && !["snapback", "trash"].includes(a.dropOffBoard) && e.push('Invalid dropOffBoard. Must be "snapback" or "trash"');
  const t = ["onMove", "onMoveEnd", "onChange", "onDragStart", "onDragMove", "onDrop", "onSnapbackEnd"];
  for (const s of t)
    a[s] && typeof a[s] != "function" && e.push(`Invalid ${s}. Must be a function`);
  const i = ["whiteSquare", "blackSquare", "highlight", "hintColor"];
  for (const s of i)
    a[s] && !Ft(a[s]) && e.push(`Invalid ${s}. Must be a valid CSS color`);
  return a.moveAnimation && !Nt(a.moveAnimation) && e.push("Invalid moveAnimation. Must be a valid easing function"), a.animationStyle && !["sequential", "simultaneous"].includes(a.animationStyle) && e.push('Invalid animationStyle. Must be "sequential" or "simultaneous"'), {
    success: e.length === 0,
    errors: e
  };
}
function $t(a) {
  return a === "auto" ? !0 : typeof a == "number" ? a > 0 && a <= 5e3 : typeof a == "string" ? /^\d+(px|em|rem|%|vh|vw)$/.test(a) : !1;
}
function Ft(a) {
  return typeof a != "string" ? !1 : /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(a) || /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[0-1](\.\d+)?)?\s*\)$/.test(a) || /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[0-1](\.\d+)?)?\s*\)$/.test(a) ? !0 : [
    "white",
    "black",
    "red",
    "green",
    "blue",
    "yellow",
    "cyan",
    "magenta",
    "transparent",
    "gray",
    "grey",
    "brown",
    "orange",
    "purple",
    "pink"
  ].includes(a.toLowerCase());
}
function Nt(a) {
  return [
    "linear",
    "ease",
    "ease-in",
    "ease-out",
    "ease-in-out",
    "cubic-bezier"
  ].includes(a) || /^cubic-bezier\(\s*[\d.-]+\s*,\s*[\d.-]+\s*,\s*[\d.-]+\s*,\s*[\d.-]+\s*\)$/.test(a);
}
function ii(a) {
  return a.map((e) => {
    const { type: t, value: i } = e;
    switch (t) {
      case "piece":
        return { ...e, valid: Ue(i) };
      case "square":
        return { ...e, valid: Te(i) };
      case "position":
        return { ...e, valid: We(i) };
      case "fen": {
        const s = Ot(i);
        return { ...e, valid: s.success, error: s.error };
      }
      case "move": {
        const s = Lt(i);
        return { ...e, valid: s.success, error: s.error };
      }
      case "config": {
        const s = Dt(i);
        return { ...e, valid: s.success, errors: s.errors };
      }
      default:
        return { ...e, valid: !1, error: "Unknown validation type" };
    }
  });
}
function si() {
  j.clear();
}
function ni() {
  return {
    size: j.size,
    maxSize: Ke
  };
}
function oi(a) {
  if (typeof a == "number") return a;
  switch (a) {
    case "fast":
      return 150;
    case "slow":
      return 500;
    default:
      return 200;
  }
}
function ri(a) {
  return ["ease", "ease-in", "ease-out", "ease-in-out", "linear"].includes(a) ? a : "ease";
}
function ai(a) {
  return new Promise((e) => setTimeout(e, a));
}
/**
 * Chessboard.js - A beautiful, customizable chessboard widget
 * Main entry point for the library
 * 
 * @version 2.2.1
 * @author alepot55
 * @license ISC
 */
const xt = "2.2.1", Bt = process.env.BUILD_NUMBER || "dev", Vt = process.env.BUILD_DATE || (/* @__PURE__ */ new Date()).toISOString(), li = {
  name: "Chessboard.js",
  version: xt,
  build: Bt,
  buildDate: Vt,
  author: "alepot55",
  license: "ISC",
  repository: "https://github.com/alepot55/Chessboardjs",
  homepage: "https://chessboardjs.com"
};
export {
  rt as AnimationService,
  he as BOARD_LETTERS,
  Me as BOARD_SIZE,
  at as BoardService,
  Et as Chess,
  D as Chessboard,
  Be as ChessboardConfig,
  z as ChessboardError,
  ze as ChessboardFactory,
  L as ConfigurationError,
  lt as CoordinateService,
  Ze as DEFAULT_STARTING_POSITION,
  tt as DOMError,
  ut as EventService,
  Z as LOG_LEVELS,
  ve as Logger,
  W as Move,
  Oe as MoveError,
  dt as MoveService,
  me as PIECE_COLORS,
  fe as PIECE_TYPES,
  et as PROMOTION_PIECES,
  Ve as PerformanceMonitor,
  ge as Piece,
  Se as PieceError,
  ft as PieceService,
  kt as PositionService,
  Ae as STANDARD_POSITIONS,
  Ee as Square,
  k as ValidationError,
  Ie as ValidationService,
  Rt as algebraicToCoords,
  ai as animationPromise,
  Wt as batchDOMOperations,
  ii as batchValidate,
  Bt as build,
  Vt as buildDate,
  B as chessboardFactory,
  si as clearValidationCache,
  Zt as coordsToAlgebraic,
  It as createChessboard,
  Tt as createChessboardFromTemplate,
  Jt as createLogger,
  Ht as debounce,
  D as default,
  Yt as getMemoryUsage,
  ei as getSquareColor,
  ni as getValidationCacheStats,
  li as info,
  Qt as isElementVisible,
  ti as isValidCoords,
  Ue as isValidPiece,
  We as isValidPosition,
  At as isValidSquare,
  v as logger,
  ri as parseAnimation,
  oi as parseTime,
  De as rafThrottle,
  Ut as resetTransform,
  Kt as setTransform,
  zt as throttle,
  Dt as validateConfig,
  je as validateFen,
  Ot as validateFenFormat,
  Lt as validateMove,
  xt as version
};
//# sourceMappingURL=chessboard.esm.js.map
