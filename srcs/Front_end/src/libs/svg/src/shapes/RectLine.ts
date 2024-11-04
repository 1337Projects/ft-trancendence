import { Path, SvgElm } from "./Path.js";
import { Rect } from "./Rect.js";
import { PlayerType } from "../types.js";

export class PlayerPlaceHolder implements SvgElm {

    private _group : SVGGElement
    private _text : SVGTextElement | null

    constructor(x : number, y : number, w : number, h : number , player : PlayerType) {

        this._group = document.createElementNS("http://www.w3.org/2000/svg", 'g') as SVGGElement
        this._text = document.createElementNS('http://www.w3.org/2000/svg', 'text') as SVGTextElement
        const rect = new Rect(x, y, w, h)
        rect.getElm().setAttribute('fill',  "#5c6bc0")

        this._text.setAttribute('x', `${(x + (w / 2)) - 4}`)
        this._text.setAttribute('y', `${(y + (h / 2)) + 4}`)
        this._text.setAttribute('fill', "#ffffff")
        this._text.setAttribute('font-size', "1em")
        this._text.textContent = player.name![0].toLocaleLowerCase()
        this._group.appendChild(rect.getElm())
        this._group.appendChild(this._text)
    }

    public getElm():  SVGGElement {
        return this._group
    }
}

export class RectLine implements SvgElm   {
    private _group : SVGGElement
    
    constructor(x : number, y : number, w : number, h : number, dy : number, dx : number, player : PlayerType | string) {

        this._group = document.createElementNS("http://www.w3.org/2000/svg", "g")

        const rect = new Rect(x, y, w, h)
        const path = new Path(x + (dx == 1 ? 50 : 0), y + (h / 2) , dy, dx)

        this._group.append(rect.getElm())
        this._group.append(path.getElm())

        if (typeof(player) !=  'string') {
            if (player.user_id) {
                // set image from user,profile.avatar
                // const image = new Image(x, y, w, h, player.img)
            } else {
                const text =  new PlayerPlaceHolder(x, y, w, h, player)
                this._group.appendChild(text.getElm())
            }
            
        }
    }
    
    public getElm() {
        return this._group
    }
}