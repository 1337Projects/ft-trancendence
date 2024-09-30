import React, { useContext } from "react"
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
                    <div className="img overflow-y-visible w-[50%] h-[350px] p-2 sm:mr-4 flex justify-center items-center">
                        <img src="/herro.svg" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function Card({color, img, text}) {
    return (
        <div className="w-full flex items-center mt-16">
            <div className="h-[180px] w-[180px] p-2">
                <img className="w-full h-full" src={img} alt="" />
            </div>
            <div className="ml-4 w-1/2" >
                <h1 className="text-[14pt] uppercase font-kav">{text}</h1>
                <p className="mt-2 text-[8pt]">Lorem ipsum dolor, sit amet elit. Placeat, autem minus deleniti ad quia cupiditate illum reprehenderit. Ipsum, voluptate tempore.</p>
                <button style={{background:color}} className=" px-3 h-[36px] text-white rounded-full w-[100px] mt-4 flex items-center justify-center" >
                    <h1 className="text-[14px] capitalize mr-2">play</h1>
                    <FaGamepad className="text-[16pt]" />
                </button>
            </div>
        </div>
    )
}


function Cards({color}) {
    const appearence = useContext(ApearanceContext)
    return (
        <div className={`pl-7 ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"}`}>
            <div className={`items-center flex justify-between`}>
                <div>
                    <h1 className="text-secondary capitalize ">game modes:</h1>
                    <p className="text-small max-w-[400px] mt-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur rem quia inventore officiis, odio rerum sapiente asperiores earum nobis labore architecto nam qui quae. repudiandae voluptas consequuntur pariatur</p>
                </div>
            </div>
            <div className="mt-20">
                <Card color={color} img="/game1.svg" text="play random match"/>
                <Card color={color} img="/game4.svg" text="play vs Computer"/>
                <Card color={color} img="/game5.svg" text="play with friend"/>
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
                </div>
            </div> 
        </>
    )
}