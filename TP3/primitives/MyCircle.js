/**
 * MyCircle
 * @constructor
 */
class MyCircle extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {integer} slices - number of slices around Y axis
     * @param {integer} radius - radius
     */
    constructor(scene, radius, slices) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.initBuffers();
    }

    /**
     * @method initBuffers
     * Initializes the sphere buffers
     */
    initBuffers() {
        this.vertices = [0, 0, 0];
        this.indices = [];
        this.normals = [0, 0, 1];
        this.texCoords = [];

        let ang = 0;
        let alphaAng = 2 * Math.PI / this.slices;
        let i = 0;
        for (let j = 0; j <= this.slices; j++) {

            var cos_ang0 = this.radius * Math.cos(ang); //x
            var sin_ang0 = this.radius * Math.sin(ang); //y
            this.texCoords.push(0.5 + 0.5 * Math.cos(j * alphaAng), 0.5 + 0.5 * Math.sin(j * alphaAng));
            ang += alphaAng;
            var cos_ang1 = this.radius * Math.cos(ang); //x
            var sin_ang1 = this.radius * Math.sin(ang); //y
            this.texCoords.push(0.5 + 0.5 * Math.cos(j * alphaAng), 0.5 + 0.5 * Math.sin(j * alphaAng));


            this.vertices.push(cos_ang0, sin_ang0, 0);
            this.vertices.push(cos_ang1, sin_ang1, 0);

            this.indices.push(0, i + 1, i + 2);
            i += 2;

            this.normals.push(0, 0, 1);
            this.normals.push(0, 0, 1);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();

    }
}