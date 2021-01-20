/**
 * GameState
 * @abstract
 * @brief Abstract class that represents a GameState
 */
class GameState {
    /**
     * @constructor
     * @param {Object} boardOrchestrator Board Orchestrator
     * @param {string} player Player
     */
    constructor(boardOrchestrator, player) {
        this.boardOrchestrator = boardOrchestrator;
        this.player = player;
        this.init = false
    }
    /**
     * @brief Handles the Picking of a Piece
     * @param {Object} obj Object
     * @param {number} customId Index
     */
    pickPiece(obj, customId) {

    }
    /**
     * @brief Handles the picking of the undo and reset buttons
     * @param {Object} obj Object
     * @param {number} customId Index
     */
    specialPick(obj, customId) {
        if (obj instanceof MyButton) {
            if (customId == 509) {
                let undo = this.boardOrchestrator.boardSequence.undo()
                if (undo != null)
                    this.boardOrchestrator.board.setBoard(undo)
            } else if (customId == 510) {
                this.boardOrchestrator.animatedCamera.changeView("Menu View")
                this.boardOrchestrator.reset()
            }
        }
    }
    /**
     * @brief Handles the response from the Prolog server
     * @param {string} response Response from server
     */
    receiveResponse(response) {

    }
    /**
     * @returns Next Player to play
     */
    changePlayer() {
        if (this.player == 'WHITES') return 'BLACKS';
        else return 'WHITES';
    }
    /**
     * @brief Acts when State was changed
     */
    notifyInit() {
        this.init = true
    }
    /**
     * @brief Forces a game over after a certain Time
     */
    forceEndGame() {
        this.boardOrchestrator.gamestate = new EndState(this.boardOrchestrator, this.player)
        this.boardOrchestrator.gamestate.receiveResponse(this.changePlayer())
    }
}