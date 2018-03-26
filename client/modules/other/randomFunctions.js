let randomFunction = module.exports = {
	changeJSHexToCss: function (hexCode) {//Changes the Javascript's HEX code to a CSS's HEX code
		hexCode = hexCode.toString(16);
		let zeros = "";
		for (let i = hexCode.length; i < 6; i++) {
			zeros += "0";
		}
		return `${zeros}${hexCode}`;
	},
	random          : function (max, min) {
		min = min || 0;
		max = max || 100;
		return min + Math.round(Math.random() * max);
	},//returns a rounded random number (used when testing)
	getFaceCoords   : function (idx, side, theCubeSize, rot, MainCubeSize) {
		rot = rot || 0;
		idx = idx || 0;
		side = side || "zFront";
		theCubeSize = theCubeSize || [1, 1, 1];
		let cubeSize = [theCubeSize[0], theCubeSize[1], theCubeSize[2]];

		if (rot === 1 || rot === 3) {
			cubeSize[0] = theCubeSize[1];
			cubeSize[1] = theCubeSize[0];
		}
		let flip = true;
		MainCubeSize = MainCubeSize || 30;
		if (idx < 0) return;
		let pos = [0, idx];
		if (idx >= MainCubeSize) {
			while (idx >= MainCubeSize) {
				idx -= MainCubeSize;
				pos[0]++;
			}
			pos[1] = idx;
		}
		let position = {
			x: 0,
			y: 0,
			z: 0
		};
		let rotation = {
			x: 0,
			y: 0,
			z: 0
		};
		let size = {
			x: 0,
			y: 0,
			z: 0
		};
		switch (side) {
			case "zFront":
				position.z += MainCubeSize / 2;
				position.z += cubeSize[2] / 2;

				//2 = y+=0.5
				//2 = x+=0.5 | y+=0.25

				//3 = x-=0.5 | y+=0.5
				//3 =

				position.x -= MainCubeSize / 2;
				position.x += pos[1];
				position.x += flip ? cubeSize[0] / 2 : 0;

				position.y += MainCubeSize / 2;
				position.y -= flip ? cubeSize[1] / 2 : 0;
				position.y -= pos[0];

				size.x = cubeSize[0];
				size.y = cubeSize[1];
				size.z = cubeSize[2];
				break;
			case "zBack":
				position.z -= MainCubeSize / 2;
				position.z -= cubeSize[2] / 2;

				position.x += MainCubeSize / 2;
				position.x -= flip ? cubeSize[0] / 2 : 0;
				position.x -= pos[1];

				position.y += MainCubeSize / 2;
				position.y -= flip ? cubeSize[1] / 2 : 0;
				position.y -= pos[0];

				size.x = cubeSize[0];
				size.y = cubeSize[1];
				size.z = cubeSize[2];

				break;
			case "xFront":
				position.x += MainCubeSize / 2;
				position.x += cubeSize[2] / 2;

				position.z += MainCubeSize / 2;
				position.z -= flip ? cubeSize[0] / 2 : 0;
				position.z -= pos[1];

				position.y += MainCubeSize / 2;
				position.y -= flip ? cubeSize[1] / 2 : 0;
				position.y -= pos[0];

				size.x = cubeSize[2];
				size.y = cubeSize[1];
				size.z = cubeSize[0];
				break;
			case "xBack":
				position.x -= MainCubeSize / 2;
				position.x -= cubeSize[2] / 2;

				position.z -= MainCubeSize / 2;
				position.z += flip ? cubeSize[0] / 2 : 0;
				position.z += pos[1];

				position.y += MainCubeSize / 2;
				position.y -= flip ? cubeSize[1] / 2 : 0;
				position.y -= pos[0];

				size.x = cubeSize[2];
				size.y = cubeSize[1];
				size.z = cubeSize[0];
				break;
			case "yFront":
				position.y += MainCubeSize / 2;
				position.y += cubeSize[2] / 2;

				position.z -= MainCubeSize / 2;
				position.z += flip ? cubeSize[1] / 2 : 0;
				position.z += pos[0];

				position.x -= MainCubeSize / 2;
				position.x += flip ? cubeSize[0] / 2 : 0;
				position.x += pos[1];

				size.x = cubeSize[0];
				size.y = cubeSize[2];
				size.z = cubeSize[1];
				break;
			case "yBack":
				position.y -= MainCubeSize / 2;
				position.y -= cubeSize[2] / 2;

				position.z += MainCubeSize / 2;
				position.z -= flip ? cubeSize[1] / 2 : 0;
				position.z -= pos[0];

				position.x -= MainCubeSize / 2;
				position.x += flip ? cubeSize[0] / 2 : 0;
				position.x += pos[1];

				size.x = cubeSize[0];
				size.y = cubeSize[2];
				size.z = cubeSize[1];
		}
		return {position, rotation, size, pos};
	}
};