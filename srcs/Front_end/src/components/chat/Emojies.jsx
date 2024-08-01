
import {useState, useContext, useEffect} from 'react'
import { ThemeContext } from '@emotion/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faDeleteLeft, faSearch, faSmile } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function Emojies({TextInputHandler, inputText}) {
    const API = 'https://emoji-api.com/'
    const KEY = 'access_key=5f603eacb5994ec1a691d954ed1b809c369c465d'

    const [query, setQuery] = useState('')
    const [search, setSearch] = useState(false)
    const theme = useContext(ThemeContext)

    return (
        <div className={`${theme === 'light' ? "bg-lightBg/20 text-lightText border-lightText/20" : "bg-darkBg/20 text-darkText bottom-[52px] absolute border-darkText/20"} w-full border-[.2px] backdrop-blur-lg mb-1 rounded-sm p-1`}>
            <div className={`${theme === 'light' ? "border-lightText" : "border-darkText"} h-[50px] header flex justify-start items-center text-[12px] px-2 py-2 border-b-[.2px]`}>
                <div className='mx-2 w-[70%] text-[12px]'>
                    <FontAwesomeIcon icon={faSearch} />
                    <input placeholder='search...' value={query} onChange={(e) => {
                        setQuery(e.target.value)
                        setSearch(true);
                        if (!e.target.value.length)
                                setSearch(false)
                    }} className='px-1 bg-transparent text-[10px] ml-3 focus:outline-none'/>
                </div>
                <div className='mx-4'>
                    <FontAwesomeIcon icon={faSmile} />
                </div>
                <div className='mx-4'>
                    <FontAwesomeIcon icon={faClock} />
                </div>
                <div className='mx-4' onClick={() => TextInputHandler(inputText.slice(0, -1))}>
                    <FontAwesomeIcon icon={faDeleteLeft} />
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
        let timer = setTimeout(() => {
            console.log('fetch')
            axios.get(url)
            .then(res => {
                if (!res.data.status)
                    setEmojis(res.data)
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
    const [emojis, setEmojis] = useState(i)



    useEffect(() => {
        let timer = setTimeout(() => {
            console.log('fetch')
            axios.get(API + "categories/" + def + "?" + KEY).then(res => {
                setEmojis(res.data)
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

let i = [
    {slug: 'e1-0-grinning-face', character: '😀', unicodeName: 'E1.0 grinning face', codePoint: '1F600', group: 'smileys-emotion'},
    {slug: 'e0-6-grinning-face-with-big-eyes', character: '😃', unicodeName: 'E0.6 grinning face with big eyes', codePoint: '1F603', group: 'smileys-emotion'},
    {slug: 'e0-6-grinning-face-with-smiling-eyes', character: '😄', unicodeName: 'E0.6 grinning face with smiling eyes', codePoint: '1F604', group: 'smileys-emotion'},
    {slug: 'e0-6-beaming-face-with-smiling-eyes', character: '😁', unicodeName: 'E0.6 beaming face with smiling eyes', codePoint: '1F601', group: 'smileys-emotion'},
]

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