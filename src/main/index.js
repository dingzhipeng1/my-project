import {app, BrowserWindow} from 'electron'
import './event'
import log from "./log";


const http = require('http');
// const ms = require('mediaserver');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
    /**
     * Initial window options
     */

    mainWindow = new BrowserWindow({
        height: 563,
        useContentSize: true,
        width: 1000
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })
    var constant = {
        WIN_WIDTH: 1000,
        WIN_HEIGHT: 600,
        VIEW_READY: 'viewReady',
        INIT_CONFIG: 'initConfig',
        SAVE_CONFIG: 'saveConfig',
        CURRENT_ID: 'currentId',
        MUSIC_PATH: 'musicPath',
        LIKED_LIST: 'likedList',
        PLAY_STYLE: 'playStyle',
        PREFERENCES: 'preferences',
    };

    /*startMusicServer(port => {
        ipcMain.on(constant.VIEW_READY, event => {
            event.sender.send(
                constant.INIT_CONFIG,
                Object.assign(store.config, {
                    port,
                    allowKeys,
                })
            );
        });

        ipcMain.on(constant.SAVE_CONFIG, (event, {key, value}) => {
            store.set(key, value);
        });

        mainWindow.loadURL(winURL);
    });*/

}

function startMusicServer(callback) {
    const server = http.createServer(pipeMusic).listen(0, () => {
        callback(server.address().port);
    });

    return server;
}

function pipeMusic(req, res) {
    const musicUrl = decodeURIComponent(req.url);
    const extname = path.extname(musicUrl);
    if (allowKeys.indexOf(extname) < 0) {
        return notFound(res);
    }

    const fileUrl = path.join(
        store.get(constant.MUSIC_PATH),
        musicUrl.substring(1)
    );

    if (!fs.existsSync(fileUrl)) {
        return notFound(res);
    }

    ms.pipe(req, res, fileUrl);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})


const {ipcMain} = require('electron')
ipcMain.on('yibu', (event, arg) => {

    event.sender.send('yibu', arg)
})

ipcMain.on('tongbu', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = 'tongbuzhi'
})

ipcMain.on("axiosgetdata", returndata)

function returndata(event, arg) {
    getData(arg).then(res => {
        event.sender.send(arg.callbackName, res)
    })
}


function getData(arg) {
    const {net} = require('electron')
    var qs = require('querystring');
    var data = qs.stringify(arg.data)
    var option = {
        method: arg.method,
        url: arg.url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    const request = net.request(option)
    return new Promise((r, s) => {
        request.on('response', (response) => {
            var dataBuffer = '';
            response.on('data', (chunk) => {
                // console.log(`${chunk}`)

                dataBuffer += chunk

            })
            response.on('end', () => {
                //event.sender.send("getlistData", `${dataBuffer}`)
                r(`${dataBuffer}`)
            })
        })
        request.write(data)
        request.end()
    })

}


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
