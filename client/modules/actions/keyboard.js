let config = require("./../../config.json");
let playerData = require("./../../playerData.json");

let keys = module.exports = {
	devControls: false,
	lastNumber : null,
	keyboard   : [],
	checkKeys  : function (window) {
		keys.keyboard = [];
		//check if keys are being pressed
		window.addEventListener('keydown', keyDown);
		window.addEventListener('keyup', keyUp);


		function keyDown(event) {
			if (config.devSettings.logs.keysPress && !keys.keyboard[event.keyCode]) console.log(`The { ${event.key} } aka ${event.code} key is being pressed, KeyCode: ${event.keyCode}`);
			keys.keyboard[event.keyCode] = true;
		}

		function keyUp(event) {
			if (config.devSettings.logs.keysPress) console.log(`The { ${event.key} } aka ${event.code} key is no longer pressed, KeyCode: ${event.keyCode}`);
			if (keys.keyboard[192] && event.shiftKey) {//if Shift + Backqoute is pressed
				keys.devControls = !keys.devControls;
			}
			if (keys.keyboard[66] && event.shiftKey) {
				if (!config.devSettings.loggedBuildControls && config.devSettings.logs.controls) {
					console.log(config.devSettings.controls.builder.join("\n"));
					config.devSettings.loggedBuildControls = true;
				}
				playerData.buildMode = !playerData.buildMode;
				playerData.cameraMode = !playerData.cameraMode;
			}

			for (let i = 0; i < 9; i++) {
				if (keys.keyboard[48 + i]) {
					keys.lastNumber = i;
				}
			}
			keys.keyboard[event.keyCode] = false
		}

	}
};