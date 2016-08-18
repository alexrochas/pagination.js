var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0'],
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  entry: [
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  plugins: [
    new webpack.DefinePlugin({
     'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
  ]
};
