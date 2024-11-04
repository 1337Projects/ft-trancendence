import { SvgElm } from "./Path";


export class Image implements SvgElm {

    private _img : SVGImageElement;

    constructor(x : number, y : number, w : number, h : number, img : string) {
        this._img = document.createElementNS("http://www.w3.org/2000/svg", "image")
        this._img.setAttribute("width", `${w}`)
        this._img.setAttribute("height", `${h}`)
        this._img.setAttribute("x", `${x}`)
        this._img.setAttribute("y", `${y}`)
        this._img.setAttribute("href", img)
    }

    public getElm() {
        return this._img;
    }

}