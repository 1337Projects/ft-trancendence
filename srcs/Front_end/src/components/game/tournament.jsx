
import React, { useContext, useEffect, useState } from 'react';
import { ColorContext, ThemeContext } from '../../Contexts/ThemeContext';
import Socket from '../../socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { authContext, friendsContext, userContext } from '../../Contexts/authContext';
import { useNavigate } from 'react-router-dom';
import {notsSocket} from '../../socket'

const myroom = {
    "id": 119,
    "status": "ready",
    "name": "7bfa33c193c665fc95d83f7f",
    "players": [
        {
            "id": 1,
            "user": {
                "id": 1,
                "username": "aamhamdi",
                "email": "aamhamdi@student.1337.ma",
                "first_name": "Abdelhadi",
                "last_name": "Amhamdi",
                "profile": {
                    "image": "https://cdn.intra.42.fr/users/a60d6e59c8e25f00d89f55621023e181/aamhamdi.jpg",
                    "bio": "rank number #1 in ping pong\naamhamdi.com",
                    "level": 0.7,
                    "rank": 1,
                    "notification_channel_name": "specific..inmemory!ANHddxJcPPML"
                }
            },
            "channel_name": "specific..inmemory!zDMwQcRNKKNd"
        },
        {
            "id": 2,
            "user": {
                "id": 3,
                "username": "tahaexo",
                "email": "taha@email.com",
                "first_name": "taha",
                "last_name": "exo",
                "profile": {
                    "image": "http://localhost:8000/static/you.png",
                    "bio": "rank number #1 in ping pong\ntahaexo.com",
                    "level": 0.7,
                    "rank": 3,
                    "notification_channel_name": "specific..inmemory!uofVYIDPFDhx"
                }
            },
            "channel_name": "specific..inmemory!aJBlpEuVCZHg"
        },
        {
            "id": 3,
            "user": {
                "id": 2,
                "username": "testuser",
                "email": "testuser@example.com",
                "first_name": "testuser",
                "last_name": "testuser",
                "profile": {
                    "image": "http://localhost:8000/static/you.png",
                    "bio": "",
                    "level": 0.7,
                    "rank": 2,
                    "notification_channel_name": "specific..inmemory!WtgXHfPtULmM"
                }
            },
            "channel_name": "specific..inmemory!rbUgMExkAOpi"
        },
        {
            "id": 4,
            "user": {
                "id": 4,
                "username": "admin",
                "email": "admin@example.com",
                "first_name": "admin",
                "last_name": "admin",
                "profile": {
                    "image": "http://localhost:8000/static/you.png",
                    "bio": "",
                    "level": 0.7,
                    "rank": 4,
                    "notification_channel_name": "specific..inmemory!TEpssiDAJLVX"
                }
            },
            "channel_name": "specific..inmemory!ZvOicnnFGkBq"
        }
    ],
    "max_members": 4
}

