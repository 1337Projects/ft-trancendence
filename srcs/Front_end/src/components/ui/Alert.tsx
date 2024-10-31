import { IoCloseCircleOutline } from "react-icons/io5";
import React from "react";
import { AlertType } from "../../Types";

export default function Alert(
        {alert, alertHandler} : 
        {alert : AlertType, alertHandler : React.Dispatch<React.SetStateAction<AlertType | null>>}
    ) 
    {
        console.log(alert)
    return (

        <div 
            className={`text-gray-700 relative w-full 
                ${alert.type == 'error' ? "border-red-300 bg-red-500/20" : "border-green-300 bg-green-500/20"}
                border-[1px] text-[10pt]  p-4 rounded `
            }>
            { alert.message.map((err, index) => <h1 key={index}>{err}</h1>) }
            <IoCloseCircleOutline 
                className="absolute top-2 right-2 text-[12pt]" 
                onClick={() => alertHandler(null)} 
            />
        </div>
    )
}