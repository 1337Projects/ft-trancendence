
import { Alert, OauthItems } from "./login"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBirthdayCake, faKey, faMailBulk, faUser } from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { ColorContext } from "../../Contexts/ThemeContext"

export function Input({icon, label, placeholder, type, handler}) {
    return (
        <>
            <label className="text-[10px] flex justify-between px-2 mt-4" htmlFor="email">{label} : <FontAwesomeIcon icon={icon} /></label>
            <input
                className="mt-1 w-full text-lightText outline-none text-[10px] px-2 rounded h-8 border-gray-300 border-[.5px]" 
                type={type} 
                id={label} 
                placeholder={placeholder}
                onChange={(e) => handler({[label]: e.target.value})}
            />
        </>
    )
}

export default function Signup() {
    const [alert, setAlert] = useState(null)
    const color = useContext(ColorContext)
    const [data, setData] = useState({username:"", email:"", password:""})
    const navigate = useNavigate()

    function dataHandler(auth_data) {
        setData({...data, ...auth_data})
    }

    function registerData() {
        if (data.username == "") {
            setAlert({level:"warning", detail:"empty username is not valid"})
        } else if (data.email == "") {
            setAlert({level:"warning", detail:"email cannot be empty"})
        } else if (data.password == "") {
            setAlert({level:"warning", detail:"password required !!!"})
        } else {
            console.log(data)
            navigate("../confirme")
        }
    }

    return (
        <>
        <div className="heading w-full p-1 text-center">
            {alert && <Alert data={alert} dataHandler={setAlert} />}
            <h1 className="text-[40px] font-semibold capitalize">Hello</h1>
            <p className="text-[8px]">Lorem ipsum dolor sit amet elit.</p>
        </div>
        <div className="w-1/2 max-w-[500px] mx-auto mt-6">
            <OauthItems />
            <div className="login-form grid mt-6 w-full">
                <Input handler={dataHandler} icon={faUser} label="username" placeholder="jhon doe" type="text" />
                <Input handler={dataHandler} icon={faMailBulk} label="email" placeholder="example@gmail.com" type="email" />
                <Input handler={dataHandler} icon={faKey} label="password" placeholder="***********" type="password" />
                <button onClick={registerData} style={{background:color}} className="mt-6 text-white uppercase rounded text-[10px] h-8 flex w-full justify-center items-center">
                    Create Account
                </button>
                <p className="text-[14px] mt-6">You already have account <Link style={{color:color}} to="../login" className=" uppercase ">Login</Link> </p>
            </div>
        </div>
       </> 
    )
}