
import React, { useContext, useEffect, useState } from 'react';
import Socket from '../../socket';
import { useNavigate } from 'react-router-dom';
import {notsSocket} from '../../socket'


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


export default function Tournament() {

	const [room, setRoom] = useState(null)
	const [invite, setInvite] = useState(null)
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