const {app, ipcMain} = require('electron')
import config from "./config";
import log from './log'


ipcMain.on('configset', (event, arg) => {
    app.getPath('userData')
    config.set(arg.name, arg.value)
})

ipcMain.on('configget', (event, name) => {

    try {
        event.returnValue = config.get(name)
    } catch (e) {
        event.returnValue = ''
    }

})


ipcMain.on('log', (event, arg) => {

    log.info(arg)
})


