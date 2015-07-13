var window = window ? window : undefined;

var env;
var leipzig;
var assert;

if (window) {
  env = 'browser';
  leipzig = window.Leipzig();
  assert  = window.chai.assert;
} else {
  env = 'node';
  leipzig = require('../leipzig')();
  assert = require('assert');
}

describe('tokenizer', function() {
  it('tokenizes at whitespace', function() {
    var tokens = leipzig.tokenize('behold, this is a phrase.');
    assert.equal(tokens.length, 5);
  });

  it('handles unicode tokenization', function() {
    var tokens = leipzig.tokenize('太陽は 昇る。');
    assert.equal(tokens.length, 2);
  });

  it('groups tokens with {}', function() {
    var tokens = leipzig.tokenize('this is {a group}');
    assert.equal(tokens.length, 3);
  });

  it('handles empty {} groups', function() {
    var tokens = leipzig.tokenize('this line has an empty {} group');
    assert.equal(tokens.length, 7);
  });

  it('strips braces from groups', function() {
    var tokens = leipzig.tokenize('{a it} {of} {brace stripping}');

    assert.equal(tokens[0], 'a it');
    assert.equal(tokens[1], 'of');
    assert.equal(tokens[2], 'brace stripping');
  });

  it('should ignore mid-word braces', function() {
    var tokens = leipzig.tokenize('/{p@l/ is <apple>}');
    assert.equal(tokens.length, 3);
  });
});

describe('alignment', function() {
  it('aligns morphemes', function() {
    var line1 = ['a', 'it'];
    var line2 = ['DET', 'it'];
    var aligned = leipzig.align([line1, line2]);

    assert.deepEqual(aligned, [['a', 'DET'], ['it', 'it']]);
  });

  it('adds empty string when lines are of mismatched length', function() {
    var line1 = ['perro', 'el'];
    var line2 = ['dog'];
    var aligned = leipzig.align([line1, line2]);

    assert.deepEqual(aligned, [['perro', 'dog'], ['el', '']]);
  });
});
