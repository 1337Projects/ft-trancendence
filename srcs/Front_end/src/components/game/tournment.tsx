import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import MyUseEffect from '../../hooks/MyUseEffect'
import Socket from "../../socket";
import drawTournment from '../../libs/svg'
import { UserContext } from '../../Contexts/authContext'
import Hero from "./Hero";
import Nav from "./Navbar";
import { ApearanceContext } from "../../Contexts/ThemeContext";

export default function Tournment() {

    const { id, type } = useParams()
    const [svg, setSvg] = useState<null | string>(null)
    const [rounds, setRounds] = useState(null)
    const [r, setR] = useState(0)
    const { authInfos } = useContext(UserContext) || {}
    const { theme } = useContext(ApearanceContext) || {}
    const color = "#000000"
    function DataHandler(data) {
        setRounds(data)
        data.rounds.splice(0, 1)
        let created_svg = drawTournment.drawTournment(data.rounds.reverse())
        const serializer = new XMLSerializer()
        const svgString = serializer.serializeToString(created_svg)

        setR(data.current_round)
        setSvg(svgString)
    }

    MyUseEffect(() => {
        if (type != 'remote') {
            console.log('connect')
            Socket.connect(`ws://localhost:8000/ws/tournment/${id}/?token=${authInfos?.accessToken}`)
        }
        Socket.addCallback("tr_data", DataHandler)
    }, [])


    
    return  (
        <div className={`w-full h-[100vh] ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"}  mt-2 p-2`}>
            <Hero />
            <Nav />
            {
                svg && 
                <div className="w-full h-fit rounded mt-10 px-10">
                    <div className="flex justify-center mx-auto" dangerouslySetInnerHTML={{ __html : svg}} />
                </div>
            }
        </div>
    )
}


