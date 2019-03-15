/*
 * grunt-cache-killer
 * https://github.com/midnight-coding/grunt-cache-killer
 *
 * Copyright (c) 2019 Matthew Rath
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Set the (cwd) base path.
    grunt.file.setBase('../');

    // Load all the grunt tasks.
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        // Watch scripts for change.
        watch: {
            scripts: {
                files: ['build/.jshintrc', 'build/*.js', 'tasks/*.js', 'tests/functional/*.js'],
                tasks: ['jshint']
            }
        },

        // JSHint.
        jshint: {
            options: {
                jshintrc: 'build/.jshintrc'
            },
            all: [
                'build/*.js',
                'tasks/*.js',
                'tests/functional/*.js'
            ]
        },

        // Clean.
        clean: {
            all: ['tests/functional/actual/*']
        },

        // Copy.
        copy: {
            fixtures: {
                expand: true,
                cwd: 'tests/functional/fixtures',
                src: '**/*',
                dest: 'tests/functional/actual/'
            }
        },

        // Functional tests setup.
        cacheKiller: {
            test1: {
                files: {
                    'tests/functional/actual/test1/css/website[mask].min.css': ['tests/functional/actual/test1/html/master.html']
                }
            },
            test2: {
                options: {
                    prepend: "-",
                    append: ".dev",
                    length: 8
                },
                files: {
                    'tests/functional/actual/test2/css/website[mask].min.css': ['tests/functional/actual/test2/html/master.html']
                }
            },
            test3: {
                options: {
                    prepend: "-",
                    append: ".dev",
                    length: 8
                },
                files: {
                    'tests/functional/actual/test3/css/website[mask].min.css': ['tests/functional/actual/test3/html/master.html'],
                    'tests/functional/actual/test3/js/website[mask].min.js': ['tests/functional/actual/test3/html/master.html']
                }
            },
            test4: {
                options: {
                    prepend: "-",
                    append: ".dev",
                    length: 8
                },
                files: {
                    'tests/functional/actual/test4/css/website[mask].min.css': ['tests/functional/actual/test4/html/master-1.html', 'tests/functional/actual/test4/html/master-2.html'],
                    'tests/functional/actual/test4/js/website[mask].min.js': ['tests/functional/actual/test4/html/master-1.html', 'tests/functional/actual/test4/html/master-2.html']
                }
            },
            test5: {
                options: {
                    prepend: "-",
                    append: ".dev",
                    length: 8
                },
                files: {
                    'tests/functional/actual/test5/css/website[mask].min.css': ['tests/functional/actual/test5/html/master.html']
                }
            }
        },

        // Functional tests.
        nodeunit: {
            all: ['tests/functional/*.js']
        }

    });

    // Load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Register the tasks.
    grunt.registerTask('codeQuality', ['jshint']);
    grunt.registerTask('functionalTests', ['clean', 'copy', 'cacheKiller', 'nodeunit']);
    grunt.registerTask('allTests', ['codeQuality', 'functionalTests']);
};