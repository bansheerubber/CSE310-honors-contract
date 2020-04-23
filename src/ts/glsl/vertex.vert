precision mediump float;

attribute vec4 vertexPosition;
attribute vec3 modelPosition;
attribute vec3 modelScale;
attribute vec3 modelColor;

varying vec3 outColor;

uniform mat4 orthoMatrix;

void main() {
	mat4 modelMatrix; // modelMatrix[c][r]

	modelMatrix[0][0] = modelScale.x;
	modelMatrix[1][1] = modelScale.y;
	modelMatrix[2][2] = modelScale.z;
	modelMatrix[3][3] = 1.0;

	modelMatrix[3] = vec4(modelPosition, 1.0);
	
	outColor = modelColor;
	gl_Position = orthoMatrix * modelMatrix * vertexPosition;
}