var test = require('tape-catch');
var Leipzig = require('../dist/leipzig');

// default configuration values
var defaults = {
  lastLineFree: true,
  firstLineOrig: false,
  spacing: true,
  autoTag: true,
  tokenizers: [
    '{(.*?)}',
    '([^\\s]+)'
  ],
  elements: '[data-gloss]',
  class: {
    glossed: 'gloss--glossed',
    noSpace: 'gloss--no-space',
    words: 'gloss__words',
    word: 'gloss__word',
    line: 'gloss__line',
    lineNum: 'gloss__line--',
    original: 'gloss__line--original',
    freeTranslation: 'gloss__line--free',
    noAlign: 'gloss__line--no-align',
    hidden: 'gloss__line--hidden',
    abbr: 'gloss__abbr'
  }
};

// used for testing configuration objects
// all values changed from defaults
var testConfig = {
  lastLineFree: false,
  firstLineOrig: true,
  spacing: false,
  autoTag: false,
  tokenizers: [
    'test regex'
  ],
  elements: '.test',
  class: {
    glossed: 'test--glossed',
    noSpace: 'test--no-space',
    words: 'test__words',
    word: 'test__word',
    line: 'test__line',
    lineNum: 'test__line--',
    original: 'test__line--original',
    freeTranslation: 'test__line--free',
    noAlign: 'test__line--no-align',
    hidden: 'test__line--hidden',
    abbr: 'test__abbr'
  }
};

// helper function for testing selector
function testSelector(t, elements) {
  var leipzig = Leipzig(elements);

  Object.keys(leipzig).forEach(function(opt) {
    if (opt === 'elements') {
      t.deepEqual(leipzig[opt], elements);
    } else {
      t.deepEqual(leipzig[opt], defaults[opt]);
    }
  });
}

test('use all defaults when called with no args', function(t) {
  var leipzig = Leipzig();

  Object.keys(leipzig).forEach(function(opt) {
    t.deepEqual(leipzig[opt], defaults[opt]);
  });

  t.end();
});

test('only set the selector when called with a string', function(t) {
  var elements = '.gloss';
  testSelector(t, elements);
  t.end();
});

test('only set the selector when called with a NodeList', function(t) {
  var elements = document.querySelectorAll('.gloss');
  testSelector(t, elements);
  t.end();
});

test('only set the selector when called with an element', function(t) {
  var elements = document.querySelector('html');
  testSelector(t, elements);
  t.end();
});

test('throws an error when called with an invalid selector', function(t) {
  try {
    var leipzig = Leipzig({});
  } catch (e) {
    if (e.message === 'Invalid selector') {
      t.pass();
    }
  }

  t.end();
});

test('set options correctly when called with single config object', function(t) {
  var leipzig = Leipzig(testConfig);

  Object.keys(leipzig).forEach(function(opt) {
    t.deepEqual(leipzig[opt], testConfig[opt]);
  });

  t.end();
});

test('should accept a String as a tokenizer', function(t) {
  var leipzig = Leipzig({ tokenizers: 'test' });

  t.deepEqual(leipzig.tokenizers, ['test']);
  t.end();
});

test('should accept a RegExp as a tokenizer', function(t) {
  var leipzig = Leipzig({ tokenizers: /test/ });

  t.deepEqual(leipzig.tokenizers, /test/);
  t.end();
});

test('should reject tokenizers that are not arrays of strings', function(t) {
  var expectedErrorMessage = 'Unknown format for tokenizers';

  try {
    var leipzig = Leipzig({ tokenizers: {} });
  } catch (e) {
    if (e.message === expectedErrorMessage) {
      t.pass();
    }
  }

  try {
    var leipzig = Leipzig({ tokenizers: [123] });
  } catch (e) {
    if (e.message === expectedErrorMessage) {
      t.pass();
    }
  }

  t.end();
});

test('set config correctly when called with two arguments', function(t) {
  var elements = document.querySelectorAll('.gloss');
  var leipzig = Leipzig(elements, testConfig);

  Object.keys(leipzig).forEach(function(opt) {
    if (opt === 'elements') {
      t.deepEqual(leipzig[opt], elements);
    } else {
      t.deepEqual(leipzig[opt], testConfig[opt]);
    }
  });

  t.end();
});
