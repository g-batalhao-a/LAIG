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

        if((index=childrenName.indexOf("illumination"))==-1)
            return "tag <illumination> missing";
        else {
            if((err=this.parseIllumination(childNodes[index]))!=null)
                return err;
        }

        if((index=childrenName.indexOf("lights"))==-1)
            return "tag <lights> missing";
        else {
            if((err=this.parseLights(childNodes[index]))!=null)
                return err;
        }

        if((index=childrenName.indexOf("textures"))==-1)
            return "tag <textures> missing";
        else {
            if((err=this.parseTextures(childNodes[index]))!=null)
                return err;
        }

        if((index=childrenName.indexOf("materials"))==-1)
            return "tag <materials> missing";
        else {
            if((err=this.parseMaterials(childNodes[index]))!=null)
                return err;
        }

        if((index=childrenName.indexOf("nodes"))==-1)
            return "tag <nodes> missing";
        else {
            if((err=this.parseObjetcs(childNodes[index]))!=null)
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
            return "Root id is undefined";
        }
        else {
            var rootID = this.XMLreader.getString(children[rootIndex], 'id');

            if(rootID!=null) {
                if(!isNaN(rootID)){
                    return "Root id is undefined";
                }
                else
                    this.rootNode=rootID;
            }
            else{
                return "Root id is undefined";
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
        this.perspectiveCamera = new CGFcamera(referenceangle*DEGREE_TO_RADIANS, referencenear, referencefar, vec3(referencepositionx,referencepositiony,referencepositionz),
         vec3(referencetargetx,referencetargety,referencetargetz));
        
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
        this.orthoCamera = new CGFcameraOrtho(referenceleft,referenceright,referencebottom,referencetop,referenceorthonear,referenceorthofar,
        vec3(referenceorthopositionx,referenceorthopositiony,referenceorthopositionz),vec3(referenceorthotargetx,referenceorthotargety,referenceorthotargetz),
        vec3(referenceupx,referenceupy,referenceupz));


        console.log("Parsed views");

        return null; 
    }
    parseIllumination(illuminationNode) {
        var children = illuminationNode.childNodes;
        var childrenName = [];
        for (var i=0; i<children.length; i++){
            childrenName.push(children[i].nodeName);
        }

        this.ambientIllumination = [0,0,0,1];

        var ambientIndex = childrenName.indexOf("ambient");
        if(ambientIndex==-1)
            console.log("Ambient is undefined, assuming default values 0/0/0/1");
        else {

            var r = this.XMLreader.getFloat(children[ambientIndex], 'r');
            var g = this.XMLreader.getFloat(children[ambientIndex], 'g');
            var b = this.XMLreader.getFloat(children[ambientIndex], 'b');
            var a = this.XMLreader.getFloat(children[ambientIndex], 'a');

            if(r!=null && g!=null && b!=null && a!=null) {
                if(isNaN(r)||isNaN(g)||isNaN(b) || isNaN(a))
                    console.log("Non numeric value for r/g/b/a, assuming default values 0/0/0/1");
                else if (r<0 || g<0 || b<0 || a<0 || r>1 || g>1 || b>1 || a>1)
                    console.log("Values must not be negative ,assuming default values 0/0/0/1");
                else{
                    ambientIllumination[0]=r;
                    ambientIllumination[1]=g;
                    ambientIllumination[2]=b;
                    ambientIllumination[3]=a;

                }
            }
            
        }

        this.backgroundIllumination = [0,0,0,1];

        var backgroundIndex = childrenName.indexOf("background");
        if(backgroundIndex==-1)
            console.log("Background is undefined, assuming default values 0/0/0/1");
        else {

            var r = this.XMLreader.getFloat(children[backgroundIndex], 'r');
            var g = this.XMLreader.getFloat(children[backgroundIndex], 'g');
            var b = this.XMLreader.getFloat(children[backgroundIndex], 'b');
            var a = this.XMLreader.getFloat(children[backgroundIndex], 'a');

            if(r!=null && g!=null && b!=null && a!=null) {
                if(isNaN(r)||isNaN(g)||isNaN(b) || isNaN(a))
                    console.log("Non numeric value for r/g/b/a, assuming default values 0/0/0/1");
                else if (r<0 || g<0 || b<0 || a<0 || r>1 || g>1 || b>1 || a>1)
                    console.log("Values must not be negative ,assuming default values 0/0/0/1");
                else{
                    backgroundIllumination[0]=r;
                    backgroundIllumination[1]=g;
                    backgroundIllumination[2]=b;
                    backgroundIllumination[3]=a;

                }
            }
            
        }
        console.log("Parsed illumination");

        return null;
    }
    parseLights(lightsNode) {
        var children = lightsNode.childNodes;
        var childrenName = [];
        var grandChildrenNodes=[];
        var grandChildrenNodeNames=[];

        this.lights=[];
        var numLights=0;
        for (var i=0; i<children.length; i++){

            var lightID = this.XMLreader.getString(children[i], 'id');
            if(lightID==null)
                return "No ID defined";
            
            if(this.childrenName.includes(lightID))
                return "ID's not unique";

            childrenName.push(lightID);

            grandChildrenNodes = children[i].childNodes;
            for(var j=0;j<grandChildrenNodes.length;j++) {
                grandChildrenNodeNames.push(grandChildrenNodes[j].nodeName);
            }

            var enableIndex = grandChildrenNodeNames.indexOf("enable");
            var positionIndex = grandChildrenNodeNames.indexOf("position");
            var ambientIndex = grandChildrenNodeNames.indexOf("ambient");
            var diffuseIndex = grandChildrenNodeNames.indexOf("diffuse");
            var specularIndex = grandChildrenNodeNames.indexOf("specular");

            var referenceEnable = true;
            var referencePosition = [10,12,9.5,1.0];
            var referenceAmbient = [0.0,0.0,0.0,1.0];
            var referenceDiffuse = [1.0,1.0,1.0,1.0];
            var referenceSpecular = [1.0,1.0,1.0,1.0];

            if(enableIndex == -1 || positionIndex == -1 || ambientIndex ==-1 || diffuseIndex ==-1 || specularIndex==-1)
                console.log("Missing nodes, assuming default values for light");
            else {
                var enable = this.XMLreader.getFloat(grandChildrenNodes[enableIndex], 'value');
                var x_pos = this.XMLreader.getFloat(grandChildrenNodes[positionIndex], 'x');
                var y_pos = this.XMLreader.getFloat(grandChildrenNodes[positionIndex], 'y');
                var z_pos = this.XMLreader.getFloat(grandChildrenNodes[positionIndex], 'z');
                var w_pos = this.XMLreader.getFloat(grandChildrenNodes[positionIndex], 'w');
                var r_amb = this.XMLreader.getFloat(grandChildrenNodes[ambientIndex], 'r');
                var g_amb = this.XMLreader.getFloat(grandChildrenNodes[ambientIndex], 'g');
                var b_amb = this.XMLreader.getFloat(grandChildrenNodes[ambientIndex], 'b');
                var a_amb = this.XMLreader.getFloat(grandChildrenNodes[ambientIndex], 'a');
                var r_dif = this.XMLreader.getFloat(grandChildrenNodes[diffuseIndex], 'r');
                var g_dif = this.XMLreader.getFloat(grandChildrenNodes[diffuseIndex], 'g');
                var b_dif = this.XMLreader.getFloat(grandChildrenNodes[diffuseIndex], 'b');
                var a_dif = this.XMLreader.getFloat(grandChildrenNodes[diffuseIndex], 'a');
                var r_spe = this.XMLreader.getFloat(grandChildrenNodes[specularIndex], 'r');
                var g_spe = this.XMLreader.getFloat(grandChildrenNodes[specularIndex], 'g');
                var b_spe = this.XMLreader.getFloat(grandChildrenNodes[specularIndex], 'b');
                var a_spe = this.XMLreader.getFloat(grandChildrenNodes[specularIndex], 'a');

                if(enable!=null && x_pos!=null && y_pos!=null && z_pos!=null && w_pos!=null && r_amb!=null && g_amb!=null && b_amb!=null && a_amb!=null && 
                    r_dif!=null && g_dif!=null && b_dif!=null && a_dif!=null&& r_spe!=null && g_spe!=null && b_spe!=null && a_spe!=null) {
                    if(isNan(enable)||isNaN(x_pos)||isNaN(y_pos)||isNaN(z_pos)||isNaN(w_pos)||isNaN(r_amb)||isNaN(g_amb)||isNaN(b_amb)||isNaN(a_amb)
                    ||isNaN(r_dif)||isNaN(g_dif)||isNaN(b_dif)||isNaN(a_dif)||isNaN(r_spe)||isNaN(g_spe)||isNaN(b_spe) || isNaN(a_spe))
                        console.log("Non numeric values, assuming default values");
                    else if (r_amb>1 || g_amb>1 || b_amb>1 || a_amb>1 || r_amb<0 || g_amb<0 || b_amb<0 || a_amb<0 || r_amb>1 || g_amb>1 || b_amb>1 || a_amb>1 || r_amb<0 || g_amb<0 ||
                        b_amb<0 || a_amb<0 || r_spe>1 || g_spe>1 || b_spe>1 || a_spe>1 || r_spe<0 || g_spe<0 || b_spe<0 || a_spe<0 || r_spe>1 || g_spe>1 || b_spe>1 || a_spe>1)
                        console.log("Values must not be negative, assuming default");
                    else{
                        referenceEnable = enable == 0 ? false : true;
                        referencePosition[0]=x_pos;
                        referencePosition[1]=y_pos;
                        referencePosition[2]=z_pos;
                        referencePosition[3]=w_pos;
                        referenceAmbient[0]=r_amb;
                        referenceAmbient[1]=g_amb;
                        referenceAmbient[2]=b_amb;
                        referenceAmbient[3]=a_amb;
                        referenceDiffuse[0]=r_dif;
                        referenceDiffuse[1]=g_dif;
                        referenceDiffuse[2]=b_dif;
                        referenceDiffuse[3]=a_dif;
                        referenceSpecular[0]=r_spe;
                        referenceSpecular[1]=g_spe;
                        referenceSpecular[2]=b_spe;
                        referenceSpecular[3]=a_spe;
    
                    }

                }

            }
            
            this.lights[i]=[referenceEnable,referencePosition,referenceAmbient,referenceDiffuse,referenceSpecular];
            numLights++;
        }
        if(numLights==0)
            return "0 lights defined (minimum 1)";
        else if(numLights>8)
            return "Exceeded lights limit (8 max)";
        
        console.log("Parsed lights");
        return null;
    }
    parseTextures(texturesNode) {
        var children = texturesNode.childNodes;
        var childrenName = [];
        this.textures=[];
        var numTextures=0;

        for(var i=0;i<children.length;i++) {
            if(children[i].nodeName != "texture"){
                console.log("Wrongly named node");
                continue;
            }
            var textureID = this.XMLreader.getString(children[i],'id');
            if(textureID==null)
                return "No texture ID defined"
            if(childrenName.includes(textureID)) {
                return "Texture ID' i's not unique";
            }
            childrenName.push(textureID);
            this.textures[textureID]=this.XMLreader.getString(children[i],'path');
            numTextures++;
        }

        if(numTextures==0)
            console.log("No textures defined");
        
        console.log("Parsed textures");
        return null;

    }
    parseMaterials(materialsNode) {
        var children = materialsNode.childNodes;
        var childrenName = [];
        var grandChildrenNodes=[];
        var grandChildrenNodeNames=[];

        this.materials=[];
        var numMaterials=0;
        for (var i=0; i<children.length; i++){

            var materialID = this.XMLreader.getString(children[i], 'id');
            if(materialID==null)
                return "No material ID defined";
            
            if(this.childrenName.includes(materialID))
                return "Material ID's not unique";

            childrenName.push(materialID);

            grandChildrenNodes = children[i].childNodes;
            for(var j=0;j<grandChildrenNodes.length;j++) {
                grandChildrenNodeNames.push(grandChildrenNodes[j].nodeName);
            }

            var shininessIndex = grandChildrenNodeNames.indexOf("shininess");
            var emissiveIndex = grandChildrenNodeNames.indexOf("emissive");
            var ambientIndex = grandChildrenNodeNames.indexOf("ambient");
            var diffuseIndex = grandChildrenNodeNames.indexOf("diffuse");
            var specularIndex = grandChildrenNodeNames.indexOf("specular");

            var referenceShininess = 0.0;
            var referenceEmissive = [0.0,0.0,0.0,1.0];
            var referenceAmbient = [1.0,0.0,0.0,1.0];
            var referenceDiffuse = [0.6,0.0,0.0,1.0];
            var referenceSpecular = [0.6,0.0,0.0,1.0];

            if(shininessIndex == -1 || emissiveIndex == -1 || ambientIndex ==-1 || diffuseIndex ==-1 || specularIndex==-1)
                console.log("Missing nodes, assuming default values for material");
            else {
                var shininess = this.XMLreader.getFloat(grandChildrenNodes[shininessIndex], 'value');
                var r_emi = this.XMLreader.getFloat(grandChildrenNodes[emissiveIndex], 'r');
                var g_emi = this.XMLreader.getFloat(grandChildrenNodes[emissiveIndex], 'g');
                var b_emi = this.XMLreader.getFloat(grandChildrenNodes[emissiveIndex], 'b');
                var a_emi = this.XMLreader.getFloat(grandChildrenNodes[emissiveIndex], 'a');
                var r_amb = this.XMLreader.getFloat(grandChildrenNodes[ambientIndex], 'r');
                var g_amb = this.XMLreader.getFloat(grandChildrenNodes[ambientIndex], 'g');
                var b_amb = this.XMLreader.getFloat(grandChildrenNodes[ambientIndex], 'b');
                var a_amb = this.XMLreader.getFloat(grandChildrenNodes[ambientIndex], 'a');
                var r_dif = this.XMLreader.getFloat(grandChildrenNodes[diffuseIndex], 'r');
                var g_dif = this.XMLreader.getFloat(grandChildrenNodes[diffuseIndex], 'g');
                var b_dif = this.XMLreader.getFloat(grandChildrenNodes[diffuseIndex], 'b');
                var a_dif = this.XMLreader.getFloat(grandChildrenNodes[diffuseIndex], 'a');
                var r_spe = this.XMLreader.getFloat(grandChildrenNodes[specularIndex], 'r');
                var g_spe = this.XMLreader.getFloat(grandChildrenNodes[specularIndex], 'g');
                var b_spe = this.XMLreader.getFloat(grandChildrenNodes[specularIndex], 'b');
                var a_spe = this.XMLreader.getFloat(grandChildrenNodes[specularIndex], 'a');

                if(shininess!=null && r_emi!=null && g_emi!=null && b_emi!=null && a_emi!=null && r_amb!=null && g_amb!=null && b_amb!=null && a_amb!=null && 
                    r_dif!=null && g_dif!=null && b_dif!=null && a_dif!=null&& r_spe!=null && g_spe!=null && b_spe!=null && a_spe!=null) {
                    if(isNan(shininess)||isNaN(r_emi)||isNaN(g_emi)||isNaN(b_emi)||isNaN(a_emi)||isNaN(r_amb)||isNaN(g_amb)||isNaN(b_amb)||isNaN(a_amb)
                    ||isNaN(r_dif)||isNaN(g_dif)||isNaN(b_dif)||isNaN(a_dif)||isNaN(r_spe)||isNaN(g_spe)||isNaN(b_spe) || isNaN(a_spe))
                        console.log("Non numeric values, assuming default values");
                    else if (shininess<0 || r_emi>1 || g_emi>1 || b_emi>1 || a_emi>1 || r_emi<0 || g_emi<0 || b_emi<0 || a_emi<0 || r_amb>1 || g_amb>1 || b_amb>1 || a_amb>1 || r_amb<0 
                        || g_amb<0 || b_amb<0 || a_amb<0 || r_amb>1 || g_amb>1 || b_amb>1 || a_amb>1 || r_amb<0 || g_amb<0 || b_amb<0 || a_amb<0 || r_spe>1 || g_spe>1 || 
                        b_spe>1 || a_spe>1 || r_spe<0 || g_spe<0 || b_spe<0 || a_spe<0 || r_spe>1 || g_spe>1 || b_spe>1 || a_spe>1)
                        console.log("Values must not be negative, assuming default");
                    else{
                        referenceShininess = shininess;
                        referenceEmissive[0]=r_emi;
                        referenceEmissive[1]=g_emi;
                        referenceEmissive[2]=b_emi;
                        referenceEmissive[3]=a_emi;
                        referenceAmbient[0]=r_amb;
                        referenceAmbient[1]=g_amb;
                        referenceAmbient[2]=b_amb;
                        referenceAmbient[3]=a_amb;
                        referenceDiffuse[0]=r_dif;
                        referenceDiffuse[1]=g_dif;
                        referenceDiffuse[2]=b_dif;
                        referenceDiffuse[3]=a_dif;
                        referenceSpecular[0]=r_spe;
                        referenceSpecular[1]=g_spe;
                        referenceSpecular[2]=b_spe;
                        referenceSpecular[3]=a_spe;
    
                    }

                }

            }
            
            this.materials[materialID]=[referenceShininess,referenceAmbient,referenceDiffuse,referenceSpecular,referenceEmissive];
            numMaterials++;
        }
        if(numMaterials==0)
            return "0 materials defined (minimum 1)";
        
        console.log("Parsed materials");
        return null;
    }
    parseObjetcs(nodeObjects) {
        var children = nodeObjects.childNodes;
        var childrenName = [];
        var grandChildrenNodes=[];
        var grandChildrenNodeNames=[];

        this.nodes=[];
        var rootNodeID;

        for(var i=0;i<children.length;i++) {
            if(children[i].nodeName != "node"){
                console.log("Wrongly named node");
                continue;
            }
            var nodeID = this.XMLreader.getString(children[i],'id');
            if(nodeID==null)
                return "No node ID defined";

            if(nodeID==this.rootNode){
                if(rootNodeID!=null)
                    return "Non unique root ID";
                rootNodeID=nodeID;
            }
            else{
                if(childrenName.includes(nodeID)) {
                    return "Node ID's not unique";
                }
            }
            
            childrenName.push(nodeID);
            grandChildrenNodes=children[i].childNodes;
            for(var j=0;j<grandChildrenNodes.length;j++) {
                grandChildrenNodeNames.push(grandChildrenNodes[j].nodeName);
            }

            var materialIndex = grandChildrenNodeNames.indexOf("material");
            var textureIndex = grandChildrenNodeNames.indexOf("texture");
            var transformationsIndex = grandChildrenNodeNames.indexOf("transformations");
            var descendantsIndex = grandChildrenNodeNames.indexOf("descendants");

            if(materialIndex==-1 || textureIndex==-1)
                return "No material/texture declared";

            var materialID = this.XMLreader.getString(grandChildrenNodes[materialIndex],'id');
            var textureID = this.XMLreader.getString(grandChildrenNodes[textureIndex],'id');

            if(materialID==null || textureID==null)
                return "Undeclared material/texture ID";
            
            if((this.materials[materialID]==null && materialID=="null") || (this.textures[textureID]==null && materialID=="null"))
                return "No matching material/texture";
            
            var textureChildren = grandChildrenNodes[textureIndex].childNodes;
            var textureChildrenNames = [];
            for(var j=0;j<textureChildren.length;j++) {
                textureChildrenNames.push(textureChildren[j].nodeName);
            }
            var amplificationIndex = textureChildrenNames.indexOf("amplification");
            if(amplificationIndex==null)
                return "No texture amplification";
            
            var afs = this.XMLreader.getFloat(textureChildren[amplificationIndex],'afs');
            var aft = this.XMLreader.getFloat(textureChildren[amplificationIndex],'aft');

            if(isNaN(afs)||isNaN(aft))
                return "Non numerical values for afs/aft";
            else if(afs<0.0 || aft<0.0)
                return "Negative values for aft/afs";
            
            var transformations = [];

            var transformationsNode = grandChildrenNodes[transformationsIndex].childNodes;
            for(var j=0;j<transformationsNode;j++) {
                if(transformationsNode[j].nodeName=="translation") {
                    var x = this.XMLreader.getFloat(transformationsNode[j],'x');
                    var y = this.XMLreader.getFloat(transformationsNode[j],'y');
                    var z = this.XMLreader.getFloat(transformationsNode[j],'z');

                    if(x==null||y==null||z==null)
                        return "No values for translation";
                    else if(isNaN(x)|isNaN(y)||isNaN(z))
                        return "Non numeric values for translation";
                    transformations[j]=[transformationsNode[j].nodeName,x,y,z];
                }
                else if(transformationsNode[j].nodeName=="rotation") {
                    var axis = this.XMLreader.getFloat(transformationsNode[j],'axis');
                    var angle = this.XMLreader.getFloat(transformationsNode[j],'angle');

                    if(axis==null||angle==null)
                        return "No values for rotation";
                    else if(isNaN(angle)|!isNaN(axis))
                        return "Non numeric value for rotation";
                    else if(axis=="yy"||axis=="xx"||axis=="zz") 
                        transformations[j]=[transformationsNode[j].nodeName,axis,angle];
                    else
                        return "Non aplicable axis value";
                }
                if(transformationsNode[j].nodeName=="scale") {
                    var sx = this.XMLreader.getFloat(transformationsNode[j],'sx');
                    var sy = this.XMLreader.getFloat(transformationsNode[j],'sy');
                    var sz = this.XMLreader.getFloat(transformationsNode[j],'sz');

                    if(x==null||y==null||z==null)
                        return "No values for scaling";
                    else if(isNaN(x)|isNaN(y)||isNaN(z))
                        return "Non numeric values for scaling";
                    transformations[j]=[transformationsNode[j].nodeName,sx,sy,sz];
                }
            }

            var descendants = [];
            var descendantsNode = grandChildrenNodes[descendantsIndex],childNodes;
            var childNum=0;
            for(var j=0;j<descendantsNode;j++) {
                if(descendantsNode[j].nodeName=="noderef"){
                    var descID = this.XMLreader.getString(descendantsNode[j],'id');

                    if(descID==null)
                        return "Undefined ID for descendant";
                    else if(descID==nodeID)
                        return "Node can't be it's own descendant";
                    
                    descendants[j]=descID;
                }
                else if(descendantsNode[j].nodeName=="leaf"){
                    var type = this.XMLreader.getString(descendantsNode[j],'type',['triangle', 'rectangle', 'cylinder', 'sphere', 'torus']);

                    if(type=="rectangle"){
                        var x1=this.XMLreader.getString(descendantsNode[j],'x1');
                        var y1=this.XMLreader.getString(descendantsNode[j],'y1');
                        var x2=this.XMLreader.getString(descendantsNode[j],'x2');
                        var y2=this.XMLreader.getString(descendantsNode[j],'y2');

                        if(x1==null||y1==null||x2==null||y2==null)
                            return "Undefined values for rectangle";
                        else if(isNaN(x1)||isNaN(y1)|isNaN(x2)||isNaN(y2))
                            return "Non numeric values for rectangle";
                        
                        descendants[j]=[type,x1,y1,x2,y2];
                    }
                    else  if(type=="triangle"){
                        var x1=this.XMLreader.getString(descendantsNode[j],'x1');
                        var y1=this.XMLreader.getString(descendantsNode[j],'y1');
                        var x2=this.XMLreader.getString(descendantsNode[j],'x2');
                        var y2=this.XMLreader.getString(descendantsNode[j],'y2');
                        var x3=this.XMLreader.getString(descendantsNode[j],'x3');
                        var y3=this.XMLreader.getString(descendantsNode[j],'y3');
                        var z3=this.XMLreader.getString(descendantsNode[j],'z3');

                        if(x1==null||y1==null||x2==null||y2==null||x3==null||y3==null||z3==null)
                            return "Undefined values for triangle";
                        else if(isNaN(x1)||isNaN(y1)|isNaN(x2)||isNaN(y2)||isNaN(x3)||isNaN(y3)||isNaN(z3))
                            return "Non numeric values for triangle";
                        
                        descendants[j]=[type,x1,y1,x2,y2,x3,y3,z3];
                    }
                    else  if(type=="cylinder"){
                        var height=this.XMLreader.getString(descendantsNode[j],'height');
                        var topRadius=this.XMLreader.getString(descendantsNode[j],'topRadius');
                        var bottomRadius=this.XMLreader.getString(descendantsNode[j],'bottomRadius');
                        var stacks=this.XMLreader.getString(descendantsNode[j],'stacks');
                        var slices=this.XMLreader.getString(descendantsNode[j],'slices');

                        if(height==null||topRadius==null||bottomRadius==null||stacks==null||slices==null)
                            return "Undefined values for cylinder";
                        else if(isNaN(height)||isNaN(topRadius)|isNaN(bottomRadius)||isNaN(stacks)||isNaN(slices))
                            return "Non numeric values for cylinder";
                        
                        descendants[j]=[type,height,topRadius,bottomRadius,stacks,slices];
                    }
                    else  if(type=="sphere"){
                        var radius=this.XMLreader.getString(descendantsNode[j],'radius');
                        var stacks=this.XMLreader.getString(descendantsNode[j],'stacks');
                        var slices=this.XMLreader.getString(descendantsNode[j],'slices');

                        if(radius==null||stacks==null||slices==null)
                            return "Undefined values for sphere";
                        else if(isNaN(radius)||isNaN(stacks)||isNaN(slices))
                            return "Non numeric values for sphere";
                        
                        descendants[j]=[type,radius,stacks,slices];
                    }
                    else  if(type=="torus"){
                        var inner=this.XMLreader.getString(descendantsNode[j],'inner');
                        var outer=this.XMLreader.getString(descendantsNode[j],'outer');
                        var loops=this.XMLreader.getString(descendantsNode[j],'loops');
                        var slices=this.XMLreader.getString(descendantsNode[j],'slices');

                        if(inner==null||outer==null||loops==null||slices==null)
                            return "Undefined values for torus";
                        else if(isNaN(inner)||isNaN(outer)|isNaN(loops)||isNaN(slices))
                            return "Non numeric values for torus";
                        
                        descendants[j]=[type,inner,outer,slices,loops];
                    }
                }
                childNum++;
            }
            if(childNum==0)
                return "0 descendants defined (1 min)";


        }


    }
}