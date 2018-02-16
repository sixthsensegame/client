
let mouseHoverOverPieceDoesWhat = {
	swapColorTo:0xffff00,
	changesWireFrameTo:true,
};

let scene, camera, renderer, controls, INTERSECTED, light,mesh;
let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
let mouse = {x: 0, y: 0};
let container;
let cubeSize = 30;
let cubeSpaces = 30;


let cubeFaces = {
	xFront:[[]],
	xBack:[],
	yFront:[],
	yBack:[],
	zFront:[],
	zBack:[]
};

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


	//the little "selectable" cubes
	function addCube(args) {
		let x,y,z,rx,ry,rz,where,o;

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

		shape.lineTo(0,0,cubeSize/cubeSpaces,0);
		shape.lineTo(cubeSize/cubeSpaces,0,+cubeSize/cubeSpaces,cubeSize/cubeSpaces);
		shape.lineTo(cubeSize/cubeSpaces,cubeSize/cubeSpaces,0,cubeSize/cubeSpaces);
		shape.lineTo(0,cubeSize/cubeSpaces,0,0);

		mesh = new THREE.Mesh(
			new THREE.ShapeGeometry(shape),
			new THREE.MeshPhongMaterial({color:0xff4444, wireframe:false})
		);
		mesh.material.opacity = o;
		mesh.position.set(x,y,z);
		mesh.rotation.set(rx,ry,rz);
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		scene.add(mesh);
		where={mesh:mesh,args:args};
	}
	for(let i =0;i<30;i++){
		cubeFaces.xFront.push([]);
		cubeFaces.xBack.push([]);
		cubeFaces.yFront.push([]);
		cubeFaces.yBack.push([]);
		cubeFaces.zFront.push([]);
		cubeFaces.zBack.push([]);
		for(let j =0;j<30;j++) {

			addCube({
				x    : -(cubeSize / 2) + j,
				y    : -(cubeSize / 2) + i,
				z    : cubeSize/2,
				where: cubeFaces.zFront[i][j]
			});
			addCube({
				x    : -(cubeSize / 2) + (j+1),
				y    : -(cubeSize / 2) + i,
				z    : -cubeSize / 2,
				where: cubeFaces.zBack[i][j],
				ry:29.85*2
			});
			addCube({
				x    : -(cubeSize / 2) + j,
				y    : -cubeSize / 2,
				z    : -(cubeSize / 2) + i,
				where: cubeFaces.yBack[i][j],
				rx:-29.85,
			});
			addCube({
				x    : -(cubeSize / 2) + j,
				y    : cubeSize / 2,
				z    : -(cubeSize / 2) + (i + 1),
				where: cubeFaces.yFront[i][j],
				rx:29.85,
			});
			addCube({
				x    : cubeSize / 2,
				y    : -(cubeSize / 2) + j,
				z    : -(cubeSize / 2) + (i+1),
				where: cubeFaces.xFront[i][j],
				ry:-29.85,
			});
			addCube({
				x    : -cubeSize / 2,
				y    : -(cubeSize / 2) + j,
				z    : -(cubeSize / 2) + i,
				where: cubeFaces.xBack[i][j],
				ry:29.85,
			});
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

	let axesHelper = new THREE.AxesHelper( 100 );
	scene.add(axesHelper);
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