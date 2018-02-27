let config = require("./../../config.json");
let keys = module.exports = {
	devControls:false,
	keyboard:[],
	checkKeys: function (window) {
		keys.keyboard = [];
		//check if keys are being pressed
		window.addEventListener('keydown', keyDown);
		window.addEventListener('keyup', keyUp);


		function keyDown(event) {
			if(config.devSettings.consolesKeyPresses && !keys.keyboard[event.keyCode]) console.log(`The { ${event.key} } aka ${event.code} key is being pressed, KeyCode: ${event.keyCode}`);
			keys.keyboard[event.keyCode] = true;
		}
		function keyUp(event) {
			if(config.devSettings.consolesKeyPresses) console.log(`The { ${event.key} } aka ${event.code} key is no longer pressed, KeyCode: ${event.keyCode}`);
			//if Shift + Backqoute is pressed
			if (keys.keyboard[192]&&event.shiftKey) {
				keys.devControls = !keys.devControls;
			}

			keys.keyboard[event.keyCode] = false
		}

	}
};