let mouseHoverOverPieceDoesWhat = {
	swapColorTo:0xffff00,
	changesWireFrameTo:false,
	changesOpacityTo:1,
};

let scene, camera, renderer, controls, INTERSECTED, light,mesh;
let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
let mouse = {x: 0, y: 0};
let container;
let cubeSize = 30;
let cubeSpaces = 30;


function onScreenLoad() {
	container = document.body;
	scene = new THREE.Scene();

	//CAMERA
	camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 20000);
	scene.add(camera);
	camera.position.set(0, 150, 400);
	camera.lookAt(scene.position);
	//RENDERER


	//0x000088
	cube = new THREE.Mesh(
		new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize, cubeSpaces, cubeSpaces, cubeSpaces),
		new THREE.MeshPhongMaterial({color: 0xff4444, wireframe: false})
	);
	cube.position.set(0, 0, 0);
	cube.receiveShadow = true;
	cube.castShadow = true;
	scene.add(cube);

	//the little "selectable" cubes
	function addCube(x,y,z,where,o) {
		o = o || 0;
		mesh = new THREE.Mesh(
			new THREE.BoxGeometry(cubeSize / cubeSpaces, cubeSize / cubeSpaces, 0.1),
			new THREE.MeshPhongMaterial({color: 0xff4444, wireframe: false,transparent:true})
		);
		mesh.material.opacity = o;
		mesh.position.set(x,y,z);
		mesh.receiveShadow = true;
		scene.add(mesh);
		//where = mesh;

	}
	for(let i =0;i<30;i++){
		for(let j =0;j<30;j++) {
			addCube(-(cubeSize/2-0.5) + j, -(cubeSize/2-0.5) + i, cubeSize/2 + 0.1);
			addCube(-(cubeSize/2-0.5) + j, -(cubeSize/2-0.5) + i, -cubeSize/2 - 0.1);
		}
	}
	// LIGHT
	let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);

	light = new THREE.PointLight(0xffffff, 0.2);
	light.position.set(camera.position.x, camera.position.y, camera.position.z);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 1000;
	scene.add(light);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	container.appendChild(renderer.domElement);
	//ORBIT CONTROLS
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	animate();


}
function animate() {
	requestAnimationFrame(animate);
	light.position.set(camera.position.x, camera.position.y, camera.position.z);
	console.log(light.position.x);
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
	renderer.render(scene, camera);
}
function update() {
	let vector = new THREE.Vector3(mouse.x, mouse.y, 1);
	vector.unproject(camera);
	let ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
	let intersects = ray.intersectObjects(scene.children);
	if (intersects.length > 0) {
		if (intersects[0].object != INTERSECTED) {
			if (INTERSECTED) {
				INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
				INTERSECTED.material.wireframe = false;
				INTERSECTED.material.opacity=0;
			}
			INTERSECTED = intersects[0].object;
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			INTERSECTED.material.wireframe = mouseHoverOverPieceDoesWhat.changesWireFrameTo;
			INTERSECTED.material.opacity=mouseHoverOverPieceDoesWhat.changesOpacityTo;
			INTERSECTED.material.color.setHex(mouseHoverOverPieceDoesWhat.swapColorTo);
		}
	}
	else {
		if (INTERSECTED) {
			INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
			INTERSECTED.material.wireframe = false;
			INTERSECTED.material.opacity=0;
		}
		INTERSECTED = null;
	}
	controls.update();
}
window.onload = onScreenLoad;