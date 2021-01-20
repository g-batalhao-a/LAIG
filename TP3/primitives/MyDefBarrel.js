/**
 * MyDefBarrel
 * @constructor
 * @param scene - Reference to MyScene object
 * @param npointsU - degree in U
 * @param npointsV - degree in V
 * @param slices - divisions in U
 * @param stacks - divisions in V
 * 
 */
class MyDefBarrel extends CGFobject {
	constructor(scene, base, middle, height, slices, stacks) {
        super(scene);
        this.base = base;
        this.middle = middle;
		this.height = height;
        this.slices = slices;
        this.stacks= stacks;
        this.initBuffers();
	}
	initBuffers() {
		const h = 4/3 * this.base;
		const H = 4/3 *(this.middle - this.base);
		

        let controlPoints = [	// U = P4
            [ // V = Q1, Q2, Q3, Q4
                [this.base ,0 ,0 , 1 ],
                [this.base + H ,0 , this.height/3 , 1 ],
                [this.base + H, 0, 2*this.height/3 , 1 ],
                [this.base ,0 ,this.height , 1]
            ],
            // U = P3
            [ // V = Q1, Q2, Q3, Q4
                [this.base ,h ,0 , 1 ],
                [this.base + H ,4/3*(this.base +H) , this.height/3 , 1 ],
                [this.base + H, 4/3*(this.base +H), 2*this.height/3 , 1 ],
                [this.base , h ,this.height , 1]
            ],
            // U = P2
            [ // V = Q1, Q2, Q3, Q4
                [-this.base ,h ,0 , 1 ],
                [-(this.base + H) ,4/3*(this.base +H) , this.height/3 , 1 ],
                [-(this.base + H), 4/3*(this.base +H), 2*this.height/3 , 1 ],
                [-this.base ,h ,this.height , 1]
           ],
            // U = P1
            [ // V = Q1, Q2, Q3, Q4
                [-this.base ,0 ,0 , 1 ],
                [-(this.base + H),0 , this.height/3 , 1 ],
                [-(this.base + H), 0, 2*this.height/3 , 1 ],
                [-(this.base) ,0 ,this.height , 1]
            ]
            
        ]; 
       
        let nurbSurface = new CGFnurbsSurface(3,3,controlPoints);
        this.obj = new CGFnurbsObject(this.scene,this.stacks,this.slices,nurbSurface);
    }

    display() {
        this.obj.display();
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.obj.display();
        this.scene.popMatrix();
    }
	
}
