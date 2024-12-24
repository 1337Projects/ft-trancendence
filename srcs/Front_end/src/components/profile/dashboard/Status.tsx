import React from "react"


function MatchStatusItem({title, avatar, color} : {title : string, avatar : string, color : string}) {
	return (
		<li className={`border-b-2 ${color} text-[22pt] flex items-center justify-center`}>
			<div className='text-center'>
				<div className='flex justify-center items-center'>
					<img src={avatar} className='w-8 mr-4' alt="avatar-img" />
					<h1>0</h1>
				</div>
				<h1 className='text-[10pt] uppercase'>{title}</h1>
			</div>
		</li>
	)
}



export default function MatchStatus() {
	return (
		<div className='w-full h-[120px] p-2'>
			<ul className='grid grid-cols-3 gap-10 h-full'>
				<MatchStatusItem title="Played Match" avatar="/profile/fire.png" color="border-sky-500" />
				<MatchStatusItem title="Match win" avatar="/profile/thumb-up.png" color="border-green-500" />
				<MatchStatusItem title="match Lose" avatar="/profile/thumb-down.png" color="border-red-500" />
			</ul>
		</div>
	)
}