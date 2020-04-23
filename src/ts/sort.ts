import Graph from "./graph"
import { BigOGraphDatum } from "./bigOGraph"

export interface SortDiagnostics {
	array: number[]
	arraySets: number
	compares: number
	time: number
}

// describes a sorting function that we can have
export default abstract class Sort {
	public static sortName: string
	
	public static worstCase: string
	public static bestCase: string
	public static averageCase: string

	public static arraySets: number
	public static compares: number

	public static sortedColor: number[] = [58 / 255, 207 / 255, 75 / 255]
	public static unSortedColor: number[] = [207 / 255, 58 / 255, 58 / 255]

	public static async sort(graph: Graph): Promise<void> {

	}

	public static pure(array: number[]): SortDiagnostics {
		return {
			array: [],
			arraySets: 0,
			compares: 0,
			time: 0,
		}
	}

	public static bench(start: number, end: number, increase: number, runs: number): BigOGraphDatum {
		let times = []
		for(let i = start; i < end; i += increase) {
			let total = 0
			for(let j = 0; j < runs; j++) {
				console.log(`${this.name}: Run ${j}, Step ${i}`)
				let diagnostics = this.pure(this.getRandomArray(i))
				total += diagnostics.time
			}
			times.push(total / runs)
		}
		return {
			name: this.sortName,
			data: times,
			color: "",
		}
	}

	public static getRandomArray(number: number): number[] {
		let output = []
		for(let i = 0; i < number; i++) {
			output.push(Math.random())
		}
		return output
	}
}