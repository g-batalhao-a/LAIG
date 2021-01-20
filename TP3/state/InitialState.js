/**
 * @class InitialState
 * @extends GameState
 * @brief
 */
class InitialState extends GameState {
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
     * @brief Initializes the board, based on the selected size
     */
    notifyInit(){
        this.boardOrchestrator.menu.buttons.start.pick()
        this.boardOrchestrator.boardSequence.reset()
        if(this.boardOrchestrator.menu.isPlayAvailable())
            this.boardOrchestrator.menu.makePlayAvailable()
        this.boardOrchestrator.gameType=this.boardOrchestrator.originalGameType.slice(0,2)
        
        if(this.boardOrchestrator.gameSize==1)
            this.boardOrchestrator.board.initBoard(6,6)
        else if(this.boardOrchestrator.gameSize==2)
            this.boardOrchestrator.board.initBoard(9,6)
        else if(this.boardOrchestrator.gameSize==3)
            this.boardOrchestrator.board.initBoard(9,9)
        
        this.boardOrchestrator.prologInterface.initialBoard(this.boardOrchestrator.gameSize)
    }
    /**
     * @brief Sets the board and starts the piece dropping animation
     * @param {string} response 
     */
    receiveResponse(response){
        this.boardOrchestrator.board.setBoard(response)
        this.boardOrchestrator.board.setPiecesPos()
        this.boardOrchestrator.changeState(new AnimatingState(this.boardOrchestrator,this.player));
    }   
}