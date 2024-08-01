import React, { useState } from 'react';
import { faCheck, faClock } from "@fortawesome/free-solid-svg-icons"
import {faTrophy} from "@fortawesome/free-solid-svg-icons"
import {faCertificate} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext } from "react"
import {ColorContext, ThemeContext} from '../../Contexts/ThemeContext'

// import ReactApexChart from 'react-apexcharts'
import { LineChart } from '@mui/x-charts/LineChart';
import Status from "./status"
import { Stats } from './status';




// function InviteFriendCard( {name, winRate, avatar = Ava1}) {
// 	const theme = useContext(ThemeContext);
// 	return (
// 		<div className={`ml-2 mt-4 flex w-[91.5%] h-[150px] rounded-sm  ${theme === 'light' ? "bg-lightItems" : "bg-darkItems"}`}> 
// 			<div className=" w-[56%] flex flex-col items-center justify-center">
// 				<p className={`text-[15px] font-kaushan  mb-2 ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>{name}</p>
// 				<p className={`text-[12px]  ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>win rate</p>
// 				<p className={`text-[10px]  ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>{winRate}</p>
// 				<button className="bg-[#56A4FF] rounded-[8px] text-[14px] mt-[8px] pt-[3px] pb-[3px] pl-[17px] pr-[17px] text-darkText">Invite</button>
// 			</div>
// 			<div className="">
// 				<img src={avatar} alt="Description" className=" h-[135px]  mt-[-7px]" />
// 			</div>
// 		</div>
// 	);
// }


function Achivments() {
	const theme = useContext(ThemeContext)
	return (
		<>
			<div className={`h-[300px] mt-2 ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/30"} w-full max-h-[400px] overflow-scroll h-fit rounded-sm p-4`} >
				<ul className='mt-4'>
					{
						achivments.map(a => {
							return (
								<li className='my-6 flex items-center justify-between px-6'>
									<div className='flex items-center'>
										<img src={a.icon} className='w-[45px]' alt="" />
										<div className='ml-4'>
											<h1 className='text-[13px]'>{a.title}</h1>
											<p className='text-[10px] mt-1'>{a.des}</p>
										</div>
									</div>
									<h1 className='ml-10 text-[12px]'>{a.rec}</h1>
									<div className='w-[120px] text-center'>
										{a.achived ? <div className='ml-6 text-[12px] text-emerald-600'>achived <FontAwesomeIcon icon={faCheck} /> </div> : <div className='ml-6 text-[12px]'>not achived yet</div>}
									</div>
								</li>
							)
						})
					}
				</ul>
			</div>
		</>
	)
}


