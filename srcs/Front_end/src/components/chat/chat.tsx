import React, { SetStateAction, useContext, useEffect, useState } from "react";
import Categories from './Categories'
import { Link } from "react-router-dom";
import { ApearanceContext } from "../../Contexts/ThemeContext";
import { UserContext } from "../../Contexts/authContext";
import MyUseEffect from "../../hooks/MyUseEffect";



export async function BlockHandler(user_id : number, partner_id : number) {

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/users/blockUser/`, {
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

        return true
    } catch(err) {
        console.log(err.toString())
        
    }
    return false
}



type ConversationType = {
    content_of_last_message : string,
    last_message_time : string

}

function ConvItem({c, menu} : {c : ConversationType, menu : boolean}) {
    const [time , setTime] = useState("")
    const {user} = useContext(UserContext) || {}
    const data = Object.filter(c, i => typeof i === "object" && i.username !== user?.username)[0]
    
    useEffect(() => {
        const date = new Date(c?.last_message_time);
        const hours = date.getUTCHours()
        const mins = date.getUTCMinutes()
        setTime(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    }, [c])

    return (
        <li className="w-full h-[60px] rounded border-white/30 relative mt-3 flex items-center cursor-pointer">
            <Link to={`${data.username}`} className={`flex justify-start items-center w-full ${menu && "test-style"}`}>
                <div className={`flex  ${menu ? "test-style" : "justify-center"} items-center w-full`}>
                    <div className={`w-[35px] h-[35px] ${menu && "test-style"}`}>
                        <img src={data?.profile?.avatar} className="w-full bg-white h-full rounded-full" alt="img" />
                    </div>
                    <div className={`content w-fit ml-4 ${menu ? "test-style" : "hidden"}`}>
                        <div className="flex justify-between items-center">
                            <h1 className="font-bold text-[10pt] max-w-[100px] truncate">{data?.username}</h1>
                            <p className="text-[7pt]">{time}</p>
                        </div>
                        <p className="text-[8pt] truncate w-[140px] overflow-hidden">
                            {c.content_of_last_message}
                        </p>
                    </div>
                </div>
            </Link>
        </li>
    )
}


export function Friends({menu, handler} : {menu : boolean, handler : React.Dispatch<SetStateAction<boolean>>}) {
    const {friends, authInfos} = useContext(UserContext) || {}
    const { theme } = useContext(ApearanceContext) || {}

    if (!friends) {
        return (
            <div>loading ...</div>
        )
    } 

    return (
        <div>
            {
                friends.length > 0 ?
                    <ul className={`w-full overflow-y-scroll max-h-[200px] grid gap-4  ${menu ? "h-[100px] p-2 grid-cols-3  flex items-center test-style" : "h-fit grid-cols-1 content-start"}`}> 
                        {
                            friends?.filter(f => f.status == 'accept').map((f, index) => {
                                const data = Object.filter(f, i => typeof i === "object" && i?.username !== authInfos?.username)[0]
                                return (
                                    <li 
                                        key={index}
                                        onClick={() => handler(false)}  
                                        className={`flex justify-center items-center ${menu ? "h-full w-[80px] test-style" : "w-full h-[50px]"}`}
                                    >
                                        <Link to={data.username} className="truncate w-[35px]">
                                            <div className="relative w-full">
                                                <img src={data.profile.avatar} className="w-[35px] h-[35px] border-2 mx-auto rounded-full" alt="" />
                                                <div className={`h-2 w-2 ${data.profile.online ? "bg-green-400" : "bg-red-400"}  rounded-full absolute top-[27px] right-6`}></div>
                                                <h1 className={`text-[8pt] text-center mt-2 ${menu ? "block test-style" : "hidden"}`}>{data.username}</h1>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                :
                <div className={`text-xs text-center w-full ${menu ? "block test-style" : "hidden"} ${theme == 'light' ? "border-black/20" : "border-white/20"} border-[.6px] rounded-md p-6`}>no firends yet</div>
            }

        </div>
    )
}

Object.filter = (obj, predicate) => 
    Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .map(key => obj[key]);

export default function ConversationsList({menu, data} : {menu : boolean, data : ConversationType[]}) {
    
    const { theme } = useContext(ApearanceContext) || {}
    const { authInfos } = useContext(UserContext) || {}

    const [query, setQuery] = useState<string>('')

    const [cnvs, setcnvs] = useState<ConversationType[] | null>(null)

    
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
                <div className={`mt-10 ${menu ? "test-style" : "hidden"}`}>
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
                <div className="flex items-center mt-4">
                    <input 
                        type="text" 
                        placeholder="search..." 
                        className={`w-full ${menu ? "test-style" : "hidden"} outline-none px-4 text-xs rounded-full bg-transparent h-[35px]  ${theme == 'light' ? "border-black/20" : "border-white/20"} border-[.5px]`} 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className={`mt-4 ${menu ? "test-style" : "hidden"}`}>
                    <Categories categorie="all" Handler={null} />
                </div>
                <ul className="mt-10">
                    {
                        cnvs.length ?
                            cnvs?.map(c => {
                                return <ConvItem menu={menu}  key={c.id} c={c} />
                            })
                        :
                        <div className={`text-center border-[.6px] ${theme == 'light' ? "border-black/20" : "border-white/20"}  rounded-md p-10 text-xs ${menu ? "block test-style" : "hidden"} `}>no conversations found</div>
                    }
                </ul>
            </div>
    )
}

