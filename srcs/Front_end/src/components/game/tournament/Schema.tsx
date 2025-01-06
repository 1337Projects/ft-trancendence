
import SchemaFour from '@/components/assets/schema/Schema4'
import { UserType } from '@/types/user';

export type TournamentDataType = {
    id : number,
    max_players : number,
    players : UserType[],
    tournament_name : string,
    tourament_status : string,
    created_at : string,
    mode : string,
}

export type TournamnetType = {
    rounds : []
    data : TournamentDataType
}

export default function Schema({data} : {data : TournamnetType}) {

    if (!data || !data.rounds) {
        return ("loading ....")
    }
    
    return (
        <div className="p-2">
            <div className="w-fit mx-auto h-auto mt-16">
                <SchemaFour rounds={data.rounds} />
            </div>
        </div>
    )
}