import { useContext } from 'react'
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'


import UserContextProvider from './Contexts/authContext'
import ApearanceProvider, { ApearanceContext } from './Contexts/ThemeContext'


import AuthLayout from './Layouts/AuthLayout'
import ChatLayout from './Layouts/ChatLayout'


import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import { Oauth } from './components/auth/Oauth'
// import TwoFactor from './components/auth/2fa'
import TwoFacCheck from './components/auth/2faCheck'

import { DashboardPrivateRoute } from './privateRoutes/DashboardPrivateRoute'


import Game from './components/game/Game'
import Profile from './components/profile/profile'
import Dashboard from './components/profile/dashboard/Dashboard'
import Setings from './components/settings/Setings'
import Conversation from './components/chat/Conversation'
import Waiting from './components/game/pingpong/waiting'
import PingPong from './components/game/pingpong/PingPong'

import NotFound from './components/NotFound'
import ForgetPassword from './components/auth/ForgetPassword'
import { DialogContext, DialogContextProvider } from './Contexts/DialogContext'
import Tournment from './components/game/tournament/tournment'

import Friends from './components/profile/friend'
import WaitingTournment from './components/game/tournament/Waiting'
import GameLayout from './Layouts/GameLayout'
import NotificationsContextProvider from './Contexts/NotificationsContext'
import TicTacTeo from './components/game/TicTacTeo'
import ChatAsset from './components/assets/ChatAsset'


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
        {/* <Route path='2fa' element={<TwoFactor are_you_in={false} cancel={false} setShowPopup={useState} setTwofa={useState} />} /> */}
        <Route path='2faCheck' element={<TwoFacCheck/>} />
        <Route path='forgetPassowrd' element={<ForgetPassword />} />
      </Route>

      <Route path='/dashboard' element={<DashboardPrivateRoute />}>

        
        <Route path='game' element={<Game />} />
        <Route path='game/waiting/room/:type/:game' element={<Waiting />} />
        
        <Route path='game/ping-pong/room/:game_id' element={<PingPong />} />
        <Route path='game/tic-tac-toe/room/:game_id' element={<TicTacTeo />} />
        
        <Route path='game/tournment/:tournament_id' element={<GameLayout />}>
          <Route index element={<Tournment />} />
          <Route path='play/:game_id' element={<PingPong />} />
        </Route>
        <Route path='game/tournment/waiting/:id' element={<WaitingTournment />} />



        <Route path='profile/:user_name' element={<Profile />}>
          <Route index element={<Dashboard />} />
          <Route path='friends' element={<Friends />} />
        </Route>

        <Route path='chat' element={<ChatLayout />}>
          <Route index element={<ChatImg />} />
          <Route path=':user' element={<Conversation/>} />
        </Route>

        <Route  path='setings' element={<Setings />} />
      </Route>

      <Route path='*' element={<NotFound/>} />
    </Route>
  )
)
  
function ChatImg() {
  return (
      <div className='w-full h-full p-10 flex justify-center items-center'>
        <div className='text-center'>
          <ChatAsset />
          <p className='text-xs max-w-[450px] mx-auto'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium vero asperiores tempora iure ex autem quod. Porro animi pariatur distinctio?</p>
        </div>
      </div>
  )
}



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
    <UserContextProvider>
      <NotificationsContextProvider>
        <ApearanceProvider>
            <DialogContextProvider>
              <Main />
            </DialogContextProvider>
        </ApearanceProvider>
      </NotificationsContextProvider>
    </UserContextProvider>
  )
}

export default App
