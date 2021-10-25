# SVGSaver Reboot
Download an SVG element as an SVG or PNG file, including CSS defined styles.
***
[Fork] A modern, updated, typescript version of the popular Javascript library [Hypercubed/svgsaver](https://github.com/Hypercubed/svgsaver).
***

**NOTE: THIS LIBRARY IS NOT READY FOR PRODUCTION AND IS ONLY USED INTERNALLY IN [rainbow-board](https://github.com/harshkhandeparkar/rainbow-board).**

### Table of Contents
- [Documentation](https://harshkhandeparkar.github.io/svgsaver-reboot).
- [What is Different From Original](#what-is-different-from-original).
- [Features (Original)](#features-original)
- [Installation](#installation)
- [Example](#example)
- [Acknowledgements](#acknowledgements)
- [License](#license)


### What is Different From Original
- New modern API suitable for environments like Electron. Documentation [here](https://harshkhandeparkar.github.io/svgsaver-reboot).
- Completely rewritten in typescript with typings and JSDoc.
- Callbacks converted to Promises/async_await.
- Old JS syntax such as `var` replaced with newer alternatives.
- **REMOVED**: Support for older browsers. Latest APIs are used instead.

### Features (Original)
- Download `<svg>` by element object.
- Download as SVG or PNG file.
- Copies SVG element styles as rendered in the browser, including styles defined in CSS style sheets.
- Copies only SVG relevant and non-default styles. [See here](http://www.w3.org/TR/SVG/propidx.html).
- Computed styles are in-lined for maximum compatibility.

### Installation
The package is available on [NPM](https://npmjs.com) under the name [`svgsaver-reboot`](https://www.npmjs.com/package/svgsaver-reboot)

### Example
```ts
import { SVGSaver } from 'svgsaver-reboot';
const svg = document.querySelector('#mysvg');
const saver = new SVGSaver(svg); // Can convert to PNG, dataURL, Blob or save directly.
saver.saveAsSVG(svg);
```

### Acknowledgments
Forked from the popular library [Hypercubed/svgsaver](https://github.com/Hypercubed/svgsaver).

Based on previous work on [Hypercubed/angular-downloadsvg-directive](https://github.com/Hypercubed/angular-downloadsvg-directive).  Some portions of this code inspired by [raw](https://github.com/densitydesign/raw/blob/master/js/directives.js) and [moagrius/copycss](https://github.com/moagrius/copycss).

### License
[MIT License](LICENSE.md)

****