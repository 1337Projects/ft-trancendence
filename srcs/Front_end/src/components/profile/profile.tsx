import React, { useEffect, useState } from 'react';
import { useContext } from "react"
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { Banner } from './Hero';
import Level from './Level'
import Chart from './Chart'
import Status from './status';
import Achivments from './Achivments'
import { useParams } from 'react-router-dom';
import { UserContext } from '../../Contexts/authContext';
import { UserType } from '../../Contexts/authContext';


function St() {
	return (
		<div className='w-full h-[120px] p-2'>
			<ul className='grid grid-cols-3 gap-4 h-full'>
				<li className='bg-gray-400/40 border-b-[1px] border-sky-500 text-[22pt] flex items-center justify-center'>
				<div className='text-center'>
						<div className='flex justify-center items-center'>
							<img src="/fire.png" className='w-8 mr-4' alt="" />
							<h1>0</h1>
						</div>
						<h1 className='text-[10pt] uppercase'>Played Match</h1>
					</div>
				</li>
				<li className='bg-gray-400/40 border-b-[1px] border-green-500 text-[22pt] flex items-center justify-center'>
					<div className='text-center'>
						<div className='flex justify-center items-center'>
							<img src="/thumb-down.png" className='w-8 mr-4' alt="" />
							<h1>0</h1>
						</div>
						<h1 className='text-[10pt] uppercase'>Match win</h1>
					</div>
				</li>
				<li className='bg-gray-400/40 border-b-[1px] border-red-500 text-[22pt] flex items-center justify-center'>
					<div className='text-center'>
						<div className='flex justify-center items-center'>
							<img src="/thumb-up.png" className='w-8 mr-4' alt="" />
							<h1>0</h1>
						</div>
						<h1 className='text-[10pt] uppercase'>match Lose</h1>
					</div>
				</li>
			</ul>
		</div>
	)
}

export default function Profile() {
	const appearence = useContext(ApearanceContext)
	const {authInfos, user} = useContext(UserContext) || {}
	const {user_name} = useParams()
	const [currentUser, setCurrentUser] = useState<UserType | null>()


	useEffect(() => {
		const timer = setTimeout(() => {
			if (user_name) {
				fetch(`http://localhost:8000/api/profile/${user_name}/`, {
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
				setCurrentUser(user)
		}, 300)
		return () => clearTimeout(timer)

	}, [user_name])

	return (
		<div className={`w-full backdrop-blur-md ${appearence?.theme == 'light' ? "bg-lightItems border-lightText/10 text-lightText" : "bg-darkItems text-darkText border-darkText/10"}`}>
			<div className={`w-full p-1 h-[90vh] sm:h-[100vh] overflow-scroll border-[.3px] ${appearence?.theme == 'light' ? "border-lightText/10" : "border-darkText/10"}`}>
				<div className='bg-banner bg-cover border-[.2px] border-darkText/40 w-full h-[140px] rounded-sm'></div>
				<div className='mx-2 flex h-full'>
					<div className='w-1/3 h-full px-2'>
						<div className='bg-gray-700/30 backdrop-blur-md w-full mt-10 rounded-sm h-fit py-10 flex items-center justify-center'>
							<Banner user={currentUser} />
						</div>
						<div className='bg-gray-700/30 backdrop-blur-md w-full mt-4 rounded-sm h-[200px] flex justify-center items-center'>
							
						</div>
						<div className='bg-gray-700/30 backdrop-blur-md w-full mt-4 rounded-sm h-fit py-10 flex justify-center items-center'>
							<div className='px-10 w-full'>
								<Status />
							</div>
						</div>
					</div>
					<div className='w-2/3 mt-10 h-full px-4'>
						<Level />
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
			</div>
		</div>
	)
}