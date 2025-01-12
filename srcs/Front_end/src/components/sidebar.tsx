import { ReactElement, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ApearanceContext } from '../Contexts/ThemeContext';
import { UserContext } from '../Contexts/authContext';

import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { TbSettings2 } from "react-icons/tb";
import { PiMoonStars, PiSunDim } from "react-icons/pi";

import { GrGamepad } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { IoIosLogOut } from "react-icons/io";



function NavItem({text, icon, link} : {text : string, icon : ReactElement, link : string}) {
	const {color} = useContext(ApearanceContext) || {}
	const location = useLocation();
	const isActive = location.pathname.includes(text)
	return (
		<Link 
			style={{background: isActive && color || '', color : isActive && "#ffffff" || '', fontWeight : isActive && '700' || '' }} 
			to={link} 
			className={`text-center w-full hover:bg-gray-700/20 rounded py-2 sm:flex sm:justify-start px-6 sm:items-center`}
		>
			<div className='text-[20pt] text-center w-full sm:w-fit flex justify-center'>
				{icon}
			</div>
			<p className='text-xs mt-2 sm:ml-4 sm:mt-0 uppercase hidden sm:block'>{text}</p>
		</Link>
	)
}


function SideBar() {
	const {theme, themeHandler} = useContext(ApearanceContext) || {}
	const user = useContext(UserContext)
	
	const nav_inks = [
		{
			text: 'profile',
			icon : <RxDashboard />,
			link : `profile/${user?.user?.username}`
		},
		{
			text: 'game',
			icon : <GrGamepad />,
			link : `game`
		},
		{
			text: 'chat',
			icon : <HiOutlineChatBubbleLeftRight />,
			link : `chat`
		},
		{
			text: 'setings',
			icon : <TbSettings2 />,
			link : `setings`
		},
	]
	
	function ThemeHandler() {
		themeHandler!(theme == 'light' ? 'dark' : 'light')
	}

	return (
		<div className={`w-full h-full ${theme === 'light' ? "bg-lightItems text-lightText  border-black/40" : "bg-darkItems text-darkText border-white/40"} xl:w-[260px]`}>
			<header 
				className={`w-full h-full  shadow-sm rounded-sm relative`}>
				<div className='w-full h-full  sm:grid xl:px-4 px-2'>
					<div className="h-full sm:h-[400px] sm:w-full grid grid-cols-6 items-center sm:grid-cols-1 sm:gap-2">
						{ nav_inks.map((item, index) => (<NavItem key={index} icon={item.icon} text={item.text} link={item.link} />)) }
						<button onClick={ThemeHandler} className='text-center sm:flex justify-start px-6 items-center'>
							<div className='text-[20pt] w-full sm:w-fit flex justify-center'>
								{theme === 'dark' ? <PiSunDim /> : <PiMoonStars />}
							</div>
							<p className='text-xs mt-4 sm:mt-0 sm:ml-4 hidden sm:block'>Theme</p>
						</button>
						<button className='text-[20pt] w-full flex justify-center items-center sm:hidden'>
							<IoIosLogOut />
						</button>
					</div>
				</div>
			</header>
		</div>
)}

export default SideBar
