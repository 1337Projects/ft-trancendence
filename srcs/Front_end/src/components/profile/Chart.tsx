import React, { useContext } from "react"
import { LineChart } from "@mui/x-charts/LineChart"
import { ApearanceContext } from "../../Contexts/ThemeContext"

export default function Chart() {
	const appearence = useContext(ApearanceContext)
	const chartColor = appearence?.theme == 'light' ? "#374151" : "#ffffff"

	
	return(
		<div className='h-[100px] w-full'>
			<LineChart
				leftAxis={null}
				bottomAxis={null}
				series={
					[{ 
						curve: "linear",
						data: [
							// 0, 0
							0, 1, 6, 3, 9.3, 3, 0, 10, 0, -10, 10,0, 1, 6, 3, 9.3, 3, 0, 10, 0, -10, 10, 2, 10,
						],
						color: chartColor,
						showMark:false
					}]
				}
				margin={{left: 10,bottom:10, top:10, right:10}}
				disableLineItemHighlight={true}
			/>
		</div>
	)
}