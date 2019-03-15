'use strict';

var grunt = require('grunt');

/* Test 5 */

exports.cacheKiller = {

    test_1: function (test) {
        test.expect(1);

        var expected = grunt.file.read('tests/functional/expected/test5/css/website-9063da07.dev.min.css');
        var actual = grunt.file.read('tests/functional/actual/test5/css/website-9063da07.dev.min.css');
        test.equal(actual, expected, 'File names and contents should match.');

        test.done();
    },

    test_2: function (test) {
        test.expect(1);

        var expected = grunt.file.read('tests/functional/expected/test5/html/master.html');
        var actual = grunt.file.read('tests/functional/actual/test5/html/master.html');
        test.equal(actual, expected, 'File names and contents should match.');

        test.done();
    }
};