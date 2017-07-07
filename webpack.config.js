const path = require('path');
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
  assets: path.resolve(__dirname, 'assets'),
  dist: path.resolve(__dirname, 'dist'),
  src: path.resolve(__dirname, 'src'),
};

const style = new ExtractText({
  filename: '[name].bundle.css',
  allChunks: true,
});

const base = {
  context: dir.src,
  entry: {
    app: 'index.js',
    vendor: ['babel-polyfill'],
  },
  resolve: {
    extensions: ['.js', '.json'],
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
        use: ['file-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    style,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].bundle.min.js',
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
      favicon: path.resolve(`${dir.assets}/img/favicon.ico`),
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
};

const prod = {
  devtool: 'source-map',
  output: {
    path: dir.dist,
    filename: '[name].bundle.min.js',
    sourceMapFilename: '[name].bundle.map',
  },
  plugins: [
    new Clean(path.resolve(dir.dist, '**', '*'), { root: dir.dist }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['webpackJsonp'],
      },
    }),
  ],
};

const environments = { dev, prod };

module.exports = env => merge(base, environments[env]);
