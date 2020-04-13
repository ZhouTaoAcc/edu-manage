'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    //vue-cli提供的解决跨域问题的方法 依赖于node.js 用服务端代理解决浏览器跨域
    proxyTable: {
      // '/api/cms': {
      //   target: 'http://localhost:31001',  //cms页面管理服务
      //   pathRewrite: {
      //     '^/api': ''//实际请求去掉/api
      //   }
      // },
      // '/api/system': {
      //   target: 'http://localhost:31001',  //系统管理服务
      //   pathRewrite: {
      //     '^/api': ''//实际请求去掉/api
      //   }
      // },
      // '/api/course': {
      //   target: 'http://localhost:31002', //课程管理服务
      //   pathRewrite: {
      //     '^/api': ''//实际请求去掉/api
      //   }
      // },
      // '/api/fileServer': {
      //   target: 'http://localhost:51000', //文件服务
      //   pathRewrite: {
      //     '^/api': ''//实际请求去掉/api
      //   }
      // },
      // '/api/media': {//媒资上传服务
      //   target: 'http://localhost:31004', //文件服务
      //   pathRewrite: {
      //     '^/api': ''//实际请求去掉/api
      //   }
      // },
      // '/auth': {//认证服务
      //   target: 'http://localhost:41001',
      // }
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
