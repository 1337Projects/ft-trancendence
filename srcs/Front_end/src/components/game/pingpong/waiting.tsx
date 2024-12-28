import React, { useContext, useEffect, useState } from "react"
import { gameSocket, notificationSocket } from '@/socket'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { UserContext } from '@/Contexts/authContext'
import { UserType } from "@/Types"

export function PlayerGameCard({player} : { player : UserType }) {
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
    const [room, setRoom] = useState<{room : RoomType} | null>(null)
    const navigate = useNavigate()
    const { authInfos } = useContext( UserContext ) || {}
    const { type } = useParams()
    const searchUrl = new URLSearchParams()
    let room_id = searchUrl.get('room')
    
    if (!room_id) { 
        room_id = 'any'
    }


    useEffect(() => {

        const timer = setTimeout(() => {
            gameSocket.connect(`${import.meta.env.VITE_SOCKET_URL}wss/game/join/${type}/${room_id}/?token=${authInfos?.accessToken}`)
            gameSocket.addCallback("setRoom", setRoom)
            gameSocket.addCallback("startGame", startGameHandler)
        }, 100)

        return () => {
            clearTimeout(timer)
            gameSocket.close()
        }
    }, [])

    function startGameHandler(id : number) {
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
                    <InviteFriendsToPlay data={room?.room} />
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

export type RoomType = {
    players : UserType[],
    status : string,
    name : string
}

export function InviteFriendsToPlay({ data } : { data : RoomType }) {

    const [invite, setInvite] = useState(false)
    const { color } = useContext(ApearanceContext) || {}
    const { friends } = useContext(UserContext) || {}

    return (
        <div className="relative">
            <div className='w-full flex items-center bg-white text-gray-700 h-[50px] border-[1px] mt-8 rounded'>
                <div className='w-full  flex items-center justify-between px-2'>
                    <h1 className='ml-4 w-[300px] overflow-hidden h-[18px] text-[10px] uppercase'>http://localhost:5173/dashboard/game/waiting/?room={data?.name}</h1>
                    <button onClick={() => {
                        setInvite(prev => !prev)
                    }} style={{background : color}} className='border-white/80 text-white border-[1px] p-1 rounded-full text-[12px] h-[35px] w-[60px] uppercase'>{invite ? "invited" : "invite"}</button>
                </div>
            </div>
            {
                invite && 
                <div className="bg-white absolute top-[52px] left-0 text-lightText w-full h-[150px] p-2 mt-2 rounded">
                    {
                        friends?.length ?
                        <ul className="h-full overflow-scroll">
                            {
                                friends.map((fr, index) => 
                                    <li key={index} >
                                        <FriendItem friendShip={fr} />
                                    </li>)
                            }
                        </ul>
                        :
                        <div className="w-full h-[50px] flex justify-center items-center text-xs">no friends to invite</div>
                    }
                </div>
            }
        </div>
    )
}


function FriendItem({friendShip}) {

    const { authInfos } = useContext(UserContext) || {}
    const { color } = useContext(ApearanceContext) || {}
    const user = friendShip.sender.username === authInfos?.username ? friendShip.receiver : friendShip.sender
    const [ invited, setInvited ] = useState(false)


    function InviteHandler() {
        console.log(user)
        notificationSocket.sendMessage({
            event: "send_request",
            sender: user.username, // Your logged-in user's username
            receiver: authInfos?.username, // Username of the friend to whom the request is sent
            message: `${authInfos?.username} invited you to play`,
            link: "link"
        });
        setInvited(true)
        setTimeout(() => {
            setInvited(false)
        }, 5000)
    }

    return (
        <div className={`h-[40px] flex justify-between items-center ${invited && "opacity-30"} p-2`}>
            <div className="flex w-fit justify-start items-center">
                <img src={user.profile.avatar} className="w-[35px] mr-4 rounded" alt="" />  
                <div>
                    <h1>{user.username}</h1>
                    <p className="text-xs">level : {user.profile.level}</p>
                </div>  
            </div>
            <button style={{background : color}} onClick={InviteHandler} className="p-2 px-4 text-xs text-white rounded">invite</button>
        </div>
    )
}