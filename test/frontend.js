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
  t.plan(1);

  var leipzig = Leipzig();
  var gloss = makeElement();

  var expectedHtml = '' +
    '<div data-gloss="" class="gloss--glossed">' +
      '<div class="gloss__words">' +
        '<div class="gloss__word">' +
          '<p class="gloss__line gloss__line--0">me</p>' +
          '<p class="gloss__line gloss__line--1">' +
            '<abbr class="gloss__abbr" title="first person">1</abbr>' +
          '</p>' +
        '</div>' +
        '<div class="gloss__word">' +
          '<p class="gloss__line gloss__line--0">you</p>' +
          '<p class="gloss__line gloss__line--1">' +
            '<abbr class="gloss__abbr" title="second person">2</abbr>' +
          '</p>' +
        '</div>' +
      '</div>' +
      '<p class="gloss__line--hidden">me you</p>' +
      '<p class="gloss__line--hidden">1 2</p>' +
      '<p class="gloss__line--free gloss__line gloss__line--2">free translation</p>' +
    '</div>';

  leipzig.gloss();
  t.equals(gloss.outerHTML, expectedHtml, 'html is as expected');
  body.removeChild(gloss);
});

test('basic gloss [async]', function(t) {
  t.plan(1);

  var leipzig = Leipzig({ async: true });
  var gloss = makeElement();

  var expectedHtml = '' +
    '<div data-gloss="" class="gloss--glossed">' +
      '<div class="gloss__words">' +
        '<div class="gloss__word">' +
          '<p class="gloss__line gloss__line--0">me</p>' +
          '<p class="gloss__line gloss__line--1">' +
            '<abbr class="gloss__abbr" title="first person">1</abbr>' +
          '</p>' +
        '</div>' +
        '<div class="gloss__word">' +
          '<p class="gloss__line gloss__line--0">you</p>' +
          '<p class="gloss__line gloss__line--1">' +
            '<abbr class="gloss__abbr" title="second person">2</abbr>' +
          '</p>' +
        '</div>' +
      '</div>' +
      '<p class="gloss__line--hidden">me you</p>' +
      '<p class="gloss__line--hidden">1 2</p>' +
      '<p class="gloss__line--free gloss__line gloss__line--2">free translation</p>' +
    '</div>';

  leipzig.gloss(function() {
    t.equals(gloss.outerHTML, expectedHtml, 'html is as expected');
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
