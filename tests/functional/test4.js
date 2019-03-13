'use strict';

var grunt = require('grunt');

/* Test 4 */

exports.cacheKiller = {

    test_1: function (test) {
        test.expect(1);

        var expected = grunt.file.read('tests/functional/expected/test4/css/website-9063da07.dev.min.css');
        var actual = grunt.file.read('tests/functional/actual/test4/css/website-9063da07.dev.min.css');
        test.equal(actual, expected, 'File names and contents should match.');

        test.done();
    },

    test_2: function (test) {
        test.expect(1);

        var expected = grunt.file.read('tests/functional/expected/test4/js/website-9d46ba1e.dev.min.js');
        var actual = grunt.file.read('tests/functional/actual/test4/js/website-9d46ba1e.dev.min.js');
        test.equal(actual, expected, 'File names and contents should match.');

        test.done();
    },

    test_3: function (test) {
        test.expect(1);

        var expected = grunt.file.read('tests/functional/expected/test4/html/master-1.html');
        var actual = grunt.file.read('tests/functional/actual/test4/html/master-1.html');
        test.equal(actual, expected, 'File names and contents should match.');

        test.done();
    },

    test_4: function (test) {
        test.expect(1);

        var expected = grunt.file.read('tests/functional/expected/test4/html/master-2.html');
        var actual = grunt.file.read('tests/functional/actual/test4/html/master-2.html');
        test.equal(actual, expected, 'File names and contents should match.');

        test.done();
    }
};