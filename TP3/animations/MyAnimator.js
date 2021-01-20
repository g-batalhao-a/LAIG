/**
 * MyAnimator
 * @brief Class that deals with the animation of the scene
 * @param scene - Reference to MyScene object
 * @param boardOrchestrator - reference to board orchestrator
 * @param boardSequence - sequence of moves
 */
class MyAnimator {
    /**
     * @method constructor
     * @param {Object} boardOrchestrator BoardOrchestrator
     * @param {Object} boardSequence BoardSequence
     */
	constructor(boardOrchestrator,boardSequence) {
        this.boardOrchestrator=boardOrchestrator;
        this.boardSequence=boardSequence;
        this.frame=0;
        this.reseted=false;
        this.paused=false;
    }
    /**
     * @biref Updates the board sequence, the move animations more precisely
     * @param {number} delta 
     */
    update(delta){
        if(this.paused) return
        this.boardSequence.update(delta);
    }
    /**
     * @brief Resets the board sequence
     */
    reset(){
        this.boardSequence.reset()
    }
    /**
     * @brief Updates the pause flag
     */
    pause(){
        this.paused=!this.paused
    }
    /**
     * @brief Resets the board sequence and starts the "game movie"
     */
    start(){
        this.reseted=true;
        this.boardSequence.replay();
    }
    /**
     * @biref Displays the move animation
     */
    display(){
        let currMove = this.boardSequence.getCurrMove();
        if(currMove) currMove.animate();
        
    }
    /**
     * @brief Notifies the orchestrator that a move has finished its animation
     */
    notifyOrchestrator(){
        this.boardSequence.updateCurrMove()
        this.boardOrchestrator.animatorNotify();
    }
    /**
     * @brief Notifies Theme change to current move
     */
    notifyChange(filename){
        let currMove = this.boardSequence.getCurrMove()
        if(currMove){
            currMove.getPieces().forEach(piece =>{
                piece.changeShape(filename)
            })
        }
        
    }

}