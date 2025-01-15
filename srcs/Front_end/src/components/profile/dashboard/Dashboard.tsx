import Level from "./Level"
import Chart from "./Chart"
import MatchStatus from "./Status"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "@/Contexts/authContext"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { MdOutlineTipsAndUpdates } from "react-icons/md"
import { CatButton } from "@/components/game/Game"
import { IoTimeOutline } from "react-icons/io5"
import { FaArrowTrendUp } from "react-icons/fa6"
import { GiPodiumWinner, GiStarMedal } from "react-icons/gi"


export default function Dashboard() {


	

	return (
		<div className='mx-2 flex h-fit'>
			<div className='w-full mx-auto max-w-[650px] mt-10'>
				<div>
					<Level />
				</div>
				<div className='mt-10'>
					<MatchStatus />
				</div>
				<div className='mt-20'>
					<Chart />
				</div>
				<div className="mt-20">
					<MatchHistory />
				</div>
			</div> 
		</div>
	)
}


const categories = [
	{
		text : 'all',
		icon : <MdOutlineTipsAndUpdates />
	},
	{
		text : 'ping pong',
		icon : <MdOutlineTipsAndUpdates />
	},
	{
		text : 'tic tac toe',
		icon : <MdOutlineTipsAndUpdates />
	}
]


function MatchHistory() {

	const [matches, setMatches] = useState(null)
	const { authInfos, user } = useContext(UserContext) || {}
	
		useEffect(() => {
			const timer = setTimeout(async () => {
				try {
					const response = await fetch(`${import.meta.env.VITE_API_URL}api/profile/matchs/${user?.username}`, {
						method : 'GET',
						credentials : 'include',
						headers : {
							'Authorization' : `Bearer ${authInfos?.accessToken}`,
						}
					})
	
					if (!response.ok) {
						throw new Error('An error occured')
					}
	
					const {data} = await response.json()
					console.log(data)
					setMatches(data)
	
				} catch (error) {
					console.error(error)
				}
				
				
			}, 300)
	
			return () => clearTimeout(timer)
		}, [])

	return (
		<div className="w-full h-fit p-2">
			<h1 className="text-xl font-bold">Recent Matches</h1>
			<div className="w-full h-[30px] flex mt-10">
				{
					categories.map((item, index) => 
						<CatButton key={index} text={item.text} icon={item.icon} />
					)
				}
			</div>
			<ul className="w-full overflow-scroll rounded border-white/10 border-[.4px] py-10 px-4 h-fit max-h-[300px] mt-10">
				{
					(matches != null && matches.length > 0)? matches?.map((match, index : number) => (
						<MHistory key={index} data={match} />
					)) : <li>
						nothing...
					</li>
				}
				
			</ul>
		</div>
	)
}



export function MHistory ( {data}) {
	const { user } = useContext(UserContext) || {}
	const { color } = useContext(ApearanceContext) || {}

	const date = new Date(data?.created_at)
	console.log(data)
	const win = data?.winner == user?.id


	return (
		<div 
			className={`mb-10 w-full h-[80px]`}
		>
			<div className='h-fit w-full flex items-center  text-[10px]'>
				<IoTimeOutline className="mr-2" />
				<p className="mr-2">{date.getFullYear()} - {date.getDay()} - {date.getDate()}</p>
				<p className={`font-light`}>{date.getHours()} : {date.getMinutes()}</p>
			</div>

			<div className={`w-full mt-2 p-2 flex h-[60] rounded border-[0px] border-white/20 justify-between items-center`}>
				<div className='flex items-center'>
					<img 
						src={data?.player1?.profile?.avatar} 
						alt="Description" 
						className="mr-4 border-[1px] h-[40px] w-[40px] rounded-full" 
					/>
					<div className="mr-4 w-[80px]">
						<h1 className="font-bold text-md">{data?.player1?.username}</h1>
						<div className="mt-1 text-xs flex items-center">
							<p className="mr-2">level {data?.player1?.profile?.level}</p>
							<FaArrowTrendUp />
						</div>
					</div>
					<GiStarMedal className="text-[30pt]" style={{color}} />
				</div>  
				<div className='text-center'>
					<p className="text-xl">vs</p>
				</div> 
				<div className='flex items-center'>
					<div className="flex flex-col items-end">
						<h1 className="font-bold text-md">{data?.player2?.username}</h1>
						<div className="mt-1 text-xs flex items-center">
							<FaArrowTrendUp />
							<p className="ml-2">level {data?.player2?.profile?.level}</p>
						</div>
					</div>
					<img 
						src={data?.player2?.profile?.avatar} 
						alt="Description" 
						className="ml-4 border-[1px] bg-white h-[40px] w-[40px] rounded-full" 
					/>
				</div>
			</div>
		
		</div>
	)
}