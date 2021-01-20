/*
 * MySpritesheet
 */
class MySpritesheet {
    constructor(scene, texture, sizeM, sizeN) {
        this.scene=scene;
        this.texture=texture;
        this.sizeM=sizeM;
        this.sizeN=sizeN;
        this.offsetM=1.0/sizeM;
        this.offsetN=1.0/sizeN;
        
    }
    setActive(){
        this.scene.setActiveShaderSimple(this.scene.shader);
        this.texture.bind(0);
        this.scene.shader.setUniformsValues({offsetM: this.offsetM});
        this.scene.shader.setUniformsValues({offsetN: this.offsetN});
    }
    deactivate() {
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }
    activateCellMN(m,n) {
        this.scene.shader.setUniformsValues({M: m});
        this.scene.shader.setUniformsValues({N: n});
    }
    activateCellP(p) {
        // p%sizeM -> column ; p/sizeM -> row
        this.activateCellMN(p%this.sizeM,Math.floor(p/this.sizeM));
    }
}