
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
}

export type TournamnetType = {
    rounds : []
    data : TournamentDataType
    user_count : number
}

export default function Schema({data} : {data : TournamnetType}) {

    if (!data || !data.rounds) {
        return (
            <div className='p-2'>
                <div className="w-[600px] mx-auto h-[150px] mt-16 animate-pulse"></div>
            </div>
        )
    }

    return (
        <div className="p-2">
            <div className="w-fit mx-auto h-auto mt-16">
                {
                    data.data.max_players === 4 ?
                    <SchemaFour rounds={data.rounds} />
                    :
                    <Schema8 rounds={data.rounds} />
                }
            </div>
        </div>
    )
}