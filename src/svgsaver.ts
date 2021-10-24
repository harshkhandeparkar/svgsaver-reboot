/* global Blob */

import {svgAttrs, svgStyles, inheritableAttrs} from './collection';
import {cloneSvg} from './clonesvg';
import {saveUri, savePng, createCanvas} from './saveuri';
import {isDefined, isFunction, isUndefined, isNode} from './utils';
import FileSaver from 'file-saver';

// inheritable styles may be overridden by parent, always copy for now
inheritableAttrs.forEach(function (k) {
  if (k in svgStyles) {
    svgStyles[k] = true;
  }
});

export interface ISvgSaverSettings {
  attrs?: unknown;
  styles?: unknown;
}

export class SvgSaver {
  attrs: unknown;
  styles: unknown;

  static getSvg(el: SVGSVGElement | string): SVGSVGElement {
    if (isUndefined(el) || el === '') {
      el = document.body.querySelector('svg');
    } else if (typeof el === 'string') {
      el = document.body.querySelector(el) as SVGSVGElement;
    }
    if (el && el.tagName !== 'svg') {
      el = el.querySelector('svg');
    }
    if (!isNode(el)) {
      throw new Error('svgsaver: Can\'t find an svg element');
    }

    return el as SVGSVGElement;
  }

  static getFilename(
    el: SVGSVGElement,
    ext: string,
    filename?: string
  ): string {
    if (!filename || filename === '') {
      filename = (el.getAttribute('title') ?? 'untitled') + '.' + ext;
    }
    return encodeURI(filename);
  }

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
  constructor({ attrs, styles }: ISvgSaverSettings = {}) {
    this.attrs = (attrs === undefined) ? svgAttrs : attrs;
    this.styles = (styles === undefined) ? svgStyles : styles;
  }

  /**
  * Return the cloned SVG after cleaning
  *
  * @param el The element to copy.
  * @returns SVG text after cleaning
  * @api public
  */
  cloneSVG(el: SVGSVGElement): SVGSVGElement {
    el = SvgSaver.getSvg(el);
    const svg = cloneSvg(el, this.attrs, this.styles);

    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    svg.setAttribute('version', 1.1);

    // height and width needed to download in FireFox
    svg.setAttribute('width', svg.getAttribute('width') || '500');
    svg.setAttribute('height', svg.getAttribute('height') || '900');

    return svg;
  }

  /**
  * Return the SVG HTML text after cleaning
  *
  * @param el The element to copy.
  * @returns SVG text after cleaning
  * @api public
  */
  getHTML(el: SVGSVGElement): string {
    const svg = this.cloneSVG(el);

    var html = svg.outerHTML;
    if (html) {
      return html;
    }

    // see http://stackoverflow.com/questions/19610089/unwanted-namespaces-on-svg-markup-when-using-xmlserializer-in-javascript-with-ie
    svg.removeAttribute('xmlns');
    svg.removeAttribute('xmlns:xlink');

    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');

    return (new window.XMLSerializer()).serializeToString(svg);
  }

  /**
  * Return the SVG, after cleaning, as a text/xml Blob
  *
  * @param el The element to copy.
  * @returns SVG as a text/xml Blob
  * @api public
  */
  getBlob(el: SVGSVGElement): Blob {
    const html = this.getHTML(el);
    return new Blob([html], { type: 'text/xml' });
  }

  /**
  * Return the SVG, after cleaning, as a image/svg+xml;base64 URI encoded string
  *
  * @param el The element to copy.
  * @returns SVG as image/svg+xml;base64 URI encoded string
  * @api public
  */
  getUri(el: SVGSVGElement): string {
    const html = encodeURIComponent(this.getHTML(el));
    if (isDefined(window.btoa)) {
      // see http://stackoverflow.com/questions/23223718/failed-to-execute-btoa-on-window-the-string-to-be-encoded-contains-characte
      return 'data:image/svg+xml;base64,' + window.btoa(unescape(html));
    }
    return 'data:image/svg+xml,' + html;
  }

  /**
  * Saves the SVG as a SVG file using method compatible with the browser
  *
  * @param el The element to copy.
  * @param filename The filename to save, defaults to the SVG title or 'untitled.svg'
  * @returns The SvgSaver instance
  * @api public
  */
  asSvg(el: SVGSVGElement, filename?: string): SvgSaver {
    el = SvgSaver.getSvg(el);
    filename = SvgSaver.getFilename(el, filename, 'svg');

    if (isFunction(Blob)) {
      FileSaver.saveAs(this.getBlob(el), filename);
      return this;
    }

    saveUri(this.getUri(el), filename);
    return this;
  }

  /**
  * Gets the SVG as a PNG data URI.
  *
  * @param el The element to copy.
  * @param cb Call back called with the PNG data uri.
  * @api public
  */
  getPngUri(
    el: SVGSVGElement,
    cb: (uri: string) => void
  ) {
    el = SvgSaver.getSvg(el);
    var filename = SvgSaver.getFilename(el, null, 'png');

    return createCanvas(this.getUri(el), filename, function (canvas) {
      cb(canvas.toDataURL('image/png'));
    })
  }

  /**
  * Saves the SVG as a PNG file using method compatible with the browser
  *
  * @param el The element to copy.
  * @param filename The filename to save, defaults to the SVG title or 'untitled.png'
  * @returns The SvgSaver instance
  * @api public
  */
  asPng(el: SVGSVGElement, filename?: string) {
    el = SvgSaver.getSvg(el);
    filename = SvgSaver.getFilename(el, filename, 'png');

    return savePng(this.getUri(el), filename);
  }

}

export default SvgSaver;
