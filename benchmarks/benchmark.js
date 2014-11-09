'use strict';
var im = require('../index')
  , http = require('http')
  , request = require('request')
  , execFile = require('child_process').execFile
  , done = 100;

// console.time('Spawn 100 IM processes');
// var done = 100;
// for (var i = 0; i < 100; i++) {
//   execFile("convert", ["http://radioedit.iheart.com/service/img/nop()/assets/images/1469.png", "-resize", "100x100^", '-background', 'transparent', '-gravity', 'North', '-extent', '100x100', "webp:-"], {
//     timeout: 2000
//   }, function (err, stdout, stderr) {
//     if (err || !stdout || !stdout.length) {
//       console.log('err spawning convert');
//       console.log(err);
//       process.exit(1);
//     }
//     done--;
//     if (!done) {
//       console.timeEnd('Spawn 100 IM processes');
//       testAsyncReq();
//     }
//   })
// }

function nativeConvert () {
  request({
    url: "http://radioedit.iheart.com/service/img/nop()/assets/images/1469.png",
    timeout: 10000,
    encoding: null
  }, function (err, resp, data) {
    im.convert(
      data,
      ['resize', '100x100^', 'extent', '100x100', 'NorthGravity', 'format', 'WEBP'],
      function () {
        done--;
        if (!done) {
          console.timeEnd('Async img req + native convert 1000 times');
          testAsyncReqExec();
        }
      }
    );
  });
}

function spawnConvert () {
  execFile("convert", ["http://radioedit.iheart.com/service/img/nop()/assets/images/1469.png", "-resize", "100x100^", '-background', 'transparent', '-gravity', 'North', '-extent', '100x100', "webp:-"], {
    timeout: 1000
  }, function () {
    done--;
    if (!done) {
      console.timeEnd('Async img req + spawn convert 1000 times');
    }
  });
}


console.time('Async img req + native convert 1000 times');
for (var i = 0; i < 1000; i++) {
  nativeConvert();
}


function testAsyncReqExec() {
  console.time('Async img req + spawn convert 1000 times');
  done = 100;
  for (var i = 0; i < 1000; i++) {
    spawnConvert();
  }
}
