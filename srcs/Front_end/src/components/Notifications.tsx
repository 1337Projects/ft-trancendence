import React, { useContext, useEffect, useState } from "react";
import {notsSocket} from '../socket'
import { Link } from "react-router-dom";
import { ApearanceContext } from "../Contexts/ThemeContext";
import { UserContext } from "../Contexts/authContext";
import { FaBell, FaCaretDown, FaCheck, FaTrash, FaUserPlus } from "react-icons/fa";
import { FirendType } from "../Types";
import { accept_friend_request, reject_friend_request } from "./profile/ActionsHandlers";

function NotItem({data}) {
    return (
        <li className="flex relative font-popins justify-between ml-[50%] translate-x-[-50%] items-center w-full p-1 h-[60px] my-3">
            <img src={data?.sender?.profile?.image} alt="user" className="h-10 w-10 rounded-[50%]" />
            <div className="text text-primaryText">
                <Link to={data.action}>
                    <h1 className="font-bold">{data.title}</h1>
                </Link>
                <p className="text-small mt-1">{data.sender.username} {data.description}</p>
            </div>
            <div className="date text-center w-[60px] text-[9px]">
                <p className="">{data.date}</p>
                <p className="mt-2">{data.time}</p>
            </div>
            
        </li>
    )
}

function InviteItem({data}) {
    const appearence = useContext(ApearanceContext)
    const { friends, setFriends , user, authInfos } = useContext(UserContext) || {}

    function acceptCallback(id : number) {
        const friendship = friends?.filter(item => item.id == id)[0]
        if( friendship ) {
            friendship.status = 'accept'
            setFriends!(prev => [...prev?.filter(item => item.id != id)!, friendship!])
        }
    }

    function rejectCallback(id : number) {
        setFriends!(prev => [...prev?.filter(item => item.id != id)!])
    }
    
    const sender = data.sender.username == user?.username ? data.receiver : data.sender;
    
    return (
        <li className="flex ml-[50%] translate-x-[-50%] w-full my-2 p-1 h-[50px]">
            <div className="text text-primaryText ml-4 w-full">
                <div className="flex items-center">
                    <Link className="flex" to={`/dashboard/profile/${sender.username}`}>
                        <img src={sender.profile.avatar} alt="user" className="h-10 w-10 rounded-[50%]" />
                        <div className="ml-2">
                            <h1 className="font-bold text-[10pt]">{sender.username}</h1>
                            <p className="text-small mt-1">sent friend request</p>
                        </div>
                    </Link>
                    <div className="ml-4 actions flex w-[100px] justify-evenly  items-center text-primaryText ">
                        <div
                            onClick={() => accept_friend_request(authInfos?.accessToken!, acceptCallback, data.sender)} 
                            className="flex text-[12px]  items-center h-[28px] rounded px-2 cursor-pointer">
                            {/* <p className="mr-2 capitalize">accept</p> */}
                            <FaCheck />
                        </div>
                        <div 
                            onClick={() => reject_friend_request(authInfos?.accessToken!, rejectCallback, data.sender)}
                            style={{borderColor:appearence?.color}} 
                            className="flex text-[12px] items-center border-[0px] h-[28px] rounded px-2 cursor-pointer">
                            {/* <p className="mr-2 capitalize">reject</p> */}
                            <FaTrash />
                        </div>
                    </div>
                </div>
            </div>
        </li>
    ) 
}

