'use strict';

const ForkingStream = require('./');
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
