import { Rect } from "./shapes/Rect.js"
import { PlayerPlaceHolder, RectLine } from "./shapes/RectLine.js"
import { Svg } from "./shapes/Svg.js"
import { MatchType, PlayerType, RoundType } from "./types.js";


export function drawTournment(data : any) {
    const builder = new Builder(data)
    builder.draw_rounds(data, 0)
    return builder.getSvg()
}


class Builder {
    readonly width : number;
    readonly height : number;
    private _data : RoundType[][];
    private _root ;

    public getSvg() {
        return this._root.getElm()
    }


    constructor(data : RoundType[][]) {
        this.width = 200
        this.height = 100
        this._data = data
        this._root = new Svg({w : this.width, h : this.height}, data.length)
    }

    draw_final(match : MatchType, startx : number, starty : number) {
        
        for (const [key, value] of Object.entries(match)) {
            const rect = new Rect(startx, starty + 30, 50, 50)
            this._root.append(rect)
            if (typeof(value) != 'string') {
                const pp = new PlayerPlaceHolder(startx, starty + 30, 50, 50, value as PlayerType)
                this._root.append(pp)
            }
            startx += 150
        }
    }

    draw_match(match : MatchType, startx : number, starty : number, dx : number, depth : number) {
        const h = (this.height * (this._data.length - depth)) / (this._data[depth].length / 2)
        // const r = new Rect(startx, starty, 50, h)
        // root.append(r)
        let d = 1;
        for (const [key, value] of Object.entries(match)) {
            const rect = new RectLine(
                startx,
                starty + ((h - 80) / 2),
                50,
                40,
                d,
                dx,
                value
            )
            this._root.append(rect)

            starty += 50
            d *= -1
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
                this.draw_match(match, globs.width - 50 + globs.startx, globs.starty + (globs.match_height * (index - (round.length / 2))) , -1, depth)
            }
        })
        this.draw_rounds(arr, depth + 1)
    }
}
