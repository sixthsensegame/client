let mesh, light;
let main = module.exports = {
	cubeSize    : 30,
	cubeSegments: 30,
	cubeFaces : {
		xFront: {grid: [], color: 0x00FFDC},
		xBack : {grid: [], color: 0xFFD800},
		yFront: {grid: [], color: 0x9300FF},
		yBack : {grid: [], color: 0x0FFF00},
		zFront: {grid: [], color: 0xFF0000},
		zBack : {grid: [], color: 0x0017FF}
	},
	scene       : null,
	camera      : null,
	renderer    : null,
	container   : null,
	loadScene   : {
		createBasics(document,window){
			let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
			console.log(SCREEN_WIDTH,SCREEN_HEIGHT);
			//SCENE AND CAMERA
			main.scene = new THREE.Scene();
			main.camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 20000);
			main.scene.add(main.camera);
			main.camera.position.set(0, 150, 400);
			main.camera.lookAt(main.scene.position);

			//LIGHT
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
			main.renderer.render(main.scene, main.camera);
		},
		createMainCubes(document,window){
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
				let size = main.cubeSize / main.cubeSegments;
				shape.lineTo(0, 0, size, 0);
				shape.lineTo(size, 0, size, size);
				shape.lineTo(size, size, 0, size);
				shape.lineTo(0, size, 0, 0);

				mesh = new THREE.Mesh(
					new THREE.ShapeGeometry(shape),
					new THREE.MeshPhongMaterial({color: main.cubeFaces[where[0]].color || 0xFFFFFF, wireframe: false})
				);
				mesh.material.opacity = o;
				mesh.position.set(x, y, z);
				mesh.rotation.set(rx, ry, rz);
				mesh.receiveShadow = true;
				mesh.castShadow = true;
				main.scene.add(mesh);
				main.cubeFaces[where[0]].grid[where[1]][where[2]] = {mesh: mesh, args: args};
			}

			for (let i = 0; i < main.cubeSize; i++) {
				main.cubeFaces.xFront.grid.push([]);
				main.cubeFaces.xBack.grid.push([]);
				main.cubeFaces.yFront.grid.push([]);
				main.cubeFaces.yBack.grid.push([]);
				main.cubeFaces.zFront.grid.push([]);
				main.cubeFaces.zBack.grid.push([]);
				for (let j = 0; j < main.cubeSize; j++) {
					addCube({
						x    : -(main.cubeSize / 2) + j,
						y    : -(main.cubeSize / 2) + i,
						z    : main.cubeSize / 2,
						where: ["zFront", i, j]
					});
					addCube({
						x    : -(main.cubeSize / 2) + (j + 1),
						y    : -(main.cubeSize / 2) + i,
						z    : -main.cubeSize / 2,
						where: ["zBack", i, j],
						ry   : 29.85 * 2
					});
					addCube({
						x    : -(main.cubeSize / 2) + j,
						y    : -main.cubeSize / 2,
						z    : -(main.cubeSize / 2) + i,
						where: ["yBack", i, j],
						rx   : -29.85
					});
					addCube({
						x    : -(main.cubeSize / 2) + j,
						y    : main.cubeSize / 2,
						z    : -(main.cubeSize / 2) + (i + 1),
						where: ["yFront", i, j],
						rx   : 29.85
					});
					addCube({
						x    : main.cubeSize / 2,
						y    : -(main.cubeSize / 2) + j,
						z    : -(main.cubeSize / 2) + (i + 1),
						where: ["xFront", i, j],
						ry   : -29.85
					});
					addCube({
						x    : -main.cubeSize / 2,
						y    : -(main.cubeSize / 2) + j,
						z    : -(main.cubeSize / 2) + i,
						where: ["xBack", i, j],
						ry   : 29.85
					});
				}
			}
		}
	},
	appendScene(document){
		main.container = document.body;
		main.container.appendChild(main.renderer.domElement);
	},
	animateScene(){
		light.position.set(main.camera.position.x, main.camera.position.y, main.camera.position.z);
	},
	render(){
		main.renderer.render(main.scene, main.camera);
	}
};