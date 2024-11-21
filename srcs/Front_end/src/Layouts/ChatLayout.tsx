
import { Outlet } from "react-router-dom"
import React, { Suspense, useContext, useEffect, useState } from "react"
import ConversationsList, {Friends} from '../components/chat/chat'
import { ApearanceContext } from "../Contexts/ThemeContext"
import { FaBars } from "react-icons/fa"
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { UserContext } from "../Contexts/authContext"
import MyUseEffect from '../hooks/MyUseEffect'
import Socket from '../socket'
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
        setCnvs(prev => [...prev.filter(c => c.id != cnv.id), cnv])
    }

    MyUseEffect(() => {
        Socket.connect(`ws://localhost:8000/ws/chat/${user?.id}/`)
        Socket.addCallback('cnvsHandler', setCnvs)
        Socket.addCallback('cnvsUpdate', UpdateConversationsHandler)
        Socket.addCallback("setData", setMessages)
        Socket.addCallback("setUser", setUserData)
        Socket.sendMessage({
            "event" : "fetch_conversations"
        })
    }, [])

    useEffect(() => {
        return () => {
            Socket.close();
        }
    }, [])


    return (
        <>
            <div className={` ${theme === 'light' ? " bg-lightItems text-lightText" : "bg-darkItems text-darkText"} w-full h-full mt-2 shadow-sm rounded-sm flex-grow`}>
                <div className="flex w-full h-full ">
                    <div className={`h-full backdrop-blur-md ${theme == 'light' ? "border-black/20" : "border-white/20"} border-r-[.3px] rounded-sm z-10 w-[90px] md:w-[400px]  ${menu ? "active-menu" : "non-active-menu"}`}>
                        <div className={`w-full h-fit  md:px-4 ${menu && "px-4"}`}>
                            <div className={`text-[16pt] w-full h-[70px] md:hidden flex items-center  ${menu ? "justify-end" : "justify-center"}`} onClick={() => setMenu(prev => !prev)}>
                                {
                                    menu ? 
                                    <TbLayoutSidebarRightExpandFilled />
                                    :
                                    <FaBars />
                                }
                            </div>
                            <Friends menu={menu} handler={setMenu} />
                            <hr className={` ${theme == 'light' ? "border-black/20" : "border-white/20"} mx-4 `} />
                            <ConversationsList menu={menu} data={cnvs} />
                        </div>
                    </div>
                    <div className={`flex-grow w-full`}>
                        <div className={`w-full h-full p-2 `}>
                            <ChatContextProvider value={value}>
                                <Suspense fallback={<div>loading ...</div>}>
                                    <Outlet />
                                </Suspense>
                            </ChatContextProvider>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
