"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReRenderEffect = void 0;
var inferno_1 = require("inferno");
var effect_1 = require("./effect");
var createReRenderEffect = function () { return new effect_1.InfernoEffect(function () {
    inferno_1.rerender();
}, []); };
exports.createReRenderEffect = createReRenderEffect;
