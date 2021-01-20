/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');

        this.initKeys();

        return true;
    }
    /**
     * Adds folder containing the ID's of the Views
     * Displays Views in dropdown menu
     * @param {string} id Id of camera
     * @param {Array} list List of cameras
     */
    addViews(id, list) {
        this.groupViews = this.gui.addFolder("Views");
        this.groupViews.open();

        this.groupViews.add(this.scene, id, list).name('Views').onChange(this.scene.updateView.bind(this.scene));
    }

    /**
     * Adds folder containing the ID's of the Lights
     * Displays Lights in checkboxes
     * @param {Array} list List of lights
     */
    addLights(list) {
        this.groupLights = this.gui.addFolder("Lights");
        this.groupLights.open();

        for (let id in list) {
            if (list.hasOwnProperty(id)) {
                this.scene.lightValues[id] = list[id][0];
                this.groupLights.add(this.scene.lightValues, id);
            }
        }
    }
    removeFolders(){
        this.gui.removeFolder(this.groupLights)
        this.gui.removeFolder(this.groupViews)
    }

    /**
     * Adds folder containing the ID's of the Lights
     * Displays Lights in checkboxes
     * @param {Array} list List of lights
     */
    addScenes(id,list) {
        const group = this.gui.addFolder("Theme");
        group.open();

        group.add(this.scene, id, list).name('Theme').onChange(this.scene.updateTheme.bind(this.scene));
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () {};
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}