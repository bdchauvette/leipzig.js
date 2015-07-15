/* global Leipzig, rivets */

(function() {

  function addTags(text) {
    var lines = text.match(/^.+$/gm);

    if (lines) {
      lines = lines.map(function(line) {
        return '<p>' + line + '</p>';
      });
    }

    return lines;
  }

  function gloss(text, output, settings) {
    var leipzig = Leipzig('#demo-output', settings);
    var lines = addTags(text);

    if (lines) {
      output.innerHTML = lines.join('');
      leipzig.gloss();
    } else {
      output.innerHTML = '<p class="placeholder">Enter text in the box below, and the glossed output will appear here.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    function updateGloss() {
      gloss(input.value, output, settings);
    }

    var input = document.getElementById('demo-input');
    var output = document.getElementById('demo-output');
    var firstLineOrig = document.getElementById('first-line-original');
    var lastLineFree = document.getElementById('last-line-free');
    var spacing = document.getElementById('spacing');

    var settings = {
      lastLineFree: lastLineFree.checked,
      firstLineOrig: firstLineOrig.checked,
      spacing: spacing.checked
    };

    // initial values
    var defaultText = '' +
      'ein kleines Beispiel\n' +
      'ein klein-es Beispiel\n' +
      'DET.NOM.N.SG small-AGR.NOM.N.SG example\n' +
      '"a small example"';

    input.value = input.value || defaultText;
    updateGloss();

    // event handlers
    input.addEventListener('input', updateGloss);

    firstLineOrig.addEventListener('click', function(e) {
      settings.firstLineOrig = e.target.checked;
      updateGloss();
    });

    lastLineFree.addEventListener('click', function(e) {
      settings.lastLineFree = e.target.checked;
      updateGloss();
    });

    spacing.addEventListener('click', function(e) {
      settings.spacing = e.target.checked;
      updateGloss();
    });
  });
}());
