/**
 * GameOverState
 * @extends GameState
 * @brief Represents the state where a turn is over
 */
class GameOverState extends GameState {
    /**
     * @constructor
     * @param {Object} boardOrchestrator Board Orchestrator
     * @param {string} player Player
     */
    constructor(boardOrchestrator,player) {
        super(boardOrchestrator,player);
        this.boardOrchestrator.animatedCamera.deactivate()
    }
    /**
     * @brief Requests the check available moves
     */
    notifyInit(){
        this.boardOrchestrator.prologInterface.checkAvailableMoves(JSON.stringify(this.boardOrchestrator.board.getPieces()))
    }
    /**
     * @brief If the game is over, changes to the EndState; If there are still moves, changes to CheckNextPlayerState
     * @param {string} response 
     */
    receiveResponse(response){
        if(response==0){
            this.boardOrchestrator.changeState(new CheckNextPlayerState(this.boardOrchestrator,this.player))
        }
        else if(response==1){
            this.boardOrchestrator.changeState(new EndState(this.boardOrchestrator,this.player))
        }
    }
}