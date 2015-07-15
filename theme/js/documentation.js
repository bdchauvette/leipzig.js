/* global Leipzig */

(function() {
  var glossers = [
    Leipzig(),
    Leipzig('#gloss--first-line'),
    Leipzig('#gloss--orig-line', { firstLineOrig: true, lastLineFree: false }),
    Leipzig('#gloss--spacing', { firstLineOrig: true, spacing: false }),
    Leipzig('#gloss--style', { firstLineOrig: true, lastLineFree: false, spacing: false }),
    Leipzig('#gloss--grouping', { lastLineFree: false }),
  ];

  document.addEventListener('DOMContentLoaded', function() {
    glossers.forEach(function(glosser) {
      glosser.gloss();
    });
  });
}());
