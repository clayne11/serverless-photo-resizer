const path = require('path')
const slsw = require('serverless-webpack')
const decompress = require('decompress')
const nodeExternals = require('webpack-node-externals')

const pathFromRoot = curPath => path.join(__dirname, curPath)

module.exports = {
  context: pathFromRoot(''),
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: 'source-map',
  resolve: {
    modules: [pathFromRoot('./src'), 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.css',
      '.scss',
      '.json',
      '.svg',
      '.png',
      '.jpg',
      '.jpeg',
      '.zip',
      '.pdf',
      '.tff',
      '.woff',
      '.woff2',
      '.eot',
      '.html',
      '.yml',
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: outputPath,
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {test: /\.tsx?$/, loader: 'babel-loader'},
    ],
  },
  externals: [nodeExternals()],
}
