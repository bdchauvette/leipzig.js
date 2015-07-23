var test = require('tape-catch');
var Leipzig = require('../dist/leipzig');

// default configuration values
var defaults = {
  lastLineFree: true,
  firstLineOrig: false,
  spacing: true,
  autoTag: true,
  async: false,
  lexers: [
    '{(.*?)}',
    '([^\\s]+)'
  ],
  selector: '[data-gloss]',
  events: {
    beforeGloss: 'gloss:beforeGloss',
    afterGloss: 'gloss:afterGloss',
    beforeLex: 'gloss:beforeLex',
    afterLex: 'gloss:afterLex',
    beforeAlign: 'gloss:beforeAlign',
    afterAlign:'gloss:afterAlign',
    beforeFormat: 'gloss:beforeFormat',
    afterFormat:'gloss:afterFormat',
    start: 'gloss:start',
    complete: 'gloss:complete'
  },
  classes: {
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
  async: true,
  abbreviations: { foo: 'bar' },
  lexers: [
    'test regex'
  ],
  selector: '.test',
  events: {
    beforeGloss: 'test:beforeGloss',
    afterGloss: 'test:afterGloss',
    beforeLex: 'test:beforeLex',
    afterLex: 'test:afterLex',
    beforeAlign: 'test:beforeAlign',
    afterAlign:'test:afterAlign',
    beforeFormat: 'test:beforeFormat',
    afterFormat:'test:afterFormat',
    start: 'test:start',
    complete: 'test:complete'
  },
  classes: {
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
function testSelector(t, selector) {
  var leipzig = Leipzig(selector);

  Object.keys(leipzig).forEach(function(opt) {
    if (opt === 'selector') {
      t.deepEqual(leipzig[opt], selector);
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
  var selector = '.gloss';
  testSelector(t, selector);
  t.end();
});

test('only set the selector when called with a NodeList', function(t) {
  var selector = document.querySelectorAll('.gloss');
  testSelector(t, selector);
  t.end();
});

test('only set the selector when called with an element', function(t) {
  var selector = document.querySelector('html');
  testSelector(t, selector);
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

test('overrides settings when called with Leipzig#config', function(t) {
  var leipzig = Leipzig();
  leipzig.config(testConfig);

  Object.keys(leipzig).forEach(function(opt) {
    t.deepEqual(leipzig[opt], testConfig[opt]);
  });

  t.end();
});

test('should set abbreviations when called with an object', function(t) {
  var abbr = { foo: 'bar' };
  var leipzig = Leipzig({ abbreviations: abbr });

  t.deepEqual(leipzig.abbreviations, abbr);

  t.end();
});

test('should accept a String as a lexer', function(t) {
  var leipzig = Leipzig({ lexers: 'test' });

  t.deepEqual(leipzig.lexers, ['test']);
  t.end();
});

test('should accept a RegExp as a lexer', function(t) {
  var leipzig = Leipzig({ lexers: /test/ });

  t.deepEqual(leipzig.lexers, /test/);
  t.end();
});

test('should reject lexers that are not arrays of strings', function(t) {
  var expectedErrorMessage = 'Unknown format for lexers';

  try {
    var leipzig = Leipzig({ lexers: {} });
  } catch (e) {
    if (e.message === expectedErrorMessage) {
      t.pass();
    }
  }

  try {
    var leipzig = Leipzig({ lexers: [123] });
  } catch (e) {
    if (e.message === expectedErrorMessage) {
      t.pass();
    }
  }

  t.end();
});

test('set config correctly when called with two arguments', function(t) {
  var selector = document.querySelectorAll('.gloss');
  var leipzig = Leipzig(selector, testConfig);

  Object.keys(leipzig).forEach(function(opt) {
    if (opt === 'selector') {
      t.deepEqual(leipzig[opt], selector);
    } else {
      t.deepEqual(leipzig[opt], testConfig[opt]);
    }
  });

  t.end();
});
