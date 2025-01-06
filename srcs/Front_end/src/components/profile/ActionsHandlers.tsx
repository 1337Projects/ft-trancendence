import { useContext } from "react"
import { FaCommentDots, FaPlus } from "react-icons/fa"
import { GiSandsOfTime } from "react-icons/gi";
import { FiCheckCircle } from "react-icons/fi";
import { ActionsList } from "./Actions";
import { UserContext } from "@/Contexts/authContext";
import { useNavigate } from "react-router-dom";
import { FirendType, UserType } from "@/types/user";


export type ResType = number | FirendType

export function HasRelationWithStatus(
    friendsList : FirendType[],
    friendId : number,
    status : string
) {
    const friendShip = friendsList.filter(fr => fr.sender.id == friendId || fr.receiver.id == friendId)
    if (status && friendShip.length) {
        return friendShip[0]?.status == status
    }
    return friendShip.length
}

function IsSender(
    friendsList : FirendType[],
    friendId : number
) {
    return friendsList.filter(fr => (fr.sender.id === friendId && fr.status === 'waiting')).length
}



export async function RelationsHandler(url : string, token : string, body : UserType, callback : (response : ResType) => void) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: 'include',
            body : JSON.stringify({data : body})
        })
    
        if (!response.ok) {
            const { message } = await response.json()
            console.log(message)
            throw Error(message)
        }
    
    
        const { res, id} = await response.json()
        if (id) callback(id)
        else callback(res)
    } catch(err) {
        console.log(err)
    }
    
}



export function Relations({ friend } : {friend : UserType}) {
    
    const { friends, authInfos, setFriends } = useContext(UserContext) || {}
    const navigate = useNavigate()
    
    function AddFriendCallbck(response : ResType) {
        setFriends!(prev => prev ? [...prev, response as FirendType] : [])
    }

    function AcceptFriendCallback(response : ResType) {
        setFriends!(prev => prev ? [...prev.filter(item => item.id != (response as FirendType).id), response as FirendType] : [])
    }

    function DeleteFriendRequest(response : ResType) {
        setFriends!(prev => prev ? prev.filter(item => item.id != response) : [])
    }

    
    
    if(friends && IsSender(friends, friend?.id)) {
        return (
            <div className="flex w-[190px] justify-between items-center">
                <div 
                    onClick={() => 
                        RelationsHandler(
                            'api/friends/accept_friend/',
                            authInfos?.accessToken || "",
                            friend,
                            AcceptFriendCallback
                        )
                    }
                    className="w-full hover:bg-gray-700/40 rounded px-4 text-xs p-2 h-[40px] flex items-center justify-between"
                >
                    <p>accept</p>
                    <FiCheckCircle />
                </div>
                <div 
                    onClick={() => 
                        RelationsHandler(
                            'api/friends/reject_friend/',
                            authInfos?.accessToken || "",
                            friend,
                            DeleteFriendRequest
                        )
                    }
                    className="w-full hover:bg-gray-700/40 rounded px-4 text-xs p-2 h-[40px] flex items-center justify-between"
                >
                    <p>reject</p>
                    <FiCheckCircle />
                </div>
            </div>
        )
    }

    if (
        friends &&(
        HasRelationWithStatus(friends, friend?.id, 'accept') ||
        HasRelationWithStatus(friends, friend?.id, 'blocked'))
    ) {
        return (
            <div className="flex w-[120px] justify-between items-center">
                <div 
                    onClick={() => navigate(`/dashboard/chat/${friend.username}`)} 
                    className="w-full hover:bg-gray-700/40 rounded px-4 text-xs p-2 h-[40px] flex items-center justify-between"
                >
                    <p>contact</p>
                    <FaCommentDots />
                </div>
                <ActionsList friend={friend} />
            </div>
        )
    }

    if (friends && HasRelationWithStatus(friends, friend?.id, 'waiting')) {
        return (
            <div 
                onClick={() => 
                    RelationsHandler(
                        'api/friends/cancle_friend/',
                        authInfos?.accessToken || "",
                        friend,
                        DeleteFriendRequest
                    )
                }
                className="w-full hover:bg-gray-700/40 rounded px-4 text-xs p-2 h-[40px] flex items-center justify-between"
            >
                <p>requsted</p>
                <GiSandsOfTime />
            </div>
        )
    }
    
    return (
        <div 
            onClick={() => 
                RelationsHandler(
                    'api/friends/new_relation/',
                    authInfos?.accessToken || "",
                    friend,
                    AddFriendCallbck
                )
            }
            className="w-full hover:bg-gray-700/40 rounded px-4 text-xs p-2 h-[40px] flex items-center justify-between"
        >
            <p>new friend</p>
            <FaPlus />
        </div>
    )

}
