# Leipzig.js
**Interlinear glossing for your browser**

Leipzig.js is a small JavaScript utility that makes it easy to add
[interlinear glosses][] to webpages.

[interlinear glosses]: https://en.wikipedia.org/wiki/Interlinear_gloss

[![npm version
0.4.0](https://img.shields.io/npm/v/leipzig.svg)](https://www.npmjs.com/package/leipzig)
![bower version 0.4.0](https://img.shields.io/bower/v/leipzig.svg)

# Overview

An <i>interlinear gloss</i> is a way of presenting linguistic data that helps
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

## Enter Leipzig.js

Leipzig.js aims to be a simple, lightweight solution for interlinear glossing
on the web. By relying on existing <abbr>HTML</abbr> tags, it degrades
gracefully when JavaScript is not present.

While basic usage of Leipzig.js is dead simple (see the Usage section below),
more customizable glossing can be achieved by using the library's flexible
<abbr>API</abbr>.

Glosses formatted with Leipzig.js are [responsive][], and contain numerous
<abbr>CSS</abbr> classes that can be used to style individual lines in the
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

---

# Usage

## 1. Download It

You can install Leipzig.js using `npm` or Bower, or by downloading the latest
version from the github repository:

```sh
$ npm install --save leipzig
$ bower install --save leipzig
$ git clone https://github.com/bdchauvette/leipzig.js.git
```

## 2. Include It

Once you have the files, include the main `leipzig.js` file somewhere on your
page, ideally at the bottom of the `<body>`:

```html
<script src="path/to/leipzig/dist/leipzig.min.js></script>
```

Leipzig.js comes with some basic styling, which you can include by adding the
Leipzig.js stylesheet in the `<head>` of your page:

```html
<link rel="stylesheet" href="path/to/leipzig/dist/leipzig.css">
```


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
    <link rel="stylesheet" href="path/to/leipzig/dist/leipzig.css">
  </head>
  <body>
    <div data-gloss>
      <p>Ein Beispiel</p>
      <p>DET.NOM.N.SG example</p>
      <p>‘An example’</p>
    </div>
    <script src="path/to/leipzig/dist/leipzig.js"></script>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        Leipzig().gloss();
      });
    </script>
  </body>
</html>
```

---

# Documentation

## Marking Up Examples

Leipzig.js is flexible when it comes to what underlying tags you use to mark up
your glosses. For semantic reasons, I like to use `<p>` tags in a `<div>`, e.g.

```html
<div data-gloss>
  <p>ein Beispiel</p>
  <p>DET.NOM.N.SG example</p>
  <p></p>
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

---

## `Leipzig()`

```javascript
Leipzig([elements : String|NodeList|Element], [config : Object] ) -> Function
```

Leipzig.js takes two optional arguments during construction:

1. `elements`, which tells Leipzig.js which elements to gloss
2. `options`, a plain JavaScript object for configuration

Neither argument is required when creating a new Leipzig.js object, and if no
arguments are provided, then Leipzig.js will use the default configuration,
listed below.

### `elements : String`

If the `elements` argument is a `String`, Leipzig.js will internally run
`document.querySelectorAll()` using the specified string, and the glosser will
operate on the list of <abbr>DOM</abbr> elements it returns.

Likewise, if `elements` is an `Element` or a `NodeList`, the glosser will
operate on the provided <abbr>DOM</abbr> element(s).

### `config : Object`

#### Defaults

Leipzig.js defaults to a three-line glossing pattern, where the first two lines
are word-aligned, and the last line is a non-aligned free translation.

The default configuraiton is the following:

```javascript
var leipzig = Leipzig({
  elements: '[data-gloss]',
  lastLineFree: true,
  firstLineOrig: false,
  spacing: true,
  autoTag: true,
  tokenizers: [
    '{(.*?)}',
    '([^\\s]+)'
  ],
  class: {
    glossed: 'gloss--glossed',
    noSpace: 'gloss--no-space',
    words: 'gloss__words',
    word: 'gloss__word',
    line: 'gloss__line--',
    original: 'gloss__line--original',
    freeTranslation: 'gloss__line--free',
    noAlign: 'gloss__line--no-align',
    hidden: 'gloss__line--hidden'
  }
});
```

When configuring Leipzig.js, you only need to specify the options that you want
to change. All other options will retain their default values.

### `elements : String | NodeList | Element`

```javascript
// default: '[data-gloss]'
```

This option configures which elements that the Leipzig.js glosser will operate
on. You can set this option by either passing it as the first argument when
initializing Leipzig.js, or by setting the `elements` argument in the
configuration object:

```javascript
// Two ways of saying the same thing
var leipzig = Leipzig('[data-gloss]');
var leipzig = Leipzig({ elements: '[data-gloss]' });
```

The elements option can be a `String`, a `NodeList` or `Element`.

If the `elements` argument is a `String`, Leipzig.js will internally run
`document.querySelectorAll()` using the specified string, and the glosser will
operate on the list of <abbr>DOM</abbr> elements it returns.

Likewise, if `elements` is an `Element` or a `NodeList`, the glosser will
operate on the provided <abbr>DOM</abbr> element(s).

### `lastLineFree : Boolean`

```javascript
// default: true
```

Leipzig.js can automatically mark the last line in a gloss as a free
translation, which will add a special class to it (`.gloss__line--free` by
default) and make it not be parsed for alignment.

This behavior is controlled by the `lastLineFree` configuration option, and is
_enabled_ by default.

To disable automatically parsing the last line as a free translation, set
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

### `firstLineOrig : Boolean`

```javascript
// default: false
```

Leipzig.js can also automatically mark the first line in the gloss
as the _original language line_, which will add a special class to it
(`.gloss__line--original` by default) and make it not be parsed for alignment.

This behavior is useful in cases where the line being glossed is long, or if
the original language is not usually written with spaces, e.g. Japanese.

This behavior is controlled by the `firstLineOrig` configuration option, and is
_disabled_ by default.

To enable automatically parsing the first line as original text, set
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

### `spacing : Boolean`

```javascript
// default: true
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

### `autoTag : Boolean`

```javascript
// default: true
```

By default, Leipzig.js will try to wrap morphemic glosses in `<abbr>` tags.
Beginning with the <em>second</em> line of the aligned lines, the parser looks
for the following types of morphemes to tag:

1. Numbers 1 through 4, corresponding to possible person morphemes;
2. Sequences of &geq;1 uppercase letters, e.g. N, SG, or PST.

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

### `tokenizers : Array<String> | String | RegExp`

```javascript
// default: ['{(.*?)}', '([^\\s]+)']
```

This option controls how Leipzig breaks lines into aligned words.

If passed a `String` or an `Array` of `String`s, Leipzig will convert them into
a `RegExp` object used for tokenizing the lines. The following configurations
produce the same tokenizer:

```javascript
// Array<String>
var leipzig = Leipzig({ tokenizers: ['{(.*?)}', '([^\\s]+)'] });

// String
var leipzig = Leipzig({ tokenizers: '{(.*?)}|([^\\s]+)' });

// RegExp
var leipzig = Leipzig({ tokenizers: /{(.*?)}|([^\s]+)/g });
```

### `class : Object`

Leipzig.js adds a number of <abbr>CSS</abbr> classes to the final gloss, which
you can use to style your glosses. The names of these classes can be configured
by changing the the settings on the `class` object within the `options`
configuration object.

The names, meaning, and default values of the classes are as follows:

Option            | Default                  | Description
------------------|--------------------------|------------
`glossed`         | `gloss--glossed`         | Added to each element in `elements` after the glosser has finished
`noSpace`         | `gloss--no-space`        | Added to each element in `elements` when the `spacing` option is set to false
`words`           | `gloss__words`           | Added to the group of words that are aligned
`word`            | `gloss__word`            | Added to each word in the group of aligned words
`line`            | `gloss__line`            | Added to each visible line in the gloss
`lineNum`         | `gloss__line--#`         | Added to each visible line in the gloss. The number at the end is a zero-indexed index of the line in the gloss, and can be used to style individual lines
`freeTranslation` | `gloss__line--free`      | The free translation line
`original`        | `gloss__line--original`  | The original language line
`noAlign`         | `gloss__line--no-align`  | Can be manually added to tell the parser to skip a line when aligning words
`abbr`            | `gloss__abbr`            | Added to morpheme abbreviations by the auto-tagger

The following example shows the class structure of what a gloss looks like after
being fully parsed and formatted:

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

If the class names of the last three options &ndash; `class.freeTranslation`,
`class.original`, and `class.noAlign` &ndash; are manually added to the html
markup, they will be skipped by the Leipzig.js glosser during parsing, and will
not be word-aligned with the other text.

**<abbr>NB:</abbr>** If a line is manually skipped by adding the
`class.noAlign` class, it might interfere with the automated Free Translation and
Original Language line detection. If this happens, you will have to manually
add the relevant classes to the underlying markup.

## `Leipzig#gloss()`

```javascript
Leipzig.gloss() -> Void
```

This method runs the glosser over the elements that were specified when
initializing the Leipzig object.

---

# License

Leipzig.js is licensed under the ISC License.

For details, please see the `LICENSE` file.
