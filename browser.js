(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('SvgSaver', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.SvgSaver = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function isDefined(value) {
    return typeof value !== 'undefined';
  }
  function isFunction(value) {
    return typeof value === 'function';
  }
  function isUndefined(value) {
    return typeof value === 'undefined';
  }

  function getComputedStyles(node) {
    if (isDefined(node.currentStyle)) {
      return node.currentStyle;
    } else if (isDefined(window.getComputedStyle)) {
      return node.ownerDocument.defaultView.getComputedStyle(node, null);
    } else {
      return node.style;
    }
  }

  function convertComputedStyle(computed) {
    if (isDefined(window.getComputedStyle)) {
      var styles = {};
      for (var i = 0, l = computed.length; i < l; i++) {
        var prop = computed[i];
        var val = computed.getPropertyValue(prop);
        styles[prop] = val;
      }
      return styles;
    }
    return computed;
  }

  function copyStyles(source, target, defaultStyles) {
    if (defaultStyles === false) {
      return;
    }

    var srcStyles = getComputedStyles(source);

    if (defaultStyles === true) {
      for (var key in convertComputedStyle(srcStyles)) {
        target.style[key] = srcStyles[key];
      }
      return;
    }

    var parStyles = getComputedStyles(target.parentNode);

    for (var key in defaultStyles) {
      var src = srcStyles[key];
      if (src && src !== defaultStyles[key] && src !== parStyles[key]) {
        target.style[key] = src;
      }
    }
  }

  function cleanAttrs(el, attrs, styles) {
    if (attrs === true) {
      return;
    }

    Array.prototype.slice.call(el.attributes).forEach(function (attr) {
      if (attr.specified) {
        if (attrs === false || isUndefined(styles[attr.name]) && attrs.indexOf(attr.name) < 0) {
          el.removeAttribute(attr.name);
        }
      }
    });
  }

  function cloneSvg(src, attrs, styles) {
    var clonedSvg = src.cloneNode(true);
    var srcChildren = src.querySelectorAll('*');

    Array.prototype.slice.call(clonedSvg.querySelectorAll('*')).forEach(function (target, index) {
      copyStyles(srcChildren[index], target, styles);
      cleanAttrs(target, attrs, styles);
    });

    return clonedSvg;
  }

  var svgStyles = {
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
    'paint-order': 'normal',
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

  var svgAttrs = ['id', 'xml:base', 'xml:lang', 'xml:space', 'height', 'result', 'width', 'x', 'y', 'xlink:href', 'style', 'class', 'd', 'pathLength', 'x', 'y', 'dx', 'dy', 'glyphRef', 'format', 'x1', 'y1', 'x2', 'y2', 'rotate', 'textLength', 'cx', 'cy', 'r', 'rx', 'ry', 'fx', 'fy', 'width', 'height', 'refX', 'refY', 'orient', 'markerUnits', 'markerWidth', 'markerHeight', 'maskUnits', 'transform', 'viewBox', 'version', 'preserveAspectRatio', 'xmlns', 'points', 'offset'];

  var DownloadAttributeSupport = typeof document !== 'undefined' && 'download' in document.createElement('a');

  var SvgSaver = (function () {
    function SvgSaver() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, SvgSaver);

      this.attrs = opts.attrs === undefined ? svgAttrs : opts.attrs;
      this.styles = opts.styles === undefined ? svgStyles : opts.styles;
    }

    _createClass(SvgSaver, [{
      key: 'getHTML',
      value: function getHTML(el) {
        var svg = cloneSvg(el, this.attrs, this.styles);

        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('version', 1.1);

        svg.setAttribute('width', svg.getAttribute('width') || '500');
        svg.setAttribute('height', svg.getAttribute('height') || '900');

        return svg.outerHTML || new window.XMLSerializer().serializeToString(svg);
      }
    }, {
      key: 'getBlob',
      value: function getBlob(el) {
        var html = this.getHTML(el);
        return new Blob([html], { type: 'text/xml' });
      }
    }, {
      key: 'getUri',
      value: function getUri(el) {
        var html = this.getHTML(el);
        if (isDefined(window.btoa)) {
          return 'data:image/svg+xml;base64,' + window.btoa(html);
        }
        return 'data:image/svg+xml,' + encodeURIComponent(html);
      }
    }, {
      key: 'asSvg',
      value: function asSvg(el, filename) {
        if (!filename || filename === '') {
          filename = el.getAttribute('title');
          filename = (filename || 'untitled') + '.svg';
        }

        if (isDefined(window.saveAs) && isFunction(Blob)) {
          saveAs(this.getBlob(el), filename);
        } else {
          saveUri(this.getUri(el), filename);
        }
        return this;
      }
    }, {
      key: 'asPng',
      value: function asPng(el, filename) {
        if (!filename || filename === '') {
          filename = el.getAttribute('title');
          filename = (filename || 'untitled') + '.png';
        }

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        var image = new Image();
        image.onload = function () {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);

          if (isDefined(window.saveAs) && isDefined(canvas.toBlob)) {
            canvas.toBlob(function (blob) {
              saveAs(blob, filename);
            });
          } else {
            var uri = canvas.toDataURL('image/png');
            saveUri(uri, filename);
          }
        };
        image.src = this.getUri(el);
        return true;
      }
    }]);

    return SvgSaver;
  })();

  module.exports = SvgSaver;
});
