import React, { useContext, useEffect, useState, useRef } from "react";
import { notificationSocket } from "@/socket";
import { Link } from "react-router-dom";
import { ApearanceContext } from "@/Contexts/ThemeContext";
import { UserContext } from "@/Contexts/authContext";
import { FaBell, FaCaretDown, FaCheck, FaTrash, FaUserPlus } from "react-icons/fa";
import { FirendType, UserType } from "@/Types";
import { NotificationsContext } from "@/Contexts/NotificationsContext";
import { RelationsHandler } from "./profile/ActionsHandlers";

type NotificationType = {
    created_at : string,
    sender : UserType,
    action : string,
    message : string
}

export function NotItem({data} : {data : NotificationType}) {

    const createdAt = new Date(data.created_at);

    const date :string = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getDate().toString().padStart(2, '0')}`;
    const time :string = `${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}`;

    return (
        <li className="flex relative font-popins justify-between px-4 items-center w-full h-[60px] my-3">
            <img src={data?.sender?.profile?.avatar} alt="user" className="h-10 w-10 border-[1px] mr-4 border-black/20 rounded-[50%]" />
            <div className="text text-primaryText">
                <Link to={data.action}>
                    <h1 className="font-bold text-sm">{data.sender.username}</h1>
                </Link>
                <p className="mt-1 text-[8pt]">{data.message}</p>
            </div>
            <div className="date text-center w-[60px] text-[9px]">
                <p className="">{date}</p>
                <p className="mt-2">{time}</p>
            </div>
            
        </li>
    )
}

export function InviteItem({data} : {data : FirendType}) {
    const appearence = useContext(ApearanceContext)
    const { setFriends , authInfos } = useContext(UserContext) || {}

    const notificationAcceptFriendRequest = (data) => {
        notificationSocket.sendMessage({
            event: "send_request",
            sender: data?.sender?.username, // Your logged-in user's username
            receiver: data?.receiver?.username, // Username of the friend to whom the request is sent
            message: `${data?.receiver?.username} accept your Invitation`,
        });
    };

    function AcceptFriendCallback(response : FirendType) {
        setFriends!(prev => prev ? [...prev.filter(item => item.id != response.id), response] : [response])
        notificationAcceptFriendRequest(data);
    }

    

    function DeleteFriendRequest(response : number) {
        setFriends!(prev => prev ? prev.filter(item => item.id != response) : [])
    }
 

    return (
        <li className="flex ml-[50%] translate-x-[-50%] w-full my-2 p-1 h-[70px]">
            <div className="text text-primaryText w-full">
                <div className="flex items-center justify-center h-full">
                    <Link className="flex" to={`/dashboard/profile/${data.sender.username}`}>
                        <img src={data.sender.profile.avatar} alt="user" className="h-10 w-10 rounded-[50%]" />
                        <div className="ml-2">
                            <h1 className="font-bold text-[10pt]">{data.sender.username}</h1>
                            <p className="text-small mt-1">sent friend request</p>
                        </div>
                    </Link>
                    <div className="ml-4 actions flex w-[100px] justify-evenly  items-center text-primaryText ">
                        <div
                            onClick={
                                () => RelationsHandler(
                                    'api/friends/accept_friend/',
                                    authInfos?.accessToken!,
                                    data.sender,
                                    AcceptFriendCallback
                                )
                            } 
                            className="flex text-[12px]  items-center h-[28px] rounded px-2 cursor-pointer">
                            {/* <p className="mr-2 capitalize">accept</p> */}
                            <FaCheck />
                        </div>
                        <div 
                            onClick={() => 
                                RelationsHandler(
                                    'api/friends/reject_friend/',
                                    authInfos?.accessToken!,
                                    data.sender,
                                    DeleteFriendRequest
                                )
                            }
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
    const notificationsOpen = window.localStorage.getItem('showNotifications')
    if (notificationsOpen === null)
        window.localStorage.setItem('showNotifications', "false");

    const { notifications, hasNew, setHasNew } = useContext(NotificationsContext) || {}
    const [show, setShow] = useState(notificationsOpen == 'true')
    const appearence = useContext(ApearanceContext)


    const { fetchMoreNotifications, hasMore } = useContext(NotificationsContext) || {};
    const containerRef = useRef(null);


    const handleScroll = () => {
        if (!containerRef.current || !hasMore) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

        if (scrollTop + clientHeight >= scrollHeight - 0.5) {
            fetchMoreNotifications();
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [fetchMoreNotifications, hasMore]);


    function handler(value : boolean) {
        setShow(value)
        window.localStorage.setItem('showNotifications', String(value));
    }

    useEffect(() => {
        if (show && hasNew) {
            setTimeout(() => {
                setHasNew!(false)
            }, 3000)
        }
    }, [show])

    return (
        <div className={`min-h-[70px] w-full rounded-sm border-[.3px] ${appearence?.theme === 'light' ? "bg-lightItems text-lightText" : " bg-darkItems text-darkText border-darkText/10"} shadow-sm w-full` }>
            <div className="cursor-pointer flex justify-between w-full h-[50px] items-center px-4" onClick={() => handler(!show)}>
                <div className="content flex items-center text-secondary relative">
                    <h1 className="mr-2 font-popins">Notifications</h1>
                    <FaBell />
                    <div className="dot text-white bg-rose-400 w-[12px] h-[12px] text-[10px] rounded-[50%] flex justify-center items-center">{notifications?.length}</div>
                </div>
                <FaCaretDown />
            </div>
            {
                show === true && 
                <div ref={containerRef} className="list-none p-2 w-full max-h-[360px] overflow-auto rounded-sm">
                    
                    {
                        notifications?.length ? 
                        notifications.map((not, index) => <NotItem key={index} data={not}/>)
                        : 
                        <li className={`h-[100px] border-[.3px] w-full rounded-sm flex justify-center items-center ${appearence?.theme == 'light' ? "border-lightText/20" : "border-darkText/20"}`}>
                            <div className="flex items-center">
                                <h1 className="text-[12px] capitalize">
                                    no notifications yet
                                </h1>
                            </div>
                        </li>
                    }
                </div>
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

    function handler(value : boolean) {
        setShow(value)
        window.localStorage.setItem('showInvites', String(value));
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
                <ul className="p-2">
                    {
                        invites?.length ? 
                        invites.map((inv, index) => <InviteItem key={index} data={inv} />)
                        :
                        <li className={`h-[100px] border-[.3px] flex justify-center items-center ${appearence?.theme == 'light' ? "border-lightText/20" : "border-darkText/20"}`}>
                            <div className="flex items-center">
                                <h1 className="text-[12px] capitalize">no invites yet</h1>
                            </div>
                        </li>
                    }
                </ul>
            }
        </div>
    )
}

