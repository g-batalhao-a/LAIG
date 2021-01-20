/**
 * AnimatingState
 * @extends GameState
 * @brief Represents a State where there is an animation
 */
class AnimatingState extends GameState {
    /**
     * @constructor
     * @param {Object} boardOrchestrator Board Orchestrator
     * @param {string} player Player
     * @param {Object} newBoard Next Board
     */
    constructor(boardOrchestrator,player,newBoard) {
        super(boardOrchestrator,player);
        this.newBoard=newBoard;
    }
    /**
     * @brief Doesn't allow picking
     * @param {Object} obj Object
     * @param {number} customId Index
     */
    specialPick(obj,customId){
        if(customId == 510) {
            this.boardOrchestrator.animatedCamera.changeView("Menu View")
            this.boardOrchestrator.reset()
        }
    }
    /**
     * @brief Activates the camera animation, if a turn has just finished
     * Changes to MenuState if the animation from the camera, after the game has ended, ended
     * Changes to InitialState if the animation from the camera, after the game has started, ended
     * Changes to GameOverState if the animation from the camera, after a turn, ended
     * @param {string} response 
     */
    receiveResponse(response){
        if(response=="turn"){
            this.boardOrchestrator.menu.resetMoveTime()
            this.boardOrchestrator.board.setBoard(this.newBoard)
            this.boardOrchestrator.animatedCamera.setActive()
        }
        else if(response=="camera" && !this.boardOrchestrator.menu.startedGame){
            
            if(this.boardOrchestrator.animatedCamera.switchedCams()){
                if(this.boardOrchestrator.animatedCamera.name=="Menu View")
                    this.boardOrchestrator.changeState(new MenuState(this.boardOrchestrator,this.player))
                else if (this.boardOrchestrator.animatedCamera.name=="Playing View")
                    this.boardOrchestrator.changeState(new InitialState(this.boardOrchestrator,this.player))
            }
                
        }
        else if(response=="camera") {
            this.boardOrchestrator.menu.resetMoveTime()
            this.boardOrchestrator.changeState(new GameOverState(this.boardOrchestrator,this.player))
        }
        else if(response=="pieces"){
            this.boardOrchestrator.menu.notifyInit()
            if(this.boardOrchestrator.gameType.charAt(0)=="H")
                this.boardOrchestrator.changeState(new SelectState(this.boardOrchestrator,'BLACKS'))
            else if(this.boardOrchestrator.gameType.charAt(0)=="C")
                this.boardOrchestrator.changeState(new BotState(this.boardOrchestrator,'BLACKS'))
        }
    }
}