import React, { useContext, useEffect, useState } from "react"
import { gameSocket } from '../../socket'
import { Link, useNavigate } from 'react-router-dom'
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { UserContext } from '../../Contexts/authContext'

export function PlayerGameCard({player}) {
    return (
        <div className="w-[120px] h-[150px] p-4 border-[1px] rounded-md flex items-center justify-center">
            <div className=' text-center'>
                <img src={player ? player.profile.avatar : "/_.jpeg"} className='bg-white rounded-full w-[60px] h-[60px]' alt="" />
                <h1 className='uppercase mt-4'>{player ? player.username : "waiting..."}</h1>
                <h1 className='uppercase mt-2 text-[12px]'>player 2</h1>
            </div>
        </div>
    )
}

export default function Waiting() {
    const { color, theme } = useContext(ApearanceContext) || {}
    const [room, setRoom] = useState(null)
    const [invite, setInvite] = useState(false)
    const navigate = useNavigate()
    const { authInfos } = useContext( UserContext ) || {}


    
    useEffect(() => {

        const timer = setTimeout(() => {
            gameSocket.connect(`ws://localhost:8000/wss/game/join/game/?token=${authInfos?.accessToken}`)
            gameSocket.addCallback("setRoom", setRoom)
            gameSocket.addCallback("startGame", startGameHandler)
        }, 100)

        return () => {
            clearTimeout(timer)
            gameSocket.close()
        }
    }, [])

    function startGameHandler(id) {
        navigate(`../game/room/${id}`)
    }

    if (!room) {
        return (
            <div className={`w-full ${ theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-white"}  p-2 mt-2 rounded-sm h-[100vh] flex items-center justify-center`}>
                <div className='w-fit h-fit text-center'>
                    <h1 className='text-[20px] capitalize'>room not found!</h1>
                    <p className="text-xs mt-4 w-[400px]">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere odit sapiente totam nihil accusamus dolores!</p>
                    <div className='w-full mt-4 flex justify-center'>
                        <Link to="../game" style={{background:color}} className='p-2 rounded w-[100px] text-white text-[16px] capitalize'>back</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div 
            className={`w-full flex mt-2 h-[100vh] rounded-sm`}>
            <div className={`flex justify-center items-center ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} w-full h-full`}>
                <div className="h-fit relative">
                    <div className="text-center uppercase">
                        <h1 className='font-bold'>waiting for player to join</h1>
                        <h1 className="mt-2">{room?.room?.status}</h1>
                    </div>
                    <div className='w-full flex items-center bg-white text-gray-700 h-[50px] border-[1px] mt-8 rounded-full'>
                        <div className='w-full  flex items-center justify-between px-2'>
                            <h1 className='ml-4 w-[300px] overflow-hidden h-[18px] text-[10px] uppercase'>http://localhost:5173/dashboard/game/waiting/?room={room?.room?.name}</h1>
                            <button onClick={() => {
                                setInvite(prev => !prev)
                            }} style={{background : color}} className='border-white/80 text-white border-[1px] p-1 rounded-full text-[12px] h-[35px] w-[60px] uppercase'>{invite ? "invited" : "invite"}</button>
                        </div>
                    </div>
                    <div className="flex items-center mt-20 justify-center">
                        <PlayerGameCard player={room?.room?.players[0]} />
                        <div className="w-[100px] text-center">
                            <h1 className='text-[40px]'>vs</h1>
                            <h1 className='mt-2'>0 / 0</h1>
                        </div>
                        <PlayerGameCard player={room?.room?.players[1]} />
                    </div>
                </div>
            </div>
        </div>

    )
}
