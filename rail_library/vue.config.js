const path = require('path')
const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  publicPath: '/',
  configureWebpack() {
    return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          public: path.resolve(__dirname, './public'),
          config: path.resolve(__dirname, './config'),
        },
      },
      plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        // 下面是下载的插件的配置
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
        }),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 5,
          minChunkSize: 100,
        }),
      ],
    }
  },
}
