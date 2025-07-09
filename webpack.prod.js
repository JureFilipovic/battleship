const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: "/image-carousel/",
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
});