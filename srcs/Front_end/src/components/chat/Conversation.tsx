import React, {useContext, useState, useRef, useEffect, useCallback} from 'react'
import { Link, useParams } from 'react-router-dom';

import { chatSocket } from '../../socket'
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { UserContext } from '../../Contexts/authContext';
import { FaArrowLeft, FaEllipsisV } from 'react-icons/fa';
import ChatInput from './ChatInput';
import MyUseEffect from '../../hooks/MyUseEffect';
import { ChatContext } from '../../Contexts/ChatContext';
import { RiCheckDoubleFill } from 'react-icons/ri';


function calc_time(created_at) {
    if (!created_at) return ''
    let date = new Date(created_at);
    return date.toLocaleString('en-US', { hour: 'numeric', minute : '2-digit',  hour12: true })
}

function UserMessage({m, username}) {
    const [time, setTime] = useState<string>('')
    MyUseEffect(() => setTime(calc_time(m?.created_at)), [m?.created_at])

    const { color, theme } = useContext(ApearanceContext) || {}

    return (
        <li  className={`mt-4 flex items-start  ${m.sender.username == username ? "justify-end" : "justify-start"}`}>
            {
                m.sender.username != username &&
                <Link to={`/dashboard/profile/${m?.sender?.username}`}>
                    <img src={m?.sender?.profile?.avatar} className="w-[40px] h-[40px] bg-white shadow-sm rounded-full mr-4" alt="" />
                </Link>
            }
            <div>
                <div className={`backdrop-blur-xl ${theme == "light" ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"} rounded-[50px] p-1`} >
                    <h1 className="text-[14px] break-words max-w-[300px] min-w-[100px] p-2">{m?.message}</h1>
                </div>
                <p 
                    className={`text-[8pt] flex items-center lowercase mt-2 py-1 ${m.sender.username != username ? "text-right ml-10" : "ml-2"}`}
                >{time} <RiCheckDoubleFill style={{color : m.seen ? color : ""}} className='ml-2 text-[10pt]' /></p>
            </div>
            {/* {
                m.sender.username == username &&
                <img src={m?.sender?.profile?.avatar} className="w-[40px] h-[40px] bg-white shadow-sm rounded-full ml-4" alt="" />
            } */}
        </li>
    )
}


export default function Conversation() {
    const { userData } = useContext(ChatContext) || {}

    return (
        <div className='w-full h-full flex flex-col space-y-2'>
            <div className='w-full h-[60px]'>
                <ConversationHeader userData={userData?.user}  />
            </div>
            <div className='w-full h-fit relative overflow-y-auto' >
                <MessagesList />
            </div>
            <div className='w-full px-10 h-[100px]'>
                <ChatInput />
            </div>
        </div>
    )
}



function MessagesList() {

    const [ page, setPage ] = useState(1)
    const { authInfos } = useContext(UserContext) || {}
    const { user } = useParams()
    const { messages, setMessages , userData } = useContext(ChatContext) || {}
    const observer = useRef<IntersectionObserver | null>(null);
    const lastItem = useRef(null)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        // const timer = setTimeout(() => {

        // }, 300)
        return () => {
            console.log(messages)
            setMessages!([])
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            send_fetch_event(page)
            if (userData) setHasMore(page < userData.nbr_pages)
        }, 300)

        return () => {
            clearTimeout(timer)
        }
    }, [page])

 
    
    
    const topitem = useCallback(() => {
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {  
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1)
            }
        })

        if (lastItem.current) observer.current.observe(lastItem.current)
    }, [lastItem, hasMore])


    useEffect(() => {
        return () => {
            if (observer.current) observer.current.disconnect()
        }
    }, [])

    MyUseEffect(() => {
        if (lastItem.current && messages) {
            setTimeout(() => {
                topitem()
            }, 1000)
        }
    }, [messages])

