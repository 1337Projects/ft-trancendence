import { SvgElm } from "./Path.js";

export class Rect implements SvgElm   {

    private _rect : SVGRectElement;


    constructor(x : number, y : number, w : number, h : number) {
        this._rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        this._rect.setAttribute("stroke", "black")
        this._rect.setAttribute("fill", "none")
        this._rect.setAttribute("x", String(x))
        this._rect.setAttribute("y", String(y))
        this._rect.setAttribute("width", `${w}`)
        this._rect.setAttribute("height", `${h}`)
        this._rect.setAttribute("rx", `${5}`)
        this._rect.setAttribute("ry", `${5}`)
    }

    public getElm() {
        return this._rect
    }
}