/*
 * grunt-cache-killer
 * https://github.com/midnight-coding/grunt-cache-killer
 *
 * Copyright (c) 2019 Matthew Rath
 * Licensed under the MIT license.
 */

'use strict';

// Load the required dependencies.
var md5File = require('md5-file');
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
         * Get md5 of file.
         *
         * @param $file {string}
         * @returns {string}
         */
        function getMd5($file) {
            return md5File.sync($file);
        }

        /**
         * Get mask value.
         *
         * @param $maskType {string}
         * @param $file     {string}
         * @param $value    {string}
         * @returns {string}
         */
        function getMaskValue($maskType, $file, $value) {
            switch ($maskType) {
                case '{timestamp}':
                    return getTimeStamp().toString();
                case '{datetimestamp}':
                    return getDateTimeStamp();
                case '{md5}':
                    return getMd5($file);
                default:
                    return $value;
            }
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
                if ($pre === $files[i].substring(0, $pre.length) && $post === $files[i].substring($files[i].length - $post.length)) {
                    // A match was found.
                    return $files[i];
                }
            }

            // A match was not found.
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

        // Validate the options.
        for (var $key in $validOptionsTypes) {
            // Check if the option type is incorrect.
            if (typeof ($options[$key]) !== $validOptionsTypes[$key]) {
                grunt.fail.warn('cacheKiller -> ' + this.target + ' -> options -> ' + $key + ' must be a ' + $validOptionsTypes[$key] + '. ' + typeof ($options[$key]) + ' given.');
            }
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

            $tasks[i].asset.rename.from.file = findMatchingAsset($tasks[i].asset.name.base, $tasks[i].asset.name.pre, $tasks[i].asset.name.post);
            $tasks[i].asset.rename.from.full = $tasks[i].asset.name.base + $tasks[i].asset.rename.from.file;

            $tasks[i].asset.mask.prepend = $options.prepend;
            $tasks[i].asset.mask.value = {};
            $tasks[i].asset.mask.value.raw = getMaskValue($options.mask, $tasks[i].asset.rename.from.full, $options.mask);
            $tasks[i].asset.mask.value.computed = trimByLength($tasks[i].asset.mask.value.raw, $options.length);
            $tasks[i].asset.mask.apend = $options.append;

            $tasks[i].asset.rename.to.file = $tasks[i].asset.name.pre + $options.prepend + $tasks[i].asset.mask.value.computed + $options.append + $tasks[i].asset.name.post;
            $tasks[i].asset.rename.to.full = $tasks[i].asset.name.base + $tasks[i].asset.rename.to.file;
        }

        // Let's begin.
        grunt.log.writeln('');
        grunt.log.writeln('-----------');
        grunt.log.writeln('cacheKiller');
        grunt.log.writeln('-----------');

        // Iterate over the tasks list.
        for (var j = 0; j < Object.keys($tasks).length; j++) {

            // Check if the asset file exists.
            if ($tasks[j].asset.rename.from.full === null) {
                grunt.fail.warn('cacheKiller -> ' + this.target + ' : The masked asset file \'' + $tasks[j].asset.name.full + '\' does not exist.');
            }

            // Check if the template file(s) exist.
            for (var k = 0; k < $tasks[j].templates.length; k++) {
                if (!fileSystem.existsSync($tasks[j].templates[k])) {
                    grunt.fail.warn('cacheKiller -> ' + this.target + ' : The template file \'' + $tasks[j].templates[k] + '\' does not exist.');
                }
            }

            // Synchronously rename the asset file.
            fileSystem.renameSync($tasks[j].asset.rename.from.full, $tasks[j].asset.rename.to.full);

            // Show the successful asset renaming message.
            grunt.log.ok(this.target + ' : Asset file \'' + $tasks[j].asset.rename.from.file + '\' renamed to \'' + $tasks[j].asset.rename.to.file + '\'');

            // Update any reference to the asset file in the template file(s).
            for (var l = 0; l < $tasks[j].templates.length; l++) {

                // Synchronously read the contents of the template.
                var content = fileSystem.readFileSync($tasks[j].templates[l], 'utf8');

                // Replace the template's matching content.
                var result = content.replace(new RegExp($tasks[j].asset.rename.from.file, "g"), $tasks[j].asset.rename.to.file);

                // Synchronously write the contents to the template.
                fileSystem.writeFileSync($tasks[j].templates[l], result, 'utf8');

                // Show the successful template update message.
                grunt.log.ok(this.target + ' : Reference updated in template file \'' + $tasks[j].templates[l] + '\'.');
            }

            // Add line between target(s) and goodbye.
            grunt.log.writeln('');
        }

        // Goodbye.
        grunt.log.writeln('Success..!');
    });

};