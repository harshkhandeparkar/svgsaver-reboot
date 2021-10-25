/* Some simple utilities */

export const isFunction = (a: any) => typeof a === 'function';
export const isDefined = (a: any) => typeof a !== 'undefined';

export function getFilename(
  el: SVGSVGElement,
  ext: string,
  filename?: string
): string {
  if (!filename || filename === '') {
    filename = (el.getAttribute('title') ?? 'untitled') + '.' + ext;
  }
  return encodeURI(filename);
}