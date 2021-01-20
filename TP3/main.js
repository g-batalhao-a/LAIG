//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 
//Include additional files here
serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 
                'MyInterface.js', 'primitives/MyRectangle.js', 'primitives/MyTriangle.js', 'primitives/MyCylinder.js', 'primitives/MySphere.js', 'primitives/MyTorus.js', 'primitives/MyCircle.js', 'primitives/MyPlane.js','primitives/MyPatch.js','primitives/MyDefBarrel.js', 
                'game/MyBoard.js','game/MyBoardTile.js','game/MyPiece.js', 'game/MyBoardMove.js','game/MyBoardSequence.js','game/MyBoardOrchestrator.js', 'game/MyPrologInterface.js', 'game/MyMenu.js', 'game/MyButton.js',
                'state/GameState.js','state/AnimatingState.js','state/InitialState.js', 'state/MovingState.js', 'state/GameOverState.js','state/SelectState.js', 'state/EndState.js', 'state/CheckNextPlayerState.js', 'state/BotState.js', 'state/MenuState.js', 'state/FilmState.js',
                'animations/MyAnimation.js', 'animations/KeyframeAnimation.js','animations/MyAnimator.js', 'animations/CameraAnimation.js', 'animations/Animations.js',
                'spritesheet/MySpriteAnimation.js', 'spritesheet/MySpriteText.js', 'spritesheet/MySpritesheet.js',

main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	
    var filename=getUrlVars()['file'] || "test.xml";

	// create and load graph, and associate it to scene. 
    // Check console for loading errors
    var myGraph = new MySceneGraph(getUrlVars()['file'] || "space.xml", myScene);
    var myGraph = new MySceneGraph(getUrlVars()['file'] || "park.xml", myScene);
    var myGraph = new MySceneGraph(getUrlVars()['file'] || "room.xml", myScene);
   
	
	// start
    app.run();
}

]);