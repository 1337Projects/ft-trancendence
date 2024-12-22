
import { Outlet, useParams } from "react-router-dom"
import React, { Suspense, useContext, useEffect, useState } from "react"
import ConversationsList, {Friends} from '../components/chat/chat'
import { ApearanceContext } from "../Contexts/ThemeContext"
import { FaBars } from "react-icons/fa"
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { UserContext } from "../Contexts/authContext"
import MyUseEffect from '../hooks/MyUseEffect'
import { chatSocket } from '../socket'
import ChatContextProvider from "../Contexts/ChatContext"
import { MessageType, UserType } from "../Types"


export default function ChatLayout() {
    const { theme } = useContext(ApearanceContext) || {}
    const [menu, setMenu] = useState<Boolean>(false)

    const { user } = useContext(UserContext) || {}
    const [ cnvs , setCnvs ] = useState<any>(null)


    const [ messages, setMessages ] = useState<MessageType[] | null>(null)
    const [ userData, setUserData ] = useState<UserType | null>(null)


    const value = {
        messages,
        setMessages,
        userData,
        setUserData,
    }

    function UpdateConversationsHandler(cnv) {
        setCnvs(prev => [cnv, ...prev.filter(c => c.id != cnv.id)])
    }

    MyUseEffect(() => {
        chatSocket.connect(`ws://localhost:8000/wss/chat/${user?.id}/`)
        chatSocket.addCallback('cnvsHandler', setCnvs)
        chatSocket.addCallback('cnvsUpdate', UpdateConversationsHandler)
        chatSocket.addCallback("setData", setMessages)
        chatSocket.addCallback("setUser", setUserData)
        chatSocket.sendMessage({
            "event" : "fetch_conversations"
        })
    }, [])

    useEffect(() => {
        return () => {
            chatSocket.close();
        }
    }, [])


    return (
        <>
            <div className={` ${theme === 'light' ? " bg-lightItems text-lightText" : "bg-darkItems text-darkText"} w-full h-[calc(100vh-180px)] sm:h-[100vh] mt-2 shadow-sm rounded-sm flex-grow`}>
                <div className="flex w-full h-full ">
                    <div className={`h-full ${theme == 'light' ? "border-black/20" : "border-white/20"} border-r-[.3px] rounded-sm z-10 w-[90px]  ${menu ? "active-menu" : "non-active-menu"}`}>
                        <div className={`w-full h-fit ${menu && "px-4"}`}>
                            <div className={`text-[16pt] w-full h-[70px] flex items-center  ${menu ? "justify-end" : "justify-center"}`} onClick={() => setMenu(prev => !prev)}>
                                {
                                    menu ? 
                                    <TbLayoutSidebarRightExpandFilled />
                                    :
                                    <FaBars />
                                }
                            </div>
                            <Friends menu={menu} handler={setMenu} />
                            <hr className={` ${theme == 'light' ? "border-black/20" : "border-white/20"} mx-4`} />
                            <ConversationsList menu={menu} data={cnvs} />
                        </div>
                    </div>
                    <div className={`flex-grow w-full`}>
                        <div className={`w-full h-full p-2 `}>
                            <ChatContextProvider value={value}>
                                <Outlet />
                            </ChatContextProvider>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
