import { faConfluence } from "@fortawesome/free-brands-svg-icons";
import { Input } from "./signup";
import { useContext, useState } from "react";
import { ColorContext } from "../../Contexts/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authContextHandler } from "../../Contexts/authContext";




export default function ConfirmeEmail() {
    const color = useContext(ColorContext)
    const {id} = useParams()
    const [code, setCode] = useState(null)
    const navigate = useNavigate()
    const authHandler = useContext(authContextHandler)
    function ConfirmeHandler() {
        fetch('http://localhost:8000/api/auth/confirme/', {
            headers : {
                "Content-Type": "application/json",
            },
            method:'POST',
            body: JSON.stringify({"code" : code.confirm, id}),
            credentials : 'include'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.status == 200) {
                authHandler(data.access)
                navigate('../../dashboard/profile')
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="p-2 h-[100vh] flex justify-center items-center relative">
            <Link to="../signup">
                <button className="absolute top-10 right-10 h-10 flex items-center">
                    <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
                    {/* <span className="text-[12px]">back</span> */}
                </button>
            </Link>
            <div className="w-[70%] h-[50vh]">
                <div className="text-center p-4">
                    <h1 className="text-[18px] uppercase font-bold">Confirme Email</h1>
                    <p className="text-[10px]">Lorem ipsum dolor sit amet consectetur.</p>
                </div>
                <div className="p-4">
                    <div className="w-full">
                        <Input handler={setCode} icon={faConfluence} label="confirm" placeholder="1234" type="text" />
                    </div>
                    <p className="mt-4 text-[12px] capitalize">i didnt recive an email yet ! 
                        <span style={{color:color}} className="uppercase cursor-pointer"> resend 09:00</span>
                    </p>
                    <button onClick={ConfirmeHandler} style={{background:color}} className="text-white p-1 uppercase w-full rounded-sm mt-4">confirme</button>
                </div>
            </div>
        </div>
    )
}