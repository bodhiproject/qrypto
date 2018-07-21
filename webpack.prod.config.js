const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: {
            safari10: true,
            keep_fnames: true,
          },
        },
      }),
    ],
    concatenateModules: false,
  },
});
