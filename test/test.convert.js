'use strict';
var im = require('../index')
  , utils = require('./utils')
  , fs = require('fs');

function convert (src, dest, args, done, expectErr) {
  var outFilename = __dirname + '/out/' + dest
    , srcFile = __dirname + '/fixtures/src/' + src
    , inputBuffer = fs.readFileSync(srcFile)
    ;

  args || (args = []);

  im.convert(inputBuffer, args, function (err, outBuffer) {
    if (err) {
      if (expectErr) {
        return done();
      }

      console.log(err);
      return done(err);
    }
    fs.writeFileSync(outFilename, outBuffer);
    utils.compare(outFilename, __dirname + '/fixtures/' + dest, done);
  });
}

describe('convert', function () {

  describe('url', function () {

    // it('should be able to resize to 100x100 w/ aspect fill & format WEBP', function (done) {
    //   var outFilename = __dirname + '/out/convert-url-fill-100.webp'
    //     , outBuffer = im.convert({
    //       src: "http://127.0.0.1:8000/test/fixtures/corgi-src.jpg",
    //       ops: 'fill',
    //       format: 'WEBP',
    //       width: 100,
    //       height: 100
    //     });
    //   fs.writeFileSync(outFilename, outBuffer);

    //   done();
    // });

  });


  describe('buffer', function () {
    describe('fill', function () {

      describe('format PNG', function () {

        it('should be able to resize to 100x100 w/ aspect fill format PNG', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-fill-100.png', ['format', 'PNG', 'resize', '100x100^', 'extent', '100x100', 'CenterGravity'], done);
        });

        it('should be able to resize to 100x100 w/ aspect fill w/ transparency', function (done) {
          convert('google.png', 'convert-buffer-fill-google-transparent-100.png', ['format', 'PNG', 'resize', '100x100^', 'extent', '100x100', 'CenterGravity'], done);
        });
      });

      it('should be able to resize to 100x100 w/ aspect fill w/o format', function (done) {
        convert('corgi-src.jpg', 'convert-buffer-fill-100.jpg', ['resize', '100x100^', 'extent', '100x100', 'CenterGravity'], done);
      });

      it('should emit error if buffer is invalid', function (done) {
        convert('bad.jpg', 'convert-buffer-fill-100.jpg', ['resize', '100x100^', 'extent', '100x100', 'CenterGravity'], done, true);
      });

    });

    describe('resize', function () {

      describe('format PNG', function () {

        it('should be able to resize to 100x100 w/ aspect fill format PNG', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-resize-100.png', ['resize', '100x100', 'format', 'PNG'], done);
        });

        it('should be able to resize to 100x100 w/ aspect fill w/ transparency', function (done) {
          convert('google.png', 'convert-buffer-resize-google-transparent-100.png', ['resize', '100x100', 'format', 'PNG'], done);
        });
      });

      describe('w/o format', function () {
        it('should be able to resize to 100x100 w/ aspect fill w/o format', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-resize-100.jpg', ['resize', '100x100'], done);
        });
      });
    });

    describe('blur', function () {
      describe('format jpg', function () {
        it('should be able to blur by 20 w/ format jpg', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-blur.jpg', ['blurSigma', 20, 'resize', '100x100^', 'extent', '100x100', 'CenterGravity', 'format', 'JPG'], done);
        });
      });
    });
  });
});
