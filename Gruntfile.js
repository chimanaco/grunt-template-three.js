module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        path: {
            source: 'src',
            publish: 'dist'
        },
        // Task configuration.
        clean: {
            build: ['<%= path.publish %>']
        },
        compass: {                  // Task
            dist: {                   // Target
                options: {              // Target options
                sassDir: '<%= path.source %>/sass',
                cssDir: '<%= path.publish %>/css',
                environment: 'production'
                }
            }
        },
        connect: {
            server: {
                options: { 
                    port: 9000,
                    base: '<%= path.publish %>'
                }
            }
        },
        copy: {
            source: {
                    expand: true,
                    filter: 'isFile',
                    cwd: '<%= path.source %>',
                    src: [
                        '**/*',
                        '!**/*.jade',
                        '!**/sass/**/*',
                        '!**/test/**/*'
                    ],
                    dest: '<%= path.publish %>'
            }
        },
        jade: {
            options: {
                pretty: false,
                data: grunt.file.readJSON('package.json')
            },
            source: {
                expand: true,
                cwd: '<%= path.source %>',
                src: ['**/!(_)*.jade','!test/**/*.jade'],
                dest: '<%= path.publish %>',
                ext: '.html'
            }
        },
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
                src: ['./src/**/*.js']
            }
        },
        watch: {
            options: {
                    livereload: true
            },
            js: {
                files: ['./src/**/*.js', './scss/*.scss', './src/**/*.html'],
                tasks: ['default']
            },
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    // pre task.
    grunt.registerTask('go', ['connect', 'watch']);

    // Default task.    js -> html -> css
    // grunt.registerTask('default', ['jade', 'jshint', 'compass', 'uglify', 'clean', 'copy']);
    grunt.registerTask('default', ['clean','jade', 'copy', 'compass']);
};