function send_fetch_event(page) {
    chatSocket.sendMessage({
            "partner": user,
            "from": authInfos?.username,
            "event" : "fetch_messages",
            page
        })
    }

    if (!messages) {
        return (
            
            <ul style={{height : `calc(100vh - 260px)`}}>
                <div className='w-full h-[50px] flex items-center p-2 mt-4'>
                    <div className='bg-gray-300 animate-pulse  w-[40px] rounded-full h-[40px]' />
                    <div className='ml-4'>
                    <div className='bg-gray-300 animate-pulse w-[100px] rounded-full h-[20px]' />
                    <div className='w-[40px] rounded-full h-2 bg-gray-300 animate-pulse mt-2' />
                </div>
            </div>
                <div className='w-full h-[50px] flex items-center justify-end p-2 mt-4'>
                    <div className='mr-4'>
                        <div className='bg-gray-300 animate-pulse w-[100px] rounded-full h-[20px]' />
                        <div className='w-[40px] rounded-full h-2 bg-gray-300 animate-pulse mt-2' />
                    </div>
                <div className='bg-gray-300 animate-pulse w-[40px] rounded-full h-[40px]' />
                </div>
            <div className='w-full h-[50px] flex items-center justify-end p-2 mt-4'>
                <div className='mr-4'>
                    <div className='bg-gray-300 animate-pulse w-[100px] rounded-full h-[20px]' />
                    <div className='w-[40px] rounded-full h-2 bg-gray-300 animate-pulse mt-2' />
                </div>
                <div className='bg-gray-300 animate-pulse w-[40px] rounded-full h-[40px]' />
                </div>
            <div className='w-full h-[50px] flex items-center p-2 mt-4'>
                    <div className='bg-gray-300 animate-pulse w-[40px] rounded-full h-[40px]' />
                <div className='ml-4'>
                    <div className='bg-gray-300 animate-pulse w-[100px] rounded-full h-[20px]' />
                    <div className='w-[40px] rounded-full h-2 bg-gray-300 animate-pulse mt-2' />
                </div>
            </div>
            <div className='w-full h-[50px] flex items-center p-2 mt-4'>
                <div className='bg-gray-300 animate-pulse w-[40px] rounded-full h-[40px]' />
                    <div className='ml-4'>
                        <div className='bg-gray-300 animate-pulse w-[100px] rounded-full h-[20px]' />
                        <div className='w-[40px] rounded-full h-2 bg-gray-300 animate-pulse mt-2' />
                </div>
                </div>
            </ul>
        )
    }

    return (
        <div>
            <div style={{height : `calc(100vh - 260px)`}} className='px-2 overflow-y-auto scroll-bottom flex flex-col-reverse'>
                <div className='flex flex-col '>
                    {
                        messages.map((message, index) => {
                            if (index === 0) {
                                return (
                                    <div className='w-full' ref={lastItem} key={index}>
                                        <UserMessage m={message} username={authInfos?.username}  />
                                    </div>
                                )
                            }
                            return (
                                <div className='w-full' key={index}>
                                    <UserMessage m={message} username={authInfos?.username}  />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

function ConversationHeader({userData}) {
    
    const { theme } = useContext(ApearanceContext) || {}

    if (!userData) {
        return (
            <div  className={`header  px-4 border-b-[1px] ${theme == 'light' ? "border-black/20" : "border-white/20"}  py-8 w-full h-[60px] flex justify-between items-center`}>
                <div className="avatar w-[95%] h-full flex justify-start items-center">
                    <div className='flex'>
                        <div className="bg-gray-300 animate-pulse w-[35px] h-[35px] rounded-full mx-4" />
                        <div className="infos text-[12px]">
                            <h1 className="w-[140px] h-[16px] bg-gray-300 animate-pulse rounded-full"></h1>
                            <p className="w-[60px] h-[10px] mt-2 bg-gray-300 animate-pulse rounded-full"></p>
                        </div>
                    </div>
                </div>
                <div className='h-[20px] w-2 bg-gray-300 animate-pulse rounded-full' />
            </div>
        )
    }

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