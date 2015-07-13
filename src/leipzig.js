'use strict';

var Leipzig = function(opts) {
  if (!(this instanceof Leipzig)) {
    return new Leipzig(opts);
  }

  var opts = opts || {};

  // css settings
  this.selector = opts.selector || '[data-gloss]';
  this.classOrig = opts.classOrig || 'gloss__orig';
  this.classFree = opts.classFree || 'gloss__free';
  this.classLine = opts.classLine || 'gloss__line--';
  this.classAligned = opts.classAligned || 'gloss__aligned';

  // automatically mark the first line as 'original'
  this.firstLineOrig = (typeof opts.firstLineOrig !== 'undefined')
    ? opts.firstLineOrig
    : false;

  // automatically mark the last line as 'free translation'
  this.lastLineFree = (typeof opts.lastLineFree !== 'undefined')
    ? opts.lastLineFree
    : true;
};

/**
 * Tokenizes a line of input
 * @param {String} phrase - the phrase to be tokenized
 * @returns {Array} The tokens
 */
Leipzig.prototype.tokenize = function tokenize(phrase) {
  var tokenizer = /({.*?})|([^\s]+)/g;
  var tokens = phrase.match(tokenizer).map(function(token) {

    // remove curly braces from groups
    var firstChar = token[0];
    var lastChar = token[token.length - 1];

    if (firstChar === '{' && lastChar === '}') {
      token = token.slice(1, token.length - 1);
    }

    return token;
  });

  return tokens;
};

/**
 * Aligns morphemes on different lines
 * @returns {Array} Array of arrays containing aligned words
 */
Leipzig.prototype.align = function align(lines) {
  var longestLine = lines.reduce(function(a, b) {
    return (a.length > b.length)
      ? a
      : b;
  }, []);

  return longestLine.map(function(_, i) {
    return lines.map(function(line) {
      return (typeof line[i] === 'undefined')
        ? ''
        : line[i];
    });
  });
};

/**
 * Outputs HTML containing formatted glosses
 *
 * @param {Array} lines - lines to be formatted
 * @returns {DOMElement} html element containing the glosses
 */
Leipzig.prototype.format = function(groups, wrapper) {
  var _this = this;
  var el = document.createElement(wrapper);
  var output = [];

  groups.forEach(function(group) {
    output.push('<div class="' + _this.classAligned + '">');

    group.forEach(function(line, i) {
      // to preserve appearance, add non-breaking space for empty gloss slots
      line = line ? line : '&nbsp;';

      output.push('<p class="' + _this.classLine + '' + i + '">' + line + '</p>');
    });

    output.push('</div>');
  });

  // create a new element with the html
  el.innerHTML = output.join('');

  return el;
};

/**
 * Runs the glosser
 */
Leipzig.prototype.gloss = function() {
  var glossElements = document.querySelectorAll(this.selector);

  // process each gloss
  for (var i = 0; i < glossElements.length; i++) {
    var gloss = glossElements[i];
    var lines = gloss.children;
    var linesToAlign = [];
    var insertBefore = null;

    if (this.firstLineOrig) {
      var firstLine = gloss.firstElementChild;
      firstLine.classList.add(this.classOrig);
    }

    if (this.lastLineFree) {
      var lastLine = gloss.lastElementChild;
      lastLine.classList.add(this.classFree);
    }

    for (var j = 0; j < lines.length; j++) {
      var line = lines[j];

      // don't align lines that are free translations or original,
      // unformatted lines
      var isOrig = line.classList.contains(this.classOrig);
      var isFree = line.classList.contains(this.classFree);
      var shouldAlign = !isOrig && !isFree;

      if (shouldAlign) {
        linesToAlign.push(this.tokenize(line.innerHTML));
        line.style.display = 'none';

        if (!insertBefore) {
          insertBefore = line;
        }
      }
    }

    var alignedLines = this.align(linesToAlign);

    // determine which type of element the aligned glosses should be wrapped in
    var alignedWrapper;
    if (gloss.tagName === 'UL' || gloss.tagName === 'OL') {
      alignedWrapper = 'li';
    } else {
      alignedWrapper = 'div';
    }

    var glossElement = this.format(alignedLines, alignedWrapper);
    gloss.insertBefore(glossElement, insertBefore);
  }
};
