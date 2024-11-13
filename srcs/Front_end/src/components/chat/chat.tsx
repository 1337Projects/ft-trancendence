import React, { SetStateAction, useContext, useEffect, useReducer, useState } from "react";
import Categories from './Categories'
import { Link } from "react-router-dom";
import { ApearanceContext } from "../../Contexts/ThemeContext";
import { UserContext } from "../../Contexts/authContext";
import { FaCheckDouble } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiMenuSearchLine } from "react-icons/ri";
import { CgBlock, CgTrash } from "react-icons/cg";
import MyUseEffect from "../../hooks/MyUseEffect";
import Socket from "../../socket";


const actions = [
    {
        name: 'block user',
        handler : BlockHandler,
        icon : <CgBlock />
    },
    {
        name: 'delete conversation',
        handler : DeleteHandler,
        icon : <CgTrash />
    },
]


async function BlockHandler(user_id : number, partner_id : number) {

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}users/blockUser/`, {
            method : 'POST',
            credentials : 'include',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({id : user_id, id_to_block :  partner_id})
        })
    
        if (!response.ok) {
            console.log(await response.json())
            throw new Error("somthing went wrong")
        }

        console.log(await response.json())
    } catch(err) {
        console.log(err.toString())
    }
}

async function DeleteHandler(conversation_id : number) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/chat/deleteConversations/`, {
            method : 'DELETE',
            credentials : 'include',
            headers : {
                "Content-Type" : "application/json"
            },
            body :  JSON.stringify({conversation_id})
        })

        if (!response.ok) {
            console.log(await response.json())
            throw new Error("somthing went wrong")
        }

        console.log(await response.json())
    } catch (err) {

    }
}

function ConversationOptions({partner}) {
    const {user} = useContext(UserContext) || {}
    return (
        <div className="rounded w-[180px] h-fit p-2 border-[.3px] border-white/20">
            {
                actions.map((action, index) => 
                <div
                    key={index}
                    onClick={() => action.handler(user?.id, partner.id)}
                    className="flex justify-start hover:bg-red-800/30 rounded p-2 items-center h-[30px] font-thin"
                >
                    <p className="text-sm lowercase mr-2">{action.name}</p>
                    <div className="text-[14pt]"> {action.icon} </div>
                </div>)
            }
        </div>
    )
}


