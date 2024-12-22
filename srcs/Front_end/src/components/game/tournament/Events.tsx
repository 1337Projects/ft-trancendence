import React, { useContext } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { TbUsers } from "react-icons/tb";
import { Link } from "react-router-dom";


export function TrItem({data}) {

    const { theme, color } = useContext(ApearanceContext) || {}

    return (
        <div className={`${theme == 'light' ? "border-black/20" : "border-white/20"} w-full h-[200px]`}>
            <div className="w-full h-[180px] flex items-center relative p-2">
                <img src="/tr.jpg" className={`mr-4 border-[1px] ${theme == 'light' ? "border-black/20" : "border-white/20"} rounded w-[200px] h-full`} />
                <div style={{background : color}} className="absolute text-white top-[0px] w-[80px] flex items-center justify-center left-[0px] h-[35px] rounded text-xs">{data.tourament_status}</div>
                <div className="w-full h-full">
                    <div className={`h-[100px] w-full  border-b-[1px] ${theme == 'light' ? "border-black/20" : "border-white/20"}`}>
                        <h1 className="text-xl py-2 font-bold">{data.tournament_name}</h1>
                        <div className="flex items-center justify-between mt-4">
                            <h1 className="text-sm flex items-center">
                                <TbUsers />
                                <p className="ml-2">Participants {data.max_players}</p>
                            </h1>
                        </div>
                    </div>
                    <div className="w-full h-[80px] flex justify-end items-center p-2">
                        <Link style={{ background: color }} className="uppercase text-sm text-white flex justify-center items-center w-[100px] h-[40px] rounded" to={`tournment/waiting/${data.id}`}>join</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
