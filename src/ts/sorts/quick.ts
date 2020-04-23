import Sort, { SortDiagnostics } from "../sort"
import Graph from "../graph"
import sleep from "../sleep"

export default class QuickSort extends Sort {
	public static sortName: string = "Quick Sort"
	
	public static worstCase: string = "O(n^2)"
	public static bestCase: string = "O(n*log(n))"
	public static averageCase: string = "O(n*log(n))"

	private static speed = 4
	private static sleep = 1

	public static async sort(graph: Graph): Promise<void> {
		this.compares = 0
		this.arraySets = 0

		this.quicksort(graph, 0, graph.size - 1)
	}

	private static async quicksort(graph: Graph, low: number, high: number): Promise<void> {
		if(low < high) {
			let p = await this.partition(graph, low, high)
			await this.quicksort(graph, low, p - 1)
			await this.quicksort(graph, p + 1, high)

			for(let i = low; i <= high; i++) {
				graph.rectangles[i]?.setColor(this.sortedColor[0], this.sortedColor[1], this.sortedColor[2])
			}
		}
		else {
			for(let i = high; i <= low; i++) {
				graph.rectangles[i]?.setColor(this.sortedColor[0], this.sortedColor[1], this.sortedColor[2])
			}
		}
	}

	private static async partition(graph: Graph, low: number, high: number): Promise<number> {
		let pivot = graph.rectangles[high].scale
		let i = (low - 1)

		for(let j = low; j <= high - 1; j++) {
			this.compares++
			if(graph.rectangles[j].scale < pivot) {
				i++
				await this.swap(graph, i, j)
			}
		}
		await this.swap(graph, i + 1, high)
		return i + 1
	}

	private static async swap(graph: Graph, i: number, j: number): Promise<void> {
		let rectangle1 = graph.rectangles[i]
		let rectangle2 = graph.rectangles[j]

		rectangle1.index = j
		rectangle2.index = i
		this.arraySets += 2

		if(this.arraySets % this.speed == 0) {
			await sleep(this.sleep)
		}
	}

	public static pure(array: number[]): SortDiagnostics {
		let diagnostics = this.pureQuicksort(array, 0, array.length - 1)
		diagnostics.time = performance.now() - diagnostics.time
		return diagnostics
	}

	private static pureQuicksort(array: number[], low: number, high: number, diagnostics: SortDiagnostics = { array, arraySets: 0, compares: 0, time: performance.now(), }): SortDiagnostics {
		if(low < high) {
			let p = this.purePartition(array, low, high, diagnostics)
			this.pureQuicksort(array, low, p - 1, diagnostics)
			this.pureQuicksort(array, p + 1, high, diagnostics)
		}
		return diagnostics
	}

	private static purePartition(array: number[], low: number, high: number, diagnostics: SortDiagnostics): number {
		let pivot = array[high]
		let i = (low - 1)

		for(let j = low; j <= high - 1; j++) {
			diagnostics.compares++
			if(array[j] < pivot) {
				i++

				//swap
				let iE = array[i]
				let jE = array[j]
				array[j] = iE
				array[i] = jE

				diagnostics.arraySets += 2
			}
		}

		// swap
		let iE = array[i + 1]
		let jE = array[high]
		array[high] = iE
		array[i + 1] = jE

		diagnostics.arraySets += 2
		return i + 1
	}
}