

import { 
	faHome,
	faGamepad,
	faGear,
	faMoon,
	faRightToBracket,
	faEnvelope,
	faSun,
	faBars,
	faTableTennisPaddleBall
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import {ColorContext, ThemeContext, ThemeToggelContext} from '../Contexts/ThemeContext'
import { authContextHandler } from '../Contexts/authContext'
import { data } from 'autoprefixer'



export function MobileSideBar() {
	const color = useContext(ColorContext)
	const theme = useContext(ThemeContext)
	const navigate = useNavigate()
	const authHandler = useContext(authContextHandler)
	
	function logoutHandler() {
		fetch('http://localhost:8000/api/auth/logout/', {
			credentials : 'include',
			method : 'GET'
		}).then(res => res.json())
		.then(data => {
			authHandler(null)
			navigate("/auth/login")
		})
		.catch(err => console.log(err))
	}

	return (
		<div className={`absolute bottom-0 left-0 w-full h-[70px] ${theme == 'dark' ? "bg-darkItems text-darkText" : "bg-darkItems"} z-10 border-t-[.1px] border-darkText/20`}>
			<div className="menu w-full h-full text-[20px] flex items-center justify-between px-10">
				<Link style={{color: location.pathname.includes('profile') && color}} to="profile" className={`text-center`}> 
					<FontAwesomeIcon icon={faHome} />
					<p className='text-primaryText mt-1'>Profile</p>
				</Link>
				<Link style={{color: location.pathname.includes("game") && color}} to="game" className={`text-center`}> 
					<FontAwesomeIcon icon={faGamepad} />
					<p className='text-primaryText mt-1'>Play</p>
				</Link>
				<Link style={{color: location.pathname.includes("chat") && color}} to="chat" className={`text-center`}>
					<FontAwesomeIcon icon={faEnvelope} />
					<p className='text-primaryText mt-1'>Chat</p>
				</Link>
				<Link style={{color : location.pathname.includes('setings') && color}} to="setings" className={`text-center`}>
					<FontAwesomeIcon  icon={faGear} />
					<p className='text-primaryText mt-1'>setings</p>
				</Link>
				<button className='text-center' onClick={logoutHandler}>
					<FontAwesomeIcon icon={faRightToBracket} />
					<p className='text-primaryText mt-1'>Logout</p>
				</button>
			</div>
		</div>
	)
}


export function LargeSideBar() {
	const location = useLocation();
	const theme = useContext(ThemeContext);
	const color = useContext(ColorContext)
	const themeHanlder = useContext(ThemeToggelContext);
	const navigate = useNavigate()
	const authHandler = useContext(authContextHandler)


	function logoutHandler() {
		fetch('http://localhost:8000/api/auth/logout/', {
			credentials : 'include',
			method : 'GET'
		}).then(res => res.json())
		.then(data => {
			authHandler(null)
			navigate("/auth/login")
		})
		.catch(err => console.log(err))
	}

	return (
		<>
			<div className={`w-[160px] min-h-[667px] h-[100vh] inline-flex items-start justify-start shrink-0`}>
				<header 
					className={`w-full h-full border-[.3px] shadow-sm rounded-sm relative ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/10"}`}>
					<div className="cursor-pointer flex items-center justify-center w-full text-[22px] my-6">
						<div style={{color:color}} className='flex items-center'>
							<h1  className={`mr-1 text-[28px] uppercase font-insp`}>Pong /</h1>
							<FontAwesomeIcon icon={faTableTennisPaddleBall} />
						</div>
					</div>
							<div className="menu w-full mt-20 h-[160px] text-[20px] flex flex-col items-center justify-between">
								<Link style={{background: location.pathname.includes('profile') && color}} to="profile" className={`flex rounded-sm w-full h-[35px] items-center justify-center`}> 
									<FontAwesomeIcon icon={faHome} />
									<p className='text-primaryText ml-4'>Profile</p>
								</Link>
								<Link style={{background: location.pathname.includes("game") && color}} to="game" className={`flex rounded-sm w-full h-[35px] items-center justify-center`}> 
									<FontAwesomeIcon icon={faGamepad} />
									<p className='text-primaryText ml-4'>Play</p>
								</Link>
								<Link style={{background: location.pathname.includes("chat") && color}} to="chat" className={`flex rounded-sm w-full h-[35px] items-center justify-center`}>
									<FontAwesomeIcon icon={faEnvelope} />
									<p className='text-primaryText ml-4'>Chat</p>
								</Link>
							</div> 
							<div className="menu w-full text-[20px] h-[160px] flex flex-col items-center justify-between bottom-4 absolute">
								<button className='w-full rounded-sm h-[35px] flex justify-center items-center' onClick={() => {
									if (theme == 'light')
										themeHanlder('dark')
									else
									themeHanlder('light');
								}}>
									<FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} />
									<p className='text-primaryText ml-4'>Theme</p>
								</button>
								<Link style={{background : location.pathname.includes('setings') && color}} to="setings" className={`rounded-sm h-[35px] flex justify-center items-center w-full`}>
									<FontAwesomeIcon  icon={faGear} />
									<p className='text-primaryText ml-4'>setings</p>
								</Link>
								<div className='w-full'>
									<hr className='border-white/50 w-full'></hr>
									<button className='rounded-sm mt-4 h-[25px] flex justify-center items-center w-full' onClick={logoutHandler} >
										<FontAwesomeIcon icon={faRightToBracket} />
										<p className='text-primaryText ml-4'>Logout</p>
									</button>
								</div>
							</div>
				</header>
			</div>
    	</>
	)
}

