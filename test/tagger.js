var test = require('tape-catch');
var Leipzig = require('../dist/leipzig');

var leipzig = Leipzig();

test('Should leave out title on unknown tags', function(t) {
  var expected = '<abbr class="gloss__abbr">FOO</abbr>';
  var tagged = leipzig.tag('FOO');

  t.equal(tagged, expected);
  t.end();
});

test('Should tag person & number', function(t) {
  var expected = '<abbr class="gloss__abbr" title="first person">1</abbr><abbr class="gloss__abbr" title="singular">SG</abbr>';
  var tagged = leipzig.tag('1SG');

  t.equal(tagged, expected);
  t.end();
});

test('Should handle negative markers', function(t) {
  var expected = '<abbr class="gloss__abbr" title="non-past">NPST</abbr>';
  var tagged = leipzig.tag('NPST');

  t.equal(tagged, expected);
  t.end();
});
