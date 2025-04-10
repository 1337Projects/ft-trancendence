import { useContext, useEffect, useState } from "react"
import { UserContext } from "@/Contexts/authContext"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { CatButton } from "@/components/game/Game"
import { IoTimeOutline } from "react-icons/io5"
import { FaArrowTrendUp } from "react-icons/fa6"
import { BiSolidMedal } from "react-icons/bi";
import { MatchDataType } from "@/types/gameTypes"
import { categories } from "@/components/profile/dashboard/Status"
import { useOutletContext, useSearchParams } from "react-router-dom"
import{ toast } from 'react-toastify'
import { UserType } from "@/types/userTypes"



export default function MatchHistory() {

	const [matches, setMatches] = useState<MatchDataType[] | null>(null)
	const { authInfos } = useContext(UserContext) || {}
	const { theme } = useContext(ApearanceContext) || {}
	const currentUser : UserType = useOutletContext()
	const [searchParams] = useSearchParams()
	const categorie = searchParams.get("match-history-categorie")
	
	async function fetchPingPongMatchHistory() {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}api/game/user_game_history/${currentUser?.username}/`, {
				method : 'GET',
				credentials : 'include',
				headers : {
					'Authorization' : `Bearer ${authInfos?.accessToken}`,
				}
			})
			
			if (!response.ok) {
				throw new Error('An error occured')
			}

			const data = await response.json()
			setMatches(data)

		} catch (error) {
			console.error(error)
		}
	}

	async function fetchTicTacToeMatchHistory() {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}api/profile/matchs/${currentUser?.username}/`, {
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
			setMatches(data)

		} catch (error) {
			toast.error(error instanceof Error ? error.toString() : "Somthing went wrong...")
		}
	}


    useEffect(() => {
        let timer = null
		
		if (currentUser && !categorie || categorie === 'ping pong') {
			timer = setTimeout(fetchPingPongMatchHistory, 100)
		} else if (currentUser) {
			timer = setTimeout(fetchTicTacToeMatchHistory, 100)
		}

        return () => {
			if (timer) {
				clearTimeout(timer)
			}
		}
    }, [categorie, currentUser])

    if (!matches) {
        return (
            <div className="w-full h-fit p-2">
                <div className="h-[40px] animate-pulse mb-6 rounded w-full bg-gray-300" />
                <div className="h-[40px] animate-pulse mb-6 rounded w-full bg-gray-300" />
                <div className="h-[40px] animate-pulse mb-6 rounded w-full bg-gray-300" />
                <div className="h-[40px] animate-pulse mb-6 rounded w-full bg-gray-300" />
            </div>
        )
    }

	return (
		<div className="w-full h-fit p-2">
			<h1 className="text-xl font-bold">Recent Matches</h1>
			<div className="w-full h-[30px] flex mt-10">
				{
					categories.map((item, index) => 
						<CatButton filter="match-history-categorie" key={index} text={item.title} icon={item.icon} />
					)
				}
			</div>
			<ul className={`w-full overflow-scroll rounded ${theme === 'light' ? "border-black/20" : "border-white/20"} border-[0px] py-2 px-4 h-fit max-h-[600px] mt-4`}>
				{
					(matches?.length > 0)? matches?.map((match, index : number) => (
						<History key={index} data={match} />
					)) : <li className="text-xs h-[150px] flex justify-center items-center capitalize">
						you haven't played any match yet
					</li>
				}
				
			</ul>
		</div>
	)
}


export function History ({data} : {data : MatchDataType}) {
	const { color } = useContext(ApearanceContext) || {}
	const date = new Date(data?.created_at)

	return (
		<div 
			className={`my-4 w-full h-[80px]`}
		>
			<div className='h-fit w-full flex items-center  text-[10px]'>
				<IoTimeOutline className="mr-2" />
				<p className="mr-2">{date.getFullYear()} - {date.getDay()} - {date.getDate()}</p>
				<p className={`font-light`}>{date.getHours()} : {date.getMinutes()}</p>
			</div>

			<div className={`w-full p-2 flex h-[60] rounded border-[0px] border-white/20 justify-between items-center`}>
				<div className='flex items-center'>
                    <div className="relative">
                        {
                            data?.winner === data?.player1?.id && 
                                <div style={{background : color}} className="absolute flex justify-center items-center p-1 w-[20px] h-[20px] rounded-full bottom-0 right-2">
                                    <BiSolidMedal className="text-white"  />
                                </div>
                        }
                        <img 
                            src={data?.player1?.profile?.avatar} 
                            alt="Description" 
                            className="mr-4 border-[1px] h-[40px] w-[40px] rounded-full" 
                            />
                    </div>
					<div className="mr-4 w-[80px]">
						<h1 className="font-bold text-md">{data?.player1?.username}</h1>
						<div className="mt-1 text-xs flex items-center">
							<p className="mr-2">level {data?.player1?.profile?.level}</p>
							<FaArrowTrendUp />
						</div>
					</div>
				</div>  
				<div className='text-center'>
					<p className="text-xl">vs</p>
				</div> 
				<div className='flex items-center'>
					<div className="ml-4 flex flex-col items-end">
						<h1 className="font-bold text-md">{data?.player2?.username}</h1>
						<div className="mt-1 text-xs flex items-center">
							<FaArrowTrendUp />
							<p className="ml-2">level {data?.player2?.profile?.level}</p>
						</div>
					</div>
                    <div className="relative">
                        {
                            data?.winner == data?.player2?.id && 
                                <div style={{background : color}} className="absolute flex justify-center items-center p-1 w-[20px] h-[20px] rounded-full bottom-0 left-2">
                                    <BiSolidMedal className="text-white"  />
                                </div>
                        }
                        <img 
                            src={data?.player2?.profile?.avatar} 
                            alt="Description" 
                            className="ml-4 border-[1px] bg-white h-[40px] w-[40px] rounded-full" 
                        />
                    </div>
				</div>
			</div>
		</div>
	)
}