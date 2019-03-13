# grunt-cache-killer

Ever wanted to ensure that your most recently deployed asset files (eg: css, js, img, etc) are being used instead of the old long-term cached versions?

Then look no further...!

This grunt plugin inserts a **cache avoiding** string into your asset filename, then looks for and updates any reference to it within your template file(s).

Find this npm plugin at  [https://www.npmjs.com/package/grunt-cache-killer](https://www.npmjs.com/package/grunt-cache-killer).

## Getting Started

This plugin requires Grunt `~1.0.3`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as how to install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install --save-dev grunt-cache-killer
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-cache-killer');
```

Alternatively, install the 'load-grunt-tasks' plug (`npm install --save-dev load-grunt-tasks`) and add the following line of code to your gruntfile.js `require('load-grunt-tasks')(grunt);` to automatically load your plugin(s).

## The "cacheKiller" task

### Overview

In your project's Gruntfile, add a section named `cacheKiller` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  cacheKiller: {
    taskName: {
      // Options
    },
    files: {
      // Asset filename : // Template filename(s)
    },
  },
});
```

### Options

- `prepend` (string) - A string value that is used to add characters to the front of the `[mask]`. The default value is an empty string.

- `append` (string) - A string value that is used to add characters to the back of the `[mask]`. The default value is an empty string.

- `mask` (string) - A string value that is used to specify the passed in mask. The default value is `{md5}`.
  - If a **cacherKiller** mask function is used, then the string generated from that internal function is inserted. CacheKiller's mask functions include:
    - `{timestamp}` eg: `1551278199614`
    - `{datetimestamp}` eg: `20190228123639`
    - `{md5}` eg: `70a1d7fe6502fa887f5b810d9063da07`
  - If a **string** is used, then that string is inserted. eg: `mask: 'my-string'`

- `length` (number) - A number value that is used to set the length of the mask. The default value is `-1`.
  - If the value of the number is negative (eg: `-1`) then the length of the given / generated string remains unchanged.
  - If the value of the number if positive (eg: `8`) then only that value of right-hand characters in the string will remain.
  - If the value of the number is zero (eg: `0`) then the mask string (excluding the prepend and append strings) is not used.

### Usage

Within the cacheKiller's `files:`  node, place the `[mask]` within the asset filename where you would like the mask to be added.

> **Warning** - Do not place the `[mask]` at the very beginning or very end of the asset filename. Doing so prevents cacheKiller from properly determining where the start or end of the asset filename exists within the template file(s).

### Usage Examples

#### Default Options

In this example, the default options are used.

```js
grunt.initConfig({
  cacheKiller: {
    taskName: {
      options: {
        prepend: '',
        append: '',
        mask: '{md5}',
        length: -1
        },
      files: {
        'public/css/app[mask].min.css': 'app/views/templates/master.html',
      },
    },
  },
});
```

Before running cacheKiller.

```
// Asset file.

public/css/app.min.css
```

```html
<!-- master.html -->

<link href="https://www.site.com/css/app.min.css" rel="stylesheet">
```

After running cacheKiller.

```
// Asset file.

public/css/app70a1d7fe6502fa887f5b810d9063da07.min.css
```

```html
<!-- master.html -->

<link href="https://www.site.com/css/app70a1d7fe6502fa887f5b810d9063da07.min.css" rel="stylesheet">
```

#### Custom Options

In this example, custom options are used

```js
grunt.initConfig({
  cacheKiller: {
    taskName: {
      options: {
        prepend: '-',
        append: '.dev',
        mask: '{md5}',
        length: 8
        },
      files: {
        'public/css/app[mask].min.css': 'app/views/templates/master.html',
        'public/js/app[mask].min.js': 'app/views/templates/master.html'
      },
    },
  },
});
```

Before running cacheKiller.

```
// Asset files.

public/css/app.min.css
public/js/app.min.js
```

```html
<!-- master.html -->

<link href="https://www.site.com/css/app.min.css" rel="stylesheet">
<script src="https://www.site.com/js/app.min.js"></script>
```

After running cacheKiller.

```
// Asset files.

public/css/app-9063da07.dev.min.css
public/js/app-f959224b.dev.min.js
```

```html
<!-- master.html -->

<link href="https://www.site.com/css/app-9063da07.dev.min.css" rel="stylesheet">
<script src="https://www.site.com/js/app-f959224b.dev.min.js"></script>
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

|    Date    | Version |  Comments       |
| :--------: | :-----: | :---------------|
| 01-03-2019 | 1.0.0   | Initial commit. |