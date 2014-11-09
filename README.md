im-native
=========

[![Build Status](https://travis-ci.org/longlho/im-native.svg?branch=master)](https://travis-ci.org/longlho/im-native)


Node ImageMagick Native module, essentially a rewrite of [node-imagemagick-native](https://github.com/mash/node-imagemagick-native). **Still in development**

Quick usage:

```javascript

var im = require('im-native');

var outputBuffer = im.convert(
  // Required. Can also be URL, file path or Buffer object. Note that IM is IO-blocking so using path/URL will block the process
  'test.jpg',
  // Required. Operations, just like arguments you'd pass to `convert` process
  ['resize', '100x100^', 'quality', 75, 'format', 'WEBP', 'extent', '100x100', 'CenterGravity', 'blurSigma', 5],
  // Required, callback function
  callbackFn
});
```

Supported methods
---

**NOTE**: Orders do matter

- `['resize', '<width>x<height><flag>']`
- `['extent', '<width>x<height', '<gravity>']`
- `['format', '<JPG/PNG/WEBP>']`
- `['quality', '<0 - 100>']`
- `['blurSigma', '<blurSigma>']`

TODO
---

- Figure out optional width & height
- More tests
- Composite (for rounded corners...)
