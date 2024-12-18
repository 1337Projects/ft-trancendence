import React, { SetStateAction, useContext, useEffect, useReducer, useState } from "react";
import Categories from './Categories'
import { Link } from "react-router-dom";
import { ApearanceContext } from "../../Contexts/ThemeContext";
import { UserContext } from "../../Contexts/authContext";
import { FaCheckDouble } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CgBlock, CgTrash } from "react-icons/cg";
import MyUseEffect from "../../hooks/MyUseEffect";


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


function ConvItem({c, menu}) {
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
        <li className="w-full h-[60px] rounded xl:p-2 border-white/30 relative mt-3 flex items-center cursor-pointer">
            <Link to={`${data.username}`} className={`flex justify-start items-center w-full ${menu && "test-style"}`}>
                <div className={`flex  ${menu ? "test-style" : "justify-center"} xl:justify-start items-center w-full`}>
                    <div className={`w-[35px] h-[35px] ${menu && "test-style"}`}>
                        <img src={data?.profile?.avatar} className="w-full bg-white h-full rounded-full" alt="img" />
                    </div>
                    <div className={`content w-fit ml-4 ${menu ? "test-style" : "hidden"} xl:block`}>
                        <div className="flex justify-between items-center">
                            <h1 className="font-bold text-[10pt]">{data?.username}</h1>
                            <p className="text-[7pt]">{time}</p>
                        </div>
                        <p className="text-[8pt] w-[140px] overflow-hidden">
                            {c.content_of_last_message}
                        </p>
                    </div>
                </div>
            </Link>
            {/* <div 
                className={`xl:block relative ${menu ? "test-style" : "hidden"}`}
                onClick={() => setOpen(prev => !prev)}    
            >
                <BsThreeDotsVertical />
                <div className="absolute right-0 top-4 backdrop-blur-md">
                    { open && <ConversationOptions partner={data} /> }
                </div>
            </div> */}
        </li>
    )
}


export function Friends({menu, handler} : {menu : Boolean, handler : React.Dispatch<SetStateAction<Boolean>>}) {
    const {friends, authInfos} = useContext(UserContext) || {}
    const { theme } = useContext(ApearanceContext) || {}

    if (!friends) {
        return (
            <div>loading ...</div>
        )
    } 

    return (
        <ul className={`w-full xl:p-4 max-h-[300px] xl:h-[100px] xl:flex xl:items-center ${menu ? "h-[100px] p-2  flex items-center test-style" : "h-fit pb-6 grid grid-cols-1 content-start"}`}> 
            {
                friends.length > 0  ?
                    friends?.filter(f => f.status == 'accept').map((f, index) => {
                        const data = Object.filter(f, i => typeof i === "object" && i.username !== authInfos?.username)[0]
                        return (
                            <li 
                                key={index}
                                onClick={() => handler(false)}  
                                className={`xl:w-[80px] xl:h-full  flex justify-center items-center ${menu ? "h-full w-[80px] test-style" : "w-full h-[50px]"}`}
                            >
                                <Link to={data.username} className="w-full">
                                    <div className="relative w-full">
                                        <img src={data.profile.avatar} className="w-[35px] h-[35px] border-2 mx-auto rounded-full" alt="" />
                                        <div className={`h-2 w-2 ${data.profile.online ? "bg-green-400" : "bg-red-400"}  rounded-full absolute top-[27px]  xl:right-4 right-6`}></div>
                                        <h1 className={`text-[8pt] text-center mt-2 ${menu ? "block test-style" : "hidden"} xl:block`}>{data.username}</h1>
                                    </div>
                                </Link>
                            </li>
                        )
                    })
                :
                <div className={`text-xs text-center w-full ${menu ? "block test-style" : "hidden xl:block"} ${theme == 'light' ? "border-black/20" : "border-white/20"} border-[.6px] rounded-md p-6`}>no firends yet</div>
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

    const [query, setQuery] = useState<string>('')

    const [cnvs, setcnvs] = useState(null)

    
    MyUseEffect(() => {
        setcnvs(data)
        if (query != '') {
            setcnvs(prev => prev.filter(cnv => {
                const partner = Object.filter(cnv, i =>  typeof i === "object" && i.username !== authInfos?.username)[0]
                return partner.username.includes(query)
            }))
        }
    }, [data, query])
    
    if (!cnvs) {
        return (
            <div className="px-2 ">
                <div className="flex items-center mt-4">
                    <div className="h-8 rounded-full animate-pulse w-full bg-gray-300" />
                </div>
                <div className={`mt-10 md:block ${menu ? "test-style" : "hidden"}`}>
                    <div className="flex">
                        <div className="w-[60px] mr-4 h-8 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-[60px] h-8 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                </div>
                <ul className="mt-10">
                    <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-full h-8 bg-gray-300 mt-4 rounded animate-pulse"></div>
                    <div className="w-full h-8 bg-gray-300 mt-4 rounded animate-pulse"></div>
                </ul>
            </div>
        )
    }

    return (
            <div className="">
                <div className="flex items-center xl:p-4 mt-4">
                    <input 
                        type="text" 
                        placeholder="search..." 
                        className={`w-full ${menu ? "test-style" : "hidden"} outline-none xl:block px-4 text-xs rounded-full bg-transparent h-[35px]  ${theme == 'light' ? "border-black/20" : "border-white/20"} border-[.5px]`} 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className={`mt-4 xl:block ${menu ? "test-style" : "hidden"}`}>
                    <Categories categorie="all" Handler={null} />
                </div>
                <ul className="mt-10 xl:px-2">
                    {
                        cnvs.length ?
                            cnvs?.map(c => {
                                return <ConvItem menu={menu}  key={c.id} c={c} />
                            })
                        :
                        <div className={`text-center border-[.6px] ${theme == 'light' ? "border-black/20" : "border-white/20"}  rounded-md p-10 text-xs ${menu ? "block test-style" : "hidden xl:block"} `}>no conversations found</div>
                    }
                </ul>
            </div>
    )
}

