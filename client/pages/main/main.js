let faces = ["xFront", "xBack", "yFront", "yBack", "zFront", "zBack"];//the 6 faces of the cube
let controls;

//IMPORTS/EXPORTS
let Imports = {
	keyboard  : require("../../modules/actions/keyboard.js"),
	axes      : require("../../modules/axes.js"),
	mouse     : require("../../modules/actions/mouse"),
	main      : require("../../modules/mainScene.js"),
	load      : require("../../modules/loadItems"),
	config    : require("./../../config.json"),
	playerData: require("./../../playerData.json"),
	random    : require("./../../modules/other/randomFunctions.js")
};


/**DEV TOOLS AND TESTING ITEMS**/
Imports.main.cubeSize = 30;//the size of the cube
Imports.main.cubeSegments = 30;//how many egments per side


function setUpDevTools() {
	console.log("setting up devTools");
	document.getElementById('devTools').style.opacity = 1;
	for (let i = 0; i < faces.length; i++) {
		document.getElementById(faces[i]).style.color = "#" + Imports.random.changeJSHexToCss(Imports.main.cubeFaces[faces[i]].color);
	}
	Imports.axes.render(Imports.main);
	Imports.axes.appendAxes(document);
}
/*******************************/

function SetUpGame() {
	Imports.main.appendScene(document);
	if (Imports.config.devSettings.logs.controls) {
		console.log(Imports.config.devSettings.controls.keyboard.join("\n"));
	}
	//DEV CONTROLS
	if (Imports.keyboard.devControls) {
		setUpDevTools();
	}
	controls = require("./../../modules/cameraControls").setUp(document, window);
	//controls = new THREE.OrbitControls(Imports.main.camera, Imports.main.renderer.domElement);
	//SET UP CONTROLS
	Imports.mouse.setUp(document);
	Imports.keyboard.checkKeys(window);

	//ANIMATE
	animate();
}
function animate() {
	requestAnimationFrame(animate);
	Imports.main.animateScene();
	//CHECK WHETHER DEVTOOLS NEED TO BE SHOWN
	if (Imports.keyboard.devControls) {
		if (parseInt(document.getElementById("devTools").style.opacity, 10) === 0) {
			setUpDevTools();
		}
		Imports.axes.animate(Imports.main);
	}
	//REMOVE DEV TOOLS
	else if (Imports.axes.scene !== null) {
		document.getElementById("devTools").style.opacity = 0;
	}
	//re-render and update everything
	update();
	render();
}
function render() {
	Imports.main.render();
	if (Imports.keyboard.devControls) {
		Imports.axes.render(Imports.main);
	}
}
function update() {
	Imports.mouse.animate(Imports.main);
//	controls.update();

}


function onScreenLoad() {
	//start the loading process
	Imports.load.setUp(document, window);
	let int = setInterval(function () {
		//if everything is loaded
		if (Imports.load.loaded) {
			clearInterval(int);
			document.getElementById("loadingItems").style.opacity = 0;
			SetUpGame();
		}
	}, 100);
}
window.onload = onScreenLoad;