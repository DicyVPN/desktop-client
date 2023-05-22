import {app, shell, BrowserWindow, Tray, Menu, nativeImage, ipcMain, ipcRenderer} from 'electron'
import * as path from 'path'
import {electronApp, optimizer, is} from '@electron-toolkit/utils'
import * as electron from "electron";
import windowStateKeeper from "electron-window-state";
import fs from "fs";
import {apiPost} from "../../src/assets/api";
import {getCurrentServer} from "../../src/assets/storageUtils";

let mainWindow: BrowserWindow | null;
let mainWindowState: windowStateKeeper.State;


/** window creation */
function createWindow(): void {
    console.log(mainWindowState.x, mainWindowState.y, mainWindowState.width, mainWindowState.height);

    //set window dimension, title, icon and other
    mainWindow = new BrowserWindow({
        title: "Dicy VPN",
        show: false,
        autoHideMenuBar: true,
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        ...(process.platform === 'linux'
            ? {
                icon: path.join(__dirname, '../../build/icon.png')
            }
            : {
                icon: path.join(__dirname, '../../build/icon.ico')
            }),
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'),
            sandbox: false,
        }
    })
    mainWindowState.manage(mainWindow);
    mainWindow.webContents.openDevTools()

    //show main window when is ready
    mainWindow.on('ready-to-show', () => {
        mainWindow?.show()
    })

    //before window close
    mainWindow.on('close', function () {
        mainWindow = null
    })


    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return {action: 'deny'}
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    }

}

let tray: Tray;
app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    mainWindowState = windowStateKeeper({
        defaultWidth: 900,
        defaultHeight: 670
    });

    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    trayMaker()
})

ipcMain.on('connection', () => {
    connectionBottom = "Disconnetti";
    tray.setContextMenu(contextMenu())
})


let connectionBottom: string = 'Riconetti';

function trayMaker() {
    const img = nativeImage.createFromPath(path.join(__dirname, '../../build/icon.ico'))

    tray = new Tray(img);
    tray.setToolTip("DicyVPN")
    tray.setContextMenu(contextMenu())

    return tray
}

/** Create context menu for trey */
function contextMenu() {
    return Menu.buildFromTemplate([
        {
            label: 'Apri', click: () => {
                if (mainWindow != null) {
                    mainWindow.focus();
                    ipcMain.emit('disconnect')

                } else {
                    createWindow();
                }
            }
        },
        {
            label: connectionBottom, click: () => {
                (connectionBottom === 'Riconetti') ? mainWindow?.webContents.send("connect-preload") : mainWindow?.webContents.send("disconnect-preload")
            }
        },
        {label: 'Close', role: "quit"},
    ])
}

app.on('window-all-closed', () => {
    app.dock?.hide()
})

app.on('before-quit', () => {
    ipcMain.emit('disconnect')
    console.log("Emitted quit")
})

/** Stop VPN */
ipcMain.on('disconnect', async () => {
    const appData = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
    const appDataPath = appData + "/DicyVPN"

    const currentServer = getCurrentServer()
    try {
        await apiPost('/v1/servers/disconnect/' + currentServer.id, JSON.stringify({
            "type": currentServer.type,
            "protocol": currentServer.protocol
        }))
    } catch (e) {
        console.error(e)
    }

    if (!fs.existsSync(appDataPath + '/pid.pid')) return;

    return new Promise<void>((resolve, reject) => {
        const pid = Number(fs.readFileSync(appDataPath + '/pid.pid'))

        try {
            process.kill(pid, 'SIGTERM');
        } catch (e) {
            // the process does not exist anymore
            resolve();
        }

        let count = 0;
        setInterval(() => {
            try {
                process.kill(pid, 0);
            } catch (e) {
                // the process does not exist anymore
                resolve();
            }

            connectionBottom = "Riconnetti";
            tray.setContextMenu(contextMenu())

            if ((count += 100) > 10000) {
                reject(new Error("Timeout process kill"))
            }
        }, 100)
    })
})

