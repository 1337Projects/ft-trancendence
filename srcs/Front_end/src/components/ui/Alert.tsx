import { IoCloseCircleOutline } from "react-icons/io5";
import React from "react";

export default function Alert(
        {errors, errHandler} : 
        {errors : string[], errHandler : React.Dispatch<React.SetStateAction<string[] | null>>}
    ) 
    {
    return (
        <div 
            className="text-gray-700 relative w-full border-red-300 border-[1px] text-[10pt] bg-red-500/20 p-4 rounded ">
            { errors.map((err, index) => <h1 key={index}>{err}</h1>) }
            <IoCloseCircleOutline 
                className="absolute top-2 right-2 text-[12pt]" 
                onClick={() => errHandler(null)} 
            />
        </div>
    )
}