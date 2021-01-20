/**
 * Mymenu
 * @brief Class that represents a menu
 */
class MyMenu extends CGFobject {
    /**
     * @constructor
     * @param {Object} scene Reference to MyScene object
     * @param {Object} boardOrchestrator Board Orchestrator
     */
    constructor(scene, boardOrchestrator) {
        super(scene);
        this.boardOrchestrator = boardOrchestrator
        this.init()
    }
    /**
     * @brief Initializes the required materials
     */
    init() {
        this.blackScore = 0
        this.whiteScore = 0
        this.time = 0
        this.startedGame = false
        this.parts = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.material = new CGFappearance(this.scene);
        this.material.setShininess(20);
        this.material.setEmission(0.0, 0.0, 0.0, 1);
        this.material.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.material.setDiffuse(0.1, 0.6, 0.1, 1.0);
        this.material.setSpecular(1, 1, 1, 1.0);
        this.material.setTextureWrap('REPEAT', 'REPEAT');
        this.whiteMaterial = new CGFappearance(this.scene);
        this.whiteMaterial.setShininess(20);
        this.whiteMaterial.setEmission(0.0, 0.0, 0.0, 1);
        this.whiteMaterial.setAmbient(0.6, 0.6, 0.6, 1.0);
        this.whiteMaterial.setDiffuse(0.6, 0.6, 0.6, 1.0);
        this.whiteMaterial.setSpecular(1, 1, 1, 1.0);
        this.whiteMaterial.setTextureWrap('REPEAT', 'REPEAT');
        this.buttons = {
            title: new MySpriteText(this.scene, "Greener"),
            OnePlayer: new MyButton(this.scene, "1-Player"),
            TwoPlayer: new MyButton(this.scene, "2-Player"),
            sixsixSize: new MyButton(this.scene, "6x6"),
            sixnineSize: new MyButton(this.scene, "6x9"),
            ninenineSize: new MyButton(this.scene, "9x9"),
            easy: new MyButton(this.scene, "Easy"),
            medium: new MyButton(this.scene, "Medium"),
            start: new MyButton(this.scene, "START GAME"),
            undo: new MyButton(this.scene, "UNDO"),
            reset: new MyButton(this.scene, "RESET"),
            play: new MyButton(this.scene, "MOVIE")
        }
        this.buttons.undo.changeMaterial("orange")
        this.buttons.reset.changeMaterial("orange")
        this.buttons.play.toggleAvailability()
        this.title = new MySpriteText(this.scene, "Greener")
        this.timerTitle = new MySpriteText(this.scene, "Timer")
        this.moveTimer = new MySpriteText(this.scene, "Move Time - 40s max")
        this.scoreTitle = new MySpriteText(this.scene, "Score")
        this.timer = new MySpriteText(this.scene, "00:00")
        this.score = new MySpriteText(this.scene, "B " + JSON.stringify(this.blackScore) + "-" + JSON.stringify(this.whiteScore) + " W")
    }
    /**
     * @brief Displays the Menu and the scoreboards
     * @param {Object} board Game Board
     */
    display(board) {
        this.scene.pushMatrix()
        this.material.apply()
        this.scene.translate(board.x, board.y, board.z - (board.getRows() + 1.1))
        this.drawMenu()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.whiteMaterial.apply()
        this.scene.translate(board.x - (board.getColumns() + 4.5), board.y, board.z)
        this.scene.rotate(90 * Math.PI / 180.0, 0, 1, 0)
        this.drawScoreBoard()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.whiteMaterial.apply()
        this.scene.translate(parseInt(board.x) + (board.getColumns() + 4.5), board.y, board.z)
        this.scene.rotate(-90 * Math.PI / 180.0, 0, 1, 0)
        this.drawScoreBoard()
        this.scene.popMatrix()
    }
    /**
     * @brrief Draws the menu
     */
    drawMenu() {
        this.scene.pushMatrix();

        this.scene.translate(0, 4.5, -1.7)
        this.scene.rotate(-15 * Math.PI / 180.0, 1, 0, 0)

        this.drawBody()

        this.scene.registerForPick(501, this.buttons.OnePlayer);
        this.scene.pushMatrix();
        this.scene.translate(-2.5, 3, 0.5);
        this.scene.scale(0.5, 0.5, 0.5)
        this.buttons.OnePlayer.display();
        this.scene.popMatrix();

        this.scene.registerForPick(502, this.buttons.TwoPlayer);
        this.scene.pushMatrix();
        this.scene.translate(2.5, 3, 0.5);
        this.scene.scale(0.5, 0.5, 0.5)
        this.buttons.TwoPlayer.display();
        this.scene.popMatrix();

        this.scene.registerForPick(503, this.buttons.sixsixSize);
        this.scene.pushMatrix();
        this.scene.translate(-3, 1.5, 0.5);
        this.scene.scale(0.5, 0.5, 0.5)
        this.buttons.sixsixSize.display();
        this.scene.popMatrix();

        this.scene.registerForPick(504, this.buttons.sixnineSize);
        this.scene.pushMatrix();
        this.scene.translate(0, 1.5, 0.5);
        this.scene.scale(0.5, 0.5, 0.5)
        this.buttons.sixnineSize.display();
        this.scene.popMatrix();

        this.scene.registerForPick(505, this.buttons.ninenineSize);
        this.scene.pushMatrix();
        this.scene.translate(3, 1.5, 0.5);
        this.scene.scale(0.5, 0.5, 0.5)
        this.buttons.ninenineSize.display();
        this.scene.popMatrix();


        this.scene.registerForPick(506, this.buttons.easy);
        this.scene.pushMatrix();
        this.scene.translate(-2.5, 0, 0.5);
        this.scene.scale(0.5, 0.5, 0.5)
        this.buttons.easy.display();
        this.scene.popMatrix();

        this.scene.registerForPick(507, this.buttons.medium);
        this.scene.pushMatrix();
        this.scene.translate(2.5, 0, 0.5);
        this.scene.scale(0.5, 0.5, 0.5)
        this.buttons.medium.display();
        this.scene.popMatrix();

        this.scene.registerForPick(508, this.buttons.start);
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0.5);
        this.scene.scale(0.75, 0.75, 0.75)
        this.buttons.start.display();
        this.scene.popMatrix();

