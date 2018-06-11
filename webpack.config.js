const path = require('path');
const Dotenv = require('dotenv-webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var webpack = require('webpack');

//TODO - convert to production mode, which will automatically include the webpack plugins listed below, but need to debug why it is having problems with BigInteger

module.exports = {
  target: 'web',
  mode: 'none',
  entry: {
    background: './src/background.js',
    popup: './src/popup.js'
  },
  output: {
    filename: "[name].bundle.js", 
    path: path.resolve(__dirname, 'dist')
  }, 
  plugins: [
    new Dotenv(),
    new UglifyJsPlugin({
      uglifyOptions: {
        mangle: {
          reserved: [
            'Buffer',
            'BigInteger',
            'Point',
            'ECPubKey',
            'ECKey',
            'sha512_asm',
            'asm',
            'ECPair',
            'HDNode'
        ]
        },
        optimization: {
          minimize: false
        },
      }
    }),
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(), 
    new webpack.NamedModulesPlugin(),
  ], 
  module: {
    rules: [
        {
        test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }
    ]
  },
};
