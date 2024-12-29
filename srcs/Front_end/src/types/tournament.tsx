import { UserType } from "./user"

export type TournamentDataType =  {
    rounds : MatchDataType[][]
    data : object
}

export type MatchDataType = {
    id : number
    player_1 : UserType
    player_2 : UserType
}