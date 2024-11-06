import React, { SetStateAction, useContext, useEffect, useReducer, useState } from "react";
import Categories from './Categories'
import { Link } from "react-router-dom";
import { ApearanceContext } from "../../Contexts/ThemeContext";
import { UserContext } from "../../Contexts/authContext";
import { FaCheckDouble } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiMenuSearchLine } from "react-icons/ri";
import { CgBlock, CgTrash } from "react-icons/cg";


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


function ConvItem({c, id, handler , menu}) {
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
    }, [])

    return (
        <li className="w-full h-[60px] rounded xl:p-2 border-white/30  relative mt-3 flex justify-center items-center cursor-pointer" onClick={() => handler(null)}>
            <Link to={`${data.username}`} className={`flex justify-start items-center w-full xl:px-4 ${menu && "test-style px-4"}`}>
                <div className={`flex  ${menu ? "test-style" : "justify-center"} xl:justify-start  items-center w-full`}>
                    <div className={`w-[35px] h-[35px] xl:mr-4 ${menu && " test-style mr-4"}`}>
                        <img src={data?.profile?.avatar} className="w-full bg-white h-full rounded-full" alt="img" />
                    </div>
                    <div className={`content text-[14px] w-fit ${menu ? "test-style" : "hidden"} xl:block`}>
                        <h1 className="font-bold ">{data?.username}</h1>
                        <p className="text-[8px] mt-1 flex items-center">
                            <FaCheckDouble className="mr-2 text-sky-400" />
                            {c.content_of_last_message?.substring(0,20)} ...
                        </p>
                    </div>
                </div>
                <div className={`date ${menu ? "test-style" : "hidden"} xl:flex justify-end w-[70px] items-center relative mr-4`}>
                    {data.categorie === 'unread' &&  <div style={{background:color}} className="dot flex items-center justify-center w-[20px] h-[20px] text-[9px] font-bold rounded-full text-white">1</div>}
                    <p className="text-[8px] ml-4">{time}</p>
                </div>
            </Link>
            <div 
                className={`xl:block relative ${menu ? "test-style" : "hidden"}`}
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
        <ul className={`w-full max-h-[300px]  xl:h-[100px] xl:p-2  xl:flex xl:items-center ${menu ? "h-[100px] p-2  flex items-center test-style" : "h-fit pb-6 grid grid-cols-1 content-start"}`}>
            {
                friends?.length ?
                friends?.filter(f => f.status == 'accept').map((f, index) => {
                    const data = Object.filter(f, i => typeof i === "object" && i.username !== authInfos?.username)[0]
                    return (
                        <li 
                            key={index}
                            onClick={() => handler(false)}  
                            className={`xl:w-[80px] xl:h-full  flex justify-center items-center ${menu ? "h-full w-[80px] test-style" : "w-full h-[50px]"}`}
                        >
                            <Link to={data.username}>
                                <div className="relative">
                                    <img src={data.profile.avatar} className="w-[35px] h-[35px] border-2 mx-auto rounded-full" alt="" />
                                    <div className={`h-2 w-2 bg-green-400 rounded-full absolute top-[27px]  xl:right-4 ${menu ? "right-4" : "right-0"}`}></div>
                                    <h1 className={`text-[8pt] text-center mt-2 ${menu ? "block test-style" : "hidden"} xl:block`}>{data.username}</h1>
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

export default function ConversationsList({menu} : {menu : Boolean}) {
    
    const {theme, color} = useContext(ApearanceContext) || {}
    const [visibleItem, setVisibleItem] = useState(null)
    const [cnvs, setCnvs] = useState([])
    // const [data, dispatch] = useReducer(reducerHandler, cnvs);

    const {authInfos} = useContext(UserContext) || {}
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         fetch(`${import.meta.env.VITE_API_URL}api/chat/conversations/`, {
    //             method : 'GET',
    //             credentials : 'include',
    //             headers : {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${authInfos?.accessToken}`
    //             }
    //         })
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.data) {
    //                 setCnvs(data.data)
    //                 console.log("data" ,data.data)
    //             }
    //         })
    //         console.log(cnvs)
    //     }, 300)
    //     return () => clearTimeout(timer)
    // }, [])

    // function ListVisibilityHandler(id) {
    //     id !== visibleItem ? setVisibleItem(id) : setVisibleItem(null);
    // }

    const [query, setQuery] = useState<string>('')
    const [showFriends, setShowFriends] = useState<boolean>(false)
    const [ friends, setFriends ] =  useState([])

    async function search_friends() {
        if (query != '') {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}api/chat/searchInConversation/?name=${query}`, {
                    method : 'GET',
                    credentials  : 'include',
                    headers : {
                        "Authorization": `Bearer ${authInfos?.accessToken}`
                    }
                })
        
                if (!response.ok) {
                    console.log(await response.json())
                    throw new Error("something went wrong")
                }
                const { data } = await  response.json()
                console.log("lool", data)
            } catch (error) {
                console.log(error.toString())
            }
        } else {
            setShowFriends(false)
        }

    }

    return (
            <div className="">
                <div className="flex items-center mt-4">
                    <input 
                        type="text" 
                        placeholder="search ..." 
                        className={`w-full ${menu ? "test-style" : "hidden"} xl:block px-4 rounded-full bg-transparent h-[35px]  ${theme == 'light' ? "border-black/40" : "border-white/40"} border-[1px]`} 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div
                        onClick={search_friends}
                        style={{background : color}} 
                        className="h-[35px] text-white xl:ml-2 mx-auto flex items-center px-4 rounded-full"
                    >
                        <RiMenuSearchLine />
                    </div>
                </div>
                {
                    showFriends  && 
                    <div className="border-[.2px] border-white/30 mt-2 w-full h-[100px] rounded p-2">
                        {
                            friends.length != 0 ?
                                friends.map(fr => <h1>a</h1>)
                            :
                            <h1>not found...</h1>
                        }
                    </div>
                }
                <div className={`mt-10 xl:block ${menu ? "test-style" : "hidden"}`}>
                    <Categories categorie={null} Handler={null} />
                </div>
                <ul className="mt-10">
                    {
                        cnvs.length ?
                            cnvs?.map(c => {
                                return <ConvItem id={visibleItem} menu={menu} handler={ListVisibilityHandler}  key={c.id} c={c} />
                            })
                        :
                        <div className={`text-center border-[.6px] border-white/20 rounded-md p-10 text-sm ${menu ? "block test-style" : "hidden"} `}>no conversations yet</div>
                    }
                </ul>
            </div>
    )
}

