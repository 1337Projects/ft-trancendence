
import React, {useContext, useState, useRef, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom';
import Emojies from './Emojies';
import Socket from '../../socket'
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { UserContext } from '../../Contexts/authContext';
import { FaArrowLeft, FaEllipsisV, FaImages } from 'react-icons/fa';
import { MdEmojiEmotions } from "react-icons/md";
import { RiMailSendFill } from "react-icons/ri";
import { UserType } from '../../Types';

function UserMessage({m}) {
    const [time, setTime] = useState('')
    useEffect(() => {
        const timer = setTimeout(() => {
            let date = new Date(m?.created_at);
            const hours = date.getUTCHours()
            const mins = date.getUTCMinutes()
            setTime(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
        }, 300)
        return () => clearTimeout(timer)
    }, [])
    return (
        <li  className="mt-4 flex items-start justify-end">
            <div>
                <div  className=" border-[.2px] bg-gray-800 backdrop-blur-xl border-white/20 text-white rounded-[30px] p-1">
                    {/* {m?.image != '' && <img src={m?.image} className='w-[200px] h-[220px] rounded-t-md' />} */}
                    <h1 className="text-[14px] break-words max-w-[300px] min-w-[100px] p-2">{m?.message}</h1>
                </div>
                <p className="text-[8px] mr-4 py-1 text-right">{time}</p>
            </div>
            <img src={m?.sender?.profile?.image} className="w-[40px] bg-white shadow-sm rounded-full ml-4" alt="" />
        </li>
    )
}

function FromMessage({m}) {
    const [time, setTime] = useState('')
    useEffect(() => {
        const timer = setTimeout(() => {
            let date = new Date(m.created_at);
            console.log(date.getUTCMinutes())
            const hours = date.getUTCHours()
            const mins = date.getUTCMinutes()
            setTime(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
        }, 300)
        return () => clearTimeout(timer)
    }, [])
    return (
        <li  className="mt-4 flex items-start justify-start">
            <img src={m?.sender?.profile?.image} className="w-[40px] bg-white shadow-sm rounded-full mr-4" alt="" />
            <div>
                <div  className=" border-[.2px] bg-gray-800 backdrop-blur-xl border-white/20 text-white rounded-[30px] p-1">
                    {/* {m?.image != '' && <img src={m?.image} className='w-[200px] h-[220px] rounded-t-md' />} */}
                    <h1 className="text-[14px] break-words max-w-[300px] min-w-[100px] p-2">{m?.message}</h1>
                </div>
                <p className="text-[8px] ml-4 py-1 text-left">{time}</p>
            </div>
        </li>
    )
}

export default function Conversation() {
    const {theme, color} = useContext(ApearanceContext) || {}
    const {authInfos} = useContext(UserContext) || {}
    const [messages, setMessages] = useState([])
    const [showEmoji, setShowEmoji] = useState(false)
    const [showFileInput, setShowFileInput] = useState(false)
    const [text, setText] = useState('');
    const cnv = useRef(null)
    const {user} = useParams()
    const [userData, setUserData] = useState<UserType | null>(null)
    const [file, setFile] = useState(null)

    useEffect(() => {

        const timer = setTimeout(() => {
            const partnerId = user;
            const userId = authInfos?.username;
            Socket.connect(`ws://localhost:8000/ws/chat/${userId}/${partnerId}/`)
            Socket.addCallback("setData", setMessages)
            Socket.addCallback("setUser", setUserData)
            Socket.sendMessage({
                "from" : authInfos?.username,
                "to": user,
                "event" : "fetch_messages"
            })
        }, 300)
        return () => clearTimeout(timer)
    }, [user])

    useEffect(() => {
        console.log("my messages" , messages)
    }, [messages])
    
    function sendMessage() {
        if (file) {
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
        } else {

            const data = {
                "from" : authInfos?.username,
                "to": user,
                "content": text,
                "event" : "new_message"
            }
            Socket.sendMessage(data)
        }
        setShowEmoji(false);
        setText('');
    }

    function inputHandler(e) {
        if (e.key == 'Enter')
            sendMessage()
    }

    return (
        <div className=''>
            <div className="relative w-full h-full">
                <div  className={`header backdrop-blur-md  px-4 border-b-[1px] ${theme == 'light' ? "border-black/20" : "border-white/20"}  py-8 w-full h-[60px] flex justify-between items-center`}>
                    <div className="avatar w-[95%] h-full flex justify-start items-center">
                        <Link className="p-2 flex items-center justify-center cursor-pointer" to="/dashboard/chat">
                            <FaArrowLeft />
                        </Link>
                        <img src={userData?.profile?.image} className="bg-white w-[35px] h-[35px] rounded-full mx-4" alt="" />
                        <div className="infos text-[12px]">
                            <h1 className="font-bold text-[11pt]">{userData?.username}</h1>
                            <p className="text-[8pt]">last seen</p>
                        </div>
                    </div>
                    <FaEllipsisV />
                </div>
                <div className="body flex w-full px-2 h-[76vh] sm:h-[80vh] justify-center">
                    {messages?.length ? 
                        <ul ref={cnv} className="mt-10 h-full max-w-[600px] w-full overflow-auto">
                        {messages.map(m => {
                                if (m?.sender?.username !== user)
                                    return <UserMessage key={m?.id} m={m} />
                                return <FromMessage key={m?.id} m={m} />
                        })} 
                        </ul>
                    : <h1 className="top-[50%] translate-y-[-50%] text-[15px] capitalize absolute"><span className="text-[20px] mr-2">😕</span>no messages yet</h1>
                    }
                </div>
                <div className="w-full h-[40px] my-10 px-10 flex justify-center">
                    <div className=' w-full max-w-[490px] relative' >
                        {showEmoji && <Emojies TextInputHandler={setText} inputText={text} />}
                        
                        <div className="input w-full h-[50px]  rounded-full px-2  text-[16pt] flex items-center justify-between bg-gray-800 text-white">

                            <input onKeyUp={inputHandler} value={text}  type="text"  placeholder="Message ..." onChange={(e) => setText(e.target.value)} className="pl-4 w-[70%] sm:w-[80%] text-[10pt] bg-transparent focus:outline-none" />
                            
                            <MdEmojiEmotions onClick={() => setShowEmoji(prev => !prev)}  />
                            <div>
                                <input type="file" className='hidden' />
                                <FaImages className='cursor-pointer' />
                            </div>

                            <div style={{background:color}} className='w-[30px] h-[30px] text-[12pt] rounded-full flex justify-center cursor-pointer items-center'>
                                <RiMailSendFill />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


