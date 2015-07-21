/*! leipzig.js v0.5.0 | ISC License | github.com/bdchauvette/leipzig.js */
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
   * @param {Object} config - configuration object
   */
  var Leipzig = function Leipzig(elements, config) {
    if (!(this instanceof Leipzig)) {
      return new Leipzig(elements, config);
    }

    var opts = config || {};

    if (typeof elements === 'string' || elements instanceof NodeList || elements instanceof Element) {
      opts.elements = elements;
    } else if (typeof elements === 'object') {
      // if the first argument is an object, let's assume it's actually a
      // configuration object, and not the selector
      opts = elements;
    }

    this.config(opts);
  };

  /**
   * Configures the Leipzig instance
   * @param {Object} config - the options
   */
  Leipzig.prototype.config = function config(opts) {
    this.elements = opts.elements || '[data-gloss]';
    this.spacing = setBool(opts, 'spacing', true);
    this.firstLineOrig = setBool(opts, 'firstLineOrig', false);
    this.lastLineFree = setBool(opts, 'lastLineFree', true);
    this.autoTag = setBool(opts, 'autoTag', true);
    this.async = setBool(opts, 'async', false);

    if (typeof opts.abbreviations === 'object') {
      this.abbreviations = opts.abbreviations;
    }

    if (opts.tokenizers === undefined) {
      this.tokenizers = ['{(.*?)}', '([^\\s]+)'];
    } else if (opts.tokenizers instanceof Array && hasOnlyStrings(opts.tokenizers)) {
      this.tokenizers = opts.tokenizers;
    } else if (opts.tokenizers instanceof RegExp) {
      this.tokenizers = opts.tokenizers;
    } else if (typeof opts.tokenizers === 'string') {
      this.tokenizers = [opts.tokenizers];
    } else {
      throw new Error('Invalid tokenizer');
    }

    // css settings
    if (!opts.hasOwnProperty('class')) {
      opts['class'] = {};
    }

    this['class'] = {
      glossed: opts['class'].glossed || 'gloss--glossed',
      noSpace: opts['class'].noSpace || 'gloss--no-space',
      words: opts['class'].words || 'gloss__words',
      word: opts['class'].word || 'gloss__word',
      line: opts['class'].line || 'gloss__line',
      lineNum: opts['class'].lineNum || 'gloss__line--',
      original: opts['class'].original || 'gloss__line--original',
      freeTranslation: opts['class'].freeTranslation || 'gloss__line--free',
      noAlign: opts['class'].noAlign || 'gloss__line--no-align',
      hidden: opts['class'].hidden || 'gloss__line--hidden',
      abbr: opts['class'].abbr || 'gloss__abbr'
    };
  };

  /**
   * Tokenizes a line of input
   * @param {String} phrase - the phrase to be tokenized
   * @returns {Array} The tokens
   */
  Leipzig.prototype.tokenize = function tokenize(phrase) {
    var tokenizer = undefined;

    if (this.tokenizers instanceof RegExp) {
      tokenizer = this.tokenizers;
    } else if (this.tokenizers instanceof Array) {
      var tokenizers = this.tokenizers.join('|');
      tokenizer = new RegExp(tokenizers, 'g');
    } else {
      throw new Error('Invalid tokenizer');
    }

    var tokens = phrase.match(tokenizer).map(function (token) {
      // remove braces from groups
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
   * Add HTML abbreviation markup to a word
   * @param {String} word - the word to be tagged
   * @returns {String} html-tagged word
   */
  Leipzig.prototype.tag = function tag(word) {
    var _this2 = this;

    var abbreviations = this.abbreviations;

    var tagRules = ['(\\b[0-4])(?=[A-Z]|\\b)', '(N?[A-Z]+\\b)'].join('|');

    var tagger = new RegExp(tagRules, 'g');
    var tags = word.replace(tagger, function (tag) {
      var maybeNegative = tag[0] === 'N' && tag.length > 1;
      var negStem = maybeNegative ? tag.slice(1) : tag;

      var tagged = undefined;
      var definition = undefined;

      if (abbreviations[tag]) {
        definition = abbreviations[tag];
        tagged = '<abbr class="' + _this2['class'].abbr + '" title="' + definition + '">' + tag + '</abbr>';
      } else if (maybeNegative && abbreviations[negStem]) {
        definition = abbreviations[negStem];
        tagged = '<abbr class="' + _this2['class'].abbr + '" title="non-' + definition + '">' + tag + '</abbr>';
      } else {
        tagged = '<abbr class="' + _this2['class'].abbr + '">' + tag + '</abbr>';
      }

      return tagged;
    });

    return tags;
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
  Leipzig.prototype.format = function format(groups, wrapperType, lineNumStart) {
    var _this3 = this;

    var wrapper = document.createElement(wrapperType);
    var innerHtml = [];

    addClass(wrapper, this['class'].words);

    groups.forEach(function (group) {
      innerHtml.push('<div class="' + _this3['class'].word + '">');

      group.forEach(function (line, lineNumOffset) {
        var lineNum = lineNumStart + lineNumOffset;

        // add non-breaking space for empty gloss slots
        line = line ? line : '&nbsp;';

        // auto tag morphemes
        if (lineNumOffset > 0 && _this3.autoTag) {
          line = _this3.tag(line);
        }

        innerHtml.push('<p class="' + _this3['class'].line + ' ' + _this3['class'].lineNum + lineNum + '">' + line + '</p>');
      });

      innerHtml.push('</div>');
    });

    wrapper.innerHTML = innerHtml.join('');

    return wrapper;
  };

  /**
   * Runs the glosser
   */
  Leipzig.prototype.gloss = function gloss(callback) {
    var _this4 = this;

    // select the elements to gloss
    var glossElements = undefined;

    if (typeof this.elements === 'string') {
      glossElements = document.querySelectorAll(this.elements);
    } else if (this.elements instanceof NodeList) {
      glossElements = this.elements;
    } else if (this.elements instanceof Element) {
      glossElements = [this.elements];
    } else {
      throw new Error('Invalid selector');
    }

    /** Processes a gloss element */
    function processGloss(_this, gloss, callback) {
      if (!(gloss instanceof Element)) {
        callback(new Error('Invalid gloss element'));
      }

      var lines = Array.prototype.slice.call(gloss.children);
      var linesToAlign = [];
      var firstRawLine = null;
      var firstRawLineNum = 0;

      if (_this.firstLineOrig) {
        var firstLine = lines[0];
        addClass(firstLine, _this['class'].original);
      }

      if (_this.lastLineFree) {
        var lastLine = lines[lines.length - 1];
        addClass(lastLine, _this['class'].freeTranslation);
      }

      // process each line in the gloss
      lines.forEach(function (line, lineNum) {
        // don't align lines that are free translations or original,
        // unformatted lines
        var isOrig = hasClass(line, _this['class'].original);
        var isFree = hasClass(line, _this['class'].freeTranslation);
        var shouldSkip = hasClass(line, _this['class'].noAlign);

        var shouldAlign = !isOrig && !isFree && !shouldSkip;

        if (shouldAlign) {
          linesToAlign.push(_this.tokenize(line.innerHTML));
          addClass(line, _this['class'].hidden);

          // if _this is the first aligned line, mark the location
          // so that the final aligned glosses can be inserted here
          if (!firstRawLine) {
            firstRawLine = line;
            firstRawLineNum = lineNum;
          }
        } else {
          addClass(line, _this['class'].line);
          addClass(line, _this['class'].lineNum + lineNum);
        }
      });

      var alignedLines = _this.align(linesToAlign);

      // determine which type of element the aligned glosses should be wrapped in
      var alignedWrapper = undefined;
      if (gloss.tagName === 'UL' || gloss.tagName === 'OL') {
        alignedWrapper = 'li';
      } else {
        alignedWrapper = 'div';
      }

      var formattedLines = _this.format(alignedLines, alignedWrapper, firstRawLineNum);
      gloss.insertBefore(formattedLines, firstRawLine);

      // finish up by adding relevant classes to the main container
      if (!_this.spacing) {
        addClass(gloss, _this['class'].noSpace);
      }

      addClass(gloss, _this['class'].glossed);
    }

    // process each gloss
    var glosses = Array.prototype.slice.call(glossElements);
    glosses.forEach(function (gloss) {
      if (_this4.async) {
        window.setTimeout(function () {
          return processGloss(_this4, gloss, callback);
        });
      } else {
        processGloss(_this4, gloss, callback);
      }
    });

    if (typeof callback === 'function') {
      window.setTimeout(function () {
        return callback(null, glossElements);
      });
    }
  };

  /**
   * Abbreviations used by the auto tagger
   */
  Leipzig.prototype.abbreviations = {
    1: 'first person',
    2: 'second person',
    3: 'third person',
    A: 'agent-like argument of canonical transitive verb',
    ABL: 'ablative',
    ABS: 'absolutive',
    ACC: 'accusative',
    ADJ: 'adjective',
    ADV: 'adverb(ial)',
    AGR: 'agreement',
    ALL: 'allative',
    ANTIP: 'antipassive',
    APPL: 'applicative',
    ART: 'article',
    AUX: 'auxiliary',
    BEN: 'benefactive',
    CAUS: 'causative',
    CLF: 'classifier',
    COM: 'comitative',
    COMP: 'complementizer',
    COMPL: 'completive',
    COND: 'conditional',
    COP: 'copula',
    CVB: 'converb',
    DAT: 'dative',
    DECL: 'declarative',
    DEF: 'definite',
    DEM: 'demonstrative',
    DET: 'determiner',
    DIST: 'distal',
    DISTR: 'distributive',
    DU: 'dual',
    DUR: 'durative',
    ERG: 'ergative',
    EXCL: 'exclusive',
    F: 'feminine',
    FOC: 'focus',
    FUT: 'future',
    GEN: 'genitive',
    IMP: 'imperative',
    INCL: 'inclusive',
    IND: 'indicative',
    INDF: 'indefinite',
    INF: 'infinitive',
    INS: 'instrumental',
    INTR: 'intransitive',
    IPFV: 'imperfective',
    IRR: 'irrealis',
    LOC: 'locative',
    M: 'masculine',
    N: 'neuter',
    NEG: 'negation / negative',
    NMLZ: 'nominalizer / nominalization',
    NOM: 'nominative',
    OBJ: 'object',
    OBL: 'oblique',
    P: 'patient-like argument of canonical transitive verb',
    PASS: 'passive',
    PFV: 'perfective',
    PL: 'plural',
    POSS: 'possessive',
    PRED: 'predicative',
    PRF: 'perfect',
    PRS: 'present',
    PROG: 'progressive',
    PROH: 'prohibitive',
    PROX: 'proximal / proximate',
    PST: 'past',
    PTCP: 'participle',
    PURP: 'purposive',
    Q: 'question particle / marker',
    QUOT: 'quotative',
    RECP: 'reciprocal',
    REFL: 'reflexive',
    REL: 'relative',
    RES: 'resultative',
    S: 'single argument of canonical intransitive verb',
    SBJ: 'subject',
    SBJV: 'subjunctive',
    SG: 'singular',
    TOP: 'topic',
    TR: 'transitive',
    VOC: 'vocative'
  };

  module.exports = Leipzig;
});