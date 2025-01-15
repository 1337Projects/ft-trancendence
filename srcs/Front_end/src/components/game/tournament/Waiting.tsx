
import { useContext, useEffect, useRef, useState } from "react"
import MyUseEffect from "@/hooks/MyUseEffect"
import { useNavigate, useParams } from "react-router-dom"
import { tournamentSocket } from "@/socket"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { UserContext } from "@/Contexts/authContext"
import { PlayerGameCard } from '../pingpong/waiting'

export default function WaitingTournment() {

    const { theme } = useContext(ApearanceContext) || {}
    const { id } = useParams()
    const [ roomData, setRoomData ] = useState({})
    const navigate = useNavigate()
    const [ loading, setLoading ] = useState(false)
    const [ num, setNum ] = useState(3)
    const { authInfos } = useContext( UserContext ) || {}
    const timeoutRef = useRef<null | NodeJS.Timeout>(null)
    


    MyUseEffect(() => {
        tournamentSocket.connect(`${import.meta.env.VITE_SOCKET_URL}wss/join/tournment/${id}/?token=${authInfos?.accessToken}`)
        tournamentSocket.addCallback('roomDataHandler', roomDataHandler)
    }, [])

    useEffect(() => {
        return () => {
            tournamentSocket.close()
            if (timeoutRef.current){
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    MyUseEffect(() => {
        if (loading) {
            setInterval(() => {
                setNum(prev => prev - 1)
            }, 1000)
        }
    }, [loading])

    function roomDataHandler(data : any) {
        setRoomData(data)
        if (data.players.length == data.data.max_players) {
            setLoading(true)
            timeoutRef.current = setTimeout(() => {
                tournamentSocket.sendMessage({"event" : "start_tournament"})
                navigate(`/dashboard/game/tournment/${id}/`)
            }, 1000 * 3)
        }
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
                    {loading && <div className="w-full text-center text-xl uppercase p-2">tournament start on {num}</div>}
                </div>
                <div className="p-2 grid grid-cols-4 gap-4 mt-20 ">
                    {
                        [...Array(roomData?.data?.max_players)].map((item, index) => {
                            return (
                                <div key={index}>
                                    <PlayerGameCard player={index < roomData?.players?.length ? roomData?.players[index] : null} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}