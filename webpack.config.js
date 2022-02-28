'use strict';

const webpack = require('webpack');
const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';
const isProd = !isDev;

const fileSuffix = isDev ? '' : '-[chunkhash].min';

function resolveModulePath(name) {
  const packageJson = '/package.json';
  return path.dirname(require.resolve(`${name}${packageJson}`));
}

const codemirrorPath = resolveModulePath('codemirror');
const lineAwesomePath = resolveModulePath('line-awesome');

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: {
    index: {
      import: './lib/scripts/index.js',
      dependOn: 'vendor',
    },
    database: {
      import: './lib/scripts/database.js',
      dependOn: 'vendor',
    },
    collection: {
      import: './lib/scripts/collection.js',
      dependOn: ['vendor', 'codemirror'],
    },
    document: {
      import: './lib/scripts/document.js',
      dependOn: ['vendor', 'codemirror'],
    },
    gridfs: {
      import: './lib/scripts/gridfs.js',
      dependOn: 'vendor',
    },

    // Shared
    vendor: ['./lib/scripts/vendor.js', './public/stylesheets/style.scss'],
    codemirror: {
      import: './lib/scripts/codeMirrorLoader.js',
      dependOn: 'vendor',
    },
  },
  output: {
    filename: `[name]${fileSuffix}.js`,
    path: path.resolve(__dirname, './build'),
    publicPath: 'public/',
  },

  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /(.yarn)/,
        options: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.s[ac]ss$/,
        // type: 'asset',
        use: [
          // TODO
          // Creates `style` nodes from JS strings
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          // OR
          // MiniCssExtractPlugin.loader,
          // OR
          // 'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // TODO remove?
          'postcss-loader',
          // Compiles Sass to CSS
          'sass-loader',
          // {
          //   loader: 'file-loader',
          //   options: {
          //     name: '[name].css',
          //     outputPath: 'css',
          //   },
          // },
          // 'extract-loader', 'css-loader', 'sass-loader',
        ],
      },
    ],
  },

  // optimization: {
  //   minimizer: [
  //     new CssMinimizerPlugin(),
  //   ],
  // },

  plugins: [
    new CleanWebpackPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      __DEV__: isDev,
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/images', to: 'img' },

        { from: path.join(codemirrorPath, '/lib/codemirror.css'), to: 'css' },
        { from: path.join(codemirrorPath, '/theme'), to: 'css/theme' },

        { from: path.join(lineAwesomePath, '/dist/font-awesome-line-awesome/webfonts'), to: 'webfonts' },
      ],
    }),

    new AssetsPlugin({ filename: 'build-assets.json' }),

    // isProd ? new MiniCssExtractPlugin() : [],
    // OR
    // new MiniCssExtractPlugin(),
  ].filter((n) => !!n),
};
