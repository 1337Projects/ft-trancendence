import React, { useContext } from "react";
import {ApearanceContext} from '../../Contexts/ThemeContext'
import { Link } from "react-router-dom";

export default function Nav() {

    const { color, theme } = useContext(ApearanceContext) || {}

    const active = {background : color, color : 'white'}
    const def = !location.pathname.includes('leaderboard') && !location.pathname.includes('players') && !location.pathname.includes('matches')
    return (
        <div className={`mt-2  h-[50px] flex items-center p-2 border-b-[.5px] ${theme == 'light' ? "border-black/20" : "border-white/20"}`}>
            <ul className="flex capitalize text-sm">
                <li style={def ? active : {}} className="mr-4 p-2 rounded px-4">
                    <Link to="">
                        tournament
                    </Link>
                </li>
                <li style={location.pathname.includes('leaderboard') ? active : {}} className="mr-4 p-2 rounded px-4">
                    <Link to="leaderboard">
                        leaderboard
                    </Link>
                </li>
                <li style={location.pathname.includes('players') ? active : {}} className="mr-4 p-2 rounded px-4">
                    <Link to="players">
                        players
                    </Link>
                </li>
                <li style={location.pathname.includes('matches') ? active : {}} className="mr-4 p-2 rounded px-4">
                    <Link to="matches">
                        matches
                    </Link>
                </li>
            </ul>
        </div>
    )
}