export type PlayerType = {
    id : number,
    name? : string,
    user_id? : {}
}

export type MatchType = {
    "p1" :  PlayerType | string,
    "p2" :  PlayerType | string,
}

