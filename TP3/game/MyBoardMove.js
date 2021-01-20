/**
 * MyBoardMove
 * @brief
 */
class MyBoardMove {
    /**
     * @constructor
     * @param {number} selectPiece Selected Piece
     * @param {number} destinationPiece Tile to move to
     * @param {Object} boardRepresentation Board representation
     * @param {Object} animator Animator
     */
	constructor(selectPiece,destinationPiece,boardRepresentation,animator) {
        this.selectPiece=selectPiece;
        this.destinationPiece=destinationPiece;
        this.originalBoard=JSON.parse(JSON.stringify(boardRepresentation.getPieces()))
        this.boardRepresentation=boardRepresentation;
        this.animator=animator;
        this.init()
        
    }
    /**
     * @brief Initializes the required animation
     */
    init(){
        let selectOffset = this.boardRepresentation.getOffset(this.selectPiece);
        let destinationOffset = this.boardRepresentation.getOffset(this.destinationPiece);
        this.anim = new KeyframeAnimation(
            [
            {
                instant:0,
                transformations:[
                    {x:selectOffset.x, y:0,z:selectOffset.z},
                    {angle:0, axis: "x"},
                    {angle:0, axis: "y"},
                    {angle:0, axis: "z"},
                    {sx:1, sy:1, sz:1}
                ]
                
            }  
            ,  
            {
                instant:0.5,
                transformations:[
                    {x:selectOffset.x,y:destinationOffset.y+1,z:selectOffset.z},
                    {angle:0, axis: "x"},
                    {angle:0, axis: "y"},
                    {angle:0, axis: "z"},
                    {sx:1, sy:1, sz:1}
                ]
                
            }  
            ,
            {
                instant:1,
                transformations:[
                    {x:destinationOffset.x,y:destinationOffset.y+1,z:destinationOffset.z},
                    {angle:0, axis: "x"},
                    {angle:0, axis: "y"},
                    {angle:0, axis: "z"},
                    {sx:1, sy:1, sz:1}
                ]
                
            },
            {
                instant:1.5,
                transformations:[
                    destinationOffset,
                    {angle:0, axis: "x"},
                    {angle:0, axis: "y"},
                    {angle:0, axis: "z"},
                    {sx:1, sy:1, sz:1}
                ]
                
            }
            ]
        );
        this.initialized = false
        this.pieces=[]
        this.animFinished=false;
    }
    /**
     * @brief Updates the Move animation
     * @param {number} delta Time 
     */
    update(delta){
        if(!this.initialized){
            this.initialized=true
            this.pieces = this.boardRepresentation.removePiecefromTile(this.selectPiece);
            return
        }
        this.anim.update(delta);
        if(this.anim.isFinished() && !this.animFinished){
            this.animFinished=true;
            this.animator.notifyOrchestrator();
        }
    }
    /**
     * @brief Applies the Move Animation
     */
	animate(){
        if(this.pieces.length==0)return
        this.boardRepresentation.scene.pushMatrix();
        this.anim.apply(this.boardRepresentation.scene);
        for(let x=this.pieces.length-1;x>=0;x--){
            this.pieces[x].display();
            this.boardRepresentation.scene.translate(0,0.1,0);
        }
        this.boardRepresentation.scene.popMatrix();
        
    }
    /**
     * @returns The original board
     */
    getOriginalBoard(){
        return this.originalBoard
    }
    /**
     * @returns The board after the move
     */
    getAlteredBoard() {
        this.boardRepresentation.getTileFromPiece(this.selectPiece).setPiece(new MyPiece(this.boardRepresentation.scene,-1))
        this.boardRepresentation.addPieceToTile(this.destinationPiece,this.pieces)
        return this.boardRepresentation.getPieces()
    }
    /**
     * @returns True if the animation is finished, false otherwise
     */
    finishedAnimation(){
        return this.animFinished;
    }
    /**
     * @brief Reset the animation
     */
    resetAnimation(){
        this.anim.resetAnimation()
        this.animFinished=false
        this.initialized=false
    }
    /**
     * @returns Removed Pieces
     */
    getPieces(){
        return this.pieces
    }

}