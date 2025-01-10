import { useContext, useEffect, useState, useRef } from "react";
import { notificationSocket } from "@/socket";
import { Link } from "react-router-dom";
import { ApearanceContext } from "@/Contexts/ThemeContext";
import { UserContext } from "@/Contexts/authContext";
import { FaCaretDown, FaCheck, FaTrash } from "react-icons/fa";
import { NotificationsContext } from "@/Contexts/NotificationsContext";
import { RelationsHandler, ResType } from "./profile/ActionsHandlers";
import { NotificationType } from "@/types";
import { FirendType } from "@/types/user";
import { HeaderItems } from "./Search";
import { LuBell } from "react-icons/lu";
import { FiUser } from "react-icons/fi";



export function NotItem({data} : {data : NotificationType}) {

    const createdAt = new Date(data.created_at)
    const date :string = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getDate().toString().padStart(2, '0')}`;
    const time :string = `${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}`;
    
    // const fiveMinutesLater = new Date(createdAt.getTime() + 5 * 60 * 1000);
    // console.log(data)
    
    const expired = data?.link === null ? true : false;
    return (
        <li style={{opacity : expired ? "0.7" : "1", cursor : expired ? "not-allowed" : "pointer"}} className="relative font-popins w-full h-[60px] my-3">
            <Link className="flex justify-between px-4 items-center w-full h-full" to={`${expired ? "#" : data?.link}`}>
                <img src={data?.sender?.profile?.avatar} alt="user" className="h-10 w-10 border-[1px] mr-4 border-black/20 rounded-[50%]" />
                <div className="text text-primaryText">
                    <h1 className="font-bold text-sm">{data.sender.username}</h1>
                    <p className="mt-1 text-[8pt]">{data.message}</p>
                </div>
                <div className="date text-center w-[60px] text-[9px]">
                    <p className="">{date}</p>
                    <p className="mt-2">{time}</p>
                </div>
            </Link>
        </li>
    )
}

export function InviteItem({data} : {data : FirendType}) {
    const appearence = useContext(ApearanceContext)
    const { setFriends , authInfos } = useContext(UserContext) || {}

    const notificationAcceptFriendRequest = () => {
        notificationSocket.sendMessage({
            event: "send_request",
            sender: data?.sender?.username, // Your logged-in user's username
            receiver: data?.receiver?.username, // Username of the friend to whom the request is sent
            message: `${data?.receiver?.username} accept your Invitation`,
            link : `${import.meta.env.VITE_API_URL}dashboard/profile/${data?.receiver?.username}`,
        });
    };

    function AcceptFriendCallback(response : ResType) {
        setFriends!(prev => prev ? [...prev.filter(item => item.id != (response as FirendType).id), response as FirendType] : [response as FirendType])
        notificationAcceptFriendRequest();
    }

    

    function DeleteFriendRequest(response : ResType) {
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
                                    authInfos?.accessToken || "",
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
                                    authInfos?.accessToken || "",
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

    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1124)

    const notificationsOpen = window.localStorage.getItem('showNotifications')
    if (notificationsOpen === null)
        window.localStorage.setItem('showNotifications', "false");

    const { notifications, hasNew, setHasNew , fetchMoreNotifications, hasMore } = useContext(NotificationsContext) || {}
    const { user, authInfos } = useContext(UserContext) || {}
    
    const [show, setShow] = useState(notificationsOpen == 'true')
    const appearence = useContext(ApearanceContext)
    const containerRef = useRef<null | HTMLDivElement>(null);

    const handleScroll = () => {
        if (!containerRef.current || !hasMore) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

        if (scrollTop + clientHeight >= scrollHeight - 1) {
            fetchMoreNotifications?.();
            containerRef.current.scrollTop -= 5;
        }
    };

    useEffect(() => {
        setIsLargeScreen(window.innerWidth >= 1124)
        let timer : NodeJS.Timeout | null = null;

        function callback() {
            setIsLargeScreen(window.innerWidth >= 1124)
        }

        window.addEventListener('resize', () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(callback, 300)
        })

        return () => {
            window.removeEventListener('resize', callback)
            if (timer) clearTimeout(timer);
        }

    }, [])

    function isNew(lst_time : string, not_time : string) {
        return new Date(not_time) > new Date(lst_time)
    }

    async function UpdateTime(time : string) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}api/profile/setLastNotTime/time/`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${authInfos?.accessToken}`
                },
                body : JSON.stringify({time}),
                credentials : 'include'
            })

            if (!response.ok) {
                throw new Error('Failed to update last notification time')
            }

            setHasNew!(0)
        } catch (error) {
            console.log(error instanceof Error ? error.toString() : "Failed to update last notification time")
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                    isLargeScreen &&
                    show &&
                    notifications && 
                    notifications.length > 0 && 
                    isNew(user!.last_notification_seen, notifications[0]!.created_at)
            ) {
                UpdateTime(notifications[0]!.created_at)
            }

        }, 300)

        return () => {
            clearTimeout(timer)
        }
    }, [show, notifications, isLargeScreen])

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
    }, [fetchMoreNotifications]);


    function handler(value : boolean) {
        setShow(value)
        window.localStorage.setItem('showNotifications', String(value));
    }



    return (
        <div className={`min-h-[70px] w-full rounded-sm border-[.3px] ${appearence?.theme === 'light' ? "bg-lightItems text-lightText" : " bg-darkItems text-darkText border-darkText/10"} shadow-sm w-full` }>
            <div className="cursor-pointer flex justify-between w-full h-[50px] items-center px-4" onClick={() => handler(!show)}>
                <div className="content flex items-center text-secondary relative">
                    <h1 className="font-popins">Notifications</h1>
                    <HeaderItems icon={<LuBell />} hasNew={hasNew!} />
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
                    <h1 className="">invites</h1>
                    <HeaderItems icon={<FiUser />} hasNew={invites?.length || 0} />
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

