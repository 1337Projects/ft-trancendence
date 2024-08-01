import { faGamepad } from "@fortawesome/free-solid-svg-icons"
import { faClock } from "@fortawesome/free-solid-svg-icons"
import {faTrophy} from "@fortawesome/free-solid-svg-icons"
import {faCertificate} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext } from "react"
import {ThemeContext} from '../../Contexts/ThemeContext'

import Avatar from "../../assets/avatar.png"
import Pic from "../../assets/profile.jpeg"


import { LineChart } from '@mui/x-charts/LineChart';


import Status from "./status"


export default function FriendStatus() {
	const theme = useContext(ThemeContext);

    return (
		<div className=" flex flex-col w-[80%] h-vh">
			<div className={` flex flex-col rounded-sm ml-[1px] mt-[10px] w-[800px] h-[530px] ${theme === 'light' ? "bg-lightItems" : "bg-darkItems"}`}>
				<div className="flex ">
					<div className=" self-center h-[90%] w-[60%] bg flex flex-col justify-start items-center">
						<div className=" grow h-[20px] w-[85%] flex justify-between items-center ">
							<div className="w-[10%]">
								<img src={Pic} alt="Description" className=" h-[95%] w-[92%] rounded-full" />
							</div>
							<div className=" flex flex-col justify-between h-[45%] w-[87%] ">
								<p className={`text-[10px] font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>enjoy</p>
								<p className={`text-[12px] font-semibold  ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>aamhamdi</p>
							</div>
						</div>
						<div className="flex flex-col  flex-wrap grow h-[30px] w-[85%]">
							<div className="  flex  justify-between items-center h-[20px] mb-[2%]">
								<p className={`text-[10px] font-light ${theme === 'light' ? "text-lightText" : "text-darkText"} `}><span className="text-[15px]"> 30</span>/100</p>
								<p className={`text-[13px] font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>4.30 LVL</p>
							</div>
							<div className={`${theme === 'light' ? "bg-lightText" : "bg-[#ffffff]"} max-h-[20px]  h-[20px] rounded-[7px] mt-[1px]`}>
								<div className={` bg-[#C53F3F] h-full rounded-[6px] w-[30%] `}></div>
							</div>
						</div>
						<div className="w-[85%] h-[200px] flex flex-col ">
							<p className={`text-[14px] font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Progress</p>
							<div className='h-[100%] w-[120%] ml-[-45px]'>
								<LineChart
									leftAxis={null}
									bottomAxis={null}
									series={[
										{ curve: "linear", data: [0, 1, 6, 3, 9.3, 3, 0, 10, 10, -10, 10,0, 1, 6, 3, 9.3, 3, 0, 10, 10, -10, 10, 2, 10], color: '#ffffff' },
										
									]}
									/>
							</div>
						</div>
					</div>
					<div className="w-[40%]">
						<img src={Avatar} alt="Description" className=" h-[80%] mt-[-3%] " />
					</div>
				</div>
				<div className="flex w-[90%] self-center mb-[20px]  ">
					<div className=" grow w-[50%] h-[50px] flex items-center">
							<div className="w-[15%]  flex flex-col justify-center">
								<p className={`text-[10px] font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Win</p>
								<div className="flex items-center">
									<FontAwesomeIcon icon={faTrophy} style={{color: "#db4658"}} className="w-[13px] ml-[1px] mr-[2px]" />
									<p className={`text-[10px] ml-1 font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>11</p>
								</div>
							</div>
							<div className="w-[15%] bg  flex flex-col justify-center max-w-[22%] grow">
								<p className={`text-[10px] font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Time</p>
								<div className="flex items-center">
									<FontAwesomeIcon icon={faClock}  style={{color: "#db4658"}}className="w-[12px] ml-[1px] mr-[2px]" />
									<p className={`text-[10px] ml-1 font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>2h 30 min</p>
								</div>
							</div>
							<div className="w-[30px] flex flex-col justify-center">
								<p className={`text-[10px] font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>Rate</p>
								<div className="flex items-center">
									<FontAwesomeIcon icon={faCertificate} style={{color: "#db4658"}}className="w-[12px] ml-[1px] mr-[2px]" />
									<p className={`text-[10px] ml-1 font-thin ${theme === 'light' ? "text-lightText" : "text-darkText"} `}>5</p>
								</div>
							</div>
					</div>
					<div className="grow w-[300px]  flex justify-around">
						<button className="bg-[#4897cc] rounded-[15px] text-[15px] pt-[2.5px] pb-[2.5px] pl-[23px] pr-[23px] text-darkText">Invite</button>
						<button className="bg-[#FF8E3D] rounded-[15px] text-[15px] pt-[2.5px] pb-[2.5px] pl-[23px] pr-[23px] text-darkText">Block</button>
						<button className="bg-[#48cc83] rounded-[15px] text-[15px] pt-[2.5px] pb-[2.5px] pl-[23px] pr-[23px] text-darkText">Message</button>
					</div>
				</div>
				
			</div>
			<Status />
		</div>
    )
}