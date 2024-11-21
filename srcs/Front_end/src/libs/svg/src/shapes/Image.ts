import { SvgElm } from "./Path";


export class Image implements SvgElm {

    private _img : SVGImageElement;

    constructor(x : number, y : number, w : number, h : number, img : string) {
        this._img = document.createElementNS("http://www.w3.org/2000/svg", "image")
        this._img.setAttribute("width", `${w - 10}`)
        this._img.setAttribute("height", `${h - 10}`)
        this._img.setAttribute("x", `${x + 5}`)
        this._img.setAttribute("y", `${y + 5}`)
        this._img.setAttribute("href", img)
    }

    public getElm() {
        return this._img;
    }

}