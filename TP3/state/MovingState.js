/**
 * @class MovingState
 * @extends GameState
 * @brief Represents the state where a player is selecting a tile to move a piece to
 */
class MovingState extends GameState {
    /**
     * @constructor
     * @param {Object} boardOrchestrator Board Orchestrator
     * @param {string} player Player
     * @param {number} moveIndex Move Index
     */
    constructor(boardOrchestrator,player,moveIndex) {
        super(boardOrchestrator,player);
        this.moveIndex=moveIndex;
    }
    /**
     * @brief Requests the move Piece
     * @param {Object} obj Object
     * @param {number} customId Index
     */
    pickPiece(obj,customId){
        this.boardOrchestrator.customId=customId;
        this.boardOrchestrator.prologInterface.movePiece(JSON.stringify(this.boardOrchestrator.board.getPieces()),this.player,this.moveIndex,this.boardOrchestrator.board.getColumnOffset(customId),this.boardOrchestrator.board.getRowOffset(customId))
          
    }
    /**
     * @brief If the move was valid, perform it and change to an AnimatingState; Else, go back to the SelectState
     * @param {string} response 
     */
    receiveResponse(response){
        if(response!='invalid'){
            this.boardOrchestrator.menu.resetMoveTime()
            this.boardOrchestrator.boardSequence.addBoardMove(new MyBoardMove(this.boardOrchestrator.lastPick,this.boardOrchestrator.customId,this.boardOrchestrator.board,this.boardOrchestrator.animator));
            this.boardOrchestrator.changeState(new AnimatingState(this.boardOrchestrator,this.player,response));
            this.boardOrchestrator.lastObjs.forEach(element => {
                element.pick();
            });
            this.boardOrchestrator.lastPick=null
        }
        else{
            this.boardOrchestrator.lastObjs.forEach(element => {
                element.pick();
            });
            this.boardOrchestrator.lastPick=null;
            this.boardOrchestrator.changeState(new SelectState(this.boardOrchestrator,this.player));
        }
    }
}