function SideBar() {
	const location = useLocation();
	const theme = useContext(ThemeContext);
	const color = useContext(ColorContext)
	const themeHanlder = useContext(ThemeToggelContext);
	const navigate = useNavigate()
	const authHandler = useContext(authContextHandler)


	function logoutHandler() {
		fetch('http://localhost:8000/api/auth/logout/', {
			credentials : 'include',
			method : 'GET'
		}).then(res => res.json())
		.then(data => {
			authHandler(null)
			navigate("/auth/login")
		})
		.catch(err => console.log(err))
	}

	return (
    <>
		<div className={`w-[70px] min-h-[667px] h-[100vh] inline-flex items-start justify-start shrink-0`}>
			<header 
				className={`w-full h-full border-[.3px] shadow-sm rounded-sm relative ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/10"}`}>
				<div className="cursor-pointer flex items-center justify-center w-full text-[22px] my-6">
					<h1 style={{color:color}} className={`mx-4 text-[28px] font-insp`}>Pong</h1>
				</div>
						<div className="menu w-full mt-20 h-[210px] text-[20px] flex flex-col items-center justify-between">
							<Link style={{color: location.pathname.includes('profile') && color}} to="profile" className={`text-center`}> 
								<FontAwesomeIcon icon={faHome} />
								<p className='text-primaryText mt-1'>Profile</p>
							</Link>
							<Link style={{color: location.pathname.includes("game") && color}} to="game" className={`text-center`}> 
								<FontAwesomeIcon icon={faGamepad} />
								<p className='text-primaryText mt-1'>Play</p>
							</Link>
							<Link style={{color: location.pathname.includes("chat") && color}} to="chat" className={`text-center`}>
								<FontAwesomeIcon icon={faEnvelope} />
								<p className='text-primaryText mt-1'>Chat</p>
							</Link>
						</div> 
						<div className="menu w-full text-[20px] h-[210px] flex flex-col items-center justify-between bottom-4 absolute">
							<button className='w-full ' onClick={() => {
								if (theme == 'light')
									themeHanlder('dark')
								else
								themeHanlder('light');
						}}>
								<FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} />
								<p className='text-primaryText mt-1'>Theme</p>
							</button>
							<Link style={{color : location.pathname.includes('setings') && color}} to="setings" className={`text-center`}>
								<FontAwesomeIcon  icon={faGear} />
								<p className='text-primaryText mt-1'>setings</p>
							</Link>
							<button className='text-center' onClick={logoutHandler}>
								<FontAwesomeIcon icon={faRightToBracket} />
								<p className='text-primaryText mt-1'>Logout</p>
							</button>
						</div>
			</header>
		</div>
    </>
)}

export default SideBar
