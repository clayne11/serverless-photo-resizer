const path = require('path')
const slsw = require('serverless-webpack')
const decompress = require('decompress')
const nodeExternals = require('webpack-node-externals')

const pathFromRoot = curPath => path.join(__dirname, curPath)

const outputPath = path.join(__dirname, '.webpack')

const SHARP_VERSION = '0.20.8'
const sharpTarball = path.join(
  __dirname,
  `lambda-sharp/tarballs/sharp-${SHARP_VERSION}-aws-lambda-linux-x64-node-8.10.0.tar.gz`
)

const createExtractTarballPlugin = ({archive, to}) => {
  return {
    apply: compiler => {
      compiler.hooks.afterEmit.tapAsync(
        'SharpExtractor',
        async (_compilation, callback) => {
          try {
            await decompress(path.resolve(archive), path.resolve(to))
            callback()
          } catch (error) {
            console.error(
              'Unable to extract archive ',
              archive,
              to,
              error.stack
            )
          }
        }
      )
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
  plugins: slsw.lib.webpack.isLocal
    ? []
    : [createExtractTarballPlugin({archive: sharpTarball, to: outputPath})],
}
