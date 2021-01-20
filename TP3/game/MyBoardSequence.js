/**
 * MyBoardSequence
 * @brief Sequence of moves
 */
class MyBoardSequence {
    /**
     * @constructor
     */
	constructor() {
        this.sequence=[];
        this.currMove=0;
    }
    /**
     * @brief Adds a move to the sequence
     * @param {Object} boardMove 
     */
    addBoardMove(boardMove){
        this.sequence.push(boardMove);
        this.currMove=this.sequence.length-1;
    }
    /**
     * @brief Undoes the two previous Moves
     */
    undo(){
        if(this.sequence.length<2)return;
        this.currMove-=2
        this.sequence.pop(); return this.sequence.pop().getOriginalBoard();
    }
    /**
     * @brief Updates the current Move animation
     * @param {number} delta Time 
     */
    update(delta){
        if(this.currMove==this.sequence.length || this.sequence.length==0) return
        this.getCurrMove().update(delta)
    }
    /**
     * @brief Goes to next move
     */
    updateCurrMove(){
        this.currMove++
    }
    /**
     * @returns Gets the current move
     */
    getCurrMove(){
        if(this.sequence.length!==0)
            return this.sequence[this.currMove];
    }
    /**
     * @returns Gets the previous move
     */
    getPreviousMove(){
        if(this.sequence.length>1)
            return this.sequence[this.currMove-1];
    }
    /**
     * @brief Resets the sequence
     */
    reset(){
        this.sequence=[];
        this.currMove=0;
    }
    /**
     * @brief Resets all moves
     */
    replay(){
        this.sequence.forEach(move => {
            move.resetAnimation()
        })
        this.currMove=0
    }
    /**
     * @returns Move sequence
     */
    getSequence(){
        return this.sequence;
    }

}