import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'chessboard.js', // entry point per la libreria
  output: {
    file: 'dist/chessboard.bundle.js', // percorso relativo per evitare errori di permessi
    format: 'iife', // oppure "umd" per UMD
    name: 'Chessboard'
  },
  plugins: [resolve()]
};
