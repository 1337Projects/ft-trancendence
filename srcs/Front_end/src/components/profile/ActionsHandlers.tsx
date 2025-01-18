import { useContext } from "react"
import { FaCommentDots, FaPlus } from "react-icons/fa"
import { GiSandsOfTime } from "react-icons/gi";
import { FiCheckCircle } from "react-icons/fi";
import { ActionsList } from "./Actions";
import { UserContext } from "@/Contexts/authContext";
import { useNavigate } from "react-router-dom";
import { FriendsActionsResType, FriendType, UserType } from "@/types/userTypes";
import { ApearanceContext } from "@/Contexts/ThemeContext";




export function HasRelationWithStatus(
    friendsList : FriendType[],
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
    friendsList : FriendType[],
    friendId : number
) {
    return friendsList.filter(fr => (fr.sender.id === friendId && fr.status === 'waiting')).length
}



export async function RelationsHandler(url : string, token : string, body : UserType, callback : (response : FriendsActionsResType) => void) {
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
    const { color } = useContext(ApearanceContext) || {}
    const navigate = useNavigate()
    
    function AddFriendCallbck(response : FriendsActionsResType) {
        setFriends!(prev => prev ? [...prev, response as FriendType] : [])
    }

    function AcceptFriendCallback(response : FriendsActionsResType) {
        setFriends!(prev => prev ? [...prev.filter(item => item.id != (response as FriendType).id), response as FriendType] : [])
    }

    function DeleteFriendRequest(response : FriendsActionsResType) {
        setFriends!(prev => prev ? prev.filter(item => item.id != response) : [])
    }

    
    
    if(friends && IsSender(friends, friend?.id)) {
        return (
            <div className="flex w-[190px] justify-between items-center">
                <div
                    style={{background: color}} 
                    onClick={() => 
                        RelationsHandler(
                            'api/friends/accept_friend/',
                            authInfos?.accessToken || "",
                            friend,
                            AcceptFriendCallback
                        )
                    }
                    className="w-full hover:bg-gray-700/40 rounded-full text-white px-4 text-xs p-2 h-[40px] flex items-center justify-between"
                >
                    <p>accept</p>
                    <FiCheckCircle />
                </div>
                <div 
                    style={{background: color}}
                    onClick={() => 
                        RelationsHandler(
                            'api/friends/reject_friend/',
                            authInfos?.accessToken || "",
                            friend,
                            DeleteFriendRequest
                        )
                    }
                    className="w-full text-white hover:bg-gray-700/40 rounded-full px-4 text-xs p-2 h-[40px] flex items-center justify-between"
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
                    style={{background: color}} 
                    onClick={() => navigate(`/dashboard/chat/${friend.username}`)} 
                    className="w-full hover:bg-gray-700/40 rounded-full text-white px-4 text-xs p-2 h-[40px] flex items-center justify-between"
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
                style={{background: color}} 
                onClick={() => 
                    RelationsHandler(
                        'api/friends/cancle_friend/',
                        authInfos?.accessToken || "",
                        friend,
                        DeleteFriendRequest
                    )
                }
                className="w-full rounded-full text-white hover:bg-gray-700/40 px-4 text-xs p-2 h-[40px] flex items-center justify-between"
            >
                <p>requsted</p>
                <GiSandsOfTime />
            </div>
        )
    }
    
    return (
        <div 
            style={{background: color}} 
            onClick={() => 
                RelationsHandler(
                    'api/friends/new_relation/',
                    authInfos?.accessToken || "",
                    friend,
                    AddFriendCallbck
                )
            }
            className="w-full rounded-full text-white hover:bg-gray-700/40 px-4 text-xs p-2 h-[40px] flex items-center justify-between"
        >
            <p>new friend</p>
            <FaPlus />
        </div>
    )

}