export default function Notifications() {
    const notifications = window.localStorage.getItem('showNotifications')
    if (notifications === null)
        window.localStorage.setItem('showNotifications', "false");
    const user = useContext(UserContext)
    const [nots, setNots] = useState([])
    const [show, setShow] = useState(notifications == 'true')
    const appearence = useContext(ApearanceContext)


    useEffect(() => {
        const timer = setTimeout(() => {
            notsSocket.connect("ws://localhost:8000/ws/notifications/abc/")
            notsSocket.addCallback("setNots", setNots)
            notsSocket.sendMessage({
                "user" : user?.authInfos?.username,
                "event" : "fetch nots"
            })
        }, 300)
        return () => clearTimeout(timer)
    }, [])

    function handler(value) {
        setShow(value)
        window.localStorage.setItem('showNotifications', value);
    }

    return (
        <div className={`min-h-[60px]  rounded-sm border-[.3px] ${appearence?.theme === 'light' ? "bg-lightItems text-lightText" : " bg-darkItems text-darkText border-darkText/10"} shadow-sm w-full` }>
            <div className="cursor-pointer flex justify-between w-full h-[50px] items-center px-4" onClick={() => handler(!show)}>
                <div className="content flex items-center text-secondary relative">
                    <h1 className="mr-2 font-popins">Notifications</h1>
                    <FaBell />
                    <div className="dot text-white bg-rose-400 w-[12px] h-[12px] text-[10px] rounded-[50%] flex justify-center items-center">{nots.length}</div>
                </div>
                <FaCaretDown />
            </div>
            {
                show === true && 
                <ul className="border-[.2px] max-h-[360px] overflow-scroll border-darkText/10 rounded-sm m-2">
                    {
                        nots.length ? 
                        nots.map(not => <NotItem key={not.id} data={not}/>)
                         : 
                        <li className={`h-[100px] border-[.3px] rounded-sm flex justify-center items-center ${appearence?.theme == 'light' ? "border-lightText/20" : "border-darkText/20"}`}>
                            <div className="flex items-center">
                                <h1 className="text-[12px] capitalize">
                                    <span className="mr-2 text-[20px]">😕</span> 
                                    <span>no notifications yet</span>
                                </h1>
                            </div>
                        </li>
                    }
                </ul>
            }
        </div>
    )
}

export function Invites() {
    const showInvites = window.localStorage.getItem('showInvites')
    if(showInvites === null)
            window.localStorage.setItem('showInvites', "false");

    const [invites, setInvites] = useState<FirendType[] | undefined>([])
    const [show, setShow] = useState(showInvites == 'true')
    const appearence = useContext(ApearanceContext)
    const {friends, user} = useContext(UserContext) || {}


    useEffect(() => {
        const timer = setTimeout(() => {
            setInvites(friends?.filter(item => item?.status === 'waiting' && item?.sender?.username != user?.username))
        }, 300)

        return () => clearTimeout(timer)
    }, [friends])

    function handler(value) {
        setShow(value)
        window.localStorage.setItem('showInvites', value);
    }

    return (
        <div className={`w-full min-h-[60px] border-[.1px] rounded-sm mt-2 ${appearence?.theme === 'light' ? "bg-lightItems text-lightTextb border-lightText/10" : " bg-darkItems text-darkText border-darkText/10"}`}>
            <div className="header px-6 h-[60px] relative cursor-pointer flex justify-between w-full items-center" onClick={() => handler(!show)}>
                <div className="content flex items-center text-secondary relative">
                    <h1 className="mr-2">invites</h1>
                    <FaUserPlus />
                    <div className="dot text-white bg-rose-400 w-[12px] h-[12px] text-[10px] rounded-[50%] flex justify-center items-center">{invites?.length}</div>
                </div>
                <FaCaretDown />
            </div>
            {
                show && 
                <ul className={`my-2 border-[.3px] ${appearence?.theme == 'light' ? "border-lightText/20" : "border-darkText/20"} m-2 rounded-sm`}>
                    {
                        invites?.length ? 
                        invites.map((inv, index) => <InviteItem key={index} data={inv} />)
                        :
                        <li className="h-[100px] flex justify-center items-center">
                            <div className="flex items-center">
                                <h1 className="text-[12px] capitalize"><span className="text-[20px] mr-2">😕</span> no invites yet</h1>
                            </div>
                        </li>
                    }
                </ul>
            }
        </div>
    )
}

