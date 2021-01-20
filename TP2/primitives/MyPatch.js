/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param npointsU - degree in U
 * @param npointsV - degree in V
 * @param npartsU - divisions in U
 * @param npartsV - divisions in V
 * @param controlvertexes - control vertexes of surface
 */
class MyPatch extends CGFobject {
	constructor(scene, npointsU, npointsV, npartsU, npartsV, controlvertexes) {
        super(scene);
        this.npointsU = npointsU;
        this.npointsV = npointsV;
		this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlvertexes=controlvertexes;
        this.initBuffers();
	}

	initBuffers() {
        let nurbSurface = new CGFnurbsSurface(this.npointsU-1,this.npointsV-1,this.controlvertexes);
        this.obj = new CGFnurbsObject(this.scene,this.npartsU,this.npartsV,nurbSurface);
    }
    display() {
        this.obj.display();
    }
	
}