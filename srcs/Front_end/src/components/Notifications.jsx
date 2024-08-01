import { faBell, faCaretDown, faCheck, faTrash, faUserPlus, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { ColorContext, ThemeContext } from "../Contexts/ThemeContext";


function NotItem({data}) {
    return (
        <li className="flex font-popins justify-between ml-[50%] translate-x-[-50%] items-center w-full p-1 h-[60px] my-3">
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
        <li className="flex ml-[50%] translate-x-[-50%] w-full p-2 h-[110px] my-3  rounded-md">
            <img src={data.img} alt="user" className="h-10 w-10 rounded-[50%]" />
            <div className="text text-primaryText ml-4 w-full">
                <h1 className="font-bold">{data.user}</h1>
                <p className="text-small mt-1"> {data.user} sent a friend request</p>
                <div className="actions flex items-center text-primaryText mt-4 w-full">
                    <div style={{background:color}} className="flex items-center h-[28px] rounded-sm px-2 cursor-pointer">
                        <p className="mr-2 capitalize">accept</p>
                        <FontAwesomeIcon icon={faCheck} />
                    </div>
                    <div className="flex items-center ml-4 cursor-pointer">
                        <p className="mr-2 capitalize">reject</p>
                        <FontAwesomeIcon icon={faTrash} />
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
                <ul className="px-4 py-2">{nots.map(not => <NotItem key={not.id} data={not}/>)}</ul>
            }
        </div>
    )
}

export function Invites() {
    const showInvites = window.localStorage.getItem('showInvites')
    if(showInvites === null)
            window.localStorage.setItem('showInvites', false);
    const theme = useContext(ThemeContext)
    const [invites, setInvites] = useState(initInvites)
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
                    <div className="dot text-white bg-rose-400 w-[12px] h-[12px] text-[10px] rounded-[50%] flex justify-center items-center">{invites.length}</div>
                </div>
                <FontAwesomeIcon className="text-[14px]" icon={!show ? faCaretDown : faCaretUp} />
            </div>
            {
                show && 
                <ul className="my-2 pb-2 px-4">{invites.map(inv => <InviteItem key={inv.id} data={inv} />)}</ul>
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

const initInvites = [
    {id:0, user:'aamhamdi', img:'/aamhamdi1.jpeg'},
    {id:1, user:'aamhamdi', img:'/aamhamdi1.jpeg'},
]