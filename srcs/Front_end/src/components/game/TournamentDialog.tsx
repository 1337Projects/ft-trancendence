import React, { useContext, useState } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { DialogContext } from "@/Contexts/DialogContext"
import { DialogDataType } from "@/types"




export default function TournmentDialog() {
    const { color, theme } = useContext(ApearanceContext) || {}
    const { setOpen } = useContext(DialogContext) || {}
    const [data, setData] = useState({members : 4, name : ''})
    const [created, setCreated] = useState<null | number>(null)


    async function createHandler() {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/tournment/create/`, {
            method : 'POST',
            headers : { 
                'Content-Type' : 'application/json'
            },
            credentials : 'include',
            body : JSON.stringify(data)
        })

        if (!response.ok) {
            console.log(await response.json())
            return ;
        }

        const { id } = await response.json()
        setCreated(id)
    }

    

    return (
        <div className={`${theme == 'light' ? "bg-white border-black/10" : "bg-darkItems border-white/20"}  rounded-md  p-6 border-[.3px] w-[400px] sm:w-[600px] h-fit z-40 left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] absolute`}>
            <div className="h-fit">
                <div className="">
                    <h1 className="font-bold text-lg capitalize">create tournment</h1>
                    {
                        created 
                        ?
                        <div>
                            <h1>your tournment has been created successfullty</h1>
                        </div> 
                        : 
                        <div>
                            <h1 className="text-sm mt-4">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</h1>
                                <div className="mt-4">
                                    <label className="w-full block" htmlFor="name">name</label>
                                    <input 
                                        className={`rounded px-6 bg-transparent ${theme == 'light' ? "border-black/20" : "border-white/20"} h-[40px] border-[.3px] w-full mt-2`}
                                        type="text"
                                        id="name" 
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData({...data, name : e.target.value})}
                                        placeholder="tournament name..."
                                    />
                                </div>
                                <div className="mt-6">
                                    <ParticipantsList data={data} handler={setData} />
                                </div>
                        </div>
                    }
                    
                </div>
            </div>
            <div className="h-[40px] mt-6  rounded-b-md flex justify-end items-center">
                {
                    !created ? 
                    <div>
                        <button 
        
                            className={`px-4 mr-2 h-[40px] rounded text-sm border-[.3px] ${theme == 'light' ? "border-black/20" : "border-white/20"}`}
                            onClick={() => setOpen!(false)}
                        >cancel</button>
                        <button 
                            onClick={createHandler}
                            style={{background: color}}
                            className="px-4 h-[40px] rounded text-sm text-white"
                        >create</button>
                    </div>
                    :
                    <div>
                        <button 
                            onClick={() => setOpen!(false)}
                            className={`px-4 h-[40px] border-[1px] mr-4 ${theme == 'light' ? "border-black/20" : "border-white/20"} rounded text-sm`}
                        >
                            close
                        </button>   
                    </div>
                }
            </div>
        </div>
    )
}



function ParticaipantElm({elm, handler, data} : {data : DialogDataType , elm : string, handler : React.Dispatch<React.SetStateAction<DialogDataType>>}) {
    
    return (
        <label 
            className={`p-2 ${data.members === Number(elm) && "bg-gray-800 text-white"} text-sm rounded hover:bg-gray-700/70 w-[120px] border-[.3px] border-black/30 flex justify-center items-center`} 
            htmlFor={elm} 
            onClick={() => handler(prev => { return {...prev, members : parseInt(elm)} })}
        >
            <input 
                style={{display : "none"}} 
                checked={data.members === Number(elm)} 
                className="mr-2" 
                type="radio" 
                id={elm} 
                name="participants" 
                value={elm} 
            />
            <p className="capitalize">{elm} players</p>
        </label>
    )
}


function ParticipantsList({handler , data } : {data : DialogDataType , handler : React.Dispatch<React.SetStateAction<DialogDataType>>}) {
    return (
        <div>
            <h1>participents number :</h1>
            <div className="flex mt-4 justify-between items-center max-w-[380px]">
                { ["4", "8", "16"].map((elm) => <ParticaipantElm data={data} handler={handler} elm={elm} />) }
            </div>
        </div>
    )
}