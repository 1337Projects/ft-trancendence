import React, { useContext, useEffect, useState } from "react"
// import HeroImg from "../assets/HeroImg1"
import FriendImg from '../assets/FriendImg'
import AiImg from "../assets/AiImg"
import TornmentImg from "../assets/TornmentImg"
import { json, Link } from "react-router-dom"
import { FaArrowRightLong, FaGamepad, FaInbox } from "react-icons/fa6"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { UserContext } from '../../Contexts/authContext'
import MyUseEffect from '../../hooks/MyUseEffect'
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { GiSandsOfTime } from "react-icons/gi";
import HeroImg from "./HeroImg"


function CatButton({icon, text, categorie, handler}) {
    const {color, theme} = useContext(ApearanceContext) || {}
    const t = categorie === text ? color : ""
    return (
        <button style={{color:t, borderColor : t}} className={`border-[.1px] ${theme == 'light' ? "border-black" : "border-white"} h-fit flex justify-between items-center font-bold capitalize rounded text-[8pt] p-2 mr-3 min-w-10`} onClick={()=> handler(text)}>
            <p className="mr-2">{text}</p>
            <div className="text-[12pt]">
                {icon}
            </div>
        </button>
    )
}

export function Categories({categorie, Handler}) {
    
    return (
        <div className="w-full h-[30px] flex">
            <CatButton text="latest" icon={<MdOutlineTipsAndUpdates />} categorie={categorie} handler={Handler} />
            <CatButton text="ongoing" icon={<GiSandsOfTime />} categorie={categorie}  handler={Handler} />
            <CatButton text="ended" icon={<IoIosMailUnread />} categorie={categorie}  handler={Handler} />
        </div>
    )
}

export function Hero({color, img}) {
    
    return (
        <div className="h-2/3 sm:h-1/2 max-h-[400px] sm:max-h-[400px]">
            <div className="flex items-center justify-center h-full w-full rounded-sm p-1">
                <div className="place-items-center flex items-center justify-center w-full">
                    <div className="centent w-[50%] h-full leading-snug px-8 flex justify-between items-center">
                        <div className="">
                            <p style={{color : color}} >Play Ping Pong</p>
                            <h3 className="text-[2rem] mt-2 font-kav max-w-[270px] font-bold capitalize">its time to play ping pong</h3>
                            <p className="text-[8px] max-w-[260px] leading-4 mt-4">welcome to pong comunity, go play with your friends, and leet them see your amazing skills enjoy.</p>
                            <Link to="waiting">
                                <button style={{backgroundColor : color}} className={`flex text-[10pt] justify-between h-[40px] w-[130px] items-center p-2 px-4 text-white rounded-full mt-10`}>
                                    <p className="mr-2 capitalize">Play now</p>
                                    <FaGamepad className="text-[16pt]" />
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative img overflow-y-visible w-[50%] h-[350px] p-2 sm:mr-4 flex justify-center items-center">
                        <img className="absolute" src="/game/Tennis-bro.svg" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function Card({color, img, text}) {

    const { theme } = useContext(ApearanceContext) || {}

    return (
        <div className={`w-full mx-auto border-[1px] ${theme == 'light' ? "border-black/10" : "border-white/10"} rounded`}>
            <div className="h-[160px] w-full">
                <div className="w-full h-full overflow-hidden rounded-t flex justify-center" >
                    <img src={img} className="w-full h-full" alt="" />
                </div>
            </div>
            <div className="p-4">
                <h1 className="text-md capitalize font-semibold tracking-wide">{text}</h1>
                <p className="mt-2 text-xs font-thin leading-5">Lorem ipsum dolor, sit amet elit. Placeat, autem minus deleniti ad</p>
                <button style={{background : color}} className="px-6 text-white h-[34px] rounded mt-4 flex items-center justify-center" >
                    <h1 className="text-[12px] lowercase mr-2">play now</h1>
                    <FaArrowRightLong className="text-[10pt]" />
                </button>
            </div>
        </div>
    )
}

import { RiGamepadLine } from "react-icons/ri";
import { DialogContext } from "../../Contexts/DialogContext"
import { TrItem } from "./Events"
import { IoIosMailUnread } from "react-icons/io"



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
            <div className="mt-10 flex justify-end">
                <button 
                    style={{background : appearence?.color}} 
                    className="p-2 px-4 capitalize rounded-full text-white flex items-center"
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
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card color={color} img="/game/leo-vs-random.jpg" text="random match"/>
                <Card color={color} img="/game/leo-vs-computer.jpg" text="vs Computer"/>
                <Card color={color} img="/game/leo-vs-friend.jpg" text="vs friend"/>
            </div>
        </div>
    )
}


export default function Game() {
    const appearence = useContext(ApearanceContext)
    const [tournments, setTournments] = useState([])
    const { open } = useContext(DialogContext) || {}

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
    }, [open])

    return (
        <>
            <div className={`${appearence?.theme == 'light' ? "bg-lightItems text-lightText " : "bg-darkItems text-darkText"} mt-2 w-full h-[calc(100vh-180px)]  sm:h-[100vh] overflow-scroll p-2`}>
                <div className="mx-auto max-w-[800px] h-full">
                    <Hero color={appearence?.color} img="/Tennis-bro.svg" />
                    <Cards color={appearence?.color} />
                    
                    <div className="px-10 mt-16">
                        <h1 className="text-xl font-bold">Avialable Tournments :</h1>
                        <div className="w-full h-[50px] flex items-center mt-6">
                            <Categories categorie="latest" Handler={null} />
                        </div>
                        <div  className="w-full mt-6 h-fit overflow-y-scroll">
                            {
                                tournments.length ?
                                tournments.map((item, index) => 
                                    <div className="h-[270px]" key={index}>
                                        <TrItem data={item} />
                                    </div> )
                                :
                                <div className="w-full h-[200px] rounded border-[1px] border-white/20 text-sm flex justify-center items-center">
                                    <p>not tournaments yet, create one</p>
                                    <span style={{color : appearence?.color}} className="ml-2 font-bold text-md cursor-pointer">Create !</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}


function TournmentDialog() {
    const { color, theme } = useContext(ApearanceContext) || {}
    const { setOpen } = useContext(DialogContext) || {}
    const [data, setData] = useState({members : 4, name : ''})
    const [created, setCreated] = useState<null | number>(null)


    async function createHandler() {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/tournment/create/`, {
            method : 'POST',
            headers : { 
                'Content-Type' : 'application/json'
            },
            credentials : 'include',
            body : JSON.stringify(data)
        })

        if (!response.ok) {
            console.log(await response.json())
            return ;
        }

        const { id } = await response.json()
        setCreated(id)
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
                                    <label className="w-full block" htmlFor="name">name</label>
                                    <input 
                                        className={`rounded px-6 bg-transparent ${theme == 'light' ? "border-black/20" : "border-white/20"} h-[40px] border-[.3px] w-full mt-2`}
                                        type="text"
                                        id="name" 
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData({...data, name : e.target.value})}
                                        placeholder="tournament name..."
                                    />
                                </div>
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
                    </div>
                }
            </div>
        </div>
    )
}