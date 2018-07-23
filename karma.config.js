process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  config.set({
    preprocessors: {
      './lib/*.js': ['browserify'],
      './test/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: [
        ['babelify', {
          presets: ['env']
        }]
      ]
    },
    frameworks: ['mocha', 'chai', 'browserify'],
    files: ['lib/**/*.js', 'test/**/*.js'],
    reporters: ['progress'],
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity
  })
}
