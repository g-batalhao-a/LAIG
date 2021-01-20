/**
 * MyPiece
 * @brief Class representing a Piece
 */
class MyPiece extends CGFobject {
	/**
	 * @constructor
	 * @param {Object} scene Reference to MyScene object
	 * @param {number} playerOwnerShip Value of Piece
	 */
	constructor(scene, playerOwnerShip) {
		super(scene);
		this.playerOwnerShip = playerOwnerShip;
		this.init()
	}
	/**
	 * @brief Initializes the required materials
	 */
	init() {
		this.onTile;
		this.selectedShape=this.scene.graph.filename
		this.parts = {
			room: new MyTriangle(this.scene,-0.5,0,0.5,0,0,1),
			park: new MyCylinder(this.scene,1,0.75,0,3,20),
			space: new MyCylinder(this.scene,0.1,0.8,0.8,3,20)
		}
		this.material = new CGFappearance(this.scene);
		this.highlightMaterial = new CGFappearance(this.scene);
		if(this.playerOwnerShip==1) {
            this.material.setShininess(20);
            this.material.setEmission(0.2, 0.2, 0.2, 1);
            this.material.setAmbient(0.1, 0.1, 0.1, 1);
            this.material.setDiffuse(0.6, 0.6, 0.6, 1);
            this.material.setSpecular(1, 1, 1, 1);
			this.material.setTextureWrap('REPEAT', 'REPEAT');
			
		}
		else if(this.playerOwnerShip==0) {
            this.material.setShininess(20);
            this.material.setEmission(0.0, 0.0, 0.0, 1);
            this.material.setAmbient(0.0, 0.0, 0.0, 1.0);
            this.material.setDiffuse(0.1, 0.1, 0.1, 1.0);
            this.material.setSpecular(1, 1, 1, 1.0);
            this.material.setTextureWrap('REPEAT', 'REPEAT');
		}
		else if(this.playerOwnerShip==2) {
            this.material.setShininess(20);
            this.material.setEmission(0.0, 0.2, 0.0, 1);
            this.material.setAmbient(0.1, 0.1, 0.1, 1.0);
            this.material.setDiffuse(0.1, 0.6, 0.1, 1.0);
            this.material.setSpecular(1, 1, 1, 1.0);
            this.material.setTextureWrap('REPEAT', 'REPEAT');
		}

		this.highlightMaterial.setShininess(5);
		this.highlightMaterial.setEmission(0.0, 0.0, 0.0, 1);
		this.highlightMaterial.setAmbient(0.3, 0.1, 0.1, 1);
		this.highlightMaterial.setDiffuse(0.6, 0.1, 0.1, 1);
		this.highlightMaterial.setSpecular(0.6, 0.1, 0.1, 1);
		this.highlightMaterial.setTextureWrap('REPEAT', 'REPEAT');

		this.selectedMaterial=this.material;
		this.picked=false;
	}
	/**
	 * @brief Displays the Piece
	 */
	display() {
		this.scene.pushMatrix();

		this.selectedMaterial.apply();

		if(this.selectedShape=="room") {
			this.scene.pushMatrix();
			this.scene.translate(0,0,0.5);
			this.scene.rotate(-30*Math.PI/180.0,1,0,0);
			this.parts[this.selectedShape].display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
			this.scene.translate(0.5,0,0);
			this.scene.rotate(30*Math.PI/180.0,0,0,1);
			this.scene.rotate(90*Math.PI/180.0,0,1,0);
			this.parts[this.selectedShape].display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
			this.scene.translate(0,0,-0.5);
			this.scene.rotate(30*Math.PI/180.0,1,0,0);
			this.scene.rotate(180*Math.PI/180.0,0,1,0);
			this.parts[this.selectedShape].display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
			this.scene.translate(-0.5,0,0);
			this.scene.rotate(-30*Math.PI/180.0,0,0,1);
			this.scene.rotate(-90*Math.PI/180.0,0,1,0);
			this.parts[this.selectedShape].display();
			this.scene.popMatrix();
		}
		else if(this.selectedShape=="park"){
			this.scene.pushMatrix();
			this.scene.rotate(-90*Math.PI/180.0,1,0,0);
			this.parts[this.selectedShape].display();
			this.scene.popMatrix();
		}
		else if(this.selectedShape=="space"){
			this.scene.pushMatrix();
			this.scene.rotate(-90*Math.PI/180.0,1,0,0);
			this.parts[this.selectedShape].display();
			this.scene.popMatrix();
		}
		
		this.scene.popMatrix();
	}
	/**
	 * @brief Changes the material of the Piece, when picked
	 */
	pick(){
		if(!this.picked){
			this.selectedMaterial=this.highlightMaterial;
			this.picked=true;
		}
		else{
			this.selectedMaterial=this.material;
			this.picked=false;
		}
	}
	/**
	 * @brief Assigns a Tile to this Piece
	 * @param {Object} tile Tile
	 */
	setTile(tile){
		this.onTile=tile;
	}
	/**
	 * @returns Assigned Tile
	 */
	getTile(){
		return this.onTile;
	}
	/**
 	* @returns True if picked, false otherwise 
 	*/
	isPicked(){
		return this.picked;
	}
	/**
	 * @returns The Value of the Piece
	 */
	getOwnerShip(){
		return this.playerOwnerShip;
	}
	/**
	 * @brief Changes the shape of the Piece
	 * @param {string} filename 
	 */
	changeShape(filename){
		this.selectedShape=filename
	}	
}