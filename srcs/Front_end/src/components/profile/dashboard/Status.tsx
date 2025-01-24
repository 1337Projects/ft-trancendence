import { CatButton } from "@/components/game/Game"
import { UserContext } from "@/Contexts/authContext"
import { UserType } from "@/types/userTypes"
import { useContext, useEffect, useState } from "react"
import { GiTicTacToe } from "react-icons/gi"
import { TbPingPong } from "react-icons/tb"
import { useOutletContext, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"


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

export const categories = [
	{
		title : "ping pong",
		icon : <TbPingPong />
	},
	{
		title : "tic tac toe",
		icon : <GiTicTacToe />
	},
]


export default function MatchStatus() {

	const { authInfos  } = useContext(UserContext) || {}
	const [ data, setData ] = useState<null | {total : number, matches_won : number, matches_lost : number}>(null)
	const currentUser : UserType = useOutletContext()
	const [searchParams] = useSearchParams()
	const categorie = searchParams.get('stats-categorie')
	
	
	async function fetchTicTacToeData() {
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
		catch (error) {
			toast.error(error instanceof Error ? error.toString() : "somthing went wrong...")
		}
	}


	async function fetchPingPongData() {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}api/game/user_game_stats/`, {
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
			setData({
				total : data.games_played,
				matches_won : data.games_won,
				matches_lost : data.games_lost
			})
		}
		catch (error) {
			toast.error(error instanceof Error ? error.toString() : "somthing went wrong...")
		}
	}
	
	useEffect(() => {
		if (currentUser) {
			let timer = null
			if (!categorie || categorie === 'ping pong') {
				timer = setTimeout(fetchPingPongData, 100) 
			} else {
				timer = setTimeout(fetchTicTacToeData, 100)
			}
	
			return () => {
				if (timer) {
					clearTimeout(timer)
				}
			}
		}
	}, [currentUser, categorie])

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
		<div className='w-full h-[200px] p-2'>
			<div className="w-full h-[60px] flex items-center">
				{
					categories.map((item, index) => (
						<div key={index}><CatButton filter="stats-categorie" text={item.title} icon={item.icon} /></div>
					))
				}
			</div>
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