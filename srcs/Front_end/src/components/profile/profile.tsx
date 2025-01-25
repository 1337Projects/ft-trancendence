import { useEffect, useState } from 'react';
import { useContext } from "react"
import { ApearanceContext } from '@/Contexts/ThemeContext';
import { Banner } from './Hero';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { UserContext } from '@/Contexts/authContext';
import { FaUserFriends } from 'react-icons/fa';
import { RiProfileFill } from 'react-icons/ri';
import { FriendType, UserType } from '@/types/userTypes';

import 'react-toastify/dist/ReactToastify.css';
import{ ToastContainer, toast } from 'react-toastify'

export default function Profile() {
	const { theme } = useContext(ApearanceContext) || {}
	const {authInfos, user, friends} = useContext(UserContext) || {}
	const {user_name} = useParams()
	const [currentUser, setCurrentUser] = useState<UserType | null>(null)
	const [ friendship, setFriendShhip ] = useState<FriendType | null>(null)

	useEffect(() => {
		if (currentUser && user && friends) {
			const currentFriendship : FriendType[] = friends.filter((item : FriendType) => 
				(
					item.sender.username==user.username 
					&& item.receiver.username==currentUser.username
				) 
				|| 
				(
					item.receiver.username==user.username 
					&& item.sender.username==currentUser.username
				))
			if (currentFriendship.length) {
				setFriendShhip(currentFriendship[0]!)
			}
		}

	}, [friends, currentUser])

	
	useEffect(() => {
		const timer : NodeJS.Timeout = setTimeout(() => {
			if (user_name) {
				fetch(`${import.meta.env.VITE_API_URL}api/profile/${user_name}/`, {
					method: 'GET',
					credentials : 'include',
					headers : {
						'Authorization' : `Bearer ${authInfos?.accessToken}`,
					}
				})
				.then(res => res.json())
				.then(res => {
					if (res.data == undefined)
					{
						toast.error("Failed to load data! try refresh")
					}
					setCurrentUser(res.data)
				})
				.catch((err: Error) => {
					toast.error(err.toString());
				})
			} else 
				setCurrentUser(user!)
		}, 300)
		return () => clearTimeout(timer)

	}, [user_name])
	

	return (
		<div className={`w-full h-full overflow-scroll p-2 ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"}`}>
			<div className={` w-full h-full sm:h-[100vh]`}>
				<Banner user={currentUser!} />
				{
					friendship?.status == 'blocked' ?
					<div className='w-full px-4'>
						<div className='w-full h-[100px] text-xs border-[.3px] rounded mt-10 border-white/20 flex justify-center items-center'>this content is not available</div>
					</div>
					:
					<>
						<ProfileNav currentUser={currentUser} />
						<Outlet context={currentUser} />
					</>
				}
			</div>
			<ToastContainer/>
		</div>
	)
}

function ProfileNav({ currentUser } : { currentUser : UserType | null}) {

	const { theme , color } = useContext(ApearanceContext) || {}

	const ActiveStyle = {
		color
	}

	return (
		<div className='px-4'>
			<ul className='flex items-center py-4 text-[12pt]'>
				<li  className={`mr-6 cursor-pointer`} >
					<NavLink 
						end
						style={({isActive}) => isActive ? ActiveStyle : {}} 
						to={`./../${currentUser?.username}`} 
						className='flex items-center'
					>
						<RiProfileFill className='mr-2' />
						Dashboard
					</NavLink>
				</li>
				<li className='cursor-pointer'>
					<NavLink 
						style={({isActive}) => isActive ? ActiveStyle : {}}
						to="friends" 
						className='flex items-center'
					>
						<FaUserFriends className='mr-2' />
						friends
					</NavLink>
				</li>
			</ul>
			<hr className={`${theme == 'light' ? "border-black/30" : "border-white/30"}`} />
		</div>
	)
}