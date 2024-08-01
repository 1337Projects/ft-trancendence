
import { OauthItems } from "./login"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBirthdayCake, faKey, faMailBulk, faUser } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { ColorContext } from "../../Contexts/ThemeContext"

export function Input({icon, label, placeholder, type}) {
    return (
        <>
            <label className="text-[10px] flex justify-between px-2 mt-4" htmlFor="email">{label} : <FontAwesomeIcon icon={icon} /></label>
            <input className="mt-1 text-lightText outline-none text-[10px] px-2 rounded h-8 border-gray-300 border-[.5px]" type={type} id={label} placeholder={placeholder} />
        </>
    )
}

export default function Signup() {
    const color = useContext(ColorContext)
    return (
        <>
        <div className="heading w-full p-1 text-center">
            <h1 className="text-[40px] font-semibold capitalize">Hello</h1>
            <p className="text-[8px]">Lorem ipsum dolor sit amet elit.</p>
        </div>
        <div className="w-1/2 max-w-[500px] mx-auto mt-6">
            <OauthItems />
            <div className="login-form grid mt-6 w-full">
                <Input icon={faUser} label="username" placeholder="jhon doe" type="text" />
                <Input icon={faMailBulk} label="email" placeholder="example@gmail.com" type="email" />
                <Input icon={faKey} label="password" placeholder="***********" type="password" />
                <Input icon={faBirthdayCake} label="birthday" placeholder="" type="date" />
                <Link to="../../dashboard/game" style={{background:color}} className="mt-4 text-white rounded text-[10px] h-8 flex w-full justify-center items-center">
                    Create Account
                </Link>
                <p className="text-[10px] mt-4">You already have account <Link to="../login" className="text-blue-500">Login</Link> </p>
            </div>
        </div>
       </> 
    )
}