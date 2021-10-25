/* Some utilities for cloning SVGs with inline styles */
import { SVGStyles, svgAllowedAttrs, SVGAttrs } from './constants';

// Removes attributes that are not valid for SVGs
function cleanAttrs(
  el: SVGElement,
  allowedAttrs: string[],
  allowedStyles: SVGStyles
) {
  if (allowedAttrs.length === 0) return;

  for (let i = 0; i < el.attributes.length; i++) {
    let attr = el.attributes.item(i);

    if (
      !Object.keys(allowedStyles).includes(attr.name) ||
      !allowedAttrs.includes(attr.name)
    ) el.removeAttribute(attr.name);
  }
}

function cleanStyle(
  tgt: SVGElement,
  parentStyles?: CSSStyleDeclaration
) {
  parentStyles = parentStyles ?? tgt.parentElement.style;

  svgAllowedAttrs.forEach((key) => {
    if (tgt.style[key] === parentStyles[key]) {
      tgt.style.removeProperty(key);
    }
  })
}

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

function domWalk(
  src: SVGElement,
  tgt: SVGElement,
  down: (src: SVGElement, tgt: SVGElement) => void,
  up: (src: SVGElement, tgt: SVGElement) => void
) {
  down(src, tgt);
  const children = src.childNodes as NodeListOf<SVGElement>;

  for (let i = 0; i < children.length; i++) {
    domWalk(children[i], tgt.childNodes[i] as SVGElement, down, up);
  }

  up(src, tgt);
}

export function cloneSvg(
  src: SVGSVGElement,
  attrs: SVGAttrs,
  styles: SVGStyles
) {
  const clonedSvg: SVGSVGElement = src.cloneNode(true) as SVGSVGElement;

  domWalk(
    src,
    clonedSvg,
    (src: SVGElement, tgt: SVGElement) => {
      if (tgt.style) copyComputedStyles(src, tgt, styles)
    },
    (src: SVGElement, tgt: SVGElement) => {
      if (tgt.style && tgt.parentNode) cleanStyle(tgt);

      if (tgt.attributes) cleanAttrs(tgt, attrs, styles);
    }
  )

  return clonedSvg;
}
