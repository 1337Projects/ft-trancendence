
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'



function Slide({text, img} : {text : string, img : string}) {
  return (
    <div className='slide'>
      <div className='relative h-[400px]'>
        <img className='absolute top-0 left-[50%] translate-x-[-50%] mx-auto max-w-[400px] w-full h-full' src={img} alt="img" />
      </div>
      <div className='text-center'>
        <h1 className='mt-16 text-[28pt]  font-kav text-white'>{text}</h1>
        <p className='mt-4 text-white max-w-[450px] mx-auto font-light text-sm'>Access your account quickly by signing in, or create a new one to get started. It's fast, secure, and the first step to unlocking all the features we offer!</p>
      </div>
    </div>
  )
}

export default function AuthLayout() {
  
  const [slide, setSlide] = useState(1)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSlide(prev => prev < 3 ? prev += 1 : 1)
    }, 1000 * 8)

    return () => clearTimeout(timer)
  }, [slide])

    return (
        <div className="w-screen h-screen overflow-scroll  bg-white p-4">
          <div className='bg-white w-full  h-full'>
            <div className="h-full w-full flex">
              <div className="h-full w-full lg:w-1/2 flex items-center justify-center">
                  <div className="w-full max-w-[700px] h-full">
                      <Outlet />
                  </div>
              </div>
              <div className="h-full min-h-fit hidden bg-[#1b1b1f]  w-1/2 p-2 lg:flex items-center">
                <div className='w-full'>
                  <div className=''>
                    <div className={`${slide == 1 ? "w-full transition-opacity duration-[4s]  opacity-1" : "w-0 h-0 overflow-hidden opacity-0"}`}>
                      <Slide text="play ping pong" img="/auth/485.svg" />
                    </div>
                    <div className={`${slide == 2 ? "w-full transition-opacity duration-[4s] opacity-1" : "w-0 h-0 overflow-hidden opacity-0"}`}>
                      <Slide text="contact with friends" img="/auth/487.svg" />
                    </div>
                    <div className={`${slide == 3 ? "w-full transition-opacity duration-[4s] opacity-1" : "w-0 h-0 overflow-hidden opacity-0"}`}>
                      <Slide text="add new friends" img="/auth/486.svg" />
                    </div>
                  </div>
                  <div className='mt-[100px] flex justify-center'>
                    {[1, 2, 3].map(item => <div key={item} className={`w-[10px] ml-2 h-[10px] ${item == slide ? "bg-white" : "bg-gray-400"}  rounded-full`} onClick={() => setSlide(item)}></div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}