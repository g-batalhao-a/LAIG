/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Z axis
   * @param  {integer} stacks - number of stacks along Z axis, from bottom to top
   * @param {integer} bradius - bottom radius
   * @param {integer} tradius - top radius
   * @param {integer} height - height
   */
  constructor(scene, height, bradius, tradius, stacks, slices) {
    super(scene);
    this.bradius = bradius;
    this.tradius = tradius;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;
    this.topCircle = new MyCircle(scene, tradius, slices);
    this.botCircle = new MyCircle(scene, bradius, slices);
    this.initBuffers();

  }

  /**
   * @method initBuffers
   * Initializes the cylinder buffers
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    let ang = 0;
    let alphaAng = 2 * Math.PI / this.slices;


    for (let i = 0; i <= this.stacks; i++) {
      ang = 0;
      let rad = (this.tradius - this.bradius) * (i / this.stacks) + this.bradius;
      let z = this.height * i / this.stacks;
      for (let j = 0; j <= this.slices; j++) {

        var cos_ang = rad * Math.cos(ang); //x
        var sin_ang = rad * Math.sin(ang); //y

        this.vertices.push(cos_ang, sin_ang, z);
        this.normals.push(cos_ang, sin_ang, 0);

        this.indices.push((j + (i + 1) * (this.slices + 1) + 1), (j + (i + 1) * (this.slices + 1)), (j + i * (this.slices + 1)));
        this.indices.push((j + i * (this.slices + 1)), (j + i * (this.slices + 1) + 1), (j + (i + 1) * (this.slices + 1) + 1));

        ang += alphaAng;
      }
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    for (var i = 0; i <= this.stacks; i++) {
      var v = 1 - (i / this.stacks);
      for (var j = 0; j <= this.slices; j++) {
        var u = 1 - (j / this.slices);
        this.texCoords.push(u, v);
      }
    }

    this.initGLBuffers();

  }

  display() {
    //Only way to display cylinder
    CGFobject.prototype.display.call(this);

    this.scene.pushMatrix();
    this.scene.translate(0, 0, this.height);
    this.topCircle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.botCircle.display();
    this.scene.popMatrix();
  }
}