/*
 * grunt-cache-killer
 * https://github.com/midnight-coding/grunt-cache-killer
 *
 * Copyright (c) 2019 Matthew Rath
 * Licensed under the MIT license.
 */

'use strict';

// Load the required dependencies.
var crypto = require('crypto');
var fileSystem = require('fs');

// Grunt task module.
module.exports = function (grunt) {

    grunt.registerMultiTask('cacheKiller', 'Kill your asset cache file problems by updating their filenames and any references to them.', function () {

        /**
         * Get filename from path.
         *
         * @param $path {string}
         * @returns {string}
         */
        function getFile($path) {
            return $path.split('\\').pop().split('/').pop();
        }

        /**
         * Get base from path.
         *
         * @param $path {string}
         * @returns {string}
         */
        function getBase($path) {
            return $path.replace(getFile($path), '');
        }

        /**
         * Get timestamp.
         *
         * @returns {number}
         */
        function getTimeStamp() {
            return +new Date();
        }

        /**
         * Get datetime stamp.
         *
         * @returns {string}
         */
        function getDateTimeStamp() {
            var date = new Date();

            return date.getFullYear().toString().padStart(2, "0") +
                (date.getMonth() + 1).toString().padStart(2, "0") +
                date.getDate().toString().padStart(2, "0") +
                date.getHours().toString().padStart(2, "0") +
                date.getMinutes().toString().padStart(2, "0") +
                date.getSeconds().toString().padStart(2, "0");
        }

        /**
         * Get hash of file.
         *
         * @param $file      {string}
         * @param $algorithm {string}
         * @returns {string}
         */
        function getHash($file, $algorithm) {
            var $length = 8192;
            var $fileDescriptor = fileSystem.openSync($file, 'r');
            var $hash = crypto.createHash($algorithm);
            var $buffer = Buffer.alloc($length);

            try {
                var $bytesRead;

                do {
                    $bytesRead = fileSystem.readSync($fileDescriptor, $buffer, 0, $length, null);

                    $hash.update($buffer.slice(0, $bytesRead));
                } while ($bytesRead === $length);
            } finally {
                fileSystem.closeSync($fileDescriptor);
            }

            return $hash.digest('hex');
        }

        /**
         * Check if the mask if a function.
         *
         * @param $mask (string)
         * @returns {boolean}
         */
        function isMaskFunction($mask) {
            return ($mask.substr(0, 1) === '{' && $mask.substr(-1) === '}');
        }

        /**
         * Trim the curly braces from the mask function.
         *
         * @param $mask (string}
         * @returns {string}
         */
        function trimMaskFunction($mask) {
            return $mask.slice(1, -1);
        }

        /**
         * Check for a valid mask function.
         *
         * @param  $maskFunction  {string}
         * @param  $maskFunctions {array}
         * @returns {boolean}
         */
        function isValidMaskFunction($maskFunction, $maskFunctions) {
            return ($maskFunctions.indexOf($maskFunction)) > -1;
        }

        /**
         * Get mask value.
         *
         * @param $mask {string}
         * @param $file {string}
         * @returns {string}
         */
        function getMaskValue($mask, $file) {
            // Check if a mask function is being used.
            if (isMaskFunction($mask)) {
                // Trim the curly braces from the mask function.
                $mask = trimMaskFunction($mask);

                // If using a timestamp.
                if ($mask === 'timestamp') {
                    return getTimeStamp().toString();
                }

                // If using a datetime stamp.
                if ($mask === 'datetimestamp') {
                    return getDateTimeStamp();
                }

                // Using an OpenSSL digest algorithm.
                return getHash($file, $mask);
            }

            // Just a string.
            return $mask;
        }

        /**
         * Strip characters from beginning of string.
         *
         * @param $string {string}
         * @param $length {number}
         * @returns {string}
         */
        function trimByLength($string, $length) {
            return ($length !== -1) ? $string.substring($string.length - $length) : $string;
        }

        /**
         * Find matching asset using asset mask file.
         *
         * @param $path {string}
         * @param $pre  {string}
         * @param $post {string}
         * @returns {string|object}
         */
        function findMatchingAsset($path, $pre, $post) {
            // Synchronously read the asset filename(s) from the path.
            var $files = fileSystem.readdirSync($path);

            // Iterate over the asset filename(s).
            for (var i = 0; i < $files.length; i++) {
                // Check if the pre and post strings match the start and end parts of the asset filename respectively.
                if ($pre === $files[i].substr(0, $pre.length) && $post === $files[i].substr(-$post.length)) {
                    // A matching asset was found.
                    return $files[i];
                }
            }

            // A matching asset was not found.
            return null;
        }

        // --------------------------------------------------------------------------------

        // Set the valid option types.
        var $validOptionsTypes = {
            'prepend': 'string',
            'append': 'string',
            'mask': 'string',
            'length': 'number'
        };

        // Set the default options. Any option(s) passed in will override the default option(s).
        var $options = this.options({
            prepend: '',
            append: '',
            mask: '{md5}',
            length: -1
        });

        // Set the default mask placeholder.
        var $maskPlaceholder = '[mask]';

        // Set the valid mask functions types.
        var $validMaskFunctionTypes = ['timestamp', 'datetimestamp'].concat(crypto.getHashes()).sort(function (a, b) {
            return a.localeCompare(b, undefined, {sensitivity: 'base'});
        });

        // Validate the options types.
        for (var $key in $validOptionsTypes) {
            // Check if the option type is incorrect.
            if (typeof ($options[$key]) !== $validOptionsTypes[$key]) {
                // Capitalise the first letter.
                var $type = typeof ($options[$key]);
                $type = $type.charAt(0).toUpperCase() + $type.slice(1);

                grunt.fail.warn(this.target + ' : The option \'' + $key + '\' must be a ' + $validOptionsTypes[$key] + '. ' + $type + ' given.');
            }
        }

        // Validate the mask function type.
        if (isMaskFunction($options.mask) && !isValidMaskFunction(trimMaskFunction($options.mask), $validMaskFunctionTypes)) {
            grunt.fail.warn(this.target + ' : The options mask \'' + $options.mask + '\' is not a valid mask. Valid masks include ' + $validMaskFunctionTypes.join(', ') + '.');
        }

        // Build the tasks list.
        var $tasks = {};

        for (var i = 0; i < this.files.length; i++) {
            $tasks[i] = {};

            $tasks[i].asset = {};
            $tasks[i].asset.name = {};
            $tasks[i].asset.mask = {};
            $tasks[i].asset.rename = {};
            $tasks[i].asset.rename.from = {};
            $tasks[i].asset.rename.to = {};
            $tasks[i].templates = this.files[i].orig.src;

            $tasks[i].asset.name.full = this.files[i].orig.dest;
            $tasks[i].asset.name.base = getBase($tasks[i].asset.name.full);
            $tasks[i].asset.name.file = getFile($tasks[i].asset.name.full);
            $tasks[i].asset.name.pre = $tasks[i].asset.name.file.split($maskPlaceholder)[0];
            $tasks[i].asset.name.post = $tasks[i].asset.name.file.split($maskPlaceholder)[1];

            // Check the position of the mask placeholder within the asset filename.
            if ($tasks[i].asset.name.pre === '' || $tasks[i].asset.name.post === '') {
                grunt.fail.warn(this.target + ' : The position of the [mask] placeholder cannot be at the very beginning or very end of the asset filename. \'' + $tasks[i].asset.name.full + '\' given.');
            }

            $tasks[i].asset.rename.from.file = findMatchingAsset($tasks[i].asset.name.base, $tasks[i].asset.name.pre, $tasks[i].asset.name.post);
            $tasks[i].asset.rename.from.full = $tasks[i].asset.name.base + $tasks[i].asset.rename.from.file;

            // Check if the asset filename exists.
            if ($tasks[i].asset.rename.from.file === null) {
                grunt.fail.warn(this.target + ' : The masked asset file \'' + $tasks[i].asset.name.full + '\' does not exist.');
            }

            $tasks[i].asset.mask.prepend = $options.prepend;
            $tasks[i].asset.mask.value = {};
            $tasks[i].asset.mask.value.raw = getMaskValue($options.mask, $tasks[i].asset.rename.from.full);
            $tasks[i].asset.mask.value.computed = trimByLength($tasks[i].asset.mask.value.raw, $options.length);
            $tasks[i].asset.mask.apend = $options.append;

            $tasks[i].asset.rename.to.file = $tasks[i].asset.name.pre + $options.prepend + $tasks[i].asset.mask.value.computed + $options.append + $tasks[i].asset.name.post;
            $tasks[i].asset.rename.to.full = $tasks[i].asset.name.base + $tasks[i].asset.rename.to.file;
        }

        // Let's begin.
        grunt.log.writeln('');

        // Iterate over the tasks list.
        for (var j = 0; j < Object.keys($tasks).length; j++) {

            // Check if the template filename(s) exist.
            for (var k = 0; k < $tasks[j].templates.length; k++) {
                if (!fileSystem.existsSync($tasks[j].templates[k])) {
                    grunt.fail.warn(this.target + ' : The template file \'' + $tasks[j].templates[k] + '\' does not exist.');
                }
            }

            // Synchronously rename the asset file.
            fileSystem.renameSync($tasks[j].asset.rename.from.full, $tasks[j].asset.rename.to.full);

            // Show the successful asset renaming message.
            grunt.log.ok(this.target + ' : Asset file \'' + $tasks[j].asset.rename.from.file + '\' renamed to \'' + $tasks[j].asset.rename.to.file + '\'.');

            // Update any reference to the asset file in the template file(s).
            for (var l = 0; l < $tasks[j].templates.length; l++) {

                // Synchronously read the contents of the template.
                var content = fileSystem.readFileSync($tasks[j].templates[l], 'utf8');

                // Replace the template's matching content.
                var result = content.replace(new RegExp($tasks[j].asset.name.pre + '.*' + $tasks[j].asset.name.post, "g"), $tasks[j].asset.rename.to.file);

                // Synchronously write the contents to the template.
                fileSystem.writeFileSync($tasks[j].templates[l], result, 'utf8');

                // Show the successful template update message.
                grunt.log.ok(this.target + ' : Reference(s) updated in template file \'' + $tasks[j].templates[l] + '\'.');
            }

            // Add line between target(s) and goodbye.
            grunt.log.writeln('');
        }

        // Goodbye.
        grunt.log.writeln('Success..!');
    });

};