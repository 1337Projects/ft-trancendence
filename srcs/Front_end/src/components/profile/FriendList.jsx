import {useContext} from 'react'
import { ColorContext, ThemeContext } from '../../Contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight, faArrowLeft, faArrowRight, faMessage } from '@fortawesome/free-solid-svg-icons';

function FriendCard({data}) {
	const theme = useContext(ThemeContext);
    const color = useContext(ColorContext)
	return (
		<div className='h-[160px] rounded-md border-darkText/30 bg-cover mb-2 w-full border-[.3px]'>
			<div className={`mb-2 h-full shadow-sm w-full backdrop-blur-md rounded-md ${theme === 'light' ? "bg-lightItems" : "bg-darkItems"} `}> 
					<div className='flex w-full'>
						<div className="w-1/2 flex flex-col">
							<div style={{background:color}} className="rounded-br-lg py-1 w-[65%] flex items-center justify-center ">
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
								<img src={data.avatar} alt="Description" className="h-[50px] ml-[50%] translate-x-[-50%] rounded-full" />
							</div>
						</div>
					</div>
					<div className='px-6'>
						<button className='bg-blue-400 text-white capitalize h-[26px] text-[10px] block w-full rounded-sm mt-6'>
							get in touch
							<FontAwesomeIcon className='ml-2' icon={faMessage} />
						</button>
					</div>
			</div>
		</div>
	);
}

function Fcard({data}) {
	const theme = useContext(ThemeContext)
	const color = useContext(ColorContext)
	return (
		<div className={`h-[140px] mx-1 w-[180px] border-[.2px] p-2  flex items-center shadow-sm w-full backdrop-blur-md rounded-sm ${theme === 'light' ? "bg-lightItems border-lightText/20" : "bg-darkItems border-darkText/20"} `}> 
			<div className="w-full h-fit">
				{/* <div className='w-full flex justify-end'>
					<div style={{background:color}} className="rounded-lg py-1 w-1/3 flex items-center justify-center ">
						<p className={`text-[10px] text-darkText capitalize`}>friend</p>
					</div>
				</div> */}
				<div className='flex items-center justify-center'>
					<img src={data.avatar} alt="Description" className="h-[42px] rounded-full mr-2" />
					<div className={`${theme === 'light' ? "text-lightText" : "text-darkText"}`}>
						<p className={`text-[15px] mb-2`}>@{data.name}</p>
						<p className='text-[10px] capitalize'>{data.fullname}</p>
					</div>
				</div>
				<div className='w-full h-[26px] mt-4 flex justify-center'>
					<button style={{background:color}} className='text-white capitalize h-[26px] text-[10px] block w-2/3 rounded-sm'>
						get in touch
						<FontAwesomeIcon className='ml-2' icon={faMessage} />
					</button>
				</div>
			</div>
		</div>
	)
}

const friends = [
    {id:0, avatar: '/aamhamdi1.jpeg', name:'aamhamdi', fullname:'abdelhadi amhamdi'},
    {id:1, avatar: '/nmaazouz.jpg', name:'nmaazouz', fullname:'noreddine maazzouz'},
    {id:2, avatar: '/oaboulgh.jpg', name:'oaboulgh', fullname:'othman aboulghit'},
    {id:3, avatar: '/mel-harc.jpg', name:'mel-harc', fullname:'mohammed el harchi'},
]

export default function friendsList() {
	const theme = useContext(ThemeContext)
    return (
		<div className='mt-4'>
			<div className={`${theme == 'light' ? "" : ""} min-w-[170px] overflow-scroll h-fit flex justify-center relative`}>
				{/* <div className='flex items-center justify-center text-white absolute  top-0 left-0  w-[40px] z-10 h-full'>
					<FontAwesomeIcon className='bg-darkBg p-2 rounded-full' icon={faAnglesLeft} />
				</div> */}
				{friends.map(f => <Link key={f.id} to={f.name}><Fcard data={f}/></Link>)}
				{/* <div className='flex items-center justify-center text-white absolute bg-darkItems top-0 right-0  w-[40px] z-10 h-full'>
					<FontAwesomeIcon icon={faAnglesRight} />
				</div> */}
			</div>
		</div>
    )
}