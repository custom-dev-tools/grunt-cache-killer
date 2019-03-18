# grunt-cache-killer

Ever wanted to ensure that your most recently deployed asset files (eg: css, js, img, etc) are being used instead of the old long-term cached versions?

Then look no further...!

This [Grunt](https://gruntjs.com/) plugin inserts a **cache avoiding** string into your asset filename, then looks for and updates any reference to it within your template file(s).

Find this plugin at:
  - [https://www.npmjs.com/package/grunt-cache-killer](https://www.npmjs.com/package/grunt-cache-killer).
  - [https://github.com/midnight-coding/grunt-cache-killer](https://github.com/midnight-coding/grunt-cache-killer).

## Getting Started

This plugin requires Grunt `^1.0.3`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as how to install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install --save-dev grunt-cache-killer
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-cache-killer');
```

Alternatively, install the [load-grunt-tasks](https://www.npmjs.com/package/load-grunt-tasks) plugin to have cacheKiller load automatically.
 
## The "cacheKiller" task

### Overview

In your project's Gruntfile, add a section named `cacheKiller` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  cacheKiller: {
    options: {
      // Options
    },
    taskName: {
      files: {
        'asset/path/filename.css': ['template/path/filename-1.html', 'template/path/filename-2.html']
      }
    }
  }
});
```

### Options

- `prepend` (string) - A string value that is used to add characters to the front of the `[mask]` placeholder. The default value is an empty string.

- `append` (string) - A string value that is used to add characters to the back of the `[mask]` placeholder. The default value is an empty string.

- `mask` (string) - A string value that is used to specify the passed in mask. The default value is `{md5}`.
  - If a **cacherKiller** mask function is used, then the string generated from that function will be inserted. If an invalid mask function is used, then an error message along with a full list of valid mask functions will be shown.
    
    CacheKiller's mask functions include:
    - `{timestamp}` eg: `1551278199614`
    - `{datetimestamp}` eg: `20190228123639`
    - All [OpenSSL](https://www.openssl.org/) algorithms available on your system. Some common algorithims include:
      - `{md4}` eg: `1f73e014cf3341a8b0715b27c031b188`
      - `{md5}` eg: `70a1d7fe6502fa887f5b810d9063da07`
      - `{sha1}` eg: `a20a181e3C2a813ae08c22fb9d61133c315517bb`
      - `{sha224}` eg: `d157aefcf36cdc966737aa0dc4ea85d720652185550c248de9d018f9`
      - `{sha256}` eg: `8736ba042ee82bc70676c964b6f7b05e063e1957c95Cb80e4f15f8b01e69c9ad`
    
        **Tip:** Use one of the below listed commands at the command prompt for a full list of available algorithms on your system.
        ```
        // For newer versions of OpenSSL.
        openssl list -digest-algorithms
      
        // For older versions of OpenSSL.
        openssl list-message-digest-algorithms
        ```
           
  - If a **string** is used, then that string is inserted. eg: `mask: 'my-string'`

- `length` (number) - A number value that is used to set the length of the mask. The default value is `-1`.
  - If the value of the number is negative (eg: `-1`) then the length of the given / generated string remains unchanged.
  - If the value of the number if positive (eg: `8`) then only that value of right-hand characters in the string will remain.
  - If the value of the number is zero (eg: `0`) then the mask string (excluding the prepend and append strings) is not used.

### Usage

Within the cacheKiller's `files:`  node, place the `[mask]` placeholder within the asset filename where you would like the mask to be added.

> **Note** - Do not place the `[mask]` placeholder at the very beginning or very end of the asset filename. (eg: `public/css/[mask].website.min.css`). Doing so would mangle the template file(s). CacheKiller prevents this from happening by showing an error message and terminating the script.

### Usage Examples

#### Default Options

In this example, the default options are used.

```js
grunt.initConfig({
  cacheKiller: {
    options: {
      prepend: '',
      append: '',
      mask: '{md5}',
      length: -1
    },
    taskName: {
      files: {
        'public/css/app[mask].min.css': ['app/views/templates/master.html']
      }
    }
  }
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
    options: {
      prepend: '-',
      append: '.dev',
      mask: '{md5}',
      length: 8
    },
    taskName: {
      files: {
        'public/css/app[mask].min.css': ['app/views/templates/master.html'],
        'public/js/app[mask].min.js': ['app/views/templates/master.html']
      }
    }
  }
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

Find more on the release history at:

[https://github.com/midnight-coding/grunt-cache-killer/blob/master/CHANGELOG.md](https://github.com/midnight-coding/grunt-cache-killer/blob/master/CHANGELOG.md).