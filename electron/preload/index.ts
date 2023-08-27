import {isIP} from 'net';
import ping from 'ping';
import * as electron from 'electron';
import {contextBridge, ipcRenderer} from 'electron';
import {app} from '@electron/remote';
import {electronAPI} from '@electron-toolkit/preload';
import log from 'electron-log/renderer';
import {createApi, ResponseError} from '../../common/api';
import {getCurrentServer} from '../../src/utils/storageUtils';
import {Status} from '../main/vpn/status';
import type {SettingsAPI, Value} from '../main/settings';
import {INVALID_REFRESH_TOKEN, SEND_TO_RENDERER} from '../../common/channels';


ipcRenderer.on('disconnect', async () => {
    await preload.stopVPN();
});

ipcRenderer.on('reconnect-preload', () => {
    // @ts-ignore
    let currentServer = JSON.parse(localStorage.getItem('currentServer'));

    let id = currentServer.id;
    let type = currentServer.type;

    preload.startVPN(id, type).then(r => console.log(r));
});

Object.assign(console, log.functions);

const preload = {
    on(channel: string, listener: (event: electron.IpcRendererEvent, ...args: any[]) => void) {
        ipcRenderer.on(channel, listener);
    },
    removeListener(channel: string, listener: (...args: any[]) => void) {
        ipcRenderer.removeListener(channel, listener);
    },
    /**
     * Check if directory exists or program is installed and redirect to correct start function based on protocol
     *  @param id - id of the server
     *  @param type - type of the server (Primary or Secondary)
     */
    async startVPN(id: string, type: string): Promise<void | string> {
        // TODO: Check if wiresock or openvpn is installed
        try {
            if (type == 'secondary') {
                await preload.startOpenVPN(id, type);
            } else {
                await preload.startWireGuard(id, type);
            }
        } catch (e) {
            if (e instanceof ResponseError) {
                throw new Error(e.reply.code);
            }
            throw e;
        }
    },

    /** Start OpenVPN
     *  @param id - id of the server
     *  @param type - type of the server (Primary or Secondary)
     */
    async startOpenVPN(id: string, type: string) {
        await ipcRenderer.invoke('before-connect');
        await ipcRenderer.invoke('connect-to-openvpn', {id, type});
    },

    /** Start WireGuard
     *  @param id - id of the server
     *  @param type - type of the server (Primary or Secondary)
     */
    async startWireGuard(id: string, type: string) {
        await ipcRenderer.invoke('before-connect');
        const splitTunneling = JSON.parse(localStorage.getItem('settings') || '{}').splitTunneling ?? {};
        await ipcRenderer.invoke('connect-to-wireguard', {id, type, splitTunneling});
    },


    /**
     * Stop VPN by sending disconnect event to main process
     */
    async stopVPN() {
        const previousServer = getCurrentServer();
        await ipcRenderer.invoke('disconnect');
        await preload.sendDisconnect(previousServer.id, previousServer.type, previousServer.protocol, previousServer.status);
    },

    // to be called when user disconnects from a server, or after switching servers
    async sendDisconnect(id: string, type: string, protocol: string, status: Status) {
        if (status === Status.CONNECTED || status === Status.CONNECTING) {
            try {
                await api.post('/v1/servers/disconnect/' + id, {
                    'type': type,
                    'protocol': protocol
                });
            } catch (e) {
                console.error(e);
            }
        }
    },

    async isRunning() {
        return await ipcRenderer.invoke('is-vpn-alive');
    },

    isIp(ip: string) {
        return isIP(ip);
    },

    async getIcon(path: string) {
        return await app.getFileIcon(path, {size: 'large'}).then(image => {
            return image.toDataURL();
        });
    }
};

const settings: SettingsAPI = {
    get<T>(key: string, defaultValue?: T): T {
        return ipcRenderer.sendSync('settings-get', key, defaultValue);
    },
    set(key: string, value: Value) {
        return ipcRenderer.sendSync('settings-set', key, value);
    }
};

const api = createApi(settings, () => ipcRenderer.invoke(SEND_TO_RENDERER, INVALID_REFRESH_TOKEN));

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('preload', preload);
        contextBridge.exposeInMainWorld('settings', settings);
        contextBridge.exposeInMainWorld('ping', ping);
    } catch (error) {
        console.error(error);
    }
} else {
    window.electron = electronAPI;
    window.preload = preload;
    window.settings = settings;
    window.ping = ping;
}

export type Preload = typeof preload;
export type Settings = typeof settings;
export type Ping = typeof ping;
