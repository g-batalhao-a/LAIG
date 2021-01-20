/**
 * MyBoardOrchestrator
 * @brief Class that deals with the game
 */
class MyBoardOrchestrator {
    /**
     * @constructor
     * @param scene Reference to MyScene object
     */
    constructor(scene) {
        this.scene = scene;
        this.lastPick;
        this.lastObj;
    }
    /**
     * @brief Initializes the required objects
     */
    init() {
        this.board = this.scene.graph.board
        this.board.setOrchestrator(this)
        this.theme = this.scene.graph
        this.gameType = "CC"
        this.originalGameType = this.gameType.slice(0, 2)
        this.gameSize = 1
        this.difficulty = 2
        this.menu = new MyMenu(this.scene, this)
        this.animatedCamera = new CameraAnimation(this.scene, this)
        this.gamestate = new MenuState(this, 'BLACKS');
        this.prologInterface = new MyPrologInterface(this);
        this.boardSequence = new MyBoardSequence();
        this.animator = new MyAnimator(this, this.boardSequence);
    }
    /**
     * @brief Resets the orchestrator
     */
    reset() {
        this.gameType = this.originalGameType.slice(0, 2)
        this.menu.reset()
        this.board.reset()
        this.boardSequence.reset();
        this.gamestate = new MenuState(this, 'BLACKS');
        this.lastPick;
        this.lastObj;
    }
    /**
     * @brief Changes the theme of the game
     * @param {Object} graph MySceneGraph
     */
    changeTheme(graph) {
        this.animator.notifyChange(graph.filename)
        this.board.notifyChange(graph.filename)
        this.theme = graph
    }
    /**
     * @brief Updates the animations and the timer
     * @param {number} delta Time 
     */
    update(delta) {
        this.animator.update(delta)
        this.animatedCamera.update(delta)
        this.menu.updateTime(delta)
        this.board.update(delta)
    }
    /**
     * @brief Displays the scene
     */
    display() {
        this.scene.pushMatrix();
        this.theme.displayScene();

        this.scene.pushMatrix()
        this.menu.display(this.board)
        this.scene.popMatrix()

        this.board.display();
        this.animator.display();
        this.scene.popMatrix();
    }
    /**
     * @brief Handles the picking
     * @param {boolean} pickMode 
     * @param {Array} pickResults 
     */
    handlePicking(pickMode, pickResults) {
        if (pickMode == false) {
            if (pickResults != null && pickResults.length > 0) {
                for (let i = 0; i < pickResults.length; i++) {
                    let obj = pickResults[i][0];
                    if (obj) {
                        let customId = pickResults[i][1];
                        this.gamestate.specialPick(obj, customId);
                        this.gamestate.pickPiece(obj, customId);

                    }
                }
                pickResults.splice(0, pickResults.length);
            }
        }
    }
    /**
     * @brief Notifies the animator of an end of turn
     */
    animatorNotify() {
        this.gamestate.receiveResponse("turn");
    }
    /**
     * @brief Changes the GameState
     * @param {Object} state 
     */
    changeState(state) {
        this.gamestate = state;
        this.gamestate.notifyInit()
    }
    /**
     * @brief Sends a response to a GameState
     * @param {*} response 
     */
    sendResponseToGameState(response) {
        this.gamestate.receiveResponse(response);
    }
    /**
     * @brief Reverses the GameType
     */
    reverseGameType() {
        this.gameType = this.gameType.split("").reverse().join("")
    }

}