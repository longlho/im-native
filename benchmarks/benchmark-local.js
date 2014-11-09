'use strict';
var fs = require('fs')
  , im = require('../index')
  , execFile = require('child_process').execFile
  , img = __dirname + '/../test/fixtures/src/corgi-src.jpg'
  , src = fs.readFileSync(img);

var nativeDone = 100;
console.time('Native convert 100 times');
for (var i = 0; i < 100; i++) {
  im.convert(
    src,
    ['resize', '100x100', 'gravity', 'NorthGravity', 'extent', '100x100', 'format', 'webp'],
    function (err) {
      if (err) {
        return console.log(err);
      }
      nativeDone--;
      if (!nativeDone) {
        console.timeEnd('Native convert 100 times');
      }
    }
  );
}

console.time('spawn convert 100 times');
var done = 100;
for (i = 0; i < 100; i++) {
  execFile('convert', [img, '-resize', '100x100', '-background', 'transparent', '-gravity', 'North', '-extent', '100x100', 'webp:-'], {
    timeout: 2000
  }, function (err) {
    if (err) {
      return console.log(err);
    }
    done--;
    if (!done) {
      console.timeEnd('spawn convert 100 times');
    }
  });
}
