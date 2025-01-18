import {useContext, useState, useRef, useEffect, useCallback} from 'react'
import { Link, useParams } from 'react-router-dom';

import { ApearanceContext } from '../../Contexts/ThemeContext';
import { UserContext } from '../../Contexts/authContext';
import { FaArrowLeft } from 'react-icons/fa';
import ChatInput from './ChatInput';
import { ChatContext } from '../../Contexts/ChatContext';
import { RiGamepadLine } from "react-icons/ri";
import { MessageType } from '@/types/chatTypes';
import { chatSocket } from '@/sockets/chatSocket';


function calc_time(created_at : string) {
    if (!created_at) return ''
    const date = new Date(created_at);
    return date.toLocaleString('en-US', { hour: 'numeric', minute : '2-digit',  hour12: true })
}

function UserMessage({m} : {m : MessageType}) {
    const [time, setTime] = useState<string>('')
    useEffect(() => setTime(calc_time(m?.created_at)), [m?.created_at])
    const { color, theme } = useContext(ApearanceContext) || {}

    return (
        <li className={`mt-4 flex justify-start`}>
            <div className='w-[40px] mr-4'>
                <Link  to={`/dashboard/profile/${m?.sender?.username}`}>
                    <img src={m?.sender?.profile?.avatar} className="w-[35px] h-[35px] bg-white shadow-sm rounded-full mr-4" alt="" />
                </Link>
            </div>
            <div className='w-full max-w-[400px]'>
                <div>
                    <h1 className='font-bold text-[10pt]'>{m.sender.username} <span className='ml-4 font-thin text-[8pt]'>{time}</span></h1>
                    {
                        m.message === "" ?
                        <div className={`w-full flex justify-start items-center mt-2 h-[100px] rounded border-[.3px] p-2 ${theme === 'light' ? "border-black/20" : "border-white/20"} `}>
                            <div className='w-[180px] h-full mr-2'>
                                <img className='rounded w-full h-full' src="/game/leo-vs-friend.jpg" alt="img" />
                            </div>
                            <div className='flex-grow w-full h-full px-2'>
                                <p className='text-xs'><span className='font-bold mr-1'>{m.sender.username}</span> invited you to play ping pong match</p>
                                {
                                    (!m.link_expired && m.link) ?
                                    <Link to={m.link} className='mt-4'>
                                        <button style={{borderColor : color, color : color}} className='border-[1px] flex justify-center items-center px-4 text-xs p-2 rounded mt-4'>
                                            <p className='mr-2'>Play now </p>
                                            <RiGamepadLine className='text-[12pt]' />
                                        </button>
                                    </Link>
                                    :
                                    <h2 style={{color: color}} className='text-xs mt-2'>this link has been expired</h2>
                                }
                            </div>
                        </div>
                        :
                        <p className="text-[14px] break-words min-w-[100px]">{m?.message}</p>
                    }
                </div>
            </div>
        </li>
    )
}


export default function Conversation() {
    return (
        <div className='w-full h-full flex flex-col space-y-2'>
            <div className='w-full h-[60px]'>
                <ConversationHeader  />
            </div>
            <div className='w-full h-fit relative overflow-y-auto' >
                <MessagesList />
            </div>
            <div className='w-full h-[80px]'>
                <ChatInput />
            </div>
        </div>
    )
}


function MessagesSkelton() {
    return (
        <ul style={{height : `calc(100vh - 240px)`}}>
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


function MessagesList() {

    const [ page, setPage ] = useState(1)
    const { authInfos } = useContext(UserContext) || {}
    const { user } = useParams()
    const { messages, setMessages , userData, setUserData } = useContext(ChatContext) || {}
    const observer = useRef<IntersectionObserver | null>(null);
    const lastItem = useRef(null)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        return () => {
            setMessages!(null)
            setUserData!(null)
            setPage(1)
        }
    }, [user])

    useEffect(() => {
        const timer = setTimeout(() => {
            send_fetch_event(page)
            if (userData) setHasMore(page < userData.nbr_pages)
        }, 300)

        return () => {
            clearTimeout(timer)
        }
    }, [page, user])

 
    const topitem = useCallback(() => {
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => { 
            if (entries && entries.length > 0 && entries[0]?.isIntersecting && hasMore) {
                setPage(prev => prev + 1)
            }
        })

        if (lastItem.current) observer.current.observe(lastItem.current)
    }, [lastItem, hasMore, user])


    useEffect(() => {
        return () => {
            if (observer.current) observer.current.disconnect()
        }
    }, [user])

    useEffect(() => {
        if (lastItem.current && messages) {
            setTimeout(() => {
                topitem()
            }, 1000)
        }
    }, [messages, user])

    function send_fetch_event(page : number) {
        chatSocket.sendMessage({
            "partner": user,
            "from": authInfos?.username,
            "event" : "fetch_messages",
            page
        })
    }

    if (!messages) { return ( <MessagesSkelton /> ) }

    return (
        <div>
            <div className='px-2 h-[calc(100vh-350px)] sm:h-[calc(100vh-240px)] overflow-y-auto scroll-bottom flex flex-col-reverse'>
                <div className='flex flex-col '>
                    {
                        messages.map((message : MessageType, index : number) => {
                            if (index === 0) {
                                return (
                                    <div className='w-full' ref={lastItem} key={index}>
                                        <UserMessage m={message}  />
                                    </div>
                                )
                            }
                            return (
                                <div className='w-full' key={index}>
                                    <UserMessage m={message}  />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

function ConversationHeader() {

    const { theme } = useContext(ApearanceContext) || {}
    const { userData } = useContext(ChatContext) || {}

    if (!userData) {
        return (
            <div  className={`header border-b-[1px] ${theme == 'light' ? "border-black/20" : "border-white/20"}  py-8 w-full h-[60px] flex justify-between items-center`}>
                <div className="avatar w-[95%] h-full flex justify-start items-center">
                    <div className='flex'>
                        <div className="bg-gray-300 animate-pulse w-[35px] h-[35px] rounded-full mx-2" />
                        <div className="infos text-[12px]">
                            <h1 className="w-[140px] h-[16px] bg-gray-300 animate-pulse rounded-full"></h1>
                            <p className="w-[60px] h-[10px] mt-2 bg-gray-300 animate-pulse rounded-full"></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div  className={`header  px-4 border-b-[1px] ${theme == 'light' ? "border-black/20" : "border-white/20"}  py-8 w-full h-[60px] flex justify-between items-center`}>
            <div className="avatar w-[95%] h-full flex justify-start items-center">
                <Link className="p-2 flex items-center justify-center cursor-pointer" to="/dashboard/chat">
                    <FaArrowLeft />
                </Link>
                <Link to={`/dashboard/profile/${userData?.user.username}`} className='flex'>
                    <div className='relative'>
                        <img src={userData?.user.profile?.avatar} className="bg-white border-[2px] w-[35px] h-[35px] rounded-full mx-4" alt="avatar" />
                        <div className={`w-2 h-2 rounded-full ${userData.user.profile.online ? "bg-green-500" : "bg-gray-300"} absolute bottom-1 right-4`} />
                    </div>
                    <div className="infos text-[12px]">
                        <h1 className="font-bold text-[11pt]">{userData?.user.username}</h1>
                        <p className="text-[8pt]">{userData?.user.profile?.online ? "online" : "offline"}</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}