/* jshint node: true */
/* global describe, it, beforeEach */
'use strict';

var transformHead = require('..');
var should = require('should');
var gutil = require('gulp-util');
require('mocha');

describe('gulp-transform-head', function() {
  var fakeFile;

  function getFakeFile(fileContent){
    return new gutil.File({
      path: './test/fixture/file.js',
      cwd: './test/',
      base: './test/fixture/',
      contents: new Buffer(fileContent || '')
    });
  }

  beforeEach(function(){
    fakeFile = getFakeFile('Hello world');
  });

  describe('header', function() {

    it('file should pass through', function(done) {
      var file_count = 0;
      var stream = transformHead(0, function(data) { return data; });
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);
        newFile.path.should.equal('./test/fixture/file.js');
        newFile.relative.should.equal('file.js');
        newFile.contents.toString().should.equal('Hello world');
        ++file_count;
      });

      stream.once('end', function () {
        file_count.should.equal(1);
        done();
      });

      stream.write(fakeFile);
      stream.end();
    });


    it('should prepend the header to the file content', function(done) {
      var stream = transformHead(0, function(data) { return 'And then i said : ' + data; });
      stream.on('data', function (newFile) {
        should.exist(newFile.contents);
        newFile.contents.toString().should.equal('And then i said : Hello world');
      });
      stream.once('end', done);

      stream.write(fakeFile);
      stream.end();
    });



  });

});