import { useContext } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { Link } from "react-router-dom"
import { FaGamepad } from "react-icons/fa"
import TennisAsset from "../assets/game/TennisAsset"

export default function Hero() {
    

    const { color } = useContext(ApearanceContext) || {}

    return (
        <div className="h-2/3 sm:h-1/2 max-h-[400px] sm:max-h-[400px]">
            <div className="flex items-center justify-center h-full w-full rounded-sm p-1">
                <div className="place-items-center flex items-center justify-center w-full">
                    <div className="centent w-[50%] h-full leading-snug px-8 flex justify-between items-center">
                        <div className="">
                            <p style={{color : color}} >Play Ping Pong</p>
                            <h3 className="text-[2rem] mt-2 font-kav max-w-[270px] font-bold capitalize">its time to play ping pong</h3>
                            <p className="text-[8px] max-w-[260px] leading-4 mt-4">welcome to pong comunity, go play with your friends, and leet them see your amazing skills enjoy.</p>
                            <Link to="waiting/room/public/ping-pong">
                                <button style={{backgroundColor : color}} className={`flex text-[10pt] justify-between h-[40px] w-[130px] items-center p-2 px-4 text-white rounded-full mt-10`}>
                                    <p className="mr-2 capitalize">Play now</p>
                                    <FaGamepad className="text-[16pt]" />
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative img overflow-y-visible w-[50%] h-[350px] p-2 sm:mr-4 flex justify-center items-center">
                        <TennisAsset />
                    </div>
                </div>
            </div>
        </div>
    )
}