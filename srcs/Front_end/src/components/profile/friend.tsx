import React, { useEffect, useState } from 'react';
import { useContext } from "react"
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { Banner } from './Hero';
import Level from './Level'
import Chart from './Chart'
import Achivments from './Achivments'
import { Link, Outlet, useParams } from 'react-router-dom';
import { UserContext } from '../../Contexts/authContext';
import { FaUserFriends } from 'react-icons/fa';
import { UserType } from '../../Types';
import { FirendType } from '../../Types';
import { RiProfileFill } from 'react-icons/ri';

// function FriendCard({data}) {
// 	const theme = useContext(ThemeContext);
//     const color = useContext(ColorContext).substring(6,13)
// 	return (
// 		<div className='h-[160px]rounded-sm bg-cover mb-2 w-[190px]'>
			// <div className={`mb-2 shadow-sm flex w-full h-[200px] backdrop-blur-md rounded-sm ${theme === 'light' ? "bg-lightItems" : "bg-darkItems"} `}> 
			// 		<div className=" w-[56%] flex flex-col">
			// 			<div style={{background:color}} className="rounded-sm h-[20px] w-[65%] flex items-center justify-center ">
			// 				<p className={`text-[10px] mt-[2px] text-darkText capitalize`}>friend</p>
			// 			</div>
			// 			<div className="flex-col flex items-center justify-center grow">
			// 				<p className={`text-[15px] font-kaushan  mb-2 ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>{data.name}</p>
			// 				<p className={`text-[10px]  ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>win rate</p>
			// 				<p className={`text-[10px] mt-2  ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>{data.rate} %</p>
			// 			</div>
			// 		</div>
			// 		<div className="">
			// 			<img src={data.avatar} alt="Description" className=" h-[160px] mt-[-10px]" />
			// 		</div>
			// </div>
// 		</div>
// 	);
// }
function FriendCard({friend}) {
	const appearence = useContext(ApearanceContext)

	return (
		<div className={`h-[190px] w-[190px] p-[20px] m-2 rounded-[sm]
        flex flex-col
        `}
        // border-2 border-rose-600
        
        // style={{ backgroundColor: appearence?.color }}
        >
            <div className=' w-full h-[60%] flex justify-center items-center'>
                <img src={friend?.profile?.avatar} alt="" className="rounded-[50%] h-[85px] w-[85px]" />
            </div>
            <div className='w-full h-[50%] flex flex-col items-center'>
                <h2 className='text-[20px] p-[5px]'>{friend?.username}</h2>
                <Link
                    to={`../../profile/${friend?.username}`}  
                    className='rounded-sm text-[#fff] text-[14px] pr-[20px] pl-[20px] p-[5px]'
                    style={{ backgroundColor: appearence?.color }}
                >
                view profile
                </Link>
            </div>
		</div>
	);
}
{/* <div className={`mb-2 shadow-sm flex w-full h-[200px] backdrop-blur-md rounded-sm 
${appearence?.theme == 'light' ? "bg-lightItems border-lightText/10 text-lightText" 
: "bg-darkItems text-darkText border-darkText/10"} `}> 

</div> */}


export default function Friends() {
    const appearence = useContext(ApearanceContext)
	const {authInfos, user} = useContext(UserContext) || {}
	const {user_name} = useParams()
	const [currentUser, setCurrentUser] = useState<UserType | null>()
	const [friends, setFriends] = useState<FirendType[] | null>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null);
    
    
    useEffect(() => {
		const timer = setTimeout(() => {
            fetch(`${import.meta.env.VITE_API_URL}api/profile/getOthersFriends/${user_name}/`, {
                method: 'GET',
                credentials : 'include',
                headers : {
                'Authorization' : `Bearer ${authInfos?.accessToken}`,
                }
            })
            .then(res => res.json())
            .then(res => {
                setFriends(res.data)
                console.log("loooool", res)
            })
            .catch(err => console.log(err))

		}, 1300)
		return () => clearTimeout(timer)

	},[])
    // console.log(friends)
    return (
        <div className=' w-full h-full flex'>
            {friends?.map((friend, index) => (
                <FriendCard
                key={index}
                friend={friend.sender.username === user?.username ? friend.receiver : friend.sender}
                />
            ))}
        </div>
    )

}