/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();
        this.interface = myinterface;
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.axis = new CGFaxis(this);
        this.displayAxis = false;

        this.setUpdatePeriod(1000.0/60.0);
        this.setPickEnabled(true);

        this.loadingProgressObject = new MyRectangle(this, -1, -.1, 1, .1);

        this.loadingProgress = 0;

        this.defaultAppearance = new CGFappearance(this);       
        this.textTexture=new CGFtexture(this,"scenes/images/font.png")
        this.shader=new CGFshader(this.gl,'shaders/text.vert','shaders/text.frag');
        this.boardOrchestrator = new MyBoardOrchestrator(this);
        this.graphs={}
        this.graphNumber=3
        this.graphCount=0
    }
    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(50*Math.PI/180.0, 0.1, 300, vec3.fromValues(6, 5, 5), vec3.fromValues(6, -4.45, -12.5));

    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break; // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }
    disableLights(){
        let i = 0;
        for(let key in this.graph.lights) {
            if(i>=8)break
            if(this.graph.lights.hasOwnProperty(key)){
                //this.graph.lights[key][0]=false
                this.lights[i].disable();
            }
            this.lights[i].update()
            i++
        }
        
    }

    updateView() {
        /* if (this.currentView === "default") {
             this.initCameras()
         } else {
             this.camera = this.graph.views[this.currentView]
         }
        this.interface.setActiveCamera(this.camera)*/
        this.boardOrchestrator.animatedCamera.changeView(this.currentView)
    }

    updateTheme() {
        this.disableLights()
        this.interface.removeFolders();
        this.graph = this.graphs[this.currentTheme]
        this.gl.clearColor(...this.graph.background);
        this.setGlobalAmbientLight(...this.graph.ambient);
        this.initLights();
        this.interface.addLights(this.graph.lights);
        this.interface.addViews("currentView", this.graph.viewsIDS);
        this.boardOrchestrator.changeTheme(this.graph)
        
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded(filename) {
        this.graph = this.graphs[filename]
        if(this.graphCount==this.graphNumber) this.onThemesLoaded()
        
    }
    onThemesLoaded(){
        this.currentTheme = Object.keys(this.graphs)[0]
        this.boardOrchestrator.init()
        this.axis = new CGFaxis(this, this.graph.referenceLength);
        this.displayAxis = this.graph.referenceEnable;
        this.currentView = this.graph.defaultCameraID;
        this.gl.clearColor(...this.graph.background);
        
        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        this.interface.addLights(this.graph.lights);
        this.interface.addViews("currentView", this.graph.viewsIDS);
        this.interface.addScenes("currentTheme",Object.keys(this.graphs));
        this.sceneInited = true;
        this.interface.setActiveCamera(null)
        this.updateTheme()
    }
    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup
        
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();
        
        this.pushMatrix();

        if (this.sceneInited) {
            this.boardOrchestrator.handlePicking(this.pickMode,this.pickResults);
		    this.clearPickRegistration();
            // Draw axis
            if (this.displayAxis)
                this.axis.display();

            this.defaultAppearance.apply();
            let i = 0;
            for (let id in this.lightValues) {
                if (this.lightValues.hasOwnProperty(id)) {
                    if (this.lightValues[id]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    } else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }
            // Displays the scene (MySceneGraph function).
            this.boardOrchestrator.display();
            
        } else {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress / 10.0, 0, 0, 1);

            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
    update(t) {
        if(!this.time) {
            this.time = t /1000 % 1000;
            return;
        }

        let delta = (t/1000 % 1000) - this.time;
        this.time = t /1000 % 1000;
        if(this.sceneInited){
            for(let [id,animation] of this.graph.animations) {
                animation.update(delta);
            }
            for(let spriteanim of this.graph.spriteanim) {
                spriteanim.update(delta);
            }
            this.boardOrchestrator.update(delta);
        }
        
    }
}