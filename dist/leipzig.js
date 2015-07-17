(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Leipzig', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Leipzig = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  /**
   * Adds a class to an element
   * @private
   * @param {Element} el - element to add the class to
   * @param {String} className - class name to add
   */
  function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  }

  /**
   * Checks if an element has a given class
   * @private
   * @param {Element} el - element to search for the class
   * @param {String} className - class name to search for
   */
  function hasClass(el, className) {
    var test;

    if (el.classList) {
      test = el.classList.contains(className);
    } else {
      var className = new RegExp('(^| )' + className + '( |$)', 'gi');
      test = new RegExp(className).test(el.className);
    }

    return test;
  }

  /**
   * Helper function for setting boolean attributes in the config object
   * @private
   */
  function setBool(opts, opt, defaultValue) {
    return typeof opts[opt] === 'undefined' ? defaultValue : opts[opt];
  }

  /**
   * Helper function for testing whether an array contains only strings
   * @private
   */
  function hasOnlyStrings(arr) {
    return arr.every(function (e) {
      return typeof e === 'string';
    });
  }

  /**
   * Creates a Leipzig.js glossing object
   * @constructor
   * @param {String|NodeList|Element} elements - elements to be glossed
   * @param {Object} opts - configuration object
   */
  var Leipzig = function Leipzig(elements, opts) {
    if (!(this instanceof Leipzig)) {
      return new Leipzig(elements, opts);
    }

    var opts = opts || {};

    if (typeof elements === 'string' || elements instanceof NodeList || elements instanceof Element) {
      opts.elements = elements;
    } else if (typeof elements === 'object') {
      // if the first argument is an object, let's assume it's actually a
      // configuration object, and not the selector
      opts = elements;
    }

    this.elements = opts.elements || '[data-gloss]';
    this.spacing = setBool(opts, 'spacing', true);
    this.firstLineOrig = setBool(opts, 'firstLineOrig', false);
    this.lastLineFree = setBool(opts, 'lastLineFree', true);

    console.log(opts.tokenizers instanceof String);
    if (opts.tokenizers === undefined) {
      this.tokenizers = ['{(.*?)}', '([^\\s]+)'];
    } else if (opts.tokenizers instanceof Array && hasOnlyStrings(opts.tokenizers)) {
      this.tokenizers = opts.tokenizers;
    } else if (typeof opts.tokenizers === 'string') {
      this.tokenizers = [opts.tokenizers];
    } else {
      throw new Error('Unknown format for tokenizers');
    }

    // css settings
    if (!opts.hasOwnProperty('class')) {
      opts['class'] = {};
    }

    this['class'] = {
      glossed: opts['class'].glossed || 'gloss--glossed',
      words: opts['class'].words || 'gloss__words',
      word: opts['class'].word || 'gloss__word',
      noSpace: opts['class'].noSpace || 'gloss__word--no-space',
      line: opts['class'].line || 'gloss__line--',
      original: opts['class'].original || 'gloss__line--original',
      freeTranslation: opts['class'].freeTranslation || 'gloss__line--free',
      skip: opts['class'].skip || 'gloss__line--skip',
      hidden: opts['class'].hidden || 'gloss__line--hidden'
    };
  };

  /**
   * Tokenizes a line of input
   * @param {String} phrase - the phrase to be tokenized
   * @returns {Array} The tokens
   */
  Leipzig.prototype.tokenize = function tokenize(phrase) {
    var tokenizers = this.tokenizers.join('|');
    var tokenizer = new RegExp(tokenizers, 'g');

    var tokens = phrase.match(tokenizer).map(function (token) {
      var firstChar = token[0];
      var lastChar = token[token.length - 1];

      if (firstChar === '{' && lastChar === '}') {
        var contents = /(?:{)(.*)(?:})/;
        token = contents.exec(token)[1];
      }

      return token;
    });

    return tokens;
  };

  /**
   * Aligns morphemes on different lines
   * @param {Array} lines - Array of strings to be aligned
   * @returns {Array} Array of arrays containing aligned words
   */
  Leipzig.prototype.align = function align(lines) {
    var longestLine = lines.reduce(function (a, b) {
      return a.length > b.length ? a : b;
    }, []);

    return longestLine.map(function (_, i) {
      return lines.map(function (line) {
        return typeof line[i] === 'undefined' ? '' : line[i];
      });
    });
  };

  /**
   * Creates an Element containing the aligned glosses
   * @param {Array} lines - lines to be formatted
   * @returns {Element} html element containing the glosses
   */
  Leipzig.prototype.format = function format(groups, wrapper) {
    var _this = this;
    var innerHtml = [];
    var wrapper = document.createElement(wrapper);
    addClass(wrapper, _this['class'].words);

    groups.forEach(function (group) {
      var glossWordClasses = [_this['class'].word];

      if (!_this.spacing) {
        glossWordClasses.push(_this['class'].noSpace);
      }

      glossWordClasses = glossWordClasses.join(' ');

      innerHtml.push('<div class="' + glossWordClasses + '">');

      group.forEach(function (line, i) {
        // to preserve appearance, add non-breaking space for empty gloss slots
        line = line ? line : '&nbsp;';

        innerHtml.push('<p class="' + _this['class'].line + '' + i + '">' + line + '</p>');
      });

      innerHtml.push('</div>');
    });

    wrapper.innerHTML = innerHtml.join('');

    return wrapper;
  };

  /**
   * Runs the glosser
   */
  Leipzig.prototype.gloss = function gloss() {
    // select the elements to gloss
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
      var firstRawLine;

      if (this.firstLineOrig) {
        var firstLine = gloss.firstElementChild;
        addClass(firstLine, this['class'].original);
      }

      if (this.lastLineFree) {
        var lastLine = gloss.lastElementChild;
        addClass(lastLine, this['class'].freeTranslation);
      }

      // process each line in the gloss
      for (var j = 0; j < lines.length; j++) {
        var line = lines[j];

        // don't align lines that are free translations or original,
        // unformatted lines
        var isOrig = hasClass(line, this['class'].original);
        var isFree = hasClass(line, this['class'].freeTranslation);
        var shouldSkip = hasClass(line, this['class'].skip);

        var shouldAlign = !isOrig && !isFree && !shouldSkip;

        if (shouldAlign) {
          linesToAlign.push(this.tokenize(line.innerHTML));
          addClass(line, this['class'].hidden);

          // if this is the first aligned line, mark the location
          // so that the final aligned glosses can be inserted here
          if (!firstRawLine) {
            firstRawLine = line;
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

      var alignedLines = this.format(alignedLines, alignedWrapper);
      gloss.insertBefore(alignedLines, firstRawLine);
      addClass(gloss, this['class'].glossed);
    }
  };

  module.exports = Leipzig;
});