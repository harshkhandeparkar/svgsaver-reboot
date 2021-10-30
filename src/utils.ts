/* Some simple utilities */

export const isFunction = (a: any) => typeof a === 'function';
export const isDefined = (a: any) => typeof a !== 'undefined';

export function getFilename(
  ext: string,
  filename?: string
): string {
  const name = filename ?? 'image';
  const nameParts = name.split('.');

  return nameParts.slice(0, -1).join('.') + `.${ext}`;
}

export type PromiseResolve<T> = (t: T) => void;