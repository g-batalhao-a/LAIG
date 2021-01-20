class MySphere extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   * @param {integer} radius - radius
   *      
   */
  constructor(scene, radius, slices, stacks) {
    super(scene);
    this.radius = radius;
    this.latDivs = stacks * 2;
    this.longDivs = slices;

    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the sphere buffers
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    let phi = 0;
    let theta = 0;
    let phiInc = Math.PI / this.latDivs;
    let thetaInc = (2 * Math.PI) / this.longDivs;
    let latVertices = this.longDivs + 1;

    let textmaplongitude = 0;
    let textmaplatitude = 0;
    let textmaplongpart = 1 / this.longDivs;
    let textmaplatpart = 1 / this.latDivs;

    // build an all-around stack at a time, starting on "north pole" and proceeding "south"
    for (let latitude = 0; latitude <= this.latDivs; latitude++) {
      let sinPhi = this.radius * Math.sin(phi);
      let cosPhi = this.radius * Math.cos(phi);

      // in each stack, build all the slices around, starting on longitude 0
      theta = 0;
      textmaplongitude = 0;

      for (let longitude = 0; longitude <= this.longDivs; longitude++) {
        //--- Vertices coordinates
        let x = Math.cos(theta) * sinPhi;
        let y = Math.sin(theta) * sinPhi;
        let z = cosPhi;
        this.vertices.push(x, y, z);

        //TexCoords
        this.texCoords.push(textmaplongitude, textmaplatitude);

        //--- Indices
        if (latitude < this.latDivs && longitude < this.longDivs) {
          let current = latitude * latVertices + longitude;
          let next = current + latVertices;
          // pushing two triangles using indices from this round (current, current+1)
          // and the ones directly south (next, next+1)
          // (i.e. one full round of slices ahead)

          this.indices.push(current + 1, current, next);
          this.indices.push(current + 1, next, next + 1);
        }

        //--- Normals
        // at each vertex, the direction of the normal is equal to 
        // the vector from the center of the sphere to the vertex.
        // in a sphere of radius equal to one, the vector length is one.
        // therefore, the value of the normal is equal to the position vectro
        this.normals.push(x, y, z);
        theta += thetaInc;

        //--- Texture Coordinates
        textmaplongitude += textmaplongpart;
      }
      phi += phiInc;
      textmaplatitude += textmaplatpart;
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}