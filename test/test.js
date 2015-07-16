var window = window ? window : undefined;

var env;
var Leipzig;
var assert;

if (window) {
  env = 'browser';
  Leipzig = window.Leipzig;
  assert  = window.chai.assert;
} else {
  env = 'node';
  Leipzig = require('../dist/leipzig');
  assert = require('assert');
}

describe('tokenizer', function() {
  var leipzig = Leipzig();

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
  var leipzig = Leipzig();

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

describe('configuration', function() {
  // default configuration values
  var defaults = {
    lastLineFree: true,
    firstLineOrig: false,
    spacing: true,
    elements: '[data-gloss]',
    class: {
      glossed: 'gloss--glossed',
      words: 'gloss__words',
      word: 'gloss__word',
      noSpace: 'gloss__word--no-space',
      line: 'gloss__line--',
      original: 'gloss__line--original',
      freeTranslation: 'gloss__line--free',
      skip: 'gloss__line--skip'
    }
  };

  // all settings changed from default values
  var testConfig = {
    lastLineFree: false,
    firstLineOrig: true,
    spacing: false,
    elements: '.gloss',
    class: {
      glossed: 'test--glossed',
      words: 'test__words',
      word: 'test__word',
      noSpace: 'test__word--no-space',
      line: 'test__line--',
      original: 'test__line--original',
      freeTranslation: 'test__line--free',
      skip: 'test__line--skip'
    }
  };

  it('should use all defaults when called with no args', function() {
    var leipzig = Leipzig();

    Object.keys(leipzig).forEach(function(opt) {
      assert.deepEqual(leipzig[opt], defaults[opt]);
    });
  });

  describe('calling with single selector argument', function() {
    function testSelector(elements) {
      var leipzig = Leipzig(elements);

      Object.keys(leipzig).forEach(function(opt) {
        if (opt === 'elements') {
          assert.deepEqual(leipzig[opt], elements);
        } else {
          assert.deepEqual(leipzig[opt], defaults[opt]);
        }
      });
    }

    it('should only set the selector when called with a string', function() {
      var elements = '.gloss';
      testSelector(elements);
    });

    it('should only set the selector when called with a NodeList', function() {
      var elements = document.querySelectorAll('.gloss');
      testSelector(elements);
    });

    it('should only set the selector when called with an element', function() {
      var elements = document.querySelector('.gloss');
      testSelector(elements);
    });
  });

  describe('calling with single configuration object', function() {
    it('should set options correctly', function() {
      var leipzig = Leipzig(testConfig);

      Object.keys(leipzig).forEach(function(opt) {
        assert.deepEqual(leipzig[opt], testConfig[opt]);
      });
    });
  });

  describe('calling with multiple arguments', function() {
    it('should set config correctly when called with two arguments', function() {
      var elements = document.querySelectorAll('.gloss');
      var leipzig = Leipzig(elements, testConfig);

      Object.keys(leipzig).forEach(function(opt) {
        if (opt === 'elements') {
          assert.deepEqual(leipzig[opt], elements);
        } else {
          assert.deepEqual(leipzig[opt], testConfig[opt]);
        }
      });
    });
  });
});
