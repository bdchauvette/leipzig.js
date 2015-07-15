'use strict';

var Leipzig = function(elements, opts) {
  if (!(this instanceof Leipzig)) {
    return new Leipzig(elements, opts);
  }

  var opts = opts || {};

  if (typeof elements === 'string' ||
      elements instanceof NodeList ||
      elements instanceof Element) {
    opts.elements = elements;
  } else if (typeof elements === 'object') {
    opts = elements;
  }

  // elements to run the glosser on
  this.elements = opts.elements || '[data-gloss]';

  // css settings
  if (!opts.hasOwnProperty('class')) {
    opts.class = {};
  }

  this.class = {
    glossed: opts.class.glossed || 'gloss--glossed',
    words: opts.class.words || 'gloss__words',
    word: opts.class.word || 'gloss__word',
    noSpace: opts.class.noSpace || 'gloss__word--no-space',
    line: opts.class.line || 'gloss__line--',
    original: opts.class.original || 'gloss__line--original',
    freeTranslation: opts.class.freeTranslation || 'gloss__line--free',
    skip: opts.class.skip || 'gloss__line--skip'
  };

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
    var glossWordClasses = [_this.class.word];

    glossWordClasses = glossWordClasses.join(' ');

    output.push('<div class="' + glossWordClasses + '">');

    group.forEach(function(line, i) {
      // to preserve appearance, add non-breaking space for empty gloss slots
      line = line ? line : '&nbsp;';

      output.push('<p class="' + _this.class.line + '' + i + '">' + line + '</p>');
    });

    output.push('</div>');
  });

  // create a new element with the html
  el.innerHTML = output.join('');
  el.classList.add(this.class.words);

  return el;
};

/**
 * Runs the glosser
 */
Leipzig.prototype.gloss = function() {
  var glossElements;

  if (typeof this.elements === 'string') {
    glossElements = document.querySelectorAll(this.elements);
  } else if (this.elements instanceof NodeList) {
    glossElements = this.elements;
  } else if (this.elements instanceof Element) {
    glossElements = [this.elements];
  } else {
    throw new Error('Unknown selector');
  }

  // process each gloss
  for (var i = 0; i < glossElements.length; i++) {
    var gloss = glossElements[i];
    var lines = gloss.children;
    var linesToAlign = [];
    var insertBefore = null;

    if (this.firstLineOrig) {
      var firstLine = gloss.firstElementChild;
      firstLine.classList.add(this.class.original);
    }

    if (this.lastLineFree) {
      var lastLine = gloss.lastElementChild;
      lastLine.classList.add(this.class.freeTranslation);
    }

    for (var j = 0; j < lines.length; j++) {
      var line = lines[j];

      // don't align lines that are free translations or original,
      // unformatted lines
      var isOrig = line.classList.contains(this.class.original);
      var isFree = line.classList.contains(this.class.freeTranslation);
      var shouldSkip = line.classList.contains(this.class.skip);
      var shouldAlign = !isOrig && !isFree && !shouldSkip;

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
    gloss.classList.add(this.class.glossed);
    gloss.insertBefore(glossElement, insertBefore);
  }
};
