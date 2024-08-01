
import { createContext } from 'react'
import useReducer from './useReducer';


export const tasksContext = createContext(null);
export const tasksReducerContext = createContext(null);
export const themeContext = createContext(null);



export function TasksProvider({children}) {
    
    const [tasks, dispatch] = useReducer(reducerHandler, initData)

    return (
        <tasksContext.Provider value={tasks}>
            <tasksReducerContext.Provider value={dispatch}>
                {children}
            </tasksReducerContext.Provider>
        </tasksContext.Provider>
    )
}

function reducerHandler(state, action) {
    switch (action.type) {
        case 'add': {
            return [...state , {id: action.id, title : action.title, seen: false}]
        }
        case 'edit': {
            return state.map(item => {
                if (item.id === action.id)
                    return action.task;
                return item;
            })
        }
        case 'delete': {
            return state.filter(item => item.id !== action.id)
        }
        default:
            throw new Error('Error : invalid action');              
    }
}


const initData = [
    { id: 0, title: 'Philosopher’s Path', seen: true },
    { id: 1, title: 'Visit the temple', seen: false },
    { id: 2, title: 'Drink matcha', seen: false }
  ];