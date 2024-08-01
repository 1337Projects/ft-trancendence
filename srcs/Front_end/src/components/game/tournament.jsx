
import Table from '../assets/table';
import Table2 from '../assets/table2';

import React, { useContext } from 'react';
import { ThemeContext } from '../../Contexts/ThemeContext';

export default function Tournament() {
	const theme = useContext(ThemeContext);
	// array of players in the tournament 
	let rounds = "4";
	let players = "8";
	return (
		<div className={` mt-2 flex-col h-[800px] flex items-center ${theme == 'light' ? " bg-lightItems" : " bg-darkItems"}`}>
			<div className='h-[90px] flex  flex-col justify-center w-[90%] '>
				<p className={`text-[38px] font-kaushan  mb-2 ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Tournament</p>
				<p className={`ml-2 text-[15px]  ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>{players} players, {rounds} rounds, 2min for round</p>
			</div>
			<div className='mt-[100px] flex justify-center'>
				{/* array will be passed as an argument to  */}
				<Table />
			</div>
		</div>
	)
}