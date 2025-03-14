import { useContext } from "react"
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router-dom'
import { ApearanceContext } from "@/Contexts/ThemeContext";
import { FiUsers } from "react-icons/fi";
import { TournamentType } from "@/types/tournamentTypes"


export default function Hero({ data } : {data : TournamentType}) {
    const { color } = useContext(ApearanceContext) || {}
    return (
        <div className="relative overflow-hidden h-[200px] rounded">
            <img src="/game/tr_hero.webp" className="w-full " alt="img" />
            <div className="absolute top-4 left-6 text-white z-10 text-xl">
                <Link to={`/dashboard/game`}>
                    <IoMdArrowRoundBack />
                </Link>
            </div>
            <div className="bg-blackGT absolute top-0 left-0 w-full h-full p-2 flex items-center">
                <div className=" w-[150px] h-[150px] rounded ml-[20px]">
                    <img src="/game/winner.svg" alt="" />
                </div>
                <div className="text-white ml-[20px]">
                    <p style={{background:color}} className="py-2 text-white px-4 uppercase w-fit text-xs rounded">{data?.data?.tourament_status}</p>
                    <h1 className="uppercase text-2xl mt-4 font-bold">{data?.data?.tournament_name}</h1>
                    <div className="mt-4 text-sm flex items-center">
                        <FiUsers className="mr-2" /> 
                        <p className="mr-2 uppercase">max players :</p>
                        <span>{data?.data?.max_players}</span> 
                    </div>
                </div>
                <div className="w-[150px] h-10 absolute bottom-4 right-4 flex justify-center items-center">
                    <ul className="flex">
                        {
                            data?.data?.players.map(
                                (player, index) => 
                                <img 
                                    key={index}
                                    src={player.profile.avatar} 
                                    className="bg-white w-[25px] h-[25px] mr-[-10px] rounded-full border-[1px]">
                                </img>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}