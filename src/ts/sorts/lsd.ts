import Graph from "../graph"
import Rectangle from "../rectangle"
import Sort, { SortDiagnostics } from "../sort"
import sleep from "../sleep"

export default class LSDSort extends Sort {
	public static sortName: string = "Radix Sort (LSD)"
	
	public static worstCase: string = "O(w * n)"
	public static bestCase: string = "O(w * n)"
	public static averageCase: string = "O(w * n)"

	private static speed = 2
	private static sleep = 1

	public static async sort(graph: Graph): Promise<void> {
		this.arraySets = 0
		this.compares = 0
		
		let base = 10

		let buckets: Rectangle[][] = []
		for(let i = 0; i < base; i++) {
			buckets[i] = []
		}

		let isSorted = false
		let exponent = 1
		while(!isSorted) {
			isSorted = true
			for(let rectangle of graph.rectangles) {
				let bucketIndex = Math.floor((Math.floor(rectangle.scale * 10000) / exponent) % base)
				if(bucketIndex > 0) {
					isSorted = false
				}
				buckets[bucketIndex].push(rectangle)
			}

			exponent *= base
			let index = 0
			for(let j = 0; j < buckets.length; j++) {
				for(let i = 0; i < buckets[j].length; i++) {
					await this.set(graph, index++, buckets[j][i])
					if(isSorted) {
						buckets[j][i].setColor(this.sortedColor[0], this.sortedColor[1], this.sortedColor[2])
					}
				}
				buckets[j] = []
			}
		}
	}

	private static async set(graph: Graph, index: number, rectangle: Rectangle): Promise<void> {
		this.arraySets++
		rectangle.index = index

		if(this.arraySets % this.speed == 0) {
			await sleep(this.sleep)
		}
	}

	public static pure(array: number[]): SortDiagnostics {
		let diagnostics = {
			array,
			compares: 0,
			arraySets: 0,
			time: performance.now(),
		}

		let base = 10

		let buckets: number[][] = []
		for(let i = 0; i < base; i++) {
			buckets[i] = []
		}

		let isSorted = false
		let exponent = 1
		while(!isSorted) {
			isSorted = true
			for(let value of array) {
				let bucketIndex = Math.floor((Math.floor(value * 10000) / exponent) % base)
				if(bucketIndex > 0) {
					isSorted = false
				}
				buckets[bucketIndex].push(value)
			}

			exponent *= base
			let index = 0
			for(let j = 0; j < buckets.length; j++) {
				for(let i = 0; i < buckets[j].length; i++) {
					array[index++] = buckets[j][i]
					diagnostics.arraySets++
				}
				buckets[j] = []
			}
		}

		diagnostics.time = performance.now() - diagnostics.time
		return diagnostics
	}
}