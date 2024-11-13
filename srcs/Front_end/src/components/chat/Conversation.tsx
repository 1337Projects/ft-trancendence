import React, {useContext, useState, useRef, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom';

import Socket from '../../socket'
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { UserContext } from '../../Contexts/authContext';
import { FaArrowLeft, FaEllipsisV } from 'react-icons/fa';
import ChatInput from './ChatInput';
import MyUseEffect from '../../hooks/MyUseEffect';
import { ChatContext } from '../../Contexts/ChatContext';
import { RiCheckDoubleFill } from 'react-icons/ri';
import { flushSync } from 'react-dom'


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
                <Link to={`/dashboard/profile/${m?.sender?.username}`}>
                    <img src={m?.sender?.profile?.avatar} className="w-[40px] bg-white shadow-sm rounded-full mr-4" alt="" />
                </Link>
            }
            <div>
                <div className={`backdrop-blur-xl text-white bg-gray-800 rounded-[30px] p-1`} >
                    <h1 className="text-[14px] break-words max-w-[300px] min-w-[100px] p-2">{m?.message}</h1>
                </div>
                <p 
                    className={`text-[8pt] flex items-center lowercase mt-2 py-1 ${m.sender.username != username ? "text-right ml-10" : "ml-2"}`}
                >{time}<RiCheckDoubleFill className='ml-2 text-blue-500 text-[10pt]' /></p>
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
    const cnv = useRef<HTMLDivElement | null>(null)
    const {user} = useParams()
    
    const [loading, setLoading] = useState(false)
    const { messages, setMessages, userData } = useContext(ChatContext) || {}
    let page = 1;

    MyUseEffect(() => {
        cnv.current?.addEventListener('scroll', () => {
            if ( cnv.current && cnv.current.scrollTop == 0) {
                page += 1
                send_fetch_event(page)
            }
        })
    }, [])

    MyUseEffect(() => {
        setMessages!([])
        send_fetch_event(page)
    }, [user])
    

    MyUseEffect(() => {
        page = Math.ceil(messages?.length! / 10) + 1
        console.log(page)
        if (cnv && cnv.current) {
            cnv.current.scrollTo({
                top : 14 * 10,
                behavior : 'smooth'
            })
        }
        
        Socket.sendMessage({
            "event" : "seen_messages",
            "sender" : user,
            "receiver" : authInfos?.username
        })
    } , [messages])

    function send_fetch_event(page) {
        setLoading(true)
        setTimeout(() => {
            Socket.sendMessage({
                "partner": user,
                "from": authInfos?.username,
                "event" : "fetch_messages",
                page
            })
            setLoading(false)
        }, 1000)
    }


    return (
        <div className='w-full h-full flex flex-col space-y-2'>
            <div className='w-full h-[60px]'>
                <ConversationHeader userData={userData}  />
            </div>
            <div ref={cnv} className='w-full relative max-w-[700px] mx-auto overflow-y-auto'
                style={{height : `calc(100vh - 260px)`}}
            >
                {loading && <h1 className=' sticky text-center w-full top-2 text-sm p-2'>loading messages</h1>}
               
                <MessagesList data={messages} />
            </div>
            <div className='w-full px-10 h-[100px]'>
                <ChatInput />
            </div>
        </div>
    )
}

function MessagesList({data}) {

    const { user } = useContext(UserContext) || {}

    return (
        <ul className='p-2 flex-row-reverse'>
            { data.map((message, index) => 
                <div className='w-full' key={index}>
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
                        <p className="text-[8pt]">{userData?.profile?.online ? "online" : "offline"}</p>
                    </div>
                </Link>
            </div>
            <FaEllipsisV />
        </div>
    )
}