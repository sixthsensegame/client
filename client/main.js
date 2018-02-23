let faces = ["xFront", "xBack", "yFront", "yBack", "zFront", "zBack"];//the 6 faces of the cube
alert("The Shift + Backquote{ ` }key enables/disables devTools");
let main = {
	scene    : null,
	camera   : null,
	renderer : null,
	container: null
};//the main scene's items
let controls, INTERSECTED, light, mesh;
let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
let mouse = {x: 0, y: 0};
let cubeSize = 30;//change cube's size
let cubeSegments = 30;//change how many segments per side
let cubeFaces = {
	xFront: {grid: [], color: 0x00FFDC},
	xBack : {grid: [], color: 0xFFD800},
	yFront: {grid: [], color: 0x9300FF},
	yBack : {grid: [], color: 0x0FFF00},
	zFront: {grid: [], color: 0xFF0000},
	zBack : {grid: [], color: 0x0017FF}
};//The meshes & colors for all 6 sides

//INPORTS/EXPORTS
let Imports = {
	keyboard: require("./modules/actions/keyboard.js"),
	axes    : require("./modules/axes.js")
};


/**DEV TOOLS AND TESTING ITEMS**/
let mouseHoverOverPieceDoesWhat = {
	swapColorTo       : 0xffff00,
	changesWireFrameTo: true
};

function random(max, min) {
	min = min || 0;
	max = max || 100;
	return min + Math.round(Math.random() * max);
}//returns a rounded random number (used when testing)
function setUpDevTools() {
	document.getElementById('devTools').style.opacity = 1;
	for (let i = 0; i < faces.length; i++) {
		document.getElementById(faces[i]).style.color = "#" + changeJSHexToCss(cubeFaces[faces[i]].color.toString(16));
	}
	Imports.axes.appendAxes(document);
}
/*******************************/


