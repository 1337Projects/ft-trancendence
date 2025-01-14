import { useContext } from "react";
import { ApearanceContext } from "../../../Contexts/ThemeContext";
import LevelImg from "../assets/LevelImg";
import { useOutletContext } from "react-router-dom";
import { UserType } from "@/types/user";


export function Avatar() {
	return (
		<img src="/ava2.png" className='h-[350px] ml-[50%] translate-x-[-50%]' alt="" />
	)
}

export default function Level() {
	const appearence = useContext(ApearanceContext)
    const currentUser : UserType = useOutletContext()
	
	function test(f : number) {
		return Math.ceil(((f < 1.0) ? f : (f % Math.floor(f))) * 100)
	}

	return (
		<div className="flex items-center">
			<div className="w-1/5 mr-10 flex justify-center items-center">
				<LevelImg color={appearence?.color || "#ffffff"} />
			</div>
			<div className="w-4/5 px-10">
				<div className={`pr-4 ${appearence?.theme == 'light' ? "text-lightText" : "text-darkText"} flex items-center text-[10pt] justify-end`}>
					<h1>{currentUser?.profile?.level} LVL</h1>
				</div>
				<div className='relative mt-2 pr-4 h-2'>
					<div className={`${appearence?.theme == 'light' ? "bg-gray-300" : "bg-lightItems"} h-full rounded`}></div>
					<div style={{background:appearence?.color, width:` ${test(currentUser?.profile?.level)}%`}} className='h-full top-0 rounded absolute'></div>
				</div>
			</div>
		</div>
	)
}