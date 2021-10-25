# SVGSaver Reboot
***
[Fork] A modern, updated, typescript version of the popular Javascript library [Hypercubed/svgsaver](https://github.com/Hypercubed/svgsaver).
***

**NOTE: THIS LIBRARY IS NOT READY FOR PRODUCTION AND IS ONLY USED INTERNALLY IN [rainbow-board](https://github.com/harshkhandeparkar/rainbow-board).**

### What is Different From Original
\[TBD\]

Download an SVG element as an SVG or PNG file, including CSS defined styles.

[![NPM version][npm-badge]][npm]
[![Downloads][download-badge]][npm]
![Downloads][bower-badge]

[![Build Status][travis-image]][travis-url]
[![Codacy Badge][codacy-badge]][Codacy]

[![js-semistandard-style][standard-badge]][semistandard]
[![License][license-badge]][MIT License]

## Features
- Download `<svg>` by element object.
- Download as SVG or PNG file.
- Copies SVG element styles as rendered in the browser, including styles defined in CSS style sheets.
- Copies only SVG relevant and non-default styles.  [See here](http://www.w3.org/TR/SVG/propidx.html).
- Computed styles are in-lined for maximum compatibility.

## Install

### Node

```js
npm install svgsaver
```

### Bower

```js
bower install svgsaver
```

### JSPM

```js
jspm install svgsaver=npm:svgsaver
```

## Usage

*For maximum compatibility across browsers include [eligrey/FileSaver.js/](https://github.com/eligrey/FileSaver.js) and [eligrey/canvas-toBlob.js](https://github.com/eligrey/canvas-toBlob.js). See [Compatibility-Chart](https://github.com/Hypercubed/svgsaver/wiki/Compatibility-Chart) for more information.*

### Example

```
const SvgSaver = require('svgsaver');                 // if using CommonJS environment
const svgsaver = new SvgSaver();                      // creates a new instance
const svg = document.querySelector('#mysvg');         // find the SVG element
svgsaver.asSvg(svg);                                // save as SVG
```

## Acknowledgments
Forked from the popular library [Hypercubed/svgsaver](https://github.com/Hypercubed/svgsaver).

Based on previous work on [Hypercubed/angular-downloadsvg-directive](https://github.com/Hypercubed/angular-downloadsvg-directive).  Some portions of this code inspired by [raw](https://github.com/densitydesign/raw/blob/master/js/directives.js) and [moagrius/copycss](https://github.com/moagrius/copycss).

## License
[MIT License](LICENSE.md)