        this.scene.registerForPick(509, this.buttons.undo);
        this.scene.pushMatrix();
        this.scene.translate(-2.5, -2.5, 0.5);
        this.scene.scale(0.75, 0.75, 0.75)
        this.buttons.undo.display();
        this.scene.popMatrix();

        this.scene.registerForPick(510, this.buttons.reset);
        this.scene.pushMatrix();
        this.scene.translate(2.5, -2.5, 0.5);
        this.scene.scale(0.75, 0.75, 0.75)
        this.buttons.reset.display();
        this.scene.popMatrix();

        this.scene.registerForPick(511, this.buttons.play);
        this.scene.pushMatrix();
        this.scene.translate(0, -4, 0.5);
        this.scene.scale(0.75, 0.75, 0.75)
        this.buttons.play.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1, 4.4, 0.55);
        this.title.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
    /**
     * @brief Draws the ScoreBoard
     */
    drawScoreBoard() {
        this.scene.translate(0, 2, 0)
        this.scene.pushMatrix();

        this.scene.pushMatrix()
        this.scene.scale(0.75, 0.55, 0.75)
        this.drawBody()
        this.scene.popMatrix()

        this.scene.pushMatrix();
        this.scene.translate(0.5, 2, 0.5);
        this.scene.scale(0.5, 0.5, 0.5)
        this.timerTitle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5, 1, 0.5);
        this.scene.scale(0.75, 0.75, 0.75)
        this.timer.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.35, 0.35, 0.5);
        this.scene.scale(0.35, 0.35, 0.35)
        this.moveTimer.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5, -0.5, 0.5);
        this.scene.scale(0.5, 0.5, 0.5)
        this.scoreTitle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5, -1.5, 0.5);
        this.scene.scale(0.75, 0.75, 0.75)
        this.score.display();
        this.scene.popMatrix();


        this.scene.popMatrix()
    }
    /**
     * @brief Draws the body of the Menu/ScoreBoard
     */
    drawBody() {
        this.scene.pushMatrix()

        this.scene.scale(10, 10, 1)

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.parts.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(90 * Math.PI / 180.0, 0, 1, 0);
        this.parts.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(180 * Math.PI / 180.0, 0, 1, 0);
        this.parts.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-90 * Math.PI / 180.0, 0, 1, 0);
        this.parts.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-90 * Math.PI / 180.0, 1, 0, 0);
        this.parts.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(90 * Math.PI / 180.0, 1, 0, 0);
        this.parts.display();
        this.scene.popMatrix();

        this.scene.popMatrix()
    }
    /**
     * @brief Updates the Number of Players
     * @param {number} code Code of Players
     */
    updatePlayer(code) {
        if (code == 1) {
            if (!this.buttons.OnePlayer.isPicked()) this.buttons.OnePlayer.pick()
            if (this.buttons.TwoPlayer.isPicked()) this.buttons.TwoPlayer.pick()
            this.boardOrchestrator.gameType = "HC"
        } else if (code == 2) {
            if (this.buttons.OnePlayer.isPicked()) this.buttons.OnePlayer.pick()
            if (!this.buttons.TwoPlayer.isPicked()) this.buttons.TwoPlayer.pick()
            this.boardOrchestrator.gameType = "HH"
        }
        this.boardOrchestrator.originalGameType = this.boardOrchestrator.gameType.slice(0, 2)
    }
    /**
     * @brief Updates the Size of the Board
     * @param {number} code Code of Size 
     */
    updateSize(code) {
        if (code == 1) {
            if (!this.buttons.sixsixSize.isPicked()) this.buttons.sixsixSize.pick()
            if (this.buttons.sixnineSize.isPicked()) this.buttons.sixnineSize.pick()
            if (this.buttons.ninenineSize.isPicked()) this.buttons.ninenineSize.pick()
            this.boardOrchestrator.gameSize = 1
        } else if (code == 2) {
            if (this.buttons.sixsixSize.isPicked()) this.buttons.sixsixSize.pick()
            if (!this.buttons.sixnineSize.isPicked()) this.buttons.sixnineSize.pick()
            if (this.buttons.ninenineSize.isPicked()) this.buttons.ninenineSize.pick()
            this.boardOrchestrator.gameSize = 2
        } else if (code == 3) {
            if (this.buttons.sixsixSize.isPicked()) this.buttons.sixsixSize.pick()
            if (this.buttons.sixnineSize.isPicked()) this.buttons.sixnineSize.pick()
            if (!this.buttons.ninenineSize.isPicked()) this.buttons.ninenineSize.pick()
            this.boardOrchestrator.gameSize = 3
        }
    }
    /**
     * @brief Updates the Difficulty of the Bots
     * @param {number} code Code of Difficulty
     */
    updateDifficulty(code) {
        if (code == 1) {
            if (!this.buttons.easy.isPicked()) this.buttons.easy.pick()
            if (this.buttons.medium.isPicked()) this.buttons.medium.pick()
            this.boardOrchestrator.difficulty = 1
        } else if (code == 2) {
            if (this.buttons.easy.isPicked()) this.buttons.easy.pick()
            if (!this.buttons.medium.isPicked()) this.buttons.medium.pick()
            this.boardOrchestrator.difficulty = 2
        }
    }
    /**
     * @brief Updates the Movie Button
     */
    updatePlay() {
        if (this.buttons.play.getText() == "MOVIE") {
            this.buttons.play.changeMaterial("red")
            this.buttons.play.modifyText("PAUSE")
        } else {
            this.buttons.play.changeMaterial("green")
            this.buttons.play.modifyText("MOVIE")
        }

    }
    /**
     * @brief Makes the Movie Button Available/ Unavailable
     */
    makePlayAvailable() {
        this.buttons.play.toggleAvailability()
    }
    /**
     * @returns True if the Move button is available, false otherwise
     */
    isPlayAvailable() {
        return !this.buttons.play.unavailable
    }
    /**
     * @brief Updates the Timer
     * @param {number} time Time
     */
    updateTime(time) {
        if (this.startedGame) {
            this.time += time
            if (this.moveTime != null) {
                this.moveTime += ((time / 60) % 1 * 60)
                if (this.moveTime >= 40)
                    this.boardOrchestrator.gamestate.forceEndGame()
            }
            this.timer.modifyText(this.formatTime(this.time))

        }
    }
    /**
     * @brief Formats the Time
     * @param {number} time Time
     * @returns String with the formatted time
     */
    formatTime(time) {
        const str = (~~(time / 60) + "").padStart(2, '0') + ":" + (~~((time / 60) % 1 * 60) + "").padStart(2, '0')
        return str
    }
    /**
     * @brief Updates the ScoreBoard
     * @param {string} winner Winner
     */
    changeScoreBoard(winner) {
        if (winner == 'BLACKS')
            this.blackScore++
        if (winner == 'WHITES')
            this.whiteScore++
        this.score.modifyText("B " + JSON.stringify(this.blackScore) + "-" + JSON.stringify(this.whiteScore) + " W")
    }
    /**
     * @brief Resets the time
     */
    notifyInit() {
        this.time = 0
        this.startedGame = !this.startedGame
        this.moveTime = 0
    }
    /**
     * @brief Resets move timer, after a move is made or a turn is passed
     */
    resetMoveTime() {
        this.moveTime = 0
    }
    /**
     * @brief Disables move timer
     */
    disableMoveTime() {
        this.moveTime = null
    }
    /**
     * @brief Resets the menu
     */
    reset() {
        this.blackScore = 0
        this.whiteScore = 0
        this.startedGame = false;
        this.time = 0
    }
}