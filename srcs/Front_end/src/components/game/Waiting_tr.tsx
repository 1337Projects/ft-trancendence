
import React, { useContext, useState } from "react"
import MyUseEffect from "../../hooks/MyUseEffect"
import { useNavigate, useParams } from "react-router-dom"
import Socket from "../../socket"
import { ApearanceContext } from "../../Contexts/ThemeContext"

export default function WaitingTournment() {

    const { color, theme } = useContext(ApearanceContext) || {}
    const { id } = useParams()
    const [ roomData, setRoomData ] = useState({})
    const navigate = useNavigate()

    MyUseEffect(() => {
        Socket.addCallback('roomDataHandler', roomDataHandler)
    }, [])

    function roomDataHandler(data) {
        setRoomData(data)
        if (data.players.length == data.data.max_players) {
            setTimeout(() => {
                Socket.sendMessage({"event" : "start_tournament"})
                navigate(`/dashboard/game/tournment/${id}/remote`)
            }, 1000 * 2)
        }
    }
    

    return (
        <div style={{height : `calc(100vh - 60px)`}} className={`mt-2 ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} w-full rounded p-2 flex items-center`}>
            <div className="max-w-[600px] mx-auto h-fit">
                <div className="text-center p-2 w-fit ml-[50%] translate-x-[-50%]">
                    <h1 className={`text-3xl font-bold uppercase`}>Waiting for tournament to start</h1>
                    <div className="p-2 mt-6 flex">
                        <input 
                            className={`w-fit border-[1px] p-2 h-[45px] bg-transparent ${theme == 'light' ? "border-lightText/40" : "border-darkText/40"} rounded-full px-6 text-sm min-w-[300px]`} 
                            type="text" 
                            value={`dashboard/game/tournment/waiting/1`}
                            onChange={() => {}}
                        />
                        <button style={{background : color}} className="ml-2 p-2 text-white text-sm rounded-full px-4">invite</button>
                    </div>
                    <h1 className="mt-6 text-lg"> {roomData?.players?.length < roomData?.data?.max_players ? "waiting..." : "ready"}</h1>
                </div>
                <div className="p-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 ">
                    {
                        [...Array(roomData?.data?.max_players)].map((item, index) => {
                            return (
                                <div key={index} className={`border-[1px] ${theme == 'light' ? "border-lightText/40" : "border-darkText/40"} rounded p-2`}>
                                    <img className="w-full h-[120px] rounded bg-cover" 
                                        src={
                                            index < roomData?.players?.length 
                                            ? roomData?.players[index].profile.avatar 
                                            : "/_.jpeg"
                                        } 
                                        alt="" 
                                    />
                                    <h1 className={`mt-4 font-light text-center uppercase text-sm`}>
                                        {index < roomData?.players?.length ? roomData?.players[index].username : "waiting..."}
                                    </h1>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}