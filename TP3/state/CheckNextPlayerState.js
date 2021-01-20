/**
 * CheckNextPlayerState
 * @extends GameState
 * @brief Represents the state where there is a verification of the next player
 */
class CheckNextPlayerState extends GameState {
    /**
     * @constructor
     * @param {Object} boardOrchestrator Board Orchestrator
     * @param {string} player Player
     */
    constructor(boardOrchestrator,player) {
        super(boardOrchestrator,player);
        this.NPlayer = this.changePlayer()
    }
    /**
     * @brief Requests the valid Moves
     */
    notifyInit(){
        this.boardOrchestrator.prologInterface.validMoves(JSON.stringify(this.boardOrchestrator.board.getPieces()),this.NPlayer)
    }
    /**
     * @brief If the next Player has moves, sets up his turn; If not, passes his turn
     * @param {string} response 
     */
    receiveResponse(response){
        if(response>0){
            this.boardOrchestrator.reverseGameType()
            if(this.boardOrchestrator.gameType.charAt(0)=="H")
                this.boardOrchestrator.changeState(new SelectState(this.boardOrchestrator,this.NPlayer))
            else if(this.boardOrchestrator.gameType.charAt(0)=="C")
                this.boardOrchestrator.changeState(new BotState(this.boardOrchestrator,this.NPlayer))
        }
        else if(response==0){
            if(this.boardOrchestrator.gameType.charAt(0)=="H")
            this.boardOrchestrator.changeState(new SelectState(this.boardOrchestrator,this.player))
            else if(this.boardOrchestrator.gameType.charAt(0)=="C")
            this.boardOrchestrator.changeState(new BotState(this.boardOrchestrator,this.player))
        }
    }
}
