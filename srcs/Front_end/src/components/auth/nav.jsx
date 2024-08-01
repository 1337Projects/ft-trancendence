import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLanguage, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react';
import { ColorContext, ThemeContext, ThemeToggelContext } from '../../Contexts/ThemeContext';


export default function Nav() {
    const location = useLocation();
    const color = useContext(ColorContext)
    const theme = useContext(ThemeContext)
    const ThemeHandler = useContext(ThemeToggelContext)
    return (
        <div className={`${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} nav flex justify-between items-center w-fill h-[50px] p-2`}>
            <Link to="/">
                <div style={{color:color}} className="logo  text-[30px] font-semibold font-insp">Pong</div>
            </Link>
            <div className="actions w-[280px] text-[10px] px-1">
                <ul className="flex justify-between items-center ">
                    {/* <li className='cursor-pointer'>Home</li>
                    <li className='cursor-pointer'>About us</li>
                    <li className='cursor-pointer'>contact us</li>
                    <li className='cursor-pointer'>service and policie</li> */}
                    <li className='cursor-pointer'>
                        language
                        <FontAwesomeIcon icon={faLanguage} className='ml-2' />
                    </li>
                    <li className='cursor-pointer' onClick={() => ThemeHandler(theme == 'light' ? 'dark' : 'light')}>
                        theme
                        <FontAwesomeIcon icon={theme == 'light' ? faSun : faMoon} className='ml-2' />
                    </li>
                    <li style={{color:color}} className={`rounded-sm text-white px-1 uppercase`}>
                        <Link to={location.pathname.includes("login") ? "signup" : "login"} className='text-[12px]'>
                            <button className='text-[12px] p-1 w-[60px]'>
                                {location.pathname.includes("login") ? "signup" : "login"}
                            </button>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}