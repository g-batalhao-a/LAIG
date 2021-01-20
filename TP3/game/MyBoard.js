/**
 * MyBoard
 * @brief Class that represents a boar
 */
class MyBoard extends CGFobject {
    /**
     * @constructor
     * @param {Object} scene Reference to MyScene object
     * @param {number} x Position X of the board
     * @param {number} y Position Y of the board
     * @param {number} z Position Z of the board
     */
	constructor(scene, x,y,z) {
        super(scene);
        this.x=x;
        this.y=y;
        this.z=z;
        this.init()
    }
    /**
     * @brief Initializes the required elements
     */
    init(){
        this.parts = new MyRectangle(this.scene,-0.5,-0.5,0.5,0.5)
        this.boardTex = new CGFappearance(this.scene);
        this.boardTex.setShininess(1);
        this.boardTex.setEmission(0, 0, 0, 1);
        this.boardTex.setAmbient(0.5, 0.5, 0.5, 1);
        this.boardTex.setDiffuse(0.5, 0.5, 0.5, 1);
        this.boardTex.setSpecular(0.5, 0.5, 0.5, 1);
        this.boardTex.setTextureWrap('REPEAT', 'REPEAT');
        this.boardTex.setTexture(new CGFtexture(this.scene,"./scenes/images/wooddesk.jpg"))
        this.initBoard(6,6)
    }
    /**
     * @brief Initializes the tiles
     * @param {number} columns Number of Columns
     * @param {number} rows Number of Rows
     */
    initBoard(columns,rows){
        this.rows=rows;
        this.columns=columns;
        this.boardTile=[],this.row=[],this.pieces=[];
        // Adds the tiles to the board
        for(let i=0;i<this.rows;i++){
            for(let j=0;j<this.columns;j++){
                this.row.push(new MyBoardTile(this.scene));
            }
            this.boardTile.push(this.row);
            this.row=[];
        }
    }
    /**
     * @brief Empties the board
     */
    reset(){
        for(let i=0;i<this.rows;i++){
            for(let j=0;j<this.columns;j++){
                this.boardTile[i][j].unsetPiece()
            }
        }
    }
    /**
     * @brief Update Pieces Pos
     */
    update(delta) {
        if(this.piecesPos<=0){
            if(!this.dropped) {
                this.notifyOrchestrator()
                this.dropped=true
                this.piecesPos=0
            }
            return;
        }
        let animProgress = (this.elapsedTime)/(this.animationTime)
        let easeOutQint =  easeOutQuart(animProgress)
        this.piecesPos = 25 - 25.001*easeOutQint
        this.elapsedTime+=delta

    }
    /**
     * @brief Displays the board
     */
	display() {
        
        this.scene.translate(this.x,this.y,this.z);
        this.scene.translate(-(this.columns-1),0,-(this.rows-1));
        
        this.scene.pushMatrix()

        this.scene.pushMatrix();
        this.boardTex.apply()
        this.scene.translate(this.columns-1,-0.4,this.rows-1)
        this.scene.scale((this.columns+1)*2,0.5,(this.rows+1)*2)

        this.scene.pushMatrix();
        this.scene.translate(0,0,0.5);
		this.parts.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0.5,0,0);
        this.scene.rotate(90*Math.PI/180.0,0,1,0);
		this.parts.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0,-0.5);
        this.scene.rotate(180*Math.PI/180.0,0,1,0)
		this.parts.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-0.5,0,0);
        this.scene.rotate(-90*Math.PI/180.0,0,1,0);
		this.parts.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
		this.scene.translate(0,0.5,0);
        this.scene.rotate(-90*Math.PI/180.0,1,0,0);
		this.parts.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
		this.scene.translate(0,-0.5,0);
        this.scene.rotate(90*Math.PI/180.0,1,0,0);
		this.parts.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

		this.scene.pushMatrix();
        for(let i=0; i<this.rows;i++) {
            for(let j=0; j<this.columns;j++) {
                this.scene.registerForPick((i*this.columns+j)+1, this.boardTile[i][j]);
                this.scene.pushMatrix();
                this.scene.translate((j*2),0,(i*2));
                this.scene.scale(2,1,2);
                this.scene.rotate(-90*Math.PI/180,1,0,0)
                this.boardTile[i][j].display();
                this.scene.popMatrix();

                this.scene.registerForPick(((i*this.columns+j)+1)+(this.columns*this.rows), this.pieces[i*this.columns+j]);
                this.scene.pushMatrix();
                this.scene.translate((j*2),this.piecesPos,(i*2));
                let pieceDisplay = this.boardTile[i][j].getPiece()
                for(let x=pieceDisplay.length-1;x>=0;x--){
                    if(pieceDisplay[x].getOwnerShip()!=-1){
                        pieceDisplay[x].display();
                        this.scene.translate(0,0.1,0);
                    }
                }
                this.scene.popMatrix();
            }     
        }
        
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
    /**
     * @brief Adds pieces to the tile of the picked Piece
     * @param {number} pickIndex Pick Index of a Piece
     * @param {Array} pieces Pieces to be added
     */
    addPieceToTile(pickIndex,pieces){
        let tile = this.pieces[pickIndex-(this.columns*this.rows+1)].getTile();
        tile.addPieces(pieces);
    }
    /**
     * @brief Removes the Pieces of the tile of the picked Piece
     * @param {number} pickIndex  Pick index of piece
     * @returns Pieces that were removed
     */
    removePiecefromTile(pickIndex){
        let tile = this.pieces[pickIndex-(this.columns*this.rows+1)].getTile();
        let pieces = tile.getPiece();
        tile.unsetPiece();
        return pieces;
    }
    /**
     * @brief Gets Pieces from a Tile
     * @param {number} tileID Pick index of the tile
     * @returns Pieces
     */
    getPiecesFromTile(tileID){
        return this.boardTile[Math.floor((tileID-1)/this.columns)][(tileID-1)%this.columns].getPiece();
    }
    /**
     * @brief Gets the corresponding Tile from a Piece
     * @param {number} pieceID Pick index of a Piece
     * @returns Tile 
     */
    getTileFromPiece(pieceID){
        return this.boardTile[Math.floor((pieceID-(this.columns*this.rows+1))/this.columns)][(pieceID-(this.columns*this.rows+1))%this.columns];
    }
    /**
     * @brief Calculates the offset of a tile
     * @param {number} tileID Pick index of a tile
     */
    getOffset(tileID){
        let column = this.getColumnOffset(tileID);
        let row = this.getRowOffset(tileID);
        let height = this.boardTile[row][column].getPiece().length;
        return {x: column*2, y:height*0.1, z:row*2};
    }
    /**
     * @returns Number of columns of the board
     */
    getColumns(){
        return this.columns;
    }
    /**
     * @returns Number of rows of the board
     */
    getRows(){
        return this.rows;
    }
    /**
     * @brief Sets the board with the values of the argument
     * @param {Array} boardList Array of values of Pieces 
     */
    setBoard(boardList){
        for(let i=0;i<this.rows;i++){
            for(let j=0;j<this.columns;j++){
                let boardpieces=[];
                
                for(let x=0;x<boardList[i][j].length;x++){
                    boardpieces.push(new MyPiece(this.scene,boardList[i][j][x]))
                }
                this.boardTile[i][j].setPieces(boardpieces);
                this.pieces[i*this.columns+j]=boardpieces[0];
                this.pieces[i*this.columns+j].setTile(this.boardTile[i][j]);
            }
        }
    }
    /**
     * @brief Calculates the Row Offset of a tile
     * @param {number} tileID Pick index of a tile 
     */
    getRowOffset(tileID){
        return Math.floor((tileID-(this.columns*this.rows+1))/this.columns)
    }
    /**
     * @brief Calculates the Column Offset of a tile
     * @param {number} tileID Pick index of a Column
     */
    getColumnOffset(tileID){
        return ((tileID-(this.columns*this.rows+1))%this.columns)
    }
    /**
     * @brief Gets the id of a Piece from its Column and Row
     * @param {number} row 
     * @param {number} col 
     */
    getIDFromRowAndCol(row,col){
        return col+(row*this.columns)+(this.columns*this.rows+1)
    }
    /**
     * @returns An array of the values of the board
     */
    getPieces(){
        let pieceBoard=[];
        for(let i=0;i<this.rows;i++){
            let row=[];
            for(let j=0;j<this.columns;j++){
                row.push(this.boardTile[i][j].getValues());
                
            }
            pieceBoard.push(row);
        }
        return pieceBoard;
    }
    /**
     * @brief Notifies the Pieces to change their shapes
     * @param {string} filename 
     */
    notifyChange(filename){
        this.boardTile.forEach(rowtile =>{
            rowtile.forEach(tile => {
                tile.getPiece().forEach(piece =>{
                    piece.changeShape(filename)
                })
            })
            
        })
    }
    /**
     * @brief Starts piece animation
     */
    setPiecesPos(){
        this.animationTime=4
        this.elapsedTime=0
        this.piecesPos=25
        this.dropped=false
    }
    /**
     * @brief Sets the board Orchestrator
     * @param {Object} orchestrator 
     */
    setOrchestrator(orchestrator){
        this.orchestrator=orchestrator
    }
    /**
     * @brief Notifies orchestrator
     */
    notifyOrchestrator(){
        this.orchestrator.sendResponseToGameState("pieces")
    }
}