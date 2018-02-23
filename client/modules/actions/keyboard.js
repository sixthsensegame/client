let keys = module.exports = {
	devControls:false,
	keyboard:[],
	checkKeys: function (window) {
		keys.keyboard = [];
		window.addEventListener('keydown', keyDown);
		window.addEventListener('keyup', keyUp);
		function keyDown(event) {
			keys.keyboard[event.keyCode] = true;
		}

		function keyUp(event) {
			console.log(event);
			console.log(`The { ${event.key} } aka ${event.code} key was pressed, KeyCode: ${event.keyCode}`);
			if (keys.keyboard[192]&&event.shiftKey) {
				keys.devControls = !keys.devControls;
			}
			keys.keyboard[event.keyCode] = false
		}

	}
};