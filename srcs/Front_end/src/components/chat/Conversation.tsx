import React, {useContext, useState, useRef, useEffect, useCallback} from 'react'
import { Link, useParams } from 'react-router-dom';

import { chatSocket } from '../../socket'
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { UserContext } from '../../Contexts/authContext';
import { FaArrowLeft, FaEllipsisV } from 'react-icons/fa';
import ChatInput from './ChatInput';
import MyUseEffect from '../../hooks/MyUseEffect';
import { ChatContext } from '../../Contexts/ChatContext';
import { GoBlocked } from "react-icons/go";
import { CgUnblock } from "react-icons/cg";
import { BlockHandler } from './chat'


function calc_time(created_at) {
    if (!created_at) return ''
    const date = new Date(created_at);
    return date.toLocaleString('en-US', { hour: 'numeric', minute : '2-digit',  hour12: true })
}

function UserMessage({m, username}) {
    const [time, setTime] = useState<string>('')
    MyUseEffect(() => setTime(calc_time(m?.created_at)), [m?.created_at])

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
                    <h1 className="text-[14px] break-words min-w-[100px]">{m?.message}</h1>
                </div>
            </div>
        </li>
    )
}


export default function Conversation() {
    const { userData } = useContext(ChatContext) || {}
    return (
        <div className='w-full h-full flex flex-col space-y-2'>
            <div className='w-full h-[60px]'>
                <ConversationHeader userData={userData?.user} friendShip={userData?.freindship}  />
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



function MessagesList() {

    const [ page, setPage ] = useState(1)
    const { authInfos } = useContext(UserContext) || {}
    const { user } = useParams()
    const { messages, setMessages , userData } = useContext(ChatContext) || {}
    const observer = useRef<IntersectionObserver | null>(null);
    const lastItem = useRef(null)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        return () => {
            setMessages!(null)
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
            if (entries[0].isIntersecting && hasMore) {
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

    MyUseEffect(() => {
        if (lastItem.current && messages) {
            setTimeout(() => {
                topitem()
            }, 1000)
        }
    }, [messages, user])

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

    return (
        <div>
            <div style={{height : `calc(100vh - 220px)`}} className='px-2 overflow-y-auto scroll-bottom flex flex-col-reverse'>
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

function ConversationHeader({userData, friendShip}) {

    const { theme } = useContext(ApearanceContext) || {}
    const { user, authInfos } = useContext(UserContext) || {}
    const currentUser = friendShip?.receiver?.username == authInfos?.username ? friendShip?.receiver : friendShip?.sender

    async function BlockUser() {
        const res = await BlockHandler(user.id, userData.id)
        console.log(res)
    }

    async function UblockHandler() {
        try {

            const response = await fetch(`${import.meta.env.VITE_API_URL}api/users/unblockUser/`, {
                method : 'POST',
                credentials : 'include',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({id : user.id, id_to_unblock :  userData.id})
            })

            if (!response.ok) {
                console.log(await response.json())
                throw Error("")
            }

            console.log(await response.json())
            
        } catch (error) {
            console.log(error.toString())
        }
    }


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
                    <div className='relative'>
                        <img src={userData?.profile?.avatar} className="bg-white border-[2px] w-[35px] h-[35px] rounded-full mx-4" alt="avatar" />
                        <div className={`w-3 h-3 rounded-full ${userData.profile.online ? "bg-green-500" : "bg-red-500"} absolute bottom-0 right-4`} >
                            <div className='w-2 h-2 bg-gray-300 absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] rounded-full' />
                        </div>
                    </div>
                    <div className="infos text-[12px]">
                        <h1 className="font-bold text-[11pt]">{userData?.username}</h1>
                        <p className="text-[8pt]">{userData?.profile?.online ? "online" : "offline"}</p>
                    </div>
                </Link>
            </div> 
            <div className='flex items-center'>
                {

                    // (friendShip.blocker && friendShip.blocker == currentUser.id) && (
                        friendShip.status == "blocked" ?
                        <div onClick={UblockHandler} className='flex flex-col justify-center items-center'>
                            <CgUnblock className='mr-2' /> 
                            <h1 className='text-xs'>unblock</h1>
                        </div>
                        :
                        <>
                            <GoBlocked className='mr-2' onClick={BlockUser} />
                            <h1 className='text-xs'>block</h1>
                        </>
                    // )
                }
            </div>
        </div>
    )
}