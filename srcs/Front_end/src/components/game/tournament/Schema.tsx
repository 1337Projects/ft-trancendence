
import SchemaFour from '@/components/assets/schema/Schema4'
import Schema8 from '@/components/assets/schema/Schema8';
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
    console.log(data)
    return (
        <div className="p-2">
            <div className="w-fit mx-auto h-auto mt-16">
                {
                    data.user_count === 4 ?
                    <SchemaFour rounds={data.rounds} />
                    :
                    <Schema8 rounds={data.rounds} />
                }
            </div>
        </div>
    )
}