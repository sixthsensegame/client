# sixthsenseclient
The client is the part that the User will run to play the game.
the client will be the main part of the project as it will need to hold all the images and code to be able to see/use the game
<br>The file`./OrbitControls.js` is a module that I use to make sure that I am building everything in threejs correctly as with this module I can move the camera freely. although this file will be deleted as soon as camera controls are added<br>
The file `./three.min.js` is the threejs script, instead of requiring from node, it was simpler to copy it into a script for the HTML to require instead
<br>The File `./index.js` this is the part that runs the application via electron<br>
Although for better testing expierence run the HTML file `./client/main.html` as `./index.js` basically does this only in an application
<br>`main.html` is the file that will get ran when the game first starts out. it requires `./client/main.js`,`./OrbitControls.js` and `./three.min.js`  