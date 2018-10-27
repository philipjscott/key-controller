process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  config.set({
    preprocessors: {
      './lib/*.js': ['browserify', 'coverage'],
      './test/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: [
        ['babelify', { presets: ['env'] }],
        ['browserify-istanbul', {
          ignore: ['test/*.'],
          defaultIgnore: true
        }]
      ]
    },
    frameworks: ['mocha', 'chai', 'browserify'],
    files: ['test/**/*.js'],
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      /* instrumenterOptions: {
        istanbul: { noCompact: true }
      }, */
      type: 'lcov',
      dir: 'coverage/'
    },
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity
  })
}
