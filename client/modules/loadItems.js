let int;

let load = module.exports = {
	loaded:false,
	//list of things to load
	thingsToBeLoaded:[
		require("./axes.js").loadAxes,
		require("./mainScene.js").loadScene.createBasics,
		require("./mainScene").loadScene.createMainCubes
	],
	thingsLoaded:0,
	loadAnItem(document, window){
		document.getElementById("assets").innerHTML = `Loading assets: ${load.thingsLoaded} of ${load.thingsToBeLoaded.length}`;
		document.getElementById("loaded").style.width = `${100 / (load.thingsToBeLoaded.length / load.thingsLoaded)}%`;

		//if loaded everything
		if (load.thingsLoaded >= load.thingsToBeLoaded.length) {
			document.getElementById("assets").innerHTML = `Loaded assets: ${load.thingsLoaded} of ${load.thingsToBeLoaded.length}<br>Setting game up`;
			load.loaded = true;
			clearInterval(int);
			return;
		}
		//load the item
		load.thingsToBeLoaded[load.thingsLoaded](document,window);
		load.thingsLoaded++;
	},
	setUp(document,window) {
		document.body.style.backgroundImage = `url("./../../images/BlurredLogo.png")`;
		document.getElementById("version").innerHTML = `Version: ${require("./../config.json").version}`;
		//start loading
		int = setInterval(function(){
			load.loadAnItem(document,window);
		}, 100);
	}
};