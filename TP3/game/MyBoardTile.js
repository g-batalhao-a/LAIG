/**
 * MyBoardTile
 * @brief Tile of the Board, uses MyPlane
 */
class MyBoardTile extends CGFobject {
	/**
	 * @constructor
 	 * @param scene - Reference to MyScene object
	 */
	constructor(scene) {
		super(scene);
		this.init()
	}
	/**
	 * @brief Initializes the required materials
	 */
	init(){
		this.tile= new MyRectangle(this.scene,-0.5,-0.5,0.5,0.5);
		this.material = new CGFappearance(this.scene);
		this.material.loadTexture('scenes/images/boardcell.png')
		this.material.setShininess(5);
		this.material.setEmission(0.0, 0.0, 0.0, 1);
		this.material.setAmbient(0.1, 0.1, 0.1, 1);
		this.material.setDiffuse(0.7, 0.7, 0.7, 1);
		this.material.setSpecular(1, 1, 1, 1);
		this.material.setTextureWrap('REPEAT', 'REPEAT');
		this.piece=[];
	}
	/**
	 * @brief Displays the Tile
	 */
	display(){
		this.scene.pushMatrix();
		this.material.apply();
		this.tile.display();
		this.scene.popMatrix();
	}
	/**
	 * @brief Sets a Piece in the Tile
	 * @param {Object} piece Piece
	 */
	setPiece(piece){
		this.piece=[piece];
	}
	/**
	 * @brief Sets an Array of Pieces in the Tile
	 * @param {Object} pieces Array of Pieces
	 */
	setPieces(pieces){
		this.piece=pieces;
	}
	/**
	 * @brief Adds an Array of Pieces to the Tile
	 * @param {Array} piece Array of Pieces
	 */
	addPieces(piece){
		let pieces=piece.reverse()
		pieces.forEach(element => {
			this.piece.unshift(element);
		});
	}
	/**
	 * @brief Clears the Tile
	 */
	unsetPiece() {
		this.piece=[];
	}
	/**
	 * @returns The Array of Pieces
	 */
	getPiece(){
		return this.piece;
	}
	/**
	 * @returns An array of the values of the Pieces within the Tile
	 */
	getValues(){
		let values=[];
		this.piece.forEach(piece => {
			values.push(piece.getOwnerShip());
		});
		return values;
	}

}