var test = require('tape-catch');
var Leipzig = require('../dist/leipzig');

var leipzig = Leipzig();

test('aligns morphemes', function(t) {
  var line1 = ['a', 'it'];
  var line2 = ['DET', 'it'];
  var aligned = leipzig.align([line1, line2]);

  t.deepEqual(aligned, [['a', 'DET'], ['it', 'it']]);
  t.end();
});

test('adds empty string when lines are of mismatched length', function(t) {
  var line1 = ['perro', 'el'];
  var line2 = ['dog'];
  var aligned = leipzig.align([line1, line2]);

  t.deepEqual(aligned, [['perro', 'dog'], ['el', '']]);
  t.end();
});
