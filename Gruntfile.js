module.exports = function(grunt) {
  var config = {
    js: 'www/js'
  }

  // Project configuration.
  grunt.initConfig({
    config: config,
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      js: {
        files: 'app/**/*.js',
        tasks: 'concat'
      }
    },

    bower_concat: {
      all: {
        dest: '<%= config.js %>/deps.js',
        dependencies: {
         'backbone': 'jquery'
        }
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      app: {
        src: ['app/app.js','app/lib/*.js','app/router.js'],
        dest: '<%= config.js %>/app.js'
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['concat', 'bower_concat']);
};
