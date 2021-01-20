/**
 * CameraAnimation
 * @brief Class that animates the scene's camera
 */
class CameraAnimation {
    /**
     * @method constructor
     * @param scene scene
     * @param orchestrator the board orchestrator
     */
    constructor(scene,orchestrator) {
        this.scene=scene
        this.orchestrator=orchestrator
        this.animationTime=3;
        this.elapsedTime=0;
        this.angle=0;
        this.active=false;
        this.switchCams=false
    }
    /**
     * @brief Signals a change of positions between the current camera and a new camera of the scene
     * @param {string} newCam The camera's name
     */
    changeView(newCam){
        this.name=newCam
        this.active=true
        this.switchCams=true
        this.reset()
        
        this.translation = [...this.scene.camera.position]
        this.translationVector = [
            this.scene.graph.views[newCam].position[0] - this.scene.camera.position[0],
            this.scene.graph.views[newCam].position[1]- this.scene.camera.position[1],
            this.scene.graph.views[newCam].position[2] - this.scene.camera.position[2],
        ]
        this.rotation = [...this.scene.camera.target]
        this.rotationVector = [
            this.scene.graph.views[newCam].target[0] - this.scene.camera.target[0],
            this.scene.graph.views[newCam].target[1] - this.scene.camera.target[1],
            this.scene.graph.views[newCam].target[2] - this.scene.camera.target[2],
        ]
    }
    /**
     * @brief Updates the camera animation 
     * @param {number} delta Time 
     */
    update(delta) {
        if(!this.active)return
        if(this.elapsedTime>=this.animationTime && this.active) {
            this.orchestrator.gamestate.receiveResponse("camera")
            this.active=false
        }
        if(this.active){
            let animProgress = (this.elapsedTime)/(this.animationTime)
            let easeInOutQuint =  easeInOutQuart(animProgress)
            if(!this.switchCams){
                let ang = Math.PI *easeInOutQuint
                let angleIncrement = ang-this.angle
                this.angle+=angleIncrement
                this.scene.camera.orbit(CGFcameraAxis.Z,angleIncrement)
            }
            else{
                const x = this.translation[0]+this.translationVector[0]*easeInOutQuint
                const y = this.translation[1]+this.translationVector[1]*easeInOutQuint
                const z = this.translation[2]+this.translationVector[2]*easeInOutQuint
                const rx = this.rotation[0]+this.rotationVector[0]*easeInOutQuint
                const ry = this.rotation[1]+this.rotationVector[1]*easeInOutQuint
                const rz = this.rotation[2]+this.rotationVector[2]*easeInOutQuint
                
                this.scene.camera.setPosition([x,y,z])
                this.scene.camera.setTarget([rx,ry,rz])
            }
            this.elapsedTime+=delta
        }
        
    }
    /**
     * @brief Resets the camera's values
     */
    reset(){
        this.elapsedTime=0
        this.angle=0
    }
    /**
     * @brief Activates the camera and resets the values
     */
    setActive(){
        this.active=true
        this.reset()
    }
    /**
     * @brief Deactivates the camera
     */
    deactivate(){
        this.active=false
        this.switchCams=false
    }
    /**
     * @return Returns true if there was a switch between camera positions
     */
    switchedCams(){
        return this.switchCams
    }

}