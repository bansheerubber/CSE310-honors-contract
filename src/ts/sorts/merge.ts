import Graph from "../graph"
import Sort, { SortDiagnostics } from "../sort"
import sleep from "../sleep"
import Rectangle from "../rectangle"

export default class MergeSort extends Sort {
	public static sortName: string = "Merge Sort"
	
	public static worstCase: string = "O(n*log(n))"
	public static bestCase: string = "O(n*log(n))"
	public static averageCase: string = "O(n*log(n))"

	private static speed = 80
	private static sleep = 1

	public static async sort(graph: Graph): Promise<void> {
		this.compares = 0
		this.arraySets = 0

		this.mergesort(graph, 0, graph.size - 1)
	}

	private static async mergesort(graph: Graph, left: number, right: number): Promise<void> {
		if(left < right) {
			let middle = Math.floor(left + (right - left) / 2)
			await this.mergesort(graph, left, middle)
			await this.mergesort(graph, middle + 1, right)
			await this.merge(graph, left, middle, right)

			for(let i = left; i <= right; i++) {
				graph.rectangles[i].setColor(this.sortedColor[0], this.sortedColor[1], this.sortedColor[2])
			}
		}
	}

	private static async merge(graph: Graph, left: number, middle: number, right: number): Promise<void> {
		let left2 = middle + 1
		this.compares++
		if(graph.rectangles[middle].scale > graph.rectangles[left2].scale) {
			while(left <= middle && left2 <= right) {
				this.compares++
				if(graph.rectangles[left].scale <= graph.rectangles[left2].scale) {
					left++
				}
				else {
					let value = graph.rectangles[left2]
					let index = left2

					while(index != left) {
						await this.set(graph, index, graph.rectangles[index - 1])
						index--
					}
					await this.set(graph, left, value)

					left++
					middle++
					left2++
				}
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
		return this.pureMergeSort(array)[1]
	}

	private static pureMergeSort(array: number[], diagnostics: SortDiagnostics = { array, arraySets: 0, compares: 0, time: performance.now(), }): [number[], SortDiagnostics] {
		if(array.length <= 1) {
			return [array, diagnostics]
		}

		let middle = Math.floor(array.length / 2)
		let left = array.slice(0, middle)
		let right = array.slice(middle)

		let output = this.pureMerge(this.pureMergeSort(left, diagnostics)[0], this.pureMergeSort(right, diagnostics)[0], diagnostics)
		diagnostics.array = output[0]
		diagnostics.time = performance.now() - diagnostics.time
		return [output[0], diagnostics]
	}

	private static pureMerge(left: number[], right: number[], diagnostics: SortDiagnostics): [number[], SortDiagnostics] {
		let resultArray = []
		let leftIndex = 0
		let rightIndex = 0

		while(leftIndex < left.length && rightIndex < right.length) {
			diagnostics.compares++
			if(left[leftIndex] < right[rightIndex]) {
				resultArray.push(left[leftIndex])
				leftIndex++
			}
			else {
				resultArray.push(right[rightIndex])
				rightIndex++
			}
			diagnostics.arraySets++
		}

		let leftConcat = left.slice(leftIndex)
		let righConcat = right.slice(rightIndex)
		diagnostics.arraySets += leftConcat.length + righConcat.length
		return [resultArray.concat(leftConcat, righConcat), diagnostics]
	}
}