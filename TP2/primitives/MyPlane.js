/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param ndivsU - number of divisions in U
 * @param ndivsV - number of divisions in V
 */
class MyPlane extends CGFobject {
	constructor(scene, ndivsU, ndivsV) {
		super(scene);
		this.ndivsU = ndivsU;
		this.ndivsV = ndivsV;
		this.initBuffers();
	}

	initBuffers() {
		let controlPoints = [
            [
				[0.5,0.0,-0.5,1],
				[0.5,0.0, 0.5,1]
			],
			[
				[-0.5,0.0,-0.5,1],
				[-0.5,0.0, 0.5,1]
			]
        ]

        let nurbSurface = new CGFnurbsSurface(1,1,controlPoints);
        this.obj = new CGFnurbsObject(this.scene,this.ndivsU,this.ndivsV,nurbSurface);
    }
    display() {
        this.obj.display();
    }
	
}