
import { Outlet } from "react-router-dom"
import FriendsList from "../components/chat/FriendsList"
import { ChatProvider } from "../Contexts/ConversationsContext"
import { useState } from "react"

export default function ChatLayout() {
    const [chatData, setChatData] = useState(null)
    return (
        <>
            <ChatProvider data={chatData} dispatch={setChatData}>
                <div className="flex justify-between w-full h-[94vh] mt-2">
                    <Outlet />
                    <div className="h-[94vh] hidden sm:block">
                        <FriendsList /> 
                    </div>
                </div>
            </ChatProvider>
        </>
    )
}
