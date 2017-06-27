/* @flow */

import common from './common';
import merge from 'webpack-merge';
import { multiCompiler } from './directory';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import FlowStatusWebpackPlugin from 'flow-status-webpack-plugin';

const configs = multiCompiler(page => ({
  devtool: 'cheap-eval-source-map',

  devServer: {
    stats: {
      chunks: false,
    },
  },

  plugins: [
    new FlowStatusWebpackPlugin({
      onSuccess: stdout => console.log(stdout),
      onError: stdout => console.log(stdout),
    }),
    new ExtractTextPlugin('[name].css'),
  ],

  output: {
    filename: '[name].js',
  },
}));

export default merge.multiple(common, configs);
