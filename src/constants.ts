/** List of SVG style properties with default values. */
export type SVGStyles = {
  [propertyName: string]: string
}

/** List of allowed SVG style properties with default values. */
export const SVGAllowedStyles: SVGStyles = {
  'alignment-baseline': 'auto',
  'baseline-shift': 'baseline',
  'clip': 'auto',
  'clip-path': 'none',
  'clip-rule': 'nonzero',
  'color': 'rgb(51, 51, 51)',
  'color-interpolation': 'srgb',
  'color-interpolation-filters': 'linearrgb',
  'color-profile': 'auto',
  'color-rendering': 'auto',
  'cursor': 'auto',
  'direction': 'ltr',
  'display': 'inline',
  'dominant-baseline': 'auto',
  'enable-background': '',
  'fill': 'rgb(0, 0, 0)',
  'fill-opacity': '1',
  'fill-rule': 'nonzero',
  'filter': 'none',
  'flood-color': 'rgb(0, 0, 0)',
  'flood-opacity': '1',
  'font': '',
  'font-family': 'normal',
  'font-size': 'medium',
  'font-size-adjust': 'auto',
  'font-stretch': 'normal',
  'font-style': 'normal',
  'font-variant': 'normal',
  'font-weight': '400',
  'glyph-orientation-horizontal': '0deg',
  'glyph-orientation-vertical': 'auto',
  'image-rendering': 'auto',
  'kerning': 'auto',
  'letter-spacing': '0',
  'lighting-color': 'rgb(255, 255, 255)',
  'marker': '',
  'marker-end': 'none',
  'marker-mid': 'none',
  'marker-start': 'none',
  'mask': 'none',
  'opacity': '1',
  'overflow': 'visible',
  'paint-order': 'fill',
  'pointer-events': 'auto',
  'shape-rendering': 'auto',
  'stop-color': 'rgb(0, 0, 0)',
  'stop-opacity': '1',
  'stroke': 'none',
  'stroke-dasharray': 'none',
  'stroke-dashoffset': '0',
  'stroke-linecap': 'butt',
  'stroke-linejoin': 'miter',
  'stroke-miterlimit': '4',
  'stroke-opacity': '1',
  'stroke-width': '1',
  'text-anchor': 'start',
  'text-decoration': 'none',
  'text-rendering': 'auto',
  'unicode-bidi': 'normal',
  'visibility': 'visible',
  'word-spacing': '0px',
  'writing-mode': 'lr-tb'
};

/** List of SVG attribute names. */
export type SVGAttrs = string[];

/** List of allowed direct SVG attributes. */
const SVGDirectAttrs: SVGAttrs = [
  'id', 'xml: base', 'xml: lang', 'xml: space', // Core
  'height', 'result', 'width', 'x', 'y',        // Primitive
  'xlink: href',                                // Xlink attribute
  'href',
  'style', 'class',
  'd', 'pathLength',                            // Path
  'x', 'y', 'dx', 'dy', 'glyphRef', 'format',
  'x1', 'y1', 'x2', 'y2',
  'rotate', 'textLength',
  'cx', 'cy', 'r',
  'rx', 'ry',
  'fx', 'fy',
  'width', 'height',
  'refX', 'refY', 'orient',
  'markerUnits', 'markerWidth', 'markerHeight',
  'maskUnits',
  'transform',
  'viewBox', 'version',                         // Container
  'preserveAspectRatio', 'xmlns',
  'points',                                     // Polygons
  'offset',
  'xlink:href'
]

/** List of allowed inheritable SVG attributes. */
const SVGInheritableAttrs: SVGAttrs = [
  'clip-rule',
  'color',
  'color-interpolation',
  'color-interpolation-filters',
  'color-profile',
  'color-rendering',
  'cursor',
  'direction',
  'fill',
  'fill-opacity',
  'fill-rule',
  'font',
  'font-family',
  'font-size',
  'font-size-adjust',
  'font-stretch',
  'font-style',
  'font-variant',
  'font-weight',
  'glyph-orientation-horizontal',
  'glyph-orientation-vertical',
  'image-rendering',
  'kerning',
  'letter-spacing',
  'marker',
  'marker-end',
  'marker-mid',
  'marker-start',
  'pointer-events',
  'shape-rendering',
  'stroke',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
  'text-anchor',
  'text-rendering',
  'transform',
  'visibility',
  'white-space',
  'word-spacing',
  'writing-mode'
]

/** List of all allowed SVG attributes. */
export const SVGAllowedAttrs: SVGAttrs = SVGDirectAttrs;