/* global saveAs, Blob */

import {svgAttrs, svgStyles, inheritableAttrs} from './collection';
import {cloneSvg} from './clonesvg';
import {saveUri, savePng} from './saveuri';
import {isDefined, isFunction, isUndefined, isNode} from './utils';

// inheritable styles may be overridden by parent, always copy for now
inheritableAttrs.forEach(function (k) {
  if (k in svgStyles) {
    svgStyles[k] = true;
  }
});

function getSvg (el) {
  if (isUndefined(el) || el === '') {
    el = document.body.querySelector('svg');
  } else if (typeof el === 'string') {
    el = document.body.querySelector(el);
  }
  if (el && el.tagName !== 'svg') {
    el = el.querySelector('svg');
  }
  if (!isNode(el)) {
    throw new Error('svgsaver: Can\'t find an svg element');
  }
  return el;
}

function getFilename (el, filename, ext) {
  if (!filename || filename === '') {
    filename = (el.getAttribute('title') || 'untitled') + '.' + ext;
  }
  return encodeURI(filename);
}

export class SvgSaver {

  /**
  * SvgSaver constructor.
  * @constructs SvgSaver
  * @api public
  *
  * @example
  * var svgsaver = new SvgSaver();                      // creates a new instance
  * var svg = document.querySelector('#mysvg');         // find the SVG element
  * svgsaver.asSvg(svg);                                // save as SVG
  */
  constructor ({ attrs, styles } = {}) {
    this.attrs = (attrs === undefined) ? svgAttrs : attrs;
    this.styles = (styles === undefined) ? svgStyles : styles;
  }

  /**
  * Return the SVG HTML text after cleaning
  *
  * @param {SVGElement} el The element to copy.
  * @returns {String} SVG text after cleaning
  * @api public
  */
  getHTML (el) {
    el = getSvg(el);
    const svg = cloneSvg(el, this.attrs, this.styles);

    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('version', 1.1);

    // height and width needed to download in FireFox
    svg.setAttribute('width', svg.getAttribute('width') || '500');
    svg.setAttribute('height', svg.getAttribute('height') || '900');

    return svg.outerHTML || (new window.XMLSerializer()).serializeToString(svg);
  }

  /**
  * Return the SVG, after cleaning, as a text/xml Blob
  *
  * @param {SVGElement} el The element to copy.
  * @returns {Blog} SVG as a text/xml Blob
  * @api public
  */
  getBlob (el) {
    const html = this.getHTML(el);
    return new Blob([html], { type: 'text/xml' });
  }

  /**
  * Return the SVG, after cleaning, as a image/svg+xml;base64 URI encoded string
  *
  * @param {SVGElement} el The element to copy.
  * @returns {String} SVG as image/svg+xml;base64 URI encoded string
  * @api public
  */
  getUri (el) {
    const html = this.getHTML(el);
    if (isDefined(window.btoa)) {
      return 'data:image/svg+xml;base64,' + window.btoa(html);
    }
    return 'data:image/svg+xml,' + encodeURIComponent(html);
  }

  /**
  * Saves the SVG as a SVG file using method compatible with the browser
  *
  * @param {SVGElement} el The element to copy.
  * @param {string} [filename] The filename to save, defaults to the SVG title or 'untitled.svg'
  * @returns {SvgSaver} The SvgSaver instance
  * @api public
  */
  asSvg (el, filename) {
    el = getSvg(el);
    filename = getFilename(el, filename, 'svg');
    if (isDefined(window.saveAs) && isFunction(Blob)) {
      return saveAs(this.getBlob(el), filename);
    } else {
      return saveUri(this.getUri(el), filename);
    }
  }

  /**
  * Saves the SVG as a PNG file using method compatible with the browser
  *
  * @param {SVGElement} el The element to copy.
  * @param {string} [filename] The filename to save, defaults to the SVG title or 'untitled.png'
  * @returns {SvgSaver} The SvgSaver instance
  * @api public
  */
  asPng (el, filename) {
    el = getSvg(el);
    filename = getFilename(el, filename, 'png');
    return savePng(this.getUri(el), filename);
  }

}

export default SvgSaver;