function ConvItem({c, id, menu}) {
    const [time , setTime] = useState("")
    const {color} = useContext(ApearanceContext) || {}
    const {user} = useContext(UserContext) || {}
    const data = Object.filter(c, i => typeof i === "object" && i.username !== user?.username)[0]
    const [open, setOpen] = useState<Boolean>(false)
    
    useEffect(() => {
        let date = new Date(c?.last_message_time);
        const hours = date.getUTCHours()
        const mins = date.getUTCMinutes()
        setTime(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    }, [c])

    return (
        <li className="w-full h-[60px] rounded md:p-2 border-white/30  relative mt-3 flex justify-center items-center cursor-pointer">
            <Link to={`${data.username}`} className={`flex justify-start items-center w-full md:px-4 ${menu && "test-style px-4"}`}>
                <div className={`flex  ${menu ? "test-style" : "justify-center"} md:justify-start  items-center w-full`}>
                    <div className={`w-[35px] h-[35px] md:mr-4 ${menu && " test-style mr-4"}`}>
                        <img src={data?.profile?.avatar} className="w-full bg-white h-full rounded-full" alt="img" />
                    </div>
                    <div className={`content text-[14px] w-fit ${menu ? "test-style" : "hidden"} md:block`}>
                        <h1 className="font-bold ">{data?.username}</h1>
                        <p className="text-[8px] mt-1 flex items-center">
                            <FaCheckDouble className="mr-2 text-sky-400" />
                            {c.content_of_last_message?.substring(0,20)} ...
                        </p>
                    </div>
                </div>
                <div className={`date ${menu ? "test-style" : "hidden"} md:flex justify-end w-[70px] items-center relative mr-4`}>
                    {data.categorie === 'unread' &&  <div style={{background:color}} className="dot flex items-center justify-center w-[20px] h-[20px] text-[9px] font-bold rounded-full text-white">1</div>}
                    <p className="text-[8px] ml-4">{time}</p>
                </div>
            </Link>
            <div 
                className={`md:block relative ${menu ? "test-style" : "hidden"}`}
                onClick={() => setOpen(prev => !prev)}    
            >
                <BsThreeDotsVertical />
                <div className="absolute right-0 top-4 backdrop-blur-md">
                    { open && <ConversationOptions partner={data} /> }
                </div>
            </div>
        </li>
    )
}

export function Friends({menu, handler} : {menu : Boolean, handler : React.Dispatch<SetStateAction<Boolean>>}) {
    const {friends, authInfos} = useContext(UserContext) || {}

    return (
        <ul className={`w-full max-h-[300px]  md:h-[100px] md:p-2  md:flex md:items-center ${menu ? "h-[100px] p-2  flex items-center test-style" : "h-fit pb-6 grid grid-cols-1 content-start"}`}>
            {
                friends?.length ?
                friends?.filter(f => f.status == 'accept').map((f, index) => {
                    const data = Object.filter(f, i => typeof i === "object" && i.username !== authInfos?.username)[0]
                    return (
                        <li 
                            key={index}
                            onClick={() => handler(false)}  
                            className={`md:w-[80px] md:h-full  flex justify-center items-center ${menu ? "h-full w-[80px] test-style" : "w-full h-[50px]"}`}
                        >
                            <Link to={data.username} className="w-full">
                                <div className="relative w-full">
                                    <img src={data.profile.avatar} className="w-[35px] h-[35px] border-2 mx-auto rounded-full" alt="" />
                                    <div className={`h-2 w-2 ${data.profile.online ? "bg-green-400" : "bg-red-400"}  rounded-full absolute top-[27px]  md:right-4 right-6`}></div>
                                    <h1 className={`text-[8pt] text-center mt-2 ${menu ? "block test-style" : "hidden"} md:block`}>{data.username}</h1>
                                </div>
                            </Link>
                        </li>
                    )
                })
                :
                <div className={`text-sm text-center w-full ${menu ? "block test-style" : "hidden"} border-[.6px] border-white/20 rounded-md p-6`}>no firends yet</div>
            }
        </ul>
    )
}

Object.filter = (obj, predicate) => 
    Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .map(key => obj[key]);

export default function ConversationsList({menu, data} : {menu : Boolean, data : any}) {
    
    const { theme } = useContext(ApearanceContext) || {}
    const { authInfos } = useContext(UserContext) || {}
    const [visibleItem, setVisibleItem] = useState(null)

    const [query, setQuery] = useState<string>('')

    const [cnvs, setcnvs] = useState(data)


    MyUseEffect(() => {
        setcnvs(data)
        if (query != '') {
            setcnvs(prev => prev.filter(cnv => {
                const partner = Object.filter(cnv, i =>  typeof i === "object" && i.username !== authInfos?.username)[0]
                return partner.username.includes(query)
            }))
        }
    }, [data, query])

    return (
            <div className="">
                <div className="flex items-center mt-4">
                    <input 
                        type="text" 
                        placeholder="search..." 
                        className={`w-full ${menu ? "test-style" : "hidden"} md:block px-4 text-xs rounded-full bg-transparent h-[35px]  ${theme == 'light' ? "border-black/20" : "border-white/20"} border-[.5px]`} 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className={`mt-10 md:block ${menu ? "test-style" : "hidden"}`}>
                    <Categories categorie="all" Handler={null} />
                </div>
                <ul className="mt-10">
                    {
                        cnvs.length ?
                            cnvs?.map(c => {
                                return <ConvItem id={visibleItem} menu={menu}  key={c.id} c={c} />
                            })
                        :
                        <div className={`text-center border-[.6px] border-white/20 rounded-md p-10 text-sm ${menu ? "block test-style" : "hidden"} `}>no conversations found</div>
                    }
                </ul>
            </div>
    )
}

