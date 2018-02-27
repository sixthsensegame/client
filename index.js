const electron = require('electron'),
	path = require('path'),
	url = require('url');
let {app, BrowserWindow, ipcMain} = electron,
	win;
//
let i;

const createWindow = () => {
	win = new BrowserWindow({fullscreen: true, width: electron.screen.getPrimaryDisplay().workAreaSize.width, height: electron.screen.getPrimaryDisplay().workAreaSize.height, frame: false});
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'client/pages/main/main.html'),
		protocol: 'file:',
		slashes: true
	}));

	win.on('closed', () => win = null);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform != 'darwin') app.quit();
});

app.on('activate', () => {
	if (win === null) createWindow();
});