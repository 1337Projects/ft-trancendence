
import { OauthProviders } from "./Oauth"
import { Link, useNavigate } from "react-router-dom"
import React, { useContext, useState } from "react"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { FaRegUser } from "react-icons/fa"
import { TbPasswordFingerprint } from "react-icons/tb"
import { MdAlternateEmail } from "react-icons/md"


export function Input({icon, label, placeholder, type, handler}) {
    return (
        <div>
            <label className="text-[10px] capitalize w-full flex justify-between mb-1 mt-4" htmlFor="email">{label} : {icon} </label>
            <input
                className="mt-1 w-full text-lightText outline-none text-[10px] px-2 rounded h-8 border-gray-300 border-[.5px]" 
                type={type} 
                id={label} 
                placeholder={placeholder}
                onChange={(e) => handler({[label]: e.target.value})}
            />
        </div>
    )
}

type SignupData = {
    username : string,
    email : string,
    password : string,
    first_name : string,
    last_name : string,
}

export default function Signup() {
    const appearence = useContext(ApearanceContext)
    const [data, setData] = useState<SignupData | null>(null)
    const navigate = useNavigate()

    function dataHandler(auth_data) {
        setData({...data, ...auth_data})
    }

    function registerData() {
        fetch('http://localhost:8000/api/auth/signup/', {
            headers : {
                "Content-Type": "application/json",
            },
            body : JSON.stringify(data),
            credentials: 'include',
            method: 'POST',
        }).then(res => res.json())
        .then(data => {
            if (data.id) {
                navigate(`../confirme/${data.id}`)
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <>
        <div className="heading w-full p-1 text-center">
            <h1 className="text-[40px] font-semibold capitalize">Hello</h1>
            <p className="text-[8px]">Lorem ipsum dolor sit amet elit.</p>
        </div>
        <div className="w-1/2 max-w-[500px] mx-auto mt-6">
            <OauthProviders />
            <div className="login-form grid mt-6 w-full">
                <div className="w-full flex justify-between">
                    <Input handler={dataHandler} icon={<FaRegUser />} label="first_name" placeholder="jhon" type="text" />
                    <Input handler={dataHandler} icon={<FaRegUser />} label="last_name" placeholder="doe" type="text" />
                </div>
                <Input handler={dataHandler} icon={<FaRegUser />} label="username" placeholder="jhon doe" type="text" />
                <Input handler={dataHandler} icon={<MdAlternateEmail />} label="email" placeholder="example@gmail.com" type="email" />
                <Input handler={dataHandler} icon={<TbPasswordFingerprint />} label="password" placeholder="***********" type="password" />
                <button onClick={registerData} style={{background:appearence?.color}} className="mt-6 text-white uppercase rounded text-[10px] h-8 flex w-full justify-center items-center">
                    Create Account
                </button>
                <p className="text-[14px] mt-6">You already have account <Link style={{color:appearence?.color}} to="../login" className=" uppercase ">Login</Link> </p>
            </div>
        </div>
       </> 
    )
}