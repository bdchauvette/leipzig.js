var test = require('tape-catch');
var Leipzig = require('../dist/leipzig');

var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// abbreviations
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

// default configuration values
var defaults = {
  lastLineFree: true,
  firstLineOrig: false,
  spacing: true,
  autoTag: true,
  async: false,
  lexer: /{(.*?)}|([^\\s]+)/g,
  selector: '[data-gloss]',
  events: {
    beforeGloss: 'gloss:beforeGloss',
    afterGloss: 'gloss:afterGloss',
    beforeLex: 'gloss:beforeLex',
    afterLex: 'gloss:afterLex',
    beforeAlign: 'gloss:beforeAlign',
    afterAlign:'gloss:afterAlign',
    beforeFormat: 'gloss:beforeFormat',
    afterFormat:'gloss:afterFormat',
    start: 'gloss:start',
    complete: 'gloss:complete'
  },
  classes: {
    glossed: 'gloss--glossed',
    noSpace: 'gloss--no-space',
    words: 'gloss__words',
    word: 'gloss__word',
    spacer: 'gloss__word--spacer',
    line: 'gloss__line',
    lineNum: 'gloss__line--',
    original: 'gloss__line--original',
    freeTranslation: 'gloss__line--free',
    noAlign: 'gloss__line--no-align',
    hidden: 'gloss__line--hidden',
    abbr: 'gloss__abbr'
  },
  abbreviations: abbreviations
};

// used for testing configuration objects
// all values changed from defaults
var testConfig = {
  lastLineFree: false,
  firstLineOrig: true,
  spacing: false,
  autoTag: false,
  async: true,
  lexer: /test/g,
  selector: '.test',
  events: {
    beforeGloss: 'test:beforeGloss',
    afterGloss: 'test:afterGloss',
    beforeLex: 'test:beforeLex',
    afterLex: 'test:afterLex',
    beforeAlign: 'test:beforeAlign',
    afterAlign:'test:afterAlign',
    beforeFormat: 'test:beforeFormat',
    afterFormat:'test:afterFormat',
    start: 'test:start',
    complete: 'test:complete'
  },
  classes: {
    glossed: 'test--glossed',
    noSpace: 'test--no-space',
    words: 'test__words',
    word: 'test__word',
    spacer: 'test__word--spacer',
    line: 'test__line',
    lineNum: 'test__line--',
    original: 'test__line--original',
    freeTranslation: 'test__line--free',
    noAlign: 'test__line--no-align',
    hidden: 'test__line--hidden',
    abbr: 'test__abbr'
  },
  abbreviations: { foo: 'bar' }
};

// helper function for testing selector
function testSelector(t, selector) {
  var leipzig = Leipzig(selector);

  Object.keys(leipzig).forEach(function(opt) {
    if (opt === 'selector') {
      t.deepEqual(leipzig[opt], selector);
    } else {
      t.deepEqual(leipzig[opt], defaults[opt]);
    }
  });
}

test('use all defaults when called with no args', function(t) {
  var leipzig = Leipzig();

  Object.keys(leipzig).forEach(function(opt) {
    t.deepEqual(leipzig[opt], defaults[opt]);
  });

  t.end();
});

test('only set the selector when called with a string', function(t) {
  var selector = '.gloss';
  testSelector(t, selector);
  t.end();
});

test('only set the selector when called with a NodeList', function(t) {
  var selector = document.querySelectorAll('.gloss');
  testSelector(t, selector);
  t.end();
});

test('only set the selector when called with an element', function(t) {
  var selector = document.querySelector('html');
  testSelector(t, selector);
  t.end();
});

test('throws an error when called with an invalid selector', function(t) {
  try {
    var leipzig = Leipzig({});
  } catch (e) {
    if (e.message === 'Invalid selector') {
      t.pass();
    }
  }

  t.end();
});

test('set options correctly when called with single config object', function(t) {
  var leipzig = Leipzig(testConfig);

  Object.keys(leipzig).forEach(function(opt) {
    t.deepEqual(leipzig[opt], testConfig[opt]);
  });

  t.end();
});

test('overrides settings when called with Leipzig#config', function(t) {
  var leipzig = Leipzig();
  leipzig.config(testConfig);

  Object.keys(leipzig).forEach(function(opt) {
    t.deepEqual(leipzig[opt], testConfig[opt]);
  });

  t.end();
});

test('should set abbreviations when called with an object', function(t) {
  var testAbbr = { foo: 'bar' };
  var leipzig = Leipzig({ abbreviations: testAbbr });

  t.deepEqual(leipzig.abbreviations, testAbbr);

  t.end();
});

test('Leipzig#addAbbreviations should add abbreviations', function(t) {
  var leipzig = Leipzig();
  var testAbbr = { foo: 'bar' };
  var expectedAbbr = _extends({}, leipzig.abbreviations, testAbbr);

  leipzig.addAbbreviations(testAbbr);

  t.deepEqual(leipzig.abbreviations, expectedAbbr);

  t.end();
});

test('Leipzig#setAbbreviations should replace definitions', function(t) {
  var leipzig = Leipzig();
  var testAbbr = { foo: 'bar' };
  leipzig.setAbbreviations(testAbbr);

  t.deepEqual(leipzig.abbreviations, testAbbr);

  t.end();
});

test('accepts String as a lexer', function(t) {
  var leipzig = Leipzig({ lexer: 'test' });

  t.deepEqual(leipzig.lexer, /test/g);
  t.end();
});

test('accept Array as a lexer', function(t) {
  var leipzig = Leipzig({ lexer: [
    '{(.*?)}',
    '([^\\s]+)'
  ]});

  t.deepEqual(leipzig.lexer, /{(.*?)}|([^\s]+)/g);
  t.end();
});

test('should accept a RegExp as a lexer', function(t) {
  var leipzig = Leipzig({ lexer: /test/ });

  t.deepEqual(leipzig.lexer, /test/g);
  t.end();
});

test('set config correctly when called with two arguments', function(t) {
  var selector = document.querySelectorAll('.gloss');
  var leipzig = Leipzig(selector, testConfig);

  Object.keys(leipzig).forEach(function(opt) {
    if (opt === 'selector') {
      t.deepEqual(leipzig[opt], selector);
    } else {
      t.deepEqual(leipzig[opt], testConfig[opt]);
    }
  });

  t.end();
});
