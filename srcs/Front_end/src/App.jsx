
import './App.css'
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'

// Layout
import AuthLayout from './Layouts/AuthLayout'
import ChatLayout from './Layouts/ChatLayout'
import DashboardLayout from './Layouts/DashboardLayout'
import ProfileLayout from './Layouts/ProfileLayout'

// auth
import Login from './components/auth/login'
import Signup from './components/auth/signup'

// dashboard
import Game from './components/game/game'
import Profile from './components/profile/profile'
import Setings from './components/settings/Setings'
import Conversation from './components/chat/Conversation'

import {ThemeProvider, ColorProvider} from './Contexts/ThemeContext'
import { useState } from 'react'
import ConversationsList from './components/chat/chat'
import Tournament from './components/game/tournament'

import PingPong from './components/game/PingPong'
import NotFound from './components/NotFound'
import Nav from './components/auth/nav'

function Home() {
  return (
    <>
      <h1 className='h-[100vh] text-white  sm:text-red-500'>landing page</h1> 
    </>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
	<>
	<Route path='/'>
    <Route index element={<Home />} />
    {/* auth */}
		<Route path='auth' element={<AuthLayout />}> 
		  <Route path='login' element={<Login />} />
		  <Route path='signup' element={<Signup/>} />
    </Route>


		<Route path='/dashboard' element={<DashboardLayout />}>

		  <Route path='tournment' element={<Tournament/>} />
		  <Route path="game/room/:id" element={<PingPong />}/>
		  <Route path='game' element={<Game />} />
		  <Route  path='setings' element={<Setings />} />

      {/* chat  */}
		  <Route path='chat' element={<ChatLayout />}>
			  <Route index element={<ConversationsList/>} />
			  <Route path=':id' element={<Conversation />} />
		  </Route>

      {/* profile */}
      <Route path='profile' element={<ProfileLayout />}>
        <Route index element={<Profile />} />
		    <Route path=':user' element={<Profile />} />
      </Route>
      
	  </Route>
		<Route path='*' element={<NotFound/>} />
  </Route>
	</>
  )
)


function App() {

  let appliedTheme = window.localStorage.getItem('theme')
  let appliedColor = window.localStorage.getItem('color')
  if (!appliedTheme) {
    window.localStorage.setItem('theme' ,'dark')
    appliedTheme = 'dark'
  }
  if (!appliedColor) {
    window.localStorage.setItem('color' ,'#C53F3F')
    appliedColor = '#C53F3F'
  }
  const [theme, setTheme] = useState(appliedTheme)
  const [color, setColor] = useState(appliedColor);

  function ThemeHandler(theme) {
    setTheme(theme);
    window.localStorage.setItem('theme', theme);
  }

  function colorHandler(color) {
    setColor(color);
    window.localStorage.setItem('color' , color) 
  }

  return (
    <div style={{backgroundSize:'50px 50px'}} className={`font-pt ${theme === 'light' ? "bg-lightBg" : "bg-darkBg"}`}>
      <ThemeProvider theme={theme} handler={ThemeHandler}>
        <ColorProvider color={color} handler={colorHandler}>
          <div className='container max-w-[1400px] mx-auto'>
            <RouterProvider router={router} />
          </div>
        </ColorProvider>
      </ThemeProvider>
    </div>
  )
}

export default App
