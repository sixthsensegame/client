let Imports = {
	keyboard  : require("./keyboard.js"),
	main      : require("./../mainScene"),
	config    : require("./../../config.json"),
	playerData: require("./../../playerData.json"),
	random    : require("./../other/randomFunctions.js")
};
function checkIfCanPlace(cubeSize, cubePos, mapSize, side, rotation) {
	cubeSize = cubeSize || [1, 1, 1];
	side = side || "zFront";
	cubePos = cubePos || [0, 0];
	mapSize = mapSize || 30;
	rotation = rotation || 0;
	cubeSize = [cubeSize[2], cubeSize[1], cubeSize[0]];

	let Continue = false;
	for (let i = 0; i < cubeSize.length; i++) {
		if (cubeSize[i] > 1) {
			Continue = true;
		}
	}
	if (!Continue) {
		return true;
	}
	if (rotation > 3) {
		while (rotation > 3) {
			rotation -= 4;
		}
	}
	if (rotation === 1) {
		cubeSize = [cubeSize[0], cubeSize[2], cubeSize[1]];
	}
	let grid = Imports.main.cubeFaces[side].grid;
	for (let i = cubePos[0]; i < cubePos[0] + cubeSize[1]; i++) {
		if (i >= mapSize)return `cannot place past the border`;
		for (let j = cubePos[1]; j < cubePos[1] + cubeSize[2]; j++) {
			if (j >= mapSize) return `cannot place past the border`;
			if (grid[i][j].length > 0) {
				return `overlaps a building`;
			}
		}
	}

	return true;
}
function createCube(size, opac) {
	let mesh;
	opac = opac || false;
	let face = Imports.random.getFaceCoords(
		mouse.shortIdx,
		Imports.main.sideNames[Math.floor(mouse.INTERSECTED.faceIndex / 1800)],
		size,
		mouse.rotation,
		Imports.main.cubeSize);
	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(face.size.x, face.size.y, face.size.z),
		new THREE.MeshPhongMaterial({color: 0x3232FF, wireframe: false})
	);
	mesh.position.set(face.position.x, face.position.y, face.position.z);
	mesh.rotation.set(face.rotation.x, face.rotation.y, face.rotation.z);
	if (opac) {
		mesh.material.transparent = true;
		mesh.material.opacity = 0.7;
		mesh.name = "hoverTest"
	}
	return {obj: mesh, pos: face.pos};
}
let cubeSizes = [
	[1, 1, 1],
	[2, 1, 1],
	[3, 1, 1],
	[4, 1, 1],
	[2, 2, 1],
	[3, 2, 1],
	[3, 3, 1],
	[4, 3, 1],
	[4, 4, 1]
];
let mouse = module.exports = {
		realIdx      : -1,
		intersections: [],
		rotation     : 0,
		INTERSECTED  : null,
		world        : null,
		selectable   : false,
		hover        : null,
		x            : 0,
		y            : 0,
		setUp        : function (document) {
			document.addEventListener('mousemove', mouse.update, false);
			document.addEventListener('mouseup', mouse.click, false);
			document.addEventListener('wheel', mouse.onScroll, false);
		},
		onScroll     : function (event) {
			if (Imports.playerData.buildMode) {
				if (event.wheelDelta > 0) {
					mouse.rotation++;
				}
				else {
					mouse.rotation--;
				}
				if (mouse.rotation > 3) mouse.rotation = 0;
				if (mouse.rotation < 0) mouse.rotation = 3;
			}
			else {
			}
		},
		update       : function (event) {
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		},
		click        : function (event) {
			//event.button === 0 || LEFT CLICK
			//event.button === 1 || MIDDLE CLICK
			//event.button === 2 || RIGHT CLICK
			if (mouse.intersects.length === 0) return;
			if (event.button === 0) {
				if (Imports.playerData.buildMode) {
					let mesh = createCube(cubeSizes[Imports.keyboard.lastNumber - 1], false);
					let canPlace = checkIfCanPlace(cubeSizes[Imports.keyboard.lastNumber - 1], mesh.pos, Imports.main.cubeSize, Imports.main.sideNames[Math.floor(mouse.INTERSECTED.faceIndex / 1800)], mouse.rotation);
					if (typeof canPlace === "boolean") {
						Imports.main.scene.add(mesh.obj);
						if (Imports.config.devSettings.logs.placement) {
							console.log(`Placed a ${cubeSizes[Imports.keyboard.lastNumber - 1].join("x")} at 
							${mesh.pos.join("x")}`);
						}
						let grid = Imports.main.cubeFaces[Imports.main.sideNames[Math.floor(mouse.INTERSECTED.faceIndex / 1800)]].grid;
						let cSize = cubeSizes[Imports.keyboard.lastNumber - 1];
						let pos = mesh.pos;
						if (mouse.rotation === 0) cSize = [cSize[1], cSize[0], cSize[2]];
						let alphabet = "abcdefghijklmnopqrstuvwxyz";
						for (let i = pos[0]; i < pos[0] + cSize[0]; i++) {
							for (let j = pos[1]; j < pos[1] + cSize[1]; j++) {
								grid[i][j] = alphabet[Imports.random.random(1, 20)];
							}
						}
					}
					else {
						console.warn(`ERRT (noise to be added)\nYou cannot place there as it ${canPlace}`);
					}
				}
			}
			else if (event.button === 1) {
				mouse.rotation++;
				if (mouse.rotation < 0) {
					mouse.rotation = 1;
				}
				else if (mouse.rotation > 1) {
					mouse.rotation = 0;
				}
			}
			else if (event.button === 2) {
				mouse.rotation++;
				if (mouse.rotation < 0) {
					mouse.rotation = 1;
				}
				else if (mouse.rotation > 1) {
					mouse.rotation = 0;
				}
				if (Imports.playerData.buildMode) {
					Imports.keyboard.lastNumber = null;
				}
				//	mouse.rotation -= 156;
			}
		},
		animate      : function (main) {
			let vector = new THREE.Vector3(mouse.x, mouse.y, 1);
			vector.unproject(main.camera);
			let ray = new THREE.Raycaster(main.camera.position, vector.sub(main.camera.position).normalize());
			mouse.intersects = ray.intersectObjects(main.scene.children);
			if (mouse.intersects.length > 0) {
				mouse.INTERSECTED = mouse.intersects[0];
				mouse.INTERSECTED = mouse.intersects[0];
				if (mouse.INTERSECTED.object.name === "hoverTest") {
					for (let i = 0; i < mouse.intersects.length; i++) {
						if (mouse.intersects[i].object.name !== "hoverTest") {
							mouse.INTERSECTED = mouse.intersects[i];
							break;
						}
					}
					if (mouse.world && mouse.INTERSECTED.object.name === "hoverTest") {
						mouse.INTERSECTED = mouse.world;
					}
				}
				mouse.realIdx = mouse.INTERSECTED.faceIndex;
				mouse.shortIdx = Math.floor(mouse.realIdx / 2);
				if (mouse.shortIdx >= 900) {
					while (mouse.shortIdx >= 900) {
						mouse.shortIdx -= 900;
					}
				}
				if (mouse.hover != null) main.scene.remove(mouse.hover.obj);
				mouse.hover = null;
				mouse.selectable = mouse.INTERSECTED.object.name === "World";
				if (mouse.selectable) {
					if (Imports.playerData.buildMode && Imports.keyboard.lastNumber) {
						mouse.world = mouse.INTERSECTED;
						mouse.hover = createCube(cubeSizes[Imports.keyboard.lastNumber - 1], true);
						let canPlace = checkIfCanPlace(cubeSizes[Imports.keyboard.lastNumber - 1], mouse.hover.pos, Imports.main.cubeSize, Imports.main.sideNames[Math.floor(mouse.INTERSECTED.faceIndex / 1800)], mouse.rotation);
						if (typeof canPlace === "boolean") {
							main.scene.add(mouse.hover.obj);
						}
					}
				}
			}
			else {
				if (mouse.hover
				) {
					Imports.main.scene.remove(mouse.hover);
				}
				mouse.INTERSECTED = null;
			}
		}
	}
;