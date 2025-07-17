const fs = require('fs');
const path = require('path');

// Percorsi file sorgente
const CSS_FILES = [
    'src/styles/board.css',
    'src/styles/pieces.css',
    'src/styles/animations.css',
];
const JS_FILES = [
    'src/utils/chess.js',
    'chessboard.bundle.js',
];

// Percorsi template e output
const EXAMPLES = [
    {
        template: 'examples/basic/index.html',
        output: 'examples/basic/index.html',
    },
    {
        template: 'examples/fen/index.html',
        output: 'examples/fen/index.html',
    },
    {
        template: 'examples/theme/index.html',
        output: 'examples/theme/index.html',
    },
];

function readFiles(files) {
    return files.map(f => fs.readFileSync(path.resolve(f), 'utf8')).join('\n');
}

function injectContent(template, css, js) {
    // Sostituisci i segnaposto CSS
    let html = template.replace(
        /\/\* === INIZIO CSS board\.css === \*\/[\s\S]*?\/\* === FINE CSS animations\.css === \*\//,
        css
    );
    // Sostituisci chess.js
    html = html.replace(
        /\/\/ === INIZIO chess\.js ===[\s\S]*?\/\/ === FINE chess\.js ===/,
        `<script>\n${js.chess}\n<\/script>`
    );
    // Sostituisci chessboard.bundle.js
    html = html.replace(
        /\/\/ === INIZIO chessboard\.bundle\.js ===[\s\S]*?\/\/ === FINE chessboard\.bundle\.js ===/,
        `<script>\n${js.bundle}\n<\/script>`
    );
    return html;
}

function main() {
    // Unisci CSS
    const css = CSS_FILES.map(f => fs.readFileSync(path.resolve(f), 'utf8')).join('\n');
    // Unisci JS
    const js = {
        chess: fs.readFileSync(path.resolve(JS_FILES[0]), 'utf8'),
        bundle: fs.readFileSync(path.resolve(JS_FILES[1]), 'utf8'),
    };

    EXAMPLES.forEach(({ template, output }) => {
        let templateHtml = fs.readFileSync(path.resolve(template), 'utf8');
        // Sostituisci CSS e JS
        let finalHtml = templateHtml
            .replace(/\/\* === INIZIO CSS board\.css === \*\/[\s\S]*?\/\* === FINE CSS animations\.css === \*\//,
                `/* === INIZIO CSS board.css === */\n${fs.readFileSync(CSS_FILES[0], 'utf8')}\n/* === FINE CSS board.css === */\n\n/* === INIZIO CSS pieces.css === */\n${fs.readFileSync(CSS_FILES[1], 'utf8')}\n/* === FINE CSS pieces.css === */\n\n/* === INIZIO CSS animations.css === */\n${fs.readFileSync(CSS_FILES[2], 'utf8')}\n/* === FINE CSS animations.css === */`)
            .replace(/\/\/ === INIZIO chess\.js ===[\s\S]*?\/\/ === FINE chess\.js ===/,
                `// === INIZIO chess.js ===\n${js.chess}\n// === FINE chess.js ===`)
            .replace(/\/\/ === INIZIO chessboard\.bundle\.js ===[\s\S]*?\/\/ === FINE chessboard\.bundle\.js ===/,
                `// === INIZIO chessboard.bundle.js ===\n${js.bundle}\n// === FINE chessboard.bundle.js ===`);
        fs.writeFileSync(path.resolve(output), finalHtml, 'utf8');
        console.log(`Creato: ${output}`);
    });
}

main(); 