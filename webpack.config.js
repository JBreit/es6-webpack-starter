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
  assets: resolve(__dirname, 'assets'),
  dist: resolve(__dirname, 'dist'),
  src: resolve(__dirname, 'src'),
};

const style = new ExtractText({
  filename: 'bundle.css',
  allChunks: true,
});

const base = {
  context: dir.src,
  entry: {
    app: 'index.js',
    vendor: ['babel-polyfill'],
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
      {
        test: /\.css$/,
        use: style.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
              },
            },
          ],
        }),
      },
      {
        test: /\.(sass|scss)$/,
        use: style.extract([
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]),
      },
      {
        test: /\.(html|htm)$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: false,
          },
        },
      },
      {
        test: /\.(ico|png|svg|jpeg|gif)$/i,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    style,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.min.js',
      minChunks: 2,
    }),
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
  plugins: [
    new Html({
      template: resolve(__dirname, 'index.html'),
    }),
  ],
};

const prod = {
  devtool: 'source-map',
  output: {
    path: dir.dist,
    filename: 'bundle.min.js',
    sourceMapFilename: 'bundle.map',
  },
  plugins: [
    new Clean(resolve(dir.dist, '**', '*'), { root: dir.dist }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['webpackJsonp'],
      },
    }),
  ],
};

const environments = { dev, prod };

module.exports = env => merge(base, environments[env]);
