/**
 * MyPiece
 * @brief Class that represents a button
 */
class MyButton extends CGFobject {
	/**
	 * @constructor
	 * @param scene Reference to MyScene object
	 * @param text Button text
	 */
	constructor(scene,text) {
        super(scene);
		this.text=new MySpriteText(this.scene,text)
		this.init()
	}
	/**
	 * @brief Initializes the required materials
	 */
	init() {
		this.parts = new MyRectangle(this.scene,-0.5,-0.5,0.5,0.5);
        this.material = new CGFappearance(this.scene);
		this.highlightMaterial = new CGFappearance(this.scene);
		this.unavailableMaterial = new CGFappearance(this.scene);
		this.redMaterial = new CGFappearance(this.scene);
		this.orangeMaterial = new CGFappearance(this.scene);

        this.material.setShininess(20);
		this.material.setEmission(0.0, 0.0, 0.0, 1);
		this.material.setAmbient(0.135, 0.2225, 0.1575, 0.95);
		this.material.setDiffuse(0.54, 0.89, 0.63, 0.95);
		this.material.setSpecular(0.316228, 0.316228, 0.316228, 0.95);
		this.material.setTextureWrap('REPEAT', 'REPEAT');
		
        this.orangeMaterial.setShininess(12.8);
		this.orangeMaterial.setEmission(0.0, 0.0, 0.0, 1);
		this.orangeMaterial.setAmbient(0.19125, 0.0735, 0.0225, 1.0);
		this.orangeMaterial.setDiffuse(0.7038, 0.27048, 0.0828, 1.0);
		this.orangeMaterial.setSpecular(0.256777, 0.137622, 0.086014, 1.0);
		this.orangeMaterial.setTextureWrap('REPEAT', 'REPEAT');
		
        this.highlightMaterial.setShininess(0.25);
		this.highlightMaterial.setEmission(0.0, 0.0, 0.0, 1);
		this.highlightMaterial.setAmbient(0.0, 0.0, 0.0, 1);
		this.highlightMaterial.setDiffuse(0.5, 0.5, 0.0, 1);
		this.highlightMaterial.setSpecular(0.6, 0.6, 0.5, 1);
		this.highlightMaterial.setTextureWrap('REPEAT', 'REPEAT');

		this.redMaterial.setShininess(0.078125);
		this.redMaterial.setEmission(0.0, 0.0, 0.0, 1);
		this.redMaterial.setAmbient(0.05, 0.0, 0.0, 1);
		this.redMaterial.setDiffuse(0.5, 0.4, 0.4, 1);
		this.redMaterial.setSpecular(0.7, 0.04, 0.04, 1);
		this.redMaterial.setTextureWrap('REPEAT', 'REPEAT');

		this.unavailableMaterial.setShininess(0.078125);
		this.unavailableMaterial.setEmission(0.0, 0.0, 0.0, 1);
		this.unavailableMaterial.setAmbient(0.1, 0.1, 0.1, 1);
		this.unavailableMaterial.setDiffuse(0.5, 0.5, 0.5, 1);
		this.unavailableMaterial.setSpecular(0.5, 0.5, 0.5, 1);
		this.unavailableMaterial.setTextureWrap('REPEAT', 'REPEAT');
		this.picked=false;
		this.unavailable=false;
        this.selectedMaterial=this.material;
	}
	/**
	 * @brief Displays the button
	 */
	display() {
        this.scene.pushMatrix();
        

        this.selectedMaterial.apply()
        
		this.scene.pushMatrix();
        this.scene.translate(0,0,0.5);
        this.scene.scale(this.text.getTextLength()+1,1.2,1)
		this.parts.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(this.text.getTextLength()/2 +0.5,0,0);
        this.scene.rotate(90*Math.PI/180.0,0,1,0);
        this.scene.scale(1,1.2,1)
		this.parts.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0,-0.5);
        this.scene.rotate(180*Math.PI/180.0,0,1,0);
        this.scene.scale(this.text.getTextLength()+1,1.2,1)
		this.parts.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-this.text.getTextLength()/2 -0.5,0,0);
        this.scene.rotate(-90*Math.PI/180.0,0,1,0);
        this.scene.scale(1,1.2,1)
		this.parts.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
		this.scene.translate(0,0.6,0);
        this.scene.rotate(-90*Math.PI/180.0,1,0,0);
        this.scene.scale(this.text.getTextLength()+1,1,1)
		this.parts.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
		this.scene.translate(0,-0.6,0);
        this.scene.rotate(90*Math.PI/180.0,1,0,0);
        this.scene.scale(this.text.getTextLength()+1,1,1)
		this.parts.display();
        this.scene.popMatrix();

        this.scene.pushMatrix()
        this.scene.translate(1,0,0.55);
        this.text.display()
        this.scene.popMatrix()

		this.scene.popMatrix();
	}
	/**
	 * @brief Changes the material of the Button, when picked and if available
	 */
	pick(){
		if(this.unavailable){
			return
		}
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
 	* @returns True if picked, false otherwise 
 	*/
	isPicked(){
		return this.picked;
	}
	/**
	 * @brief Toggles the availability of a button
	 */
	toggleAvailability(){
		this.unavailable=!this.unavailable
		if(this.unavailable) this.selectedMaterial=this.unavailableMaterial
		else this.selectedMaterial=this.material
	}
	/**
	 * @brief Modifies the Text of the button
	 * @param {string} text New Text
	 */
	modifyText(text){
		this.text.modifyText(text)
	}
	/**
	 * @returns The text of the button
	 */
	getText(){
		return this.text.getText()
	}
	/**
	 * @brief Changes the material of the button
	 * @param {string} colour Colour name
	 */
	changeMaterial(colour){
		if(colour=="orange"){
			this.selectedMaterial=this.orangeMaterial
		}
		else if(colour=="red"){
			this.selectedMaterial=this.redMaterial
		}
		else if(colour=="green"){
			this.selectedMaterial=this.material
		}
	}

}