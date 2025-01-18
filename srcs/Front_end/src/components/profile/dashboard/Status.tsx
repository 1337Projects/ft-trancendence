import { UserContext } from "@/Contexts/authContext"
import { UserType } from "@/types/userTypes"
import { useContext, useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"


function MatchStatusItem({title, avatar, color, num} : {title : string, avatar : string, color : string, num : number}) {
	return (
		<li className={`border-b-2 ${color} text-[22pt] flex items-center justify-center`}>
			<div className='text-center'>
				<div className='flex justify-center items-center'>
					<img src={avatar} className='w-8 mr-4' alt="avatar-img" />
					<h1>{num}</h1>
				</div>
				<h1 className='text-[10pt] uppercase'>{title}</h1>
			</div>
		</li>
	)
}



export default function MatchStatus() {

	const { authInfos  } = useContext(UserContext) || {}
	const [ data, setData ] = useState<null | {total : number, matches_won : number, matches_lost : number}>(null)
	const currentUser : UserType = useOutletContext()
	
	async function fetchData() {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}api/profile/score/${currentUser.username}`, {
				method: 'GET',
				credentials : 'include',
				headers : {
					'Authorization' : `Bearer ${authInfos?.accessToken}`,
				}
			})
			
			if (!response.ok) {
				throw new Error("Failed to fetch data")
			}
			
			const data = await response.json()
			setData(data.data)
		}
		catch (e) {
			console.log(e)
		}
	}
	
	useEffect(() => {
		if (currentUser) {
			const timer = setTimeout(fetchData, 100)
	
			return () => {
				clearTimeout(timer)
			}
		}
	}, [currentUser])

	if(!data) {
		return (
			<div className="w-full h-[120px] flex justify-evenly items-center">
				<div className="w-[150px] bg-gray-300 h-[100px] animate-pulse rounded" />
				<div className="w-[150px] bg-gray-300 h-[100px] animate-pulse rounded" />
				<div className="w-[150px] bg-gray-300 h-[100px] animate-pulse rounded" />
			</div>
		)
	}

	return (
		<div className='w-full h-[120px] p-2'>
			<ul className='grid grid-cols-3 gap-10 h-full'>
				<MatchStatusItem 
					num={data?.total}
					title="Played Match" 
					avatar="/profile/fire.png" 
					color="border-sky-500" 
				/>
				<MatchStatusItem 
					num={data?.matches_won}
					title="Match win" 
					avatar="/profile/thumb-up.png" 
					color="border-green-500" 
				/>
				<MatchStatusItem 
					num={data?.matches_lost}
					title="match Lose" 
					avatar="/profile/thumb-down.png" 
					color="border-red-500" 
				/>
			</ul>
		</div>
	)
}