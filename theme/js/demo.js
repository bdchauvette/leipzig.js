/* global Leipzig, URI */

(function() {
  /**
   * Gets relevant elements
   */
  function getElements() {
    return {
      input: document.getElementById('demo-input'),
      output: document.getElementById('demo-output'),
      share: document.getElementById('demo-share'),

      settings: {
        firstLineOrig: document.getElementById('first-line-orig'),
        lastLineFree: document.getElementById('last-line-free'),
        spacing: document.getElementById('spacing'),
        autoTag: document.getElementById('auto-tag')
      }
    };
  }

  /**
   * Adds <p> tags to input text
   */
  function addTags(text) {
    var lines = text.match(/^.+$/gm);

    if (lines) {
      lines = lines.map(function(line) {
        return '<p>' + line + '</p>';
      });
    }

    return lines;
  }

  /**
   * Populates the abbreviations definitions list
   */
  function addAbbreviations() {
    var dl = document.querySelector('#demo-abbreviations');
    var abbreviations = Leipzig.prototype.DEFAULT_ABBREVIATIONS;
    var innerHTML = [];

    Object.keys(abbreviations).forEach(function(abbr) {
      innerHTML.push(
        '<dt>' + abbr + '</dt>',
        '<dd>' + abbreviations[abbr] + '</dd>'
      );
    });

    dl.innerHTML = innerHTML.join('');
  }

  /**
   * Runs the glosser
   */
  function gloss(text, output, settings) {
    var leipzig = Leipzig(output, settings);
    var lines = addTags(text);

    if (lines) {
      output.innerHTML = lines.join('');
      output.className = 'example';
      leipzig.gloss();
    } else {
      output.innerHTML = '';
    }
  }

  /**
   * Updates the sharing url input
   */
  function makeShareUrl(params) {
    var url = new URI(window.location);
    url.query('');

    Object.keys(params).forEach(function(param) {
      url.addQuery(param, params[param]);
    });

    return url.toString();
  }

  /**
   * Initialize everything
   */
  var glossUpdated = document.createEvent('Event');
  glossUpdated.initEvent('gloss-update', true, true);

  document.addEventListener('DOMContentLoaded', function() {
    var defaultConfig = {
      firstLineOrig: false,
      lastLineFree: true,
      spacing: true,
      autoTag: true
    };

    var defaultText = '' +
      'ein kleines Beispiel\n' +
      'ein klein-es Beispiel\n' +
      'DET.NOM.N.SG small-AGR.NOM.N.SG example\n' +
      '"a small example"';

    var el = getElements();
    var params = URI.parseQuery(window.location.search);

    // populate the definitions list
    addAbbreviations();

    // initial settings
    el.input.value = params.t
      ? params.t
      : defaultText;

    el.input.addEventListener('input', function(e) {
      e.target.dispatchEvent(glossUpdated);
    });

    Object.keys(el.settings).forEach(function(setting) {
      var settingEl = el.settings[setting];

      if (params[setting] === 'true') {
        settingEl.checked = true;
      } else if (params[setting] === 'false') {
        settingEl.checked = false;
      } else {
        settingEl.checked = defaultConfig[setting];
      }

      settingEl.addEventListener('click', function(e) {
        e.target.dispatchEvent(glossUpdated);
      });
    });

    // trigger the first update
    document.dispatchEvent(glossUpdated);
  });

  /**
   * Fired on change in input or settings
   */
  document.addEventListener('gloss-update', function() {
    var el = getElements();
    var settings = {};

    Object.keys(el.settings).forEach(function(setting) {
      var settingEl = el.settings[setting];
      settings[setting] = settingEl.checked;
    });

    // update the share url
    var urlParams = JSON.parse(JSON.stringify(settings));
    urlParams.t = el.input.value;
    var shareUrl = makeShareUrl(urlParams);
    el.share.value = shareUrl;

    // update the output gloss
    gloss(el.input.value, el.output, settings);
  });
}());
