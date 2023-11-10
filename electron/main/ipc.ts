import fs from 'fs';
import {ipcMain} from 'electron';
import {autoUpdater} from 'electron-updater';
import {hasUpdate, isUpdateDownloaded, sendToRenderer, stopVPN} from './index';
import {connectToOpenVPN, connectToWireGuard} from './vpn/vpn';
import {Status} from './vpn/status';
import {PID_FILE_OPENVPN, PID_FILE_WIREGUARD} from './globals';
import settings from './settings';
import {HAS_UPDATE, IS_UPDATE_DOWNLOADED, QUIT_AND_INSTALL_UPDATE, SEND_TO_RENDERER} from '../../common/channels';

export function registerAll() {
    // called before any API call, signals to the UI the intent to connect
    ipcMain.handle('before-connect', () => {
        sendToRenderer('status-change', Status.CONNECTING);
    });

    ipcMain.handle('connect-to-wireguard', (event, args) => {
        const {id, type, splitTunneling} = args;
        return connectToWireGuard(id, type, splitTunneling);
    });

    ipcMain.handle('connect-to-openvpn', (event, args) => {
        const {id, type} = args;
        return connectToOpenVPN(id, type);
    });

    ipcMain.handle('disconnect', () => stopVPN());

    ipcMain.handle('is-vpn-alive', (event) => {
        if (fs.existsSync(PID_FILE_WIREGUARD)) {
            try {
                process.kill(Number(fs.readFileSync(PID_FILE_WIREGUARD)), 0);
                return true;
            } catch {
                fs.unlinkSync(PID_FILE_WIREGUARD);
            }
        }

        if (fs.existsSync(PID_FILE_OPENVPN)) {
            try {
                process.kill(Number(fs.readFileSync(PID_FILE_OPENVPN)), 0);
                return true;
            } catch {
                fs.unlinkSync(PID_FILE_OPENVPN);
            }
        }
        return false;
    });

    ipcMain.handle(HAS_UPDATE, () => {
        return hasUpdate;
    });

    ipcMain.handle(IS_UPDATE_DOWNLOADED, () => {
        return isUpdateDownloaded;
    });

    ipcMain.handle(QUIT_AND_INSTALL_UPDATE, () => {
        autoUpdater.quitAndInstall(false);
    });

    ipcMain.on('settings-get', (event, key, defaultValue) => {
        event.returnValue = settings.get(key, defaultValue);
    });

    ipcMain.on('settings-set', (event, key, value) => {
        settings.set(key, value);
        event.returnValue = null;
    });

    ipcMain.handle(SEND_TO_RENDERER, (event, channel, ...args) => {
        sendToRenderer(channel, ...args);
    });
}
