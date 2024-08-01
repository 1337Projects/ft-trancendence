import {useContext} from 'react'
import { ColorContext, ThemeContext } from '../../Contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';

function FriendCard({data}) {
	const theme = useContext(ThemeContext);
    const color = useContext(ColorContext)
	return (
		<div className='h-[160px] rounded-sm bg-cover mb-2 w-[170px]'>
			<div className={`mb-2 shadow-sm flex w-full h-[160px] backdrop-blur-md rounded-sm ${theme === 'light' ? "bg-lightItems" : "bg-darkItems"} `}> 
					<div className="w-1/2 flex flex-col">
						<div style={{background:color}} className="rounded-br-sm py-1 w-[65%] flex items-center justify-center ">
							<p className={`text-[12px] text-darkText capitalize`}>friend</p>
						</div>
						<div className="flex-col flex items-center justify-center grow">
							<p className={`text-[15px] mb-2 ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>{data.name}</p>
							<p className={`text-[10px]  ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>win rate</p>
							<p className={`text-[10px] mt-2  ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>{data.rate} %</p>
						</div>
					</div>
					<div className="flex w-1/2 justify-between items-center p-2">
						<div className='w-full'>
							<img src={data.avatar} alt="Description" className="h-[70px] ml-[50%] translate-x-[-50%] rounded-lg" />
							<button className='bg-blue-400 text-white h-[26px] text-[12px] block w-full rounded-lg mt-6'>
								Contact
								<FontAwesomeIcon className='ml-2 text-[10px]' icon={faMessage} />
							</button>
						</div>
					</div>
			</div>
		</div>
	);
}

const friends = [
    {id:0, avatar: '/aamhamdi1.jpeg', name:'jemmy', rate:'50'},
    {id:0, avatar: '/nmaazouz.jpg', name:'jemmy', rate:'50'},
    {id:0, avatar: '/oaboulgh.jpg', name:'jemmy', rate:'50'},
    {id:0, avatar: '/mel-harc.jpg', name:'jemmy', rate:'50'},
]

export default function friendsList() {
	const theme = useContext(ThemeContext)
    return (
        <div className={`${theme == 'light' ? "bg-lightItems" : ""} min-w-[170px]`}>
            {friends.map(f => <Link to={f.name}><FriendCard key={f.id} data={f}/></Link>)}
        </div>
    )
}