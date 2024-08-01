import {useContext} from 'react'
import { ColorContext, ThemeContext } from '../../Contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { theme } from 'flowbite-react';

function FriendCard({data}) {
	const theme = useContext(ThemeContext);
    const color = useContext(ColorContext)
	return (
		<div className='h-[160px]rounded-sm bg-cover mb-2 w-[190px]'>
			<div className={`mb-2 shadow-sm flex w-full h-[200px] backdrop-blur-md rounded-sm ${theme === 'light' ? "bg-lightItems" : "bg-darkItems"} `}> 
					<div className=" w-[56%] flex flex-col">
						<div style={{background:color}} className="rounded-br-sm py-1 w-[65%] flex items-center justify-center ">
							<p className={`text-[12px] text-darkText capitalize`}>friend</p>
						</div>
						<div className="flex-col flex items-center justify-center grow">
							<p className={`text-[15px] mb-2 ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>{data.name}</p>
							<p className={`text-[10px]  ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>win rate</p>
							<p className={`text-[10px] mt-2  ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>{data.rate} %</p>
						</div>
					</div>
					<div className="">
						<img src={data.avatar} alt="Description" className=" h-[160px] mt-[-10px]" />
					</div>
			</div>
		</div>
	);
}

const friends = [
    {id:0, avatar: '/ava2.png', name:'jemmy', rate:'50'},
    {id:1, avatar: '/ava3.png', name:'CatWomen', rate:'70'},
    {id:2, avatar: '/ava1.png', name:'Batman', rate:'30'},
]

export default function friendsList() {
	const theme = useContext(ThemeContext)
    return (
        <div className={`${theme == 'light' ? "bg-lightItems" : ""} min-w-[190px]`}>
            {friends.map(f => <Link to={f.name}><FriendCard key={f.id} data={f}/></Link>)}
        </div>
    )
}