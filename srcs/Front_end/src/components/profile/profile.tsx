	import React, { useEffect, useState } from 'react';
import { useContext } from "react"
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { Banner } from './Hero';
import Level from './Level'
import Chart from './Chart'
import Achivments from './Achivments'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { UserContext } from '../../Contexts/authContext';
import { UserType } from '../../Types';
import { FaUserFriends } from 'react-icons/fa';
import { RiProfileFill } from 'react-icons/ri';
import Friends from './friend';


function St() {
	return (
		<div className='w-full h-[120px] p-2'>
			<ul className='grid grid-cols-3 gap-10 h-full'>
				<li className=' border-b-2 border-sky-500 text-[22pt] flex items-center justify-center'>
				<div className='text-center'>
						<div className='flex justify-center items-center'>
							<img src="/fire.png" className='w-8 mr-4' alt="" />
							<h1>0</h1>
						</div>
						<h1 className='text-[10pt] uppercase'>Played Match</h1>
					</div>
				</li>
				<li className=' border-b-2 border-green-500 text-[22pt] flex items-center justify-center'>
					<div className='text-center'>
						<div className='flex justify-center items-center'>
							<img src="/thumb-up.png" className='w-8 mr-4' alt="" />
							<h1>0</h1>
						</div>
						<h1 className='text-[10pt] uppercase'>Match win</h1>
					</div>
				</li>
				<li className=' border-b-2 border-red-500 text-[22pt] flex items-center justify-center'>
					<div className='text-center'>
						<div className='flex justify-center items-center'>
							<img src="/thumb-down.png" className='w-8 mr-4' alt="" />
							<h1>0</h1>
						</div>
						<h1 className='text-[10pt] uppercase'>match Lose</h1>
					</div>
				</li>
			</ul>
		</div>
	)
}

export function UserProfile() {
	return (
		<div className='mx-2 flex h-full'>
			<div className='w-full mx-auto max-w-[700px] mt-10 h-full'>
				<div>
					<Level />
				</div>
				<div className='mt-10'>
					<St />
				</div>
				<div className='mt-20'>
					<Chart />
				</div>
				<div className='mt-20'>
					<Achivments />
				</div>
			</div> 
		</div>
	)
}

export default function Profile() {
	const appearence = useContext(ApearanceContext)
	const {authInfos, user} = useContext(UserContext) || {}
	const {user_name} = useParams()
	const [currentUser, setCurrentUser] = useState<UserType | null>(null)
	const location = useLocation()

	const isProfile = !location.pathname.includes('friends')


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
			<div className={` w-full h-[90vh] sm:h-[100vh] overflow-scroll`}>
				<Banner user={currentUser} />
				<div className='px-4'>
					<ul className='flex items-center py-4 text-[12pt]'>
						<li style={{color : isProfile ? appearence?.color : ""}} className={`mr-6 cursor-pointer`} >
							<Link to={`../profile/${currentUser?.username}`} className='flex items-center'>
								<RiProfileFill className='mr-2' />
								Profile
							</Link>
						</li>
						<li style={{color : isProfile ? "" : appearence?.color}} className='cursor-pointer'>
							<Link to="friends" className='flex items-center'>
								<FaUserFriends className='mr-2' />
								friends
							</Link>
						</li>
					</ul>
					<hr className={`${appearence?.theme == 'light' ? "border-black/30" : "border-white/30"}`} />
				</div>
				<Outlet />
			</div>
		</div>
	)
}