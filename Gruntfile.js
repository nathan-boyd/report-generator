'use strict';

var _ = require('lodash');

var desireds = require('./test/browser/browserTestConfig');

var gruntConfig = {
    env: {
        // dynamically filled
    },
    concurrent: {
        'test-browser': []
    },
    jshint: {
        files: ['lib/*', 'test/*', '*.jsg'],
        options: {
            jshintrc: '.jshintrc'
        }
    },
    /* jshint camelcase:false */
    mocha_istanbul: {
        coverage: {
            src: ['test/*.js']
        }
    },
    mochaTest: {
        test: {
            options: {
                reporter: 'spec',
                //quiet: false,
                //clearRequireCache: true
            },
            src: ['test/*.js']
        },
        browser: {
            options: {
                timeout: 60000,
                reporter: 'spec'
            },
            src: ['test/browser/*.js']
        }
    },
    watch: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
    }
}

_.forIn(desireds, function (desired, key) {
    gruntConfig.env[key] = {
        DESIRED: JSON.stringify(desired)
    };
    gruntConfig.concurrent['test-browser'].push('test:browser:' + key);
});

module.exports = function (grunt) {

    grunt.initConfig(gruntConfig);

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.registerTask('cover', ['mocha_istanbul']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['mochaTest:test']);
    grunt.registerTask('test:browser', ['concurrent:test-browser']);

    grunt.registerTask('default', ['jshint', 'cover']);

    _.forIn(desireds, function (desired, key) {
        grunt.registerTask('test:browser:' + key, ['env:' + key, 'mochaTest:browser']);
    });
};


