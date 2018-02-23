let axes = module.exports = {
	scene:null,
	camera:null,
	renderer:null,
	container:null,
	appendAxes:function (document) {
		axes.container = document.getElementById("axes");
		axes.renderer = new THREE.WebGLRenderer();
		axes.renderer.setSize(200, 200);
		axes.container.appendChild(axes.renderer.domElement);

		axes.scene = new THREE.Scene();
		axes.camera = new THREE.PerspectiveCamera(45, 200 / 200, 0.1, 200000);
		axes.camera.up = main.camera.up;
		axes.scene.add(axes.camera);

		let axesHelper = new THREE.AxesHelper(10);
		axes.scene.add(axesHelper);
		axes.camera.lookAt(axes.scene.position);
		axes.camera.position.set(0, 20, 0);
	},
	removeAxes:function () {
		while(axes.scene.lastChild){
			axes.scene.removeChild(axes.scene.lastChild)
		}
		axes.scene = null;
		axes.camera = null;
		axes.renderer = null;
		axes.container=null;
	},
	animate:function (main) {
		axes.camera.rotation = main.camera.rotation;
		axes.camera.position.set(main.camera.position.x / 10, main.camera.position.y / 10, main.camera.position.z / 10);
		axes.camera.lookAt(axes.scene.position);
	},
	render:function (main) {
		axes.renderer.render(axes.scene, axes.camera);
	}
};