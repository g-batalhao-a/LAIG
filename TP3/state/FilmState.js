/**
 * FilmState
 * @extends GameState
 * @brief Represents the state where a player is watching the "game movie"
 */
class FilmState extends GameState {
    /**
     * @constructor
     * @param {Object} boardOrchestrator Board Orchestrator
     * @param {string} player Player
     */
    constructor(boardOrchestrator,player) {
        super(boardOrchestrator,player);
        this.boardOrchestrator.animator.start()
        this.boardOrchestrator.board.setBoard(this.boardOrchestrator.boardSequence.getCurrMove().getOriginalBoard())
    }
    /**
     * @brief Only allows reset of the board
     * @param {Object} obj Object
     * @param {number} customId Index
     */
    specialPick(obj,customId){
        if(customId == 510) {
            this.boardOrchestrator.init()
        }
    }
    /**
     * @brief Only allows the player to pause/unpause the movie
     * @param {Object} obj Object
     * @param {number} customId Index
     */
    pickPiece(obj,customId){
       if(customId==511){
           this.boardOrchestrator.menu.updatePlay()
            this.boardOrchestrator.animator.pause()
        }
    }
    /**
     * @brief Updates the board, when the animation of a move has finished; If the move is the last, goes back to the MenuState
     * @param {string} response 
     */
    receiveResponse(response){
        if(response=="turn"){
            if(this.boardOrchestrator.boardSequence.currMove!=this.boardOrchestrator.boardSequence.getSequence().length) {
                this.boardOrchestrator.board.setBoard(this.boardOrchestrator.boardSequence.getCurrMove().getOriginalBoard())
            }
            else{
                this.boardOrchestrator.board.setBoard(this.boardOrchestrator.boardSequence.getPreviousMove().getAlteredBoard())
                this.boardOrchestrator.menu.updatePlay()
                this.boardOrchestrator.changeState(new MenuState(this.boardOrchestrator,this.player))
            }    
        } 
    }
}