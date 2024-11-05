

export interface SvgElm {
    getElm() : SVGSVGElement | SVGPathElement | SVGRectElement | SVGGElement
}

export class Path implements SvgElm   {
    
    readonly style : string;
    private _path : SVGPathElement;

    constructor(x : number, y : number, dy : number, dx : number) {
        this.style = "fill:none;stroke:black;stroke-width:1"
        this._path = document.createElementNS("http://www.w3.org/2000/svg", "path")
        this._path.setAttribute("style", this.style)
        this._path.setAttribute("d", `M ${x} ${y} H ${x + (40 * dx)} V ${y + (70 * dy)}`)
    }

    public getElm() : SVGPathElement {
        return this._path
    }
}