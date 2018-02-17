let main = {
	scene    : null,
	camera   : null,
	renderer : null,
	container: null
};
let axes = {
	scene    : null,
	camera   : null,
	renderer : null,
	container: null
};
let controls, INTERSECTED, light, mesh;
let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
let mouse = {x: 0, y: 0};
let cubeSize = 30;
let cubeSpaces = 30;

/***/
let devControls = false;
let mouseHoverOverPieceDoesWhat = {
	swapColorTo       : 0xffff00,
	changesWireFrameTo: true
};

function addAxis() {
	console.log("ran");
	axes.container = document.getElementById("axes");
	axes.renderer =  new THREE.WebGLRenderer();
	axes.renderer.setSize(200, 200);
	axes.container.appendChild(axes.renderer.domElement);

	axes.scene = new THREE.Scene();
	axes.camera = new THREE.PerspectiveCamera(45, 200/200, 0.1, 200000);
	axes.camera.up = main.camera.up;
	axes.scene.add(axes.camera);

	let axesHelper =  new THREE.AxesHelper(100);
	main.scene.add(axesHelper);

	axesHelper =  new THREE.AxesHelper(10);
	axes.scene.add(axesHelper);
	axes.camera.lookAt(axes.scene.position);
	axes.camera.position.set(0, 20, 0);
}

/***/


let cubeFaces = {
	xFront: [[]],
	xBack : [],
	yFront: [],
	yBack : [],
	zFront: [],
	zBack : []
};

function onScreenLoad() {
	if(!devControls){
		document.getElementById('devTools').style.opacity=0;
	}
	main.container = document.body;
	main.scene = new THREE.Scene();

	//CAMERA
	main.camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 20000);
	main.scene.add(main.camera);
	main.camera.position.set(0, 150, 400);
	main.camera.lookAt(main.scene.position);
	//RENDERER
	//0x000088


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

		shape.lineTo(0, 0, cubeSize / cubeSpaces, 0);
		shape.lineTo(cubeSize / cubeSpaces, 0, +cubeSize / cubeSpaces, cubeSize / cubeSpaces);
		shape.lineTo(cubeSize / cubeSpaces, cubeSize / cubeSpaces, 0, cubeSize / cubeSpaces);
		shape.lineTo(0, cubeSize / cubeSpaces, 0, 0);

		mesh = new THREE.Mesh(
			new THREE.ShapeGeometry(shape),
			new THREE.MeshPhongMaterial({color: 0xff4444, wireframe: false})
		);
		mesh.material.opacity = o;
		mesh.position.set(x, y, z);
		mesh.rotation.set(rx, ry, rz);
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		main.scene.add(mesh);
		where = {mesh: mesh, args: args};
	}

	for (let i = 0; i < 30; i++) {
		cubeFaces.xFront.push([]);
		cubeFaces.xBack.push([]);
		cubeFaces.yFront.push([]);
		cubeFaces.yBack.push([]);
		cubeFaces.zFront.push([]);
		cubeFaces.zBack.push([]);
		for (let j = 0; j < 30; j++) {

			addCube({
				x    : -(cubeSize / 2) + j,
				y    : -(cubeSize / 2) + i,
				z    : cubeSize / 2,
				where: cubeFaces.zFront[i][j]
			});
			addCube({
				x    : -(cubeSize / 2) + (j + 1),
				y    : -(cubeSize / 2) + i,
				z    : -cubeSize / 2,
				where: cubeFaces.zBack[i][j],
				ry   : 29.85 * 2
			});
			addCube({
				x    : -(cubeSize / 2) + j,
				y    : -cubeSize / 2,
				z    : -(cubeSize / 2) + i,
				where: cubeFaces.yBack[i][j],
				rx   : -29.85
			});
			addCube({
				x    : -(cubeSize / 2) + j,
				y    : cubeSize / 2,
				z    : -(cubeSize / 2) + (i + 1),
				where: cubeFaces.yFront[i][j],
				rx   : 29.85
			});
			addCube({
				x    : cubeSize / 2,
				y    : -(cubeSize / 2) + j,
				z    : -(cubeSize / 2) + (i + 1),
				where: cubeFaces.xFront[i][j],
				ry   : -29.85
			});
			addCube({
				x    : -cubeSize / 2,
				y    : -(cubeSize / 2) + j,
				z    : -(cubeSize / 2) + i,
				where: cubeFaces.xBack[i][j],
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

	main.renderer = new THREE.WebGLRenderer();
	main.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	main.renderer.shadowMap.enabled = true;
	main.renderer.shadowMap.type = THREE.BasicShadowMap;
	main.container.appendChild(main.renderer.domElement);


	//ORBIT CONTROLS
	if (devControls) {
		addAxis();
	}

	controls = new THREE.OrbitControls(main.camera, main.renderer.domElement);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	animate();

}
function animate() {
	requestAnimationFrame(animate);
	light.position.set(main.camera.position.x, main.camera.position.y, main.camera.position.z);
	render();
	update();
	if (devControls) {
		axes.camera.rotation = main.camera.rotation;
		axes.camera.position.set(main.camera.position.x/10,main.camera.position.y/10,main.camera.position.z/10)
		axes.camera.lookAt(axes.scene.position);
	}
}
function onDocumentMouseMove(event) {
	mouse = {
		x: (event.clientX / window.innerWidth) * 2 - 1,
		y: -(event.clientY / window.innerHeight) * 2 + 1
	};
}
function render() {
	main.renderer.render(main.scene, main.camera);
	if (devControls) {
		axes.renderer.render(axes.scene, axes.camera);
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