import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import {ApearanceContext} from '../../Contexts/ThemeContext'
import {UserContext} from '../../Contexts/authContext'

function History ( {date="01-01-2024 19:30", data}) {
	const appearence = useContext(ApearanceContext)
	const user = useContext(UserContext)
	const score = data?.winner?.user?.username == user?.user?.username ? 100 : 10
	return (
		<div className={`my-4 w-full border-r-[0.5px] px-4 ${score == 10 ? "border-r-[#db4658]" : "border-r-[#00AA30]"} h-[50px] flex justify-between `}>
			<div className='self-center flex'>
				<img src={data?.player1?.user?.profile?.image} alt="Description" className=" border-[1px] h-[35px] w-[35px] rounded-full" />
				<div className='flex w-full flex-col justify-around mx-4 text-center self-center'>
					<p className={`text-[12px] ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"} `}>{data?.player1_score} - {data?.player2_score}</p>
					<p className={`mr-[2px] mt-1 text-[10px] font-light ${score == 10 ? "text-[#db4658]" : "text-[#00AA30]"}`}>+{score}</p>
				</div>
				<img src={data?.player2?.user?.profile?.image} alt="Description" className=" border-[1px] bg-white h-[35px] w-[35px] rounded-full" />
			</div>
			<div className='flex flex-col-reverse h-[85%] ml-1'>
				<p className={`text-[8px] font-light ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"} `}>{date}</p>
			</div>
		</div>
	)
}

export default function LastMatch() {
	const user = useContext(UserContext)
	const appearence = useContext(ApearanceContext)
	const [matches, setMatches] = useState(null)
	useEffect(() => {
		const timer = setTimeout(() => {
			fetch('http://localhost:8000/api/game/matches/', {
				method : 'GET',
				credentials : 'include',
				headers : {
					'Authorization' : `Bearer ${user?.authInfos?.accessToken}`,
				  }
			})
			.then(res => res.json())
			.then(res => {
				if (res.data) {
					setMatches(res.data)
				}
			})
			.catch(err => console.log(err))
		}, 300)

		return () => clearTimeout(timer)
	}, [])
	return (
		<div className={`mt-2 p-2 justify-center flex shadow-sm rounded-sm ${appearence?.theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} min-h-[60px] h-fit max-h-[370px] w-full `}>
			<div className='flex flex-col w-full h-full'>
				<div className={`h-[60px] flex items-center justify-between`}>
					<p className={`text-secendary`}>Last Match</p>
				</div>
				{/* <p className={`text-[10px] font-light}`}>Date</p> */}
				<div className='flex h-full overflow-y-auto flex-col items-end'>
					{
						matches?.length ?
						<ul className='w-full my-2 border-[.2px] border-white/20 p-2  h-[260px] overflow-scroll'>
							{
								matches.map(m => {
									return (<History key={m.id} data={m} name='Joker'/>)
								})
							}
						</ul>
						:
						<div className='w-full min-h-[100px] max-h-[400px] rounded-sm text-white flex justify-center items-center border-[.2px] border-white/20'>
							<span className='text-[20px] mr-2'>😕</span>
							<h1 className='capitalize text-[13px]'>no matches yet</h1>
						</div>
					}
				</div>
			</div>
		</div>
	)
}

