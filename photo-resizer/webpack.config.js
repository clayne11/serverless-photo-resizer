const path = require('path')
const slsw = require('serverless-webpack')
const decompress = require('decompress')

const pathFromRoot = curPath => path.join(__dirname, curPath)

const SHARP_VERSION = '0.20.8'
const sharpTarball = path.join(
  __dirname,
  `lambda-sharp/tarballs/sharp-${SHARP_VERSION}-aws-lambda-linux-x64-node-8.10.0.tar.gz`
)
const webpackDir = path.join(__dirname, '.webpack/')

function ExtractTarballPlugin(archive, to) {
  return {
    apply: compiler => {
      compiler.plugin('emit', (_compilation, callback) => {
        decompress(path.resolve(archive), path.resolve(to))
          .then(() => callback())
          .catch(error =>
            console.error(
              'Unable to extract archive ',
              archive,
              to,
              error.stack
            )
          )
      })
    },
  }
}

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
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {test: /\.tsx?$/, loader: 'babel-loader'},
    ],
  },
  externals: ['sharp', 'aws-sdk'],
  plugins: [new ExtractTarballPlugin(sharpTarball, webpackDir)],
}
