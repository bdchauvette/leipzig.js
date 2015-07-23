var test = require('tape-catch');
var Leipzig = require('../dist/leipzig');

var lexers = [
  undefined,
  ['{(.*?)}', '([^\\s]+)'],
  '{(.*?)}|([^\\s]+)',
  /{(.*?)}|([^\s]+)/g
];

lexers.forEach(function(lexer) {
  var leipzig = Leipzig({ lexers: lexer });

  test('tokenizes at whitespace', function(t) {
    var tokens = leipzig.lex('a wild foo-bar appears');
    t.deepEqual(tokens, ['a', 'wild', 'foo-bar', 'appears']);
    t.end();
  });

  test('handles unicode', function(t) {
    var tokens = leipzig.lex('太陽は 昇る。');
    t.deepEqual(tokens, ['太陽は', '昇る。']);
    t.end();
  });

  test('groups tokens with {}', function(t) {
    var tokens = leipzig.lex('this is {a group}');
    t.deepEqual(tokens, ['this', 'is', 'a group']);
    t.end();
  });

  test('handles empty {} groups', function(t) {
    var tokens = leipzig.lex('foo {} bar');
    t.deepEqual(tokens, ['foo', '', 'bar']);
    t.end();
  });

  test('should ignore mid-word braces', function(t) {
    var tokens = leipzig.lex('foo{bar bar}foo');
    t.deepEqual(tokens, ['foo{bar', 'bar}foo']);
    t.end();
  });
});
