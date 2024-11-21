import React, { useContext, useState } from "react";
import { Touramentcontext } from "../../Contexts/TournamentContext";

import MyUseEffect from '../../hooks/MyUseEffect'
import  drawTournment  from '../../libs/svg'

export default function Schema() {


    const { data } = useContext(Touramentcontext) || {}
    const [svg, setSvg] = useState("")
    
    MyUseEffect(() => {
        if (data) {
            const created_svg = drawTournment.drawTournment(data.rounds)
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(created_svg)
            setSvg(svgString)
        }
    }, [data])

    

    return (
        <div className="p-2">
            {
                svg && 
                <div className="w-full max-w-[500px] mx-auto">
                    {/* <div className="w-full  mt-10 text-center p-10">
                        <h1 className="pb-6 uppercase">current matches</h1>
                        <div className="bg-white border-[1px] border-black/20 w-full min-h-[200px] rounded">

                        </div>
                    </div> */}
                    <div className="" dangerouslySetInnerHTML={{ __html: svg }} />
                </div>
            }
        </div>
    )
}