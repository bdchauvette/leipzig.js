/*! leipzig.js v0.8.0 | ISC License | github.com/bdchauvette/leipzig.js */
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

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  /**
  Adds a class to an element
  @private
  @param {Element} el - element to add the class to
  @param {String} className - class name to add
  */
  function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  }

  /**
  Checks if an element has a given class
  @private
  @param {Element} el - element to search for the class
  @param {String} className - class name to search for
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
  Helper function for creating custom events
  @private
  */
  function LeipzigEvent(name, data) {
    var leipzigEvent = undefined;

    if (window.CustomEvent) {
      leipzigEvent = new CustomEvent(name, {
        detail: data,
        bubbles: true,
        cancelable: true
      });
    } else {
      // For Internet Explorer & PhantomJS
      leipzigEvent = document.createEvent('CustomEvent');
      leipzigEvent.initCustomEvent(name, true, true, data);
    }

    return leipzigEvent;
  }

  /**
  Helper function for triggering custom events
  @private
  */
  function triggerEvent(el, name, data) {
    var e = new LeipzigEvent(name, data);
    el.dispatchEvent(e);
  }

  /**
  Helper function for cloning an object
  @private
  */
  function clone(obj) {
    return _extends({}, obj);
  }

  /**
  Default abbreviations used by the auto tagger
  @private
  */
  var abbreviations = {
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

  /**
  Creates a Leipzig.js glossing object
  @constructor
  @param {String|NodeList|Element} selector - determines elements to be glossed
  @param {Object} config - configuration object
  */
  var Leipzig = function Leipzig(selector) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!(this instanceof Leipzig)) {
      return new Leipzig(selector, config);
    }

    if (typeof selector !== 'undefined') {
      if (typeof selector === 'string' || selector instanceof NodeList || selector instanceof Element) {
        config.selector = selector;
      } else if (typeof selector === 'object') {
        // if the first argument is an object, let's assume it's actually a
        // configuration object, and not the selector
        config = selector;
      } else {
        throw new Error('Invalid selector');
      }
    }

    this.config(config);
  };

  /**
  Configures the Leipzig instance
  @param {Object} options - the options
  */
  Leipzig.prototype.config = function (options) {
    var config = {
      selector: '[data-gloss]',
      lastLineFree: true,
      firstLineOrig: false,
      spacing: true,
      autoTag: true,
      async: false,
      lexer: /{(.*?)}|([^\s]+)/g,
      events: {
        beforeGloss: 'gloss:beforeGloss',
        afterGloss: 'gloss:afterGloss',
        beforeLex: 'gloss:beforeLex',
        afterLex: 'gloss:afterLex',
        beforeAlign: 'gloss:beforeAlign',
        afterAlign: 'gloss:afterAlign',
        beforeFormat: 'gloss:beforeFormat',
        afterFormat: 'gloss:afterFormat',
        start: 'gloss:start',
        complete: 'gloss:complete'
      },
      classes: {
        glossed: 'gloss--glossed',
        noSpace: 'gloss--no-space',
        words: 'gloss__words',
        word: 'gloss__word',
        spacer: 'gloss__word--spacer',
        abbr: 'gloss__abbr',
        line: 'gloss__line',
        lineNum: 'gloss__line--',
        original: 'gloss__line--original',
        freeTranslation: 'gloss__line--free',
        noAlign: 'gloss__line--no-align',
        hidden: 'gloss__line--hidden'
      },
      abbreviations: abbreviations
    };

    _extends(config, options);

    // selector should be a string, NodeList or an array of Elements.
    // We'll actually select the elements later, to avoid possible differences
    // in the DOM between construction and glossing
    if (typeof config.selector !== 'string' && !(config.selector instanceof NodeList) && !(config.selector instanceof Element)) {
      throw new Error('Invalid selector');
    }

    // construct the lexer RegExp now, so that we don't have to create it each
    // time the lexer runs
    if (!(config.lexer instanceof RegExp)) {
      if (typeof config.lexer === 'string') {
        config.lexer = new RegExp(config.lexer, 'g');
      } else if (config.lexer instanceof Array) {
        var lexer = config.lexer.join('|');
        config.lexer = new RegExp(lexer, 'g');
      } else {
        throw new Error('Invalid lexer');
      }
    }

    _extends(this, config);
  };

  /**
  Adds abbreviations
  @param {Object} abbreviations - the abbreviations to add
  */
  Leipzig.prototype.addAbbreviations = function (abbreviations) {
    if (typeof abbreviations === 'object') {
      _extends(this.abbreviations, abbreviations);
    } else {
      throw new Error('Invalid abbreviations');
    }
  };

  /**
  Sets abbreviations, overriding existing ones
  @param {Object} abbreviations - the abbreviation definitions
  */
  Leipzig.prototype.setAbbreviations = function (abbreviations) {
    if (typeof abbreviations === 'object') {
      this.abbreviations = abbreviations;
    } else {
      throw new Error('Invalid abbreviations');
    }
  };

  /**
  Extracts word tokens from a gloss line
  @private
  @param {Element} line - the phrase to be lexed
  @returns {Array} The tokens
  */
  Leipzig.prototype.lex = function lex(line) {
    var lexer = this.lexer;

    var tokens = line.match(lexer).map(function (token) {
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
  Add HTML abbreviation markup to a word
  @private
  @param {String} word - the word to be tagged
  @returns {String} html-tagged word
  */
  Leipzig.prototype.tag = function tag(word) {
    var classes = this.classes;
    var abbreviations = this.abbreviations;

    // (\b[0-4])(?=[A-Z]|\b) : Person & Number
    // (N?[A-Z]+\b)          : Morphemes
    var tagger = /(\b[0-4])(?=[A-Z]|\b)|(N?[A-Z]+\b)/g;
    var tags = word.replace(tagger, function (tag) {
      var maybeNegative = tag[0] === 'N' && tag.length > 1;
      var negStem = maybeNegative ? tag.slice(1) : tag;

      var tagged = undefined;
      var definition = undefined;

      if (abbreviations[tag]) {
        definition = abbreviations[tag];
        tagged = '<abbr class="' + classes.abbr + '" title="' + definition + '">' + tag + '</abbr>';
      } else if (maybeNegative && abbreviations[negStem]) {
        definition = abbreviations[negStem];
        tagged = '<abbr class="' + classes.abbr + '" title="non-' + definition + '">' + tag + '</abbr>';
      } else {
        tagged = '<abbr class="' + classes.abbr + '">' + tag + '</abbr>';
      }

      return tagged;
    });

    return tags;
  };

  /**
  Aligns morphemes on different lines
  @private
  @param {Array} lines - Array of strings to be aligned
  @returns {Array} Array of arrays containing aligned words
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
  Creates an Element containing the aligned glosses
  @private
  @param {Array<Array<String>>} lines - lines to be formatted
  @returns {Element} html element containing the glosses
  */
  Leipzig.prototype.format = function format(groups, wrapperType, lineNumStart) {
    var _this = this;

    var tag = this.tag;

    var spacing = this.spacing;
    var autoTag = this.autoTag;
    var classes = this.classes;
    var wrapper = document.createElement(wrapperType);
    var innerHtml = [];

    addClass(wrapper, classes.words);

    groups.forEach(function (group) {
      var groupLines = [];
      var isEmpty = true;

      group.forEach(function (line, lineNumOffset) {
        var lineNum = lineNumStart + lineNumOffset;
        var lineClasses = [classes.line, classes.lineNum + lineNum];

        if (line.length) {
          isEmpty = false;
        }

        if (lineNumOffset > 0 && autoTag) {
          line = _this.tag(line);
        }

        groupLines.push('<p class="' + lineClasses.join(' ') + '">' + line + '</p>');
      });

      var wordClasses = classes.word;
      if (isEmpty && !spacing) {
        wordClasses += ' ' + classes.spacer;
      }

      innerHtml.push('<div class="' + wordClasses + '">', groupLines.join(''), '</div>');
    });

    wrapper.innerHTML = innerHtml.join('');

    return wrapper;
  };

  /**
  Runs the glosser
  */
  Leipzig.prototype.gloss = function gloss(callback) {
    var _this2 = this;

    var selector = this.selector;
    var classes = this.classes;
    var events = this.events;
    var firstLineOrig = this.firstLineOrig;
    var lastLineFree = this.lastLineFree;
    var spacing = this.spacing;
    var async = this.async;

    /** Processes an individual gloss element */
    var processGloss = function processGloss(gloss, callback) {
      if (!(gloss instanceof Element)) {
        var err = new Error('Invalid gloss element');

        if (typeof callback === 'function') {
          callback(err);
        } else {
          throw err;
        }
      }

      var lines = Array.prototype.slice.call(gloss.children);
      var linesToAlign = [];
      var firstRawLine = null;
      var firstRawLineNum = 0;

      triggerEvent(gloss, events.beforeGloss);

      if (firstLineOrig) {
        var firstLine = lines[0];
        addClass(firstLine, classes.original);
      }

      if (lastLineFree) {
        var lastLine = lines[lines.length - 1];
        addClass(lastLine, classes.freeTranslation);
      }

      // process each line in the gloss
      lines.forEach(function (line, lineNum) {
        // don't align lines that are free translations or original,
        // unformatted lines
        var isOrig = hasClass(line, classes.original);
        var isFree = hasClass(line, classes.freeTranslation);
        var shouldSkip = hasClass(line, classes.noAlign);

        var shouldAlign = !isOrig && !isFree && !shouldSkip;

        if (shouldAlign) {
          triggerEvent(line, events.beforeLex, { lineNum: lineNum });
          var tokens = _this2.lex(line.innerHTML);
          triggerEvent(line, events.afterLex, {
            tokens: tokens,
            lineNum: lineNum
          });

          linesToAlign.push(tokens);
          addClass(line, classes.hidden);

          // if this is the first aligned line, mark the location
          // so that the final aligned glosses can be inserted here
          if (!firstRawLine) {
            firstRawLine = line;
            firstRawLineNum = lineNum;
          }
        } else {
          addClass(line, classes.line);
          addClass(line, classes.lineNum + lineNum);
        }
      });

      var lastRawLineNum = firstRawLineNum + (linesToAlign.length - 1);

      triggerEvent(gloss, events.beforeAlign, {
        lines: linesToAlign,
        firstLineNum: firstRawLineNum,
        lastLineNum: lastRawLineNum
      });

      var alignedLines = _this2.align(linesToAlign);

      triggerEvent(gloss, events.afterAlign, {
        lines: alignedLines,
        firstLineNum: firstRawLineNum,
        lastLineNum: lastRawLineNum
      });

      // determine which type of element the aligned glosses should be wrapped in
      var alignedWrapper = undefined;
      if (gloss.tagName === 'UL' || gloss.tagName === 'OL') {
        alignedWrapper = 'li';
      } else {
        alignedWrapper = 'div';
      }

      triggerEvent(gloss, events.beforeFormat, {
        lines: alignedLines,
        firstLineNum: firstRawLineNum,
        lastLineNum: lastRawLineNum
      });

      var formattedLines = _this2.format(alignedLines, alignedWrapper, firstRawLineNum);
      gloss.insertBefore(formattedLines, firstRawLine);

      triggerEvent(formattedLines, events.afterFormat, {
        firstLineNum: firstRawLineNum,
        lastLineNum: lastRawLineNum
      });

      // finish up by adding relevant classes to the main container
      if (!spacing) {
        addClass(gloss, classes.noSpace);
      }

      addClass(gloss, classes.glossed);

      triggerEvent(gloss, events.afterGloss);
    };

    var glossElements = undefined;
    if (selector instanceof NodeList) {
      glossElements = selector;
    } else if (typeof selector === 'string') {
      glossElements = document.querySelectorAll(selector);
    } else if (selector instanceof Element) {
      // create an array so we can loop later on
      glossElements = [selector];
    } else {
      var err = new Error('Invalid selector');

      if (typeof callback === 'function') {
        callback(err);
      } else {
        throw err;
      }
    }

    triggerEvent(document, events.start, { glosses: glossElements });

    // process each gloss
    var glosses = Array.prototype.slice.call(glossElements);

    var _loop = function (i) {
      var gloss = glosses[i];

      if (async) {
        window.setTimeout(function () {
          return processGloss(gloss, callback);
        });
      } else {
        processGloss(gloss, callback);
      }
    };

    for (var i = 0; i < glosses.length; i++) {
      _loop(i);
    }

    window.setTimeout(function () {
      if (typeof callback === 'function') {
        callback(null, glossElements);
      }

      triggerEvent(document, events.complete, { glosses: glossElements });
    });
  };

  module.exports = Leipzig;
});