import { ApearanceContext } from "@/Contexts/ThemeContext"
import { useContext, useState } from "react"


function GameCardItem({cell, handler} : {cell : number[]}) {

    const {theme} = useContext(ApearanceContext) || {}

    if (!cell) {
        return <h1>loading</h1>
    }

    return (
        <div onClick={
            () => {
                const x = cell[0]
                const y = cell[1]
                handler((prev : (number | string)[][][]) => {
                    const tmp = [...prev]
                    tmp[x][y].push("X")
                    return tmp
                })
            }
        } className={`w-full h-full cursor-pointer ${theme === 'light' ? "bg-lightItems" : "bg-darkItems"} flex justify-center items-center text-3xl`}> 
            <p>{cell[2] || "-"}</p>
        </div>
    )
}

const my_grid = [
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
]


function Players() {

    const { color } = useContext(ApearanceContext) || {}

    return (
        <div className="w-full h-[100px] rounded p-4">
            <div className="flex w-full relative justify-between items-center h-full">
                <div style={{background : color, color : "white"}} className="w-[200px] pl-4 rounded h-full justify-start flex items-center">
                    <img className="w-[50px] h-[50px] mr-4 rounded-full" src="/_.jpeg" />
                    <div className="flex flex-col items-start justify-center">
                        <p className="text-sm font-bold">aamhamdi</p>
                        <p className="text-xs mt-1 uppercase">Player X</p>
                    </div>
                    <h1 style={{color : color}} className="absolute uppercase text-xs top-[-40px]">player x play now</h1>
                </div>
                <div className="w-[200px] h-full flex justify-end items-center">
                    <div className="flex flex-col items-end justify-center">
                        <p className="text-sm font-bold">mel-harc</p>
                        <p className="text-xs mt-1 uppercase">Player O</p>
                    </div>
                    <img className="w-[50px] h-[50px] ml-4 rounded-full" src="/_.jpeg" />
                </div>
            </div>
        </div>
    )
}


export default function TicTacTeo() {

    const { theme } = useContext(ApearanceContext) || {}
    const [grid, setGrid] = useState(my_grid)

    return (
        <div className={`p-2 rounded w-full h-full flex flex-row justify-center items-center ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} mt-2`}>
            
            <div className="w-[500px] h-[400px] p-2 translate-y-[-40%]">
                <Players />
                <div className="w-full h-full mt-32 p-4">
                    <ul className={`grid grid-cols-1 ${theme === 'light' ? "bg-darkItems" : "bg-lightItems"} h-full gap-1`}>
                        {
                            grid.map((row, i) => {
                                return (
                                    <li key={i} className="h-full">
                                        <ul className="grid h-full grid-cols-3 gap-1">
                                            {
                                                row.map((cell, j) => {
                                                    return (
                                                        <li key={j} className="h-full">
                                                            <GameCardItem handler={setGrid} cell={cell} />
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </li>
                                )
                            })
                        }   
                    </ul>
                </div>
            </div>
        </div>
    )
}