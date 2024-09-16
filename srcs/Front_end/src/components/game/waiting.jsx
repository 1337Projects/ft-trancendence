import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {ThemeContext, ColorContext} from '../../Contexts/ThemeContext'
import { useContext, useEffect, useState } from "react"
import { faGamepad } from '@fortawesome/free-solid-svg-icons'
import Socket from '../../socket'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { friendsContext, userContext } from '../../Contexts/authContext'
import {notsSocket} from '../../socket'


export default function Waiting() {
    const theme = useContext(ThemeContext)
    const color = useContext(ColorContext)
    const [room, setRoom] = useState(null)
    const [invite, setInvite] = useState(false)
    const navigate = useNavigate()
    const [searchParam, setSearchParam] = useSearchParams()
    const friends = useContext(friendsContext)
    const user = useContext(userContext)


    
    useEffect(() => {
        const timer = setTimeout(() => {
            let room = searchParam.get("room")
            if (!room)
                room = "any"
            Socket.connect(`ws://localhost:8000/ws/game/2/${room}/`)
            Socket.addCallback("setRoom", setRoom)
            Socket.addCallback("startGame", startGameHandler)
        })

        return () => {

            clearTimeout(timer)
            // Socket.close()
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log(room)
        }, 50)
        return () => {
            clearTimeout(timer)
        }
    }, [room])

    function startGameHandler() {
        navigate("../game/room/1")
    }

    if (!room) {
        return <div className='w-full bg-darkItems text-white p-2 mt-2 rounded-sm h-[100vh] flex items-center justify-center'>
            <div className='w-fit h-fit'>
                <h1 className='text-[20px]'>No Room Found!</h1>
                <div className='w-full mt-4 flex justify-center'>
                    <button style={{background:color}} className=' p-2 w-[100px] rounded-sm text-[16px] capitalize'>back</button>
                </div>
            </div>
            
        </div>
    }

    function get_user(data) {
        if (data.sender.username == user.username)
            return data.receiver
        return data.sender
    }

    function inviteHandler(user) {
        setInvite(false)
        notsSocket.sendMessage({"event": "game invite", "user" : user, "room" : `http://localhost:5173/dashboard/game/waiting/?room=${room?.room?.name}`})
    }

    return (
        <div 
            className={`bg-pong bg-cover w-full flex mt-2 h-[100vh] rounded-sm`}>
            <div className={`flex justify-center items-center justify-center ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems/50 text-darkText"} backdrop-blur-md border-r-[.2px] w-full h-full`}>
                <div className="h-fit relative">
                    <div className="text-center uppercase">
                        <h1 className='font-bold'>waiting for player to join</h1>
                        <h1 className="mt-2">{room?.room?.status}</h1>
                    </div>
                    <div className='w-full flex items-center bg-white/90 text-gray-700 items-center h-[50px] border-[1px] mt-8 rounded-full'>
                        <div className='w-full  flex items-center justify-between px-2'>
                            <h1 className='ml-4 w-[300px] overflow-hidden h-[18px] text-[10px] uppercase'>http://localhost:5173/dashboard/game/waiting/?room={room?.room?.name}</h1>
                            <button onClick={() => {
                                setInvite(prev => !prev)
                            }} style={{background : color}} className='border-white/80 text-white border-[1px] p-1 rounded-full text-[12px] h-[35px] w-[60px] uppercase'>{invite ? "invited" : "invite"}</button>
                        </div>
                    </div>
                    {
                        invite &&
                        <div className='bg-white p-2 w-full h-fit min-h-[100px] border-[1px] shadow-sm text-gray-700 mt-2 rounded-sm flex'>
                        {
                            friends.map(item => {
                                const user = get_user(item)
                                return <div onClick={() => inviteHandler(user)} key={user.id} className='mx-2  cursor-pointer border-gray-700/40 rounded-sm w-[65px] h-[80px] p-2'>
                                    <div className='w-full flex justify-center'>
                                        <img src={user.profile.image} className='w-[40px] rounded-sm border-white border-[1px]' alt="" />
                                    </div>
                                    <h1 className='text-[12px] text-center mt-2'>{user.username}</h1>
                                </div>
                            })
                        }
                        </div>
                    }
                    <div className="flex items-center mt-20 justify-center">
                        <div className="w-[120px] h-[150px] p-4 border-[1px] rounded-md flex items-center justify-center">
                            <div className='text-center'>
                                <img src={room?.room?.players[0]?.user?.profile?.image} className='bg-white rounded-full w-[60px] h-[60px]' alt="" />
                                <h1 className='uppercase mt-4'>{room?.room?.players[0]?.user?.username}</h1>
                                <h1 className='uppercase mt-2 text-[12px]'>player 1</h1>
                            </div>
                        </div>
                        <div className="w-[100px] text-center">
                            <h1 className='text-[40px]'>vs</h1>
                            <h1 className='mt-2'>0 / 0</h1>
                        </div>
                        <div className="w-[120px] h-[150px] p-4 border-[1px] rounded-md flex items-center justify-center">
                            <div className=' text-center'>
                                <img src={room?.room?.players[1] ? room?.room?.players[1]?.user?.profile?.image : ""} className='bg-white rounded-full w-[60px] h-[60px]' alt="" />
                                <h1 className='uppercase mt-4'>{room?.room?.players[1] ? room?.room?.players[1]?.user?.username : "waiting..."}</h1>
                                <h1 className='uppercase mt-2 text-[12px]'>player 2</h1>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => {
                        Socket.sendMessage({"event" : "start_game" , "room":room})
                    }} disabled={room?.room?.status != 'closed'} style={{background:color}} className="h-[40px] ml-[50%] translate-x-[-50%] flex items-center justify-center rounded-full w-1/3 mt-20 uppercase">
                        <h1>play</h1>
                        <FontAwesomeIcon className='ml-2 text-[20px]' icon={faGamepad} />
                    </button>
                </div>
            </div>
        </div>

    )
}
