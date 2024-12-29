import React, { useContext } from "react"
import {Line} from 'react-chartjs-2'
import {defaults}  from 'chart.js/auto'
import { ApearanceContext } from "../../../Contexts/ThemeContext"

defaults.responsive = true
defaults.maintainAspectRatio = false

export default function Chart() {

	const {color} = useContext(ApearanceContext) || {}

	function hexToRgb(hex : string, a : number) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return  `rgba(${parseInt(result![1], 16)},${parseInt(result![2], 16)},${parseInt(result![3], 16)},${a})`;
	}

	
	return(
		<div className='w-full' >
			<Line
			className="max-w-full w-full"
				data={{
					labels: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun"],
					datasets : [
						{
							label : "xp",
							data : [0, 80, 70, 130, 100 , 150, 10],
							tension : 0.4,
							fill : "start",
							backgroundColor : (context) => {
								const ctx = context.chart.ctx
								const cc = ctx.createLinearGradient(0,60,0,300);
								cc.addColorStop(0, hexToRgb(color!, 70));
        						cc.addColorStop(1, hexToRgb(color!, 0));
								return cc
							},
							borderColor : color
						},
					],	
				}}
				options={{
					scales : {
						x : {
							grid : {
								display : false
							}
						},
						y : {
							grid : {
								display : false
							}
						}
					},
					layout : {
						padding : 0
					}
				}}
				
			/>
		</div>
	)
}