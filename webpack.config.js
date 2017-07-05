const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const Clean = require('clean-webpack-plugin');
const Html = require('html-webpack-plugin');
const ExtractText = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const pkg = require('./package.json');

const banner = `
  ${pkg.name} - ${pkg.description}
  Author: ${pkg.author.name}
  Version: ${pkg.version}
  Url: ${pkg.homepage}
  License(s): ${pkg.license}
`;

const dir = {
  dist: resolve('dist'),
  src: resolve('src'),
};

const styleBundle = new ExtractText(resolve(`assets/css/main.css`));

const base = {
  context: dir.src,
  entry: {
    app: 'index.js'
  },
  resolve: {
    modules: [dir.src, 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      // {
      //   test: /\.css$/,
      //   use: styleBundle.extract([
      //     'css-loader',
      //     'style-loader',
      //   ]),
      // },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: styleBundle.extract([
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]),
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: { minimize: false },
        },
      },
    ],
  },
  plugins: [
    styleBundle,
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [autoprefixer(pkg.browserslist)],
      },
    }),
    new webpack.BannerPlugin(banner),
  ],
};

const dev = {
  devtool: 'eval-source-map',
  plugins: [new Html({ template: resolve('index.html') })],
};

const prod = {
  output: {
    path: dir.dist,
    filename: `bundle.min.js`,
  },
  plugins: [
    new Clean(resolve(dir.dist, '**', '*'), { root: dir.dist }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: { except: ['webpackJsonp'] },
    }),
  ],
};

const environments = { dev, prod };

module.exports = env => merge(base, environments[env]);