import React, { SetStateAction, useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ApearanceContext } from "../../Contexts/ThemeContext";
import { UserContext } from "../../Contexts/authContext";
import { ConversationType } from "@/types/chatTypes";
import { ObjectFilter } from "@/utils/utils";
import { UserType } from "@/types/userTypes";
// import { toast } from "react-toastify";



// export async function BlockHandler(user_id : number, partner_id : number) {

//     try {
//         const response = await fetch(`${import.meta.env.VITE_API_URL}api/users/blockUser/`, {
//             method : 'POST',
//             credentials : 'include',
//             headers : {
//                 'Content-Type' : 'application/json'
//             },
//             body : JSON.stringify({id : user_id, id_to_block :  partner_id})
//         })
    
//         if (!response.ok) {
//             throw new Error("somthing went wrong")
//         }

//         return true
//     } catch(err) {
//         toast.error(err instanceof Error ? err.toString() : "somthing went wrong...")
//     }
//     return false
// }





function ConvItem({c, menu} : {c : ConversationType, menu : boolean}) {
    const [time , setTime] = useState("")
    const {user} = useContext(UserContext) || {}

    const data = ObjectFilter(c, i => typeof i === "object" && (i as UserType)?.username !== user?.username)[0] as UserType
    const { color } = useContext(ApearanceContext) || {}
    
    useEffect(() => {
        const date = new Date(c?.last_message_time);
        const hours = date.getUTCHours()
        const mins = date.getUTCMinutes()
        setTime(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    }, [c])

    return (
        <NavLink 
            style={({ isActive }) => ({background : isActive ? color : "", color : isActive ? "white" : ""})} 
            to={`${data.username}`} 
            end 
            className={`w-full h-[50px] rounded border-white/30 relative mt-3 p-2 flex items-center cursor-pointer`}
        >
            <div className={`flex justify-start items-center w-full ${menu && "test-style"}`}>
                <div className={`flex  ${menu ? "test-style" : "justify-center"} items-center w-full`}>
                    <div className={`w-[35px] h-[35px] ${menu && "test-style"}`}>
                        <img src={data?.profile?.avatar} className="w-[35px] h-[35px] bg-white rounded-full" alt="img" />
                    </div>
                    <div className={`content w-fit max-w-[100px] ml-4 ${menu ? "test-style" : "hidden"}`}>
                        <div className="flex justify-between items-center">
                            <h1 className="font-bold text-[10pt] max-w-[100px] truncate">{data?.username}</h1>
                            <p className="text-[7pt]">{time}</p>
                        </div>
                        <p className="text-[8pt] truncate w-[140px] overflow-hidden">
                            {c.content_of_last_message === "" ? `🔗 you have received an invite to play` : c.content_of_last_message}
                        </p>
                    </div>
                </div>
            </div>
        </NavLink>
    )
}


export function Friends({menu, handler} : {menu : boolean, handler : React.Dispatch<SetStateAction<boolean>>}) {
    const {friends, authInfos} = useContext(UserContext) || {}
    const myFriends = friends?.filter(f => f.status == 'accept')

    if (!myFriends || myFriends.length === 0) {
        return (
            <div className={`text-xs capitalize text-center w-full ${menu ? "block test-style" : "hidden"} p-6`}>you have no friends yet</div>
        )
    } 


    return (
        <div>
            <ul className={`w-full overflow-y-scroll max-h-[200px] grid gap-4  ${menu ? "h-[100px] p-2 grid-cols-3  flex items-center test-style" : "h-fit grid-cols-1 content-start"}`}> 
                {
                    myFriends.map((f, index) => {

                        const data : UserType = ObjectFilter(f, (elm) => typeof elm === "object" && (elm as UserType)?.username !== authInfos?.username)[0] as UserType
                       
                        return (
                            <li 
                                key={index}
                                onClick={() => handler(false)}  
                                className={`flex justify-center items-center ${menu ? "h-full w-[80px] test-style" : "w-full h-[50px]"}`}
                            >
                                <Link to={data.username} className="truncate w-[35px]">
                                    <div className="relative w-full">
                                        <img src={data.profile.avatar} className="w-[35px] h-[35px] border-2 mx-auto rounded-full" alt="" />
                                        <div className={`h-2 w-2 ${data.profile.online ? "bg-green-500" : "bg-gray-300"}  rounded-full absolute top-[27px] right-6`}></div>
                                        <h1 className={`text-[8pt] text-center mt-2 ${menu ? "block test-style" : "hidden"}`}>{data.username}</h1>
                                    </div>
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}



export default function ConversationsList({menu, data} : {menu : boolean, data : ConversationType[]}) {
    
    const { theme } = useContext(ApearanceContext) || {}
    const { authInfos } = useContext(UserContext) || {}
    const [query, setQuery] = useState<string>('')
    const [cnvs, setcnvs] = useState<ConversationType[] | null>(null)

    
    useEffect(() => {
        setcnvs(data)
        if (query != '') {
            setcnvs(prev => prev ? prev.filter(cnv => {
                const partner : UserType = ObjectFilter(cnv, elm =>  typeof elm === "object" && (elm as UserType)?.username !== authInfos?.username)[0] as UserType
                return partner.username.includes(query)
            }) : null)
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
            <div className="h-full">
                <div className="flex items-center">
                    <input 
                        type="text" 
                        placeholder="search..." 
                        className={`w-full mt-4 ${menu ? "test-style" : "hidden"} outline-none px-4 text-xs rounded-full bg-transparent h-[35px]  ${theme == 'light' ? "border-black/20" : "border-white/20"} border-[.5px]`} 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <ul className="mt-2 h-full">
                    {
                        cnvs.length ?
                            cnvs?.map(c => {
                                return <ConvItem menu={menu}  key={c.id} c={c} />
                            })
                        :
                        <div className={`text-center rounded p-10 text-xs ${menu ? "block test-style" : "hidden"} `}>no conversations found</div>
                    }
                </ul>
            </div>
    )
}

