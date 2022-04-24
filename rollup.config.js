import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

const BABEL_CONFIG = {
  exclude: 'node_modules/**',
  extensions: ['ts', 'js'],
  babelHelpers: 'runtime',
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: false,
      corejs: false,
      targets: {
        browsers: ['iOS >= 8', 'Android >= 30']
      }
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
      helpers: true,
      regenerator: true,
      useESModules: true
    }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
  ]
};

const CJS_CONFIG = {
  input: pkg.src,
  output: [
    {
      dir: './',
      entryFileNames: pkg.main,
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    resolve({
      extensions: ['ts', 'js']
    }),
    commonjs(),
    typescript({
      declaration: true,
      declarationDir: './dist',
      rootDir: 'src/'
    }),
    babel(BABEL_CONFIG)
  ]
};
const ESM_CONFIG = {
  input: pkg.src,
  output: [
    {
      dir: './',
      entryFileNames: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    resolve({
      extensions: ['ts', 'js']
    }),
    commonjs(),
    typescript(),
    babel(BABEL_CONFIG)
  ]
};
const DEV_CONFIG = {
  input: pkg.src,
  output: [
    {
      file: 'demo/index.es6.js',
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    resolve({
      extensions: ['ts', 'js']
    }),
    commonjs(),
    typescript()
  ]
};

// export default [DEV_CONFIG];
export default [CJS_CONFIG, ESM_CONFIG, DEV_CONFIG];
