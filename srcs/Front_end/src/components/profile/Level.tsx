import React, { useContext } from "react";
import { ApearanceContext } from "../../Contexts/ThemeContext";
import { UserContext } from "../../Contexts/authContext";


export function Avatar() {
	return (
		<img src="/ava2.png" className='h-[350px] ml-[50%] translate-x-[-50%]' alt="" />
	)
}

export default function Level() {
	const appearence = useContext(ApearanceContext)
    const user = useContext(UserContext)

	function test(f) {
		return Math.ceil(((f < 1.0) ? f : (f % Math.floor(f))) * 100)
	}

	return (
		<div className="flex items-center">
			<div className="w-1/5 mr-4">
				<img src="/jjj.svg" className="w-full" alt="" />
			</div>
			<div className="w-4/5 px-4">
				<div className={`${appearence?.theme == 'light' ? "text-lightText" : "text-darkText"} flex items-center text-[13px] justify-between`}>
					<h1><span style={{color:appearence?.color}} className='text-[20px]'>{user?.user?.profile?.rank}</span> / 200</h1>
					<h1>{user?.user?.profile?.level} LVL</h1>
				</div>
				<div className='relative mt-2'>
					<div className={`${appearence?.theme == 'light' ? "bg-gray-300" : "bg-lightItems"} h-2 rounded-sm`}></div>
					<div style={{background:appearence?.color, width:`${test(user?.user?.profile?.level)}%`}} className='h-2 top-0 rounded-sm absolute'></div>
				</div>
			</div>
		</div>
	)
}