const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITESHEETS_INDEX = 5;
var MATERIALS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var NODES_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }
        // <spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            return "tag <spritesheets> missing";
        else {
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse spritesheets block
            if ((error = this.parseSpritesheets(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse materials block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block.
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        if (axis_length == 0)
            this.referenceEnable = false;
        else
            this.referenceEnable = true;

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        this.defaultCameraID = this.reader.getString(viewsNode, "default");
        this.views = [];
        this.viewsIDS = []; //Read IDs to auxiliary array

        const children = viewsNode.children;

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "perspective" && children[i].nodeName !== "ortho") { // Check for missplaced tags
                this.onXMLMinorError("[views] missplaced tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get camera ID
            let viewId = this.reader.getString(children[i], 'id');
            if (viewId == null) {
                return "[views] no ID set for <" + children[i] + ">";
            }

            if (this.views[viewId] != null) { // Check for unique ID
                return "[views] View ID must be unique (ID = " + viewId + " already exists)";
            }

            if (children[i].nodeName === "perspective") { //Perspective case
                // Auxiliary variables for getting xml info
                let fromAux = null;
                let toAux = null;

                const perspectiveChildren = children[i].children;
                for (let j = 0; j < perspectiveChildren.length; j++) {
                    if (perspectiveChildren[j].nodeName !== "from" && perspectiveChildren[j].nodeName !== "to") {
                        this.onXMLMinorError("[views] unknown tag <" + perspectiveChildren[j].nodeName + ">");
                        continue;
                    }

                    if (perspectiveChildren[j].nodeName === "from") {
                        fromAux = {
                            x: this.reader.getFloat(perspectiveChildren[j], 'x'),
                            y: this.reader.getFloat(perspectiveChildren[j], 'y'),
                            z: this.reader.getFloat(perspectiveChildren[j], 'z')
                        };
                    } else {
                        toAux = {
                            x: this.reader.getFloat(perspectiveChildren[j], 'x'),
                            y: this.reader.getFloat(perspectiveChildren[j], 'y'),
                            z: this.reader.getFloat(perspectiveChildren[j], 'z')
                        };
                    }
                }

                this.views[viewId] = this.createPerspective({
                    near: this.reader.getFloat(children[i], 'near'),
                    far: this.reader.getFloat(children[i], 'far'),
                    angle: this.reader.getFloat(children[i], 'angle'),
                    from: fromAux,
                    to: toAux
                }); //Store perspective view in array (createPerspective creates a CFGcamera)
            } else if (children[i].nodeName === "ortho") {
                const orthoChildren = children[i].children;

                let fromAux = null;
                let toAux = null;
                let upAux = {
                    x: 0,
                    y: 1,
                    z: 0
                }

                for (let j = 0; j < orthoChildren.length; j++) {
                    if (orthoChildren[j].nodeName !== "from" && orthoChildren[j].nodeName !== "to" && orthoChildren[j].nodeName !== "up") {
                        this.onXMLMinorError("unknown tag <" + orthoChildren[j].nodeName + ">");
                        continue;
                    }

                    if (orthoChildren[j].nodeName === "from") {
                        fromAux = {
                            x: this.reader.getFloat(orthoChildren[j], 'x'),
                            y: this.reader.getFloat(orthoChildren[j], 'y'),
                            z: this.reader.getFloat(orthoChildren[j], 'z')
                        }
                    } else if (orthoChildren[j].nodeName === "to") {
                        toAux = {
                            x: this.reader.getFloat(orthoChildren[j], 'x'),
                            y: this.reader.getFloat(orthoChildren[j], 'y'),
                            z: this.reader.getFloat(orthoChildren[j], 'z')
                        }
                    } else {
                        upAux = {
                            x: this.reader.getFloat(orthoChildren[j], 'x'),
                            y: this.reader.getFloat(orthoChildren[j], 'y'),
                            z: this.reader.getFloat(orthoChildren[j], 'z')
                        }
                    }
                }

                this.views[viewId] = this.createOrtho({
                    near: this.reader.getFloat(children[i], 'near'),
                    far: this.reader.getFloat(children[i], 'far'),
                    left: this.reader.getFloat(children[i], 'left'),
                    right: this.reader.getFloat(children[i], 'right'),
                    top: this.reader.getFloat(children[i], 'top'),
                    bottom: this.reader.getFloat(children[i], 'bottom'),
                    from: fromAux,
                    to: toAux,
                    up: upAux
                }); //Stores orthogonal view in array (createOrtho creates a CFGcameraOrtho)
            }
            this.viewsIDS.push(viewId);
        }

        this.log("Parsed Views.");
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                } else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        let children = texturesNode.children

        if (children.length === 0) { //Check for no texture
            return "[texture] no textures defined"
        }

        this.textures = []

        //For each texture in textures block, check ID and file link
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "texture") {
                this.onXMLMinorError("[texture] tag name not valid");
                continue;
            }
            const textureId = this.reader.getString(children[i], 'id')
            if (textureId.length === 0) {
                return "[texture] no texture ID defined";
            }
            if (this.textures[textureId] != null) {
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";
            }

            const file = this.reader.getString(children[i], 'path');
            // Deals with relative/full pathing
            if (file.includes('scenes/images')) {
                this.textures[textureId] = new CGFtexture(this.scene, file);
            } else if (file.includes('images/')) {
                this.textures[textureId] = new CGFtexture(this.scene, './scenes/' + file);
            } else {
                this.textures[textureId] = new CGFtexture(this.scene, "./scenes/images/" + file);
            }
        }

        this.log("Parsed Textures.");
        return null;
    }
    /**
     * Parses the <spritesheets> block.
     * @param {spritesheets block element} spritesheetsNode
     */
    parseSpritesheets(spritesheetsNode) {
        let children = spritesheetsNode.children

        if (children.length === 0) { //Check for no texture
            return "[texture] no textures defined"
        }

        this.spritesheets = []

        //For each spritesheet in spritesheets block, check ID and file link
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "spritesheet") {
                this.onXMLMinorError("[spritesheets] tag name not valid");
                continue;
            }
            const spritesheetId = this.reader.getString(children[i], 'id')
            if (spritesheetId.length === 0) {
                return "[spritesheets] no spritesheet ID defined";
            }
            if (this.spritesheets[spritesheetId] != null) {
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";
            }

            const sizeM = this.reader.getInteger(children[i],'sizeM');
            const sizeN = this.reader.getInteger(children[i],'sizeN');
            if (sizeM == null || sizeN == null) 
                return "[spritesheets] no spritesheet sizeM/sizeN defined. Spritesheet id: "+spritesheetId;
            else if (isNaN(sizeM)||isNaN(sizeN))
                return "[spritesheets] Invalid values for sizeM/sizeN. Spritesheet id: " + spritesheetId;
            
                const file = this.reader.getString(children[i], 'path');
            // Deals with relative/full pathing
            if (file.includes('scenes/images')) {
                this.spritesheets[spritesheetId] = new MySpritesheet(this.scene, new CGFtexture(this.scene,file),sizeM,sizeN);
            } else if (file.includes('images/')) {
                this.spritesheets[spritesheetId] = new MySpritesheet(this.scene, new CGFtexture(this.scene,"./scenes/"+file),sizeM,sizeN);
            } else {
                this.spritesheets[spritesheetId] = new MySpritesheet(this.scene, new CGFtexture(this.scene,"./scenes/images/"+file),sizeM,sizeN);
            }
        }

        this.log("Parsed SpriteSheets.");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        const children = materialsNode.children;

        this.materials = [];

        if (children.length == 0) {
            return "[materials] no materials defined";
        }
        // Any number of materials.
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            const materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            // Parsing materials
            const grandChildren = children[i].children;
            let grandChildrenNames = [];
            for (let k = 0; k < grandChildren.length; k++)
                grandChildrenNames.push(grandChildren[k].nodeName);

            const shininessIndex = grandChildrenNames.indexOf("shininess");
            const emissiveIndex = grandChildrenNames.indexOf("emissive");
            const ambientIndex = grandChildrenNames.indexOf("ambient");
            const diffuseIndex = grandChildrenNames.indexOf("diffuse");
            const specularIndex = grandChildrenNames.indexOf("specular");

            if (shininessIndex === -1 || emissiveIndex === -1 || ambientIndex === -1 || diffuseIndex === -1 || specularIndex === -1) {
                return "Missing values for material with id: " + materialID;
            }

            const shininess = this.reader.getFloat(grandChildren[shininessIndex], 'value');
            if (isNaN(shininess)) return shininess;
            const emissive = this.parseColor(grandChildren[emissiveIndex], 'emissive');
            if (!Array.isArray(emissive)) return emissive;
            const ambient = this.parseColor(grandChildren[ambientIndex], 'ambient');
            if (!Array.isArray(ambient)) return ambient;
            const diffuse = this.parseColor(grandChildren[diffuseIndex], 'diffuse');
            if (!Array.isArray(diffuse)) return diffuse;
            const specular = this.parseColor(grandChildren[specularIndex], 'specular');
            if (!Array.isArray(specular)) return specular;


            this.materials[materialID] = new CGFappearance(this.scene);
            this.materials[materialID].setShininess(shininess);
            this.materials[materialID].setEmission(emissive[0], emissive[1], emissive[2], emissive[3]);
            this.materials[materialID].setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            this.materials[materialID].setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            this.materials[materialID].setSpecular(specular[0], specular[1], specular[2], specular[3]);
            this.materials[materialID].setTextureWrap('REPEAT', 'REPEAT');
        }

        this.log("Parsed Materials");
        return null;
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        let children = animationsNode.children;

        this.animations = new Map();

        //For each animation in animations block, check ID and keyframes
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "animation") {
                this.onXMLMinorError("[animations] tag name not valid");
                continue;
            }
            const animationID = this.reader.getString(children[i], 'id')
            if (animationID.length === 0) {
                return "[animations] no animation ID defined";
            }
            if (this.animations[animationID] != null) {
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";
            }

            let keyframes =[];
            const grandChildren = children[i].children;

            for (let j = 0; j < grandChildren.length; j++) {
                if (grandChildren[j].nodeName !== "keyframe") {
                    this.onXMLMinorError("[animations] keyframe tag name not valid");
                    continue;
                }
                const keyframeInstant = this.reader.getFloat(grandChildren[j], 'instant')
                if (keyframeInstant == null) {
                    return "[animations] no keyframe Instant defined";
                }
                if (isNaN(keyframeInstant)) {
                    return "[animations] wrong value for keyframe Instant";
                }
                if (keyframes.length>0 && keyframes[j-1].instant>keyframeInstant) {
                   this.onXMLMinorError("[animations] keyframe out of order");
                }

                // Transformations
                let transformations = [];
                const transformationsNodes = grandChildren[j].children;
                for (let k = 0; k < transformationsNodes.length; k++) {
                    if (transformationsNodes[k].nodeName === "rotation") {
                        const axis = this.reader.getString(transformationsNodes[k], 'axis');
                        const angle = this.reader.getFloat(transformationsNodes[k], 'angle');

                        if (axis == null || (axis !== "x" && axis !== "y" && axis !== "z")) {
                            return "[animations] wrong value for axis on rotation - animations id: " + animationID;
                        }
                        if (angle == null || isNaN(angle)) {
                            return "[animations] wrong value for angle on rotation - animations id: " + animationID;
                        }
                        if(axis==="x" && k!==1) {
                            this.onXMLMinorError("[animations] rotation x out of order");
                            transformations[1]={
                                angle: angle * DEGREE_TO_RAD,
                                axis: axis
                            };
                            continue;
                        }
                        if(axis==="y" && k!==2) {
                            this.onXMLMinorError("[animations] rotation y out of order");
                            transformations[2]={
                                angle: angle * DEGREE_TO_RAD,
                                axis: axis
                            };
                            continue;
                        }
                        if(axis==="z" && k!==3) {
                            this.onXMLMinorError("[animations] rotation z out of order");
                            transformations[3]={
                                angle: angle * DEGREE_TO_RAD,
                                axis: axis
                            };
                            continue;
                        }
                        transformations[k]={
                            angle: angle * DEGREE_TO_RAD,
                            axis: axis
                        };
                        
                    } else if (transformationsNodes[k].nodeName === "translation") {
                        if(k!==0)
                            this.onXMLMinorError("[animations] translation out of order");
                            
                        const x = this.reader.getFloat(transformationsNodes[k], "x");
                        const y = this.reader.getFloat(transformationsNodes[k], "y");
                        const z = this.reader.getFloat(transformationsNodes[k], "z");

                        if (x == null || y == null || z == null) {
                            return "[animations] missing values for translation - animation id: " + animationID;
                        }
                        if (isNaN(x) || isNaN(y) || isNaN(z)) {
                            return "[animations] wrong values for translation - animation id: " + animationID;
                        }

                        transformations[0]={
                            x: x,
                            y: y,
                            z: z
                        };
                    } else if (transformationsNodes[k].nodeName === "scale") {
                        if(k!==4)
                            this.onXMLMinorError("[animations] scaling out of order");

                        const sx = this.reader.getFloat(transformationsNodes[k], "sx");
                        const sy = this.reader.getFloat(transformationsNodes[k], "sy");
                        const sz = this.reader.getFloat(transformationsNodes[k], "sz");

                        if (sx == null || sy == null || sz == null) {
                            return "[nodes] missing values for scale - node id: " + nodeID;
                        }
                        if (isNaN(sx) || isNaN(sy) || isNaN(sz)) {
                            return "[nodes] wrong values for scale - node id: " + nodeID;
                        }

                        transformations[4]={
                            sx: sx,
                            sy: sy,
                            sz: sz
                        };
                    } else {
                        this.onXMLMinorError("[animations] unknown tag <" + transformationsNodes[j].nodeName + ">");
                    }
                }
                keyframes.push({
                    instant: keyframeInstant,
                    transformations: transformations
                });
            }
            keyframes.sort(function(a,b){return a.instant - b.instant});
            let keyframeanim = new KeyframeAnimation(keyframes);
            this.animations.set(animationID,keyframeanim);
            
        }

        this.log("Parsed Animations.");
        return null;
    }

    /**
     * Parses the <nodes> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        const children = nodesNode.children;

        let grandChildren = [];
        let grandChildrenNames = [];
        this.spriteanim=[];
        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName !== "node") {
                this.onXMLMinorError("[nodes] unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            grandChildrenNames = [];
            for (let j = 0; j < grandChildren.length; j++) {
                grandChildrenNames.push(grandChildren[j].nodeName);
            }

            const transformationsIndex = grandChildrenNames.indexOf("transformations");
            const animationIndex = grandChildrenNames.indexOf("animationref");
            const materialIndex = grandChildrenNames.indexOf("material");
            const textureIndex = grandChildrenNames.indexOf("texture");
            const descendantsIndex = grandChildrenNames.indexOf("descendants");

            // checking if there is a material or a texture applied
            if (materialIndex === -1 || textureIndex === -1) {
                return "[nodes] No material or texture applied";
            }

            // Transformations
            let transformations = [];
            const transformationsNode = grandChildren[transformationsIndex].children;
            for (let j = 0; j < transformationsNode.length; j++) {
                if (transformationsNode[j].nodeName === "rotation") {
                    const axis = this.reader.getString(transformationsNode[j], 'axis');
                    const angle = this.reader.getFloat(transformationsNode[j], 'angle');

                    if (axis == null || (axis !== "x" && axis !== "y" && axis !== "z")) {
                        return "[nodes] wrong value for axis on rotation - node id: " + nodeID;
                    }
                    if (angle == null || isNaN(angle)) {
                        return "[nodes] wrong value for angle on rotation - node id: " + nodeID;
                    }

                    transformations.push({
                        type: "rotation",
                        angle: angle * DEGREE_TO_RAD,
                        axis: axis
                    });
                } else if (transformationsNode[j].nodeName === "translation") {
                    const x = this.reader.getFloat(transformationsNode[j], "x");
                    const y = this.reader.getFloat(transformationsNode[j], "y");
                    const z = this.reader.getFloat(transformationsNode[j], "z");

                    if (x == null || y == null || z == null) {
                        return "[nodes] missing values for translation - node id: " + nodeID;
                    }
                    if (isNaN(x) || isNaN(y) || isNaN(z)) {
                        return "[nodes] wrong values for translation - node id: " + nodeID;
                    }

                    transformations.push({
                        type: "translation",
                        x: x,
                        y: y,
                        z: z
                    });
                } else if (transformationsNode[j].nodeName === "scale") {
                    const sx = this.reader.getFloat(transformationsNode[j], "sx");
                    const sy = this.reader.getFloat(transformationsNode[j], "sy");
                    const sz = this.reader.getFloat(transformationsNode[j], "sz");

                    if (sx == null || sy == null || sz == null) {
                        return "[nodes] missing values for scale - node id: " + nodeID;
                    }
                    if (isNaN(sx) || isNaN(sy) || isNaN(sz)) {
                        return "[nodes] wrong values for scale - node id: " + nodeID;
                    }

                    transformations.push({
                        type: "scale",
                        sx: sx,
                        sy: sy,
                        sz: sz
                    });
                } else {
                    this.onXMLMinorError("[nodes] unknown tag <" + transformationsNode[j].nodeName + ">");
                }
            }

            const transformationMatrix = mat4.create();
            for (const trans of transformations) {
                if (trans.type === "translation") {
                    mat4.translate(transformationMatrix, transformationMatrix, [trans.x, trans.y, trans.z]);
                } else if (trans.type === "rotation") {
                    mat4.rotate(transformationMatrix, transformationMatrix, trans.angle, this.axisCoords[trans.axis[0]]);
                } else if (trans.type === "scale") {
                    mat4.scale(transformationMatrix, transformationMatrix, [trans.sx, trans.sy, trans.sz]);
                }
            }

            let animation_id=null;
            let found=false;
            // Animation
            if(animationIndex!==-1) {
                if(animationIndex!==(transformationsIndex+1))
                this.onXMLMinorError("[nodes] <animationref> out of order");

                const animationID = this.reader.getString(grandChildren[animationIndex], "id");
                if (animationID == null) {
                    return "[nodes] animation ID is not valid. node ID: " + nodeID;
                }
                if (animationID !== "null") {
                    for (let [id, keyframes] of this.animations) {
                        if(animationID===id) {
                            animation_id=animationID;
                            found=true;
                            break;
                        }
                    }
                    if(!found)
                        return "[nodes] Animation with ID: " + animationID + " does not exist. Error on node ID: " + nodeID;
                    
                }
                
            }
            

            // Material
            const materialId = this.reader.getString(grandChildren[materialIndex], "id");
            if (materialId == null) {
                return "[nodes] Material ID is not valid. node ID: " + nodeID;
            }
            if (materialId !== "null") {
                if (this.materials[materialId] == null) {
                    return "[nodes] Material with ID: " + materialId + " does not exist. Error on node ID: " + nodeID;
                }
            }

            // Texture
            const textureId = this.reader.getString(grandChildren[textureIndex], "id");
            if (textureId == null) {
                return "[nodes] Texture ID is not valid. node ID: " + nodeID;
            }
            if (textureId !== "null" && textureId !== "clear") {
                if (this.textures[textureId] == null) {
                    return "[nodes] Texture with ID: " + textureId + " does not exist. Error on node ID: " + nodeID;
                }
            }
            const amplificationNodes = grandChildren[textureIndex].children;

            let amplification = null;
            for (let j = 0; j < amplificationNodes.length; j++) {
                if (amplificationNodes[j].nodeName === "amplification") {
                    const afs = this.reader.getFloat(amplificationNodes[j], 'afs');
                    const aft = this.reader.getFloat(amplificationNodes[j], 'aft');
                    if (aft == null || afs == null) {
                        return "[nodes] Amplification is not valid. Node ID: " + nodeID;
                    }
                    if (isNaN(aft) || isNaN(afs)) {
                        return "[nodes] Amplification values not valid. Node ID: " + nodeID;
                    }
                    amplification = [
                        afs,
                        aft
                    ];
                }
            }
            if (amplification == null) {
                amplification = [
                    1.0,
                    1.0
                ];
            }
            const texture = {
                textureId: textureId,
                amplification: amplification
            };

            // Descendants
            const descendants = [];
            const descendantsNodes = grandChildren[descendantsIndex].children;
            for (let j = 0; j < descendantsNodes.length; j++) {
                if (descendantsNodes[j].nodeName === "noderef") {
                    const descID = this.reader.getString(descendantsNodes[j], 'id');

                    if (descID == null)
                        return "[nodes] Undefined ID for descendant. node id: " + nodeID;
                    else if (descID === nodeID)
                        return " [nodes] duplicated node id: " + nodeID;

                    descendants.push({
                        type: "noderef",
                        id: descID
                    });
                } else if (descendantsNodes[j].nodeName === "leaf") {
                    const type = this.reader.getString(descendantsNodes[j], "type", ['triangle', 'rectangle', 'cylinder', 'sphere', 'torus','plane']);
                    if (type === "rectangle") {
                        const x1 = this.reader.getFloat(descendantsNodes[j], 'x1');
                        const y1 = this.reader.getFloat(descendantsNodes[j], 'y1');
                        const x2 = this.reader.getFloat(descendantsNodes[j], 'x2');
                        const y2 = this.reader.getFloat(descendantsNodes[j], 'y2');

                        if (x1 == null || x2 == null || y1 == null || y2 == null) {
                            return "[nodes] Missing values for rectangle leaf. Node id: " + nodeID;
                        }
                        if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
                            return "[nodes] Invalid values for rectangle leaf. Node id: " + nodeID;
                        }

                        descendants.push({
                            type: "rectangle",
                            rectangle: new MyRectangle(this.scene, x1, y1, x2, y2)
                        });
                    } else if (type === "triangle") {
                        const x1 = this.reader.getFloat(descendantsNodes[j], 'x1');
                        const y1 = this.reader.getFloat(descendantsNodes[j], 'y1');
                        const x2 = this.reader.getFloat(descendantsNodes[j], 'x2');
                        const y2 = this.reader.getFloat(descendantsNodes[j], 'y2');
                        const x3 = this.reader.getFloat(descendantsNodes[j], 'x3');
                        const y3 = this.reader.getFloat(descendantsNodes[j], 'y3');

                        if (x1 == null || x2 == null || y1 == null || y2 == null || x3 == null || y3 == null) {
                            return "[nodes] Missing values for triangle leaf. Node id: " + nodeID;
                        }
                        if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2) || isNaN(x3) || isNaN(y3)) {
                            return "[nodes] Invalid values for triangle leaf. Node id: " + nodeID;
                        }

                        descendants.push({
                            type: "triangle",
                            triangle: new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3)
                        });
                    } else if (type === "cylinder") {
                        const height = this.reader.getFloat(descendantsNodes[j], 'height');
                        const topRadius = this.reader.getFloat(descendantsNodes[j], 'topRadius');
                        const bottomRadius = this.reader.getFloat(descendantsNodes[j], 'bottomRadius');
                        const stacks = this.reader.getInteger(descendantsNodes[j], 'stacks');
                        const slices = this.reader.getInteger(descendantsNodes[j], 'slices');

                        if (height == null || topRadius == null || bottomRadius == null || stacks == null || slices == null) {
                            return "[nodes] Missing values for cylinder leaf. Node id: " + nodeID;
                        } else if (isNaN(height) || isNaN(topRadius) || isNaN(bottomRadius) || isNaN(stacks) || isNaN(slices)) {
                            return "[nodes] Invalid values for cylinder leaf. Node id: " + nodeID;
                        }

                        descendants.push({
                            type: "cylinder",
                            cylinder: new MyCylinder(this.scene, height, bottomRadius, topRadius, stacks, slices)
                        });
                    } else if (type === "sphere") {
                        const radius = this.reader.getFloat(descendantsNodes[j], 'radius');
                        const stacks = this.reader.getInteger(descendantsNodes[j], 'stacks');
                        const slices = this.reader.getInteger(descendantsNodes[j], 'slices');

                        if (radius == null || stacks == null || slices == null)
                            return "[nodes] Missing values for sphere leaf. Node id: " + nodeID;
                        else if (isNaN(radius) || isNaN(stacks) || isNaN(slices))
                            return "[nodes] Invalid values for sphere leaf. Node id: " + nodeID;

                        descendants.push({
                            type: "sphere",
                            sphere: new MySphere(this.scene, radius, slices, stacks)
                        });
                    } else if (type === "torus") {
                        const inner = this.reader.getFloat(descendantsNodes[j], 'inner');
                        const outer = this.reader.getFloat(descendantsNodes[j], 'outer');
                        const loops = this.reader.getInteger(descendantsNodes[j], 'loops');
                        const slices = this.reader.getInteger(descendantsNodes[j], 'slices');

                        if (inner == null || outer == null || loops == null || slices == null)
                            return "[nodes] Missing values for torus leaf. Node id: " + nodeID;
                        else if (isNaN(inner) || isNaN(outer) || isNaN(loops) || isNaN(slices))
                            return "[nodes] Invalid values for torus leaf. Node id: " + nodeID;

                        descendants.push({
                            type: "torus",
                            torus: new MyTorus(this.scene, inner, outer, slices, loops)
                        });
                    } else if (type === "plane") {
                        const ndivsU = this.reader.getFloat(descendantsNodes[j], 'npartsU');
                        const ndivsV = this.reader.getFloat(descendantsNodes[j], 'npartsV');

                        if (ndivsU == null || ndivsV == null)
                            return "[nodes] Missing values for plane leaf. Node id: " + nodeID;
                        else if (isNaN(ndivsU) || isNaN(ndivsV))
                            return "[nodes] Invalid values for plane leaf. Node id: " + nodeID;

                        descendants.push({
                            type: "plane",
                            plane: new MyPlane(this.scene, ndivsU, ndivsV)
                        });
                    } else if (type === "patch") {
                        const npointsU = this.reader.getInteger(descendantsNodes[j], 'npointsU');
                        const npointsV = this.reader.getInteger(descendantsNodes[j], 'npointsV');

                        const npartsU = this.reader.getInteger(descendantsNodes[j], 'npartsU');
                        const npartsV = this.reader.getInteger(descendantsNodes[j], 'npartsV');

                        if (npartsU == null || npartsV == null)
                            return "[nodes] Missing values for patch leaf. Node id: " + nodeID;
                        else if (isNaN(npartsU) || isNaN(npartsV))
                            return "[nodes] Invalid values for patch leaf. Node id: " + nodeID;

                        const patchDescendants = descendantsNodes[j].children;
                        let ind=0;
                        let controlvertexes=[];
                        for(let i=0; i<npointsU;i++) {
                            let uList=[];
                            for(let j=0;j<npointsV;j++){
                                let vList=[];
                                if(patchDescendants[ind].nodeName=="controlpoint") {
                                    const x = this.reader.getFloat(patchDescendants[ind], 'x');
                                    const y = this.reader.getFloat(patchDescendants[ind], 'y');
                                    const z = this.reader.getFloat(patchDescendants[ind], 'z');

                                    if (x == null || y == null || z == null)
                                        return "[nodes] Missing values for controlpoint leaf. Node id: " + nodeID;
                                    else if (isNaN(x) || isNaN(y) || isNaN(z))
                                        return "[nodes] Invalid values for controlpoint leaf. Node id: " + nodeID;
                                    vList.push(x,y,z,1);
                                    uList.push(vList);
                                }
                                else{
                                    this.onXMLMinorError("[nodes] unknown tag <" + children[i].nodeName + ">");
                                continue;
                                }
                                ind++;
                            }
                            controlvertexes.push(uList);
                        }
                        descendants.push({
                            type: "patch",
                            patch: new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV,controlvertexes)
                        });
                    } 
                    else if (type === "defbarrel") {
                        const base = this.reader.getInteger(descendantsNodes[j], 'base');
                        const middle = this.reader.getInteger(descendantsNodes[j], 'middle');
                        const height = this.reader.getInteger(descendantsNodes[j], 'height');
                        const slices = this.reader.getInteger(descendantsNodes[j], 'slices');
                        const stacks = this.reader.getInteger(descendantsNodes[j], 'stacks');

                        if (base == null || middle == null || height == null || slices == null || stacks == null)
                        return "[nodes] Missing values for defbarrel leaf. Node id: " + nodeID;
                        else if (isNaN(base) || isNaN(middle) || isNaN(height) || isNaN(slices) || isNaN(stacks))
                        return "[nodes] Invalid values for defbarrel leaf. Node id: " + nodeID;

                        descendants.push({
                            type: "defbarrel",
                            defbarrel: new MyDefBarrel(this.scene, base, middle, height, slices, stacks)
                        });
                    }             
                    else if (type === "spritetext") {
                        const text = this.reader.getString(descendantsNodes[j], 'text');
                        if (text == null)
                            return "[nodes] Missing values for spritetext leaf. Node id: " + nodeID;

                        descendants.push({
                            type: "spritetext",
                            spritetext: new MySpriteText(this.scene,text)
                        });
                    } else if (type === "spriteanim") {
                        const id = this.reader.getString(descendantsNodes[j], 'ssid');
                        if (id == null)
                            return "[nodes] Missing id for spriteanim leaf. Node id: " + nodeID;

                        if (this.spritesheets[id] == null) {
                            return "[nodes] Spritesheet with ID: " + id + " does not exist. Error on node ID: " + nodeID;
                        }
                        const startCell = this.reader.getInteger(descendantsNodes[j], 'startCell');
                        const endCell = this.reader.getInteger(descendantsNodes[j], 'endCell');
                        const duration = this.reader.getFloat(descendantsNodes[j], 'duration');

                        if (startCell == null || endCell == null || duration == null)
                            return "[nodes] Missing values for spriteanim leaf. Node id: " + nodeID;
                        else if (isNaN(startCell) || isNaN(endCell)|| isNaN(duration))
                            return "[nodes] Invalid values for spriteanim leaf. Node id: " + nodeID;
                        let spranim=new MySpriteAnimation(this.spritesheets[id],duration,startCell,endCell);
                        this.spriteanim.push(spranim);
                        descendants.push({
                            type: "spriteanim",
                            spriteanim: spranim
                        });
                    }
                    
                }
            }
            if (descendants.length === 0) {
                return "[nodes] No descendants! Node id: " + nodeID;
            }
            
            this.nodes[nodeID] = {
                matrix: transformationMatrix,
                animation: animation_id,
                material: this.materials[materialId],
                texture: texture,
                descendants: descendants
            };
            
        }

        let err = null;
        if ((err = this.verifyUndeclared()) !== null) {
            return "[nodes] Descendant node with ID: " + err + " is not defined.";
        }

        this.log("Parsed Nodes.");
        return null;
    }

    /**
     * Parse the boolean value
     * @param {node type} node 
     * @param {name of attribute} name 
     * @param {message to be displayed} messageError 
     */
    parseBoolean(node, name, messageError) {
        var boolVal = this.reader.getBoolean(node, name);
        if (
            !(
                boolVal != null &&
                !isNaN(boolVal) &&
                (boolVal == true || boolVal == false)
            )
        ) {
            this.onXMLMinorError(
                "unable to parse value component " +
                messageError +
                "; assuming 'value = 1'"
            );
            return true;
        }

        return boolVal;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To do: Create display loop for transversing the scene graph, calling the root node's display function
        this.scene.pushMatrix();
        this.processDescendants(this.nodes[this.idRoot]);
        this.scene.popMatrix();
    }

    /**
     * Process Descendants
     * @param {Node} node Node to be processed
     * @param {Material} parentMaterial Parent Material to be applied
     * @param {Texture} parentTexture Parent Texture to be applied
     */
    processDescendants(node, parentMaterial, parentTexture) {
        this.scene.pushMatrix();
        this.scene.multMatrix(node.matrix);
        
        if(node.animation != null) {
            this.animations.get(node.animation).apply(this.scene);            
        }

        let currentMat = parentMaterial;
        let currentTex = parentTexture;

        if (node.texture.textureId !== "null") {
            currentTex = node.texture;
        }
        if (node.material != null) {
            currentMat = node.material;
        }
        if (currentMat != null) {
            currentMat.apply();
        }

        for (let desc of node.descendants) {
            if (desc.type !== "noderef") {

                if (currentTex.textureId !== "clear" && currentTex.textureId !== "null") {
                    this.textures[currentTex.textureId].bind();
                    switch (desc.type) {
                        case "rectangle":
                            if (!desc.rectangle.isDone())
                                desc.rectangle.updateTexCoords(currentTex.amplification);
                            break;
                        case "triangle":
                            if (!desc.triangle.isDone())
                                desc.triangle.updateTexCoords(currentTex.amplification);
                            break;
                    }
                }
                switch (desc.type) {
                    case "rectangle":
                        desc.rectangle.display();
                        break;
                    case "triangle":
                        desc.triangle.display();
                        break;
                    case "sphere":
                        desc.sphere.display();
                        break;
                    case "cylinder":
                        desc.cylinder.display();
                        break;
                    case "torus":
                        desc.torus.display();
                        break;
                    case "plane":
                        desc.plane.display();
                        break;
                    case "patch":
                        desc.patch.display();
                        break;
                    case "defbarrel":
                        desc.defbarrel.display();
                        break;
                    case "spritetext":
                        desc.spritetext.display();
                        break;
                    case "spriteanim":
                        desc.spriteanim.display();
                        break;
                    default:
                        break;
                }

            } else {
                this.scene.pushMatrix();
                this.processDescendants(this.nodes[desc.id], currentMat, currentTex);
                this.scene.popMatrix();
                // To reapply parent texture
                if (currentMat != null) {
                    currentMat.apply();
                }
            }
        }
        this.scene.popMatrix();
    }
    /**
     * Creates a perspective camera
     * @param {elements to build perspective camera} elements
     * 
     * @returns A CFGcamera: if a value is missing/ not numerical, default values will be assigned 
     */
    createPerspective(elements) {
        const referenceValues = [0.1, 500, 45, [30, 15, 30],
            [0, -2, 0]
        ];
        if (isNaN(elements.near)) {
            this.onXMLMinorError('expected a float number on near, assuming default value');
            elements.near = referenceValues[0];
        }
        if (isNaN(elements.far)) {
            this.onXMLMinorError('expected a float number on far, assuming default value');
            elements.far = referenceValues[1];
        }
        if (isNaN(elements.angle)) {
            this.onXMLMinorError('expected a float number on angle, assuming default value');
            elements.angle = referenceValues[2];
        }
        if (isNaN(elements.from.x)) {
            this.onXMLMinorError('expected a float number o from(x), assuming default value');
            elements.from.x = referenceValues[3][0];
        }
        if (isNaN(elements.from.y)) {
            this.onXMLMinorError('expected a float number o from(y), assuming default value');
            elements.from.y = referenceValues[3][1];
        }
        if (isNaN(elements.from.z)) {
            this.onXMLMinorError('expected a float number o from(z), assuming default value');
            elements.from.z = referenceValues[3][2];
        }
        if (isNaN(elements.to.x)) {
            this.onXMLMinorError('expected a float number o to(x), assuming default value');
            elements.to.x = referenceValues[4][0];
        }
        if (isNaN(elements.to.y)) {
            this.onXMLMinorError('expected a float number o to(y), assuming default value');
            elements.from.x = referenceValues[4][1];
        }
        if (isNaN(elements.to.z)) {
            this.onXMLMinorError('expected a float number o to(z), assuming default value');
            elements.from.x = referenceValues[4][2];
        }
        return new CGFcamera(elements.angle * DEGREE_TO_RAD, elements.near, elements.far, vec3.fromValues(elements.from.x, elements.from.y, elements.from.z), vec3.fromValues(elements.to.x, elements.to.y, elements.to.z))
    }
    /**
     * Creates orthogonal camera
     * @param {elements to build orthogonal camera} elements
     * 
     * @returns A CFGcameraOrtho: if a value is missing/ not numerical, default values will be assigned 
     */
    createOrtho(elements) {
        const referenceOrtho = [0.2, 100, [30, 15, 30],
            [0, -2, 0],
            [0, 1, 0], -0.2, 0.2, -0.2, 0.2
        ];
        if (isNaN(elements.near)) {
            this.onXMLMinorError('expected a float number on near, assuming default value');
            elements.near = referenceOrtho[0];
        }
        if (isNaN(elements.far)) {
            this.onXMLMinorError('expected a float number on far, assuming default value');
            elements.far = referenceOrtho[1];
        }
        if (isNaN(elements.from.x)) {
            this.onXMLMinorError('expected a float number o from(x), assuming default value');
            elements.from.x = referenceOrtho[2][0];
        }
        if (isNaN(elements.from.y)) {
            this.onXMLMinorError('expected a float number o from(y), assuming default value');
            elements.from.y = referenceOrtho[2][1];
        }
        if (isNaN(elements.from.z)) {
            this.onXMLMinorError('expected a float number o from(z), assuming default value');
            elements.from.z = referenceOrtho[2][2];
        }
        if (isNaN(elements.to.x)) {
            this.onXMLMinorError('expected a float number o to(x), assuming default value');
            elements.to.x = referenceOrtho[3][0];
        }
        if (isNaN(elements.to.y)) {
            this.onXMLMinorError('expected a float number o to(y), assuming default value');
            elements.to.y = referenceOrtho[3][1];
        }
        if (isNaN(elements.to.z)) {
            this.onXMLMinorError('expected a float number o to(z), assuming default value');
            elements.to.z = referenceOrtho[3][2];
        }
        if (isNaN(elements.up.x)) {
            this.onXMLMinorError('expected a float number o up(x), assuming default value');
            elements.up.x = referenceOrtho[4][0];
        }
        if (isNaN(elements.up.y)) {
            this.onXMLMinorError('expected a float number o up(y), assuming default value');
            elements.up.x = referenceOrtho[4][1];
        }
        if (isNaN(elements.up.z)) {
            this.onXMLMinorError('expected a float number o up(z), assuming default value');
            elements.up.x = referenceOrtho[4][2];
        }
        if (isNaN(elements.left)) {
            this.onXMLMinorError('expected a float number on left, assuming default value');
            elements.left = referenceOrtho[5];
        }
        if (isNaN(elements.right)) {
            this.onXMLMinorError('expected a float number on right, assuming default value');
            elements.left = referenceOrtho[6];
        }
        if (isNaN(elements.bottom)) {
            this.onXMLMinorError('expected a float number on bottom, assuming default value');
            elements.left = referenceOrtho[7];
        }
        if (isNaN(elements.top)) {
            this.onXMLMinorError('expected a float number on top, assuming default value');
            elements.left = referenceOrtho[8];
        }
        return new CGFcameraOrtho(elements.left, elements.right, elements.bottom, elements.top, elements.near, elements.far, vec3.fromValues(elements.from.x, elements.from.y, elements.from.z), vec3.fromValues(elements.to.x, elements.to.y, elements.to.y), vec3.fromValues(elements.up.x, elements.up.y, elements.up.y))
    }
    /**
     * Checks for undeclared nodes
     */
    verifyUndeclared() {
        for (const [nodeID, node] of Object.entries(this.nodes)) {
            for (const desc of node.descendants) {
                if (desc.type === "noderef") {
                    if (this.nodes[desc.id] == null) {
                        return desc.id
                    }
                }
            }
        }
        return null
    }
}