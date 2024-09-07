"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTemplate = exports.renderTemplate = void 0;
var getContainer = function (props) {
    var container = props.container || props.item;
    return (container === null || container === void 0 ? void 0 : container.get) ? container === null || container === void 0 ? void 0 : container.get(0) : container;
};
var renderTemplate = function (template, model, component) {
    var childView = component.viewContainerRef.createEmbeddedView(template, {
        $implicit: model.item,
        index: model.index,
    });
    var container = getContainer(model);
    if (container) {
        childView.rootNodes.forEach(function (element) {
            component.renderer.appendChild(container, element);
        });
    }
};
exports.renderTemplate = renderTemplate;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var hasTemplate = function (name, props, _component) {
    var value = props[name];
    return !!value && typeof value !== 'string';
};
exports.hasTemplate = hasTemplate;
