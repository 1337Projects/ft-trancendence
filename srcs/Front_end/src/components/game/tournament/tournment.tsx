import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MyUseEffect from '@/hooks/MyUseEffect'
import { tournamentSocket } from "@/socket";
import { UserContext } from '@/Contexts/authContext'
import Hero from "./Hero";
import { ApearanceContext } from "@/Contexts/ThemeContext";
import { FaAnglesUp, FaArrowRight } from "react-icons/fa6";
import Schema, { TournamnetType } from "./Schema";
import { UserType } from "@/types/user";
import { MatchDataType } from "@/types/tournament";


export default function Tournment() {

    const { user } = useContext(UserContext) || {}
    const { theme } = useContext(ApearanceContext) || {}
    const [ tournamentData, setTournamentData ] = useState<TournamnetType | null>(null)
    const navigate = useNavigate()
    const [ ended, setEnded ] = useState<UserType[] | null>(null)
    const { tournament_id } = useParams()
 

    function EndHandler(data : UserType[]) {
        setEnded(data)
    }

    function DataHandler(data : TournamnetType) {
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


    const matchHandler = (match_data : MatchDataType) => {
        if (match_data && user) {
            if (match_data.player1.username == user?.username || match_data.player2.username == user?.username) {
                navigate(`/dashboard/game/tournment/${tournament_id}/play/${match_data.id}`)
            }
        }
    }


    if (!tournamentData) {
        return (
            <div className={`w-full h-full overflow-scroll ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} p-2`}>
                <div className="w-full h-[200px] bg-gray-300 rounded animate-pulse"></div>
            </div>
        )
    }
   
    return  (
        <div className={`w-full h-full overflow-scroll ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} p-2`}>
            <Hero data={tournamentData} />
            <div className="w-full h-fit mt-2">

                <Schema data={tournamentData} />
                {
                    ended && 
                    <div 
                        className="w-full p-2 mt-10 rounded h-fit"
                    >
                        <div className="w-full text-center">
                            <h1 className="text-xl capitalize underline">leader borad</h1>
                        </div>
                        
                        <ul className="mt-10 max-w-[600px] mx-auto">
                            { ended.map((item, index) => <li key={index}><RankItem item={item} /></li>) }
                        </ul>
                    </div>
                }
            </div>
        </div>
    )
}

function RankItem({ item } : {item : UserType}) {

    return (
        <div className="h-[70px] mt-4 rounded p-2">
            <div className="flex items-center justify-evenly h-full">
                <div className="relative">
                    <img className="w-[50px] h-[50px] rounded mr-6" src={ item.profile.avatar } alt="" />
                </div>
                <div>
                    <div className="w-[160px] font-bold uppercase">{ item.username }</div>
                    <div className="text-xs mt-1 flex items-center justify-start">
                        <p className="mr-2">level {item.profile.level} </p>
                        <span>
                            <FaAnglesUp />
                        </span>
                    </div>
                </div>
                <div className="h-full flex justify-end items-center w-[100px]">
                    + 100px
                </div>
                <div className="w-[100px] flex justify-end items-center">
                    <FaArrowRight />
                </div>
            </div>
        </div>
    )
}


