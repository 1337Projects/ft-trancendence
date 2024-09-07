
import { Outlet, useLocation } from 'react-router-dom'
import SideBar, {LargeSideBar, MobileSideBar} from '../components/sidebar'
import Search from '../components/Search'
import Notification from '../components/Notifications'
import {Invites} from '../components/Notifications'

import LastMatch from '../components/profile/lastMatch'
import { useContext, useEffect, useState } from 'react'
import { authContext, friendsContext, friendsContextHandler, userContextHandler } from '../Contexts/authContext'

export default function DashboardLayout() {
    const location = useLocation()
    const auth = useContext(authContext)
    const userHandler = useContext(userContextHandler)
    const friendsHandler = useContext(friendsContextHandler)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
      const timer = setTimeout(() => {
        fetch(`http://localhost:8000/api/profile/profile_data/`, {
          method: 'GET',
          credentials : 'include',
          headers : {
            'Authorization' : `Bearer ${auth.mytoken}`,
          }
        })
        .then(res => res.json())
        .then(res => {
          userHandler(res.data)
        })
        .catch(err => console.log(err))
      }, 300)
      return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
      const timer = setTimeout(() => {
        fetch(`http://localhost:8000/api/friends/get_friends/`, {
          method: 'GET',
          credentials : 'include',
          headers : {
            'Authorization' : `Bearer ${auth.mytoken}`,
          }
        })
        .then(res => res.json())
        .then(res => {
          friendsHandler(res.data)
          setIsLoading(false)
        })
        .catch(err => console.log(err))
      }, 300)
      return () => clearTimeout(timer)
    }, [location])

    if (isLoading) {
      return (<></>)
    }
    return (
      <>
        <div className="flex justify-between w-full">
          <div className=''>
            <div className='hidden sm:block xl:hidden'>
              <SideBar /> 
            </div>
            <div className='hidden xl:block '>
              <LargeSideBar/>
            </div>
            <div className='sm:hidden bg-red-300'>
              <MobileSideBar />
            </div>
          </div>
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
              {
                location.pathname.includes('profile') ? <LastMatch /> : ""
              }
            </div>

          </main>
        </div>
      </>
    )
}