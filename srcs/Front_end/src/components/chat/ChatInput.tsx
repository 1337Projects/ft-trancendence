import React, { useContext, useState } from "react"
import { FaImages } from "react-icons/fa"
import { MdEmojiEmotions } from "react-icons/md"
import { RiMailSendFill } from "react-icons/ri"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import Socket from '../../socket'
import { useParams } from "react-router-dom"
import { UserContext } from "../../Contexts/authContext"

export default function ChatInput() {

    const { color } = useContext(ApearanceContext) || {}
    const { authInfos } = useContext(UserContext) || {}
    const [ text, setText ] = useState('');
    const { user } = useParams()
     
    function sendMessage() {
        // if (file) {
            // console.log(file)
            // const reader = new FileReader();
            
            // reader.onload = () => {

            //     const binaryData = reader.result

            //     const metadata = JSON.stringify({
            //         "from" : authInfos?.username,
            //         "to" : user,
            //         "file" : file.name,
            //         "content" : text
            //     })

            //     const bufferData = new TextEncoder().encode(metadata)

            //     const metadataLengthBuffer = new ArrayBuffer(4);
            //     new DataView(metadataLengthBuffer).setUint32(0, bufferData.byteLength, true);
  
            //     let buffer = new Uint8Array(metadataLengthBuffer.byteLength + bufferData.byteLength + binaryData.byteLength)
            //     buffer.set(new Uint8Array(metadataLengthBuffer), 0)
            //     buffer.set(new Uint8Array(bufferData), metadataLengthBuffer.byteLength)
            //     buffer.set(new Uint8Array(binaryData), metadataLengthBuffer.byteLength + bufferData.byteLength)

            //     Socket.socket.send(buffer.buffer);
            // };
            // reader.readAsArrayBuffer(file); 
            // setShowFileInput(false)
        // } else {
        if (text != '') {
            const data = {
                "from" : authInfos?.username,
                "to": user,
                "content": text,
                "event" : "new_message"
            }
            Socket.sendMessage(data)
        // }
        }
        // setShowEmoji(false);
        setText('');
    }

    function inputHandler(e : React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == 'Enter')
            sendMessage()
    }

    return (
        <div className=" w-full h-full flex items-center">
            <div className=' w-full h-1/2 max-w-[490px] relative mx-auto' >
                
                <div className="input w-full h-full rounded-full px-2  text-[16pt] flex items-center justify-between bg-gray-800 text-white">

                    <input onKeyUp={inputHandler} value={text}  type="text"  placeholder="Message ..." onChange={(e) => setText(e.target.value)} className="pl-4 w-[70%] sm:w-[80%] text-[10pt] bg-transparent focus:outline-none" />
                    
                    {/* <MdEmojiEmotions onClick={() => setShowEmoji(prev => !prev)}  /> */}
                    {/* <div className='w-10 cursor-pointer relative flex items-center justify-center'>
                        <input type="file" onChange={(e) => setFile(e.target.files)} className='opacity-0 w-8 absolute '/>
                        <FaImages className='cursor-pointer' />
                    </div> */}

                    <div style={{background:color}} onClick={sendMessage} className='w-[30px] h-[30px] text-[12pt] rounded-full flex justify-center cursor-pointer items-center'>
                        <RiMailSendFill />
                    </div>
                </div>
            </div>
        </div>
    )
}