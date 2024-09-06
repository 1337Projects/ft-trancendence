import React, { useEffect, useState } from 'react';
import { faAnglesUp, faCheck, faCheckDouble, faClock, faCommentDots, faEllipsisV, faGamepad, faHourglassHalf, faRankingStar, faUserMinus, faUserPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import {faTrophy} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext } from "react"
import {ColorContext, ThemeContext} from '../../Contexts/ThemeContext'
import { LineChart } from '@mui/x-charts/LineChart';
import { Stats } from './status';
import { useParams } from 'react-router-dom';
import { authContext, userContext, userContextHandler } from '../../Contexts/authContext';


function Achivments() {
	const theme = useContext(ThemeContext)
	return (
		<>
			<div className={`h-[300px] mt-2 ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/30"} w-full max-h-[400px] overflow-scroll h-fit rounded-sm p-4`} >
				<ul className='mt-4'>
					{
						achivments.map(a => {
							return (
								<li key={a.id} className='my-6 flex items-center justify-between px-6'>
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
							<p className={`font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Rank</p>
							<div className="flex items-center mt-2">
								<FontAwesomeIcon icon={faAnglesUp} style={{color: color}}className="ml-[1px] mr-[2px]" />
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
	const color = useContext(ColorContext)
	const theme = useContext(ThemeContext)
	const user = useContext(userContext)

	function test(f) {
		return Math.ceil(((f < 1.0) ? f : (f % Math.floor(f))) * 100)
	}

	return (
		<>
			<div className={`${theme == 'light' ? "text-lightText" : "text-darkText"} flex items-center text-[13px] justify-between`}>
				<h1><span style={{color:color}} className='text-[20px]'>{user?.profile?.rank}</span> / 200</h1>
				<h1>{user?.profile?.level} LVL</h1>
			</div>
			<div className='relative mt-2'>
				<div className={`${theme == 'light' ? "bg-darkItems" : "bg-lightItems"} h-2 rounded-sm`}></div>
				<div style={{background:color, width:`${test(user?.profile?.level)}%`}} className='h-2 top-0 rounded-sm absolute'></div>
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
							0, 1, 6, 3, 9.3, 3, 0, 10, 0, -10, 10,0, 1, 6, 3, 9.3, 3, 0, 10, 0, -10, 10, 2, 10,
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
				<p className={`font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Rank</p>
				<div className="flex items-center mt-2">
					<FontAwesomeIcon icon={faRankingStar} style={{color: color}}className="ml-[1px] mr-[2px]" />
					<p className={`ml-1 font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>5</p>
				</div>
			</div>
		</div>
	)
}

function ActionButton({text, icon, handler}) {
	const color = useContext(ColorContext)
	return (
		<button 
			onClick={handler} 
			style={{background:color}} 
			className='text-white p-2 px-4 rounded-2xl flex items-center justify-center'
		>
			<h1 className='mr-2 capitalize'>{text}</h1>
			<FontAwesomeIcon icon={icon} />
		</button>
	)
}

function Actions({auth_user, profile_user, handlers}) {
	
	function has_relation(arr, id) {
		const res = arr.filter(item => (item.receiver == id || item.sender.id== id))
		return res.length
	}

	function is_waiting(arr, id) {
		const res = arr.filter(item => (item.receiver == id || item.sender.id== id))
		if (res.length) {
			return res[0].status == 'waiting'
		}
		return res.length
	}

	if (!has_relation(auth_user.friends, profile_user.id) && !has_relation(profile_user.friends, auth_user.id)) {
		return (<ActionButton text="Add Friend" icon={faUserPlus} handler={handlers.new} />)
	}

	if (has_relation(auth_user.friends, profile_user.id) && is_waiting(auth_user.friends, profile_user.id)) {
		return (
			<div className='flex justify-between w-[220px]'>
				<ActionButton text="accept friend" icon={faCheckDouble} handler={handlers.accept} />
				<ActionButton text="reject" icon={faXmark} handler={handlers.reject} />
			</div>
		)
	}
	if ((has_relation(auth_user.friends, profile_user.id) && !is_waiting(auth_user.friends, profile_user.id))
		||
		(has_relation(profile_user.friends, auth_user.id) && !is_waiting(profile_user.friends, auth_user.id))
	){
		return (
			<div className='flex justify-between items-center w-[230px]'>
				<ActionButton text="contact" icon={faCommentDots} handler={null} />
				<ActionButton text="unfriend" icon={faUserMinus} handler={handlers.cancle} />
				<div className='text-white w-[10px] h-[30px] flex justify-end items-center cursor-pointer'>
					<FontAwesomeIcon  icon={faEllipsisV} className='text-[14px]' />
				</div>
			</div>
		)
	}

	return (<ActionButton text="cancle the request" icon={faXmark} handler={handlers.cancle} />)
}

function Banner() {
	const theme = useContext(ThemeContext)
	const userData = useContext(userContext)
	const {user} = useParams()
	const [data, setData] = useState(userData)
	const [loading, setLoading] = useState(true)
	const [update, setUpdate] = useState(false)
	const tokens = useContext(authContext)
	const userHandler = useContext(userContextHandler)

	const handlers = {
		"new" : send_friend_request,
		"accept": accept_friend_request,
		"cancle" : cancle_friend_request,
		"reject" : reject_friend_request
	}

	function send_friend_request() {
		fetch('http://localhost:8000/api/friends/new_relation/', {
			method : 'POST',
			headers : {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${tokens.mytoken}`
			},
			credentials: 'include',
			body : JSON.stringify({data : data})
		})
		.then(res => res.json())
		.then(data => {
			if (data.status == 'success') {
				setUpdate(prev => !prev)
			}
		})
		.catch(err => console.log(err))

	}

	function accept_friend_request() {
		fetch('http://localhost:8000/api/friends/accept_friend/', {
			method : 'POST',
			headers : {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${tokens.mytoken}`
			},
			credentials: 'include',
			body : JSON.stringify({data : data})
		})
		.then(res => res.json())
		.then(data => {
			if (data.status == 'success') {
				setUpdate(prev => !prev)
			}
		})
		.catch(err => console.log(err))
	}

	function reject_friend_request() {
		fetch('http://localhost:8000/api/friends/reject_friend/', {
			method : 'POST',
			headers : {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${tokens.mytoken}`
			},
			credentials: 'include',
			body : JSON.stringify({data : data})
		})
		.then(res => res.json())
		.then(data => {
			if (data.status == 'success') {
				setUpdate(prev => !prev)
			}
		})
		.catch(err => console.log(err))
	}

	function cancle_friend_request() {
		fetch('http://localhost:8000/api/friends/cancle_friend/', {
			method : 'POST',
			headers : {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${tokens.mytoken}`
			},
			credentials: 'include',
			body : JSON.stringify({data : data})
		})
		.then(res => res.json())
		.then(data => {
			console.log(data)
			if (data.status == 'success') {
				setUpdate(prev => !prev)
			}
		})
		.catch(err => console.log(err))
	}

	useEffect(() => {
		const timer = setTimeout(async () => {
			if (user != undefined) {
				await fetch(`http://localhost:8000/api/profile/${user}/`, {
					headers : {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${tokens.mytoken}`
					},
					credentials : 'include',
					method : 'GET'
				})
				.then(res => res.json())
				.then(data => {
					setData(data.data)
				})
				.catch(err => console.log(err))
			} else {
				setData(userData)
			}
			if (update) {
				fetch(`http://localhost:8000/api/profile/profile_data/`, {
					method: 'GET',
					credentials : 'include',
					headers : {
						'Authorization' : `Bearer ${tokens.mytoken}`,
					}
				})
				.then(res => res.json())
				.then(res => {
					userHandler(res.data)
				})
				.catch(err => console.log(err))
			}
			setLoading(false)
		}, 300)
		return () => {
			clearTimeout(timer)
			setLoading(true)
		}
	}, [user, update])

	return (
		<>
			<div className='p-2'>
				<div className='bg-banner mb-16 bg-cover border-[.2px] border-darkText/40 w-full h-[140px] rounded-sm relative' >
					<div className='absolute bottom-[-70px] left-10 flex items-end'>
						<img className='w-[90px] border-[.3px] bg-white rounded-full ' src={`${data?.profile?.image}`} alt="" />
						<div className='ml-4 text-white'>
							<h1 className='text-[16px] uppercase'>{data?.first_name} {data?.last_name}</h1>
							<h1 className='mt-2 font-bold'>@{data?.username}</h1>
						</div>
					</div>
				</div>
				<div className='p-2 h-fit text-[12px] py-10 flex items-center'>
					<div className='w-1/2'>
						{
							data?.profile?.bio != '' && 
							<textarea 
								value={data?.profile?.bio} 
								disabled={true}
								className={`${theme == 'light' ? "text-lightText" : "text-darkText"} resize-none bg-transparent outline-none w-full mx-10`}>
							</textarea>
						}
					</div>
					{
						user != undefined && 
						<div className='w-1/2 flex justify-end items-center'> 
							{/* {
								loading ? "" :
								<Actions auth_user={userData} profile_user={data} handlers={handlers} />
							} */}
						</div>
					}
				</div>
			</div>
			<div className='h-fit flex'>
				<div className='w-3/5 flex border-[0px] justify-center h-[380px] border-white/30 rounded-sm'>
					<div className='w-3/4'>
						<Level />
						<LChart />
						<Statuss />
					</div>
				</div>
				<div className='w-2/5 flex items-center border-[0px] justify-center h-[380px] border-white/30 rounded-sm'>
					<div className='w-3/4 h-full'>
						<div className=''>
							<Avatar />
						</div>
						<Statistics />
					</div>
				</div>
			</div>
			{/* achivments */}
			<div className='px-2 h-[400px] border-white/30 border-[0px] flex justify-center rounded-sm'>
				<div className='w-full h-full'>
					{/* <FriendsList /> */}
					<Achivments />
				</div>
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
		<div className="flex flex-grow justify-center h-full w-full">
			<div className={`w-full p-1 h-[100vh] overflow-scroll border-[.3px] ${theme == 'light' ? "bg-lightItems border-lightText/10" : "bg-darkItems border-darkText/10"}`}>
				<Banner />
			</div>
		</div>
	)
}