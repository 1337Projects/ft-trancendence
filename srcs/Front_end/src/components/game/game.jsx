import { faClone, faClose, faGamepad, faTableTennisPaddleBall } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useState } from "react"
import {ColorContext, ThemeContext} from '../../Contexts/ThemeContext'
import HeroImg from "../assets/HeroImg1"
import FriendImg from '../assets/FriendImg'
import AiImg from "../assets/AiImg"
import TornmentImg from "../assets/TornmentImg"
import { Link } from "react-router-dom"




function Player() {
    
    const color = useContext(ColorContext)
    return (
        <div>
            <div className="flex justify-center items-center">
                <div style={{background:color}} className="w-12 text-white h-12 rounded-sm p-1 text-[20px] flex justify-center items-center">
                    <FontAwesomeIcon icon={faTableTennisPaddleBall} />
                </div>
            </div>
            <p className="text-[10px] font-bold uppercase mt-2 text-center">Player 1</p>
            <p className="text-[8px] text-center">waiting...</p>
        </div>
    )
}

function WaitingRoom({handler}) {
    const theme = useContext(ThemeContext)
    const color = useContext(ColorContext)
    return (
            <div className={`${theme == 'light' ? "bg-lightItems/30 text-lightText border-black/20" : "bg-darkItems/30 text-darkText border-white/20"} border-[.3px] shadow-sm  backdrop-blur-md p-2 rounded-sm fixed w-[50vw] h-[30vw] top-[50%] left-[40%] translate-x-[-54%] translate-y-[-50%]`}>
                <div className="header text-[15px] text-right flex justify-end items-center h-[2vw]">
                    <div className=" w-4 h-4 flex justify-center items-center" onClick={() => handler('')}>
                        <FontAwesomeIcon icon={faClose} />
                    </div>
                </div>
                <div className="flex justify-center items-center h-[27vw]">
                    <div className="w-[50%]">
                        <AiImg color={color}  />
                    </div>
                    <div className="h-full w-[50%] px-4 flex justify-center items-center">
                        <div>
                            <div className="text-[10px] py-1">
                                <p>room id :</p>
                                <div className="mt-2 flex justify-between bg-white text-black p-1 h-[40px] rounded-sm items-center">
                                    <p className="w-[80%] text-[10px] overflow-hidden">http://localhost:5173/dashboard/game/room/1</p>
                                    <button style={{background:color}} className="text-[10px] h-[30px] w-fit p-1 ml-1 rounded-sm text-white">
                                        copy
                                        <FontAwesomeIcon className="ml-2" icon={faClone} />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-white p-4 text-black min-h-[70px] h-fit px-3 items-center rounded-sm flex justify-between">
                                <Player />
                                <Player />
                                <Player />
                            </div>
                            <Link to="../tournment">
                                <button style={{
                                    background: color,
                                }} className={`mt-2 w-full rounded-sm text-[14px] capitalize h-8`}>Play</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )       
}

const memebersOption = [
    {id:0, num:4, text:'four 4', checked:true},
    {id:1, num:8, text:'four 8', checked:false},
    {id:2, num:16, text:'four 16', checked:false},
]
const roundsOption = [
    {id:0, num:3, text:'two 3', checked:true},
    {id:1, num:5, text:'three 5', checked:false},
    {id:2, num:7, text:'five 7', checked:false},
]

function RadioSelect({options, text}) {
    return (
        <fieldset className="text-[14px] my-6">
            <legend>{text}</legend>
            {
                options?.map(item => {
                    return (
                        <div className="mt-2">
                            <input type="radio" id={item.num} checked={item.checked} value={item.num} className="mr-2" />
                            <label for={item.num} >{item.text}</label>
                        </div> 
                    )
                })
            }
        </fieldset>
    )
}

function CreatRoom({handler}) {

    const color = useContext(ColorContext)
    const [members, setMembers] = useState(2)
    const [rounds, setRounds] = useState(3)
    const theme = useContext(ThemeContext)

    return (
        <div className={`${theme == 'light' ? "bg-lightItems/30 text-lightText border-black/20" : "bg-darkItems/30 text-darkText border-white/20"} border-[.3px] shadow-sm  backdrop-blur-md p-2 rounded-sm absolute w-[65vw] h-[40vw] top-[50%] left-[40%] translate-x-[-40%] translate-y-[-50%]`}>
            <div className="header text-[22px] text-right flex justify-end items-center h-[4vw] ">
                <div className=" w-4 h-8flex justify-center items-center" onClick={() => handler('')}>
                    <FontAwesomeIcon icon={faClose} />
                </div>
            </div>
            <div className="flex justify-center w-full items-center h-[35vw]">
                <div className="w-[100%] h-full flex justify-center items-center">
                    <AiImg color={color}  />
                </div>
                <div className="w-[80%] px-5 text-[22px]">
                    <h1 className="font-kaushan">Room infos :</h1>
                    <RadioSelect options={memebersOption} text="Select members number :" />
                    <RadioSelect options={roundsOption} text="Select rounds number :" />
                    <button style={{
                        background: color,
                    }} className={`mt-2 w-[200px] rounded-sm text-[14px] text-white capitalize h-10`} onClick={() => handler('waiting')}>create room</button>
                </div>
            </div>
        </div>
    )
}

