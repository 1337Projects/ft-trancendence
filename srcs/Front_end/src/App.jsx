
import './App.css'
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements, json, useNavigate, useSearchParams} from 'react-router-dom'

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
import { useContext, useEffect, useState } from 'react'
import ConversationsList from './components/chat/chat'
import Tournament from './components/game/tournament'

import PingPong from './components/game/PingPong'
import NotFound from './components/NotFound'
import Nav from './components/auth/nav'
import AuthcontextProvidder, { authContextHandler, userContextHandler, userContext, UsercontextProvidder } from './Contexts/authContext'
import { DashboardPrivateRoute } from './privateRoutes/DashboardPrivateRoute'
import ConfirmeEmail from './components/auth/ConfirmeEmail'
import  { jwtDecode } from 'jwt-decode'

function Home() {

  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  console.log(code)

  return (
    <>
      <h1 className='h-[100vh] text-white  sm:text-red-500'>landing page</h1> 
    </>
  )
}

function Oauth() {
  const [searchParam, setSerachParam] = useSearchParams()
  const authHandler = useContext(authContextHandler)
  const navigate = useNavigate()
  useEffect(() => {
    const timer = setTimeout(() => {
      const code = searchParam.get("code")
      fetch(`http://localhost:8000/api/auth/oauth/google/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body : JSON.stringify({
          code : code,
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.status == 200) {
          authHandler(data.access)
          navigate('../../dashboard/profile')
        }
      })
      .catch(err => console.log(err))
    }, 300)
    return () => clearTimeout(timer)
  }, [])
  return (
    <h1></h1>
  )
}
function Oauth42() {
  const [searchParam, setSerachParam] = useSearchParams()
  const authHandler = useContext(authContextHandler)
  const navigate = useNavigate()
  useEffect(() => {
    const timer = setTimeout(() => {
      const code = searchParam.get("code")
      fetch(`http://localhost:8000/api/auth/oauth/42/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials : 'include',
        body : JSON.stringify({
          code : code,
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.status == 200) {
          authHandler(data.access)
          navigate('../../dashboard/profile')
        }
      })
      .catch(err => console.log(err))
    }, 300)
    return () => clearTimeout(timer)
  }, [])
  return (
    <></>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
	<>
	<Route path='/'>
    <Route index element={<Home />} />
    {/* auth */}
		<Route path='auth' element={<AuthLayout />}>
      <Route path='oauth_api' element={<Oauth />} />
      <Route path='oauth_api/42' element={<Oauth42 />} />
		  <Route path='login' element={<Login />} />
		  <Route path='signup' element={<Signup/>} />
		  <Route path='confirme/:id' element={<ConfirmeEmail/>} />
    </Route>


		<Route path='/dashboard' element={<DashboardPrivateRoute />}>
        <Route path='tournment' element={<Tournament/>} />
        <Route path="game/room/:id" element={<PingPong />}/>
        <Route path='game' element={<Game />} />
        <Route  path='setings' element={<Setings />} />

        {/* chat  */}
        <Route path='chat' element={<ChatLayout />}>
          <Route index element={<ConversationsList/>} />
          <Route path=':user' element={<Conversation />} />
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
  // let authTokens = window.localStorage.getItem('auth')
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
  const [token, setToken] = useState({mytoken:'', username:''})
  const [user, setUser] = useState({})


  function ThemeHandler(theme) {
    setTheme(theme);
    window.localStorage.setItem('theme', theme);
  }

  function colorHandler(color) {
    setColor(color);
    window.localStorage.setItem('color' , color) 
  }

  function tokenHandler(mytoken) {
    if (mytoken) {
      const data = jwtDecode(mytoken)
      const username = data.username;
      setToken({...token, mytoken, username})
    } else {
      setToken({mytoken:'', username:''})
    }
  }



  return (
    <div style={{backgroundSize:'50px 50px'}} className={`font-pt ${theme === 'light' ? "bg-lightBg" : "bg-darkBg"}`}>
      <UsercontextProvidder user={user} userhandler={setUser}>
        <AuthcontextProvidder token={token} tokenHandler={tokenHandler}>
            <ThemeProvider theme={theme} handler={ThemeHandler}>
              <ColorProvider color={color} handler={colorHandler}>
                <div className='container max-w-[1400px] mx-auto'>
                  <RouterProvider router={router} />
                </div>
              </ColorProvider>
            </ThemeProvider>
        </AuthcontextProvidder>
      </UsercontextProvidder>
    </div>
  )
}

export default App
