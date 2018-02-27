let axes = module.exports = {
	scene:null,
	camera:null,
	renderer:null,
	container:null,
	//Load the axes, (ran when loading)
	loadAxes:function () {
		axes.renderer = new THREE.WebGLRenderer();
		axes.renderer.setSize(200, 200);

		axes.scene = new THREE.Scene();
		axes.camera = new THREE.PerspectiveCamera(45, 200 / 200, 0.1, 200000);
		axes.scene.add(axes.camera);

		let axesHelper = new THREE.AxesHelper(10);
		axes.scene.add(axesHelper);
		//SET CAMERA TO LOOK AT AXES
		axes.camera.lookAt(axes.scene.position);
		axes.camera.position.set(0, 20, 0);

	},
	appendAxes:function (document) {
		//Since axes is loaded all we need to do is append the axes
		axes.container = document.getElementById("axes");
		axes.container.appendChild(axes.renderer.domElement);
	},
	animate:function (main) {
		//Make the axes rotate with the camera
		axes.camera.up = main.camera.up;
		axes.camera.rotation = main.camera.rotation;
		axes.camera.position.set(main.camera.position.x / 10, main.camera.position.y / 10, main.camera.position.z / 10);
		axes.camera.lookAt(axes.scene.position);
	},
	render:function (main) {
		axes.renderer.render(axes.scene, axes.camera);
	}
};