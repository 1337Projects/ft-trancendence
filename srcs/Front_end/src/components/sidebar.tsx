import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ApearanceContext } from '../Contexts/ThemeContext';
import { UserContext } from '../Contexts/authContext';

import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { TbLogout, TbSettings2 } from "react-icons/tb";
import { PiMoonStars, PiSunDim } from "react-icons/pi";

import { GrGamepad } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";



function NavItem({text, icon, link}) {
	const {color} = useContext(ApearanceContext) || {}
	const location = useLocation();
	const isActive = location.pathname.includes(text)
	return (
		<Link 
			style={{background: isActive && color || '', color : isActive && "#ffffff" || '' }} 
			to={link} 
			className={`text-center w-full hover:bg-gray-700/20 rounded py-2 xl:flex xl:justify-center xl:items-center`}
		>
			<div className='text-[20pt] text-center w-full xl:w-fit flex justify-center'>
				{icon}
			</div>
			<p className='text-xs mt-2 xl:ml-4 xl:mt-0 uppercase hidden xl:block'>{text}</p>
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
		<div className={`w-[100vw] h-[110px] absolute bottom-0 border-t-[.6px] border-white/40 sm:border-none  sm:relative  sm:w-full sm:h-full xl:w-[260px] z-20`}>
			<header 
				className={`w-full h-full border-[.3px]  shadow-sm rounded-sm relative ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/0"}`}>
				<div className='w-full h-full  sm:grid xl:px-4 px-2'>
					<div className="h-full sm:h-[400px] sm:w-full grid grid-cols-5 items-center sm:grid-cols-1 sm:gap-2">
						{ nav_inks.map((item, index) => (<NavItem key={index} icon={item.icon} text={item.text} link={item.link} />)) }
						<button onClick={ThemeHandler} className='text-center xl:flex justify-center items-center'>
							<div className='text-[20pt] w-full xl:w-fit flex justify-center'>
								{theme === 'dark' ? <PiSunDim /> : <PiMoonStars />}
							</div>
							<p className='text-xs mt-4 xl:mt-0 xl:ml-4 hidden xl:block'>Theme</p>
						</button>
					</div>
				</div>
			</header>
		</div>
)}

export default SideBar
