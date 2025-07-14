import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js', // nuovo entry point
  output: [
    {
      file: 'dist/chessboard.esm.js', // ES modules
      format: 'esm'
    },
    {
      file: 'dist/chessboard.cjs.js', // CommonJS
      format: 'cjs'
    },
    {
      file: 'dist/chessboard.umd.js', // UMD
      format: 'umd',
      name: 'Chessboard'
    },
    {
      file: 'dist/chessboard.iife.js', // IIFE per browser
      format: 'iife',
      name: 'Chessboard'
    }
  ],
  plugins: [resolve()]
};
