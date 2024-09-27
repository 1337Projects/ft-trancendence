import React, { useEffect, useState } from 'react';
import { useContext } from "react"
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { Banner } from './Hero';
import Level, { Avatar } from './Level'
import Chart from './Chart'
import Status from './status';
import Statistics from './statistics'
import Achivments from './Achivments'
import { useParams } from 'react-router-dom';
import { UserContext } from '../../Contexts/authContext';
import { UserType } from '../../Contexts/authContext';


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
				<div className='h-fit'>
					<Banner user={currentUser} />
				</div>
				<div className='mx-10'> 
					<div className={`${appearence?.theme == 'light' ? "text-lightText" : "text-darkText"} w-full h-[80px] flex items-start`}>
						<div className={`w-full ${appearence?.theme == 'light' ? "border-lightText" : "border-darkText"} h-[40px] border-b-[.1px] flex items-center capitalize text-[14px]`}>
							<div style={{color : appearence?.color, borderColor : appearence?.color}} className='mb-2 cursor-pointer border-b-[2px] h-full flex items-center'>profile</div>
							<div className='ml-4 mb-2 cursor-pointer'>friends</div>
						</div>
					</div>
					<div className='w-full grid grid-cols-1 sm:grid-cols-2 sm:gap-4'>
						<div className='p-2'>
							<div>
								<h1 className='mb-4 underline'>My Lvel</h1>
								<Level />
							</div>
							<div className='mt-[80px]'>
								<h1 className='mb-10 underline'>My Progress</h1>
								<Chart />
							</div>
							<div className='mt-[60px]'>
								<h1 className='mb-6 underline'>My Log</h1>
								<Status />
							</div>
						</div>
						<div className=''>
							<div className='mt-10'>
								<Avatar />
							</div>
							<div className='max-w-[250px] mt-[90px] mx-auto'>
								<Statistics />
							</div>
						</div>
					</div>
					<div className='w-full mt-[60px]'>
						<Achivments />
					</div>
				</div>
			</div>
		</div>
	)
}