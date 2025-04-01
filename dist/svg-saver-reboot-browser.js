(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SVGSaver = factory());
})(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var build = {};

	var svgsaver = {};

	var constants = {};

	Object.defineProperty(constants, "__esModule", { value: true });
	constants.SVGAllowedAttrs = constants.SVGAllowedStyles = void 0;
	/** List of allowed SVG style properties with default values. */
	constants.SVGAllowedStyles = {
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
	/** List of allowed direct SVG attributes. */
	var SVGDirectAttrs = [
	    'id', 'xml: base', 'xml: lang', 'xml: space',
	    'height', 'result', 'width', 'x', 'y',
	    'xlink: href',
	    'href',
	    'style', 'class',
	    'd', 'pathLength',
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
	    'viewBox', 'version',
	    'preserveAspectRatio', 'xmlns',
	    'points',
	    'offset',
	    'xlink:href'
	];
	/** List of all allowed SVG attributes. */
	constants.SVGAllowedAttrs = SVGDirectAttrs;

	var clonesvg = {};

	Object.defineProperty(clonesvg, "__esModule", { value: true });
	clonesvg.cloneSVG = void 0;
	/* Some utilities for cloning SVGs with inline styles */
	var constants_1$1 = constants;
	/**
	 * Removes attributes that are not valid for SVGs.
	 *
	 * @param el The element to clean.
	 * @param allowedAttrs List of allowed attributes.
	 * @param allowedStyles List of allowed style attributes.
	 */
	function cleanAttrs(el, allowedAttrs, allowedStyles) {
	    if (allowedAttrs.length === 0)
	        return;
	    for (var i = 0; i < el.attributes.length; i++) {
	        var attr = el.attributes.item(i);
	        if (!Object.keys(allowedStyles).includes(attr.name) &&
	            !allowedAttrs.includes(attr.name))
	            el.removeAttribute(attr.name);
	    }
	}
	/**
	 * Cleans style properties of a child SVG element.
	 * @param tgt Target element to clean.
	 * @param parentStyles Styles of the parent SVG element.
	 */
	function cleanStyle(tgt, parentStyles) {
	    parentStyles = parentStyles !== null && parentStyles !== void 0 ? parentStyles : tgt.parentElement.style;
	    constants_1$1.SVGAllowedAttrs.forEach(function (key) {
	        if (tgt.style[key] === parentStyles[key]) {
	            tgt.style.removeProperty(key);
	        }
	    });
	}
	/**
	 * Copies computed styles form one source element to target element.
	 *
	 * @param source Source element.
	 * @param target Target element.
	 * @param stylesToCopy List of styles to copy.
	 */
	function copyComputedStyles(source, target, stylesToCopy) {
	    var _a;
	    var computedStyles = document.defaultView.getComputedStyle(source);
	    for (var property in stylesToCopy) {
	        target.style.setProperty(property, (_a = computedStyles[property]) !== null && _a !== void 0 ? _a : stylesToCopy[property]);
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
	function DOMWalk(src, tgt, down, up) {
	    down(src, tgt);
	    var children = src.childNodes;
	    for (var i = 0; i < children.length; i++) {
	        DOMWalk(children[i], tgt.childNodes[i], down, up);
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
	function cloneSVG(src, attrs, styles) {
	    var clonedSVG = src.cloneNode(true);
	    DOMWalk(src, clonedSVG, function (src, tgt) {
	        if (tgt.style)
	            copyComputedStyles(src, tgt, styles);
	    }, function (src, tgt) {
	        if (tgt.style && tgt.parentNode)
	            cleanStyle(tgt);
	        if (tgt.attributes)
	            cleanAttrs(tgt, attrs, styles);
	    });
	    return clonedSVG;
	}
	clonesvg.cloneSVG = cloneSVG;

	var save = {};

	var utils = {};

	/* Some simple utilities */
	Object.defineProperty(utils, "__esModule", { value: true });
	utils.getFilename = utils.isDefined = utils.isFunction = void 0;
	var isFunction = function (a) { return typeof a === 'function'; };
	utils.isFunction = isFunction;
	var isDefined = function (a) { return typeof a !== 'undefined'; };
	utils.isDefined = isDefined;
	function getFilename(ext, filename) {
	    var name = filename !== null && filename !== void 0 ? filename : 'image';
	    var nameParts = name.split('.');
	    return (nameParts.length > 1 ? nameParts.slice(0, -1) : nameParts).join('.') + ".".concat(ext);
	}
	utils.getFilename = getFilename;

	var __awaiter$1 = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator$1 = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(save, "__esModule", { value: true });
	save.saveBlob = save.savePNG = save.loadCanvasImage = save.saveDataURL = void 0;
	var utils_1$1 = utils;
	/**
	 * Saves a file from its dataURL.
	 *
	 * @param dataURL dataURL of the file to be saved.
	 * @param name Name of the file to be saved.
	 */
	function saveDataURL(dataURL, name) {
	    var dl = document.createElement('a');
	    dl.setAttribute('href', dataURL);
	    dl.setAttribute('download', name);
	    dl.click();
	}
	save.saveDataURL = saveDataURL;
	/**
	 * Loads an image into a canvas from its dataURL.
	 *
	 * @async Returns a promise which resolves with the canvas element after the image is loaded.
	 * @param dataURL dataURL of the image to be saved.
	 */
	function loadCanvasImage(dataURL) {
	    return __awaiter$1(this, void 0, void 0, function () {
	        return __generator$1(this, function (_a) {
	            return [2 /*return*/, new Promise(function (resolve) {
	                    var canvas = document.createElement('canvas');
	                    var context = canvas.getContext('2d');
	                    var image = new Image();
	                    image.addEventListener('load', function () {
	                        canvas.width = image.width;
	                        canvas.height = image.height;
	                        context.drawImage(image, 0, 0);
	                        resolve(canvas);
	                    });
	                    image.addEventListener('error', function (e) {
	                        console.log('img load error', e);
	                    });
	                    image.src = dataURL;
	                })];
	        });
	    });
	}
	save.loadCanvasImage = loadCanvasImage;
	/**
	 * Saves an image as a PNG from its dataURL.
	 *
	 * @param dataURL dataURL of the image to be saved.
	 * @param name Name of the file to be saved.
	 * @async
	 */
	function savePNG(dataURL, name) {
	    return __awaiter$1(this, void 0, void 0, function () {
	        var canvas;
	        return __generator$1(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, loadCanvasImage(dataURL)];
	                case 1:
	                    canvas = _a.sent();
	                    if ((0, utils_1$1.isDefined)(canvas.toBlob)) {
	                        canvas.toBlob(function (blob) {
	                            saveBlob(blob, name);
	                        });
	                    }
	                    else {
	                        saveDataURL(canvas.toDataURL('image/png'), name);
	                    }
	                    return [2 /*return*/];
	            }
	        });
	    });
	}
	save.savePNG = savePNG;
	/**
	 * Saves a file from its Blob.
	 *
	 * @param blob
	 * @param name The name of the file to be saved.
	 */
	function saveBlob(blob, name) {
	    saveDataURL(URL.createObjectURL(blob), name);
	}
	save.saveBlob = saveBlob;

	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(svgsaver, "__esModule", { value: true });
	svgsaver.SVGSaver = void 0;
	var constants_1 = constants;
	var clonesvg_1 = clonesvg;
	var save_1 = save;
	var utils_1 = utils;
	var SVGSaver = /** @class */ (function () {
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
	    function SVGSaver(svg) {
	        this.loadNewSVG(svg !== null && svg !== void 0 ? svg : document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
	    }
	    /**
	     * Load a different SVG.
	     *
	     * @param svg New SVG to load.
	     */
	    SVGSaver.prototype.loadNewSVG = function (svg) {
	        this.svg = (0, clonesvg_1.cloneSVG)(svg, constants_1.SVGAllowedAttrs, constants_1.SVGAllowedStyles);
	        this.svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
	    };
	    /**
	    * Returns the SVG text after cleaning
	    *
	    * @param el The element to copy.
	    * @returns SVG text after cleaning
	    */
	    SVGSaver.prototype.getSVG = function () {
	        return new XMLSerializer().serializeToString(this.svg);
	    };
	    /**
	    * Returns the SVG, after cleaning, as a text/xml Blob.
	    *
	    * @returns SVG as a text/xml Blob.
	    */
	    SVGSaver.prototype.getSVGBlob = function () {
	        var xml = this.getSVG();
	        return new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
	    };
	    /**
	    * Returns the SVG, after cleaning, as a image/svg+xml;base64 encoded dataURL string.
	    *
	    * @returns SVG as image/svg+xml;base64 encoded dataURL string.
	    */
	    SVGSaver.prototype.getSVGDataURL = function () {
	        return "data:image/svg+xml;base64," + btoa(this.getSVG());
	    };
	    /**
	    * Saves the SVG as a `.svg` file.
	    *
	    * @param filename The name of the file to save, defaults to the SVG title or `untitled.svg`.
	    */
	    SVGSaver.prototype.saveAsSVG = function (filename) {
	        var saveFilename = (0, utils_1.getFilename)('svg', filename);
	        (0, save_1.saveDataURL)(this.getSVGDataURL(), saveFilename);
	    };
	    /**
	    * Gets the PNG dataURL of the SVG.
	    *
	    * @async Returns a promise that resolves with the PNG data URL.
	    */
	    SVGSaver.prototype.getPNGDataURL = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var canvas;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, (0, save_1.loadCanvasImage)(this.getSVGDataURL())];
	                    case 1:
	                        canvas = _a.sent();
	                        return [2 /*return*/, canvas.toDataURL('image/png')];
	                }
	            });
	        });
	    };
	    /**
	     * Gets the PNG Blob of the SVG.
	     *
	     * @async Returns a promise that resolves with the PNG Blob.
	     */
	    SVGSaver.prototype.getPNGBlob = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var canvas;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, (0, save_1.loadCanvasImage)(this.getSVGDataURL())];
	                    case 1:
	                        canvas = _a.sent();
	                        return [2 /*return*/, new Promise(function (resolve) {
	                                canvas.toBlob(resolve, 'image/png');
	                            })];
	                }
	            });
	        });
	    };
	    /**
	    * Saves the SVG as a PNG file.
	    *
	    * @param filename The name of the file to save, defaults to the SVG title or `untitled.png`.
	    * @async
	    */
	    SVGSaver.prototype.saveAsPNG = function (filename) {
	        return __awaiter(this, void 0, void 0, function () {
	            var saveFilename;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        saveFilename = (0, utils_1.getFilename)('png', filename);
	                        return [4 /*yield*/, (0, save_1.savePNG)(this.getSVGDataURL(), saveFilename)];
	                    case 1:
	                        _a.sent();
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    return SVGSaver;
	}());
	svgsaver.SVGSaver = SVGSaver;

	(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SVGSaver = void 0;
	var svgsaver_1 = svgsaver;
	Object.defineProperty(exports, "SVGSaver", { enumerable: true, get: function () { return svgsaver_1.SVGSaver; } });
	}(build));

	var index = /*@__PURE__*/getDefaultExportFromCjs(build);

	return index;

}));
