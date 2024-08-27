
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import SideBar from '../components/sidebar'
import Search from '../components/Search'
import Notification from '../components/Notifications'
import {Invites} from '../components/Notifications'

import LastMatch from '../components/profile/lastMatch'
import { useEffect } from 'react'

export default function DashboardLayout() {
    const location = useLocation()


    useEffect(() => {
      const timer = setTimeout(() => {
        fetch(`http://localhost:8000/api/profile/infos/`, {
          method: 'GET',
          credentials : 'include',
          headers : {
            'Authorization' : `Bearer ${auth.mytoken}`,
          }
        })
        .then(res => res.json())
        .then(res => {
          console.log(res)
          // console.log(res)
          // userHandler(res.data)
          // setIsLoading(false)
        })
        .catch(err => console.log(err))
      }, 300)
      return () => clearTimeout(timer)
    }, [])

    return (
      <>
        <div className="flex justify-between w-full p-2">
          <SideBar /> 
          <main className='w-full ml-2 flex'>

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