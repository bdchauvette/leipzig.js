var test = require('tape-catch');
var Leipzig = require('../dist/leipzig');

var body = document.querySelector('body');

function makeElement() {
  var html = [].slice.call(arguments).join('');
  body.insertAdjacentHTML('beforeend', html);
}

test('basic gloss', function(t) {
  var leipzig = Leipzig();
  var basicGloss = makeElement(
    '<div id="gloss--basic" data-gloss>',
    '<p>One</p>',
    '<p>Two</p>',
    '<p>Free Translation</p>',
    '</div>'
  );

  leipzig.gloss();

  var gloss = document.querySelector('#gloss--basic');
  var words = gloss.querySelectorAll('.gloss__word');
  var lineOne = gloss.querySelector('.gloss__line--0');
  var lineTwo = gloss.querySelector('.gloss__line--1');
  var lineFree = gloss.querySelector('.gloss__line--free');

  t.ok(gloss, 'element exists');
  t.ok(gloss.classList.contains('gloss--glossed'), 'has glossed class');
  t.equals(words.length, 1, 'splits words correctly');
  t.equals(lineFree.innerHTML, 'Free Translation', 'free translation line is correct');

  // TODO: better tests for content of aligned lines
  t.equals(lineOne.innerHTML, 'One', 'line one inner text is set correctly');
  t.equals(lineTwo.innerHTML, 'Two', 'line two inner text is set correctly');

  t.end();
});
