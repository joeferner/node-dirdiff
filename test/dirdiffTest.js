'use strict';

var path = require('path');
var dirdiff = require('../');

module.exports = {
  "diff file names, match": function (test) {
    var dir1 = path.join(__dirname, '../testData/dir1/');
    var dir2 = path.join(__dirname, '../testData/dir2/');
    dirdiff(dir1, dir2, {
      fileContents: false
    }, function (err, diffs) {
      if (err) {
        return test.done(err);
      }
      test.equal(0, diffs.length);
      test.done();
    });
  },

  "diff file names, no match": function (test) {
    var dir1 = path.join(__dirname, '../testData/dir1/');
    var dir3 = path.join(__dirname, '../testData/dir3/');
    dirdiff(dir1, dir3, {
      fileContents: false
    }, function (err, diffs) {
      if (err) {
        return test.done(err);
      }
      test.equal(3, diffs.length);

      test.equal('fileMissing', diffs[0].type);
      test.equal('file1.txt', diffs[0].file1);
      test.equal(null, diffs[0].file2);

      test.equal('fileMissing', diffs[1].type);
      test.equal('subdir1', diffs[1].file1);
      test.equal(null, diffs[1].file2);

      test.equal('fileMissing', diffs[2].type);
      test.equal('subdir1/file2.txt', diffs[2].file1);
      test.equal(null, diffs[2].file2);

      test.done();
    });
  },

  "diff file names, some match": function (test) {
    var dir1 = path.join(__dirname, '../testData/dir1/');
    var dir4 = path.join(__dirname, '../testData/dir4/');
    dirdiff(dir1, dir4, {
      fileContents: false
    }, function (err, diffs) {
      if (err) {
        return test.done(err);
      }
      test.equal(4, diffs.length);

      test.equal('fileMissing', diffs[0].type);
      test.equal('subdir1', diffs[0].file1);
      test.equal(null, diffs[0].file2);

      test.equal('fileMissing', diffs[1].type);
      test.equal('subdir1/file2.txt', diffs[1].file1);
      test.equal(null, diffs[1].file2);

      test.equal('fileMissing', diffs[2].type);
      test.equal(null, diffs[2].file1);
      test.equal('subdir2', diffs[2].file2);

      test.equal('fileMissing', diffs[3].type);
      test.equal(null, diffs[3].file1);
      test.equal('subdir2/file2.txt', diffs[3].file2);

      test.done();
    });
  },

  "diff file contents match": function (test) {
    var dir1 = path.join(__dirname, '../testData/dir1/');
    var dir2 = path.join(__dirname, '../testData/dir2/');
    dirdiff(dir1, dir2, {
      fileContents: true
    }, function (err, diffs) {
      if (err) {
        return test.done(err);
      }
      test.equal(0, diffs.length);
      test.done();
    });
  },

  "diff file contents bad matches": function (test) {
    var dir1 = path.join(__dirname, '../testData/dir1/');
    var dir5 = path.join(__dirname, '../testData/dir5/');
    dirdiff(dir1, dir5, {
      fileContents: true
    }, function (err, diffs) {
      if (err) {
        return test.done(err);
      }
      test.equal(2, diffs.length);

      test.equal('fileLengthMismatch', diffs[0].type);
      test.equal('file1.txt', diffs[0].file1);
      test.equal('file1.txt', diffs[0].file2);

      test.equal('fileContentMismatch', diffs[1].type);
      test.equal('subdir1/file2.txt', diffs[1].file1);
      test.equal('subdir1/file2.txt', diffs[1].file2);
      test.equal(0, diffs[1].pos);

      test.done();
    });
  }
};
