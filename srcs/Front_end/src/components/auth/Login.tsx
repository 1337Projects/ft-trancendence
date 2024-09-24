
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { Input } from './Signup';
import { UserContext } from '../../Contexts/authContext';
import { TbPasswordFingerprint } from "react-icons/tb";
import { OauthProviders } from './Oauth';
import { FaRegUser } from "react-icons/fa";


type LoginData = {
    username? : string,
    password? : string
}

export default function Login() {

    const appearence = useContext(ApearanceContext)
    const [data, setData] = useState<LoginData | null>(null)
    const navigate = useNavigate()
    const user = useContext(UserContext)

    function input_handler(auth_data : {username? : string, password? : string}) {
        setData({...data, ...auth_data})
    }

    function login_handler() {
        fetch('http://localhost:8000/api/auth/login/',
            {
                headers : {
                    "Content-Type": "application/json",
                },
                method:'POST',
                credentials: 'include',
                body: JSON.stringify(data)
            },   
        )
        .then(res => res.json())
        .then(data => {
            if (data.status == 300) {
                navigate(`../confirme/${data.id}`)
            }
            if (data.status == 200) {
                user?.setAuthInfos(data.access)
                navigate("../../dashboard/game")
            }
        })
        .catch(err => console.log(err))
        
    }

    return (
       <>
        <div className="heading w-full p-1 text-center">
            <h1 className="text-[40px] font-semibold capitalize">welcome back</h1>
            <p className="text-[8px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, cumque.</p>
        </div>
        <div className="w-1/2 max-w-[500px] mx-auto mt-6">
            <OauthProviders />
            <div className="login-form grid mt-6 w-full">
                <Input icon={<FaRegUser />} label="username" handler={input_handler} placeholder="jhon doe" type="text" />
                <Input icon={<TbPasswordFingerprint />} label="password" handler={input_handler} placeholder="***********" type="password" />
            <a className="text-[10px] mt-6" href="#">Forget password ?</a>
                <div onClick={login_handler} style={{background:appearence?.color}} className="mt-4 text-white rounded text-[10px] h-8 flex w-full justify-center items-center">
                    LOGIN
                </div>
                <p className="text-[14px] mt-6">You already have account <Link style={{color:appearence?.color}} to="../signup" className="uppercase">signup</Link> </p>
            </div>
        </div>
       </> 
    )
}