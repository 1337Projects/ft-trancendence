import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MyUseEffect from '../../hooks/MyUseEffect'
import Socket from "../../socket";
import drawTournment from '../../libs/svg'

export default function Tournment() {

    const { id } = useParams()
    const [svg, setSvg] = useState<null | string>(null)
    const [rounds, setRounds] = useState(null)
    const [r, setR] = useState(0)

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
        Socket.connect(`ws://localhost:8000/ws/tournment/${id}/`)
        Socket.addCallback("tr_data", DataHandler)
    }, [])


    
    return  (
        <div className="w-full h-[100vh] bg-white mt-2 p-2 px-10">
            {
                svg && 
                <div className="w-full h-fit rounded">
                    <div className="flex justify-center mx-auto" dangerouslySetInnerHTML={{ __html : svg}} />
                </div>
            }
            <div className="mt-10 p-2 border-[1px]">
                <div className="w-fit mx-auto h-fit mt-4 p-2 grid grid-cols-1 gap-2 max-h-[500px] overflow-auto">
                    {  
                        rounds &&
                        rounds?.rounds[r - 1].filter(r => r.status != 'ended').map((r, index) => {
                            return (
                                <div className="">
                                    <h1 className="my-4 uppercase">match {index + 1}</h1>
                                    <div key={index} className="w-full h-[80px] px-16 relative flex items-center border-[1px] rounded justify-center">
                                        <div className="absolute top-[-10px] left-[-10px] px-4 py-2 rounded text-xs bg-green-200">{r?.status}</div>
                                        <div className="flex w-fit">
                                            <div className="flex items-center w-full p-2">
                                                <img src={r?.player1?.avatar} className="text-white w-[50px] h-[50px] rounded-full flex justify-center items-center" />
                                                <div className="ml-4 ">
                                                    <p className="uppercase text-sm">player</p> 
                                                    <span>{r?.player1?.name}</span>
                                                </div>
                                            </div>
                                            <h1 className="mx-10 text-3xl"> vs </h1>
                                            <div className="flex w-full items-center p-2">
                                                <div className="mr-4 ">
                                                    <p className="uppercase text-sm">player</p> 
                                                    <span>{r?.player2?.name}</span>
                                                </div>
                                                <img src={r?.player2?.avatar} className="text-white w-[50px] h-[50px] rounded-full flex justify-center items-center" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}


