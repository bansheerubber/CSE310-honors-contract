import Sort, { SortDiagnostics } from "../sort";
import Graph from "../graph";
import Rectangle from "../rectangle";
import sleep from "../sleep";

export default class InsertionSort extends Sort {
	public static sortName: string = "Insertion Sort"
	
	public static worstCase: string = "O(n^2)"
	public static bestCase: string = "O(n)"
	public static averageCase: string = "O(n^2)"

	private static speed = 40
	private static sleep = 1

	public static async sort(graph: Graph): Promise<void> {
		this.compares = 0
		this.arraySets = 0
		
		let length = graph.rectangles.length
		for(let i = 0; i < length; i++) {
			let rectangle1 = graph.rectangles[i]
			let j

			for(j = i - 1; j >= 0 && graph.rectangles[j].scale > rectangle1.scale; j--) {
				this.compares++
				await this.set(graph, j + 1, graph.rectangles[j])
			}
			this.compares++

			await this.set(graph, j + 1, rectangle1)
			rectangle1.setColor(this.sortedColor[0], this.sortedColor[1], this.sortedColor[2])
		}
	}

	private static async set(graph: Graph, index: number, rectangle: Rectangle): Promise<void> {
		this.arraySets++
		rectangle.index = index
		
		if(this.arraySets % this.speed == 0) {
			await sleep(this.sleep)
		}
	}

	// synchronous pure implementation of the sort, records various diagnostics and is independent of the rendering engine
	public static pure(array: number[]): SortDiagnostics {
		let diagnostics = {
			array,
			compares: 0,
			arraySets: 0,
			time: performance.now(),
		}

		let length = array.length
		for(let i = 0; i < length; i++) {
			let value = array[i]
			let j

			for(j = i -1; j >= 0 && array[j] > value; j--) {
				diagnostics.compares++
				diagnostics.arraySets++
				array[j + 1] = array[j]
			}
			diagnostics.compares++

			array[j + 1] = value
			diagnostics.arraySets++
		}

		diagnostics.time = performance.now() - diagnostics.time
		return diagnostics
	}
}