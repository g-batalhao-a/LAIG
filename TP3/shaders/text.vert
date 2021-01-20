attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float offsetM;
uniform float offsetN;
uniform float M;
uniform float N;

varying vec2 vTextureCoord;

void main() {

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

	vTextureCoord.x = (aTextureCoord.x*offsetM)+(M*offsetM);
	vTextureCoord.y = (aTextureCoord.y*offsetN)+(N*offsetN);
	
	

	//vTextureCoord = aTextureCoord;
}