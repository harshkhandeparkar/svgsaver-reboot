import { SVGAllowedAttrs, SVGAllowedStyles } from './constants';
import { cloneSVG } from './clonesvg';
import { saveDataURL, savePNG, loadCanvasImage } from './save';
import { getFilename, PromiseResolve } from './utils';

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

    this.svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
  }

  /**
  * Returns the SVG text after cleaning
  *
  * @param el The element to copy.
  * @returns SVG text after cleaning
  */
  private getSVG(): string {
    return this.svg.outerHTML;
  }

  /**
  * Returns the SVG, after cleaning, as a text/xml Blob.
  *
  * @returns SVG as a text/xml Blob.
  */
  getSVGBlob(): Blob {
    const xml = this.getSVG();

    return new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  }

  /**
  * Returns the SVG, after cleaning, as a image/svg+xml;base64 encoded dataURL string.
  *
  * @returns SVG as image/svg+xml;base64 encoded dataURL string.
  */
  getSVGDataURL(): string {
    return `data:image/svg+xml;base64,` + btoa(this.getSVG());
  }

  /**
  * Saves the SVG as a `.svg` file.
  *
  * @param filename The name of the file to save, defaults to the SVG title or `untitled.svg`.
  */
  saveAsSVG(filename?: string) {
    const saveFilename = getFilename('svg', filename);

    saveDataURL(this.getSVGDataURL(), saveFilename);
  }

  /**
  * Gets the PNG dataURL of the SVG.
  *
  * @async Returns a promise that resolves with the PNG data URL.
  */
  async getPNGDataURL() {
    const canvas = await loadCanvasImage(this.getSVGDataURL());

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
    const saveFilename = getFilename('png', filename);

    await savePNG(this.getSVGDataURL(), saveFilename);
  }
}