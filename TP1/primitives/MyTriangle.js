/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 * @param x3 - x coordinate corner 3
 * @param y3 - y coordinate corner 3
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, x3, y3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;
		this.doneTex = false;
		this.initBuffers();
	}
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0, //0
			this.x2, this.y2, 0, //1
			this.x3, this.y3, 0, //2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
		];

		this.texCoords = [];
		this.a = Math.sqrt(Math.pow((this.x1 - this.x2), 2) + Math.pow((this.y1 - this.y2), 2));
		this.b = Math.sqrt(Math.pow((this.x2 - this.x3), 2) + Math.pow((this.y2 - this.y3), 2));
		this.c = Math.sqrt(Math.pow((this.x3 - this.x1), 2) + Math.pow((this.y3 - this.y1), 2));

		this.cos = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2 * this.a * this.c);
		this.sin = Math.sqrt(1 - Math.pow(this.cos, 2));

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
	isDone() {
		return this.doneTex;
	}
	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {

		let factorS = coords[0];
		let factorT = coords[1];
		this.texCoords = [
			0, 1,
			this.a / factorS, 1,
			(this.c * this.cos) / factorS, 1 - (this.c * this.sin) / factorT

		];

		this.doneTex = true;
		this.updateTexCoordsGLBuffers();
	}
}