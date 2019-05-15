const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './lib/moment-ranges.js',
  externals: {
    moment: 'moment'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: '/tmp/',
          plugins: ['transform-flow-strip-types'],
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre'
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, './lib'),
      path.resolve(__dirname, './node_modules')
    ]
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, './node_modules')
    ]
  },
  output: {
    filename: 'moment-ranges.js',
    library: 'moment-ranges',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './dist/'),
    umdNamedDefine: true
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
