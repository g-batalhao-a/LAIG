/**
 * @class SelectState
 * @extends GameState
 * @brief Represents the state where a player is choosing a piece
 */
class SelectState extends GameState {
    /**
     * @constructor
     * @param {Object} boardOrchestrator Board Orchestrator
     * @param {string} player Player
     */
    constructor(boardOrchestrator,player) {
        super(boardOrchestrator,player);
    }
    /**
     * @brief Requests the select Piece
     * @param {Object} obj Object
     * @param {number} customId Index
     */
    pickPiece(obj,customId){
        this.boardOrchestrator.customId=customId;
        this.boardOrchestrator.prologInterface.selectPiece(JSON.stringify(this.boardOrchestrator.board.getPieces()),this.player,this.boardOrchestrator.board.getColumnOffset(customId),this.boardOrchestrator.board.getRowOffset(customId))
    }
    /**
     * @brief If the selection is valid pick the Piece/Pieces and change to a MovingState; Else, do nothing
     * @param {string} response 
     */
    receiveResponse(response){
        if(response!='invalid'){
            this.boardOrchestrator.lastPick=this.boardOrchestrator.customId;
            this.boardOrchestrator.lastObjs=this.boardOrchestrator.board.getPiecesFromTile(this.boardOrchestrator.lastPick-(this.boardOrchestrator.board.getRows()*this.boardOrchestrator.board.getColumns()));
            this.boardOrchestrator.lastObjs.forEach(element => {
                element.pick();
            });
            this.boardOrchestrator.changeState(new MovingState(this.boardOrchestrator,this.player,response));
        }
    }
}