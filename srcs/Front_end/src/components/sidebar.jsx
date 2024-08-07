

import { 
	faHome,
	faGamepad,
	faGear,
	faMoon,
	faRightToBracket,
	faEnvelope,
	faSun,
	faBars
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import {ColorContext, ThemeContext, ThemeToggelContext} from '../Contexts/ThemeContext'
import { authContextHandler } from '../Contexts/authContext'


function SideBar() {
	const location = useLocation();
	const theme = useContext(ThemeContext);
	const color = useContext(ColorContext)
	const themeHanlder = useContext(ThemeToggelContext);
	const navigate = useNavigate()
	const authHandler = useContext(authContextHandler)


	function logoutHandler() {
		authHandler(null)
		navigate("/auth/login")
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
