
import { Outlet } from 'react-router-dom'
import SideBar from '../components/sidebar'
import Search from '../components/Search'
import Notification from '../components/Notifications'
import {Invites} from '../components/Notifications'

import LastMatch from '../components/profile/LastMatch'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../Contexts/authContext'


export default function DashboardLayout() {
    const user = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
      const timer = setTimeout(() => {
        fetch(`http://localhost:8000/api/profile/profile_data/`, {
          method: 'GET',
          credentials : 'include',
          headers : {
            'Authorization' : `Bearer ${user?.authInfos?.accessToken}`,
          }
        })
        .then(res => res.json())
        .then(res => {
          user?.setUser(res.data)
          setIsLoading(false)
        })
        .catch(err => console.log(err))
      }, 300)
      return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
      const timer = setTimeout(() => {
        fetch(`http://localhost:8000/api/profile/info/friends/`, {
          method: 'GET',
          credentials : 'include',
          headers : {
            'Authorization' : `Bearer ${user?.authInfos?.accessToken}`,
          }
        })
        .then(res => res.json())
        .then(res => {
          console.log(res)
          user?.setFriends(res.data)
        })
        .catch(err => console.log(err))
      }, 300)
      return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
      return (<></>)
    }
    return (
      <>
        <div className="flex justify-between w-full">
          <SideBar /> 
          <main className='w-full sm:ml-2 flex'>
            <div className="main flex-grow min-w-[500px] sm:min-w-[500px]">
              <div className="nav w-full flex-grow">
                <Search />
              </div>
              <Outlet />
            </div>

            <div className="side ml-2 flex-grow max-w-[300px] min-w-[300px] hidden lg:block">
              <Notification />
              <Invites />
              <LastMatch />    
            </div>
          </main>
        </div>
      </>
    )
}