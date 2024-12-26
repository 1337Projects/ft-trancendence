import React, { ReactElement, useContext, useEffect, useRef, useState } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { FaEllipsisV, FaUserMinus } from "react-icons/fa"
import { GoBlocked } from "react-icons/go";
import { CgUnblock } from "react-icons/cg";
import { UserType } from "@/Types";
import { HasRelationWithStatus, RelationsHandler } from "./ActionsHandlers";
import { UserContext } from "@/Contexts/authContext";


export function ActionButton({text, icon, handler} : 
	{ 
		text : string,
		icon : ReactElement,
		handler : (
			url : string,
			token : string,
			friend : UserType,
			callback : (response : ResponseType) => void
		) => void
	}
) {
	const appearence = useContext(ApearanceContext)
	return (
		<button 
			onClick={handler} 
			style={{background: appearence?.color}} 
			className='text-white px-4 rounded-full w-fit h-[38px] text-[10pt] flex items-center justify-center'
		>
			<h1 className='mr-2 capitalize'>{text}</h1>
			{icon}
		</button>
	)
}

export function ActionsList({ friend }) {

	const [ openMenu, setOpenMenu ] = useState(false)
	const menuRef = useRef<null | HTMLUListElement>(null)
	const toggleButtonRef = useRef<null | HTMLDivElement>(null)
	const { authInfos, user , setFriends, friends} = useContext(UserContext) || {}
	const [ blocked, setBlocked ] = useState(false)

	useEffect(() => {
		if (friends) {
			setBlocked(Boolean(HasRelationWithStatus(friends, friend.id, 'blocked')))
		}
	}, [])


	function UpdateFriendCallback(response : ResponseType) {
        setFriends!(prev => prev ? [...prev.filter(item => item.id != response.res?.id), response.res!] : [])
    }

	function DeleteFriendRequest(response : ResponseType) {
        setFriends!(prev => prev ? prev.filter(item => item.id != response.id) : [])
    }

	useEffect(() => {

		function clickHandler(event) {
			if ( menuRef.current 
				&& toggleButtonRef.current 
				&& !menuRef.current.contains(event.target) 
				&& !toggleButtonRef.current.contains(event.target)
			){
				setOpenMenu(false)
			}
		}
		window.addEventListener('mousedown', clickHandler)
		return () => window.removeEventListener('mousedown', clickHandler)
	}, [])


	return (
		<div className="relative">
			<div className="cursor-pointer" ref={toggleButtonRef} onClick={() => setOpenMenu(prev => !prev)}>
				<FaEllipsisV />
			</div>
			{
				// block and unblock refactor backend
				openMenu && 
				<ul ref={menuRef} className="w-[160px] h-fit p-2 z-10 rounded bg-darkItems border-[.2px] border-white/20 absolute top-[40px] right-[10px]">
					{
						blocked ?
						<li  onClick={
							() => RelationsHandler(
								'api/users/unblockUser/',
								authInfos?.accessToken!,
								{id : user?.id!, id_to_unblock : friend.id},
								DeleteFriendRequest
							)
						} className="w-full hover:bg-gray-700/40 rounded px-4 text-xs p-2 h-[40px] flex items-center justify-between">
							<p>unblock</p>
							<CgUnblock />
						</li>
						:
						<>
							<li onClick={
								() => RelationsHandler(
									'api/friends/cancle_friend/',
									authInfos?.accessToken!,
									friend,
									DeleteFriendRequest
								)
							} className="w-full hover:bg-gray-700/40 rounded px-4 justify-between text-xs p-2 h-[40px] flex items-center">
								<p>unfriend</p>
								<FaUserMinus />
							</li>
							<li onClick={
								() => RelationsHandler(
									'api/users/blockUser/',
									authInfos?.accessToken!,
									{id : user?.id!, id_to_block : friend.id},
									UpdateFriendCallback
								)
								} className="w-full hover:bg-gray-700/40 rounded px-4 text-xs p-2 h-[40px] flex items-center justify-between">
								<p>block</p>
								<GoBlocked />
							</li>
						</>
					}
				</ul>
			}
		</div>
	)
}