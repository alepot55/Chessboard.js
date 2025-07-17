const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const PIECES_PATH = 'https://cdn.jsdelivr.net/npm/@alepot55/chessboardjs/assets/themes/default';

// Percorsi file sorgente
const CSS_FILES = [
    'src/styles/board.css',
    'src/styles/pieces.css',
    'src/styles/animations.css',
];
const JS_FILE = 'dist/chessboard.iife.js';

// Configurazione degli esempi
const EXAMPLES = [
    {
        template: 'examples/basic/index.html',
        outputAllInOne: 'examples/basic/index.allinone.html',
        outputAllInOneMin: 'examples/basic/index.min.allinone.html',
        init: `var board = new Chessboard({ id: 'board', piecesPath: '${PIECES_PATH}' });`
    },
    {
        template: 'examples/fen/index.html',
        outputAllInOne: 'examples/fen/index.allinone.html',
        outputAllInOneMin: 'examples/fen/index.min.allinone.html',
        init: `let fen = 'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1p3PPP/R5K1 b - - 0 19';\nvar board = new Chessboard({\n  id: 'board',\n  position: fen,\n  orientation: 'b',\n  piecesPath: '${PIECES_PATH}'\n});`
    },
    {
        template: 'examples/theme/index.html',
        outputAllInOne: 'examples/theme/index.allinone.html',
        outputAllInOneMin: 'examples/theme/index.min.allinone.html',
        init: `var board = new Chessboard({\n  id: 'board',\n  ratio: 0.75,\n  hintColor: '#a192ed',\n  whiteSquare: '#e7edf9',\n  blackSquare: '#b6c1d8',\n  selectedSquareWhite: '#b5a6fc',\n  selectedSquareBlack: '#a192ed',\n  piecesPath: '${PIECES_PATH}'\n});`
    },
];

function patchIIFEGlobalInMemory(js) {
    // Rimuovi eventuali patch precedenti
    js = js.replace(/window\.Chessboard\s*=.*?;\s*$/gm, '');
    // Patch: garantisce Chessboard globale come funzione costruttore
    js += '\nif (window.Chessboard && window.Chessboard.default) { window.Chessboard = window.Chessboard.default; }\n';
    return js;
}

async function main() {
    // Unisci CSS
    const css = CSS_FILES.map(f => fs.readFileSync(path.resolve(f), 'utf8')).join('\n');
    // Bundle IIFE (in memoria, patchato)
    let js = fs.readFileSync(path.resolve(JS_FILE), 'utf8');
    js = patchIIFEGlobalInMemory(js);
    // Minifica il bundle
    const minified = (await minify(js)).code;

    EXAMPLES.forEach(({ template, outputAllInOne, outputAllInOneMin, init }) => {
        let templateHtml = fs.readFileSync(path.resolve(template), 'utf8');

        // Rimuovi tutti i blocchi <script> che contengono solo commenti placeholder o l'inizializzazione di esempio
        templateHtml = templateHtml.replace(/<script>\s*\/\*[^]*?\*\/\s*<\/script>/g, ''); // blocchi solo commento
        templateHtml = templateHtml.replace(/<script>[^<]*var board = new Chessboard\([^<]*<\/script>/g, ''); // blocchi esempio base
        templateHtml = templateHtml.replace(/<script>[^<]*let fen = [^<]*<\/script>/g, ''); // blocchi esempio fen
        templateHtml = templateHtml.replace(/<script>[^<]*var board = new Chessboard\({[^<]*<\/script>/g, ''); // blocchi esempio theme

        // Inserisci CSS prima di </head>
        const cssBlock = `<style>\n/* === INIZIO CSS board.css === */\n${fs.readFileSync(CSS_FILES[0], 'utf8')}\n/* === FINE CSS board.css === */\n\n/* === INIZIO CSS pieces.css === */\n${fs.readFileSync(CSS_FILES[1], 'utf8')}\n/* === FINE CSS pieces.css === */\n\n/* === INIZIO CSS animations.css === */\n${fs.readFileSync(CSS_FILES[2], 'utf8')}\n/* === FINE CSS animations.css === */\n</style>`;
        templateHtml = templateHtml.replace(/<\/head>/i, match => cssBlock + '\n' + match);

        // Inserisci JS bundle + init prima di </body>
        const jsBlock = `<script>\n// === INIZIO chessboard.iife.js + init ===\n${js}\n(function waitForChessboard() {\n  if (typeof window.Chessboard === 'function') {\n    ${init}\n  } else {\n    setTimeout(waitForChessboard, 30);\n  }\n})();\n// === FINE chessboard.iife.js + init ===\n<\/script>`;
        const jsBlockMin = `<script>\n// === INIZIO chessboard.iife.js + init (min) ===\n${minified}\n(function waitForChessboard() {\n  if (typeof window.Chessboard === 'function') {\n    ${init}\n  } else {\n    setTimeout(waitForChessboard, 30);\n  }\n})();\n// === FINE chessboard.iife.js + init (min) ===\n<\/script>`;
        let allInOneHtml = templateHtml.replace(/<\/body>/i, match => jsBlock + '\n' + match);
        let allInOneMinHtml = templateHtml.replace(/<\/body>/i, match => jsBlockMin + '\n' + match);

        fs.writeFileSync(path.resolve(outputAllInOne), allInOneHtml, 'utf8');
        console.log(`Creato: ${outputAllInOne}`);
        fs.writeFileSync(path.resolve(outputAllInOneMin), allInOneMinHtml, 'utf8');
        console.log(`Creato: ${outputAllInOneMin}`);
    });
}

main(); 