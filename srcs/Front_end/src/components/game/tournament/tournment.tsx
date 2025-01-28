import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from '@/Contexts/authContext'
import Hero from "./Hero";
import { ApearanceContext } from "@/Contexts/ThemeContext";
import { FaAnglesUp, FaArrowRight } from "react-icons/fa6";
import Schema from "./Schema";
import { UserType } from "@/types/userTypes";
import { TournamentType } from "@/types/tournamentTypes";
import { MatchDataType } from "@/types/gameTypes";
import { tournamentSocket } from "@/sockets/tournamentSocket";
import { toast } from "react-toastify";


export default function Tournment() {

    const { user } = useContext(UserContext) || {}
    const { theme } = useContext(ApearanceContext) || {}
    const [ tournamentData, setTournamentData ] = useState<TournamentType | null>(null)
    const navigate = useNavigate()
    const [ ended, setEnded ] = useState<{user : UserType, xp : number}[] | null>(null)
    const { tournament_id } = useParams()
    const timeoutRef = useRef<null | NodeJS.Timeout>(null)
    const [ error , setError] = useState<string | null>(null)

    const EndHandler = (data: {user : UserType, xp : number}[]) => {
        setEnded(data)
    }

    function DataHandler(data: TournamentType) {
        setTournamentData(data)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            tournamentSocket.addCallback("tr_data", DataHandler)
            tournamentSocket.addCallback("match_data", matchHandler)
            tournamentSocket.addCallback("winner_data", EndHandler)
            tournamentSocket.addCallback("error", setError)
            tournamentSocket.sendMessage({"event" : "get_data"})
        }, 100)

        return () => {
            clearTimeout(timer)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])


    const matchHandler = (match_data : MatchDataType) => {
        if (match_data && user) {
            if (match_data.player1.username == user?.username || match_data.player2.username == user?.username) {
                toast.info('get ready to play match ...')
                timeoutRef.current = setTimeout(() => {
                    navigate(`/dashboard/game/tournment/${tournament_id}/play/${match_data.id}`)
                }, 3000)
            }
        }
    }

    if (error) {
        return (
            <div className={`w-full h-full overflow-scroll ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} flex items-center justify-center p-2`}>
                <div className="w-fit h-fit max-w-[300px] text-center">
                    <h1 className="capitalize font-bold">somthing went wrong...</h1>
                    <p className="mt-2 text-xs">{error}</p>
                </div>
            </div>
        )
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
            <div className="w-full h-fit mt-6">
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

function RankItem({ item } : {item : {user : UserType, xp : number}}) {

    return (
        <div className="h-[70px] mt-4 rounded p-2">
            <div className="flex items-center justify-evenly h-full">
                <div className="relative">
                    <img className="w-[50px] h-[50px] rounded mr-6" src={ item.user.profile.avatar } alt="" />
                </div>
                <div>
                    <div className="w-[160px] font-bold uppercase">{ item.user.username }</div>
                    <div className="text-xs mt-1 flex items-center justify-start">
                        <p className="mr-2">level {item.user.profile.level} </p>
                        <span>
                            <FaAnglesUp />
                        </span>
                    </div>
                </div>
                <div className="h-full flex justify-end items-center w-[100px]">
                    + {item.xp} xp
                </div>
                <Link to={`/dashboard/profile/${item.user.username}`} className="w-[100px] flex justify-end items-center">
                    <FaArrowRight />
                </Link>
            </div>
        </div>
    )
}


