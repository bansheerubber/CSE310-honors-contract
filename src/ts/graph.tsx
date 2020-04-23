import vertexShader from "./glsl/vertex.vert"
import fragmentShader from "./glsl/fragment.frag"
import Rectangle from "./rectangle";
import Shader from "./shader";
import * as glm from "gl-matrix";
import * as React from "react";
import Sort, { SortDiagnostics } from "./sort";

interface GraphProperties {
	sort: typeof Sort
}

interface GraphState {
	width: number
	height: number
}

export default class Graph extends React.Component<GraphProperties, GraphState> {
	public rectangles: Rectangle[] = []
	public gl: WebGL2RenderingContext
	public shader: Shader
	public rectangleBuffer: WebGLBuffer

	private positionBuffer: WebGLBuffer
	private colorBuffer: WebGLBuffer
	private scaleBuffer: WebGLBuffer
	public static maxElements: number = 1000

	private canvas: React.RefObject<HTMLCanvasElement>
	public sort: typeof Sort

	private width_: number = 350
	private height_: number = 350

	private pureResults: SortDiagnostics
	private pureNumber: number = 20000



	constructor(props: GraphProperties) {
		super(props)

		this.canvas = React.createRef()
		this.sort = props.sort

		this.state = {
			width: 1,
			height: 1,
		}

		this.pureResults = this.sort.pure(Sort.getRandomArray(this.pureNumber))
	}

	public componentDidMount(): void {
		let gl = this.canvas.current.getContext("webgl2")
		
		this.gl = gl
		this.shader = new Shader(this.gl, vertexShader, fragmentShader)

		this.width = 500
		this.height = 300

		this.gl.clearColor(0.1, 0.1, 0.1, 1.0)
		this.gl.clear(gl.COLOR_BUFFER_BIT)

		this.rectangleBuffer = this.gl.createBuffer()
		let positions = [
			0.0, 1.0,
			1.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,
		] // test positions

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.rectangleBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW)

