var test = require('tape');
var Leipzig = require('../dist/leipzig');

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
    skip: 'gloss__line--skip',
    hidden: 'gloss__line--hidden'
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
    skip: 'test__line--skip',
    hidden: 'test__line--hidden'
  }
};

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

test('set options correctly when called with single config object', function(t) {
  var leipzig = Leipzig(testConfig);

  Object.keys(leipzig).forEach(function(opt) {
    t.deepEqual(leipzig[opt], testConfig[opt]);
  });

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
