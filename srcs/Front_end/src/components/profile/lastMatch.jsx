import React from 'react'
import { useContext } from 'react'
import {ThemeContext} from '../../Contexts/ThemeContext'

import Enemy from "../../assets/enemy.png"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'


function History ( {date="01-01-2024 19:30", name="enemy", score=-10}) {
	const theme = useContext(ThemeContext);
	return (
		<div className={`my-4 w-full border-r-[0.5px] px-4 ${score < 0 ? "border-r-[#db4658]" : "border-r-[#00AA30]"} h-[50px] flex justify-between `}>
			<div className='self-center flex'>
				<img src="/aamhamdi1.jpeg" alt="Description" className=" h-[35px] w-[35px] rounded-full" />
				<div className='flex w-full flex-col justify-around ml-4 self-center'>
					<p className={`text-[12px] ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>VS {name}</p>
					<div className='flex items-center mt-1'>
						<p className={`mr-[2px] text-[10px] font-light ${score < 0 ? "text-[#db4658]" : "text-[#00AA30]"}`}>{score}</p>
						<FontAwesomeIcon className='w-[6px] ml-2' icon={score < 0 ? faCaretDown : faCaretUp} style={{color: score < 0 ? "#db4658" : "#00AA30"}}  />
					</div>
				</div>
			</div>
			<div className='flex flex-col-reverse h-[85%] ml-1'>
				<p className={`text-[8px] font-light ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>{date}</p>
			</div>
		</div>
	)
}

export default function LastMatch() {
	const theme = useContext(ThemeContext);
	return (
		<div className={`mt-2 justify-center flex shadow-sm rounded-sm ${theme === 'light' ? "bg-lightItems" : "bg-darkItems"} h-[400px] py-2 w-full `}>
			<div className='flex flex-col w-[90%] h-full px-2'>
				<div className={`h-[25%] flex items-center justify-between ${theme === 'light' ? "text-lightText" : "text-darkText"}`}>
					<p className={`text-secendary`}>Last Match</p>
					<div className='text-[10px]'>see all</div>
				</div>
				<p className={`text-[10px] font-light ${theme === 'light' ? "text-lightText" : "text-darkText"}`}>Date</p>
				<div className='flex overflow-y-auto flex-col mt-2 items-end border-l-[0.5px] border-l-[#fbfbfb]'>
					<History name='Joker'/>
					<History score={10} name='Batman'/>
					<History score={-10}/>
					<History score={-10}/>
				</div>
			</div>
		</div>
	)
}

