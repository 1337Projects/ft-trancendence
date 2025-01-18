import { useContext, useEffect, useRef, useState } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { FaEllipsisV, FaUserMinus } from "react-icons/fa"
import { GoBlocked } from "react-icons/go";
import { CgUnblock } from "react-icons/cg";
import { HasRelationWithStatus, RelationsHandler } from "./ActionsHandlers";
import { UserContext } from "@/Contexts/authContext";
import { FriendsActionsResType, FriendType, UserType } from "@/types/userTypes";


export function ActionsList({ friend } : {friend : UserType}) {

	const [ openMenu, setOpenMenu ] = useState(false)
	const menuRef = useRef<null | HTMLUListElement>(null)
	const toggleButtonRef = useRef<null | HTMLDivElement>(null)
	const { authInfos , setFriends, friends} = useContext(UserContext) || {}
	const [ blocked, setBlocked ] = useState(false)
	const { theme } = useContext(ApearanceContext) || {}

	useEffect(() => {
		if (friends) {
			setBlocked(Boolean(HasRelationWithStatus(friends, friend.id, 'blocked')))
		}
	}, [friends])


	function UpdateFriendCallback(response : FriendsActionsResType) {
        setFriends!(prev => prev ? [...prev.filter(item => item.id != (response as FriendType).id), response as FriendType] : [response as FriendType])
    }

	function DeleteFriendRequest(response : FriendsActionsResType) {
        setFriends!(prev => prev ? prev.filter(item => item.id != response) : [])
    }

	useEffect(() => {

		function clickHandler(event : MouseEvent) {
			if ( menuRef.current 
				&& toggleButtonRef.current 
				&& !menuRef.current.contains(event.target as Node) 
				&& !toggleButtonRef.current.contains(event.target as Node)
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
				<ul ref={menuRef} className={`w-[160px] h-fit p-2 z-10 rounded ${theme === "light" ? "bg-lightItems border-black/20" : "bg-darkItems border-white/20"} border-[.2px] absolute top-[40px] right-[10px]`}>
					{
						blocked ?
						<li  onClick={
							() => {
								RelationsHandler(
									'api/users/unblockUser/',
									authInfos?.accessToken || "",
									friend,
									UpdateFriendCallback
								)
								setOpenMenu(false)
							} 
						} className="w-full hover:bg-gray-700/40 rounded px-4 text-xs p-2 h-[40px] flex items-center justify-between">
							<p>unblock</p>
							<CgUnblock />
						</li>
						:
						<>
							<li onClick={
								() =>
									{
										RelationsHandler(
											'api/friends/cancle_friend/',
											authInfos?.accessToken || "",
											friend,
											DeleteFriendRequest
										)
										setOpenMenu(false)
									} 
							} className="w-full hover:bg-gray-700/40 rounded px-4 justify-between text-xs p-2 h-[40px] flex items-center">
								<p>unfriend</p>
								<FaUserMinus />
							</li>
							<li onClick={
								() => {
									RelationsHandler(
										'api/users/blockUser/',
										authInfos?.accessToken || "",
										friend,
										UpdateFriendCallback
									)
									setOpenMenu(false)
								} 
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