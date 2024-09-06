import { faBell, faCaretDown, faCheck, faTrash, faUserPlus, faCaretUp, faPoo, faBomb, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { ColorContext, ThemeContext } from "../Contexts/ThemeContext";
import { authContext, userContext } from "../Contexts/authContext";


function NotItem({data}) {
    return (
        <li className="flex relative font-popins justify-between ml-[50%] translate-x-[-50%] items-center w-full p-1 h-[60px] my-3">
            <img src={data.img} alt="user" className="h-10 w-10 rounded-[50%]" />
            <div className="text text-primaryText">
                <h1 className="font-bold">{data.type}</h1>
                <p className="text-small mt-1">Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="date">
                <p className="text-[8px]">{data.date}</p>
            </div>
            
        </li>
    )
}

function InviteItem({data}) {
    const color = useContext(ColorContext)
    return (
        <li className="flex ml-[50%] translate-x-[-50%] w-full my-6 p-1 h-fit h-[60px]">
            <div className="text text-primaryText ml-4 w-full">
                <div className="flex items-center">
                    <img src={data?.sender?.profile?.image} alt="user" className="h-10 w-10 rounded-[50%]" />
                    <div className="ml-4">
                        <h1 className="font-bold">{data?.sender?.username}</h1>
                        <p className="text-small mt-1">sent friend request</p>
                    </div>
                    <div className="ml-4 actions flex  items-center text-primaryText ">
                        <div  className="flex text-[10px] text-white items-center h-[28px] rounded px-2 cursor-pointer">
                            {/* <p className="mr-2 capitalize">accept</p> */}
                            <FontAwesomeIcon icon={faCheck} />
                        </div>
                        <div style={{borderColor:color}} className="flex text-[10px] items-center border-[0px] h-[28px] rounded px-2 cursor-pointer">
                            {/* <p className="mr-2 capitalize">reject</p> */}
                            <FontAwesomeIcon icon={faTrash} />
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
        window.localStorage.setItem('showNotifications', false);
    const theme = useContext(ThemeContext)
    const [nots, setNots] = useState(initNots)
    const [show, setShow] = useState(notifications == 'true')

    function handler(value) {
        setShow(value)
        window.localStorage.setItem('showNotifications', value);
    }

    return (
        <div className={`min-h-[60px] rounded-sm border-[.3px] ${theme === 'light' ? "bg-lightItems text-lightText" : " bg-darkItems text-darkText border-darkText/10"} shadow-sm w-full` }>
            <div className="cursor-pointer flex justify-between w-full h-[50px] items-center px-4" onClick={() => handler(!show)}>
                <div className="content flex items-center text-secondary relative">
                    <h1 className="mr-2 font-popins">Notifications</h1>
                    <FontAwesomeIcon icon={faBell} className="relative" />
                    <div className="dot text-white bg-rose-400 w-[12px] h-[12px] text-[10px] rounded-[50%] flex justify-center items-center">{nots.length}</div>
                </div>
                <FontAwesomeIcon className="text-[14px]" icon={!show ? faCaretDown : faCaretUp} />
            </div>
            {
                show === true && 
                <ul className="px-4 py-2 border-[.2px] border-darkText/10 rounded-sm m-2">
                    {
                        nots.length ? 
                        nots.map(not => <NotItem key={not.id} data={not}/>)
                         : 
                        <li className="h-[100px] flex justify-center items-center">
                            <div className="flex items-center">
                                <h1 className="text-[12px] capitalize">😕 no notifications yet</h1>
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
            window.localStorage.setItem('showInvites', false);
    const theme = useContext(ThemeContext)
    const user = useContext(userContext)
    const [invites, setInvites] = useState(user?.friends?.filter(item => item.status == 'waiting'))
    const [show, setShow] = useState(showInvites == 'true')

    function handler(value) {
        setShow(value)
        window.localStorage.setItem('showInvites', value);
    }

    return (
        <div className={`w-full min-h-[60px] border-[.1px] rounded-sm mt-2 ${theme === 'light' ? "bg-lightItems text-lightTextb border-lightText/10" : " bg-darkItems text-darkText border-darkText/10"}`}>
            <div className="header px-6 h-[60px] relative cursor-pointer flex justify-between w-full items-center" onClick={() => handler(!show)}>
                <div className="content flex items-center text-secondary relative">
                    <h1 className="mr-2">invites</h1>
                    <FontAwesomeIcon icon={faUserPlus} />
                    <div className="dot text-white bg-rose-400 w-[12px] h-[12px] text-[10px] rounded-[50%] flex justify-center items-center">{invites?.length}</div>
                </div>
                <FontAwesomeIcon className="text-[14px]" icon={!show ? faCaretDown : faCaretUp} />
            </div>
            {
                show && 
                <ul className="my-2 border-[1px] m-2 border-darkText/10 rounded-sm">
                    {
                        invites.length ? 
                        invites.map(inv => <InviteItem key={inv.sender.id} data={inv} />)
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

const initNots = [
    {id:0, type:'new frient request', img:'/aamhamdi1.jpeg', date:'24-02-23 19:33'},
    {id:1, type:'invite to play', img:'/aamhamdi1.jpeg', date:'24-02-23 19:33'},
    {id:2, type:'new message', img:'/aamhamdi1.jpeg', date:'24-02-23 19:33'},
    {id:3, type:'new message', img:'/aamhamdi1.jpeg', date:'24-02-23 19:33'},
]
