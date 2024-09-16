import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import {ThemeContext} from '../../Contexts/ThemeContext'
import { authContext } from '../../Contexts/authContext'


function History ( {date="01-01-2024 19:30", data}) {
	const theme = useContext(ThemeContext);
	const tokens = useContext(authContext)
	const score = data?.winner?.user?.username == tokens.username ? 100 : 10
	return (
		<div className={`my-4 w-full border-r-[0.5px] px-4 ${score == 10 ? "border-r-[#db4658]" : "border-r-[#00AA30]"} h-[50px] flex justify-between `}>
			<div className='self-center flex'>
				<img src={data?.player1?.user?.profile?.image} alt="Description" className=" border-[1px] h-[35px] w-[35px] rounded-full" />
				<div className='flex w-full flex-col justify-around mx-4 text-center self-center'>
					<p className={`text-[12px] ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>{data?.player1_score} - {data?.player2_score}</p>
					<p className={`mr-[2px] mt-1 text-[10px] font-light ${score == 10 ? "text-[#db4658]" : "text-[#00AA30]"}`}>+{score}</p>
				</div>
				<img src={data?.player2?.user?.profile?.image} alt="Description" className=" border-[1px] bg-white h-[35px] w-[35px] rounded-full" />
			</div>
			<div className='flex flex-col-reverse h-[85%] ml-1'>
				<p className={`text-[8px] font-light ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>{date}</p>
			</div>
		</div>
	)
}

export default function LastMatch() {
	const tokens = useContext(authContext)
	const [matches, setMatches] = useState(null)
	useEffect(() => {
		const timer = setTimeout(() => {
			fetch('http://localhost:8000/api/game/matches/', {
				method : 'GET',
				credentials : 'include',
				headers : {
					'Authorization' : `Bearer ${tokens.mytoken}`,
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
	const theme = useContext(ThemeContext);
	return (
		<div className={`mt-2 p-2 justify-center flex shadow-sm rounded-sm ${theme === 'light' ? "bg-lightItems" : "bg-darkItems"} min-h-[60px] h-fit max-h-[370px] w-full `}>
			<div className='flex flex-col w-full h-full'>
				<div className={`h-[60px] flex items-center justify-between ${theme === 'light' ? "text-lightText" : "text-darkText"}`}>
					<p className={`text-secendary`}>Last Match</p>
				</div>
				{/* <p className={`text-[10px] font-light ${theme === 'light' ? "text-lightText" : "text-darkText"}`}>Date</p> */}
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
						<div className='w-full h-[240px] rounded-sm text-white flex justify-center items-center border-[.2px] border-white/20'>
							<span className='text-[20px] mr-2'>😕</span>
							<h1 className='capitalize text-[13px]'>no matches yet</h1>
						</div>
					}
				</div>
			</div>
		</div>
	)
}

