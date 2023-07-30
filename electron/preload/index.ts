import {isIP} from 'net';
import ping from 'ping';
import * as electron from 'electron';
import {contextBridge, ipcRenderer} from 'electron';
import {app} from '@electron/remote';
import {electronAPI} from '@electron-toolkit/preload';
import {createApi, refreshIp, ResponseError} from '../../src//utils/api';
import {getCurrentServer} from '../../src/utils/storageUtils';
import {Status} from '../main/vpn/status';
import type {SettingsAPI, Value} from '../main/settings';


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
        const previousServer = getCurrentServer();
        await ipcRenderer.invoke('before-connect');

        let con = await api.post<any>('/v1/servers/connect/' + id, {'type': type, 'protocol': 'openvpn'});

        await ipcRenderer.invoke('connect-to-openvpn', {
            serverIp: con.serverIp,
            port: con.ports.openvpn.tcp[0],
            protocol: 'tcp',
            username: con.username,
            password: con.password
        });
        await preload.sendDisconnect(previousServer.id, previousServer.type, previousServer.protocol, previousServer.status);
        await refreshIp();
    },

    /** Start WireGuard
     *  @param id - id of the server
     *  @param type - type of the server (Primary or Secondary)
     */
    async startWireGuard(id: string, type: string) {
        const previousServer = getCurrentServer();
        await ipcRenderer.invoke('before-connect');

        const con = await api.post<any>('/v1/servers/connect/' + id, {'type': type, 'protocol': 'wireguard'});

        const splitTunneling = JSON.parse(localStorage.getItem('settings') || '{}').splitTunneling ?? {};
        const ips = splitTunneling.ipList ?? [];
        const isIpsAllowlist = splitTunneling.authorization === 'allow';
        const apps = (splitTunneling.appList ?? []).filter((app: any) => app.enabled).map((app: any) => app.name);
        const isAppsAllowlist = splitTunneling.authorization === 'allow';

        await ipcRenderer.invoke('connect-to-wireguard', {
            serverIp: con.serverIp,
            port: con.ports.wireguard.udp[0],
            privateKey: api.getPrivateKey(),
            publicKey: con.publicKey,
            internalIp: con.internalIp,
            ips: ips,
            isIpsAllowlist: isIpsAllowlist,
            apps: apps,
            isAppsAllowlist: isAppsAllowlist
        });

        await preload.sendDisconnect(previousServer.id, previousServer.type, previousServer.protocol, previousServer.status);
        await refreshIp();
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

const api = createApi(settings);

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
