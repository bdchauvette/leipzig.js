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
 * Helper function for testing whether an array contains only strings
 * @private
 */
function hasOnlyStrings(arr) {
  return arr.every(e => typeof e === 'string');
}

/**
 * Creates a Leipzig.js glossing object
 * @constructor
 * @param {String|NodeList|Element} elements - elements to be glossed
 * @param {Object} config - configuration object
 */
var Leipzig = function(elements, config) {
  if (!(this instanceof Leipzig)) {
    return new Leipzig(elements, config);
  }

  let opts = config || {};

  if (typeof elements === 'string' ||
      elements instanceof NodeList ||
      elements instanceof Element) {
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
  this.autoTag = setBool(opts, 'autoTag', true);

  if (opts.tokenizers === undefined) {
    this.tokenizers = [
      '{(.*?)}',
      '([^\\s]+)'
    ];
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
    opts.class = {};
  }

  this.class = {
    glossed: opts.class.glossed || 'gloss--glossed',
    noSpace: opts.class.noSpace || 'gloss--no-space',
    words: opts.class.words || 'gloss__words',
    word: opts.class.word || 'gloss__word',
    line: opts.class.line || 'gloss__line',
    lineNum: opts.class.lineNum || 'gloss__line--',
    original: opts.class.original || 'gloss__line--original',
    freeTranslation: opts.class.freeTranslation || 'gloss__line--free',
    noAlign: opts.class.noAlign || 'gloss__line--no-align',
    hidden: opts.class.hidden || 'gloss__line--hidden',
    abbr: opts.class.abbr || 'gloss__abbr'
  };
};

/**
 * Tokenizes a line of input
 * @param {String} phrase - the phrase to be tokenized
 * @returns {Array} The tokens
 */
Leipzig.prototype.tokenize = function tokenize(phrase) {
  let tokenizer;

  if (this.tokenizers instanceof RegExp) {
    tokenizer = this.tokenizers;
  } else if (this.tokenizers instanceof Array) {
    const tokenizers = this.tokenizers.join('|');
    tokenizer = new RegExp(tokenizers, 'g');
  } else {
    throw new Error('Invalid tokenizer');
  }

  const tokens = phrase
    .match(tokenizer)
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
      tagged = `<abbr class="${this.class.abbr}" title="${definition}">${tag}</abbr>`;
    } else if (maybeNegative && abbreviations[negStem]) {
      definition = abbreviations[negStem];
      tagged = `<abbr class="${this.class.abbr}" title="non-${definition}">${tag}</abbr>`;
    } else {
      tagged = `<abbr class="${this.class.abbr}">${tag}</abbr>`;
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
 * @param {Array} lines - lines to be formatted
 * @returns {Element} html element containing the glosses
 */
Leipzig.prototype.format = function format(groups, wrapperType, lineNumStart) {
  let wrapper = document.createElement(wrapperType);
  let innerHtml = [];

  addClass(wrapper, this.class.words);

  groups.forEach(group => {
    innerHtml.push(`<div class="${this.class.word}">`);

    group.forEach((line, lineNumOffset) => {
      let lineNum = lineNumStart + lineNumOffset;

      // add non-breaking space for empty gloss slots
      line = line ? line : '&nbsp;';

      // auto tag morphemes
      if (lineNumOffset > 0 && this.autoTag) {
        line = this.tag(line);
      }

      innerHtml.push(`<p class="${this.class.line} ${this.class.lineNum}${lineNum}">${line}</p>`);
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
  let glossElements;

  if (typeof this.elements === 'string') {
    glossElements = document.querySelectorAll(this.elements);
  } else if (this.elements instanceof NodeList) {
    glossElements = this.elements;
  } else if (this.elements instanceof Element) {
    glossElements = [this.elements];
  } else {
    throw new Error('Invalid selector');
  }

  // process each gloss
  for (let i = 0; i < glossElements.length; i++) {
    const gloss = glossElements[i];
    const lines = gloss.children;
    const linesToAlign = [];
    let firstRawLine = null;
    let firstRawLineNum = 0;

    if (this.firstLineOrig) {
      const firstLine = gloss.firstElementChild;
      addClass(firstLine, this.class.original);
    }

    if (this.lastLineFree) {
      const lastLine = gloss.lastElementChild;
      addClass(lastLine, this.class.freeTranslation);
    }

    // process each line in the gloss
    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];

      // don't align lines that are free translations or original,
      // unformatted lines
      const isOrig = hasClass(line, this.class.original);
      const isFree = hasClass(line, this.class.freeTranslation);
      const shouldSkip = hasClass(line, this.class.noAlign);

      const shouldAlign = !isOrig && !isFree && !shouldSkip;

      if (shouldAlign) {
        linesToAlign.push(this.tokenize(line.innerHTML));
        addClass(line, this.class.hidden);

        // if this is the first aligned line, mark the location
        // so that the final aligned glosses can be inserted here
        if (!firstRawLine) {
          firstRawLine = line;
          firstRawLineNum = lineNum;
        }
      } else {
        addClass(line, this.class.line);
        addClass(line, this.class.lineNum + lineNum);
      }
    }

    const alignedLines = this.align(linesToAlign);

    // determine which type of element the aligned glosses should be wrapped in
    let alignedWrapper;
    if (gloss.tagName === 'UL' || gloss.tagName === 'OL') {
      alignedWrapper = 'li';
    } else {
      alignedWrapper = 'div';
    }

    const formattedLines = this.format(alignedLines, alignedWrapper, firstRawLineNum);
    gloss.insertBefore(formattedLines, firstRawLine);

    // finish up by adding relevant classes to the main container
    if (!this.spacing) {
      addClass(gloss, this.class.noSpace);
    }

    addClass(gloss, this.class.glossed);
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

export default Leipzig;
