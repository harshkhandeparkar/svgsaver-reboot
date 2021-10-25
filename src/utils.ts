/* Some simple utilities */

export const isFunction = (a: any) => typeof a === 'function';
export const isDefined = (a: any) => typeof a !== 'undefined';
export const isUndefined = (a: any) => typeof a === 'undefined';
export const isObject = (a: any) => (a !== null && typeof a === 'object');

export function clone (obj: Object) {
  if (obj == null || typeof obj !== 'object') { return obj; }
  const copy = obj.constructor();
  for (const attr in obj) {
    if (obj.hasOwnProperty(attr)) { copy[attr] = obj[attr]; }
  }
  return copy;
}

// from https://github.com/npm-dom/is-dom/blob/master/index.js
export function isNode(val: any) {
  if (!isObject(val)) { return false; }
  if (isDefined(window) && isObject(window.Node)) { return val instanceof window.Node; }
  return typeof val.nodeType === 'number' && typeof val.nodeName === 'string';
}

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