import React, { useContext, useState } from "react";
import { Touramentcontext } from "../../Contexts/TournamentContext";
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../Contexts/authContext'
import MyUseEffect from '../../hooks/MyUseEffect'
import  drawTournment  from '../../libs/svg'

import Socket, { tournamentSocket } from '../../socket'

export default function Schema() {


    const { data } = useContext(Touramentcontext) || {}
    const { authInfos } = useContext(UserContext) || {}
    const [svg, setSvg] = useState("")
    const navigate = useNavigate()

    MyUseEffect(() => {
        setTimeout(() => {
            tournamentSocket.addCallback("match_data", matchHandler)
        }, 0)
    }, [])

    const matchHandler = (data) => {
        if (data && authInfos) {
            if (data.player_1.username == authInfos?.username || data.player_2.username == authInfos?.username) {
                navigate(`/dashboard/game/room/${data.id}`)
            }
        }
    }
    
    MyUseEffect(() => {
        if (data) {
            const created_svg = drawTournment.drawTournment(data.rounds)
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(created_svg)
            setSvg(svgString)
        }
    }, [data])

    

    return (
        <div className="p-2">
            {
                svg && 
                <div className="w-full max-w-[500px] mx-auto">
                    {/* <div className="w-full  mt-10 text-center p-10">
                        <h1 className="pb-6 uppercase">current matches</h1>
                        <div className="bg-white border-[1px] border-black/20 w-full min-h-[200px] rounded">

                        </div>
                    </div> */}
                    <div className="" dangerouslySetInnerHTML={{ __html: svg }} />
                </div>
            }
        </div>
    )
}