function changeJSHexToCss(args) {
	let zeros = "";
	for (let i = args.length; i < 6; i++) {
		zeros += "0";
	}
	return `${zeros}${args}`;
}//Changes the Javascript's HEX code to a CSS's HEX code
function onScreenLoad() {
	main.container = document.body;
	main.scene = new THREE.Scene();

	//CAMERA
	main.camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 20000);
	main.scene.add(main.camera);
	main.camera.position.set(0, 150, 400);
	main.camera.lookAt(main.scene.position);

	//the little "selectable" cubes
	function addCube(args) {
		let x, y, z, rx, ry, rz, where, o;

		args = args || {};
		x = args.x || 0;
		y = args.y || 0;
		z = args.z || 0;
		rx = args.rx || 0;
		ry = args.ry || 0;
		rz = args.rz || 0;
		where = args.where || cubeFaces.xFront[0][0];
		o = args.o || 1;
		let shape = new THREE.Shape();

		shape.lineTo(0, 0, cubeSize / cubeSegments, 0);
		shape.lineTo(cubeSize / cubeSegments, 0, +cubeSize / cubeSegments, cubeSize / cubeSegments);
		shape.lineTo(cubeSize / cubeSegments, cubeSize / cubeSegments, 0, cubeSize / cubeSegments);
		shape.lineTo(0, cubeSize / cubeSegments, 0, 0);

		mesh = new THREE.Mesh(
			new THREE.ShapeGeometry(shape),
			new THREE.MeshPhongMaterial({color: cubeFaces[where[0]].color || 0xFFFFFF, wireframe: false})
		);
		mesh.material.opacity = o;
		mesh.position.set(x, y, z);
		mesh.rotation.set(rx, ry, rz);
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		main.scene.add(mesh);
		cubeFaces[where[0]].grid[where[1]][where[2]] = {mesh: mesh, args: args};
	}

	for (let i = 0; i < 30; i++) {
		cubeFaces.xFront.grid.push([]);
		cubeFaces.xBack.grid.push([]);
		cubeFaces.yFront.grid.push([]);
		cubeFaces.yBack.grid.push([]);
		cubeFaces.zFront.grid.push([]);
		cubeFaces.zBack.grid.push([]);
		for (let j = 0; j < 30; j++) {
			addCube({
				x    : -(cubeSize / 2) + j,
				y    : -(cubeSize / 2) + i,
				z    : cubeSize / 2,
				where: ["zFront", i, j]
			});
			addCube({
				x    : -(cubeSize / 2) + (j + 1),
				y    : -(cubeSize / 2) + i,
				z    : -cubeSize / 2,
				where: ["zBack", i, j],
				ry   : 29.85 * 2
			});
			addCube({
				x    : -(cubeSize / 2) + j,
				y    : -cubeSize / 2,
				z    : -(cubeSize / 2) + i,
				where: ["yBack", i, j],
				rx   : -29.85
			});
			addCube({
				x    : -(cubeSize / 2) + j,
				y    : cubeSize / 2,
				z    : -(cubeSize / 2) + (i + 1),
				where: ["yFront", i, j],
				rx   : 29.85
			});
			addCube({
				x    : cubeSize / 2,
				y    : -(cubeSize / 2) + j,
				z    : -(cubeSize / 2) + (i + 1),
				where: ["xFront", i, j],
				ry   : -29.85
			});
			addCube({
				x    : -cubeSize / 2,
				y    : -(cubeSize / 2) + j,
				z    : -(cubeSize / 2) + i,
				where: ["xBack", i, j],
				ry   : 29.85
			});
		}
	}


	// LIGHT
	let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	main.scene.add(ambientLight);

	light = new THREE.PointLight(0xffffff, 0.2);
	light.position.set(main.camera.position.x, main.camera.position.y, main.camera.position.z);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 1000;
	main.scene.add(light);

	//RENDERER
	main.renderer = new THREE.WebGLRenderer();
	main.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	main.renderer.shadowMap.enabled = true;
	main.renderer.shadowMap.type = THREE.BasicShadowMap;
	main.container.appendChild(main.renderer.domElement);

	//DEV CONTROLS
	if (Imports.keyboard.devControls) {
		setUpDevTools();
	}
	controls = new THREE.OrbitControls(main.camera, main.renderer.domElement);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	Imports.keyboard.checkKeys(window);
	animate();

}
function animate() {
	console.log(Imports.keyboard.devControls);
	requestAnimationFrame(animate);
	light.position.set(main.camera.position.x, main.camera.position.y, main.camera.position.z);
	if (Imports.keyboard.devControls) {
		if (Imports.axes.scene === null) {
			setUpDevTools();
		}
		Imports.axes.animate(main);
	}
	else if (Imports.axes.scene !== null) {
		Imports.axes.removeAxes();
		document.getElementById("devTools").style.opacity = 0;

	}
	render();
	update();
}
function onDocumentMouseMove(event) {
	mouse = {
		x: (event.clientX / window.innerWidth) * 2 - 1,
		y: -(event.clientY / window.innerHeight) * 2 + 1
	};
}
function render() {
	main.renderer.render(main.scene, main.camera);
	if (Imports.keyboard.devControls) {
		Imports.axes.render(main);
	}
}
function update() {
	let vector = new THREE.Vector3(mouse.x, mouse.y, 1);
	vector.unproject(main.camera);
	let ray = new THREE.Raycaster(main.camera.position, vector.sub(main.camera.position).normalize());
	let intersects = ray.intersectObjects(main.scene.children);
	if (intersects.length > 0) {
		if (intersects[0].object != INTERSECTED) {
			if (INTERSECTED) {
				INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
				INTERSECTED.material.wireframe = false;
			}
			INTERSECTED = intersects[0].object;
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			INTERSECTED.material.wireframe = mouseHoverOverPieceDoesWhat.changesWireFrameTo;
			INTERSECTED.material.color.setHex(mouseHoverOverPieceDoesWhat.swapColorTo);
		}
	}
	else {
		if (INTERSECTED) {
			INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
			INTERSECTED.material.wireframe = false;
		}
		INTERSECTED = null;
	}
	controls.update();
}

window.onload = onScreenLoad;