
import Rectangle from "./rectangle"
import Graph from "./graph"
import InsertionSort from "./sorts/insertion"
import QuickSort from "./sorts/quick"
import MergeSort from "./sorts/merge"
import LSDSort from "./sorts/lsd"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { element } from "prop-types"
import Sort from "./sort"
import BigOGraph from "./bigOGraph"

/*function createGraph(id: string): Graph {
	let gl = (document.getElementById(id) as HTMLCanvasElement).getContext("webgl2")

	let graph = new Graph(gl, document.getElementById(id) as HTMLCanvasElement)
	graph.width = 500
	graph.height = 300

	for(let i = 0; i < 1000; i++) {
		let rectangle = new Rectangle(graph)
		rectangle.scale = Math.random()
		rectangle.index = i
	}

	return graph
}*/

// {"name":"Insertion Sort","data":[1.3579999969806522,62.671000001137145,220.24550000205636,486.66949999751523,862.9985000006855,1279.5199999934994,1853.1340000015916,3425.057500001276,4043.587500001013,5141.802500002086]}
// {"name":"Merge Sort","data":[1.221999985864386,61.64049994695233,122.40499985346105,187.08950051805004,253.8434998234152,321.64450048439903,394.37650014588144,463.93400029774057,528.9000000411761,606.9729996233946]}
// {"name":"Quick Sort","data":[0.8034999991650693,10.226999998849351,22.23999999987427,33.79599999898346,44.20150000078138,58.424499999091495,70.87349999928847,84.43200000183424,97.17500000551809,105.14649999968242]}
// {"name":"Radix Sort (LSD)","data":[1.8005000019911677,21.529999999620486,43.86299999896437,67.95149999961723,94.84649999794783,112.46650000102818,140.40149999927962,165.7389999978477,199.25550000189105,219.1835000005085]}

if(window.location.href.indexOf("?graph") != -1) {
	console.log(JSON.stringify(InsertionSort.bench(1000, 1000000, 1000000 / 10, 2)))
	console.log(JSON.stringify(MergeSort.bench(1000, 1000000, 1000000 / 10, 10)))
	console.log(JSON.stringify(QuickSort.bench(1000, 1000000, 1000000 / 10, 10)))
	console.log(JSON.stringify(LSDSort.bench(1000, 1000000, 1000000 / 10, 10)))
}
else {
	let elements: JSX.Element[] = []
	elements.push(<Graph sort={InsertionSort} key={0}></Graph>)
	elements.push(<Graph sort={QuickSort} key={1}></Graph>)
	elements.push(<Graph sort={MergeSort} key={2}></Graph>)
	elements.push(<Graph sort={LSDSort} key={3}></Graph>)

	ReactDOM.render(elements, document.getElementById("graphs"))

	ReactDOM.render(<BigOGraph data={[
		{"name":"Insertion Sort","data":[4,6062,24350,50350,98036,155828,222599,329306,461543,588308], color: "rgb(110, 212, 251)"},
		{"name":"Merge Sort","data":[1,61,122,187,253,321,394,463,528,606], color: "rgb(251, 212, 110)"},
		{"name":"Quick Sort","data":[0,10,22,33,44,58,70,84,97,105], color: "rgb(110, 251, 212)"},
		{"name":"Radix Sort (LSD)","data":[1,21,43,67,94,112,140,165,199,219], color: "rgb(212, 110, 251)"},
	]} />, document.getElementById("big-o-graph"))
}