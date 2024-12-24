import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyUseEffect from '@/hooks/MyUseEffect'
import { tournamentSocket } from "@/socket";
import { UserContext } from '@/Contexts/authContext'
import Hero from "./Hero";
import { ApearanceContext } from "@/Contexts/ThemeContext";
import { FaArrowRight } from "react-icons/fa6";
import Schema from "./Schema";

export default function Tournment() {

    const { user } = useContext(UserContext) || {}
    const { theme, color } = useContext(ApearanceContext) || {}
    const [ tournamentData, setTournamentData ] = useState(null)
    const navigate = useNavigate()
    const [ ended, setEnded ] = useState(null)
 

    function EndHandler(data) {
        setEnded(data)
    }

    function DataHandler(data) {
        setTournamentData(data)
    }

    MyUseEffect(() => {
        const timer = setTimeout(() => {
            tournamentSocket.addCallback("tr_data", DataHandler)
            tournamentSocket.addCallback("match_data", matchHandler)
            tournamentSocket.addCallback("winner_data", EndHandler)
            tournamentSocket.sendMessage({"event" : "get_data"})
        }, 100)

        return () => {
            clearTimeout(timer)
        }
    }, [])


    const matchHandler = (match_data) => {
        if (match_data && user) {
            if (match_data.player_1.username == user?.username || match_data.player_2.username == user?.username) {
                navigate(`play/${match_data.id}`)
            }
        }
    }

   
    return  (
        <div className={`w-full h-[100vh] ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"}  mt-2 p-2`}>
            <Hero data={tournamentData} />
            <div className="w-full h-fit mt-2">

                <Schema data={tournamentData} />
                {
                    ended && 
                    <div 
                        className="w-full max-w-[400px] mx-auto p-2 mt-10 rounded h-fit"
                    >
                        <div className="w-full text-center">
                            <h1 className="text-xl capitalize underline">leader borad</h1>
                        </div>
                        <ul className="">
                            {
                                ended.map((item, index) => {
                                    return (
                                        <li key={index} className="h-[70px] border-[1px] mt-4 rounded-full p-2">
                                            <div className="flex items-center h-full">
                                                <div className="relative">
                                                    <img className="w-[50px] h-[50px] rounded-full mr-6" src={ item.profile.avatar } alt="" />
                                                    <div className="w-6 h-6 bg-white border-[1px] absolute bottom-0 right-4 rounded-full overflow-hidden">
                                                        {
                                                            index == 0 ? 
                                                            <img src="/game/gold.png" className="h-full" alt="medal" /> : 
                                                            (index == 1 ? <img src="/game/plat.png" className="h-full" alt="medal" /> : 
                                                            ((index == 2 && ended.length > 4) ? <img src="/game/bronz.png" className="h-full" alt="medal" /> : <div className="w-full" />))
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="w-[160px] font-bold uppercase">{ item.username }</div>
                                                    <div className="text-xs mt-1">lvl {item.profile.level}</div>
                                                </div>
                                                <div className="h-full flex justify-end items-center w-[100px]">
                                                    <FaArrowRight />
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <button onClick={() => navigate("/dashboard/game/")} style={{background : color}} className="w-full h-[40px] text-white mt-4 rounded-full">
                            close
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}


