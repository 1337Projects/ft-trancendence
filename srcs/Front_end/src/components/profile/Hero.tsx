import React, { useContext,  } from "react"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { Actions } from "./Actions"
import { FirendType, UserContext } from "../../Contexts/authContext"
import {
	accept_friend_request, 
	send_friend_request,
	reject_friend_request,
	cancle_friend_request
} from './ActionsHandlers'

export function Banner({user}) {

	console.log("user", user)
	const appearence = useContext(ApearanceContext)
	const { friends, authInfos, setFriends } = useContext(UserContext) || {}

	function AddFriendCallback(data : FirendType) {
		setFriends!(prev => [...prev!, data])
	}

	function RejectFriendCallback(id : Number) {
		setFriends!(prev => prev?.filter(item => item.id != id)!)
	}

	function AcceptFriendCallback(id : Number) {
		let friendship = friends?.filter(item => item.id == id)[0]
		friendship!.status = 'accept'
		setFriends!(prev => [...prev?.filter(item => item.id != id)!, friendship!])
	}

	

	const handlers = {
		"new" : () => send_friend_request(authInfos?.accessToken!, AddFriendCallback, user),
		"reject" : () => reject_friend_request(authInfos?.accessToken!, RejectFriendCallback, user),
		"accept" : () => accept_friend_request(authInfos?.accessToken!, AcceptFriendCallback, user),
		"cancle" : () => cancle_friend_request(authInfos?.accessToken!, RejectFriendCallback, user)
	}
	
	return (
		<div className='px-2 w-fit text-center'>
			<img className='w-[90px] ml-[50%] translate-x-[-50%] h-[90px] bg-white border-[.3px] rounded-full' src={`${user?.profile?.image}`} alt="" />
			<h1 className='mt-4 text-[10pt] font-bold'>@{user?.username}</h1>
			<h1 className='text-[8pt] mt-2 uppercase'>{user?.first_name} {user?.last_name}</h1>
			<div className='text-[10px] mt-2'>
				{
					user?.profile?.bio != '' && 
					<textarea 
						value={user?.profile?.bio}
						disabled={true}
						className={`${appearence?.theme == 'light' ? "text-lightText" : "text-darkText"} text-center resize-none bg-transparent outline-none`}>
					</textarea>
				}
			</div>
			{
				user?.username != authInfos?.username &&
				<Actions friends={friends} profile_user={user} handlers={handlers} />
			}
		</div>
	)
}
