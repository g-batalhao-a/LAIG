/*
 * MySpriteAnimation
 */
class MySpriteAnimation {
    constructor(spritesheet,duration,startCell,endCell) {
        this.spritesheet=spritesheet;
        this.duration=duration;
        this.startCell=startCell;
        this.endCell=endCell;

        this.currCell=startCell;
        this.interval = duration/(endCell-startCell+1);
        this.elapsedTime=0;
        this.shape=new MyRectangle(this.spritesheet.scene,0,0,1,1);

    }
    update(delta) {
        if(this.currCell==this.endCell) this.currCell=this.startCell;
        if(this.elapsedTime>=this.interval)  {
            let nextFrame = Math.floor((this.elapsedTime)/this.interval);
            this.currCell = this.currCell+nextFrame;
            this.elapsedTime=0;
        }
        if(this.currCell>=this.endCell+1)
            this.currCell=this.currCell-this.endCell;
        
        this.elapsedTime+=delta;
    }
    display(){
        this.spritesheet.setActive();
        this.spritesheet.activateCellP(this.currCell);
        this.shape.display();
        this.spritesheet.deactivate();
    }
}