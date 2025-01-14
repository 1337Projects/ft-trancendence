import { useContext, useEffect, useState } from 'react'
import {ApearanceContext} from '@/Contexts/ThemeContext'
import { UserContext } from '@/Contexts/authContext'
import { CiViewList } from "react-icons/ci";

function History ( {data}) {
	const appearence = useContext(ApearanceContext)

	const date = new Date(data?.created_at)
	// const user = useContext(UserContext)
	// const score = data?.winner?.user?.username == user?.user?.username ? 100 : 10


	return (
		<div className={`my-2 w-full px-2 border-r-[1px] text-white h-[60px] bg-gradient-to-l from-slate-500 ${appearence?.theme === 'light' ? "to-white border-gray-800" : "to-slate-900/10 border-white"}  flex justify-between items-center`}>
			<div className='w-[140px] flex justify-between items-center'>
				<div className='flex items-center'>
					<img src={data?.player1?.profile?.avatar} alt="Description" className="mr-2 border-[1px] h-[35px] w-[35px] rounded-full" />
				</div>  
				<div className='text-center'>
					<p className='text-[10px] mt-1'>+200px</p>
					<p className='text-[10px] text-green-600 mt-1'>winner</p>
				</div> 
				<div className='flex items-center'>
					<img src={data?.player2?.profile?.avatar} alt="Description" className="ml-2 border-[1px] bg-white h-[35px] w-[35px] rounded-full" />
				</div>
			</div>
			<div className='h-fit w-[60px] text-center text-[8px]'>
				<p>{date.getFullYear()} / {date.getDay()} / {date.getDate()}</p>
				<p 
					className={`mt-1 font-light`}
				>{date.getHours()} : {date.getMinutes()}</p>
			</div>
		</div>
	)
}

export default function LastMatch() {
	const user = useContext(UserContext)
	const appearence = useContext(ApearanceContext)
	const [matches, setMatches] = useState(null)

	useEffect(() => {
		const timer = setTimeout(async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}api/profile/matchs/${user.user.username}`, {
					method : 'GET',
					credentials : 'include',
					headers : {
						'Authorization' : `Bearer ${user?.authInfos?.accessToken}`,
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
		<div className={`mt-2 p-2 justify-center flex shadow-sm rounded-sm ${appearence?.theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} min-h-[60px] h-fit max-h-[370px] w-full `}>
			<div className='flex flex-col w-full h-full'>
				<div className={`h-[60px] px-4 flex items-center justify-between`}>
					<p className={`text-secendary`}>Match History</p>
					<CiViewList />
				</div>
				{/* <p className={`text-[10px] font-light}`}>Date</p> */}
				<div className='flex h-full overflow-y-auto flex-col items-end'>
					{
						matches ?
						<ul className='w-full px-2 h-[260px] overflow-scroll'>
							{
								matches.map(m => {
									return (<History key={m.id} data={m} />)
								})
							}
						</ul>
						:
						<div className={`w-full min-h-[100px] max-h-[400px] rounded-sm flex justify-center items-center border-[.2px] ${appearence?.theme == 'light' ? "border-black/20" : "border-white/20"} `}>
							<h1 className='capitalize text-[13px]'>no matches yet</h1>
						</div>
					}
				</div>
			</div>
		</div>
	)
}

