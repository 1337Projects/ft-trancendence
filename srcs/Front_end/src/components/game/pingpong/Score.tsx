import React from "react"

function Radio({checked}) {
    return (
        <li><input type="radio" className="w-[11px]" onChange={() => {}} checked={checked} /></li>
    )
}

export default function Score({data}) {

    if (!data) {
        return (
            <div className='h-[40px] flex w-full justify-between animate-pulse'>
                <div className="flex items-start">
                    <div className="mr-4 bg-gray-300 w-[40px] h-[40px] rounded-full" />
                    <div>
                        <div className='w-[60px] h-4 bg-gray-300 rounded-full' />
                        <div className='w-[100px] h-2 mt-2 bg-gray-300 rounded-full' />
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="flex-col flex items-end">
                        <div className='w-[60px] h-4 bg-gray-300 rounded-full' />
                        <div className='w-[100px] h-2 mt-2 bg-gray-300 rounded-full' />
                    </div>
                    <div className="ml-4 bg-gray-300 w-[40px] h-[40px] rounded-full" />
                </div>
            </div>
        )
    }
    
    return (
        <div className="h-[40px] w-full">
            <div className="h-full w-full flex justify-between items-center">
                <div className=''>
                    <div className=" flex items-center p-2 rounded-full border-[0px] border-white/30">
                        <div className="mr-4 border-[.3px] w-[40px] h-[40px] flex justify-center items-center rounded-full">
                            <img src={data.players.player1.user.profile.avatar} className="bg-white max-w-full rounded-full max-h-full" alt="" />
                        </div>
                        <div className="relative">
                            <h1 className='text-[12pt] font-bold'>{data.players.player1.user.username}</h1>
                            <ul className="flex justify-between w-[90px]">
                                {[...Array(7)].map((item, index) => <Radio key={index} checked={false} />)}
                            </ul>
                            {/* <h1 className=' text-[10px]'>LVL</h1> */}
                        </div>
                    </div>
                </div>
                <div className="score text-center">
                    <div className="text-[12pt]">0 / 0</div>
                </div>
                <div className='relative '>
                    <div className=" flex items-center p-2 rounded-full border-[0px] border-white/30">
                        <div className="text-right">
                            <h1 className="text-[12pt] font-bold">{data.players.player2.user.username}</h1>
                            <ul className="flex justify-between w-[90px]">
                                {[...Array(7)].map((item, index) => <Radio key={index} checked={false} />)}
                            </ul>
                        </div>
                        <div className="ml-4 border-[.3px] w-[40px] h-[40px] flex justify-center items-center rounded-full">
                            <img src={data.players.player2.user.profile.avatar} className="bg-white max-w-full rounded-full max-h-full" alt="" />
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    )
}