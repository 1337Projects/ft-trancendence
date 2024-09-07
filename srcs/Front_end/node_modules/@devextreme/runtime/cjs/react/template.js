"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplate = exports.hasTemplate = exports.renderTemplate = void 0;
var react_dom_1 = __importDefault(require("react-dom"));
var React = __importStar(require("react"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var renderTemplate = function (template, model, _component) {
    var TemplateProp = template;
    var container = model.container ? model.container : model.item;
    if (typeof TemplateProp !== 'string' || !(template instanceof Element)) {
        react_dom_1.default.render(
        /* eslint-disable react/jsx-props-no-spreading */
        React.createElement(TemplateProp, __assign({}, model)), container ? model.container : model.item);
    }
};
exports.renderTemplate = renderTemplate;
var hasTemplate = function (name, props, _component) {
    var value = props[name];
    return !!value && typeof value !== 'string';
};
exports.hasTemplate = hasTemplate;
var getTemplate = function (TemplateProp, RenderProp, ComponentProp) {
    if (TemplateProp) {
        return TemplateProp.defaultProps ? function (props) { return React.createElement(TemplateProp, __assign({}, props)); } : TemplateProp;
    }
    if (RenderProp) {
        return function (props) { return RenderProp.apply(void 0, __spreadArray([], __read(('data' in props ? [props.data, props.index] : [props])))); };
    }
    if (ComponentProp) {
        return function (props) { return React.createElement(ComponentProp, __assign({}, props)); };
    }
    return '';
};
exports.getTemplate = getTemplate;
