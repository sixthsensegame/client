let Imports = {
	main      : require("./mainScene"),
	playerData: require("./../playerData.json")
};
let camControls = module.exports = {
	canScroll: true,

	xRot     : 0,
	yRot     : 0,
	zRot     : 0,
	camZoom  : 100,
	minScoll : 0,
	maxScroll: 100,
	drag     : function (event) {
		if (!Imports.playerData.cameraMode) return;
		let pos = {
			x: 0,
			y: 0,
			z: 0
		};
		let rot = {
			x: 0,
			y: 0,
			z: 0
		};
		if (true) {
			camControls.xRot -= event.movementX / 100;
			camControls.zRot -= event.movementX / 100;
			if (camControls.xRot < 0) camControls.xRot = 6;
			if (camControls.xRot > 6) camControls.xRot -= 6;

			if (camControls.zRot < 0) camControls.zRot = 6;
			if (camControls.zRot > 6) camControls.zRot -= 6;

			pos.x = Math.sin(camControls.xRot) * 300;
			pos.z = Math.cos(camControls.zRot) * 300;
		}
		else {
			camControls.yRot -= event.movementY / 100;
			camControls.zRot -= event.movementY / 100;

			pos.z = Math.cos(camControls.zRot) * 300;
			pos.y = Math.sin(camControls.yRot) * 300;
		}
		Imports.main.camera.position.set(pos.x, pos.y, pos.z);
		//Imports.main.camera.rotation.set(rot.x,rot.y,rot.z);
		Imports.main.camera.lookAt(Imports.main.scene.position);
//		camControls.update();
	},
	update   : function () {
		let camPosRad = {
//			x: THREE.Math.degToRad(camControls.cameraPosDeg.x),
//			y: THREE.Math.degToRad(camControls.cameraPosDeg.y),
//			z: THREE.Math.degToRad(camControls.cameraPosDeg.z)
		};
		//Imports.main.camera.position.set(camPosRad.x,camPosRad.y,camPosRad.z);
		//Imports.main.camera.lookAt(Imports.main.scene);

		Imports.main.camera.position.set(0, -1.9, 99.9);
		Imports.main.camera.rotation.set(0.019016726310519573, 0, 0);
	},
	setUp    : function () {

	},
	scroll   : function (event) {
		if (!camControls.canScroll) return;
		if (event.wheelDelta < 0) {
			camControls.camZoom += 5;
		}
		else {
			camControls.camZoom -= 5;
		}
		camControls.update();
		//	Imports.main.camera.position.set(newCamPos.x,newCamPos.y,newCamPos.z);
	}
}
