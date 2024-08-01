import { useState } from "react"



export default function useReducer(handler , init) {

    const [tasks, setState] = useState(init)

    function dispatch(action) {
        setState(handler(tasks, action));
    }

    return [tasks, dispatch]
}