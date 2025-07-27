import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

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
      name: 'ChessboardLib',
      footer: 'var Chessboard = ChessboardLib.default; if (typeof window !== "undefined") { window.Chessboard = Chessboard; Object.keys(ChessboardLib).forEach(key => { if (key !== "default") Chessboard[key] = ChessboardLib[key]; }); }'
    }
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.BUILD_NUMBER': JSON.stringify(''),
      'process.env.BUILD_DATE': JSON.stringify(''),
      preventAssignment: true
    }),
    resolve()
  ]
};
