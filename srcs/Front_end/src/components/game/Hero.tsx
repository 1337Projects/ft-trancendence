import React from "react"
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router-dom'


export default function Hero() {
    return (
        <div className="relative overflow-hidden h-[200px] rounded">
            <img src="/tr_hero.webp" className="w-full " alt="img" />
            <div className="absolute top-4 left-6 text-white z-10 text-xl">
                <Link to={`/dashboard/game`}>
                    <IoMdArrowRoundBack />
                </Link>
            </div>
            <div className="bg-blackGT absolute top-0 left-0 w-full h-full p-2 flex items-center">
                <div className="bg-gray-100 w-[100px] h-[100px] rounded ml-[20px]"></div>
                <div className="text-white ml-[20px]">
                    <h1 className="uppercase text-xl">tournment name</h1>
                    <p className="mt-4 text-sm">status : waiting, max players : 4, type : remote</p>
                </div>
            </div>
        </div>
    )
}