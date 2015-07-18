var test = require('tape-catch');
var Leipzig = require('../dist/leipzig');

var body = document.querySelector('body');

function makeElement() {
  var html = [].slice.call(arguments).join('');
  body.insertAdjacentHTML('beforeend', html);
  return document.querySelector('[data-gloss]');
}

function testHtml(t, leipzig, gloss, html) {
  leipzig.gloss();
  t.equals(gloss.outerHTML, html, 'html is as expected');
  body.removeChild(gloss);
  t.end();
}

test('basic gloss', function(t) {
  var leipzig = Leipzig();
  var expectedHtml = '' +
    '<div data-gloss="" class="gloss--glossed">' +
      '<div class="gloss__words">' +
        '<div class="gloss__word">' +
          '<p class="gloss__line gloss__line--0">one</p>' +
          '<p class="gloss__line gloss__line--1">foo</p>' +
        '</div>' +
        '<div class="gloss__word">' +
          '<p class="gloss__line gloss__line--0">two</p>' +
          '<p class="gloss__line gloss__line--1">bar</p>' +
        '</div>' +
      '</div>' +
      '<p class="gloss__line--hidden">one two</p>' +
      '<p class="gloss__line--hidden">foo bar</p>' +
      '<p class="gloss__line--free gloss__line gloss__line--2">free translation</p>' +
    '</div>';
  var gloss = makeElement(
    '<div data-gloss>',
    '<p>one two</p>',
    '<p>foo bar</p>',
    '<p>free translation</p>',
    '</div>'
  );

  testHtml(t, leipzig, gloss, expectedHtml);
});

test('first line is original text', function(t) {
  var leipzig = Leipzig({ firstLineOrig: true });

  var gloss = makeElement(
    '<div data-gloss>',
    '<p>original line</p>',
    '<p>one two</p>',
    '<p>foo bar</p>',
    '<p>free translation</p>',
    '</div>'
  );

  leipzig.gloss();

  t.ok(gloss.firstChild.classList.contains('gloss__line--original'));

  body.removeChild(gloss);

  t.end();
});

test('remove spacing', function(t) {
  var leipzig = Leipzig({ spacing: false });

  var gloss = makeElement(
    '<div data-gloss>',
    '<p>one two</p>',
    '<p>foo bar</p>',
    '<p>free translation</p>',
    '</div>'
  );

  leipzig.gloss();

  t.ok(gloss.classList.contains('gloss--no-space'));

  body.removeChild(gloss);

  t.end();
});

