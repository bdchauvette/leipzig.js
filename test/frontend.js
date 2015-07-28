var test = require('tape-catch');
var Leipzig = require('../dist/leipzig');

var body = document.querySelector('body');

function makeElement() {
  var html = [
    '<div data-gloss>',
    '<p>me you</p>',
    '<p>1 2</p>',
    '<p>free translation</p>',
    '</div>'
  ].join('');

  body.insertAdjacentHTML('beforeend', html);
  return document.querySelector('[data-gloss]');
}

function makeElementWithSpacer() {
  var html = [
    '<div data-gloss>',
    '<p>{}</p>',
    '<p>{}</p>',
    '<p>contains spacers</p>',
    '</div>'
  ].join('');

  body.insertAdjacentHTML('beforeend', html);
  return document.querySelector('[data-gloss]');
}

test('basic gloss [sync]', function(t) {
  t.plan(2);

  var gloss = makeElement();
  var leipzig = Leipzig();

  var expectedHtml = [
    '<div class="gloss__words">',
      '<div class="gloss__word">',
        '<p class="gloss__line gloss__line--0">me</p>',
        '<p class="gloss__line gloss__line--1">',
          '<abbr class="gloss__abbr" title="first person">1</abbr>',
        '</p>',
      '</div>',
      '<div class="gloss__word">',
        '<p class="gloss__line gloss__line--0">you</p>',
        '<p class="gloss__line gloss__line--1">',
          '<abbr class="gloss__abbr" title="second person">2</abbr>',
        '</p>',
      '</div>',
    '</div>',
    '<p class="gloss__line--hidden">me you</p>',
    '<p class="gloss__line--hidden">1 2</p>',
    '<p class="gloss__line--free gloss__line gloss__line--2">free translation</p>'
  ].join('');

  leipzig.gloss();
  t.equals(gloss.innerHTML, expectedHtml, 'html is as expected');
  t.ok(gloss.classList.contains('gloss--glossed'), 'class is as expected');
  body.removeChild(gloss);
});

test('basic gloss [async]', function(t) {
  t.plan(2);

  var gloss = makeElement();
  var leipzig = Leipzig({ async: true });

  var expectedHtml = [
    '<div class="gloss__words">',
      '<div class="gloss__word">',
        '<p class="gloss__line gloss__line--0">me</p>',
        '<p class="gloss__line gloss__line--1">',
          '<abbr class="gloss__abbr" title="first person">1</abbr>',
        '</p>',
      '</div>',
      '<div class="gloss__word">',
        '<p class="gloss__line gloss__line--0">you</p>',
        '<p class="gloss__line gloss__line--1">',
          '<abbr class="gloss__abbr" title="second person">2</abbr>',
        '</p>',
      '</div>',
    '</div>',
    '<p class="gloss__line--hidden">me you</p>',
    '<p class="gloss__line--hidden">1 2</p>',
    '<p class="gloss__line--free gloss__line gloss__line--2">free translation</p>'
  ].join('');

  leipzig.gloss(function() {
    t.equals(gloss.innerHTML, expectedHtml, 'html is as expected');
    t.ok(gloss.classList.contains('gloss--glossed'), 'class is as expected');
    body.removeChild(gloss);
  });
});

test('first line is original text [sync]', function(t) {
  t.plan(1);

  var gloss = makeElement();
  var leipzig = Leipzig({ firstLineOrig: true });

  leipzig.gloss();
  t.ok(gloss.firstChild.classList.contains('gloss__line--original'));
  body.removeChild(gloss);
});

test('first line is original text [async]', function(t) {
  t.plan(1);

  var gloss = makeElement();
  var leipzig = Leipzig({ firstLineOrig: true, async: true });

  leipzig.gloss(function() {
    t.ok(gloss.firstChild.classList.contains('gloss__line--original'));
    body.removeChild(gloss);
  });
});

test('remove spacing [sync]', function(t) {
  t.plan(1);

  var gloss = makeElement();
  var leipzig = Leipzig({ spacing: false });

  leipzig.gloss();

  t.ok(gloss.classList.contains('gloss--no-space'));

  body.removeChild(gloss);
});

