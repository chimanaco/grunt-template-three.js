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
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: false,   // true error for console.log
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
            // src: ['lib/**/*.js', 'test/**/*.js']
                src: ['./src/**/*.js']
            }
        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';',
                banner: '<%= banner %>',
                stripBanners: false
            },
            dist: {
                src: ['./src/**/*.js'],
                dest: './deploy/js/<%= pkg.name %>.js'
            }
        },
        removelogging: {
            dist: {
                src: '<%= uglify.dist.dest %>',
                dest: '<%= uglify.dist.dest %>',
                report: "min"
            }
        },
        uglify: {
            options: {
                // banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: './deploy/js/<%= pkg.name %>.min.js',
                report: "min"
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: false,
                    collapseWhitespace: false
                },
                files: {
                    './deploy/index.html': './src/index.html' // 'destination': 'source'
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'scss',
                    cssDir: 'deploy/css',
                    environment: 'production'
                }
            }
        },
        connect: {
            server: {
                options: { 
                    port: 9000,
                    base: './deploy'
                }
            }
        },
        watch: {
            options: {
                    livereload: true
            },
            js: {
                files: ['./src/**/*.js', './scss/*.scss', './src/**/*.html'],
                tasks: ['default',],
            },
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            }//,
            // lib_test: {
            //     files: '<%= jshint.lib_test.src %>',
            //     tasks: ['jshint:lib_test', 'qunit']
            // }
        }
    }
);

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-remove-logging");

    // pre task.
    grunt.registerTask('start', ['connect', 'watch']);

    // Default task.    js -> html -> css
    grunt.registerTask('default', ['jshint', 'concat', 'removelogging', 'uglify', 'htmlmin', 'compass' ]);

    // Default task.   usually only need js
    // grunt.registerTask('default', ['jshint', 'concat', 'removelogging', 'uglify' ]);
};
