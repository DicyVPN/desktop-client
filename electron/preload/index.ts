import * as fs from 'fs';
import {isIP} from 'net';
import ping from 'ping';
import * as electron from 'electron';
import {contextBridge, ipcRenderer} from 'electron';
import {app} from '@electron/remote';
import {electronAPI} from '@electron-toolkit/preload';
import type {ElectronAPI} from '@electron-toolkit/preload';
import {apiPost, getPrivateKey, refreshIp} from '../../src/assets/api';
import {OpenVPN} from '../main/vpn/vpn';
import {getCurrentServer} from '../../src/assets/storageUtils';
import {PID_FILE_OPENVPN, PID_FILE_WIREGUARD} from '../main/globals';


const appData = process.env.APPDATA ?? (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
const appDataPath = appData + "/DicyVPN"
let lastTag = "";

ipcRenderer.on("disconnect", async () => {
    await api.stopVPN()
})

ipcRenderer.on("connect-preload", () => {
    // @ts-ignore
    let currentServer = JSON.parse(localStorage.getItem('currentServer'))

    let id: number = Number(currentServer.id)
    let type: string = currentServer.type

    api.startVPN(id, type).then(r => console.log(r))
})


const api = {
    saveTag(tag: string) {
        lastTag = tag;
    },


    /**
     * Check if directory exists or program is installed and redirect to correct start function based on protocol
     *  @param id - id of the server
     *  @param type - type of the server (Primary or Secondary)
     */
    async startVPN(id: number, type: string) {
        //TODO: Check if wiresock or openvpn is installed

        await api.stopVPN();

        (type == 'secondary') ? await api.startOpenVPN(id, type) : await api.startWireGuard(id, type);
    },

    /** Start OpenVPN
     *  @param id - id of the server
     *  @param type - type of the server (Primary or Secondary)
     */
    async startOpenVPN(id: number, type: string) {
        let con = await apiPost('/v1/servers/connect/' + id, JSON.stringify({'type': type, 'protocol': 'openvpn'}))
            .then((r) => r.json());

        const openvpn = new OpenVPN(
            con.serverIp, con.ports.openvpn.tcp[0], 'tcp',
            con.username, con.password
        );

        await openvpn.start();

        api.isRunning();
    },

    /** Start WireGuard
     *  @param id - id of the server
     *  @param type - type of the server (Primary or Secondary)
     */
    async startWireGuard(id: number, type: string) {
        const con = await apiPost('/v1/servers/connect/' + id, JSON.stringify({"type": type, "protocol": "wireguard"}))
            .then((r) => r.json())

        const splitTunneling = JSON.parse(localStorage.getItem("settings") || "{}").splitTunneling ?? {};
        const ips = splitTunneling.ipList ?? [];
        const isIpsAllowlist = splitTunneling.authorization === "allow";
        const apps = (splitTunneling.appList ?? []).filter((app: any) => app.enabled).map((app: any) => app.name);
        const isAppsAllowlist = splitTunneling.authorization === "allow";

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

        await refreshIp()
    },


    /**
     * Stop VPN by sending disconnect event to main process
     */
    async stopVPN() {
        const currentServer = getCurrentServer();
        await ipcRenderer.invoke('disconnect');
        if (currentServer.connected) {
            try {
                await apiPost('/v1/servers/disconnect/' + currentServer.id, JSON.stringify({
                    'type': currentServer.type,
                    'protocol': currentServer.protocol
                }));
            } catch (e) {
                console.error(e);
            }
        }
    },


    /** Check if VPN is running */
    isRunning() {
        return api.isWireGuardRunning() || api.isOpenVPNRunning();
    },
    isWireGuardRunning() {
        try {
            process.kill(Number(fs.readFileSync(PID_FILE_WIREGUARD)), 0);
            return true;
        } catch {
            return false;
        }
    },
    isOpenVPNRunning() {
        try {
            process.kill(Number(fs.readFileSync(PID_FILE_OPENVPN)), 0);
            return true;
        } catch {
            return false;
        }
    },

    externalLink(url: string) {
        electron.shell.openExternal(url).then(r => console.debug(r))
    },

    isIp(ip: string) {
        return isIP(ip)
    },

    async getIcon(path: string) {
        return await app.getFileIcon(path, {size: "large"}).then(image => {
            return image.toDataURL()
        });
    }
}

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
        contextBridge.exposeInMainWorld('ping', ping)
    } catch (error) {
        console.error(error)
    }
} else {
    window.electron = electronAPI
    window.api = api
    window.ping = ping
}

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        electron: ElectronAPI
        api: typeof api
        ping: typeof ping
    }
}