export function PlayerStatus( {toggleExpanded, expand} ) {
	const theme = useContext(ThemeContext);
	const chartColor = theme == 'light' ? "#374151" : "#ffffff"
	const color = useContext(ColorContext)
    return (
		<div className="flex flex-col w-full h-[33vh] mb-2 flex-grow overflow-scroll"> 
			<div className={`flex rounded-sm w-full h-full ${theme === 'light' ? "bg-lightItems" : "bg-darkItems border-darkText/30"}`}>
				<div className="w-[65%] min-w-[180px] flex flex-col px-10 py-2 relative">
					<div className="h-[50px] w-[85%] flex justify-between items-center mt-6">
							<div className="w-[18%] p-1">
								<img src="/aamhamdi1.jpeg" alt="Description" className=" h-[95%] w-[92%] rounded-full shadow-sm" />
							</div>
							<div className=" flex flex-col justify-between h-full py-2 w-[87%] ml-4">
								<p className={`text-[12px] font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Hello</p>
								<p className={`text-[14px] font-semibold  ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>aamhamdi</p>
							</div>
					</div>
					<div className="flex flex-col flex-wrap mt-6">
						<div className=" flex justify-between items-center h-[20px]">
							<p className={`text-[10px] font-light ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>
								<span style={{color:color}} className="text-[16px] font-bold">30 </span>
								/ 100
							</p>
							<p className={`text-[13px] font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>4.30 LVL</p>
						</div>
						<div className={`${theme === 'light' ? "bg-lightText" : "bg-[#ffffff]"} max-h-[20px] h-[10px] rounded-[7px] mt-2 shadow-sm`}>
							<div style={{background:color}} className={`h-full rounded-[6px] w-[30%] `}></div>
						</div>
					</div>
					<div className="w-[85%] h-[200px] flex flex-col mt-2">
						<p className={`text-[14px] font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Progress</p>
						<div className='h-[100%] w-[120%] ml-[-45px]'>
							<LineChart
								leftAxis={null}
								bottomAxis={null}
								series={[
									{ curve: "linear", data: [0, 1, 6, 3, 9.3, 3, 0, 10, 10, -10, 10,0, 1, 6, 3, 9.3, 3, 0, 10, 10, -10, 10, 2, 10], color: chartColor },
									// { curve: "linear", data: [0, 0], color: chartColor },
									
								]}
							/>
						</div>
					</div>
					<div className="h-[50px] flex justify-between w-[60%] absolute bottom-4">
						<div className="text-[12px] flex flex-col justify-center">
							<p className={`font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Win</p>
							<div className="flex items-center mt-2">
								<FontAwesomeIcon icon={faTrophy} style={{color: color}} className="ml-[1px] mr-[2px]" />
								<p className={`ml-1 font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>11</p>
							</div>
						</div>
						<div className="text-[12px] flex flex-col justify-center">
							<p className={`font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Time</p>
							<div className="flex items-center mt-2">
								<FontAwesomeIcon icon={faClock}  style={{color: color}}className="ml-[1px] mr-[2px]" />
								<p className={`ml-1 font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>2h 30 min</p>
							</div>
						</div>
						<div className="text-[12px] flex flex-col justify-center">
							<p className={`font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Rate</p>
							<div className="flex items-center mt-2">
								<FontAwesomeIcon icon={faCertificate} style={{color: color}}className="ml-[1px] mr-[2px]" />
								<p className={`ml-1 font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>5</p>
							</div>
						</div>
					</div>
				</div>
				<div className="w-[40%] flex justify-center">
					<img src="/ava2.png" alt="Description" className="h-[350px]" />
				</div>
			</div>
			
		</div>
    )
}


const achivments = [
	{id:0,title:'Bill Gates 3', des:'be active for more 3,5,7 days', rec : '1/2 ', achived:false, icon:'/fire.png'},
	{id:1,title:'Bill Gates 3', des:'be active for more 3,5,7 days', rec : '2/2', achived:true, icon:'/crow.png'},
	{id:2,title:'Bill Gates 3', des:'be active for more 3,5,7 days', rec : '6/6', achived:true, icon:'/medal.png'},
	{id:3,title:'Bill Gates 3', des:'be active for more 3,5,7 days', rec : '0/2', achived:false, icon:'/thumb-up.png'},
]

function Level() {
	return (
		<>
			<div className='flex items-center text-white text-[13px] justify-between'>
				<h1><span className='text-[24px] text-red-500'>5</span>/200</h1>
				<h1>4.3LVL</h1>
			</div>
			<div className='relative mt-2'>
				<div className='bg-white h-2 rounded-sm'></div>
				<div className='bg-red-500 w-1/4 h-2 top-0 rounded-sm absolute'></div>
			</div>
		</>
	)
}

function LChart() {
	const theme = useContext(ThemeContext)
	const chartColor = theme == 'light' ? "#374151" : "#ffffff"
	return(
		<div className='h-[100px] w-full mt-20'>
			<LineChart
				leftAxis={null}
				bottomAxis={null}
				series={
					[{ 
						curve: "linear",
						data: [
							0, 1, 6, 3, 9.3, 3, 0, 10, 0, -10, 10,0, 1, 6, 3, 9.3, 3, 0, 10, 0, -10, 10, 2, 10
						],
						color: chartColor,
						showMark:false
					}]
				}
				margin={{left: 10,bottom:10, top:10, right:10}}
				disableLineItemHighlight={true}
			/>
		</div>
	)
}

function Statuss() {
	return (
		<div className='mt-10'>
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

function Avatar() {
	return (
		<img src="/ava2.png" className='h-[250px] ml-[50%] translate-x-[-50%]' alt="" />
	)
}

function Statistics() {
	const theme = useContext(ThemeContext)
	const color = useContext(ColorContext)
	return (
		<div className="h-[50px] mt-10 w-full p-2 flex justify-between ">
			<div className="text-[12px] flex flex-col justify-center text-center">
				<p className={`font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Win</p>
				<div className="flex items-center mt-2">
					<FontAwesomeIcon icon={faTrophy} style={{color: color}} className="ml-[1px] mr-[2px]" />
					<p className={`ml-1 font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>11</p>
				</div>
			</div>
			<div className="text-[12px] flex flex-col justify-center text-center">
				<p className={`font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Time</p>
				<div className="flex items-center mt-2">
					<FontAwesomeIcon icon={faClock}  style={{color: color}}className="ml-[1px] mr-[2px]" />
					<p className={`ml-1 font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>2h 30 min</p>
				</div>
			</div>
			<div className="text-[12px] flex flex-col justify-center text-center">
				<p className={`font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Rate</p>
				<div className="flex items-center mt-2">
					<FontAwesomeIcon icon={faCertificate} style={{color: color}}className="ml-[1px] mr-[2px]" />
					<p className={`ml-1 font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>5</p>
				</div>
			</div>
		</div>
	)
}

function Banner() {
	const theme = useContext(ThemeContext)
	// const [expand, setExpand] = useState(false)
	// const toggleExpanded = () => {
	// 	setExpand(!expand)
	// }
	return (
		<>
			<div className='p-2'>
				<div className='bg-banner bg-cover border-[.2px] border-darkText/40 w-full h-[140px] rounded-xl relative' >
					<div className='absolute bottom-[-50px] left-10 flex items-end'>
						<img className='w-[100px] border-[.3px] rounded-full ' src="/aamhamdi1.jpeg" alt="" />
						<h1 className='text-white font-bold ml-4'>@aamhamdi</h1>
					</div>
				</div>
				<div className='p-2 h-fit text-[12px] mt-16 flex'>
					<div className='w-1/2'>
						<ul className='text-white ml-10'>
							<li className='mt-2'>🔥 Lorem ipsum dolor sit amet.</li>
							<li className='mt-2'>🎮 Lorem ipsum dolor.</li>
							<li className='mt-2'>🚀 Lorem amet.</li>
						</ul>
					</div>
					<div className='w-1/2 p-2 flex justify-center items-center'>
						{/* <button className='bg-green-300 p-1 mr-2 rounded-sm'>Add Frient</button>
						<button className='bg-green-300 p-1 mr-2 rounded-sm'>Contact</button> */}
					</div>
				</div>
			</div>
			<div className='h-fit p-2 flex'>
				<div className='w-3/5 flex border-[0px] justify-center h-[380px] border-white/30 p-2 rounded-sm'>
					<div className='w-3/4'>
						<Level />
						<LChart />
						<Statuss />
					</div>
				</div>
				<div className='w-2/5 flex items-center border-[0px] ml-2 justify-center h-[380px] border-white/30 p-2 rounded-sm'>
					<div className='w-3/4 h-full py-2'>
						<div className=''>
							<Avatar />
						</div>
						<Statistics />
					</div>
				</div>
			</div>
			{/* achivments */}
			<div className='px-2 h-[400px] border-white/30 border-[0px] rounded-sm'>
				<Achivments />
			</div>
		</>
	)
}

export default function Profile() {
	const [expand, setExpand] = useState(false)

	const theme = useContext(ThemeContext)
	const toggleExpanded = () => {
		setExpand(!expand)
	}
	return (
		<div className="flex flex-grow justify-center h-full w-full mr-2">
			<div className={`w-full p-1 h-[100vh] overflow-scroll ${theme == 'light' ? "bg-lightItems" : "bg-darkItems"}`}>
				<Banner />
				{/* <PlayerStatus /> */}
				{/* <Status toggleExpanded={toggleExpanded} expand={expand}  />
				<Achivments /> */}
			</div>
			{/* <PlayerStatus toggleExpanded={toggleExpanded} expand={expand} />	 */}
		</div>
	)
}