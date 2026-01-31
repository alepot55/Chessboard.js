var ht = Object.defineProperty;
var lt = (a, e, t) => e in a ? ht(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var y = (a, e, t) => lt(a, typeof e != "symbol" ? e + "" : e, t);
const Ve = {
  start: "start",
  default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  empty: "8/8/8/8/8/8/8/8 w - - 0 1"
}, ut = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", Se = ["p", "r", "n", "b", "q", "k"], ye = ["w", "b"], dt = ["q", "r", "b", "n"], _e = "abcdefgh", Ue = {
  ROWS: 8,
  COLS: 8,
  TOTAL_SQUARES: 64
}, A = Object.freeze({
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
}), P = Object.freeze({
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
}), B = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
});
Object.freeze({
  [A.VALIDATION_ERROR]: B.MEDIUM,
  [A.CONFIG_ERROR]: B.HIGH,
  [A.MOVE_ERROR]: B.LOW,
  [A.DOM_ERROR]: B.HIGH,
  [A.ANIMATION_ERROR]: B.LOW,
  [A.PIECE_ERROR]: B.MEDIUM,
  [A.INITIALIZATION_ERROR]: B.CRITICAL,
  [A.POSITION_ERROR]: B.MEDIUM,
  [A.FEN_ERROR]: B.MEDIUM,
  [A.SQUARE_ERROR]: B.MEDIUM,
  [A.THEME_ERROR]: B.LOW,
  [A.NETWORK_ERROR]: B.MEDIUM
});
class U extends Error {
  /**
   * Creates a new ChessboardError instance
   * @param {string} message - Error message
   * @param {string} code - Error code from ERROR_CODES
   * @param {Object} [context={}] - Additional context information
   */
  constructor(e, t, i = {}) {
    super(e), this.name = "ChessboardError", this.code = t, this.context = i, this.timestamp = (/* @__PURE__ */ new Date()).toISOString(), Error.captureStackTrace && Error.captureStackTrace(this, U);
  }
}
class C extends U {
  /**
   * Creates a new ValidationError instance
   * @param {string} message - Error message
   * @param {string} field - Field that failed validation
   * @param {*} value - Value that failed validation
   */
  constructor(e, t, i) {
    super(e, A.VALIDATION_ERROR, { field: t, value: i }), this.name = "ValidationError", this.field = t, this.value = i;
  }
}
class O extends U {
  /**
   * Creates a new ConfigurationError instance
   * @param {string} message - Error message
   * @param {string} configKey - Configuration key that is invalid
   * @param {*} configValue - Configuration value that is invalid
   */
  constructor(e, t, i) {
    super(e, A.CONFIG_ERROR, { configKey: t, configValue: i }), this.name = "ConfigurationError", this.configKey = t, this.configValue = i;
  }
}
class He extends U {
  /**
   * Creates a new MoveError instance
   * @param {string} message - Error message
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {string} [piece] - Piece being moved
   */
  constructor(e, t, i, s) {
    super(e, A.MOVE_ERROR, { from: t, to: i, piece: s }), this.name = "MoveError", this.from = t, this.to = i, this.piece = s;
  }
}
class ft extends U {
  /**
   * Creates a new DOMError instance
   * @param {string} message - Error message
   * @param {string} elementId - Element ID that caused the error
   */
  constructor(e, t) {
    super(e, A.DOM_ERROR, { elementId: t }), this.name = "DOMError", this.elementId = t;
  }
}
class Me extends U {
  /**
   * Creates a new PieceError instance
   * @param {string} message - Error message
   * @param {string} pieceId - Piece ID that caused the error
   * @param {string} [square] - Square where the error occurred
   */
  constructor(e, t, i) {
    super(e, A.PIECE_ERROR, { pieceId: t, square: i }), this.name = "PieceError", this.pieceId = t, this.square = i;
  }
}
const mt = Object.freeze({
  square: /^[a-h][1-8]$/,
  piece: /^[prnbqkPRNBQK][wb]$/,
  fen: /^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+\s[wb]\s[KQkq-]+\s[a-h1-8-]+\s\d+\s\d+$/,
  move: /^[a-h][1-8][a-h][1-8][qrnb]?$/,
  color: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
}), gt = Object.freeze({
  orientations: ["w", "b", "white", "black"],
  colors: ["w", "b", "white", "black"],
  movableColors: ["w", "b", "white", "black", "both", "none"],
  dropOffBoard: ["snapback", "trash"],
  easingTypes: ["linear", "ease", "ease-in", "ease-out", "ease-in-out"],
  animationStyles: ["sequential", "simultaneous"],
  modes: ["normal", "creative", "analysis"],
  promotionPieces: ["q", "r", "b", "n", "Q", "R", "B", "N"]
}), pt = Object.freeze({
  min: 50,
  max: 2e3,
  maxTime: 1e4,
  maxDelay: 5e3
});
class Ge {
  /**
   * Creates a new ValidationService instance
   */
  constructor() {
    this._validationCache = /* @__PURE__ */ new Map(), this._cacheMaxSize = 1e3, this._patterns = mt, this._validValues = gt, this._constraints = pt;
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
    const [i, s] = e.split(""), n = Se.includes(i.toLowerCase()) && ye.includes(s), r = ye.includes(i) && Se.includes(s.toLowerCase()), o = n || r;
    return this._cacheValidationResult(t, o), o;
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
    for (const r of i)
      if (!this._validateRank(r))
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
      throw new C(P.invalid_square + e, "square", e);
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
      throw new C(P.invalid_piece + e, "piece", e);
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
      throw new C(P.invalid_fen + e, "fen", e);
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
      throw new C(P.invalid_move + e, "move", e);
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
      throw new C(
        P.invalid_orientation + e,
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
      throw new C(P.invalid_color + e, "color", e);
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
      throw new C(P.invalid_size + e, "size", e);
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
      throw new C("Configuration must be an object", "config", e);
    const t = [];
    !e.id && !e.id_div && t.push("Configuration must include id or id_div"), e.orientation && !this.isValidOrientation(e.orientation) && t.push(P.invalid_orientation + e.orientation), e.size && !this.isValidSize(e.size) && t.push(P.invalid_size + e.size), e.movableColors && !this.isValidMovableColors(e.movableColors) && t.push(P.invalid_color + e.movableColors), e.dropOffBoard && !this.isValidDropOffBoard(e.dropOffBoard) && t.push(P.invalid_dropOffBoard + e.dropOffBoard), e.animationStyle && !this.isValidAnimationStyle(e.animationStyle) && t.push(P.invalid_animationStyle + e.animationStyle);
    const i = [
      "onMove",
      "onMoveEnd",
      "onChange",
      "onDragStart",
      "onDragMove",
      "onDrop",
      "onSnapbackEnd"
    ];
    for (const n of i)
      e[n] && !this.isValidCallback(e[n]) && t.push(`Invalid ${n} callback`);
    const s = ["whiteSquare", "blackSquare", "highlight", "hintColor"];
    for (const n of s)
      e[n] && !this.isValidCSSColor(e[n]) && t.push(`Invalid ${n} color: ${e[n]}`);
    if (t.length > 0)
      throw new C(
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
const Ke = Object.freeze({
  fast: 200,
  slow: 600,
  normal: 400,
  verySlow: 1e3,
  veryFast: 100
}), We = Object.freeze({
  true: !0,
  false: !1,
  none: !1,
  1: !0,
  0: !1
}), ke = Object.freeze({
  ease: "ease",
  linear: "linear",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  none: null
}), vt = Object.freeze({
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
class et {
  /**
   * Creates a new ChessboardConfig instance
   * @param {Object} settings - User-provided configuration
   * @throws {ConfigurationError} If configuration is invalid
   */
  constructor(e = {}) {
    this._validationService = new Ge(), this._validateInput(e);
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
      throw new O("Settings must be an object", "settings", e);
    try {
      this._validationService.validateConfig(e);
    } catch (t) {
      throw new O(t.message, t.field, t.value);
    }
  }
  /**
   * Merges user settings with defaults
   * @private
   * @param {Object} settings - User settings
   * @returns {Object} Merged configuration
   */
  _mergeWithDefaults(e) {
    return Object.assign({}, vt, e);
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
      throw new O("Callback must be a function", "callback", e);
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
      throw new O("Invalid animation style", "animationStyle", e);
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
      throw new O("Invalid animation delay", "simultaneousAnimationDelay", e);
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
        throw new O("Invalid time value", "time", e);
      return e;
    }
    if (typeof e == "string" && e in Ke)
      return Ke[e];
    throw new O("Invalid time value", "time", e);
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
    if (e in We)
      return We[e];
    throw new O("Invalid boolean value", "boolean", e);
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
      return e ? ke.ease : null;
    if (typeof e == "string" && e in ke)
      return ke[e];
    if (e == null)
      return null;
    throw new O("Invalid transition function", "transitionFunction", e);
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
      throw new O("Updates must be an object", "updates", e);
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
class qe {
  constructor(e, t, i, s = 1) {
    this.color = e, this.type = t, this.id = this.getId(), this.src = i, this.element = this.createElement(i, s), this._currentAnimation = null, this.check();
  }
  getId() {
    return this.color + this.type;
  }
  createElement(e, t = 1) {
    const i = document.createElement("img");
    return i.classList.add("piece"), i.id = this.id, i.src = e || this.src, i.style.opacity = t, i.draggable = !1, i.onerror = () => {
      console.warn("Failed to load piece image:", i.src);
    }, i;
  }
  visible() {
    this.element && (this.element.style.opacity = 1);
  }
  invisible() {
    this.element && (this.element.style.opacity = 0);
  }
  updateSrc(e) {
    this.src = e, this.element && (this.element.src = e);
  }
  /**
   * Transforms the piece to a new type with smooth animation
   */
  transformTo(e, t, i = 200, s = null) {
    if (!this.element) {
      s && s();
      return;
    }
    const n = this.element;
    n.classList.add("transforming");
    const r = i / 2, o = n.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(0.7)", opacity: 0.5 }
      ],
      { duration: r, easing: "ease-in", fill: "forwards" }
    );
    o.onfinish = () => {
      if (!this.element) {
        s && s();
        return;
      }
      this.type = e, this.id = this.getId(), this.src = t, n.src = t, n.id = this.id;
      const c = n.animate(
        [
          { transform: "scale(0.7)", opacity: 0.5 },
          { transform: "scale(1)", opacity: 1 }
        ],
        { duration: r, easing: "ease-out", fill: "forwards" }
      );
      c.onfinish = () => {
        if (!this.element) {
          s && s();
          return;
        }
        o.cancel(), c.cancel(), n.style.transform = "", n.style.opacity = "", n.classList.remove("transforming"), s && s();
      };
    };
  }
  fadeIn(e, t, i, s) {
    if (!this.element) {
      s && s();
      return;
    }
    const n = performance.now(), r = () => {
      if (!this.element) {
        s && s();
        return;
      }
      const o = performance.now() - n, c = Math.min(o / e, 1);
      this.element.style.opacity = c, c < 1 ? requestAnimationFrame(r) : (this.element.style.opacity = 1, s && s());
    };
    r();
  }
  fadeOut(e, t, i, s) {
    if (!this.element) {
      s && s();
      return;
    }
    const n = performance.now(), r = () => {
      if (!this.element) {
        s && s();
        return;
      }
      const o = performance.now() - n, c = Math.min(o / e, 1);
      this.element.style.opacity = 1 - c, c < 1 ? requestAnimationFrame(r) : (this.element.style.opacity = 0, s && s());
    };
    r();
  }
  setDrag(e) {
    this.element && (this._dragHandler && (this.element.removeEventListener("mousedown", this._dragHandler), this.element.removeEventListener("touchstart", this._dragHandler)), this.element.ondragstart = (t) => t.preventDefault(), this._dragHandler = e, this.element.addEventListener("mousedown", this._dragHandler), this.element.addEventListener("touchstart", this._dragHandler, { passive: !1 }));
  }
  destroy() {
    this._currentAnimation && (this._currentAnimation.cancel(), this._currentAnimation = null), this.element && (this._dragHandler && (this.element.removeEventListener("mousedown", this._dragHandler), this.element.removeEventListener("touchstart", this._dragHandler), this._dragHandler = null), this.element.onmousedown = null, this.element.ondragstart = null, this.element.parentNode && this.element.parentNode.removeChild(this.element), this.element = null);
  }
  /**
   * Animate piece translation to target square
   * Uses Web Animations API for smooth, precise animations
   */
  translate(e, t, i, s, n = null) {
    if (!this.element || !e) {
      n && n();
      return;
    }
    if (this._currentAnimation && (this._currentAnimation.cancel(), this._currentAnimation = null), t <= 0) {
      n && n();
      return;
    }
    const r = this.element.getBoundingClientRect(), o = e.element ? e.element.getBoundingClientRect() : e.getBoundingClientRect(), c = o.left + o.width / 2 - (r.left + r.width / 2), h = o.top + o.height / 2 - (r.top + r.height / 2);
    if (Math.abs(c) < 1 && Math.abs(h) < 1) {
      n && n();
      return;
    }
    const l = this.element.animate(
      [{ transform: "translate(0, 0)" }, { transform: `translate(${c}px, ${h}px)` }],
      {
        duration: t,
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        // Smooth easing
        fill: "forwards"
        // Keep final position until we clean up
      }
    );
    this._currentAnimation = l, l.onfinish = () => {
      if (!this.element) {
        n && n();
        return;
      }
      n && n(), requestAnimationFrame(() => {
        this._currentAnimation === l && (l.cancel(), this._currentAnimation = null), this.element && (this.element.style.transform = "");
      });
    }, l.oncancel = () => {
      this._currentAnimation === l && (this._currentAnimation = null);
    };
  }
  check() {
    if (!["p", "r", "n", "b", "q", "k"].includes(this.type))
      throw new Error(`Invalid piece type: ${this.type}`);
    if (!["w", "b"].includes(this.color))
      throw new Error(`Invalid piece color: ${this.color}`);
  }
}
class De {
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
let Z = class {
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
    return !(this.piece === null || !(this.piece instanceof qe) || ["q", "r", "b", "n", null].indexOf(this.promotion) === -1 || !(this.from instanceof De) || !(this.to instanceof De) || !this.to || !this.from || this.from === this.to);
  }
  isLegal(e) {
    return e.moves({ square: this.from.id, verbose: !0 }).map((i) => i.to).indexOf(this.to.id) !== -1;
  }
};
class _t {
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
    const r = ++this.animationId, o = this.createTimingFunction(s), c = performance.now(), h = {};
    Object.keys(t).forEach((d) => {
      h[d] = this._getInitialValue(e, d);
    });
    const l = (d) => {
      const u = d - c, g = Math.min(u / i, 1), f = o(u, i);
      Object.keys(t).forEach((p) => {
        const b = h[p], w = t[p], S = this._interpolateValue(b, w, f);
        this._applyValue(e, p, S);
      }), g < 1 && this.activeAnimations.has(r) ? requestAnimationFrame(l) : (this.activeAnimations.delete(r), n && n());
    };
    return this.activeAnimations.set(r, { element: e, animate: l, callback: n }), requestAnimationFrame(l), r;
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
class bt {
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
    if (this.element = document.getElementById(this.config.id_div), !this.element)
      throw new ft(P.invalid_id_div + this.config.id_div, this.config.id_div);
    this.resize(this.config.size), this.element.className = "board";
  }
  /**
   * Creates all 64 squares and adds them to the board
   * @param {Function} coordConverter - Function to convert row/col to real coordinates
   */
  buildSquares(e) {
    for (let t = 0; t < Ue.ROWS; t++)
      for (let i = 0; i < Ue.COLS; i++) {
        const [s, n] = e(t, i), r = new De(s, n);
        this.squares[r.getId()] = r, this.element.appendChild(r.element);
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
        throw new C(P.invalid_value + e, "size", e);
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
class St {
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
      throw new C(
        `Invalid board coordinates: row=${e}, col=${t}`,
        "coordinates",
        { row: e, col: t }
      );
    return _e[t - 1] + e;
  }
  /**
   * Converts square ID to board coordinates
   * @param {string} squareId - Square ID (e.g., 'e4')
   * @returns {Array<number>} Board coordinates [row, col] (0-7)
   */
  getCoordinatesFromSquareID(e) {
    if (typeof e != "string" || e.length !== 2)
      throw new C(P.invalid_square + e, "squareId", e);
    const t = e[0], i = parseInt(e[1]), s = _e.indexOf(t);
    if (s === -1)
      throw new C(P.invalid_square + e, "squareId", e);
    if (i < 1 || i > 8)
      throw new C(P.invalid_square + e, "squareId", e);
    let n, r;
    return this.isWhiteOriented() ? (n = 8 - i, r = s) : (n = i - 1, r = 7 - s), [n, r];
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
    const s = i.getBoundingClientRect(), { width: n, height: r } = s;
    if (e < 0 || e >= n || t < 0 || t >= r)
      return null;
    const o = n / 8, c = r / 8, h = Math.floor(e / o), l = Math.floor(t / c);
    try {
      return this.getSquareID(l, h);
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
      const [i, s] = this.getCoordinatesFromSquareID(e), n = t.getBoundingClientRect(), { width: r, height: o } = n, c = r / 8, h = o / 8, l = s * c, d = i * h;
      return { x: l, y: d };
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
    const s = t.getBoundingClientRect(), n = s.width / 8, r = s.height / 8;
    return {
      x: i.x + n / 2,
      y: i.y + r / 2
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
      const [i, s] = this.getCoordinatesFromSquareID(e), [n, r] = this.getCoordinatesFromSquareID(t), o = Math.abs(n - i), c = Math.abs(r - s);
      return Math.sqrt(o * o + c * c);
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
      throw new C(
        `${P.invalid_orientation}${e}`,
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
      throw new C(`Invalid rank: ${e}`, "rank", e);
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
    const t = _e.indexOf(e);
    if (t === -1)
      throw new C(`Invalid file: ${e}`, "file", e);
    const i = [];
    for (let s = 0; s < 8; s++)
      i.push(this.getSquareID(s, t));
    return i;
  }
}
function yt() {
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
const le = {
  /**
   * Apply browser-specific optimizations to an element
   * @param {HTMLElement} element - Element to optimize
   */
  enableForDrag(a) {
    const e = yt();
    a.style.willChange = "left, top", a.style.pointerEvents = "none", e.isChrome && (a.style.transform = "translateZ(0)"), e.isFirefox && (a.style.backfaceVisibility = "hidden");
  },
  /**
   * Clean up optimizations after drag
   * @param {HTMLElement} element - Element to clean up
   */
  cleanupAfterDrag(a) {
    a.style.willChange = "auto", a.style.pointerEvents = "", a.style.transform = "", a.style.backfaceVisibility = "";
  }
};
class wt {
  /**
   * Creates a new EventService instance
   * @param {ChessboardConfig} config - Board configuration
   * @param {BoardService} boardService - Board service instance
   * @param {MoveService} moveService - Move service instance
   * @param {CoordinateService} coordinateService - Coordinate service instance
   * @param {Chessboard} chessboard - Chessboard instance
   */
  constructor(e, t, i, s, n) {
    this.config = e, this.boardService = t, this.moveService = i, this.coordinateService = s, this.chessboard = n, this.selectedSquare = null, this.isDragging = !1, this.isProcessing = !1, this.eventListeners = /* @__PURE__ */ new Map();
  }
  /**
   * Adds event listeners to all squares
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
   */
  _addSquareListeners(e, t, i, s) {
    const n = [], r = () => {
      !this.selectedSquare && this.config.hints && e.piece && i(e);
    }, o = () => {
      !this.selectedSquare && this.config.hints && s(e);
    }, c = (h) => {
      h.stopPropagation(), this.config.clickable && !this.isProcessing && !this.isDragging && t(e);
    };
    e.element.addEventListener("mouseenter", r), e.element.addEventListener("mouseleave", o), e.element.addEventListener("click", c), n.push(
      { element: e.element, type: "mouseenter", handler: r },
      { element: e.element, type: "mouseleave", handler: o },
      { element: e.element, type: "click", handler: c }
    ), this.eventListeners.set(e.id, n);
  }
  /**
   * Creates a drag function for a piece
   */
  createDragFunction(e, t, i, s, n, r, o, c) {
    return (h) => {
      var m, E, k, L;
      if (h.preventDefault(), h.stopPropagation(), !this.config.draggable || !t || this.isProcessing || this.isDragging || !this.moveService.canMove(e))
        return;
      const l = t.element, d = h.clientX || ((E = (m = h.touches) == null ? void 0 : m[0]) == null ? void 0 : E.clientX) || 0, u = h.clientY || ((L = (k = h.touches) == null ? void 0 : k[0]) == null ? void 0 : L.clientY) || 0;
      let g = !1, f = null, p = null;
      const b = (N, F) => {
        const H = this.boardService.element, G = H.getBoundingClientRect(), se = G.width / 8, me = N - G.left - se / 2, ge = F - G.top - se / 2;
        l.style.left = `${me}px`, l.style.top = `${ge}px`;
        const ne = N - G.left, re = F - G.top;
        if (ne >= 0 && ne <= G.width && re >= 0 && re <= G.height) {
          const oe = this.coordinateService.pixelToSquareID(ne, re, H);
          f = oe ? this.boardService.getSquare(oe) : null;
        } else
          f = null;
        f !== p && (p == null || p.dehighlight(), f == null || f.highlight(), p = f);
      }, w = (N) => {
        var G, se, me, ge;
        const F = N.clientX || ((se = (G = N.touches) == null ? void 0 : G[0]) == null ? void 0 : se.clientX) || 0, H = N.clientY || ((ge = (me = N.touches) == null ? void 0 : me[0]) == null ? void 0 : ge.clientY) || 0;
        if (!g) {
          const ne = Math.abs(F - d), re = Math.abs(H - u);
          if (ne > 3 || re > 3) {
            g = !0, this.isDragging = !0, e.select();
            const oe = window.getComputedStyle(l);
            l.style.position = "absolute", l.style.zIndex = "100", l.style.width = oe.width, l.style.height = oe.height, l.classList.add("dragging"), le.enableForDrag(l), i(e, t);
          }
        }
        g && (b(F, H), s(e, f, t));
      }, S = () => {
        if (document.removeEventListener("mousemove", w), document.removeEventListener("touchmove", w), window.removeEventListener("mouseup", S), window.removeEventListener("touchend", S), p == null || p.dehighlight(), !g) {
          this.isDragging = !1;
          return;
        }
        this.isDragging = !1;
        const N = n(e, f, t);
        if (!f) {
          l.classList.remove("dragging"), l.style.zIndex = "", l.style.willChange = "auto", le.cleanupAfterDrag(l), this.config.dropOffBoard === "trash" || N === "trash" ? (this._resetPiecePosition(l), c(e)) : (this._resetPiecePosition(l), r(e, t)), e.deselect(), this.boardService.applyToAllSquares("removeHint");
          return;
        }
        this._handleMove(e, f, t, o, r);
      };
      document.addEventListener("mousemove", w), document.addEventListener("touchmove", w, { passive: !1 }), window.addEventListener("mouseup", S), window.addEventListener("touchend", S);
    };
  }
  /**
   * Resets piece position after failed drag
   * @private
   */
  _resetPiecePosition(e) {
    e && (e.style.position = "", e.style.left = "", e.style.top = "", e.style.transform = "", e.style.width = "", e.style.height = "", e.style.zIndex = "", e.classList.remove("dragging"), le.cleanupAfterDrag(e));
  }
  /**
   * Handles a move attempt (from drag or click)
   * @private
   */
  _handleMove(e, t, i, s, n) {
    if (this.isProcessing) return;
    this.isProcessing = !0;
    const r = () => {
      this.isProcessing = !1, this.selectedSquare = null, e.deselect(), this.boardService.applyToAllSquares("removeHint");
    }, o = new Z(e, t);
    if (this.moveService.requiresPromotion(o)) {
      this._handlePromotion(e, t, i, s, n, r);
      return;
    }
    s(e, t, null, !0) || (this._resetPiecePosition(i.element), n(e, i)), r();
  }
  /**
   * Handles promotion move
   * @private
   */
  _handlePromotion(e, t, i, s, n, r) {
    this.moveService.setupPromotion(
      new Z(e, t),
      this.boardService.squares,
      (o) => {
        this.boardService.applyToAllSquares("removePromotion"), this.boardService.applyToAllSquares("removeCover"), s(e, t, o, !0) || (this._resetPiecePosition(i.element), n(e, i)), r();
      },
      () => {
        this.boardService.applyToAllSquares("removePromotion"), this.boardService.applyToAllSquares("removeCover"), this._resetPiecePosition(i.element), n(e, i), r();
      }
    );
  }
  /**
   * Handles square click events
   */
  onClick(e, t, i, s, n = !0) {
    if (this.isProcessing || this.isDragging)
      return !1;
    if (!this.selectedSquare)
      return this.moveService.canMove(e) && (this.selectedSquare = e, i(e)), !1;
    if (this.selectedSquare === e)
      return s(e), this.selectedSquare = null, !1;
    const r = this.selectedSquare, o = new Z(r, e);
    return this.moveService.requiresPromotion(o) ? (this._handlePromotion(
      r,
      e,
      r.piece,
      t,
      () => {
      },
      // No snapback needed for click moves
      () => {
        s(r), this.selectedSquare = null;
      }
    ), !1) : t(r, e, null, n) ? (s(r), this.selectedSquare = null, !0) : (s(r), this.selectedSquare = null, this.boardService.applyToAllSquares("removeHint"), this.moveService.canMove(e) && (this.selectedSquare = e, i(e)), !1);
  }
  // State management
  setClicked(e) {
    this.selectedSquare = e;
  }
  getClicked() {
    return this.selectedSquare;
  }
  setPromoting(e) {
  }
  getPromoting() {
    return !1;
  }
  setAnimating(e) {
  }
  getAnimating() {
    return this.isProcessing;
  }
  /**
   * Removes all event listeners
   */
  removeListeners() {
    this.eventListeners.forEach((e) => {
      e.forEach(({ element: t, type: i, handler: s }) => {
        t.removeEventListener(i, s);
      });
    }), this.eventListeners.clear();
  }
  removeAllListeners() {
    this.removeListeners();
  }
  /**
   * Cleans up resources
   */
  destroy() {
    this.removeAllListeners(), this.selectedSquare = null, this.isDragging = !1, this.isProcessing = !1;
  }
}
class Pt {
  /**
   * Creates a new MoveService instance
   * @param {ChessboardConfig} config - Board configuration
   * @param {PositionService} positionService - Position service instance
   */
  constructor(e, t) {
    this.config = e, this.positionService = t, this._movesCache = /* @__PURE__ */ new Map(), this._cacheTimeout = null;
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
    if (e instanceof Z)
      return e;
    if (typeof e == "string" && e.length >= 4) {
      const i = e.slice(0, 2), s = e.slice(2, 4), n = e.slice(4, 5) || null;
      if (!t[i] || !t[s])
        throw new He(P.invalid_move_format, i, s);
      return new Z(t[i], t[s], n);
    }
    throw new He(P.invalid_move_format, "unknown", "unknown");
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
    return e.hasPromotion() && (i.promotion = e.promotion), t.move(i);
  }
  /**
   * Checks if a move requires promotion
   * @param {Move} move - Move to check
   * @returns {boolean} True if promotion is required
   */
  requiresPromotion(e) {
    var o;
    if (!this.config.onlyLegalMoves)
      return !1;
    const t = (o = this.positionService) == null ? void 0 : o.getGame();
    if (!t)
      return !1;
    const i = t.get(e.from.id);
    if (!i || i.type !== "p")
      return !1;
    const s = e.to.row;
    return i.color === "w" && s !== 8 || i.color === "b" && s !== 1 ? !1 : !!t.moves({ square: e.from.id, verbose: !0 }).find((c) => c.to === e.to.id);
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
    var c;
    const n = (c = this.positionService) == null ? void 0 : c.getGame();
    if (!n) return !1;
    const r = n.get(e.from.id);
    if (!r) return !1;
    const o = e.to;
    return Object.values(t).forEach((h) => {
      h.removePromotion(), h.removeCover();
    }), this._showPromotionInColumn(o, r, t, i, s), !0;
  }
  /**
   * Shows promotion choices in a column
   * @private
   */
  _showPromotionInColumn(e, t, i, s, n) {
    return dt.forEach((r, o) => {
      const c = this._findPromotionSquare(e, o, i);
      if (c) {
        const h = r + t.color, l = this._getPiecePathForPromotion(h);
        c.putPromotion(l, () => {
          s(r);
        });
      }
    }), Object.values(i).forEach((r) => {
      r.hasPromotion() || r.putCover(() => {
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
    let r;
    if (n === 8)
      r = 8 - t;
    else if (n === 1)
      r = 1 + t;
    else
      return null;
    if (r < 1 || r > 8)
      return null;
    for (const o of Object.values(i))
      if (o.col === s && o.row === r)
        return o;
    return null;
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
class Et {
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
    throw new C(P.invalid_piecesPath, "piecesPath", t);
  }
  /**
   * Converts various piece formats to a Piece instance
   * @param {string|Piece} piece - Piece in various formats
   * @returns {Piece} Piece instance
   * @throws {PieceError} When piece format is invalid
   */
  convertPiece(e) {
    if (e instanceof qe)
      return e;
    if (typeof e == "string" && e.length === 2) {
      const [t, i] = e.split("");
      let s, n;
      if (Se.includes(t.toLowerCase()) && ye.includes(i))
        s = t.toLowerCase(), n = i;
      else if (ye.includes(t) && Se.includes(i.toLowerCase()))
        n = t, s = i.toLowerCase();
      else
        throw new Me(P.invalid_piece + e, e);
      const r = this.getPiecePath(s + n);
      return new qe(n, s, r);
    }
    throw new Me(P.invalid_piece + e, e);
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
    e.putPiece(t), s && t.setDrag(s(e, t)), i && this.config.fadeTime > 0 ? t.fadeIn(
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
    e.check();
    const s = e.piece;
    if (!s)
      throw i && i(), new Me(P.square_no_piece, null, e.getId());
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
    if (!e) {
      s && s();
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
    if (!e.piece) {
      n && n();
      return;
    }
    t && (e.to.deselect(), this.removePieceFromSquare(e.to, !1));
    const r = () => {
      e.from.piece === e.piece && e.from.removePiece(!0), e.to.piece !== e.piece && (e.to.putPiece(e.piece), s && this.config.draggable && e.piece.element && e.piece.setDrag(s(e.to, e.piece))), n && n();
    };
    if (e.piece.element && e.piece.element.classList.contains("dragging")) {
      if (r(), e.piece.element) {
        const c = e.piece.element;
        c.style.position = "", c.style.left = "", c.style.top = "", c.style.transform = "", c.style.zIndex = "", c.style.width = "", c.style.height = "", c.classList.remove("dragging"), le.cleanupAfterDrag(c);
      }
    } else {
      const c = i ? this.config.moveTime : 0;
      this.movePiece(e.piece, e.to, c, r);
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
    i.translate(
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
    i.translate(
      e,
      s,
      this._getTransitionTimingFunction(),
      this.config.dropCenterAnimation,
      () => {
        i.element && (i.element.style.position = "", i.element.style.left = "", i.element.style.top = "", i.element.style.transform = "", i.element.style.zIndex = "", i.element.style.width = "", i.element.style.height = "", i.element.classList.remove("dragging"), le.cleanupAfterDrag(i.element));
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
const I = "w", x = "b", T = "p", Le = "n", be = "b", he = "r", Q = "q", M = "k", Te = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
class pe {
  constructor(e, t) {
    y(this, "color");
    y(this, "from");
    y(this, "to");
    y(this, "piece");
    y(this, "captured");
    y(this, "promotion");
    /**
     * @deprecated This field is deprecated and will be removed in version 2.0.0.
     * Please use move descriptor functions instead: `isCapture`, `isPromotion`,
     * `isEnPassant`, `isKingsideCastle`, `isQueensideCastle`, `isCastle`, and
     * `isBigPawn`
     */
    y(this, "flags");
    y(this, "san");
    y(this, "lan");
    y(this, "before");
    y(this, "after");
    const { color: i, piece: s, from: n, to: r, flags: o, captured: c, promotion: h } = t, l = R(n), d = R(r);
    this.color = i, this.piece = s, this.from = l, this.to = d, this.san = e._moveToSan(t, e._moves({ legal: !0 })), this.lan = l + d, this.before = e.fen(), e._makeMove(t), this.after = e.fen(), e._undoMove(), this.flags = "";
    for (const u in _)
      _[u] & o && (this.flags += Y[u]);
    c && (this.captured = c), h && (this.promotion = h, this.lan += h);
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
const D = -1, Y = {
  NORMAL: "n",
  CAPTURE: "c",
  BIG_PAWN: "b",
  EP_CAPTURE: "e",
  PROMOTION: "p",
  KSIDE_CASTLE: "k",
  QSIDE_CASTLE: "q"
}, _ = {
  NORMAL: 1,
  CAPTURE: 2,
  BIG_PAWN: 4,
  EP_CAPTURE: 8,
  PROMOTION: 16,
  KSIDE_CASTLE: 32,
  QSIDE_CASTLE: 64
}, v = {
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
}, Ae = {
  b: [16, 32, 17, 15],
  w: [-16, -32, -17, -15]
}, Qe = {
  n: [-18, -33, -31, -14, 18, 33, 31, 14],
  b: [-17, -15, 17, 15],
  r: [-16, 1, 16, -1],
  q: [-17, -16, -15, 1, 17, 16, 15, -1],
  k: [-17, -16, -15, 1, 17, 16, 15, -1]
}, Ct = [
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
], Mt = [
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
], kt = { p: 1, n: 2, b: 4, r: 8, q: 16, k: 32 }, Tt = "pnbrqkPNBRQK", Ye = [Le, be, he, Q], At = 7, It = 6, Rt = 1, Ot = 0, ve = {
  [M]: _.KSIDE_CASTLE,
  [Q]: _.QSIDE_CASTLE
}, K = {
  w: [
    { square: v.a1, flag: _.QSIDE_CASTLE },
    { square: v.h1, flag: _.KSIDE_CASTLE }
  ],
  b: [
    { square: v.a8, flag: _.QSIDE_CASTLE },
    { square: v.h8, flag: _.KSIDE_CASTLE }
  ]
}, qt = { b: Rt, w: It }, Dt = ["1-0", "0-1", "1/2-1/2", "*"];
function X(a) {
  return a >> 4;
}
function ue(a) {
  return a & 15;
}
function tt(a) {
  return "0123456789".indexOf(a) !== -1;
}
function R(a) {
  const e = ue(a), t = X(a);
  return "abcdefgh".substring(e, e + 1) + "87654321".substring(t, t + 1);
}
function ae(a) {
  return a === I ? x : I;
}
function it(a) {
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
  for (let r = 0; r < s.length; r++) {
    let o = 0, c = !1;
    for (let h = 0; h < s[r].length; h++)
      if (tt(s[r][h])) {
        if (c)
          return {
            ok: !1,
            error: "Invalid FEN: piece data is invalid (consecutive number)"
          };
        o += parseInt(s[r][h], 10), c = !0;
      } else {
        if (!/^[prnbqkPRNBQK]$/.test(s[r][h]))
          return {
            ok: !1,
            error: "Invalid FEN: piece data is invalid (invalid piece)"
          };
        o += 1, c = !1;
      }
    if (o !== 8)
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
  for (const { color: r, regex: o } of n) {
    if (!o.test(e[0]))
      return { ok: !1, error: `Invalid FEN: missing ${r} king` };
    if ((e[0].match(o) || []).length > 1)
      return { ok: !1, error: `Invalid FEN: too many ${r} kings` };
  }
  return Array.from(s[0] + s[7]).some((r) => r.toUpperCase() === "P") ? {
    ok: !1,
    error: "Invalid FEN: some pawns are on the edge rows"
  } : { ok: !0 };
}
function Lt(a, e) {
  const t = a.from, i = a.to, s = a.piece;
  let n = 0, r = 0, o = 0;
  for (let c = 0, h = e.length; c < h; c++) {
    const l = e[c].from, d = e[c].to, u = e[c].piece;
    s === u && t !== l && i === d && (n++, X(t) === X(l) && r++, ue(t) === ue(l) && o++);
  }
  return n > 0 ? r > 0 && o > 0 ? R(t) : o > 0 ? R(t).charAt(1) : R(t).charAt(0) : "";
}
function W(a, e, t, i, s, n = void 0, r = _.NORMAL) {
  const o = X(i);
  if (s === T && (o === At || o === Ot))
    for (let c = 0; c < Ye.length; c++) {
      const h = Ye[c];
      a.push({
        color: e,
        from: t,
        to: i,
        piece: s,
        captured: n,
        promotion: h,
        flags: r | _.PROMOTION
      });
    }
  else
    a.push({
      color: e,
      from: t,
      to: i,
      piece: s,
      captured: n,
      flags: r
    });
}
function Je(a) {
  let e = a.charAt(0);
  return e >= "a" && e <= "h" ? a.match(/[a-h]\d.*[a-h]\d/) ? void 0 : T : (e = e.toLowerCase(), e === "o" ? M : e);
}
function Ie(a) {
  return a.replace(/=/, "").replace(/[+#]?[?!]*$/, "");
}
function Re(a) {
  return a.split(" ").slice(0, 4).join(" ");
}
class Nt {
  constructor(e = Te) {
    y(this, "_board", new Array(128));
    y(this, "_turn", I);
    y(this, "_header", {});
    y(this, "_kings", { w: D, b: D });
    y(this, "_epSquare", -1);
    y(this, "_halfMoves", 0);
    y(this, "_moveNumber", 0);
    y(this, "_history", []);
    y(this, "_comments", {});
    y(this, "_castling", { w: 0, b: 0 });
    // tracks number of times a position has been seen for repetition checking
    y(this, "_positionCount", {});
    this.load(e);
  }
  clear({ preserveHeaders: e = !1 } = {}) {
    this._board = new Array(128), this._kings = { w: D, b: D }, this._turn = I, this._castling = { w: 0, b: 0 }, this._epSquare = D, this._halfMoves = 0, this._moveNumber = 1, this._history = [], this._comments = {}, this._header = e ? this._header : {}, this._positionCount = {}, delete this._header.SetUp, delete this._header.FEN;
  }
  load(e, { skipValidation: t = !1, preserveHeaders: i = !1 } = {}) {
    let s = e.split(/\s+/);
    if (s.length >= 2 && s.length < 6) {
      const o = ["-", "-", "0", "1"];
      e = s.concat(o.slice(-(6 - s.length))).join(" ");
    }
    if (s = e.split(/\s+/), !t) {
      const { ok: o, error: c } = it(e);
      if (!o)
        throw new Error(c);
    }
    const n = s[0];
    let r = 0;
    this.clear({ preserveHeaders: i });
    for (let o = 0; o < n.length; o++) {
      const c = n.charAt(o);
      if (c === "/")
        r += 8;
      else if (tt(c))
        r += parseInt(c, 10);
      else {
        const h = c < "a" ? I : x;
        this._put({ type: c.toLowerCase(), color: h }, R(r)), r++;
      }
    }
    this._turn = s[1], s[2].indexOf("K") > -1 && (this._castling.w |= _.KSIDE_CASTLE), s[2].indexOf("Q") > -1 && (this._castling.w |= _.QSIDE_CASTLE), s[2].indexOf("k") > -1 && (this._castling.b |= _.KSIDE_CASTLE), s[2].indexOf("q") > -1 && (this._castling.b |= _.QSIDE_CASTLE), this._epSquare = s[3] === "-" ? D : v[s[3]], this._halfMoves = parseInt(s[4], 10), this._moveNumber = parseInt(s[5], 10), this._updateSetup(e), this._incPositionCount(e);
  }
  fen() {
    var n, r;
    let e = 0, t = "";
    for (let o = v.a8; o <= v.h1; o++) {
      if (this._board[o]) {
        e > 0 && (t += e, e = 0);
        const { color: c, type: h } = this._board[o];
        t += c === I ? h.toUpperCase() : h.toLowerCase();
      } else
        e++;
      o + 1 & 136 && (e > 0 && (t += e), o !== v.h1 && (t += "/"), e = 0, o += 8);
    }
    let i = "";
    this._castling[I] & _.KSIDE_CASTLE && (i += "K"), this._castling[I] & _.QSIDE_CASTLE && (i += "Q"), this._castling[x] & _.KSIDE_CASTLE && (i += "k"), this._castling[x] & _.QSIDE_CASTLE && (i += "q"), i = i || "-";
    let s = "-";
    if (this._epSquare !== D) {
      const o = this._epSquare + (this._turn === I ? 16 : -16), c = [o + 1, o - 1];
      for (const h of c) {
        if (h & 136)
          continue;
        const l = this._turn;
        if (((n = this._board[h]) == null ? void 0 : n.color) === l && ((r = this._board[h]) == null ? void 0 : r.type) === T) {
          this._makeMove({
            color: l,
            from: h,
            to: this._epSquare,
            piece: T,
            captured: T,
            flags: _.EP_CAPTURE
          });
          const d = !this._isKingAttacked(l);
          if (this._undoMove(), d) {
            s = R(this._epSquare);
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
    this._history.length > 0 || (e !== Te ? (this._header.SetUp = "1", this._header.FEN = e) : (delete this._header.SetUp, delete this._header.FEN));
  }
  reset() {
    this.load(Te);
  }
  get(e) {
    return this._board[v[e]];
  }
  put({ type: e, color: t }, i) {
    return this._put({ type: e, color: t }, i) ? (this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), !0) : !1;
  }
  _put({ type: e, color: t }, i) {
    if (Tt.indexOf(e.toLowerCase()) === -1 || !(i in v))
      return !1;
    const s = v[i];
    if (e === M && !(this._kings[t] === D || this._kings[t] === s))
      return !1;
    const n = this._board[s];
    return n && n.type === M && (this._kings[n.color] = D), this._board[s] = { type: e, color: t }, e === M && (this._kings[t] = s), !0;
  }
  remove(e) {
    const t = this.get(e);
    return delete this._board[v[e]], t && t.type === M && (this._kings[t.color] = D), this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), t;
  }
  _updateCastlingRights() {
    var i, s, n, r, o, c, h, l, d, u, g, f;
    const e = ((i = this._board[v.e1]) == null ? void 0 : i.type) === M && ((s = this._board[v.e1]) == null ? void 0 : s.color) === I, t = ((n = this._board[v.e8]) == null ? void 0 : n.type) === M && ((r = this._board[v.e8]) == null ? void 0 : r.color) === x;
    (!e || ((o = this._board[v.a1]) == null ? void 0 : o.type) !== he || ((c = this._board[v.a1]) == null ? void 0 : c.color) !== I) && (this._castling.w &= -65), (!e || ((h = this._board[v.h1]) == null ? void 0 : h.type) !== he || ((l = this._board[v.h1]) == null ? void 0 : l.color) !== I) && (this._castling.w &= -33), (!t || ((d = this._board[v.a8]) == null ? void 0 : d.type) !== he || ((u = this._board[v.a8]) == null ? void 0 : u.color) !== x) && (this._castling.b &= -65), (!t || ((g = this._board[v.h8]) == null ? void 0 : g.type) !== he || ((f = this._board[v.h8]) == null ? void 0 : f.color) !== x) && (this._castling.b &= -33);
  }
  _updateEnPassantSquare() {
    var n, r;
    if (this._epSquare === D)
      return;
    const e = this._epSquare + (this._turn === I ? -16 : 16), t = this._epSquare + (this._turn === I ? 16 : -16), i = [t + 1, t - 1];
    if (this._board[e] !== null || this._board[this._epSquare] !== null || ((n = this._board[t]) == null ? void 0 : n.color) !== ae(this._turn) || ((r = this._board[t]) == null ? void 0 : r.type) !== T) {
      this._epSquare = D;
      return;
    }
    const s = (o) => {
      var c, h;
      return !(o & 136) && ((c = this._board[o]) == null ? void 0 : c.color) === this._turn && ((h = this._board[o]) == null ? void 0 : h.type) === T;
    };
    i.some(s) || (this._epSquare = D);
  }
  _attacked(e, t, i) {
    const s = [];
    for (let n = v.a8; n <= v.h1; n++) {
      if (n & 136) {
        n += 7;
        continue;
      }
      if (this._board[n] === void 0 || this._board[n].color !== e)
        continue;
      const r = this._board[n], o = n - t;
      if (o === 0)
        continue;
      const c = o + 119;
      if (Ct[c] & kt[r.type]) {
        if (r.type === T) {
          if (o > 0 && r.color === I || o <= 0 && r.color === x) {
            if (!i)
              return !0;
            s.push(R(n));
          }
          continue;
        }
        if (r.type === "n" || r.type === "k") {
          if (!i)
            return !0;
          s.push(R(n));
          continue;
        }
        const h = Mt[c];
        let l = n + h, d = !1;
        for (; l !== t; ) {
          if (this._board[l] != null) {
            d = !0;
            break;
          }
          l += h;
        }
        if (!d) {
          if (!i)
            return !0;
          s.push(R(n));
          continue;
        }
      }
    }
    return i ? s : !1;
  }
  attackers(e, t) {
    return t ? this._attacked(t, v[e], !0) : this._attacked(this._turn, v[e], !0);
  }
  _isKingAttacked(e) {
    const t = this._kings[e];
    return t === -1 ? !1 : this._attacked(ae(e), t);
  }
  isAttacked(e, t) {
    return this._attacked(t, v[e]);
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
    for (let n = v.a8; n <= v.h1; n++) {
      if (s = (s + 1) % 2, n & 136) {
        n += 7;
        continue;
      }
      const r = this._board[n];
      r && (e[r.type] = r.type in e ? e[r.type] + 1 : 1, r.type === be && t.push(s), i++);
    }
    if (i === 2)
      return !0;
    if (
      // k vs. kn .... or .... k vs. kb
      i === 3 && (e[be] === 1 || e[Le] === 1)
    )
      return !0;
    if (i === e[be] + 2) {
      let n = 0;
      const r = t.length;
      for (let o = 0; o < r; o++)
        n += t[o];
      if (n === 0 || n === r)
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
    return e ? s.map((n) => new pe(this, n)) : s.map((n) => this._moveToSan(n, s));
  }
  _moves({ legal: e = !0, piece: t = void 0, square: i = void 0 } = {}) {
    var g;
    const s = i ? i.toLowerCase() : void 0, n = t == null ? void 0 : t.toLowerCase(), r = [], o = this._turn, c = ae(o);
    let h = v.a8, l = v.h1, d = !1;
    if (s) {
      if (!(s in v))
        return [];
      h = l = v[s], d = !0;
    }
    for (let f = h; f <= l; f++) {
      if (f & 136) {
        f += 7;
        continue;
      }
      if (!this._board[f] || this._board[f].color === c)
        continue;
      const { type: p } = this._board[f];
      let b;
      if (p === T) {
        if (n && n !== p) continue;
        b = f + Ae[o][0], this._board[b] || (W(r, o, f, b, T), b = f + Ae[o][1], qt[o] === X(f) && !this._board[b] && W(r, o, f, b, T, void 0, _.BIG_PAWN));
        for (let w = 2; w < 4; w++)
          b = f + Ae[o][w], !(b & 136) && (((g = this._board[b]) == null ? void 0 : g.color) === c ? W(r, o, f, b, T, this._board[b].type, _.CAPTURE) : b === this._epSquare && W(r, o, f, b, T, T, _.EP_CAPTURE));
      } else {
        if (n && n !== p) continue;
        for (let w = 0, S = Qe[p].length; w < S; w++) {
          const m = Qe[p][w];
          for (b = f; b += m, !(b & 136); ) {
            if (!this._board[b])
              W(r, o, f, b, p);
            else {
              if (this._board[b].color === o) break;
              W(r, o, f, b, p, this._board[b].type, _.CAPTURE);
              break;
            }
            if (p === Le || p === M) break;
          }
        }
      }
    }
    if ((n === void 0 || n === M) && (!d || l === this._kings[o])) {
      if (this._castling[o] & _.KSIDE_CASTLE) {
        const f = this._kings[o], p = f + 2;
        !this._board[f + 1] && !this._board[p] && !this._attacked(c, this._kings[o]) && !this._attacked(c, f + 1) && !this._attacked(c, p) && W(r, o, this._kings[o], p, M, void 0, _.KSIDE_CASTLE);
      }
      if (this._castling[o] & _.QSIDE_CASTLE) {
        const f = this._kings[o], p = f - 2;
        !this._board[f - 1] && !this._board[f - 2] && !this._board[f - 3] && !this._attacked(c, this._kings[o]) && !this._attacked(c, f - 1) && !this._attacked(c, p) && W(r, o, this._kings[o], p, M, void 0, _.QSIDE_CASTLE);
      }
    }
    if (!e || this._kings[o] === -1)
      return r;
    const u = [];
    for (let f = 0, p = r.length; f < p; f++)
      this._makeMove(r[f]), this._isKingAttacked(o) || u.push(r[f]), this._undoMove();
    return u;
  }
  move(e, { strict: t = !1 } = {}) {
    let i = null;
    if (typeof e == "string")
      i = this._moveFromSan(e, t);
    else if (typeof e == "object") {
      const n = this._moves();
      for (let r = 0, o = n.length; r < o; r++)
        if (e.from === R(n[r].from) && e.to === R(n[r].to) && (!("promotion" in n[r]) || e.promotion === n[r].promotion)) {
          i = n[r];
          break;
        }
    }
    if (!i)
      throw typeof e == "string" ? new Error(`Invalid move: ${e}`) : new Error(`Invalid move: ${JSON.stringify(e)}`);
    const s = new pe(this, i);
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
    const t = this._turn, i = ae(t);
    if (this._push(e), this._board[e.to] = this._board[e.from], delete this._board[e.from], e.flags & _.EP_CAPTURE && (this._turn === x ? delete this._board[e.to - 16] : delete this._board[e.to + 16]), e.promotion && (this._board[e.to] = { type: e.promotion, color: t }), this._board[e.to].type === M) {
      if (this._kings[t] = e.to, e.flags & _.KSIDE_CASTLE) {
        const s = e.to - 1, n = e.to + 1;
        this._board[s] = this._board[n], delete this._board[n];
      } else if (e.flags & _.QSIDE_CASTLE) {
        const s = e.to + 1, n = e.to - 2;
        this._board[s] = this._board[n], delete this._board[n];
      }
      this._castling[t] = 0;
    }
    if (this._castling[t]) {
      for (let s = 0, n = K[t].length; s < n; s++)
        if (e.from === K[t][s].square && this._castling[t] & K[t][s].flag) {
          this._castling[t] ^= K[t][s].flag;
          break;
        }
    }
    if (this._castling[i]) {
      for (let s = 0, n = K[i].length; s < n; s++)
        if (e.to === K[i][s].square && this._castling[i] & K[i][s].flag) {
          this._castling[i] ^= K[i][s].flag;
          break;
        }
    }
    e.flags & _.BIG_PAWN ? t === x ? this._epSquare = e.to - 16 : this._epSquare = e.to + 16 : this._epSquare = D, e.piece === T ? this._halfMoves = 0 : e.flags & (_.CAPTURE | _.EP_CAPTURE) ? this._halfMoves = 0 : this._halfMoves++, t === x && this._moveNumber++, this._turn = i;
  }
  undo() {
    const e = this._undoMove();
    if (e) {
      const t = new pe(this, e);
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
    const i = this._turn, s = ae(i);
    if (this._board[t.from] = this._board[t.to], this._board[t.from].type = t.piece, delete this._board[t.to], t.captured)
      if (t.flags & _.EP_CAPTURE) {
        let n;
        i === x ? n = t.to - 16 : n = t.to + 16, this._board[n] = { type: T, color: s };
      } else
        this._board[t.to] = { type: t.captured, color: s };
    if (t.flags & (_.KSIDE_CASTLE | _.QSIDE_CASTLE)) {
      let n, r;
      t.flags & _.KSIDE_CASTLE ? (n = t.to + 1, r = t.to - 1) : (n = t.to - 2, r = t.to + 1), this._board[n] = this._board[r], delete this._board[r];
    }
    return t;
  }
  pgn({ newline: e = `
`, maxWidth: t = 0 } = {}) {
    const i = [];
    let s = !1;
    for (const u in this._header)
      i.push(`[${u} "${this._header[u]}"]${e}`), s = !0;
    s && this._history.length && i.push(e);
    const n = (u) => {
      const g = this._comments[this.fen()];
      if (typeof g < "u") {
        const f = u.length > 0 ? " " : "";
        u = `${u}${f}{${g}}`;
      }
      return u;
    }, r = [];
    for (; this._history.length > 0; )
      r.push(this._undoMove());
    const o = [];
    let c = "";
    for (r.length === 0 && o.push(n("")); r.length > 0; ) {
      c = n(c);
      const u = r.pop();
      if (!u)
        break;
      if (!this._history.length && u.color === "b") {
        const g = `${this._moveNumber}. ...`;
        c = c ? `${c} ${g}` : g;
      } else u.color === "w" && (c.length && o.push(c), c = `${this._moveNumber}.`);
      c = `${c} ${this._moveToSan(u, this._moves({ legal: !0 }))}`, this._makeMove(u);
    }
    if (c.length && o.push(n(c)), typeof this._header.Result < "u" && o.push(this._header.Result), t === 0)
      return i.join("") + o.join(" ");
    const h = function() {
      return i.length > 0 && i[i.length - 1] === " " ? (i.pop(), !0) : !1;
    }, l = function(u, g) {
      for (const f of g.split(" "))
        if (f) {
          if (u + f.length > t) {
            for (; h(); )
              u--;
            i.push(e), u = 0;
          }
          i.push(f), u += f.length, i.push(" "), u++;
        }
      return h() && u--, u;
    };
    let d = 0;
    for (let u = 0; u < o.length; u++) {
      if (d + o[u].length > t && o[u].includes("{")) {
        d = l(d, o[u]);
        continue;
      }
      d + o[u].length > t && u !== 0 ? (i[i.length - 1] === " " && i.pop(), i.push(e), d = 0) : u !== 0 && (i.push(" "), d++), i.push(o[u]), d += o[u].length;
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
    function s(m) {
      return m.replace(/\\/g, "\\");
    }
    function n(m) {
      const E = {}, k = m.split(new RegExp(s(i)));
      let L = "", N = "";
      for (let F = 0; F < k.length; F++) {
        const H = /^\s*\[\s*([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;
        L = k[F].replace(H, "$1"), N = k[F].replace(H, "$2"), L.trim().length > 0 && (E[L] = N);
      }
      return E;
    }
    e = e.trim();
    const o = new RegExp(
      `^(\\[((?:${s(i)})|.)*\\])((?:\\s*${s(i)}){2}|(?:\\s*${s(i)})*$)`
    ).exec(e), c = o && o.length >= 2 ? o[1] : "";
    this.reset();
    const h = n(c);
    let l = "";
    for (const m in h)
      m.toLowerCase() === "fen" && (l = h[m]), this.header(m, h[m]);
    if (!t)
      l && this.load(l, { preserveHeaders: !0 });
    else if (h.SetUp === "1") {
      if (!("FEN" in h))
        throw new Error("Invalid PGN: FEN tag must be supplied with SetUp tag");
      this.load(h.FEN, { preserveHeaders: !0 });
    }
    function d(m) {
      return Array.from(m).map((E) => E.charCodeAt(0) < 128 ? E.charCodeAt(0).toString(16) : encodeURIComponent(E).replace(/%/g, "").toLowerCase()).join("");
    }
    function u(m) {
      return m.length === 0 ? "" : decodeURIComponent(`%${(m.match(/.{1,2}/g) || []).join("%")}`);
    }
    const g = function(m) {
      return m = m.replace(new RegExp(s(i), "g"), " "), `{${d(m.slice(1, m.length - 1))}}`;
    }, f = function(m) {
      if (m.startsWith("{") && m.endsWith("}"))
        return u(m.slice(1, m.length - 1));
    };
    let p = e.replace(c, "").replace(
      // encode comments so they don't get deleted below
      new RegExp(`({[^}]*})+?|;([^${s(i)}]*)`, "g"),
      (m, E, k) => E !== void 0 ? g(E) : ` ${g(`{${k.slice(1)}}`)}`
    ).replace(new RegExp(s(i), "g"), " ");
    const b = /(\([^()]+\))+?/g;
    for (; b.test(p); )
      p = p.replace(b, "");
    p = p.replace(/\d+\.(\.\.)?/g, ""), p = p.replace(/\.\.\./g, ""), p = p.replace(/\$\d+/g, "");
    let w = p.trim().split(new RegExp(/\s+/));
    w = w.filter((m) => m !== "");
    let S = "";
    for (let m = 0; m < w.length; m++) {
      const E = f(w[m]);
      if (E !== void 0) {
        this._comments[this.fen()] = E;
        continue;
      }
      const k = this._moveFromSan(w[m], t);
      if (k == null)
        if (Dt.indexOf(w[m]) > -1)
          S = w[m];
        else
          throw new Error(`Invalid move in PGN: ${w[m]}`);
      else
        S = "", this._makeMove(k), this._incPositionCount(this.fen());
    }
    S && Object.keys(this._header).length && !this._header.Result && this.header("Result", S);
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
    if (e.flags & _.KSIDE_CASTLE)
      i = "O-O";
    else if (e.flags & _.QSIDE_CASTLE)
      i = "O-O-O";
    else {
      if (e.piece !== T) {
        const s = Lt(e, t);
        i += e.piece.toUpperCase() + s;
      }
      e.flags & (_.CAPTURE | _.EP_CAPTURE) && (e.piece === T && (i += R(e.from)[0]), i += "x"), i += R(e.to), e.promotion && (i += `=${e.promotion.toUpperCase()}`);
    }
    return this._makeMove(e), this.isCheck() && (this.isCheckmate() ? i += "#" : i += "+"), this._undoMove(), i;
  }
  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  _moveFromSan(e, t = !1) {
    const i = Ie(e);
    let s = Je(i), n = this._moves({ legal: !0, piece: s });
    for (let u = 0, g = n.length; u < g; u++)
      if (i === Ie(this._moveToSan(n[u], n)))
        return n[u];
    if (t)
      return null;
    let r, o, c, h, l, d = !1;
    if (o = i.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/), o ? (r = o[1], c = o[2], h = o[3], l = o[4], c.length === 1 && (d = !0)) : (o = i.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/), o && (r = o[1], c = o[2], h = o[3], l = o[4], c.length === 1 && (d = !0))), s = Je(i), n = this._moves({
      legal: !0,
      piece: r || s
    }), !h)
      return null;
    for (let u = 0, g = n.length; u < g; u++)
      if (c) {
        if ((!r || r.toLowerCase() === n[u].piece) && v[c] === n[u].from && v[h] === n[u].to && (!l || l.toLowerCase() === n[u].promotion))
          return n[u];
        if (d) {
          const f = R(n[u].from);
          if ((!r || r.toLowerCase() === n[u].piece) && v[h] === n[u].to && (c === f[0] || c === f[1]) && (!l || l.toLowerCase() === n[u].promotion))
            return n[u];
        }
      } else if (i === Ie(this._moveToSan(n[u], n)).replace("x", ""))
        return n[u];
    return null;
  }
  ascii() {
    let e = `   +------------------------+
`;
    for (let t = v.a8; t <= v.h1; t++) {
      if (ue(t) === 0 && (e += ` ${"87654321"[X(t)]} |`), this._board[t]) {
        const i = this._board[t].type, n = this._board[t].color === I ? i.toUpperCase() : i.toLowerCase();
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
    for (let n = 0, r = t.length; n < r; n++)
      this._makeMove(t[n]), this._isKingAttacked(s) || (e - 1 > 0 ? i += this.perft(e - 1) : i++), this._undoMove();
    return i;
  }
  turn() {
    return this._turn;
  }
  board() {
    const e = [];
    let t = [];
    for (let i = v.a8; i <= v.h1; i++)
      this._board[i] == null ? t.push(null) : t.push({
        square: R(i),
        type: this._board[i].type,
        color: this._board[i].color
      }), i + 1 & 136 && (e.push(t), t = [], i += 8);
    return e;
  }
  squareColor(e) {
    if (e in v) {
      const t = v[e];
      return (X(t) + ue(t)) % 2 === 0 ? "light" : "dark";
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
      e ? i.push(new pe(this, s)) : i.push(this._moveToSan(s, this._moves())), this._makeMove(s);
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
    const t = Re(e);
    return this._positionCount[t] || 0;
  }
  _incPositionCount(e) {
    const t = Re(e);
    this._positionCount[t] === void 0 && (this._positionCount[t] = 0), this._positionCount[t] += 1;
  }
  _decPositionCount(e) {
    const t = Re(e);
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
    for (const s of [M, Q])
      t[s] !== void 0 && (t[s] ? this._castling[e] |= ve[s] : this._castling[e] &= ~ve[s]);
    this._updateCastlingRights();
    const i = this.getCastlingRights(e);
    return (t[M] === void 0 || t[M] === i[M]) && (t[Q] === void 0 || t[Q] === i[Q]);
  }
  getCastlingRights(e) {
    return {
      [M]: (this._castling[e] & ve[M]) !== 0,
      [Q]: (this._castling[e] & ve[Q]) !== 0
    };
  }
  moveNumber() {
    return this._moveNumber;
  }
}
class Bt {
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
    throw new C(P.invalid_position + e, "position", e);
  }
  /**
   * Converts string position to FEN
   * @private
   * @param {string} position - String position
   * @returns {string} FEN string
   */
  _convertStringPosition(e) {
    if (e === "start")
      return ut;
    if (this.validateFen(e))
      return e;
    if (Ve[e])
      return Ve[e];
    throw new C(P.invalid_position + e, "position", e);
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
      for (let r = 0; r < 8; r++) {
        const o = this._getSquareID(i, r), c = e[o];
        if (c) {
          n > 0 && (s.push(n), n = 0);
          const h = c[1] === "w" ? c[0].toUpperCase() : c[0].toLowerCase();
          s.push(h);
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
    this.game ? this.game.load(i, t) : this.game = new Nt(i);
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
    return it(e);
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
    return e = parseInt(e), t = parseInt(t), this.config.orientation === "w" ? (e = 8 - e, t = t + 1) : (e = e + 1, t = 8 - t), _e[t - 1] + e;
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
class st {
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
    const i = [...e].sort((n, r) => n - r), s = Math.ceil(t / 100 * i.length) - 1;
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
function oi(a, e) {
  let t;
  return function(...i) {
    t || (a.apply(this, i), t = !0, setTimeout(() => {
      t = !1;
    }, e));
  };
}
function ai(a, e) {
  let t;
  const i = function(...s) {
    clearTimeout(t), t = setTimeout(() => a.apply(i.context, s), e);
  };
  return function(...s) {
    return i.context = this, i(...s);
  };
}
function ci(a) {
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
function hi(a, e, t, i = 1) {
  !a || !a.style || (a.style.transform = `translate3d(${e}px, ${t}px, 0) scale(${i})`, a.style.willChange = "transform");
}
function li(a) {
  !a || !a.style || (a.style.transform = "", a.style.left = "", a.style.top = "", a.style.willChange = "");
}
function ui(a) {
  return new Promise((e) => {
    requestAnimationFrame(() => {
      const t = a();
      e(t);
    });
  });
}
function di(a) {
  if (!a || !a.getBoundingClientRect) return !1;
  const e = a.getBoundingClientRect();
  return e.width > 0 && e.height > 0 && e.bottom > 0 && e.right > 0 && e.top < (window.innerHeight || document.documentElement.clientHeight) && e.left < (window.innerWidth || document.documentElement.clientWidth);
}
function fi() {
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
class de {
  /**
   * @param {Object} chessboard - Reference to the chessboard instance
   * @param {ModeConfig} [config={}] - Mode configuration
   */
  constructor(e, t = {}) {
    if (new.target === de)
      throw new Error("BaseMode is abstract and cannot be instantiated directly");
    this.chessboard = e, this.config = {
      name: "base",
      enforceRules: !0,
      allowFreeMovement: !1,
      allowPieceCreation: !1,
      allowPieceRemoval: !1,
      trackTurns: !0,
      detectGameEnd: !0,
      ...t
    }, this.isActive = !1, this.moveHistory = [], this.listeners = /* @__PURE__ */ new Map();
  }
  /**
   * Get mode name
   * @returns {string}
   */
  getName() {
    return this.config.name;
  }
  /**
   * Start the mode
   * @virtual
   */
  start() {
    this.isActive = !0, this.moveHistory = [], this._emit("modeStart", { mode: this.getName() }), this.config.onModeStart && this.config.onModeStart(this);
  }
  /**
   * Stop the mode
   * @virtual
   */
  stop() {
    this.isActive = !1, this._emit("modeEnd", { mode: this.getName() }), this.config.onModeEnd && this.config.onModeEnd(this);
  }
  /**
   * Check if a move is allowed in this mode
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {Object} [options={}] - Additional options
   * @returns {boolean}
   * @virtual
   */
  canMove(e, t, i = {}) {
    return this.isActive ? this.config.allowFreeMovement ? !0 : this._validateMove(e, t, i) : !1;
  }
  /**
   * Execute a move
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {Object} [options={}] - Additional options
   * @returns {boolean} - Whether the move was successful
   * @virtual
   */
  executeMove(e, t, i = {}) {
    if (!this.canMove(e, t, i))
      return !1;
    const s = {
      from: e,
      to: t,
      timestamp: Date.now(),
      ...i
    };
    return this.moveHistory.push(s), this._emit("move", s), this.config.onMove && this.config.onMove(s), this.config.trackTurns && this.config.onTurnChange && this.config.onTurnChange(this.getCurrentTurn()), !0;
  }
  /**
   * Check if piece creation is allowed
   * @returns {boolean}
   */
  canCreatePiece() {
    return this.isActive && this.config.allowPieceCreation;
  }
  /**
   * Check if piece removal is allowed
   * @returns {boolean}
   */
  canRemovePiece() {
    return this.isActive && this.config.allowPieceRemoval;
  }
  /**
   * Get current turn
   * @returns {'w'|'b'|null}
   */
  getCurrentTurn() {
    return this.config.trackTurns ? this.chessboard.turn ? this.chessboard.turn() : "w" : null;
  }
  /**
   * Check if game is over
   * @returns {boolean}
   */
  isGameOver() {
    return this.config.detectGameEnd && this.chessboard.isGameOver ? this.chessboard.isGameOver() : !1;
  }
  /**
   * Get game result
   * @returns {Object|null}
   */
  getGameResult() {
    var t, i, s, n, r, o;
    if (!this.isGameOver()) return null;
    const e = {
      isOver: !0,
      isCheckmate: ((i = (t = this.chessboard).isCheckmate) == null ? void 0 : i.call(t)) || !1,
      isStalemate: ((n = (s = this.chessboard).isStalemate) == null ? void 0 : n.call(s)) || !1,
      isDraw: ((o = (r = this.chessboard).isDraw) == null ? void 0 : o.call(r)) || !1,
      winner: null
    };
    return e.isCheckmate && (e.winner = this.getCurrentTurn() === "w" ? "b" : "w"), e;
  }
  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(e, t) {
    this.listeners.has(e) || this.listeners.set(e, []), this.listeners.get(e).push(t);
  }
  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(e, t) {
    if (!this.listeners.has(e)) return;
    const i = this.listeners.get(e), s = i.indexOf(t);
    s > -1 && i.splice(s, 1);
  }
  /**
   * Emit event
   * @protected
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  _emit(e, t) {
    this.listeners.has(e) && this.listeners.get(e).forEach((i) => {
      try {
        i(t);
      } catch (s) {
        console.error(`Error in mode event listener for ${e}:`, s);
      }
    });
  }
  /**
   * Validate move according to chess rules
   * @protected
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @returns {boolean}
   */
  _validateMove(e, t) {
    if (!this.chessboard.positionService) return !1;
    const i = this.chessboard.positionService.getGame();
    return i ? i.moves({ square: e, verbose: !0 }).some((n) => n.to === t) : !1;
  }
  /**
   * Get mode statistics
   * @returns {Object}
   */
  getStats() {
    return {
      mode: this.getName(),
      isActive: this.isActive,
      movesPlayed: this.moveHistory.length,
      currentTurn: this.getCurrentTurn(),
      isGameOver: this.isGameOver()
    };
  }
  /**
   * Reset the mode
   * @virtual
   */
  reset() {
    this.moveHistory = [], this._emit("reset", { mode: this.getName() });
  }
  /**
   * Serialize mode state
   * @returns {Object}
   */
  serialize() {
    return {
      name: this.getName(),
      config: this.config,
      isActive: this.isActive,
      moveHistory: this.moveHistory
    };
  }
  /**
   * Restore mode state
   * @param {Object} state - Serialized state
   */
  restore(e) {
    e.moveHistory && (this.moveHistory = e.moveHistory), e.isActive && this.start();
  }
}
const Pe = class Pe extends de {
  /**
   * @param {Object} chessboard - Reference to the chessboard instance
   * @param {CreativeModeConfig} [config={}] - Mode configuration
   */
  constructor(e, t = {}) {
    super(e, {
      name: "creative",
      enforceRules: !1,
      allowFreeMovement: !0,
      allowPieceCreation: !0,
      allowPieceRemoval: !0,
      trackTurns: !1,
      detectGameEnd: !1,
      showPiecePalette: !0,
      allowIllegalPositions: !0,
      availablePieces: Pe.DEFAULT_PIECES,
      ...t
    }), this.selectedPiece = null, this.savedPositions = /* @__PURE__ */ new Map(), this.clipboard = null, this.undoStack = [], this.redoStack = [];
  }
  /**
   * Start creative mode
   * @override
   */
  start() {
    super.start(), this._saveState(), this._setupInteractions(), this._emit("creativeStart", {
      availablePieces: this.config.availablePieces
    });
  }
  /**
   * Stop creative mode
   * @override
   */
  stop() {
    this._cleanupInteractions(), super.stop();
  }
  /**
   * Setup creative mode interactions
   * @private
   */
  _setupInteractions() {
    this._originalDraggable = this.chessboard.config.draggable, this.chessboard.config && (this.chessboard.config.draggable = !0);
  }
  /**
   * Cleanup creative mode interactions
   * @private
   */
  _cleanupInteractions() {
    this._originalDraggable !== void 0 && this.chessboard.config && (this.chessboard.config.draggable = this._originalDraggable);
  }
  /**
   * Select a piece type for placement
   * @param {string} piece - Piece code (e.g., 'wq', 'bn')
   */
  selectPiece(e) {
    if (!this.config.availablePieces.includes(e)) {
      console.warn(`[CreativeMode] Piece ${e} not available`);
      return;
    }
    this.selectedPiece = e, this._emit("pieceSelected", { piece: e });
  }
  /**
   * Deselect current piece
   */
  deselectPiece() {
    this.selectedPiece = null, this._emit("pieceDeselected", {});
  }
  /**
   * Get currently selected piece
   * @returns {string|null}
   */
  getSelectedPiece() {
    return this.selectedPiece;
  }
  /**
   * Add a piece to a square
   * @param {string} piece - Piece code
   * @param {string} square - Target square
   * @returns {boolean}
   */
  addPiece(e, t) {
    if (!this.isActive) return !1;
    this._saveState();
    try {
      return this.chessboard.getPiece(t) && this.chessboard.removePiece(t), this.chessboard.putPiece(e, t), this.chessboard.forceSync(), this._emit("pieceAdded", { piece: e, square: t }), this.config.onPieceAdded && this.config.onPieceAdded({ piece: e, square: t }), !0;
    } catch (i) {
      return console.error("[CreativeMode] Error adding piece:", i), this.undo(), !1;
    }
  }
  /**
   * Remove a piece from a square
   * @param {string} square - Square to clear
   * @returns {string|null} - The removed piece code
   */
  removePiece(e) {
    if (!this.isActive) return null;
    const t = this.chessboard.getPiece(e);
    if (!t) return null;
    this._saveState();
    try {
      return this.chessboard.removePiece(e), this.chessboard.forceSync(), this._emit("pieceRemoved", { piece: t, square: e }), this.config.onPieceRemoved && this.config.onPieceRemoved({ piece: t, square: e }), t;
    } catch (i) {
      return console.error("[CreativeMode] Error removing piece:", i), this.undo(), null;
    }
  }
  /**
   * Move a piece (no rule validation)
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @returns {boolean}
   */
  movePiece(e, t) {
    if (!this.isActive) return !1;
    const i = this.chessboard.getPiece(e);
    if (!i) return !1;
    this._saveState();
    try {
      return this.chessboard.removePiece(e), this.chessboard.putPiece(i, t), this.chessboard.forceSync(), this._emit("pieceMoved", { piece: i, from: e, to: t }), !0;
    } catch (s) {
      return console.error("[CreativeMode] Error moving piece:", s), this.undo(), !1;
    }
  }
  /**
   * Copy a piece to another square
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @returns {boolean}
   */
  copyPiece(e, t) {
    if (!this.isActive) return !1;
    const i = this.chessboard.getPiece(e);
    return i ? this.addPiece(i, t) : !1;
  }
  /**
   * Copy piece to clipboard
   * @param {string} square - Square to copy from
   */
  copyToClipboard(e) {
    this.clipboard = this.chessboard.getPiece(e), this._emit("clipboardUpdated", { piece: this.clipboard });
  }
  /**
   * Paste piece from clipboard
   * @param {string} square - Target square
   * @returns {boolean}
   */
  pasteFromClipboard(e) {
    return this.clipboard ? this.addPiece(this.clipboard, e) : !1;
  }
  /**
   * Clear the entire board
   */
  clearBoard() {
    this.isActive && (this._saveState(), this.chessboard.clear({ animate: !1 }), this.chessboard.forceSync(), this._emit("boardCleared", {}));
  }
  /**
   * Set up starting position
   */
  setupStartingPosition() {
    this.isActive && (this._saveState(), this.chessboard.reset({ animate: !1 }), this.chessboard.forceSync(), this._emit("positionReset", {}));
  }
  /**
   * Set a custom position from FEN
   * @param {string} fen - FEN string
   * @returns {boolean}
   */
  setPosition(e) {
    if (!this.isActive) return !1;
    this._saveState();
    try {
      return this.chessboard.setPosition(e), this.chessboard.forceSync(), this._emit("positionSet", { fen: e }), !0;
    } catch (t) {
      return console.error("[CreativeMode] Error setting position:", t), this.undo(), !1;
    }
  }
  /**
   * Save current position with a name
   * @param {string} name - Position name
   * @returns {string} - FEN string
   */
  savePosition(e) {
    const t = this.chessboard.fen();
    return this.savedPositions.set(e, t), this._emit("positionSaved", { name: e, fen: t }), this.config.onPositionSaved && this.config.onPositionSaved({ name: e, fen: t }), t;
  }
  /**
   * Load a saved position
   * @param {string} name - Position name
   * @returns {boolean}
   */
  loadPosition(e) {
    const t = this.savedPositions.get(e);
    return t ? this.setPosition(t) : (console.warn(`[CreativeMode] Position "${e}" not found`), !1);
  }
  /**
   * Get list of saved positions
   * @returns {string[]}
   */
  getSavedPositions() {
    return Array.from(this.savedPositions.keys());
  }
  /**
   * Delete a saved position
   * @param {string} name - Position name
   * @returns {boolean}
   */
  deletePosition(e) {
    return this.savedPositions.delete(e);
  }
  /**
   * Undo last action
   * @returns {boolean}
   */
  undo() {
    if (this.undoStack.length === 0) return !1;
    this.redoStack.push(this.chessboard.fen());
    const e = this.undoStack.pop();
    return this.chessboard.setPosition(e), this.chessboard.forceSync(), this._emit("undo", { fen: e }), !0;
  }
  /**
   * Redo last undone action
   * @returns {boolean}
   */
  redo() {
    if (this.redoStack.length === 0) return !1;
    this.undoStack.push(this.chessboard.fen());
    const e = this.redoStack.pop();
    return this.chessboard.setPosition(e), this.chessboard.forceSync(), this._emit("redo", { fen: e }), !0;
  }
  /**
   * Save current state for undo
   * @private
   */
  _saveState() {
    this.undoStack.push(this.chessboard.fen()), this.redoStack = [];
  }
  /**
   * Validate position (check for illegal setups)
   * @returns {Object} - Validation result
   */
  validatePosition() {
    const e = this.chessboard.fen(), t = e.split(" ")[0], i = [];
    let s = 0, n = 0, r = 0, o = 0;
    for (const h of t)
      h === "K" && s++, h === "k" && n++;
    const c = t.split("/");
    return c[0].includes("P") && o++, c[7].includes("p") && r++, s !== 1 && i.push(`White has ${s} kings (should be 1)`), n !== 1 && i.push(`Black has ${n} kings (should be 1)`), r > 0 && i.push("White pawns on 1st rank"), o > 0 && i.push("Black pawns on 8th rank"), {
      isValid: i.length === 0,
      issues: i,
      fen: e
    };
  }
  /**
   * Export position as various formats
   * @param {string} [format='fen'] - Export format ('fen', 'pgn', 'json')
   * @returns {string}
   */
  exportPosition(e = "fen") {
    switch (e) {
      case "fen":
        return this.chessboard.fen();
      case "json":
        return JSON.stringify({
          fen: this.chessboard.fen(),
          savedPositions: Object.fromEntries(this.savedPositions)
        });
      default:
        return this.chessboard.fen();
    }
  }
  /**
   * Import position from format
   * @param {string} data - Position data
   * @param {string} [format='fen'] - Import format
   * @returns {boolean}
   */
  importPosition(e, t = "fen") {
    try {
      switch (t) {
        case "fen":
          return this.setPosition(e);
        case "json": {
          const i = JSON.parse(e);
          return i.fen && this.setPosition(i.fen), i.savedPositions && Object.entries(i.savedPositions).forEach(([s, n]) => {
            this.savedPositions.set(s, n);
          }), !0;
        }
        default:
          return this.setPosition(e);
      }
    } catch (i) {
      return console.error("[CreativeMode] Error importing position:", i), !1;
    }
  }
  /**
   * Get mode-specific stats
   * @override
   * @returns {Object}
   */
  getStats() {
    return {
      ...super.getStats(),
      selectedPiece: this.selectedPiece,
      savedPositionsCount: this.savedPositions.size,
      undoStackSize: this.undoStack.length,
      redoStackSize: this.redoStack.length,
      clipboardPiece: this.clipboard,
      validation: this.validatePosition()
    };
  }
  /**
   * Reset creative mode
   * @override
   */
  reset() {
    super.reset(), this.selectedPiece = null, this.clipboard = null, this.undoStack = [], this.redoStack = [];
  }
  /**
   * Serialize mode state
   * @override
   * @returns {Object}
   */
  serialize() {
    return {
      ...super.serialize(),
      selectedPiece: this.selectedPiece,
      savedPositions: Object.fromEntries(this.savedPositions),
      clipboard: this.clipboard,
      undoStack: this.undoStack,
      redoStack: this.redoStack
    };
  }
  /**
   * Restore mode state
   * @override
   * @param {Object} state - Serialized state
   */
  restore(e) {
    super.restore(e), e.selectedPiece && (this.selectedPiece = e.selectedPiece), e.savedPositions && (this.savedPositions = new Map(Object.entries(e.savedPositions))), e.clipboard && (this.clipboard = e.clipboard), e.undoStack && (this.undoStack = e.undoStack), e.redoStack && (this.redoStack = e.redoStack);
  }
};
/**
 * Default pieces available in creative mode
 * @static
 */
y(Pe, "DEFAULT_PIECES", ["wk", "wq", "wr", "wb", "wn", "wp", "bk", "bq", "br", "bb", "bn", "bp"]);
let Ne = Pe;
class xt extends de {
  /**
   * @param {Object} chessboard - Reference to the chessboard instance
   * @param {PvPModeConfig} [config={}] - Mode configuration
   */
  constructor(e, t = {}) {
    super(e, {
      name: "pvp",
      enforceRules: !0,
      allowFreeMovement: !1,
      allowPieceCreation: !1,
      allowPieceRemoval: !1,
      trackTurns: !0,
      detectGameEnd: !0,
      timeControl: null,
      allowTakeback: !0,
      allowDrawOffer: !0,
      showLegalMoves: !0,
      showLastMove: !0,
      showCheck: !0,
      ...t
    }), this.players = {
      w: { name: "White", timeRemaining: null, connected: !0 },
      b: { name: "Black", timeRemaining: null, connected: !0 }
    }, this.gameStartTime = null, this.lastMoveTime = null, this.timerInterval = null, this.pendingDrawOffer = null, this.pendingTakeback = null, this.moveNotations = [];
  }
  /**
   * Start PvP game
   * @override
   */
  start() {
    super.start(), this.gameStartTime = Date.now(), this.lastMoveTime = this.gameStartTime, this.config.timeControl && (this.players.w.timeRemaining = this.config.timeControl.initial, this.players.b.timeRemaining = this.config.timeControl.initial, this._startTimer()), this._emit("gameStart", {
      players: this.players,
      timeControl: this.config.timeControl
    });
  }
  /**
   * Stop PvP game
   * @override
   */
  stop() {
    this._stopTimer(), super.stop();
  }
  /**
   * Set player name
   * @param {'w'|'b'} color - Player color
   * @param {string} name - Player name
   */
  setPlayerName(e, t) {
    this.players[e] && (this.players[e].name = t, this._emit("playerUpdated", { color: e, name: t }));
  }
  /**
   * Get player info
   * @param {'w'|'b'} color - Player color
   * @returns {Object}
   */
  getPlayer(e) {
    return this.players[e];
  }
  /**
   * Execute a move with validation
   * @override
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {Object} [options={}] - Additional options
   * @returns {boolean}
   */
  executeMove(e, t, i = {}) {
    if (!this.isActive) return !1;
    const s = this.chessboard.getPiece(e);
    if (!s) return !1;
    const n = s[0], r = this.getCurrentTurn();
    if (n !== r)
      return this._emit("invalidMove", { reason: "Not your turn", from: e, to: t }), !1;
    if (!this.canMove(e, t, i))
      return this._emit("invalidMove", { reason: "Illegal move", from: e, to: t }), !1;
    const o = this._getMoveNotation(e, t);
    if (!this.chessboard.movePiece(`${e}${t}${i.promotion || ""}`))
      return this._emit("invalidMove", { reason: "Move failed", from: e, to: t }), !1;
    this.config.timeControl && this._updatePlayerTime(r);
    const h = {
      from: e,
      to: t,
      piece: s,
      notation: o,
      timestamp: Date.now(),
      ...i
    };
    return this.moveHistory.push(h), this.moveNotations.push(o), this.pendingDrawOffer = null, this.pendingTakeback = null, this._emit("move", h), this.config.onMove && this.config.onMove(h), this._checkGameEnd(), this.config.onTurnChange && this.config.onTurnChange(this.getCurrentTurn()), !0;
  }
  /**
   * Get move notation
   * @private
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @returns {string}
   */
  _getMoveNotation(e, t) {
    var r;
    const i = (r = this.chessboard.positionService) == null ? void 0 : r.getGame();
    if (!i) return `${e}-${t}`;
    const n = i.moves({ verbose: !0 }).find((o) => o.from === e && o.to === t);
    return n ? n.san : `${e}-${t}`;
  }
  /**
   * Start the game timer
   * @private
   */
  _startTimer() {
    this.timerInterval || (this.timerInterval = setInterval(() => {
      const e = this.getCurrentTurn();
      e && this.players[e] && (this.players[e].timeRemaining -= 1, this._emit("timerUpdate", {
        color: e,
        timeRemaining: this.players[e].timeRemaining
      }), this.players[e].timeRemaining <= 0 && this._handleTimeout(e));
    }, 1e3));
  }
  /**
   * Stop the game timer
   * @private
   */
  _stopTimer() {
    this.timerInterval && (clearInterval(this.timerInterval), this.timerInterval = null);
  }
  /**
   * Update player time after move
   * @private
   * @param {'w'|'b'} color - Player who just moved
   */
  _updatePlayerTime(e) {
    this.config.timeControl && (this.players[e].timeRemaining += this.config.timeControl.increment, this._emit("timerUpdate", {
      color: e,
      timeRemaining: this.players[e].timeRemaining
    }));
  }
  /**
   * Handle player timeout
   * @private
   * @param {'w'|'b'} loser - Player who ran out of time
   */
  _handleTimeout(e) {
    this._stopTimer();
    const t = e === "w" ? "b" : "w";
    this._emit("gameEnd", {
      result: "timeout",
      winner: t,
      loser: e,
      reason: `${this.players[e].name} ran out of time`
    }), this.config.onGameEnd && this.config.onGameEnd({ result: "timeout", winner: t }), this.stop();
  }
  /**
   * Check for game end conditions
   * @private
   */
  _checkGameEnd() {
    var n, r, o, c, h, l;
    const e = (n = this.chessboard.positionService) == null ? void 0 : n.getGame();
    if (!e) return;
    let t = null, i = null, s = "";
    (r = e.isCheckmate) != null && r.call(e) ? (i = this.getCurrentTurn() === "w" ? "b" : "w", t = "checkmate", s = `Checkmate! ${this.players[i].name} wins`) : (o = e.isStalemate) != null && o.call(e) ? (t = "stalemate", s = "Stalemate - Draw") : (c = e.isThreefoldRepetition) != null && c.call(e) ? (t = "repetition", s = "Draw by threefold repetition") : (h = e.isInsufficientMaterial) != null && h.call(e) ? (t = "insufficient", s = "Draw by insufficient material") : (l = e.isDraw) != null && l.call(e) && (t = "draw", s = "Draw"), t && (this._stopTimer(), this._emit("gameEnd", { result: t, winner: i, reason: s }), this.config.onGameEnd && this.config.onGameEnd({ result: t, winner: i, reason: s }));
  }
  /**
   * Offer a draw
   * @param {'w'|'b'} offerer - Player offering draw
   * @returns {boolean}
   */
  offerDraw(e) {
    return !this.isActive || !this.config.allowDrawOffer ? !1 : (this.pendingDrawOffer = e, this._emit("drawOffered", { offerer: e }), this.config.onDrawOffer && this.config.onDrawOffer({ offerer: e }), !0);
  }
  /**
   * Accept draw offer
   * @returns {boolean}
   */
  acceptDraw() {
    return this.pendingDrawOffer ? (this._stopTimer(), this._emit("gameEnd", {
      result: "agreement",
      winner: null,
      reason: "Draw by agreement"
    }), this.config.onGameEnd && this.config.onGameEnd({ result: "agreement", winner: null }), this.stop(), !0) : !1;
  }
  /**
   * Decline draw offer
   */
  declineDraw() {
    if (!this.pendingDrawOffer) return;
    const e = this.pendingDrawOffer;
    this.pendingDrawOffer = null, this._emit("drawDeclined", { offerer: e });
  }
  /**
   * Request takeback
   * @param {'w'|'b'} requester - Player requesting takeback
   * @returns {boolean}
   */
  requestTakeback(e) {
    return !this.isActive || !this.config.allowTakeback || this.moveHistory.length === 0 ? !1 : (this.pendingTakeback = e, this._emit("takebackRequested", { requester: e }), this.config.onTakebackRequest && this.config.onTakebackRequest({ requester: e }), !0);
  }
  /**
   * Accept takeback request
   * @returns {boolean}
   */
  acceptTakeback() {
    if (!this.pendingTakeback) return !1;
    this.chessboard.undoMove(), this.chessboard.forceSync();
    const e = this.moveHistory.pop();
    return this.moveNotations.pop(), this.pendingTakeback = null, this._emit("takebackAccepted", { move: e }), !0;
  }
  /**
   * Decline takeback request
   */
  declineTakeback() {
    if (!this.pendingTakeback) return;
    const e = this.pendingTakeback;
    this.pendingTakeback = null, this._emit("takebackDeclined", { requester: e });
  }
  /**
   * Resign the game
   * @param {'w'|'b'} resigner - Player resigning
   */
  resign(e) {
    if (!this.isActive) return;
    this._stopTimer();
    const t = e === "w" ? "b" : "w";
    this._emit("gameEnd", {
      result: "resignation",
      winner: t,
      reason: `${this.players[e].name} resigned`
    }), this.config.onGameEnd && this.config.onGameEnd({ result: "resignation", winner: t }), this.stop();
  }
  /**
   * Get move history in PGN format
   * @returns {string}
   */
  getPGN() {
    const e = [];
    for (let t = 0; t < this.moveNotations.length; t += 2) {
      const i = Math.floor(t / 2) + 1, s = this.moveNotations[t], n = this.moveNotations[t + 1] || "";
      e.push(`${i}. ${s} ${n}`);
    }
    return e.join(" ");
  }
  /**
   * Get formatted time string
   * @param {'w'|'b'} color - Player color
   * @returns {string}
   */
  getFormattedTime(e) {
    var n;
    const t = (n = this.players[e]) == null ? void 0 : n.timeRemaining;
    if (t == null) return "--:--";
    const i = Math.floor(t / 60), s = t % 60;
    return `${i.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  /**
   * Get legal moves for a square
   * @param {string} square - Square to check
   * @returns {string[]} - Array of target squares
   */
  getLegalMoves(e) {
    var s;
    const t = (s = this.chessboard.positionService) == null ? void 0 : s.getGame();
    return t ? t.moves({ square: e, verbose: !0 }).map((n) => n.to) : [];
  }
  /**
   * Check if player is in check
   * @returns {boolean}
   */
  isInCheck() {
    var t, i;
    const e = (t = this.chessboard.positionService) == null ? void 0 : t.getGame();
    return ((i = e == null ? void 0 : e.isCheck) == null ? void 0 : i.call(e)) || !1;
  }
  /**
   * Get mode-specific stats
   * @override
   * @returns {Object}
   */
  getStats() {
    return {
      ...super.getStats(),
      players: this.players,
      moveNotations: this.moveNotations,
      pgn: this.getPGN(),
      isInCheck: this.isInCheck(),
      pendingDrawOffer: this.pendingDrawOffer,
      pendingTakeback: this.pendingTakeback,
      gameDuration: this.gameStartTime ? Date.now() - this.gameStartTime : 0
    };
  }
  /**
   * Reset PvP game
   * @override
   */
  reset() {
    super.reset(), this._stopTimer(), this.moveNotations = [], this.pendingDrawOffer = null, this.pendingTakeback = null, this.config.timeControl && (this.players.w.timeRemaining = this.config.timeControl.initial, this.players.b.timeRemaining = this.config.timeControl.initial);
  }
  /**
   * Serialize mode state
   * @override
   * @returns {Object}
   */
  serialize() {
    return {
      ...super.serialize(),
      players: this.players,
      moveNotations: this.moveNotations,
      pendingDrawOffer: this.pendingDrawOffer,
      pendingTakeback: this.pendingTakeback,
      gameStartTime: this.gameStartTime
    };
  }
  /**
   * Restore mode state
   * @override
   * @param {Object} state - Serialized state
   */
  restore(e) {
    super.restore(e), e.players && (this.players = e.players), e.moveNotations && (this.moveNotations = e.moveNotations), e.pendingDrawOffer && (this.pendingDrawOffer = e.pendingDrawOffer), e.pendingTakeback && (this.pendingTakeback = e.pendingTakeback), e.gameStartTime && (this.gameStartTime = e.gameStartTime);
  }
}
const ce = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 2e4
}, $t = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  n: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
  ],
  b: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
  ],
  r: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0]
  ],
  q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20]
  ],
  k: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20]
  ]
}, Ft = {
  // Starting position responses
  rnbqkbnr_pppppppp_8_8_8_8_PPPPPPPP_RNBQKBNR: ["e2e4", "d2d4", "c2c4", "g1f3"],
  // After 1.e4
  rnbqkbnr_pppppppp_8_8_4P3_8_PPPP1PPP_RNBQKBNR: ["e7e5", "c7c5", "e7e6", "c7c6"],
  // After 1.d4
  rnbqkbnr_pppppppp_8_8_3P4_8_PPP1PPPP_RNBQKBNR: ["d7d5", "g8f6", "e7e6"]
};
class Oe {
  /**
   * @param {Object} game - Chess.js game instance
   * @param {AIConfig} [config={}] - AI configuration
   */
  constructor(e, t = {}) {
    this.game = e, this.config = {
      difficulty: 5,
      maxDepth: 4,
      maxTime: 5e3,
      useOpeningBook: !0,
      randomizeEquivalent: !0,
      strategy: "alphabeta",
      ...t
    }, this._adjustDifficulty(), this.nodesSearched = 0, this.startTime = 0;
  }
  /**
   * Adjust search parameters based on difficulty
   * @private
   */
  _adjustDifficulty() {
    const e = Math.max(1, Math.min(10, this.config.difficulty));
    this.config.maxDepth = Math.ceil(e / 2), this.mistakeProbability = Math.max(0, (5 - e) * 0.1);
  }
  /**
   * Set difficulty level
   * @param {number} level - Difficulty (1-10)
   */
  setDifficulty(e) {
    this.config.difficulty = e, this._adjustDifficulty();
  }
  /**
   * Get best move for current position
   * @returns {Object|null} - Move object { from, to, promotion }
   */
  getBestMove() {
    this.nodesSearched = 0, this.startTime = Date.now();
    const e = this.game.moves({ verbose: !0 });
    if (e.length === 0) return null;
    if (this.config.useOpeningBook && this.game.history().length < 10) {
      const i = this._getBookMove();
      if (i) return i;
    }
    if (this.mistakeProbability > 0 && Math.random() < this.mistakeProbability)
      return this._getRandomMove(e);
    let t;
    switch (this.config.strategy) {
      case "random":
        t = this._getRandomMove(e);
        break;
      case "minimax":
        t = this._minimaxRoot(e);
        break;
      case "alphabeta":
      default:
        t = this._alphabetaRoot(e);
        break;
    }
    return t;
  }
  /**
   * Get move from opening book
   * @private
   * @returns {Object|null}
   */
  _getBookMove() {
    const e = this.game.fen().split(" ")[0].replace(/\//g, "_"), t = Ft[e];
    if (t && t.length > 0) {
      const i = t[Math.floor(Math.random() * t.length)], s = i.substring(0, 2), n = i.substring(2, 4), r = i.length > 4 ? i[4] : void 0;
      return { from: s, to: n, promotion: r };
    }
    return null;
  }
  /**
   * Get random legal move
   * @private
   * @param {Object[]} moves - Legal moves
   * @returns {Object}
   */
  _getRandomMove(e) {
    const t = Math.floor(Math.random() * e.length), i = e[t];
    return { from: i.from, to: i.to, promotion: i.promotion };
  }
  /**
   * Minimax root function
   * @private
   * @param {Object[]} moves - Legal moves
   * @returns {Object}
   */
  _minimaxRoot(e) {
    let t = null, i = -1 / 0;
    const s = this.game.turn() === "w";
    for (const n of e) {
      this.game.move(n);
      const r = this._minimax(this.config.maxDepth - 1, !s);
      this.game.undo(), (r > i || r === i && Math.random() < 0.3) && (i = r, t = n);
    }
    return t ? { from: t.from, to: t.to, promotion: t.promotion } : null;
  }
  /**
   * Minimax algorithm
   * @private
   * @param {number} depth - Remaining depth
   * @param {boolean} isMaximizing - Maximizing player
   * @returns {number} - Position evaluation
   */
  _minimax(e, t) {
    if (this.nodesSearched++, e === 0 || this.game.isGameOver())
      return this._evaluate();
    const i = this.game.moves({ verbose: !0 });
    if (t) {
      let n = -1 / 0;
      for (const r of i) {
        this.game.move(r);
        const o = this._minimax(e - 1, !1);
        this.game.undo(), n = Math.max(n, o);
      }
      return n;
    }
    let s = 1 / 0;
    for (const n of i) {
      this.game.move(n);
      const r = this._minimax(e - 1, !0);
      this.game.undo(), s = Math.min(s, r);
    }
    return s;
  }
  /**
   * Alpha-beta root function
   * @private
   * @param {Object[]} moves - Legal moves
   * @returns {Object}
   */
  _alphabetaRoot(e) {
    let t = null, i = -1 / 0, s = -1 / 0;
    const n = 1 / 0, r = this.game.turn() === "w", o = this._sortMoves(e);
    for (const c of o) {
      this.game.move(c);
      const h = -this._alphabeta(this.config.maxDepth - 1, -n, -s, !r);
      if (this.game.undo(), (h > i || h === i && this.config.randomizeEquivalent && Math.random() < 0.3) && (i = h, t = c), s = Math.max(s, h), Date.now() - this.startTime > this.config.maxTime) break;
    }
    return t ? { from: t.from, to: t.to, promotion: t.promotion } : null;
  }
  /**
   * Alpha-beta pruning algorithm (negamax variant)
   * @private
   * @param {number} depth - Remaining depth
   * @param {number} alpha - Alpha value
   * @param {number} beta - Beta value
   * @param {boolean} isWhite - White to move
   * @returns {number} - Position evaluation
   */
  _alphabeta(e, t, i, s) {
    if (this.nodesSearched++, Date.now() - this.startTime > this.config.maxTime)
      return this._evaluate() * (s ? 1 : -1);
    if (e === 0)
      return this._quiesce(t, i, s);
    if (this.game.isGameOver())
      return this.game.isCheckmate() ? -1 / 0 + (this.config.maxDepth - e) : 0;
    const n = this._sortMoves(this.game.moves({ verbose: !0 }));
    for (const r of n) {
      this.game.move(r);
      const o = -this._alphabeta(e - 1, -i, -t, !s);
      if (this.game.undo(), o >= i)
        return i;
      t = Math.max(t, o);
    }
    return t;
  }
  /**
   * Quiescence search - search captures to avoid horizon effect
   * @private
   * @param {number} alpha - Alpha value
   * @param {number} beta - Beta value
   * @param {boolean} isWhite - White to move
   * @returns {number}
   */
  _quiesce(e, t, i) {
    const s = this._evaluate() * (i ? 1 : -1);
    if (s >= t)
      return t;
    s > e && (e = s);
    const n = this.game.moves({ verbose: !0 }).filter((r) => r.captured);
    for (const r of n) {
      this.game.move(r);
      const o = -this._quiesce(-t, -e, !i);
      if (this.game.undo(), o >= t)
        return t;
      e = Math.max(e, o);
    }
    return e;
  }
  /**
   * Sort moves for better alpha-beta pruning
   * @private
   * @param {Object[]} moves - Moves to sort
   * @returns {Object[]}
   */
  _sortMoves(e) {
    return e.sort((t, i) => {
      var s, n, r, o;
      if (t.captured && !i.captured) return -1;
      if (!t.captured && i.captured) return 1;
      if (t.captured && i.captured) {
        const c = ce[t.captured] - ce[t.piece];
        return ce[i.captured] - ce[i.piece] - c;
      }
      return t.promotion && !i.promotion ? -1 : !t.promotion && i.promotion ? 1 : (s = t.san) != null && s.includes("+") && !((n = i.san) != null && n.includes("+")) ? -1 : !((r = t.san) != null && r.includes("+")) && ((o = i.san) != null && o.includes("+")) ? 1 : 0;
    });
  }
  /**
   * Evaluate the current position
   * @private
   * @returns {number} - Evaluation (positive = white advantage)
   */
  _evaluate() {
    const e = this.game.board();
    let t = 0;
    for (let s = 0; s < 8; s++)
      for (let n = 0; n < 8; n++) {
        const r = e[s][n];
        if (!r) continue;
        const o = ce[r.type] || 0, c = this._getPositionValue(r.type, s, n, r.color), h = o + c;
        t += r.color === "w" ? h : -h;
      }
    const i = this._evaluateMobility();
    return t += i, t;
  }
  /**
   * Get position value from piece-square tables
   * @private
   * @param {string} piece - Piece type
   * @param {number} row - Row (0-7)
   * @param {number} col - Column (0-7)
   * @param {'w'|'b'} color - Piece color
   * @returns {number}
   */
  _getPositionValue(e, t, i, s) {
    const n = $t[e];
    if (!n) return 0;
    const r = s === "w" ? t : 7 - t;
    return n[r][i];
  }
  /**
   * Evaluate mobility (number of legal moves)
   * @private
   * @returns {number}
   */
  _evaluateMobility() {
    const e = this.game.turn(), t = this.game.moves().length;
    return e === "w" ? t * 10 : -t * 10;
  }
  /**
   * Get search statistics
   * @returns {Object}
   */
  getStats() {
    return {
      nodesSearched: this.nodesSearched,
      timeElapsed: Date.now() - this.startTime,
      depth: this.config.maxDepth,
      difficulty: this.config.difficulty
    };
  }
}
const te = class te extends de {
  /**
   * @param {Object} chessboard - Reference to the chessboard instance
   * @param {VsBotModeConfig} [config={}] - Mode configuration
   */
  constructor(e, t = {}) {
    super(e, {
      name: "vsBot",
      enforceRules: !0,
      allowFreeMovement: !1,
      allowPieceCreation: !1,
      allowPieceRemoval: !1,
      trackTurns: !0,
      detectGameEnd: !0,
      playerColor: "w",
      botDifficulty: 5,
      botThinkingTime: 1e3,
      showBotThinking: !0,
      allowHints: !0,
      allowTakeback: !0,
      autoMove: !0,
      ...t
    }), this.ai = null, this.engine = t.engine || null, this.botColor = this.config.playerColor === "w" ? "b" : "w", this.isThinking = !1, this.thinkingTimeout = null, this.hintsUsed = 0, this.lastBotMove = null, this.useExternalEngine = !!t.engine;
  }
  /**
   * Start vs bot game
   * @override
   */
  start() {
    super.start(), this._initializeAI(), this._emit("gameStart", {
      playerColor: this.config.playerColor,
      botColor: this.botColor,
      difficulty: this.config.botDifficulty,
      difficultyName: te.DIFFICULTY_NAMES[this.config.botDifficulty]
    }), this.botColor === "w" && this.config.autoMove && this._scheduleBotMove();
  }
  /**
   * Stop vs bot game
   * @override
   */
  stop() {
    this._cancelBotMove(), super.stop();
  }
  /**
   * Initialize AI engine
   * @private
   */
  _initializeAI() {
    var t;
    const e = (t = this.chessboard.positionService) == null ? void 0 : t.getGame();
    if (!e) {
      console.error("[VsBotMode] Cannot initialize AI: no game instance");
      return;
    }
    this.ai = new Oe(e, {
      difficulty: this.config.botDifficulty
    });
  }
  /**
   * Set bot difficulty
   * @param {number} level - Difficulty (1-10)
   */
  setDifficulty(e) {
    this.config.botDifficulty = Math.max(1, Math.min(10, e)), this.ai && this.ai.setDifficulty(this.config.botDifficulty), this._emit("difficultyChanged", {
      difficulty: this.config.botDifficulty,
      difficultyName: te.DIFFICULTY_NAMES[this.config.botDifficulty]
    });
  }
  /**
   * Get difficulty name
   * @returns {string}
   */
  getDifficultyName() {
    return te.DIFFICULTY_NAMES[this.config.botDifficulty] || "Unknown";
  }
  /**
   * Set player color
   * @param {'w'|'b'} color - Player color
   */
  setPlayerColor(e) {
    this.config.playerColor = e, this.botColor = e === "w" ? "b" : "w", this._emit("playerColorChanged", {
      playerColor: e,
      botColor: this.botColor
    });
  }
  /**
   * Set external engine for bot moves
   * @param {Object} engine - Engine instance (StockfishEngine, UCIEngine, CloudEngine)
   * @param {Object} [options={}] - Engine options
   * @param {number} [options.depth=20] - Search depth
   * @param {number} [options.moveTime=1000] - Move time in ms
   */
  setEngine(e, t = {}) {
    var i;
    this.engine = e, this.useExternalEngine = !!e, this.config.engineDepth = t.depth || this.config.engineDepth || 20, this.config.engineMoveTime = t.moveTime || this.config.engineMoveTime || 1e3, e && e.on("info", (s) => {
      this._emit("engineInfo", s), this.config.onEngineInfo && this.config.onEngineInfo(s);
    }), this._emit("engineChanged", {
      engine: ((i = e == null ? void 0 : e.getInfo) == null ? void 0 : i.call(e)) || null,
      useExternalEngine: this.useExternalEngine
    });
  }
  /**
   * Remove external engine and use built-in AI
   */
  removeEngine() {
    this.engine = null, this.useExternalEngine = !1, this._emit("engineChanged", { engine: null, useExternalEngine: !1 });
  }
  /**
   * Check if using external engine
   * @returns {boolean}
   */
  isUsingExternalEngine() {
    return this.useExternalEngine && this.engine !== null;
  }
  /**
   * Check if it's the human player's turn
   * @returns {boolean}
   */
  isPlayerTurn() {
    return this.getCurrentTurn() === this.config.playerColor;
  }
  /**
   * Check if it's the bot's turn
   * @returns {boolean}
   */
  isBotTurn() {
    return this.getCurrentTurn() === this.botColor;
  }
  /**
   * Execute a player move
   * @override
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {Object} [options={}] - Additional options
   * @returns {boolean}
   */
  executeMove(e, t, i = {}) {
    if (!this.isActive) return !1;
    if (!this.isPlayerTurn())
      return this._emit("invalidMove", { reason: "It's the bot's turn", from: e, to: t }), !1;
    if (!this.canMove(e, t, i))
      return this._emit("invalidMove", { reason: "Illegal move", from: e, to: t }), !1;
    const s = `${e}${t}${i.promotion || ""}`;
    if (!this.chessboard.movePiece(s))
      return this._emit("invalidMove", { reason: "Move failed", from: e, to: t }), !1;
    const r = {
      from: e,
      to: t,
      player: "human",
      timestamp: Date.now(),
      ...i
    };
    return this.moveHistory.push(r), this._emit("move", r), this.config.onMove && this.config.onMove(r), this._checkGameEnd() || this.config.autoMove && this._scheduleBotMove(), !0;
  }
  /**
   * Schedule bot move with thinking time
   * @private
   */
  _scheduleBotMove() {
    if (this.isThinking) return;
    this.isThinking = !0, this._emit("botThinking", { thinking: !0 }), this.config.onBotThinking && this.config.onBotThinking(!0);
    const e = Math.max(
      this.config.botThinkingTime,
      Math.random() * 500 + 500
      // Add some randomness
    );
    this.thinkingTimeout = setTimeout(() => {
      this._makeBotMove();
    }, e);
  }
  /**
   * Cancel pending bot move
   * @private
   */
  _cancelBotMove() {
    this.thinkingTimeout && (clearTimeout(this.thinkingTimeout), this.thinkingTimeout = null), this.isThinking = !1;
  }
  /**
   * Execute bot move
   * @private
   */
  async _makeBotMove() {
    var n, r, o;
    if (this.isThinking = !1, !this.isActive) {
      this._emit("botThinking", { thinking: !1 });
      return;
    }
    let e = null, t = null;
    if (this.useExternalEngine && this.engine)
      try {
        e = await this._getEngineBestMove(), t = { source: "external", engine: ((o = (r = (n = this.engine).getInfo) == null ? void 0 : r.call(n)) == null ? void 0 : o.name) || "unknown" };
      } catch (c) {
        console.warn("[VsBotMode] External engine failed, falling back to AI:", c), this.ai && (e = this.ai.getBestMove(), t = { source: "builtin", ...this.ai.getStats() });
      }
    else this.ai && (e = this.ai.getBestMove(), t = { source: "builtin", ...this.ai.getStats() });
    if (!e) {
      this._emit("botThinking", { thinking: !1 }), this._checkGameEnd();
      return;
    }
    const i = `${e.from}${e.to}${e.promotion || ""}`;
    if (this.chessboard.movePiece(i)) {
      const c = {
        ...e,
        player: "bot",
        timestamp: Date.now(),
        stats: t
      };
      this.moveHistory.push(c), this.lastBotMove = c, this._emit("botMove", c), this.config.onBotMove && this.config.onBotMove(c), this._checkGameEnd();
    }
    this._emit("botThinking", { thinking: !1 }), this.config.onBotThinking && this.config.onBotThinking(!1);
  }
  /**
   * Get best move from external engine
   * @private
   * @returns {Promise<Object>}
   */
  async _getEngineBestMove() {
    if (!this.engine || !this.engine.ready())
      throw new Error("Engine not ready");
    const e = this.chessboard.fen();
    await this.engine.setPosition(e);
    const t = await this.engine.go({
      depth: this.config.engineDepth || 20,
      moveTime: this.config.engineMoveTime || 1e3
    });
    if (!(t != null && t.bestMove))
      return null;
    const i = t.bestMove;
    return {
      from: i.substring(0, 2),
      to: i.substring(2, 4),
      promotion: i.length > 4 ? i[4] : void 0,
      score: t.score,
      depth: t.depth,
      pv: t.pv
    };
  }
  /**
   * Trigger bot move manually (if autoMove is disabled)
   */
  triggerBotMove() {
    this.isBotTurn() && this._scheduleBotMove();
  }
  /**
   * Get hint for player
   * @returns {Promise<Object|null>} - Suggested move
   */
  async getHint() {
    var t;
    if (!this.config.allowHints || !this.isPlayerTurn()) return null;
    let e = null;
    if (this.useExternalEngine && this.engine && this.engine.ready())
      try {
        const i = this.chessboard.fen();
        await this.engine.setPosition(i);
        const s = await this.engine.go({
          depth: Math.min(this.config.engineDepth || 20, 15),
          // Faster for hints
          moveTime: 500
        });
        if (s != null && s.bestMove) {
          const n = s.bestMove;
          e = {
            from: n.substring(0, 2),
            to: n.substring(2, 4),
            promotion: n.length > 4 ? n[4] : void 0,
            score: s.score,
            source: "engine"
          };
        }
      } catch (i) {
        console.warn("[VsBotMode] Engine hint failed:", i);
      }
    if (!e) {
      const i = (t = this.chessboard.positionService) == null ? void 0 : t.getGame();
      if (!i) return null;
      e = new Oe(i, { difficulty: 8 }).getBestMove(), e && (e.source = "builtin");
    }
    return e && (this.hintsUsed++, this._emit("hintUsed", { hint: e, totalHints: this.hintsUsed })), e;
  }
  /**
   * Request takeback
   * @returns {boolean}
   */
  requestTakeback() {
    if (!this.config.allowTakeback || this.moveHistory.length < 2 || this.isThinking) return !1;
    this.chessboard.undoMove(), this.chessboard.undoMove(), this.chessboard.forceSync();
    const e = this.moveHistory.pop(), t = this.moveHistory.pop();
    return this._emit("takeback", { playerMove: t, botMove: e }), !0;
  }
  /**
   * Resign the game
   */
  resign() {
    this.isActive && (this._cancelBotMove(), this._emit("gameEnd", {
      result: "resignation",
      winner: this.botColor,
      reason: "Player resigned"
    }), this.config.onGameEnd && this.config.onGameEnd({ result: "resignation", winner: this.botColor }), this.stop());
  }
  /**
   * Check for game end conditions
   * @private
   * @returns {boolean}
   */
  _checkGameEnd() {
    var n, r, o, c, h, l;
    const e = (n = this.chessboard.positionService) == null ? void 0 : n.getGame();
    if (!e) return !1;
    let t = null, i = null, s = "";
    if ((r = e.isCheckmate) != null && r.call(e) ? (i = this.getCurrentTurn() === "w" ? "b" : "w", t = "checkmate", s = `Checkmate! ${i === this.config.playerColor ? "Player" : "Bot"} wins`) : (o = e.isStalemate) != null && o.call(e) ? (t = "stalemate", s = "Stalemate - Draw") : (c = e.isThreefoldRepetition) != null && c.call(e) ? (t = "repetition", s = "Draw by threefold repetition") : (h = e.isInsufficientMaterial) != null && h.call(e) ? (t = "insufficient", s = "Draw by insufficient material") : (l = e.isDraw) != null && l.call(e) && (t = "draw", s = "Draw"), t) {
      this._cancelBotMove();
      const d = i === this.config.playerColor;
      return this._emit("gameEnd", {
        result: t,
        winner: i,
        reason: s,
        isPlayerWin: d
      }), this.config.onGameEnd && this.config.onGameEnd({ result: t, winner: i, reason: s, isPlayerWin: d }), !0;
    }
    return !1;
  }
  /**
   * Analyze current position
   * @returns {Promise<Object>}
   */
  async analyzePosition() {
    var r, o;
    const e = (r = this.chessboard.positionService) == null ? void 0 : r.getGame();
    if (!e) return null;
    let t = null, i = null, s = "builtin";
    if (this.useExternalEngine && this.engine && this.engine.ready())
      try {
        const c = this.chessboard.fen();
        await this.engine.setPosition(c);
        const h = await this.engine.go({
          depth: this.config.engineDepth || 20,
          moveTime: this.config.engineMoveTime || 2e3
        });
        if (h != null && h.bestMove) {
          const l = h.bestMove;
          t = {
            from: l.substring(0, 2),
            to: l.substring(2, 4),
            promotion: l.length > 4 ? l[4] : void 0
          }, i = {
            score: h.score,
            depth: h.depth,
            nodes: h.nodes,
            nps: h.nps,
            pv: h.pv,
            time: h.time
          }, s = "engine";
        }
      } catch (c) {
        console.warn("[VsBotMode] Engine analysis failed:", c);
      }
    if (!t && this.ai) {
      const c = new Oe(e, { difficulty: 10 });
      t = c.getBestMove(), i = c.getStats();
    }
    const n = e.moves({ verbose: !0 });
    return {
      bestMove: t,
      legalMoves: n.length,
      isCheck: ((o = e.isCheck) == null ? void 0 : o.call(e)) || !1,
      turn: e.turn(),
      stats: i,
      source: s
    };
  }
  /**
   * Get mode-specific stats
   * @override
   * @returns {Object}
   */
  getStats() {
    var e, t, i, s, n;
    return {
      ...super.getStats(),
      playerColor: this.config.playerColor,
      botColor: this.botColor,
      difficulty: this.config.botDifficulty,
      difficultyName: this.getDifficultyName(),
      hintsUsed: this.hintsUsed,
      isThinking: this.isThinking,
      lastBotMove: this.lastBotMove,
      aiStats: ((e = this.ai) == null ? void 0 : e.getStats()) || null,
      useExternalEngine: this.useExternalEngine,
      engineInfo: ((i = (t = this.engine) == null ? void 0 : t.getInfo) == null ? void 0 : i.call(t)) || null,
      engineReady: ((n = (s = this.engine) == null ? void 0 : s.ready) == null ? void 0 : n.call(s)) || !1
    };
  }
  /**
   * Reset vs bot game
   * @override
   */
  reset() {
    super.reset(), this._cancelBotMove(), this.hintsUsed = 0, this.lastBotMove = null, this._initializeAI();
  }
  /**
   * Serialize mode state
   * @override
   * @returns {Object}
   */
  serialize() {
    return {
      ...super.serialize(),
      playerColor: this.config.playerColor,
      botColor: this.botColor,
      botDifficulty: this.config.botDifficulty,
      hintsUsed: this.hintsUsed,
      lastBotMove: this.lastBotMove
    };
  }
  /**
   * Restore mode state
   * @override
   * @param {Object} state - Serialized state
   */
  restore(e) {
    super.restore(e), e.playerColor && (this.config.playerColor = e.playerColor), e.botColor && (this.botColor = e.botColor), e.botDifficulty && this.setDifficulty(e.botDifficulty), e.hintsUsed && (this.hintsUsed = e.hintsUsed), e.lastBotMove && (this.lastBotMove = e.lastBotMove);
  }
};
/**
 * Difficulty level descriptions
 * @static
 */
y(te, "DIFFICULTY_NAMES", {
  1: "Beginner",
  2: "Easy",
  3: "Easy+",
  4: "Medium-",
  5: "Medium",
  6: "Medium+",
  7: "Hard-",
  8: "Hard",
  9: "Expert",
  10: "Master"
});
let Be = te;
const Ee = class Ee {
  /**
   * @param {Object} chessboard - Reference to the chessboard instance
   */
  constructor(e) {
    this.chessboard = e, this.currentMode = null, this.modes = /* @__PURE__ */ new Map(), this.listeners = /* @__PURE__ */ new Map(), this._initializeDefaultModes();
  }
  /**
   * Initialize default modes
   * @private
   */
  _initializeDefaultModes() {
    Object.entries(Ee.MODES).forEach(([e, t]) => {
      this.registerMode(e, t);
    });
  }
  /**
   * Register a custom mode
   * @param {string} name - Mode name
   * @param {typeof BaseMode} ModeClass - Mode class constructor
   * @param {Object} [defaultConfig={}] - Default configuration
   */
  registerMode(e, t, i = {}) {
    this.modes.set(e, {
      ModeClass: t,
      defaultConfig: i,
      instance: null
    });
  }
  /**
   * Get or create a mode instance
   * @param {string} name - Mode name
   * @param {Object} [config={}] - Mode configuration
   * @returns {BaseMode|null}
   */
  getMode(e, t = {}) {
    const i = this.modes.get(e);
    if (!i)
      return console.error(`[ModeManager] Unknown mode: ${e}`), null;
    if (!i.instance) {
      const s = { ...i.defaultConfig, ...t };
      i.instance = new i.ModeClass(this.chessboard, s);
    }
    return i.instance;
  }
  /**
   * Set the active mode
   * @param {ModeType|string} modeName - Name of the mode to activate
   * @param {Object} [config={}] - Mode configuration
   * @returns {BaseMode|null} - The activated mode
   */
  setMode(e, t = {}) {
    this.currentMode && (this.currentMode.stop(), this._emit("modeChanged", {
      from: this.currentMode.getName(),
      to: e
    }));
    const i = this.getMode(e, t);
    return i ? (this.currentMode = i, i.start(), this._emit("modeActivated", {
      mode: e,
      config: i.config
    }), i) : null;
  }
  /**
   * Get the current active mode
   * @returns {BaseMode|null}
   */
  getCurrentMode() {
    return this.currentMode;
  }
  /**
   * Get current mode name
   * @returns {string|null}
   */
  getCurrentModeName() {
    return this.currentMode ? this.currentMode.getName() : null;
  }
  /**
   * Check if a specific mode is active
   * @param {string} modeName - Mode name to check
   * @returns {boolean}
   */
  isModeActive(e) {
    return this.currentMode && this.currentMode.getName() === e;
  }
  /**
   * Get list of available modes
   * @returns {string[]}
   */
  getAvailableModes() {
    return Array.from(this.modes.keys());
  }
  /**
   * Check if a move is allowed in current mode
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {Object} [options={}] - Additional options
   * @returns {boolean}
   */
  canMove(e, t, i = {}) {
    return this.currentMode ? this.currentMode.canMove(e, t, i) : !0;
  }
  /**
   * Execute a move in current mode
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {Object} [options={}] - Additional options
   * @returns {boolean}
   */
  executeMove(e, t, i = {}) {
    return this.currentMode ? this.currentMode.executeMove(e, t, i) : !1;
  }
  /**
   * Check if piece creation is allowed
   * @returns {boolean}
   */
  canCreatePiece() {
    return this.currentMode ? this.currentMode.canCreatePiece() : !1;
  }
  /**
   * Check if piece removal is allowed
   * @returns {boolean}
   */
  canRemovePiece() {
    return this.currentMode ? this.currentMode.canRemovePiece() : !1;
  }
  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(e, t) {
    this.listeners.has(e) || this.listeners.set(e, []), this.listeners.get(e).push(t);
  }
  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(e, t) {
    if (!this.listeners.has(e)) return;
    const i = this.listeners.get(e), s = i.indexOf(t);
    s > -1 && i.splice(s, 1);
  }
  /**
   * Emit event
   * @private
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  _emit(e, t) {
    this.listeners.has(e) && this.listeners.get(e).forEach((i) => {
      try {
        i(t);
      } catch (s) {
        console.error(`[ModeManager] Error in event listener for ${e}:`, s);
      }
    });
  }
  /**
   * Reset current mode
   */
  reset() {
    this.currentMode && this.currentMode.reset();
  }
  /**
   * Stop current mode
   */
  stop() {
    this.currentMode && (this.currentMode.stop(), this.currentMode = null);
  }
  /**
   * Destroy the mode manager
   */
  destroy() {
    this.stop(), this.modes.clear(), this.listeners.clear();
  }
  /**
   * Get statistics for current mode
   * @returns {Object|null}
   */
  getStats() {
    return this.currentMode ? this.currentMode.getStats() : null;
  }
  /**
   * Serialize current state
   * @returns {Object}
   */
  serialize() {
    return {
      currentMode: this.currentMode ? this.currentMode.serialize() : null,
      availableModes: this.getAvailableModes()
    };
  }
};
/**
 * Available mode constructors
 * @static
 */
y(Ee, "MODES", {
  creative: Ne,
  pvp: xt,
  vsBot: Be
});
let xe = Ee, we = class {
  /**
   * Creates a new Chessboard instance
   * @param {Object} config - Configuration object
   * @throws {ConfigurationError} If configuration is invalid
   */
  constructor(e) {
    try {
      this._performanceMonitor = new st(), this._performanceMonitor.startMeasure("chessboard-initialization"), this._validateAndInitializeConfig(e), this._initializeServices(), this._initialize(), this._performanceMonitor.endMeasure("chessboard-initialization");
    } catch (t) {
      this._handleConstructorError(t);
    }
    this._undoneMoves = [], this._doUpdateBoardPieces(!1, !0);
  }
  /**
   * Validates and initializes configuration
   * @private
   * @param {Object} config - Raw configuration object
   * @throws {ConfigurationError} If configuration is invalid
   */
  _validateAndInitializeConfig(e) {
    if (!e || typeof e != "object")
      throw new O("Configuration must be an object", "config", e);
    if (this.config = new et(e), !this.config.id_div)
      throw new O(
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
    throw console.error("Chessboard initialization failed:", e), this._cleanup(), e instanceof U ? e : new U("Failed to initialize chessboard", "INITIALIZATION_ERROR", {
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
    this.validationService = new Ge(), this.coordinateService = new St(this.config), this.positionService = new Bt(this.config), this.boardService = new bt(this.config), this.pieceService = new Et(this.config), this.animationService = new _t(this.config), this.moveService = new Pt(this.config, this.positionService), this.eventService = new wt(
      this.config,
      this.boardService,
      this.moveService,
      this.coordinateService,
      this
    ), this._updateTimeout = null, this._isAnimating = !1, this.modeManager = new xe(this), this._boundUpdateBoardPieces = this._updateBoardPieces.bind(this), this._boundOnSquareClick = this._onSquareClick.bind(this), this._boundOnPieceHover = this._onPieceHover.bind(this), this._boundOnPieceLeave = this._onPieceLeave.bind(this);
  }
  /**
   * Initializes the board
   * @private
   */
  _initialize() {
    this._initParams(), this._setGame(this.config.position), this._buildBoard(), this._buildSquares(), this._addListeners(), this._doUpdateBoardPieces(!1, !0);
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
    const n = new Z(e, t, i);
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
      throw new U("Game not initialized", "GAME_ERROR");
    const s = this.moveService.executeMove(e);
    if (!s) {
      console.error("Move execution failed unexpectedly for move:", e), this._updateBoardPieces(!1);
      return;
    }
    this.boardService.applyToAllSquares("unmoved"), e.from.moved(), e.to.moved();
    const n = this.moveService.isCastle(s), r = this.moveService.isEnPassant(s);
    if (t && e.from.piece)
      if (n) {
        let o = !1, c = !1;
        const h = () => {
          o && c && (this._updateBoardPieces(!1), this.config.onMoveEnd(s));
        };
        this.pieceService.translatePiece(
          e,
          !!e.to.piece,
          t,
          this._createDragFunction.bind(this),
          () => {
            o = !0, h();
          }
        ), this._handleCastleMove(s, !0, !1, () => {
          c = !0, h();
        });
      } else r ? this.pieceService.translatePiece(
        e,
        !1,
        // Don't remove target - en passant captures on different square
        t,
        this._createDragFunction.bind(this),
        () => {
          this._handleEnPassantMove(s, !0), this.config.onMoveEnd(s), this._updateBoardPieces(!1);
        }
      ) : this.pieceService.translatePiece(
        e,
        !!e.to.piece,
        t,
        this._createDragFunction.bind(this),
        () => {
          this.config.onMoveEnd(s), this._updateBoardPieces(!1);
        }
      );
    else
      n ? this._handleSpecialMove(s) : r && this._handleSpecialMove(s), this._updateBoardPieces(!1), this.config.onMoveEnd(s);
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
   * @param {boolean} [updateBoard=true] - Whether to update board after animation
   * @param {Function} [onComplete] - Callback when animation completes
   */
  _handleCastleMove(e, t, i = !0, s = null) {
    const n = this.moveService.getCastleRookMove(e);
    if (!n) {
      s && s();
      return;
    }
    const r = this.boardService.getSquare(n.from), o = this.boardService.getSquare(n.to);
    if (!r || !o) {
      s && s();
      return;
    }
    const c = r.piece;
    if (!c) {
      i && this._updateBoardPieces(!1), s && s();
      return;
    }
    t ? this.pieceService.translatePiece(
      { from: r, to: o, piece: c },
      !1,
      !0,
      this._createDragFunction.bind(this),
      () => {
        i && this._updateBoardPieces(!1), s && s();
      }
    ) : (i && this._updateBoardPieces(!1), s && s());
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
    if (t) {
      this._doSequentialUpdate(i, s, !1);
      return;
    }
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
    Object.values(e).forEach((r) => {
      s[r.id] = this.positionService.getGamePieceId(r.id);
    }), Object.values(e).forEach((r) => {
      const o = s[r.id], c = r.piece, h = c ? c.getId() : null;
      if (h !== o && (c && h !== o && this.pieceService.removePieceFromSquare(r, i), o && h !== o)) {
        const l = this.pieceService.convertPiece(o);
        this.pieceService.addPieceOnSquare(
          r,
          l,
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
      const u = d.piece, g = this.positionService.getGamePieceId(d.id);
      if (u) {
        const f = (u.color + u.type).toLowerCase();
        s[f] || (s[f] = []), s[f].push({ square: d, id: d.id });
      }
      if (g) {
        const f = g.toLowerCase();
        n[f] || (n[f] = []), n[f].push({ square: d, id: d.id });
      }
    });
    let r = 0, o = 0;
    const c = i ? 0 : this.config.simultaneousAnimationDelay;
    let h = 0;
    if (Object.keys(n).forEach((d) => {
      o += Math.max((s[d] || []).length, n[d].length);
    }), o === 0) {
      this._addListeners();
      const d = this.positionService.getGame().fen();
      t !== d && this.config.onChange(d);
      return;
    }
    const l = () => {
      if (r++, r === o) {
        this._addListeners();
        const d = this.positionService.getGame().fen();
        t !== d && this.config.onChange(d);
      }
    };
    Object.keys(n).forEach((d) => {
      const u = (s[d] || []).slice(), g = n[d].slice(), f = [];
      for (let S = 0; S < u.length; S++) {
        f[S] = [];
        for (let m = 0; m < g.length; m++)
          f[S][m] = Math.abs(u[S].square.row - g[m].square.row) + Math.abs(u[S].square.col - g[m].square.col);
      }
      const p = new Array(u.length).fill(!1), b = new Array(g.length).fill(!1), w = [];
      for (; ; ) {
        let S = 1 / 0, m = -1, E = -1;
        for (let k = 0; k < u.length; k++)
          if (!p[k])
            for (let L = 0; L < g.length; L++)
              b[L] || f[k][L] < S && (S = f[k][L], m = k, E = L);
        if (m === -1 || E === -1) break;
        if (u[m].square === g[E].square) {
          p[m] = !0, b[E] = !0;
          continue;
        }
        w.push({
          from: u[m].square,
          to: g[E].square,
          piece: u[m].square.piece
        }), p[m] = !0, b[E] = !0;
      }
      for (let S = 0; S < u.length; S++)
        p[S] || (setTimeout(() => {
          this.pieceService.removePieceFromSquare(u[S].square, !0, l);
        }, h * c), h++);
      for (let S = 0; S < g.length; S++)
        b[S] || (setTimeout(() => {
          const m = this.pieceService.convertPiece(d);
          this.pieceService.addPieceOnSquare(
            g[S].square,
            m,
            !0,
            this._createDragFunction.bind(this),
            l
          );
        }, h * c), h++);
      w.forEach((S) => {
        setTimeout(() => {
          this.pieceService.translatePiece(
            S,
            !1,
            !0,
            this._createDragFunction.bind(this),
            l
          );
        }, h * c), h++;
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
    Object.values(e).forEach((h) => {
      const l = h.piece, d = this.positionService.getGamePieceId(h.id);
      l && t.set(h.id, l.getId()), d && i.set(h.id, d);
    });
    const s = [], n = [], r = [], o = [], c = /* @__PURE__ */ new Set();
    return t.forEach((h, l) => {
      const d = i.get(l);
      h === d && (o.push({
        piece: h,
        square: l
      }), c.add(l));
    }), t.forEach((h, l) => {
      if (c.has(l))
        return;
      const d = Array.from(i.entries()).find(
        ([u, g]) => g === h && !c.has(u)
      );
      if (d) {
        const [u] = d;
        s.push({
          piece: h,
          from: l,
          to: u,
          fromSquare: e[l],
          toSquare: e[u]
        }), c.add(u);
      } else
        n.push({
          piece: h,
          square: l,
          squareObj: e[l]
        });
    }), i.forEach((h, l) => {
      c.has(l) || r.push({
        piece: h,
        square: l,
        squareObj: e[l]
      });
    }), {
      moves: s,
      removes: n,
      adds: r,
      unchanged: o,
      totalChanges: s.length + n.length + r.length
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
    const { moves: s, removes: n, adds: r } = e;
    let o = 0;
    const c = s.length + n.length + r.length;
    if (c === 0) {
      this._addListeners();
      const u = this.positionService.getGame().fen();
      t !== u && this.config.onChange(u);
      return;
    }
    const h = () => {
      if (o++, o === c) {
        this._addListeners();
        const u = this.positionService.getGame().fen();
        t !== u && this.config.onChange(u);
      }
    }, l = i ? 0 : this.config.simultaneousAnimationDelay;
    let d = 0;
    s.forEach((u) => {
      const g = d * l;
      setTimeout(() => {
        this._animatePieceMove(u, h);
      }, g), d++;
    }), n.forEach((u) => {
      const g = d * l;
      setTimeout(() => {
        this._animatePieceRemoval(u, h);
      }, g), d++;
    }), r.forEach((u) => {
      const g = d * l;
      setTimeout(() => {
        this._animatePieceAddition(u, h);
      }, g), d++;
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
      const g = e[0].toLowerCase(), f = e[1].toLowerCase(), p = "kqrbnp", b = "wb";
      if (p.includes(g) && b.includes(f))
        n = f + g;
      else if (b.includes(g) && p.includes(f))
        n = g + f;
      else
        throw new Error(`[putPiece] Invalid piece: ${e}`);
    }
    const r = this.validationService.isValidSquare(t), o = this.validationService.isValidPiece(n);
    if (!r) throw new Error(`[putPiece] Invalid square: ${t}`);
    if (!o) throw new Error(`[putPiece] Invalid piece: ${n}`);
    if (!this.positionService || !this.positionService.getGame())
      throw new Error("[putPiece] No positionService or game");
    const c = this.pieceService.convertPiece(n), h = this.boardService.getSquare(t);
    if (!h) throw new Error(`[putPiece] Square not found: ${t}`);
    h.piece = c;
    const l = { type: c.type, color: c.color };
    if (!this.positionService.getGame().put(l, t)) throw new Error(`[putPiece] Game.put failed for ${n} on ${t}`);
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
    this.coordinateService && this.coordinateService.flipOrientation && this.coordinateService.flipOrientation(), this._buildBoard && this._buildBoard(), this._buildSquares && this._buildSquares(), this._addListeners && this._addListeners(), this._updateBoardPieces && this._updateBoardPieces(!1, !0);
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
  highlight(e) {
    if (!this.validationService.isValidSquare(e)) return;
    const t = this.boardService.getSquare(e);
    t && typeof t.highlight == "function" && t.highlight();
  }
  /**
   * Remove highlight from a square
   * @param {string} square
   */
  dehighlight(e) {
    if (!this.validationService.isValidSquare(e)) return;
    const t = this.boardService.getSquare(e);
    t && typeof t.dehighlight == "function" && t.dehighlight();
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
    }), this.boardService && (this.boardService.removeSquares && this.boardService.removeSquares(), this.boardService.removeBoard && this.boardService.removeBoard()), this.modeManager && (this.modeManager.destroy(), this.modeManager = null), this.validationService = null, this.coordinateService = null, this.positionService = null, this.boardService = null, this.pieceService = null, this.animationService = null, this.moveService = null, this.eventService = null, this._performanceMonitor = null, this._undoneMoves = null, this._boundUpdateBoardPieces = null, this._boundOnSquareClick = null, this._boundOnPieceHover = null, this._boundOnPieceLeave = null;
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
  /**
   * Move a piece using coordinate notation (e.g., 'e2e4', 'e7e8q')
   * @param {string} moveStr - Move in coordinate notation
   * @param {Object} [opts] - Options
   * @param {boolean} [opts.animate=true] - Whether to animate
   * @returns {boolean} True if move was successful
   */
  movePiece(e, t = {}) {
    const i = t.animate !== void 0 ? t.animate : !0;
    if (typeof e != "string" || e.length < 4)
      return console.error("[movePiece] Invalid move format:", e), !1;
    const s = e.substring(0, 2), n = e.substring(2, 4), r = e.length > 4 ? e[4].toLowerCase() : null, o = this.boardService.getSquare(s), c = this.boardService.getSquare(n);
    return !o || !c ? (console.error("[movePiece] Invalid squares:", s, n), !1) : (this._undoneMoves = [], this._onMove(o, c, r, i));
  }
  /**
   * Force synchronization of the visual board with the game state
   * Useful after programmatic changes to ensure rendering is correct
   */
  forceSync() {
    this._updateBoardPieces(!1);
  }
  // --- MODES API ---
  /**
   * Set the active game mode
   * @param {'creative'|'pvp'|'vsBot'} modeName - Mode to activate
   * @param {Object} [config={}] - Mode configuration
   * @returns {Object|null} - The activated mode instance
   * @example
   * // Start creative mode
   * board.setMode('creative');
   *
   * // Start PvP with time control
   * board.setMode('pvp', { timeControl: { initial: 300, increment: 5 } });
   *
   * // Play against bot
   * board.setMode('vsBot', { botDifficulty: 7, playerColor: 'w' });
   */
  setMode(e, t = {}) {
    return this.modeManager.setMode(e, t);
  }
  /**
   * Get the current active mode
   * @returns {Object|null} - Current mode instance
   */
  getMode() {
    return this.modeManager.getCurrentMode();
  }
  /**
   * Alias for getMode (for backward compatibility)
   * @returns {Object|null} - Current mode instance
   */
  getCurrentMode() {
    return this.getMode();
  }
  /**
   * Get the current mode name
   * @returns {string|null} - Mode name ('creative', 'pvp', 'vsBot')
   */
  getModeName() {
    return this.modeManager.getCurrentModeName();
  }
  /**
   * Get list of available modes
   * @returns {string[]}
   */
  getAvailableModes() {
    return this.modeManager.getAvailableModes();
  }
  /**
   * Stop the current mode
   */
  stopMode() {
    this.modeManager.stop();
  }
  /**
   * Check if a specific mode is active
   * @param {string} modeName - Mode name to check
   * @returns {boolean}
   */
  isModeActive(e) {
    return this.modeManager.isModeActive(e);
  }
  /**
   * Start creative mode (shortcut)
   * @param {Object} [config={}] - Creative mode config
   * @returns {Object} - Creative mode instance
   */
  startCreativeMode(e = {}) {
    return this.setMode("creative", e);
  }
  /**
   * Start PvP mode (shortcut)
   * @param {Object} [config={}] - PvP mode config
   * @returns {Object} - PvP mode instance
   */
  startPvPMode(e = {}) {
    return this.setMode("pvp", e);
  }
  /**
   * Start vs Bot mode (shortcut)
   * @param {Object} [config={}] - VsBot mode config
   * @returns {Object} - VsBot mode instance
   */
  startVsBotMode(e = {}) {
    return this.setMode("vsBot", e);
  }
  /**
   * Get mode statistics
   * @returns {Object|null}
   */
  getModeStats() {
    return this.modeManager.getStats();
  }
  // --- ALIASES/DEPRECATED ---
  /**
   * Alias for movePiece (deprecated)
   */
  move(e, t = !0) {
    return this.movePiece(e, { animate: t });
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
    return !i || !s ? !1 : new Z(i, s, t.promotion).isLegal(this.positionService.getGame());
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
    let s = null;
    function n(o) {
      if (typeof o != "string" || o.length !== 2) return null;
      const c = o[0].toLowerCase(), h = o[1].toLowerCase(), l = "kqrbnp", d = "wb";
      return l.includes(c) && d.includes(h) ? { type: c, color: h } : d.includes(c) && l.includes(h) ? { type: h, color: c } : null;
    }
    if (typeof e == "string") {
      if (s = n(e), !s)
        return console.error(`[put] Invalid piece string: '${e}'. Use e.g. 'wQ', 'Qw', 'bK', 'kb'`), !1;
    } else if (typeof e == "object" && e.type && e.color) {
      const o = String(e.type).toLowerCase(), c = String(e.color).toLowerCase();
      if ("kqrbnp".includes(o) && "wb".includes(c))
        s = { type: o, color: c };
      else
        return console.error(
          `[put] Invalid piece object: {type: '${e.type}', color: '${e.color}'}`
        ), !1;
    } else
      return console.error("[put] Invalid pieceId:", e), !1;
    return typeof t != "string" || t.length !== 2 ? (console.error("[put] Invalid squareId:", t), !1) : this.putPiece(s, t, { animate: i });
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
  // Alias methods for highlight/dehighlight
  highlightSquare(e) {
    return this.highlight(e);
  }
  dehighlightSquare(e) {
    return this.dehighlight(e);
  }
};
const ee = Object.freeze({
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
}), Gt = Object.freeze({
  level: ee.INFO,
  enableColors: !0,
  enableTimestamp: !0,
  enableStackTrace: !0,
  maxLogSize: 1e3,
  enableConsole: !0,
  enableStorage: !1,
  storageKey: "chessboard-logs"
}), Ze = Object.freeze({
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
class Ce {
  /**
   * Creates a new Logger instance
   * @param {Object} [config] - Logger configuration
   * @param {string} [name] - Logger name/namespace
   */
  constructor(e = {}, t = "Chessboard") {
    this.config = { ...Gt, ...e }, this.name = t, this.logs = [], this.startTime = Date.now(), this.debug = this._createLogMethod("DEBUG"), this.info = this._createLogMethod("INFO"), this.warn = this._createLogMethod("WARN"), this.error = this._createLogMethod("ERROR"), this.performances = /* @__PURE__ */ new Map(), this.config.enableStorage && this._initStorage();
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
    if (ee[e] < this.config.level)
      return;
    const r = this._createLogEntry(e, t, i, s);
    this._storeLogEntry(r), this.config.enableConsole && this._outputToConsole(r), this.config.enableStorage && this._storeInStorage(r);
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
    const t = this.config.enableColors ? Ze[e.level] : "", i = this.config.enableColors ? Ze.RESET : "", s = this.config.enableTimestamp ? `[${new Date(e.timestamp).toLocaleTimeString()}] ` : "", r = `${`${t}${s}[${e.logger}:${e.level}]${i}`} ${e.message}`, o = this._getConsoleMethod(e.level);
    Object.keys(e.data).length > 0 || e.error ? o(r, {
      data: e.data,
      error: e.error,
      runtime: `${e.runtime}ms`
    }) : o(r);
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
    const i = t.measurements, s = i.reduce((c, h) => c + h, 0), n = s / i.length, r = Math.min(...i), o = Math.max(...i);
    return {
      name: e,
      count: i.length,
      total: s.toFixed(2),
      average: n.toFixed(2),
      min: r.toFixed(2),
      max: o.toFixed(2)
    };
  }
  /**
   * Creates a child logger with a specific namespace
   * @param {string} namespace - Child logger namespace
   * @returns {Logger} Child logger instance
   */
  child(e) {
    return new Ce(this.config, `${this.name}:${e}`);
  }
  /**
   * Sets log level
   * @param {string} level - Log level
   */
  setLevel(e) {
    ee[e] !== void 0 && (this.config.level = ee[e]);
  }
  /**
   * Gets current log level
   * @returns {string} Current log level
   */
  getLevel() {
    return Object.keys(ee).find((e) => ee[e] === this.config.level);
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
const je = new Ce();
function gi(a, e) {
  return new Ce(a, e);
}
class nt {
  /**
   * Creates a new ChessboardFactory instance
   */
  constructor() {
    this.instances = /* @__PURE__ */ new Map(), this.validationService = new Ge(), this.performanceMonitor = new st(), this.logger = je.child("ChessboardFactory"), this.templates = /* @__PURE__ */ new Map(), this._initializeDefaultTemplates();
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
        throw new O(
          "Container ID must be a non-empty string",
          "containerId",
          e
        );
      const s = document.getElementById(e);
      if (!s)
        throw new O(
          `Container element not found: ${e}`,
          "containerId",
          e
        );
      let n = { ...t };
      if (i) {
        const o = this.templates.get(i);
        o ? (n = { ...o, ...t }, this.logger.info(`Using template "${i}" for chessboard creation`)) : this.logger.warn(`Template "${i}" not found, using default configuration`);
      }
      n.id = e, this.validationService.validateConfig(n);
      const r = new we(n);
      return this.instances.set(e, {
        instance: r,
        config: n,
        template: i,
        createdAt: /* @__PURE__ */ new Date(),
        container: s
      }), this.performanceMonitor.endMeasure("chessboard-creation"), this.logger.info(`Created chessboard instance for container: ${e}`, {
        template: i,
        configKeys: Object.keys(n)
      }), r;
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
      throw new O("Template name must be a non-empty string", "name", e);
    if (!t || typeof t != "object")
      throw new O("Template configuration must be an object", "config", t);
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
        const { containerId: n, template: r, ...o } = s, c = this.create(n, o, r);
        t.push({ containerId: n, instance: c, success: !0 });
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
const $ = new nt();
function jt(a, e = {}, t = null) {
  return $.create(a, e, t);
}
function zt(a, e, t = {}) {
  return $.createFromTemplate(a, e, t);
}
function q(a, e = {}) {
  const t = je.child("ChessboardFactory");
  try {
    if (typeof a == "object" && a !== null)
      return t.debug("Creating chessboard with config object"), new we(a);
    if (typeof a == "string") {
      t.debug("Creating chessboard with element ID", { elementId: a });
      const i = { ...e, id: a };
      return new we(i);
    }
    throw new Error("Invalid parameters: first parameter must be string or object");
  } catch (i) {
    throw t.error("Failed to create chessboard instance", { error: i }), i;
  }
}
class rt extends we {
  /**
   * Creates a new ChessboardWrapper instance
   * @param {string|Object} containerElm - Container element ID or configuration object
   * @param {Object} [config={}] - Configuration options
   */
  constructor(e, t = {}) {
    const i = je.child("ChessboardWrapper");
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
q.create = jt;
q.fromTemplate = zt;
q.factory = $;
q.getInstance = (a) => $.getInstance(a);
q.destroyInstance = (a) => $.destroy(a);
q.destroyAll = () => $.destroyAll();
q.listInstances = () => $.listInstances();
q.registerTemplate = (a, e) => $.registerTemplate(a, e);
q.removeTemplate = (a) => $.removeTemplate(a);
q.getTemplate = (a) => $.getTemplate(a);
q.listTemplates = () => $.listTemplates();
q.getStats = () => $.getStats();
q.Class = rt;
q.Chessboard = rt;
q.Config = et;
q.Factory = nt;
function Vt(a) {
  const e = a.charCodeAt(0) - 97;
  return { row: 7 - (parseInt(a[1]) - 1), col: e };
}
function pi(a, e) {
  const t = String.fromCharCode(97 + e), i = (8 - a).toString();
  return t + i;
}
function vi(a) {
  const { row: e, col: t } = Vt(a);
  return (e + t) % 2 === 0 ? "dark" : "light";
}
function _i(a, e) {
  return a >= 0 && a <= 7 && e >= 0 && e <= 7;
}
function Ut(a) {
  if (typeof a != "string" || a.length !== 2) return !1;
  const e = a[0], t = a[1];
  return e >= "a" && e <= "h" && t >= "1" && t <= "8";
}
const ze = Ut, V = /* @__PURE__ */ new Map(), ot = 1e3;
function j(a, e) {
  if (V.size >= ot) {
    const t = V.keys().next().value;
    V.delete(t);
  }
  V.set(a, e);
}
function at(a) {
  if (typeof a != "string" || a.length !== 2)
    return !1;
  const e = `piece:${a}`;
  if (V.has(e))
    return V.get(e);
  const t = a[0], i = a[1], s = ["w", "b"].includes(t) && ["P", "R", "N", "B", "Q", "K"].includes(i);
  return j(e, s), s;
}
function ct(a) {
  if (typeof a != "object" || a === null)
    return !1;
  try {
    JSON.stringify(a);
  } catch {
    return !1;
  }
  for (const [e, t] of Object.entries(a))
    if (!ze(e) || !at(t))
      return !1;
  return Ht(a);
}
function Ht(a) {
  const e = Object.values(a), t = e.filter((r) => r === "wK").length, i = e.filter((r) => r === "bK").length;
  if (t !== 1 || i !== 1)
    return !1;
  const s = e.filter((r) => r === "wP").length, n = e.filter((r) => r === "bP").length;
  if (s > 8 || n > 8)
    return !1;
  for (const [r, o] of Object.entries(a))
    if (o === "wP" || o === "bP") {
      const c = r[1];
      if (c === "1" || c === "8")
        return !1;
    }
  return !0;
}
function Kt(a) {
  if (typeof a != "string")
    return { success: !1, error: "FEN must be a string" };
  const e = `fen:${a}`;
  if (V.has(e))
    return V.get(e);
  const t = a.trim().split(" ");
  if (t.length !== 6) {
    const o = { success: !1, error: "FEN must have 6 parts separated by spaces" };
    return j(e, o), o;
  }
  const i = t[0].split("/");
  if (i.length !== 8) {
    const o = { success: !1, error: "Piece placement must have 8 ranks" };
    return j(e, o), o;
  }
  for (let o = 0; o < i.length; o++) {
    const c = Wt(i[o]);
    if (!c.success) {
      const h = { success: !1, error: `Invalid rank ${o + 1}: ${c.error}` };
      return j(e, h), h;
    }
  }
  if (!["w", "b"].includes(t[1])) {
    const o = { success: !1, error: 'Active color must be "w" or "b"' };
    return j(e, o), o;
  }
  if (!/^[KQkq-]*$/.test(t[2])) {
    const o = { success: !1, error: "Invalid castling availability" };
    return j(e, o), o;
  }
  if (t[3] !== "-" && !ze(t[3])) {
    const o = { success: !1, error: "Invalid en passant target square" };
    return j(e, o), o;
  }
  const s = parseInt(t[4], 10);
  if (isNaN(s) || s < 0) {
    const o = { success: !1, error: "Invalid halfmove clock" };
    return j(e, o), o;
  }
  const n = parseInt(t[5], 10);
  if (isNaN(n) || n < 1) {
    const o = { success: !1, error: "Invalid fullmove number" };
    return j(e, o), o;
  }
  const r = { success: !0 };
  return j(e, r), r;
}
function Wt(a) {
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
function Qt(a) {
  if (typeof a != "string")
    return { success: !1, error: "Move must be a string" };
  const e = a.trim();
  return e.length === 0 ? { success: !1, error: "Move cannot be empty" } : e === "O-O" || e === "O-O-O" ? { success: !0, type: "castling" } : /^[a-h][1-8][a-h][1-8][qrnbQRNB]?$/.test(e) ? { success: !0, type: "coordinate" } : /^[PRNBQK]?[a-h]?[1-8]?x?[a-h][1-8](\+|#)?$/.test(e) ? { success: !0, type: "algebraic" } : { success: !1, error: "Invalid move format" };
}
function Yt(a) {
  const e = [];
  if (!a || typeof a != "object")
    return { success: !1, errors: ["Configuration must be an object"] };
  !a.id && !a.id_div && e.push('Configuration must include "id" or "id_div"'), a.orientation && !["white", "black", "w", "b"].includes(a.orientation) && e.push('Invalid orientation. Must be "white", "black", "w", or "b"'), a.position && a.position !== "start" && typeof a.position != "object" && e.push('Invalid position. Must be "start" or a position object'), a.position && typeof a.position == "object" && !ct(a.position) && e.push("Invalid position object format"), a.size && !Jt(a.size) && e.push('Invalid size. Must be "auto", a positive number, or a valid CSS size'), a.movableColors && !["white", "black", "w", "b", "both", "none"].includes(a.movableColors) && e.push('Invalid movableColors. Must be "white", "black", "w", "b", "both", or "none"'), a.dropOffBoard && !["snapback", "trash"].includes(a.dropOffBoard) && e.push('Invalid dropOffBoard. Must be "snapback" or "trash"');
  const t = [
    "onMove",
    "onMoveEnd",
    "onChange",
    "onDragStart",
    "onDragMove",
    "onDrop",
    "onSnapbackEnd"
  ];
  for (const s of t)
    a[s] && typeof a[s] != "function" && e.push(`Invalid ${s}. Must be a function`);
  const i = ["whiteSquare", "blackSquare", "highlight", "hintColor"];
  for (const s of i)
    a[s] && !Zt(a[s]) && e.push(`Invalid ${s}. Must be a valid CSS color`);
  return a.moveAnimation && !Xt(a.moveAnimation) && e.push("Invalid moveAnimation. Must be a valid easing function"), a.animationStyle && !["sequential", "simultaneous"].includes(a.animationStyle) && e.push('Invalid animationStyle. Must be "sequential" or "simultaneous"'), {
    success: e.length === 0,
    errors: e
  };
}
function Jt(a) {
  return a === "auto" ? !0 : typeof a == "number" ? a > 0 && a <= 5e3 : typeof a == "string" ? /^\d+(px|em|rem|%|vh|vw)$/.test(a) : !1;
}
function Zt(a) {
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
function Xt(a) {
  return ["linear", "ease", "ease-in", "ease-out", "ease-in-out", "cubic-bezier"].includes(a) || /^cubic-bezier\(\s*[\d.-]+\s*,\s*[\d.-]+\s*,\s*[\d.-]+\s*,\s*[\d.-]+\s*\)$/.test(a);
}
function bi(a) {
  return a.map((e) => {
    const { type: t, value: i } = e;
    switch (t) {
      case "piece":
        return { ...e, valid: at(i) };
      case "square":
        return { ...e, valid: ze(i) };
      case "position":
        return { ...e, valid: ct(i) };
      case "fen": {
        const s = Kt(i);
        return { ...e, valid: s.success, error: s.error };
      }
      case "move": {
        const s = Qt(i);
        return { ...e, valid: s.success, error: s.error };
      }
      case "config": {
        const s = Yt(i);
        return { ...e, valid: s.success, errors: s.errors };
      }
      default:
        return { ...e, valid: !1, error: "Unknown validation type" };
    }
  });
}
function Si() {
  V.clear();
}
function yi() {
  return {
    size: V.size,
    maxSize: ot
  };
}
function wi(a) {
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
function Pi(a) {
  return ["ease", "ease-in", "ease-out", "ease-in-out", "linear"].includes(a) ? a : "ease";
}
function Ei(a) {
  return new Promise((e) => setTimeout(e, a));
}
class fe {
  /**
   * @param {EngineConfig} [config={}] - Engine configuration
   */
  constructor(e = {}) {
    if (new.target === fe)
      throw new Error("BaseEngine is abstract and cannot be instantiated directly");
    this.config = {
      depth: 20,
      moveTime: 1e3,
      threads: 1,
      hashSize: 16,
      useNNUE: !0,
      ...e
    }, this.isReady = !1, this.isSearching = !1, this.info = null, this.listeners = /* @__PURE__ */ new Map(), this.currentAnalysis = null;
  }
  /**
   * Initialize the engine
   * @abstract
   * @returns {Promise<boolean>}
   */
  async init() {
    throw new Error("init() must be implemented by subclass");
  }
  /**
   * Shutdown the engine
   * @abstract
   * @returns {Promise<void>}
   */
  async quit() {
    throw new Error("quit() must be implemented by subclass");
  }
  /**
   * Check if engine is ready
   * @returns {boolean}
   */
  ready() {
    return this.isReady;
  }
  /**
   * Set position from FEN or moves
   * @abstract
   * @param {string} [_fen='startpos'] - FEN string or 'startpos'
   * @param {string[]} [_moves=[]] - Moves to apply
   * @returns {Promise<void>}
   */
  async setPosition(e = "startpos", t = []) {
    throw new Error("setPosition() must be implemented by subclass");
  }
  /**
   * Start analysis/search
   * @abstract
   * @param {Object} [_options={}] - Search options
   * @param {number} [_options.depth] - Search depth
   * @param {number} [_options.moveTime] - Time per move in ms
   * @param {number} [_options.wtime] - White time remaining
   * @param {number} [_options.btime] - Black time remaining
   * @param {number} [_options.winc] - White increment
   * @param {number} [_options.binc] - Black increment
   * @param {boolean} [_options.infinite=false] - Infinite analysis
   * @returns {Promise<EngineAnalysis>}
   */
  async go(e = {}) {
    throw new Error("go() must be implemented by subclass");
  }
  /**
   * Stop current analysis
   * @abstract
   * @returns {Promise<void>}
   */
  async stop() {
    throw new Error("stop() must be implemented by subclass");
  }
  /**
   * Set engine option
   * @abstract
   * @param {string} _name - Option name
   * @param {string|number|boolean} _value - Option value
   * @returns {Promise<void>}
   */
  async setOption(e, t) {
    throw new Error("setOption() must be implemented by subclass");
  }
  /**
   * Get engine info
   * @returns {EngineInfo|null}
   */
  getInfo() {
    return this.info;
  }
  /**
   * Get best move for current position
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Search options
   * @returns {Promise<string>} - Best move in UCI format
   */
  async getBestMove(e, t = {}) {
    return await this.setPosition(e), (await this.go({
      depth: t.depth || this.config.depth,
      moveTime: t.moveTime || this.config.moveTime,
      ...t
    })).bestMove;
  }
  /**
   * Analyze position
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Analysis options
   * @returns {Promise<EngineAnalysis>}
   */
  async analyze(e, t = {}) {
    return await this.setPosition(e), this.go({
      depth: t.depth || this.config.depth,
      ...t
    });
  }
  /**
   * Start infinite analysis
   * @param {string} fen - Position FEN
   * @returns {Promise<void>}
   */
  async startInfiniteAnalysis(e) {
    await this.setPosition(e), this.go({ infinite: !0 });
  }
  /**
   * Add event listener
   * @param {string} event - Event name ('info', 'bestmove', 'error')
   * @param {Function} callback - Callback function
   */
  on(e, t) {
    this.listeners.has(e) || this.listeners.set(e, []), this.listeners.get(e).push(t);
  }
  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(e, t) {
    if (!this.listeners.has(e)) return;
    const i = this.listeners.get(e), s = i.indexOf(t);
    s > -1 && i.splice(s, 1);
  }
  /**
   * Emit event
   * @protected
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  _emit(e, t) {
    this.listeners.has(e) && this.listeners.get(e).forEach((i) => {
      try {
        i(t);
      } catch (s) {
        console.error(`Error in engine event listener for ${e}:`, s);
      }
    });
  }
  /**
   * Parse UCI info line
   * @protected
   * @param {string} line - UCI info line
   * @returns {Object}
   */
  _parseInfo(e) {
    const t = {}, i = e.split(" ");
    let s = 0;
    for (; s < i.length; ) {
      switch (i[s]) {
        case "depth":
          t.depth = parseInt(i[++s], 10);
          break;
        case "seldepth":
          t.seldepth = parseInt(i[++s], 10);
          break;
        case "multipv":
          t.multipv = parseInt(i[++s], 10);
          break;
        case "score":
          i[s + 1] === "cp" ? (t.score = parseInt(i[s + 2], 10), t.isMate = !1, s += 2) : i[s + 1] === "mate" && (t.score = parseInt(i[s + 2], 10), t.isMate = !0, s += 2);
          break;
        case "nodes":
          t.nodes = parseInt(i[++s], 10);
          break;
        case "nps":
          t.nps = parseInt(i[++s], 10);
          break;
        case "time":
          t.time = parseInt(i[++s], 10);
          break;
        case "pv":
          t.pv = i.slice(s + 1), s = i.length;
          break;
        case "hashfull":
          t.hashfull = parseInt(i[++s], 10);
          break;
        case "tbhits":
          t.tbhits = parseInt(i[++s], 10);
          break;
        case "currmove":
          t.currmove = i[++s];
          break;
        case "currmovenumber":
          t.currmovenumber = parseInt(i[++s], 10);
          break;
      }
      s++;
    }
    return t;
  }
  /**
   * Parse bestmove line
   * @protected
   * @param {string} line - UCI bestmove line
   * @returns {Object}
   */
  _parseBestMove(e) {
    const t = e.split(" "), i = {
      bestMove: t[1] || null,
      ponder: null
    }, s = t.indexOf("ponder");
    return s !== -1 && t[s + 1] && (i.ponder = t[s + 1]), i;
  }
  /**
   * Convert UCI move to algebraic notation helper
   * @param {string} uciMove - Move in UCI format (e.g., "e2e4")
   * @returns {Object} - {from, to, promotion}
   */
  parseUCIMove(e) {
    return !e || e.length < 4 ? null : {
      from: e.slice(0, 2),
      to: e.slice(2, 4),
      promotion: e.length > 4 ? e[4] : null
    };
  }
}
const ie = class ie extends fe {
  /**
   * @param {StockfishConfig} [config={}] - Engine configuration
   */
  constructor(e = {}) {
    super({
      threads: 1,
      hashSize: 16,
      useNNUE: !0,
      ...e
    }), this.worker = null, this.messageQueue = [], this.pendingCommand = null, this.wasmPath = e.wasmPath || null, this.nnuePath = e.nnuePath || null;
  }
  /**
   * Check if SharedArrayBuffer is available (needed for multi-threading)
   * @returns {boolean}
   */
  static supportsThreads() {
    try {
      return typeof SharedArrayBuffer < "u";
    } catch {
      return !1;
    }
  }
  /**
   * Check if WebAssembly is supported
   * @returns {boolean}
   */
  static supportsWasm() {
    try {
      return typeof WebAssembly == "object" && typeof WebAssembly.instantiate == "function";
    } catch {
      return !1;
    }
  }
  /**
   * Initialize the Stockfish engine
   * @override
   * @returns {Promise<boolean>}
   */
  async init() {
    if (this.isReady) return !0;
    if (!ie.supportsWasm())
      throw new Error("WebAssembly is not supported in this environment");
    try {
      const e = this.wasmPath || ie.CDN_URLS.stockfish16;
      return this.worker = new Worker(e), this.worker.onmessage = (t) => this._handleMessage(t.data), this.worker.onerror = (t) => this._handleError(t), await this._sendAndWait("uci", "uciok"), await this._configureEngine(), await this._sendAndWait("isready", "readyok"), this.isReady = !0, this._emit("ready", this.info), !0;
    } catch (e) {
      throw this._emit("error", e), e;
    }
  }
  /**
   * Initialize from a custom Stockfish instance
   * @param {Worker|Object} stockfishInstance - Stockfish worker or instance
   * @returns {Promise<boolean>}
   */
  async initFromInstance(e) {
    if (this.isReady) return !0;
    try {
      if (e instanceof Worker)
        this.worker = e, this.worker.onmessage = (t) => this._handleMessage(t.data), this.worker.onerror = (t) => this._handleError(t);
      else if (typeof e.postMessage == "function")
        this.worker = e, typeof e.addMessageListener == "function" && e.addMessageListener((t) => this._handleMessage(t));
      else
        throw new Error("Invalid Stockfish instance");
      return await this._sendAndWait("uci", "uciok"), await this._configureEngine(), await this._sendAndWait("isready", "readyok"), this.isReady = !0, this._emit("ready", this.info), !0;
    } catch (t) {
      throw this._emit("error", t), t;
    }
  }
  /**
   * Configure engine options
   * @private
   */
  async _configureEngine() {
    ie.supportsThreads() && this.config.threads > 1 && await this._send(`setoption name Threads value ${this.config.threads}`), await this._send(`setoption name Hash value ${this.config.hashSize}`), this.config.useNNUE && (await this._send("setoption name Use NNUE value true"), this.nnuePath && await this._send(`setoption name EvalFile value ${this.nnuePath}`));
  }
  /**
   * Shutdown the engine
   * @override
   * @returns {Promise<void>}
   */
  async quit() {
    if (this.worker) {
      try {
        this._send("quit"), this.worker.terminate();
      } catch {
      }
      this.worker = null, this.isReady = !1, this.isSearching = !1, this._emit("quit");
    }
  }
  /**
   * Set position
   * @override
   * @param {string} [fen='startpos'] - FEN string or 'startpos'
   * @param {string[]} [moves=[]] - Moves to apply
   * @returns {Promise<void>}
   */
  async setPosition(e = "startpos", t = []) {
    if (!this.isReady) throw new Error("Engine not ready");
    let i;
    e === "startpos" ? i = "position startpos" : i = `position fen ${e}`, t.length > 0 && (i += ` moves ${t.join(" ")}`), await this._send(i);
  }
  /**
   * Start search
   * @override
   * @param {Object} [options={}] - Search options
   * @returns {Promise<EngineAnalysis>}
   */
  async go(e = {}) {
    if (!this.isReady) throw new Error("Engine not ready");
    this.isSearching && await this.stop(), this.isSearching = !0, this.currentAnalysis = {
      bestMove: null,
      ponder: null,
      score: 0,
      isMate: !1,
      depth: 0,
      nodes: 0,
      time: 0,
      pv: [],
      nps: 0
    };
    let t = "go";
    return e.infinite ? t += " infinite" : (e.depth && (t += ` depth ${e.depth}`), e.moveTime && (t += ` movetime ${e.moveTime}`), e.wtime && (t += ` wtime ${e.wtime}`), e.btime && (t += ` btime ${e.btime}`), e.winc && (t += ` winc ${e.winc}`), e.binc && (t += ` binc ${e.binc}`), e.movestogo && (t += ` movestogo ${e.movestogo}`), e.nodes && (t += ` nodes ${e.nodes}`), e.mate && (t += ` mate ${e.mate}`)), e.infinite ? (this._send(t), this.currentAnalysis) : new Promise((i, s) => {
      const n = setTimeout(
        () => {
          this.isSearching = !1, s(new Error("Search timeout"));
        },
        (e.moveTime || this.config.moveTime) + 3e4
      ), r = (o) => {
        o.bestMove && (clearTimeout(n), this.off("bestmove", r), this.isSearching = !1, i({
          ...this.currentAnalysis,
          ...o
        }));
      };
      this.on("bestmove", r), this._send(t);
    });
  }
  /**
   * Stop current search
   * @override
   * @returns {Promise<void>}
   */
  async stop() {
    if (this.isSearching)
      return new Promise((e) => {
        const t = () => {
          this.off("bestmove", t), this.isSearching = !1, e();
        }, i = setTimeout(() => {
          this.off("bestmove", t), this.isSearching = !1, e();
        }, 1e3);
        this.on("bestmove", () => {
          clearTimeout(i), t();
        }), this._send("stop");
      });
  }
  /**
   * Set engine option
   * @override
   * @param {string} name - Option name
   * @param {string|number|boolean} value - Option value
   * @returns {Promise<void>}
   */
  async setOption(e, t) {
    if (!this.isReady) throw new Error("Engine not ready");
    await this._send(`setoption name ${e} value ${t}`), await this._sendAndWait("isready", "readyok");
  }
  /**
   * Get evaluation of current position
   * @returns {Promise<Object>}
   */
  async eval() {
    if (!this.isReady) throw new Error("Engine not ready");
    return new Promise((e) => {
      let t = "";
      const i = (s) => {
        typeof s == "string" && (t += `${s}
`);
      };
      this.on("message", i), setTimeout(() => {
        this.off("message", i), e(this._parseEval(t));
      }, 100), this._send("eval");
    });
  }
  /**
   * Send command to engine
   * @private
   * @param {string} command - UCI command
   */
  _send(e) {
    this.worker && (this._emit("command", e), this.worker.postMessage(e));
  }
  /**
   * Send command and wait for response
   * @private
   * @param {string} command - UCI command
   * @param {string} expectedResponse - Expected response to wait for
   * @returns {Promise<void>}
   */
  _sendAndWait(e, t) {
    return new Promise((i, s) => {
      const n = setTimeout(() => {
        s(new Error(`Timeout waiting for ${t}`));
      }, 1e4), r = (o) => {
        typeof o == "string" && o.includes(t) && (clearTimeout(n), this.off("message", r), i());
      };
      this.on("message", r), this._send(e);
    });
  }
  /**
   * Handle engine message
   * @private
   * @param {string} data - Message from engine
   */
  _handleMessage(e) {
    if (typeof e == "string")
      if (this._emit("message", e), e.startsWith("id "))
        this._parseId(e);
      else if (e.startsWith("info ")) {
        const t = this._parseInfo(e.slice(5));
        this._updateAnalysis(t), this._emit("info", t);
      } else if (e.startsWith("bestmove ")) {
        const t = this._parseBestMove(e);
        this._emit("bestmove", t);
      } else e.startsWith("option ") && this._parseOption(e);
  }
  /**
   * Handle engine error
   * @private
   * @param {Error} error - Error object
   */
  _handleError(e) {
    this._emit("error", e);
  }
  /**
   * Parse engine ID
   * @private
   * @param {string} line - ID line
   */
  _parseId(e) {
    if (this.info || (this.info = { name: "", author: "", version: "", options: [] }), e.startsWith("id name ")) {
      this.info.name = e.slice(8);
      const t = this.info.name.match(/(\d+(?:\.\d+)*)/);
      t && (this.info.version = t[1]);
    } else e.startsWith("id author ") && (this.info.author = e.slice(10));
  }
  /**
   * Parse engine option
   * @private
   * @param {string} line - Option line
   */
  _parseOption(e) {
    this.info || (this.info = { name: "", author: "", version: "", options: [] });
    const t = e.match(/option name ([^ ]+)/);
    t && this.info.options.push(t[1]);
  }
  /**
   * Update current analysis with new info
   * @private
   * @param {Object} info - Parsed info
   */
  _updateAnalysis(e) {
    this.currentAnalysis && (e.depth !== void 0 && (this.currentAnalysis.depth = e.depth), e.score !== void 0 && (this.currentAnalysis.score = e.score, this.currentAnalysis.isMate = e.isMate || !1), e.nodes !== void 0 && (this.currentAnalysis.nodes = e.nodes), e.time !== void 0 && (this.currentAnalysis.time = e.time), e.nps !== void 0 && (this.currentAnalysis.nps = e.nps), e.pv !== void 0 && (this.currentAnalysis.pv = e.pv));
  }
  /**
   * Parse eval output
   * @private
   * @param {string} output - Eval output
   * @returns {Object}
   */
  _parseEval(e) {
    const t = e.split(`
`), i = { raw: e };
    for (const s of t)
      if (s.includes("Final evaluation")) {
        const n = s.match(/([-+]?\d+\.?\d*)/);
        n && (i.evaluation = parseFloat(n[1]));
      }
    return i;
  }
  /**
   * Get current analysis state
   * @returns {EngineAnalysis|null}
   */
  getCurrentAnalysis() {
    return this.currentAnalysis;
  }
  /**
   * New game - reset engine state
   * @returns {Promise<void>}
   */
  async newGame() {
    if (!this.isReady) throw new Error("Engine not ready");
    await this._send("ucinewgame"), await this._sendAndWait("isready", "readyok");
  }
};
/**
 * CDN URLs for Stockfish.js
 */
y(ie, "CDN_URLS", {
  // Stockfish.js official releases
  stockfish16: "https://cdn.jsdelivr.net/npm/stockfish.js@16/stockfish.js",
  stockfish15: "https://cdn.jsdelivr.net/npm/stockfish.js@15/stockfish.js",
  stockfish14: "https://cdn.jsdelivr.net/npm/stockfish@14/stockfish.js",
  // Alternative CDNs
  unpkg: "https://unpkg.com/stockfish.js/stockfish.js"
});
let $e = ie;
class ei extends fe {
  /**
   * @param {UCIConfig} config - Engine configuration
   */
  constructor(e) {
    if (!e.url && e.transport !== "custom")
      throw new Error("URL is required for UCI engine connection");
    super(e), this.transport = e.transport || "websocket", this.url = e.url, this.customSend = e.customSend, this.customReceive = e.customReceive, this.reconnectAttempts = e.reconnectAttempts || 3, this.reconnectDelay = e.reconnectDelay || 1e3, this.connection = null, this.messageBuffer = "", this.pendingPromises = [];
  }
  /**
   * Initialize the engine connection
   * @override
   * @returns {Promise<boolean>}
   */
  async init() {
    if (this.isReady) return !0;
    try {
      return await this._connect(), await this._sendAndWait("uci", "uciok"), await this._configureEngine(), await this._sendAndWait("isready", "readyok"), this.isReady = !0, this._emit("ready", this.info), !0;
    } catch (e) {
      throw this._emit("error", e), e;
    }
  }
  /**
   * Connect to the engine
   * @private
   * @returns {Promise<void>}
   */
  async _connect() {
    switch (this.transport) {
      case "websocket":
        await this._connectWebSocket();
        break;
      case "http":
        this.connection = { type: "http" };
        break;
      case "custom":
        this.customReceive && this.customReceive((e) => this._handleMessage(e)), this.connection = { type: "custom" };
        break;
      default:
        throw new Error(`Unknown transport: ${this.transport}`);
    }
  }
  /**
   * Connect via WebSocket
   * @private
   * @returns {Promise<void>}
   */
  _connectWebSocket() {
    return new Promise((e, t) => {
      let i = 0;
      const s = () => {
        try {
          this.connection = new WebSocket(this.url), this.connection.onopen = () => {
            this._emit("connected"), e();
          }, this.connection.onmessage = (n) => {
            this._handleMessage(n.data);
          }, this.connection.onerror = (n) => {
            this._emit("error", n);
          }, this.connection.onclose = () => {
            this._emit("disconnected"), this.isReady = !1, i < this.reconnectAttempts && (i++, setTimeout(s, this.reconnectDelay * i));
          };
        } catch (n) {
          i < this.reconnectAttempts ? (i++, setTimeout(s, this.reconnectDelay * i)) : t(n);
        }
      };
      s();
    });
  }
  /**
   * Shutdown the engine
   * @override
   * @returns {Promise<void>}
   */
  async quit() {
    if (this.connection) {
      try {
        await this._send("quit"), this.transport === "websocket" && this.connection instanceof WebSocket && this.connection.close();
      } catch {
      }
      this.connection = null, this.isReady = !1, this.isSearching = !1, this._emit("quit");
    }
  }
  /**
   * Set position
   * @override
   * @param {string} [fen='startpos'] - FEN string or 'startpos'
   * @param {string[]} [moves=[]] - Moves to apply
   * @returns {Promise<void>}
   */
  async setPosition(e = "startpos", t = []) {
    if (!this.isReady) throw new Error("Engine not ready");
    let i;
    e === "startpos" ? i = "position startpos" : i = `position fen ${e}`, t.length > 0 && (i += ` moves ${t.join(" ")}`), await this._send(i);
  }
  /**
   * Start search
   * @override
   * @param {Object} [options={}] - Search options
   * @returns {Promise<EngineAnalysis>}
   */
  async go(e = {}) {
    if (!this.isReady) throw new Error("Engine not ready");
    this.isSearching && await this.stop(), this.isSearching = !0, this.currentAnalysis = {
      bestMove: null,
      ponder: null,
      score: 0,
      isMate: !1,
      depth: 0,
      nodes: 0,
      time: 0,
      pv: [],
      nps: 0
    };
    let t = "go";
    return e.infinite ? (t += " infinite", this._send(t), this.currentAnalysis) : (e.depth && (t += ` depth ${e.depth}`), e.moveTime && (t += ` movetime ${e.moveTime}`), e.wtime && (t += ` wtime ${e.wtime}`), e.btime && (t += ` btime ${e.btime}`), e.winc && (t += ` winc ${e.winc}`), e.binc && (t += ` binc ${e.binc}`), new Promise((i, s) => {
      const n = setTimeout(
        () => {
          this.isSearching = !1, s(new Error("Search timeout"));
        },
        (e.moveTime || this.config.moveTime) + 3e4
      ), r = (o) => {
        o.bestMove && (clearTimeout(n), this.off("bestmove", r), this.isSearching = !1, i({
          ...this.currentAnalysis,
          ...o
        }));
      };
      this.on("bestmove", r), this._send(t);
    }));
  }
  /**
   * Stop current search
   * @override
   * @returns {Promise<void>}
   */
  async stop() {
    if (this.isSearching)
      return new Promise((e) => {
        const t = setTimeout(() => {
          this.isSearching = !1, e();
        }, 1e3), i = () => {
          clearTimeout(t), this.off("bestmove", i), this.isSearching = !1, e();
        };
        this.on("bestmove", i), this._send("stop");
      });
  }
  /**
   * Set engine option
   * @override
   * @param {string} name - Option name
   * @param {string|number|boolean} value - Option value
   * @returns {Promise<void>}
   */
  async setOption(e, t) {
    if (!this.isReady) throw new Error("Engine not ready");
    await this._send(`setoption name ${e} value ${t}`), await this._sendAndWait("isready", "readyok");
  }
  /**
   * Configure engine options
   * @private
   */
  async _configureEngine() {
    this.config.threads > 1 && await this._send(`setoption name Threads value ${this.config.threads}`), await this._send(`setoption name Hash value ${this.config.hashSize}`);
  }
  /**
   * Send command to engine
   * @private
   * @param {string} command - UCI command
   * @returns {Promise<void>}
   */
  async _send(e) {
    switch (this._emit("command", e), this.transport) {
      case "websocket":
        this.connection && this.connection.readyState === WebSocket.OPEN && this.connection.send(e);
        break;
      case "http":
        await this._sendHttp(e);
        break;
      case "custom":
        this.customSend && await this.customSend(e);
        break;
    }
  }
  /**
   * Send command via HTTP
   * @private
   * @param {string} command - UCI command
   * @returns {Promise<string>}
   */
  async _sendHttp(e) {
    const i = await (await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: e
    })).text(), s = i.split(`
`);
    for (const n of s)
      n.trim() && this._handleMessage(n);
    return i;
  }
  /**
   * Send command and wait for response
   * @private
   * @param {string} command - UCI command
   * @param {string} expectedResponse - Expected response to wait for
   * @returns {Promise<void>}
   */
  _sendAndWait(e, t) {
    return new Promise((i, s) => {
      const n = setTimeout(() => {
        s(new Error(`Timeout waiting for ${t}`));
      }, 1e4), r = (o) => {
        typeof o == "string" && o.includes(t) && (clearTimeout(n), this.off("message", r), i());
      };
      this.on("message", r), this._send(e);
    });
  }
  /**
   * Handle incoming message
   * @private
   * @param {string} data - Message from engine
   */
  _handleMessage(e) {
    if (typeof e != "string") return;
    this.messageBuffer += e;
    const t = this.messageBuffer.split(`
`);
    this.messageBuffer = t.pop() || "";
    for (const i of t) {
      const s = i.trim();
      if (s)
        if (this._emit("message", s), s.startsWith("id "))
          this._parseId(s);
        else if (s.startsWith("info ")) {
          const n = this._parseInfo(s.slice(5));
          this._updateAnalysis(n), this._emit("info", n);
        } else if (s.startsWith("bestmove ")) {
          const n = this._parseBestMove(s);
          this._emit("bestmove", n);
        } else s.startsWith("option ") && this._parseOption(s);
    }
  }
  /**
   * Parse engine ID
   * @private
   * @param {string} line - ID line
   */
  _parseId(e) {
    this.info || (this.info = { name: "", author: "", version: "", options: [] }), e.startsWith("id name ") ? this.info.name = e.slice(8) : e.startsWith("id author ") && (this.info.author = e.slice(10));
  }
  /**
   * Parse engine option
   * @private
   * @param {string} line - Option line
   */
  _parseOption(e) {
    this.info || (this.info = { name: "", author: "", version: "", options: [] });
    const t = e.match(/option name ([^ ]+)/);
    t && this.info.options.push(t[1]);
  }
  /**
   * Update current analysis
   * @private
   * @param {Object} info - Parsed info
   */
  _updateAnalysis(e) {
    this.currentAnalysis && (e.depth !== void 0 && (this.currentAnalysis.depth = e.depth), e.score !== void 0 && (this.currentAnalysis.score = e.score, this.currentAnalysis.isMate = e.isMate || !1), e.nodes !== void 0 && (this.currentAnalysis.nodes = e.nodes), e.time !== void 0 && (this.currentAnalysis.time = e.time), e.nps !== void 0 && (this.currentAnalysis.nps = e.nps), e.pv !== void 0 && (this.currentAnalysis.pv = e.pv));
  }
  /**
   * Get connection status
   * @returns {boolean}
   */
  isConnected() {
    return this.connection ? this.transport === "websocket" ? this.connection.readyState === WebSocket.OPEN : !0 : !1;
  }
  /**
   * New game - reset engine state
   * @returns {Promise<void>}
   */
  async newGame() {
    if (!this.isReady) throw new Error("Engine not ready");
    await this._send("ucinewgame"), await this._sendAndWait("isready", "readyok");
  }
}
const J = class J extends fe {
  /**
   * @param {CloudConfig} [config={}] - Engine configuration
   */
  constructor(e = {}) {
    super({
      depth: 40,
      // Cloud engines typically go deeper
      multiPv: 1,
      useTablebase: !0,
      ...e
    }), this.provider = e.provider || "lichess", this.apiKey = e.apiKey || null, this.apiUrl = e.apiUrl || null, this.multiPv = e.multiPv || 1, this.useTablebase = e.useTablebase !== !1, this.currentFen = null, this.cachedAnalysis = /* @__PURE__ */ new Map();
  }
  /**
   * Initialize the cloud engine
   * @override
   * @returns {Promise<boolean>}
   */
  async init() {
    if (this.isReady) return !0;
    try {
      return await this._testConnection(), this.info = {
        name: `Cloud Engine (${this.provider})`,
        author: this.provider,
        version: "1.0",
        options: ["multiPv", "useTablebase"]
      }, this.isReady = !0, this._emit("ready", this.info), !0;
    } catch (e) {
      throw this._emit("error", e), e;
    }
  }
  /**
   * Test API connection
   * @private
   * @returns {Promise<void>}
   */
  async _testConnection() {
    var t, i;
    const e = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    try {
      await this._fetchAnalysis(e);
    } catch (s) {
      if ((t = s.message) != null && t.includes("network") || (i = s.message) != null && i.includes("fetch"))
        throw new Error(`Failed to connect to ${this.provider} API`);
    }
  }
  /**
   * Shutdown the cloud engine
   * @override
   * @returns {Promise<void>}
   */
  async quit() {
    this.isReady = !1, this.cachedAnalysis.clear(), this._emit("quit");
  }
  /**
   * Set position
   * @override
   * @param {string} [fen='startpos'] - FEN string or 'startpos'
   * @param {string[]} [_moves=[]] - Moves to apply (not used for cloud)
   * @returns {Promise<void>}
   */
  async setPosition(e = "startpos", t = []) {
    e === "startpos" ? this.currentFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" : this.currentFen = e;
  }
  /**
   * Start analysis
   * @override
   * @param {Object} [options={}] - Analysis options
   * @returns {Promise<EngineAnalysis>}
   */
  async go(e = {}) {
    if (!this.isReady) throw new Error("Engine not ready");
    if (!this.currentFen) throw new Error("Position not set");
    this.isSearching = !0;
    try {
      const t = `${this.currentFen}-${e.multiPv || this.multiPv}`;
      if (this.cachedAnalysis.has(t)) {
        const s = this.cachedAnalysis.get(t);
        return this.isSearching = !1, s;
      }
      const i = await this._fetchAnalysis(this.currentFen, e);
      if (this.cachedAnalysis.set(t, i), this.cachedAnalysis.size > 1e3) {
        const s = this.cachedAnalysis.keys().next().value;
        this.cachedAnalysis.delete(s);
      }
      return this.isSearching = !1, this._emit("bestmove", { bestMove: i.bestMove, ponder: i.ponder }), i;
    } catch (t) {
      throw this.isSearching = !1, t;
    }
  }
  /**
   * Stop current analysis (no-op for cloud)
   * @override
   * @returns {Promise<void>}
   */
  async stop() {
    this.isSearching = !1;
  }
  /**
   * Set engine option
   * @override
   * @param {string} name - Option name
   * @param {string|number|boolean} value - Option value
   * @returns {Promise<void>}
   */
  async setOption(e, t) {
    switch (e.toLowerCase()) {
      case "multipv":
        this.multiPv = parseInt(t, 10);
        break;
      case "usetablebase":
        this.useTablebase = t === !0 || t === "true";
        break;
      default:
        this.config[e] = t;
    }
  }
  /**
   * Fetch analysis from cloud API
   * @private
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Options
   * @returns {Promise<EngineAnalysis>}
   */
  async _fetchAnalysis(e, t = {}) {
    switch (this.provider) {
      case "lichess":
        return this._fetchLichessAnalysis(e, t);
      case "chesscom":
        return this._fetchChesscomAnalysis(e, t);
      case "custom":
        return this._fetchCustomAnalysis(e, t);
      default:
        throw new Error(`Unknown provider: ${this.provider}`);
    }
  }
  /**
   * Fetch analysis from Lichess
   * @private
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Options
   * @returns {Promise<EngineAnalysis>}
   */
  async _fetchLichessAnalysis(e, t = {}) {
    const i = t.multiPv || this.multiPv, s = new URL(J.PROVIDERS.lichess.analysis);
    s.searchParams.set("fen", e), s.searchParams.set("multiPv", i.toString());
    const n = {};
    this.apiKey && (n.Authorization = `Bearer ${this.apiKey}`);
    const r = await fetch(s.toString(), { headers: n });
    if (!r.ok) {
      if (r.status === 404)
        return this._createEmptyAnalysis();
      throw new Error(`Lichess API error: ${r.status}`);
    }
    const o = await r.json();
    return this._parseLichessResponse(o);
  }
  /**
   * Parse Lichess API response
   * @private
   * @param {Object} data - API response
   * @returns {EngineAnalysis}
   */
  _parseLichessResponse(e) {
    if (!e.pvs || e.pvs.length === 0)
      return this._createEmptyAnalysis();
    const t = e.pvs[0], i = t.moves ? t.moves.split(" ") : [];
    return {
      bestMove: i[0] || null,
      ponder: i[1] || null,
      score: t.cp !== void 0 ? t.cp : t.mate !== void 0 ? t.mate * 1e4 : 0,
      isMate: t.mate !== void 0,
      depth: e.depth || 0,
      nodes: e.knodes ? e.knodes * 1e3 : 0,
      time: 0,
      pv: i,
      nps: 0,
      multiPv: e.pvs.map((s) => ({
        moves: s.moves ? s.moves.split(" ") : [],
        score: s.cp !== void 0 ? s.cp : s.mate !== void 0 ? s.mate * 1e4 : 0,
        isMate: s.mate !== void 0
      }))
    };
  }
  /**
   * Fetch analysis from Chess.com
   * @private
   * @param {string} fen - Position FEN
   * @param {Object} [_options={}] - Options
   * @returns {Promise<EngineAnalysis>}
   */
  async _fetchChesscomAnalysis(e, t = {}) {
    const i = new URL(J.PROVIDERS.chesscom.analysis);
    i.searchParams.set("fen", e);
    const s = await fetch(i.toString());
    if (!s.ok)
      return this._createEmptyAnalysis();
    const n = await s.json();
    return this._parseChesscomResponse(n);
  }
  /**
   * Parse Chess.com API response
   * @private
   * @param {Object} data - API response
   * @returns {EngineAnalysis}
   */
  _parseChesscomResponse(e) {
    return e.bestMove ? {
      bestMove: e.bestMove,
      ponder: e.ponder || null,
      score: e.score || 0,
      isMate: e.isMate || !1,
      depth: e.depth || 0,
      nodes: e.nodes || 0,
      time: 0,
      pv: e.pv || [e.bestMove],
      nps: 0
    } : this._createEmptyAnalysis();
  }
  /**
   * Fetch analysis from custom API
   * @private
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Options
   * @returns {Promise<EngineAnalysis>}
   */
  async _fetchCustomAnalysis(e, t = {}) {
    if (!this.apiUrl)
      throw new Error("Custom API URL not configured");
    const i = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}
      },
      body: JSON.stringify({ fen: e, options: t })
    });
    if (!i.ok)
      throw new Error(`Custom API error: ${i.status}`);
    const s = await i.json();
    return {
      bestMove: s.bestMove || null,
      ponder: s.ponder || null,
      score: s.score || 0,
      isMate: s.isMate || !1,
      depth: s.depth || 0,
      nodes: s.nodes || 0,
      time: s.time || 0,
      pv: s.pv || [],
      nps: s.nps || 0
    };
  }
  /**
   * Create empty analysis result
   * @private
   * @returns {EngineAnalysis}
   */
  _createEmptyAnalysis() {
    return {
      bestMove: null,
      ponder: null,
      score: 0,
      isMate: !1,
      depth: 0,
      nodes: 0,
      time: 0,
      pv: [],
      nps: 0
    };
  }
  /**
   * Get tablebase probe
   * @param {string} fen - Position FEN
   * @returns {Promise<Object|null>}
   */
  async probeTablebase(e) {
    var n, r, o;
    if (this.provider !== "lichess")
      throw new Error("Tablebase probe only available with Lichess provider");
    const t = new URL(J.PROVIDERS.lichess.tablebase);
    t.searchParams.set("fen", e);
    const i = await fetch(t.toString());
    if (!i.ok)
      return null;
    const s = await i.json();
    return {
      category: s.category,
      // 'win', 'draw', 'loss', 'maybe-win', etc.
      dtz: s.dtz,
      // Distance to zeroing (50-move counter)
      dtm: s.dtm,
      // Distance to mate (if available)
      bestMove: ((r = (n = s.moves) == null ? void 0 : n[0]) == null ? void 0 : r.uci) || null,
      moves: (o = s.moves) == null ? void 0 : o.map((c) => ({
        uci: c.uci,
        san: c.san,
        category: c.category,
        dtz: c.dtz
      }))
    };
  }
  /**
   * Get opening explorer data
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Options
   * @returns {Promise<Object>}
   */
  async getOpeningData(e, t = {}) {
    var r;
    if (this.provider !== "lichess")
      throw new Error("Opening explorer only available with Lichess provider");
    const i = new URL(J.PROVIDERS.lichess.opening);
    i.searchParams.set("fen", e), t.speeds && i.searchParams.set("speeds", t.speeds.join(",")), t.ratings && i.searchParams.set("ratings", t.ratings.join(","));
    const s = await fetch(i.toString());
    if (!s.ok)
      return { moves: [], games: 0 };
    const n = await s.json();
    return {
      moves: (r = n.moves) == null ? void 0 : r.map((o) => ({
        uci: o.uci,
        san: o.san,
        games: o.white + o.draws + o.black,
        white: o.white,
        draws: o.draws,
        black: o.black,
        averageRating: o.averageRating
      })),
      games: n.white + n.draws + n.black,
      opening: n.opening
    };
  }
  /**
   * Clear analysis cache
   */
  clearCache() {
    this.cachedAnalysis.clear();
  }
  /**
   * Get cache statistics
   * @returns {Object}
   */
  getCacheStats() {
    return {
      size: this.cachedAnalysis.size,
      maxSize: 1e3
    };
  }
};
/**
 * API endpoints for different providers
 */
y(J, "PROVIDERS", {
  lichess: {
    analysis: "https://lichess.org/api/cloud-eval",
    tablebase: "https://tablebase.lichess.ovh/standard",
    opening: "https://explorer.lichess.ovh/lichess"
  },
  chesscom: {
    analysis: "https://api.chess.com/pub/analysis"
  }
});
let Fe = J;
const z = class z {
  /**
   * @param {Object} chessboard - Chessboard instance
   * @param {EngineManagerConfig} [config={}] - Configuration
   */
  constructor(e, t = {}) {
    this.chessboard = e, this.config = {
      defaultEngine: "stockfish",
      autoInit: !0,
      ...t
    }, this.engines = /* @__PURE__ */ new Map(), this.currentEngine = null, this.currentEngineName = null, this.listeners = /* @__PURE__ */ new Map();
  }
  /**
   * Load an engine by name or preset
   * @param {string} nameOrPreset - Engine name or preset
   * @param {Object} [config={}] - Engine configuration
   * @returns {Promise<BaseEngine>}
   */
  async loadEngine(e, t = {}) {
    if (z.PRESETS[e]) {
      const i = z.PRESETS[e];
      return this._createEngine(e, i.type, { ...i.config, ...t });
    }
    if (z.ENGINE_TYPES[e])
      return this._createEngine(e, e, t);
    throw new Error(`Unknown engine: ${e}`);
  }
  /**
   * Create and initialize an engine
   * @private
   * @param {string} name - Engine name
   * @param {string} type - Engine type
   * @param {Object} config - Engine configuration
   * @returns {Promise<BaseEngine>}
   */
  async _createEngine(e, t, i) {
    const s = z.ENGINE_TYPES[t];
    if (!s)
      throw new Error(`Unknown engine type: ${t}`);
    const n = new s(i);
    return n.on("ready", (r) => this._emit("engineReady", { name: e, info: r })), n.on("bestmove", (r) => this._emit("bestmove", { name: e, ...r })), n.on("info", (r) => this._emit("info", { name: e, ...r })), n.on("error", (r) => this._emit("error", { name: e, error: r })), this.config.autoInit && await n.init(), this.engines.set(e, n), this.currentEngine || (this.currentEngine = n, this.currentEngineName = e), this._emit("engineLoaded", { name: e, engine: n }), n;
  }
  /**
   * Get engine by name
   * @param {string} [name] - Engine name (uses current if not specified)
   * @returns {BaseEngine|null}
   */
  getEngine(e) {
    return e ? this.engines.get(e) || null : this.currentEngine;
  }
  /**
   * Set current engine
   * @param {string} name - Engine name
   * @returns {BaseEngine}
   */
  setCurrentEngine(e) {
    const t = this.engines.get(e);
    if (!t)
      throw new Error(`Engine not loaded: ${e}`);
    return this.currentEngine = t, this.currentEngineName = e, this._emit("engineChanged", { name: e, engine: t }), t;
  }
  /**
   * Unload an engine
   * @param {string} name - Engine name
   * @returns {Promise<void>}
   */
  async unloadEngine(e) {
    const t = this.engines.get(e);
    if (t) {
      if (await t.quit(), this.engines.delete(e), this.currentEngineName === e) {
        const i = Array.from(this.engines.keys());
        i.length > 0 ? this.setCurrentEngine(i[0]) : (this.currentEngine = null, this.currentEngineName = null);
      }
      this._emit("engineUnloaded", { name: e });
    }
  }
  /**
   * Unload all engines
   * @returns {Promise<void>}
   */
  async unloadAll() {
    const e = Array.from(this.engines.keys());
    await Promise.all(e.map((t) => this.unloadEngine(t)));
  }
  // ============================================================
  // Analysis Methods (delegate to current engine)
  // ============================================================
  /**
   * Get best move for current position
   * @param {Object} [options={}] - Analysis options
   * @returns {Promise<string>}
   */
  async getBestMove(e = {}) {
    this._ensureEngine();
    const t = this.chessboard.fen();
    return await this.currentEngine.setPosition(t), this.currentEngine.getBestMove(e);
  }
  /**
   * Analyze current position
   * @param {Object} [options={}] - Analysis options
   * @returns {Promise<EngineAnalysis>}
   */
  async analyze(e = {}) {
    this._ensureEngine();
    const t = this.chessboard.fen();
    return this.currentEngine.analyze(t, e);
  }
  /**
   * Analyze a specific position
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Analysis options
   * @returns {Promise<EngineAnalysis>}
   */
  async analyzePosition(e, t = {}) {
    return this._ensureEngine(), this.currentEngine.analyze(e, t);
  }
  /**
   * Stop current analysis
   * @returns {Promise<void>}
   */
  async stopAnalysis() {
    this.currentEngine && await this.currentEngine.stop();
  }
  /**
   * Set engine option
   * @param {string} name - Option name
   * @param {*} value - Option value
   * @param {string} [engineName] - Engine name (uses current if not specified)
   * @returns {Promise<void>}
   */
  async setOption(e, t, i) {
    const s = i ? this.engines.get(i) : this.currentEngine;
    if (!s)
      throw new Error("No engine available");
    await s.setOption(e, t);
  }
  // ============================================================
  // Utility Methods
  // ============================================================
  /**
   * Ensure an engine is loaded
   * @private
   */
  _ensureEngine() {
    if (!this.currentEngine)
      throw new Error("No engine loaded. Call loadEngine() first.");
    if (!this.currentEngine.ready())
      throw new Error("Engine not ready. Wait for initialization.");
  }
  /**
   * Get list of loaded engines
   * @returns {string[]}
   */
  getLoadedEngines() {
    return Array.from(this.engines.keys());
  }
  /**
   * Get current engine name
   * @returns {string|null}
   */
  getCurrentEngineName() {
    return this.currentEngineName;
  }
  /**
   * Check if an engine is loaded
   * @param {string} name - Engine name
   * @returns {boolean}
   */
  isLoaded(e) {
    return this.engines.has(e);
  }
  /**
   * Get available presets
   * @returns {string[]}
   */
  static getPresets() {
    return Object.keys(z.PRESETS);
  }
  /**
   * Get available engine types
   * @returns {string[]}
   */
  static getEngineTypes() {
    return Object.keys(z.ENGINE_TYPES);
  }
  // ============================================================
  // Event System
  // ============================================================
  /**
   * Register event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   * @returns {this}
   */
  on(e, t) {
    return this.listeners.has(e) || this.listeners.set(e, []), this.listeners.get(e).push(t), this;
  }
  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   * @returns {this}
   */
  off(e, t) {
    if (this.listeners.has(e)) {
      const i = this.listeners.get(e), s = i.indexOf(t);
      s > -1 && i.splice(s, 1);
    }
    return this;
  }
  /**
   * Emit event
   * @private
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  _emit(e, t) {
    this.listeners.has(e) && this.listeners.get(e).forEach((i) => {
      try {
        i(t);
      } catch (s) {
        console.error(`Error in ${e} listener:`, s);
      }
    });
  }
  /**
   * Destroy manager and all engines
   * @returns {Promise<void>}
   */
  async destroy() {
    await this.unloadAll(), this.listeners.clear();
  }
};
/**
 * Available engine types
 */
y(z, "ENGINE_TYPES", {
  stockfish: $e,
  uci: ei,
  cloud: Fe
}), /**
 * Pre-configured engine presets
 */
y(z, "PRESETS", {
  stockfish: {
    type: "stockfish",
    config: { depth: 20 }
  },
  "stockfish-lite": {
    type: "stockfish",
    config: { depth: 12, threads: 1, hash: 8 }
  },
  "stockfish-strong": {
    type: "stockfish",
    config: { depth: 25, threads: 4, hash: 128 }
  },
  lichess: {
    type: "cloud",
    config: { provider: "lichess" }
  },
  "lichess-tablebase": {
    type: "cloud",
    config: { provider: "lichess", useTablebase: !0 }
  }
});
let Xe = z;
/**
 * Chessboard.js - A beautiful, customizable chessboard widget
 * Main entry point for the library
 *
 * @version 3.2.0
 * @author alepot55
 * @license ISC
 */
const ti = "3.2.0", ii = "dev", si = (/* @__PURE__ */ new Date()).toISOString(), Ci = {
  name: "Chessboard.js",
  version: ti,
  build: ii,
  buildDate: si,
  author: "alepot55",
  license: "ISC",
  repository: "https://github.com/alepot55/Chessboardjs",
  homepage: "https://chessboardjs.com"
};
export {
  _t as AnimationService,
  _e as BOARD_LETTERS,
  Ue as BOARD_SIZE,
  fe as BaseEngine,
  de as BaseMode,
  bt as BoardService,
  Nt as Chess,
  Oe as ChessAI,
  q as Chessboard,
  et as ChessboardConfig,
  U as ChessboardError,
  nt as ChessboardFactory,
  Fe as CloudEngine,
  O as ConfigurationError,
  St as CoordinateService,
  Ne as CreativeMode,
  ut as DEFAULT_STARTING_POSITION,
  ft as DOMError,
  Xe as EngineManager,
  wt as EventService,
  ee as LOG_LEVELS,
  Ce as Logger,
  xe as ModeManager,
  Z as Move,
  He as MoveError,
  Pt as MoveService,
  ye as PIECE_COLORS,
  Se as PIECE_TYPES,
  dt as PROMOTION_PIECES,
  st as PerformanceMonitor,
  qe as Piece,
  Me as PieceError,
  Et as PieceService,
  Bt as PositionService,
  xt as PvPMode,
  Ve as STANDARD_POSITIONS,
  De as Square,
  $e as StockfishEngine,
  ei as UCIEngine,
  C as ValidationError,
  Ge as ValidationService,
  Be as VsBotMode,
  Vt as algebraicToCoords,
  Ei as animationPromise,
  ui as batchDOMOperations,
  bi as batchValidate,
  ii as build,
  si as buildDate,
  $ as chessboardFactory,
  Si as clearValidationCache,
  pi as coordsToAlgebraic,
  jt as createChessboard,
  zt as createChessboardFromTemplate,
  gi as createLogger,
  ai as debounce,
  q as default,
  fi as getMemoryUsage,
  vi as getSquareColor,
  yi as getValidationCacheStats,
  Ci as info,
  di as isElementVisible,
  _i as isValidCoords,
  at as isValidPiece,
  ct as isValidPosition,
  Ut as isValidSquare,
  je as logger,
  Pi as parseAnimation,
  wi as parseTime,
  ci as rafThrottle,
  li as resetTransform,
  hi as setTransform,
  oi as throttle,
  Yt as validateConfig,
  it as validateFen,
  Kt as validateFenFormat,
  Qt as validateMove,
  ti as version
};
//# sourceMappingURL=chessboard.esm.js.map
