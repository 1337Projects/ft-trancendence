import React, { useContext } from "react"
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router-dom'
import { ApearanceContext } from "../../Contexts/ThemeContext";
import { FiUsers } from "react-icons/fi";


export default function Hero({ data }) {
    const { color } = useContext(ApearanceContext) || {}
    return (
        <div className="relative overflow-hidden h-[200px] rounded">
            <img src="/tr_hero.webp" className="w-full " alt="img" />
            <div className="absolute top-4 left-6 text-white z-10 text-xl">
                <Link to={`/dashboard/game`}>
                    <IoMdArrowRoundBack />
                </Link>
            </div>
            <div className="bg-blackGT absolute top-0 left-0 w-full h-full p-2 flex items-center">
                <div className=" w-[150px] h-[150px] rounded ml-[20px]">
                    <img src="/winner.svg" alt="" />
                </div>
                <div className="text-white ml-[20px]">
                    <p style={{background:color}} className="py-2 text-white px-4 uppercase w-fit text-xs rounded">{data?.data?.mode}</p>
                    <h1 className="uppercase text-2xl mt-4 font-bold">tournment name</h1>
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
                                (player, index) => <img src={player.user_id.profile.avatar} className="bg-white w-[25px] h-[25px] mr-[-10px] rounded-full border-[1px]">
                                </img>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}