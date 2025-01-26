import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { UserContext } from '@/Contexts/authContext'
import { FriendType, UserType } from "@/types/userTypes"
import { RoomType } from "@/types/gameTypes"
import { roomSocket } from "@/sockets/MatchMakingSocket"
import { notificationSocket } from "@/sockets/notificationsSocket"


export function PlayerGameCard({player, id} : { player : UserType | undefined, id : number }) {
    return (
        <div className="w-[120px] h-[150px] p-4 border-[1px] rounded-md flex items-center justify-center flex-col">
            <img src={player ? player.profile.avatar : "/_.jpeg"} className='bg-white rounded-full w-[60px] h-[60px]' alt="" />
            <h1 className='uppercase mt-4 font-bold'>{player ? player.username : "waiting..."}</h1>
            <h1 className='uppercase mt-2 text-[12px]'>player {id}</h1>
        </div>
    )
}

export default function Waiting() {
    const { color, theme } = useContext(ApearanceContext) || {}
    const [room, setRoom] = useState<{room : RoomType} | null>(null)
    const navigate = useNavigate()
    const { authInfos } = useContext( UserContext ) || {}
    const { type, game } = useParams()
    const searchUrl = new URLSearchParams(window.location.search)
    let room_id = searchUrl.get('room_id')
    const timeoutRef = useRef<null | NodeJS.Timeout>(null)
    const [error , setError] = useState<string | null>(null)

    if (!room_id) { 
        room_id = 'any'
    }

    useEffect(() => {

        const timer = setTimeout(() => {
            roomSocket.addCallback("error", setError)
            roomSocket.addCallback("setRoom", setRoom)
            roomSocket.addCallback("startGame", startGameHandler)
            roomSocket.connect(`${import.meta.env.VITE_SOCKET_URL}wss/game/${game}/join/${type}/${room_id}/?token=${authInfos?.accessToken}`)
        }, 100)

        return () => {
            clearTimeout(timer)
            roomSocket.close()
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [room_id])

    
    function startGameHandler(id : number) {
        timeoutRef.current = setTimeout(() => {
            navigate(`../${game}/room/${id}`)
        }, 3000)
    }
    if (error) {
        return (
            <div className={`w-full ${ theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-white"}  p-2 mt-2 rounded-sm h-[100vh] flex items-center justify-center`}>
                <div className='w-fit h-fit text-center'>
                    <h1 className='text-[20px] capitalize'>room not found!</h1>
                    <p className="text-xs mt-4 w-[400px]">Looks like there are no available rooms at the moment. Please try again later, or create your own room to start a match with others. We’ll match you with players as soon as a room becomes available!</p>
                    <div className='w-full mt-4 flex justify-center'>
                        <Link to="/dashboard/game" style={{background:color}} className='p-2 rounded w-[100px] text-white text-[16px] capitalize'>back</Link>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className={`flex justify-center items-center ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} w-full h-full min-h-fit rounded overflow-scroll`}>
            <div className="h-fit relative">
                <div className="text-center uppercase">
                    <h1 className='font-bold'>waiting for player to join</h1>
                    <h1 className="mt-2">{room?.room?.status}</h1>
                </div>
                {
                    room &&
                    <InviteFriendsToPlay data={room?.room} />
                }
                <div className="flex items-center mt-20 justify-center">
                    <PlayerGameCard id={1} player={room?.room?.players[0]} />
                    <div className="w-[100px] text-center">
                        <h1 className='text-[40px]'>vs</h1>
                        <h1 className='mt-2'>0 / 0</h1>
                    </div>
                    <PlayerGameCard id={2} player={room?.room?.players[1]} />   
                </div>
            </div>
        </div>

    )
}



export function InviteFriendsToPlay({ data } : { data : RoomType }) {

    const [invite, setInvite] = useState(false)
    const { color } = useContext(ApearanceContext) || {}
    const { friends } = useContext(UserContext) || {}
    const FriendsListRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    const myFriends = friends?.filter(fr => fr.status === 'accept')

    useEffect(() => {

        function handleClick(e : MouseEvent) {
            if (
                FriendsListRef.current &&
                !FriendsListRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setInvite(false)
            }
        }

        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [])

    return (
        <div className="relative">
            <div className='w-full flex items-center bg-white text-gray-700 h-[50px] mt-8'>
                <div className='w-full  flex items-center justify-between px-2'>
                    <button 
                        ref={buttonRef} 
                        onClick={() => {
                            setInvite(prev => !prev)
                        }} 
                        style={{background : color}} 
                        className='border-white/80 capitalize w-full text-white border-[1px] p-1 rounded text-[12px] h-[35px]'
                    >
                        {invite ? "hide friends list" : "invite your friends to play"}
                    </button>
                </div>
            </div>
            {
                invite && 
                <div ref={FriendsListRef} className="bg-white/30 backdrop-blur-lg border-[.4px] border-black/20 overflow-scroll absolute top-[52px] left-0 w-full h-fit max-h-[150px] p-2 mt-2 rounded">
                    {
                        myFriends?.length ?
                        <ul className="h-full overflow-scroll">
                            {
                                myFriends.map((fr, index) => 
                                    <li key={index} className="my-4">
                                        <FriendItem room={data.name} friendShip={fr} />
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


function FriendItem({friendShip, room} : { friendShip : FriendType, room : string }) {

    const { authInfos } = useContext(UserContext) || {}
    const { color } = useContext(ApearanceContext) || {}
    const user = friendShip.sender.username === authInfos?.username ? friendShip.receiver : friendShip.sender
    const [ invited, setInvited ] = useState(false)
    const { type, game } = useParams()
    const timeoutRef = useRef<null | NodeJS.Timeout>(null)

    function InviteHandler() {
        if (!invited) {
            notificationSocket.sendMessage({
                event: "send_request",
                sender: user.username,
                receiver: authInfos?.username,
                message: `${authInfos?.username} invited you to play`,
                link: `${import.meta.env.VITE_API_URL}dashboard/game/waiting/room/${type}/${game}/?room_id=${room}`
            });
            setInvited(true)
            timeoutRef.current = setTimeout(() => {
                setInvited(false)
            }, 5000)
        }
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return (
        <div className={`h-fit rounded border-[.4px] flex justify-between items-center ${invited && "opacity-30"} p-2`}>
            <div className="flex w-fit justify-start items-center">
                <img src={user.profile.avatar} className="w-[40px] mr-4 rounded" alt="" />  
                <div>
                    <h1 className="uppercase font-bold">{user.username}</h1>
                    <p className="text-xs mt-1">level : {user.profile.level}</p>
                </div>  
            </div>
            <button 
                style={{background : color}} 
                onClick={InviteHandler} 
                className="p-2 px-4 text-xs text-white rounded"
            >invite</button>
        </div>
    )
}