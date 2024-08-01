import React from 'react'
import { useContext } from 'react'
import {ColorContext, ThemeContext} from '../../Contexts/ThemeContext'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faFire} from "@fortawesome/free-solid-svg-icons"

import {
	CircularProgressbarWithChildren,
	buildStyles
  } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";


function Stats ({day="mon", date="10", fire=false}) {
	const theme = useContext(ThemeContext);
	const color = useContext(ColorContext)
	return (
		<div className=' flex flex-col items-center w-[60px] text-[20px] mt-4'>
			<FontAwesomeIcon icon={faFire} style={{color: fire === false ? theme === 'light' ? "#5A5959": "#ffffff" : color}} />
			<div className={`text-[10px] mt-2 text-center font-bold ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>
				<p>{day}</p>
				<p>{date}</p>
			</div>
		</div>
	)
}

export default function Status( {toggleExpanded, expand}) {
	const theme = useContext(ThemeContext);
	const color = useContext(ColorContext)
	return (
		<div className={` h-[33vh] w-full flex items-center rounded-sm ${theme === 'light' ? "bg-lightItems" : "bg-darkItems border-darkText/30"} `}>
			{/* <div className='ml-5 mt-4'>
					<p className={`text-[15px] font-kaushan ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>More Infos</p>
			</div> */}
			<div className='flex h-[200px] items-center'>
				<div className='w-[35%] flex flex-col '>
					<div className=' grow flex items-center justify-center'>
						<div className='w-[40%] h-[50%] rounded-full'>
						<CircularProgressbarWithChildren styles={buildStyles({pathColor: color,strokeLinecap: "butt", trailColor:"#374151"})} strokeWidth={13}  value={30} >
						
							<p className={`text-[10px] font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Your Rank</p>
							<p className={`text-[10px] font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>30/100</p>
							
						</CircularProgressbarWithChildren>
						</div>
					</div>
				</div>
				<div className='flex w-[60%] h-full items-center justify-center'>
					<div className='flex flex-col w-full h-[55%]'>
						<div className={`shrink-0 flex w-[77%] h-[35px] text-[10px] mb-2 font-thin justify-between ${theme === 'light' ? "text-lightText" : "text-darkText"}`}>
							<p>Last Week</p>
							<p onClick={toggleExpanded}>{expand ? "hide" : "see all"}</p>
						</div>
						<div className='flex-col mt-2 w-[80%]'>
							<div className='flex'>
								<Stats/>
								<Stats fire date='11' day='tur'/>
								<Stats date='12' day='wed'/>
								<Stats date='13' day='thr'/>
								<Stats fire date='14' day='fri'/>
								<Stats date='15' day='sat'/>
								<Stats fire date='16' day='sun'/>
							</div>
							{
								expand &&
								<>
									<div className='flex'>
										<Stats date='17' day='mon'/>
										<Stats date='18' day='tur'/>
										<Stats date='19' day='wed'/>
										<Stats date='20' day='thr'/>
										<Stats date='21' day='fri'/>
										<Stats date='22' day='sat'/>
										<Stats date='23' day='sun'/>
									</div>
									<div className='flex'>
										<Stats date='24' day='mon'/>
										<Stats date='25' day='tur'/>
										<Stats date='26' day='wed'/>
										<Stats date='27' day='thr'/>
										<Stats date='28' day='fri'/>
										<Stats date='29' day='sat'/>
										<Stats date='30' day='sun'/>
									</div>
								</>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
// Compare this snippet from src/components/chat/chat.jsx:
