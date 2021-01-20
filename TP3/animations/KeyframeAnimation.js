/**
 * KeyframeAnimation
 * @brief Class that creates Animations based on frames
 */
class KeyframeAnimation{
    /**
     * @method constructor
     * @param keyframes Animations keyframes
     */
    constructor(keyframes) {
        this.keyframes=keyframes;
        this.start=this.keyframes[0].instant;
        this.frame=1;
        this.elapsedTime=0;
        this.finished=false;
        this.anims = [];
        if(this.keyframes.length===1)
            this.activeAnimation = new MyAnimation(this.keyframes[this.frame-1].instant,this.keyframes[this.frame-1].instant,this.keyframes[this.frame-1].transformations,this.keyframes[this.frame-1].transformations);
        else {
            for(let i=1;i<this.keyframes.length;i++) {
                if(i===1)
                    this.anims.push(new MyAnimation(this.keyframes[i-1].instant,this.keyframes[i].instant,this.keyframes[i-1].transformations,this.keyframes[i].transformations));
                else
                this.anims.push(new MyAnimation(0,this.keyframes[i].instant-this.keyframes[i-1].instant,this.keyframes[i-1].transformations,this.keyframes[i].transformations));
            }
            this.activeAnimation = this.anims[this.frame-1];
        }
            

    }
    /**
     * @brief Updates the current animation
     * @param {number} delta 
     */
    update(delta) {
        if(this.keyframes.length===1) {
            this.activeAnimation.update(delta);
            this.elapsedTime+=delta;
            return;
        }

        if(this.frame===this.keyframes.length) {
            return;
        }

        this.activeAnimation.update(delta);

        if(this.elapsedTime>this.keyframes[this.frame].instant)  {

            if(this.activeAnimation.isFinished()) {
                this.frame++;
                if(this.frame===this.keyframes.length) {
                    this.finished=true;
                    return;
                }
                this.activeAnimation = this.anims[this.frame-1];
                this.activeAnimation.update(delta);
            }
                        
        }
        this.elapsedTime+=delta;


    }
    /**
     * @brief Apllies the current animation
     * @param {Object} scene 
     */
    apply(scene) {
        this.activeAnimation.apply(scene);
    }
    /**
     * @returns True if the keyframe animation has finished, false otherwise
     */
    isFinished() {
        return this.finished;
    }
    /**
     * @returns The length of the keyframes array
     */
    getLength() {
        return this.keyframes.length;
    }
    /**
     * @brief Resets all of the animations
     */
    resetAnimation(){
        this.frame=1;
        this.elapsedTime=0;
        this.finished=false;
        this.anims.forEach(animation => {
            animation.resetAnimation()
        })
        this.activeAnimation = this.anims[this.frame-1];
    }


}