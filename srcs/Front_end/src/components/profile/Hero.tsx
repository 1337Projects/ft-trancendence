import React, { useContext, useState } from "react"
import { UserContext } from "../../Contexts/authContext"
import { ApearanceContext } from "../../Contexts/ThemeContext"


export function Banner() {
	const user = useContext(UserContext)
	const appearence = useContext(ApearanceContext)
	return (
		<div className={`${appearence?.theme == 'light' ? "text-lightText" : "text-darkText"} relative p-2 h-[300px]`}>
			<div className='bg-banner bg-cover border-[.2px] border-darkText/40 w-full h-[140px] rounded-sm'></div>
			<div className='w-full h-fit  ml-[50%] translate-x-[-50%] mt-[-20px] absolute'>
				<div className='flex items-end px-10'>
					<img className='w-[90px] h-[90px] border-[.3px] rounded-full ' src={`${user?.user?.profile?.image}`} alt="" />
					<div className='ml-4'>
						<h1 className='text-[16px] uppercase'>{user?.user?.first_name} {user?.user?.last_name}</h1>
						<h1 className='mt-2 font-bold'>@{user?.user?.username}</h1>
					</div>
				</div>
				<div className="flex mt-6 px-2 items-center">
					<div className='w-1/2 text-[14px]'>
						{
							user?.user?.profile?.bio != '' && 
							<textarea 
								value={user?.user?.profile?.bio} 
								disabled={true}
								className={`${appearence?.theme == 'light' ? "text-lightText" : "text-darkText"} resize-none bg-transparent outline-none w-full mx-10`}>
							</textarea>
						}
					</div>
					<div className="w-1/2">
						{/* actions */}
					</div>
				</div>
			</div>
		</div>
	)
}
