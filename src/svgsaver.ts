/* global Blob */

import {svgStyles, inheritableAttrs} from './collection';
import {cloneSvg} from './clonesvg';
import {saveUri, savePng, loadCanvasImage, saveBlob} from './saveuri';
import {isDefined, isFunction, getFilename} from './utils';

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
  svg: SVGSVGElement

  constructor(svg: SVGSVGElement) {
    this.svg = svg;
  }

  /**
  * Return the cloned SVG after cleaning
  *
  * @param el The element to copy.
  * @returns SVG text after cleaning
  * @api public
  */
  cloneSvg(el: SVGSVGElement): SVGSVGElement {
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
  * Return the SVG text after cleaning
  *
  * @param el The element to copy.
  * @returns SVG text after cleaning
  * @api public
  */
  getSvg(): string {
    const xml = this.svg.outerHTML;

    if (xml) {
      return xml;
    }

    // see http://stackoverflow.com/questions/19610089/unwanted-namespaces-on-svg-markup-when-using-xmlserializer-in-javascript-with-ie
    this.svg.removeAttribute('xmlns');
    this.svg.removeAttribute('xmlns:xlink');

    this.svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
    this.svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');

    return (new window.XMLSerializer()).serializeToString(this.svg);
  }

  /**
  * Return the SVG, after cleaning, as a text/xml Blob
  *
  * @returns SVG as a text/xml Blob
  * @api public
  */
  getSvgBlob(): Blob {
    const xml = this.getSvg();

    return new Blob([xml], { type: 'text/xml' });
  }

  /**
  * Return the SVG, after cleaning, as a image/svg+xml;base64 URI encoded string
  *
  * @param el The element to copy.
  * @returns SVG as image/svg+xml;base64 URI encoded string
  * @api public
  */
  getSvgUri(): string {
    const xml = encodeURIComponent(this.getSvg());

    if (isDefined(window.btoa)) {
      // see http://stackoverflow.com/questions/23223718/failed-to-execute-btoa-on-window-the-string-to-be-encoded-contains-characte
      return 'data:image/svg+xml;base64,' + window.btoa(unescape(xml));
    }
    return 'data:image/svg+xml,' + xml;
  }

  /**
  * Saves the SVG as a SVG file using method compatible with the browser
  *
  * @param el The element to copy.
  * @param filename The filename to save, defaults to the SVG title or 'untitled.svg'
  * @returns The SvgSaver instance
  * @api public
  */
  saveAsSvg(filename?: string): SvgSaver {
    const saveFilename = getFilename(this.svg, filename, 'svg');

    if (isFunction(Blob)) {
      saveBlob(this.getSvgBlob(), saveFilename);
      return this;
    }

    saveUri(this.getSvgUri(), saveFilename);
    return this;
  }

  /**
  * Gets the SVG as a PNG data URI.
  *
  * @param el The element to copy.
  * @param cb Call back called with the PNG data uri.
  * @api public
  */
  getPngUri(cb: (uri: string) => void) {
    return loadCanvasImage(
      this.getSvgUri(),
      (canvas) =>  cb(canvas.toDataURL('image/png'))
    )
  }

  getPngBlob(cb: (blob: Blob) => void) {
    return loadCanvasImage(
      this.getSvgUri(),
      (canvas) => canvas.toBlob(cb, 'image/png')
    )
  }

  /**
  * Saves the SVG as a PNG file using method compatible with the browser
  *
  * @param el The element to copy.
  * @param filename The filename to save, defaults to the SVG title or 'untitled.png'
  * @returns The SvgSaver instance
  * @api public
  */
  saveAsPng(filename?: string) {
    const saveFilename = getFilename(this.svg, filename, 'png');

    return savePng(this.getSvgUri(), saveFilename);
  }

}

export default SvgSaver;
