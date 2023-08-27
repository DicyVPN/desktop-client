import fs from 'fs';
import * as path from 'path';
import {app, BrowserWindow, Menu, shell, Tray} from 'electron';
import * as electronRemote from '@electron/remote/main';
import {is, optimizer} from '@electron-toolkit/utils';
import windowStateKeeper from 'electron-window-state';
import {autoUpdater} from 'electron-updater';
import log from 'electron-log/main';
import './appinfo';
import * as ipc from './ipc';
import {PID_FILE_OPENVPN, PID_FILE_WIREGUARD} from './globals';
import settings from './settings';
import {getCurrentMonitor} from './vpn/monitor';
import {Status} from './vpn/status';
import {connect} from './vpn/vpn';

let mainWindow: BrowserWindow | null;
let mainWindowState: windowStateKeeper.State;

const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 670;

if (app.requestSingleInstanceLock()) {
    app.on('second-instance', focusWindow);
} else {
    app.quit();
}

const isStartup = process.argv.includes('--startup');
const isSilentStart = process.argv.includes('--silent');
let isQuitting = false;

electronRemote.initialize();
ipc.registerAll();
log.initialize({preload: true});
Object.assign(console, log.functions);

/** window creation */
function createWindow(): void {
    mainWindow = new BrowserWindow({
        title: 'DicyVPN',
        show: false,
        autoHideMenuBar: true,
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: DEFAULT_WIDTH,
        minHeight: DEFAULT_HEIGHT,
        ...(process.platform === 'linux'
            ? {
                icon: path.join(__dirname, '../../build/icon.png')
            }
            : {
                icon: path.join(__dirname, '../../build/icon.ico')
            }),
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    });

    mainWindowState.manage(mainWindow);
    if (mainWindowState.x && mainWindowState.y) {
        mainWindow.setBounds(mainWindowState); // fix scaling issue on windows
    }

    if (is.dev) {
        mainWindow.webContents.openDevTools();
    }

    // show main window when it is ready to be shown
    mainWindow.on('ready-to-show', () => {
        mainWindow?.show();
    });

    // before window close
    mainWindow.on('close', (e) => {
        if (!isQuitting && settings.get('app.minimizeOnClose', false)) {
            e.preventDefault();
            mainWindow!.minimize();
        } else {
            mainWindow = null;
        }
    });

    // allows to open external links by adding target="_blank"
    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return {action: 'deny'};
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    autoUpdater.checkForUpdatesAndNotify().then((result) => {
        console.log('update check result:', result);
    }).catch((err) => {
        console.log('update check error:', err);
    });
}

export function sendToRenderer(channel: string, ...args: any[]) {
    BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send(channel, ...args);
    });
}

app.whenReady().then(() => {
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    mainWindowState = windowStateKeeper({
        defaultWidth: DEFAULT_WIDTH,
        defaultHeight: DEFAULT_HEIGHT
    });

    if (!isSilentStart) {
        createWindow();
    }

    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow(); // need to create window when dock icon is clicked on macOS
    });

    trayMaker();
});

if (isStartup && settings.get('app.connectOnStartup') && settings.get('auth.token')) {
    const lastServer = settings.get<{id: string, type: string, protocol: 'wireguard' | 'openvpn'}>('lastServer');
    if (!lastServer) {
        console.info('No last server found, skipping startup connection');
    } else {
        console.info('Connecting to last server on startup, id:', lastServer.id, 'type:', lastServer.type);
        connect(lastServer.id, lastServer.type, lastServer.protocol, {}).then(() => {
            console.info('Startup connection successful');
        });
    }
}

let tray: Tray;
let connectionBottom: string = 'Riconnetti';

export function updateTray(isConnected: boolean) {
    connectionBottom = isConnected ? 'Disconnetti' : 'Riconnetti';
    tray.setContextMenu(contextMenu());
}

function trayMaker() {
    tray = new Tray(path.join(__dirname, process.platform === 'win32' ? '../../public/tray-icon.ico' : '../../public/tray-icon.png'));
    tray.setToolTip('DicyVPN');
    tray.setContextMenu(contextMenu());
    tray.on('double-click', focusWindow);
    return tray;
}

/** Create context menu for trey */
function contextMenu() {
    return Menu.buildFromTemplate([
        {
            label: 'Apri', click: focusWindow
        },
        {
            label: connectionBottom, click: async () => {
                if (connectionBottom === 'Riconnetti') {
                    // make sure the main window is visible
                    focusWindow();
                    sendToRenderer('reconnect-preload');
                } else {
                    await stopVPN();
                }
            }
        },
        {label: 'Close', role: 'quit'}
    ]);
}

function focusWindow() {
    if (mainWindow != null) {
        mainWindow.restore();
        mainWindow.focus();
        app.focus({
            steal: true
        });
    } else {
        createWindow();
    }
}

app.on('browser-window-created', (_, window) => {
    electronRemote.enable(window.webContents);
});

app.on('window-all-closed', () => {
    app.dock?.hide();
});

app.on('before-quit', async () => {
    isQuitting = true;
    await stopVPN();
});


export async function stopVPN(isSwitchingServer = false): Promise<void> {
    if (!isSwitchingServer) {
        getCurrentMonitor()?.setStatus(Status.DISCONNECTING);
    }
    await Promise.all([
        stopVPNFromPidFile(PID_FILE_WIREGUARD),
        stopVPNFromPidFile(PID_FILE_OPENVPN)
    ]);
    updateTray(false);
}

function stopVPNFromPidFile(pidFile: string): Promise<void> {
    if (!fs.existsSync(pidFile)) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
        if (!fs.existsSync(pidFile)) {
            resolve();
            return;
        }

        const pid = Number(fs.readFileSync(pidFile));

        try {
            process.kill(pid, 'SIGTERM');
        } catch (e) {
            // the process does not exist anymore
            if (fs.existsSync(pidFile)) {
                fs.unlinkSync(pidFile);
            }
            resolve();
        }

        let count = 0;
        const interval = setInterval(() => {
            try {
                process.kill(pid, 0);
            } catch (e) {
                // the process does not exist anymore
                if (fs.existsSync(pidFile)) {
                    fs.unlinkSync(pidFile);
                }
                clearInterval(interval);
                resolve();
            }

            if ((count += 100) > 10000) {
                clearInterval(interval);
                reject(new Error('Timeout process kill'));
            }
        }, 100);
    });
}
