# Leipzig.js
**Interlinear glossing for the browser**

Leipzig.js is a small JavaScript utility that makes it easy to add
[interlinear glosses][] to webpages.

[interlinear glosses]: https://en.wikipedia.org/wiki/Interlinear_gloss

[![npm badge](https://img.shields.io/npm/v/leipzig.svg)](https://www.npmjs.com/package/leipzig)
![bower badge](https://img.shields.io/bower/v/leipzig.svg)

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [Documentation](#documentation)
- [Examples](#examples)
- [Contributing](#contributing)
- [Tests](#tests)
- [Other Solutions](#othersolutions)
- [License](#license)

---

## Overview

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

### Enter Leipzig.js

Leipzig.js aims to be a simple, lightweight solution for interlinear glossing
on the web. By relying on existing HTML tags, it degrades
gracefully when either JavaScript or CSS is not present.

While basic usage of Leipzig.js is dead simple (see the Usage section below),
more customizable glossing can be achieved by using the library's flexible
API.

Glosses formatted with Leipzig.js are [responsive][], and contain numerous
CSS classes that can be used to style individual lines in the
gloss.

[responsive]: https://en.wikipedia.org/wiki/Responsive_web_design

Leipzig.js tries to strike the right balance between ease of creation
and beauty of output. It should be easy enough to use for people new to web
authorship, while remaining powerful and customizable enough for people that
want more control over their interlinear glosses.

### Compatability & Dependencies

Leipzig.js has no front-end dependencies, and _should_ work on most modern browsers, including IE9+.

### Further Reading

For more information about interlinear glossing, visit the homepage for the
[Leipzig Glossing
Rules](https://www.eva.mpg.de/lingua/resources/glossing-rules.php) (from which
Leipzig.js gets its name). The Leipzig Glossing rules homepage also contains
references to other important works on interlinear glossing.

[Back to Top ↑](#leipzigjs)

---

## Usage

### 1. Download It (Optional)

You can install Leipzig.js using [`npm`](https://npmjs.com/package/leipzig) or [`Bower`](https://bower.io), or by downloading the latest version from the github repository:

```sh
$ npm install --save leipzig
$ bower install --save leipzig
$ git clone https://github.com/bdchauvette/leipzig.js.git
```

Alternatively, you can skip installing Leipzig.js on your own server, and can
use the [jsDelivr](http://www.jsdelivr.com/) CDN as described in
the next step.

### 2. Include It

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
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/leipzig@latest/dist/leipzig.min.css">

<!-- JavaScript -->
<script src="//cdn.jsdelivr.net/npm/leipzig@latest/dist/leipzig.min.js"></script>
```

For more information about jsDelivr, you can visit the [jsDelivr
homepage](http://www.jsdelivr.com) or read the following blog posts:

- [jsDelivr - the advanced open source public
  CDN](https://hacks.mozilla.org/2014/03/jsdelivr-the-advanced-open-source-public-cdn/)
- [jsDelivr does it better](https://www.maxcdn.com/blog/jsdelivr-better/)

### 3. Mark Up Your Examples

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

### 4. Gloss ’Em

Finally, you just need to tell Leipzig.js to go to work by adding the following
`<script>` somewhere _after_ the one you added in Step 2:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    Leipzig().gloss();
  });
</script>
```

If you're using [jQuery][], you can use the following script instead:

```
<script>
  $(function() { Leipzig().gloss(); });
</script>
```

[jQuery]: https://jquery.com/

### Minimal Example

```html
<html>
  <head>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/leipzig@latest/dist/leipzig.min.css">
  </head>
  <body>
    <div data-gloss>
      <p>Ein Beispiel</p>
      <p>DET.NOM.N.SG example</p>
      <p>‘An example’</p>
    </div>
    <script src="//cdn.jsdelivr.net/npm/leipzig@latest/dist/leipzig.min.js"></script>
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

## Documentation

Please see the [Documentation page on the wiki](https://github.com/bdchauvette/leipzig.js/wiki/Documentation).

[Back to Top ↑](#leipzigjs)

---

## Examples

Please see the [Examples page on the Leipzig.js
homepage](https://bdchauvette.github.io/leipzig.js/examples/).

[Back to Top ↑](#leipzigjs)

---

## Contributing

```sh
$ git clone https://github.com/bdchauvette/leipzig.js.git
$ cd leipzig.js
$ npm install
```

### Building

The main source files are in `src/`.

Leipzig.js uses `gulp` to build the files for distribution found in `dist/`.
The following tasks are available:

 Task   | Does
--------|------
`js`    | Transpiles and minifies the main JS file
`css`   | Compiles & minifies the main Sass stylesheet
`build` | Runs the `js` and `css` tasks
`watch` | Watches for changes to files in `src/`, then runs the appropriate task
`comb`  | Runs `csscomb` on any Sass files in `src/`

You can run these tasks by installing `gulp` (`npm i -g gulp`) then running:

```sh
$ gulp $TASKNAME # e.g. gulp build or gulp watch
```

### Testing

Leipzig.js uses a [`tape`](https://github.com/substack/tape)-based testing system.

To run the complete test suite, you'll first need to have [`browserify`](https://github.com/substack/node-browserify) and [`tape-run`](https://github.com/juliangruber/tape-run) installed globally:

```sh
$ npm i -g browserify tape-run
```

You can then run the complete test suite using:

```sh
$ npm test
```

[Back to Top ↑](#leipzigjs)

---

## Other Solutions

### Plain CSS

Both [Kevin McGowan][] and [James Tauber][] describe methods for styling
interlinear glosses using pure CSS. McGowan also hints at a JavaScript solution
that seems similar to what Leipzig.js is doing, but no code is provided.

[Kevin McGowan]: http://kbmcgowan.github.io/blog/2009/02/28/css-interlinear-glosses.html
[James Tauber]: http://jtauber.com/blog/2006/01/28/dynamic_interlinears_with_javascript_and_css/

### `interlinear`

[`interlinear`](https://github.com/parryc/interlinear), like Leipzig.js, is a
JavaScript + CSS utility that automatically formats selected HTML elements.
`interlinear` has a different feature set than Leipzig.js, and uses a different
syntax for marking up glosses. If Leipzig.js is not to your liking, I recommend
taking a look at `interlinear`.

### `glosser`
[`glosser`](https://doctoralpaca.github.io/glosser/) is a small utility for
producing interlinear glosses in plaintext or formatted for reddit.

[Back to Top ↑](#leipzigjs)

---

## Further Reading

For more information about interlinear glossing, visit the homepage for the
[Leipzig Glossing
Rules](https://www.eva.mpg.de/lingua/resources/glossing-rules.php) (from which
Leipzig.js gets its name). The Leipzig Glossing rules homepage also contains
references to other important works on interlinear glossing.

[Back to Top ↑](#leipzigjs)

## License

Leipzig.js is licensed under the ISC License.

For details, please see the `LICENSE` file.

[Back to Top ↑](#leipzigjs)
