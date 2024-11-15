import React, { useContext, useEffect, useState } from "react"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { TbUsers } from "react-icons/tb";

import { Hero } from './Game'
import MyUseEffect from "../../hooks/MyUseEffect";


export function TrItem() {

    const { theme, color } = useContext(ApearanceContext) || {}
    return (
        <div className={`border-[1px] ${theme == 'light' ? "border-black/20" : "border-white/20"} w-full h-[200px] p-2 rounded mt-4`}>
            <div className="w-full h-[180px] flex items-center relative">
                <img src="/_5.jpeg" className={`mr-4 border-[1px] ${theme == 'light' ? "border-black/20" : "border-white/20"} rounded w-[200px] h-full`} />
                <div style={{background : color}} className="absolute text-white top-[-10px] w-[80px] flex items-center justify-center left-[-10px] h-[35px] rounded text-xs">waiting</div>
                <div className="w-full h-full">
                    <div className={`h-[100px] w-full  border-b-[1px] ${theme == 'light' ? "border-black/20" : "border-white/20"}`}>
                        <h1 className="text-xl py-2 font-bold">Gang Tournaments</h1>
                        <div className="flex items-center justify-between mt-4">
                            <h1 className="text-sm flex items-center">
                                <TbUsers />
                                <p className="ml-2">Participants 3</p>
                            </h1>
                            <div className="flex items-center">
                                <h1 className="mr-4 text-xs">Participants</h1>
                                <img src="/aamhamdi1.jpeg" className="w-[20px] h-[20px]  border-[1px] rounded-full" />
                                <img src="/aamhamdi1.jpeg" className="w-[20px] h-[20px] border-[1px] ml-[-10px] rounded-full" />
                                <img src="/aamhamdi1.jpeg" className="w-[20px] h-[20px] border-[1px] ml-[-10px] rounded-full" />
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[80px] flex justify-end items-center p-2">
                        <button style={{background : color}} className="uppercase text-sm text-white w-[100px] h-[40px] rounded">join</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Events() {

    const { theme, color } = useContext(ApearanceContext) || {}

    const [tournments, setTournments] = useState([])

    MyUseEffect(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}api/tournment/get_all/`, {
                method : 'GET',
                credentials : 'include'
            })

            if (!response.ok) {
                const { error } = await response.json()
                throw  new Error(error)
            }

            const { data } = await response.json()
            setTournments(data)
        } catch(err) {
            console.log(err)
        }
    }, [])

    return (
        <div className={`${theme === 'dark' ? 'bg-darkItems text-darkText' : 'bg-lightItems text-lightText'} h-full mt-2 rounded p-2`}>
            <div>
                <Hero color={color} img="/Tennis-bro.svg" />
            </div>
            <div className="w-full max-w-[700px] mx-auto h-full mt-2 p-2">
                <div className="mb-10">
                    <h1 className="capitalize text-lg">avaliable tournaments :</h1>
                    <p className="text-xs mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, non.</p>
                </div>
                {
                    tournments.length ?
                    tournments.map((item, index) => <TrItem />)
                    :
                    <div className="w-full h-[200px] rounded border-[1px] border-white/20 text-sm flex justify-center items-center">
                        <p>not tournaments yet, create one</p>
                        <span style={{color : color}} className="ml-2 font-bold text-md cursor-pointer">Create !</span>
                    </div>
                }
            </div>
        </div>
    )
}