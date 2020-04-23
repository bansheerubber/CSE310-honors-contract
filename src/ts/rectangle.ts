import Shader from "./shader"
import * as glm from "gl-matrix"
import Graph from "./graph"

export default class Rectangle {
	private graph: Graph
	private position: glm.vec3 = glm.vec3.create()
	private scale_: glm.vec3 = glm.vec3.create()
	private color: glm.vec3 = glm.vec3.create()
	private index_: number
	private scaleScalar_: number
	
	
	
	constructor(graph: Graph) {
		this.graph = graph

		this.graph.add(this)

		this.index = -1
		this.scale = 1

		this.setColor(this.graph.sort.unSortedColor[0], this.graph.sort.unSortedColor[1], this.graph.sort.unSortedColor[2])
	}

	public setColor(r: number, g: number, b: number): void {
		this.color[0] = r
		this.color[1] = g
		this.color[2] = b
	}

	// index is a number from [0, this.graph.rectangles.size - 1]
	public set index(index: number) {
		this.position[0] = (this.graph.width / this.graph.size) * index
		this.position[1] = 0
		this.position[2] = -1

		this.index_ = index

		this.graph.setIndex(this, index)
	}

	public get index(): number {
		return this.index_
	}

	// scale is number from 0-1
	public set scale(scale: number) {
		this.scale_[0] = this.graph.width / this.graph.size
		this.scale_[1] = this.graph.height * scale
		this.scale_[2] = 1

		this.scaleScalar_ = scale
	}

	public get scale(): number {
		return this.scaleScalar_
	}

	public draw(positions: number[], scales: number[], colors: number[]) {
		positions.push(this.position[0], this.position[1], this.position[2])
		scales.push(this.scale_[0], this.scale_[1], this.scale_[2])
		colors.push(this.color[0], this.color[1], this.color[2])
	}
}