/**
 * GameOverState
 * @extends GameState
 * @brief Represents the state where the game has finished
 */
class EndState extends GameState {
    /**
     * @constructor
     * @param {Object} boardOrchestrator Board Orchestrator
     * @param {string} player Player
     */
    constructor(boardOrchestrator,player) {
        super(boardOrchestrator,player);
    }
    /**
     * @brief Requests the Game Over response
     */
    notifyInit(){
        this.boardOrchestrator.prologInterface.gameOver(JSON.stringify(this.boardOrchestrator.board.getPieces()))
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
     * @brief If the game is tied, restarts the game; Else, moves the camera back to the view of the menu and makes the "game movie" available 
     * @param {string} response 
     */
    receiveResponse(response){
        this.boardOrchestrator.animatedCamera.changeView("Menu View")
        this.boardOrchestrator.menu.notifyInit()
        this.boardOrchestrator.menu.disableMoveTime()
        if(response!='TIED'){
            this.boardOrchestrator.menu.changeScoreBoard(response)
        }
        if(this.boardOrchestrator.boardSequence.getSequence().length!=0)
            this.boardOrchestrator.menu.makePlayAvailable()
        this.boardOrchestrator.changeState(new MenuState(this.boardOrchestrator,this.player))
        
    }
}