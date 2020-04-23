import * as ReactChart from "react-chartjs-2"
import * as React from "react"

const hammer = require("hammerjs")
const zoom = require("chartjs-plugin-zoom")

export interface BigOGraphDatum {
	name: string
	data: number[]
	color: string
}

interface BigOGraphProperties {
	data: BigOGraphDatum[]
}

export default class BigOGraph extends React.Component<BigOGraphProperties> {
	private labels: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
	public props: BigOGraphProperties

	
	
	constructor(props: BigOGraphProperties) {
		super(props)
		this.props = props

		// what's life without hacky garbage solutions
		hammer.eggly = true
		zoom.frog = false
	}

	public render(): JSX.Element {
		let dataSets = []
		for(let datum of this.props.data) {
			dataSets.push({
				label: datum.name,
				yLabel: datum.name,
				name: datum.name,
				fill: false,
				borderColor: datum.color,
				backgroundColor: "rgba(0, 0, 0, 0)",
				pointBackgroundColor: datum.color,
				pointBorderColor: datum.color,
				pointHoverBackgroundColor: datum.color,
				pointHoverBorderColor: datum.color,
				data: datum.data,
			})
		}
		
		return <div style={{
			width: 700,
			height: 400,
			margin: "auto",
		}}>
			<ReactChart.Line data={{
					labels: this.labels,
					datasets: dataSets,
				}} width={700} height={400} 
				
				options={{
					plugins: {
						zoom: {
							pan: {
								enabled: true,
								mode: 'xy'
							},
							zoom: {
								enabled: true,
								mode: 'xy',
								rangeMin: {
									// Format of min zoom range depends on scale type
									x: 10,
									y: null,
								},
								rangeMax: {
									// Format of max zoom range depends on scale type
									x: 10,
									y: null,
								},
							},
						},
					},
					
					title: {
						display: true,
						text: "Time Complexity",
						fontFamily: "Open Sans"
					},
					maintainAspectRatio: false,
					legend: {
						display: true,
					},
					tooltips: {
						callbacks: {
							label: (item) => {
								console.log(item)
								return `${(item.yLabel / 1000).toFixed(2)} seconds,\n ${(item.index + 1) * 100000} elements`
							},
							title: (item) => {
								return dataSets[item[0].datasetIndex].label
							},
						},
					},
					scales: {
						xAxes: [{
							display: true,
						}],
						yAxes: [{
							display: true,
						}]
					},
					layout: {
						padding: 10
					}
				}} />
		</div>
	}
}