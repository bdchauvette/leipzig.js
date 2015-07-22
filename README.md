# Leipzig.js
**Interlinear glossing for the browser**

Leipzig.js is a small JavaScript utility that makes it easy to add
[interlinear glosses][] to webpages.

[interlinear glosses]: https://en.wikipedia.org/wiki/Interlinear_gloss

[![npm badge](https://img.shields.io/npm/v/leipzig.svg)](https://www.npmjs.com/package/leipzig)
![bower badge](https://img.shields.io/bower/v/leipzig.svg)

# Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [Documentation](#documentation)
  - [Marking Up Examples](#marking-up-examples)
  - [`Leipzig()`](#leipzig)
    - [`selector`](#configselector)
    - [`lastLineFree`](#configlastlinefree)
    - [`firstLineOrig`](#configfirstlineorig)
    - [`spacing`](#configspacing)
    - [`autoTag`](#configautotag)
    - [`async`](#configasync)
    - [`lexers`](#configlexers)
    - [`events`](#configevents)
    - [`classes`](#configclasses)
    - [`abbreviations`](#configabbreviations)
  - [`Leipzig#config()`](#leipzigconfig)
  - [`Leipzig#gloss()`](#leipziggloss)
  - [`Leipzig.abbreviations`](#leipzigabbreviations)
- [Tests](#tests)
- [License](#license)

---

# Overview

An *interlinear gloss* is a way of presenting linguistic data that helps
makes it clear what the different words and morphemes of a phrase mean. They
consist of multiple lines of data, aligned horizontally at the word boundaries
of the original language.

Many interlinear glosses consist of three lines:

1. The first line is used for data in the original language;
2. A morpheme-by-morpheme analysis of the original language;
3. A free or colloquial translation, not aligned at word boundaries.

Additional lines may be used to show phonemic information, or other analyses
that might be relevant to the phrase being glossed.

Interlinear glosses help linguists present language data to audiences that
might not be familiar with the language being analyzed, and are an integral
part of documenting and discussing languages.

## Existing Solutions

There have been some efforts to improve interlinear glossing on the web.

Both [Kevin McGowan][] and [James Tauber][] describe methods for styling
interlinear glosses using pure CSS. However, marking up glosses by
hand is cumbersome, and neither solution degrades gracefully if
CSS is disabled. (McGowan does hint at a JavaScript solution that
seems similar to what Leipzig.js is doing, but no code is provided.)

[Kevin McGowan]: http://kbmcgowan.github.io/blog/2009/02/28/css-interlinear-glosses.html
[James Tauber]: http://jtauber.com/blog/2006/01/28/dynamic_interlinears_with_javascript_and_css/

[`interlinear`](https://github.com/parryc/interlinear), like Leipzig.js, is a
JavaScript + CSS utility that automatically formats selected
HTML elements. While `interlinear` is a very functional library
and currently contains more features than Leipzig.js, I personally dislike the
glossing syntax, and would prefer a solution that relies more on
HTML tags. I would also prefer a solution that degrades more
gracefully when JavaScript is disabled.

## Enter Leipzig.js

Leipzig.js aims to be a simple, lightweight solution for interlinear glossing
on the web. By relying on existing HTML tags, it degrades
gracefully when JavaScript is not present.

While basic usage of Leipzig.js is dead simple (see the Usage section below),
more customizable glossing can be achieved by using the library's flexible
API.

Glosses formatted with Leipzig.js are [responsive][], and contain numerous
CSS classes that can be used to style individual lines in the
gloss.

[responsive]: https://en.wikipedia.org/wiki/Responsive_web_design

My hope is that Leipzig.js strikes the right balance between ease of creation
and beauty of output. It should be easy enough to use for people new to web
authorship, while remaining powerful and customizable enough for people that
want more control over their interlinear glosses.

## Further Reading

For more information about interlinear glossing, visit the homepage for the
[Leipzig Glossing
Rules](https://www.eva.mpg.de/lingua/resources/glossing-rules.php) (from which
Leipzig.js gets its name). The Leipzig Glossing rules homepage also contains
references to other important works on interlinear glossing.

[Back to Top ↑](#leipzigjs)

---

# Usage

## 1. Download It (Optional)

You can install Leipzig.js using `npm` or Bower, or by downloading the latest
version from the github repository:

```sh
$ npm install --save leipzig
$ bower install --save leipzig
$ git clone https://github.com/bdchauvette/leipzig.js.git
```

Alternatively, you can skip installing Leipzig.js on your own server, and can
use the [jsDelivr](http://www.jsdelivr.com/) <abbr>CDN</abbr> as described in
the next step.

## 2. Include It

Include the main `leipzig.js` file somewhere on your page, ideally at the
bottom of the `<body>`:

```html
<script src="path/to/leipzig/dist/leipzig.min.js"></script>
```

Leipzig.js comes with some basic styling, which you can include by adding the
Leipzig.js stylesheet in the `<head>` of your page:

```html
<link rel="stylesheet" href="path/to/leipzig/dist/leipzig.css">
```

### jsDelivr

You can also include the latest version of Leipzig.js automatically by linking
to the project files on the jsDelivr CDN:

```html
<!-- CSS -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/leipzig/latest/leipzig.min.css">

<!-- JavaScript -->
<script src="//cdn.jsdelivr.net/leipzig/latest/leipzig.min.js"></script>
```

For more information about jsDelivr, you can visit the [jsDelivr
homepage](http://www.jsdelivr.com), or read the following blog posts:

- [jsDelivr - the advanced open source public
  CDN](https://hacks.mozilla.org/2014/03/jsdelivr-the-advanced-open-source-public-cdn/)
- [jsDelivr does it better](https://www.maxcdn.com/blog/jsdelivr-better/)

## 3. Mark Up Your Examples

To use the Leipzig.js default configuration, just add a `data-gloss` attribute
to the examples you want to be glossed:

```html
<div data-gloss>
  <p>Gila abur-u-n ferma hamišaluǧ güǧüna amuq’-da-č.</p>
  <p>now they-OBL-GEN farm forever behind stay-FUT-NEG</p>
  <p>‘Now their farm will not stay behind forever.’</p>
</div>
```

Leipzig.js will find all of the blocks that have the `data-gloss` attribute and
turn them into nicely formatted interlinear glosses.

## 4. Gloss ’Em

Finally, you just need to tell Leipzig.js to go to work by adding the following
`<script>` somewhere _after_ the one you added in Step 2:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    Leipzig().gloss();
  });
</script>
```

If you're already using [jQuery][], you can use the following script instead:

```
<script>
  $(function() { Leipzig().gloss(); });
</script>
```

[jQuery]: https://jquery.com/

## Minimal Example

```html
<html>
  <head>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/leipzig/latest/leipzig.min.css">
  </head>
  <body>
    <div data-gloss>
      <p>Ein Beispiel</p>
      <p>DET.NOM.N.SG example</p>
      <p>‘An example’</p>
    </div>
    <script src="//cdn.jsdelivr.net/leipzig/latest/leipzig.min.js"></script>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        Leipzig().gloss();
      });
    </script>
  </body>
</html>
```

[Back to Top ↑](#leipzigjs)

---

# Documentation

## Marking Up Examples

Leipzig.js is flexible when it comes to what underlying tags you use to mark up
your glosses. For semantic reasons, I like to use `<p>` tags in a `<div>`, e.g.

```html
<div data-gloss>
  <p>ein Beispiel</p>
  <p>DET.NOM.N.SG example</p>
  <p>‘an example’</p>
</div>
```

You can also mark it up as a list, and Leipzig.js will add the aligned words as
an `<li>` item:

```html
<ul data-gloss>
  <li>ein Beispiel</li>
  <li>DET.NOM.N.SG example</li>
  <li></li>
  <li>‘an example’</li>
</ul>
```

To make the parser treat multiple words as a single unit, surround the words
with curly braces, e.g.:


```html
<div data-gloss>
  <p>El perrito está comiendo.</p>
  <p>the {little dog} is eating.</p>
</div>
```

[Back to Top ↑](#leipzigjs)

---

## `Leipzig()`

```javascript
Leipzig([selector : String|NodeList|Element], [config : Object] ) -> Function
```

Leipzig.js takes two optional arguments during construction:

1. `selector`, which tells Leipzig.js which elements to gloss
2. `config`, a plain JavaScript object for configuration

Neither argument is required when creating a new Leipzig.js object, and if no
arguments are provided, then Leipzig.js will use the default configuration,
listed below.

### Defaults

Leipzig.js defaults to a three-line glossing pattern, where the first two lines
are word-aligned, and the last line is a non-aligned free translation.

The default configuration is the following:

```javascript
var leipzig = Leipzig({
  selector: '[data-gloss]',
  lastLineFree: true,
  firstLineOrig: false,
  spacing: true,
  autoTag: true,
  async: false,
  lexers: [
    '{(.*?)}',
    '([^\\s]+)'
  ],
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
    abbr: 'gloss__abbr',
    line: 'gloss__line',
    lineNum: 'gloss__line--',
    original: 'gloss__line--original',
    freeTranslation: 'gloss__line--free',
    noAlign: 'gloss__line--no-align',
    hidden: 'gloss__line--hidden'
  },
  abbreviations: {...} // See Leipzig.abbreviations section
});
```

When configuring Leipzig.js, you only need to specify the options that you want
to change. All other options will retain their default values.

[Back to Top ↑](#leipzigjs)

### `config.selector`

```javascript
   Type : String | NodeList | Element
Default : '[data-gloss]'
```

This option configures which elements that the Leipzig.js glosser will operate
on. You can set this option by either passing it as the first argument when
initializing Leipzig.js, or by setting the `selector` argument in the
configuration object:

```javascript
// Two ways of saying the same thing
var leipzig = Leipzig('[data-gloss]');
var leipzig = Leipzig({ selector: '[data-gloss]' });
```

The elements option can be a `String`, a `NodeList` or `Element`.

If the `selector` argument is a `String`, Leipzig.js will internally run
`document.querySelectorAll()` using the specified string, and the glosser will
operate on the list of <abbr>DOM</abbr> elements it returns.

Likewise, if `selector` is an `Element` or a `NodeList`, the glosser will
operate on the provided <abbr>DOM</abbr> element(s).

[Back to Top ↑](#leipzigjs)

### `config.lastLineFree`

```javascript
   Type : Boolean
Default : true
```

Leipzig.js can automatically mark the last line in a gloss as a non-aligned
free translation. Doing so will add a special class to the last line
(`.gloss__line--free` by default), and cause the line to be excluded from word
alignment.

This behavior is controlled by the `lastLineFree` configuration option, and is
_enabled_ by default.

To disable automatically marking the last line as a free translation, set
`lastLineFree` to `false` when initializing Leipzig.js:

```javascript
var leipzig = Leipzig({ lastLineFree: false });
```

If you turn this option off, you can still mark a line as a free translation by
adding the free translation <abbr>CSS</abbr> class (`gloss__line--free` by
default) to the underlying <abbr>HTML</abbr>:

```html
<p class="gloss__line--free">‘The little dog is eating.’</p>
```

[Back to Top ↑](#leipzigjs)

### `config.firstLineOrig`

```javascript
   Type : Boolean
Default : false
```

Leipzig.js can also automatically mark the first line in a gloss as a
non-aligned free translation. Doing so will add a special class to the last
line (`.gloss__line--original` by default), and cause the line to be excluded
from word alignment.

This behavior is useful in cases where the line being glossed is long, or if
the original language is not usually written with spaces, e.g. Japanese.

This behavior is controlled by the `firstLineOrig` configuration option, and is
_disabled_ by default.

To enable automatically marking the first line as original text, set
`firstLineOrig` to `true` when initializing Leipzig.js:

```javascript
var leipzig = Leipzig({ firstLineOrig: true });
```

If `firstLineOrig` is disabled, you can still mark a line as a original text
by adding the original text <abbr>CSS</abbr> class (`gloss__line--original` by
default) to the underlying <abbr>HTML</abbr>:

```html
<p class="gloss__line--original">太陽が昇る。</p>
```

[Back to Top ↑](#leipzigjs)

### `config.spacing`

```javascript
   Type : Boolean
Default : true
```

The default Leipzig.js styling includes small horizontal spacing at glossed
word boundaries. For highly agglutinative languages, this behavior may not be
ideal, because glossed phrases are likely to contain many morphemes in one
word:

To remove this automatic spacing, you can set the `spacing` option to `false`
when initializing Leipzig.js:

```javascript
var leipzig = Leipzig({ spacing: false });
```

This will add an additional class to the gloss container (`.gloss--no-space` by
default), which removes the horizontal space.

[Back to Top ↑](#leipzigjs)

### `config.autoTag`

```javascript
   Type : Boolean
Default : true
```

By default, Leipzig.js will try to wrap morphemic glosses in `<abbr>` tags.
Beginning with the <em>second</em> line of the aligned lines, the parser looks
for the following types of morphemes to tag:

1. Numbers 1 through 4, corresponding to possible person morphemes;
2. Sequences of &geq;1 uppercase letter(s), e.g. N, SG, or PST.

The parser attempts to assign a `title` attribute to any matches by looking for
a matching key in the `Leipzig.abbreviations` object. This object contains
key-value pairs based on the [standard abbreviations of the Leipzig Glossing
Rules](https://www.eva.mpg.de/lingua/resources/glossing-rules.php).

You can customize the definitions by adding or modifiying the keys and values
on the `Leipzig.abbreviations` object. For example, the following code changes
the definition of `COMP` from `complementizer` to `comparative`:

```javascript
var leipzig = Leipzig();
leipzig.abbreviations.COMP = 'comparative';
```

[Back to Top ↑](#leipzigjs)

### `config.async`

```javascript
   Type : Boolean
Default : false
```

Leipzig.js runs synchronously by default, and normally this is fine. However,
when running synchronously, the browser will wait for Leipzig.js to finish
before attending to the needs of other scripts and browser events. This means
that if you have a large number of glosses on a page, the user experience might
start to suffer.

To remedy this, you can set the `async` option to `true`, which will cause
Leipzig.js to run (somewhat) asynchronously.

You can use the optional callback to `Leipzig#gloss()` to perform actions when
the glossing has been completed.

[Back to Top ↑](#leipzigjs)

### `config.lexers`

```javascript
   Type : Array<String> | String | RegExp
Default : ['{(.*?)}', '([^\\s]+)']
```
This option controls how Leipzig breaks lines into aligned words.

If passed a `String` or an `Array` of `String`s, Leipzig will convert them into
a `RegExp` object used for lexing the lines. The following configurations
produce the same lexer:

```javascript
// Array<String>
var leipzig = Leipzig({ lexers: ['{(.*?)}', '([^\\s]+)'] });

// String
var leipzig = Leipzig({ lexers: '{(.*?)}|([^\\s]+)' });

// RegExp
var leipzig = Leipzig({ lexers: /{(.*?)}|([^\s]+)/g });
```

[Back to Top ↑](#leipzigjs)

### `config.events`

```javascript
   Type : Object
Default : { beforeGloss:  'gloss:beforeGloss',
            afterGloss:   'gloss:afterGloss',
            beforeLex:    'gloss:beforeLex',
            afterLex:     'gloss:afterLex',
            beforeAlign:  'gloss:beforeAlign',
            afterAlign:   'gloss:afterAlign',
            beforeFormat: 'gloss:beforeFormat',
            afterFormat:  'gloss:afterFormat',
            start:        'gloss:start',
            complete:     'gloss:complete' }
```
Leipzig.js triggers certain events during the glossing process. You can act on
these events by creating an event listener before calling the glosser:

```javascript
var leipzig = Leipzig();
document.addEventListener('gloss:complete', function(event) {
  console.log('Glossing complete!');
});
leipzig.gloss();

// -> Glossing complete!
```

Following the DOM Custom Event API, some of the events have `detail` objects,
which contain additional information about the event. For events without detail
objects, you should be able to access all relevant information from various
methods on `event.target`.

The default event names are listed in the table below, along with additional
information about each event.

Name                | Triggers...                         | Details Object
--------------------|-------------------------------------|-----------------
gloss:start         | Before glossing the first `Element` | `{ glosses: NodeList }`
gloss:complete      | After glossing every `Element`      | `{ glosses: NodeList }`
gloss:beforeGloss   | Before each `Element` is glossed    | --
gloss:afterGloss    | After each `Element` is glossed     | --
gloss:beforeLex     | Before lexing each line             | --
gloss:afterLex      | After lexing each line              | `{ tokens: Array<String> }`
gloss:beforeAlign   | Before aligning lexed lines         | `{ lines: Array<Array<String>> }`
gloss:afterAlign    | After aligning lexed line           | `{ lines: Array<Array<String>> }`
gloss:beforeFormat  | Before formatting aligned lines     | `{ lines: Array<Array<String>> }`
gloss:afterFormat   | After formatting aligned lines      | --

 You can customize the event names by passing a plain JavaScript object to the
`events` key on your `config` object, e.g.:

```javascript
var leipzig = Leipzig({
  events: { complete: 'newComplete' }
});
```

[Back to Top ↑](#leipzigjs)

### `config.classes`

```javascript
   Type : Object
Default : // See Table Below
```
Leipzig.js adds a number of <abbr>CSS</abbr> classes to the final gloss, which
you can use to style your glosses. The names of these classes can be configured
by changing the the settings on the `class` object within the `options`
configuration object.

The names, meaning, and default values of the classes are as follows:

Option            | Default                  | Description
------------------|--------------------------|------------
`glossed`         | `gloss--glossed`         | Added to each element in `selector` after the glosser has finished
`noSpace`         | `gloss--no-space`        | Added to each element in `selector` when the `spacing` option is set to false
`words`           | `gloss__words`           | Added to the group of words that are aligned
`word`            | `gloss__word`            | Added to each word in the group of aligned words
`abbr`            | `gloss__abbr`            | Added to morpheme abbreviations by the auto-tagger
`line`            | `gloss__line`            | Added to each visible line in the gloss
`lineNum`         | `gloss__line--`          | Added to each visible line in the gloss. The zero-indexed line number is automatically appended to the end of this class.
`freeTranslation` | `gloss__line--free`      | The free translation line
`original`        | `gloss__line--original`  | The original language line
`noAlign`         | `gloss__line--no-align`  | Can be manually added to tell the parser to skip a line when aligning words

The following example shows the class structure of what a gloss looks like after
being fully parsed and formatted (excluding automated morpheme tags):

```html
<div id="gloss--style" class="example gloss--no-space gloss--glossed">
  <p class="gloss__line gloss__line--0 gloss__line--original">Nikukonda</p>
  <div class="gloss__words">
    <div class="gloss__word">
      <p class="gloss__line gloss__line--1">Ni-</p>
      <p class="gloss__line gloss__line--2">1SG.SBJ-</p>
    </div>
    <div class="gloss__word">
      <p class="gloss__line gloss__line--1">ku-</p>
      <p class="gloss__line gloss__line--2">2SG.OBJ-</p>
    </div>
    <div class="gloss__word">
      <p class="gloss__line gloss__line--1">kond</p>
      <p class="gloss__line gloss__line--2">love</p>
    </div>
    <div class="gloss__word">
      <p class="gloss__line gloss__line--1">-a</p>
      <p class="gloss__line gloss__line--2">-IND</p>
    </div>
  </div>
  <p class="gloss__line--hidden">Ni- ku- kond -a</p>
  <p class="gloss__line--hidden">1SG.SBJ- 2SG.OBJ- love -IND</p>
  <p class="gloss__line gloss__line--3 gloss__line--free">‘I love you’</p>
  <p class="gloss__line gloss__line--4 gloss__line--no-align">Town Nyanja (Lusaka, Zambia)</p>
</div>
```

If the class names of the last three options &ndash; `classes.freeTranslation`,
`classes.original`, and `classes.noAlign` &ndash; are manually added to the html
markup, they will be skipped by the Leipzig.js glosser during parsing, and will
not be word-aligned with the other text.

**NB:** If a line is manually skipped by adding the
`classes.noAlign` class, it might interfere with the automated Free Translation and
Original Language line detection. If this happens, you will have to manually
add the relevant classes to the underlying markup.

### `config.abbreviations`

```javascript
   Type : Object
Default : // see Leipzig.abbreviations section below
```

If you pass in a plain JavaScript object, it will override [the default
auto-tagging definitions](#default-definitions).

[Back to Top ↑](#leipzigjs)

---

## `Leipzig#config()`

```javascript
Leipzig.config(options : Object) -> Void
```

This option allows you to configure Leipzig.js after initializing it. The
following code snippets have the same effect:

```javascript
// Setting config during initialization
var leipzig = Leipzig({ async: true });

// Setting config via Leipzig#config()
var leipzig = Leipzig();
leipzig.config({ async: true });
```

**NB:** The `config` method will only set the options
passed in via the configuration object. All other settings will return to their
default values.

[Back to Top ↑](#leipzigjs)

---

## `Leipzig#gloss()`

```javascript
Leipzig.gloss([callback : Function(err, elements)]) -> Void
```

This method runs the glosser over the elements that were specified when
initializing the Leipzig object.

It accepts an optional, error-first style callback function that will be called
once all of the glosses have been completed (or the glosser encounters an
error):

```javascript
var leipzig = Leipzig({ async: true });
console.log('Starting gloss...');
leipzig.gloss(function(err, elements) {
  if (err) {
    console.log(err);
  }
  console.log('Glossing complete!' + elements);
});
console.log('Glosser is running...');

// -> Starting gloss...
// -> Glosser is running...
// -> Glossing complete! [object NodeList]
```

This callback is especially useful if you're using the asynchronous glosser,
but you can also use it with the synchronous API.

[Back to Top ↑](#leipzigjs)

---

## `Leipzig.abbreviations`

Leipzig.js comes with a dictionary of the [Standard Leipzig Glossing Rule
abbreviations](https://www.eva.mpg.de/lingua/resources/glossing-rules.php)
baked in. The auto-tagging engine will use these definitions by default when
attempting to assign `title` attributes to morpheme glosses.

### Modifying the abbreviations
You can replace this dictionary completely by assigning a new `abbreviations`
object on your `Leipzig()` instance:

```javascript
var leipzig = Leipzig();
leipzig.abbreviations = { ABBREVIATION: 'definition' }
```

Or by setting the `abbreviations` config option when initializing Leipzig:

```javascript
var newAbbreviations = { ABBREVIATION: 'definition' };
var leipzig = Leipzig({ abbreviations: newAbbreviations });
```

You can also modify specific entries in the dictionary by setting the relevant
abbreviation to a different value. For example, to change `COMP` from
*complementizer* to *comparative*, you could use the following:

```javascript
var leipzig = Leipzig();
leipzig.abbreviations.COMP = 'comparative';
```

### Default Definitions
The standard list is as follows:

 Abbreviation | Definition
--------------|------------
 1            | first person
 2            | second person
 3            | third person
 A            | agent-like argument of canonical transitive verb
 ABL          | ablative
 ABS          | absolutive
 ACC          | accusative
 ADJ          | adjective
 ADV          | adverb(ial)
 AGR          | agreement
 ALL          | allative
 ANTIP        | antipassive
 APPL         | applicative
 ART          | article
 AUX          | auxiliary
 BEN          | benefactive
 CAUS         | causative
 CLF          | classifier
 COM          | comitative
 COMP         | complementizer
 COMPL        | completive
 COND         | conditional
 COP          | copula
 CVB          | converb
 DAT          | dative
 DECL         | declarative
 DEF          | definite
 DEM          | demonstrative
 DET          | determiner
 DIST         | distal
 DISTR        | distributive
 DU           | dual
 DUR          | durative
 ERG          | ergative
 EXCL         | exclusive
 F            | feminine
 FOC          | focus
 FUT          | future
 GEN          | genitive
 IMP          | imperative
 INCL         | inclusive
 IND          | indicative
 INDF         | indefinite
 INF          | infinitive
 INS          | instrumental
 INTR         | intransitive
 IPFV         | imperfective
 IRR          | irrealis
 LOC          | locative
 M            | masculine
 N            | neuter
 NEG          | negation / negative
 NMLZ         | nominalizer / nominalization
 NOM          | nominative
 OBJ          | object
 OBL          | oblique
 P            | patient-like argument of canonical transitive verb
 PASS         | passive
 PFV          | perfective
 PL           | plural
 POSS         | possessive
 PRED         | predicative
 PRF          | perfect
 PRS          | present
 PROG         | progressive
 PROH         | prohibitive
 PROX         | proximal / proximate
 PST          | past
 PTCP         | participle
 PURP         | purposive
 Q            | question particle / marker
 QUOT         | quotative
 RECP         | reciprocal
 REFL         | reflexive
 REL          | relative
 RES          | resultative
 S            | single argument of canonical intransitive verb
 SBJ          | subject
 SBJV         | subjunctive
 SG           | singular
 TOP          | topic
 TR           | transitive
 VOC          | vocative

[Back to Top ↑](#leipzigjs)
---

# Tests

```sh
$ git clone https://github.com/bdchauvette/leipzig.js.git
$ cd leipzig.js
$ npm install
$ npm test
```

[Back to Top ↑](#leipzigjs)

---

# License

Leipzig.js is licensed under the ISC License.

For details, please see the `LICENSE` file.
