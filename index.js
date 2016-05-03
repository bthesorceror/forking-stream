'use strict';

const Writable   = require('stream').Writable;
const PassThrough = require('stream').PassThrough;

class ForkingStream extends Writable {

  constructor(options) {
    super(options);

    this._options = options;
    this._streams = [];
  }

  _write(chunk, enc, next) {
    this._streams.forEach((stream) => {
      stream.write(chunk);
    });

    next();
  }

  createReadStream() {
    let stream = new PassThrough(this._options);

    this._streams.push(stream);

    stream.destroy = () => {
      let index = this._streams.indexOf(stream);

      if (index < 0) return;

      this._streams.splice(index, 1);
    }

    return stream;
  }

}

module.exports = ForkingStream;
