const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const thisrules = require('./webpack_config/module.js').dev

const webpackConfig = merge(baseWebpackConfig, {
  devtool: require('./webpack_config/devtool.js').dev,
  entry: require('./webpack_config/entry.js').dev,
  output: require('./webpack_config/output.js').dev,
  module: {
    /*
     [{
       test : /\.css$/,
       use  : [
         {loader  : 'vue-style-loader',},
         {
          loader  : 'css-loader',
          options : {
             minimize  : process.env.NODE_ENV === 'production',
             sourceMap : options.sourceMap
          }
         }
      ]
     }]
     * */
    rules: thisrules
  },
  plugins: require('./webpack_config/plugins.js').dev
})
console.log('devtool: ',webpackConfig.devtool)
console.log('entry: ', webpackConfig.entry)
console.log('output: ',webpackConfig.output)
console.log('rules: ',webpackConfig.module.rules)
console.log('plugins: ', webpackConfig.plugins)
module.exports = webpackConfig
