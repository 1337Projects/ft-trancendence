
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle , faAirbnb } from '@fortawesome/free-brands-svg-icons'
import { faMailBulk, faKey, faClose, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link, json, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ColorContext } from "../../Contexts/ThemeContext";
import { Input } from './signup';
import axios from 'axios'
import { authContextHandler } from '../../Contexts/authContext';

export function OauthItems() {
    const color = useContext(ColorContext)


    function GoogleOauthHandler() {
        fetch('http://localhost:8000/auth/google_auth/')
        .then(res => res.json())
        .then(res => {
            console.log(res)
            window.location.href = res.url;
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <>
            <div onClick={GoogleOauthHandler} className="login-google cursor-pointer text-[8px] uppercase h-8 border-blue-500/80 border-[1px] w-1/1 rounded flex items-center justify-center">
                <h5 className="mr-2">continue with google account</h5>
                <i><FontAwesomeIcon icon={faGoogle} /></i>
            </div>
            <div className="login-42 cursor-pointer text-[8px] uppercase h-8 mt-4 border-red-500/80 border-[1px] rounded w-1/1 flex items-center justify-center">
                <h5 className="mr-2">continue with 42 account</h5>
                <i><FontAwesomeIcon icon={faAirbnb} /></i>
            </div>
            <hr className='mt-10' />
        </>
    )
}

export function Alert({data, dataHandler}) {
    useEffect(() => {
        const timer = setTimeout(() => dataHandler(null), 3000)
        return () => clearTimeout(timer)
    })
    const ccolor = data.level == "error" ? "#ef4444cc" : "#ff9800"
    return (
        <div style={{borderColor:ccolor, background:ccolor}} className={`border-l-[3px] w-fit min-w-[280px] absolute top-6 rounded-sm left-[50%] translate-x-[-50%]`}>
            <div className='p-4 text-[10px] text-white'>
                <span className='font-bold uppercase'>Error:</span> {data.detail}
            </div>
            <button
                className='text-white absolute top-1 text-[12px] right-2'
                onClick={() => dataHandler(null)}
            >
                <FontAwesomeIcon icon={faClose} />
            </button>
        </div>
    )
}

export default function Login() {
    const color = useContext(ColorContext)
    const [alert, setAlert] = useState(null)
    const [data, setData] = useState({username:"", password:""})
    const navigate = useNavigate()
    const authHandler = useContext(authContextHandler)

    function input_handler(auth_data) {
        setData({...data, ...auth_data})
    }

    function login_handler() {
        if (data.username == "") {
            setAlert({detail:"Empty username is not valid", level : "warning"})
        }
        else if (data.password == "") {
            setAlert({detail:"Empty password not valid", level: "warning"})
        }
        else {
            axios({
                method:'post',
                url:'http://localhost:8000/api/token/',
                data
            }).then(res => {
                authHandler(JSON.stringify(res.data))
                navigate("../../dashboard/game")
            }).catch(err => {
                setAlert({...err.response.data, level : "error"})
            })
        }
    }

    return (
       <>
        {alert && <Alert data={alert} dataHandler={setAlert} />}
        <div className="heading w-full p-1 text-center">
            <h1 className="text-[40px] font-semibold capitalize">welcome back</h1>
            <p className="text-[8px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, cumque.</p>
        </div>
        <div className="w-1/2 max-w-[500px] mx-auto mt-6">
            <OauthItems />
            <div className="login-form grid mt-6 w-full">
                <Input icon={faUser} label="username" handler={input_handler} placeholder="jhon doe" type="text" />
                <Input icon={faKey} label="password" handler={input_handler} placeholder="***********" type="password" />
            <a className="text-[10px] mt-6" href="#">Forget password ?</a>
                <div onClick={login_handler} style={{background:color}} className="mt-4 text-white rounded text-[10px] h-8 flex w-full justify-center items-center">
                    LOGIN
                </div>
                <p className="text-[14px] mt-6">You already have account <Link style={{color:color}} to="../signup" className="uppercase">signup</Link> </p>
            </div>
        </div>
       </> 
    )
}