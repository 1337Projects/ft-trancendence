"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTemplate = exports.renderTemplate = void 0;
var vue_1 = __importDefault(require("vue"));
var getSlot = function (component, slotName) { return component.$parent.$scopedSlots[slotName]; };
var mountTemplate = function (component, data, name, placeholder) { return new vue_1.default({
    el: placeholder,
    name: name,
    parent: component,
    render: function (createElement) {
        var content = getSlot(component, name)(data);
        if (!content) {
            return createElement('div');
        }
        return content[0];
    },
}); };
var renderTemplate = function (template, model, component) {
    var placeholder = document.createElement('div');
    model.container.appendChild(placeholder);
    mountTemplate(component, model.item, template, placeholder);
};
exports.renderTemplate = renderTemplate;
var hasTemplate = function (name, _props, component) { return !!component.$parent.$slots[name]; };
exports.hasTemplate = hasTemplate;
