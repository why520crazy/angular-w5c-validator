'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // Project settings
        yeoman : {
            // configurable paths
            app : 'example',
            dist: 'dist'
        },
        watch  : {
            js        : {
                files  : ['<%= yeoman.app %>/*.js'],
                tasks  : ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest    : {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles    : {
                files: ['<%= yeoman.app %>/css/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            gruntfile : {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files  : [
                    '<%= yeoman.app %>/*.html',
                    '.tmp/css/{,*/}*.css',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options   : {
                port      : 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname  : 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open      : true,
                    base      : [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ],
                    middleware: function (connect, options) {
                        var middlewares = [];

                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }

                        // Setup the proxy
                        //middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

                        // Serve static files
                        options.base.forEach(function (base) {
                            middlewares.push(connect.static(base));
                        });

                        return middlewares;
                    }
                }
            },
            test      : {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist      : {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },
        pkg    : grunt.file.readJSON('package.json'),
        concat : {
            js: {
                //['res/lib/jquery/1.11.0/jquery.js','res/lib/bootstrap/3.1.1/js/bootstrap.js', 'res/js/main.js'],
                // 这里的site_scripts是从配置文件读取的，因为layout也需要读取site_scripts，如果仅仅是这个地方使用到，可以按照上面的方式写死
                src : ["src/w5cValidator.js", "src/directive.js"],
                dest: 'example/w5cValidator.js'
            }
        },
        uglify : {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build  : {
                src : 'example/w5cValidator.js',
                dest: 'example/w5cValidator.min.js'
            }
        },
        copy   : {
            main: {
                src : 'src/style.less',
                dest: 'example/css/style.less'
            }
        }

    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'concat',
            'copy',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });
};
