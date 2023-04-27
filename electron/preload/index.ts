import {contextBridge, ipcRenderer} from 'electron'
import {electronAPI} from '@electron-toolkit/preload'

// @ts-ignore
import ping from 'ping'
import {getChild} from "./childProcess";
import * as fs from "fs";
import * as electron from "electron";
import {apiPost} from "../../src/assets/api";
import {gen} from "./configurationGenerator";


const appData = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
const appDataPath = appData + "/DicyVPN"
let lastTag = "";

ipcRenderer.on("disconnect-preload", () => {
    api.stopVPN().then();
})

ipcRenderer.on("connect-preload", () => {
    //api.startVPN(lastTag).then()
    console.log(lastTag)
})


const api = {
    saveTag(tag: string) {
        lastTag = tag;
    },


    /**
     * Check if directory exists or program is installed and redirect to correct start function based on protocol
     *  @param id - id of the server
     *  @param type - type of the server (Primary or Secondary)
     *  @param protocol - protocol of the server (openvpn or wireguard)
     */
    async startVPN(id: number, type: string, protocol: string) {
        //TODO: Check if wiresock or openvpn is installed

        await api.stopVPN()

        api.makePath();
        (protocol == 'openvpn') ? await api.startOpenVPN(id, type) : api.startWireGuard(id, type)
    },

    /** Make path when config is saved */
    makePath() {
        fs.mkdirSync(appDataPath + '/OpenVPN/', {recursive: true})
        fs.mkdirSync(appDataPath + '/WireGuard/', {recursive: true})
    },


    async startOpenVPN(id: number, type: string) {
        let con = await apiPost('/v1/servers/connect/' + id, JSON.stringify({"type": type, "protocol": "openvpn"}))
            .then((r) => r.json()).catch((e) => {
                console.error(e);
            })

        const config = gen(con.serverIp, con.ports.tcp[0], 'tcp')
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
        //process.kill(4268)


        //setChild(spawn("C:\\Program Files\\OpenVPN\\bin\\openvpn.exe", ["--config", "config.ovpn"], {cwd: appDataPath + '/OpenVPN/'}))
        //getChild()?.stdout.on('data', (data) => {
        //   console.log(data.toString())
        //})
    },


    stopVPN() {
        if(!fs.existsSync(appDataPath + '/pid.pid')) return;

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
                ipcRenderer.send('disconnection');
                if ((count += 100) > 10000) {
                    reject(new Error("Timeout process kill"))
                }
            }, 100)
        })
    },

    isChildAlive() {
        return getChild() != null;
    },


    externalLink(url: string) {
        electron.shell.openExternal(url).then(r => console.debug(r))
    },
    startWireGuard(id: number, type: string) {

    }
}

// Use `contextBridge` APIs to expose Electron APIs to`
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
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