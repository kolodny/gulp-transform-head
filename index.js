var gulp = require('gulp');
var gutil = require('gulp-util');
var transform = require('vinyl-transform');
var es = require('event-stream');

var transformHead = function(delim, transformer, useBuffers) {
  return transform(function(filename) {
    var head = useBuffers ? new Buffer([]) : '';
    var transformed;
    var delimFunction;

    if (useBuffers && typeof delim !== 'function') {
      throw new gutil.PluginError('gulp-transform-head', 'useBuffers needs a function delim');
    }


    if (typeof delim === 'function') {
      delimFunction = delim;
    } else if (typeof delim === 'number') {
      delimFunction = function(head) {
        return (head.match(/\n/g) || []).length >= delim;
      }
    } else if (delim instanceof RegExp) {
      delimFunction = function(head) {
        return delim.test(head);
      }
    } else if (typeof delim === 'string') {
      delimFunction = function(head) {
        return head.indexOf(delim) > -1;
      }
    } else {
      throw new gutil.PluginError('gulp-transform-head', 'invalid delimiter');
    }

    var write = function(data) {
      if (useBuffers) {
        head = Buffer.concat([head, data]);
      } else {
        head += data;
      }
      if (!transformed) {
        if (delimFunction(head)) {
          data = transformer(head);
          transformed = true;
        } else {
          data = '';
        }
      }
      this.emit('data', data)
    };
    var end = function() {
      if (!transformed) {
        this.emit('data', transformer(head))
      }
      this.emit('end')
    };



    return es.through(write, end);
  });
};


module.exports = transformHead;