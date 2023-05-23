import {contextBridge, ipcRenderer} from 'electron'
import {electronAPI} from '@electron-toolkit/preload'

// @ts-ignore
import ping from 'ping'
import * as fs from "fs";
import * as electron from "electron";
import {apiPost, getPrivateKey, refreshIp} from "../../src/assets/api";
import {genOpenVPN, genWireGuard} from "./configurationGenerator";
import {spawn} from "child_process";
import {isIP} from "net";
import {extractIcon} from "@inithink/exe-icon-extractor";

const appData = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
const appDataPath = appData + "/DicyVPN"
let lastTag = "";

ipcRenderer.on("disconnect", async () => {
    await api.stopVPN()
})

ipcRenderer.on("connect-preload", () => {
    // @ts-ignore
    let currentServer = JSON.parse(localStorage.getItem('currentServer'))

    let id : number = Number(currentServer.id)
    let type : string = currentServer.type

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
     * @param name
     */
    async startVPN(id: number, type: string) {
        //TODO: Check if wiresock or openvpn is installed

        await api.stopVPN()

        api.makePath();
        (type == 'secondary') ? await api.startOpenVPN(id, type) : await api.startWireGuard(id, type)
    },

    /** Make path when config is saved */
    makePath() {
        fs.mkdirSync(appDataPath + '/OpenVPN/', {recursive: true})
        fs.mkdirSync(appDataPath + '/WireGuard/', {recursive: true})
    },


    /** Start OpenVPN
     *  @param id - id of the server
     *  @param type - type of the server (Primary or Secondary)
     * */
    async startOpenVPN(id: number, type: string) {
        let con = await apiPost('/v1/servers/connect/' + id, JSON.stringify({"type": type, "protocol": "openvpn"}))
            .then((r) => r.json())

        const config = genOpenVPN(con.serverIp, con.ports.openvpn.tcp[0], 'tcp')
        fs.writeFileSync(appDataPath + '/OpenVPN/config.ovpn', config)
        fs.writeFileSync(appDataPath + '/OpenVPN/vpn-user', `${con.username}\n${con.password}`)

        let file = fs.openSync('\\\\.\\pipe\\openvpn\\service', 'r+')

        // @ts-ignore
        fs.writeSync(file, Buffer.from(appDataPath + '\\OpenVPN\\\u0000--config config.ovpn --log logs.log\u0000\u0000', 'utf-16le'))
        const buff = Buffer.alloc(1024)

        fs.readSync(file, buff, 0, 1024, null)
        // @ts-ignore
        const output = buff.toString('utf-16le')
        console.log()

        fs.writeFileSync(appDataPath + '/pid.pid', Number(output.split('\n')[1]).toString())


        api.isRunning()
    },

    /** Start WireGuard
     *  @param id - id of the server
     *  @param type - type of the server (Primary or Secondary)
     * */
    async startWireGuard(id: number, type: string) {
        const con = await apiPost('/v1/servers/connect/' + id, JSON.stringify({"type": type, "protocol": "wireguard"}))
            .then((r) => r.json())

        const conf = genWireGuard(con.serverIp, con.ports.wireguard.udp[0], getPrivateKey(), con.publicKey, con.internalIp)

        fs.writeFileSync(appDataPath + `\\wireguard.conf`, conf)

        const path = "C:\\Program Files\\WireSock VPN Client\\bin\\wiresock-client.exe";
        const args = ["run", "-config", appDataPath + `\\wireguard.conf`];

        const child = spawn(path, args);

        // @ts-ignore
        fs.writeFileSync(appDataPath + '/pid.pid', (child.pid).toString())

        await refreshIp()
    },


    /** Stop VPN by sending disconnect event to main process
     * */
    async stopVPN() {
        await ipcRenderer.send("disconnect")
    },


    /** Check if VPN is running */
    isRunning() {
        try {
            process.kill(Number(fs.readFileSync(appDataPath + '/pid.pid')), 0);
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

    getIcon(path: string) {
        return 'data:image/x-icon;base64,' + extractIcon(path, "large").toString('base64')
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
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
    // @ts-ignore (define in dts)
    window.ping = ping
}