/**
 * MyAnimation
 * @constructor
 */
class KeyframeAnimation{
    /**
     * @method constructor
     * @param keyframes keyframes
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
                    return;
                }
                this.activeAnimation = this.anims[this.frame-1];
                this.activeAnimation.update(delta);
            }
                        
        }
        this.elapsedTime+=delta;


    }
    apply(scene) {
        this.activeAnimation.apply(scene);
    }
    isFinished() {
        return this.finished;
    }
    getLength() {
        return this.keyframes.length;
    }


}