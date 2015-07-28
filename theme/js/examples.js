/* global Leipzig */

(function() {
  var glossers = [
    Leipzig({ firstLineOrig: true }),
    Leipzig('#nyanja'),
    Leipzig('#spanish', { lastLineFree: false }),
    Leipzig('#nahuatl', { firstLineOrig: true, spacing: false }),
    Leipzig('#ainu', { firstLineOrig: true, spacing: false }),
    Leipzig('#japanese', { firstLineOrig: true, lastLineFree: false}),
    Leipzig('#klingon', { firstLineOrig: true })
  ];

  document.addEventListener('DOMContentLoaded', function() {
    glossers.forEach(function(glosser) {
      glosser.gloss();
    });
  });
}());
