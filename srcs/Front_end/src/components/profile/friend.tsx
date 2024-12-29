import React, { useState } from 'react';
import { useContext } from "react"
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '@/Contexts/authContext';
import { FaArrowRight } from 'react-icons/fa';
import MyUseEffect from '@/hooks/MyUseEffect';
import { FirendType, UserType } from '@/types/user';

function FriendCard({friend} : {friend : UserType}) {

	return (
		<div className={`h-fit m-2 border-[.3px] border-white/20 relative rounded`}
        >
            <img src={friend?.profile?.avatar} alt="" className="w-full h-[130px] rounded" />
            <div className='w-full h-full p-2 absolute bottom-0 bg-blackG rounded'>
                <div className='absolute bottom-2 text-white'>
                    <h2 className='text-[16px] font-bold capitalize'>{friend?.username}</h2>
                    <p className='text-xs'>level {friend?.profile.level}</p>
                    <Link
                        to={`../../profile/${friend?.username}`}  
                        className='text-[14px]'
                        
                    >
                        <div className='mt-2 rounded flex  items-center'>
                            <p className='mr-2 lowercase'>See profile</p>
                            <FaArrowRight />
                        </div>
                    </Link>
                </div>
            </div>
		</div>
	);
}



export default function Friends() {
	const {authInfos} = useContext(UserContext) || {}
	const {user_name} = useParams()
	const [friends, setFriends] = useState<FirendType[] | null>()
    
    
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
        <div className='w-full h-fit'>
            <div className='mt-10 px-4'>
                <h1 className='text-lg uppercase font-bold'>my friends</h1>
            </div>
            {
                friends?.length ?
                <div className='w-full h-fit grid grid-cols-4 gap-2 mt-4'>
                    {
                        friends?.map((friend, index) => (
                            <FriendCard
                            key={index}
                            friend={friend.sender.username === user_name ? friend.receiver : friend.sender}
                            />
                        ))
                    }
                </div>
                :
                <div className='mt-4 h-[150px] p-2'>
                    <div className='h-full w-full border-[1px] rounded border-white/20 flex justify-center items-center'>
                        <h1 className='text-sm capitalize'>no friends yet</h1>
                    </div>
                </div>
            }
        </div>
    )

}