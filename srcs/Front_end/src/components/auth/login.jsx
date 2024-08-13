
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle , faAirbnb } from '@fortawesome/free-brands-svg-icons'
import { faMailBulk, faKey } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { ColorContext } from "../../Contexts/ThemeContext";
import { Input } from './signup';

export function OauthItems() {
    const color = useContext(ColorContext)

    function googleAuth() {
        fetch('http://localhost:8000/test')
        .then(res => res.json())
        .then(data => {
            window.location.href = data.url
        })
        .catch(err => console.log(err))
    }

    return (
        <>
            <div onClick={googleAuth} className="login-google cursor-pointer text-[8px] uppercase h-8 border-blue-500/80 border-[1px] w-1/1 rounded flex items-center justify-center">
                <h5 className="mr-2">continue with google account</h5>
                <i><FontAwesomeIcon icon={faGoogle} /></i>
            </div>
            <div className="login-42 cursor-pointer text-[8px] uppercase h-8 mt-4 border-red-500/80 border-[1px] rounded w-1/1 flex items-center justify-center">
                <h5 className="mr-2">continue with 42 account</h5>
                <i><FontAwesomeIcon icon={faAirbnb} /></i>
            </div>
        </>
    )
}

function Alert({color}) {
    return (
        <div style={{borderColor:color}} className='border-[1px] bg-orange-200 absolute top-10 right-0 rounded-l-md flex flex-col min-h-12 h-fit w-fit min-w-[300px]'>
            <div className='p-4 text-[10px]'>
                Error: empty email please entre a valid email !
            </div>
            {/* <progress className='rounded-sm h-2 min-w-[300px] bottom-0 absolute' value="10" max="100"></progress> */}
        </div>
    )
}

export default function Login() {
    const color = useContext(ColorContext)
    const [alert, setAlert] = useState(null)
    return (
       <>
       {alert !== null && 
         <Alert color={color} />
       }
        <div className="heading w-full p-1 text-center">
            <h1 className="text-[40px] font-semibold capitalize">welcome back</h1>
            <p className="text-[8px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, cumque.</p>
        </div>
        <div className="w-1/2 max-w-[500px] mx-auto mt-6">
            <OauthItems />
            <div className="login-form grid mt-6 w-full">
                <Input icon={faMailBulk} label="email" placeholder="example@gmail.com" type="email" />
                <Input icon={faKey} label="password" placeholder="***********" type="password" />
            <a className="text-[10px] mt-4" href="#">Forget password ?</a>
                <Link to="../../dashboard/game" style={{background:color}} className="mt-4 text-white rounded text-[10px] h-8 flex w-full justify-center items-center">
                    LOGIN
                </Link>
                <p className="text-[10px] mt-4">You already have account <Link to="../signup" className="text-blue-500">signup</Link> </p>
            </div>
        </div>
       </> 
    )
}