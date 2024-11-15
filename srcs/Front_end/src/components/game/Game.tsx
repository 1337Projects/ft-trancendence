import React, { useContext, useEffect, useState } from "react"
import HeroImg from "../assets/HeroImg1"
import FriendImg from '../assets/FriendImg'
import AiImg from "../assets/AiImg"
import TornmentImg from "../assets/TornmentImg"
import { json, Link } from "react-router-dom"
import { FaGamepad } from "react-icons/fa6"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { UserContext } from '../../Contexts/authContext'
import MyUseEffect from '../../hooks/MyUseEffect'

export function Hero({color, img}) {
    
    return (
        <div className="h-2/3 sm:h-1/2 max-h-[400px] sm:max-h-[400px]">
            <div className="flex items-center justify-center h-full w-full rounded-sm p-1">
                <div className="place-items-center flex items-center justify-center w-full">
                    <div className="centent w-[50%] h-full leading-snug px-8 flex justify-between items-center">
                        <div className="">
                            <p style={{color : color}} >Play Ping Pong</p>
                            <h3 className="text-[2rem] mt-2 font-kav max-w-[270px] font-bold capitalize">its time to play ping pong</h3>
                            <p className="text-[8px] max-w-[260px] leading-4 mt-4">welcome to pong comunity, go play with your friends, and leet them see your amazing skills , enjoy ; )</p>
                            <Link to="waiting">
                                <button style={{backgroundColor : color}} className={`flex text-[10pt] justify-between h-[40px] w-[130px] items-center p-2 px-4 text-white rounded-3xl mt-10`}>
                                    <p className="mr-2 capitalize">Play now</p>
                                    <FaGamepad className="text-[16pt]" />
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative img overflow-y-visible w-[50%] h-[350px] p-2 sm:mr-4 flex justify-center items-center">
                        {/* <img src="/Ellipse.svg" className="absolute  w-[400px]" alt="" /> */}
                        <img className="absolute" src={`${img != null ? img : "/herrrro.svg"}`} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function Card({color, img, text}) {
    return (
        <div className="w-full mx-auto">
            <div className="h-[180px] w-full p-2">
                <div className="w-full h-full bg-gray-200 rounded" ></div>
            </div>
            <div className="mt-2 text-center" >
                <h1 className="text-lg font-medium uppercase ">{text}</h1>
                <p className="mt-2 text-xs font-thin">Lorem ipsum dolor, sit amet elit. Placeat, autem minus deleniti ad</p>
                <button style={{background:color}} className=" px-3 h-[36px] ml-[50%] translate-x-[-50%] text-white rounded-full w-[100px] mt-4 flex items-center justify-center" >
                    <h1 className="text-[14px] capitalize mr-2">play</h1>
                    <FaGamepad className="text-[16pt]" />
                </button>
            </div>
        </div>
    )
}

import { RiGamepadLine } from "react-icons/ri";
import { DialogContext } from "../../Contexts/DialogContext"
// import { MdGamepad } from "react-icons/md";



function Cards({color}) {
    const appearence = useContext(ApearanceContext)
    const { open, setOpen } = useContext(DialogContext) || {}

    return (
        <div className={`px-8 ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"}`}>
            <div className={`items-center flex justify-between`}>
                <div>
                    <h1 className="text-secondary capitalize ">game modes:</h1>
                    <p className="text-small max-w-[400px] mt-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur rem quia inventore officiis, odio rerum sapiente asperiores earum nobis labore architecto nam qui quae. repudiandae voluptas consequuntur pariatur</p>
                </div>
            </div>
            <div className="mt-10 flex justify-end px-10">
                <button 
                    style={{background : appearence?.color}} 
                    className="p-3 px-4 capitalize rounded-full text-white flex items-center"
                    onClick={() => setOpen!(true)}
                >
                    <span className="mr-2 text-sm">create tournment</span>
                    <RiGamepadLine className="text-[18pt]" />
                </button>
                {
                    open &&
                    <TournmentDialog  />
                }
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <Card color={color} img="/game1.svg" text="play random match"/>
                <Card color={color} img="/game1.svg" text="play vs Computer"/>
                <Card color={color} img="/game1.svg" text="play with friend"/>
            </div>
        </div>
    )
}


export default function Game() {
    const appearence = useContext(ApearanceContext)
    const [tournments, setTournments] = useState([])

    MyUseEffect(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}api/tournment/get_all/`, {
                method : 'GET',
                credentials : 'include'
            })

            if (!response.ok) {
                const { error } = await response.json()
                throw  new Error(error)
            }

            const { data } = await response.json()
            setTournments(data)
        } catch(err) {
            console.log(err)
        }
    }, [])

    return (
        <>
            <div className={`${appearence?.theme == 'light' ? "bg-lightItems text-lightText " : "bg-darkItems text-darkText"} mt-2 w-full h-[100vh] overflow-scroll p-2`}>
                <div className="mx-auto max-w-[800px] h-full">
                    <Hero color={appearence?.color} />
                    <Cards color={appearence?.color} />
                    
                    <div className="mt-16 w-full h-[600px] px-8">
                        <h1 className="my-4 capitalize">played tournments :</h1>
                        {
                            tournments.length ?
                            <div className="h-fit min-h-[200px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3  gap-4">
                                {
                                    tournments.map(t => {
                                        return (
                                            <div key={t.id} className="w-full">
                                                <div className="w-full h-[180px] relative rounded overflow-hidden">
                                                    <img className="" src="/tour.webp" alt="img" />
                                                    <div 
                                                        style={{background : appearence?.color}} 
                                                        className="absolute top-1 left-1 px-4 text-xs py-2 text-white rounded"
                                                    >{t.mode}</div>

                                                    <div className="absolute bottom-0 w-full bg-blackG p-2 h-[100px]">
                                                        <Link to={`tournment/waiting/${t.id}`} className="text-white border-[1px] cursor-pointer uppercase border-white/40 px-4 py-1 right-2 rounded absolute bottom-2 text-xs">join</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            :
                            <div className={`rounded border-[1px] ${appearence?.theme == 'light' ? "border-black/10" : "border-white/10"}  h-[100px] flex justify-center items-center`}>
                                <h1 className="text-sm">no tournments yet, create a new one !</h1>
                            </div>
                        }
                    </div>
                </div>
            </div> 
        </>
    )
}


function TournmentDialog() {
    const { color, theme } = useContext(ApearanceContext) || {}
    const { setOpen } = useContext(DialogContext) || {}
    const { user } = useContext(UserContext) || {}
    const [data, setData] = useState({members : 4, mode : 'local'})
    const [players, setPlayers] = useState({}) 
    const [created, setCreated] = useState<null | number>(null)

    async function createHandler() {
        const tournment_players = []
        Object.entries(players).forEach(([key, value]) => {
            tournment_players.push(value)
        })
    
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/tournment/create/`, {
            method : 'POST',
            headers : { 
                'Content-Type' : 'application/json'
            },
            credentials : 'include',
            body : JSON.stringify({...data, players : tournment_players, user : user?.username})
        })

        if (!response.ok) {
            console.log(await response.json())
            return ;
        }

        const { id } = await response.json()
        setCreated(id)
    }

    function randomize() {
        const players = {}
        
        for (let i = 0; i < data.members; i++) {
            let r = (Math.random() + 1).toString(36).substring(2);
            players[`player${i}`] = r
        }
        setPlayers(players)
    }

    return (
        <div className={`${theme == 'light' ? "bg-white border-black/10" : "bg-darkItems border-white/20"}  rounded-md  p-6 border-[.3px] w-[400px] sm:w-[600px] h-fit z-40 left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] absolute`}>
            <div className="h-fit">
                <div className="">
                    <h1 className="font-bold text-lg capitalize">create tournment</h1>
                    {
                        created 
                        ?
                        <div>
                            <h1>your tournment has been created successfullty</h1>
                        </div> 
                        : 
                        <div>
                            <h1 className="text-sm mt-4">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</h1>
                                <div className="mt-4">
                                    <label className="w-full block" htmlFor="members">members</label>
                                    <input 
                                        step="4"
                                        className={`rounded px-6 bg-transparent ${theme == 'light' ? "border-black/20" : "border-white/20"} h-[40px] border-[.3px] w-full mt-2`}
                                        type="number"
                                        id="members" 
                                        name="members"
                                        value={data.members}
                                        onChange={(e) => setData({...data, members : parseInt(e.target.value)})}
                                        max="16"
                                        min="4"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="w-full block" htmlFor="mode">mode ( local / remote )</label>
                                    <select 
                                        value={data.mode}
                                        className={`w-full block h-[40px] mt-2 px-4 border-[.3px] bg-transparent ${theme == 'light' ? "border-black/20" : "border-white/20"} rounded`}
                                        name="mode" 
                                        id="mode"
                                        onChange={(e) =>  setData({...data, mode : e.target.value})}
                                    >
                                        <option value="remote">remote</option>
                                        <option value="local">local</option>
                                    </select>
                                </div>
                                {
                                    data.mode === 'local' && 
                                    <div className="mt-2">
                                        <button 
                                            onClick={randomize}
                                            className="my-4 p-2 text-sm px-4 rounded text-white ml-[100%] translate-x-[-100%]"
                                            style={{background : color}}
                                        >randomize</button>     
                                        <div className={`border-[.3px] ${theme == 'light' ? "border-black/20" : "border-white/20"}  rounded w-full h-fit max-h-[400px] overflow-auto p-6 grid gap-4`}>
                                            {
                                                [...Array(data.members)].map((player, index) => {
                                
                                                    return (
                                                    <div key={index} className="text-sm">
                                                        <label htmlFor={`player${index}`} className="">{`player${index + 1}`}</label>
                                                        <input 
                                                            type="text" 
                                                            className={`border-[.3px] bg-transparent ${theme == 'light' ? "border-black/20" : "border-white/20"} rounded h-[40px] px-2 mt-2 w-full`}
                                                            placeholder="player name..."
                                                            value={players[`player${index}`]}
                                                            id={`player${index}`}
                                                            onChange={(e) => setPlayers({...players , [`player${index}`] : e.target.value})}
                                                        />
                                                    </div>)
                                                })

                                            }
                                        </div>
                                    </div>
                                }
                        </div>
                    }
                    
                </div>
            </div>
            <div className="h-[40px] mt-6  rounded-b-md flex justify-end items-center">
                {
                    !created ? 
                    <div>
                        <button 
        
                            className={`px-4 mr-2 h-[40px] rounded text-sm border-[.3px] ${theme == 'light' ? "border-black/20" : "border-white/20"}`}
                            onClick={() => setOpen!(false)}
                        >cancel</button>
                        <button 
                            onClick={createHandler}
                            style={{background: color}}
                            className="px-4 h-[40px] rounded text-sm text-white"
                        >create</button>
                    </div>
                    :
                    <div>
                        <button 
                            onClick={() => setOpen!(false)}
                            className={`px-4 h-[40px] border-[1px] mr-4 ${theme == 'light' ? "border-black/20" : "border-white/20"} rounded text-sm`}
                        >
                            close
                        </button>   
                        <button 
                            onClick={() => setOpen!(false)}
                            style={{background: color}}
                            className="px-4 h-[40px] rounded text-sm text-white"
                        >
                            <Link to={data.mode == 'local' ? `tournment/${created}/local` : `tournment/waiting/${created}/`}>
                                luanch tournment
                            </Link>
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}