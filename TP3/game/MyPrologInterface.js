/**
 * MyPrologInterface
 * @brief Class that deals with the Prolog connection
 */
class MyPrologInterface {
    /**
     * @constructor
     * @param {Object} boardOrchestrator Board Orchestrator
     */
    constructor(boardOrchestrator) {
        this.boardOrchestrator = boardOrchestrator;
        this.connected = false;
        this.initServer();
    }
    /**
     * @brief Initializes the Prolog server
     */
    initServer() {
        
        let response= JSON.parse(this.getPrologRequest("handshake"));
        
        if (response == 'handshake') {
            console.log('Connected');
            this.connected = true;
        }
        else  {
            console.log('Could\'nt connect');
        }
        
    }
    /**
     * @brief Gets a request from Prolog
     * @param {string} requestString Request
     * @param {number} port Port
     */
    getPrologRequest(requestString, port) {
    let requestPort = port || 8000;
    let request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, false);

    request.interface = this;
    request.orchestrator = this.orchestrator;

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
    return request.responseText
    }
    /**
     * @brief Requests the initial Board from prolog
     * @param {number} option Size code
     */
    initialBoard(option) {
        let requestString = 'initialBoard('+option+')';
        if (this.connected) {
           let response = JSON.parse(this.getPrologRequest(requestString));
           this.boardOrchestrator.sendResponseToGameState(response)
        }
        else {
            console.error("Not connected to the server");
        }
    }
    /**
     * @brief Requests the valid moves from the current board
     * @param {Array} board Game Board
     * @param {string} player Player
     */
    validMoves(board,player) {

        let resquestString = 'valid_moves('+board+','+'\''+player+'\''+')';

        if (this.connected) {
            let response = JSON.parse(this.getPrologRequest(resquestString));
            this.boardOrchestrator.sendResponseToGameState(response)
        }
        else {
            console.error("Not connected to the server");
        }
    }
    /**
     * @brief Checks if the board still has available moves or not
     * @param {Array} board Game Board
     */
    checkAvailableMoves(board) {

        let requestString = 'checkAvailableMoves(' + board +')';

        if (this.connected) {
            let response = JSON.parse(this.getPrologRequest(requestString));
            this.boardOrchestrator.sendResponseToGameState(response)
        }
        else {
            console.error("Not connected to the server");
        }
    }
    /**
     * @brief Checks if the game is over
     * @param {Array} board Game Board
     */
    gameOver(board) {
        let requestString = 'game_over(' + board +')';

        if (this.connected) {
            let response = this.getPrologRequest(requestString);
            this.boardOrchestrator.sendResponseToGameState(response)
        }
        else {
            console.error("Not connected to the server");
        }
    }
    /**
     * @brief Checks if the selection is valid
     * @param {Array} board Game Board
     * @param {string} player Player
     * @param {number} column Selected column
     * @param {number} row Selected Row
     */
    selectPiece(board,player,column,row) {
        let requestString = 'selectPiece('+board+','+'\''+player+'\''+','+column+','+row+')';
        if (this.connected) {
            let response = JSON.parse(this.getPrologRequest(requestString));
            this.boardOrchestrator.sendResponseToGameState(response)
        }
        else {
            console.error("Not connected to the server");
        }
    }
    /**
     * @brief Checks if the move is valid
     * @param {Array} board Game Board
     * @param {string} player Player
     * @param {number} chosenPiece Index of the Chosen Piece
     * @param {number} column Selected column
     * @param {number} row Selected Row
     */
    movePiece(board,player,chosenPiece,column,row) {

        let requestString = 'movePiece('+board+','+'\''+player+'\''+','+chosenPiece+','+column+','+row+')';
        
        if (this.connected) {
            let response = JSON.parse(this.getPrologRequest(requestString));
            this.boardOrchestrator.sendResponseToGameState(response)
        }
        else {
            console.error("Not connected to the server");
        }
    }
    /**
     * @brief Does a computer move
     * @param {Array} board Game Board
     * @param {string} player Player
     * @param {number} level Level of the Bot
     */
    chooseMove(board,player,level) {
        let requestString = 'choose_move('+board+','+'\''+player+'\''+','+level+')';
        
        if (this.connected) {
            let response = this.getPrologRequest(requestString);
            this.boardOrchestrator.sendResponseToGameState(response)
        }
        else {
            console.error("Not connected to the server");
        }
    }
    /**
     * @brief Verifies if the connection was successful
     */
    handshake() {
        let handleBoardReply = function(data) {
            console.log(data.target.response);
        }

        this.getPrologRequest('handshake',handleBoardReply);
    }
    /**
     * @brief Terminates the server
     */
    quit() {
        let handleQuitReply = function(data) {
            console.log(data.target.response);
        }

        if (this.connected) {
            this.getPrologRequest('quit',handleQuitReply);
        }
        else {
            console.log("Not connected to the server");
        }
    }
}