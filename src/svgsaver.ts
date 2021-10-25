import { SVGAllowedAttrs, SVGAllowedStyles } from './constants';
import { cloneSVG } from './clonesvg';
import { saveDataURL, savePNG, loadCanvasImage, saveBlob } from './save';
import { isDefined, isFunction, getFilename } from './utils';

export class SVGSaver {
  svg: SVGSVGElement;

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
  cloneSVG(): SVGSVGElement {
    const svg = cloneSVG(this.svg, SVGAllowedAttrs, SVGAllowedStyles);

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
  getSVG(): string {
    const xml = this.svg.outerHTML;

    if (xml) {
      return xml;
    }

    return (new window.XMLSerializer()).serializeToString(this.svg);
  }

  /**
  * Return the SVG, after cleaning, as a text/xml Blob
  *
  * @returns SVG as a text/xml Blob
  * @api public
  */
  getSVGBlob(): Blob {
    const xml = this.getSVG();

    return new Blob([xml], { type: 'text/xml' });
  }

  /**
  * Return the SVG, after cleaning, as a image/svg+xml;base64 encoded string
  *
  * @param el The element to copy.
  * @returns SVG as image/svg+xml;base64 encoded string
  * @api public
  */
  getSVGDataURL(): string {
    const xml = encodeURIComponent(this.getSVG());

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
  saveAsSVG(filename?: string): SVGSaver {
    const saveFilename = getFilename(this.svg, filename, 'svg');

    if (isFunction(Blob)) {
      saveBlob(this.getSVGBlob(), saveFilename);
      return this;
    }

    saveDataURL(this.getSVGDataURL(), saveFilename);
    return this;
  }

  /**
  * Gets the SVG as a PNG data URL.
  *
  * @param el The element to copy.
  * @param cb Call back called with the PNG data URL.
  * @api public
  */
  getPNGDataURL(cb: (dataURL: string) => void) {
    return loadCanvasImage(
      this.getSVGDataURL(),
      (canvas) =>  cb(canvas.toDataURL('image/png'))
    )
  }

  getPNGBlob(cb: (blob: Blob) => void) {
    return loadCanvasImage(
      this.getSVGDataURL(),
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
  saveAsPNG(filename?: string) {
    const saveFilename = getFilename(this.svg, filename, 'png');

    return savePNG(this.getSVGDataURL(), saveFilename);
  }

}

export default SVGSaver;
