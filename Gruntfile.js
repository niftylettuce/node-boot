var fs = require('fs');

module.exports = function(grunt) {
  // Bower filenames:
  bowerRcFilename = '.bowerrc';
  bowerRcFilenameDefault = 'component.json';

  // Define root paths to 3party assets and this app's custom assets:
  var gruntBowerDir = './grunt-bower-lib';
  var customAssetsDir = './assets';

  // Order critical list of 3rd party & custom dependencies,
  // list in correct order (i.e. jQuery first for 3rd party)
  // and paths relative to the Bower ("./components/")" directory.
  var bowerJs = [];
  var bowerCss = [];
  var bowerRc = {};
  if (grunt.file.exists(bowerRcFilename)) {
    bowerRc = grunt.file.readJSON(bowerRcFilename);
  }
  if (!bowerRc.json) {
    bowerRc.json = bowerRcFilenameDefault;
  }
  var bowerComps = grunt.file.readJSON(bowerRc.json);
  String.prototype.endsWith = function(suffix) {
    return this.toLowerCase().indexOf(suffix, this.length - suffix.length) !== -1;
  };
  var isJavascript = function(filename) {
    return filename.endsWith('.js');
  };
  var isCss = function(filename) {
    return filename.endsWith('.css');
  };
  var getFilename = function(path) {
    return path.split('\\').pop().split('/').pop();
  };
  var getPrefixMapFn = function(comp) {
    return function (path) {
      return gruntBowerDir + '/' + comp + '/' + path;
    };
  };
  Object.keys(bowerComps.dependencies).forEach(function(comp) {
    if (bowerComps.exportsOverride && bowerComps.exportsOverride[comp]) {
      // This Bower component was overridden to specify exact files to
      // include from the library. Additionally we will infer the order
      // that those files should be included in steps such as concat
      // which ultimately affects the order the code is presented to
      // the browser. So if it's critical to have one file come after another
      // (say you want bootstrap.css to come before bootstrap-responsive.css)
      // include them in that order in the exportsOverride field of
      // component.json.
      Object.keys(bowerComps.exportsOverride[comp]).forEach(function(targetDir) {
        var srcFiles = bowerComps.exportsOverride[comp][targetDir];
        var jsFiles = srcFiles.filter(isJavascript);
        var cssFiles = srcFiles.filter(isCss);
        var prefixMapFn = getPrefixMapFn(comp);
        if (jsFiles && jsFiles.length > 0) {
          bowerJs = bowerJs.concat(jsFiles.map(getFilename).map(prefixMapFn));
        }
        if (cssFiles && cssFiles.length > 0) {
          bowerCss = bowerCss.concat(cssFiles.map(getFilename).map(prefixMapFn));
        }
      });
    } else {
      bowerJs.push(gruntBowerDir + '/' + comp + '/*.js');
      bowerCss.push(gruntBowerDir + '/' + comp + '/*.css');
    }
  });

  // Initialize Grunt configuration:
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      prod: {
        src: ['./public/dist/']
      },
      dev: {
        src: ['./public/dist-dev/']
      }
    },
    bower: {
      install: {
        options: {
          targetDir: gruntBowerDir
        }
      }
    },
    jshint: {
      // define the files to lint
      files: ['Gruntfile.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    concat: {
      options: {
        stripBanners: false,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
      },
      '3party-js': {
        src: bowerJs,
        dest: gruntBowerDir + '/3party/3party.js'
      },
      '3party-css': {
        src: bowerCss,
        dest: gruntBowerDir + '/3party/3party.css'
      },
      'custom-js': {
        src: [
          customAssetsDir + '/js/*.js'
        ],
        dest: gruntBowerDir + '/<%= pkg.name %>/<%= pkg.name %>.js'
      },
      'custom-css': {
        src: [
          customAssetsDir + '/css/*.css'
        ],
        dest: gruntBowerDir + '/<%= pkg.name %>/<%= pkg.name %>.css'
      }
    },
    min: {
      dist: {
        files: {
          './public/dist/js/3party.min.js': gruntBowerDir + '/3party/3party.js',
          './public/dist/js/<%= pkg.name %>.min.js': gruntBowerDir + '/<%= pkg.name %>/<%= pkg.name %>.js'
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          './public/dist/css/3party.min.css': gruntBowerDir + '/3party/3party.css',
          './public/dist/css/<%= pkg.name %>.min.css': gruntBowerDir + '/<%= pkg.name %>/<%= pkg.name %>.css'
        }
      }
    },
    copy: {
      prod: {
        files: [
          {expand: true, cwd: customAssetsDir + '/img/', src: ['**'], dest: './public/dist/img/', filter: 'isFile'},
          {expand: true, cwd: customAssetsDir + '/ico/', src: ['**'], dest: './public/dist/ico/', filter: 'isFile'},
          {expand: true, cwd: customAssetsDir + '/fonts/', src: ['**'], dest: './public/dist/fonts/', filter: 'isFile'}
        ]
      },
      dev: {
        files: [
          {expand: true, cwd: gruntBowerDir + '/3party/', src: ['3party.js'], dest: './public/dist-dev/js/', filter: 'isFile'},
          {expand: true, cwd: gruntBowerDir + '/3party/', src: ['3party.css'], dest: './public/dist-dev/css/', filter: 'isFile'},
          {expand: true, cwd: gruntBowerDir + '/<%= pkg.name %>/', src: ['<%= pkg.name %>.js'], dest: './public/dist-dev/js/', filter: 'isFile'},
          {expand: true, cwd: gruntBowerDir + '/<%= pkg.name %>/', src: ['<%= pkg.name %>.css'], dest: './public/dist-dev/css/', filter: 'isFile'},
          {expand: true, cwd: customAssetsDir + '/img/', src: ['**'], dest: './public/dist-dev/img/', filter: 'isFile'},
          {expand: true, cwd: customAssetsDir + '/ico/', src: ['**'], dest: './public/dist-dev/ico/', filter: 'isFile'},
          {expand: true, cwd: customAssetsDir + '/fonts/', src: ['**'], dest: './public/dist-dev/fonts/', filter: 'isFile'}
        ]
      }
    },
    watch: {
      files: [
        '<%= jshint.files %>', // Gruntfile.js - TODO: apply to custom assets & node scripts
        'package.json', // NPM modules
        bowerRc.json,   // Bower modules
        'assets/**'
      ],
      tasks: ['dev']
    }
  });

  // Load libs
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-yui-compressor');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Register the default tasks
  grunt.registerTask('default', [
    'clean',
    'bower:install',
    'jshint',
    'concat',
    'min',
    'cssmin',
    'copy:prod'
    ]
  );

  // Developer tasks (not for production):
  grunt.registerTask('dev', [
    'clean:dev',
    'bower:install',
    'jshint',
    'concat',
    'copy:dev'
  ]);
};
