import { SvgElm } from './Path.js';


export class Svg implements SvgElm {
    private _root : SVGSVGElement
    constructor(confs : {w : number, h : number}, nb : number) {
        this._root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this._root.setAttribute("viewBox", `-10 -10 ${(confs.w * nb) + 20} ${(confs.h * nb)}`)
        this._root.setAttribute("width", `${confs.w * nb}`)
        this._root.setAttribute("height", `${(confs.h * nb) + 20}`)
        this._root.setAttribute('preserveAspectRatio', 'xMinYMin meet');
    }

    public getElm() {
        return this._root
    }

    append(elm : SvgElm) {
        this._root.appendChild(elm.getElm())
    }
}