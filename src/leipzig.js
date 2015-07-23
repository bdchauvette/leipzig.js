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
  return (typeof opts[opt] === 'undefined')
    ? defaultValue
    : opts[opt];
}

/**
 * Helper function for creating custom events
 * @private
 */
function LeipzigEvent(name, data) {
  let leipzigEvent;

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
 * Helper function for triggering custom events
 * @private
 */
function triggerEvent(el, name, data) {
  const e = new LeipzigEvent(name, data);
  el.dispatchEvent(e);
}

/**
 * Helper function for testing whether an array contains only strings
 * @private
 */
function hasOnlyStrings(arr) {
  return arr.every(e => typeof e === 'string');
}

/**
 * Creates a Leipzig.js glossing object
 * @constructor
 * @param {String|NodeList|Element} selector - determines elements to be glossed
 * @param {Object} config - configuration object
 */
var Leipzig = function(selector, config) {
  if (!(this instanceof Leipzig)) {
    return new Leipzig(selector, config);
  }

  let opts = config || {};

  if (typeof selector === 'string' ||
      selector instanceof NodeList ||
      selector instanceof Element) {
    opts.selector = selector;
  } else if (typeof selector === 'object') {
    // if the first argument is an object, let's assume it's actually a
    // configuration object, and not the selector
    opts = selector;
  }

  this.config(opts);
};

/**
 * Configures the Leipzig instance
 * @param {Object} config - the options
 */
Leipzig.prototype.config = function config(opts) {
  this.selector = opts.selector || '[data-gloss]';
  this.spacing = setBool(opts, 'spacing', true);
  this.firstLineOrig = setBool(opts, 'firstLineOrig', false);
  this.lastLineFree = setBool(opts, 'lastLineFree', true);
  this.autoTag = setBool(opts, 'autoTag', true);
  this.async = setBool(opts, 'async', false);

  // lexer options
  if (opts.lexers === undefined) {
    this.lexers = [
      '{(.*?)}',
      '([^\\s]+)'
    ];
  } else if (opts.lexers instanceof Array && hasOnlyStrings(opts.lexers)) {
    this.lexers = opts.lexers;
  } else if (opts.lexers instanceof RegExp) {
    this.lexers = opts.lexers;
  } else if (typeof opts.lexers === 'string') {
    this.lexers = [opts.lexers];
  } else {
    throw new Error('Invalid lexer');
  }

  if (typeof opts.abbreviations === 'object') {
    this.abbreviations = opts.abbreviations;
  }

  // event names
  if (!opts.hasOwnProperty('events')) {
    opts.events = {};
  }

  this.events = {
    beforeGloss: opts.events.beforeGloss || 'gloss:beforeGloss',
    afterGloss: opts.events.afterGloss || 'gloss:afterGloss',
    beforeLex: opts.events.beforeLex || 'gloss:beforeLex',
    afterLex: opts.events.afterLex || 'gloss:afterLex',
    beforeAlign: opts.events.beforeAlign || 'gloss:beforeAlign',
    afterAlign: opts.events.afterAlign || 'gloss:afterAlign',
    beforeFormat: opts.events.beforeFormat || 'gloss:beforeFormat',
    afterFormat: opts.events.afterFormat || 'gloss:afterFormat',
    start: opts.events.start || 'gloss:start',
    complete: opts.events.complete || 'gloss:complete'
  };

  // css settings
  if (!opts.hasOwnProperty('classes')) {
    opts.classes = {};
  }

  this.classes = {
    glossed: opts.classes.glossed || 'gloss--glossed',
    noSpace: opts.classes.noSpace || 'gloss--no-space',
    words: opts.classes.words || 'gloss__words',
    word: opts.classes.word || 'gloss__word',
    line: opts.classes.line || 'gloss__line',
    lineNum: opts.classes.lineNum || 'gloss__line--',
    original: opts.classes.original || 'gloss__line--original',
    freeTranslation: opts.classes.freeTranslation || 'gloss__line--free',
    noAlign: opts.classes.noAlign || 'gloss__line--no-align',
    hidden: opts.classes.hidden || 'gloss__line--hidden',
    abbr: opts.classes.abbr || 'gloss__abbr'
  };
};

/**
 * Extracts word tokens from a gloss line
 * @param {Element} line - the phrase to be lexed
 * @returns {Array} The tokens
 */
Leipzig.prototype.lex = function lex(line) {
  let lexer;

  if (this.lexers instanceof RegExp) {
    lexer = this.lexers;
  } else if (this.lexers instanceof Array) {
    const lexers = this.lexers.join('|');
    lexer = new RegExp(lexers, 'g');
  } else {
    throw new Error('Invalid lexer');
  }

  const tokens = line
    .match(lexer)
    .map(token => {
      // remove braces from groups
      const firstChar = token[0];
      const lastChar = token[token.length - 1];

      if (firstChar === '{' && lastChar === '}') {
        const contents = /(?:{)(.*)(?:})/;
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
  const abbreviations = this.abbreviations;

  const tagRules = [
    '(\\b[0-4])(?=[A-Z]|\\b)',
    '(N?[A-Z]+\\b)'
  ].join('|');

  const tagger = new RegExp(tagRules, 'g');
  const tags = word.replace(tagger, tag => {
    const maybeNegative = (tag[0] === 'N' && tag.length > 1);
    const negStem = (maybeNegative)
      ? tag.slice(1)
      : tag;

    let tagged;
    let definition;

    if (abbreviations[tag]) {
      definition = abbreviations[tag];
      tagged = `<abbr class="${this.classes.abbr}" title="${definition}">${tag}</abbr>`;
    } else if (maybeNegative && abbreviations[negStem]) {
      definition = abbreviations[negStem];
      tagged = `<abbr class="${this.classes.abbr}" title="non-${definition}">${tag}</abbr>`;
    } else {
      tagged = `<abbr class="${this.classes.abbr}">${tag}</abbr>`;
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
  let longestLine = lines.reduce((a, b) => {
    return (a.length > b.length)
      ? a
      : b;
  }, []);

  return longestLine.map((_, i) => {
    return lines.map(line => {
      return (typeof line[i] === 'undefined')
        ? ''
        : line[i];
    });
  });
};

/**
 * Creates an Element containing the aligned glosses
 * @param {Array<Array<String>>} lines - lines to be formatted
 * @returns {Element} html element containing the glosses
 */
Leipzig.prototype.format = function format(groups, wrapperType, lineNumStart) {
  let wrapper = document.createElement(wrapperType);
  let innerHtml = [];

  addClass(wrapper, this.classes.words);

  groups.forEach(group => {
    innerHtml.push(`<div class="${this.classes.word}">`);

    group.forEach((line, lineNumOffset) => {
      let lineNum = lineNumStart + lineNumOffset;

      // add non-breaking space for empty gloss slots
      line = line ? line : '&nbsp;';

      // auto tag morphemes
      if (lineNumOffset > 0 && this.autoTag) {
        line = this.tag(line);
      }

      innerHtml.push(`<p class="${this.classes.line} ${this.classes.lineNum}${lineNum}">${line}</p>`);
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
  // select the elements to gloss
  let glossElements;

  if (typeof this.selector === 'string') {
    glossElements = document.querySelectorAll(this.selector);
  } else if (this.selector instanceof NodeList) {
    glossElements = this.selector;
  } else if (this.selector instanceof Element) {
    glossElements = [this.selector];
  } else {
    throw new Error('Invalid selector');
  }

  /** Processes a gloss element */
  function processGloss(_this, gloss, callback) {

    if (!(gloss instanceof Element)) {
      callback(new Error('Invalid gloss element'));
    }

    const lines = Array.prototype.slice.call(gloss.children);
    const linesToAlign = [];
    let firstRawLine = null;
    let firstRawLineNum = 0;

    triggerEvent(gloss, _this.events.beforeGloss);

    if (_this.firstLineOrig) {
      const firstLine = lines[0];
      addClass(firstLine, _this.classes.original);
    }

    if (_this.lastLineFree) {
      const lastLine = lines[lines.length - 1];
      addClass(lastLine, _this.classes.freeTranslation);
    }

    // process each line in the gloss
    lines.forEach((line, lineNum) => {
      // don't align lines that are free translations or original,
      // unformatted lines
      const isOrig = hasClass(line, _this.classes.original);
      const isFree = hasClass(line, _this.classes.freeTranslation);
      const shouldSkip = hasClass(line, _this.classes.noAlign);

      const shouldAlign = !isOrig && !isFree && !shouldSkip;

      if (shouldAlign) {
        triggerEvent(line, _this.events.beforeLex, { lineNum: lineNum });
        const tokens = _this.lex(line.innerHTML);
        triggerEvent(line, _this.events.afterLex, {
          tokens: tokens,
          lineNum: lineNum
        });

        linesToAlign.push(tokens);
        addClass(line, _this.classes.hidden);

        // if _this is the first aligned line, mark the location
        // so that the final aligned glosses can be inserted here
        if (!firstRawLine) {
          firstRawLine = line;
          firstRawLineNum = lineNum;
        }
      } else {
        addClass(line, _this.classes.line);
        addClass(line, _this.classes.lineNum + lineNum);
      }
    });

    const lastRawLineNum = firstRawLineNum + (linesToAlign.length - 1);

    triggerEvent(gloss, _this.events.beforeAlign, {
      lines: linesToAlign,
      firstLineNum: firstRawLineNum,
      lastLineNum: lastRawLineNum
    });

    let alignedLines = _this.align(linesToAlign);

    triggerEvent(gloss, _this.events.afterAlign, {
      lines: alignedLines,
      firstLineNum: firstRawLineNum,
      lastLineNum: lastRawLineNum
    });

    // determine which type of element the aligned glosses should be wrapped in
    let alignedWrapper;
    if (gloss.tagName === 'UL' || gloss.tagName === 'OL') {
      alignedWrapper = 'li';
    } else {
      alignedWrapper = 'div';
    }

    triggerEvent(gloss, _this.events.beforeFormat, {
      lines: alignedLines,
      firstLineNum: firstRawLineNum,
      lastLineNum: lastRawLineNum
    });

    const formattedLines = _this.format(alignedLines, alignedWrapper, firstRawLineNum);
    gloss.insertBefore(formattedLines, firstRawLine);

    triggerEvent(formattedLines, _this.events.afterFormat, {
      firstLineNum: firstRawLineNum,
      lastLineNum: lastRawLineNum
    });

    // finish up by adding relevant classes to the main container
    if (!_this.spacing) {
      addClass(gloss, _this.classes.noSpace);
    }

    addClass(gloss, _this.classes.glossed);

    triggerEvent(gloss, _this.events.afterGloss);
  }

  triggerEvent(document, this.events.start, { glosses: glossElements });

  // process each gloss
  const glosses = Array.prototype.slice.call(glossElements);
  glosses.forEach((gloss) => {
    if (this.async) {
      window.setTimeout(() => processGloss(this, gloss, callback));
    } else {
      processGloss(this, gloss, callback);
    }
  });

  window.setTimeout(() => {
    if (typeof callback === 'function') {
      callback(null, glossElements);
    }

    triggerEvent(document, this.events.complete, { glosses: glossElements });
  });
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

export default Leipzig;