		// create position buffer for instancing
		this.positionBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, Graph.maxElements * 3 * 4, this.gl.STREAM_DRAW)

		// create color buffer for instancing
		this.colorBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, Graph.maxElements * 3 * 4, this.gl.STREAM_DRAW)

		// create scale buffer for instancing
		this.scaleBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.scaleBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, Graph.maxElements * 3 * 4, this.gl.STREAM_DRAW)

		for(let i = 0; i < Graph.maxElements; i++) {
			let rectangle = new Rectangle(this)
			rectangle.scale = Math.random()
			rectangle.index = i
		}

		this.draw()
		this.sort.sort(this)
	}

	public render(): JSX.Element {
		return <div className="graphContainer">
			<table>
				<tbody>
					<tr>
						<td>
							<canvas width={this.state.width} height={this.state.height} ref={this.canvas}></canvas>
						</td>
						<td style={{
							verticalAlign: "top",
						}}>
							<b>{this.sort.sortName}</b>
							<table>
								<tbody>
									<tr>
										<td style={{
											paddingRight: "20px",
										}}>Worst-case:</td>
										<td>{this.sort.worstCase}</td>
									</tr>
									<tr>
										<td style={{
											paddingRight: "20px",
										}}>Average-case:</td>
										<td>{this.sort.averageCase}</td>
									</tr>
									<tr>
										<td style={{
											paddingRight: "20px",
										}}>Best-case:</td>
										<td>{this.sort.bestCase}</td>
									</tr>
								</tbody>
							</table>
							<br />
							<b>Diagnostics (for n={this.pureNumber}):</b>
							<table>
								<tbody>
									<tr>
										<td style={{
											paddingRight: "20px",
										}}>Time:</td>
										<td>{Math.floor(this.pureResults.time)}ms</td>
									</tr>
									<tr>
										<td style={{
											paddingRight: "20px",
										}}>Array Sets:</td>
										<td>{this.pureResults.arraySets}</td>
									</tr>
									<tr>
										<td style={{
											paddingRight: "20px",
										}}>Comparisons</td>
										<td>{this.pureResults.compares}</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	}

	public set width(width: number) {
		this.width_ = width

		this.setState({
			width,
		})

		this.gl.viewport(0, 0, this.width_, this.height_)
		this.updateRectangles()
	}

	public get width(): number {
		return this.width_
	}

	public set height(height: number) {
		this.height_ = height
		
		this.setState({
			height,
		})

		this.gl.viewport(0, 0, this.width_, this.height_)
		this.updateRectangles()
	}

	public get height(): number {
		return this.height_
	}

	public add(rectangle: Rectangle): void {
		this.rectangles[rectangle.index] = rectangle

		this.updateRectangles()
	}

	public setIndex(rectangle: Rectangle, index: number): void {
		this.rectangles[index] = rectangle
	}

	private updateRectangles(): void {
		// update the position/scale of all the rectangles
		for(let rectangle of this.rectangles) {
			rectangle.index = rectangle.index
			rectangle.scale = rectangle.scale
		}
	}

	public get size(): number {
		return this.rectangles.length
	}

	public draw(): void {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)
		this.shader.use()

		let projection = glm.mat4.ortho(glm.mat4.create(), 0, this.width, 0, this.height, 0.01, 1000)
		this.gl.uniformMatrix4fv(this.shader.get("orthoMatrix"), false, projection)

		this.gl.disableVertexAttribArray(0)
		this.gl.disableVertexAttribArray(1)
		this.gl.disableVertexAttribArray(2)
		this.gl.disableVertexAttribArray(3)

		let positions = []
		let scales = []
		let colors = []
		for(let rectangle of this.rectangles) {
			rectangle.draw(positions, scales, colors)
		}

		let positionsArray = new Float32Array(positions)
		let scalesArray = new Float32Array(scales)
		let colorsArray = new Float32Array(colors)

		// set the position buffer
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, Graph.maxElements * 3 * 4, this.gl.STREAM_DRAW)
		this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, positionsArray)
		
		// set the scale buffer
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.scaleBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, Graph.maxElements * 3 * 4, this.gl.STREAM_DRAW)
		this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, scalesArray)

		// set the color buffer
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, Graph.maxElements * 3 * 4, this.gl.STREAM_DRAW)
		this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, colorsArray)

		// we need to bind our vertex arrays
		this.gl.enableVertexAttribArray(0)
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.rectangleBuffer)
		this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0) // set vertex attributes (we're only drawing lines, so size=2)

		// bind our positions array
		this.gl.enableVertexAttribArray(1)
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
		this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 0, 0) // set vertex attributes (we're setting vec3 positions, so size=3)

		// bind our scales array
		this.gl.enableVertexAttribArray(2)
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.scaleBuffer)
		this.gl.vertexAttribPointer(2, 3, this.gl.FLOAT, false, 0, 0) // set vertex attributes (we're setting vec3 scales, so size=3)

		// bind our colors array
		this.gl.enableVertexAttribArray(3)
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
		this.gl.vertexAttribPointer(3, 3, this.gl.FLOAT, false, 0, 0) // set vertex attributes (we're setting vec3 colors, so size=3)

		// the last thing
		this.gl.vertexAttribDivisor(0, 0) // reuse, reduce, recycle = 0
		this.gl.vertexAttribDivisor(1, 1) // 1 position per quad
		this.gl.vertexAttribDivisor(2, 1) // 1 scale per quad
		this.gl.vertexAttribDivisor(3, 1) // 1 color per quad

		// big
		this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 4, this.size)

		this.gl.disableVertexAttribArray(0)
		this.gl.disableVertexAttribArray(1)
		this.gl.disableVertexAttribArray(2)
		this.gl.disableVertexAttribArray(3)

		window.requestAnimationFrame(this.draw.bind(this)) // keep rendering every frame
	}
}