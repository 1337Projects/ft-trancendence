
import { Outlet } from 'react-router-dom'
import React, { useContext } from 'react'
import { ApearanceContext} from '../Contexts/ThemeContext'
import Picture from '../components/auth/picture'



export default function AuthLayout() {
  const appearence = useContext(ApearanceContext)
    return (
      <>
        <main>
          <div className="w-full h-screen">
            <div className={`main w-full bg-lightItems text-lightText h-full`}>
                <div className="login h-full flex justify-between w-full">
                    <div className="hidden lg:flex pic h-full bg-pong bg-cover w-3/4 flex-col items-center p-2 justify-center">
                      <div className='bg-blue-200/10 backdrop-blur-md h-[90vh] w-[40vw] max-h-[500px] max-w-[500px] p-2 rounded-3xl relative border-white/50 border-[.3px]'>
                        <p className='text-white font-bold text-xl mt-6 capitalize w-48 font-kaushan left-20 leading-10 absolute'>welcome to ping pong community. 🎉</p>
                        <Picture color={appearence?.color}/>
                        <div className='bg-white absolute right-[-20px] text-[20px] top-[30vh] w-10 h-10 flex justify-center items-center rounded-full'>
                          💯
                        </div>
                        <div className='bg-white absolute left-[-20px] text-[20px] bottom-[50px] w-10 h-10 flex justify-center items-center rounded-full'>
                        🔥
                        </div>
                      </div>
                    </div>
                    <div className="login-form p-1 h-[100vh] sm:h-[95vh] w-full lg:w-2/4 flex items-center relative">
                        <div className="w-full">
                          <Outlet />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </main>
      </>
    )
}