
import {useContext, useState, useRef, useEffect} from 'react'
import {ColorContext, ThemeContext} from '../../Contexts/ThemeContext'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from 'react-router-dom';

import { 
    faArrowLeft, 
    faCheckDouble, 
    faCloudArrowUp, 
    faEllipsisVertical, 
    faFaceSmile, 
    faKeyboard, 
    faPaperPlane, 
    faPaperclip,
} from '@fortawesome/free-solid-svg-icons';
import Emojies from './Emojies';
import { authContext } from '../../Contexts/authContext';
import Socket from '../../socket'

function UserMessage({m}) {
    const [time, setTime] = useState('')
    useEffect(() => {
        const timer = setTimeout(() => {
            let date = new Date(m.created_at);
            const hours = date.getUTCHours()
            const mins = date.getUTCMinutes()
            setTime(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
        }, 300)
        return () => clearTimeout(timer)
    }, [])
    return (
        <li className="mt-4 flex items-start justify-end">
            <div className="bg-gray-700/90 border-[.2px] border-white/20 text-white min-w-[100px] max-w-[50%] flex-wrap rounded-lg">
                {m.image != '' && <img src={m.image} className='w-[200px] h-[220px] rounded-t-md' />}
                <h1 className="text-[16px] font-noto py-1 px-2">{m.message}</h1>
                <p className="text-[10px] pr-2 text-right">{time}</p>
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
        <li className="mt-4 h-fit flex items-start justify-start">
            <img src={m?.sender?.profile?.image} className="bg-white w-[40px] shadow-sm rounded-full mr-4" alt="" />
            <div className="bg-gray-700/90 border-[.2px] border-white/20 text-white min-w-[100px] max-w-[50%] flex-wrap rounded-lg">
                {m.image != '' && <img src={m.image} className='w-[200px] h-[220px] rounded-t-md' />}
                <h1 className="text-[16px] font-noto py-1 px-2">{m.message}</h1>
                <p className="text-[10px] pr-2 text-right">{time}</p>
            </div>
        </li>
    )
}

export default function Conversation() {
    const theme = useContext(ThemeContext)
    const color = useContext(ColorContext)
    const [messages, setMessages] = useState([])
    const [showEmoji, setShowEmoji] = useState(false)
    const [showFileInput, setShowFileInput] = useState(false)
    const [text, setText] = useState('');
    const cnv = useRef(null)
    const {user} = useParams()
    const tokens = useContext(authContext)
    const [userData, setUserData] = useState({})
    const [file, setFile] = useState(null)

    useEffect(() => {

        const timer = setTimeout(() => {
            Socket.connect("ws://localhost:8000/ws/chat/abc/")
            Socket.addCallback("setData", setMessages)
            Socket.addCallback("setUser", setUserData)
            Socket.sendMessage({
                "from" : tokens.username,
                "to": user,
                "event" : "fetch_messages"
            })
        }, 300)
        return () => clearTimeout(timer)
    }, [])
    
    function sendMessage() {
        if (file) {
            const reader = new FileReader();
            
            reader.onload = () => {

                const binaryData = reader.result

                const metadata = JSON.stringify({
                    "from" : tokens.username,
                    "to" : user,
                    "file" : file.name,
                    "content" : text
                })

                const bufferData = new TextEncoder().encode(metadata)

                const metadataLengthBuffer = new ArrayBuffer(4);
                new DataView(metadataLengthBuffer).setUint32(0, bufferData.byteLength, true);
  
                let buffer = new Uint8Array(metadataLengthBuffer.byteLength + bufferData.byteLength + binaryData.byteLength)
                buffer.set(new Uint8Array(metadataLengthBuffer), 0)
                buffer.set(new Uint8Array(bufferData), metadataLengthBuffer.byteLength)
                buffer.set(new Uint8Array(binaryData), metadataLengthBuffer.byteLength + bufferData.byteLength)

                Socket.socket.send(buffer.buffer);
            };
            reader.readAsArrayBuffer(file); 
            setShowFileInput(false)
        } else {

            const data = {
                "from" : tokens.username,
                "to": user,
                "content": text,
                "event" : "new_message"
            }
            Socket.sendMessage(data)
        }
        setShowEmoji(false);
        setText('');
    }

    return (
        <div className={`
            conversations 
            ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} 
            shadow-sm rounded-sm flex justify-center p-1 flex-grow`
        }>
            <div className="relative w-full">
                <div className="header  w-full px-10 h-[60px] flex justify-between items-center mt-2">
                    <div className="avatar w-[95%] h-full flex justify-start items-center">
                        <Link className="w-3 h-3 p-2 flex items-center justify-center cursor-pointer" to="/dashboard/chat">
                            <FontAwesomeIcon className="text-[14px] " icon={faArrowLeft} />
                        </Link>
                        <img src={userData?.profile?.image} className="bg-white w-[35px] h-[35px] rounded-full mx-4" alt="" />
                        <div className="infos text-[12px]">
                            <h1 className="font-bold">{userData?.username}</h1>
                            <p className="text-[8px]">last seen {data.date}</p>
                        </div>
                    </div>
                    <FontAwesomeIcon className="text-[12px]" icon={faEllipsisVertical} />
                </div>
                <div className="body flex justify-center">
                    {messages.length ? 
                        <ul ref={cnv} className="mt-10 px-2 max-w-[600px] w-full overflow-auto" style={{height:'calc(100vh - 300px)'}}>
                        {messages.map(m => {
                                if (m?.sender?.username !== user)
                                    return <UserMessage key={m.id} m={m} />
                                return <FromMessage key={m.id} m={m} />
                        })} 
                        </ul>
                    : <h1 className="top-[50%] translate-y-[-50%] text-[15px] capitalize absolute"><span className="text-[20px] mr-2">😕</span>no messages yet</h1>}
                </div>
                <div className="actions mt-2 absolute w-full h-[40px] flex justify-center ">
                    <div className=' w-full max-w-[600px] relative' >
                        {showEmoji && <Emojies TextInputHandler={setText} inputText={text} />}
                        {showFileInput && 
                            <div className='absolute top-[-130px] w-2/5 right-1 rounded-md h-[120px]'>
                                <div className='border-[.1px] border-white/20 w-full h-full bg-gray-700/50 rounded-md flex justify-center items-center'>
                                    <div className='text-center px-2'>
                                        <FontAwesomeIcon className='text-[20px]' icon={faCloudArrowUp} />
                                        <input onChange={(e) => setFile(e.target.files[0])} className='w-[140px] text-[10px] ml-[50%] mt-4 translate-x-[-50%]' type="file" name="" />
                                    </div>
                                </div>
                            </div>}
                        <div className="input  rounded-full p-1 px-2 mx-10 text-[16px] h-full flex items-center justify-between bg-gray-700/50 text-white">
                            <FontAwesomeIcon className="cursor-pointer" icon={!showEmoji ? faFaceSmile : faKeyboard} onClick={() => setShowEmoji(!showEmoji)} />
                            <input style={{wordWrap: 'break-word'}} onKeyUp={(e) => {
                                if (e.key == 'Enter')
                                    sendMessage()
                            }} value={text}  type="text"  placeholder="message..." onChange={(e) => setText(e.target.value)} className="w-[80%] bg-transparent text-[12px] focus:outline-none" />
                            <FontAwesomeIcon onClick={() => setShowFileInput(prev => !prev)} className="cursor-pointer" icon={faPaperclip} />
                            <div style={{background:color}} className='w-[30px] h-[30px] rounded-full flex justify-center items-center'>
                                <FontAwesomeIcon  className="cursor-pointer text-[14px]  translate-x-[-2px]" icon={faPaperPlane} onClick={sendMessage} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const data = {
    id:0,
    display: true, 
    name: 'aamhamdi normal', 
    img:'/aamhamdi1.jpeg', 
    message:'hello', 
    date:'19:48', 
    type:'user', 
    seen:false, 
    archived:false,
    conv : [
        {id:0, message : 'Lorem ipsum dolor sit amet', from: 'aamhamdi normal', seen:false, date:'19:23'},
        {id:1, message : 'dolor sit amet.', from: 'nmaazouz', seen:false, date:'19:24'},
        {id:2, message : 'Lorem ipsum dolor sit amet', from: 'aamhamdi normal', seen:false, date:'19:23'},
        {id:3, message : 'dolor sit amet.', from: 'nmaazouz', seen:false, date:'19:24'},
        {id:4, message : 'dolor sit amet.', from: 'nmaazouz', seen:false, date:'19:24'},
        {id:5, message : 'Lorem ipsum dolor sit amet', from: 'aamhamdi normal', seen:false, date:'19:23'},
        {id:6, message : 'Lorem ipsum dolor sit amet', from: 'nmaazouz normal', seen:false, date:'19:23'},
        {id:7, message : 'Lorem ipsum dolor sit amet', from: 'aamhamdi normal', seen:false, date:'19:23'},
        {id:8, message : 'Lorem ipsum dolor sit amet', from: 'nmaazouz normal', seen:false, date:'19:23'},
        {id:9, message : 'Lorem ipsum dolor sit amet', from: 'aamhamdi normal', seen:false, date:'19:23'},
        {id:10, message : 'Lorem ipsum dolor sit amet', from: 'nmaazouz normal', seen:false, date:'19:23'},
        {id:11, message : '😁😁😁😁😁', from: 'aamhamdi normal', seen:false, date:'19:23'},
    ]
}

