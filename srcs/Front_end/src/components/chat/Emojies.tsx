
import React, {useState, useContext, useEffect} from 'react'
import { ApearanceContext } from '../../Contexts/ThemeContext'
import { FaClock, FaSearch, FaSmile } from 'react-icons/fa'
import { FaDeleteLeft } from 'react-icons/fa6'

export default function Emojies({TextInputHandler, inputText}) {
    const API = 'https://emoji-api.com/'
    const KEY = 'access_key=5f603eacb5994ec1a691d954ed1b809c369c465d'
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
                search ? <EmojiesSearch query={query} /> : <EmojesCategories  textHandler={TextInputHandler} text={inputText} />
            }
        </div>
    )
}

function EmojiesSearch({query}) {

    const [emojis, setEmojis] = useState([])
    const API = 'https://emoji-api.com/emojis?search='
    const KEY = 'access_key=5f603eacb5994ec1a691d954ed1b809c369c465d'
    const url = API + query + "&" + KEY
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('fetch')
            fetch(url)
            .then(res => res.json())
            .then(res => {
                if (!res.status)
                    setEmojis(res)
            })
            .catch(err => {
                console.log(err)
            })
        }, 500)

        return () => {
            clearTimeout(timer);
        }
    }, [query])

    return (
        <ul className='flex w-full text-[14px] flex-wrap p-1 h-[16vh] overflow-y-auto font-noto'>
            {
                emojis?.map((i, index) => {
                    return <li className='m-1' onClick={() => textHandler(text + i.character)}  key={index}>{i.character}</li>
                })
            }
        </ul> 
    )
}

function EmojesCategories({textHandler, text}) {
    const API = 'https://emoji-api.com/'
    const KEY = 'access_key=5f603eacb5994ec1a691d954ed1b809c369c465d'
    const [def, setDef] = useState(dataa[0].name)
    const [emojis, setEmojis] = useState([])



    useEffect(() => {
        const timer = setTimeout(() => {
            fetch(API + "categories/" + def + "?" + KEY)
            .then(res => res.json())
            .then(res => {
                setEmojis(res)
            }).catch(err => {
                console.log(err)
            }) 
        }, 500)

        return () => {
            clearTimeout(timer)
        }
    }, [def])
    

    return (
        <div>
            <ul className='flex my-2 justify-between rounded-sm m-2'>
                {dataa?.map(c => {
                    return (
                        <li className={`${def === c.name && "border-primary border-[.2px] bg-primary/20"} rounded p-1 w-full h-fit flex items-center justify-center text-[18px]`} onClick={() => setDef(c.name)} key={c.name} >{c.character}</li>
                    )
                })}
            </ul>
            <ul className='flex w-full text-[14px] flex-wrap p-1 h-[16vh] overflow-y-auto font-noto'>
                {
                    emojis?.map((i, index) => {
                        return <li className='m-1' onClick={() => textHandler(text + i.character)}  key={index}>{i.character}</li>
                    })
                }
            </ul>
        </div>
    )
}



const dataa = [
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