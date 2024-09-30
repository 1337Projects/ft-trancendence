import React, { useContext } from 'react'
import { ApearanceContext } from '../../Contexts/ThemeContext'
import { FaFireAlt } from 'react-icons/fa'

function Stats ({day="mon", date="10", fire=false}) {
	const appearence = useContext(ApearanceContext)
	return (
		<div className=' flex flex-col items-center w-[60px] text-[20px] mt-4'>
			<div style={{color: fire === false ? appearence?.theme === 'light' ? "#5A5959": "#ffffff" : appearence?.color}}>
				<FaFireAlt className='text-[12pt]' />
			</div>
			
			<div className={`text-[10px] mt-2 text-center font-bold ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"} `}>
				{/* <p>{day}</p> */}
				<p>{date}</p>
			</div>
		</div>
	)
}


export default function Status() {
	return (
		<div className=''>
			<div className='flex'>
				<Stats/>
				<Stats fire date='11' day='tur'/>
				<Stats date='12' day='wed'/>
				<Stats date='13' day='thr'/>
				<Stats fire date='14' day='fri'/>
				<Stats date='15' day='sat'/>
				<Stats fire date='16' day='sun'/>
			</div>
			<div className='flex'>
				<Stats/>
				<Stats fire date='11' day='tur'/>
				<Stats date='12' day='wed'/>
				<Stats date='13' day='thr'/>
				<Stats fire date='14' day='fri'/>
				<Stats date='15' day='sat'/>
				<Stats fire date='16' day='sun'/>
			</div>
			<div className='flex'>
				<Stats/>
				<Stats fire date='11' day='tur'/>
				<Stats date='12' day='wed'/>
				<Stats date='13' day='thr'/>
				<Stats fire date='14' day='fri'/>
				<Stats date='15' day='sat'/>
				<Stats fire date='16' day='sun'/>
			</div>
		</div>
	)
}