test('remove spacing [async]', function(t) {
  t.plan(1);

  var gloss = makeElement();
  var leipzig = Leipzig({ spacing: false, async: true });

  leipzig.gloss(function() {
    t.ok(gloss.classList.contains('gloss--no-space'));
    body.removeChild(gloss);
  });
});

test('add spacers [sync]', function(t) {
  t.plan(1);
  var gloss = makeElementWithSpacer();
  var leipzig = Leipzig({ spacing: false });

  leipzig.gloss();
  t.ok(gloss.firstChild.firstChild.classList.contains('gloss__word--spacer'));
  body.removeChild(gloss);
});

test('add spacers [async]', function(t) {
  t.plan(1);

  var gloss = makeElementWithSpacer();
  var leipzig = Leipzig({ spacing: false, async: true });

  leipzig.gloss(function() {
    t.ok(gloss.firstChild.firstChild.classList.contains('gloss__word--spacer'));
    body.removeChild(gloss);
  });
});

test('events', function(t) {
  var gloss = makeElement();
  var leipzig = Leipzig();
  var beforeLexCounter = 0;
  var afterLexCounter = 0;

  document.addEventListener('gloss:start', function(e) {
    t.ok(e.detail.glosses instanceof NodeList, 'gloss:start');
  });

  document.addEventListener('gloss:beforeGloss', function(e) {
    t.equal(e.target, gloss, 'gloss:beforeGloss');
  });

  document.addEventListener('gloss:afterGloss', function(e) {
    t.equal(e.target, gloss, 'gloss:afterGloss');
  });

  document.addEventListener('gloss:beforeLex', function(e) {
    beforeLexCounter++;
    t.equal(e.target.tagName, 'P', 'gloss:beforeLex');
    t.equal(e.detail.lineNum, beforeLexCounter - 1);
  });

  document.addEventListener('gloss:afterLex', function(e) {
    afterLexCounter++;
    t.ok(e.detail.tokens instanceof Array, 'gloss:afterLex');
    t.equal(e.detail.lineNum, afterLexCounter - 1);
  });

  document.addEventListener('gloss:beforeAlign', function(e) {
    var expectedLines = [
      ['me', 'you'],
      ['1', '2']
    ];

    // lexer should have been called twice by now
    t.equal(beforeLexCounter, 2, 'lexer was called twice');
    t.equal(afterLexCounter, 2, 'lexer was called twice');

    // alignment tests
    t.deepEqual(e.detail.lines, expectedLines, 'gloss:beforeAlign');
    t.equal(e.detail.firstLineNum, 0, 'firstLineNum');
    t.equal(e.detail.lastLineNum, 1, 'lastLineNum');
  });

  document.addEventListener('gloss:afterAlign', function(e) {
    var expectedLines = [
      ['me', '1'],
      ['you', '2']
    ];

    t.deepEqual(e.detail.lines, expectedLines, 'gloss:afterAlign');
    t.equal(e.detail.firstLineNum, 0, 'firstLineNum');
    t.equal(e.detail.lastLineNum, 1, 'lastLineNum');
  });

  document.addEventListener('gloss:beforeFormat', function(e) {
    var expectedLines = [
      ['me', '1'],
      ['you', '2']
    ];

    t.deepEqual(e.detail.lines, expectedLines, 'gloss:beforeFormat');
    t.equal(e.detail.firstLineNum, 0, 'firstLineNum');
    t.equal(e.detail.lastLineNum, 1, 'lastLineNum');
  });

  document.addEventListener('gloss:afterFormat', function(e) {
    t.ok(e.target.classList.contains('gloss__words'), 'gloss:afterFormat');
    t.equal(e.detail.firstLineNum, 0, 'firstLineNum');
    t.equal(e.detail.lastLineNum, 1, 'lastLineNum');
  });

  document.addEventListener('gloss:complete', function(e) {
    t.ok(e.detail.glosses instanceof NodeList, 'gloss:complete');

    t.end();
  });

  leipzig.gloss();
});
