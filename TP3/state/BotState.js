/**
 * GameOverState
 * @extends GameState
 * @brief Represents a State where a Computer is Playing
 */
class BotState extends GameState {
    /**
     * @constructor
     * @param {Object} boardOrchestrator Board Orchestrator
     * @param {string} player Player
     */
    constructor(boardOrchestrator,player) {
        super(boardOrchestrator,player);
    }
    /**
     * @brief Requests the computer move
     */
    notifyInit(){
        this.boardOrchestrator.prologInterface.chooseMove(JSON.stringify(this.boardOrchestrator.board.getPieces()),this.player,this.boardOrchestrator.difficulty)
    }
    /**
     * @brief Parses the response from the server and builds the move
     * @param {string} response 
     */
    receiveResponse(response){
        this.boardOrchestrator.menu.resetMoveTime()
        let split = response.split("/")
        let newBoard = JSON.parse(split[0])
        let move = JSON.parse(split[1])
        this.boardOrchestrator.boardSequence.addBoardMove(new MyBoardMove(this.boardOrchestrator.board.getIDFromRowAndCol(move[1],move[0]),this.boardOrchestrator.board.getIDFromRowAndCol(move[3],move[2]),this.boardOrchestrator.board,this.boardOrchestrator.animator));
        this.boardOrchestrator.changeState(new AnimatingState(this.boardOrchestrator,this.player,newBoard));
    }
}
