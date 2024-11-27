import React, { useContext } from 'react'
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'


import UserContextProvider from './Contexts/authContext'
import ApearanceProvider, { ApearanceContext } from './Contexts/ThemeContext'


import AuthLayout from './Layouts/AuthLayout'
import ChatLayout from './Layouts/ChatLayout'


import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import ConfirmeEmail from './components/auth/ConfirmeEmail'
import { Oauth } from './components/auth/Oauth'
import TwoFactor from './components/auth/2fa'
import TwoFacCheck from './components/auth/2faCheck'

import { DashboardPrivateRoute } from './privateRoutes/DashboardPrivateRoute'


import Game from './components/game/Game'
import Profile, { UserProfile } from './components/profile/profile'
import Setings from './components/settings/Setings'
import Conversation from './components/chat/Conversation'
// import Tournament from './components/game/tournament'
// import PingPong from './components/game/PingPong'
import Waiting from './components/game/waiting'
import PingPong from './components/game/PingPong'
// import {TournmentWaiting} from './components/game/tournament'

import NotFound from './components/NotFound'
import ForgetPassword from './components/auth/ForgetPassword'
import { DialogContext, DialogContextProvider } from './Contexts/DialogContext'
import Tournment from './components/game/tournment'

import Friends from './components/profile/friend'
import WaitingTournment from './components/game/Waiting_tr'
import GameLayout from './Layouts/GameLayout'
import Players from './components/game/Players'
import Schema from './components/game/Schema'


function Home() {

  return (
    <>
      <h1 className='h-[100vh] text-white  sm:text-red-500'>landing page</h1> 
    </>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route index element={<Home />} />
      {/* auth */}
      <Route path='auth' element={<AuthLayout />}>
        <Route path='oauth/google' element={<Oauth url={`${import.meta.env.VITE_API_URL}api/auth/google_callback/`} />} />
        <Route path='oauth/42' element={<Oauth url={`${import.meta.env.VITE_API_URL}api/auth/oauth/intra/`} />} />
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<Signup/>} />
        <Route path='2fa' element={<TwoFactor/>} />
        <Route path='2faCheck' element={<TwoFacCheck/>} />
        <Route path='forgetPassowrd' element={<ForgetPassword />} />
        <Route path='confirme/:id' element={<ConfirmeEmail/>} />
      </Route>

      <Route path='/dashboard' element={<DashboardPrivateRoute />}>

        {/* <Route path='game' element={<Game />} / > */}
        <Route path='game' element={<Game />} />
        <Route path='game/waiting' element={<Waiting />} />

        <Route path='game/room/:id' element={<PingPong />} />
        
        <Route path='game/tournment' element={<GameLayout />}>
          <Route path=':id/:type' element={<Tournment />} >
            <Route index element={<Schema />} />
            <Route path='leaderboard' element={<div>loaderboard</div>} />
            <Route path='players' element={<Players />} />
            <Route path='matches' element={<div>matches</div>} />
          </Route>
          <Route path='waiting/:id' element={<WaitingTournment />} />
        </Route>



        <Route path='profile/:user_name' element={<Profile />}>
          <Route index element={<UserProfile />} />
          <Route path='friends' element={<Friends />} />
        </Route>

        <Route path='chat' element={<ChatLayout />}>
          <Route path=':user' element={<Conversation/>} />
        </Route>

        <Route  path='setings' element={<Setings />} />
      </Route>

      <Route path='*' element={<NotFound/>} />
    </Route>
  )
)
      //     <Route path='game/tournment' element={<Tournament/>} />
      //     <Route path='game/tournment/waiting' element={<TournmentWaiting/>} />
      //     <Route path="game/room/:id" element={<PingPong />}/>
      //     <Route path='game/waiting' element={<Waiting />} />

      //     {/* chat  */}



function Main() {
  const appearence = useContext(ApearanceContext)
  const {open} = useContext(DialogContext) || {}

  return (
    <div className={`w-screen h-screen font-pt ${appearence?.theme === 'light' ? "bg-lightBg" : "bg-darkBg"}`}>
      {
        open &&
        <div className={`w-[100vw] h-[100vh] absolute bg-black/40 backdrop-blur-sm z-30`}></div>
      }
      <RouterProvider router={router} />
    </div>
  )
}

function App() {
  
  return (
      <ApearanceProvider>
        <UserContextProvider>
          <DialogContextProvider>
            <Main />
          </DialogContextProvider>
        </UserContextProvider>
      </ApearanceProvider>
  )
}

export default App
