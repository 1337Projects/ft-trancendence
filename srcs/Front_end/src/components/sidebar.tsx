
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { ApearanceContext } from '../Contexts/ThemeContext';
import { UserContext } from '../Contexts/authContext';
import { FaEnvelope, FaHome, FaMoon, FaSun } from 'react-icons/fa'


// export function LargeSideBar() {
// 	const location = useLocation();
// 	const theme = useContext(ThemeContext);
// 	const color = useContext(ColorContext)
// 	const themeHanlder = useContext(ThemeToggelContext);
// 	const navigate = useNavigate()
// 	const authHandler = useContext(authContextHandler)


// 	function logoutHandler() {
// 		fetch('http://localhost:8000/api/auth/logout/', {
// 			credentials : 'include',
// 			method : 'GET'
// 		}).then(res => res.json())
// 		.then(data => {
// 			authHandler(null)
// 			navigate("/auth/login")
// 		})
// 		.catch(err => console.log(err))
// 	}

// 	return (
// 		<>
// 			<div className={`w-[160px] min-h-[667px] h-[100vh] inline-flex items-start justify-start shrink-0`}>
// 				<header 
// 					className={`w-full h-full border-[.3px] shadow-sm rounded-sm relative ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/10"}`}>
// 					<div className="cursor-pointer flex items-center justify-center w-full text-[22px] my-4">
// 						<div style={{color:color}} className='items-center'>
// 							<h1  className={`mr-1 text-[28px] font-insp`}>Pong Game</h1>
// 						</div>
// 					</div>
// 							<div className="menu w-full mt-20 h-[160px] text-[20px] flex flex-col items-center justify-between">
// 								<Link style={{background: location.pathname.includes('profile') && color}} to="profile" className={`flex rounded-sm w-full h-[35px] items-center justify-center`}> 
// 									<FontAwesomeIcon icon={faHome} />
// 									<p className='text-primaryText ml-4'>Profile</p>
// 								</Link>
// 								<Link style={{background: location.pathname.includes("game") && color}} to="game" className={`flex rounded-sm w-full h-[35px] items-center justify-center`}> 
// 									<FontAwesomeIcon icon={faGamepad} />
// 									<p className='text-primaryText ml-4'>Play</p>
// 								</Link>
// 								<Link style={{background: location.pathname.includes("chat") && color}} to="chat" className={`flex rounded-sm w-full h-[35px] items-center justify-center`}>
// 									<FontAwesomeIcon icon={faEnvelope} />
// 									<p className='text-primaryText ml-4'>Chat</p>
// 								</Link>
// 							</div> 
// 							<div className="menu w-full text-[20px] h-[160px] flex flex-col items-center justify-between bottom-4 absolute">
// 								<button className='w-full rounded-sm h-[35px] flex justify-center items-center' onClick={() => {
// 									if (theme == 'light')
// 										themeHanlder('dark')
// 									else
// 									themeHanlder('light');
// 								}}>
// 									<FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} />
// 									<p className='text-primaryText ml-4'>Theme</p>
// 								</button>
// 								<Link style={{background : location.pathname.includes('setings') && color}} to="setings" className={`rounded-sm h-[35px] flex justify-center items-center w-full`}>
// 									<FontAwesomeIcon  icon={faGear} />
// 									<p className='text-primaryText ml-4'>setings</p>
// 								</Link>
// 								<div className='w-full'>
// 									<hr className='border-white/50 w-full'></hr>
// 									<button className='rounded-sm mt-4 h-[25px] flex justify-center items-center w-full' onClick={logoutHandler} >
// 										<FontAwesomeIcon icon={faRightToBracket} />
// 										<p className='text-primaryText ml-4'>Logout</p>
// 									</button>
// 								</div>
// 							</div>
// 				</header>
// 			</div>
//     	</>
// 	)
// }
import { FaGamepad, FaGear } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";

function SideBar() {
	const location = useLocation();
	const appearence = useContext(ApearanceContext)
	const user = useContext(UserContext)
	const navigate = useNavigate()



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
		if (appearence?.theme == 'light')
			appearence.themeHandler('dark')
		else
			appearence?.themeHandler('light');
	}

	return (
		<div className={`w-[100vw] h-[70px] absolute bottom-0 sm:relative sm:w-[70px] sm:min-h-[667px] sm:h-[100vh] z-20`}>
			<header 
				className={`w-full h-full border-[.3px] shadow-sm rounded-sm relative ${appearence?.theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/10"}`}>
				<div className="hidden sm:block h-[5vh] cursor-pointer  items-center justify-center w-full text-[22px] my-6">
					<h1 style={{color:appearence?.color}} className={`mx-4 text-[28px] font-insp`}>Pong</h1>
				</div>
				<div className='flex h-full sm:h-[92vh] sm:grid'>
					<div className="w-1/2 h-full flex justify-evenly items-center sm:h-[250px] sm:w-full sm:grid sm:grid-cols-1 sm:gap-2">
						<Link style={{color: location.pathname.includes('profile') && appearence?.color || ''}} to="profile" className={`text-center`}> 
							<FaHome className='text-[22px] text-center w-full' />
							<p className='text-primaryText mt-2'>Profile</p>
						</Link>
						<Link style={{color: location.pathname.includes("game") && appearence?.color || ''}} to="game" className={`text-center`}> 
							<FaGamepad className='text-[22px] w-full text-center' />
							<p className='text-primaryText mt-2'>Play</p>
						</Link>
						<Link style={{color: location.pathname.includes("chat") && appearence?.color || ''}} to="chat" className={`text-center`}>
							<FaEnvelope className='text-[22px] w-full text-center' />
							<p className='text-primaryText mt-2'>Chat</p>
						</Link>
					</div> 
					<div className="w-1/2 h-full flex items-center justify-evenly sm:w-full sm:h-[250px] sm:grid sm:grid-cols-1 sm:gap-2 sm:place-self-end">
						<button onClick={ThemeHandler}>
							{appearence?.theme === 'dark' ? <FaSun className='text-[22px] w-full text-center' /> : <FaMoon className='text-[22px] w-full text-center' />}
							<p className='text-primaryText mt-2'>Theme</p>
						</button>
						<div>
							<Link style={{color : location.pathname.includes('setings') && appearence?.color || ''}} to="setings" className={`text-center`}>
								<FaGear className='text-[22px] w-full text-center' />
								<p className='text-primaryText mt-2'>setings</p>
							</Link>
						</div>
						<button className='text-center' onClick={logoutHandler}>
							<TbLogout className='text-[22px] w-full text-center' />
							<p className='text-primaryText mt-2'>Logout</p>
						</button>
					</div>
				</div>
			</header>
		</div>
)}

export default SideBar
