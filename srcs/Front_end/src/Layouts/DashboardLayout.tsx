
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import SideBar from '../components/sidebar'
import Search from '../components/Search'
import Notification from '../components/Notifications'
import {Invites} from '../components/Notifications'

import LastMatch from '../components/profile/LastMatch'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../Contexts/authContext'
import { TbLogout } from 'react-icons/tb'
import { ApearanceContext } from '../Contexts/ThemeContext'
import { NotificationsContext } from '../Contexts/NotificationsContext'
import { notificationSocket } from '../socket'


function LogoImg() {
  const { theme, color } = useContext(ApearanceContext) || {}
  const color1 = theme == 'light' ? "#263238" : "#ffffff"

  return (
    <svg className='max-w-full max-h-full' width="202" height="184" viewBox="0 0 202 184" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M55.9512 1.77454L206.268 22.0506" stroke={color1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M55.9512 28.3816L206.268 34.7125" stroke={color1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M55.9512 54.9885L206.268 47.2887" stroke={color1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M55.9512 81.5101L206.268 59.9507" stroke={color1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M55.9512 108.117L206.268 72.5269" stroke={color1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M136.542 89.0387V12.6398" stroke={color1} strokeWidth="2" strokeMiterlimit="10"/>
      <path d="M97 97L96 8" stroke={color1} strokeWidth="2" strokeMiterlimit="10"/>
      <path d="M56.0175 108L56 2" stroke={color1} strokeWidth="2" strokeMiterlimit="10"/>
      <path d="M169.052 81.339V17.0031" stroke={color1} strokeWidth="2" strokeMiterlimit="10"/>
      <path d="M193.691 74.2379V20.3395" stroke={color1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M77.5795 109.232C80.2966 115.152 78.9788 120.928 75.4273 130.593C73.761 135.155 75.8525 141.319 79.068 144.531C89.8609 155.335 97.2087 160.285 99.9337 162.956C102.64 165.696 97.8176 171.023 97.8176 171.023C97.8176 171.023 92.5301 175.852 89.7796 173.137C87.0988 170.441 82.1447 163.103 71.3263 152.255C68.1363 149.087 61.925 147.018 57.3361 148.67C47.7162 152.23 41.9669 153.61 36.0116 150.862C31.5864 148.822 27.0478 144.546 20.7007 137.246C5.41179 119.488 10.656 101.943 19.6005 92.933C28.6147 83.9421 46.1608 78.686 63.9062 93.9608C71.2234 100.286 75.548 104.804 77.5795 109.232Z" fill={color}/>
      <path d="M99.9341 162.956C102.64 165.696 97.818 171.023 97.818 171.023C97.818 171.023 92.5305 175.852 89.78 173.137C87.1946 170.504 82.4706 163.563 72.3265 153.269C69.5945 150.485 65.8745 146.502 63.8867 144.29C63.0589 143.471 63.1407 142.185 63.9595 141.357L68.0979 137.193C68.9168 136.366 70.2401 136.308 71.0678 137.127C73.2255 139.123 77.2479 142.812 80.0427 145.501C90.338 155.648 97.3045 160.348 99.9341 162.956Z" fill={color}/>
      <path d="M19.6005 92.933C28.5705 83.9676 46.1608 78.686 63.9062 93.9608C81.0471 108.701 81.6063 113.745 75.4273 130.593C73.761 135.155 75.8781 141.363 79.068 144.531C89.8609 155.335 97.2087 160.285 99.9337 162.956C102.64 165.696 97.8176 171.023 97.8176 171.023C97.8176 171.023 92.5301 175.852 89.7796 173.137C87.0988 170.441 82.1447 163.103 71.3263 152.255C68.1363 149.087 61.925 147.018 57.3361 148.67C40.5805 154.885 35.4921 154.348 20.7007 137.246C5.41179 119.488 10.656 101.943 19.6005 92.933Z" stroke={color1} strokeWidth="2" strokeMiterlimit="10"/>
      <path d="M36.0117 150.862L77.5795 109.232" stroke={color1} strokeWidth="2" strokeMiterlimit="10"/>
      <path d="M62 170.022C62 164.492 57.5508 160 52.0216 160C46.4924 160 42 164.492 42 170.022C42 175.508 46.4924 180 52.0216 180C57.5508 180 62 175.508 62 170.022Z" fill={color1}/>
      <path d="M133.464 101.786H122.342V127.538H128.245V120.437H133.464C140.308 120.437 144.671 116.843 144.671 111.111C144.671 105.379 140.308 101.786 133.464 101.786ZM133.121 115.56H128.245V106.663H133.121C136.8 106.663 138.597 108.288 138.597 111.111C138.597 113.935 136.8 115.56 133.121 115.56ZM151.344 105.037C153.483 105.037 154.852 103.583 154.852 101.7C154.852 99.9894 153.483 98.6206 151.344 98.6206C149.205 98.6206 147.751 99.9894 147.751 101.786C147.751 103.583 149.205 105.037 151.344 105.037ZM148.435 127.538H154.168V107.775H148.435V127.538ZM171.535 107.518C168.883 107.518 166.487 108.374 164.947 110.085V107.775H159.472V127.538H165.204V117.784C165.204 114.106 167.257 112.395 169.995 112.395C172.476 112.395 174.016 113.935 174.016 117.1V127.538H179.748V116.245C179.748 110.17 176.155 107.518 171.535 107.518ZM200.11 107.775V110.341C198.57 108.374 196.26 107.518 193.522 107.518C188.047 107.518 183.683 111.282 183.683 117.015C183.683 122.832 188.047 126.596 193.522 126.596C196.089 126.596 198.227 125.741 199.767 124.115V124.971C199.767 128.564 197.971 130.361 193.95 130.361C191.469 130.361 188.645 129.505 187.02 128.136L184.71 132.243C187.02 134.04 190.699 134.981 194.377 134.981C201.564 134.981 205.499 131.559 205.499 124.201V107.775H200.11ZM194.72 121.891C191.725 121.891 189.501 119.923 189.501 117.015C189.501 114.106 191.725 112.138 194.72 112.138C197.714 112.138 199.853 114.106 199.853 117.015C199.853 119.923 197.714 121.891 194.72 121.891Z" fill={color1}/>
      <path d="M126.96 136.863H115.838V162.614H121.827V155.513H126.96C133.804 155.513 138.167 151.92 138.167 146.188C138.167 140.456 133.804 136.863 126.96 136.863ZM126.618 150.637H121.827V141.739H126.618C130.296 141.739 132.093 143.365 132.093 146.188C132.093 149.011 130.296 150.637 126.618 150.637ZM151.342 162.871C157.588 162.871 162.208 158.679 162.208 152.69C162.208 146.787 157.588 142.595 151.342 142.595C145.011 142.595 140.477 146.787 140.477 152.69C140.477 158.679 145.011 162.871 151.342 162.871ZM151.342 158.165C148.434 158.165 146.295 156.112 146.295 152.69C146.295 149.354 148.434 147.3 151.342 147.3C154.166 147.3 156.39 149.354 156.39 152.69C156.39 156.112 154.166 158.165 151.342 158.165ZM178.035 142.595C175.297 142.595 172.987 143.45 171.447 145.161V142.852H165.972V162.614H171.704V152.861C171.704 149.182 173.672 147.557 176.495 147.557C178.976 147.557 180.43 149.011 180.43 152.177V162.614H186.163V151.321C186.163 145.247 182.655 142.595 178.035 142.595ZM206.524 142.852V145.418C205.07 143.45 202.76 142.595 200.022 142.595C194.547 142.595 190.098 146.359 190.098 152.091C190.098 157.909 194.547 161.673 200.022 161.673C202.589 161.673 204.728 160.818 206.268 159.192V160.048C206.268 163.641 204.471 165.437 200.45 165.437C197.883 165.437 195.146 164.582 193.435 163.213L191.21 167.32C193.52 169.116 197.113 170.057 200.878 170.057C207.979 170.057 212 166.635 212 159.278V142.852H206.524ZM201.134 156.968C198.14 156.968 195.916 155 195.916 152.091C195.916 149.182 198.14 147.3 201.134 147.3C204.129 147.3 206.268 149.182 206.268 152.091C206.268 155 204.129 156.968 201.134 156.968Z" fill={color}/>
    </svg>
  )
}

export default function DashboardLayout() {
    const user = useContext(UserContext)
    const {theme} = useContext(ApearanceContext) || {}
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate();

    const { setNotifications } = useContext(NotificationsContext) || {}

    useEffect(() => {
      const timer = setTimeout(() => {
        notificationSocket.addCallback("FirstSetNots", setNotifications)
        notificationSocket.addCallback("setNots", setNotifications)
        notificationSocket.connect(`${import.meta.env.VITE_SOCKET_URL}wss/notifications/${user?.authInfos?.username}/`)
        notificationSocket.sendMessage({
          event : "fetch nots",
          sender : user?.authInfos?.username
        })


      }, 500)

      return () => {
        clearTimeout(timer)
      }

    }, [])
    
    useEffect(() => {
      const timer = setTimeout(() => {
        fetch(`${import.meta.env.VITE_API_URL}api/profile/profile_data/`, {
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
        fetch(`${import.meta.env.VITE_API_URL}api/profile/info/friends/`, {
          method: 'GET',
          credentials : 'include',
          headers : {
            'Authorization' : `Bearer ${user?.authInfos?.accessToken}`,
          }
        })
        .then(res => res.json())
        .then(res => {
          user?.setFriends(res.data)
        })
        .catch(err => console.log(err))
      }, 300)
      return () => clearTimeout(timer)
    }, [location])

    if (isLoading) {
      return (<></>)
    }

    async function logoutHandler() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/auth/logout/`, {
          credentials : 'include',
          method : 'GET'
        })
  
        if (response.ok) {
          user?.setAuthInfosHandler(null)
          user?.setUser(null)
          navigate("/auth/login")
  
        }
      } catch (err) {
        console.log(err.toString())
      }
    }


    return (
      <>
        <div className="flex justify-between w-full">
          <div className='flex flex-col space-y-2'>

            <div className='h-[100px] flex-shrink-0'>
              <div className={`hidden sm:flex justify-center ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} rounded sm:block h-full cursor-pointer  items-center justify-center text-center w-full text-[22px]`}>
                <div className='w-[60px] mx-16'>
                  <LogoImg />
                </div>
              </div>
            </div>

            <div
              className={`overflow-y-auto flex-shrink-1 ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/0"}`}
              style={{ height: `calc(100vh - 200px)` }}
            >
              <SideBar />
            </div>

            <button
              onClick={logoutHandler}
              className="hidden cursor-pointer sm:block w-full h-[100px] flex-shrink-0"
            >
              <div className={`text-center  sm:flex justify-center w-full items-center rounded ${theme == 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} h-full`}>
                <TbLogout className='text-[20pt] w-full sm:w-fit text-center' />
                <p className='text-xs mt-4 sm:mt-0 sm:ml-4'>Logout</p>
              </div>
					  </button>

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
              <LastMatch />    
            </div>
          </main>
        </div>
      </>
    )
}