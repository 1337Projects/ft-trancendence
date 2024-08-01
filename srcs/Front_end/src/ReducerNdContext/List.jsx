import { useState, useContext } from "react"

import { themeContext, tasksContext, tasksReducerContext, TasksProvider } from './ListContext'


function AddTask() {

    const [title, setTitle] = useState('')
    const isLight = useContext(themeContext);
    const dispatch = useContext(tasksReducerContext)
 
    return (
    <div className="">
        <input className={`border-[1px] ${isLight ? "border-slate-500" : "bg-slate-700 text-white"} rounded w-48 h-6 mr-2 text-[8px] p-1`} placeholder="entre your task here..." value={title} onChange={(e) => setTitle(e.target.value)} type="text" />
        <button 
            className={`border-[1px]  rounded text-[8px] h-6 w-10 ${isLight ? "border-slate-500" : ""}`}
            onClick={() => {
                dispatch({
                    type : 'add',
                    title,
                    id : nextId++
                })
                setTitle('')
            }
        }>add</button>
    </div>
    )
}

function ListItem({task}) {
    const [ toEdit, setToEdit ] = useState(false)
    const [ title, setTitle ] = useState(task.title)
    const isLight = useContext(themeContext);
    const dispatch = useContext(tasksReducerContext)

    return (
        <li className="flex justify-between items-center w-60 h-6">
            <div className="content flex items-center" >
                <input 
                    className={`${isLight && "bg-slate-700"} mr-2 `} 
                    type="checkbox" 
                    onChange={(e) => 
                        dispatch({
                            type:'edit',
                            id : task.id,
                            task: {...task, seen : e.target.checked}
                        })
                    } 
                    checked={task.seen} />
                {
                    toEdit ? 
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className=" border-[1px] rounded w-24 h-6 text-[8px] p-1 mr-2" /> 
                    :
                        <h1 className="text-[8px]">{task.title}</h1>
                }
            </div>
            <div className="actions flex items-center">
                <button 
                    className={`${isLight && "border-slate-500"} border-[1px] rounded text-[6px] h-4 w-6`}
                    onClick={() => {
                        setToEdit(!toEdit)
                        dispatch({type:'edit', task:{...task, title}, id:task.id})
                    }}
                    >{toEdit ? "save" : "edit"}</button>
                <button className={`${isLight && "border-slate-500"} ml-2 border-[1px] rounded text-[6px] h-4 w-6`} onClick={() => dispatch({type:'delete', id : task.id})} >delete</button>
            </div>
        </li>
    )
}

function ListTasks() { 
    const tasks = useContext(tasksContext);
    return (
        <ul className="mt-4">
            {tasks.map(task => <ListItem key={task.id} task={task} />)}
        </ul>
    )
}

export default function List() {
    const [isLight, setIsLight] = useState(0)

    return (
        <TasksProvider>
            <themeContext.Provider value={isLight}>
                <div className={`p-10 h-[100vh] ${isLight ? "bg-white  text-slate-900 border-slate-900" : "bg-slate-700  text-white border-white"} "`}>
                    <button className={`${isLight && "border-slate-500"} border-[1px] rounded text-[8px] p-1`}  onClick={() => setIsLight(!isLight)}>theme</button>
                    <AddTask  />
                    <ListTasks />
                </div>
            </themeContext.Provider>
        </TasksProvider>
    )
}



let nextId = 3