const { app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')
const todesktop = require("@todesktop/runtime");
var fs = require('fs')
todesktop.init();

var dir = './history';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}


function createWindow () {
    let win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadURL(url.format ({
        pathname: path.join(__dirname, 'src/excel.html'),
        protocol: 'file:',
        slashes: true,

    }))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})


const {ipcMain} = require('electron')

// receive message from index.html
ipcMain.on('asynchronous-message', (event, arg) => {
    win.loadFile('src/excel.html')

    // send message to index.html
    event.sender.send('asynchronous-reply', 'hello' );
});