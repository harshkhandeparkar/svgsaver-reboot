import { SVGAllowedAttrs, SVGAllowedStyles } from './constants';
import { cloneSVG } from './clonesvg';
import { saveDataURL, savePNG, loadCanvasImage, saveBlob } from './save';
import { isDefined, isFunction, getFilename, PromiseResolve } from './utils';

export class SVGSaver {
  svg: SVGSVGElement;

  /**
   * Converts and saves an SVG element as a PNG or SVG image.
   * @param svg The SVG to be converted/saved.
   *
   * @example
   * ```ts
   * const saver = new SVGSaver(document.getElementById('svg'));
   * await saver.saveAsPNG('image.png'); // asynchronous
   *
   * console.log('saved image with data URL: ', saver.getSVGDataURL());
   * ```
   */
  constructor(svg?: SVGSVGElement) {
    this.loadNewSVG(
      svg ??
      document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    )
  }

  /**
   * Load a different SVG.
   *
   * @param svg New SVG to load.
   */
  loadNewSVG(svg: SVGSVGElement) {
    this.svg = cloneSVG(svg, SVGAllowedAttrs, SVGAllowedStyles);
  }

  /**
  * Returns the SVG text after cleaning
  *
  * @param el The element to copy.
  * @returns SVG text after cleaning
  */
  private getSVG(): string {
    const xml = this.svg.outerHTML;

    if (xml) {
      return xml;
    }

    return (new window.XMLSerializer()).serializeToString(this.svg);
  }

  /**
  * Returns the SVG, after cleaning, as a text/xml Blob.
  *
  * @returns SVG as a text/xml Blob.
  */
  getSVGBlob(): Blob {
    const xml = this.getSVG();

    return new Blob([xml], { type: 'text/xml' });
  }

  /**
  * Returns the SVG, after cleaning, as a image/svg+xml;base64 encoded dataURL string.
  *
  * @returns SVG as image/svg+xml;base64 encoded dataURL string.
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
  * Saves the SVG as a `.svg` file.
  *
  * @param filename The name of the file to save, defaults to the SVG title or `untitled.svg`.
  */
  saveAsSVG(filename?: string) {
    const saveFilename = getFilename(this.svg, filename, 'svg');

    if (isFunction(Blob)) {
      saveBlob(this.getSVGBlob(), saveFilename);
    }

    saveDataURL(this.getSVGDataURL(), saveFilename);
  }

  /**
  * Gets the PNG dataURL of the SVG.
  *
  * @async Returns a promise that resolves with the PNG data URL.
  */
  async getPNGDataURL() {
    const canvas = await loadCanvasImage(this.getSVGDataURL())

    return canvas.toDataURL('image/png');
  }

  /**
   * Gets the PNG Blob of the SVG.
   *
   * @async Returns a promise that resolves with the PNG Blob.
   */
  async getPNGBlob() {
    const canvas = await loadCanvasImage(this.getSVGDataURL());

    return new Promise(
      (resolve: PromiseResolve<Blob>) => {
        canvas.toBlob(resolve, 'image/png');
      }
    )
  }

  /**
  * Saves the SVG as a PNG file.
  *
  * @param filename The name of the file to save, defaults to the SVG title or `untitled.png`.
  * @async
  */
  async saveAsPNG(filename?: string) {
    const saveFilename = getFilename(this.svg, filename, 'png');

    await savePNG(this.getSVGDataURL(), saveFilename);
  }
}