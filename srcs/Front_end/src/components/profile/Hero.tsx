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
		<div className={`${appearence?.theme == 'light' ? "text-lightText" : "text-darkText"} relative p-2 h-[300px]`}>
			<div className='bg-banner bg-cover border-[.2px] border-darkText/40 w-full h-[140px] rounded-sm'></div>
			<div className='w-full h-fit  ml-[50%] translate-x-[-50%] mt-[-20px] absolute'>
				<div className='flex items-end px-10'>
					<img className='w-[90px] h-[90px] border-[.3px] rounded-full ' src={`${user?.profile?.image}`} alt="" />
					<div className='ml-4'>
						<h1 className='text-[16px] uppercase'>{user?.first_name} {user?.last_name}</h1>
						<h1 className='mt-2 font-bold'>@{user?.username}</h1>
					</div>
				</div>
				<div className="flex mt-6 px-2 items-center">
					<div className='w-1/2 text-[14px]'>
						{
							user?.profile?.bio != '' && 
							<textarea 
								value={user?.profile?.bio}
								disabled={true}
								className={`${appearence?.theme == 'light' ? "text-lightText" : "text-darkText"} resize-none bg-transparent outline-none w-full mx-10`}>
							</textarea>
						}
					</div>
					<div className="w-1/2 h-full p-2 flex justify-end">
						{
							user_name != undefined &&
							<Actions friends={friends} profile_user={user} handlers={handlers}/>
						}
					</div>
				</div>
			</div>
		</div>
	)
}
