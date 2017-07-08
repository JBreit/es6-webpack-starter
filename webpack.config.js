const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const merge = require('webpack-merge');
const Clean = require('clean-webpack-plugin');
const Html = require('html-webpack-plugin');
const ExtractText = require('extract-text-webpack-plugin');
const Preload = require('preload-webpack-plugin');
const PurifyCSS = require('purifycss-webpack');
const autoprefixer = require('autoprefixer');
const pkg = require('./package');

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
  app: path.resolve(__dirname, 'src/app'),
};

const markup = new Html({
  title: pkg.title,
  favicon: path.resolve(dir.app, 'img/favicon.ico'),
  template: path.resolve(dir.src, 'index.html'),
});

const style = new ExtractText({
  filename: 'app/css/[name].css',
  allChunks: true,
});

const base = {
  context: dir.app,
  entry: {
    app: 'app.js',
    common: path.resolve(dir.app, 'common/common.js'),
    vendor: ['babel-polyfill'],
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [dir.app, 'node_modules'],
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
        test: /\.(ico|png|svg|jpeg|gif)$/,
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
    markup,
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'common'],
      filename: 'app/[name].min.js',
      minChunks: 2,
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [autoprefixer(pkg.browserslist)],
      },
    }),
    new webpack.BannerPlugin(banner),
    new PurifyCSS({
      paths: glob.sync(path.resolve(__dirname, 'index.html')),
    }),
  ],
};

const dev = {
  devtool: 'eval-source-map',
  plugins: [
    new Preload({
      rel: 'preload',
      as: 'script',
      include: 'asyncChunks',
      fileBlacklist: [/\.map$/]
    }),
  ],
};

const prod = {
  devtool: 'source-map',
  output: {
    path: dir.dist,
    filename: 'app/[name].min.js',
    sourceMapFilename: 'app/[name].map',
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
