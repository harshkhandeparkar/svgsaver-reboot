/* Some utilities for cloning SVGs with inline styles */
import computedStyles from 'computed-styles';
import {} from './constants';

// Removes attributes that are not valid for SVGs
function cleanAttrs(
  el: SVGSVGElement,
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

function cleanStyle (tgt, parentStyles) {
  parentStyles = parentStyles || tgt.parentNode.style;
  inheritableAttrs.forEach(function (key) {
    if (tgt.style[key] === parentStyles[key]) {
      tgt.style.removeProperty(key);
    }
  });
}

function domWalk (src, tgt, down, up) {
  down(src, tgt);
  const children = src.childNodes;

  for (let i = 0; i < children.length; i++) {
    domWalk(children[i], tgt.childNodes[i], down, up);
  }
  up(src, tgt);
}

// Clones an SVGElement, copies approprate atttributes and styles.
export function cloneSvg(src, attrs, styles) {
  const clonedSvg = src.cloneNode(true);

  domWalk(src, clonedSvg, (src, tgt) => {
    if (tgt.style) { computedStyles(src, tgt.style, styles); }
  }, (src, tgt) => {
    if (tgt.style && tgt.parentNode) { cleanStyle(tgt); }
    if (tgt.attributes) { cleanAttrs(tgt, attrs, styles); }
  });

  return clonedSvg;
}
