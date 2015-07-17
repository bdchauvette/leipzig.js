var test = require('tape');
var Leipzig = require('../dist/leipzig');

var leipzig = Leipzig();

test('tokenizes at whitespace', function(t) {
  var tokens = leipzig.tokenize('behold, this is a phrase.');
  t.equal(tokens.length, 5);
  t.end();
});

test('handles unicode tokenization', function(t) {
  var tokens = leipzig.tokenize('太陽は 昇る。');
  t.equal(tokens.length, 2);
  t.end();
});

test('groups tokens with {}', function(t) {
  var tokens = leipzig.tokenize('this is {a group}');
  t.equal(tokens.length, 3);
  t.end();
});

test('handles empty {} groups', function(t) {
  var tokens = leipzig.tokenize('this line has an empty {} group');
  t.equal(tokens.length, 7);
  t.end();
});

test('strips braces from groups', function(t) {
  var tokens = leipzig.tokenize('{a it} {of} {brace stripping}');

  t.equal(tokens[0], 'a it');
  t.equal(tokens[1], 'of');
  t.equal(tokens[2], 'brace stripping');
  t.end();
});

test('should ignore mid-word braces', function(t) {
  var tokens = leipzig.tokenize('/{p@l/ is <apple>}');
  t.equal(tokens.length, 3);
  t.end();
});
