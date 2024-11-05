import { Rect } from "./shapes/Rect.js"
import { RectLine } from "./shapes/RectLine.js"
import { Svg } from "./shapes/Svg.js"
import { MatchType, PlayerType } from "./types.js";
import { Image } from "./shapes/Image.js";


export function drawTournment(data : any) {
    const builder = new Builder(data)
    builder.draw_rounds(data, 0)
    return builder.getSvg()
}


class Builder {
    readonly width : number;
    readonly height : number;
    private _data : MatchType[][];
    private _root ;

    public getSvg() {
        return this._root.getElm()
    }


    constructor(data : MatchType[][]) {
        this.width = 250
        this.height = 200
        this._data = data
        this._root = new Svg({w : this.width, h : this.height}, data.length)
    }

    draw_final(match : MatchType, startx : number, starty : number) {
        
        for (const [key, value ] of Object.entries(match)) {
            if (key.includes('player')) {
                const rect = new Rect(startx, starty + 120, 70, 70)
                this._root.append(rect)
                if (typeof(value) != 'string') {
                    const image = new Image(startx, starty + 120, 70, 70, value.avatar!)
                    this._root.append(image)
                }
                startx += 170
            }
        }
    }

    draw_match(match : MatchType, startx : number, starty : number, dx : number, depth : number) {
        const h = (this.height * (this._data.length - depth)) / (this._data[depth].length / 2)
        // const r = new Rect(startx, starty, 50, h)
        // root.append(r)
        let d = 1;
        for (const [key, value] of Object.entries(match)) {
            if (key.includes('player')) {
                const rect = new RectLine(
                    startx,
                    starty + ((h - 80) / 2),
                    70,
                    70,
                    d,
                    dx,
                    value
                )
                this._root.append(rect)
    
                starty += 100
                d *= -1
            }
        }
    }


    draw_rounds(arr : MatchType[][], depth : number) {
        if (depth == arr.length) {
            return;
        }

        const globs =  {
            "width" : this.width * ((this._data.length - depth)),
            "height" : this.height * ((this._data.length - depth)),
            "startx" : (this.width / 2) * depth,
            "starty" : (this.height / 2) * depth,
            "match_height" : (this.height * ((this._data.length - depth)))  / (this._data[depth].length / 2),
        }

        // const r = new Rect(globs.startx, globs.starty, globs.width, globs.height)
        // root.append(r)
        const round = arr[depth]
        round.forEach((match : MatchType, index : number) => {
            if (round.length == 1) {
                this.draw_final(match, globs.startx, globs.starty + (globs.match_height * index))
                return;
            }
            if (index < round.length / 2) {
                this.draw_match(match, globs.startx, globs.starty + (globs.match_height * index), 1, depth)
            }
            else {
                this.draw_match(match, globs.width - 70 + globs.startx, globs.starty + (globs.match_height * (index - (round.length / 2))) , -1, depth)
            }
        })
        this.draw_rounds(arr, depth + 1)
    }
}
