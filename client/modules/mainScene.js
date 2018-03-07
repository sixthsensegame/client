let mesh, light;
let randomFunctions = require("./../modules/other/randomFunctions.js");
let main = module.exports = {
	cubeSize    : 30,
	cubeSegments: 30,
	sideNames   : ["xFront", "xBack", "yFront", "yBack", "zFront", "zBack"],
	cubeFaces   : {
		xFront: {grid: [], items: {}, color: 0x00FFDC},
		xBack : {grid: [], items: {}, color: 0xFFD800},
		yFront: {grid: [], items: {}, color: 0x9300FF},
		yBack : {grid: [], items: {}, color: 0x0FFF00},
		zFront: {grid: [], items: {}, color: 0xFF0000},
		zBack : {grid: [], items: {}, color: 0x0017FF}
	},
	scene       : null,
	camera      : null,
	renderer    : null,
	container   : null,
	loadScene   : {
		createBasics(document, window){
			for (let i = 0; i < main.sideNames.length; i++) {
				for (let q = 0; q < 30; q++) {
					main.cubeFaces[main.sideNames[i]].grid.push([]);
					for (let j = 0; j < 30; j++) {
						main.cubeFaces[main.sideNames[i]].grid[q].push("");
					}
				}
			}
			let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
			//SCENE AND CAMERA
			main.scene = new THREE.Scene();
			main.camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 20000);
			main.scene.add(main.camera);
//			main.camera.position.set(0, 150, 400);
			main.camera.position.set(62.8, 12.2, 1.6);
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
		createMainCubes(document, window){
			let textureLoader = new THREE.TextureLoader();
			let materials = [];

			function addSide(side) {
				let gridTexture = new textureLoader.load(`./../../textures/0x${randomFunctions.changeJSHexToCss(main.cubeFaces[side].color)}.png`);
				gridTexture.repeat.set(0.94, 0.94);
				gridTexture.offset.set(0, 0.065);

				materials.push(new THREE.MeshPhongMaterial({
					map      : gridTexture,
					color    : main.cubeFaces[side].color || 0xFF0000,
					wireframe: false
				}));
			}

			addSide("xFront");
			addSide("xBack");
			addSide("yFront");
			addSide("yBack");
			addSide("zFront");
			addSide("zBack");
			mesh = new THREE.Mesh(new THREE.BoxGeometry(main.cubeSize, main.cubeSize, main.cubeSize, main.cubeSegments, main.cubeSegments, main.cubeSegments), materials);
			mesh.name = "World";
			main.scene.add(mesh);
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