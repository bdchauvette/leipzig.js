(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var leipzig = Leipzig();
    var leipzig2 = Leipzig({
      selector: '[data-gloss-orig-line]',
      firstLineOrig: true
    });

    leipzig.gloss();
    leipzig2.gloss();
  });
}());
