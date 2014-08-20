var grunt = require('grunt');
grunt.loadNpmTasks('grunt-mocha-test');

grunt.initConfig({
  mochaTest: {
    test: {
      options: {
        reporter: 'spec'
      },
      src: ['tests/tests/**/*.js']
    }
  }
});

grunt.registerTask('test', [ 'mochaTest' ]);