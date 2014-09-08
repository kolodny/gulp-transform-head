[gulp](https://github.com/gulpjs/gulp)-transform-head
===

### Transform the beginning of a stream/buffer, useful for adding runtimes

----

### Usage:

`.pipe(transformHead(delim, transformer, useBuffers))`

----

#### delim: `( function |string | regex | number)`

The thing to wait until true, if number: the amount of lines

#### transformer `function`

The function to transform the head of the file

#### useBuffer `boolean (optional)`

Force buffers in the delim and transformer functions
```js
var header = require('gulp-header');

gulp.src('./foo/*.js')
  .pipe(transformHead(0, function(data) { return '"use scrict";\n' + data }))
  .pipe(gulp.dest('./dist/')

gulp.src('./bar/*.js')
  .pipe(transformHead(1, function(data) {
    if (/(['"])use scrict\1/.test(data.split('\n')[0])) {
      throw new gutil.PluginError('plugin', 'You need to use scrict mode');
    }
    return '"use scrict";\n' + data;
  }))
  .pipe(gulp.dest('./dist/')

gulp.src('./baz/*.js')
  .pipe(transformHead('(function(window', function(data) {
    return '(function main(window' + data;
  }))
  .pipe(gulp.dest('./dist/')


```
