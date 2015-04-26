/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    watch: {
      scsslint: {
        files: '_template/scss/**/*.scss',
        tasks: ['scsslint']
      },
      css: {
        files: '_template/scss/**/*.scss',
        tasks: ['sass']
      },
      js: {
        files: '_template/js/**/*.js',
        tasks: ['requirejs']
      },
      node: {
        files: ['_api/api.js', '_template/**/*.html', '_illustrations/**/*.svg'],
        tasks: ['shell:api']
      }
    },
    sass: {
      dist: {
        files: {
            'style.css' : '_template/scss/style.scss'
        }
      }
    },
    scsslint: {
      allFiles: [
        '_template/scss/**/*.scss'
      ],
      options: {
        config: '_template/scss/.scss-lint.yml'
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: '_template/js',
          name: 'main',
          out: 'main.js',
          findNestedDependencies: true
        }
      }
    },
    shell: {
      api: {
        command: ['cd _api', 'node api.js'].join('&&')
      },
      index: {
        command: ['cd _api', 'node markets.js', 'node home.js'].join('&&')
      }
    },
    browserSync: {
      bsFiles: {
        src: 'style.css'
      },
      options: {
        watchTask: true,
        server: {
          baseDir: "./"
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Default task.
  grunt.registerTask('default', ['shell:api', 'sass', 'scsslint', 'requirejs', 'browserSync', 'watch']);
  
  // Init task
  grunt.registerTask('init', ['shell:index', 'shell:api', 'sass']);
};
