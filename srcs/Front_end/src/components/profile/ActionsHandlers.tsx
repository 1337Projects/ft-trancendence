import React, { useContext } from "react"
import { FirendType, UserType } from "@/Types"
import { FaCommentDots, FaPlus } from "react-icons/fa"
import { GiSandsOfTime } from "react-icons/gi";
import { FiCheckCircle } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { ActionButton, ActionsList } from "./Actions";
import { UserContext } from "@/Contexts/authContext";
import { useNavigate } from "react-router-dom";

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



export function RelationsHandler(url : string, token : string, body : UserType, callback : (response : ResponseType) => void) {
    // console.log(body)
    fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method : 'POST',
        headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body : JSON.stringify({data : body})
    })
    .then(res => res.json())
    .then(data => {
        // console.log(data)
        if (data.status === 200) {
            callback(data)
        }
    })
    .catch(err => console.log(err))
}

export type ResponseType = {
    status : number,
    res? : FirendType,
    id? : number
}

export function Relations({ friend } : {friend : UserType}) {
    
    const { friends, authInfos, setFriends } = useContext(UserContext) || {}
    const navigate = useNavigate()
    
    function AddFriendCallbck(response : ResponseType) {
        setFriends!(prev => [...prev!, response.res!])
    }

    function AcceptFriendCallback(response : ResponseType) {
        setFriends!(prev => prev ? [...prev.filter(item => item.id != response.res?.id), response.res!] : [])
    }

    function DeleteFriendRequest(response : ResponseType) {
        setFriends!(prev => prev ? prev.filter(item => item.id != response.id) : [])
    }


    if (!friends || !authInfos) {
        return <></>
    }

    if(IsSender(friends!, friend?.id)) {
        return (
            <div className="flex w-[190px] justify-between items-center">
                <ActionButton 
                    text="accept" 
                    icon={<FiCheckCircle />} 
                    handler={() => 
                        RelationsHandler(
                            'api/friends/accept_friend/',
                            authInfos.accessToken,
                            friend,
                            AcceptFriendCallback
                        )
                    }
                />
                <ActionButton 
                    text="reject" 
                    icon={<IoMdClose />} 
                    handler={() => 
                        RelationsHandler(
                            'api/friends/reject_friend/',
                            authInfos.accessToken,
                            friend,
                            DeleteFriendRequest
                        )
                    }
                />
            </div>
        )
    }

    if (
        HasRelationWithStatus(friends!, friend?.id, 'accept') ||
        HasRelationWithStatus(friends!, friend?.id, 'blocked')
    ) {
        return (
            <div className="flex w-[120px] justify-between items-center">
                <ActionButton 
                    text="contact" 
                    icon={<FaCommentDots />}
                    handler={() => navigate(`/dashboard/chat/${friend.username}`)} 
                />
                <ActionsList friend={friend} />
            </div>
        )
    }

    if (HasRelationWithStatus(friends!, friend?.id, 'waiting')) {
        return (
            <ActionButton 
                text="requsted" 
                icon={<GiSandsOfTime />} 
                handler={() => 
                    RelationsHandler(
                        'api/friends/cancle_friend/',
                        authInfos.accessToken,
                        friend,
                        DeleteFriendRequest
                    )
                }
            />
        )
    }
    
    return (
        <ActionButton 
            text="new friend" 
            icon={<FaPlus />} 
            handler={() => 
                RelationsHandler(
                    'api/friends/new_relation/',
                    authInfos.accessToken,
                    friend,
                    AddFriendCallbck
                )
            }
        />
    )

}
