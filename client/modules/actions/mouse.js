let mouse = module.exports = {
	intersections: [],
	INTERSECTED  : null,
	x            : 0,
	y            : 0,
	setUp        : function (document) {
		document.addEventListener('mousemove', mouse.update, false);
	},
	update       : function (event) {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	},
	animate      : function (main) {
		let vector = new THREE.Vector3(mouse.x, mouse.y, 1);
		vector.unproject(main.camera);
		let ray = new THREE.Raycaster(main.camera.position, vector.sub(main.camera.position).normalize());
		mouse.intersects = ray.intersectObjects(main.scene.children);
		if (mouse.intersects.length > 0) {
			if (mouse.intersects[0].object != mouse.INTERSECTED) {
				if (mouse.INTERSECTED) {
					mouse.INTERSECTED.material.color.setHex(mouse.INTERSECTED.currentHex);
					mouse.INTERSECTED.material.wireframe = false;
				}
				mouse.INTERSECTED = mouse.intersects[0].object;
				mouse.INTERSECTED.currentHex = mouse.INTERSECTED.material.color.getHex();
				mouse.INTERSECTED.material.wireframe = mouse.mouseHoverOverPieceDoesWhat.changesWireFrameTo;
				mouse.INTERSECTED.material.color.setHex(mouse.mouseHoverOverPieceDoesWhat.swapColorTo);
			}
		}
		else {
			if (mouse.INTERSECTED) {
				mouse.INTERSECTED.material.color.setHex(mouse.INTERSECTED.currentHex);
				mouse.INTERSECTED.material.wireframe = false;
			}
			mouse.INTERSECTED = null;
		}
	}
};