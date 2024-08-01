
import { Outlet, useLocation } from 'react-router-dom'
import SideBar from '../components/sidebar'
import Search from '../components/Search'
import Notification from '../components/Notifications'
import {Invites} from '../components/Notifications'

import LastMatch from '../components/profile/lastMatch'

export default function DashboardLayout() {

    const location = useLocation()
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