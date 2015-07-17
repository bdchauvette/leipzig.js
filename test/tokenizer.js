var test = require('tape-catch');
var Leipzig = require('../dist/leipzig');

var leipzig = Leipzig();

test('tokenizes at whitespace', function(t) {
  var tokens = leipzig.tokenize('a wild foo-bar appears');
  t.deepEqual(tokens, ['a', 'wild', 'foo-bar', 'appears']);
  t.end();
});

test('handles unicode tokenization', function(t) {
  var tokens = leipzig.tokenize('太陽は 昇る。');
  t.deepEqual(tokens, ['太陽は', '昇る。']);
  t.end();
});

test('groups tokens with {}', function(t) {
  var tokens = leipzig.tokenize('this is {a group}');
  t.deepEqual(tokens, ['this', 'is', 'a group']);
  t.end();
});

test('handles empty {} groups', function(t) {
  var tokens = leipzig.tokenize('foo {} bar');
  t.deepEqual(tokens, ['foo', '', 'bar']);
  t.end();
});

test('should ignore mid-word braces', function(t) {
  var tokens = leipzig.tokenize('foo{bar bar}foo');
  t.deepEqual(tokens, ['foo{bar', 'bar}foo']);
  t.end();
});