function Hero({color}) {
    
    return (
        <div className=" hero border-[.5px] shadow-sm border-gray-600 h-2/3 sm:h-1/2 max-h-[400px] sm:max-h-[400px] bg-pong bg-cover rounded-sm">
            <div className="flex items-center justify-center h-full w-full backdrop-blur-sm rounded-sm p-1 bg-[#141323]/50">
                <div className="place-items-center flex items-center justify-center max-w-[1500px] ">
                    <div className="img overflow-y-visible w-[50%] h-[350px] p-2 sm:mr-4 flex justify-center items-center">
                        <HeroImg color={color} />
                    </div>
                    <div className="centent w-[50%] h-full leading-snug text-white p-7 flex justify-between items-center">
                        <div className="">
                            <p className="text-[8px] max-w-[260px] leading-4">welcome to pong comunity, go play with your friends, and leet them see your amazing skills , enjoy ; )</p>
                            <h3 className="text-[2rem] mt-2 font-kaushan max-w-[270px] font-bold capitalize">its time to play ping pong</h3>
                            <Link to="waiting">
                                <button style={{backgroundColor : color}} className={`flex justify-between h-[3rem] w-[8rem] items-center p-2 px-4 text-white rounded-3xl mt-10`}>
                                    <p className="mr-2 text-[1rem] capitalize font-kaushan">Play now</p>
                                    <FontAwesomeIcon className="text-[1rem]" icon={faGamepad} />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Card({text , img, color, handler, link}) {
    const theme = useContext(ThemeContext);
    return(
        <div className={`card h-[350px] w-full max-w-[340px] p-2 border-[1px] rounded-sm ${theme === 'light' ? "bg-lightItems border-lightText/40 shadow-lightText/10" : " bg-darkItems/50 border-darkText/30 shadow-darkText/10"}`}>
            <div className="img w-full h-[200px] flex items-center justify-center ml-[50%] translate-x-[-50%]">
                {img}
            </div>
            <div className="card-body mt-4 w-full">
                <div className="content mt-2 w-full text-center text-[20px]">
                    <h1 className="capitalize font-kaushan">{text}</h1>
                    <p className="text-[10px] mt-2">Lorem ipsum dolor sit amet.</p>
                </div>
                <div className="action flex items-end justify-center">
                    <Link to={link}>
                        <button style={{backgroundColor : color}} className="text-[12px] w-fit px-6 mt-5  h-[35px] py-2 rounded-full capitalize text-white flex justify-center items-center" onClick={() => handler('create')} >
                            <h1 className="text-[12px]">play</h1>
                            <FontAwesomeIcon icon={faGamepad} className="ml-2 text-[20px]" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}


function Cards({color, handler}) {
    const theme = useContext(ThemeContext)
    return (
        <div className={`cards h-[960px] ${theme === 'light' ? "text-lightText" : "text-darkText"}`}>
            <div className={`header mx-4 my-6  items-center flex justify-between`}>
                <div>
                    <h1 className="text-secondary capitalize ">game modes:</h1>
                    <p className="text-small mt-2">pick a game to play in</p>
                </div>
            </div>
            <div className="mt-2 px-10">
                <div className="w-full p-2 flex border-white/20 border-[0px] rounded items-center">
                    <div className="h-[200px] min-w-[200px] w-1/3">
                        <FriendImg color={color} />
                    </div>
                    <div className="ml-4 w-1/3" >
                        <h1 className="capitalize font-kaushan">play vs friend</h1>
                        <p className="mt-2 text-[12px]">invite your friend and play ping pong together</p>
                        <button style={{background:color}} className=" px-3 h-[36px] text-white rounded-full w-[100px] mt-4 flex items-center justify-center" >
                            <h1 className="text-[14px] capitalize">play</h1>
                            <FontAwesomeIcon icon={faGamepad} className="ml-2 text-[20px]" />
                        </button>
                    </div>
                </div>
                <div  className="w-full p-6 bg-darkBg/20 flex justify-end border-white/20 border-[.1px] rounded items-center mt-10">
                    <div className="mr-4 w-1/3">
                        <h1 className="capitalize font-kaushan">play on tornemnt</h1>
                        <p className="mt-2 text-[12px]">create a tournment and play with your friends</p>
                        <Link to="tournment">
                            <button style={{background:color}} className=" px-3 h-[36px] text-white rounded-full w-fit min-w-[100px] mt-4 flex items-center justify-center" >
                                <h1 className="text-[14px] capitalize">play</h1>
                                <FontAwesomeIcon icon={faGamepad} className="ml-2 text-[20px]" />
                            </button>
                        </Link>
                    </div>
                    <div className="h-[200px] min-w-[200px] w-1/3">
                        <TornmentImg color={color} />
                    </div>
                </div>
                <div className="w-full p-2 flex border-white/20 border-[0px] rounded items-center mt-10">
                    <div className="h-[200px] min-w-[200px] w-1/3">
                        <AiImg color={color} />
                    </div>
                    <div className="ml-4 w-1/3" >
                        <h1 className="capitalize font-kaushan">play vs ai</h1>
                        <p className="mt-2 text-[12px]">play a match with a computer and sharp your skills</p>
                        <button style={{background:color}} className=" px-3 h-[36px] text-white rounded-full w-[100px] mt-4 flex items-center justify-center" >
                            <h1 className="text-[14px] capitalize">play</h1>
                            <FontAwesomeIcon icon={faGamepad} className="ml-2 text-[20px]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default function Game() {
    const color = useContext(ColorContext)
    const theme = useContext(ThemeContext)
    const [step, setStep] = useState(null)
    return (
        <>
            <div className={`${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} mt-2 w-full h-[100vh] overflow-scroll p-2`}>
                <div className="mx-auto h-full">
                    <Hero color={color} />
                    <Cards color={color} handler={setStep} />
                </div>
            </div> 
        </>
    )
}