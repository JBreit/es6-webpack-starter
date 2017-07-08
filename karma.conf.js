//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      'node_modules/angular/angular.js',
      'lib/vendor/angular-ui-router/release/angular-ui-router.js',
      'lib/vendor/angular-mocks/angular-mocks.js',
      'common/**/*.js',
      'components/**/*.js',
      'view*/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
