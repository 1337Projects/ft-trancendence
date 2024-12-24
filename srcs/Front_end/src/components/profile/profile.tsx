import React, { useEffect, useState } from 'react';
import { useContext } from "react"
import { ApearanceContext } from '@/Contexts/ThemeContext';
import { Banner } from './Hero';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { UserContext } from '@/Contexts/authContext';
import { UserType } from '@/Types';
import { FaUserFriends } from 'react-icons/fa';
import { RiProfileFill } from 'react-icons/ri';


export default function Profile() {
	const appearence = useContext(ApearanceContext)
	const {authInfos, user, friends} = useContext(UserContext) || {}
	const {user_name} = useParams()
	const [currentUser, setCurrentUser] = useState<UserType | null>(null)
	const friendship = friends?.filter(item => (item.sender.username==user?.username && item.receiver.username==currentUser?.username) || (item.receiver.username==user?.username && item.sender.username==currentUser?.username))[0]

	console.log(friendship)
	
	useEffect(() => {
		const timer = setTimeout(() => {
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
					setCurrentUser(res.data)
				})
				.catch(err => console.log(err))
			} else 
				setCurrentUser(user!)
		}, 300)
		return () => clearTimeout(timer)

	}, [user_name])

	return (
		<div className={`w-full mt-2 backdrop-blur-md p-2 ${appearence?.theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"}`}>
			<div className={` w-full h-[calc(100vh-180px)] sm:h-[100vh] overflow-scroll`}>
				<Banner user={currentUser} />
				{
					friendship?.status == 'blocked' ?
					<div className='w-full h-[100px] border-[.3px] rounded mt-10 border-white/20 flex justify-center items-center'>this content is not available</div> :
					<>
						<ProfileNav currentUser={currentUser} />
						<Outlet />
					</>
				}
			</div>
		</div>
	)
}

function ProfileNav({ currentUser } : { currentUser : UserType | null}) {

	const { theme , color } = useContext(ApearanceContext) || {}
	const location = useLocation()
	const isDashboard = !location.pathname.includes('friends')

	return (
		<div className='px-4'>
			<ul className='flex items-center py-4 text-[12pt]'>
				<li style={{color : isDashboard ? color : ""}} className={`mr-6 cursor-pointer`} >
					<Link to={`../profile/${currentUser?.username}`} className='flex items-center'>
						<RiProfileFill className='mr-2' />
						Dashboard
					</Link>
				</li>
				<li style={{color : isDashboard ? "" : color}} className='cursor-pointer'>
					<Link to="friends" className='flex items-center'>
						<FaUserFriends className='mr-2' />
						friends
					</Link>
				</li>
			</ul>
			<hr className={`${theme == 'light' ? "border-black/30" : "border-white/30"}`} />
		</div>
	)
}