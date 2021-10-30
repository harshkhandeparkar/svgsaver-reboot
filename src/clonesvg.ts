/* Some utilities for cloning SVGs with inline styles */
import { SVGStyles, SVGAllowedAttrs, SVGAttrs } from './constants';

/**
 * Removes attributes that are not valid for SVGs.
 *
 * @param el The element to clean.
 * @param allowedAttrs List of allowed attributes.
 * @param allowedStyles List of allowed style attributes.
 */
function cleanAttrs(
  el: SVGElement,
  allowedAttrs: string[],
  allowedStyles: SVGStyles
) {
  if (allowedAttrs.length === 0) return;

  for (let i = 0; i < el.attributes.length; i++) {
    let attr = el.attributes.item(i);

    if (
      !Object.keys(allowedStyles).includes(attr.name) &&
      !allowedAttrs.includes(attr.name)
    ) el.removeAttribute(attr.name);
  }
}

/**
 * Cleans style properties of a child SVG element.
 * @param tgt Target element to clean.
 * @param parentStyles Styles of the parent SVG element.
 */
function cleanStyle(
  tgt: SVGElement,
  parentStyles?: CSSStyleDeclaration
) {
  parentStyles = parentStyles ?? tgt.parentElement.style;

  SVGAllowedAttrs.forEach((key) => {
    if (tgt.style[key] === parentStyles[key]) {
      tgt.style.removeProperty(key);
    }
  })
}

/**
 * Copies computed styles form one source element to target element.
 *
 * @param source Source element.
 * @param target Target element.
 * @param stylesToCopy List of styles to copy.
 */
function copyComputedStyles(
  source: HTMLElement | SVGElement,
  target: HTMLElement | SVGElement,
  stylesToCopy: SVGStyles
) {
  const computedStyles = document.defaultView.getComputedStyle(source);

  for (let property in stylesToCopy) {
    target.style.setProperty(property, computedStyles[property] ?? stylesToCopy[property]);
  }
}

/**
 * Reboot Author: This function was in the code. I still don't fully understand what it does.
 *
 * @param src who
 * @param tgt knows
 * @param down probably
 * @param up important
 */
function DOMWalk(
  src: SVGElement,
  tgt: SVGElement,
  down: (src: SVGElement, tgt: SVGElement) => void,
  up: (src: SVGElement, tgt: SVGElement) => void
) {
  down(src, tgt);
  const children = src.childNodes as NodeListOf<SVGElement>;

  for (let i = 0; i < children.length; i++) {
    DOMWalk(children[i], tgt.childNodes[i] as SVGElement, down, up);
  }

  up(src, tgt);
}

/**
 * Returns a deep clone with cleaned attributes and properties of the source svg.
 *
 * @param src Source SVG element.
 * @param attrs List of allowed attributes.
 * @param styles List of allowed styles.
 */
export function cloneSVG(
  src: SVGSVGElement,
  attrs: SVGAttrs,
  styles: SVGStyles
) {
  const clonedSVG: SVGSVGElement = src.cloneNode(true) as SVGSVGElement;

  DOMWalk(
    src,
    clonedSVG,
    (src: SVGElement, tgt: SVGElement) => {
      if (tgt.style) copyComputedStyles(src, tgt, styles);
    },
    (src: SVGElement, tgt: SVGElement) => {
      if (tgt.style && tgt.parentNode) cleanStyle(tgt);

      if (tgt.attributes) cleanAttrs(tgt, attrs, styles);
    }
  )

  return clonedSVG;
}
