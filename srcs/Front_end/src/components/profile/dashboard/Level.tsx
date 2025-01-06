import { useContext } from "react";
import { ApearanceContext } from "../../../Contexts/ThemeContext";
import { UserContext } from "../../../Contexts/authContext";
import LevelImg from "../assets/LevelImg";


export function Avatar() {
	return (
		<img src="/ava2.png" className='h-[350px] ml-[50%] translate-x-[-50%]' alt="" />
	)
}

export default function Level() {
	const appearence = useContext(ApearanceContext)
    const user = useContext(UserContext)

	// function test(f) {
	// 	return Math.ceil(((f < 1.0) ? f : (f % Math.floor(f))) * 100)
	// }

	return (
		<div className="flex items-center">
			<div className="w-2/5 mr-4 flex justify-center">
				<LevelImg color={appearence?.color || "#ffffff"} />
			</div>
			<div className="w-3/5">
				<div className={`pr-4 ${appearence?.theme == 'light' ? "text-lightText" : "text-darkText"} flex items-center text-[10pt] justify-between`}>
					<h1>
						<span style={{color:appearence?.color}} className='text-[20pt] font-extrabold mr-2'>{user?.user?.profile?.rank || 1}</span>
						/ 200
					</h1>
					<h1>{user?.user?.profile?.level} LVL</h1>
				</div>
				<div className='relative mt-2 pr-4'>
					<div className={`${appearence?.theme == 'light' ? "bg-gray-300" : "bg-lightItems"} h-2 rounded-full`}></div>
					<div style={{background:appearence?.color, width:` 50%`}} className='h-2 top-0 rounded-full absolute'></div>
				</div>
			</div>
		</div>
	)
}