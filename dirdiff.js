'use strict';

var glob = require('glob');
var path = require('path');
var fs = require('fs');

var dirdiff = module.exports = function (dir1, dir2, opts, callback) {
  glob(path.join(dir1, '**'), function (err, dir1Files) {
    if (err) {
      return callback(err);
    }
    dir1Files = dir1Files
      .map(function (f) { return f.substring(dir1.length); });

    glob(path.join(dir2, '**'), function (err, dir2Files) {
      if (err) {
        return callback(err);
      }
      dir2Files = dir2Files
        .map(function (f) { return f.substring(dir2.length); });

      diffFiles(dir1, dir1Files, dir2, dir2Files, opts, callback);
    });
  });
};

var diffFiles = dirdiff.diffFiles = function (dir1, dir1Files, dir2, dir2Files, opts, callback) {
  dir1Files = dir1Files.sort();
  dir2Files = dir2Files.sort();

  var results = [];
  var dir1Idx = 0;
  var dir2Idx = 0;
  run();

  function run() {
    if (dir1Idx >= dir1Files.length && dir2Idx >= dir2Files.length) {
      return callback(null, results);
    }

    if (dir1Idx < dir1Files.length && dir2Idx < dir2Files.length && dir1Files[dir1Idx] === dir2Files[dir2Idx]) {
      if (opts.fileContents) {
        diffFile(dir1, dir1Files[dir1Idx], dir2, dir2Files[dir2Idx], opts, function (err, diff) {
          if (err) {
            return callback(err);
          }
          if (diff) {
            results.push(diff);
          }
          dir1Idx++;
          dir2Idx++;
          process.nextTick(run);
        });
      } else {
        dir1Idx++;
        dir2Idx++;
        process.nextTick(run);
      }
    } else if (dir2Idx >= dir2Files.length || dir1Files[dir1Idx] < dir2Files[dir2Idx]) {
      results.push({
        type: 'fileMissing',
        file1: dir1Files[dir1Idx],
        file2: null
      });
      dir1Idx++;
      process.nextTick(run);
    } else {
      results.push({
        type: 'fileMissing',
        file1: null,
        file2: dir2Files[dir2Idx]
      });
      dir2Idx++;
      process.nextTick(run);
    }
  }
};

var diffFile = dirdiff.diffFile = function (dir1, file1, dir2, file2, opts, callback) {
  fs.stat(path.join(dir1, file1), function (err, file1Stat) {
    if (err) {
      return callback(err);
    }

    fs.stat(path.join(dir2, file2), function (err, file2Stat) {
      if (err) {
        return callback(err);
      }

      if (file1Stat.isDirectory() && file2Stat.isDirectory()) {
        return callback();
      }
      if ((file1Stat.isDirectory() && !file2Stat.isDirectory()) || (!file1Stat.isDirectory() && file2Stat.isDirectory())) {
        return callback(null, {
          type: 'fileTypeMismatch',
          file1: file1,
          file2: file2
        });
      }

      compareFiles();
    });
  });

  function compareFiles() {
    fs.readFile(path.join(dir1, file1), function (err, file1Data) {
      if (err) {
        return callback(err);
      }
      fs.readFile(path.join(dir2, file2), function (err, file2Data) {
        if (err) {
          return callback(err);
        }

        if (file1Data.length !== file2Data.length) {
          return callback(null, {
            type: 'fileLengthMismatch',
            file1: file1,
            file2: file2
          });
        }

        for (var i = 0; i < file1Data.length; i++) {
          if (file1Data[i] !== file2Data[i]) {
            return callback(null, {
              type: 'fileContentMismatch',
              file1: file1,
              file2: file2,
              pos: i
            });
          }
        }

        callback();
      });
    });
  }
};
