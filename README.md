# grunt-cache-killer

[![Node version](https://img.shields.io/node/v/grunt-cache-killer.svg?label=node.js&color=informational&logo=npm)](https://nodejs.org/en/) [![Node version](https://img.shields.io/npm/dependency-version/grunt-cache-killer/dev/grunt.svg?label=grunt&logo=npm)](https://gruntjs.com/)

[![NPM version](http://img.shields.io/npm/v/grunt-cache-killer.svg?label=grunt-cache-killer&logo=npm)](https://www.npmjs.com/package/grunt-cache-killer?activeTab=versions) ![Maintained](https://img.shields.io/static/v1.svg?label=maintained&message=yes&color=informational&logo=npm) ![NPN downloads](http://img.shields.io/npm/dt/grunt-cache-killer.svg?logo=npm)

[![GitHub version](https://img.shields.io/github/package-json/v/custom-dev-tools/grunt-cache-killer.svg?label=grunt-cache-killer&logo=github)](https://github.com/custom-dev-tools/grunt-cache-killer/releases) [![GitHub License](https://img.shields.io/github/license/custom-dev-tools/grunt-cache-killer.svg?color=informational&logo=github)](https://github.com/custom-dev-tools/grunt-cache-killer/blob/master/LICENSE-MIT) ![GitHub release date](https://img.shields.io/github/release-date/custom-dev-tools/grunt-cache-killer.svg?logo=github) [![GitHub open issues](https://img.shields.io/github/issues-raw/custom-dev-tools/grunt-cache-killer.svg?logo=github)](https://github.com/custom-dev-tools/grunt-cache-killer/milestones?state=open) [![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/custom-dev-tools/grunt-cache-killer.svg?logo=github)](https://github.com/custom-dev-tools/grunt-cache-killer/milestones?state=closed)

---

Ever wanted to ensure that your most recently deployed asset files (eg: css, js, img, etc) are being used instead of the old long-term cached versions?

Then look no further...!

This [Grunt](https://gruntjs.com/) plugin inserts a **cache avoiding** string into your asset filename, then looks for and updates any reference to it within your template file(s).

Find this plugin at:
  - [https://www.npmjs.com/package/grunt-cache-killer](https://www.npmjs.com/package/grunt-cache-killer).
  - [https://github.com/custom-dev-tools/grunt-cache-killer](https://github.com/custom-dev-tools/grunt-cache-killer).
  
## Table Of Contents

* [Getting Started](#getting-started)
* [The cacheKiller Task](#the-cachekiller-task)
  * [Overview](#overview)
  * [Options](#options)
* [Usage](#usage)
  * [Limitations](#limitations)
* [Usage Examples](#usage-examples)
  * [Default Options](#default-options)
  * [Simple Custom Options](#simple-custom-options)
  * [Complex Custom Options](#complex-custom-options)
  * [Hierarchical Custom Options](#hierarchical-custom-options)
* [Bug Reporting](#bug-reporting)
* [Contributing](#contributing)
* [Release History](#release-history)

## Getting Started

This plugin requires Grunt `^1.1.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as how to install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install --save-dev grunt-cache-killer
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-cache-killer');
```

> **Tip:** Alternatively, install the [load-grunt-tasks](https://www.npmjs.com/package/load-grunt-tasks) plugin to have cacheKiller load automatically.
 
## The cacheKiller Task

### Overview

In your project's Gruntfile, add a section named `cacheKiller` to the data object passed into `grunt.initConfig()`.

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
        'path/to/asset/filename[mask].min.css': ['path/to/template/using/asset/filename-1.html',
                                                 'path/to/template/using/asset/filename-2.html']
      }
    }
  }
});
```

### Options

- `prepend` (string) - A string value that is used to add characters to the front of the `[mask]` placeholder. The default value is an empty string.

- `append` (string) - A string value that is used to add characters to the back of the `[mask]` placeholder. The default value is an empty string.

- `mask` (string) - A string value that is used to specify the passed in mask. The default value is `{md5}`.
  - If a **cacheKiller** mask function is used (ie: Anything surrounded by curly braces. eg: `{...}`), then the string generated from that function will be inserted. If an invalid mask function is used, then an error message along with a full list of valid mask functions will be shown.
    
    CacheKiller's mask functions include:
    - `{timestamp}` eg: `1551278199614`
    - `{datetimestamp}` eg: `20190228123639`
    - All [OpenSSL](https://www.openssl.org/) algorithms available on your system. Some common algorithms include but are not limited to:
      - `{md4}` eg: `1f73e014cf3341a8b0715b27c031b188`
      - `{md5}` eg: `70a1d7fe6502fa887f5b810d9063da07`
      - `{sha1}` eg: `a20a181e3C2a813ae08c22fb9d61133c315517bb`
      - `{sha224}` eg: `d157aefcf36cdc966737aa0dc4ea85d720652185550c248de9d018f9`
      - `{sha256}` eg: `8736ba042ee82bc70676c964b6f7b05e063e1957c95Cb80e4f15f8b01e69c9ad`
    
        > **Tip:** Use one of the below listed commands at the command prompt for a full list of available algorithms on your system.
        > ```
        > // For newer versions of OpenSSL.
        > openssl list -digest-algorithms
        >
        > // For older versions of OpenSSL.
        > openssl list-message-digest-algorithms
        > ```
           
  - If a **string** is used, then that string is inserted. eg: `mask: 'my-string'`

- `length` (number) - A number value that is used to set the length of the mask. The default value is `-1`.
  - If the value of the number is negative (eg: `-1`) then the length of the given / generated string remains unchanged.
  - If the value of the number if positive (eg: `8`) then only that value of right-hand characters in the string will remain.
  - If the value of the number is zero (eg: `0`) then the mask string (excluding the prepend and append strings) is not used. (ps: Considering the primary function of cacheKiller is to place masks within filenames, use of this value would be a redundant exercise).

### Usage

If this is the first time you are running cacheKiller, it will insert the mask value into the asset filename and update any reference to it within your nominated template file(s).

Running cacheKiller again will refresh the previously inserted mask value mask value of the asset filename with an updated value and again update any reference to it within your nominated template file(s).
 
Whether this is the 1st or 1,000th time your asset and template files have been updated, cacheKiller will insert the mask in the specified location each and every time.

Implementation is simple. Within the cacheKiller's `files:`  node, place the `[mask]` placeholder within the asset filename where you would like the mask to be added.

```js
// Here...
'public/css/website[mask].min.css'

// Or here...
'public/css/website.min[mask].css'

// Or anywhere else you like within the asset filename, pursuant to the below limitations.
```

#### Limitations

- Do not place the `[mask]` placeholder within a directory. (eg: `public/[mask]/website.min.css`). CacheKiller is not designed to rename / update directory names, only filenames. 

- Do not place the `[mask]` placeholder at the very beginning or very end of the asset filename. (eg: `public/css/[mask].website.min.css`). Doing so **_would_** mangle the template file(s). CacheKiller knows this, so to prevent it from happening cacheKiller will show you an error message and terminate the script.

- Do not move the `[mask]` placeholder back or forth within the asset filename if you have already run cacheKiller against that asset filename. Doing so **_will_** mangle the asset filename and any reference to it in the template file(s). If the `[mask]` is moved, there **_will_** be remnants of the previously added mask within the asset filename and template file(s). Whilst this may not necessarily break your applications functionality, it will break any compliance rules you may have around the naming of files.<br><br>
  If you need to retrospectively move the `[mask]` placeholder back or forth within the asset filename, follow the below listed steps:
  1. Rename the asset filename back to a generic filename. eg: `website.min.css`.
  2. Update any and all references to the asset filename within the template file(s) using the same generic filename. eg: `website.min.css`.
  3. Within the cacheKiller task, move the asset filenames `[mask]` placeholder to it's new position.
  4. Run the cacheKiller task.

- Do not rename any fixed parts of the asset filename (ie: Parts outside the `[mask]` placeholder) if you have already run cacheKiller against that asset filename. Doing so will show you a 'file not found' error message and terminate the script.<br><br>
  If you need to retrospectively rename the asset filename, follow the below listed steps.
  1. Rename the asset filename to your new filename. eg: `new.website.min.css`.
  2. Update any and all references to the asset filename within the template file(s) using your new filename. eg: `new.website.min.css`.
  3. Within the cacheKiller task, insert the asset filenames `[mask]` placeholder within the new asset filename. eg: `public/css/new[mask].website.min.css`.
  4. Run the cacheKiller task.
  
### Usage Examples

#### Default Options

In this example, the default options are used.

```js
grunt.initConfig({
  cacheKiller: {
    // options: {
    //   prepend: '',
    //   append: '',
    //   mask: '{md5}',
    //   length: -1
    // },
    taskName: {
      files: {
        'public/css/app[mask].min.css': ['app/views/templates/master.html']
      }
    }
  }
});
```

Before:

```txt
// Asset file.

public/css/app.min.css
```

```html
<!-- master.html -->

<link href="https://www.site.com/css/app.min.css" rel="stylesheet">
```

After:

```txt
// Asset file.

public/css/app70a1d7fe6502fa887f5b810d9063da07.min.css
```

```html
<!-- master.html -->

<link href="https://www.site.com/css/app70a1d7fe6502fa887f5b810d9063da07.min.css" rel="stylesheet">
```
#### Simple Custom Options

In this example, simple custom options are used.

```js
grunt.initConfig({
  cacheKiller: {
    options: {
      mask: 's-rule' // String used instead of a cacheKiller mask function.
    },
    taskName: {
      files: {
        'public/css/app[mask].min.css': ['app/views/templates/master.html']
      }
    }
  }
});
```

Before:

```txt
// Asset file.

public/css/app.min.css
```

```html
<!-- master.html -->

<link href="https://www.site.com/css/app.min.css" rel="stylesheet">
```

After:

```txt
// Asset file.

public/css/apps-rule.min.css
```

```html
<!-- master.html -->

<link href="https://www.site.com/css/apps-rule.min.css" rel="stylesheet">
```

#### Complex Custom Options

In this example, complex custom options are used.

```js
grunt.initConfig({
  cacheKiller: {
    options: {
      prepend: '-',
      append: '.prod',
      mask: '{datetimestamp}'
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

Before:

```txt
// Asset files.

public/css/app.min.css
public/js/app.min.js
```

```html
<!-- master.html -->

<link href="https://www.site.com/css/app.min.css" rel="stylesheet">
<script src="https://www.site.com/js/app.min.js"></script>
```

After:

```txt
// Asset files.

public/css/app-20190228123639.prod.min.css
public/js/app-20190228123639.prod.min.js
```

```html
<!-- master.html -->

<link href="https://www.site.com/css/app-20190228123639.prod.min.css" rel="stylesheet">
<script src="https://www.site.com/js/app-20190228123639.prod.min.js"></script>
```

#### Hierarchical Custom Options

In this example, custom options are used in a hierarchical order.

```js
grunt.initConfig({
  cacheKiller: {
    options: {
      mask: '{datetimestamp}'
    },
    taskName1: {
      options: {
        prepend: '-v1.1-'
      },
      files: {
        'public/css/app[mask].min.css': ['app/views/templates/master.html']
      }
    },
    taskName2: {
      options: {
        prepend: '-v1.2-'
      },
      files: {
        'public/css/web[mask].min.css': ['app/views/templates/master.html']
      }
    }
  }
});
```

Before:

```txt
// Asset files.

public/css/app.min.css
public/css/web.min.css
```

```html
<!-- master.html -->

<link href="https://www.site.com/css/app.min.css" rel="stylesheet">
<link href="https://www.site.com/css/web.min.css" rel="stylesheet">
```

After:

```txt
// Asset files.

public/css/app-v1.1-20190228123639.min.css
public/css/web-v1.2-20190228123639.min.css
```

```html
<!-- master.html -->

<link href="https://www.site.com/css/app-v1.1-20190228123639.min.css" rel="stylesheet">
<link href="https://www.site.com/css/web-v1.2-20190228123639.min.css" rel="stylesheet">
```

## Bug Reporting

If you happen to come across any issues or bugs whilst using cacheKiller, please run your cacheKiller task with the cli `--debug` option enabled. The resulting report can then be copied and pasted inside your issue request. Adding this report to your issue request will reduce the time needed to identify and fix any bugs. 

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

Find more on the release history at:

[https://github.com/custom-dev-tools/grunt-cache-killer/blob/master/CHANGELOG.md](https://github.com/custom-dev-tools/grunt-cache-killer/blob/master/CHANGELOG.md).