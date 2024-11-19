import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import MyUseEffect from '../../hooks/MyUseEffect'
import Socket from "../../socket";
import { UserContext } from '../../Contexts/authContext'
import Hero from "./Hero";
import Nav from "./Navbar";
import { ApearanceContext } from "../../Contexts/ThemeContext";

import { Outlet } from 'react-router-dom'
import TouramentcontextProvider from "../../Contexts/TournamentContext";

export default function Tournment() {

    const { id, type } = useParams()
    const { authInfos } = useContext(UserContext) || {}
    const { theme } = useContext(ApearanceContext) || {}
    const [ data, setData ] = useState(null)

    function DataHandler(data) {
        setData(data)
    }

    MyUseEffect(() => {
        Socket.addCallback("tr_data", DataHandler)
        Socket.connect(`ws://localhost:8000/ws/tournment/${id}/?token=${authInfos?.accessToken}`)
    }, [])


    
    return  (
        <div className={`w-full h-[100vh] ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"}  mt-2 p-2`}>
            <Hero data={data} />
            <Nav />
            <div className="w-full h-full mt-2">
                <TouramentcontextProvider value={{data, setData}}>
                    <Outlet />
                </TouramentcontextProvider>
            </div>
        </div>
    )
}


