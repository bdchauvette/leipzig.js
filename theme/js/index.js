/* global Leipzig */
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var glossers = [
      Leipzig(),
      Leipzig('#gloss-wittgenstein', { firstLineOrig: true })
    ];

    glossers.forEach(function(glosser) {
      glosser.gloss();
    });
  });
}());
