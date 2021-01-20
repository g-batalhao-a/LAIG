/**
 * MyAnimation
 * @constructor
 */
class MyAnimation {
    /**
     * @method constructor
     * @param start start
     * @param end   end
     * @param start_trans transformations of start
     * @param end_trans transformations of end
     */
    constructor(start,end,start_trans,end_trans) {
        this.start=start;
        this.end=end;
        this.start_trans=start_trans;
        this.end_trans=end_trans;
        this.elapsedTime=0;
        this.finished=false;
        this.start_translation = [
            this.start_trans[0].x,
            this.start_trans[0].y,
            this.start_trans[0].z
        ];
        this.start_rotation = [
            this.start_trans[1].angle,
            this.start_trans[2].angle,
            this.start_trans[3].angle,
        ];
        this.start_scale = [
            this.start_trans[4].sx,
            this.start_trans[4].sy,
            this.start_trans[4].sz,
        ];
        this.end_translation = [
            this.end_trans[0].x,
            this.end_trans[0].y,
            this.end_trans[0].z
        ];
        this.end_rotation = [
            this.end_trans[1].angle,
            this.end_trans[2].angle,
            this.end_trans[3].angle,
        ];
        this.end_scale = [
            this.end_trans[4].sx,
            this.end_trans[4].sy,
            this.end_trans[4].sz,
        ];

        this.current_translation = vec3.create();
        this.current_rotation = vec3.create();
        this.current_scale = vec3.create();

    }
    update(delta) {
        
        
        if(this.elapsedTime>=this.start && !this.finished)  {
            let percent = this.elapsedTime/this.end;
            if(percent>=1) {
                this.finished=true;
                percent=1;
            }
            vec3.lerp(this.current_translation,this.start_translation,this.end_translation,percent);
            vec3.lerp(this.current_rotation,this.start_rotation,this.end_rotation,percent);
            vec3.lerp(this.current_scale,this.start_scale,this.end_scale,percent);
        }

        this.elapsedTime+=delta;


    }
    apply(scene) {
        const animationMatrix = mat4.create();
        mat4.translate(animationMatrix, animationMatrix, this.current_translation);
            
        mat4.rotate(animationMatrix, animationMatrix, this.current_rotation[0], [1, 0, 0]);
        mat4.rotate(animationMatrix, animationMatrix, this.current_rotation[1], [0, 1, 0]);
        mat4.rotate(animationMatrix, animationMatrix, this.current_rotation[2], [0, 0, 1]);
        mat4.scale(animationMatrix, animationMatrix, this.current_scale);
        scene.multMatrix(animationMatrix);
    }
    isFinished() {
        return this.finished;
    }

}