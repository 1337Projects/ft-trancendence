export type PlayerType = {
    id : number,
    name? : string,
    user_id? : {},
    avatar? : string
}

export type MatchType = {
    "p1" :  PlayerType | string,
    "p2" :  PlayerType | string,
}

