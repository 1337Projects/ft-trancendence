import React, { useContext } from "react"
import { ApearanceContext } from '../../Contexts/ThemeContext'
import { GiRank3 } from "react-icons/gi";
import { FaAnglesUp } from "react-icons/fa6";
import { Touramentcontext } from "../../Contexts/TournamentContext";

export default function PlayersTables() {

    const { color } = useContext( ApearanceContext ) || {}
    const { data } = useContext(Touramentcontext) || {}


    if (!data) {
        return (
            <div className="p-6">
                <div className="w-full h-[50px] bg-gray-400 rounded mt-2 animate-pulse"></div>
                <div className="w-full h-[50px] bg-gray-400 rounded mt-2 animate-pulse"></div>
                <div className="w-full h-[50px] bg-gray-400 rounded mt-2 animate-pulse"></div>
                <div className="w-full h-[50px] bg-gray-400 rounded mt-2 animate-pulse"></div>
                <div className="w-full h-[50px] bg-gray-400 rounded mt-2 animate-pulse"></div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <table className="w-full h-fit">
                <thead className="h-[50px] bg-gray-700 text-white">
                    <tr className="text-sm capitalize">
                        <th className="font-thin">rank</th>
                        <th className="font-thin">avatar</th>
                        <th className="font-thin">username</th>
                        <th className="font-thin">level</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.data.players.map((player, index) => {
                            return (
                                <tr  key={index} className={`h-[50px] ${index % 2 ? "border-[1px] border-white/20" : ""} text-sm text-center`}>
                                    <td className="">
                                        <div className="flex items-center justify-center w-full h-full">
                                            <p className="mr-2">{index + 1}</p> 
                                            <GiRank3 className="text-[12pt]" />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="w-full h-full flex items-center justify-center">
                                            <img src={player.user_id.profile.avatar} className="w-[40px] h-[40px] rounded bg-white "></img>
                                        </div>
                                    </td>
                                    <td>{player.user_id.username}</td>
                                    <td className="">
                                        <div className="w-full h-full flex justify-center items-center">
                                            <p className="mr-2">{player.user_id.profile.level}</p> 
                                            <FaAnglesUp />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}