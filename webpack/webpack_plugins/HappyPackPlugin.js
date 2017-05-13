/**
 * Created by LinChuQiang.
 */

const os = require('os')
var HappyPack = require('happypack')
var happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})

const TARGET = process.env.npm_lifecycle_event


if (TARGET === 'dev') {
  console.log(`dev：HappyPack多线程处理！`)
}

if (TARGET === 'build') {
  console.log(`build：HappyPack多线程处理！`)
  
  
}

if (TARGET === 'test') {
  console.log(`Running the test task!`)
}

// .babelrc http://babeljs.io/docs/plugins/#pluginpresets-options
// HappyPack https://zach.codes/three-webpack-2-speed-improvements/
var happyPack = [
  /*new HappyPack({
   id        : 'g',
   cache     : false,
   loaders   : ['vue-g'],
   threads   : 4,
   threadPool: happyThreadPool,
   debug:true
   }),*/
  new HappyPack({
    id     : 'happypackBabelJs',
    loaders: [
      {
        loader : 'babel-loader',
        options: {
          'cacheDirectory': true
        }
      }
    ],
    threads   : 4,
    threadPool: happyThreadPool,
    debug     : true,
    cache     : false,
    verbose   : true
  })
]
module.exports = happyPack