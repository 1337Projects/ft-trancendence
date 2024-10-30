import React, { useContext, useState } from "react"
import HeroImg from "../assets/HeroImg1"
import FriendImg from '../assets/FriendImg'
import AiImg from "../assets/AiImg"
import TornmentImg from "../assets/TornmentImg"
import { Link } from "react-router-dom"
import { FaGamepad } from "react-icons/fa6"
import { ApearanceContext } from "../../Contexts/ThemeContext"


function Hero({color}) {
    
    return (
        <div className="h-2/3 sm:h-1/2 max-h-[400px] sm:max-h-[400px]">
            <div className="flex items-center justify-center h-full w-full rounded-sm p-1">
                <div className="place-items-center flex items-center justify-center w-full">
                    <div className="centent w-[50%] h-full leading-snug pl-7 flex justify-between items-center">
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
                        <img className="absolute" src="/herrrro.svg" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function Card({color, img, text}) {
    return (
        <div className="w-fit">
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
import { RiGamepadFill } from "react-icons/ri";


function Cards({color}) {
    const appearence = useContext(ApearanceContext)
    const { open, setOpen } = useContext(DialogContext) || {}

    function createHandler() {
        setOpen!(false)
    }

    return (
        <div className={`pl-7 ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"}`}>
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
                    <div className="bg-white rounded-md border-black/10 p-6 border-[.3px] w-[400px] sm:w-[600px] h-fit z-40 left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] absolute">
                        <div className="h-fit flex">
                            <div className="w-[200px] flex  justify-center">
                                <div className="rounded-full w-[80px] h-[80px] flex items-start justify-center text-[50pt]">
                                    <RiGamepadFill />
                                </div>
                            </div>
                            <div className="">
                                <h1 className="font-bold text-lg capitalize">create tournment</h1>
                                <h1 className="text-sm mt-4">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</h1>
                                <div className="mt-4">
                                    <label className="w-full block" htmlFor="members">members</label>
                                    <input 
                                        step="4"
                                        className="rounded px-6 h-[40px] border-[.3px] border-black/20 w-full mt-2" 
                                        type="number"
                                        id="members" 
                                        name="members"
                                        defaultValue="4"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="h-[40px] mt-6  rounded-b-md flex justify-end items-center">
                            <button 
    
                                className="px-4 mr-2 h-[40px] rounded text-sm border-[.3px] border-black/20"
                                onClick={() => setOpen(false)}
                            >cancel</button>
                            <button 
                                style={{background: appearence?.color}}
                                className="px-4 h-[40px] rounded text-sm text-white"
                                onClick={createHandler}
                            >create</button>
                        </div>
                    </div>
                }
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4">
                <Card color={color} img="/game1.svg" text="play random match"/>
                <Card color={color} img="/game1.svg" text="play vs Computer"/>
                <Card color={color} img="/game1.svg" text="play with friend"/>
            </div>
        </div>
    )
}


export default function Game() {
    const appearence = useContext(ApearanceContext)
    return (
        <>
            <div className={`${appearence?.theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} mt-2 w-full h-[100vh] overflow-scroll p-2`}>
                <div className="mx-auto max-w-[800px] h-full">
                    <Hero color={appearence?.color} />
                    <Cards color={appearence?.color} />
                    
                    <div className="mt-16 mx-10">
                        <div className="rounded border-[1px] border-black/10  h-[100px] flex justify-center items-center">
                            <h1 className="text-sm">no tournments yet, create a new one !</h1>
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}