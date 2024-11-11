import React, { useContext } from "react";
import {ApearanceContext} from '../../Contexts/ThemeContext'

export default function Nav() {

    const { color, theme } = useContext(ApearanceContext) || {}

    return (
        <div className={`mt-2  h-[50px] flex items-center p-2 border-b-[.5px] ${theme == 'light' ? "border-black/20" : "border-white/20"}`}>
            <ul className="flex capitalize text-sm">
                <li style={{background : color, color : 'white'}} className="mr-4 p-2 rounded px-4">tournament</li>
                <li className="mr-4 p-2 rounded px-4">leaserboard</li>
                <li className="mr-4 p-2 rounded px-4">players</li>
                <li className="mr-4 p-2 rounded px-4">matches</li>
            </ul>
        </div>
    )
}