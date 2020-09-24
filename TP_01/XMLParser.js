var DEGREE_TO_RADIANS = Math.PI / 180;

class XMLParser {
    constructor() {
        this.XMLreader= new CGFXMLreader();
        this.XMLreader.open('TP1_scenes_demo.xml',this);
    }
    onXMLError(message) {
        console.error("XML error - " + message);

    }
    onXMLReady() {
        console.log("XML read correctly");

        var root = this.XMLreader.xmlDoc.documentElement;
        var err = this.parseFile(root);
    }
    parseFile(root) {
        if(root.nodeName!="lsf")
            return "tag <lsf> missing";

        var children = root.childNodes;

        var childrenName = [];

        for (var i=0; i<children.length; i++){
            childrenName.push(children[i].nodeName);
        }

        var err;
        var index;

        if((index=childrenName.indexOf("initials"))==-1)
            return "tag <initials> missing";
        else {
            if((err=this.parseInitials(childNodes[index]))!=null)
                return err;
        }

        if((index=childrenName.indexOf("views"))==-1)
            return "tag <views> missing";
        else {
            if((err=this.parseViews(childNodes[index]))!=null)
                return err;
        }
    }
    parseInitials(initialsNode) {
        var children = initialsNode.childNodes;
        var childrenName = [];
        for (var i=0; i<children.length; i++){
            childrenName.push(children[i].nodeName);
        }

        this.referenceLength=0;

        var referenceIndex = childrenName.indexOf("reference");
        if(referenceIndex==-1)
            console.log("Reference length is undefined, assuming length=0");
        else {
            var length = this.XMLreader.getFloat(children[referenceIndex], 'length');

            if(length!=null) {
                if(isNaN(length))
                    console.log("Non numeric value for axis length, assuming length=0");
                else if (length<=0)
                    console.log("Reference length must not be negative, assuming length=0");
                else
                    this.referenceLength=length;
            }
            else
            console.log("Unable to parse reference length, assuming length=0");
        }
        
        this.rootNode ="";
        var rootIndex = childrenName.indexOf("root");
        if(rootIndex==-1){
            console.error("Root id is undefined");
            return 1;
        }
        else {
            var rootID = this.XMLreader.getString(children[rootIndex], 'id');

            if(rootID!=null) {
                if(!isNaN(rootID)){
                    console.error("Root id is undefined");
                    return 1;
                }
                else
                    this.rootNode=rootID;
            }
            else{
                console.error("Root id is undefined");
                return 1;
            }
        }

        console.log("Parsed initials");

        return null; 

    }
    parseViews(viewsNode) {
        var children = viewsNode.childNodes;
        var childrenName = [];
        for (var i=0; i<children.length; i++){
            childrenName.push(children[i].nodeName);
        }
        
        var referencenear = 0.1;
        var referencefar = 500;
        var referenceangle = 45;
        var referencepositionx = 30;
        var referencepositiony = 15;
        var referencepositionz = 30;
        var referencetargetx = 0;
        var referencetargety = -2;
        var referencetargetz = 0;

        if(childrenName.length==0){
            console.log("Undefined view, assuming default values");
            return null;
        }

        var perspective=null;

        var perspectiveIndex = childrenName.indexOf("perspective");
        if(perspectiveIndex==-1)
            console.log("Perspective is undefined");
        else {
            this.perspective=children[perspectiveIndex];

            var near = this.XMLreader.getFloat(perspective, 'near');
            var far = this.XMLreader.getFloat(perspective, 'far');
            var angle = this.XMLreader.getFloat(perspective, 'angle');

            var perspectiveChildren = perspective.childNodes
            var perspectiveChildrenNames = [];
            for (var i=0; i<perspectiveChildren.length; i++){
                perspectiveChildrenNames.push(perspectiveChildren[i].nodeName);
            }

            var positionIndex = perspectiveChildrenNames.indexOf("from");
            var targetIndex = perspectiveChildrenNames.indexOf("to");
            var positionx = null;
            var positiony = null;
            var positionz = null;
            var targetx = null;
            var targety = null;
            var targetz = null;
            if(positionIndex==-1 || targetIndex==-1)
                console.log(" Perspective Position/Target undefined, assuming default values");
            else{
                positionx = this.XMLreader.getFloat(perspectiveChildrenNames[positionIndex], 'x');
                positiony = this.XMLreader.getFloat(perspectiveChildrenNames[positionIndex], 'y');
                positionz = this.XMLreader.getFloat(perspectiveChildrenNames[positionIndex], 'z');

                targetx = this.XMLreader.getFloat(perspectiveChildrenNames[targetIndex], 'x');
                targety = this.XMLreader.getFloat(perspectiveChildrenNames[targetIndex], 'y');
                targetz = this.XMLreader.getFloat(perspectiveChildrenNames[targetIndex], 'z');
            }
            

            if(near!=null && far!=null && angle!=null && positionx!=null && positiony!=null && positionz!=null && targetx!=null && targety!=null && targetz!=null) {
                if(isNaN(near)||isNaN(far)||isNaN(angle) || isNaN(positionx)||isNaN(positiony)||isNaN(positionz) || isNaN(targetx)||isNaN(targety)||isNaN(targetz))
                    console.log("Non numeric value for near/far/angle/position/target, assuming default values 0.1/500/45/(30,15,30)/(0,-2,0)");
                else if (near<=0 || far<=0 || angle<=0)
                    console.log("Values must not be negative,assuming default values (0.1/500/45)");
                else{
                    referencenear=near;
                    referencefar=far;
                    referenceangle=angle;
                    referencepositionx = positionx;
                    referencepositiony = positiony;
                    referencepositionz = positionz;
                    referencetargetx = targetx;
                    referencetargety = targety;
                    referencetargetz = targetz;

                }
            }
            
        }
        this.perspectiveCamera = new CGFcamera(referenceangle*DEGREE_TO_RADIANS, referencenear, referencefar, vec3(positionx,positiony,positionz), vec3(targetx,targety,targetz));
        
        var referenceleft = -0.2;
        var referenceright = 0.2;
        var referencebottom = -0.2;
        var referencetop = 0.2;
        var referenceorthonear = 0.2;
        var referenceorthofar = 100;
        var referenceorthopositionx = 30;
        var referenceorthopositiony = 15;
        var referenceorthopositionz = 30;
        var referenceorthotargetx = 0;
        var referenceorthotargety = -2;
        var referenceorthotargetz = 0;
        var referenceupx = 0;
        var referenceupy = 1;
        var referenceupz = 0;

        var view_ortho=null;

        var orthoIndex = childrenName.indexOf("ortho");
        if(orthoIndex==-1)
            console.log("Ortho is undefined");
        else {
            var view_ortho=children[orthoIndex];

            var near = this.XMLreader.getFloat(view_ortho, 'near');
            var far = this.XMLreader.getFloat(view_ortho, 'far');
            var left = this.XMLreader.getFloat(view_ortho, 'left');
            var right = this.XMLreader.getFloat(view_ortho, 'right');
            var bottom = this.XMLreader.getFloat(view_ortho, 'bottom');
            var top = this.XMLreader.getFloat(view_ortho, 'top');

            var orthoChildren = view_ortho.childNodes
            var orthoChildrenNames = [];
            for (var i=0; i<orthoChildren.length; i++){
                orthoChildrenNames.push(orthoChildren[i].nodeName);
            }

            var positionIndex = orthoChildrenNames.indexOf("from");
            var targetIndex = orthoChildrenNames.indexOf("to");
            var upIndex = orthoChildrenNames.indexOf("up");;

            var positionx = null;
            var positiony = null;
            var positionz = null;
            var targetx = null;
            var targety = null;
            var targetz = null;
            var upx = null;
            var upy = null;
            var upz = null;

            if(positionIndex==-1 || targetIndex==-1)
                console.log(" Perspective Position/Target undefined, assuming default values");
            else{
                positionx = this.XMLreader.getFloat(perspectiveChildrenNames[positionIndex], 'x');
                positiony = this.XMLreader.getFloat(perspectiveChildrenNames[positionIndex], 'y');
                positionz = this.XMLreader.getFloat(perspectiveChildrenNames[positionIndex], 'z');

                targetx = this.XMLreader.getFloat(perspectiveChildrenNames[targetIndex], 'x');
                targety = this.XMLreader.getFloat(perspectiveChildrenNames[targetIndex], 'y');
                targetz = this.XMLreader.getFloat(perspectiveChildrenNames[targetIndex], 'z');

                if(upIndex==-1){
                    upx = this.XMLreader.getFloat(perspectiveChildrenNames[upIndex], 'x');
                    upy = this.XMLreader.getFloat(perspectiveChildrenNames[upIndex], 'y');
                    upz = this.XMLreader.getFloat(perspectiveChildrenNames[upIndex], 'z');
                    
                    referenceupx = upx;     
                    referenceupy = upy;                   
                    referenceupz = upz;        
                }
            }
            

            if(near!=null && far!=null && angle!=null && positionx!=null && positiony!=null && positionz!=null && targetx!=null && targety!=null && targetz!=null) {
                if(isNaN(near)||isNaN(far)||isNaN(angle) || isNaN(positionx)||isNaN(positiony)||isNaN(positionz) || isNaN(targetx)||isNaN(targety)||isNaN(targetz))
                    console.log("Non numeric value for near/far/angle/position/target, assuming default values 0.1/500/45/(30,15,30)/(0,-2,0)");
                else if (near<=0 || far<=0 || angle<=0)
                    console.log("Values must not be negative,assuming default values (0.1/500/45)");
                else{
                    referenceorthonear=near;
                    referenceorthofar=far;
                    referenceleft = left;
                    referenceright=right;
                    referencetop=top;
                    referencebottom=bottom;
                    referenceorthopositionx = positionx;
                    referenceorthopositiony = positiony;
                    referenceorthopositionz = positionz;
                    referenceorthotargetx = targetx;
                    referenceorthotargety = targety;
                    referenceorthotargetz = targetz;
                               

                }
            }
            
        }
        this.orthoCamera = new CGFcameraOrtho(referenceleft,referenceright,referencebottom,referencetop,referenceorthonear,referenceorthofar,vec3(referenceorthopositionx,referenceorthopositiony,referenceorthopositionz),vec3(referenceorthotargetx,referenceorthotargety,referenceorthotargetz),vec3(referenceupx,referenceupy,referenceupz));


        console.log("Parsed views");

        return null; 
    }
}