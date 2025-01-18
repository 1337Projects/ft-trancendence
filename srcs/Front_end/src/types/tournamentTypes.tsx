import { MatchDataType } from "./gameTypes"
import { UserType } from "./userTypes"


export type TournamentContextType = {
    data : TournamentDataType,
    setData : React.Dispatch<React.SetStateAction<TournamentDataType>>,
}

export type TournamentDataType = {
    id : number,
    max_players : number,
    players : UserType[],
    tournament_name : string,
    tourament_status : string,
    created_at : string,
}


export type TournamentType =  {
    rounds : MatchDataType[][]
    data : TournamentDataType
}


export type TournamentRoomType = {
    data : TournamentDataType
    players : UserType[]
}






