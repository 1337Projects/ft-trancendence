import { useContext } from 'react'
import {Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'


import UserContextProvider from './Contexts/authContext'
import ApearanceProvider, { ApearanceContext } from './Contexts/ThemeContext'


import AuthLayout from './Layouts/AuthLayout'
import ChatLayout from './Layouts/ChatLayout'


import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import { Oauth } from './components/auth/Oauth' 
import TwoFacCheck from './components/auth/2faCheck'

import { DashboardPrivateRoute } from './privateRoutes/DashboardPrivateRoute'


import Game from './components/game/Game'
import Profile from './components/profile/profile'
import Dashboard from './components/profile/dashboard/Dashboard'
import Setings from './components/settings/Setings'
import Conversation from './components/chat/Conversation'
import Waiting from './components/game/pingpong/waiting'
import PingPong from './components/game/pingpong/PingPong'

import NotFound from './components/NotFound.tsx'
import ForgetPassword from './components/auth/ForgetPassword'
import { DialogContext, DialogContextProvider } from './Contexts/DialogContext'
import Tournment from './components/game/tournament/tournment'

import Friends from './components/profile/friend'
import WaitingTournment from './components/game/tournament/Waiting'
import GameLayout from './Layouts/GameLayout'
import NotificationsContextProvider from './Contexts/NotificationsContext'
import TicTacTeo from './components/game/TicTacTeo'
import ChatAsset from './components/assets/ChatAsset'
import { AuthPrivateRoute } from './privateRoutes/AuthPrivateRoute.tsx'


function Home() {

  return (
    <Navigate to="/dashboard/game" />
  )
}


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>

      <Route index element={<Home />} />

      <Route element={<AuthPrivateRoute />} >
        <Route element={<AuthLayout />}>
          <Route path='auth/oauth/google' element={<Oauth url={`${import.meta.env.VITE_API_URL}api/auth/google_callback/`} />} />
          <Route path='auth/oauth/42' element={<Oauth url={`${import.meta.env.VITE_API_URL}api/auth/oauth/intra/`} />} />
          <Route path='auth/login' element={<Login />} />
          <Route path='auth/signup' element={<Signup/>} />
          <Route path='auth/2faCheck' element={<TwoFacCheck/>} />
          <Route path='auth/forgetPassowrd' element={<ForgetPassword />} />
        </Route>
      </Route>

 
      <Route element={<DashboardPrivateRoute />}>
        <Route path='dashboard/game' >
          <Route index element={<Game />} />
          <Route path='waiting/room/:type/:game' element={<Waiting />} />
          <Route path='ping-pong/room/:game_id' element={<PingPong />} />
          <Route path='tic-tac-toe/room/:game_id' element={<TicTacTeo />} />
          <Route path='tournment/waiting/:id' element={<WaitingTournment />} />
          <Route path='tournment/:tournament_id' element={<GameLayout />}>
            <Route index element={<Tournment />} />
            <Route path='play/:game_id' element={<PingPong />} />
          </Route>
        </Route>
        

        <Route path='dashboard/profile/:user_name' element={<Profile />}>
          <Route index element={<Dashboard />} />
          <Route path='friends' element={<Friends />} />
        </Route>


        <Route path='dashboard/chat' element={<ChatLayout />}>
          <Route index element={<ChatImg />} />
          <Route path=':user' element={<Conversation/>} />
        </Route>


        <Route  path='dashboard/settings' element={<Setings />} />
    
      </Route>


      <Route path='*' element={<NotFound/>} />

    </Route>
  )
)
  
function ChatImg() {
  return (
      <div className='w-full h-full min-h-fit p-10 flex justify-center items-center overflow-scroll'>
        <div className='text-center h-fit'>
          <ChatAsset />
          <p className='text-xs max-w-[450px] mx-auto'>Ready to chat? Select a conversation from your list or start a new one. Whether it's a quick message or an in-depth discussion, your chat experience is just a click away. Stay connected and enjoy seamless conversations with friends, colleagues, or anyone you need to reach.</p>
        </div>
      </div>
  )
}



function Main() {
  const appearence = useContext(ApearanceContext)
  const {open} = useContext(DialogContext) || {}

  return (
    <div className={`w-screen h-screen relative font-pt ${appearence?.theme === 'light' ? "bg-lightBg" : "bg-darkBg"}`}>
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
