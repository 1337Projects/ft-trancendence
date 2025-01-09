import { UserType } from "./user"

export type TournamentDataType =  {
    rounds : MatchDataType[][]
    data : object
}

export type MatchDataType = {
    id : number
    player1 : UserType
    player2 : UserType
    score1 : number
    score2 : number
    updated_at : string
    created_at : string
    winner : UserType | null
    loser : UserType | null
}