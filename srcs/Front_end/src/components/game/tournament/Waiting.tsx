
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { UserContext } from "@/Contexts/authContext"
import { PlayerGameCard } from '../pingpong/waiting'
import { tournamentSocket } from "@/sockets/tournamentSocket"
import { TournamentRoomType } from "@/types/tournamentTypes"

export default function WaitingTournment() {

    const { theme } = useContext(ApearanceContext) || {}
    const { id } = useParams()
    const [ roomData, setRoomData ] = useState<null | TournamentRoomType>(null)
    const navigate = useNavigate()
    const { authInfos } = useContext( UserContext ) || {}
    


    useEffect(() => {
        tournamentSocket.connect(`${import.meta.env.VITE_SOCKET_URL}wss/join/tournment/${id}/?token=${authInfos?.accessToken}`)
        tournamentSocket.addCallback('roomDataHandler', roomDataHandler)
    }, [])

    useEffect(() => {
        return () => {
            tournamentSocket.close()
        }
    }, [])

    function roomDataHandler(data : TournamentRoomType) {
        setRoomData(data)
        if (data.players.length == data.data.max_players) {
            tournamentSocket.close()
            navigate(`/dashboard/game/tournment/${id}/`)
        }
    }

    if (!roomData) {
        return <div className="h-screen w-full flex items-center justify-center">Loading...</div>
    }
    

    return (
        <div className={`relative h-full min-h-fit ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} w-full rounded p-2 flex items-center`}>
            <div className="max-w-[600px] mx-auto h-fit">
                <div className="text-center p-2 w-fit ml-[50%] translate-x-[-50%]">
                    <h1 className={`text-3xl font-bold uppercase`}>Waiting for tournament to start</h1>
                    {/* <div className="p-2 mt-6">
                        <InviteFriendsToPlay data={roomData} />
                        </div> */}
                    <h1 className="mt-6 text-lg"> {roomData?.players?.length < roomData?.data?.max_players ? "waiting..." : "ready"}</h1>
                </div>
                <div className="p-2 grid grid-cols-4 gap-4 mt-20 ">
                    {
                        [...Array(roomData?.data?.max_players)].map((_, index) => {
                            return (
                                <div key={index}>
                                    <PlayerGameCard
                                        id={index+1} 
                                        player={index < roomData?.players?.length ? roomData?.players[index] : undefined}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}