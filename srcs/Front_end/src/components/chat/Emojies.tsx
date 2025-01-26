
import React, {useState, useContext, useEffect} from 'react'
import { ApearanceContext } from '@/Contexts/ThemeContext'
import { FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { UserContext } from '@/Contexts/authContext'

export default function Emojies({TextInputHandler, inputText} : {inputText : string, TextInputHandler : React.Dispatch<React.SetStateAction<string>>}) {
    const {theme} = useContext(ApearanceContext) || {}
    const [query, setQuery] = useState('')
    const [search, setSearch] = useState(false)


    return (
        <div className={`${theme === 'light' ? "bg-lightBg/20 text-lightText border-lightText/20" : "bg-darkBg/20 text-darkText  border-darkText/20"} bottom-[52px] absolute w-full border-[.2px] backdrop-blur-lg mb-1 rounded-sm p-1`}>
            <div className={`${theme === 'light' ? "border-lightText" : "border-darkText"} h-[50px] header flex justify-start items-center text-[12px] px-2 py-2 border-b-[.2px]`}>
                <div className='mx-2 w-full text-[12px] flex'>
                    <FaSearch />
                    <input placeholder='search...' value={query} onChange={(e) => {
                        setQuery(e.target.value)
                        setSearch(true);
                        if (!e.target.value.length)
                                setSearch(false)
                    }} className='px-1 bg-transparent text-[10px] ml-3 focus:outline-none'/>
                </div>
            </div>
            {
                search ? <EmojiesSearch query={query} textHandler={TextInputHandler} text={inputText} /> : <EmojesCategories  textHandler={TextInputHandler} text={inputText} />
            }
        </div>
    )
}

function EmojiesSearch({
    textHandler, text, query
} : {
    textHandler : React.Dispatch<React.SetStateAction<string>>,
    text : string,
    query : string
}) {

    const [emojis, setEmojis] = useState<{character : string}[] | null>(null)
    const { authInfos } = useContext(UserContext) || {}

    useEffect(() => {
        const timer = setTimeout(async () => {

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}api/emojis/search/?query=${query}`, {
                    headers : {
                        "Authorization" : `Bearer ${authInfos?.accessToken}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const {data} = await response.json()
                setEmojis(data)

            } catch (error) {
                toast.error(error instanceof Error ? error.toString() : "somthing went wrong...")
            }
        }, 500)
            
            
        return () => {
            clearTimeout(timer);
        }
    }, [query])

    return (
        <ul className='flex w-full text-[14px] flex-wrap p-1 h-[16vh] overflow-y-auto font-noto'>
            {
                emojis != null && emojis?.map((i, index) => {
                    return <li className='m-1' onClick={() => textHandler(text + i.character)}  key={index}>{i.character}</li>
                })
            }
        </ul> 
    )
}

function EmojesCategories({textHandler, text} : {textHandler : React.Dispatch<React.SetStateAction<string>>, text : string}) {
    const [def, setDef] = useState("smileys-emotion")
    const [emojis, setEmojis] = useState<{character : string}[] | null>(null)
    const { authInfos } = useContext(UserContext) || {}

    useEffect(() => {
        const timer = setTimeout(async () => {

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}api/emojis/get_all/?categorie=${def}`, {
                    headers : {
                        "Authorization" : `Bearer ${authInfos?.accessToken}`
                    }
                })
    
                if (!response.ok) {
                    throw Error("somthing went wrong")
                }
                const {data} = await response.json()
                setEmojis(data)
            }
            catch(err) {
                toast.error(err instanceof Error ? err.toString() : "somthing went wrong...")
            }
        }, 150)

        return () => {
            clearTimeout(timer)
        }
    }, [def])
    

    return (
        <div>
            <ul className='flex my-2 justify-between rounded-sm m-2'>
                {categories?.map(c => {
                    return (
                        <li className={`${def === c.name && "border-primary border-[.2px] bg-primary/20"} rounded p-1 w-full h-fit flex items-center justify-center text-[18px]`} onClick={() => setDef(c.name)} key={c.name} >{c.character}</li>
                    )
                })}
            </ul>
            <ul className='flex w-full text-[14px] flex-wrap p-1 h-[16vh] overflow-y-auto font-noto'>
                {
                    emojis != null && emojis.map((i, index) => {
                        return <li className='m-1' onClick={() => textHandler(text + i.character)}  key={index}>{i.character}</li>
                    })
                }
            </ul>
        </div>
    )
}



const categories = [
    {name : "smileys-emotion" , character :'😀'},
    {name : "people-body", character :'🤝🏻'},
    {name : "animals-nature" , character :'🐶'},
    {name : "food-drink" , character :'🍉'},
    {name : "travel-places" , character :'🏞️'},
    {name : "activities" , character :'🧨'},
    {name :  "objects" , character :'👕'},
    {name : "symbols" , character :'🛄'},
    {name : "flags" , character :'🚩'},
]