import React, {useContext, useState, useRef, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom';

import Socket from '../../socket'
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { UserContext } from '../../Contexts/authContext';
import { FaArrowLeft, FaEllipsisV } from 'react-icons/fa';
import { MessageType, UserType } from '../../Types';
import ChatInput from './ChatInput';
import MyUseEffect from '../../hooks/MyUseEffect';


function calc_time(created_at) {
    if (!created_at) return ''
    let date = new Date(created_at);
    return date.toLocaleString('en-US', { hour: 'numeric', minute : '2-digit',  hour12: true })
}

function UserMessage({m, username}) {

    const [time, setTime] = useState<string>('')

    MyUseEffect(() => setTime(calc_time(m?.created_at)), [m?.created_at])

    return (
        <li  className={`mt-4 flex items-start  ${m.sender.username == username ? "justify-end" : "justify-start"}`}>
            {
                m.sender.username != username &&
                <img src={m?.sender?.profile?.avatar} className="w-[40px] bg-white shadow-sm rounded-full mr-4" alt="" />
            }
            <div>
                <div className={`backdrop-blur-xl text-white bg-gray-800 rounded-[30px] p-1`} >
                    <h1 className="text-[14px] break-words max-w-[300px] min-w-[100px] p-2">{m?.message}</h1>
                </div>
                <p 
                    className={`text-[8pt] lowercase mt-2 py-1 ${m.sender.username != username ? "text-right mr-4" : "ml-4"}`}
                >{time}</p>
            </div>
            {
                m.sender.username == username &&
                <img src={m?.sender?.profile?.avatar} className="w-[40px] bg-white shadow-sm rounded-full ml-4" alt="" />
            }
        </li>
    )
}


export default function Conversation() {
    const {authInfos} = useContext(UserContext) || {}
    const [messages, setMessages] = useState<MessageType[]>([])
    const cnv = useRef<HTMLDivElement | null>(null)
    const {user} = useParams()
    const [userData, setUserData] = useState<UserType | null>(null)


    MyUseEffect(() => {
        Socket.addCallback("setData", setMessages)
        Socket.addCallback("setUser", setUserData)
        Socket.sendMessage({
            "partner": user,
            "from": authInfos?.username,
            "event" : "fetch_messages"
            // add here page number and limit or (not if you want to use the ones in backend)
        })
    }, [user])

    
    MyUseEffect(() => {
        if (cnv && cnv.current) {
            cnv.current.scrollTo({
                top : cnv.current.scrollHeight + 100,
                behavior : 'instant'
            })
        }
    } , [messages])

    
    

    return (
        <div className='w-full h-full flex flex-col space-y-2'>
            <div className='w-full h-[60px]'>
                <ConversationHeader userData={userData}  />
            </div>
            <div ref={cnv} className='w-full max-w-[500px] mx-auto overflow-y-auto'
                style={{height : `calc(100vh - 260px)`}}
            >
                <MessagesList data={messages} />
            </div>
            <div className='w-full h-[100px]'>
                <ChatInput />
            </div>
        </div>
    )
}

function MessagesList({data}) {

    const { user } = useContext(UserContext) || {}

    return (
        <ul className='px-2'>
            { data.map((message, index) => 
                <div key={index}>
                    <UserMessage m={message} username={user?.username}  />
                </div>
            )}
        </ul>
    )
}



function ConversationHeader({userData}) {
    
    const { theme } = useContext(ApearanceContext) || {}

    return (
        <div  className={`header  px-4 border-b-[1px] ${theme == 'light' ? "border-black/20" : "border-white/20"}  py-8 w-full h-[60px] flex justify-between items-center`}>
            <div className="avatar w-[95%] h-full flex justify-start items-center">
                <Link className="p-2 flex items-center justify-center cursor-pointer" to="/dashboard/chat">
                    <FaArrowLeft />
                </Link>
                <Link to={`/dashboard/profile/${userData?.username}`} className='flex'>
                    <img src={userData?.profile?.avatar} className="bg-white w-[35px] h-[35px] rounded-full mx-4" alt="" />
                    <div className="infos text-[12px]">
                        <h1 className="font-bold text-[11pt]">{userData?.username}</h1>
                        <p className="text-[8pt]">last seen</p>
                    </div>
                </Link>
            </div>
            <FaEllipsisV />
        </div>
    )
}