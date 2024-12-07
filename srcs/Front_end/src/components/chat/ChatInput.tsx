import React, { useContext, useState } from "react"
import { FaKeyboard, FaRegSmile } from "react-icons/fa"
import Emojies from './Emojies';
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { chatSocket } from '../../socket'
import { useParams } from "react-router-dom"
import { UserContext } from "../../Contexts/authContext"
import { FiSend } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";


export default function ChatInput() {

    const { color, theme } = useContext(ApearanceContext) || {}
    const { authInfos } = useContext(UserContext) || {}
    const [ text, setText ] = useState('');
    const { user } = useParams()
     
    function sendMessage() {
        if (text != '') {
            const data = {
                "from" : authInfos?.username,
                "partner": user,
                "content": text,
                "event" : "new_message"
            }
            chatSocket.sendMessage(data)
            console.log('sent')
        }
        setText('');
    }

    function inputHandler(e : React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == 'Enter')
            sendMessage()
    }

    function sendGameInvite() {
        console.log('invite')
    }

    const [emojie, setEmojie] = useState<boolean>(false)

    return (
        <div className=" w-full h-full flex items-center">
            <div className=' w-full h-1/2 max-w-[490px] relative mx-auto' >
                {
                    emojie && <Emojies inputText={text} TextInputHandler={setText} />
                }
                <div className={`input w-full h-full rounded-full px-2 pl-4 text-[16pt] flex items-center justify-between ${theme == 'light' ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-950"} `}>
                    <div onClick={() => setEmojie(prev => !prev)}>
                        { emojie ? <FaKeyboard /> : <FaRegSmile /> }
                    </div>
                    <div className="mx-4 text-[20pt]" onClick={sendGameInvite}>
                        <IoGameControllerOutline />
                    </div>
                    <input 
                        onKeyUp={inputHandler} 
                        value={text}  
                        type="text"  
                        placeholder="Message ..." 
                        onChange={(e) => setText(e.target.value)} 
                        className="w-[70%] sm:w-[80%] text-[10pt] bg-transparent focus:outline-none" 
                    />
                    <div style={{background:color}} onClick={sendMessage} className='w-[40px] h-[35px] flex justify-center items-center text-[12pt] text-white rounded-full'>
                        <FiSend />
                    </div>
                </div>
            </div>
        </div>
    )
}