import React, { useContext } from "react";
import { ApearanceContext } from "../../Contexts/ThemeContext";


function Select({children, val, handler, label}) {
    const {theme} = useContext(ApearanceContext) || {theme : ""}
    return (
        <div className="text-[10pt]">
            <label htmlFor={label} className="flex w-full  capitalize mb-2 px-2 ">
                <p>{label}</p>
            </label>
            <select
                className={`mt-2 px-4 w-full h-[45px] border-[1px] rounded-md ${theme === 'light' ? "border-black/20" :  "border-white/20 bg-darkItems"}`} 
                value={val} 
                onChange={(e) => {
                    handler(e.target.value);
                }}
            >
                {children}
            </select> 
        </div>
    )
}

const colors = [
    {id:0, color:'#FFC100', name:'yellow'},
    {id:1, color:'#C53F3F', name:'red'},
    {id:3, color:'#407BFF', name:'blue'},
    {id:4, color:'#7E57C2', name:'purple'},
    {id:5, color:'#FF81AE', name:'pink'},
    {id:6, color:'#ff9800', name:'orange'},
    {id:7, color:'#009688', name:'green'},
]

export default function Apperance() {

   const { theme , color, colorHandler } = useContext(ApearanceContext) || {}

    return (
        <div className="px-2 max-w-[500px] mx-auto ">
            <ul>
                <li className={`mt-1 border-[1px] ${theme == 'light' ? "border-black/20" : "border-white/20"} rounded p-2`}>
                    <div className="h-fit w-full grid grid-cols-2 gap-4">
                        <div className="h-full p-2">
                            <h1 className="capitalize">pick your favourite color</h1>
                            <p className="text-xs mt-4">Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                            <div className="grid grid-cols-4 mt-6 gap-4 w-[140px]">
                                {
                                    colors.map((c, index) => 
                                        <div 
                                            key={index}
                                            style={{background : c.color}} 
                                            className="w-full h-[23px] cursor-pointer rounded-full"
                                            onClick={() => colorHandler!(c.color)}
                                        ></div>
                                )}
                            </div>
                        </div>
                        <div className="h-full flex items-center justify-center">
                            <img src="/pallete.svg" alt="pimg" />
                            {/* <PalleteImg /> */}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    )
}

