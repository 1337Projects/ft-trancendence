import React, { useContext, useState } from "react"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { useParams } from "react-router-dom"
import { UserContext } from "../../Contexts/authContext"
import { FiSend } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { ChatContext } from "@/Contexts/ChatContext";
import { chatSocket } from "@/sockets/chatSocket";
import { v4 as uuidv4 } from 'uuid';



export default function ChatInput() {

    const { color, theme } = useContext(ApearanceContext) || {}
    const { authInfos } = useContext(UserContext) || {}
    const { userData } = useContext(ChatContext) || {}
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
        }
        setText('')
    }

    function inputHandler(e : React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == 'Enter') {
            sendMessage()
        }
    }

    function sendGameInvite() {
        const id = uuidv4()
        const data = {
            "from" : authInfos?.username,
            "partner": user,
            "type" : "game_invite",
            "content": "",
            "link":  `${import.meta.env.VITE_API_URL}dashboard/game/waiting/room/private/ping-pong/?room_id=${authInfos?.username}-${user}${id}`,
            "event" : "new_message"
        }
        chatSocket.sendMessage(data)
    }


  

    return (
        <div className={`w-full h-full flex items-center border-t-[1px] ${theme == 'light' ? "border-black/20" : "border-white/20"}`}>
            {
                userData?.freindship?.status == 'blocked' ?
                <div className="w-full h-full flex justify-center items-center text-xs capitalize">you cant send messages</div> :
                <div className='w-full h-1/2 relative' >
                    <div className="flex w-full max-w-[500px] mx-auto h-full items-center">
                        <div
                            className={`text-[14pt] mr-2 flex justify-center items-center ${theme == 'light' ? "bg-gray-950 text-white" : "bg-black text-white border-[.2px] border-white/40"} rounded-full h-full w-[45px]`} 
                            onClick={sendGameInvite}>
                            <IoGameControllerOutline />
                        </div>
                        <div className={`input w-full h-full rounded-full px-2 pl-4 text-[16pt] flex items-center justify-between ${theme == 'light' ? "bg-gray-950 text-white" : "bg-black border-[.2px] border-white/40 text-white"} `}>
                            <input 
                                onKeyUp={inputHandler} 
                                value={text}  
                                type="text"  
                                placeholder={`Message @${user}`} 
                                onChange={(e) => setText(e.target.value)} 
                                className="w-full ml-2 text-[10pt] bg-transparent focus:outline-none" 
                            />
                            <div className="px-1" onClick={() => sendMessage()}>
                                <div style={{background : color}} className="px-2 text-white w-[30px] flex jusity-center items-center h-[28px] rounded-full">
                                    <FiSend />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}