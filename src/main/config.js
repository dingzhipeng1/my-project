const {app,ipcMain} = require('electron')
const Config = require('electron-config');
const config = new Config();
config.set('filepath',app.getPath('userData'))
export default  config
