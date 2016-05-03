'use strict';

const test          = require('tape');
const ForkingStream = require('../');

test('allows data to be forked', (t) => {
  t.plan(2);

  let input = new ForkingStream;

  let stream1 = input.createReadStream();
  let stream2 = input.createReadStream();

  stream1.on('data', (data) => {
    t.equal(data.toString(), 'Hello, World', 'stream1 gets data');
  });

  stream2.on('data', (data) => {
    t.equal(data.toString(), 'Hello, World', 'stream2 gets data');
  });

  input.write('Hello, World', 'utf8');
});

test('allows multiple writes', (t) => {
  t.plan(2);

  let input = new ForkingStream;

  let stream1 = input.createReadStream();

  stream1.on('data', (data) => {
    t.equal(data.toString(), 'Hello, World', 'stream1 gets data');
  });

  input.write('Hello, World', 'utf8');
  input.write('Hello, World', 'utf8');
});

test('supports object mode', (t) => {
  t.plan(2);

  let input = new ForkingStream({ objectMode: true });

  let stream1 = input.createReadStream();
  let stream2 = input.createReadStream();

  stream1.on('data', (data) => {
    t.deepEqual(data, { a: 10 }, 'stream1 gets data');
  });

  stream2.on('data', (data) => {
    t.deepEqual(data, { a: 10 }, 'stream2 gets data');
  });

  input.write({ a: 10 });
});

test('allows stream cleanup', (t) => {
  t.plan(2);

  let input = new ForkingStream({ objectMode: true });

  let stream1 = input.createReadStream();
  let stream2 = input.createReadStream();

  stream2.destroy();

  stream1.on('data', (data) => {
    t.deepEqual(data, { a: 10 }, 'stream1 gets data');
  });

  stream2.on('data', (data) => {
    t.deepEqual(data, { a: 10 }, 'stream2 gets data');
  });

  t.equal(input._streams.length, 1, 'removes stream');

  input.write({ a: 10 });
});
