import {contextBridge} from 'electron'
import {electronAPI} from '@electron-toolkit/preload'

// @ts-ignore
import ping from 'ping'
import {exec, spawn} from "child_process";
import * as fs from "fs";

// Custom APIs for renderer
const api = {
    startVPN() {
        const path = "C:\\Program Files\\WireSock VPN Client\\bin\\wiresock-client.exe";
        const args = ["run", "-config", "test.conf"];

        this.checkInstallation(path);

            let child = spawn(path, args);

            child.stdout.on('data', (data) => {
                console.log(`child stdout:\n${data}`);
            });

            child.stderr.on('data', (data) => {
                console.error(`child stderr:\n${data}`);
            });


            setTimeout(() => {
                console.log(child.kill('SIGINT'))
            }, 10000)
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
    }
}

// Use `contextBridge` APIs to expose Electron APIs to
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