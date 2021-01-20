/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param iradius - inner radius
 * @param oradius - outer radius
 * @param slices - slices
 * @param loops - loops
 */

class MyTorus extends CGFobject {
    constructor(scene, iradius, oradius, slices, loops) {
        super(scene);
        this.oradius = oradius;
        this.iradius = iradius;
        this.slices = slices;
        this.loops = loops;
        this.initBuffers();

    };

    initBuffers() {

        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.initTexCoords = [];
        this.texCoords = [];
        let s = 1 / this.loops;
        let t = 1 / this.slices;

        for (let i = 0; i <= this.loops; i++) {
            let ang = i * 2 * Math.PI / this.loops;

            for (let j = 0; j <= this.slices; j++) {
                let phi = j * 2 * Math.PI / this.slices;

                let x = (this.oradius + this.iradius * Math.cos(phi)) * Math.cos(ang);
                let y = (this.oradius + this.iradius * Math.cos(phi)) * Math.sin(ang);
                let z = this.iradius * Math.sin(phi);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);

                let factorS = i * s;
                let factorT = j * t;

                this.texCoords.push(factorS, factorT);

            }
        }

        for (let i = 0; i < this.loops; i++) {
            for (let j = 0; j < this.slices; j++) {
                this.indices.push(((i * (this.slices + 1)) + j), ((i * (this.slices + 1)) + j + this.slices + 1), ((i * (this.slices + 1)) + j + 1));
                this.indices.push(((i * (this.slices + 1)) + j + this.slices + 1), ((i * (this.slices + 1)) + j + this.slices + 2), ((i * (this.slices + 1)) + j + 1));
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}