export function TournmentWaiting() {
	const theme = useContext(ThemeContext)
	const color = useContext(ColorContext)
	const [invite, setInvite] = useState(false)
	const [room, setRoom] = useState(null)
	const friends = useContext(friendsContext)
	const user = useContext(userContext)
	const navigate = useNavigate()
	useEffect(() => {
		const timer = setTimeout(() => {
			Socket.connect("ws://localhost:8000/ws/game/tournment/4/any/")
			Socket.addCallback("setRoom", setRoom)
			Socket.addCallback("startGame", startHandler)
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

	function startHandler() {
		navigate("../game/tournment")
	}

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
							room?.players?.map((item, index) => {
									return (
										<div key={item.id} className="flex items-center justify-center">
											<div className="w-[120px] h-[150px] p-4 border-[1px] rounded-md flex items-center justify-center">
												<div className='text-center'>
													<img src={item?.user?.profile?.image} className='bg-white rounded-full w-[60px]' alt="" />
													<h1 className='uppercase mt-4'>{item?.user?.username}</h1>
													<h1 className='uppercase mt-2 text-[12px]'>player {index + 1}</h1>
												</div>
											</div>
										</div>
									)
							})
						}
					</ul>
                    <button onClick={() => {
                        Socket.sendMessage({"event" : "start_tournment" , "room":room})
                    }} disabled={room?.status != 'ready'} style={{background:color}} className="h-[40px] ml-[50%] translate-x-[-50%] flex items-center justify-center rounded-full w-1/3 mt-20 uppercase">
                        <h1>play</h1>
                        <FontAwesomeIcon className='ml-2 text-[20px]' icon={faGamepad} />
                    </button>
                </div>
            </div>
		</div>
	)
}

function Tt({ room }) {
	const theme = useContext(ThemeContext)
	const chartColor = theme == 'dark' ?  "#ffffff" : "#000000"
	return (
		<svg width="90%" height="400" viewBox="0 0 620 321" fill="none">
			<g clipPath="url(#clip0_134_255)">

				{/* winner player */}
				<rect x="-0.5" y="0.5" width="123" height="124" rx="9.5" transform="matrix(-1 0 0 1 369 101)" stroke={chartColor}/>

				{/* right lines */}
				<g>
					<line x1="548" y1="300.976" x2="448" y2="300.976" stroke={chartColor}/>
					<line x1="448.647" y1="301" x2="448.647" y2="201" stroke={chartColor}/>
					<line y1="-0.5" x2="100" y2="-0.5" transform="matrix(-1 0 0 1 548 30.5239)" stroke={chartColor}/>
					<line x1="130.5" y1="140.0239" x2="180" y2="140.0239" transform="matrix(-1 0 0 1 548 30.5239)" stroke={chartColor}/>
					<line y1="-0.5" x2="100" y2="-0.5" transform="matrix(-3.43279e-10 1 1 1.29538e-09 449.147 30)" stroke={chartColor}/>
				</g>

				{/* left lines */}
				<g>
					<line y1="-0.5" x2="100" y2="-0.5" transform="matrix(1 0 0 -1 72 300.476)" stroke={chartColor}/>
					<line y1="-0.5" x2="100" y2="-0.5" transform="matrix(3.43279e-10 -1 -1 -1.29538e-09 170.853 301)" stroke={chartColor}/>
					<line x1="72" y1="30.0239" x2="172" y2="30.0239" stroke={chartColor}/>
					<line x1="202" y1="170.0239" x2="245" y2="170.0239" stroke={chartColor}/>
					<line x1="171.353" y1="30" x2="171.353" y2="130" stroke={chartColor}/>
				</g>

				{/* left players */}
				<g>
					<rect x="0.5" y="0.5" width="70.7772" height="70.9067" rx="9.5" stroke={chartColor}/>
					<rect x="0.5" y="248.839" width="70.7772" height="70.9067" rx="9.5" stroke={chartColor}/>
					<rect x="132.5" y="130.5" width="70.7772" height="70.9067" rx="9.5" stroke={chartColor}/>
					<image clipPath="inset(0% round 10px)" href={room?.players[0]?.user?.profile?.image} height="70.9067"  width="70.7772" x="0.5" y="0.5"/>
					<text x="0.5" y="100.5" fill={chartColor}>{room?.players[0]?.user?.username}</text>
					<image clipPath="inset(0% round 10px)" href={room?.players[1]?.user?.profile?.image} height="70.9067" width="70.9067" x="0.5" y="248.839"/>
					<text x="0.5" y="230.5" fill={chartColor}>{room?.players[1]?.user?.username}</text>
				</g>

				{/* right players */}
				<g>
					<rect x="-0.5" y="0.5" width="70.9067" height="70.9067" rx="9.5" transform="matrix(-1 0 0 1 619.015 0)" stroke={chartColor}/>
					<rect x="-0.5" y="0.5" width="70.9067" height="70.9067" rx="9.5" transform="matrix(-1 0 0 1 618.903 248.382)" stroke={chartColor}/>
					<rect x="-0.5" y="0.5" width="70.9067" height="70.9067" rx="9.5" transform="matrix(-1 0 0 1 486.907 130)" stroke={chartColor}/>
					<image clipPath="inset(0% round 10px)" href={room?.players[2]?.user?.profile?.image} height="70.9067" transform="matrix(-1 0 0 1 619.015 0)" width="70.9067" x="-0.5" y="0.5"/>
					<text x="-67.5" y="100.5" fill={chartColor} transform="translate(618.903 0) scale(1, 1)">{room?.players[2]?.user?.username}</text>
					<image clipPath="inset(0% round 10px)" href={room?.players[3]?.user?.profile?.image} x="-0.5" y="0.5" transform="matrix(-1 0 0 1 618.903 248.382)" width="70.9067" height="70.9067"/>
					<text x="-60.5" y="-15" transform="translate(618.903 248.382) scale(1, 1)" width="70.9067" height="70.9067" fill={chartColor} >{room?.players[3]?.user?.username}</text>
				</g>
			
			</g>
			<defs>
				<clipPath id="clip0_134_255">
					<rect width="620" height="321" fill="white"/>
				</clipPath>
			</defs>
		</svg>
	)
}


export default function Tournament() {
	const theme = useContext(ThemeContext);
	const [room, setRoom] = useState(null)
	const [invite, setInvite] = useState(null)
	const color = useContext(ColorContext)
	const friends = useContext(friendsContext)
	const user = useContext(authContext)
	const navigate = useNavigate()

	useEffect(() => {
		const timer = setTimeout(() => {
			// console.log("connecting again")
			Socket.connect("ws://localhost:8000/ws/game/tournment/4/any/")
			Socket.addCallback("setRoom", setRoom)
			Socket.addCallback("startGame", startGameHandler)
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
			if (room.matches.length) {
				Socket.sendMessage({"event" : "start_game" , "room":room})
			}
		}, 300)
		return () => clearTimeout(timer)
	}, [room])

	function inviteHandler(user) {
        setInvite(false)
        notsSocket.sendMessage({"event": "game invite", "user" : user, "room" : `http://localhost:5173/dashboard/game/tournment/?room=${room?.room?.name}`})
    }

	function startGameHandler() {
        navigate("../game/room/1")
    }


	return (
		<div className={`p-2 mt-2 flex-col h-[100vh] flex items-center ${theme == 'light' ? " bg-lightItems" : " bg-darkItems"}`}>
			<div className={`text-center  uppercase mt-4 ${theme == 'light' ? "text-lightText" : "text-darkText"}`}>
				<h1 className='font-bold'>waiting for player to join</h1>
				<h1 className="mt-2">{room?.room?.status}</h1>
            </div>
			<div className='w-2/3 flex items-center bg-white text-gray-700 items-center h-[50px] border-[1px] mt-8 rounded-full'>
				<div className='w-full flex items-center justify-between px-2'>
					<h1 className='ml-4 w-[80%] overflow-hidden h-[18px] text-[10px]'>http://localhost:5173/dashboard/game/waiting/?room={room?.room?.name}</h1>
					<button onClick={() => {
						setInvite(prev => !prev)
					}} style={{background : color}} className='border-white/80 text-white border-[1px] p-1 rounded-full text-[12px] h-[35px] w-[60px] uppercase'>{invite ? "invited" : "invite"}</button>
				</div>
			</div>
			<div className='w-2/3 mt-2'>
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
			</div>
			<div className=' max-w-[550px] flex justify-center p-2 border-[0px] m-4 rounded-xl' >
				{/* array will be passed as an argument to  */}
				<Tt room={room?.room} />
			</div>
			<ul className='w-full px-10 py-2'>
				{
					room?.matches?.map((m, index) => {
						return (
							<li key={index} className='bg-white/30 ml-[50%] translate-x-[-50%] max-w-[450px] mt-4 w-full h-[70px] rounded-xl flex items-center justify-evenly'>
								<div className='flex items-center'>
									<img src={m.player1?.user?.profile?.image} className='w-[40px] rounded-full bg-white' alt="" />
									<div className='ml-4'>
										<h1>{m.player1.user.username}</h1>
										<p className='text-[10px]'>{m.player1.user.first_name} {m.player1.user.last_name}</p>
									</div>
								</div>
								<div>vs</div>
								<div className='flex items-center'>
									<div className='mr-4'>
										<h1>{m.player2.user.username}</h1>
										<p className='text-[10px] right'>{m.player2.user.first_name} {m.player2.user.last_name}</p>
									</div>
									<img src={m.player2?.user?.profile?.image} className='w-[40px] rounded-full bg-white' alt="" />
								</div>
							</li>
						)
					})
				}
			</ul>
		</div>
	)
}