import {contextBridge} from 'electron'
import {electronAPI} from '@electron-toolkit/preload'

// @ts-ignore
import ping from 'ping'
import {exec, spawn} from "child_process";
import * as fs from "fs";
import * as electron from "electron";
import ipcRenderer = Electron.ipcRenderer;

let appDataPath = "";


const api = {
    async startVPN(configTag: string) {
        //this.checkInstallation(appDataPath);
        await makeConfig(configTag).then(() => {
            const path = "C:\\Program Files\\WireSock VPN Client\\bin\\wiresock-client.exe";
            const args = ["run", "-config", appDataPath + "/vpn.conf"];

            let child = spawn(path, args);

            child.stdout.on('data', (data) => {
                console.log(`child stdout:\n${data}`);
            });

            child.stderr.on('data', (data) => {
                console.error(`child stderr:\n${data}`);
            });
            //setTimeout(() => {
            //    console.log(child.kill('SIGINT'))
            //}, 20000)
        })
    },

    checkInstallation(path: string) {
        fs.access(path, fs.constants.F_OK, (err) => {
            if (err) {
                console.error(err)
                this.installWiresock()
            }else {
                return;
            }
        });
    },

    installWiresock() {
        const path = "@/assets/wiresock.msi"
        const command = `msiexec /i ${path} /quiet /qn /norestart /log winsocklogs.log`


        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    },
}

const makeConfig = async (configTag: string) => {


    const endpoint = 'https://api.dicyvpn.com/beta/getWireGuardConfig/' + configTag;
    const appData = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
    appDataPath = appData + "/DicyVPN"

    let data = await fetch(endpoint, {method: 'GET'}).then(response => response.json());


    //Make conf file
    fs.mkdirSync(appDataPath, {recursive: true})
    fs.writeFileSync(appDataPath + "/vpn.conf", data.configString)
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