const { app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')
const todesktop = require("@todesktop/runtime");
const fs = require('fs');
todesktop.init();


// create the history directory
const dir = './history';
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
