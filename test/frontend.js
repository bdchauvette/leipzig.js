var test = require('tape');
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

test('basic gloss [sync]', function(t) {
  t.plan(2);

  var leipzig = Leipzig();
  var gloss = makeElement();

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

  var leipzig = Leipzig({ async: true });
  var gloss = makeElement();

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
  });

  body.removeChild(gloss);
});

test('first line is original text [sync]', function(t) {
  t.plan(1);

  var leipzig = Leipzig({ firstLineOrig: true });
  var gloss = makeElement();

  leipzig.gloss();

  t.ok(gloss.firstChild.classList.contains('gloss__line--original'));

  body.removeChild(gloss);
});

test('first line is original text [async]', function(t) {
  t.plan(1);

  var leipzig = Leipzig({ firstLineOrig: true, async: true });
  var gloss = makeElement();

  leipzig.gloss();

  leipzig.gloss(function() {
    t.ok(gloss.firstChild.classList.contains('gloss__line--original'));
  });

  body.removeChild(gloss);
});

test('remove spacing [sync]', function(t) {
  t.plan(1);

  var leipzig = Leipzig({ spacing: false });
  var gloss = makeElement();

  leipzig.gloss();

  t.ok(gloss.classList.contains('gloss--no-space'));

  body.removeChild(gloss);

  t.end();
});

test('remove spacing [async]', function(t) {
  t.plan(1);

  var leipzig = Leipzig({ spacing: false, async: true });
  var gloss = makeElement();

  leipzig.gloss();

  leipzig.gloss(function() {
    t.ok(gloss.classList.contains('gloss--no-space'));
  });

  body.removeChild(gloss);
});

test('events', function(t) {
  var leipzig = Leipzig();
  var gloss = makeElement();

  document.addEventListener('gloss:start', function(e) {
    t.ok(e.detail.glosses instanceof NodeList, 'gloss:start');
  });

  document.addEventListener('gloss:beforeGloss', function(e) {
    t.equal(e.target, gloss, 'gloss:beforeGloss');
  });

  document.addEventListener('gloss:afterGloss', function(e) {
    t.equal(e.target, gloss, 'gloss:afterGloss');
  });

  // should be called twice
  document.addEventListener('gloss:beforeLex', function(e) {
    t.equal(e.target.tagName, 'P', 'gloss:beforeLex');
  });

  // should be called twice
  document.addEventListener('gloss:afterLex', function(e) {
    t.ok(e.detail.tokens instanceof Array, 'gloss:afterLex');
  });

  document.addEventListener('gloss:beforeAlign', function(e) {
    var expectedLines = [
      ['me', 'you'],
      ['1', '2']
    ];

    t.deepEqual(e.detail.lines, expectedLines, 'gloss:beforeAlign');
  });

  document.addEventListener('gloss:afterAlign', function(e) {
    var expectedLines = [
      ['me', '1'],
      ['you', '2']
    ];

    t.deepEqual(e.detail.lines, expectedLines, 'gloss:afterAlign');
  });

  document.addEventListener('gloss:beforeFormat', function(e) {
    var expectedLines = [
      ['me', '1'],
      ['you', '2']
    ];

    t.deepEqual(e.detail.lines, expectedLines, 'gloss:beforeFormat');
  });

  document.addEventListener('gloss:afterFormat', function(e) {
    t.ok(e.target.classList.contains('gloss__words'), 'gloss:afterFormat');
  });

  document.addEventListener('gloss:complete', function(e) {
    t.ok(e.detail.glosses instanceof NodeList, 'gloss:complete');

    t.end();
  });

  leipzig.gloss();
});
