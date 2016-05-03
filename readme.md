#forking-stream

[![Build Status](https://travis-ci.org/bthesorceror/forking-stream.png?branch=master)](https://travis-ci.org/bthesorceror/forking-stream)

Turning one stream into many

## Example:

```javascript
'use strict';

const ForkingStream = require('forking-stream');
const through       = require('through2');

let stream = new ForkingStream;

stream.createReadStream().pipe(through(function(chunk, enc, next) {
  this.push("++  " + chunk.toString());
  next();
})).pipe(process.stdout);

let read = stream.createReadStream();

read.pipe(through(function(chunk, enc, next) {
  this.push("--> " + chunk.toString());
  next();
})).pipe(process.stdout);

setTimeout(() => {
  read.destroy();
}, 3000);

setInterval(() => {
  stream.write('Hello, World!\n');
}, 100);
```
