import React, { useContext } from "react"
import { ApearanceContext } from "../../../Contexts/ThemeContext"


export function PlayerWon({quitHandler, data}) {

    const { color } = useContext(ApearanceContext) || {}

    return (
        <div className=' border-white/30 z-10  top-0 left-0 w-full h-full'>
            <div className='w-[80%] min-w-[500px]  h-[500px] ml-[50%]  border-white/20 translate-x-[-50%]'>
                <div className='h-[140px] flex p-4'>
                    {
                            data?.winner?.user?.username == 'aamhamdi' ? 
                            <div className='w-full h-fit p-6'>
                                <h1 className='text-[30px] uppercase font-bold'>congratulations !</h1>
                                <p className='mt-2 text-[11px] capitalize w-[270px]'>you are the winner you did well, goo game, plase go show them your skills again</p>
                            </div>
                            :
                            <div className='w-full h-fit p-10'>
                                <h1 className='text-[30px] uppercase font-bold'>unfortunately !</h1>
                                <p className='mt-2 text-[11px] capitalize w-[270px]'>you couldnt do it this time , u did play well but unlucky plase go show them ur real skills</p>
                            </div>
                    }
                    {/* <div>
                        <FontAwesomeIcon icon={faClose} />
                    </div> */}
                </div>
                <div className='flex  w-full'>
                    <div className='w-1/2 p-10 flex justify-center items-center text-center'>
                        <div className='w-[50%]'>
                            <img src={data?.winner?.user?.profile?.image} className='w-[80px] border-[1px] ml-[50%] translate-x-[-50%] rounded-full' alt="" />
                            <h1 className='mt-2'>{data?.winner?.user?.username}</h1>
                            <div className='my-2'>
                                <ul className='flex justify-center text-orange-300'>
                                    {/* <li><FontAwesomeIcon icon={faStar} /></li>
                                    <li><FontAwesomeIcon icon={faStar} /></li>
                                    <li><FontAwesomeIcon icon={faStar} /></li>
                                    <li><FontAwesomeIcon icon={faStar} /></li>
                                    <li><FontAwesomeIcon icon={faStar} /></li> */}
                                </ul>
                            </div>
                            <h1 className='my-2'>+ {'aamhamdi' == data?.winner?.user?.username ? "100" : "10"}px</h1>
                            <button style={{background:color}} onClick={quitHandler} className='text-white px-4 my-8 w-full rounded-full uppercase h-[40px]'>quit</button>
                        </div>
                    </div>
                    <div className='w-1/2 h-full flex items-center p-8'>
                        {
                            data?.winner?.user?.username == 'aamhamdi' ? 
                            <div>
                                <img src="/wiin.svg" alt="" />
                            </div> 
                            :
                            <div>
                                <img src="/loos.svg" alt="" />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


// function ActionsMenu({rotateHandler, pauseHandler}) {
//     return (
//         <>
//             <div className='bg-darkBg/50 backdrop-blur-md text-[16px] w-14 rounded-sm h-[170px] absolute right-0 top-0 flex justify-center items-center'>
//                 <ul>
//                     {/* <li className='text-center'><FontAwesomeIcon icon={faClose} /></li>
//                     <li className='mt-4 text-center' onClick={rotateHandler}><FontAwesomeIcon icon={faRotate}/></li>
//                     <li className='mt-4 text-center'><FontAwesomeIcon  icon={faImage}/></li>
//                     <li className='mt-4 text-center' onClick={pauseHandler} ><FontAwesomeIcon  icon={faCirclePause}/></li> */}
//                 </ul>
//             </div>
//         </>
//     )
// }
