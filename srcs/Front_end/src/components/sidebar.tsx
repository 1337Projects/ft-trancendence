import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ApearanceContext } from '../Contexts/ThemeContext';
import { UserContext } from '../Contexts/authContext';

import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { TbLogout, TbSettings2 } from "react-icons/tb";
import { PiMoonStars, PiSunDim } from "react-icons/pi";
import { RiDashboardLine } from "react-icons/ri";
import { GrGamepad } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";



function NavItem({text, icon, link}) {
	const {color} = useContext(ApearanceContext) || {}
	const location = useLocation();

	return (
		<Link 
			style={{color: location.pathname.includes(text) && color || ''}} 
			to={link} 
			className={`text-center p-2 xl:flex xl:justify-center xl:items-center`}
		>
			<div className='text-[20pt] text-center w-full xl:w-fit flex justify-center'>
				{icon}
			</div>
			<p className='text-primaryText mt-2 xl:ml-4 xl:mt-0 capitalize'>{text}</p>
		</Link>
	)
}


function SideBar() {
	const {theme, themeHandler} = useContext(ApearanceContext) || {}
	const user = useContext(UserContext)
	const navigate = useNavigate()
	
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
			text: 'settings',
			icon : <TbSettings2 />,
			link : `setings`
		},
	]
	function logoutHandler() {
		fetch('http://localhost:8000/api/auth/logout/', {
			credentials : 'include',
			method : 'GET'
		}).then(res => res.json())
		.then(data => {
			user?.setAuthInfosHandler(null)
			user?.setUser(null)
			navigate("/auth/login")
		})
		.catch(err => console.log(err))
	}

	function ThemeHandler() {
		themeHandler!(theme == 'light' ? 'dark' : 'light')
	}

	return (
		<div className={`w-[100vw] h-[110px] absolute bottom-0  sm:relative  sm:w-[90px] sm:h-[100vh] xl:w-[260px] z-20`}>
			<header 
				className={`w-full h-full border-[.3px]  shadow-sm rounded-sm relative ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/0"}`}>
				<div className="hidden sm:block h-[5vh] cursor-pointer  items-center justify-center text-center w-full text-[22px] my-6">
					<h1  className={`mx-auto text-[14pt] w-[80px] capitalize xl:text-[18pt]  font-kav`}>Pong</h1>
				</div>
				<div className='w-full h-full sm:h-[91vh] sm:grid'>
					<div className="h-full flex justify-evenly items-center sm:h-[480px] sm:w-full sm:grid sm:grid-cols-1 sm:gap-2">
						{ nav_inks.map((item, index) => (<NavItem key={index} icon={item.icon} text={item.text} link={item.link} />)) }
						<button onClick={ThemeHandler} className='text-center xl:flex justify-center items-center'>
							<div className='text-[20pt] w-full xl:w-fit flex justify-center'>
								{theme === 'dark' ? <PiSunDim /> : <PiMoonStars />}
							</div>
							<p className='text-primaryText mt-4 xl:mt-0 xl:ml-4'>Theme</p>
						</button>
					</div>

					<div className="h-full hidden items-center justify-evenly sm:w-full sm:h-[80px] sm:grid sm:grid-cols-1 sm:gap-2 sm:place-self-end mb-2">
						<button className='text-center xl:flex justify-center items-center' onClick={logoutHandler}>
							<TbLogout className='text-[20pt] w-full xl:w-fit text-center' />
							<p className='text-primaryText mt-4 xl:mt-0 xl:ml-4'>Logout</p>
						</button>
					</div>
				</div>
			</header>
		</div>
)}

export default SideBar
