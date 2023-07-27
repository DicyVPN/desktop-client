import {isIP} from 'net';
import ping from 'ping';
import * as electron from 'electron';
import {contextBridge, ipcRenderer} from 'electron';
import {app} from '@electron/remote';
import {electronAPI} from '@electron-toolkit/preload';
import {apiPost, getPrivateKey, refreshIp, ResponseError} from '../../src/assets/api';
import {getCurrentServer} from '../../src/assets/storageUtils';
import {Status} from '../main/vpn/status';
import type {Value} from '../main/settings';


ipcRenderer.on('disconnect', async () => {
    await api.stopVPN();
});

ipcRenderer.on('reconnect-preload', () => {
    // @ts-ignore
    let currentServer = JSON.parse(localStorage.getItem('currentServer'));

    let id = currentServer.id;
    let type = currentServer.type;

    api.startVPN(id, type).then(r => console.log(r));
});

const api = {
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
                await api.startOpenVPN(id, type);
            } else {
                await api.startWireGuard(id, type);
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

        let con = await apiPost('/v1/servers/connect/' + id, JSON.stringify({'type': type, 'protocol': 'openvpn'}))
            .then((r) => r.json());

        await ipcRenderer.invoke('connect-to-openvpn', {
            serverIp: con.serverIp,
            port: con.ports.openvpn.tcp[0],
            protocol: 'tcp',
            username: con.username,
            password: con.password
        });
        await api.sendDisconnect(previousServer.id, previousServer.type, previousServer.protocol, previousServer.status);
        await refreshIp();
    },

    /** Start WireGuard
     *  @param id - id of the server
     *  @param type - type of the server (Primary or Secondary)
     */
    async startWireGuard(id: string, type: string) {
        const previousServer = getCurrentServer();
        await ipcRenderer.invoke('before-connect');

        const con = await apiPost('/v1/servers/connect/' + id, JSON.stringify({'type': type, 'protocol': 'wireguard'}))
            .then((r) => r.json());

        const splitTunneling = JSON.parse(localStorage.getItem('settings') || '{}').splitTunneling ?? {};
        const ips = splitTunneling.ipList ?? [];
        const isIpsAllowlist = splitTunneling.authorization === 'allow';
        const apps = (splitTunneling.appList ?? []).filter((app: any) => app.enabled).map((app: any) => app.name);
        const isAppsAllowlist = splitTunneling.authorization === 'allow';

        await ipcRenderer.invoke('connect-to-wireguard', {
            serverIp: con.serverIp,
            port: con.ports.wireguard.udp[0],
            privateKey: getPrivateKey(),
            publicKey: con.publicKey,
            internalIp: con.internalIp,
            ips: ips,
            isIpsAllowlist: isIpsAllowlist,
            apps: apps,
            isAppsAllowlist: isAppsAllowlist
        });

        await api.sendDisconnect(previousServer.id, previousServer.type, previousServer.protocol, previousServer.status);
        await refreshIp();
    },


    /**
     * Stop VPN by sending disconnect event to main process
     */
    async stopVPN() {
        const previousServer = getCurrentServer();
        await ipcRenderer.invoke('disconnect');
        await api.sendDisconnect(previousServer.id, previousServer.type, previousServer.protocol, previousServer.status);
    },

    // to be called when user disconnects from a server, or after switching servers
    async sendDisconnect(id: string, type: string, protocol: string, status: Status) {
        if (status === Status.CONNECTED || status === Status.CONNECTING) {
            try {
                await apiPost('/v1/servers/disconnect/' + id, JSON.stringify({
                    'type': type,
                    'protocol': protocol
                }));
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
    },

    settings: {
        async get(key: string, defaultValue: Value): Promise<Value> {
            return await ipcRenderer.invoke('get-setting', key, defaultValue);
        },
        async set(key: string, value: Value): Promise<void> {
            return await ipcRenderer.invoke('set-setting', key, value);
        }
    }
};

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('api', api);
        contextBridge.exposeInMainWorld('ping', ping);
    } catch (error) {
        console.error(error);
    }
} else {
    window.electron = electronAPI;
    window.api = api;
    window.ping = ping;
}

export type API = typeof api;
export type Ping = typeof ping;
