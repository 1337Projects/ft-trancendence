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

   const {theme , color , themeHandler, colorHandler} = useContext(ApearanceContext) || {}

    return (
        <div className="mt-4 px-2 max-w-[500px] mx-auto">
            <ul>
                <li className="mt-1">
                    <label className="text-[10px]">
                        
                        <Select val={color} handler={colorHandler} label="color">
                            {colors.map(c => <option key={c.id} value={c.color}>{c.name}</option>)}
                        </Select>
                    </label>
                </li>
                <li className="mt-10">
                    <label className="text-[10px]">
                        <Select val={theme} handler={themeHandler} label="theme" >
                            <option value="light">light</option>
                            <option value="dark">dark</option>
                        </Select>
                    </label>
                </li>
            </ul>
        </div>
    )
}
