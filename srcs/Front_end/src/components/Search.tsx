import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Contexts/authContext";
import { FaAnglesUp, FaGear, FaRightToBracket } from "react-icons/fa6";
import { ApearanceContext } from "../Contexts/ThemeContext";
import { FaCaretDown, FaSearch, FaUser } from "react-icons/fa";
import { LuBell } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { NotificationsContext } from "../Contexts/NotificationsContext";
import { InviteItem, NotItem } from "./Notifications";


function SearchResult({query, queryHandler}) {
    const navigate = useNavigate()
    const user = useContext(UserContext)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const {theme} = useContext(ApearanceContext) || {}
    useEffect(() => {
        const timer = setTimeout(async () => {
            await fetch(`${import.meta.env.VITE_API_URL}api/profile/users/?query=${query}`, {
                method : 'GET',
                headers : {
                    "Content-Type": "application/json",
					"Authorization": `Bearer ${user?.authInfos?.accessToken}`
                },
                credentials : 'include'
            })
            .then(res => res.json())
            .then(data => {
                if (data.data != undefined) {
                    setData(data.data)
                }
            })
            .catch(err => console.log("err:", err))
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [query])

    function eventHandler(user) {
        queryHandler('')
        navigate(`/dashboard/profile/${user}`)
    }

    return (
        <>
            <div className={`text-[12px] ${theme == 'light' ? "bg-lightItems" : "bg-darkItems"} w-full z-20  border-r-[.2px] border-l-[.2px] border-b-[.2px] border-darkText/10 mt-2 absolute ml-[-1.7rem] p-4 h-fit`}>
                <ul>
                    {
                        (data != null && data?.length) ? 
                        data.map(i => {
                            return ( 
                                <li 
                                    key={i?.id} 
                                    className="flex my-2 items-center justify-between border-[.2px] p-2 rounded-md border-white/10 cursor-pointer" 
                                    onClick={() => eventHandler(i?.username)}
                                >
                                    <div className="flex">
                                        <img  src={i?.profile?.avatar} className="w-[44px] h-[44px] bg-white rounded-md mr-4" alt={i?.profile?.avatar} />
                                        <div>
                                            <p className="text-[16px] lowercase font-bold">{i.username}</p>
                                            <p className="mt-[4px]">{i?.first_name} {i?.last_name}</p>

                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <h1 className="mr-2">{i?.profile?.level} LVL</h1>
                                        <FaAnglesUp />
                                    </div>
                                </li>)
                        }) : !loading ? <h1>not found</h1> : <h1>Loading...</h1>
                    }
                </ul>
            </div>
        </>
    )
}

function HeaderItems({icon}) {
    return (
        <div className="relative text-[16pt] cursor-pointer ml-6">
            {icon}
            <span className="absolute top-0 flex justify-center items-center h-2 left-0 w-2">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-red-500"></span>
            </span>
        </div>
    )
}

export default function Search() {
    const [searchText, seTSearchText] = useState('')
    const user = useContext(UserContext)
    const appearence = useContext(ApearanceContext)
    const { notifications } = useContext(NotificationsContext) || {}
    const notsRef = useRef(null)
    const invRef = useRef(null)
    const [ notsOpen, setNotsOpen ] = useState(false)
    const [ invitesOpen, setInvitesOpen ] = useState(false)
    const toggleButtonRef = useRef(null)
    const invites = user?.friends?.filter(item => item.status == 'waiting' && item.sender.username != user?.user?.username)

    useEffect(() => {

        const handleClickOutside = (event) => {
            if (notsRef.current && notsRef.current != event.target && toggleButtonRef.current != event.target) {
                setNotsOpen(false)
            }
            if (invRef.current && invRef.current != event.target) {
                setInvitesOpen(false)
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
      

        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [])

    return (
        <>
            <div className="flex relative w-full h-[60px]">
                <div
                    className={`
                    ${appearence?.theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/10"}
                    search flex-grow h-full
                    rounded-sm p-1 px-3 flex items-center shadow-sm  relative
                `}>
                    <FaSearch className="text-xl" />
                    <div className="w-full ml-2 relative">
                        <input 
                            type="text" 
                            value={searchText} 
                            onChange={(e) => seTSearchText(e.target.value)} 
                            placeholder="search..." 
                            className="w-full h-full border-none bg-transparent text-primaryText ml-1 focus:outline-none" 
                        />
                        {
                            searchText != '' &&
                            <SearchResult query={searchText} queryHandler={seTSearchText} /> 
                        }
                        <div className="absolute top-0 right-0 w-fit h-full flex items-center lg:hidden">
                            <button ref={toggleButtonRef} onClick={(e) => {
                                setNotsOpen(prev => !prev)
                            }}>
                                <HeaderItems icon={<LuBell />} />
                            </button>
                            <button onClick={() => setInvitesOpen(prev => !prev)}>
                                <HeaderItems icon={<FiUser />} />
                            </button>
                            {
                                notsOpen &&
                                <div ref={notsRef} className="bg-darkItems overflow-scroll border-[.3px] border-white/20 rounded p-2 absolute top-12 right-[-10px] w-[300px] h-fit max-h-[400px] z-10">
                                    {
                                        notifications?.length ? 
                                        notifications.map(not => {
                                            return (
                                                <NotItem data={not} />
                                            )
                                        })
                                        :
                                        <div className="w-full h-[80px] text-xs capitalize rounded flex justify-center items-center">
                                            not nots yet
                                        </div>
                                    }
                                </div>
                            }
                            {
                                invitesOpen &&
                                <div ref={invRef} className="bg-darkItems overflow-scroll border-[.3px] border-white/20 rounded p-2 absolute top-12 right-[-10px] w-[300px] h-fit max-h-[400px] z-10">
                                    {
                                        invites?.length ? 
                                        invites.map(not => {
                                            return (
                                                <InviteItem data={not} />
                                            )
                                        })
                                        :
                                        <div className="w-full h-[80px] text-xs capitalize rounded flex justify-center items-center">
                                            not invites yet
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={`
                    ${appearence?.theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/10"}
                   w-[170px] border-[0px] h-full z-10 rounded-sm ml-2 shadow-sm cursor-pointer`}>
                    <div className="flex items-center justify-center h-full">
                        <div className="infos">
                            <div className="top flex text-small mb-1 justify-between items-center">
                                <p>enjoy</p>
                            </div>
                            <h1 className="text-primaryText font-bold">{user?.user?.username}</h1>
                        </div>
                        <img className="w-[40px] h-[40px] rounded-[50%] h-25px border-[1px] bg-white ml-4" src={user?.user?.profile?.avatar} alt="avatar" />
                    </div>
                </div>
                
            </div>
            
        </>
    )
}