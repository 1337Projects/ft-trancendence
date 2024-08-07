import { faConfluence } from "@fortawesome/free-brands-svg-icons";
import { Input } from "./signup";
import { useContext } from "react";
import { ColorContext } from "../../Contexts/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";




export default function ConfirmeEmail() {
    const color = useContext(ColorContext)
    return (
        <div className="p-2 h-[100vh] flex justify-center items-center relative">
            <Link to="../signup">
                <button className="absolute top-10 left-10 h-10 flex items-center">
                    <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
                    <span className="text-[12px]">back</span>
                </button>
            </Link>
            <div className="w-[70%] h-[50vh]">
                <div className="text-center p-4">
                    <h1 className="text-[18px] uppercase font-bold">Confirme Email</h1>
                    <p className="text-[10px]">Lorem ipsum dolor sit amet consectetur.</p>
                </div>
                <div className="p-4">
                    <div className="w-full">
                        <Input icon={faConfluence} label="confirm" placeholder="1234" type="number" />
                    </div>
                    <p className="mt-4 text-[10px]">i didnt recive an email yet ! 
                        <span style={{color:color}} className="text-[12px] uppercase cursor-pointer"> resend 09:00</span>
                    </p>
                    <button style={{background:color}} className="p-1 uppercase w-full rounded-sm mt-4">confirme</button>
                </div>
            </div>
        </div>
    )
}