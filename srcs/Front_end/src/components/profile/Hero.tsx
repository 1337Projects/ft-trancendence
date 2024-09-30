import React, { useContext, useState } from "react"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { useParams } from "react-router-dom"
import { Actions } from "./Actions"
import { UserContext } from "../../Contexts/authContext"
import {
	accept_friend_request, 
	send_friend_request,
	reject_friend_request,
	cancle_friend_request
} from './ActionsHandlers'

export function Banner({user}) {
	const appearence = useContext(ApearanceContext)
	const {user_name} = useParams()
	const { friends, authInfos } = useContext(UserContext) || {}
	const handlers = {
		"new" : () => send_friend_request(authInfos?.accessToken!, null, user),
		"reject" : () => reject_friend_request(authInfos?.accessToken!, null, user),
		"accept" : () => accept_friend_request(authInfos?.accessToken!, null, user),
		"cancle" : () => cancle_friend_request(authInfos?.accessToken!, null, user)
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
		</div>
	)
}
