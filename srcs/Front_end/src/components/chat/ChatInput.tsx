import React, { useContext, useState } from "react"
import { FaKeyboard, FaRegSmile } from "react-icons/fa"
import Emojies from './Emojies';
import { ApearanceContext } from "../../Contexts/ThemeContext"
import Socket from '../../socket'
import { useParams } from "react-router-dom"
import { UserContext } from "../../Contexts/authContext"
import { FiSend } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";


export default function ChatInput() {

    const { color } = useContext(ApearanceContext) || {}
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
            Socket.sendMessage(data)
            console.log('sent')
        }
        setText('');
    }

    function inputHandler(e : React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == 'Enter')
            sendMessage()
    }

    const [emojie, setEmojie] = useState<boolean>(false)

    return (
        <div className=" w-full h-full flex items-center">
            <div className=' w-full h-1/2 max-w-[490px] relative mx-auto' >
                {
                    emojie && <Emojies inputText={text} TextInputHandler={setText} />
                }
                <div className="input w-full h-full rounded-full px-4 text-[16pt] flex items-center justify-between bg-gray-800 text-white">
                    <div onClick={() => setEmojie(prev => !prev)}>
                        { emojie ? <FaKeyboard /> : <FaRegSmile /> }
                    </div>
                    <div className="mx-4 text-[20pt]">
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
                    <div style={{background:color}} onClick={sendMessage} className='w-[30px] h-[30px] text-[12pt] rounded-full flex justify-center cursor-pointer items-center'>
                        <FiSend />
                    </div>
                </div>
            </div>
        </div>
    )
}