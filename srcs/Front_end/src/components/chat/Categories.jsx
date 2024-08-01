import { faBoxArchive, faInbox, faPaperPlane, faUsersRays } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { ColorContext } from "../../Contexts/ThemeContext";



function CatButton({icon, text, categorie, handler}) {
    const color = useContext(ColorContext)
    const t = categorie === text ? color : ""
    return (
        <button style={{color:t, borderColor : t}} className={`border-[.5px] h-fit flex justify-between items-center font-bold capitalize rounded text-[10px] p-2 mr-3 min-w-10`} onClick={()=> handler(text)}>
            <p>{text}</p>
            <FontAwesomeIcon className="ml-2" icon={icon} />
        </button>
    )
}


export default function Categories({categorie, Handler}) {
    
    return (
        <div className="w-full h-[30px] px-8 flex mt-4">
            <CatButton text="all" icon={faInbox} categorie={categorie} handler={Handler} />
            <CatButton text="archived" icon={faBoxArchive} categorie={categorie} handler={Handler} />
            <CatButton text="unread" icon={faPaperPlane} categorie={categorie}  handler={Handler} />
            <CatButton text="groups" icon={faUsersRays} categorie={categorie} handler={Handler} />
        </div>
    )
}

export function reducerHandler(state, action) {
    switch (action.type) {
        case 'seen':
            return state.map(item => {
                if (item.id === action.id && item.categorie === 'unread')
                    return {...item, categorie : ''}
                return item
            })
        case 'archive':
            return state.map(item => {
                if (item.id === action.id) {
                    return {...item, categorie : 'archived'}
                }
                return item
            })
        case 'delete':
            return state.filter(item => item.id !== action.id)

        default:
            throw new Error('Error: unknown action');
    }
}