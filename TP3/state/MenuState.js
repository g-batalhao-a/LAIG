/**
 * @class SelectState
 * @abstract
 */
class MenuState extends GameState {
    /**
     * @constructor
     * @param {Object} boardOrchestrator Board Orchestrator
     * @param {string} player Player
     */
    constructor(boardOrchestrator,player) {
        super(boardOrchestrator,player);
    }
    /**
     * @brief Deactivates camera movement
     */
    notifyInit(){
        this.boardOrchestrator.animatedCamera.deactivate()
    }
    /**
     * @brief Updates the menu, starts the game and starts the movie
     * @param {Object} obj Object
     * @param {number} customId Index
     */
    pickPiece(obj,customId){
        if(customId==508){
            this.boardOrchestrator.menu.buttons.start.pick()
            this.boardOrchestrator.animatedCamera.changeView("Playing View")
            this.boardOrchestrator.changeState(new AnimatingState(this.boardOrchestrator,this.player));
        }
        else if(customId==501)
            this.boardOrchestrator.menu.updatePlayer(1)
        else if(customId==502)
            this.boardOrchestrator.menu.updatePlayer(2)
        else if(customId==503)
            this.boardOrchestrator.menu.updateSize(1)
        else if(customId==504)
            this.boardOrchestrator.menu.updateSize(2)
        else if(customId==505)
            this.boardOrchestrator.menu.updateSize(3)
        else if(customId==506)
            this.boardOrchestrator.menu.updateDifficulty(1)
        else if(customId==507)
            this.boardOrchestrator.menu.updateDifficulty(2)
        else if(customId==511){
            if(!this.boardOrchestrator.menu.isPlayAvailable())
                return
            if(this.boardOrchestrator.boardSequence.getSequence().length!=0){
                this.boardOrchestrator.menu.updatePlay()
                this.boardOrchestrator.changeState(new FilmState(this.boardOrchestrator,this.player))
            }
            
        }
    }
}