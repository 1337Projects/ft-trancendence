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
import MyUseEffect from '../../hooks/MyUseEffect';

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



export default function Friends() {
    const appearence = useContext(ApearanceContext)
	const {authInfos, user} = useContext(UserContext) || {}
	const {user_name} = useParams()
	const [currentUser, setCurrentUser] = useState<UserType | null>()
	const [friends, setFriends] = useState<FirendType[] | null>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null);
    
    
    MyUseEffect(() => {
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
        })
        .catch(err => console.log(err))
    }, [])

    return (
        <div className=' w-full h-full flex'>
            {friends?.map((friend, index) => (
                <FriendCard
                key={index}
                friend={friend.sender.username === user_name ? friend.receiver : friend.sender}
                />
            ))}
        </div>
    )

}