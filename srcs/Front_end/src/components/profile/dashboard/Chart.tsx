import { useContext, useEffect, useState } from "react"
import { Bar} from 'react-chartjs-2'
import {defaults}  from 'chart.js/auto'
import { ApearanceContext } from "../../../Contexts/ThemeContext"
import { useOutletContext } from "react-router-dom"
import { UserType } from "@/types/userTypes"
import { UserContext } from "@/Contexts/authContext"
import { XpRecordType } from "@/types/gameTypes"
import { toast } from "react-toastify"

defaults.responsive = true
defaults.maintainAspectRatio = false

export function hexToRgb(hex : string, a : number) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result && result.length >= 4) {
		return  `rgba(${parseInt(result[1]!, 16)},${parseInt(result[2]!, 16)},${parseInt(result[3]!, 16)},${a})`;
	}
	return "rgba(0,0,0,0)";
}



export default function Chart() {

	const {color} = useContext(ApearanceContext) || {}
	const {authInfos} = useContext(UserContext) || {}
	const currentUser : UserType = useOutletContext()
	const [data, setData] = useState<null | {datasets : number[], labels : string[]}>(null)
	

	async function fetchData() {
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}api/profile/experiences/${currentUser.username}/`, {
				method : 'GET',
				credentials : 'include',
				headers : {
					'Authorization' : `Bearer ${authInfos?.accessToken}`,
				}
			})
			if (!res.ok) {
				throw new Error('error')
			} 


			const {data} : {data : XpRecordType[]} = await res.json()
			const datasets : number[] = []
			const labels : string[] = []
			data.forEach(item => {
				const dataset = datasets ? datasets[datasets.length - 1] || 0 : 0
				datasets.push(dataset + item.experience_gained)
				const time = new Date(item.date_logged)
				labels.push(`${time.getHours()}:${time.getMinutes()}`)
			})
			
			setData({labels, datasets})

		} catch (error) {
			toast.error(error instanceof Error ? error.toString() : "somthing went wrong...")
		}
	}


	useEffect(() => {

		if (currentUser) {
			const timer = setTimeout(fetchData, 100)
			return () => clearTimeout(timer)
		}

	}, [currentUser])

	if (!data || !data.datasets || !data.labels) {
		return <div className="w-full h-[200px] bg-gray-300 animate-pulse rounded"></div>
	}
	
	return(
		<div className='w-full' >
			<Bar
			className="max-w-full w-full"
				data={{
					labels: data.labels,
					datasets : [
						{
							label : "xp",
							data : data.datasets,
							borderRadius : 4,
							borderWidth: 2,
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
						x : {grid : {display : false}},
						y : {grid : {display : false}}
					},
					layout : {padding : 0}
				}}
				
			/>
		</div>
	)
}