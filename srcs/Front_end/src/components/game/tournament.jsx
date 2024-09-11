
import Table from '../assets/table';

import React, { useContext, useEffect, useState } from 'react';
import { ColorContext, ThemeContext } from '../../Contexts/ThemeContext';
import Socket from '../../socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { friendsContext, userContext } from '../../Contexts/authContext';


export function TournmentWaiting() {
	const theme = useContext(ThemeContext)
	const color = useContext(ColorContext)
	const [invite, setInvite] = useState(false)
	const [room, setRoom] = useState(null)
	const friends = useContext(friendsContext)
	const user = useContext(userContext)
	useEffect(() => {
		const timer = setTimeout(() => {
			Socket.connect("ws://localhost:8000/ws/game/tournment/4/any/")
			Socket.addCallback("setRoom", setRoom)
		}, 300)

		return () => clearTimeout(timer)
	}, [])

	function get_user(data) {
        if (data.sender.username == user.username)
            return data.receiver
        return data.sender
    }

	useEffect(() => {
		const timer = setTimeout(() => {
			console.log(room)
		}, 300)
		return () => clearTimeout(timer)
	}, [room])

	return (
		<div className='w-full h-[100vh] bg-darkItems mt-2 rounded-sm'>
			<div className={`flex justify-center items-center justify-center ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems/50 text-darkText"} backdrop-blur-md border-r-[.2px] w-full h-full`}>
                <div className="h-fit relative">
                    <div className="text-center uppercase">
                        <h1 className='font-bold'>waiting for player to join</h1>
                        <h1 className="mt-2">{room?.status}</h1>
                    </div>
                    <div className='w-full flex items-center bg-white/90 text-gray-700 items-center h-[50px] border-[1px] mt-8 rounded-full'>
                        <div className='w-full  flex items-center justify-between px-2'>
                            <h1 className='ml-4 w-[300px] overflow-hidden h-[18px] text-[10px] uppercase'>http://localhost:5173/dashboard/game/waiting/?room={room?.name}</h1>
                            <button onClick={() => {
                                setInvite(prev => !prev)
                            }} style={{background : color}} className='border-white/80 text-white border-[1px] p-1 rounded-full text-[12px] h-[35px] w-[60px] uppercase'>{invite ? "invited" : "invite"}</button>
                        </div>
                    </div>
                    {
                        invite &&
                        <div className='bg-white p-2 w-full h-fit min-h-[100px] border-[1px] shadow-sm text-gray-700 mt-2 rounded-sm flex'>
                        {
                            friends.map(item => {
                                const friend = get_user(item)
                                return <div onClick={() => inviteHandler(friend)} key={friend?.id} className='mx-2  cursor-pointer border-gray-700/40 rounded-sm w-[65px] h-[80px] p-2'>
                                    <div className='w-full flex justify-center'>
                                        <img src={friend?.profile?.image} className='w-[40px] rounded-sm border-white border-[1px]' alt="" />
                                    </div>
                                    <h1 className='text-[12px] text-center mt-2'>{friend?.username}</h1>
                                </div>
                            })
                        }
                        </div>
                    }
					<ul className='w-full flex mt-20 p-2 justify-evenly items-center h-fit'>
						{
							room?.players?.map(item => {
									return (
										<div key={item.id} className="flex items-center justify-center">
											<div className="w-[120px] h-[150px] p-4 border-[1px] rounded-md flex items-center justify-center">
												<div className='text-center'>
													<img src={item?.user?.profile?.image} className='bg-white rounded-full w-[60px]' alt="" />
													<h1 className='uppercase mt-4'>{item?.user?.username}</h1>
													<h1 className='uppercase mt-2 text-[12px]'>player 1</h1>
												</div>
											</div>
										</div>
									)
							})
						}
					</ul>
                    <button onClick={() => {
                        Socket.sendMessage({"event" : "start_game" , "room":room})
                    }} disabled={room?.status != 'ready'} style={{background:color}} className="h-[40px] ml-[50%] translate-x-[-50%] flex items-center justify-center rounded-full w-1/3 mt-20 uppercase">
                        <h1>play</h1>
                        <FontAwesomeIcon className='ml-2 text-[20px]' icon={faGamepad} />
                    </button>
                </div>
            </div>
		</div>
	)
}


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