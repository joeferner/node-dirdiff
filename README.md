[![build status](https://secure.travis-ci.org/nearinfinity/node-dirdiff.png)](http://travis-ci.org/nearinfinity/node-dirdiff)
dirdiff
=======

Diffs two directories.

## Quick Examples

```javascript
var dirdiff = require("dirdiff");

dirdiff('./dir1Name/', './dir2Name/', {
  fileContents: true
}, function (err, diffs) {
  console.log(diffs);
});
```
