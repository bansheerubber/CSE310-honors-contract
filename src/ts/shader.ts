export default class Shader {
	private gl: WebGLRenderingContext
	private vertex: WebGLShader
	private fragment: WebGLShader
	private uniformMap: Map<string, WebGLUniformLocation> = new Map()

	public program: WebGLProgram


	
	constructor(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
		this.gl = gl
		this.vertex = this.createFragOrVert(this.gl.VERTEX_SHADER, vertexSource)
		this.fragment = this.createFragOrVert(this.gl.FRAGMENT_SHADER, fragmentSource)

		this.program = this.gl.createProgram()
		this.gl.attachShader(this.program, this.vertex)
		this.gl.attachShader(this.program, this.fragment)
		this.gl.linkProgram(this.program)

		if(!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
			console.error("Error linking shader:", this.gl.getProgramInfoLog(this.program))
		}
	}

	public use(): void {
		this.gl.useProgram(this.program)
	}

	public get(uniformName: string): WebGLUniformLocation {
		if(!this.uniformMap.has(uniformName)) {
			let location = this.gl.getUniformLocation(this.program, uniformName)
			this.uniformMap.set(uniformName, location)
			return location
		}
		return this.uniformMap.get(uniformName)
	}

	private createFragOrVert(type: number, source: string): WebGLShader {
		let shader = this.gl.createShader(type)
		this.gl.shaderSource(shader, source)
		this.gl.compileShader(shader)
		if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.error("Error compiling shader:", this.gl.getShaderInfoLog(shader))
			this.gl.deleteShader(shader)
			return undefined
		}
		return shader
	}
}