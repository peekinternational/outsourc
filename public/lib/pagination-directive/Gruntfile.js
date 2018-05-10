module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist'],
    uglify: {
      my_target: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/pagination-directive.min.js': ['src/pagination-directive.js']
        }
      }
    },
    copy: {
        main: {
            files: [{
                expand: true,
                cwd: 'src/',
                src: ['pagination-directive.js'],
                dest: 'dist/'
            }]
        }
    }
  });

  grunt.registerTask('build', ['clean', 'uglify', 'copy']);

};