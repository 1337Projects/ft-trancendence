import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MyUseEffect from '../../hooks/MyUseEffect'
import Socket, { tournamentSocket } from "../../socket";
import { UserContext } from '../../Contexts/authContext'
import Hero from "./Hero";
import Nav from "./Navbar";
import { ApearanceContext } from "../../Contexts/ThemeContext";

import { Outlet } from 'react-router-dom'
import TouramentcontextProvider from "../../Contexts/TournamentContext";
import Schema from "./Schema";

export default function Tournment() {

    const { id, type } = useParams()
    const { authInfos } = useContext(UserContext) || {}
    const { theme } = useContext(ApearanceContext) || {}
    const [ data, setData ] = useState(null)
    const navigate = useNavigate()

    function DataHandler(data) {
        setData(data)
        console.log(data)
    }

    MyUseEffect(() => {
        setTimeout(() => {
            tournamentSocket.addCallback("tr_data", DataHandler)
            tournamentSocket.addCallback("match_data", matchHandler)
            tournamentSocket.connect(`ws://localhost:8000/ws/tournment/${id}/?token=${authInfos?.accessToken}`)
            tournamentSocket.sendMessage({"event" : "get_data"})
        }, 100)
    }, [])


    const matchHandler = (data) => {
        // console.log(data)
        if (data && authInfos) {
            if (data.player_1.username == authInfos?.username || data.player_2.username == authInfos?.username) {
                navigate(`/dashboard/game/room/${data.id}/${data.id}`)
            }
        }
    }

    // useEffect(() => {
    //     return () => {
    //         tournamentSocket.close()
    //     }
    // }, [])


    
    return  (
        <div className={`w-full h-[100vh] ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"}  mt-2 p-2`}>
            <Hero data={data} />
            <div className="w-full h-full mt-2">
                <Schema data={data} />
            </div>
        </div>
    )
}


