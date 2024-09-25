import React, { useContext } from "react"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { FaClock, FaTrophy } from "react-icons/fa"
import { FaRankingStar } from "react-icons/fa6";

export default function Statistics() {
	const appearence = useContext(ApearanceContext)
	return (
		<div className="h-[50px] mt-10 w-full p-2 flex justify-between ">
			<div className="text-[12px] flex flex-col justify-center text-center">
				<p className={`font-thin ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"} `}>Win</p>
				<div className="flex items-center mt-2">
                    <div style={{color: appearence?.color}}>
                        <FaTrophy />
                    </div>
					<p className={`ml-1 font-thin ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"} `}>11</p>
				</div>
			</div>
			<div className="text-[12px] flex flex-col justify-center text-center">
				<p className={`font-thin ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"} `}>Time</p>
				<div className="flex items-center mt-2">
                    <div style={{color: appearence?.color}}>
                        <FaClock />
                    </div>
					<p className={`ml-1 font-thin ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"} `}>2h 30 min</p>
				</div>
			</div>
			<div className="text-[12px] flex flex-col justify-center text-center">
				<p className={`font-thin ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"} `}>Rank</p>
				<div className="flex items-center mt-2">
                    <div style={{color: appearence?.color}}>
                        <FaRankingStar />
                    </div>
					<p className={`ml-1 font-thin ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"} `}>5</p>
				</div>
			</div>
		</div>
	)
}